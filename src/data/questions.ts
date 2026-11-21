import type { Question } from '../types/liber.ts';

export const QUESTION_BANK: Question[] = [
  // =========================================================================
  // 1. ROMANTIC MOOD (8 questions)
  // =========================================================================
  {
    id: 'rm_1',
    category: 'romantic_mood',
    prompt: {
      es: '¿Tu corazón está encendido, tibio o en modo avión?',
      'pt-BR': 'Seu coração está aceso, morninho ou em modo avião?',
    },
    options: [
      { id: 'rm_1_a', emoji: '🔥', label: { es: '¡Encendido y con chispas!', 'pt-BR': 'Aceso e soltando faíscas!' }, points: 95, affectionTag: 'playful_tease' },
      { id: 'rm_1_b', emoji: '☀️', label: { es: 'Tibio, con ganas de mimos', 'pt-BR': 'Morninho, com vontade de carinho' }, points: 65, affectionTag: 'cuddles' },
      { id: 'rm_1_c', emoji: '🌤️', label: { es: 'Neutral, esperando inspiración', 'pt-BR': 'Neutro, esperando inspiração' }, points: 50, affectionTag: 'deep_talk' },
      { id: 'rm_1_d', emoji: '✈️', label: { es: 'Modo avión, necesito paz', 'pt-BR': 'Modo avião, preciso de paz' }, points: 20, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'rm_2',
    category: 'romantic_mood',
    prompt: {
      es: 'Si tu pareja te invita a una cita romántica hoy, ¿qué contestas?',
      'pt-BR': 'Se seu par te convidar para um encontro romântico hoje, o que você responde?',
    },
    options: [
      { id: 'rm_2_a', emoji: '💃', label: { es: '¡Me cambio ya mismo!', 'pt-BR': 'Já estou me arrumando!' }, points: 92, affectionTag: 'romantic_date' },
      { id: 'rm_2_b', emoji: '🍕', label: { es: 'Sí, pero en pijama en el sofá', 'pt-BR': 'Sim, mas de pijama no sofá' }, points: 60, affectionTag: 'movie_chill' },
      { id: 'rm_2_c', emoji: '🤔', label: { es: 'Depende del plan y la hora', 'pt-BR': 'Depende do plano e da hora' }, points: 48, isUnsure: true },
      { id: 'rm_2_d', emoji: '🛌', label: { es: 'Hoy paso, prefiero descansar', 'pt-BR': 'Hoje passo, prefiro descansar' }, points: 18, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'rm_3',
    category: 'romantic_mood',
    prompt: {
      es: '¿Qué banda sonora define tu ánimo amoroso hoy?',
      'pt-BR': 'Qual trilha sonora define seu clima amoroso hoje?',
    },
    options: [
      { id: 'rm_3_a', emoji: '🎷', label: { es: 'Bolero / R&B sensual', 'pt-BR': 'MPB / R&B sensual' }, points: 88, affectionTag: 'romantic_date' },
      { id: 'rm_3_b', emoji: '🎸', label: { es: 'Pop alegre para cantar juntos', 'pt-BR': 'Pop animado para cantar juntos' }, points: 68, affectionTag: 'playful_tease' },
      { id: 'rm_3_c', emoji: '🎹', label: { es: 'Lo-fi suave para abrazarnos', 'pt-BR': 'Lo-fi suave para nos abraçar' }, points: 45, affectionTag: 'cuddles' },
      { id: 'rm_3_d', emoji: '🌧️', label: { es: 'Sonido de lluvia y silencio', 'pt-BR': 'Som de chuva e silêncio' }, points: 22, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'rm_4',
    category: 'romantic_mood',
    prompt: {
      es: 'Si el romance fuera el clima de hoy, ¿cómo estaría el cielo?',
      'pt-BR': 'Se o romance fosse o clima de hoje, como estaria o céu?',
    },
    options: [
      { id: 'rm_4_a', emoji: '🌋', label: { es: 'Calorcito tropical intenso', 'pt-BR': 'Calorzinho tropical intenso' }, points: 90 },
      { id: 'rm_4_b', emoji: '🌅', label: { es: 'Atardecer dorado muy dulce', 'pt-BR': 'Pôr do sol dourado bem doce' }, points: 68, affectionTag: 'kisses' },
      { id: 'rm_4_c', emoji: '☁️', label: { es: 'Nublado pero agradable', 'pt-BR': 'Nublado, mas agradável' }, points: 48 },
      { id: 'rm_4_d', emoji: '❄️', label: { es: 'Nieve y cobija hasta la nariz', 'pt-BR': 'Friozinho e cobertor até o nariz' }, points: 20, affectionTag: 'movie_chill' },
    ],
  },
  {
    id: 'rm_5',
    category: 'romantic_mood',
    prompt: {
      es: '¿Qué tan receptivo/a estás a una sorpresa romántica hoy?',
      'pt-BR': 'Quão receptivo(a) você está para uma surpresa romântica hoje?',
    },
    options: [
      { id: 'rm_5_a', emoji: '🎁', label: { es: '¡Me encantaría muchísimo!', 'pt-BR': 'Eu ia amar demais!' }, points: 86, affectionTag: 'romantic_date' },
      { id: 'rm_5_b', emoji: '🍫', label: { es: 'Un detallito dulce me derrite', 'pt-BR': 'Um mimo doce me derrete' }, points: 65, affectionTag: 'cuddles' },
      { id: 'rm_5_c', emoji: '🙂', label: { es: 'Solo si es algo tranquilo', 'pt-BR': 'Só se for algo bem tranquilo' }, points: 44 },
      { id: 'rm_5_d', emoji: '🛑', label: { es: 'Hoy prefiero cero sorpresas', 'pt-BR': 'Hoje prefiro zero surpresas' }, points: 20 },
    ],
  },
  {
    id: 'rm_6',
    category: 'romantic_mood',
    prompt: {
      es: '¿Qué nivel de mariposas en el estómago sientes por tu pareja hoy?',
      'pt-BR': 'Qual o nível de borboletas no estômago pelo seu par hoje?',
    },
    options: [
      { id: 'rm_6_a', emoji: '🦋', label: { es: '¡Un zoológico entero volando!', 'pt-BR': 'Um jardim inteiro voando!' }, points: 92 },
      { id: 'rm_6_b', emoji: '💓', label: { es: 'Unas cuantas haciendo cosquillas', 'pt-BR': 'Algumas fazendo cócegas' }, points: 66 },
      { id: 'rm_6_c', emoji: '🐢', label: { es: 'Amor tranquilo y sereno', 'pt-BR': 'Amor tranquilo e sereno' }, points: 46, affectionTag: 'deep_talk' },
      { id: 'rm_6_d', emoji: '🐻', label: { es: 'Las mariposas están durmiendo', 'pt-BR': 'As borboletas estão dormindo' }, points: 24, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'rm_7',
    category: 'romantic_mood',
    prompt: {
      es: 'Si hoy tuvieran una escena de película, ¿cuál elegirías?',
      'pt-BR': 'Se hoje vocês tivessem uma cena de filme, qual escolheria?',
    },
    options: [
      { id: 'rm_7_a', emoji: '💋', label: { es: 'Beso apasionado bajo la lluvia', 'pt-BR': 'Beijo apaixonado na chuva' }, points: 94, affectionTag: 'kisses' },
      { id: 'rm_7_b', emoji: '🍷', label: { es: 'Cena con velas y risas', 'pt-BR': 'Jantar à luz de velas e risadas' }, points: 72, affectionTag: 'romantic_date' },
      { id: 'rm_7_c', emoji: '🍿', label: { es: 'Comedia romántica en el sillón', 'pt-BR': 'Comédia romântica no sofá' }, points: 46, affectionTag: 'movie_chill' },
      { id: 'rm_7_d', emoji: '😴', label: { es: 'Documental relajante hasta dormir', 'pt-BR': 'Documentário relaxante até dormir' }, points: 18, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'rm_8',
    category: 'romantic_mood',
    prompt: {
      es: '¿Cómo describirías tus ganas de romance en este instante?',
      'pt-BR': 'Como você descreveria sua vontade de romance neste instante?',
    },
    options: [
      { id: 'rm_8_a', emoji: '💘', label: { es: 'Altísimas, ¡quiero chispas!', 'pt-BR': 'Altíssima, quero faíscas!' }, points: 90 },
      { id: 'rm_8_b', emoji: '🌷', label: { es: 'Moderadas, con cariño suave', 'pt-BR': 'Moderada, com carinho suave' }, points: 62 },
      { id: 'rm_8_c', emoji: '🌫️', label: { es: 'Todavía no lo sé', 'pt-BR': 'Ainda não sei dizer' }, points: 45, isUnsure: true },
      { id: 'rm_8_d', emoji: '🍵', label: { es: 'Bajas, prefiero calma total', 'pt-BR': 'Baixa, prefiro calma total' }, points: 20 },
    ],
  },

  // =========================================================================
  // 2. PHYSICAL AFFECTION (8 questions)
  // =========================================================================
  {
    id: 'pa_1',
    category: 'physical_affection',
    prompt: {
      es: '¿Hoy estás para besitos o para dormir como un tronco?',
      'pt-BR': 'Hoje você está para beijinhos ou para dormir feito pedra?',
    },
    options: [
      { id: 'pa_1_a', emoji: '😘', label: { es: '¡Muchos besitos y más!', 'pt-BR': 'Muitos beijinhos e mais!' }, points: 92, affectionTag: 'kisses' },
      { id: 'pa_1_b', emoji: '🫂', label: { es: 'Besitos tiernos y abrazos', 'pt-BR': 'Beijinhos fofos e abraços' }, points: 64, affectionTag: 'cuddles' },
      { id: 'pa_1_c', emoji: '🦥', label: { es: 'Un besito de buenas noches y ya', 'pt-BR': 'Um beijinho de boa noite e só' }, points: 36, affectionTag: 'space_rest' },
      { id: 'pa_1_d', emoji: '🪵', label: { es: 'Modo tronco absoluto', 'pt-BR': 'Modo pedra absoluto' }, points: 15, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'pa_2',
    category: 'physical_affection',
    prompt: {
      es: '¿Qué prefieres ahora: abrazos, una película, un masaje o descansar?',
      'pt-BR': 'O que prefere agora: abraços, um filme, uma massagem ou descansar?',
    },
    options: [
      { id: 'pa_2_a', emoji: '💆', label: { es: 'Un masaje que encienda chispas', 'pt-BR': 'Uma massagem que acenda o clima' }, points: 84, affectionTag: 'massage' },
      { id: 'pa_2_b', emoji: '🫂', label: { es: 'Abrazos largos sin prisa', 'pt-BR': 'Abraços demorados sem pressa' }, points: 60, affectionTag: 'cuddles' },
      { id: 'pa_2_c', emoji: '🎬', label: { es: 'Película acurrucados', 'pt-BR': 'Filme agarradinhos' }, points: 45, affectionTag: 'movie_chill' },
      { id: 'pa_2_d', emoji: '😴', label: { es: 'Descansar tranquilamente', 'pt-BR': 'Descansar tranquilamente' }, points: 20, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'pa_3',
    category: 'physical_affection',
    prompt: {
      es: 'Si tu pareja te hace cariñitos en el pelo o la espalda ahora, ¿cómo reaccionas?',
      'pt-BR': 'Se seu par fizer cafuné ou carinho nas costas agora, como você reage?',
    },
    options: [
      { id: 'pa_3_a', emoji: '😻', label: { es: 'Ronroneo y me acerco más', 'pt-BR': 'Ronrono e chego mais perto' }, points: 86, affectionTag: 'cuddles' },
      { id: 'pa_3_b', emoji: '🥰', label: { es: 'Me relaja y me encanta', 'pt-BR': 'Me relaxa e eu adoro' }, points: 62, affectionTag: 'massage' },
      { id: 'pa_3_c', emoji: '😌', label: { es: 'Lindo, pero me da sueño', 'pt-BR': 'Gostoso, mas me dá sono' }, points: 38, affectionTag: 'space_rest' },
      { id: 'pa_3_d', emoji: '🙅', label: { es: 'Ahora prefiero mi espacio físico', 'pt-BR': 'Agora prefiro meu espaço físico' }, points: 12, isBoundaryNo: true },
    ],
  },
  {
    id: 'pa_4',
    category: 'physical_affection',
    prompt: {
      es: '¿Qué tipo de abrazo necesitas hoy?',
      'pt-BR': 'Que tipo de abraço você precisa hoje?',
    },
    options: [
      { id: 'pa_4_a', emoji: '🔥', label: { es: 'Abrazo apretado con intención', 'pt-BR': 'Abraço apertado com segundas intenções' }, points: 90, affectionTag: 'cuddles' },
      { id: 'pa_4_b', emoji: '🧸', label: { es: 'Abrazo de oso protector', 'pt-BR': 'Abraço de urso protetor' }, points: 58, affectionTag: 'cuddles' },
      { id: 'pa_4_c', emoji: '🤝', label: { es: 'Un apretón de manos cariñoso', 'pt-BR': 'Um aperto de mão carinhoso' }, points: 35 },
      { id: 'pa_4_d', emoji: '🫧', label: { es: 'Abrazo virtual desde mi burbuja', 'pt-BR': 'Abraço virtual da minha bolha' }, points: 15 },
    ],
  },
  {
    id: 'pa_5',
    category: 'physical_affection',
    prompt: {
      es: '¿Cómo está tu medidor de "ganas de cucharita"?',
      'pt-BR': 'Como está seu medidor de "vontade de conchinha"?',
    },
    options: [
      { id: 'pa_5_a', emoji: '🥄', label: { es: '¡Cucharita con final picante!', 'pt-BR': 'Conchinha com final picante!' }, points: 90 },
      { id: 'pa_5_b', emoji: '🛋️', label: { es: 'Cucharita dulce para charlar', 'pt-BR': 'Conchinha doce para conversar' }, points: 60, affectionTag: 'cuddles' },
      { id: 'pa_5_c', emoji: '💤', label: { es: 'Cucharita solo para dormir', 'pt-BR': 'Conchinha só para dormir' }, points: 32, affectionTag: 'space_rest' },
      { id: 'pa_5_d', emoji: '🛏️', label: { es: 'Hoy cada quien en su lado', 'pt-BR': 'Hoje cada um no seu canto' }, points: 16 },
    ],
  },
  {
    id: 'pa_6',
    category: 'physical_affection',
    prompt: {
      es: 'Si te dan un beso en el cuello ahora mismo...',
      'pt-BR': 'Se te derem um beijo no pescoço agora mesmo...',
    },
    options: [
      { id: 'pa_6_a', emoji: '⚡', label: { es: '¡Se enciende el semáforo en verde!', 'pt-BR': 'O semáforo fica verde na hora!' }, points: 95, affectionTag: 'kisses' },
      { id: 'pa_6_b', emoji: '😊', label: { es: 'Me da cosquillas y me hace sonreír', 'pt-BR': 'Dá cócegas e me faz sorrir' }, points: 65, affectionTag: 'playful_tease' },
      { id: 'pa_6_c', emoji: '🤷', label: { es: 'Depende de cómo siga el momento', 'pt-BR': 'Depende de como o momento seguir' }, points: 48, isUnsure: true },
      { id: 'pa_6_d', emoji: '🙅', label: { es: 'Hoy no tengo ganas de eso', 'pt-BR': 'Hoje não estou a fim disso' }, points: 14, isBoundaryNo: true },
    ],
  },
  {
    id: 'pa_7',
    category: 'physical_affection',
    prompt: {
      es: '¿Cuánto contacto físico quieres en los próximos 30 minutos?',
      'pt-BR': 'Quanto contato físico você quer nos próximos 30 minutos?',
    },
    options: [
      { id: 'pa_7_a', emoji: '💞', label: { es: 'Todo el que quepa', 'pt-BR': 'Todo o que couber' }, points: 90, affectionTag: 'cuddles' },
      { id: 'pa_7_b', emoji: '🫶', label: { es: 'Mimos suaves sin apuro', 'pt-BR': 'Carinhos suaves sem pressa' }, points: 60, affectionTag: 'cuddles' },
      { id: 'pa_7_c', emoji: '☕', label: { es: 'Cerquita pero sin tanto roce', 'pt-BR': 'Pertinho, mas sem muito toque' }, points: 36 },
      { id: 'pa_7_d', emoji: '🧘', label: { es: 'Prefiero espacio personal ahora', 'pt-BR': 'Prefiro espaço pessoal agora' }, points: 15 },
    ],
  },
  {
    id: 'pa_8',
    category: 'physical_affection',
    prompt: {
      es: '¿Un masaje en los pies o en los hombros te cambiaría el ánimo?',
      'pt-BR': 'Uma massagem nos pés ou nos ombros mudaria seu humor?',
    },
    options: [
      { id: 'pa_8_a', emoji: '✨', label: { es: '¡Sí, me pondría muy romántico/a!', 'pt-BR': 'Sim, me deixaria bem romântico(a)!' }, points: 82, affectionTag: 'massage' },
      { id: 'pa_8_b', emoji: '💆', label: { es: 'Me ayudaría a relajarme mucho', 'pt-BR': 'Me ajudaria a relaxar bastante' }, points: 58, affectionTag: 'massage' },
      { id: 'pa_8_c', emoji: '😴', label: { es: 'Me dejaría dormido/a al instante', 'pt-BR': 'Eu dormiria na hora' }, points: 30, affectionTag: 'space_rest' },
      { id: 'pa_8_d', emoji: '🚫', label: { es: 'Hoy prefiero que no me toquen', 'pt-BR': 'Hoje prefiro não ser tocado(a)' }, points: 10, isBoundaryNo: true },
    ],
  },

  // =========================================================================
  // 3. EMOTIONAL CONNECTION (8 questions)
  // =========================================================================
  {
    id: 'ec_1',
    category: 'emotional_connection',
    prompt: {
      es: '¿Qué tan conectado/a emocionalmente te sientes con tu pareja hoy?',
      'pt-BR': 'Quão conectado(a) emocionalmente você se sente com seu par hoje?',
    },
    options: [
      { id: 'ec_1_a', emoji: '💫', label: { es: 'Súper conectados, en sintonía total', 'pt-BR': 'Super conectados, em sintonia total' }, points: 88, affectionTag: 'deep_talk' },
      { id: 'ec_1_b', emoji: '💛', label: { es: 'Bien, con ganas de charlar bonito', 'pt-BR': 'Bem, com vontade de conversar' }, points: 66, affectionTag: 'deep_talk' },
      { id: 'ec_1_c', emoji: '🌊', label: { es: 'Un poco distraído/a por el día', 'pt-BR': 'Um pouco distraído(a) pelo dia' }, points: 45 },
      { id: 'ec_1_d', emoji: '🔋', label: { es: 'Necesito recargarme primero', 'pt-BR': 'Preciso recarregar primeiro' }, points: 24, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'ec_2',
    category: 'emotional_connection',
    prompt: {
      es: '¿Qué haría que tu corazón se sienta más cerca hoy?',
      'pt-BR': 'O que faria seu coração se sentir mais perto hoje?',
    },
    options: [
      { id: 'ec_2_a', emoji: '👀', label: { es: 'Mirarnos a los ojos y reírnos', 'pt-BR': 'Olhar nos olhos e dar risada' }, points: 84, affectionTag: 'playful_tease' },
      { id: 'ec_2_b', emoji: '🗣️', label: { es: 'Que me escuche cómo fue mi día', 'pt-BR': 'Que me escute sobre o meu dia' }, points: 62, affectionTag: 'deep_talk' },
      { id: 'ec_2_c', emoji: '🧹', label: { es: 'Que resolvamos pendientes juntos', 'pt-BR': 'Resolvermos pendências juntos' }, points: 46 },
      { id: 'ec_2_d', emoji: '🕊️', label: { es: 'Un rato de calma sin hablar mucho', 'pt-BR': 'Um tempo de calma sem falar muito' }, points: 26 },
    ],
  },
  {
    id: 'ec_3',
    category: 'emotional_connection',
    prompt: {
      es: '¿Te sientes escuchado/a y valorado/a en este momento?',
      'pt-BR': 'Você se sente ouvido(a) e valorizado(a) neste momento?',
    },
    options: [
      { id: 'ec_3_a', emoji: '🥰', label: { es: '¡Sí, al 100%!', 'pt-BR': 'Sim, 100%!' }, points: 86 },
      { id: 'ec_3_b', emoji: '🌸', label: { es: 'Sí, aunque un mimo extra suma', 'pt-BR': 'Sim, mas um mimo extra ajuda' }, points: 64, affectionTag: 'cuddles' },
      { id: 'ec_3_c', emoji: '💭', label: { es: 'Me gustaría charlar un poquito', 'pt-BR': 'Gostaria de conversar um pouquinho' }, points: 44, affectionTag: 'deep_talk' },
      { id: 'ec_3_d', emoji: '🌧️', label: { es: 'Hoy me siento algo sensible', 'pt-BR': 'Hoje me sinto meio sensível' }, points: 22, affectionTag: 'cuddles' },
    ],
  },
  {
    id: 'ec_4',
    category: 'emotional_connection',
    prompt: {
      es: 'Si tu pareja te dice un cumplido sincero ahora, ¿qué pasa?',
      'pt-BR': 'Se seu par te fizer um elogio sincero agora, o que acontece?',
    },
    options: [
      { id: 'ec_4_a', emoji: '😍', label: { es: 'Me derrito y subo la temperatura', 'pt-BR': 'Eu derreto e o clima esquenta' }, points: 88, affectionTag: 'kisses' },
      { id: 'ec_4_b', emoji: '🥹', label: { es: 'Me llena el alma de ternura', 'pt-BR': 'Me enche a alma de ternura' }, points: 64, affectionTag: 'cuddles' },
      { id: 'ec_4_c', emoji: '😊', label: { es: 'Sonrío aunque esté cansado/a', 'pt-BR': 'Sorrio mesmo estando cansado(a)' }, points: 42 },
      { id: 'ec_4_d', emoji: '🐢', label: { es: 'Lo agradezco desde mi caparazón', 'pt-BR': 'Agradeço do meu casulo' }, points: 24 },
    ],
  },
  {
    id: 'ec_5',
    category: 'emotional_connection',
    prompt: {
      es: '¿Qué nivel de estrés traes de afuera hacia la casa hoy?',
      'pt-BR': 'Qual o nível de estresse que você trouxe da rua hoje?',
    },
    options: [
      { id: 'ec_5_a', emoji: '🍃', label: { es: 'Cero estrés, mente libre', 'pt-BR': 'Zero estresse, mente livre' }, points: 86 },
      { id: 'ec_5_b', emoji: '🌤️', label: { es: 'Poco, fácil de soltar', 'pt-BR': 'Pouco, fácil de soltar' }, points: 66 },
      { id: 'ec_5_c', emoji: '🌀', label: { es: 'Bastante, necesito desconectar', 'pt-BR': 'Bastante, preciso desconectar' }, points: 40, affectionTag: 'massage' },
      { id: 'ec_5_d', emoji: '🌋', label: { es: 'Día pesado, necesito apapacho suave', 'pt-BR': 'Dia pesado, preciso de colo suave' }, points: 20, affectionTag: 'cuddles' },
    ],
  },
  {
    id: 'ec_6',
    category: 'emotional_connection',
    prompt: {
      es: '¿Tienes ganas de compartir pensamientos profundos o solo risas ligeras?',
      'pt-BR': 'Está com vontade de papo profundo ou só risadas leves?',
    },
    options: [
      { id: 'ec_6_a', emoji: '🥂', label: { es: 'Risas, coqueteo y complicidad', 'pt-BR': 'Risadas, flerte e cumplicidade' }, points: 85, affectionTag: 'playful_tease' },
      { id: 'ec_6_b', emoji: '🌙', label: { es: 'Charla profunda abrazados', 'pt-BR': 'Papo profundo abraçados' }, points: 62, affectionTag: 'deep_talk' },
      { id: 'ec_6_c', emoji: '📺', label: { es: 'Algo ligero sin pensar mucho', 'pt-BR': 'Algo leve sem pensar muito' }, points: 42, affectionTag: 'movie_chill' },
      { id: 'ec_6_d', emoji: '🤫', label: { es: 'Modo silencio reparador', 'pt-BR': 'Modo silêncio reparador' }, points: 20, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'ec_7',
    category: 'emotional_connection',
    prompt: {
      es: '¿Sientes seguridad emocional para decir exactamente lo que quieres hoy?',
      'pt-BR': 'Sente segurança emocional para dizer exatamente o que quer hoje?',
    },
    options: [
      { id: 'ec_7_a', emoji: '💚', label: { es: 'Totalmente, sin filtros', 'pt-BR': 'Totalmente, sem filtros' }, points: 85 },
      { id: 'ec_7_b', emoji: '💛', label: { es: 'Sí, el semáforo me ayuda mucho', 'pt-BR': 'Sim, o semáforo me ajuda muito' }, points: 65 },
      { id: 'ec_7_c', emoji: '🤔', label: { es: 'Me cuesta un poco explicarlo hoy', 'pt-BR': 'Estou com dificuldade de explicar hoje' }, points: 44, isUnsure: true },
      { id: 'ec_7_d', emoji: '🛡️', label: { es: 'Prefiero ir muy despacito', 'pt-BR': 'Prefiro ir bem devagar' }, points: 25 },
    ],
  },
  {
    id: 'ec_8',
    category: 'emotional_connection',
    prompt: {
      es: '¿Qué gesto pequeño te haría sentir súper amado/a hoy?',
      'pt-BR': 'Que pequeno gesto faria você se sentir super amado(a) hoje?',
    },
    options: [
      { id: 'ec_8_a', emoji: '💌', label: { es: 'Un mensaje picante o romántico', 'pt-BR': 'Uma mensagem picante ou romântica' }, points: 88, affectionTag: 'playful_tease' },
      { id: 'ec_8_b', emoji: '☕', label: { es: 'Que me preparen algo rico', 'pt-BR': 'Prepararem algo gostoso para mim' }, points: 60 },
      { id: 'ec_8_c', emoji: '🫂', label: { es: 'Un abrazo de 20 segundos', 'pt-BR': 'Um abraço de 20 segundos' }, points: 52, affectionTag: 'cuddles' },
      { id: 'ec_8_d', emoji: '🛌', label: { es: 'Que me dejen dormir un poquito más', 'pt-BR': 'Deixarem eu dormir um pouquinho mais' }, points: 22, affectionTag: 'space_rest' },
    ],
  },

  // =========================================================================
  // 4. ENERGY AND TIREDNESS (8 questions)
  // =========================================================================
  {
    id: 'et_1',
    category: 'energy_tiredness',
    prompt: {
      es: '¿Cuánta batería te queda en el cuerpo ahora mismo?',
      'pt-BR': 'Quanta bateria ainda resta no seu corpo agora?',
    },
    options: [
      { id: 'et_1_a', emoji: '⚡', label: { es: '80–100% ¡Modo turbo!', 'pt-BR': '80–100% Modo turbo!' }, points: 92 },
      { id: 'et_1_b', emoji: '🔋', label: { es: '50–75% Suficiente para romance', 'pt-BR': '50–75% Suficiente para romance' }, points: 68 },
      { id: 'et_1_c', emoji: '🪫', label: { es: '25–45% Solo modo lento', 'pt-BR': '25–45% Só modo lento' }, points: 40, affectionTag: 'cuddles' },
      { id: 'et_1_d', emoji: '🔌', label: { es: 'Menos de 20% ¡Conéctenme a la cama!', 'pt-BR': 'Menos de 20% Me liguem na tomada!' }, points: 15, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'et_2',
    category: 'energy_tiredness',
    prompt: {
      es: 'Si la cama te llama ahora, ¿para qué te llama?',
      'pt-BR': 'Se a cama te chamar agora, para que ela te chama?',
    },
    options: [
      { id: 'et_2_a', emoji: '🔥', label: { es: '¡Para todo menos dormir!', 'pt-BR': 'Para tudo menos dormir!' }, points: 94 },
      { id: 'et_2_b', emoji: '😉', label: { es: 'Mimos y ver qué pasa', 'pt-BR': 'Carinhos e ver o que acontece' }, points: 64, affectionTag: 'cuddles' },
      { id: 'et_2_c', emoji: '📖', label: { es: 'Leer o ver algo tranqui', 'pt-BR': 'Ler ou assistir algo leve' }, points: 36, affectionTag: 'movie_chill' },
      { id: 'et_2_d', emoji: '💤', label: { es: 'Para hibernar hasta mañana', 'pt-BR': 'Para hibernar até amanhã' }, points: 12, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'et_3',
    category: 'energy_tiredness',
    prompt: {
      es: '¿Cómo están tus ojos en este momento?',
      'pt-BR': 'Como estão seus olhos neste momento?',
    },
    options: [
      { id: 'et_3_a', emoji: '✨', label: { es: 'Brillando y buscando travesuras', 'pt-BR': 'Brilhando e procurando travessuras' }, points: 90 },
      { id: 'et_3_b', emoji: '👀', label: { es: 'Despiertos y cariñosos', 'pt-BR': 'Abertos e carinhosos' }, points: 66 },
      { id: 'et_3_c', emoji: '🥱', label: { es: 'Un poco pesados ya', 'pt-BR': 'Meio pesados já' }, points: 34 },
      { id: 'et_3_d', emoji: '😴', label: { es: 'Se cierran solos', 'pt-BR': 'Fechando sozinhos' }, points: 14, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'et_4',
    category: 'energy_tiredness',
    prompt: {
      es: '¿Qué tan cansada está tu mente después del día de hoy?',
      'pt-BR': 'Quão cansada está sua mente depois do dia de hoje?',
    },
    options: [
      { id: 'et_4_a', emoji: '🎈', label: { es: 'Ligera y despejada', 'pt-BR': 'Leve e tranquila' }, points: 86 },
      { id: 'et_4_b', emoji: '☕', label: { es: 'Un poquito cansada, pero feliz', 'pt-BR': 'Um pouco cansada, mas feliz' }, points: 62 },
      { id: 'et_4_c', emoji: '🧠', label: { es: 'Necesito desconectar la cabeza', 'pt-BR': 'Preciso desligar a cabeça' }, points: 38, affectionTag: 'massage' },
      { id: 'et_4_d', emoji: '🫠', label: { es: 'Cerebro derretido, modo almohada', 'pt-BR': 'Cérebro derretido, modo travesseiro' }, points: 16, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'et_5',
    category: 'energy_tiredness',
    prompt: {
      es: '¿Tienes energía para una ducha juntos o prefieres pijama directo?',
      'pt-BR': 'Tem energia para um banho juntos ou prefere pijama direto?',
    },
    options: [
      { id: 'et_5_a', emoji: '🚿', label: { es: '¡Ducha juntos suena increíble!', 'pt-BR': 'Banho juntos parece incrível!' }, points: 92 },
      { id: 'et_5_b', emoji: '🛁', label: { es: 'Ducha relajante y mimos después', 'pt-BR': 'Banho relaxante e carinho depois' }, points: 64, affectionTag: 'cuddles' },
      { id: 'et_5_c', emoji: '🧦', label: { es: 'Pijama cómodo y calcetines', 'pt-BR': 'Pijama confortável e meias' }, points: 38, affectionTag: 'movie_chill' },
      { id: 'et_5_d', emoji: '🛏️', label: { es: 'Directo a la cama a dormir', 'pt-BR': 'Direto para a cama dormir' }, points: 16, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'et_6',
    category: 'energy_tiredness',
    prompt: {
      es: 'Si tu pareja toma toda la iniciativa para consentirte, ¿sube tu energía?',
      'pt-BR': 'Se seu par tomar toda a iniciativa para te mimar, sua energia sobe?',
    },
    options: [
      { id: 'et_6_a', emoji: '🚀', label: { es: '¡Sí! Me encanta cuando me consienten', 'pt-BR': 'Sim! Amo quando me mimam' }, points: 84, affectionTag: 'massage' },
      { id: 'et_6_b', emoji: '🌱', label: { es: 'Tal vez, si vamos sin apuro', 'pt-BR': 'Talvez, se formos sem pressa' }, points: 58, isUnsure: true },
      { id: 'et_6_c', emoji: '🧸', label: { es: 'Solo para mimos tranquilos', 'pt-BR': 'Só para carinhos tranquilos' }, points: 36, affectionTag: 'cuddles' },
      { id: 'et_6_d', emoji: '😴', label: { es: 'Ni con grúa me levantan hoy', 'pt-BR': 'Nem com guindaste hoje' }, points: 14, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'et_7',
    category: 'energy_tiredness',
    prompt: {
      es: '¿Cómo sientes el cuerpo físicamente hoy?',
      'pt-BR': 'Como você sente seu corpo fisicamente hoje?',
    },
    options: [
      { id: 'et_7_a', emoji: '💃', label: { es: 'Ágil y con ganas de moverme', 'pt-BR': 'Ágil e com disposição' }, points: 90 },
      { id: 'et_7_b', emoji: '🧘', label: { es: 'Cómodo y relajado', 'pt-BR': 'Confortável e relaxado' }, points: 65 },
      { id: 'et_7_c', emoji: '💆', label: { es: 'Un poco tenso, me vendría bien un masaje', 'pt-BR': 'Meio tenso, uma massagem cairia bem' }, points: 42, affectionTag: 'massage' },
      { id: 'et_7_d', emoji: '🩹', label: { es: 'Adolorido / agotado, necesito descanso', 'pt-BR': 'Dolorido / exausto, preciso descansar' }, points: 15, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'et_8',
    category: 'energy_tiredness',
    prompt: {
      es: '¿A qué hora se apaga tu "modo romántico" hoy?',
      'pt-BR': 'Que horas desliga o seu "modo romântico" hoje?',
    },
    options: [
      { id: 'et_8_a', emoji: '🦉', label: { es: '¡Hoy somos búhos nocturnos!', 'pt-BR': 'Hoje somos corujas da madrugada!' }, points: 92 },
      { id: 'et_8_b', emoji: '🌙', label: { es: 'Todavía tenemos buen rato', 'pt-BR': 'Ainda temos um bom tempo' }, points: 68 },
      { id: 'et_8_c', emoji: '⏰', label: { es: 'En un ratito, así que suave', 'pt-BR': 'Daqui a pouco, então bem leve' }, points: 44 },
      { id: 'et_8_d', emoji: '🌙', label: { es: 'Ya sonó la campana de dormir', 'pt-BR': 'Já bateu o sino de dormir' }, points: 16 },
    ],
  },

  // =========================================================================
  // 5. PLAYFUL FLIRTING (8 questions)
  // =========================================================================
  {
    id: 'pf_1',
    category: 'playful_flirting',
    prompt: {
      es: '¿Qué nivel de coqueteo quieres activar hoy?',
      'pt-BR': 'Qual nível de flerte você quer ativar hoje?',
    },
    options: [
      { id: 'pf_1_a', emoji: '😈', label: { es: 'Picante y travieso', 'pt-BR': 'Picante e travesso' }, points: 92, affectionTag: 'playful_tease' },
      { id: 'pf_1_b', emoji: '😉', label: { es: 'Guiños, bromas y risitas', 'pt-BR': 'Piscadinhas, piadas e risadinhas' }, points: 68, affectionTag: 'playful_tease' },
      { id: 'pf_1_c', emoji: '😇', label: { es: 'Modo angelito tierno', 'pt-BR': 'Modo anjinho fofo' }, points: 44, affectionTag: 'cuddles' },
      { id: 'pf_1_d', emoji: '🐼', label: { es: 'Modo panda comiendo bambú', 'pt-BR': 'Modo panda comendo bambu' }, points: 22 },
    ],
  },
  {
    id: 'pf_2',
    category: 'playful_flirting',
    prompt: {
      es: 'Si tu pareja te guiña un ojo desde el otro lado de la sala...',
      'pt-BR': 'Se seu par piscar para você do outro lado da sala...',
    },
    options: [
      { id: 'pf_2_a', emoji: '😏', label: { es: 'Le devuelvo una mirada peligrosa', 'pt-BR': 'Devolvo um olhar perigoso' }, points: 90, affectionTag: 'playful_tease' },
      { id: 'pf_2_b', emoji: '🤭', label: { es: 'Me río y me acerco a darle un beso', 'pt-BR': 'Dou risada e vou lá dar um beijo' }, points: 70, affectionTag: 'kisses' },
      { id: 'pf_2_c', emoji: '👋', label: { es: 'Le tiro un besito al aire', 'pt-BR': 'Mando um beijinho no ar' }, points: 48 },
      { id: 'pf_2_d', emoji: '🤓', label: { es: 'Pregunto si le entró algo al ojo', 'pt-BR': 'Pergunto se entrou cisco no olho' }, points: 25 },
    ],
  },
  {
    id: 'pf_3',
    category: 'playful_flirting',
    prompt: {
      es: '¿Qué emoji describe mejor tus intenciones de esta noche?',
      'pt-BR': 'Qual emoji descreve melhor suas intenções hoje?',
    },
    options: [
      { id: 'pf_3_a', emoji: '🔥', label: { es: 'Fuego total', 'pt-BR': 'Fogo total' }, points: 95 },
      { id: 'pf_3_b', emoji: '🍓', label: { es: 'Dulce pero con mordida', 'pt-BR': 'Doce mas com mordidinha' }, points: 72 },
      { id: 'pf_3_c', emoji: '🧸', label: { es: 'Puro peluche y ternura', 'pt-BR': 'Puro ursinho e ternura' }, points: 42, affectionTag: 'cuddles' },
      { id: 'pf_3_d', emoji: '🦥', label: { es: 'Perezoso en su rama', 'pt-BR': 'Bicho-preguiça no galho' }, points: 18, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'pf_4',
    category: 'playful_flirting',
    prompt: {
      es: '¿Te animarías a un juego de retos románticos suaves?',
      'pt-BR': 'Toparia um jogo de desafios românticos leves?',
    },
    options: [
      { id: 'pf_4_a', emoji: '🎲', label: { es: '¡Sí! Tira los dados ya', 'pt-BR': 'Sim! Joga os dados logo' }, points: 88, affectionTag: 'playful_tease' },
      { id: 'pf_4_b', emoji: '🃏', label: { es: 'Solo retos tiernos y graciosos', 'pt-BR': 'Só desafios fofos e engraçados' }, points: 62, affectionTag: 'cuddles' },
      { id: 'pf_4_c', emoji: '🤷', label: { es: 'Depende de qué reto sea', 'pt-BR': 'Depende do desafio' }, points: 48, isUnsure: true },
      { id: 'pf_4_d', emoji: '🛋️', label: { es: 'Hoy prefiero ser espectador/a', 'pt-BR': 'Hoje prefiro só assistir' }, points: 20 },
    ],
  },
  {
    id: 'pf_5',
    category: 'playful_flirting',
    prompt: {
      es: 'Si recibieras un mensaje secreto de tu pareja ahora, ¿qué te gustaría leer?',
      'pt-BR': 'Se recebesse uma mensagem secreta do seu par agora, o que gostaria de ler?',
    },
    options: [
      { id: 'pf_5_a', emoji: '🌶️', label: { es: '"Te espero en la habitación en 5 min"', 'pt-BR': '"Te espero no quarto em 5 min"' }, points: 95 },
      { id: 'pf_5_b', emoji: '😘', label: { es: '"Hoy estás irresistible"', 'pt-BR': '"Hoje você está irresistível"' }, points: 72, affectionTag: 'playful_tease' },
      { id: 'pf_5_c', emoji: '🍕', label: { es: '"Pedí tu comida favorita"', 'pt-BR': '"Pedi sua comida favorita"' }, points: 46 },
      { id: 'pf_5_d', emoji: '🛌', label: { es: '"Hoy te dejo descansar como rey/reina"', 'pt-BR': '"Hoje te deixo descansar como rei/rainha"' }, points: 20, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'pf_6',
    category: 'playful_flirting',
    prompt: {
      es: '¿Qué tan dispuesto/a estás a bailar lento en la sala sin música?',
      'pt-BR': 'Toparia dançar coladinho na sala mesmo sem música?',
    },
    options: [
      { id: 'pf_6_a', emoji: '💃', label: { es: '¡Saca a bailar ahora mismo!', 'pt-BR': 'Me tira para dançar agora!' }, points: 86, affectionTag: 'romantic_date' },
      { id: 'pf_6_b', emoji: '🎶', label: { es: 'Un minutito abrazados suena lindo', 'pt-BR': 'Um minutinho abraçados parece lindo' }, points: 64, affectionTag: 'cuddles' },
      { id: 'pf_6_c', emoji: '😄', label: { es: 'Me daría risa pero lo hago', 'pt-BR': 'Eu ia rir, mas topo' }, points: 50 },
      { id: 'pf_6_d', emoji: '🪑', label: { es: 'Mis pies están en huelga hoy', 'pt-BR': 'Meus pés estão em greve hoje' }, points: 20 },
    ],
  },
  {
    id: 'pf_7',
    category: 'playful_flirting',
    prompt: {
      es: '¿Cómo reaccionas si te roban un beso sorpresa en la cocina?',
      'pt-BR': 'Como reage se roubarem um beijo surpresa seu na cozinha?',
    },
    options: [
      { id: 'pf_7_a', emoji: '🔥', label: { es: '¡Devuelvo dos y no te suelto!', 'pt-BR': 'Devolvo dois e não solto mais!' }, points: 92, affectionTag: 'kisses' },
      { id: 'pf_7_b', emoji: '😊', label: { es: 'Me encanta, me alegra el día', 'pt-BR': 'Adoro, alegra o meu dia' }, points: 68, affectionTag: 'kisses' },
      { id: 'pf_7_c', emoji: '🍳', label: { es: 'Sonrío mientras cuido que no se queme nada', 'pt-BR': 'Sorrio cuidando para não queimar a comida' }, points: 48 },
      { id: 'pf_7_d', emoji: '✋', label: { es: 'Prefiero avisar antes hoy', 'pt-BR': 'Prefiro que avise antes hoje' }, points: 22 },
    ],
  },
  {
    id: 'pf_8',
    category: 'playful_flirting',
    prompt: {
      es: 'Tu nivel de humor picante hoy del 1 al 10 es...',
      'pt-BR': 'Seu nível de humor picante hoje de 1 a 10 é...',
    },
    options: [
      { id: 'pf_8_a', emoji: '🌶️', label: { es: '9 o 10 — ¡Modo atrevido!', 'pt-BR': '9 ou 10 — Modo ousado!' }, points: 94 },
      { id: 'pf_8_b', emoji: '😏', label: { es: '6 o 7 — Coqueto pero tranqui', 'pt-BR': '6 ou 7 — Flertando de leve' }, points: 66 },
      { id: 'pf_8_c', emoji: '🍯', label: { es: '4 o 5 — Más dulce que picante', 'pt-BR': '4 ou 5 — Mais doce que picante' }, points: 46 },
      { id: 'pf_8_d', emoji: '🥛', label: { es: '1 o 2 — Cero picante hoy', 'pt-BR': '1 ou 2 — Zero picante hoje' }, points: 18 },
    ],
  },

  // =========================================================================
  // 6. QUALITY TIME (8 questions)
  // =========================================================================
  {
    id: 'qt_1',
    category: 'quality_time',
    prompt: {
      es: '¿Cuál sería tu plan ideal para los próximos 60 minutos juntos?',
      'pt-BR': 'Qual seria seu plano ideal para os próximos 60 minutos juntos?',
    },
    options: [
      { id: 'qt_1_a', emoji: '🕯️', label: { es: 'Velas, música y desconectar del mundo', 'pt-BR': 'Velas, música e desconectar do mundo' }, points: 88, affectionTag: 'romantic_date' },
      { id: 'qt_1_b', emoji: '🍷', label: { es: 'Tomar algo rico y charlar sin pantallas', 'pt-BR': 'Beber algo gostoso e conversar sem telas' }, points: 66, affectionTag: 'deep_talk' },
      { id: 'qt_1_c', emoji: '🍿', label: { es: 'Serie o peli bajo la misma manta', 'pt-BR': 'Série ou filme sob o mesmo cobertor' }, points: 44, affectionTag: 'movie_chill' },
      { id: 'qt_1_d', emoji: '🎧', label: { es: 'Cada uno en su mundo pero cerquita', 'pt-BR': 'Cada um no seu mundo, mas pertinho' }, points: 24 },
    ],
  },
  {
    id: 'qt_2',
    category: 'quality_time',
    prompt: {
      es: '¿Dejarías el celular en modo silencio por una hora para estar juntos?',
      'pt-BR': 'Deixaria o celular no silencioso por uma hora para ficarem juntos?',
    },
    options: [
      { id: 'qt_2_a', emoji: '📵', label: { es: '¡Ya lo apagué! Toda mi atención es tuya', 'pt-BR': 'Já desliguei! Toda atenção é sua' }, points: 90 },
      { id: 'qt_2_b', emoji: '✨', label: { es: 'Sí, me encantaría desconectar', 'pt-BR': 'Sim, adoraria desconectar' }, points: 70 },
      { id: 'qt_2_c', emoji: '⏳', label: { es: 'En un ratito cuando termine algo', 'pt-BR': 'Daqui a pouco quando eu terminar algo' }, points: 45 },
      { id: 'qt_2_d', emoji: '📱', label: { es: 'Hoy necesito despejarme un rato solo/a', 'pt-BR': 'Hoje preciso espairecer um pouco só' }, points: 20 },
    ],
  },
  {
    id: 'qt_3',
    category: 'quality_time',
    prompt: {
      es: '¿Qué actividad sin sexo disfrutarías más ahora mismo?',
      'pt-BR': 'Qual atividade sem sexo você curtiria mais agora?',
    },
    options: [
      { id: 'qt_3_a', emoji: '💆', label: { es: 'Masaje mutuo con aceitito', 'pt-BR': 'Massagem mútua relaxante' }, points: 75, affectionTag: 'massage' },
      { id: 'qt_3_b', emoji: '🎲', label: { es: 'Juego de mesa o cartas con risas', 'pt-BR': 'Jogo de tabuleiro ou cartas com risadas' }, points: 58, affectionTag: 'playful_tease' },
      { id: 'qt_3_c', emoji: '🍳', label: { es: 'Preparar un snack rico juntos', 'pt-BR': 'Preparar um lanche gostoso juntos' }, points: 52 },
      { id: 'qt_3_d', emoji: '📺', label: { es: 'Ver algo en silencio abrazados', 'pt-BR': 'Assistir algo em silêncio abraçados' }, points: 34, affectionTag: 'movie_chill' },
    ],
  },
  {
    id: 'qt_4',
    category: 'quality_time',
    prompt: {
      es: 'Si pudieran teletransportarse a cualquier cita hoy, ¿a dónde irían?',
      'pt-BR': 'Se pudessem se teletransportar para um encontro hoje, para onde iriam?',
    },
    options: [
      { id: 'qt_4_a', emoji: '🏨', label: { es: 'Una cabaña romántica con chimenea', 'pt-BR': 'Uma cabana romântica com lareira' }, points: 90, affectionTag: 'romantic_date' },
      { id: 'qt_4_b', emoji: '🏖️', label: { es: 'Caminata nocturna por la playa', 'pt-BR': 'Caminhada noturna na praia' }, points: 70, affectionTag: 'romantic_date' },
      { id: 'qt_4_c', emoji: '☕', label: { es: 'Cafetería acogedora con lluvia', 'pt-BR': 'Cafeteria aconchegante com chuva' }, points: 50, affectionTag: 'deep_talk' },
      { id: 'qt_4_d', emoji: '☁️', label: { es: 'A una nube mullida para dormir', 'pt-BR': 'Para uma nuvem fofinha dormir' }, points: 20, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'qt_5',
    category: 'quality_time',
    prompt: {
      es: '¿Qué tanto extrañaste pasar un rato a solas hoy?',
      'pt-BR': 'Quanto sentiu falta de passar um tempo a sós hoje?',
    },
    options: [
      { id: 'qt_5_a', emoji: '🥺', label: { es: '¡Muchísimo, ya te necesitaba!', 'pt-BR': 'Demais, já estava com saudade!' }, points: 86, affectionTag: 'cuddles' },
      { id: 'qt_5_b', emoji: '💛', label: { es: 'Bastante, qué bueno coincidir', 'pt-BR': 'Bastante, que bom nos encontrarmos' }, points: 66 },
      { id: 'qt_5_c', emoji: '🙂', label: { es: 'Un poco, estoy tranquilo/a', 'pt-BR': 'Um pouco, estou tranquilo(a)' }, points: 45 },
      { id: 'qt_5_d', emoji: '🧘', label: { es: 'Hoy necesito un ratito para mí primero', 'pt-BR': 'Hoje preciso de um tempinho para mim antes' }, points: 20, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'qt_6',
    category: 'quality_time',
    prompt: {
      es: '¿Te gustaría que cocinen o pidan algo especial juntos?',
      'pt-BR': 'Gostaria de cozinhar ou pedir algo especial juntos?',
    },
    options: [
      { id: 'qt_6_a', emoji: '🍝', label: { es: '¡Sí, cena especial con copas!', 'pt-BR': 'Sim, jantar especial com taças!' }, points: 82, affectionTag: 'romantic_date' },
      { id: 'qt_6_b', emoji: '🍔', label: { es: 'Algo rico y rápido para tener más tiempo', 'pt-BR': 'Algo gostoso e rápido para ter mais tempo' }, points: 65 },
      { id: 'qt_6_c', emoji: '🍵', label: { es: 'Un tecito caliente y ya', 'pt-BR': 'Um chazinho quente e pronto' }, points: 38 },
      { id: 'qt_6_d', emoji: '😴', label: { es: 'Ya cené, solo quiero cama', 'pt-BR': 'Já jantei, só quero cama' }, points: 18 },
    ],
  },
  {
    id: 'qt_7',
    category: 'quality_time',
    prompt: {
      es: '¿Cómo prefieres cerrar el día de hoy?',
      'pt-BR': 'Como você prefere encerrar o dia de hoje?',
    },
    options: [
      { id: 'qt_7_a', emoji: '💘', label: { es: 'Con romance y mucha chispa', 'pt-BR': 'Com romance e muita faísca' }, points: 92 },
      { id: 'qt_7_b', emoji: '🫂', label: { es: 'Con abrazos y charla bonita', 'pt-BR': 'Com abraços e conversa gostosa' }, points: 60, affectionTag: 'cuddles' },
      { id: 'qt_7_c', emoji: '🎬', label: { es: 'Viendo un capítulo de nuestra serie', 'pt-BR': 'Vendo um episódio da nossa série' }, points: 42, affectionTag: 'movie_chill' },
      { id: 'qt_7_d', emoji: '💤', label: { es: 'Durmiendo temprano como ángeles', 'pt-BR': 'Dormindo cedo feito anjinhos' }, points: 18, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'qt_8',
    category: 'quality_time',
    prompt: {
      es: 'Si hoy tuvieran 15 minutos sin interrupciones, ¿cómo los usarían?',
      'pt-BR': 'Se tivessem 15 minutos sem interrupções agora, como usariam?',
    },
    options: [
      { id: 'qt_8_a', emoji: '💋', label: { es: 'Besándonos sin mirar el reloj', 'pt-BR': 'Nos beijando sem olhar o relógio' }, points: 90, affectionTag: 'kisses' },
      { id: 'qt_8_b', emoji: '🫂', label: { es: 'Abrazados respirando juntos', 'pt-BR': 'Abraçados respirando juntos' }, points: 62, affectionTag: 'cuddles' },
      { id: 'qt_8_c', emoji: '☕', label: { es: 'Poniéndonos al día con calma', 'pt-BR': 'Colocando o papo em dia com calma' }, points: 44, affectionTag: 'deep_talk' },
      { id: 'qt_8_d', emoji: '😴', label: { es: '¡Una siesta exprés!', 'pt-BR': 'Um cochilo expresso!' }, points: 18, affectionTag: 'space_rest' },
    ],
  },

  // =========================================================================
  // 7. INTEREST IN INTIMACY (8 questions)
  // =========================================================================
  {
    id: 'ii_1',
    category: 'intimacy_interest',
    prompt: {
      es: '¿Te gustaría tener un momento íntimo con tu pareja hoy?',
      'pt-BR': 'Você gostaria de ter um momento íntimo com seu par hoje?',
    },
    options: [
      { id: 'ii_1_a', emoji: '🟢', label: { es: '¡Sí, me encantaría!', 'pt-BR': 'Sim, eu adoraria!' }, points: 96 },
      { id: 'ii_1_b', emoji: '🟡', label: { es: 'Tal vez, si empezamos con mimos suaves', 'pt-BR': 'Talvez, se começarmos com carinho suave' }, points: 62, isUnsure: true, affectionTag: 'cuddles' },
      { id: 'ii_1_c', emoji: '🤔', label: { es: 'No estoy seguro/a todavía', 'pt-BR': 'Ainda não tenho certeza' }, points: 45, isUnsure: true },
      { id: 'ii_1_d', emoji: '🔴', label: { es: 'Ahora no, prefiero solo cariño o descanso', 'pt-BR': 'Agora não, prefiro só carinho ou descanso' }, points: 10, isBoundaryNo: true },
    ],
  },
  {
    id: 'ii_2',
    category: 'intimacy_interest',
    prompt: {
      es: '¿Tu deseo hoy es más espontáneo ("¡ya!") o necesita calentamiento previo?',
      'pt-BR': 'Seu desejo hoje é mais espontâneo ("já!") ou precisa de aquecimento prévio?',
    },
    options: [
      { id: 'ii_2_a', emoji: '⚡', label: { es: 'Espontáneo, ¡listo/a para despegar!', 'pt-BR': 'Espontâneo, pronto(a) para decolar!' }, points: 92 },
      { id: 'ii_2_b', emoji: '🕯️', label: { es: 'Necesita besos, calma y buen clima', 'pt-BR': 'Precisa de beijos, calma e bom clima' }, points: 64, affectionTag: 'kisses' },
      { id: 'ii_2_c', emoji: '🌀', label: { es: 'Depende mucho de cómo me sienta luego', 'pt-BR': 'Depende muito de como eu me sentir depois' }, points: 48, isUnsure: true },
      { id: 'ii_2_d', emoji: '🛑', label: { es: 'Hoy no tengo interés sexual', 'pt-BR': 'Hoje não tenho interesse sexual' }, points: 10, isBoundaryNo: true },
    ],
  },
  {
    id: 'ii_3',
    category: 'intimacy_interest',
    prompt: {
      es: 'Si empiezan con besos largos y abrazos, ¿qué te gustaría que pase?',
      'pt-BR': 'Se começarem com beijos longos e abraços, o que gostaria que acontecesse?',
    },
    options: [
      { id: 'ii_3_a', emoji: '🔥', label: { es: 'Que suba la intensidad naturalmente', 'pt-BR': 'Que a intensidade suba naturalmente' }, points: 90 },
      { id: 'ii_3_b', emoji: '💛', label: { es: 'Ver cómo fluye sin ninguna presión', 'pt-BR': 'Ver como flui sem nenhuma pressão' }, points: 60, isUnsure: true },
      { id: 'ii_3_c', emoji: '🫂', label: { es: 'Quedarnos solo en abrazos y besos', 'pt-BR': 'Ficar só nos abraços e beijos' }, points: 32, isBoundaryNo: true, affectionTag: 'cuddles' },
      { id: 'ii_3_d', emoji: '😴', label: { es: 'Quedarnos dormidos abrazados', 'pt-BR': 'Dormir abraçados' }, points: 15, isBoundaryNo: true, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'ii_4',
    category: 'intimacy_interest',
    prompt: {
      es: '¿Qué ritmo prefieres si hoy surge un momento íntimo?',
      'pt-BR': 'Qual ritmo você prefere se surgir um momento íntimo hoje?',
    },
    options: [
      { id: 'ii_4_a', emoji: '🔥', label: { es: 'Intenso y apasionado', 'pt-BR': 'Intenso e apaixonado' }, points: 92 },
      { id: 'ii_4_b', emoji: '🌊', label: { es: 'Lento, sensual y sin apuro', 'pt-BR': 'Lento, sensual e sem pressa' }, points: 76 },
      { id: 'ii_4_c', emoji: '🌸', label: { es: 'Solo ternura por ahora', 'pt-BR': 'Só ternura por enquanto' }, points: 42, isUnsure: true },
      { id: 'ii_4_d', emoji: '🛌', label: { es: 'Hoy prefiero descansar', 'pt-BR': 'Hoje prefiro descansar' }, points: 12, isBoundaryNo: true },
    ],
  },
  {
    id: 'ii_5',
    category: 'intimacy_interest',
    prompt: {
      es: '¿Sientes comodidad corporal para la intimidad hoy?',
      'pt-BR': 'Você sente conforto corporal para a intimidade hoje?',
    },
    options: [
      { id: 'ii_5_a', emoji: '✨', label: { es: '¡Sí, me siento genial en mi piel!', 'pt-BR': 'Sim, me sinto ótimo(a) na minha pele!' }, points: 90 },
      { id: 'ii_5_b', emoji: '🌷', label: { es: 'Sí, con luz tenue y confianza', 'pt-BR': 'Sim, com meia-luz e confiança' }, points: 68 },
      { id: 'ii_5_c', emoji: '🤷', label: { es: 'Más o menos, necesito mimos primero', 'pt-BR': 'Mais ou menos, preciso de carinho antes' }, points: 46, isUnsure: true },
      { id: 'ii_5_d', emoji: '🧸', label: { es: 'Hoy no me siento cómodo/a para eso', 'pt-BR': 'Hoje não me sinto confortável para isso' }, points: 12, isBoundaryNo: true },
    ],
  },
  {
    id: 'ii_6',
    category: 'intimacy_interest',
    prompt: {
      es: '¿Qué tanto espacio mental tienes para disfrutar un encuentro íntimo hoy?',
      'pt-BR': 'Quanto espaço mental você tem para curtir um momento íntimo hoje?',
    },
    options: [
      { id: 'ii_6_a', emoji: '🌈', label: { es: 'Mente libre y con muchas ganas', 'pt-BR': 'Mente livre e com muita vontade' }, points: 92 },
      { id: 'ii_6_b', emoji: '🌤️', label: { es: 'Puedo desconectar si vamos despacio', 'pt-BR': 'Consigo desconectar se formos devagar' }, points: 64 },
      { id: 'ii_6_c', emoji: '💭', label: { es: 'Tengo mil cosas en la cabeza', 'pt-BR': 'Tenho mil coisas na cabeça' }, points: 36, isUnsure: true },
      { id: 'ii_6_d', emoji: '🛑', label: { es: 'Mi cabeza necesita descanso total', 'pt-BR': 'Minha cabeça precisa de descanso total' }, points: 14, isBoundaryNo: true },
    ],
  },
  {
    id: 'ii_7',
    category: 'intimacy_interest',
    prompt: {
      es: 'Si hoy hubiera un semáforo en la puerta del cuarto, ¿de qué color estaría?',
      'pt-BR': 'Se hoje houvesse um semáforo na porta do quarto, de que cor estaria?',
    },
    options: [
      { id: 'ii_7_a', emoji: '🟢', label: { es: 'Verde brillante', 'pt-BR': 'Verde brilhante' }, points: 95 },
      { id: 'ii_7_b', emoji: '🟡', label: { es: 'Amarillo curioso', 'pt-BR': 'Amarelo curioso' }, points: 58, isUnsure: true },
      { id: 'ii_7_c', emoji: '🔴', label: { es: 'Rojo cariñoso (solo abrazos)', 'pt-BR': 'Vermelho carinhoso (só abraços)' }, points: 22, isBoundaryNo: true },
      { id: 'ii_7_d', emoji: '😴', label: { es: 'Apagado por sueño', 'pt-BR': 'Desligado por sono' }, points: 10, isBoundaryNo: true },
    ],
  },
  {
    id: 'ii_8',
    category: 'intimacy_interest',
    prompt: {
      es: '¿Te gustaría probar algo romántico nuevo hoy o ir a lo clásico y cómodo?',
      'pt-BR': 'Gostaria de tentar algo romântico novo hoje ou ir no clássico confortável?',
    },
    options: [
      { id: 'ii_8_a', emoji: '🚀', label: { es: '¡Algo nuevo y divertido!', 'pt-BR': 'Algo novo e divertido!' }, points: 90 },
      { id: 'ii_8_b', emoji: '💖', label: { es: 'Lo clásico que ya nos encanta', 'pt-BR': 'O clássico que já amamos' }, points: 74 },
      { id: 'ii_8_c', emoji: '🤔', label: { es: 'Solo si es súper tranquilo', 'pt-BR': 'Só se for super tranquilo' }, points: 48, isUnsure: true },
      { id: 'ii_8_d', emoji: '🛌', label: { es: 'Hoy prefiero cero actividad sexual', 'pt-BR': 'Hoje prefiro zero atividade sexual' }, points: 10, isBoundaryNo: true },
    ],
  },

  // =========================================================================
  // 8. BOUNDARIES AND PREFERENCES (8 questions)
  // =========================================================================
  {
    id: 'bp_1',
    category: 'boundaries_preferences',
    prompt: {
      es: '¿Quieres que tu pareja te dé cariño sin esperar nada más?',
      'pt-BR': 'Quer que seu par te dê carinho sem esperar nada além disso?',
    },
    options: [
      { id: 'bp_1_a', emoji: '🫂', label: { es: 'Sí, solo mimos y cero expectativas', 'pt-BR': 'Sim, só carinho e zero expectativas' }, points: 30, isBoundaryNo: true, affectionTag: 'cuddles' },
      { id: 'bp_1_b', emoji: '💛', label: { es: 'Sí, empecemos así y vemos qué pasa', 'pt-BR': 'Sim, vamos começar assim e ver' }, points: 58, isUnsure: true, affectionTag: 'cuddles' },
      { id: 'bp_1_c', emoji: '🔥', label: { es: 'Hoy sí estoy abierto/a a que escale', 'pt-BR': 'Hoje estou aberto(a) a evoluir' }, points: 86 },
      { id: 'bp_1_d', emoji: '🧘', label: { es: 'Ahora prefiero espacio tranquilo', 'pt-BR': 'Agora prefiro espaço tranquilo' }, points: 15, isBoundaryNo: true, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'bp_2',
    category: 'boundaries_preferences',
    prompt: {
      es: 'Si dices "hoy no", ¿qué respuesta de tu pareja te hace sentir mejor?',
      'pt-BR': 'Se você disser "hoje não", qual resposta do seu par te faz sentir melhor?',
    },
    options: [
      { id: 'bp_2_a', emoji: '🫂', label: { es: 'Un abrazo lindo y "todo bien, te amo"', 'pt-BR': 'Um abraço gostoso e "tudo bem, te amo"' }, points: 55, affectionTag: 'cuddles' },
      { id: 'bp_2_b', emoji: '😂', label: { es: 'Una broma dulce sin drama', 'pt-BR': 'Uma brincadeira doce sem drama' }, points: 60 },
      { id: 'bp_2_c', emoji: '🎬', label: { es: '"Perfecto, ¿vemos una peli?"', 'pt-BR': '"Perfeito, vamos ver um filme?"' }, points: 48, affectionTag: 'movie_chill' },
      { id: 'bp_2_d', emoji: '🍵', label: { es: 'Respeto total y calma', 'pt-BR': 'Respeito total e calma' }, points: 45 },
    ],
  },
  {
    id: 'bp_3',
    category: 'boundaries_preferences',
    prompt: {
      es: '¿Qué es lo que MENOS quieres hoy?',
      'pt-BR': 'O que você MENOS quer hoje?',
    },
    options: [
      { id: 'bp_3_a', emoji: '⏰', label: { es: 'Sentir apuro o presión', 'pt-BR': 'Sentir pressa ou pressão' }, points: 52 },
      { id: 'bp_3_b', emoji: '📱', label: { es: 'Distracciones con el celular', 'pt-BR': 'Distrações com o celular' }, points: 68 },
      { id: 'bp_3_c', emoji: '🗣️', label: { es: 'Hablar de problemas pesados', 'pt-BR': 'Falar de problemas pesados' }, points: 58 },
      { id: 'bp_3_d', emoji: '🚫', label: { es: 'Cualquier expectativa sexual hoy', 'pt-BR': 'Qualquer expectativa sexual hoje' }, points: 15, isBoundaryNo: true },
    ],
  },
  {
    id: 'bp_4',
    category: 'boundaries_preferences',
    prompt: {
      es: '¿Qué palabra clave o señal prefieres para decir "bajemos el ritmo"?',
      'pt-BR': 'Qual sinal você prefere para dizer "vamos diminuir o ritmo"?',
    },
    options: [
      { id: 'bp_4_a', emoji: '🟡', label: { es: 'Decir "modo amarillo" con cariño', 'pt-BR': 'Dizer "modo amarelo" com carinho' }, points: 62 },
      { id: 'bp_4_b', emoji: '🐢', label: { es: '"Modo tortuga" para ir más lento', 'pt-BR': '"Modo tartaruga" para ir mais devagar' }, points: 58 },
      { id: 'bp_4_c', emoji: '🫂', label: { es: 'Pedir solo abrazos', 'pt-BR': 'Pedir só abraços' }, points: 44, affectionTag: 'cuddles' },
      { id: 'bp_4_d', emoji: '🔴', label: { es: 'Decir "stop" y que se respete al instante', 'pt-BR': 'Dizer "stop" e ser respeitado na hora' }, points: 30 },
    ],
  },
  {
    id: 'bp_5',
    category: 'boundaries_preferences',
    prompt: {
      es: '¿Cómo prefieres comunicar tus ganas hoy?',
      'pt-BR': 'Como você prefere comunicar sua vontade hoje?',
    },
    options: [
      { id: 'bp_5_a', emoji: '💬', label: { es: 'Directo y sin rodeos', 'pt-BR': 'Direto e sem rodeios' }, points: 78 },
      { id: 'bp_5_b', emoji: '🚦', label: { es: 'Con el semáforo de LIBER', 'pt-BR': 'Com o semáforo do LIBER' }, points: 68 },
      { id: 'bp_5_c', emoji: '💌', label: { es: 'Con un mensajito tierno', 'pt-BR': 'Com uma mensagem fofa' }, points: 55 },
      { id: 'bp_5_d', emoji: '🤫', label: { es: 'Prefiero ir paso a paso', 'pt-BR': 'Prefiro ir passo a passo' }, points: 45, isUnsure: true },
    ],
  },
  {
    id: 'bp_6',
    category: 'boundaries_preferences',
    prompt: {
      es: '¿Qué límite positivo quieres recordar hoy?',
      'pt-BR': 'Qual limite positivo você quer lembrar hoje?',
    },
    options: [
      { id: 'bp_6_a', emoji: '💖', label: { es: 'El placer es de los dos, sin prisas', 'pt-BR': 'O prazer é dos dois, sem pressa' }, points: 76 },
      { id: 'bp_6_b', emoji: '🫂', label: { es: 'Un abrazo no obliga a nada más', 'pt-BR': 'Um abraço não obriga a nada além' }, points: 55, affectionTag: 'cuddles' },
      { id: 'bp_6_c', emoji: '🔄', label: { es: 'Podemos cambiar de opinión en cualquier momento', 'pt-BR': 'Podemos mudar de ideia a qualquer momento' }, points: 58 },
      { id: 'bp_6_d', emoji: '🛌', label: { es: 'Descansar también es quererse', 'pt-BR': 'Descansar também é se amar' }, points: 30, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'bp_7',
    category: 'boundaries_preferences',
    prompt: {
      es: '¿Qué nivel de privacidad quieres para tus respuestas de hoy?',
      'pt-BR': 'Qual nível de privacidade você quer para suas respostas de hoje?',
    },
    options: [
      { id: 'bp_7_a', emoji: '🚦', label: { es: 'Compartir solo mi semáforo final', 'pt-BR': 'Compartilhar só meu semáforo final' }, points: 65 },
      { id: 'bp_7_b', emoji: '🫂', label: { es: 'Compartir semáforo y mis mimos favoritos', 'pt-BR': 'Compartilhar semáforo e carinhos favoritos' }, points: 70 },
      { id: 'bp_7_c', emoji: '🔒', label: { es: 'Mis respuestas individuales siempre privadas', 'pt-BR': 'Minhas respostas individuais sempre privadas' }, points: 55 },
      { id: 'bp_7_d', emoji: '🙈', label: { es: 'Hoy prefiero no compartir todavía', 'pt-BR': 'Hoje prefiro ainda não compartilhar' }, points: 35 },
    ],
  },
  {
    id: 'bp_8',
    category: 'boundaries_preferences',
    prompt: {
      es: 'Si hoy estás en Anti Liber, ¿qué te gustaría que sepa tu pareja?',
      'pt-BR': 'Se hoje você estiver em Anti Liber, o que gostaria que seu par soubesse?',
    },
    options: [
      { id: 'bp_8_a', emoji: '❤️', label: { es: 'Te amo igual, solo necesito descanso', 'pt-BR': 'Te amo igual, só preciso descansar' }, points: 30, affectionTag: 'space_rest' },
      { id: 'bp_8_b', emoji: '🫂', label: { es: '¡Acepto abrazos y mimos sin fin!', 'pt-BR': 'Aceito abraços e cafuné sem fim!' }, points: 42, affectionTag: 'cuddles' },
      { id: 'bp_8_c', emoji: '🎬', label: { es: 'Peli y snacks suena perfecto', 'pt-BR': 'Filme e lanchinho parece perfeito' }, points: 38, affectionTag: 'movie_chill' },
      { id: 'bp_8_d', emoji: '☀️', label: { es: 'Mañana será otro día con calma', 'pt-BR': 'Amanhã será outro dia com calma' }, points: 35 },
    ],
  },
];

/**
 * Final direct preference question asked at the end of every quiz session.
 * An explicit "No / Not now" or "Unsure" here enforces the consent guardrail.
 */
export const DIRECT_PREFERENCE_QUESTION: Question = {
  id: 'direct_final',
  category: 'boundaries_preferences',
  isDirectPreference: true,
  prompt: {
    es: 'Pregunta directa final: Más allá del puntaje, ¿cómo te sientes respecto a la intimidad hoy?',
    'pt-BR': 'Pergunta direta final: Além da pontuação, como você se sente sobre a intimidade hoje?',
  },
  options: [
    {
      id: 'df_yes',
      emoji: '🟢',
      label: { es: '¡Estoy Liber! Abierto/a y con ganas', 'pt-BR': 'Estou Liber! Aberto(a) e com vontade' },
      points: 95,
    },
    {
      id: 'df_maybe',
      emoji: '🟡',
      label: { es: 'Estoy Casi Liber / No estoy seguro/a (depende del momento)', 'pt-BR': 'Estou Quase Liber / Não tenho certeza (depende do momento)' },
      points: 55,
      isUnsure: true,
    },
    {
      id: 'df_cuddle_only',
      emoji: '🔴',
      label: { es: 'Ahora no quiero intimidad, pero sí cariño/abrazos', 'pt-BR': 'Agora não quero intimidade, mas quero carinho/abraços' },
      points: 25,
      isBoundaryNo: true,
      affectionTag: 'cuddles',
    },
    {
      id: 'df_no',
      emoji: '🛑',
      label: { es: 'No, hoy prefiero descansar y tener mi espacio', 'pt-BR': 'Não, hoje prefiro descansar e ter meu espaço' },
      points: 10,
      isBoundaryNo: true,
      affectionTag: 'space_rest',
    },
  ],
};
