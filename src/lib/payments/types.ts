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
      'Semáforo del Amor diario',
      'Cuestionario básico y Modo Misterio inicial',
      'Modo Pareja privado',
      'Español y Português',
    ],
    benefitsPt: [
      'Semáforo do Amor diário',
      'Questionário básico e Modo Mistério inicial',
      'Modo Casal privado',
      'Espanhol e Português',
    ],
    isActive: true,
  },
  {
    id: 'plan_premium',
    code: 'PREMIUM',
    nameEs: 'LIBER Premium',
    namePt: 'LIBER Premium',
    descriptionEs: 'Experiencia completa: 64 preguntas, Modo Misterio, Laboratorio Científico de Confianza y ruleta.',
    descriptionPt: 'Experiência completa: 64 perguntas, Modo Mistério, Laboratório Científico de Confiança e roleta.',
    priceBrlCents: 1990,
    priceUyuCents: 29000,
    benefitsEs: [
      '64 preguntas + Modo Misterio (Seducción Sutil)',
      'Laboratorio de Confianza y Fidelidad (4 dimensiones)',
      'Ruleta Romántica e historial con opt-in mutuo',
      'Mensajes y sorpresas exclusivas',
    ],
    benefitsPt: [
      '64 perguntas + Modo Mistério (Sedução Sutil)',
      'Laboratório de Confiança e Fidelidade (4 dimensões)',
      'Roleta Romântica e histórico com opt-in mútuo',
      'Mensagens e surpresas exclusivas',
    ],
    isActive: true,
  },
  {
    id: 'plan_plus',
    code: 'PLUS',
    nameEs: 'LIBER Plus',
    namePt: 'LIBER Plus',
    descriptionEs: 'Todo Premium + pacto de acuerdos de pareja, desafíos exclusivos y competencias futuras.',
    descriptionPt: 'Tudo do Premium + pacto de acordos do casal, desafios exclusivos e competições futuras.',
    priceBrlCents: 2990,
    priceUyuCents: 45000,
    benefitsEs: [
      'Todo lo incluido en Premium',
      'Pacto de acuerdos y desafíos semanales para parejas',
      'Personalización avanzada',
      'Acceso prioritario a Competencias (cuando se activen)',
    ],
    benefitsPt: [
      'Tudo incluído no Premium',
      'Pacto de acordos e desafios semanais para casais',
      'Personalização avançada',
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
