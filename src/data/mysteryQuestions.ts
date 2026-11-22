import type {
  AnswerOption,
  Language,
  MysteryFacet,
  MysteryQuestion,
  TrafficState,
} from '../types/liber.ts';

export const MYSTERY_FACET_LABELS: Record<
  MysteryFacet,
  Record<Language, { name: string; emoji: string }>
> = {
  atmosphere: {
    es: { name: 'Atmósfera Secreta', emoji: '🕯️' },
    'pt-BR': { name: 'Atmosfera Secreta', emoji: '🕯️' },
  },
  chemistry: {
    es: { name: 'Chispa Invisible', emoji: '✨' },
    'pt-BR': { name: 'Faísca Invisível', emoji: '✨' },
  },
  rhythm: {
    es: { name: 'Ritmo Nocturno', emoji: '🌙' },
    'pt-BR': { name: 'Ritmo Noturno', emoji: '🌙' },
  },
  secret_clue: {
    es: { name: 'Acertijo Cómplice', emoji: '✉️' },
    'pt-BR': { name: 'Enigma Cúmplice', emoji: '✉️' },
  },
};

export const MYSTERY_QUESTIONS: MysteryQuestion[] = [
  {
    id: 'my_1',
    facet: 'atmosphere',
    prompt: {
      es: 'Si esta noche fuera un trago secreto en un bar escondido, ¿cuál pedirías?',
      'pt-BR': 'Se esta noite fosse um drinque secreto em um bar escondido, qual você pediria?',
    },
    options: [
      { id: 'my_1_a', emoji: '🔥', label: { es: 'Un elixir especiado que sube el pulso', 'pt-BR': 'Um elixir picante que acelera o pulso' }, points: 94, affectionTag: 'playful_tease' },
      { id: 'my_1_b', emoji: '🍷', label: { es: 'Un vino suave para conversar pegaditos', 'pt-BR': 'Um vinho suave para conversar coladinhos' }, points: 68, affectionTag: 'romantic_date' },
      { id: 'my_1_c', emoji: '🍸', label: { es: 'Un cóctel sorpresa: depende de quién lo prepare', 'pt-BR': 'Um coquetel surpresa: depende de quem preparar' }, points: 50, isUnsure: true },
      { id: 'my_1_d', emoji: '🍵', label: { es: 'Una infusión tibia para bajar revoluciones', 'pt-BR': 'Um chá quentinho para desacelerar' }, points: 18, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'my_2',
    facet: 'atmosphere',
    prompt: {
      es: '¿Qué iluminación le pondrías al escenario de hoy?',
      'pt-BR': 'Qual iluminação você escolheria para o cenário de hoje?',
    },
    options: [
      { id: 'my_2_a', emoji: '🕯️', label: { es: 'Penumbra cálida con sombras cómplices', 'pt-BR': 'Meia-luz quente com sombras cúmplices' }, points: 92, affectionTag: 'romantic_date' },
      { id: 'my_2_b', emoji: '✨', label: { es: 'Luces doradas bajitas y ambiente acogedor', 'pt-BR': 'Luzinhas douradas baixinhas e clima aconchegante' }, points: 70, affectionTag: 'cuddles' },
      { id: 'my_2_c', emoji: '📺', label: { es: 'El brillo tranquilo de una buena pantalla', 'pt-BR': 'O brilho tranquilo de uma boa tela' }, points: 44, affectionTag: 'movie_chill' },
      { id: 'my_2_d', emoji: '🌑', label: { es: 'Luces apagadas y cartel de "en modo pausa"', 'pt-BR': 'Luzes apagadas e plaquinha de "em modo pausa"' }, points: 16, isBoundaryNo: true, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'my_3',
    facet: 'chemistry',
    prompt: {
      es: 'Si un perfume invisible flotara en la habitación ahora, ¿a qué olería tu humor?',
      'pt-BR': 'Se um perfume invisível flutuasse no ar agora, qual seria o cheiro do seu clima?',
    },
    options: [
      { id: 'my_3_a', emoji: '🌶️', label: { es: 'Vainilla negra con un toque atrevido', 'pt-BR': 'Baunilha intensa com um toque ousado' }, points: 90, affectionTag: 'playful_tease' },
      { id: 'my_3_b', emoji: '🌹', label: { es: 'Pétalos dulces y cercanía sin apuro', 'pt-BR': 'Pétalas doces e proximidade sem pressa' }, points: 68, affectionTag: 'kisses' },
      { id: 'my_3_c', emoji: '☕', label: { es: 'Café recién hecho y charla tranquila', 'pt-BR': 'Café passado na hora e papo tranquilo' }, points: 46, affectionTag: 'deep_talk' },
      { id: 'my_3_d', emoji: '🌿', label: { es: 'Lavanda pura para desconectar la mente', 'pt-BR': 'Lavanda pura para desligar a mente' }, points: 22, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'my_4',
    facet: 'secret_clue',
    prompt: {
      es: 'Si hoy fueran protagonistas de una novela nocturna, ¿qué capítulo tocaría leer?',
      'pt-BR': 'Se hoje vocês fossem protagonistas de um romance noturno, qual capítulo viria agora?',
    },
    options: [
      { id: 'my_4_a', emoji: '📖', label: { es: 'El capítulo que se lee con la puerta cerrada', 'pt-BR': 'O capítulo que a gente lê de porta fechada' }, points: 95, affectionTag: 'playful_tease' },
      { id: 'my_4_b', emoji: '🌙', label: { es: 'El del suspenso romántico que atrapa despacio', 'pt-BR': 'O do suspense romântico que envolve aos poucos' }, points: 66, affectionTag: 'kisses' },
      { id: 'my_4_c', emoji: '🔮', label: { es: 'Un capítulo abierto: el final todavía no está escrito', 'pt-BR': 'Um capítulo aberto: o final ainda não foi escrito' }, points: 52, isUnsure: true },
      { id: 'my_4_d', emoji: '🛋️', label: { es: 'Un epílogo tierno bajo una manta gigante', 'pt-BR': 'Um epílogo fofo debaixo de um cobertor gigante' }, points: 20, affectionTag: 'movie_chill' },
    ],
  },
  {
    id: 'my_5',
    facet: 'rhythm',
    prompt: {
      es: '¿A qué velocidad gira tu brújula interior esta noche?',
      'pt-BR': 'Em que velocidade gira a sua bússola interior esta noite?',
    },
    options: [
      { id: 'my_5_a', emoji: '⚡', label: { es: 'Magnética: apunta directo hacia ti', 'pt-BR': 'Magnética: aponta direto para você' }, points: 90, affectionTag: 'playful_tease' },
      { id: 'my_5_b', emoji: '🌊', label: { es: 'Como una marea lenta que va subiendo', 'pt-BR': 'Como uma maré lenta que vai subindo' }, points: 70, affectionTag: 'massage' },
      { id: 'my_5_c', emoji: '🧭', label: { es: 'Curiosa, buscando buena conversación primero', 'pt-BR': 'Curiosa, procurando uma boa conversa primeiro' }, points: 48, affectionTag: 'deep_talk' },
      { id: 'my_5_d', emoji: '⚓', label: { es: 'Anclada en puerto seguro, cero movimiento', 'pt-BR': 'Ancorada em porto seguro, zero agito' }, points: 18, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'my_6',
    facet: 'secret_clue',
    prompt: {
      es: '¿Qué "contraseña secreta" abre mejor tu sonrisa hoy?',
      'pt-BR': 'Qual "senha secreta" destrava melhor o seu sorriso hoje?',
    },
    options: [
      { id: 'my_6_a', emoji: '😏', label: { es: 'Una mirada larga con media sonrisa traviesa', 'pt-BR': 'Um olhar demorado com meio sorriso travesso' }, points: 92, affectionTag: 'playful_tease' },
      { id: 'my_6_b', emoji: '💆', label: { es: 'Unas manos tibias relajando mis hombros', 'pt-BR': 'Mãos quentinhas relaxando meus ombros' }, points: 72, affectionTag: 'massage' },
      { id: 'my_6_c', emoji: '🫂', label: { es: 'Un abrazo silencioso sin pedir nada a cambio', 'pt-BR': 'Um abraço silencioso sem pedir nada em troca' }, points: 50, affectionTag: 'cuddles' },
      { id: 'my_6_d', emoji: '🤫', label: { es: 'Que respeten mi burbuja tranquila esta noche', 'pt-BR': 'Respeitarem minha bolha de sossego esta noite' }, points: 14, isBoundaryNo: true, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'my_7',
    facet: 'atmosphere',
    prompt: {
      es: 'Si hubiera un botón mágico en la pared de casa, ¿qué función activarías ahora?',
      'pt-BR': 'Se houvesse um botão mágico na parede de casa, qual função você ativaria agora?',
    },
    options: [
      { id: 'my_7_a', emoji: '🔥', label: { es: '"Modo eclipse": el mundo desaparece por dos horas', 'pt-BR': '"Modo eclipse": o mundo some por duas horas' }, points: 94, affectionTag: 'romantic_date' },
      { id: 'my_7_b', emoji: '🎶', label: { es: '"Modo vinilo": música suave y baile pegadito', 'pt-BR': '"Modo vinil": música suave e dança coladinha' }, points: 68, affectionTag: 'kisses' },
      { id: 'my_7_c', emoji: '🍿', label: { es: '"Modo cine en casa": snacks y cero esfuerzo', 'pt-BR': '"Modo cinema em casa": petiscos e zero esforço' }, points: 44, affectionTag: 'movie_chill' },
      { id: 'my_7_d', emoji: '☁️', label: { es: '"Modo nube": silencio absoluto y descanso', 'pt-BR': '"Modo nuvem": silêncio absoluto e descanso' }, points: 18, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'my_8',
    facet: 'chemistry',
    prompt: {
      es: 'Imagina que llueve afuera y se cruzan sus miradas por tres segundos largos...',
      'pt-BR': 'Imagine que está chovendo lá fora e seus olhares se cruzam por três segundos longos...',
    },
    options: [
      { id: 'my_8_a', emoji: '⚡', label: { es: 'Sostengo la mirada y acorto la distancia', 'pt-BR': 'Sustento o olhar e encurto a distância' }, points: 93, affectionTag: 'kisses' },
      { id: 'my_8_b', emoji: '🥂', label: { es: 'Sonrío con intriga para ver tu próximo paso', 'pt-BR': 'Sorrio com mistério para ver seu próximo passo' }, points: 68, affectionTag: 'playful_tease' },
      { id: 'my_8_c', emoji: '🌫️', label: { es: 'Me gusta el juego, aunque todavía estoy decidiendo', 'pt-BR': 'Gosto do jogo, mas ainda estou decidindo' }, points: 50, isUnsure: true },
      { id: 'my_8_d', emoji: '🧸', label: { es: 'Te invito a acurrucarnos a escuchar la lluvia', 'pt-BR': 'Te chamo para ficar agarradinhos ouvindo a chuva' }, points: 24, affectionTag: 'cuddles' },
    ],
  },
  {
    id: 'my_9',
    facet: 'chemistry',
    prompt: {
      es: '¿Qué textura describe mejor lo que te provoca sentir hoy?',
      'pt-BR': 'Qual textura descreve melhor o que dá vontade de sentir hoje?',
    },
    options: [
      { id: 'my_9_a', emoji: '🖤', label: { es: 'Seda tibia sobre la piel', 'pt-BR': 'Seda quentinha na pele' }, points: 91, affectionTag: 'kisses' },
      { id: 'my_9_b', emoji: '🪶', label: { es: 'Pluma suave y caricias lentas', 'pt-BR': 'Pluma leve e carícias demoradas' }, points: 68, affectionTag: 'massage' },
      { id: 'my_9_c', emoji: '🧶', label: { es: 'Manta tejida bien mullida y tierna', 'pt-BR': 'Manta macia bem quentinha e fofa' }, points: 42, affectionTag: 'cuddles' },
      { id: 'my_9_d', emoji: '🧊', label: { es: 'Sábanas frescas solo para estirar el cuerpo y dormir', 'pt-BR': 'Lençóis fresquinhos só para esticar o corpo e dormir' }, points: 16, isBoundaryNo: true, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'my_10',
    facet: 'atmosphere',
    prompt: {
      es: 'Si pudiéramos escapar 60 minutos a un destino exprés, ¿cuál elegirías?',
      'pt-BR': 'Se pudéssemos fugir por 60 minutos para um destino expresso, qual escolheria?',
    },
    options: [
      { id: 'my_10_a', emoji: '🏨', label: { es: 'Suite secreta con vista nocturna y llave por dentro', 'pt-BR': 'Suíte secreta com vista noturna e chave por dentro' }, points: 94, affectionTag: 'romantic_date' },
      { id: 'my_10_b', emoji: '🌅', label: { es: 'Mirador bajo las estrellas con charla cómplice', 'pt-BR': 'Mirante sob as estrelas com papo cúmplice' }, points: 70, affectionTag: 'romantic_date' },
      { id: 'my_10_c', emoji: '☕', label: { es: 'Librería con café calientito y calma', 'pt-BR': 'Livraria com café quentinho e calma' }, points: 46, affectionTag: 'deep_talk' },
      { id: 'my_10_d', emoji: '🛌', label: { es: 'Estación "Almohada Central" sin escalas', 'pt-BR': 'Estação "Travesseiro Central" sem escalas' }, points: 18, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'my_11',
    facet: 'chemistry',
    prompt: {
      es: 'Si te susurraran algo al oído sin revelar qué dice la frase, ¿qué marcaría tu radar?',
      'pt-BR': 'Se sussurrassem algo no seu ouvido sem revelar o segredo, o que o seu radar marcaria?',
    },
    options: [
      { id: 'my_11_a', emoji: '🌋', label: { es: 'Escalofrío inmediato y luz verde en el radar', 'pt-BR': 'Arrepio imediato e sinal verde no radar' }, points: 95, affectionTag: 'playful_tease' },
      { id: 'my_11_b', emoji: '💫', label: { es: 'Cosquilleo lindo y ganas de escuchar más', 'pt-BR': 'Frio na barriga gostoso e vontade de ouvir mais' }, points: 66, affectionTag: 'kisses' },
      { id: 'my_11_c', emoji: '🎭', label: { es: 'Depende totalmente del tono y de las ganas del momento', 'pt-BR': 'Depende totalmente do tom e do clima do momento' }, points: 48, isUnsure: true },
      { id: 'my_11_d', emoji: '🌙', label: { es: 'Hoy mi radar está apagado, solo modo descanso', 'pt-BR': 'Hoje meu radar está desligado, só modo descanso' }, points: 15, isBoundaryNo: true, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'my_12',
    facet: 'rhythm',
    prompt: {
      es: 'Si tu energía de esta noche fuera un postre en la mesa, ¿cuál sería?',
      'pt-BR': 'Se a sua energia desta noite fosse uma sobremesa na mesa, qual seria?',
    },
    options: [
      { id: 'my_12_a', emoji: '🍫', label: { es: 'Volcán de chocolate tibio que se derrite al tocarlo', 'pt-BR': 'Petit gâteau quentinho que derrete ao toque' }, points: 92, affectionTag: 'playful_tease' },
      { id: 'my_12_b', emoji: '🍓', label: { es: 'Frutillas con crema para compartir despacito', 'pt-BR': 'Morangos com creme para dividir bem devagar' }, points: 70, affectionTag: 'kisses' },
      { id: 'my_12_c', emoji: '🍪', label: { es: 'Galletitas caseras en el sillón', 'pt-BR': 'Biscoitinhos caseiros no sofá' }, points: 45, affectionTag: 'movie_chill' },
      { id: 'my_12_d', emoji: '🍨', label: { es: 'Algo súper liviano y a la cama temprano', 'pt-BR': 'Algo bem levinho e cama cedo' }, points: 22, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'my_13',
    facet: 'rhythm',
    prompt: {
      es: '¿Cuál es tu regla secreta de la casa después de las 10 PM hoy?',
      'pt-BR': 'Qual é a sua regra secreta da casa depois das 22h hoje?',
    },
    options: [
      { id: 'my_13_a', emoji: '📵', label: { es: 'Prohibidos los celulares, permitidas las travesuras', 'pt-BR': 'Celulares proibidos, travessuras liberadas' }, points: 90, affectionTag: 'romantic_date' },
      { id: 'my_13_b', emoji: '🕯️', label: { es: 'Ir sin reloj y dejar que los mimos decidan', 'pt-BR': 'Ir sem relógio e deixar o carinho decidir' }, points: 66, affectionTag: 'massage' },
      { id: 'my_13_c', emoji: '🎬', label: { es: 'Un episodio cortito y vemos cómo sigue la noche', 'pt-BR': 'Um episódio curtinho e vemos como a noite segue' }, points: 44, affectionTag: 'movie_chill' },
      { id: 'my_13_d', emoji: '😴', label: { es: 'Toque de queda oficial para recargar pilas', 'pt-BR': 'Toque de recolher oficial para recarregar as energias' }, points: 18, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'my_14',
    facet: 'rhythm',
    prompt: {
      es: '¿A qué distancia te gustaría que orbite tu "planeta favorito" esta noche?',
      'pt-BR': 'A que distância você gostaria que seu "planeta favorito" orbitasse esta noite?',
    },
    options: [
      { id: 'my_14_a', emoji: '🧲', label: { es: 'Gravedad cero: pegados sin un milímetro de aire', 'pt-BR': 'Gravidade zero: colados sem um milímetro de espaço' }, points: 94, affectionTag: 'kisses' },
      { id: 'my_14_b', emoji: '🪐', label: { es: 'Órbita cercana, rozándonos con calma', 'pt-BR': 'Órbita bem pertinho, encostando com calma' }, points: 68, affectionTag: 'cuddles' },
      { id: 'my_14_c', emoji: '✨', label: { es: 'Acercándose de a poco para ver si hay chispas', 'pt-BR': 'Chegando aos poucos para ver se rola faísca' }, points: 50, isUnsure: true },
      { id: 'my_14_d', emoji: '🌌', label: { es: 'Cada planeta en su órbita serena hoy', 'pt-BR': 'Cada planeta na sua órbita tranquila hoje' }, points: 15, isBoundaryNo: true, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'my_15',
    facet: 'secret_clue',
    prompt: {
      es: 'Llega a tus manos un sobre lacrado con una invitación en blanco. ¿Qué firma le pones?',
      'pt-BR': 'Chega às suas mãos um envelope lacrado com um convite em branco. O que você escreve nele?',
    },
    options: [
      { id: 'my_15_a', emoji: '💌', label: { es: '"Acepto el misterio... sorpréndeme esta noche"', 'pt-BR': '"Aceito o mistério... me surpreenda esta noite"' }, points: 93, affectionTag: 'romantic_date' },
      { id: 'my_15_b', emoji: '🌹', label: { es: '"Empieza con ternura y veremos hasta dónde llegamos"', 'pt-BR': '"Comece com ternura e veremos até onde vamos"' }, points: 68, affectionTag: 'cuddles' },
      { id: 'my_15_c', emoji: '💬', label: { es: '"Hagamos una cita de charla bonita y risas"', 'pt-BR': '"Vamos fazer um encontro de papo bom e risadas"' }, points: 46, affectionTag: 'deep_talk' },
      { id: 'my_15_d', emoji: '🌙', label: { es: '"Guárdalo para otro día, hoy toca descansar"', 'pt-BR': '"Guarde para outro dia, hoje é dia de descansar"' }, points: 20, affectionTag: 'space_rest' },
    ],
  },
  {
    id: 'my_16',
    facet: 'secret_clue',
    prompt: {
      es: 'Último acertijo: si dejaras una pista anónima sobre la almohada, ¿cuál sería?',
      'pt-BR': 'Último enigma: se você deixasse uma pista anônima no travesseiro, qual seria?',
    },
    options: [
      { id: 'my_16_a', emoji: '🔥', label: { es: '"Esta noche no pongas despertador..."', 'pt-BR': '"Hoje não coloque despertador..."' }, points: 96, affectionTag: 'playful_tease' },
      { id: 'my_16_b', emoji: '💛', label: { es: '"Se aceptan mimos lentos y besos sin apuro"', 'pt-BR': '"Aceitam-se carinhos lentos e beijos sem pressa"' }, points: 66, affectionTag: 'massage' },
      { id: 'my_16_c', emoji: '🧸', label: { es: '"Reserva exclusiva para abrazos y peli"', 'pt-BR': '"Reserva exclusiva para abraços e filme"' }, points: 42, affectionTag: 'cuddles' },
      { id: 'my_16_d', emoji: '💤', label: { es: '"Te quiero infinito, nos vemos en el mundo de los sueños"', 'pt-BR': '"Te amo infinito, nos vemos no mundo dos sonhos"' }, points: 16, affectionTag: 'space_rest' },
    ],
  },
];

export function buildMysteryClue(
  opt: AnswerOption,
  clueNumber: number,
  language: Language
): { emoji: string; moodHint: string; text: string } {
  if (opt.isBoundaryNo) {
    return {
      emoji: '🌙',
      moodHint: language === 'es' ? 'Refugio en calma' : 'Refúgio em calma',
      text:
        language === 'es'
          ? `Pista sellada #${clueNumber}: El radar detecta modo paz y autocuidado. Cero apuro, 100% respeto.`
          : `Pista selada #${clueNumber}: O radar detecta modo paz e autocuidado. Zero pressa, 100% respeito.`,
    };
  }
  if (opt.isUnsure) {
    return {
      emoji: '🎭',
      moodHint: language === 'es' ? 'Intriga total' : 'Intriga no ar',
      text:
        language === 'es'
          ? `Pista sellada #${clueNumber}: ¡Qué suspenso! La balanza se mueve... todo depende de la química del momento.`
          : `Pista selada #${clueNumber}: Que suspense! A balança balança... tudo depende da química do momento.`,
    };
  }
  if (opt.points >= 80) {
    const esList = [
      `Pista #${clueNumber}: Un escalofrío cruzó el radar... ¡alguien está jugando con fuego sutil!`,
      `Pista #${clueNumber}: Las luces bajaron solas y el misterio subió de temperatura.`,
      `Pista #${clueNumber}: Código descifrado parcialmente: hay magnetismo en el ambiente.`,
    ];
    const ptList = [
      `Pista #${clueNumber}: Um arrepio passou pelo radar... alguém está brincando com fogo sutil!`,
      `Pista #${clueNumber}: As luzes baixaram sozinhas e o mistério esquentou.`,
      `Pista #${clueNumber}: Código parcialmente decifrado: há magnetismo no ar.`,
    ];
    const list = language === 'es' ? esList : ptList;
    return {
      emoji: '🔥',
      moodHint: language === 'es' ? 'Chispa secreta' : 'Faísca secreta',
      text: list[clueNumber % list.length],
    };
  }
  if (opt.points >= 45) {
    const esList = [
      `Pista #${clueNumber}: Clima sedoso y curioso... la conquista lenta va ganando puntos.`,
      `Pista #${clueNumber}: Ni todo dicho ni nada cerrado: el ambiente pide cercanía.`,
    ];
    const ptList = [
      `Pista #${clueNumber}: Clima aveludado e curioso... a conquista lenta está ganhando pontos.`,
      `Pista #${clueNumber}: Nem tudo dito nem nada fechado: o clima pede proximidade.`,
    ];
    const list = language === 'es' ? esList : ptList;
    return {
      emoji: '✨',
      moodHint: language === 'es' ? 'Brisa tibia' : 'Brisa morna',
      text: list[clueNumber % list.length],
    };
  }
  return {
    emoji: '🧸',
    moodHint: language === 'es' ? 'Modo terciopelo' : 'Modo aconchego',
    text:
      language === 'es'
        ? `Pista #${clueNumber}: El termómetro susurra manta, calma y ternura sin complicaciones.`
        : `Pista #${clueNumber}: O termômetro sussurra cobertor, calma e ternura sem complicação.`,
  };
}

export const MYSTERY_ARCHETYPES: Record<
  TrafficState,
  { emoji: string; title: Record<Language, string>; description: Record<Language, string> }
> = {
  LIBER: {
    emoji: '🔥',
    title: {
      es: 'Chispa en la Penumbra',
      'pt-BR': 'Faísca na Penumbra',
    },
    description: {
      es: 'Tu brújula nocturna marca atracción, juego cómplice y ganas de acercarse sin prisa.',
      'pt-BR': 'Sua bússola noturna marca atração, jogo cúmplice e vontade de chegar perto sem pressa.',
    },
  },
  CASI_LIBER: {
    emoji: '✨',
    title: {
      es: 'Suspenso Magnético',
      'pt-BR': 'Suspense Magnético',
    },
    description: {
      es: 'El misterio está servido: depende del ritmo, los mimos y cómo se encienda la conversación.',
      'pt-BR': 'O mistério está no ar: depende do ritmo, do carinho e de como a conversa esquentar.',
    },
  },
  ANTI_LIBER: {
    emoji: '🌙',
    title: {
      es: 'Refugio de Terciopelo',
      'pt-BR': 'Refúgio de Veludo',
    },
    description: {
      es: 'Tu radar pide descanso, abrazos tibios y tranquilidad total, sin expectativas.',
      'pt-BR': 'Seu radar pede descanso, abraços quentinhos e sossego total, sem expectativas.',
    },
  },
};
