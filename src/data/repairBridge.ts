import type { Language } from '../types/liber.ts';

export type RepairCategory =
  | 'pause_calm'
  | 'soften_listen'
  | 'team_bridge'
  | 'warm_apology';

export interface RepairPhrase {
  id: string;
  category: RepairCategory;
  emoji: string;
  text: Record<Language, string>;
}

export const REPAIR_CATEGORY_META: Record<
  RepairCategory,
  { emoji: string; label: Record<Language, string> }
> = {
  pause_calm: {
    emoji: '🌊',
    label: { es: 'Pausa y Calma', 'pt-BR': 'Pausa e Calma' },
  },
  soften_listen: {
    emoji: '👂',
    label: { es: 'Bajar la Guardia', 'pt-BR': 'Baixar a Guarda' },
  },
  team_bridge: {
    emoji: '🤝',
    label: { es: 'Modo Equipo', 'pt-BR': 'Modo Time' },
  },
  warm_apology: {
    emoji: '🕊️',
    label: { es: 'Perdón y Cercanía', 'pt-BR': 'Perdão e Aproximação' },
  },
};

export const REPAIR_PHRASES: RepairPhrase[] = [
  // pause_calm (3)
  {
    id: 'rep_1',
    category: 'pause_calm',
    emoji: '🌊',
    text: {
      es: 'Necesito 20 minutos para calmarme, pero quiero que estemos bien. Vuelvo enseguida.',
      'pt-BR': 'Preciso de 20 minutos para me acalmar, mas quero ficarmos bem. Já volto.',
    },
  },
  {
    id: 'rep_2',
    category: 'pause_calm',
    emoji: '🫁',
    text: {
      es: 'Estoy muy tensionado/a ahora; respiremos hondo antes de seguir hablando.',
      'pt-BR': 'Estou bem tenso(a) agora; vamos respirar fundo antes de continuar conversando.',
    },
  },
  {
    id: 'rep_3',
    category: 'pause_calm',
    emoji: '☕',
    text: {
      es: 'Tomemos una pausa cortita para tomar agua y retomar sin lastimarnos.',
      'pt-BR': 'Vamos fazer uma pausa curtinha para beber água e retomar sem nos machucar.',
    },
  },
  // soften_listen (3)
  {
    id: 'rep_4',
    category: 'soften_listen',
    emoji: '💛',
    text: {
      es: '¿Podemos empezar de nuevo más suave? Me importa escucharte bien.',
      'pt-BR': 'Podemos começar de novo mais devagar? Quero muito te ouvir bem.',
    },
  },
  {
    id: 'rep_5',
    category: 'soften_listen',
    emoji: '👂',
    text: {
      es: 'Ayúdame a entender tu punto de vista, de verdad quiero comprender cómo te sientes.',
      'pt-BR': 'Me ajude a entender seu ponto de vista, quero de verdade compreender como você se sente.',
    },
  },
  {
    id: 'rep_6',
    category: 'soften_listen',
    emoji: '🫶',
    text: {
      es: 'Creo que me expresé mal recién; ¿me dejas intentarlo con más cariño?',
      'pt-BR': 'Acho que me expressei mal agora há pouco; me deixa tentar com mais carinho?',
    },
  },
  // team_bridge (3)
  {
    id: 'rep_7',
    category: 'team_bridge',
    emoji: '🤝',
    text: {
      es: 'No es tú contra mí, somos nosotros dos contra el problema.',
      'pt-BR': 'Não é você contra mim, somos nós dois contra o problema.',
    },
  },
  {
    id: 'rep_8',
    category: 'team_bridge',
    emoji: '🧭',
    text: {
      es: 'Tu bienestar y nuestra paz importan más que tener la razón hoy.',
      'pt-BR': 'Seu bem-estar e nossa paz importam mais do que ter razão hoje.',
    },
  },
  {
    id: 'rep_9',
    category: 'team_bridge',
    emoji: '🫂',
    text: {
      es: 'Estamos en el mismo equipo. ¿Nos damos un abrazo de tregua antes de seguir?',
      'pt-BR': 'Estamos no mesmo time. Vamos dar um abraço de trégua antes de seguir?',
    },
  },
  // warm_apology (3)
  {
    id: 'rep_10',
    category: 'warm_apology',
    emoji: '🕊️',
    text: {
      es: 'Lo siento por mi parte en este roce. No quiero herirte ni alejarme de ti.',
      'pt-BR': 'Sinto muito pela minha parte nesse atrito. Não quero te ferir nem me afastar de você.',
    },
  },
  {
    id: 'rep_11',
    category: 'warm_apology',
    emoji: '🌱',
    text: {
      es: 'Tienes razón en sentirte así. Gracias por tenerme paciencia mientras aprendemos.',
      'pt-BR': 'Você tem razão em se sentir assim. Obrigado(a) por ter paciência enquanto aprendemos.',
    },
  },
  {
    id: 'rep_12',
    category: 'warm_apology',
    emoji: '💖',
    text: {
      es: 'Te quiero mucho, incluso en los días difíciles. Quiero cuidar lo nuestro.',
      'pt-BR': 'Eu te amo muito, até nos dias difíceis. Quero cuidar do nosso vínculo.',
    },
  },
];

