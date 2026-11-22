'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Heart,
  Gamepad2,
  Users,
  Sparkles,
  Shield,
  Volume2,
  VolumeX,
  CheckCircle2,
} from 'lucide-react';
import { FloatingHearts } from '@/components/FloatingHearts';
import { TrafficLight } from '@/components/TrafficLight';
import { QuizGame } from '@/components/QuizGame';
import { CoupleMatchDashboard } from '@/components/CoupleMatchDashboard';
import { DailyDoubleKeyCard } from '@/components/DailyDoubleKeyCard';
import { IdeasHub } from '@/components/IdeasHub';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { PlansSection } from '@/components/PlansSection';
import {
  CompetitionHub,
  isCompetitionModeEnabled,
} from '@/modules/competitions/CompetitionHub';
import { TRAFFIC_STATE_META, UI_TEXT } from '@/i18n/translations';
import { computeCoupleMatch } from '@/lib/match';
import { generateRoomCode, normalizeRoomMessages } from '@/lib/roomPresence';
import { playSoundEffect } from '@/lib/sound';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  AffectionMessage,
  CoupleState,
  Language,
  MoodCheckin,
  PartnerPresenceStatus,
  PrivacySettings,
  TrafficState,
  TrustLabResult,
} from '@/types/liber';

type Tab = 'home' | 'game' | 'match' | 'ideas' | 'privacy';

const STORAGE_KEY = 'liber_app_state_v1';

interface PersistedState {
  isAdultConfirmed: boolean;
  language: Language;
  soundEnabled: boolean;
  privacy: PrivacySettings;
  myCheckin: MoodCheckin | null;
  myHistory: MoodCheckin[];
  latestTrustResult?: TrustLabResult | null;
  couple: CoupleState;
  messages: AffectionMessage[];
}

function createInitialState(): PersistedState {
  const initialTimestamp = '2026-11-20T12:00:00.000Z';
  return {
    isAdultConfirmed: false,
    language: 'es',
    soundEnabled: true,
    privacy: {
      shareMoodState: true,
      shareAffectionPrefs: true,
      shareEnergyLevel: false,
      historyOptInSelf: false,
      historyOptInPartner: false,
    },
    myCheckin: {
      id: 'init_me',
      userId: 'demo_user_a',
      score: 65,
      computedState: 'CASI_LIBER',
      finalState: 'CASI_LIBER',
      manualOverride: false,
      boundaryLock: 'NONE',
      shareMoodState: true,
      shareAffectionPrefs: true,
      shareEnergyLevel: false,
      affectionPrefs: ['cuddles', 'kisses'],
      createdAt: initialTimestamp,
    },
    myHistory: [],
    latestTrustResult: null,
    couple: {
      coupleId: 'demo_couple_1',
      inviteCode: 'LIBER-7742',
      partnerLinked: false,
      partnerName: '',
      partnerAvatar: '💖',
      partnerLatestCheckin: null,
      myDisplayName: '',
      myAvatar: '💖',
      myChatEnabled: true,
      partnerChatEnabled: true,
      partnerStatus: 'waiting',
      partnerLastSeenAt: null,
      isSimulatedPartner: false,
    },
    messages: [],
  };
}

