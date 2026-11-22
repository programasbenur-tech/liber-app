import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { evaluateQuizAnswers, scoreToTrafficState } from '../scoring.ts';
import { computeCoupleMatch } from '../match.ts';
import { QUESTION_BANK } from '../../data/questions.ts';
import { MYSTERY_QUESTIONS } from '../../data/mysteryQuestions.ts';
import { FIDELITY_QUESTIONS } from '../../data/fidelityQuestions.ts';
import {
  evaluateTrustLabAnswers,
  scoreToTrustProfile,
  TRUST_DIMENSIONS_ORDER,
} from '../fidelityScoring.ts';
import {
  canCoupleChat,
  computePartnerPresence,
  normalizeRoomMessages,
  sanitizeSharedCheckin,
} from '../roomPresence.ts';
import {
  arePaymentsEnabled,
  getCurrencyForCountry,
  mercadoPagoProvider,
  verifyMercadoPagoWebhookSignature,
} from '../payments/mercadopago.ts';
import { DEFAULT_PLANS } from '../payments/types.ts';
import type { MoodCheckin } from '../../types/liber.ts';
import {
  REPAIR_CATEGORY_META,
  REPAIR_PHRASES,
  buildSoftenedStartupMessage,
} from '../../data/repairBridge.ts';
import { DAILY_PROMPTS, getDailyPromptForDate } from '../../data/dailyPrompts.ts';
import { evaluateDailyUnlock } from '../dailyPromptLogic.ts';

test('Question bank has at least 60 questions across all 8 categories', () => {
  assert.ok(QUESTION_BANK.length >= 60, `Expected >= 60 questions, got ${QUESTION_BANK.length}`);
  const categories = new Set(QUESTION_BANK.map((q) => q.category));
  assert.equal(categories.size, 8);
});

test('Score thresholds map accurately to ANTI_LIBER, CASI_LIBER, LIBER', () => {
  assert.equal(scoreToTrafficState(0), 'ANTI_LIBER');
  assert.equal(scoreToTrafficState(39), 'ANTI_LIBER');
  assert.equal(scoreToTrafficState(40), 'CASI_LIBER');
  assert.equal(scoreToTrafficState(69), 'CASI_LIBER');
  assert.equal(scoreToTrafficState(70), 'LIBER');
  assert.equal(scoreToTrafficState(100), 'LIBER');
});

test('High score NEVER overrides explicit "No" / "Not now" boundary lock', () => {
  const result = evaluateQuizAnswers([
    { questionId: 'rm_1', optionId: 'rm_1_a', points: 95 },
    { questionId: 'pa_1', optionId: 'pa_1_a', points: 95 },
    { questionId: 'pf_1', optionId: 'pf_1_a', points: 95 },
    { questionId: 'direct_final', optionId: 'df_no', points: 10, isBoundaryNo: true },
  ]);

  assert.ok(result.score >= 70, 'Average score is >= 70');
  assert.equal(result.boundaryLock, 'NO_LOCK');
  assert.equal(result.computedState, 'ANTI_LIBER');
  assert.equal(result.finalState, 'ANTI_LIBER');
});

test('High score NEVER overrides explicit "Unsure" on direct preference', () => {
  const result = evaluateQuizAnswers([
    { questionId: 'rm_1', optionId: 'rm_1_a', points: 95 },
    { questionId: 'pa_1', optionId: 'pa_1_a', points: 95 },
    { questionId: 'direct_final', optionId: 'df_maybe', points: 55, isUnsure: true },
  ]);

  assert.ok(result.score >= 70);
  assert.equal(result.boundaryLock, 'UNSURE_CAP');
  assert.equal(result.computedState, 'CASI_LIBER');
  assert.equal(result.finalState, 'CASI_LIBER');
});

test('Manual override updates finalState while preserving computedState', () => {
  const result = evaluateQuizAnswers(
    [{ questionId: 'rm_1', optionId: 'rm_1_b', points: 65 }],
    'LIBER'
  );
  assert.equal(result.computedState, 'CASI_LIBER');
  assert.equal(result.finalState, 'LIBER');
  assert.equal(result.manualOverride, true);
});

