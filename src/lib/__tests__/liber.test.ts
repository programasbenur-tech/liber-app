import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { evaluateQuizAnswers, scoreToTrafficState } from '../scoring.ts';
import { computeCoupleMatch } from '../match.ts';
import { QUESTION_BANK } from '../../data/questions.ts';
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
