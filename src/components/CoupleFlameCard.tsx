'use client';

import { useEffect, useRef, useState } from 'react';
import { Flame, Sparkles, Moon, Check } from 'lucide-react';
import {
  FLAME_ACTION_LABELS,
  FLAME_STAGE_META,
  type FlameSummary,
} from '@/lib/flameLogic';
import { playSoundEffect } from '@/lib/sound';
import type { Language } from '@/types/liber';

interface CoupleFlameCardProps {
  language: Language;
  soundEnabled: boolean;
  roomCode: string;
  slotId: string;
  myDisplayName: string;
  refreshKey?: number;
  compact?: boolean;
  onFlameSummaryChange?: (summary: FlameSummary) => void;
}

interface FlameApiResponse {
  ok: boolean;
  storage?: 'supabase' | 'memory';
  summary?: FlameSummary;
}

export function CoupleFlameCard({
  language,
  soundEnabled,
  roomCode,
  slotId,
  myDisplayName,
  refreshKey = 0,
  compact = false,
  onFlameSummaryChange,
}: CoupleFlameCardProps) {
  const [summary, setSummary] = useState<FlameSummary | null>(null);
  const [sendingSpark, setSendingSpark] = useState(false);
  const [sparkToast, setSparkToast] = useState<string | null>(null);
  const callbackRef = useRef(onFlameSummaryChange);

  useEffect(() => {
    callbackRef.current = onFlameSummaryChange;
  }, [onFlameSummaryChange]);

  useEffect(() => {
    if (!roomCode) return;
    let cancelled = false;

    const loadSummary = async () => {
      try {
        const res = await fetch(
          `/api/flame?code=${encodeURIComponent(roomCode)}`
        );
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as FlameApiResponse;
        if (data.ok && data.summary && !cancelled) {
          setSummary(data.summary);
          callbackRef.current?.(data.summary);
        }
      } catch {
        // Ignore transient network errors
      }
    };

    loadSummary();
    const interval = setInterval(loadSummary, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [roomCode, refreshKey]);

  const handleSendSpark = async () => {
    if (!roomCode || !slotId || sendingSpark) return;
    setSendingSpark(true);
    try {
      const res = await fetch('/api/flame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: roomCode,
          slotId,
          senderName:
            myDisplayName.trim() || (language === 'es' ? 'Tu Pareja' : 'Seu Par'),
          actionType: 'spark',
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as FlameApiResponse;
        if (data.ok && data.summary) {
          setSummary(data.summary);
          callbackRef.current?.(data.summary);
          playSoundEffect('insight', soundEnabled);
          setSparkToast(
            language === 'es'
              ? '✨ +1 Chispa enviada a Nuestra Llama'
              : '✨ +1 Faísca enviada para a Chama de Vocês'
          );
          setTimeout(() => setSparkToast(null), 2400);
        }
      }
    } finally {
      setSendingSpark(false);
    }
  };

  const stage = summary?.stage ?? 'spark';
  const stageMeta = FLAME_STAGE_META[stage];
  const totalPoints = summary?.totalPoints ?? 0;
  const progressPercent = summary?.progressPercent ?? 0;
  const activeDaysLast7 = summary?.activeDaysLast7 ?? 0;
  const isGlowing = summary?.status === 'glowing';

  return (
    <div
      className={`rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/80 to-rose-50 border border-amber-200 shadow-sm ${
        compact ? 'p-4 space-y-2.5' : 'p-5 space-y-3.5 shadow-md'
      }`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-950">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            {language === 'es' ? 'Nuestra Llama' : 'Chama de Vocês'}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
              isGlowing
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                : 'bg-white/90 border-amber-200 text-amber-900/80'
            }`}
          >
            {isGlowing ? (
              <>
                <Sparkles className="w-3 h-3 text-emerald-600" />
                {language === 'es' ? 'Encendida hoy' : 'Acesa hoje'}
              </>
            ) : (
              <>
                <Moon className="w-3 h-3 text-amber-600" />
                {language === 'es' ? 'En pausa tranquila' : 'Em pausa tranquila'}
              </>
            )}
          </span>
        </div>

        <span className="text-xs font-extrabold text-orange-900 bg-white/80 border border-amber-200 rounded-full px-2.5 py-0.5">
          {totalPoints} pts · {activeDaysLast7}/7{' '}
          {language === 'es' ? 'días' : 'dias'}
        </span>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm sm:text-base font-extrabold text-rose-950">
            {stageMeta.title[language]}
          </h3>
          {stageMeta.nextThreshold !== null && (
            <span className="text-[11px] font-bold text-orange-800">
              {totalPoints}/{stageMeta.nextThreshold}
            </span>
          )}
        </div>
        <p className="text-xs text-rose-900/80 mt-0.5">
          {stageMeta.subtitle[language]}
        </p>
      </div>

      {/* Gentle progress bar */}
      <div className="h-2.5 w-full rounded-full bg-amber-100 overflow-hidden border border-amber-200/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-500"
          style={{ width: `${Math.max(8, progressPercent)}%` }}
        />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-[11px] text-amber-900/80 leading-snug">
          🤍{' '}
          {language === 'es'
            ? 'Nunca se rompe ni genera culpa; si descansan, solo espera en pausa.'
            : 'Nunca se quebra nem gera culpa; se descansarem, só espera em pausa.'}
        </p>

        <button
          type="button"
          onClick={handleSendSpark}
          disabled={sendingSpark}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-3 py-1.5 text-xs font-extrabold text-white shadow-sm hover:opacity-95 disabled:opacity-60 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {sendingSpark
            ? '...'
            : language === 'es'
            ? 'Enviar Chispa (+1)'
            : 'Enviar Faísca (+1)'}
        </button>
      </div>

      {sparkToast && (
        <div className="rounded-xl bg-emerald-100 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-900 flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          <span>{sparkToast}</span>
        </div>
      )}

      {!compact && summary && summary.recentEvents.length > 0 && (
        <div className="pt-2 border-t border-amber-200/70 space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            {language === 'es' ? 'Últimos gestos de cuidado' : 'Últimos gestos de cuidado'}
          </p>
          <div className="space-y-1">
            {summary.recentEvents.slice(0, 3).map((ev) => {
              const meta = FLAME_ACTION_LABELS[ev.actionType];
              return (
                <div
                  key={ev.id}
                  className="flex items-center justify-between text-xs bg-white/80 rounded-xl px-3 py-1.5 border border-amber-100"
                >
                  <span className="text-rose-950 font-semibold truncate">
                    {meta.emoji} {ev.senderName} · {meta.label[language]}
                  </span>
                  <span className="text-orange-700 font-extrabold shrink-0 ml-2">
                    +{ev.points}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