export interface SoftenedChoice {
  id: string;
  emoji: string;
  label: Record<Language, string>;
}

export const SOFTENED_FEELINGS: SoftenedChoice[] = [
  { id: 'sad', emoji: '🥺', label: { es: 'triste', 'pt-BR': 'triste' } },
  { id: 'overwhelmed', emoji: '😮‍💨', label: { es: 'abrumado/a', 'pt-BR': 'sobrecarregado(a)' } },
  { id: 'lonely', emoji: '🫂', label: { es: 'solo/a', 'pt-BR': 'sozinho(a)' } },
  { id: 'worried', emoji: '😟', label: { es: 'preocupado/a', 'pt-BR': 'preocupado(a)' } },
  { id: 'tense', emoji: '😬', label: { es: 'tenso/a', 'pt-BR': 'tenso(a)' } },
  { id: 'hurt', emoji: '💔', label: { es: 'herido/a', 'pt-BR': 'magoado(a)' } },
];

export const SOFTENED_NEEDS: SoftenedChoice[] = [
  {
    id: 'listen',
    emoji: '👂',
    label: {
      es: 'que me escuches 10 minutos sin interrumpir',
      'pt-BR': 'que você me ouça por 10 minutos sem interromper',
    },
  },
  {
    id: 'hug',
    emoji: '🫂',
    label: {
      es: 'un abrazo tranquilo para bajar la tensión',
      'pt-BR': 'um abraço tranquilo para aliviar a tensão',
    },
  },
  {
    id: 'talk_calm',
    emoji: '🕊️',
    label: {
      es: 'buscar un acuerdo juntos hoy con calma',
      'pt-BR': 'buscar um acordo juntos hoje com calma',
    },
  },
  {
    id: 'teamwork',
    emoji: '🤝',
    label: {
      es: 'sentir que estamos del mismo lado hoy',
      'pt-BR': 'sentir que estamos do mesmo lado hoje',
    },
  },
];

export const CLINICAL_SUPPORT_NOTE: Record<Language, string> = {
  es: '🕊️ LIBER acompaña la comunicación cotidiana; complementa y no reemplaza la terapia profesional ni ayuda especializada en crisis.',
  'pt-BR':
    '🕊️ O LIBER apoia a comunicação cotidiana; complementa e não substitui terapia profissional nem atendimento especializado em crises.',
};

/**
 * Formats a Gottman-style "Softened Startup" ("I" statement + positive need, zero blame).
 */
export function buildSoftenedStartupMessage(params: {
  feelingLabel: string;
  situation: string;
  needLabel: string;
  language: Language;
}): string {
  const cleanSituation = params.situation.trim();
  if (params.language === 'pt-BR') {
    const context = cleanSituation || 'aconteceu esse desencontro hoje';
    return `Me senti ${params.feelingLabel} quando ${context}. Me ajudaria muito ${params.needLabel} 💛`;
  }
  const context = cleanSituation || 'tuvimos este desencuentro hoy';
  return `Me sentí ${params.feelingLabel} cuando ${context}. Me ayudaría mucho ${params.needLabel} 💛`;
}