export default function HomePage() {
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [requestedGameMode, setRequestedGameMode] = useState<'menu' | 'mystery' | 'trust_lab'>('menu');
  const [gameLaunchKey, setGameLaunchKey] = useState(0);
  const [state, setState] = useState<PersistedState>(createInitialState);
  const [slotId, setSlotId] = useState<string>('slot_default');
  const [roomStorage, setRoomStorage] = useState<'memory' | 'supabase'>('memory');
  const [hasPartnerUpdate, setHasPartnerUpdate] = useState(false);
  const lastPartnerMsgIdRef = useRef<string | null>(null);
  const activeTabRef = useRef<Tab>(activeTab);
  const soundEnabledRef = useRef<boolean>(state.soundEnabled);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    soundEnabledRef.current = state.soundEnabled;
  }, [state.soundEnabled]);

  useEffect(() => {
    try {
      const existingSlot = localStorage.getItem('liber_slot_id');
      if (existingSlot) {
        setSlotId(existingSlot);
      } else {
        const created = `slot_${Math.random().toString(36).slice(2, 10)}`;
        localStorage.setItem('liber_slot_id', created);
        setSlotId(created);
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Partial<PersistedState>) : {};
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room')?.trim().toUpperCase();

      setState((prev) => {
        const merged = { ...prev, ...parsed };
        // Migrate away from legacy hardcoded fake partner if present
        if (
          merged.couple.partnerLatestCheckin?.id === 'init_partner' &&
          !merged.couple.isSimulatedPartner
        ) {
          merged.couple = {
            ...merged.couple,
            partnerLinked: false,
            partnerName: '',
            partnerLatestCheckin: null,
            partnerStatus: 'waiting',
            partnerLastSeenAt: null,
          };
          merged.messages = [];
        }
        if (roomParam && roomParam.length >= 4) {
          merged.couple = {
            ...merged.couple,
            inviteCode: roomParam,
            partnerLinked: false,
            partnerStatus: 'waiting',
            partnerLatestCheckin: null,
            isSimulatedPartner: false,
          };
          merged.messages = [];
        }
        return merged;
      });
    } catch {
      // Ignore invalid localStorage payload
    }
    setHydrated(true);
  }, []);

  // Live Couple Room Sync & Presence Heartbeat (Supabase when configured, memory fallback otherwise)
  useEffect(() => {
    if (!hydrated || !state.couple.inviteCode) return;

    const myName =
      state.couple.myDisplayName?.trim() || (state.language === 'es' ? 'Tu Pareja' : 'Seu Par');
    const myAvatar = state.couple.myAvatar || '💖';
    const myChatEnabled = state.couple.myChatEnabled !== false;

    const pushMyState = () => {
      fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: state.couple.inviteCode,
          slotId,
          displayName: myName,
          avatar: myAvatar,
          chatEnabled: myChatEnabled,
          checkin: state.myCheckin,
        }),
      }).catch(() => {});
    };

    const pullPartnerState = async () => {
      try {
        const qs = new URLSearchParams({
          code: state.couple.inviteCode,
          slotId,
          name: myName,
          avatar: myAvatar,
          chatEnabled: String(myChatEnabled),
        });
        const res = await fetch(`/api/room?${qs.toString()}`);
        if (!res.ok) return;
        const data = (await res.json()) as {
          ok: boolean;
          storage?: 'memory' | 'supabase';
          partner: {
            slotId: string;
            displayName: string;
            avatar: string;
            status: PartnerPresenceStatus;
            lastSeenAt: number;
            chatEnabled: boolean;
            checkin: MoodCheckin | null;
          } | null;
          messages: AffectionMessage[];
        };
        if (!data.ok) return;
        setRoomStorage(data.storage === 'supabase' ? 'supabase' : 'memory');

        const normalizedMsgs = normalizeRoomMessages(data.messages ?? [], slotId);
        const partnerMsgs = normalizedMsgs.filter((m) => !m.isFromMe);
        const latestPartnerMsg = partnerMsgs[partnerMsgs.length - 1];
        if (latestPartnerMsg && latestPartnerMsg.id !== lastPartnerMsgIdRef.current) {
          if (lastPartnerMsgIdRef.current !== null) {
            playSoundEffect('message', soundEnabledRef.current);
            if (activeTabRef.current !== 'match') {
              setHasPartnerUpdate(true);
            }
          }
          lastPartnerMsgIdRef.current = latestPartnerMsg.id;
        }

        setState((prev) => {
          if (data.partner) {
            const prevTime = prev.couple.partnerLatestCheckin?.createdAt;
            const nextTime = data.partner.checkin?.createdAt;
            if (nextTime && nextTime !== prevTime && activeTabRef.current !== 'match') {
              setHasPartnerUpdate(true);
            }
            return {
              ...prev,
              couple: {
                ...prev.couple,
                partnerLinked: true,
                partnerName: data.partner.displayName,
                partnerAvatar: data.partner.avatar,
                partnerStatus: data.partner.status,
                partnerLastSeenAt: data.partner.lastSeenAt,
                partnerChatEnabled: data.partner.chatEnabled,
                isSimulatedPartner: false,
                partnerLatestCheckin: data.partner.checkin,
              },
              messages: normalizedMsgs,
            };
          }

          if (prev.couple.isSimulatedPartner) {
            return prev;
          }

          return {
            ...prev,
            couple: {
              ...prev.couple,
              partnerLinked: false,
              partnerStatus: 'waiting',
              partnerLastSeenAt: null,
              partnerLatestCheckin: null,
            },
            messages: normalizedMsgs.length > 0 ? normalizedMsgs : prev.messages,
          };
        });
      } catch {
        // Ignore network polling error
      }
    };

    pushMyState();
    pullPartnerState();
    const timer = setInterval(pullPartnerState, 2500);
    return () => clearInterval(timer);
  }, [
    hydrated,
    state.couple.inviteCode,
    state.couple.myDisplayName,
    state.couple.myAvatar,
    state.couple.myChatEnabled,
    state.myCheckin,
    state.language,
    slotId,
  ]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state, hydrated]);

  const lang = state.language;

  const updateMyTrafficState = (nextState: TrafficState) => {
    if (nextState === 'LIBER') playSoundEffect('liber', state.soundEnabled);
    else if (nextState === 'CASI_LIBER') playSoundEffect('casi', state.soundEnabled);
    else playSoundEffect('anti', state.soundEnabled);

    const scoreMap: Record<TrafficState, number> = {
      LIBER: 85,
      CASI_LIBER: 55,
      ANTI_LIBER: 25,
    };

    const checkin: MoodCheckin = {
      id: `chk_${Date.now()}`,
      userId: 'demo_user_a',
      score: scoreMap[nextState],
      computedState: nextState,
      finalState: nextState,
      manualOverride: true,
      boundaryLock: nextState === 'ANTI_LIBER' ? 'NO_LOCK' : 'NONE',
      shareMoodState: state.privacy.shareMoodState,
      shareAffectionPrefs: state.privacy.shareAffectionPrefs,
      shareEnergyLevel: state.privacy.shareEnergyLevel,
      affectionPrefs: state.myCheckin?.affectionPrefs ?? ['cuddles'],
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      myCheckin: checkin,
      myHistory: [checkin, ...prev.myHistory].slice(0, 20),
    }));
  };

  const sendCoupleMessage = (emoji: string, text: string) => {
    const myName =
      state.couple.myDisplayName?.trim() || (lang === 'es' ? 'Tu Pareja' : 'Seu Par');
    const myAvatar = state.couple.myAvatar || '💖';
    const myChatEnabled = state.couple.myChatEnabled !== false;

    fetch('/api/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: state.couple.inviteCode,
        slotId,
        displayName: myName,
        avatar: myAvatar,
        chatEnabled: myChatEnabled,
        message: { emoji, text },
      }),
    }).catch(() => {});
    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: `msg_${Date.now()}`,
          senderSlotId: slotId,
          senderName: myName,
          emoji,
          text,
          createdAt: new Date().toISOString(),
          isFromMe: true,
        },
      ].slice(-50),
    }));
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-3xl animate-pulse">❤️</div>
      </div>
    );
  }

  // 18+ Adult Gate
  if (!state.isAdultConfirmed) {
    return (
      <main className="relative min-h-screen flex items-center justify-center p-4">
        <FloatingHearts />
        <div className="relative z-10 max-w-md w-full rounded-[2rem] bg-white/95 backdrop-blur-md border border-rose-200 p-7 shadow-2xl text-center space-y-5">
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setState((p) => ({ ...p, language: 'es' }))}
              className={`rounded-full px-3 py-1 text-xs font-bold cursor-pointer ${
                lang === 'es' ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-800'
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setState((p) => ({ ...p, language: 'pt-BR' }))}
              className={`rounded-full px-3 py-1 text-xs font-bold cursor-pointer ${
                lang === 'pt-BR' ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-800'
              }`}
            >
              PT-BR
            </button>
          </div>

          <div className="text-5xl">🚦❤️</div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
              {UI_TEXT.appTitle}
            </h1>
            <p className="text-sm font-semibold text-rose-800 mt-1">
              {UI_TEXT.appSubtitle[lang]}
            </p>
          </div>

          <div className="rounded-2xl bg-rose-50/80 border border-rose-200 p-4 space-y-2 text-left">
            <h2 className="font-bold text-rose-950 text-sm">{UI_TEXT.ageGateTitle[lang]}</h2>
            <p className="text-xs text-rose-900/85 leading-relaxed">
              {UI_TEXT.ageGateBody[lang]}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              playSoundEffect('liber', state.soundEnabled);
              setState((p) => ({ ...p, isAdultConfirmed: true }));
            }}
            className="w-full rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 py-4 px-5 text-white font-extrabold text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            {UI_TEXT.ageGateConfirm[lang]}
          </button>
        </div>
      </main>
    );
  }

  const currentTrafficState: TrafficState = state.myCheckin?.finalState ?? 'CASI_LIBER';
  const currentMatch = computeCoupleMatch(state.myCheckin, state.couple.partnerLatestCheckin);

  return (
    <div className="relative min-h-screen pb-24">
      <FloatingHearts />

      {/* Top Header */}
      <header className="relative z-10 max-w-2xl mx-auto px-4 pt-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              {UI_TEXT.appTitle}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-rose-800/85">
              {UI_TEXT.appSubtitle[lang]}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setState((p) => ({ ...p, language: p.language === 'es' ? 'pt-BR' : 'es' }))
              }
              className="rounded-full bg-white/85 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-900 shadow-sm hover:bg-rose-50 cursor-pointer"
            >
              {lang === 'es' ? '🇪🇸 ES' : '🇧🇷 PT'}
            </button>
            <button
              type="button"
              onClick={() => setState((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
              aria-label="Toggle sound"
              className="rounded-full bg-white/85 border border-rose-200 p-2 text-rose-700 shadow-sm hover:bg-rose-50 cursor-pointer"
            >
              {state.soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mode Indicator & Live Partner Presence Pills */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="rounded-2xl bg-white/75 backdrop-blur-sm border border-rose-100 px-3 py-1.5 text-[11px] font-semibold text-rose-800">
            {roomStorage === 'supabase' || isSupabaseConfigured
              ? `🔐 ${UI_TEXT.supabaseActiveBanner[lang]}`
              : `🧪 ${UI_TEXT.demoBanner[lang]}`}
          </div>

          <button
            type="button"
            onClick={() => {
              playSoundEffect('pop', state.soundEnabled);
              setHasPartnerUpdate(false);
              setActiveTab('match');
            }}
            className={`rounded-2xl px-3 py-1.5 text-[11px] font-extrabold border shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              state.couple.partnerStatus === 'online'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : state.couple.partnerStatus === 'recent'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : state.couple.partnerStatus === 'simulated'
                ? 'bg-slate-100 border-slate-200 text-slate-800'
                : 'bg-white/85 border-rose-200 text-rose-800'
            }`}
          >
            {state.couple.partnerStatus === 'online' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {state.couple.partnerAvatar}{' '}
                {state.couple.partnerName || (lang === 'es' ? 'Pareja' : 'Par')}{' '}
                {lang === 'es' ? 'en línea' : 'online'}
              </>
            ) : state.couple.partnerStatus === 'recent' ? (
              <>
                🟡 {state.couple.partnerAvatar} {state.couple.partnerName}{' '}
                {lang === 'es' ? 'reciente' : 'recente'}
              </>
            ) : state.couple.partnerStatus === 'simulated' ? (
              <>🧪 Demo</>
            ) : (
              <>
                ⚪{' '}
                {lang === 'es'
                  ? `Esperando pareja (${state.couple.inviteCode})`
                  : `Aguardando par (${state.couple.inviteCode})`}
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 pt-2 space-y-6">
        {activeTab === 'home' && (
          <div className="space-y-5">
            <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-rose-950">
                  {UI_TEXT.quickCheckin[lang]}
                </h2>
                <span className="text-xs font-bold text-rose-600">
                  {lang === 'es' ? 'Toca un color' : 'Toque em uma cor'}
                </span>
              </div>

              <TrafficLight
                language={lang}
                activeState={currentTrafficState}
                onSelectState={updateMyTrafficState}
              />

              <div className="grid grid-cols-3 gap-2">
                {(['LIBER', 'CASI_LIBER', 'ANTI_LIBER'] as TrafficState[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => updateMyTrafficState(st)}
                    className={`rounded-2xl py-2.5 px-2 text-xs font-extrabold border transition-all cursor-pointer ${
                      currentTrafficState === st
                        ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                        : 'bg-rose-50/70 text-rose-950 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    {TRAFFIC_STATE_META[st].emoji} {TRAFFIC_STATE_META[st].badge[lang]}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Match Preview */}
            {currentMatch && (
              <button
                type="button"
                onClick={() => setActiveTab('match')}
                className={`w-full text-left rounded-3xl bg-gradient-to-br border p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${currentMatch.toneClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    {lang === 'es' ? 'Match de Hoy' : 'Match de Hoje'}
                  </span>
                  <span className="text-xs font-bold text-rose-700 underline">
                    {lang === 'es' ? 'Ver pareja →' : 'Ver casal →'}
                  </span>
                </div>
                <p className="mt-1 text-lg font-extrabold text-rose-950">
                  {currentMatch.headline[lang]}
                </p>
                <p className="text-xs text-rose-900/85 mt-1">{currentMatch.message[lang]}</p>
              </button>
            )}

            <DailyDoubleKeyCard
              language={lang}
              soundEnabled={state.soundEnabled}
              roomCode={state.couple.inviteCode}
              slotId={slotId}
              myDisplayName={state.couple.myDisplayName || ''}
              onDiscussInChat={(emoji, text) => {
                sendCoupleMessage(emoji, text);
                setActiveTab('match');
              }}
            />

            {/* Featured Mystery & Trust Lab Quick Access */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  playSoundEffect('mystery', state.soundEnabled);
                  setRequestedGameMode('mystery');
                  setGameLaunchKey((k) => k + 1);
                  setActiveTab('game');
                }}
                className="rounded-3xl bg-gradient-to-br from-[#341242] via-[#5a1752] to-rose-600 p-4 text-left text-white shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <div className="text-xl">🌙✨</div>
                <p className="mt-1.5 font-extrabold text-sm">
                  {lang === 'es' ? 'Modo Misterio' : 'Modo Mistério'}
                </p>
                <p className="text-[11px] text-rose-100 mt-0.5">
                  {lang === 'es' ? 'Seducción sutil sin preguntas directas' : 'Sedução sutil sem perguntas diretas'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSoundEffect('insight', state.soundEnabled);
                  setRequestedGameMode('trust_lab');
                  setGameLaunchKey((k) => k + 1);
                  setActiveTab('game');
                }}
                className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-600 p-4 text-left text-white shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <div className="text-xl">🛡️💎</div>
                <p className="mt-1.5 font-extrabold text-sm">
                  {lang === 'es' ? 'Test Científico de Confianza' : 'Teste Científico de Confiança'}
                </p>
                <p className="text-[11px] text-indigo-100 mt-0.5">
                  {lang === 'es' ? 'Fidelidad, límites y acuerdos sanos' : 'Fidelidade, limites e acordos saudáveis'}
                </p>
              </button>
            </div>

            {/* Quick CTAs */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  playSoundEffect('pop', state.soundEnabled);
                  setRequestedGameMode('menu');
                  setGameLaunchKey((k) => k + 1);
                  setActiveTab('game');
                }}
                className="rounded-3xl bg-gradient-to-r from-rose-500 to-pink-600 p-4 text-left text-white shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <Gamepad2 className="w-6 h-6" />
                <p className="mt-2 font-extrabold text-sm">{UI_TEXT.playFullQuiz[lang]}</p>
                <p className="text-[11px] text-rose-100 mt-0.5">
                  {lang === 'es' ? '64 preguntas y Ruleta' : '64 perguntas e Roleta'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSoundEffect('roulette', state.soundEnabled);
                  setActiveTab('ideas');
                }}
                className="rounded-3xl bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-left text-white shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <Sparkles className="w-6 h-6" />
                <p className="mt-2 font-extrabold text-sm">{UI_TEXT.surpriseMe[lang]}</p>
                <p className="text-[11px] text-purple-100 mt-0.5">
                  {lang === 'es' ? 'Citas e ideas tiernas' : 'Encontros e ideias fofas'}
                </p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'game' && (
          <QuizGame
            key={`${requestedGameMode}-${gameLaunchKey}`}
            initialMode={requestedGameMode}
            language={lang}
            soundEnabled={state.soundEnabled}
            onCompleteCheckin={(res) => {
              const checkin: MoodCheckin = {
                id: `chk_${Date.now()}`,
                userId: 'demo_user_a',
                score: res.score,
                computedState: res.computedState,
                finalState: res.finalState,
                manualOverride: res.manualOverride,
                boundaryLock: res.boundaryLock,
                shareMoodState: state.privacy.shareMoodState,
                shareAffectionPrefs: state.privacy.shareAffectionPrefs,
                shareEnergyLevel: state.privacy.shareEnergyLevel,
                affectionPrefs: res.affectionTags,
                customNote: res.customNote,
                createdAt: new Date().toISOString(),
              };
              setState((prev) => ({
                ...prev,
                myCheckin: checkin,
                myHistory: [checkin, ...prev.myHistory].slice(0, 20),
              }));
            }}
            onCompleteTrustLab={(trustRes) =>
              setState((prev) => ({ ...prev, latestTrustResult: trustRes }))
            }
            onShareTrustInvite={sendCoupleMessage}
          />
        )}

        {activeTab === 'match' && (
          <CoupleMatchDashboard
            language={lang}
            soundEnabled={state.soundEnabled}
            myCheckin={state.myCheckin}
            myHistory={state.myHistory}
            couple={state.couple}
            privacy={state.privacy}
            messages={state.messages}
            slotId={slotId}
            onJoinWithCode={(code) => {
              lastPartnerMsgIdRef.current = null;
              setState((prev) => ({
                ...prev,
                couple: {
                  ...prev.couple,
                  inviteCode: code,
                  partnerLinked: false,
                  partnerName: '',
                  partnerLatestCheckin: null,
                  partnerStatus: 'waiting',
                  partnerLastSeenAt: null,
                  isSimulatedPartner: false,
                },
                messages: [],
              }));
            }}
            onGenerateNewCode={() => {
              const newCode = generateRoomCode();
              lastPartnerMsgIdRef.current = null;
              setState((prev) => ({
                ...prev,
                couple: {
                  ...prev.couple,
                  inviteCode: newCode,
                  partnerLinked: false,
                  partnerName: '',
                  partnerLatestCheckin: null,
                  partnerStatus: 'waiting',
                  partnerLastSeenAt: null,
                  isSimulatedPartner: false,
                },
                messages: [],
              }));
            }}
            onUpdateMyIdentity={(name, avatar) =>
              setState((prev) => ({
                ...prev,
                couple: {
                  ...prev.couple,
                  myDisplayName: name,
                  myAvatar: avatar,
                },
              }))
            }
            onToggleMyChatEnabled={() =>
              setState((prev) => ({
                ...prev,
                couple: {
                  ...prev.couple,
                  myChatEnabled: prev.couple.myChatEnabled === false,
                },
              }))
            }
            onSimulatePartnerState={(st, shared) =>
              setState((prev) => ({
                ...prev,
                couple: {
                  ...prev.couple,
                  partnerLinked: true,
                  partnerName: 'Mi Amor (Demo)',
                  partnerAvatar: '💖',
                  partnerStatus: 'simulated',
                  partnerChatEnabled: true,
                  isSimulatedPartner: true,
                  partnerLatestCheckin: {
                    id: `sim_${Date.now()}`,
                    userId: 'demo_user_b',
                    score: st === 'LIBER' ? 88 : st === 'CASI_LIBER' ? 56 : 20,
                    computedState: st,
                    finalState: st,
                    manualOverride: false,
                    boundaryLock: st === 'ANTI_LIBER' ? 'NO_LOCK' : 'NONE',
                    shareMoodState: shared,
                    shareAffectionPrefs: shared,
                    shareEnergyLevel: false,
                    affectionPrefs: ['cuddles', 'movie_chill'],
                    createdAt: new Date().toISOString(),
                  },
                },
              }))
            }
            onTogglePartnerHistoryOptIn={() =>
              setState((prev) => ({
                ...prev,
                privacy: {
                  ...prev.privacy,
                  historyOptInPartner: !prev.privacy.historyOptInPartner,
                },
              }))
            }
            onSendMessage={sendCoupleMessage}
          />
        )}

        {activeTab === 'ideas' && (
          <div className="space-y-6">
            <IdeasHub language={lang} soundEnabled={state.soundEnabled} />
            <PlansSection language={lang} />
            <CompetitionHub language={lang} enabled={isCompetitionModeEnabled()} />
          </div>
        )}

        {activeTab === 'privacy' && (
          <PrivacyCenter
            language={lang}
            onChangeLanguage={(nextLang) => setState((p) => ({ ...p, language: nextLang }))}
            soundEnabled={state.soundEnabled}
            onToggleSound={() => setState((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
            privacy={state.privacy}
            onUpdatePrivacy={(nextPrivacy) =>
              setState((prev) => ({
                ...prev,
                privacy: nextPrivacy,
                myCheckin: prev.myCheckin
                  ? {
                      ...prev.myCheckin,
                      shareMoodState: nextPrivacy.shareMoodState,
                      shareAffectionPrefs: nextPrivacy.shareAffectionPrefs,
                      shareEnergyLevel: nextPrivacy.shareEnergyLevel,
                    }
                  : null,
              }))
            }
            onExportData={() => {
              const blob = new Blob([JSON.stringify(state, null, 2)], {
                type: 'application/json',
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `liber-my-data-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            onDeleteAllData={() => {
              localStorage.removeItem(STORAGE_KEY);
              setState(createInitialState());
              setActiveTab('home');
            }}
          />
        )}
      </main>

      {/* Bottom Mobile-First Navigation */}
      <nav
        aria-label="Navegación principal"
        className="fixed bottom-0 inset-x-0 z-20 bg-white/95 backdrop-blur-lg border-t border-rose-100 shadow-[0_-4px_20px_rgba(244,63,94,0.08)]"
      >
        <div className="max-w-2xl mx-auto grid grid-cols-5">
          {[
            { id: 'home' as const, icon: Heart, label: UI_TEXT.nav.home[lang] },
            { id: 'game' as const, icon: Gamepad2, label: UI_TEXT.nav.game[lang] },
            { id: 'match' as const, icon: Users, label: UI_TEXT.nav.match[lang] },
            { id: 'ideas' as const, icon: Sparkles, label: UI_TEXT.nav.ideas[lang] },
            { id: 'privacy' as const, icon: Shield, label: UI_TEXT.nav.privacy[lang] },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  playSoundEffect('pop', state.soundEnabled);
                  if (item.id === 'match') setHasPartnerUpdate(false);
                  if (item.id === 'game') {
                    setRequestedGameMode('menu');
                    setGameLaunchKey((k) => k + 1);
                  }
                  setActiveTab(item.id);
                }}
                className={`relative flex flex-col items-center justify-center py-2.5 gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
                  isActive ? 'text-rose-600' : 'text-rose-900/60 hover:text-rose-700'
                }`}
              >
                {item.id === 'match' && hasPartnerUpdate && !isActive && (
                  <span className="absolute top-2 right-1/3 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
