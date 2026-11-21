import { Language, RomanticIdea } from '@/types/liber';

export const ROMANTIC_IDEAS: RomanticIdea[] = [
  {
    id: 'idea_1',
    type: 'surprise',
    emoji: '💌',
    title: { es: 'Nota escondida de amor', 'pt-BR': 'Bilhetinho escondido de amor' },
    description: {
      es: 'Escribe en un papelito 3 cosas que te encantan de tu pareja y déjalo en su almohada o taza.',
      'pt-BR': 'Escreva em um papel 3 coisas que você ama no seu par e deixe no travesseiro ou na xícara.',
    },
  },
  {
    id: 'idea_2',
    type: 'nonsexual_bonding',
    emoji: '💆',
    title: { es: 'Spa de 10 minutos en casa', 'pt-BR': 'Spa de 10 minutos em casa' },
    description: {
      es: 'Masaje de hombros y cuello con música suave, sin celulares y sin ninguna expectativa.',
      'pt-BR': 'Massagem nos ombros e pescoço com música suave, sem celular e sem nenhuma expectativa.',
    },
  },
  {
    id: 'idea_3',
    type: 'date',
    emoji: '🧺',
    title: { es: 'Picnic en la sala', 'pt-BR': 'Piquenique na sala' },
    description: {
      es: 'Extiendan una manta en el piso, pongan snacks ricos, velitas y su playlist favorita.',
      'pt-BR': 'Estendam uma manta no chão, coloquem petiscos gostosos, velinhas e a playlist favorita.',
    },
  },
  {
    id: 'idea_4',
    type: 'nonsexual_bonding',
    emoji: '🫂',
    title: { es: 'El abrazo de los 30 segundos', 'pt-BR': 'O abraço de 30 segundos' },
    description: {
      es: 'Abrácense en silencio durante 30 segundos completos respirando al mismo ritmo. ¡Reinicia el estrés!',
      'pt-BR': 'Abracem-se em silêncio por 30 segundos completos respirando no mesmo ritmo. Zera o estresse!',
    },
  },
  {
    id: 'idea_5',
    type: 'surprise',
    emoji: '💃',
    title: { es: 'Baile lento en la cocina', 'pt-BR': 'Dança lenta na cozinha' },
    description: {
      es: 'Pon una canción romántica de sorpresa y saca a bailar a tu pareja entre las ollas.',
      'pt-BR': 'Coloque uma música romântica de surpresa e tire seu par para dançar no meio da cozinha.',
    },
  },
  {
    id: 'idea_6',
    type: 'date',
    emoji: '🌙',
    title: { es: 'Caminata bajo las estrellas', 'pt-BR': 'Caminhada sob as estrelas' },
    description: {
      es: 'Salgan 15 minutos tomados de la mano a tomar aire fresco y hablar de un sueño futuro.',
      'pt-BR': 'Saiam 15 minutos de mãos dadas para respirar ar puro e falar de um sonho futuro.',
    },
  },
  {
    id: 'idea_7',
    type: 'nonsexual_bonding',
    emoji: '🎬',
    title: { es: 'Noche de cine con entrada VIP', 'pt-BR': 'Noite de cinema com ingresso VIP' },
    description: {
      es: 'Preparen palomitas, apaguen las luces y elijan una película que los haga reír juntos.',
      'pt-BR': 'Preparem pipoca, apaguem as luzes e escolham um filme que faça vocês rirem juntos.',
    },
  },
  {
    id: 'idea_8',
    type: 'surprise',
    emoji: '☕',
    title: { es: 'Bebida favorita a domicilio interno', 'pt-BR': 'Bebida favorita com entrega VIP' },
    description: {
      es: 'Sorprende a tu pareja llevándole un té, café o chocolate caliente con una sonrisa gigante.',
      'pt-BR': 'Surpreenda seu par levando um chá, café ou chocolate quente com um sorrisão.',
    },
  },
  {
    id: 'idea_9',
    type: 'date',
    emoji: '🌅',
    title: { es: 'Cita de preguntas curiosas', 'pt-BR': 'Encontro de perguntas curiosas' },
    description: {
      es: 'Cada uno hace 3 preguntas divertidas sobre recuerdos de cuando se conocieron.',
      'pt-BR': 'Cada um faz 3 perguntas divertidas sobre lembranças de quando se conheceram.',
    },
  },
  {
    id: 'idea_10',
    type: 'nonsexual_bonding',
    emoji: '🎨',
    title: { es: 'Dibujo rápido con risas', 'pt-BR': 'Desenho rápido com risadas' },
    description: {
      es: 'Tienen 60 segundos para dibujar al otro en una servilleta y luego intercambiar las obras de arte.',
      'pt-BR': 'Vocês têm 60 segundos para desenhar o outro em um guardanapo e trocar as obras de arte.',
    },
  },
];

export interface VirtualMessageTemplate {
  key: string;
  emoji: string;
  text: Record<Language, string>;
}

export const VIRTUAL_AFFECTION_MESSAGES: VirtualMessageTemplate[] = [
  {
    key: 'hug_no_rush',
    emoji: '🫂',
    text: {
      es: 'Te mando un abrazo largo y sin ninguna prisa.',
      'pt-BR': 'Te mando um abraço demorado e sem nenhuma pressa.',
    },
  },
  {
    key: 'look_amazing',
    emoji: '✨',
    text: {
      es: 'Solo pasaba a recordarte que hoy te ves increíble.',
      'pt-BR': 'Só passei para lembrar que hoje você está incrível.',
    },
  },
  {
    key: 'cuddle_mode',
    emoji: '🧸',
    text: {
      es: 'Modo mimos activado: ¿nos acurrucamos un ratito?',
      'pt-BR': 'Modo carinho ativado: vamos ficar agarradinhos um pouco?',
    },
  },
  {
    key: 'zero_pressure',
    emoji: '💛',
    text: {
      es: 'Hoy quiero cuidarte y consentirte, sin esperar nada a cambio.',
      'pt-BR': 'Hoje quero cuidar de você e te mimar, sem esperar nada em troca.',
    },
  },
  {
    key: 'spark_note',
    emoji: '💘',
    text: {
      es: 'Me encantas muchísimo. Cuando quieras, conversamos.',
      'pt-BR': 'Você me encanta demais. Quando quiser, a gente conversa.',
    },
  },
  {
    key: 'sleepy_bears',
    emoji: '🐻',
    text: {
      es: 'Equipo ositos dormilones listo para descansar juntos.',
      'pt-BR': 'Time ursinhos sonolentos pronto para descansar juntos.',
    },
  },
];
