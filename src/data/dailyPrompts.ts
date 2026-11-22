import type { Language } from '../types/liber.ts';

export interface DailyPrompt {
  id: string;
  emoji: string;
  theme: Record<Language, string>;
  prompt: Record<Language, string>;
}

export const DAILY_PROMPTS: DailyPrompt[] = [
  {
    id: 'dp_1',
    emoji: '💛',
    theme: { es: 'Gratitud', 'pt-BR': 'Gratidão' },
    prompt: {
      es: '¿Qué pequeño gesto de tu pareja agradeces hoy, aunque no se lo hayas dicho todavía?',
      'pt-BR': 'Qual pequeno gesto do seu par você agradece hoje, mesmo que ainda não tenha dito?',
    },
  },
  {
    id: 'dp_2',
    emoji: '🌧️',
    theme: { es: 'Alivio de Estrés', 'pt-BR': 'Alívio de Estresse' },
    prompt: {
      es: '¿Qué fue lo que más te cansó o preocupó hoy fuera de la pareja y cómo puedo aliviarte?',
      'pt-BR': 'O que mais cansou ou preocupou você hoje fora da relação e como posso ajudar?',
    },
  },
  {
    id: 'dp_3',
    emoji: '🤝',
    theme: { es: 'Modo Equipo', 'pt-BR': 'Modo Time' },
    prompt: {
      es: 'Si hoy fuéramos un equipo de rescate, ¿en qué tarea o peso te gustaría que nos ayudemos?',
      'pt-BR': 'Se hoje fôssemos um time de resgate, em qual tarefa ou peso gostaria de ajuda mútua?',
    },
  },
  {
    id: 'dp_4',
    emoji: '🕊️',
    theme: { es: 'Paz y Cuidado', 'pt-BR': 'Paz e Cuidado' },
    prompt: {
      es: '¿Qué detalle sencillo haría que esta noche te sientas más escuchado/a y tranquilo/a?',
      'pt-BR': 'Qual detalhe simples faria você se sentir mais ouvido(a) e em paz esta noite?',
    },
  },
  {
    id: 'dp_5',
    emoji: '📸',
    theme: { es: 'Buen Recuerdo', 'pt-BR': 'Boa Lembrança' },
    prompt: {
      es: '¿Cuál fue un momento lindo o gracioso de nosotros que te gustaría repetir pronto?',
      'pt-BR': 'Qual foi um momento lindo ou engraçado nosso que você gostaria de repetir logo?',
    },
  },
  {
    id: 'dp_6',
    emoji: '🫂',
    theme: { es: 'Cercanía', 'pt-BR': 'Proximidade' },
    prompt: {
      es: '¿Cómo prefieres recargar tu corazón hoy: abrazo largo, charla tranquila o descanso juntos?',
      'pt-BR': 'Como você prefere recarregar seu coração hoje: abraço longo, papo calmo ou descanso juntos?',
    },
  },
  {
    id: 'dp_7',
    emoji: '🌟',
    theme: { es: 'Admiración', 'pt-BR': 'Admiração' },
    prompt: {
      es: 'Nombra una cualidad de tu pareja que admiras y que a veces se nos olvida celebrar.',
      'pt-BR': 'Diga uma qualidade do seu par que você admira e que às vezes esquecemos de celebrar.',
    },
  },
  {
    id: 'dp_8',
    emoji: '🧭',
    theme: { es: 'Acuerdos', 'pt-BR': 'Acordos' },
    prompt: {
      es: '¿Qué costumbre nuestra de esta semana te hizo bien y quieres mantener?',
      'pt-BR': 'Qual hábito nosso desta semana fez bem a você e você quer manter?',
    },
  },
  {
    id: 'dp_9',
    emoji: '☕',
    theme: { es: 'Ritual Diario', 'pt-BR': 'Ritual Diário' },
    prompt: {
      es: 'Si tuviéramos 15 minutos sin pantallas hoy, ¿qué te gustaría hacer juntos?',
      'pt-BR': 'Se tivéssemos 15 minutos sem telas hoje, o que você gostaria de fazer juntos?',
    },
  },
  {
    id: 'dp_10',
    emoji: '💬',
    theme: { es: 'Escucha Real', 'pt-BR': 'Escuta Real' },
    prompt: {
      es: '¿Hay algo que vienes guardando esta semana que te aliviaría contar con calma?',
      'pt-BR': 'Tem algo que você está guardando esta semana e que aliviaria contar com calma?',
    },
  },
  {
    id: 'dp_11',
    emoji: '🌱',
    theme: { es: 'Crecimiento', 'pt-BR': 'Crescimento' },
    prompt: {
      es: '¿En qué sientes que hemos mejorado como pareja en los últimos meses?',
      'pt-BR': 'Em que você sente que melhoramos como casal nos últimos meses?',
    },
  },
  {
    id: 'dp_12',
    emoji: '🎧',
    theme: { es: 'Calma', 'pt-BR': 'Calma' },
    prompt: {
      es: 'Del 1 al 10, ¿cómo está tu nivel de energía mental hoy y qué te ayudaría a desconectar?',
      'pt-BR': 'De 1 a 10, como está sua energia mental hoje e o que ajudaria você a desconectar?',
    },
  },
  {
    id: 'dp_13',
    emoji: '💌',
    theme: { es: 'Ternura', 'pt-BR': 'Ternura' },
    prompt: {
      es: 'Escribe en una frase algo bonito que te gustaría que tu pareja recuerde antes de dormir.',
      'pt-BR': 'Escreva em uma frase algo bonito que você gostaria que seu par lembrasse antes de dormir.',
    },
  },
  {
    id: 'dp_14',
    emoji: '🗺️',
    theme: { es: 'Planes', 'pt-BR': 'Planos' },
    prompt: {
      es: '¿Qué salida sencilla o plan casero te daría ilusión hacer este fin de semana?',
      'pt-BR': 'Qual passeio simples ou plano em casa daria alegria fazer neste fim de semana?',
    },
  },
  {
    id: 'dp_15',
    emoji: '🛡️',
    theme: { es: 'Seguridad', 'pt-BR': 'Segurança' },
    prompt: {
      es: '¿Qué palabra o gesto mío te hace sentir seguro/a cuando estamos en desacuerdo?',
      'pt-BR': 'Qual palavra ou gesto meu faz você se sentir seguro(a) quando discordamos?',
    },
  },
  {
    id: 'dp_16',
    emoji: '😂',
    theme: { es: 'Humor', 'pt-BR': 'Humor' },
    prompt: {
      es: '¿Qué chiste interno o situación absurda nuestra todavía te saca una sonrisa?',
      'pt-BR': 'Qual piada interna ou situação engraçada nossa ainda arranca um sorriso seu?',
    },
  },
  {
    id: 'dp_17',
    emoji: '🫶',
    theme: { es: 'Lenguaje de Amor', 'pt-BR': 'Linguagem de Amor' },
    prompt: {
      es: '¿Qué gesto te hace sentir más amado/a esta semana: palabras, tiempo juntos, abrazos o ayuda práctica?',
      'pt-BR': 'Qual gesto faz você se sentir mais amado(a) esta semana: palavras, tempo, abraços ou ajuda prática?',
    },
  },
  {
    id: 'dp_18',
    emoji: '🌤️',
    theme: { es: 'Esperanza', 'pt-BR': 'Esperança' },
    prompt: {
      es: 'Si pudiéramos empezar mañana con el pie derecho, ¿qué pequeño pacto haríamos para el día?',
      'pt-BR': 'Se pudéssemos começar amanhã com o pé direito, qual pequeno combinado faríamos?',
    },
  },
  {
    id: 'dp_19',
    emoji: '💎',
    theme: { es: 'Valor', 'pt-BR': 'Valor' },
    prompt: {
      es: '¿Por qué te alegra haber elegido compartir esta etapa de tu vida conmigo?',
      'pt-BR': 'Por que você fica feliz por compartilhar esta fase da vida comigo?',
    },
  },
  {
    id: 'dp_20',
    emoji: '🧘',
    theme: { es: 'Paciencia', 'pt-BR': 'Paciência' },
    prompt: {
      es: '¿En qué tema sientes que hoy necesitamos darnos un poco más de paciencia mutua?',
      'pt-BR': 'Em qual assunto você sente que hoje precisamos ter um pouco mais de paciência mútua?',
    },
  },
  {
    id: 'dp_21',
    emoji: '✨',
    theme: { es: 'Deseo Sano', 'pt-BR': 'Desejo Saudável' },
    prompt: {
      es: '¿Qué sueño o meta personal tuya te gustaría que apoye más de cerca este mes?',
      'pt-BR': 'Qual sonho ou meta pessoal sua você gostaria que eu apoiasse mais de perto este mês?',
    },
  },
];

/**
 * Returns the exact same deterministic DailyPrompt for both partners on a given YYYY-MM-DD date.
 */
export function getDailyPromptForDate(dateKey: string): DailyPrompt {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return DAILY_PROMPTS[hash % DAILY_PROMPTS.length];
}
