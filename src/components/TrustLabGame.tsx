'use client';

import { useMemo, useState } from 'react';
import {
  Shield,
  FlaskConical,
  ArrowLeft,
  RotateCcw,
  Send,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  FIDELITY_QUESTIONS,
  TRUST_DIMENSIONS_META,
  TRUST_DISCLAIMER,
  TRUST_PROFILES_META,
} from '@/data/fidelityQuestions';
import { TRUST_LAB_UI } from '@/i18n/translations';
import { evaluateTrustLabAnswers, TRUST_DIMENSIONS_ORDER } from '@/lib/fidelityScoring';
import { playSoundEffect } from '@/lib/sound';
import type {
  Language,
  TrustAnswerRecord,
  TrustLabResult,
  TrustQuestion,
} from '@/types/liber';

interface TrustLabGameProps {
  language: Language;
  soundEnabled: boolean;
  onBack: () => void;
  onComplete?: (result: TrustLabResult) => void;
  onShareTrustInvite?: (emoji: string, text: string) => void;
}

function pickTrustQuestions(perDimension: number): TrustQuestion[] {
  const list: TrustQuestion[] = [];
  for (const dim of TRUST_DIMENSIONS_ORDER) {
    const pool = FIDELITY_QUESTIONS.filter((q) => q.dimension === dim);
    list.push(...pool.slice(0, perDimension));
  }
  return list;
}

