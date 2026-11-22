import type {
  Language,
  TrustDimension,
  TrustProfileCode,
  TrustQuestion,
} from '../types/liber.ts';

export const TRUST_DISCLAIMER: Record<Language, string> = {
  es: '🛡️ Aviso ético y científico: Basado en modelos psicológicos de confianza; no acusa ni detecta infidelidad, sino que mide hábitos protectores y abre acuerdos sanos.',
  'pt-BR':
    '🛡️ Aviso ético e científico: Baseado em modelos psicológicos de confiança; não acusa nem detecta infidelidade, mas mede hábitos protetores e abre acordos saudáveis.',
};

export const TRUST_DIMENSIONS_META: Record<
  TrustDimension,
  {
    emoji: string;
    name: Record<Language, string>;
    citation: Record<Language, string>;
    conversationPrompt: Record<Language, string>;
  }
> = {
  walls_windows: {
    emoji: '🪟',
    name: {
      es: 'Paredes y Ventanas',
      'pt-BR': 'Paredes e Janelas',
    },
    citation: {
      es: 'Dra. Shirley Glass (Not "Just Friends", 2003)',
      'pt-BR': 'Dra. Shirley Glass (Not "Just Friends", 2003)',
    },
    conversationPrompt: {
      es: '¿Cómo podemos mantener abierta nuestra ventana emocional y cuidar límites sanos hacia afuera?',
      'pt-BR': 'Como podemos manter aberta nossa janela emocional e cuidar de limites saudáveis para fora?',
    },
  },
  investment_commitment: {
    emoji: '💎',
    name: {
      es: 'Compromiso e Inversión',
      'pt-BR': 'Compromisso e Investimento',
    },
    citation: {
      es: 'Modelo de Inversión de Caryl Rusbult; Drigotas et al. (1999)',
      'pt-BR': 'Modelo de Investimento de Caryl Rusbult; Drigotas et al. (1999)',
    },
    conversationPrompt: {
      es: '¿Qué pequeño ritual o proyecto nuevo podríamos crear esta semana para disfrutar más juntos?',
      'pt-BR': 'Que pequeno ritual ou projeto novo poderíamos criar esta semana para curtir mais juntos?',
    },
  },
  attunement_repair: {
    emoji: '🤝',
    name: {
      es: 'Conexión Diaria y Reparación',
      'pt-BR': 'Conexão Diária e Reparação',
    },
    citation: {
      es: 'John & Julie Gottman (Bids); Fincham & May (2017)',
      'pt-BR': 'John & Julie Gottman (Bids); Fincham & May (2017)',
    },
    conversationPrompt: {
      es: 'Cuando estamos estresados o discutimos, ¿qué gesto rápido nos ayuda a volver a ser equipo?',
      'pt-BR': 'Quando estamos estressados ou discutimos, qual gesto rápido nos ajuda a voltar a ser um time?',
    },
  },
  clear_agreements: {
    emoji: '🧭',
    name: {
      es: 'Acuerdos Claros: Emocional y Físico',
      'pt-BR': 'Acordos Claros: Emocional e Físico',
    },
    citation: {
      es: 'Maryanne Fisher et al. & Teoría del Apego',
      'pt-BR': 'Maryanne Fisher et al. & Teoria do Apego',
    },
    conversationPrompt: {
      es: '¿Qué conductas en redes, chats o salidas sentimos importantes aclarar para cuidarnos sin dramas?',
      'pt-BR': 'Quais atitudes em redes, chats ou saídas achamos importante combinar para nos cuidar sem drama?',
    },
  },
};

export const TRUST_PROFILES_META: Record<
  TrustProfileCode,
  {
    emoji: string;
    title: Record<Language, string>;
    summary: Record<Language, string>;
    toneClass: string;
    nextStep: Record<Language, string>;
  }