test('Couple Match Mode respects privacy and returns zero-pressure messaging', () => {
  const baseCheckin: MoodCheckin = {
    id: '1',
    userId: 'u1',
    score: 85,
    computedState: 'LIBER',
    finalState: 'LIBER',
    manualOverride: false,
    boundaryLock: 'NONE',
    shareMoodState: true,
    shareAffectionPrefs: true,
    shareEnergyLevel: false,
    affectionPrefs: ['cuddles', 'kisses'],
    createdAt: new Date().toISOString(),
  };

  const partnerPrivate: MoodCheckin = {
    ...baseCheckin,
    id: '2',
    userId: 'u2',
    finalState: 'ANTI_LIBER',
    shareMoodState: false,
  };

  // Must not compute match if partner did not share mood state
  assert.equal(computeCoupleMatch(baseCheckin, partnerPrivate), null);

  // When partner shares ANTI_LIBER, match celebrates rest without rejection
  const partnerShared: MoodCheckin = { ...partnerPrivate, shareMoodState: true };
  const outcome = computeCoupleMatch(baseCheckin, partnerShared);
  assert.ok(outcome !== null);
  assert.match(outcome.headline.es, /almohada/i);
});

test('Mercado Pago BR/UY currency mapping and disabled-by-default payment guard', async () => {
  assert.equal(getCurrencyForCountry('BR'), 'BRL');
  assert.equal(getCurrencyForCountry('UY'), 'UYU');
  assert.equal(arePaymentsEnabled(), false);

  const premiumPlan = DEFAULT_PLANS.find((p) => p.code === 'PREMIUM')!;
  const res = await mercadoPagoProvider.createCheckout(
    { planCode: 'PREMIUM', country: 'BR', userId: 'u1', language: 'pt-BR' },
    premiumPlan
  );
  assert.equal(res.ok, false);
  assert.equal(res.requiresConfiguration, true);
  assert.equal(res.currency, 'BRL');
});

test('Mercado Pago webhook HMAC-SHA256 signature verification rejects invalid and accepts valid', () => {
  const secret = 'test_webhook_secret';
  const dataId = '123456789';
  const requestId = 'req-abc';
  const ts = '1700000000';
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const v1 = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

  assert.equal(
    verifyMercadoPagoWebhookSignature({
      xSignature: `ts=${ts},v1=${v1}`,
      xRequestId: requestId,
      dataId,
      secret,
    }),
    true
  );

  assert.equal(
    verifyMercadoPagoWebhookSignature({
      xSignature: `ts=${ts},v1=tampered_signature`,
      xRequestId: requestId,
      dataId,
      secret,
    }),
    false
  );
});

test('Competition mode is disabled by default', () => {
  assert.notEqual(process.env.NEXT_PUBLIC_ENABLE_COUPLE_COMPETITIONS, 'true');
});

test('Mystery mode has 16 indirect bilingual questions without blunt intimacy terms and enforces consent locks', () => {
  assert.equal(MYSTERY_QUESTIONS.length, 16);
  const bluntRegex = /\b(sexo|sexual|intimidad|íntimo|intimidade)\b/i;

  for (const q of MYSTERY_QUESTIONS) {
    assert.equal(q.options.length, 4);
    assert.equal(bluntRegex.test(q.prompt.es), false, `Blunt word found in ${q.id} es`);
    assert.equal(bluntRegex.test(q.prompt['pt-BR']), false, `Blunt word found in ${q.id} pt-BR`);
  }

  const boundaryRes = evaluateQuizAnswers([
    { questionId: 'my_1', optionId: 'my_1_a', points: 94 },
    { questionId: 'my_2', optionId: 'my_2_d', points: 16, isBoundaryNo: true },
  ]);
  assert.equal(boundaryRes.boundaryLock, 'NO_LOCK');
  assert.equal(boundaryRes.computedState, 'ANTI_LIBER');

  const unsureRes = evaluateQuizAnswers([
    { questionId: 'my_1', optionId: 'my_1_a', points: 94 },
    { questionId: 'my_4', optionId: 'my_4_a', points: 95 },
    { questionId: 'my_8', optionId: 'my_8_c', points: 50, isUnsure: true },
  ]);
  assert.equal(unsureRes.boundaryLock, 'UNSURE_CAP');
  assert.equal(unsureRes.computedState, 'CASI_LIBER');
});

test('Fidelity & Trust Lab has 16 bilingual questions (4 per dimension) with scientific notes', () => {
  assert.equal(FIDELITY_QUESTIONS.length, 16);
  for (const dim of TRUST_DIMENSIONS_ORDER) {
    const dimQs = FIDELITY_QUESTIONS.filter((q) => q.dimension === dim);
    assert.equal(dimQs.length, 4, `Expected 4 questions for dimension ${dim}`);
  }
  for (const q of FIDELITY_QUESTIONS) {
    assert.equal(q.options.length, 4);
    assert.ok(q.scientificNote.es.length > 20);
    assert.ok(q.scientificNote['pt-BR'].length > 20);
    assert.ok(q.frameworkRef.es.length > 5);
  }
});

