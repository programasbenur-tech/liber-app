import { Language, QuestionCategory, TrafficState } from '@/types/liber';

export const CATEGORY_LABELS: Record<QuestionCategory, Record<Language, { name: string; emoji: string }>> = {
  romantic_mood: {
    es: { name: 'Clima Romántico', emoji: '💘' },
    'pt-BR': { name: 'Clima Romântico', emoji: '💘' },
  },
  physical_affection: {
    es: { name: 'Cariño Físico', emoji: '🫂' },
    'pt-BR': { name: 'Carinho Físico', emoji: '🫂' },
  },
  emotional_connection: {
    es: { name: 'Conexión Emocional', emoji: '✨' },
    'pt-BR': { name: 'Conexão Emocional', emoji: '✨' },
  },
  energy_tiredness: {
    es: { name: 'Energía y Descanso', emoji: '🔋' },
    'pt-BR': { name: 'Energia e Descanso', emoji: '🔋' },
  },
  playful_flirting: {
    es: { name: 'Coqueteo Divertido', emoji: '😉' },
    'pt-BR': { name: 'Flerte Divertido', emoji: '😉' },
  },
  quality_time: {
    es: { name: 'Tiempo de Calidad', emoji: '🍷' },
    'pt-BR': { name: 'Tempo de Qualidade', emoji: '🍷' },
  },
  intimacy_interest: {
    es: { name: 'Interés en Intimidad', emoji: '🔥' },
    'pt-BR': { name: 'Interesse em Intimidade', emoji: '🔥' },
  },
  boundaries_preferences: {
    es: { name: 'Límites y Preferencias', emoji: '🛡️' },
    'pt-BR': { name: 'Limites e Preferências', emoji: '🛡️' },
  },
};

export const TRAFFIC_STATE_META: Record<
  TrafficState,
  {
    emoji: string;
    badge: Record<Language, string>;
    headline: Record<Language, string>;
    description: Record<Language, string>;
    colorClass: string;
    ringClass: string;
    bgSoftClass: string;
  }
> = {
  LIBER: {
    emoji: '🟢',
    badge: { es: 'LIBER', 'pt-BR': 'LIBER' },
    headline: { es: '¡Estoy Liber!', 'pt-BR': 'Estou Liber!' },
    description: {
      es: 'Me siento con ganas de romance y potencialmente abierto/a a la intimidad.',
      'pt-BR': 'Estou com clima de romance e potencialmente aberto(a) à intimidade.',
    },
    colorClass: 'from-emerald-400 to-teal-500',
    ringClass: 'ring-emerald-400/50 shadow-emerald-400/40',
    bgSoftClass: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  },
  CASI_LIBER: {
    emoji: '🟡',
    badge: { es: 'CASI LIBER', 'pt-BR': 'QUASE LIBER' },
    headline: { es: '¡Estoy Casi Liber!', 'pt-BR': 'Estou Quase Liber!' },
    description: {
      es: 'Tal vez me interese, pero depende de mi ánimo, mimos previos y lo que ambos queramos.',
      'pt-BR': 'Talvez eu me interesse, mas depende do meu humor, carinho prévio e do que nós dois quisermos.',
    },
    colorClass: 'from-amber-400 to-orange-400',
    ringClass: 'ring-amber-400/50 shadow-amber-400/40',
    bgSoftClass: 'bg-amber-50 border-amber-200 text-amber-900',
  },
  ANTI_LIBER: {
    emoji: '🔴',
    badge: { es: 'ANTI LIBER', 'pt-BR': 'ANTI LIBER' },
    headline: { es: '¡Estoy Anti Liber!', 'pt-BR': 'Estou Anti Liber!' },
    description: {
      es: 'No tengo ganas de intimidad ahora, pero los abrazos, mimos y compañía pueden ser bienvenidos.',
      'pt-BR': 'Não estou com vontade de intimidade agora, mas abraços, cafuné e companhia podem ser bem-vindos.',
    },
    colorClass: 'from-rose-400 to-pink-500',
    ringClass: 'ring-rose-400/50 shadow-rose-400/40',
    bgSoftClass: 'bg-rose-50 border-rose-200 text-rose-900',
  },
};

