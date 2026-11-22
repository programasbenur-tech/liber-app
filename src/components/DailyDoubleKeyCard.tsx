'use client';

import { useEffect, useRef, useState } from 'react';
import { KeyRound, Lock, Sparkles, MessageCircle } from 'lucide-react';
import { getDailyPromptForDate } from '@/data/dailyPrompts';
import type { DailyAnswerEntry, DailyUnlockStatus } from '@/lib/dailyPromptLogic';
import { playSoundEffect } from '@/lib/sound';
import type { Language } from '@/types/liber';

interface DailyDoubleKeyCardProps {
  language: Language;
  soundEnabled: boolean;
  roomCode: string;
  slotId: string;
  myDisplayName: string;
  onDiscussInChat?: (emoji: string, text: string) => void;
  onAnswerSubmitted?: () => void;
}

interface DailyApiResponse {
  ok: boolean;
  storage?: 'supabase' | 'memory';
  status: DailyUnlockStatus;
  myAnswer: DailyAnswerEntry | null;
  partnerAnswered: boolean;
  partnerName: string | null;
  visiblePartnerAnswer: string | null;
}

function getLocalDateKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function DailyDoubleKeyCard({
  language,
  soundEnabled,
  roomCode,
  slotId,
  myDisplayName,
  onDiscussInChat,
  onAnswerSubmitted,
}: DailyDoubleKeyCardProps) {
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [dailyState, setDailyState] = useState<DailyApiResponse | null>(null);
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [discussed, setDiscussed] = useState(false);
  const prevStatusRef = useRef<DailyUnlockStatus | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDateKey(getLocalDateKey());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!dateKey || !roomCode || !slotId) return;

    const fetchDaily = async () => {
      try {
        const qs = new URLSearchParams({
          code: roomCode,
          slotId,
          date: dateKey,
        });
        const res = await fetch(`/api/daily?${qs.toString()}`);
        if (!res.ok) return;
        const data = (await res.json()) as DailyApiResponse;
        if (!data.ok) return;

        if (
          prevStatusRef.current &&
          prevStatusRef.current !== 'unlocked' &&
          data.status === 'unlocked'
        ) {
          playSoundEffect('insight', soundEnabled);
        }
        prevStatusRef.current = data.status;
        setDailyState(data);
      } catch {
        // Ignore transient network errors
      }
    };

    fetchDaily();
    const interval = setInterval(fetchDaily, 5000);
    return () => clearInterval(interval);
  }, [dateKey, roomCode, slotId, soundEnabled]);

  if (!dateKey) {
    return (
      <div className="rounded-3xl bg-white/80 border border-amber-100 p-5 animate-pulse h-32" />
    );
  }

  const prompt = getDailyPromptForDate(dateKey);
  const status: DailyUnlockStatus = dailyState?.status ?? 'neither_answered';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = draft.trim();
    if (!clean || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: roomCode,
          slotId,
          date: dateKey,
          senderName: myDisplayName || (language === 'es' ? 'Tu Pareja' : 'Seu Par'),
          answerText: clean,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as DailyApiResponse;
        if (data.ok) {
          prevStatusRef.current = data.status;
          setDailyState(data);
          setDraft('');
          playSoundEffect(data.status === 'unlocked' ? 'insight' : 'pop', soundEnabled);
          onAnswerSubmitted?.();
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-amber-50/95 via-rose-50/80 to-purple-50/90 border border-amber-200 p-5 shadow-md space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-[11px] font-extrabold text-amber-950">
          <KeyRound className="w-3.5 h-3.5 text-amber-700" />
          {language === 'es' ? 'Pregunta Diaria "Doble Llave"' : 'Pergunta Diária "Chave Dupla"'}
        </span>
        <span className="text-[11px] font-bold text-rose-700">
          {prompt.emoji} {prompt.theme[language]}
        </span>
      </div>

      <h3 className="text-base sm:text-lg font-extrabold text-rose-950 leading-snug">
        {prompt.prompt[language]}
      </h3>

      {status === 'waiting_for_me' && (
        <div className="rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm animate-pulse">
          👀{' '}
          {language === 'es'
            ? `¡${dailyState?.partnerName || 'Tu pareja'} ya respondió! Responde tú para abrir ambas llaves.`
            : `${dailyState?.partnerName || 'Seu par'} já respondeu! Responda você para abrir as duas chaves.`}
        </div>
      )}

      {(status === 'neither_answered' || status === 'waiting_for_me') && (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <textarea
            rows={2}
            maxLength={300}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              language === 'es'
                ? 'Escribe tu respuesta sincera... (solo se revela cuando ambos respondan)'
                : 'Escreva sua resposta sincera... (só revela quando os dois responderem)'
            }
            className="w-full rounded-2xl bg-white border border-amber-200 px-3.5 py-2.5 text-sm text-rose-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={submitting || !draft.trim()}
            className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 py-3 px-4 text-xs sm:text-sm font-extrabold text-white shadow hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {status === 'waiting_for_me'
              ? language === 'es'
                ? 'Desbloquear ahora 🔑'
                : 'Desbloquear agora 🔑'
              : language === 'es'
              ? 'Guardar mi llave 🔑'
              : 'Guardar minha chave 🔑'}
          </button>
        </form>
      )}

      {status === 'waiting_for_partner' && dailyState?.myAnswer && (
        <div className="space-y-2.5">
          <div className="rounded-2xl bg-white/90 border border-rose-200 p-3.5 text-xs text-rose-950">
            <p className="font-extrabold text-rose-700 mb-1">
              {language === 'es' ? 'Tu respuesta guardada:' : 'Sua resposta salva:'}
            </p>
            <p className="font-medium leading-relaxed">{dailyState.myAnswer.answerText}</p>
          </div>
          <div className="rounded-2xl bg-purple-50/90 border border-purple-200 px-4 py-3 text-xs font-bold text-purple-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              {language === 'es'
                ? 'Esperando la llave de tu pareja para revelar ambas respuestas.'
                : 'Aguardando a chave do seu par para revelar as duas respostas.'}
            </span>
          </div>
        </div>
      )}

      {status === 'unlocked' && dailyState?.myAnswer && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
            <Sparkles className="w-4 h-4" />
            <span>
              {language === 'es'
                ? '¡Doble llave abierta! Aquí están sus respuestas:'
                : 'Chave dupla aberta! Aqui estão as respostas:'}
            </span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-2xl bg-white border border-rose-200 p-3.5 text-xs space-y-1">
              <p className="font-extrabold text-rose-700">
                {myDisplayName || (language === 'es' ? 'Tú' : 'Você')}
              </p>
              <p className="text-rose-950 leading-relaxed">{dailyState.myAnswer.answerText}</p>
            </div>
            <div className="rounded-2xl bg-white border border-purple-200 p-3.5 text-xs space-y-1">
              <p className="font-extrabold text-purple-700">
                {dailyState.partnerName || (language === 'es' ? 'Tu pareja' : 'Seu par')}
              </p>
              <p className="text-purple-950 leading-relaxed">
                {dailyState.visiblePartnerAnswer}
              </p>
            </div>
          </div>

          {onDiscussInChat && (
            <button
              type="button"
              disabled={discussed}
              onClick={() => {
                onDiscussInChat(
                  prompt.emoji,
                  language === 'es'
                    ? `Sobre la pregunta de hoy ("${prompt.prompt.es}"): me encantó leer tu respuesta 💛`
                    : `Sobre a pergunta de hoje ("${prompt.prompt['pt-BR']}"): adorei ler sua resposta 💛`
                );
                setDiscussed(true);
              }}
              className="w-full rounded-2xl bg-purple-600 py-2.5 px-4 text-xs font-extrabold text-white hover:bg-purple-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <MessageCircle className="w-4 h-4" />
              {discussed
                ? language === 'es'
                  ? 'Enviado al chat ✓'
                  : 'Enviado ao chat ✓'
                : language === 'es'
                ? 'Comentar en el chat'
                : 'Comentar no chat'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
