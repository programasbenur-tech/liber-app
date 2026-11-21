'use client';

import { useState } from 'react';
import { Crown, Check, CreditCard } from 'lucide-react';
import {
  DEFAULT_PLANS,
  formatPlanPrice,
  type CountryCode,
  type PlanCode,
  type SubscriptionPlan,
} from '@/lib/payments/types';
import type { Language } from '@/types/liber';

interface PlansSectionProps {
  language: Language;
  plans?: SubscriptionPlan[];
  currentPlan?: PlanCode;
}

export function PlansSection({
  language,
  plans = DEFAULT_PLANS,
  currentPlan = 'FREE',
}: PlansSectionProps) {
  const [country, setCountry] = useState<CountryCode>(language === 'pt-BR' ? 'BR' : 'UY');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<PlanCode | null>(null);

  const handleSubscribe = async (planCode: PlanCode) => {
    if (planCode === 'FREE') return;
    setLoadingPlan(planCode);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/checkout/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planCode,
          country,
          userId: 'demo_user_a',
          language,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        checkoutUrl?: string;
        error?: string;
      };
      if (data.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setStatusMessage(
          data.error ??
            (language === 'pt-BR'
              ? 'Configure as chaves do Mercado Pago para ativar cobranças reais.'
              : 'Configura las llaves de Mercado Pago para activar cobros reales.')
        );
      }
    } catch {
      setStatusMessage(
        language === 'pt-BR'
          ? 'Erro ao iniciar checkout do Mercado Pago.'
          : 'Error al iniciar el checkout de Mercado Pago.'
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-rose-950 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              {language === 'es' ? 'Planes LIBER SaaS' : 'Planos LIBER SaaS'}
            </h2>
            <p className="text-xs text-rose-800/80">
              {language === 'es'
                ? 'Pagos locales seguros con Mercado Pago Brasil y Mercado Pago Uruguay.'
                : 'Pagamentos locais seguros com Mercado Pago Brasil e Mercado Pago Uruguai.'}
            </p>
          </div>

          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setCountry('BR')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold border cursor-pointer ${
                country === 'BR'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-rose-900 border-rose-200'
              }`}
            >
              🇧🇷 Brasil (BRL)
            </button>
            <button
              type="button"
              onClick={() => setCountry('UY')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold border cursor-pointer ${
                country === 'UY'
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-rose-900 border-rose-200'
              }`}
            >
              🇺🇾 Uruguay (UYU)
            </button>
          </div>
        </div>

        <p className="text-[11px] font-semibold text-rose-700">
          <CreditCard className="w-3.5 h-3.5 inline mr-1" />
          {country === 'BR'
            ? 'Mercado Pago Brasil: PIX, Cartão de Crédito, Boleto Bancário.'
            : 'Mercado Pago Uruguay: Tarjetas locales/internacionales, Abitab y Redpagos.'}
        </p>
      </div>

      {statusMessage && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-xs font-semibold text-amber-900">
          ℹ️ {statusMessage}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {plans
          .filter((p) => p.isActive)
          .map((plan) => {
            const isCurrent = plan.code === currentPlan;
            const benefits = language === 'pt-BR' ? plan.benefitsPt : plan.benefitsEs;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-5 border shadow-sm flex flex-col justify-between ${
                  plan.code === 'PREMIUM'
                    ? 'bg-gradient-to-b from-rose-50 to-white border-rose-300 shadow-md'
                    : 'bg-white/90 border-rose-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-rose-950">
                      {language === 'pt-BR' ? plan.namePt : plan.nameEs}
                    </h3>
                    {plan.code === 'PREMIUM' && (
                      <span className="rounded-full bg-rose-500 text-white px-2.5 py-0.5 text-[10px] font-bold">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-rose-600">
                    {formatPlanPrice(plan, country)}
                    {plan.code !== 'FREE' && (
                      <span className="text-xs font-semibold text-rose-800/70">
                        {language === 'pt-BR' ? '/mês' : '/mes'}
                      </span>
                    )}
                  </p>
                  <p className="mt-1.5 text-xs text-rose-900/80">
                    {language === 'pt-BR' ? plan.descriptionPt : plan.descriptionEs}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {benefits.map((b, i) => (
                      <li key={i} className="text-xs text-rose-950 flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={isCurrent || loadingPlan === plan.code}
                  onClick={() => handleSubscribe(plan.code)}
                  className={`mt-5 w-full rounded-2xl py-2.5 px-4 text-xs font-extrabold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-rose-100 text-rose-700 cursor-default'
                      : 'bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:opacity-95'
                  }`}
                >
                  {isCurrent
                    ? language === 'pt-BR'
                      ? 'Plano Atual'
                      : 'Plan Actual'
                    : loadingPlan === plan.code
                    ? '...'
                    : language === 'pt-BR'
                    ? 'Assinar com Mercado Pago'
                    : 'Suscribirme con Mercado Pago'}
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
