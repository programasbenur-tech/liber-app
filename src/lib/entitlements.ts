import type { Language } from '../types/liber.ts';
import type { PlanCode } from './payments/types.ts';

export type PremiumFeatureKey =
  | 'mystery_full'
  | 'trust_lab_full'
  | 'repair_pro'
  | 'anti_stress_ritual'
  | 'couple_history';

export const PLAN_ENTITLEMENTS: Record<
  PlanCode,
  Record<PremiumFeatureKey, boolean>
> = {
  FREE: {
    mystery_full: false,
    trust_lab_full: false,
    repair_pro: false,
    anti_stress_ritual: false,
    couple_history: false,
  },
  PREMIUM: {
    mystery_full: true,
    trust_lab_full: true,
    repair_pro: true,
    anti_stress_ritual: true,
    couple_history: true,
  },
  PLUS: {
    mystery_full: true,
    trust_lab_full: true,
    repair_pro: true,
    anti_stress_ritual: true,
    couple_history: true,
  },
};

export function isPaywallEnforced(envFlag?: string): boolean {
  const flag =
    envFlag !== undefined ? envFlag : process.env.NEXT_PUBLIC_PAYWALL_ENFORCED;
  return flag === 'true';
}

export function canAccessFeature(params: {
  plan: PlanCode;
  feature: PremiumFeatureKey;
  paywallEnforced?: boolean;
}): { allowed: boolean; isLaunchPreview: boolean } {
  const { plan, feature } = params;
  const enforced =
    params.paywallEnforced !== undefined
      ? params.paywallEnforced
      : isPaywallEnforced();

  if (PLAN_ENTITLEMENTS[plan]?.[feature]) {
    return { allowed: true, isLaunchPreview: false };
  }

  if (!enforced) {
    return { allowed: true, isLaunchPreview: true };
  }

  return { allowed: false, isLaunchPreview: false };
}

export interface PaymentReturnBanner {
  kind: 'success' | 'pending' | 'failure';
  title: Record<Language, string>;
  message: Record<Language, string>;
}

export function parsePaymentReturnStatus(
  param: string | null
): PaymentReturnBanner | null {
  if (!param) return null;

  if (param === 'pending_verification') {
    return {
      kind: 'success',
      title: {
        es: '¡Pago recibido en Mercado Pago!',
        'pt-BR': 'Pagamento recebido no Mercado Pago!',
      },
      message: {
        es: 'Estamos confirmando tu suscripción mediante webhook seguro para activar tu plan LIBER.',
        'pt-BR':
          'Estamos confirmando sua assinatura via webhook seguro para ativar seu plano LIBER.',
      },
    };
  }

  if (param === 'pending') {
    return {
      kind: 'pending',
      title: {
        es: 'Pago en proceso',
        'pt-BR': 'Pagamento em andamento',
      },
      message: {
        es: 'Tu pago quedó pendiente de acreditación (PIX, boleto o red de cobranza). Se activará automáticamente al confirmarse.',
        'pt-BR':
          'Seu pagamento está aguardando compensação (PIX ou boleto). Ele será ativado assim que confirmar.',
      },
    };
  }

  if (param === 'failure') {
    return {
      kind: 'failure',
      title: {
        es: 'El pago no se completó',
        'pt-BR': 'O pagamento não foi concluído',
      },
      message: {
        es: 'No se realizó ningún cobro. Puedes reintentarlo cuando quieras desde la pestaña Planes.',
        'pt-BR':
          'Nenhuma cobrança foi feita. Você pode tentar novamente quando quiser na aba Planos.',
      },
    };
  }

  return null;
}
