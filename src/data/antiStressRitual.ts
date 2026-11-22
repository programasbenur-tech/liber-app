import type { Language } from '../types/liber.ts';

export interface AntiStressRule {
  id: string;
  emoji: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
}

export interface AntiStressPrompt {
  id: string;
  emoji: string;
  text: Record<Language, string>;
}

export interface EmpathyReply {
  id: string;
  emoji: string;
  text: Record<Language, string>;
}

export type RitualStageId = 'intro' | 'turn_a' | 'turn_b' | 'closing';

export interface RitualStageMeta {
  id: RitualStageId;
  title: Record<Language, string>;
  guide: Record<Language, string>;
}

export const ANTI_STRESS_RULES: AntiStressRule[] = [
  {
    id: 'rule_external',
    emoji: '🌧️',
    title: {
      es: '1. Solo estrés de afuera',
      'pt-BR': '1. Só estresse de fora',
    },
    description: {
      es: 'Hablen de trabajo, trámites, cansancio o preocupaciones externas — no de peleas internas.',
      'pt-BR': 'Falem de trabalho, contas, cansaço ou preocupações externas — sem discussões do casal.',
    },
  },
  {
    id: 'rule_listen',
    emoji: '👂',
    title: {
      es: '2. Escuchar sin dar sermones',
      'pt-BR': '2. Ouvir sem dar sermão',
    },
    description: {
      es: 'Quien escucha no interrumpe ni corrige; solo acompaña salvo que su pareja pida ideas.',
      'pt-BR': 'Quem ouve não interrompe nem corrige; apenas acolhe, a menos que o par peça ideias.',
    },
  },
  {
    id: 'rule_team',
    emoji: '🤝',
    title: {
      es: '3. Ponerse del lado del otro',
      'pt-BR': '3. Ficar do lado do outro',
    },
    description: {
      es: 'Validen cómo se siente el otro primero. Hoy son un equipo frente al cansancio del mundo.',
      'pt-BR': 'Validem primeiro o que o outro sente. Hoje vocês são um time contra o peso do dia.',
    },
  },
];

export const ANTI_STRESS_PROMPTS: AntiStressPrompt[] = [
  {
    id: 'asp_1',
    emoji: '😮‍💨',
    text: {
      es: 'Lo que más energía me quitó hoy fuera de casa fue...',
      'pt-BR': 'O que mais sugou minha energia hoje fora de casa foi...',
    },
  },
  {
    id: 'asp_2',
    emoji: '💼',
    text: {
      es: 'En el trabajo o con las responsabilidades de esta semana me siento...',
      'pt-BR': 'No trabalho ou com as responsabilidades desta semana estou me sentindo...',
    },
  },
  {
    id: 'asp_3',
    emoji: '🧠',
    text: {
      es: 'Algo que me tiene la cabeza dando vueltas desde ayer es...',
      'pt-BR': 'Algo que não sai da minha cabeça desde ontem é...',
    },
  },
  {
    id: 'asp_4',
    emoji: '🔋',
    text: {
      es: 'Mi batería emocional ahora está así, y lo que más necesito es...',
      'pt-BR': 'Minha bateria emocional agora está assim, e o que mais preciso é...',
    },
  },
  {
    id: 'asp_5',
    emoji: '🌤️',
    text: {
      es: 'A pesar del cansancio, algo bueno que rescaté del día de hoy fue...',
      'pt-BR': 'Apesar do cansaço, algo bom que salvei do dia de hoje foi...',
    },
  },
  {
    id: 'asp_6',
    emoji: '🫂',
    text: {
      es: '¿Cómo me ayudaría que me acompañes esta noche? Me haría bien...',
      'pt-BR': 'Como me ajudaria você estar comigo esta noite? Me faria bem...',
    },
  },
];

