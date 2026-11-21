import type { BoundaryLock, QuizAnswerRecord, ScoringResult, TrafficState } from '../types/liber.ts';

/**
 * Maps a numeric self-reported score (0–100) to the playful Traffic Light state.
 * Note: These thresholds are non-clinical game mechanics, not scientific predictions.
 */
export function scoreToTrafficState(score: number): TrafficState {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  if (clamped >= 70) return 'LIBER';
  if (clamped >= 40) return 'CASI_LIBER';
  return 'ANTI_LIBER';
}

/**
 * Evaluates a set of quiz answers with strict consent & boundary guardrails:
 * - An explicit "No" / "Not now" (`isBoundaryNo`) locks the computed state to ANTI_LIBER.
 * - An explicit "I'm unsure" (`isUnsure`) on the direct preference or without a clear "yes" caps the state at CASI_LIBER.
 * - A high numeric score can NEVER override an explicit "No", "Not now", or "I'm unsure".
 * - The user can always manually override their final state.
 */
export function evaluateQuizAnswers(
  answers: QuizAnswerRecord[],
  manualState?: TrafficState | null
): ScoringResult {
  if (answers.length === 0) {
    const fallback = manualState ?? 'CASI_LIBER';
    return {
      score: 50,
      computedState: 'CASI_LIBER',
      finalState: fallback,
      boundaryLock: 'NONE',
      manualOverride: Boolean(manualState),
      affectionTags: [],
    };
  }

  const totalPoints = answers.reduce((sum, item) => sum + item.points, 0);
  const score = Math.max(0, Math.min(100, Math.round(totalPoints / answers.length)));

  const hasExplicitNo = answers.some((a) => a.isBoundaryNo);
  const directAnswer = answers.find((a) => a.questionId === 'direct_final');
  const hasUnsureDirect = Boolean(directAnswer?.isUnsure);
  const hasAnyUnsure = answers.some((a) => a.isUnsure);

  let boundaryLock: BoundaryLock = 'NONE';
  let computedState = scoreToTrafficState(score);

  if (hasExplicitNo) {
    boundaryLock = 'NO_LOCK';
    computedState = 'ANTI_LIBER';
  } else if (hasUnsureDirect || (hasAnyUnsure && !directAnswer)) {
    boundaryLock = 'UNSURE_CAP';
    if (computedState === 'LIBER') {
      computedState = 'CASI_LIBER';
    }
  }

  const finalState = manualState ?? computedState;
  const affectionTags = Array.from(
    new Set(answers.map((a) => a.affectionTag).filter((t): t is string => Boolean(t)))
  );

  return {
    score,
    computedState,
    finalState,
    boundaryLock,
    manualOverride: Boolean(manualState && manualState !== computedState),
    affectionTags,
  };
}
