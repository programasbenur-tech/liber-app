import crypto from 'node:crypto';
import type {
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  CountryCode,
  CurrencyCode,
  PaymentProvider,
  SubscriptionPlan,
} from './types';

export function getMercadoPagoToken(country: CountryCode): string | undefined {
  return country === 'BR'
    ? process.env.MP_ACCESS_TOKEN_BR
    : process.env.MP_ACCESS_TOKEN_UY;
}

export function getCurrencyForCountry(country: CountryCode): CurrencyCode {
  return country === 'BR' ? 'BRL' : 'UYU';
}

export function arePaymentsEnabled(): boolean {
  return process.env.PAYMENTS_ENABLED === 'true';
}

/**
 * Verifies Mercado Pago webhook signature (x-signature: ts=...,v1=...)
 * using HMAC-SHA256 with MP_WEBHOOK_SECRET.
 */
export function verifyMercadoPagoWebhookSignature(params: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
  secret: string | undefined;
}): boolean {
  if (!params.xSignature || !params.xRequestId || !params.dataId || !params.secret) {
    return false;
  }

  const parts = Object.fromEntries(
    params.xSignature.split(',').map((part) => {
      const [k, v] = part.trim().split('=');
      return [k, v];
    })
  );

  if (!parts.ts || !parts.v1) return false;

  const manifest = `id:${params.dataId};request-id:${params.xRequestId};ts:${parts.ts};`;
  const expected = crypto
    .createHmac('sha256', params.secret)
    .update(manifest)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
  } catch {
    return false;
  }
}

export const mercadoPagoProvider: PaymentProvider = {
  name: 'mercadopago',

  async createCheckout(
    req: CheckoutSessionRequest,
    plan: SubscriptionPlan
  ): Promise<CheckoutSessionResponse> {
    const currency = getCurrencyForCountry(req.country);

    if (!arePaymentsEnabled()) {
      return {
        ok: false,
        provider: 'mercadopago',
        country: req.country,
        currency,
        requiresConfiguration: true,
        error:
          req.language === 'pt-BR'
            ? 'Pagamentos desativados no momento. Configure PAYMENTS_ENABLED=true e as credenciais do Mercado Pago.'
            : 'Pagos desactivados por ahora. Configura PAYMENTS_ENABLED=true y las credenciales de Mercado Pago.',
      };
    }

    const token = getMercadoPagoToken(req.country);
    if (!token) {
      return {
        ok: false,
        provider: 'mercadopago',
        country: req.country,
        currency,
        requiresConfiguration: true,
        error: `Missing Mercado Pago access token for ${req.country}.`,
      };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const unitPrice =
      req.country === 'BR' ? plan.priceBrlCents / 100 : plan.priceUyuCents / 100;

    const payload = {
      items: [
        {
          id: plan.code,
          title: req.language === 'pt-BR' ? plan.namePt : plan.nameEs,
          quantity: 1,
          currency_id: currency,
          unit_price: unitPrice,
        },
      ],
      external_reference: `${req.userId}:${plan.code}:${req.country}`,
      back_urls: {
        success: `${appUrl}/?payment=pending_verification`,
        failure: `${appUrl}/?payment=failure`,
        pending: `${appUrl}/?payment=pending`,
      },
      auto_return: 'approved',
      notification_url: `${appUrl}/api/webhooks/mercadopago?country=${req.country}`,
    };

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return {
        ok: false,
        provider: 'mercadopago',
        country: req.country,
        currency,
        error: `Mercado Pago API error (${res.status})`,
      };
    }

    const data = (await res.json()) as {
      id?: string;
      init_point?: string;
      sandbox_init_point?: string;
    };

    const isSandbox = process.env.MP_ENVIRONMENT !== 'production';
    return {
      ok: true,
      provider: 'mercadopago',
      country: req.country,
      currency,
      preferenceId: data.id,
      checkoutUrl: isSandbox ? data.sandbox_init_point : data.init_point,
    };
  },
};
