import { NextRequest, NextResponse } from 'next/server';
import { mercadoPagoProvider } from '@/lib/payments/mercadopago';
import { DEFAULT_PLANS, type CheckoutSessionRequest } from '@/lib/payments/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<CheckoutSessionRequest>;

    if (!body.planCode || (body.planCode !== 'PREMIUM' && body.planCode !== 'PLUS')) {
      return NextResponse.json({ ok: false, error: 'Invalid planCode' }, { status: 400 });
    }
    if (body.country !== 'BR' && body.country !== 'UY') {
      return NextResponse.json({ ok: false, error: 'Unsupported country' }, { status: 400 });
    }
    if (!body.userId) {
      return NextResponse.json({ ok: false, error: 'Missing userId' }, { status: 400 });
    }

    const plan = DEFAULT_PLANS.find((p) => p.code === body.planCode);
    if (!plan) {
      return NextResponse.json({ ok: false, error: 'Plan not found' }, { status: 404 });
    }

    const result = await mercadoPagoProvider.createCheckout(
      {
        planCode: body.planCode,
        country: body.country,
        userId: body.userId,
        userEmail: body.userEmail,
        language: body.language === 'pt-BR' ? 'pt-BR' : 'es',
      },
      plan
    );

    return NextResponse.json(result, { status: result.ok ? 200 : 503 });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}
