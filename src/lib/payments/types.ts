export type CountryCode = 'BR' | 'UY';
export type CurrencyCode = 'BRL' | 'UYU';
export type PlanCode = 'FREE' | 'PREMIUM' | 'PLUS';

export interface SubscriptionPlan {
  id: string;
  code: PlanCode;
  nameEs: string;
  namePt: string;
  descriptionEs: string;
  descriptionPt: string;
  priceBrlCents: number;
  priceUyuCents: number;
  benefitsEs: string[];
  benefitsPt: string[];
  isActive: boolean;
}

export interface CheckoutSessionRequest {
  planCode: Exclude<PlanCode, 'FREE'>;
  country: CountryCode;
  userId: string;
  userEmail?: string;
  language: 'es' | 'pt-BR';
}

export interface CheckoutSessionResponse {
  ok: boolean;
  provider: 'mercadopago';
  country: CountryCode;
  currency: CurrencyCode;
  checkoutUrl?: string;
  preferenceId?: string;
  error?: string;
  requiresConfiguration?: boolean;
}

export interface PaymentProvider {
  name: string;
  createCheckout(req: CheckoutSessionRequest, plan: SubscriptionPlan): Promise<CheckoutSessionResponse>;
}

export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_free',
    code: 'FREE',
    nameEs: 'LIBER Gratis',
    namePt: 'LIBER Grátis',
    descriptionEs: 'Semáforo diario y juegos esenciales para empezar a conectar.',
    descriptionPt: 'Semáforo diário e jogos essenciais para começar a conectar.',
    priceBrlCents: 0,
    priceUyuCents: 0,
    benefitsEs: [
      'Semáforo del Amor + Chat privado en vivo',
      'Pregunta Diaria "Doble Llave" + Nuestra Llama',
      'Tarjeta Viral Anónima para WhatsApp / Stories',
      'Ronda inicial de cuestionario y Español / Português',
    ],
    benefitsPt: [
      'Semáforo do Amor + Chat privado ao vivo',
      'Pergunta Diária "Chave Dupla" + Chama de Vocês',
      'Cartão Viral Anônimo para WhatsApp / Stories',
      'Rodada inicial de perguntas e Espanhol / Português',
    ],
    isActive: true,
  },
  {
    id: 'plan_premium',
    code: 'PREMIUM',
    nameEs: 'LIBER Premium',
    namePt: 'LIBER Premium',
    descriptionEs: 'Herramienta completa de cercanía: Puente de Paz, Ritual Antiestrés, Modo Misterio y Confianza.',
    descriptionPt: 'Ferramenta completa de proximidade: Ponte de Paz, Ritual Antiestresse, Modo Mistério e Confiança.',
    priceBrlCents: 1990,
    priceUyuCents: 29000,
    benefitsEs: [
      'Puente de Paz completo (12 frases + Inicio Suave)',
      'Ritual Conversación Antiestrés (2 a 10 min guiados)',
      '64 preguntas + Modo Misterio + Laboratorio de Confianza',
      'Historial compartido con opt-in mutuo y Ruleta',
    ],
    benefitsPt: [
      'Ponte de Paz completo (12 frases + Início Suave)',
      'Ritual Conversa Antiestresse (2 a 10 min guiados)',
      '64 perguntas + Modo Mistério + Laboratório de Confiança',
      'Histórico compartilhado com opt-in mútuo e Roleta',
    ],
    isActive: true,
  },
  {
    id: 'plan_plus',
    code: 'PLUS',
    nameEs: 'LIBER Plus',
    namePt: 'LIBER Plus',
    descriptionEs: 'Todo Premium + pacto semanal de acuerdos de pareja, personalización y acceso prioritario.',
    descriptionPt: 'Tudo do Premium + pacto semanal de acordos do casal, personalização e acesso prioritário.',
    priceBrlCents: 2990,
    priceUyuCents: 45000,
    benefitsEs: [
      'Todo lo incluido en LIBER Premium',
      'Pacto semanal de acuerdos y desafíos de pareja',
      'Personalización avanzada de sala y tarjetas',
      'Acceso prioritario a Competencias (cuando se activen)',
    ],
    benefitsPt: [
      'Tudo incluído no LIBER Premium',
      'Pacto semanal de acordos e desafios de casal',
      'Personalização avançada de sala e cartões',
      'Acesso prioritário a Competições (quando ativadas)',
    ],
    isActive: true,
  },
];

export function formatPlanPrice(plan: SubscriptionPlan, country: CountryCode): string {
  const cents = country === 'BR' ? plan.priceBrlCents : plan.priceUyuCents;
  if (cents === 0) return country === 'BR' ? 'R$ 0' : '$U 0';
  const amount = (cents / 100).toFixed(country === 'BR' ? 2 : 0);
  return country === 'BR' ? `R$ ${amount.replace('.', ',')}` : `$U ${amount}`;
}
