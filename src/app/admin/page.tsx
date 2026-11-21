'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  Heart,
  Crown,
  Sliders,
  BookOpen,
  ArrowLeft,
  Save,
} from 'lucide-react';
import { DEFAULT_PLANS, type SubscriptionPlan } from '@/lib/payments/types';
import { QUESTION_BANK } from '@/data/questions';

export default function AdminDashboardPage() {
  const [authorized, setAuthorized] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [plans, setPlans] = useState<SubscriptionPlan[]>(DEFAULT_PLANS);
  const [competitionsEnabled, setCompetitionsEnabled] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(QUESTION_BANK[0].id);

  const selectedQuestion =
    QUESTION_BANK.find((q) => q.id === selectedQuestionId) ?? QUESTION_BANK[0];

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl bg-white/95 border border-rose-200 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-rose-700 font-extrabold text-lg">
            <ShieldAlert className="w-6 h-6" />
            <span>LIBER Admin (/admin)</span>
          </div>
          <p className="text-xs text-rose-900/80 leading-relaxed">
            Acceso protegido por rol administrativo. Los administradores solo ven métricas agregadas y nunca pueden leer respuestas íntimas privadas.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (adminPin.trim().length >= 4) {
                setAuthorized(true);
              }
            }}
            className="space-y-3"
          >
            <input
              type="password"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="PIN Demo Admin (ej. 2026)"
              className="w-full rounded-2xl border border-rose-200 px-4 py-2.5 text-sm"
            />
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 py-3 text-white font-bold text-sm cursor-pointer"
            >
              Entrar al Panel Administrativo
            </button>
          </form>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a LIBER ❤️
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-rose-950">
            LIBER ❤️ — Panel Administrativo SaaS
          </h1>
          <p className="text-xs text-rose-800/80">
            Métricas agregadas (sin acceso a respuestas íntimas privadas) • Mercado Pago BR & UY
          </p>
        </div>
        <Link
          href="/"
          className="rounded-2xl bg-white border border-rose-200 px-4 py-2 text-xs font-bold text-rose-900 hover:bg-rose-50 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a la App
        </Link>
      </div>

      {/* Aggregated KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Usuarios Registrados', value: '1,240', icon: Users },
          { label: 'Parejas Conectadas', value: '518', icon: Heart },
          { label: 'Suscripciones Activas', value: '142', icon: Crown },
          { label: 'Ingresos (Sandbox)', value: '$0 / Test', icon: Sliders },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-2xl bg-white/90 border border-rose-100 p-4 shadow-sm"
            >
              <Icon className="w-5 h-5 text-rose-500" />
              <p className="mt-2 text-xl font-extrabold text-rose-950">{kpi.value}</p>
              <p className="text-[11px] font-semibold text-rose-800/75">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Feature Flags */}
      <div className="rounded-3xl bg-white/90 border border-rose-100 p-5 shadow-sm space-y-3">
        <h2 className="font-extrabold text-rose-950 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-purple-500" />
          Módulos Opcionales (Feature Flags)
        </h2>
        <label className="flex items-center justify-between gap-3 rounded-2xl bg-purple-50/70 border border-purple-200 p-4 cursor-pointer">
          <div>
            <p className="text-sm font-bold text-purple-950">ENABLE_COUPLE_COMPETITIONS</p>
            <p className="text-xs text-purple-800/80">
              Desactivado por defecto. Solo permite trivias/desafíos cooperativos voluntarios.
            </p>
          </div>
          <input
            type="checkbox"
            checked={competitionsEnabled}
            onChange={() => setCompetitionsEnabled(!competitionsEnabled)}
            className="w-5 h-5 accent-purple-600"
          />
        </label>
      </div>

      {/* Subscription Plans Editor (BRL & UYU) */}
      <div className="rounded-3xl bg-white/90 border border-rose-100 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-rose-950 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            Planes de Suscripción (Mercado Pago BR & UY)
          </h2>
          <button
            type="button"
            onClick={() => {
              setSavedNotice(true);
              setTimeout(() => setSavedNotice(false), 2000);
            }}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> Guardar Cambios
          </button>
        </div>

        {savedNotice && (
          <p className="text-xs font-bold text-emerald-700">
            ✅ Cambios de planes guardados en memoria de sesión (en producción persiste en tabla `plans` de Supabase).
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          {plans.map((plan, idx) => (
            <div
              key={plan.id}
              className="rounded-2xl bg-rose-50/60 border border-rose-200 p-4 space-y-2.5"
            >
              <p className="text-xs font-extrabold uppercase text-rose-700">{plan.code}</p>
              <input
                type="text"
                value={plan.nameEs}
                onChange={(e) => {
                  const copy = [...plans];
                  copy[idx] = { ...plan, nameEs: e.target.value };
                  setPlans(copy);
                }}
                className="w-full rounded-xl bg-white border border-rose-200 px-3 py-1.5 text-xs font-bold"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-rose-800">Precio BRL (centavos)</label>
                  <input
                    type="number"
                    value={plan.priceBrlCents}
                    onChange={(e) => {
                      const copy = [...plans];
                      copy[idx] = { ...plan, priceBrlCents: Number(e.target.value) };
                      setPlans(copy);
                    }}
                    className="w-full rounded-xl bg-white border border-rose-200 px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-rose-800">Precio UYU (centésimos)</label>
                  <input
                    type="number"
                    value={plan.priceUyuCents}
                    onChange={(e) => {
                      const copy = [...plans];
                      copy[idx] = { ...plan, priceUyuCents: Number(e.target.value) };
                      setPlans(copy);
                    }}
                    className="w-full rounded-xl bg-white border border-rose-200 px-2.5 py-1 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bilingual Question Bank Inspector */}
      <div className="rounded-3xl bg-white/90 border border-rose-100 p-5 shadow-sm space-y-3">
        <h2 className="font-extrabold text-rose-950 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-rose-500" />
          Banco de Preguntas Bilingüe ({QUESTION_BANK.length} preguntas)
        </h2>
        <select
          value={selectedQuestionId}
          onChange={(e) => setSelectedQuestionId(e.target.value)}
          className="w-full rounded-xl border border-rose-200 bg-rose-50/40 px-3 py-2 text-xs font-semibold"
        >
          {QUESTION_BANK.map((q) => (
            <option key={q.id} value={q.id}>
              [{q.category}] {q.prompt.es}
            </option>
          ))}
        </select>

        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-2xl bg-rose-50/70 p-3 border border-rose-100">
            <p className="font-bold text-rose-800">🇪🇸 Español</p>
            <p className="mt-1 font-semibold text-rose-950">{selectedQuestion.prompt.es}</p>
          </div>
          <div className="rounded-2xl bg-purple-50/70 p-3 border border-purple-100">
            <p className="font-bold text-purple-800">🇧🇷 Português (Brasil)</p>
            <p className="mt-1 font-semibold text-purple-950">
              {selectedQuestion.prompt['pt-BR']}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
