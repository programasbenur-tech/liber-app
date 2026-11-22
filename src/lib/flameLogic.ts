import type { Language } from '../types/liber.ts';

export type FlameActionType =
  | 'spark'
  | 'repair'
  | 'daily_key'
  | 'anti_stress'
  | 'affection';

export type FlameStage = 'spark' | 'warmth' | 'hearth' | 'beacon';
export type FlameStatus = 'glowing' | 'resting';

export interface FlameEvent {
  id: string;
  slotId: string;
  senderName: string;
  actionType: FlameActionType;
  points: number;
  note?: string | null;
  createdAt: string;
}

export interface FlameSummary {
  totalPoints: number;
  stage: FlameStage;
  nextStagePoints: number | null;
  progressPercent: number;
  status: FlameStatus;
  todayCount: number;
  activeDaysLast7: number;
  lastActivityAt: string | null;
  recentEvents: FlameEvent[];
}

export const FLAME_ACTION_POINTS: Record<FlameActionType, number> = {
  spark: 1,
  affection: 1,
  repair: 2,
  daily_key: 2,
  anti_stress: 3,
};

export const FLAME_ACTION_LABELS: Record<
  FlameActionType,
  { emoji: string; label: Record<Language, string> }
> = {
  spark: {
    emoji: '✨',
    label: { es: 'Chispa de cariño', 'pt-BR': 'Faísca de carinho' },
  },
  affection: {
    emoji: '💌',
    label: { es: 'Mensaje cercano', 'pt-BR': 'Mensagem carinhosa' },
  },
  repair: {
    emoji: '🕊️',
    label: { es: 'Puente de paz', 'pt-BR': 'Ponte de paz' },
  },
  daily_key: {
    emoji: '🔑',
    label: { es: 'Doble Llave diaria', 'pt-BR': 'Chave Dupla diária' },
  },
  anti_stress: {
    emoji: '🧘',
    label: { es: 'Ritual Antiestrés', 'pt-BR': 'Ritual Antiestresse' },
  },
};

export const FLAME_STAGE_META: Record<
  FlameStage,
  {
    emoji: string;
    minPoints: number;
    nextThreshold: number | null;
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
  }
> = {
  spark: {
    emoji: '✨',
    minPoints: 0,
    nextThreshold: 5,
    title: { es: '✨ Chispa Inicial', 'pt-BR': '✨ Faísca Inicial' },
    subtitle: {
      es: 'Cada gesto suave enciende un poquito más de calma entre ambos.',
      'pt-BR': 'Cada gesto leve acende um pouco mais de calma entre vocês.',
    },
  },
  warmth: {
    emoji: '🕯️',
    minPoints: 5,
    nextThreshold: 15,
    title: { es: '🕯️ Calidez Viva', 'pt-BR': '🕯️ Calor Vivo' },
    subtitle: {
      es: 'Están construyendo pequeños rituales de cuidado sin presiones.',
      'pt-BR': 'Vocês estão criando pequenos rituais de cuidado sem pressão.',
    },
  },
  hearth: {
    emoji: '🔥',
    minPoints: 15,
    nextThreshold: 30,
    title: { es: '🔥 Hogar en Paz', 'pt-BR': '🔥 Lar em Paz' },
    subtitle: {
      es: 'Su fuego compartido refleja escucha, reparación y cariño cotidiano.',
      'pt-BR': 'A chama de vocês reflete escuta, reparação e carinho no dia a dia.',
    },
  },
  beacon: {
    emoji: '🌟',
    minPoints: 30,
    nextThreshold: null,
    title: { es: '🌟 Faro de Equipo', 'pt-BR': '🌟 Farol de Time' },
    subtitle: {
      es: 'Un refugio luminoso de equipo mutuo, respeto y cercanía diaria.',
      'pt-BR': 'Um refúgio luminoso de parceria, respeito e proximidade diária.',
    },
  },
};

export function isValidFlameAction(val: unknown): val is FlameActionType {
  return (
    val === 'spark' ||
    val === 'repair' ||
    val === 'daily_key' ||
    val === 'anti_stress' ||
    val === 'affection'
  );
}

function getStageForPoints(totalPoints: number): FlameStage {
  if (totalPoints >= 30) return 'beacon';
  if (totalPoints >= 15) return 'hearth';
  if (totalPoints >= 5) return 'warmth';
  return 'spark';
}

function getRecentUtcDaySet(nowMs: number, daysCount: number): Set<string> {
  const nowDate = new Date(nowMs);
  const utcMidnightMs = Date.UTC(
    nowDate.getUTCFullYear(),
    nowDate.getUTCMonth(),
    nowDate.getUTCDate()
  );
  const set = new Set<string>();
  for (let i = 0; i < daysCount; i += 1) {
    set.add(new Date(utcMidnightMs - i * 86_400_000).toISOString().slice(0, 10));
  }
  return set;
}

/**
 * Computes the couple's shared Flame summary without punitive streaks:
 * `totalPoints` NEVER resets to zero during rest days; status only switches
 * cleanly between `'glowing'` and `'resting'`.
 */
export function computeFlameSummary(
  events: FlameEvent[],
  nowMs: number = Date.now()
): FlameSummary {
  const sorted = [...events].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  );

  let totalPoints = 0;
  let todayCount = 0;
  const todayKey = new Date(nowMs).toISOString().slice(0, 10);
  const last7DayKeys = getRecentUtcDaySet(nowMs, 7);
  const activeLast7Set = new Set<string>();

  for (const ev of sorted) {
    totalPoints += Math.max(0, ev.points);
    const parsedMs = Date.parse(ev.createdAt);
    if (!Number.isFinite(parsedMs)) continue;
    const evDateKey = new Date(parsedMs).toISOString().slice(0, 10);
    if (evDateKey === todayKey) {
      todayCount += 1;
    }
    if (last7DayKeys.has(evDateKey)) {
      activeLast7Set.add(evDateKey);
    }
  }

  const stage = getStageForPoints(totalPoints);
  const meta = FLAME_STAGE_META[stage];
  const nextStagePoints = meta.nextThreshold;

  let progressPercent = 100;
  if (nextStagePoints !== null) {
    const span = Math.max(1, nextStagePoints - meta.minPoints);
    progressPercent = Math.max(
      0,
      Math.min(100, Math.round(((totalPoints - meta.minPoints) / span) * 100))
    );
  }

  return {
    totalPoints,
    stage,
    nextStagePoints,
    progressPercent,
    status: todayCount > 0 ? 'glowing' : 'resting',
    todayCount,
    activeDaysLast7: activeLast7Set.size,
    lastActivityAt: sorted[0]?.createdAt ?? null,
    recentEvents: sorted.slice(0, 5),
  };
}
