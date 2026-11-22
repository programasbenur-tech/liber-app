'use client';

import { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw,
  Check,
  Sparkles,
  ArrowRight,
  Timer,
} from 'lucide-react';
import {
  ANTI_STRESS_PROMPTS,
  ANTI_STRESS_RULES,
  CLINICAL_RITUAL_NOTE,
  EMPATHY_REPLIES,
  RITUAL_STAGES,
  type RitualStageId,
} from '@/data/antiStressRitual';
import { playSoundEffect } from '@/lib/sound';
import type { Language } from '@/types/liber';

interface AntiStressRitualCardProps {
  language: Language;
  soundEnabled: boolean;
  defaultOpen?: boolean;
  onSendToChat?: (emoji: string, text: string) => void;
  onCompleteRitual?: () => void;
}

type RitualMode = 'express' | 'classic';

const MODE_SECONDS: Record<RitualMode, number> = {
  express: 60,
  classic: 300,
};

function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function AntiStressRitualCard({
  language,
  soundEnabled,
  defaultOpen = false,
  onSendToChat,
  onCompleteRitual,
}: AntiStressRitualCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [mode, setMode] = useState<RitualMode>('express');
  const [stage, setStage] = useState<RitualStageId>('intro');
  const [secondsLeft, setSecondsLeft] = useState(MODE_SECONDS.express);
  const [isRunning, setIsRunning] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const activelyRunning = isRunning && secondsLeft > 0;
  const stageMeta = RITUAL_STAGES.find((s) => s.id === stage) ?? RITUAL_STAGES[0];
  const currentPrompt = ANTI_STRESS_PROMPTS[promptIndex % ANTI_STRESS_PROMPTS.length];

  const handleSelectMode = (nextMode: RitualMode) => {
    playSoundEffect('pop', soundEnabled);
    setMode(nextMode);
    setIsRunning(false);
    setSecondsLeft(MODE_SECONDS[nextMode]);
  };

  const handleStartTurn = (targetStage: 'turn_a' | 'turn_b') => {
    playSoundEffect('casi', soundEnabled);
    setStage(targetStage);
    setSecondsLeft(MODE_SECONDS[mode]);
    setIsRunning(true);
  };

  const handleSendEmpathy = (emoji: string, text: string) => {
    playSoundEffect('message', soundEnabled);
    onSendToChat?.(emoji, text);
    setToast(
      language === 'es'
        ? 'Enviado al chat de pareja ✓'
        : 'Enviado ao chat do casal ✓'
    );
    setTimeout(() => setToast(null), 2200);
  };

  const handleComplete = () => {
    if (completed) return;
    setCompleted(true);
    setIsRunning(false);
    playSoundEffect('liber', soundEnabled);
    onCompleteRitual?.();
    setToast(
      language === 'es'
        ? '🔥 +3 puntos sumados a Nuestra Llama'
        : '🔥 +3 pontos somados à Chama de Vocês'
    );
    setTimeout(() => setToast(null), 2600);
  };

  const handleReset = () => {
    playSoundEffect('pop', soundEnabled);
    setIsRunning(false);
    setStage('intro');
    setSecondsLeft(MODE_SECONDS[mode]);
    setCompleted(false);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-50/90 via-teal-50/80 to-sky-50/90 border border-emerald-200 p-5 shadow-md space-y-4">
      <button
        type="button"
        onClick={() => {
          playSoundEffect('pop', soundEnabled);
          setIsOpen((v) => !v);
        }}
        className="w-full flex items-center justify-between gap-2 text-left cursor-pointer"
      >
        <div className="space-y-0.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-950">
            <Timer className="w-3 h-3 text-emerald-700" />
            {language === 'es' ? 'Ritual Diario de 2 a 10 min' : 'Ritual Diário de 2 a 10 min'}
          </span>
          <h3 className="text-sm sm:text-base font-extrabold text-emerald-950">
            🧘{' '}
            {language === 'es'
              ? 'Conversación Antiestrés (Escucha sin juicios)'
              : 'Conversa Antiestresse (Escuta sem julgamentos)'}
          </h3>
          <p className="text-xs text-emerald-900/80">
            {language === 'es'
              ? 'Para descargar el peso de afuera juntos, sin reclamos ni sermones.'
              : 'Para aliviar juntos o peso de fora, sem cobranças nem sermões.'}
          </p>
        </div>

        <span className="rounded-full bg-white/90 border border-emerald-200 p-1.5 text-emerald-800 shrink-0">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {toast && (
        <div className="rounded-xl bg-emerald-600 text-white px-3 py-2 text-xs font-bold flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {isOpen && (
        <div className="space-y-4 pt-1 border-t border-emerald-200/70">
          {/* Stepper indicators */}
          <div className="grid grid-cols-4 gap-1.5">
            {RITUAL_STAGES.map((item, idx) => {
              const active = item.id === stage;
              return (
                <div
                  key={item.id}
                  className={`rounded-xl px-2 py-1.5 text-center text-[11px] font-bold border ${
                    active
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white/80 text-emerald-900/75 border-emerald-100'
                  }`}
                >
                  {idx + 1}. {item.title[language].split('·')[0].trim()}
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl bg-white/85 border border-emerald-100 p-3.5">
            <p className="text-xs font-extrabold text-emerald-950">
              {stageMeta.title[language]}
            </p>
            <p className="text-xs text-emerald-900/80 mt-0.5">
              {stageMeta.guide[language]}
            </p>
          </div>

          {stage === 'intro' && (
            <div className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-3">
                {ANTI_STRESS_RULES.map((rule) => (
                  <div
                    key={rule.id}
                    className="rounded-2xl bg-white/90 border border-emerald-100 p-3 space-y-1"
                  >
                    <p className="text-xs font-extrabold text-emerald-950">
                      {rule.emoji} {rule.title[language]}
                    </p>
                    <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                      {rule.description[language]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectMode('express')}
                  className={`flex-1 min-w-[140px] rounded-xl px-3 py-2 text-xs font-extrabold border cursor-pointer ${
                    mode === 'express'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-emerald-900 border-emerald-200'
                  }`}
                >
                  ⚡{' '}
                  {language === 'es'
                    ? 'Express 2 min (1 min c/u)'
                    : 'Express 2 min (1 min cada)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMode('classic')}
                  className={`flex-1 min-w-[140px] rounded-xl px-3 py-2 text-xs font-extrabold border cursor-pointer ${
                    mode === 'classic'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-emerald-900 border-emerald-200'
                  }`}
                >
                  🌿{' '}
                  {language === 'es'
                    ? 'Clásico 10 min (5 min c/u)'
                    : 'Clássico 10 min (5 min cada)'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleStartTurn('turn_a')}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 px-4 text-xs font-extrabold text-white shadow-sm hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                {language === 'es' ? 'Comenzar Turno 1' : 'Começar Turno 1'}
              </button>
            </div>
          )}

          {(stage === 'turn_a' || stage === 'turn_b') && (
            <div className="space-y-3">
              {/* Countdown box */}
              <div className="rounded-2xl bg-white border border-emerald-200 p-4 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    {stage === 'turn_a'
                      ? language === 'es'
                        ? 'Turno 1 · Habla quien comienza'
                        : 'Turno 1 · Fala quem começa'
                      : language === 'es'
                      ? 'Turno 2 · Habla su pareja'
                      : 'Turno 2 · Fala seu par'}
                  </p>
                  <p className="text-3xl font-extrabold text-emerald-950 tabular-nums mt-0.5">
                    {formatTimer(secondsLeft)}
                  </p>
                  {secondsLeft === 0 && (
                    <p className="text-[11px] font-bold text-amber-700 mt-0.5">
                      ⏰{' '}
                      {language === 'es'
                        ? 'Tiempo cumplido — pueden pasar al siguiente paso cuando gusten.'
                        : 'Tempo concluído — podem ir para o próximo passo quando quiserem.'}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRunning((r) => !r)}
                    className="rounded-xl bg-emerald-100 border border-emerald-300 px-3 py-2 text-xs font-extrabold text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    {activelyRunning ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        {language === 'es' ? 'Pausar' : 'Pausar'}
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        {language === 'es' ? 'Seguir' : 'Continuar'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRunning(false);
                      setSecondsLeft(MODE_SECONDS[mode]);
                    }}
                    className="rounded-xl bg-white border border-emerald-200 px-2.5 py-2 text-xs font-bold text-emerald-800 cursor-pointer"
                    aria-label={language === 'es' ? 'Reiniciar reloj' : 'Reiniciar relógio'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Prompt starter */}
              <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-amber-900">
                    🗣️{' '}
                    {language === 'es'
                      ? 'Frase guía para empezar a hablar:'
                      : 'Frase guia para começar a falar:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      playSoundEffect('pop', soundEnabled);
                      setPromptIndex((i) => i + 1);
                    }}
                    className="text-[11px] font-extrabold text-amber-800 underline cursor-pointer"
                  >
                    {language === 'es' ? 'Otra frase ↻' : 'Outra frase ↻'}
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-bold text-rose-950">
                  {currentPrompt.emoji} “{currentPrompt.text[language]}”
                </p>
              </div>

              {/* Listener empathy buttons */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-emerald-950">
                  👂{' '}
                  {language === 'es'
                    ? 'Respuestas de empatía en 1 toque (para quien escucha):'
                    : 'Respostas de empatia em 1 toque (para quem ouve):'}
                </p>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {EMPATHY_REPLIES.map((reply) => (
                    <button
                      key={reply.id}
                      type="button"
                      onClick={() => handleSendEmpathy(reply.emoji, reply.text[language])}
                      className="text-left rounded-xl bg-white/95 hover:bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] font-semibold text-emerald-950 transition-colors cursor-pointer"
                    >
                      <span className="mr-1">{reply.emoji}</span>
                      {reply.text[language]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (stage === 'turn_a') {
                    handleStartTurn('turn_b');
                  } else {
                    playSoundEffect('insight', soundEnabled);
                    setIsRunning(false);
                    setStage('closing');
                  }
                }}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-sky-600 py-2.5 px-4 text-xs font-extrabold text-white shadow-sm hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>
                  {stage === 'turn_a'
                    ? language === 'es'
                      ? 'Pasar al Turno 2 (Cambiar roles)'
                      : 'Ir para o Turno 2 (Inverter papéis)'
                    : language === 'es'
                    ? 'Ir al Cierre de Equipo'
                    : 'Ir para o Fechamento de Time'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {stage === 'closing' && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/90 border border-emerald-200 p-4 text-center space-y-2">
                <p className="text-2xl">🫂💛</p>
                <p className="text-sm font-extrabold text-emerald-950">
                  {language === 'es'
                    ? '¡Hermoso momento de escucha mutua!'
                    : 'Lindo momento de escuta mútua!'}
                </p>
                <p className="text-xs text-emerald-900/80">
                  {language === 'es'
                    ? 'Cerraron el ruido del mundo afuera y cuidaron su vínculo sin presiones.'
                    : 'Deixaram o barulho lá fora e cuidaram da relação sem pressão.'}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={completed}
                  className={`rounded-2xl py-2.5 px-4 text-xs font-extrabold text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                    completed
                      ? 'bg-emerald-500 opacity-85 cursor-default'
                      : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {completed
                    ? language === 'es'
                      ? 'Ritual Completado (+3 🔥)'
                      : 'Ritual Concluído (+3 🔥)'
                    : language === 'es'
                    ? 'Completar Ritual (+3 🔥 a Nuestra Llama)'
                    : 'Concluir Ritual (+3 🔥 na Chama)'}
                </button>

                {onSendToChat && (
                  <button
                    type="button"
                    onClick={() =>
                      handleSendEmpathy(
                        '🤝',
                        language === 'es'
                          ? 'Gracias por escucharme hoy sin juzgar. Somos un gran equipo 💛'
                          : 'Obrigado(a) por me ouvir hoje sem julgar. Somos um grande time 💛'
                      )
                    }
                    className="rounded-2xl bg-white border border-emerald-300 py-2.5 px-4 text-xs font-extrabold text-emerald-900 hover:bg-emerald-50 cursor-pointer"
                  >
                    💌{' '}
                    {language === 'es'
                      ? 'Enviar abrazo de cierre al chat'
                      : 'Enviar abraço final ao chat'}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full text-center text-xs font-bold text-emerald-800 underline cursor-pointer"
              >
                {language === 'es' ? 'Reiniciar ritual' : 'Reiniciar ritual'}
              </button>
            </div>
          )}

          <p className="text-[11px] text-emerald-900/75 leading-relaxed">
            {CLINICAL_RITUAL_NOTE[language]}
          </p>
        </div>
      )}
    </div>
  );
}