export const EMPATHY_REPLIES: EmpathyReply[] = [
  {
    id: 'emp_1',
    emoji: '👂',
    text: {
      es: 'Te estoy escuchando con atención. Tiene todo el sentido que te sientas así después de un día así.',
      'pt-BR': 'Estou te ouvindo com atenção. Faz todo sentido você se sentir assim depois de um dia desses.',
    },
  },
  {
    id: 'emp_2',
    emoji: '🤝',
    text: {
      es: 'Estoy de tu lado en esto. No tienes que cargar ese peso solo/a hoy.',
      'pt-BR': 'Estou do seu lado nisso. Você não precisa carregar esse peso sozinho(a) hoje.',
    },
  },
  {
    id: 'emp_3',
    emoji: '💛',
    text: {
      es: 'Qué duro fue eso que pasaste hoy. Gracias por contármelo con calma.',
      'pt-BR': 'Que difícil foi isso que você enfrentou hoje. Obrigado(a) por compartilhar comigo.',
    },
  },
  {
    id: 'emp_4',
    emoji: '🫂',
    text: {
      es: 'Aquí estoy para ti: ¿quieres solo que te escuche o prefieres que busquemos una idea juntos?',
      'pt-BR': 'Estou aqui para você: quer apenas desabafar ou prefere que a gente pense numa saída juntos?',
    },
  },
  {
    id: 'emp_5',
    emoji: '☕',
    text: {
      es: 'Respiremos hondo juntos un momento; esta noche bajamos el ritmo en casa.',
      'pt-BR': 'Vamos respirar fundo juntos um instante; hoje à noite vamos desacelerar em casa.',
    },
  },
  {
    id: 'emp_6',
    emoji: '🫶',
    text: {
      es: 'Admiro cómo le pones el pecho a los días difíciles. Te mando un abrazo enorme.',
      'pt-BR': 'Admiro como você encara os dias difíceis. Te mando um abraço enorme.',
    },
  },
];

export const RITUAL_STAGES: RitualStageMeta[] = [
  {
    id: 'intro',
    title: { es: 'Preparar el espacio', 'pt-BR': 'Preparar o espaço' },
    guide: {
      es: 'Elijan Express (2 min) o Clásico (10 min). Dejen los celulares en silencio salvo para leer su guía.',
      'pt-BR': 'Escolham Express (2 min) ou Clássico (10 min). Deixem a pressa de lado por um momento.',
    },
  },
  {
    id: 'turn_a',
    title: { es: 'Turno 1 · Desahogo libre', 'pt-BR': 'Turno 1 · Desabafo livre' },
    guide: {
      es: 'Una persona habla de su día y su estrés externo; la otra escucha y valida con empatía.',
      'pt-BR': 'Uma pessoa fala do dia e do estresse de fora; a outra ouve e valida com empatia.',
    },
  },
  {
    id: 'turn_b',
    title: { es: 'Turno 2 · Cambian roles', 'pt-BR': 'Turno 2 · Invertem os papéis' },
    guide: {
      es: 'Ahora escucha quien habló recién, cuidando el mismo respeto y cero interrupciones.',
      'pt-BR': 'Agora quem falou escuta com o mesmo carinho, presença e zero interrupções.',
    },
  },
  {
    id: 'closing',
    title: { es: 'Cierre de Equipo', 'pt-BR': 'Fechamento de Time' },
    guide: {
      es: 'Cierren con un abrazo o mensaje cálido y sumen +3 a Nuestra Llama compartida.',
      'pt-BR': 'Fechem com um abraço ou mensagem carinhosa e somem +3 na Chama de Vocês.',
    },
  },
];

export const CLINICAL_RITUAL_NOTE: Record<Language, string> = {
  es: '🕊️ Ritual inspirado en prácticas cotidianas de escucha mutua; LIBER acompaña a la pareja y no reemplaza la psicoterapia profesional.',
  'pt-BR':
    '🕊️ Ritual inspirado em práticas cotidianas de escuta mútua; o LIBER apoia o casal e não substitui psicoterapia profissional.',
};
