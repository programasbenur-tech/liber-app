'use client';

import { useState } from 'react';
import { Crown, Check, CreditCard, ShieldCheck, Sparkles } from 'lucide-react';
import { isPaywallEnforced } from '@/lib/entitlements';
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
  roomCode?: string;
  slotId?: string;
}

export function PlansSection({
  language,
  plans = DEFAULT_PLANS,
  currentPlan = 'FREE',
  roomCode,
  slotId,
}: PlansSectionProps) {
  const [country, setCountry] = useState<CountryCode>(
    language === 'pt-BR' ? 'BR' : 'UY'
  );
  const [buyerEmail, setBuyerEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [needsConfigHint, setNeedsConfigHint] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<PlanCode | null>(null);
  const paywallActive = isPaywallEnforced();

  const handleSubscribe = async (planCode: PlanCode) => {
    if (planCode === 'FREE') return;
    setLoadingPlan(planCode);
    setStatusMessage(null);
    setNeedsConfigHint(false);

    try {
      const effectiveUserId = slotId
        ? roomCode
          ? `${roomCode}_${slotId}`
          : slotId
        : 'demo_user_a';

      const res = await fetch('/api/checkout/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planCode,
          country,
          userId: effectiveUserId,
          userEmail: buyerEmail.trim() || undefined,
          language,
        }),
      });

      const data = (await res.json()) as {
        ok: boolean;
        checkoutUrl?: string;
        error?: string;
        requiresConfiguration?: boolean;
      };

      if (data.ok && data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
      } else {
        setNeedsConfigHint(Boolean(data.requiresConfiguration));
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
      <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-rose-100 p-5 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-extrabold text-rose-950 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                {language === 'es' ? 'Planes LIBER SaaS' : 'Planos LIBER SaaS'}
              </h2>
              {!paywallActive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-900">
                  <Sparkles className="w-3 h-3" />
                  {language === 'es'
                    ? 'Lanzamiento abierto (todo desbloqueado hoy)'
                    : 'Lançamento aberto (tudo liberado hoje)'}
                </span>
              )}
            </div>
            <p className="text-xs text-rose-800/80 mt-0.5">
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

        {/* Comparison strip */}
        <div className="grid gap-2 sm:grid-cols-2 rounded-2xl bg-rose-50/70 border border-rose-100 p-3 text-xs">
          <div>
            <p className="font-extrabold text-rose-950">
              💛 {language === 'es' ? 'Gratis para siempre' : 'Grátis para sempre'}
            </p>
            <p className="text-[11px] text-rose-900/80 mt-0.5">
              {language === 'es'
                ? 'Semáforo del Amor, Chat Privado en vivo, Pregunta Diaria "Doble Llave", Nuestra Llama y Tarjeta Viral.'
                : 'Semáforo do Amor, Chat Privado ao vivo, Pergunta Diária "Chave Dupla", Chama de Vocês e Cartão Viral.'}
            </p>
          </div>
          <div>
            <p className="font-extrabold text-rose-950">
              👑 {language === 'es' ? 'LIBER Premium (Pareja Completa)' : 'LIBER Premium (Casal Completo)'}
            </p>
            <p className="text-[11px] text-rose-900/80 mt-0.5">
              {language === 'es'
                ? 'Puente de Paz completo, Ritual Antiestrés guiado, Modo Misterio 16 pistas, Test Científico e Historial.'
                : 'Ponte de Paz completo, Ritual Antiestresse guiado, Modo Mistério 16 pistas, Teste Científico e Histórico.'}
            </p>
          </div>
        </div>

        {/* Optional Email + Payment methods */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <p className="text-[11px] font-semibold text-rose-700">
            <CreditCard className="w-3.5 h-3.5 inline mr-1" />
            {country === 'BR'
              ? 'Mercado Pago Brasil: PIX, Cartão de Crédito, Boleto Bancário.'
              : 'Mercado Pago Uruguay: Tarjetas locales/internacionales, Abitab y Redpagos.'}
          </p>

          <input
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            placeholder={
              language === 'es'
                ? 'Tu email para recibo (opcional)'
                : 'Seu e-mail para recibo (opcional)'
            }
            className="rounded-xl bg-rose-50/60 border border-rose-200 px-3 py-1.5 text-xs text-rose-950 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300 sm:w-64"
          />
        </div>
      </div>

      {statusMessage && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-950 space-y-1.5">
          <p className="font-bold">ℹ️ {statusMessage}</p>
          {needsConfigHint && (
            <p className="text-[11px] text-amber-900/85 leading-relaxed">
              {language === 'es'
                ? 'Para activar cobros reales en producción, agrega en Cloudflare → Settings → Variables and Secrets: PAYMENTS_ENABLED=true, MP_ACCESS_TOKEN_BR / MP_ACCESS_TOKEN_UY y MP_WEBHOOK_SECRET.'
                : 'Para ativar cobranças reais em produção, adicione no Cloudflare → Settings → Variables and Secrets: PAYMENTS_ENABLED=true, MP_ACCESS_TOKEN_BR / MP_ACCESS_TOKEN_UY e MP_WEBHOOK_SECRET.'}
            </p>
          )}
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

      <p className="text-center text-[11px] font-semibold text-rose-900/75 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        {language === 'es'
          ? 'Pago seguro con Mercado Pago · Cancela cuando quieras · Tus respuestas siguen 100% privadas.'
          : 'Pagamento seguro com Mercado Pago · Cancele quando quiser · Suas respostas continuam 100% privadas.'}
      </p>
    </div>
  );
}
