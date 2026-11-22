import type {
  TrustAnswerRecord,
  TrustDimension,
  TrustDimensionScore,
  TrustLabResult,
  TrustProfileCode,
} from '../types/liber.ts';

export const TRUST_DIMENSIONS_ORDER: TrustDimension[] = [
  'walls_windows',
  'investment_commitment',
  'attunement_repair',
  'clear_agreements',
];

/**
 * Maps an overall protective trust score (0-100) to a constructive, non-diagnostic profile.
 */
export function scoreToTrustProfile(score: number): TrustProfileCode {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  if (clamped >= 75) return 'FORTALEZA';
  if (clamped >= 45) return 'ATENCION';
  return 'ALERTA_CONVERSACION';
}

/**
 * Evaluates Trust & Fidelity Lab answers per dimension and overall.
 * Non-diagnostic: highlights protective strengths and one constructive focus area for dialogue.
 */
export function evaluateTrustLabAnswers(answers: TrustAnswerRecord[]): TrustLabResult {
  const dimensions: TrustDimensionScore[] = TRUST_DIMENSIONS_ORDER.map((dim) => {
    const dimAnswers = answers.filter((a) => a.dimension === dim);
    const avg =
      dimAnswers.length > 0
        ? Math.round(dimAnswers.reduce((s, a) => s + a.points, 0) / dimAnswers.length)
        : 50;
    return {
      dimension: dim,
      score: Math.max(0, Math.min(100, avg)),
      answeredCount: dimAnswers.length,
    };
  });

  const overallScore =
    answers.length > 0
      ? Math.max(
          0,
          Math.min(100, Math.round(answers.reduce((s, a) => s + a.points, 0) / answers.length))
        )
      : 50;

  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  return {
    overallScore,
    profile: scoreToTrustProfile(overallScore),
    dimensions,
    strongestDimension: sorted[0]?.dimension ?? 'walls_windows',
    focusDimension: sorted[sorted.length - 1]?.dimension ?? 'clear_agreements',
    completedAt: new Date().toISOString(),
  };
}