export const AFFECTION_TAG_LABELS: Record<string, Record<Language, string>> = {
  cuddles: { es: 'Abrazos largos 🫂', 'pt-BR': 'Abraços demorados 🫂' },
  kisses: { es: 'Besitos suaves 😘', 'pt-BR': 'Beijinhos suaves 😘' },
  massage: { es: 'Masaje relajante 💆', 'pt-BR': 'Massagem relaxante 💆' },
  movie_chill: { es: 'Película y manta 🎬', 'pt-BR': 'Filme e cobertor 🎬' },
  deep_talk: { es: 'Charla bonita 💬', 'pt-BR': 'Conversa gostosa 💬' },
  playful_tease: { es: 'Coqueteo y risas 😉', 'pt-BR': 'Flerte e risadas 😉' },
  space_rest: { es: 'Descanso tranquilo 😴', 'pt-BR': 'Descanso tranquilo 😴' },
  romantic_date: { es: 'Cita especial 🕯️', 'pt-BR': 'Encontro especial 🕯️' },
};

export const UI_TEXT = {
  appTitle: 'LIBER ❤️',
  appSubtitle: {
    es: '¿Cómo está el semáforo del amor hoy?',
    'pt-BR': 'Como está o semáforo do amor hoje?',
  },
  ageGateTitle: {
    es: 'Solo para parejas adultas (18+)',
    'pt-BR': 'Apenas para casais adultos (18+)',
  },
  ageGateBody: {
    es: 'LIBER es un juego romántico y respetuoso para mayores de 18 años. Ayuda a comunicar tu estado de ánimo y límites sin presión ni vigilancia.',
    'pt-BR': 'LIBER é um jogo romântico e respeitoso para maiores de 18 anos. Ajuda a comunicar seu humor e limites sem pressão nem vigilância.',
  },
  ageGateConfirm: {
    es: 'Confirmo que tengo 18+ años — Entrar',
    'pt-BR': 'Confirmo que tenho 18+ anos — Entrar',
  },
  nav: {
    home: { es: 'Semáforo', 'pt-BR': 'Semáforo' },
    game: { es: 'Juego', 'pt-BR': 'Jogo' },
    match: { es: 'Pareja', 'pt-BR': 'Casal' },
    ideas: { es: 'Ideas', 'pt-BR': 'Ideias' },
    privacy: { es: 'Privacidad', 'pt-BR': 'Privacidade' },
  },
  quickCheckin: {
    es: 'Check-in Rápido',
    'pt-BR': 'Check-in Rápido',
  },
  playFullQuiz: {
    es: 'Jugar Cuestionario',
    'pt-BR': 'Jogar Questionário',
  },
  rouletteTitle: {
    es: 'Ruleta Romántica',
    'pt-BR': 'Roleta Romântica',
  },
  spinRoulette: {
    es: 'Girar Ruleta 🎡',
    'pt-BR': 'Girar Roleta 🎡',
  },
  surpriseMe: {
    es: 'SORPRÉNDEME ✨',
    'pt-BR': 'SURPREENDA-ME ✨',
  },
  disclaimer: {
    es: 'Nota: Los puntajes son una mecánica divertida del juego, no predicciones científicas. Un "No" o "Ahora no" siempre tiene prioridad absoluta.',
    'pt-BR': 'Nota: As pontuações são uma mecânica divertida do jogo, não previsões científicas. Um "Não" ou "Agora não" sempre tem prioridade absoluta.',
  },
  boundaryLockActive: {
    es: 'Límite respetado: tu respuesta explícita de pausa/duda protege tu estado del semáforo automáticamente.',
    'pt-BR': 'Limite respeitado: sua resposta explícita de pausa/dúvida protege o seu estado do semáforo automaticamente.',
  },
  manualOverrideLabel: {
    es: '¿Quieres ajustar tu semáforo manualmente?',
    'pt-BR': 'Quer ajustar seu semáforo manualmente?',
  },
  demoBanner: {
    es: 'Modo Demo Local activo (sin credenciales externas). Tus datos se guardan solo en tu navegador.',
    'pt-BR': 'Modo Demo Local ativo (sem credenciais externas). Seus dados ficam salvos apenas no seu navegador.',
  },
  supabaseActiveBanner: {
    es: 'Conectado a Supabase con cifrado y políticas de privacidad RLS.',
    'pt-BR': 'Conectado ao Supabase com criptografia e políticas de privacidade RLS.',
  },
  deleteAllData: {
    es: 'Borrar todos mis datos',
    'pt-BR': 'Apagar todos os meus dados',
  },
  deleteConfirm: {
    es: '¿Seguro que quieres borrar todos tus datos locales y reiniciar LIBER?',
    'pt-BR': 'Tem certeza de que deseja apagar todos os seus dados locais e reiniciar o LIBER?',
  },
};