test('Trust Lab profile thresholds map accurately', () => {
  assert.equal(scoreToTrustProfile(0), 'ALERTA_CONVERSACION');
  assert.equal(scoreToTrustProfile(44), 'ALERTA_CONVERSACION');
  assert.equal(scoreToTrustProfile(45), 'ATENCION');
  assert.equal(scoreToTrustProfile(74), 'ATENCION');
  assert.equal(scoreToTrustProfile(75), 'FORTALEZA');
  assert.equal(scoreToTrustProfile(100), 'FORTALEZA');
});

test('evaluateTrustLabAnswers computes accurate per-dimension scores, strongest and focus dimensions', () => {
  const result = evaluateTrustLabAnswers([
    { questionId: 'tr_1', dimension: 'walls_windows', optionId: 'tr_1_a', points: 95 },
    { questionId: 'tr_5', dimension: 'investment_commitment', optionId: 'tr_5_b', points: 70 },
    { questionId: 'tr_9', dimension: 'attunement_repair', optionId: 'tr_9_a', points: 95 },
    { questionId: 'tr_13', dimension: 'clear_agreements', optionId: 'tr_13_d', points: 15 },
  ]);

  assert.equal(result.dimensions.length, 4);
  assert.equal(result.overallScore, 69);
  assert.equal(result.profile, 'ATENCION');
  assert.equal(result.focusDimension, 'clear_agreements');
  assert.ok(
    result.strongestDimension === 'walls_windows' ||
      result.strongestDimension === 'attunement_repair'
  );
});

test('computePartnerPresence accurately classifies waiting, online, and recent heartbeats', () => {
  const now = 1_700_000_000_000;
  assert.equal(computePartnerPresence(null, now), 'waiting');
  assert.equal(computePartnerPresence(undefined, now), 'waiting');
  assert.equal(computePartnerPresence(now - 5_000, now), 'online');
  assert.equal(computePartnerPresence(now - 15_000, now), 'online');
  assert.equal(computePartnerPresence(now - 15_001, now), 'recent');
});

test('canCoupleChat enforces mutual voluntary opt-in and connection requirement', () => {
  assert.equal(
    canCoupleChat({ myChatEnabled: true, partnerChatEnabled: true, partnerStatus: 'waiting' }),
    false
  );
  assert.equal(
    canCoupleChat({ myChatEnabled: false, partnerChatEnabled: true, partnerStatus: 'online' }),
    false
  );
  assert.equal(
    canCoupleChat({ myChatEnabled: true, partnerChatEnabled: false, partnerStatus: 'online' }),
    false
  );
  assert.equal(
    canCoupleChat({ myChatEnabled: true, partnerChatEnabled: true, partnerStatus: 'online' }),
    true
  );
  assert.equal(
    canCoupleChat({ myChatEnabled: true, partnerChatEnabled: false, partnerStatus: 'simulated' }),
    true
  );
});

test('normalizeRoomMessages sorts chronologically and sets isFromMe accurately via senderSlotId', () => {
  const normalized = normalizeRoomMessages(
    [
      {
        id: 'm2',
        senderSlotId: 'slot_partner',
        senderName: 'Ana',
        emoji: '💖',
        text: 'Segundo mensaje',
        createdAt: '2026-11-22T12:05:00.000Z',
        isFromMe: false,
      },
      {
        id: 'm1',
        senderSlotId: 'slot_me',
        senderName: 'Juan',
        emoji: '🫂',
        text: 'Primer mensaje',
        createdAt: '2026-11-22T12:00:00.000Z',
        isFromMe: false,
      },
    ],
    'slot_me'
  );

  assert.equal(normalized[0].id, 'm1');
  assert.equal(normalized[0].isFromMe, true);
  assert.equal(normalized[1].id, 'm2');
  assert.equal(normalized[1].isFromMe, false);
});

test('sanitizeSharedCheckin enforces mood and affection sharing permissions', () => {
  const base: MoodCheckin = {
    id: 'c1',
    userId: 'u1',
    score: 80,
    computedState: 'LIBER',
    finalState: 'LIBER',
    manualOverride: false,
    boundaryLock: 'NONE',
    shareMoodState: false,
    shareAffectionPrefs: true,
    shareEnergyLevel: false,
    affectionPrefs: ['cuddles', 'kisses'],
    createdAt: '2026-11-22T12:00:00.000Z',
  };

  assert.equal(sanitizeSharedCheckin(null), null);
  assert.equal(sanitizeSharedCheckin(base), null);

  const moodOnly = sanitizeSharedCheckin({
    ...base,
    shareMoodState: true,
    shareAffectionPrefs: false,
  });
  assert.ok(moodOnly !== null);
  assert.deepEqual(moodOnly.affectionPrefs, []);

  const fullShared = sanitizeSharedCheckin({
    ...base,
    shareMoodState: true,
    shareAffectionPrefs: true,
  });
  assert.deepEqual(fullShared?.affectionPrefs, ['cuddles', 'kisses']);
});