> = {
  FORTALEZA: {
    emoji: '🛡️💎',
    title: {
      es: 'Vínculo Blindado',
      'pt-BR': 'Vínculo Blindado',
    },
    summary: {
      es: 'Tus respuestas reflejan hábitos protectores sólidos: transparencia sana, cuidado del equipo diario y límites claros.',
      'pt-BR': 'Suas respostas refletem hábitos protetores sólidos: transparência saudável, cuidado diário e limites claros.',
    },
    toneClass: 'from-emerald-50 to-teal-50 border-emerald-200 text-emerald-950',
    nextStep: {
      es: 'Sigan nutriendo sus rituales semanales y celebrando la confianza mutua.',
      'pt-BR': 'Continuem nutrindo seus rituais semanais e celebrando a confiança mútua.',
    },
  },
  ATENCION: {
    emoji: '💛🧭',
    title: {
      es: 'Zona de Cuidado y Acuerdos',
      'pt-BR': 'Zona de Cuidado e Acordos',
    },
    summary: {
      es: 'Hay buenas bases en el vínculo, pero existen zonas grises o rutinas que conviene conversar a tiempo con calma.',
      'pt-BR': 'Há boas bases no vínculo, mas existem zonas cinzentas ou rotinas que vale conversar com calma no tempo certo.',
    },
    toneClass: 'from-amber-50 to-orange-50 border-amber-200 text-amber-950',
    nextStep: {
      es: 'Elijan una noche tranquila de esta semana para alinear expectativas sin reproches.',
      'pt-BR': 'Escolham uma noite tranquila desta semana para alinhar expectativas sem cobranças.',
    },
  },
  ALERTA_CONVERSACION: {
    emoji: '🚩💬',
    title: {
      es: 'Señales para Conversar a Tiempo',
      'pt-BR': 'Sinais para Conversar a Tempo',
    },
    summary: {
      es: 'Se observan señales de desgaste, secretismo o falta de acuerdos claros que la literatura asocia con vulnerabilidad del vínculo.',
      'pt-BR': 'Observam-se sinais de desgaste, segredo ou falta de acordos claros que a literatura associa à vulnerabilidade do vínculo.',
    },
    toneClass: 'from-rose-50 to-purple-50 border-rose-200 text-rose-950',
    nextStep: {
      es: 'Prioricen una charla honesta y empática (o acompañamiento profesional de pareja si lo necesitan).',
      'pt-BR': 'Priorizem uma conversa honesta e empática (ou apoio profissional de casal se precisarem).',
    },
  },
};

