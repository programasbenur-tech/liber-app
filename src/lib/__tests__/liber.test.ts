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
  arePaymentsEnabled,
  getCurrencyForCountry,
  mercadoPagoProvider,
  verifyMercadoPagoWebhookSignature,
} from '../payments/mercadopago.ts';
import { DEFAULT_PLANS } from '../payments/types.ts';
import type { MoodCheckin } from '../../types/liber.ts';

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
