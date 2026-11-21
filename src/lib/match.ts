import type { Language, MoodCheckin, TrafficState } from '../types/liber.ts';

export interface MatchOutcome {
  headline: Record<Language, string>;
  message: Record<Language, string>;
  emoji: string;
  suggestedActivity: Record<Language, string>;
  sharedAffectionPrefs: string[];
  toneClass: string;
}

const PAIR_KEY = (a: TrafficState, b: TrafficState): string => {
  const sorted = [a, b].sort();
  return `${sorted[0]}__${sorted[1]}`;
};

const MATCH_COPY: Record<
  string,
  {
    emoji: string;
    headline: Record<Language, string>;
    message: Record<Language, string>;
    suggestedActivity: Record<Language, string>;
    toneClass: string;
  }
> = {
  LIBER__LIBER: {
    emoji: '❤️‍🔥',
    headline: {
      es: '¡Hay química en el aire! ❤️',
      'pt-BR': 'Tem química no ar! ❤️',
    },
    message: {
      es: 'Ambos están en LIBER. Conversen, disfruten el momento y decidan juntos qué les provoca.',
      'pt-BR': 'Os dois estão em LIBER. Conversem, curtam o momento e decidam juntos o que querem fazer.',
    },
    suggestedActivity: {
      es: 'Pongan música suave, acérquense sin prisas y disfruten su complicidad.',
      'pt-BR': 'Coloquem uma música suave, cheguem perto sem pressa e aproveitem a sintonia.',
    },
    toneClass: 'from-emerald-50 to-teal-50 border-emerald-200',
  },
  CASI_LIBER__LIBER: {
    emoji: '😉',
    headline: {
      es: '¡Uno está inspirado y el otro está pensando! 😉',
      'pt-BR': 'Um está inspirado e o outro está pensando! 😉',
    },
    message: {
      es: 'Sin apuros ni presiones: empiecen con mimos, conversación bonita y dejen que el ambiente fluya.',
      'pt-BR': 'Sem pressa nem pressão: comecem com carinho, conversa gostosa e deixem o clima fluir.',
    },
    suggestedActivity: {
      es: 'Un masaje relajante o abrazos largos sin expectativas.',
      'pt-BR': 'Uma massagem relaxante ou abraços demorados sem expectativas.',
    },
    toneClass: 'from-amber-50 to-emerald-50 border-amber-200',
  },
  ANTI_LIBER__LIBER: {
    emoji: '🧸',
    headline: {
      es: '¡Uno está romántico y el otro quiere almohada! 😂',
      'pt-BR': 'Um está romântico e o outro quer travesseiro! 😂',
    },
    message: {
      es: 'Hoy toca respetar el descanso con mucho cariño. No es rechazo, ¡es cuidar la batería del equipo!',
      'pt-BR': 'Hoje é dia de respeitar o descanso com muito carinho. Não é rejeição, é cuidar da bateria do time!',
    },
    suggestedActivity: {
      es: 'Abrazos suaves, una serie tranquila o preparar un té calentito.',
      'pt-BR': 'Abraços suaves, uma série tranquila ou preparar um chazinho quente.',
    },
    toneClass: 'from-rose-50 to-amber-50 border-rose-200',
  },
  CASI_LIBER__CASI_LIBER: {
    emoji: '✨',
    headline: {
      es: '¡Los dos están en modo "tal vez"! 💛',
      'pt-BR': 'Os dois estão no modo "talvez"! 💛',
    },
    message: {
      es: 'Doble luz amarilla: el momento perfecto para coquetear despacio, reírse y ver qué les provoca.',
      'pt-BR': 'Luz amarela dupla: o momento perfeito para flertar devagar, rir e ver o que dá vontade.',
    },
    suggestedActivity: {
      es: 'Jueguen una ronda de Ruleta Romántica o bailen lento en la sala.',
      'pt-BR': 'Joguem uma rodada da Roleta Romântica ou dancem coladinhos na sala.',
    },
    toneClass: 'from-amber-50 to-orange-50 border-amber-200',
  },
  ANTI_LIBER__CASI_LIBER: {
    emoji: '🫂',
    headline: {
      es: '¡Modo ternura y calma activado! 🫂',
      'pt-BR': 'Modo ternura e calma ativado! 🫂',
    },
    message: {
      es: 'Uno prefiere descansar y el otro está tranquilo. ¡Combo perfecto para apapachos sin presión!',
      'pt-BR': 'Um prefere descansar e o outro está tranquilo. Combo perfeito para cafuné sem pressão!',
    },
    suggestedActivity: {
      es: 'Película bajo la manta y cero obligaciones.',
      'pt-BR': 'Filme debaixo do cobertor e zero obrigações.',
    },
    toneClass: 'from-rose-50 to-purple-50 border-rose-200',
  },
  ANTI_LIBER__ANTI_LIBER: {
    emoji: '🐻',
    headline: {
      es: '¡Modo ositos dormilones activado! 🐻',
      'pt-BR': 'Modo ursinhos sonolentos ativado! 🐻',
    },
    message: {
      es: 'Coincidencia total en descanso y mimos suaves. ¡A recargar pilas abrazados!',
      'pt-BR': 'Sintonia total em descanso e carinho leve. Hora de recarregar as baterias abraçados!',
    },
    suggestedActivity: {
      es: 'Pijama cómodo, buena almohada y un besito de buenas noches.',
      'pt-BR': 'Pijama confortável, bom travesseiro e um beijinho de boa noite.',
    },
    toneClass: 'from-purple-50 to-rose-50 border-purple-200',
  },
};

/**
 * Computes a warm, zero-pressure compatibility dashboard outcome
 * using ONLY voluntarily shared partner check-in data.
 */
export function computeCoupleMatch(
  myCheckin: MoodCheckin | null,
  partnerCheckin: MoodCheckin | null
): MatchOutcome | null {
  if (!myCheckin || !partnerCheckin) return null;
  if (!myCheckin.shareMoodState || !partnerCheckin.shareMoodState) return null;

  const key = PAIR_KEY(myCheckin.finalState, partnerCheckin.finalState);
  const template = MATCH_COPY[key] ?? MATCH_COPY.CASI_LIBER__CASI_LIBER;

  const myPrefs = myCheckin.shareAffectionPrefs ? myCheckin.affectionPrefs : [];
  const partnerPrefs = partnerCheckin.shareAffectionPrefs ? partnerCheckin.affectionPrefs : [];
  const overlap = myPrefs.filter((p) => partnerPrefs.includes(p));
  const union = Array.from(new Set([...overlap, ...myPrefs, ...partnerPrefs])).slice(0, 4);

  return {
    ...template,
    sharedAffectionPrefs: union,
  };
}