test('repairBridge exports 12 bilingual phrases evenly across 4 categories', () => {
  assert.equal(REPAIR_PHRASES.length, 12);
  const categories = Object.keys(REPAIR_CATEGORY_META);
  assert.equal(categories.length, 4);
  for (const cat of categories) {
    const count = REPAIR_PHRASES.filter((p) => p.category === cat).length;
    assert.equal(count, 3);
  }
  for (const phrase of REPAIR_PHRASES) {
    assert.ok(phrase.text.es.trim().length > 0);
    assert.ok(phrase.text['pt-BR'].trim().length > 0);
  }
});

test('buildSoftenedStartupMessage formats zero-blame I-statements in es and pt-BR', () => {
  const esMsg = buildSoftenedStartupMessage({
    feelingLabel: 'abrumado/a',
    situation: 'no pudimos hablar tranquilos ayer',
    needLabel: 'que me escuches 10 minutos sin interrumpir',
    language: 'es',
  });
  assert.ok(esMsg.startsWith('Me sentí abrumado/a cuando no pudimos hablar tranquilos ayer.'));
  assert.ok(esMsg.includes('Me ayudaría mucho que me escuches 10 minutos sin interrumpir'));

  const ptFallback = buildSoftenedStartupMessage({
    feelingLabel: 'sobrecarregado(a)',
    situation: '   ',
    needLabel: 'um abraço tranquilo para aliviar a tensão',
    language: 'pt-BR',
  });
  assert.ok(ptFallback.startsWith('Me senti sobrecarregado(a) quando aconteceu esse desencontro hoje.'));
  assert.ok(ptFallback.includes('Me ajudaria muito um abraço tranquilo para aliviar a tensão'));
});

test('DAILY_PROMPTS has 21 bilingual prompts and deterministic selection by date', () => {
  assert.equal(DAILY_PROMPTS.length, 21);
  for (const item of DAILY_PROMPTS) {
    assert.ok(item.theme.es.trim().length > 0);
    assert.ok(item.theme['pt-BR'].trim().length > 0);
    assert.ok(item.prompt.es.trim().length > 0);
    assert.ok(item.prompt['pt-BR'].trim().length > 0);
  }
  const first = getDailyPromptForDate('2026-11-22');
  const second = getDailyPromptForDate('2026-11-22');
  assert.equal(first.id, second.id);
});

test('evaluateDailyUnlock hides partner text until both partners answer', () => {
  const myEntry = {
    slotId: 'slot_a',
    senderName: 'Ana',
    answerText: 'Gracias por preparar el desayuno',
    createdAt: '2026-11-22T10:00:00Z',
  };
  const partnerEntry = {
    slotId: 'slot_b',
    senderName: 'Leo',
    answerText: 'Me dio paz caminar juntos ayer',
    createdAt: '2026-11-22T10:05:00Z',
  };

  const neither = evaluateDailyUnlock({ myAnswer: null, partnerAnswer: null });
  assert.equal(neither.status, 'neither_answered');
  assert.equal(neither.visiblePartnerAnswer, null);

  const waitingForMe = evaluateDailyUnlock({ myAnswer: null, partnerAnswer: partnerEntry });
  assert.equal(waitingForMe.status, 'waiting_for_me');
  assert.equal(waitingForMe.partnerAnswered, true);
  assert.equal(waitingForMe.visiblePartnerAnswer, null);

  const waitingForPartner = evaluateDailyUnlock({ myAnswer: myEntry, partnerAnswer: null });
  assert.equal(waitingForPartner.status, 'waiting_for_partner');
  assert.equal(waitingForPartner.partnerAnswered, false);
  assert.equal(waitingForPartner.visiblePartnerAnswer, null);

  const unlocked = evaluateDailyUnlock({ myAnswer: myEntry, partnerAnswer: partnerEntry });
  assert.equal(unlocked.status, 'unlocked');
  assert.equal(unlocked.partnerAnswered, true);
  assert.equal(unlocked.partnerName, 'Leo');
  assert.equal(unlocked.visiblePartnerAnswer, 'Me dio paz caminar juntos ayer');
});
