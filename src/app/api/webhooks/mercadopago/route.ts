import { NextRequest, NextResponse } from 'next/server';
import {
  arePaymentsEnabled,
  getMercadoPagoToken,
  verifyMercadoPagoWebhookSignature,
} from '@/lib/payments/mercadopago';
import type { CountryCode } from '@/lib/payments/types';

/**
 * Server-side Mercado Pago Webhook Handler (Brasil & Uruguay).
 * NEVER grants Premium access from client-side redirects; always verifies
 * signature + queries Mercado Pago Payment API before activating subscription.
 */
export async function POST(request: NextRequest) {
  if (!arePaymentsEnabled()) {
    return NextResponse.json(
      { ok: false, error: 'Payments are disabled' },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const countryParam = url.searchParams.get('country');
  const country: CountryCode = countryParam === 'BR' ? 'BR' : 'UY';

  const body = (await request.json().catch(() => ({}))) as {
    type?: string;
    data?: { id?: string | number };
  };
  const dataId = body?.data?.id ? String(body.data.id) : url.searchParams.get('data.id');

  const isValid = verifyMercadoPagoWebhookSignature({
    xSignature: request.headers.get('x-signature'),
    xRequestId: request.headers.get('x-request-id'),
    dataId,
    secret: process.env.MP_WEBHOOK_SECRET,
  });

  if (!isValid) {
    return NextResponse.json({ ok: false, error: 'Invalid webhook signature' }, { status: 401 });
  }

  const token = getMercadoPagoToken(country);
  if (!token || !dataId) {
    return NextResponse.json({ ok: false, error: 'Missing token or payment id' }, { status: 400 });
  }

  // Verify payment status directly with Mercado Pago API
  const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!mpRes.ok) {
    return NextResponse.json({ ok: false, error: 'Could not verify payment' }, { status: 502 });
  }

  const payment = (await mpRes.json()) as {
    status?: string;
    external_reference?: string;
  };

  // In production with SUPABASE_SERVICE_ROLE_KEY, persist `payments` and activate `subscriptions` here.
  return NextResponse.json({
    ok: true,
    verifiedStatus: payment.status ?? 'unknown',
    country,
  });
}