export function TrustLabGame({
  language,
  soundEnabled,
  onBack,
  onComplete,
  onShareTrustInvite,
}: TrustLabGameProps) {
  const [stage, setStage] = useState<'intro' | 'playing' | 'result'>('intro');
  const [questions, setQuestions] = useState<TrustQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<TrustAnswerRecord[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [inviteSent, setInviteSent] = useState(false);

  const startTest = (perDimension: number) => {
    playSoundEffect('insight', soundEnabled);
    setQuestions(pickTrustQuestions(perDimension));
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOptionId(null);
    setInviteSent(false);
    setStage('playing');
  };

  const result = useMemo(() => evaluateTrustLabAnswers(answers), [answers]);

  if (stage === 'intro') {
    return (
      <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-indigo-100 p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-extrabold text-indigo-800">
            <FlaskConical className="w-3.5 h-3.5" />
            {TRUST_LAB_UI.badge[language]}
          </span>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-bold text-rose-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {language === 'es' ? 'Volver' : 'Voltar'}
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-indigo-950">
            🛡️ {TRUST_LAB_UI.title[language]}
          </h2>
          <p className="text-sm text-indigo-900/80 mt-1 leading-relaxed">
            {language === 'es'
              ? 'Explora qué hábitos fortalecen la fidelidad, la transparencia y los acuerdos claros en tu relación, descubriendo un dato científico real tras cada respuesta.'
              : 'Explore quais hábitos fortalecem a fidelidade, a transparência e os acordos claros na sua relação, descobrindo um dado científico real após cada resposta.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {TRUST_DIMENSIONS_ORDER.map((dim) => {
            const meta = TRUST_DIMENSIONS_META[dim];
            return (
              <div
                key={dim}
                className="rounded-2xl bg-indigo-50/70 border border-indigo-100 p-3.5 space-y-1"
              >
                <p className="text-xs font-extrabold text-indigo-950">
                  {meta.emoji} {meta.name[language]}
                </p>
                <p className="text-[11px] text-indigo-800/80">{meta.citation[language]}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl bg-purple-50 border border-purple-200 p-3.5 text-xs text-purple-950 leading-relaxed">
          {TRUST_DISCLAIMER[language]}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => startTest(2)}
            className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 px-4 text-white font-extrabold text-sm shadow-lg hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            ⚡ {TRUST_LAB_UI.startQuick[language]}
          </button>
          <button
            type="button"
            onClick={() => startTest(4)}
            className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 px-4 text-white font-extrabold text-sm shadow-lg hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            💎 {TRUST_LAB_UI.startFull[language]}
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'playing' && questions[currentIndex]) {
    const q = questions[currentIndex];
    const dimMeta = TRUST_DIMENSIONS_META[q.dimension];
    const progress = Math.round(((currentIndex + 1) / questions.length) * 100);
    const hasAnswered = selectedOptionId !== null;
    const isLast = currentIndex + 1 >= questions.length;

    const handleSelectOption = (optId: string) => {
      if (hasAnswered) return;
      const opt = q.options.find((o) => o.id === optId);
      if (!opt) return;
      playSoundEffect('insight', soundEnabled);
      setSelectedOptionId(opt.id);
      setAnswers((prev) => [
        ...prev,
        {
          questionId: q.id,
          dimension: q.dimension,
          optionId: opt.id,
          points: opt.points,
        },
      ]);
    };

    const handleNext = () => {
      playSoundEffect('pop', soundEnabled);
      if (!isLast) {
        setCurrentIndex((i) => i + 1);
        setSelectedOptionId(null);
      } else {
        const finalRes = evaluateTrustLabAnswers(answers);
        onComplete?.(finalRes);
        setStage('result');
      }
    };

    return (
      <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-indigo-100 p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between gap-2 text-xs font-bold text-indigo-800">
          <span>
            {dimMeta.emoji} {dimMeta.name[language]}
          </span>
          <span>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-indigo-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
          📚 {q.frameworkRef[language]}
        </p>

        <h3 className="text-xl font-extrabold text-indigo-950 leading-snug">
          {q.prompt[language]}
        </h3>

        <div className="grid gap-2.5">
          {q.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full text-left rounded-2xl border px-4 py-3.5 text-sm sm:text-base font-semibold transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : hasAnswered
                    ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-default'
                    : 'bg-indigo-50/50 hover:bg-indigo-100/70 text-indigo-950 border-indigo-200 cursor-pointer active:scale-[0.98]'
                }`}
              >
                <span className="text-2xl shrink-0">{opt.emoji}</span>
                <span>{opt.label[language]}</span>
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-indigo-50 border border-emerald-200 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{TRUST_LAB_UI.scientificFactTitle[language]}</span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed">
              {q.scientificNote[language]}
            </p>
            <button
              type="button"
              onClick={handleNext}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-600 py-3 px-4 text-white font-extrabold text-sm shadow hover:opacity-95 cursor-pointer"
            >
              {isLast ? TRUST_LAB_UI.viewMap[language] : TRUST_LAB_UI.nextQuestion[language]}
            </button>
          </div>
        )}

        <div className="flex justify-between items-center pt-1">
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-indigo-700 hover:underline cursor-pointer"
          >
            {language === 'es' ? 'Salir del estudio' : 'Sair do estudo'}
          </button>
          <span className="text-[11px] text-indigo-800/70">
            🔒 {language === 'es' ? '100% privado' : '100% privado'}
          </span>
        </div>
      </div>
    );
  }

  // Result stage
  const profileMeta = TRUST_PROFILES_META[result.profile];
  const strongestMeta = TRUST_DIMENSIONS_META[result.strongestDimension];
  const focusMeta = TRUST_DIMENSIONS_META[result.focusDimension];

  const handleSendInvite = () => {
    const msgText =
      language === 'es'
        ? `Estuve explorando "${focusMeta.name.es}" en LIBER y me encantaría conversar con calma sobre: "${focusMeta.conversationPrompt.es}" 💛`
        : `Estive explorando "${focusMeta.name['pt-BR']}" no LIBER e adoraria conversar com calma sobre: "${focusMeta.conversationPrompt['pt-BR']}" 💛`;
    onShareTrustInvite?.(focusMeta.emoji, msgText);
    playSoundEffect('message', soundEnabled);
    setInviteSent(true);
  };

  return (
    <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-indigo-100 p-6 shadow-xl space-y-5">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-extrabold text-indigo-800">
          <Shield className="w-3.5 h-3.5" />
          {language === 'es' ? 'Tu Mapa de Confianza' : 'Seu Mapa de Confiança'}
        </span>
        <h2 className="text-2xl font-extrabold text-indigo-950">
          {profileMeta.emoji} {profileMeta.title[language]}
        </h2>
        <p className="text-xs font-bold text-indigo-700">
          {language === 'es'
            ? `Índice protector de hábitos: ${result.overallScore}/100`
            : `Índice protetor de hábitos: ${result.overallScore}/100`}
        </p>
      </div>

      <div className={`rounded-2xl bg-gradient-to-br border p-4 space-y-2 ${profileMeta.toneClass}`}>
        <p className="text-sm font-semibold leading-relaxed">{profileMeta.summary[language]}</p>
        <p className="text-xs opacity-90">
          💡 {profileMeta.nextStep[language]}
        </p>
      </div>

      {/* 4 Dimensions Breakdown */}
      <div className="space-y-3">
        {result.dimensions.map((d) => {
          const meta = TRUST_DIMENSIONS_META[d.dimension];
          return (
            <div key={d.dimension} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                <span>
                  {meta.emoji} {meta.name[language]}
                </span>
                <span>{d.score}/100</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-indigo-100 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    d.score >= 75
                      ? 'bg-emerald-500'
                      : d.score >= 45
                      ? 'bg-amber-400'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(8, d.score)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 text-xs">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5">
          <p className="font-extrabold text-emerald-900">
            ✨ {TRUST_LAB_UI.strongestLabel[language]}
          </p>
          <p className="mt-1 font-bold text-emerald-950">
            {strongestMeta.emoji} {strongestMeta.name[language]}
          </p>
        </div>
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5">
          <p className="font-extrabold text-amber-900">
            💬 {TRUST_LAB_UI.focusLabel[language]}
          </p>
          <p className="mt-1 font-bold text-amber-950">
            {focusMeta.emoji} {focusMeta.name[language]}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-indigo-50/80 border border-indigo-200 p-4 space-y-2">
        <p className="text-xs font-extrabold text-indigo-900">
          {language === 'es' ? 'Pregunta rompehielos sugerida:' : 'Pergunta quebra-gelo sugerida:'}
        </p>
        <p className="text-sm font-semibold text-indigo-950 italic">
          &ldquo;{focusMeta.conversationPrompt[language]}&rdquo;
        </p>
      </div>

      <p className="text-[11px] text-center text-indigo-900/75 leading-relaxed">
        {TRUST_DISCLAIMER[language]}
      </p>

      <div className="flex flex-col gap-2.5">
        {onShareTrustInvite && (
          <button
            type="button"
            onClick={handleSendInvite}
            disabled={inviteSent}
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 px-4 text-white font-extrabold text-sm shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {inviteSent ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {inviteSent
              ? language === 'es'
                ? 'Invitación de charla enviada a Pareja ✓'
                : 'Convite de conversa enviado ao Casal ✓'
              : TRUST_LAB_UI.invitePartnerBtn[language]}
          </button>
        )}

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => setStage('intro')}
            className="flex-1 rounded-2xl bg-indigo-100 text-indigo-950 font-bold py-3 px-4 text-xs hover:bg-indigo-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            {language === 'es' ? 'Repetir' : 'Refazer'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-2xl bg-rose-100 text-rose-950 font-bold py-3 px-4 text-xs hover:bg-rose-200 cursor-pointer"
          >
            {language === 'es' ? 'Volver al menú' : 'Voltar ao menu'}
          </button>
        </div>
      </div>
    </div>
  );
}
