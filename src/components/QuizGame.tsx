'use client';

import { useMemo, useState } from 'react';
import {
  Dices,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Moon,
  FlaskConical,
  MailOpen,
} from 'lucide-react';
import { DIRECT_PREFERENCE_QUESTION, QUESTION_BANK } from '@/data/questions';
import {
  MYSTERY_ARCHETYPES,
  MYSTERY_FACET_LABELS,
  MYSTERY_QUESTIONS,
  buildMysteryClue,
} from '@/data/mysteryQuestions';
import {
  CATEGORY_LABELS,
  MYSTERY_UI,
  TRAFFIC_STATE_META,
  TRUST_LAB_UI,
  UI_TEXT,
} from '@/i18n/translations';
import { evaluateQuizAnswers } from '@/lib/scoring';
import { playSoundEffect } from '@/lib/sound';
import { TrafficLight } from '@/components/TrafficLight';
import { LoveGaugeClock } from '@/components/LoveGaugeClock';
import { TrustLabGame } from '@/components/TrustLabGame';
import {
  AnswerOption,
  Language,
  MysteryQuestion,
  Question,
  QuestionCategory,
  QuizAnswerRecord,
  TrafficState,
  TrustLabResult,
} from '@/types/liber';

interface QuizGameProps {
  language: Language;
  soundEnabled: boolean;
  initialMode?: 'menu' | 'mystery' | 'trust_lab';
  onCompleteCheckin: (params: {
    score: number;
    computedState: TrafficState;
    finalState: TrafficState;
    manualOverride: boolean;
    boundaryLock: 'NONE' | 'UNSURE_CAP' | 'NO_LOCK';
    affectionTags: string[];
    customNote?: string;
  }) => void;
  onCompleteTrustLab?: (result: TrustLabResult) => void;
  onShareTrustInvite?: (emoji: string, text: string) => void;
}

type PlayerPersona = 'ella' | 'el' | 'libre';

const CATEGORIES = Object.keys(CATEGORY_LABELS) as QuestionCategory[];

function pickBalancedQuestions(perCategory: number): Question[] {
  const picked: Question[] = [];
  for (const cat of CATEGORIES) {
    const pool = QUESTION_BANK.filter((q) => q.category === cat);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    picked.push(...shuffled.slice(0, perCategory));
  }
  return [...picked, DIRECT_PREFERENCE_QUESTION];
}

function buildClueMessage(
  opt: AnswerOption,
  avgScore: number,
  clueNumber: number,
  language: Language
): { emoji: string; text: string; moodHint: string } {
  if (opt.isBoundaryNo) {
    return {
      emoji: '🛡️',
      moodHint: language === 'es' ? 'Modo Paz' : 'Modo Paz',
      text:
        language === 'es'
          ? `Pista #${clueNumber}: ¡Alerta de descanso! Alguien prefiere mimos tranqui o dormir sin presiones.`
          : `Pista #${clueNumber}: Alerta de descanso! Alguém prefere carinho leve ou dormir sem pressão.`,
    };
  }
  if (opt.isUnsure) {
    return {
      emoji: '🤔',
      moodHint: language === 'es' ? 'En suspenso' : 'Em suspense',
      text:
        language === 'es'
          ? `Pista #${clueNumber}: ¡Misterio total! Todo depende de cómo siga el ambiente y los mimos.`
          : `Pista #${clueNumber}: Mistério no ar! Tudo depende de como o clima e o carinho rolarem.`,
    };
  }
  if (opt.points >= 80) {
    const highEs = [
      `Pista #${clueNumber}: 👀 ¡Uy! Alguien está soltando chispitas por aquí...`,
      `Pista #${clueNumber}: 🔥 ¡Sube la temperatura! El semáforo empieza a guiñar en verde.`,
      `Pista #${clueNumber}: 💘 Cupido acaba de abrir un ojo y sonrió.`,
    ];
    const highPt = [
      `Pista #${clueNumber}: 👀 Eita! Alguém está soltando faíscas por aqui...`,
      `Pista #${clueNumber}: 🔥 A temperatura subiu! O semáforo começou a piscar verde.`,
      `Pista #${clueNumber}: 💘 O Cupido acabou de dar um sorriso maroto.`,
    ];
    const list = language === 'es' ? highEs : highPt;
    return {
      emoji: '🔥',
      moodHint: avgScore >= 70 ? (language === 'es' ? '¡Con chispa!' : 'Com faísca!') : '🌤️',
      text: list[clueNumber % list.length],
    };
  }
  if (opt.points >= 45) {
    const midEs = [
      `Pista #${clueNumber}: 💛 Tibiecito y con buena onda... ¡unos abrazos pueden hacer magia!`,
      `Pista #${clueNumber}: 😉 Ni sí ni no, sino todo lo contrario. ¡Hay que conquistar!`,
    ];
    const midPt = [
      `Pista #${clueNumber}: 💛 Morninho e com clima bom... uns abraços podem fazer mágica!`,
      `Pista #${clueNumber}: 😉 Nem sim nem não, tudo depende do dengo!`,
    ];
    const list = language === 'es' ? midEs : midPt;
    return {
      emoji: '💛',
      moodHint: language === 'es' ? 'Tibiecito' : 'Morninho',
      text: list[clueNumber % list.length],
    };
  }
  return {
    emoji: '🧸',
    moodHint: language === 'es' ? 'Modo Osito' : 'Modo Ursinho',
    text:
      language === 'es'
        ? `Pista #${clueNumber}: 🐻 La batería pide sofá, cobija y cero complicaciones.`
        : `Pista #${clueNumber}: 🐻 A bateria pede sofá, cobertor e zero complicação.`,
  };
}