export const FIDELITY_QUESTIONS: TrustQuestion[] = [
  // =========================================================================
  // 1. WALLS AND WINDOWS (Shirley Glass, 2003)
  // =========================================================================
  {
    id: 'tr_1',
    dimension: 'walls_windows',
    frameworkRef: {
      es: 'Dra. Shirley Glass (2003) — Paredes y Ventanas',
      'pt-BR': 'Dra. Shirley Glass (2003) — Paredes e Janelas',
    },
    prompt: {
      es: 'Cuando hay una frustración o tema delicado en tu relación, ¿hacia dónde suele abrirse tu "ventana" emocional?',
      'pt-BR': 'Quando surge uma frustração ou assunto delicado na relação, para onde sua "janela" emocional costuma se abrir?',
    },
    options: [
      { id: 'tr_1_a', emoji: '🪟', label: { es: 'Primero lo converso con mi pareja buscando solución', 'pt-BR': 'Converso primeiro com meu par buscando solução' }, points: 95 },
      { id: 'tr_1_b', emoji: '🌤️', label: { es: 'A veces me desahogo con alguien de confianza, pero luego lo hablo con mi pareja', 'pt-BR': 'Às vezes desabafo com alguém de confiança, mas logo falo com meu par' }, points: 70 },
      { id: 'tr_1_c', emoji: '🌫️', label: { es: 'Suelo callarlo en casa y contarlo afuera para evitar discusiones', 'pt-BR': 'Costumo calar em casa e contar fora para evitar brigas' }, points: 40 },
      { id: 'tr_1_d', emoji: '🧱', label: { es: 'Comparto mis quejas íntimas con una persona externa con quien siento química', 'pt-BR': 'Compartilho queixas íntimas com alguém de fora com quem sinto química' }, points: 15 },
    ],
    scientificNote: {
      es: 'Según Shirley Glass (2003), las parejas protegen su vínculo cuando mantienen una ventana abierta entre sí y una pared saludable frente a confianzas íntimas externas.',
      'pt-BR': 'Segundo Shirley Glass (2003), casais protegem o vínculo quando mantêm a janela aberta entre si e uma parede saudável diante de intimidades externas.',
    },
  },
  {
    id: 'tr_2',
    dimension: 'walls_windows',
    frameworkRef: {
      es: 'Dra. Shirley Glass (2003) — Transparencia Digital',
      'pt-BR': 'Dra. Shirley Glass (2003) — Transparência Digital',
    },
    prompt: {
      es: 'En lo cotidiano con el celular (mensajes, redes, notificaciones), ¿cómo se siente el clima entre ustedes?',
      'pt-BR': 'No dia a dia com o celular (mensagens, redes, notificações), como é o clima entre vocês?',
    },
    options: [
      { id: 'tr_2_a', emoji: '✨', label: { es: 'Relajado y transparente: privacidad sana sin nada que esconder', 'pt-BR': 'Tranquilo e transparente: privacidade saudável sem nada a esconder' }, points: 95 },
      { id: 'tr_2_b', emoji: '🙂', label: { es: 'Generalmente tranquilo, aunque casi nunca hablamos de hábitos digitales', 'pt-BR': 'Em geral tranquilo, embora quase nunca falemos de hábitos digitais' }, points: 70 },
      { id: 'tr_2_c', emoji: '📱', label: { es: 'A veces genera incomodidad o ganas de girar la pantalla sin motivo claro', 'pt-BR': 'Às vezes gera desconforto ou vontade de virar a tela sem motivo claro' }, points: 40 },
      { id: 'tr_2_d', emoji: '🫣', label: { es: 'Hay chats silenciados, borrados o ocultos para evitar preguntas', 'pt-BR': 'Existem conversas silenciadas, apagadas ou escondidas para evitar perguntas' }, points: 15 },
    ],
    scientificNote: {
      es: 'Glass (2003) distingue privacidad (espacio personal sano) de secretismo (ocultar conductas que dolerían si salieran a la luz), señalando al secretismo como el principal erosivo de la confianza.',
      'pt-BR': 'Glass (2003) diferencia privacidade (espaço pessoal saudável) de segredo (ocultar condutas que machucariam se descobertas), apontando o segredo como o maior desgaste da confiança.',
    },
  },
  {
    id: 'tr_3',
    dimension: 'walls_windows',
    frameworkRef: {
      es: 'Dra. Shirley Glass (2003) — Fronteras Emocionales',
      'pt-BR': 'Dra. Shirley Glass (2003) — Fronteiras Emocionais',
    },
    prompt: {
      es: 'Si alguien fuera de la pareja cruza una línea sutil (un halago insistente o mensaje ambiguo de noche), ¿qué suele ocurrir?',
      'pt-BR': 'Se alguém fora da relação cruza um limite sutil (um elogio insistente ou mensagem ambígua à noite), o que costuma acontecer?',
    },
    options: [
      { id: 'tr_3_a', emoji: '🛡️', label: { es: 'Se frena con claridad y, si importa, se cuenta con naturalidad a la pareja', 'pt-BR': 'Coloca-se um limite claro e, se for relevante, conta-se ao par com naturalidade' }, points: 95 },
      { id: 'tr_3_b', emoji: '🤝', label: { es: 'Se evita seguir el juego, aunque preferimos no comentarlo para no inquietar', 'pt-BR': 'Evita-se dar corda, embora prefiramos não comentar para não preocupar' }, points: 70 },
      { id: 'tr_3_c', emoji: '⚖️', label: { es: 'Se deja ambiguo porque se siente bien la validación externa', 'pt-BR': 'Fica no ar porque a validação externa faz bem ao ego' }, points: 40 },
      { id: 'tr_3_d', emoji: '🚩', label: { es: 'Se responde siguiendo el coqueteo en privado mientras se minimiza como "solo amistad"', 'pt-BR': 'Responde-se entrando no flerte em privado enquanto se chama de "só amizade"' }, points: 15 },
    ],
    scientificNote: {
      es: 'En Not "Just Friends" (Glass, 2003), muchas transgresiones emocionales empiezan sin intención explícita, cuando la validación externa y el silencio reemplazan los límites claros.',
      'pt-BR': 'Em Not "Just Friends" (Glass, 2003), muitas transgressões emocionais começam sem intenção explícita, quando a validação externa e o silêncio substituem limites claros.',
    },
  },
  {
    id: 'tr_4',
    dimension: 'walls_windows',
    frameworkRef: {
      es: 'Dra. Shirley Glass (2003) — Prioridad Emocional',
      'pt-BR': 'Dra. Shirley Glass (2003) — Prioridade Emocional',
    },
    prompt: {
      es: 'Cuando te pasa algo emocionante, triste o importante en el día, ¿tu pareja sigue siendo tu primera parada emocional?',
      'pt-BR': 'Quando acontece algo empolgante, triste ou importante no seu dia, seu par ainda é sua primeira parada emocional?',
    },
    options: [
      { id: 'tr_4_a', emoji: '💚', label: { es: 'Sí, es la primera persona a la que quiero contarle mi mundo', 'pt-BR': 'Sim, é a primeira pessoa para quem quero contar o meu mundo' }, points: 95 },
      { id: 'tr_4_b', emoji: '💛', label: { es: 'Casi siempre, salvo semanas de mucho estrés o rutina', 'pt-BR': 'Quase sempre, exceto em semanas de muito estresse ou rotina' }, points: 70 },
      { id: 'tr_4_c', emoji: '🌧️', label: { es: 'Cada vez menos; siento que no siempre hay espacio para escucharme', 'pt-BR': 'Cada vez menos; sinto que nem sempre há espaço para me ouvir' }, points: 40 },
      { id: 'tr_4_d', emoji: '🚪', label: { es: 'No, hoy encuentro mucha más complicidad emocional con otra persona', 'pt-BR': 'Não, hoje encontro muito mais cumplicidade emocional com outra pessoa' }, points: 15 },
    ],
    scientificNote: {
      es: 'Glass (2003) observó que cerrar la ventana de vulnerabilidad dentro de la pareja vuelve frágil el vínculo cuando esa cercanía se busca afuera.',
      'pt-BR': 'Glass (2003) observou que fechar a janela da vulnerabilidade dentro do casal torna o vínculo frágil quando essa proximidade passa a ser buscada fora.',
    },
  },

  // =========================================================================
  // 2. INVESTMENT & COMMITMENT (Caryl Rusbult; Drigotas et al., 1999)
  // =========================================================================
  {
    id: 'tr_5',
    dimension: 'investment_commitment',
    frameworkRef: {
      es: 'Modelo de Inversión de Rusbult — Satisfacción',
      'pt-BR': 'Modelo de Investimento de Rusbult — Satisfação',
    },
    prompt: {
      es: 'Si miras el balance de las últimas semanas, ¿cuánta alegría y bienestar te aporta hoy tu relación?',
      'pt-BR': 'Olhando o saldo das últimas semanas, quanta alegria e bem-estar a sua relação traz hoje?',
    },
    options: [
      { id: 'tr_5_a', emoji: '☀️', label: { es: 'Mucha: disfrutamos estar juntos y nos recargamos mutuamente', 'pt-BR': 'Muito: gostamos de estar juntos e nos recarregamos mutuamente' }, points: 95 },
      { id: 'tr_5_b', emoji: '⛅', label: { es: 'Buena en general, aunque nos falta cuidar más los momentos de disfrute', 'pt-BR': 'Boa no geral, embora falte cuidar mais dos momentos de prazer juntos' }, points: 70 },
      { id: 'tr_5_c', emoji: '☁️', label: { es: 'Irregular: la rutina y el cansancio pesan más que la chispa', 'pt-BR': 'Irregular: a rotina e o cansaço pesam mais do que a faísca' }, points: 40 },
      { id: 'tr_5_d', emoji: '⛈️', label: { es: 'Baja: siento vacío emocional o desgaste constante que no abordamos', 'pt-BR': 'Baixa: sinto vazio emocional ou desgaste constante que não enfrentamos' }, points: 15 },
    ],
    scientificNote: {
      es: 'El Modelo de Inversión de Caryl Rusbult (y Drigotas et al., 1999) demuestra que una alta satisfacción cotidiana fortalece el compromiso y actúa como escudo frente a tentaciones externas.',
      'pt-BR': 'O Modelo de Investimento de Caryl Rusbult (e Drigotas et al., 1999) demonstra que alta satisfação cotidiana fortalece o compromisso e atua como escudo contra tentações externas.',
    },
  },
  {
    id: 'tr_6',
    dimension: 'investment_commitment',
    frameworkRef: {
      es: 'Drigotas, Safstrom & Gentilia (1999) — Calidad de Alternativas',
      'pt-BR': 'Drigotas, Safstrom & Gentilia (1999) — Qualidade de Alternativas',
    },
    prompt: {
      es: 'Es humano notar que otras personas son atractivas; cuando pasa, ¿cómo lo gestionas internamente?',
      'pt-BR': 'É humano notar que outras pessoas são atraentes; quando isso acontece, como você lida internamente?',
    },
    options: [
      { id: 'tr_6_a', emoji: '💎', label: { es: 'Lo noto de paso, pero valoro tanto lo nuestro que no le doy energía', 'pt-BR': 'Noto de passagem, mas valorizo tanto o nosso vínculo que não dou energia' }, points: 95 },
      { id: 'tr_6_b', emoji: '🧭', label: { es: 'Pasa rápido, aunque a veces me recuerda que quiero reavivar nuestra chispa', 'pt-BR': 'Passa rápido, embora às vezes me lembre de reacender nossa chama' }, points: 70 },
      { id: 'tr_6_c', emoji: '💭', label: { es: 'A veces comparo y fantaseo con cómo sería estar con alguien distinto', 'pt-BR': 'Às vezes comparo e fantasio como seria estar com outra pessoa' }, points: 40 },
      { id: 'tr_6_d', emoji: '🔥', label: { es: 'Busco activamente atención o escenarios para comprobar si despierto interés', 'pt-BR': 'Busco ativamente atenção ou situações para testar se desperto interesse' }, points: 15 },
    ],
    scientificNote: {
      es: 'En estudios prospectivos (Drigotas, Safstrom & Gentilia, 1999), las personas altamente comprometidas reducen cognitivamente el atractivo de alternativas y no alimentan fantasías comparativas.',
      'pt-BR': 'Em estudos prospectivos (Drigotas, Safstrom & Gentilia, 1999), pessoas altamente comprometidas reduzem cognitivamente o apelo de alternativas e não alimentam fantasias comparativas.',
    },
  },
  {
    id: 'tr_7',
    dimension: 'investment_commitment',
    frameworkRef: {
      es: 'Modelo de Inversión de Rusbult — Tamaño de Inversión',
      'pt-BR': 'Modelo de Investimento de Rusbult — Tamanho do Investimento',
    },
    prompt: {
      es: '¿Sienten que siguen invirtiendo tiempo, rituales y proyectos compartidos en construir su "nosotros"?',
      'pt-BR': 'Vocês sentem que continuam investindo tempo, rituais e projetos compartilhados para construir o "nós"?',
    },
    options: [
      { id: 'tr_7_a', emoji: '🌱', label: { es: 'Sí, tenemos planes, rituales semanales y metas que nos ilusionan', 'pt-BR': 'Sim, temos planos, rituais semanais e metas que nos empolgam' }, points: 95 },
      { id: 'tr_7_b', emoji: '🗓️', label: { es: 'Sí en lo grande, pero nos falta proteger citas pequeñas de calidad', 'pt-BR': 'Sim nos planos grandes, mas falta proteger encontros pequenos de qualidade' }, points: 70 },
      { id: 'tr_7_c', emoji: '🔀', label: { es: 'Últimamente vivimos vidas bastante paralelas, casi solo logística', 'pt-BR': 'Ultimamente vivemos vidas bem paralelas, quase só logística' }, points: 40 },
      { id: 'tr_7_d', emoji: '🧊', label: { es: 'Siento que dejamos de invertir energía en proyectos juntos', 'pt-BR': 'Sinto que paramos de investir energia em projetos juntos' }, points: 15 },
    ],
    scientificNote: {
      es: 'Rusbult demostró que las inversiones compartidas (recuerdos, rituales, proyectos de vida) consolidan el compromiso a largo plazo mucho más que la emoción pasajera.',
      'pt-BR': 'Rusbult demonstrou que investimentos compartilhados (memórias, rituais, projetos de vida) consolidam o compromisso de longo prazo muito mais do que a empolgação passageira.',
    },
  },
  {
    id: 'tr_8',
    dimension: 'investment_commitment',
    frameworkRef: {
      es: 'Rusbult & Drigotas et al. (1999) — Compromiso Activo',
      'pt-BR': 'Rusbult & Drigotas et al. (1999) — Compromisso Ativo',
    },
    prompt: {
      es: 'Cuando aparece el aburrimiento o la rutina en pareja, ¿cuál suele ser la reacción principal?',
      'pt-BR': 'Quando o tédio ou a rotina aparecem no casal, qual costuma ser a reação principal?',
    },
    options: [
      { id: 'tr_8_a', emoji: '🚀', label: { es: 'Inventamos novedades juntos (juegos, citas, sorpresas) dentro de la pareja', 'pt-BR': 'Inventamos novidades juntos (jogos, encontros, surpresas) dentro do casal' }, points: 95 },
      { id: 'tr_8_b', emoji: '💬', label: { es: 'Lo conversamos con honestidad aunque a veces nos cueste arrancar', 'pt-BR': 'Conversamos com honestidade, mesmo que às vezes demore para engrenar' }, points: 70 },
      { id: 'tr_8_c', emoji: '😶', label: { es: 'Nos resignamos en silencio y cada uno se refugia en sus pantallas', 'pt-BR': 'Nos conformamos em silêncio e cada um se refugia nas próprias telas' }, points: 40 },
      { id: 'tr_8_d', emoji: '🌪️', label: { es: 'Aparece la tentación de buscar emoción o novedad fuera del vínculo', 'pt-BR': 'Surge a tentação de buscar emoção ou novidade fora do vínculo' }, points: 15 },
    ],
    scientificNote: {
      es: 'La evidencia del Modelo de Inversión indica que renovar la novedad dentro de la pareja eleva la satisfacción y disminuye la vulnerabilidad a buscar validación afuera.',
      'pt-BR': 'A evidência do Modelo de Investimento indica que renovar a novidade dentro do casal eleva a satisfação e reduz a vulnerabilidade a buscar validação externa.',
    },
  },

  // =========================================================================
  // 3. DAILY ATTUNEMENT & REPAIR (Gottman; Fincham & May, 2017)
  // =========================================================================
  {
    id: 'tr_9',
    dimension: 'attunement_repair',
    frameworkRef: {
      es: 'John & Julie Gottman — Bids & Sliding Door Moments',
      'pt-BR': 'John & Julie Gottman — Bids & Sliding Door Moments',
    },
    prompt: {
      es: 'En los pequeños momentos del día ("mira esto", un suspiro, una broma), ¿con qué frecuencia se giran uno hacia el otro?',
      'pt-BR': 'Nos pequenos momentos do dia ("olha isso", um suspiro, uma piada), com que frequência vocês se voltam um para o outro?',
    },
    options: [
      { id: 'tr_9_a', emoji: '💫', label: { es: 'Casi siempre: nos prestamos atención real aunque sea 30 segundos', 'pt-BR': 'Quase sempre: damos atenção real mesmo que por 30 segundos' }, points: 95 },
      { id: 'tr_9_b', emoji: '🙂', label: { es: 'A menudo, aunque el celular o el cansancio a veces nos distraen', 'pt-BR': 'Com frequência, embora o celular ou o cansaço às vezes atrapalhem' }, points: 70 },
      { id: 'tr_9_c', emoji: '📵', label: { es: 'Muchas veces nos respondemos en piloto automático sin mirarnos', 'pt-BR': 'Muitas vezes respondemos no piloto automático sem nos olhar' }, points: 40 },
      { id: 'tr_9_d', emoji: '❄️', label: { es: 'Siento que mis intentos de conexión suelen quedar en el aire o ignorados', 'pt-BR': 'Sinto que minhas tentativas de conexão costumam ficar no vácuo' }, points: 15 },
    ],
    scientificNote: {
      es: 'En el Love Lab de Gottman, las parejas duraderas responden positivamente a los pequeños intentos de conexión el 86% de las veces, frente al 33% en parejas que se distancian.',
      'pt-BR': 'No Love Lab de Gottman, casais duradouros respondem positivamente às pequenas tentativas de conexão em 86% das vezes, contra 33% nos casais que se distanciam.',
    },
  },
  {
    id: 'tr_10',
    dimension: 'attunement_repair',
    frameworkRef: {
      es: 'Gottman & Fincham & May (2017) — Intentos de Reparación',
      'pt-BR': 'Gottman & Fincham & May (2017) — Tentativas de Reparação',
    },
    prompt: {
      es: 'Después de una discusión tensa, ¿cómo logran volver a acercarse y reparar el vínculo?',
      'pt-BR': 'Depois de uma discussão tensa, como vocês conseguem se reaproximar e reparar o vínculo?',
    },
    options: [
      { id: 'tr_10_a', emoji: '🕊️', label: { es: 'Alguien tiende un puente (perdón, humor, abrazo) y el otro lo recibe bien', 'pt-BR': 'Alguém estende a ponte (desculpa, humor, abraço) e o outro acolhe bem' }, points: 95 },
      { id: 'tr_10_b', emoji: '⏳', label: { es: 'Necesitamos enfriarnos un rato, pero luego hablamos y cerramos el tema', 'pt-BR': 'Precisamos esfriar a cabeça um pouco, mas depois conversamos e resolvemos' }, points: 70 },
      { id: 'tr_10_c', emoji: '🔁', label: { es: 'Caemos en el ciclo de uno reclama y el otro se encierra o evade', 'pt-BR': 'Caímos no ciclo em que um cobra e o outro se fecha ou foge' }, points: 40 },
      { id: 'tr_10_d', emoji: '🧱', label: { es: 'Guardamos silencio frío días enteros y acumulamos rencor sin reparar', 'pt-BR': 'Ficamos em silêncio frio por dias e acumulamos mágoa sem reparar' }, points: 15 },
    ],
    scientificNote: {
      es: 'La revisión empírica de Fincham y May (2017) muestra que los patrones de comunicación negativos (demanda-retirada y falta de reparación) son predictores clave de vulnerabilidad relacional.',
      'pt-BR': 'A revisão empírica de Fincham e May (2017) mostra que padrões negativos de comunicação (cobrança-afastamento e falta de reparação) são preditores-chave de vulnerabilidade relacional.',
    },
  },
  {
    id: 'tr_11',
    dimension: 'attunement_repair',
    frameworkRef: {
      es: 'Fincham & May (2017) — Validación Emocional',
      'pt-BR': 'Fincham & May (2017) — Validação Emocional',
    },
    prompt: {
      es: 'Cuando expresas una inseguridad, miedo o necesidad, ¿sientes que tu pareja la valida sin burlarse ni ponerse a la defensiva?',
      'pt-BR': 'Quando você expressa uma insegurança, medo ou necessidade, sente que seu par valida sem ironia nem defensividade?',
    },
    options: [
      { id: 'tr_11_a', emoji: '🫶', label: { es: 'Sí, puedo mostrarme vulnerable sabiendo que me cuida', 'pt-BR': 'Sim, posso me mostrar vulnerável sabendo que serei acolhido(a)' }, points: 95 },
      { id: 'tr_11_b', emoji: '💛', label: { es: 'Casi siempre, aunque en temas sensibles a veces nos cuesta bajar la guardia', 'pt-BR': 'Quase sempre, embora em temas sensíveis às vezes custe baixar a guarda' }, points: 70 },
      { id: 'tr_11_c', emoji: '🛡️', label: { es: 'Con frecuencia siento que minimizan lo que siento o me dicen que exagero', 'pt-BR': 'Com frequência sinto que minimizam o que sinto ou dizem que exagero' }, points: 40 },
      { id: 'tr_11_d', emoji: '🤐', label: { es: 'Dejé de expresar lo que siento porque termina en crítica o desprecio', 'pt-BR': 'Parei de expressar o que sinto porque vira crítica ou desprezo' }, points: 15 },
    ],
    scientificNote: {
      es: 'Según Fincham y May (2017) y Gottman, la invalidación crónica erosiona el apego seguro; en cambio, sentirse validado es el antídoto más fuerte contra el distanciamiento emocional.',
      'pt-BR': 'Segundo Fincham e May (2017) e Gottman, a invalidação crônica desgasta o apego seguro; por outro lado, sentir-se validado é o antídoto mais forte contra o distanciamento emocional.',
    },
  },
  {
    id: 'tr_12',
    dimension: 'attunement_repair',
    frameworkRef: {
      es: 'John Gottman — Métrica de Confianza ("¿Estás ahí para mí?")',
      'pt-BR': 'John Gottman — Métrica de Confiança ("Você está aqui por mim?")',
    },
    prompt: {
      es: 'En los días difíciles o de mucho estrés externo, ¿sientes que son un equipo real espalda con espalda?',
      'pt-BR': 'Nos dias difíceis ou de muito estresse externo, você sente que vocês são um time real lado a lado?',
    },
    options: [
      { id: 'tr_12_a', emoji: '🤝', label: { es: 'Totalmente: sé que puedo contar con mi pareja cuando más importa', 'pt-BR': 'Totalmente: sei que posso contar com meu par quando mais importa' }, points: 95 },
      { id: 'tr_12_b', emoji: '🌤️', label: { es: 'Sí en lo importante, aunque a veces falta preguntar cómo estamos por dentro', 'pt-BR': 'Sim no que importa, mas às vezes falta perguntar como estamos por dentro' }, points: 70 },
      { id: 'tr_12_c', emoji: '🌫️', label: { es: 'A veces me siento solo/a incluso estando en la misma habitación', 'pt-BR': 'Às vezes me sinto só mesmo estando no mesmo cômodo' }, points: 40 },
      { id: 'tr_12_d', emoji: '💔', label: { es: 'Siento que cada uno carga con su mundo y no nos respaldamos emocionalmente', 'pt-BR': 'Sinto que cada um carrega seu mundo sozinho e não nos apoiamos' }, points: 15 },
    ],
    scientificNote: {
      es: 'Para John Gottman, la confianza no se construye en grandes promesas sino en la sintonía emocional: responder consistentemente a la pregunta silenciosa "¿estás ahí para mí?".',
      'pt-BR': 'Para John Gottman, a confiança não nasce em grandes promessas, mas na sintonia emocional: responder com consistência à pergunta silenciosa "você está aqui por mim?".',
    },
  },

  // =========================================================================
  // 4. CLEAR AGREEMENTS: EMOTIONAL & PHYSICAL FIDELITY (Fisher et al. & Attachment)
  // =========================================================================
  {
    id: 'tr_13',
    dimension: 'clear_agreements',
    frameworkRef: {
      es: 'Maryanne Fisher et al. — Fidelidad Emocional y Física',
      'pt-BR': 'Maryanne Fisher et al. — Fidelidade Emocional e Física',
    },
    prompt: {
      es: '¿Han conversado alguna vez con claridad qué conductas consideran "cruzar la línea" (física, emocional y digitalmente)?',
      'pt-BR': 'Vocês já conversaram com clareza sobre quais atitudes consideram "passar dos limites" (física, emocional e digitalmente)?',
    },
    options: [
      { id: 'tr_13_a', emoji: '📜', label: { es: 'Sí, tenemos acuerdos claros y los actualizamos con respeto si hace falta', 'pt-BR': 'Sim, temos acordos claros e os atualizamos com respeito quando precisa' }, points: 95 },
      { id: 'tr_13_b', emoji: '💬', label: { es: 'Hablamos lo obvio, pero quedaron zonas grises (redes, chats) sin definir', 'pt-BR': 'Falamos o óbvio, mas ficaram zonas cinzentas (redes, chats) sem definir' }, points: 70 },
      { id: 'tr_13_c', emoji: '🤷', label: { es: 'Nunca lo hablamos directamente; asumimos que pensamos igual', 'pt-BR': 'Nunca falamos diretamente; presumimos que pensamos igual' }, points: 40 },
      { id: 'tr_13_d', emoji: '⚡', label: { es: 'Tenemos visiones opuestas que ya causaron heridas y siguen sin acuerdo', 'pt-BR': 'Temos visões opostas que já causaram mágoas e seguem sem acordo' }, points: 15 },
    ],
    scientificNote: {
      es: 'Las investigaciones de Maryanne Fisher et al. muestran que casi todos coinciden en qué es fidelidad física, pero la fidelidad emocional y digital es ambigua si la pareja no la acuerda explícitamente.',
      'pt-BR': 'As pesquisas de Maryanne Fisher et al. mostram que quase todos concordam sobre fidelidade física, mas a fidelidade emocional e digital é ambígua se o casal não a combinar explicitamente.',
    },
  },
  {
    id: 'tr_14',
    dimension: 'clear_agreements',
    frameworkRef: {
      es: 'Fisher et al. — Micro-transgresiones Digitales',
      'pt-BR': 'Fisher et al. — Microtransgressões Digitais',
    },
    prompt: {
      es: 'Respecto al contacto con ex-parejas o vínculos del pasado en redes o mensajería, ¿cómo está hoy su acuerdo?',
      'pt-BR': 'Em relação ao contato com ex-parceiros(as) ou vínculos do passado nas redes ou mensagens, como está o acordo hoje?',
    },
    options: [
      { id: 'tr_14_a', emoji: '🧭', label: { es: 'Acordado y tranquilo: hay límites claros y transparencia sin dramas', 'pt-BR': 'Combinado e tranquilo: há limites claros e transparência sem drama' }, points: 95 },
      { id: 'tr_14_b', emoji: '🙂', label: { es: 'No suele ser tema, aunque vendría bien alinear expectativas por si pasa', 'pt-BR': 'Não costuma ser problema, mas seria bom alinhar expectativas caso ocorra' }, points: 70 },
      { id: 'tr_14_c', emoji: '🤔', label: { es: 'Hay interacciones ocasionales que generan dudas, pero preferimos no tocarlo', 'pt-BR': 'Há interações ocasionais que geram dúvida, mas evitamos tocar no assunto' }, points: 40 },
      { id: 'tr_14_d', emoji: '🚩', label: { es: 'Existen contactos a escondidas o comparaciones que lastiman la confianza', 'pt-BR': 'Existem contatos escondidos ou comparações que machucam a confiança' }, points: 15 },
    ],
    scientificNote: {
      es: 'En psicología de pareja actual, las micro-transgresiones digitales (como chats ocultos) dañan la seguridad no por el contacto social en sí, sino por el secreto que rompe el pacto implícito.',
      'pt-BR': 'Na psicologia de casais atual, microtransgressões digitais (como chats escondidos) ferem a segurança não pelo contato social em si, mas pelo segredo que quebra o pacto implícito.',
    },
  },
  {
    id: 'tr_15',
    dimension: 'clear_agreements',
    frameworkRef: {
      es: 'Fisher et al. & Glass — Límites Sociales y Coqueteo',
      'pt-BR': 'Fisher et al. & Glass — Limites Sociais e Flerte',
    },
    prompt: {
      es: 'En salidas sociales o en el trabajo, cuando surge coqueteo sutil con terceros, ¿tienen claro dónde empieza el respeto a la pareja?',
      'pt-BR': 'Em saídas sociais ou no trabalho, quando surge um flerte sutil com terceiros, vocês têm claro onde começa o respeito ao casal?',
    },
    options: [
      { id: 'tr_15_a', emoji: '💎', label: { es: 'Sí, ambos protegemos el respeto mutuo estemos juntos o por separado', 'pt-BR': 'Sim, ambos protegemos o respeito mútuo estando juntos ou separados' }, points: 95 },
      { id: 'tr_15_b', emoji: '🌤️', label: { es: 'En general sí, aunque nunca hemos aclarado pequeños detalles sociales', 'pt-BR': 'Em geral sim, embora nunca tenhamos detalhado pequenos limites sociais' }, points: 70 },
      { id: 'tr_15_c', emoji: '🙃', label: { es: 'A veces uno lo ve como un juego inofensivo y al otro le duele', 'pt-BR': 'Às vezes um vê como brincadeira inofensiva e o outro se machuca' }, points: 40 },
      { id: 'tr_15_d', emoji: '⚠️', label: { es: 'Se cruzan límites con frecuencia y luego se culpa al otro de "celoso/a"', 'pt-BR': 'Limites são cruzados com frequência e depois o outro é chamado de "ciumento(a)"' }, points: 15 },
    ],
    scientificNote: {
      es: 'Estudios sobre fidelidad emocional señalan que explicitar límites sociales evita heridas ambiguas y elimina el desgaste de interpretar intenciones a ciegas.',
      'pt-BR': 'Estudos sobre fidelidade emocional apontam que explicitar limites sociais evita mágoas ambíguas e elimina o desgaste de tentar adivinhar intenções.',
    },
  },
  {
    id: 'tr_16',
    dimension: 'clear_agreements',
    frameworkRef: {
      es: 'Teoría del Apego y Metacomunicación Preventiva',
      'pt-BR': 'Teoria do Apego e Metacomunicação Preventiva',
    },
    prompt: {
      es: '¿Con qué facilidad pueden tener una charla tranquila sobre celos, límites o deseos de exclusividad sin que termine en pelea?',
      'pt-BR': 'Com que facilidade vocês conseguem ter uma conversa tranquila sobre ciúmes, limites ou exclusividade sem virar briga?',
    },
    options: [
      { id: 'tr_16_a', emoji: '🕊️', label: { es: 'Con mucha calma: podemos hablar de límites cuidándonos mutuamente', 'pt-BR': 'Com muita calma: conseguimos falar de limites cuidando um do outro' }, points: 95 },
      { id: 'tr_16_b', emoji: '💬', label: { es: 'Cuesta un poquito al inicio, pero logramos escucharnos con respeto', 'pt-BR': 'Custa um pouco no início, mas conseguimos nos ouvir com respeito' }, points: 70 },
      { id: 'tr_16_c', emoji: '🤐', label: { es: 'Evitamos el tema por miedo a sonar controladores o desconfiados', 'pt-BR': 'Evitamos o assunto por medo de parecer controladores ou desconfiados' }, points: 40 },
      { id: 'tr_16_d', emoji: '🔥', label: { es: 'Cada intento de hablar de acuerdos explota en reproches o silencios', 'pt-BR': 'Cada tentativa de falar de acordos explode em cobranças ou silêncio' }, points: 15 },
    ],
    scientificNote: {
      es: 'La investigación sobre apego seguro muestra que hablar preventivamente sobre acuerdos reduce la ansiedad relacional y protege contra cruces accidentales de límites.',
      'pt-BR': 'A pesquisa sobre apego seguro mostra que falar preventivamente sobre acordos reduz a ansiedade relacional e protege contra ultrapassagens acidentais de limites.',
    },
  },
];