export const MYSTERY_UI = {
  title: { es: 'Modo Misterio', 'pt-BR': 'Modo Mistério' },
  subtitle: {
    es: 'Seducción sutil, cero preguntas directas',
    'pt-BR': 'Sedução sutil, zero perguntas diretas',
  },
  badge: { es: 'Sin preguntas directas', 'pt-BR': 'Sem perguntas diretas' },
  radarLabel: { es: 'Brújula del Misterio', 'pt-BR': 'Bússola do Mistério' },
  sealedTitle: {
    es: 'Sobre Lacrado Listo',
    'pt-BR': 'Envelope Lacrado Pronto',
  },
  sealedBody: {
    es: 'Todas tus pistas nocturnas quedaron guardadas en este sobre secreto.',
    'pt-BR': 'Todas as suas pistas noturnas foram guardadas neste envelope secreto.',
  },
  openEnvelopeBtn: {
    es: '✉️ Romper el sello y revelar el misterio',
    'pt-BR': '✉️ Romper o selo e revelar o mistério',
  },
  autonomyNotice: {
    es: 'El Modo Misterio solo lee el clima del juego. Tú confirmas o cambias tu Semáforo real antes de compartirlo.',
    'pt-BR': 'O Modo Mistério lê apenas o clima do jogo. Você confirma ou ajusta seu Semáforo real antes de compartilhar.',
  },
  confirmSendBtn: {
    es: 'Confirmar y Enviar mi Semáforo',
    'pt-BR': 'Confirmar e Enviar meu Semáforo',
  },
};

export const TRUST_LAB_UI = {
  title: {
    es: 'Ciencia de la Fidelidad y Confianza',
    'pt-BR': 'Ciência da Fidelidade e Confiança',
  },
  subtitle: {
    es: 'Basado en Gottman, Rusbult, Glass, Fincham & May y Fisher',
    'pt-BR': 'Baseado em Gottman, Rusbult, Glass, Fincham & May e Fisher',
  },
  badge: { es: 'Estudio científico', 'pt-BR': 'Estudo científico' },
  startQuick: {
    es: 'Chequeo Rápido (8 preguntas)',
    'pt-BR': 'Check-up Rápido (8 perguntas)',
  },
  startFull: {
    es: 'Estudio Completo (16 preguntas)',
    'pt-BR': 'Estudo Completo (16 perguntas)',
  },
  scientificFactTitle: {
    es: '🧪 Dato Científico',
    'pt-BR': '🧪 Dado Científico',
  },
  nextQuestion: {
    es: 'Siguiente pregunta →',
    'pt-BR': 'Próxima pergunta →',
  },
  viewMap: {
    es: 'Ver mi Mapa de Confianza →',
    'pt-BR': 'Ver meu Mapa de Confiança →',
  },
  strongestLabel: {
    es: 'Tu mayor fortaleza',
    'pt-BR': 'Sua maior força',
  },
  focusLabel: {
    es: 'Tema sugerido para conversar',
    'pt-BR': 'Tema sugerido para conversar',
  },
  invitePartnerBtn: {
    es: '💌 Invitar a mi pareja a conversar este tema',
    'pt-BR': '💌 Convidar meu par para conversar sobre este tema',
  },
};