export function QuizGame({
  language,
  soundEnabled,
  initialMode = 'menu',
  onCompleteCheckin,
  onCompleteTrustLab,
  onShareTrustInvite,
}: QuizGameProps) {
  const [mode, setMode] = useState<
    'menu' | 'playing' | 'mystery' | 'mystery_result' | 'trust_lab' | 'roulette' | 'result'
  >(initialMode);
  const [persona, setPersona] = useState<PlayerPersona>('libre');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mysteryQuestions, setMysteryQuestions] = useState<MysteryQuestion[]>(() =>
    initialMode === 'mystery' ? MYSTERY_QUESTIONS.slice(0, 8) : []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerRecord[]>([]);
  const [clues, setClues] = useState<{ emoji: string; text: string; moodHint: string }[]>([]);
  const [manualOverride, setManualOverride] = useState<TrafficState | null>(null);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [rouletteSpinning, setRouletteSpinning] = useState(false);
  const [rouletteQuestion, setRouletteQuestion] = useState<Question | null>(null);
  const [rouletteClue, setRouletteClue] = useState<string | null>(null);
  const [customNote, setCustomNote] = useState('');
  const [savedBanner, setSavedBanner] = useState(false);

  const startMysterySession = (count: number) => {
    playSoundEffect('mystery', soundEnabled);
    const shuffled = [...MYSTERY_QUESTIONS].sort(() => Math.random() - 0.5);
    setMysteryQuestions(shuffled.slice(0, count));
    setCurrentIndex(0);
    setAnswers([]);
    setClues([]);
    setManualOverride(null);
    setEnvelopeOpened(false);
    setCustomNote('');
    setSavedBanner(false);
    setMode('mystery');
  };

  const handleMysteryAnswer = (question: MysteryQuestion, optionId: string) => {
    const opt = question.options.find((o) => o.id === optionId);
    if (!opt) return;
    playSoundEffect('mystery', soundEnabled);

    const record: QuizAnswerRecord = {
      questionId: question.id,
      optionId: opt.id,
      points: opt.points,
      isBoundaryNo: opt.isBoundaryNo,
      isUnsure: opt.isUnsure,
      affectionTag: opt.affectionTag,
    };

    const nextAnswers = [...answers, record];
    const newClue = buildMysteryClue(opt, nextAnswers.length, language);
    setAnswers(nextAnswers);
    setClues((prev) => [...prev, newClue]);

    if (currentIndex + 1 < mysteryQuestions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setEnvelopeOpened(false);
      setMode('mystery_result');
    }
  };

  const startSession = (perCategory: number) => {
    playSoundEffect('pop', soundEnabled);
    setQuestions(pickBalancedQuestions(perCategory));
    setCurrentIndex(0);
    setAnswers([]);
    setClues([]);
    setManualOverride(null);
    setSavedBanner(false);
    setMode('playing');
  };

  const startCategory = (category: QuestionCategory) => {
    playSoundEffect('pop', soundEnabled);
    const catQuestions = QUESTION_BANK.filter((q) => q.category === category);
    setQuestions([...catQuestions, DIRECT_PREFERENCE_QUESTION]);
    setCurrentIndex(0);
    setAnswers([]);
    setClues([]);
    setManualOverride(null);
    setSavedBanner(false);
    setMode('playing');
  };

  const spinRoulette = () => {
    playSoundEffect('roulette', soundEnabled);
    setMode('roulette');
    setRouletteSpinning(true);
    setRouletteClue(null);
    setTimeout(() => {
      const randomQ = QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)];
      setRouletteQuestion(randomQ);
      setRouletteSpinning(false);
    }, 650);
  };

  const handleAnswer = (question: Question, optionId: string) => {
    const opt = question.options.find((o) => o.id === optionId);
    if (!opt) return;
    playSoundEffect('pop', soundEnabled);

    const record: QuizAnswerRecord = {
      questionId: question.id,
      optionId: opt.id,
      points: opt.points,
      isBoundaryNo: opt.isBoundaryNo,
      isUnsure: opt.isUnsure,
      affectionTag: opt.affectionTag,
    };

    const nextAnswers = [...answers, record];
    const runningAvg = Math.round(
      nextAnswers.reduce((s, a) => s + a.points, 0) / nextAnswers.length
    );
    const newClue = buildClueMessage(opt, runningAvg, nextAnswers.length, language);

    setAnswers(nextAnswers);
    setClues((prev) => [...prev, newClue]);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const result = evaluateQuizAnswers(nextAnswers, null);
      if (result.finalState === 'LIBER') playSoundEffect('liber', soundEnabled);
      else if (result.finalState === 'CASI_LIBER') playSoundEffect('casi', soundEnabled);
      else playSoundEffect('anti', soundEnabled);
      setMode('result');
    }
  };

  const result = useMemo(
    () => evaluateQuizAnswers(answers, manualOverride),
    [answers, manualOverride]
  );

  const runningTemp = useMemo(() => {
    if (answers.length === 0) return 50;
    const avg = Math.round(answers.reduce((s, a) => s + a.points, 0) / answers.length);
    if (answers.some((a) => a.isBoundaryNo)) return Math.min(25, avg);
    if (answers.some((a) => a.isUnsure)) return Math.min(60, avg);
    return avg;
  }, [answers]);

  if (mode === 'trust_lab') {
    return (
      <TrustLabGame
        language={language}
        soundEnabled={soundEnabled}
        onBack={() => setMode('menu')}
        onComplete={onCompleteTrustLab}
        onShareTrustInvite={onShareTrustInvite}
      />
    );
  }

  if (mode === 'mystery' && mysteryQuestions[currentIndex]) {
    const mq = mysteryQuestions[currentIndex];
    const progress = Math.round(((currentIndex + 1) / mysteryQuestions.length) * 100);
    const facetMeta = MYSTERY_FACET_LABELS[mq.facet][language];
    const latestClue = clues[clues.length - 1];

    return (
      <div className="rounded-3xl bg-gradient-to-b from-[#2b1238] via-[#3b1542] to-[#230e2c] border border-purple-400/30 p-6 shadow-2xl space-y-4 text-rose-50">
        <div className="flex items-center justify-between text-xs font-bold text-pink-200">
          <span className="inline-flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-amber-300" />
            {facetMeta.emoji} {facetMeta.name}
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px]">
            {MYSTERY_UI.title[language]} • {currentIndex + 1}/{mysteryQuestions.length}
          </span>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/15 p-3">
          <LoveGaugeClock
            score={runningTemp}
            language={language}
            variant="mystery"
            hintLabel={
              latestClue
                ? `${latestClue.emoji} ${latestClue.moodHint}`
                : language === 'es'
                ? '✨ El misterio apenas comienza...'
                : '✨ O mistério está apenas começando...'
            }
          />
        </div>

        {latestClue && (
          <div className="rounded-2xl bg-gradient-to-r from-purple-900/80 to-rose-900/70 border border-pink-300/30 px-4 py-3 text-xs sm:text-sm font-semibold text-rose-50">
            {latestClue.text}
          </div>
        )}

        <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 via-amber-300 to-pink-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-xl font-extrabold text-white leading-snug pt-1">
          {mq.prompt[language]}
        </h2>

        <div className="grid gap-3">
          {mq.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleMysteryAnswer(mq, opt.id)}
              className="w-full text-left rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3.5 text-sm sm:text-base font-semibold text-white transition-all active:scale-[0.98] flex items-center gap-3 cursor-pointer"
            >
              <span className="text-2xl shrink-0">{opt.emoji}</span>
              <span>{opt.label[language]}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={() => setMode('menu')}
            className="text-xs font-semibold text-pink-200 hover:underline cursor-pointer"
          >
            {language === 'es' ? 'Salir del misterio' : 'Sair do mistério'}
          </button>
          <span className="text-[11px] text-pink-200/75">
            🔒 {MYSTERY_UI.badge[language]}
          </span>
        </div>
      </div>
    );
  }

  if (mode === 'mystery_result') {
    const archetype = MYSTERY_ARCHETYPES[result.finalState];
    const meta = TRAFFIC_STATE_META[result.finalState];

    if (!envelopeOpened) {
      return (
        <div className="rounded-3xl bg-gradient-to-b from-[#2b1238] via-[#3b1542] to-[#230e2c] border border-pink-300/30 p-8 shadow-2xl text-center space-y-5 text-white">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-purple-500 flex items-center justify-center shadow-xl animate-pulse">
            <MailOpen className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold">{MYSTERY_UI.sealedTitle[language]}</h2>
          <p className="text-sm text-pink-100/90 max-w-sm mx-auto leading-relaxed">
            {MYSTERY_UI.sealedBody[language]}
          </p>
          <button
            type="button"
            onClick={() => {
              if (result.finalState === 'LIBER') playSoundEffect('liber', soundEnabled);
              else if (result.finalState === 'CASI_LIBER') playSoundEffect('casi', soundEnabled);
              else playSoundEffect('anti', soundEnabled);
              setEnvelopeOpened(true);
            }}
            className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 px-7 py-4 text-sm font-extrabold text-white shadow-xl hover:scale-[1.03] active:scale-95 transition-transform cursor-pointer"
          >
            {MYSTERY_UI.openEnvelopeBtn[language]}
          </button>
        </div>
      );
    }

    return (
      <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-rose-200 p-6 shadow-xl space-y-5">
        <div className="text-center space-y-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-extrabold text-purple-800">
            <Moon className="w-3.5 h-3.5" />
            {MYSTERY_UI.title[language]}
          </span>
          <h2 className="text-2xl font-extrabold text-rose-950 pt-1">
            {archetype.emoji} {archetype.title[language]}
          </h2>
          <p className="text-xs text-rose-800/85 max-w-md mx-auto">
            {archetype.description[language]}
          </p>
          <p className="text-xs font-bold text-purple-700">
            {meta.emoji} {meta.headline[language]}
          </p>
        </div>

        <TrafficLight
          language={language}
          activeState={result.finalState}
          onSelectState={(state) => {
            playSoundEffect('pop', soundEnabled);
            setManualOverride(state);
          }}
        />

        <div className="rounded-2xl bg-purple-50 border border-purple-200 p-3.5 text-xs text-purple-950 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <span>{MYSTERY_UI.autonomyNotice[language]}</span>
        </div>

        <div className="rounded-2xl bg-rose-50/70 border border-rose-200 p-4 space-y-2">
          <p className="text-xs font-bold text-rose-900">{UI_TEXT.manualOverrideLabel[language]}</p>
          <div className="grid grid-cols-3 gap-2">
            {(['ANTI_LIBER', 'CASI_LIBER', 'LIBER'] as TrafficState[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  playSoundEffect('pop', soundEnabled);
                  setManualOverride(st);
                }}
                className={`rounded-xl py-2 px-2 text-xs font-bold border transition-all cursor-pointer ${
                  result.finalState === st
                    ? 'bg-rose-600 text-white border-rose-600 shadow'
                    : 'bg-white text-rose-900 border-rose-200 hover:bg-rose-50'
                }`}
              >
                {TRAFFIC_STATE_META[st].emoji} {TRAFFIC_STATE_META[st].badge[language]}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-purple-50/70 border border-purple-200 p-4 space-y-2">
          <label className="text-xs font-bold text-purple-950 block">
            {language === 'es'
              ? '💌 Pista o nota opcional para tu pareja'
              : '💌 Pista ou recado opcional para seu par'}
          </label>
          <input
            type="text"
            maxLength={140}
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder={
              language === 'es'
                ? 'Ej: "Hoy toca noche misteriosa con velas..."'
                : 'Ex: "Hoje tem noite misteriosa à meia-luz..."'
            }
            className="w-full rounded-xl bg-white border border-purple-200 px-3 py-2 text-sm text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              onCompleteCheckin({ ...result, customNote: customNote.trim() || undefined });
              setSavedBanner(true);
              playSoundEffect('message', soundEnabled);
            }}
            className="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 py-3.5 px-5 text-white font-bold shadow-lg hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            {MYSTERY_UI.confirmSendBtn[language]}
          </button>
          <button
            type="button"
            onClick={() => setMode('menu')}
            className="rounded-2xl bg-rose-100 text-rose-900 font-bold py-3.5 px-5 hover:bg-rose-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            {language === 'es' ? 'Volver' : 'Voltar'}
          </button>
        </div>

        {savedBanner && (
          <p className="text-center text-sm font-bold text-emerald-700">
            ✅{' '}
            {language === 'es'
              ? '¡Semáforo confirmado y enviado! Revisa la pestaña Pareja.'
              : 'Semáforo confirmado e enviado! Veja a aba Casal.'}
          </p>
        )}
      </div>
    );
  }

  if (mode === 'roulette') {
    return (
      <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-rose-950 flex items-center gap-2">
            <Dices className="w-6 h-6 text-purple-500" />
            {UI_TEXT.rouletteTitle[language]}
          </h2>
          <button
            type="button"
            onClick={() => setMode('menu')}
            className="text-sm font-semibold text-rose-600 hover:underline cursor-pointer"
          >
            {language === 'es' ? 'Volver' : 'Voltar'}
          </button>
        </div>

        <div className="flex flex-col items-center py-4">
          <div
            className={`w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-purple-500 flex items-center justify-center text-4xl shadow-lg transition-transform duration-700 ${
              rouletteSpinning ? 'rotate-[720deg] scale-110' : 'rotate-0'
            }`}
          >
            🎡
          </div>
          <button
            type="button"
            onClick={spinRoulette}
            disabled={rouletteSpinning}
            className="mt-4 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 px-6 py-3 text-white font-bold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
          >
            {UI_TEXT.spinRoulette[language]}
          </button>
        </div>

        {!rouletteSpinning && rouletteQuestion && (
          <div className="rounded-2xl bg-rose-50/70 border border-rose-200 p-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-700">
              {CATEGORY_LABELS[rouletteQuestion.category][language].emoji}{' '}
              {CATEGORY_LABELS[rouletteQuestion.category][language].name}
            </div>
            <h3 className="text-lg font-bold text-rose-950">
              {rouletteQuestion.prompt[language]}
            </h3>
            <div className="grid gap-2.5">
              {rouletteQuestion.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    playSoundEffect('pop', soundEnabled);
                    const clue = buildClueMessage(opt, opt.points, 1, language);
                    setRouletteClue(`${opt.emoji} ${opt.label[language]} — ${clue.text}`);
                  }}
                  className="w-full text-left rounded-2xl bg-white border border-rose-100 px-4 py-3 text-sm font-semibold text-rose-950 hover:border-rose-400 hover:bg-rose-50/50 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span>{opt.label[language]}</span>
                </button>
              ))}
            </div>
            {rouletteClue && (
              <div className="rounded-xl bg-gradient-to-r from-purple-50 to-rose-50 border border-purple-200 p-3.5 text-sm text-purple-950 font-semibold">
                🕵️ {rouletteClue}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (mode === 'playing' && questions[currentIndex]) {
    const q = questions[currentIndex];
    const progress = Math.round(((currentIndex + 1) / questions.length) * 100);
    const catMeta = CATEGORY_LABELS[q.category][language];
    const latestClue = clues[clues.length - 1];

    const personaTag =
      persona === 'ella'
        ? language === 'es'
          ? '👩 Jugando: Ella'
          : '👩 Jogando: Ela'
        : persona === 'el'
        ? language === 'es'
          ? '👨 Jugando: Él'
          : '👨 Jogando: Ele'
        : '💘 LIBER';

    return (
      <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-rose-700">
          <span>
            {catMeta.emoji} {catMeta.name}
          </span>
          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px]">
            {personaTag} • {currentIndex + 1}/{questions.length}
          </span>
        </div>

        {/* Live Love Gauge Clock with Rotating Needle */}
        <div className="rounded-2xl bg-gradient-to-b from-rose-50/80 to-purple-50/50 border border-rose-100 p-3">
          <LoveGaugeClock
            score={runningTemp}
            language={language}
            hintLabel={
              clues.length > 0
                ? `${clues[clues.length - 1].emoji} ${clues[clues.length - 1].moodHint}`
                : language === 'es'
                ? '💘 Responde para mover la aguja'
                : '💘 Responda para mover o ponteiro'
            }
          />
        </div>

        {/* Latest Playful Clue Bubble */}
        {latestClue && (
          <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 px-4 py-3 text-xs sm:text-sm font-bold text-purple-950 animate-pulse">
            {latestClue.text}
          </div>
        )}

        <div className="w-full h-1.5 rounded-full bg-rose-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-xl font-extrabold text-rose-950 leading-snug pt-1">
          {q.prompt[language]}
        </h2>

        <div className="grid gap-3">
          {q.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleAnswer(q, opt.id)}
              className="w-full text-left rounded-2xl bg-rose-50/60 hover:bg-rose-100/80 border border-rose-200/80 px-4 py-3.5 text-base font-semibold text-rose-950 transition-all active:scale-[0.98] flex items-center gap-3 cursor-pointer"
            >
              <span className="text-2xl shrink-0">{opt.emoji}</span>
              <span>{opt.label[language]}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={() => setMode('menu')}
            className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
          >
            {language === 'es' ? 'Salir del juego' : 'Sair do jogo'}
          </button>
          <span className="text-[11px] text-rose-700/70">
            🔒 {language === 'es' ? 'Tus pistas son solo para ti hasta que compartas' : 'Suas pistas são só suas até compartilhar'}
          </span>
        </div>
      </div>
    );
  }

  if (mode === 'result') {
    const meta = TRAFFIC_STATE_META[result.finalState];
    return (
      <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-rose-100 p-6 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'es' ? '¡Misterio Revelado!' : 'Mistério Revelado!'}
          </span>
          <h2 className="text-2xl font-extrabold text-rose-950 pt-1">
            {meta.emoji} {meta.headline[language]}
          </h2>
          <p className="text-xs font-semibold text-rose-700/80">
            {language === 'es'
              ? `Puntaje divertido: ${result.score}/100`
              : `Pontuação divertida: ${result.score}/100`}
          </p>
        </div>

        <TrafficLight
          language={language}
          activeState={result.finalState}
          onSelectState={(state) => {
            playSoundEffect('pop', soundEnabled);
            setManualOverride(state);
          }}
        />

        {result.boundaryLock !== 'NONE' && (
          <div className="rounded-2xl bg-purple-50 border border-purple-200 p-3.5 text-xs text-purple-900 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <span>{UI_TEXT.boundaryLockActive[language]}</span>
          </div>
        )}

        <div className="rounded-2xl bg-rose-50/70 border border-rose-200 p-4 space-y-2">
          <p className="text-xs font-bold text-rose-900">{UI_TEXT.manualOverrideLabel[language]}</p>
          <div className="grid grid-cols-3 gap-2">
            {(['ANTI_LIBER', 'CASI_LIBER', 'LIBER'] as TrafficState[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  playSoundEffect('pop', soundEnabled);
                  setManualOverride(st);
                }}
                className={`rounded-xl py-2 px-2 text-xs font-bold border transition-all cursor-pointer ${
                  result.finalState === st
                    ? 'bg-rose-600 text-white border-rose-600 shadow'
                    : 'bg-white text-rose-900 border-rose-200 hover:bg-rose-50'
                }`}
              >
                {TRAFFIC_STATE_META[st].emoji} {TRAFFIC_STATE_META[st].badge[language]}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-center text-rose-800/75 leading-relaxed">
          {UI_TEXT.disclaimer[language]}
        </p>

        <div className="rounded-2xl bg-purple-50/70 border border-purple-200 p-4 space-y-2">
          <label className="text-xs font-bold text-purple-950 block">
            {language === 'es'
              ? '💌 Nota opcional para tu pareja (ej: "Quiero abrazos y peli")'
              : '💌 Recado opcional para seu par (ex: "Quero abraços e filme")'}
          </label>
          <input
            type="text"
            maxLength={140}
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder={
              language === 'es'
                ? 'Escribe algo lindo si quieres...'
                : 'Escreva algo fofo se quiser...'
            }
            className="w-full rounded-xl bg-white border border-purple-200 px-3 py-2 text-sm text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              onCompleteCheckin({ ...result, customNote: customNote.trim() || undefined });
              setSavedBanner(true);
              playSoundEffect('message', soundEnabled);
            }}
            className="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 py-3.5 px-5 text-white font-bold shadow-lg hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            {language === 'es' ? 'Enviar mi Semáforo a mi Pareja' : 'Enviar meu Semáforo ao meu Par'}
          </button>
          <button
            type="button"
            onClick={() => setMode('menu')}
            className="rounded-2xl bg-rose-100 text-rose-900 font-bold py-3.5 px-5 hover:bg-rose-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            {language === 'es' ? 'Jugar de nuevo' : 'Jogar de novo'}
          </button>
        </div>

        {savedBanner && (
          <p className="text-center text-sm font-bold text-emerald-700">
            ✅{' '}
            {language === 'es'
              ? '¡Semáforo enviado! Revisa la pestaña Pareja para ver su Match.'
              : 'Semáforo enviado! Veja a aba Casal para conferir o Match.'}
          </p>
        )}
      </div>
    );
  }

  // Menu Mode — Featured Flagship Modes + Informal Persona Picker + Classic Modes
  return (
    <div className="space-y-6">
      {/* Featured Flagship Modes */}
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div className="rounded-3xl bg-gradient-to-br from-[#341242] via-[#5a1752] to-rose-600 p-5 text-white shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-pink-100">
              <Moon className="w-3 h-3" /> {MYSTERY_UI.badge[language]}
            </span>
            <h3 className="mt-2 font-extrabold text-xl">🌙 {MYSTERY_UI.title[language]}</h3>
            <p className="text-xs text-rose-100 mt-1 leading-relaxed">
              {language === 'es'
                ? 'Juego de seducción sutil e indirecta con metáforas nocturnas, brújula de pistas y sobre secreto.'
                : 'Jogo de sedução sutil e indireta com metáforas noturnas, bússola de pistas e envelope secreto.'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => startMysterySession(8)}
              className="flex-1 rounded-2xl bg-white text-rose-700 font-extrabold text-xs py-2.5 px-3 shadow hover:scale-[1.02] transition-transform cursor-pointer"
            >
              ✨ {language === 'es' ? 'Ronda 8 pistas' : 'Rodada 8 pistas'}
            </button>
            <button
              type="button"
              onClick={() => startMysterySession(16)}
              className="rounded-2xl bg-white/15 border border-white/25 text-white font-bold text-xs py-2.5 px-3 hover:bg-white/25 transition-colors cursor-pointer"
            >
              16
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playSoundEffect('insight', soundEnabled);
            setMode('trust_lab');
          }}
          className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-600 p-5 text-left text-white shadow-xl hover:scale-[1.01] transition-transform flex flex-col justify-between space-y-4 cursor-pointer"
        >
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-100">
              <FlaskConical className="w-3 h-3" /> {TRUST_LAB_UI.badge[language]}
            </span>
            <h3 className="mt-2 font-extrabold text-xl">🛡️ {TRUST_LAB_UI.title[language]}</h3>
            <p className="text-xs text-indigo-100 mt-1 leading-relaxed">
              {TRUST_LAB_UI.subtitle[language]}
            </p>
          </div>
          <span className="inline-flex items-center justify-center w-full rounded-2xl bg-white/20 border border-white/25 py-2.5 px-3 text-xs font-extrabold">
            {language === 'es' ? 'Explorar Confianza y Límites →' : 'Explorar Confiança e Limites →'}
          </span>
        </button>
      </div>

      <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 p-4 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <span className="text-xs font-extrabold text-rose-950">
          {language === 'es' ? '🕵️ ¿Quién juega esta ronda?' : '🕵️ Quem joga esta rodada?'}
        </span>
        <div className="flex gap-2">
          {[
            { id: 'ella' as const, label: language === 'es' ? '👩 Ella' : '👩 Ela' },
            { id: 'el' as const, label: language === 'es' ? '👨 Él' : '👨 Ele' },
            { id: 'libre' as const, label: '💘 Libre' },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                playSoundEffect('pop', soundEnabled);
                setPersona(p.id);
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
                persona === p.id
                  ? 'bg-rose-500 text-white border-rose-500 shadow'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => startSession(1)}
          className="rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 p-5 text-left text-white shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="text-2xl">🕵️⚡</div>
          <h3 className="mt-2 font-extrabold text-lg">
            {language === 'es' ? 'Juego con Pistas (Rápido)' : 'Jogo com Pistas (Rápido)'}
          </h3>
          <p className="text-xs text-rose-100 mt-1">
            {language === 'es'
              ? '9 preguntas divertidas que van soltando pistas en vivo.'
              : '9 perguntas divertidas que soltam pistas ao vivo.'}
          </p>
        </button>

        <button
          type="button"
          onClick={() => startSession(2)}
          className="rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 p-5 text-left text-white shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="text-2xl">💘🔍</div>
          <h3 className="mt-2 font-extrabold text-lg">
            {language === 'es' ? 'Modo Detective (17)' : 'Modo Detetive (17)'}
          </h3>
          <p className="text-xs text-purple-100 mt-1">
            {language === 'es'
              ? 'Más preguntas, más risas y termómetro de pistas.'
              : 'Mais perguntas, mais risadas e termômetro de pistas.'}
          </p>
        </button>

        <button
          type="button"
          onClick={spinRoulette}
          className="rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-5 text-left text-white shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="text-2xl">🎡</div>
          <h3 className="mt-2 font-extrabold text-lg">{UI_TEXT.rouletteTitle[language]}</h3>
          <p className="text-xs text-amber-50 mt-1">
            {language === 'es'
              ? 'Gira la ruleta y descubre una pista sorpresa.'
              : 'Gire a roleta e descubra uma pista surpresa.'}
          </p>
        </button>
      </div>

      {/* All 8 Categories (64 questions total) */}
      <div className="rounded-3xl bg-white/85 backdrop-blur-md border border-rose-100 p-5 shadow-sm">
        <h3 className="font-extrabold text-rose-950 mb-3">
          {language === 'es'
            ? 'Elegir tema para jugar (64 preguntas)'
            : 'Escolher tema para jogar (64 perguntas)'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_LABELS[cat][language];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => startCategory(cat)}
                className="rounded-2xl bg-rose-50/70 hover:bg-rose-100 border border-rose-200/80 p-3 text-left transition-all cursor-pointer"
              >
                <span className="text-xl">{meta.emoji}</span>
                <p className="mt-1 text-xs font-bold text-rose-950 leading-tight">{meta.name}</p>
                <p className="text-[10px] text-rose-700/75 mt-0.5">8 preguntas</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
