'use client';

import { useEffect, useState } from 'react';
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
import { IdeasHub } from '@/components/IdeasHub';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { PlansSection } from '@/components/PlansSection';
import {
  CompetitionHub,
  isCompetitionModeEnabled,
} from '@/modules/competitions/CompetitionHub';
import { TRAFFIC_STATE_META, UI_TEXT } from '@/i18n/translations';
import { computeCoupleMatch } from '@/lib/match';
import { playSoundEffect } from '@/lib/sound';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  AffectionMessage,
  CoupleState,
  Language,
  MoodCheckin,
  PrivacySettings,
  TrafficState,
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
    couple: {
      coupleId: 'demo_couple_1',
      inviteCode: 'LIBER-7742',
      partnerLinked: true,
      partnerName: 'Mi Amor',
      partnerAvatar: '💖',
      partnerLatestCheckin: {
        id: 'init_partner',
        userId: 'demo_user_b',
        score: 78,
        computedState: 'LIBER',
        finalState: 'LIBER',
        manualOverride: false,
        boundaryLock: 'NONE',
        shareMoodState: true,
        shareAffectionPrefs: true,
        shareEnergyLevel: false,
        affectionPrefs: ['cuddles', 'massage'],
        createdAt: initialTimestamp,
      },
    },
    messages: [
      {
        id: 'msg_welcome',
        senderName: 'Mi Amor',
        emoji: '🫂',
        text: 'Te mando un abrazo largo y sin ninguna prisa.',
        createdAt: initialTimestamp,
        isFromMe: false,
      },
    ],
  };
}

export default function HomePage() {
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [state, setState] = useState<PersistedState>(createInitialState);
  const [slotId, setSlotId] = useState<string>('slot_default');
  const [hasPartnerUpdate, setHasPartnerUpdate] = useState(false);

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
        if (roomParam && roomParam.length >= 4) {
          merged.couple = {
            ...merged.couple,
            inviteCode: roomParam,
            partnerLinked: true,
          };
        }
        return merged;
      });
    } catch {
      // Ignore invalid localStorage payload
    }
    setHydrated(true);
  }, []);

  // Live Local-Network Room Sync when Supabase is not configured
  useEffect(() => {
    if (!hydrated || isSupabaseConfigured || !state.couple.inviteCode) return;

    const pushMyState = () => {
      fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: state.couple.inviteCode,
          slotId,
          displayName: state.language === 'es' ? 'Tu Pareja' : 'Seu Par',
          avatar: '💖',
          checkin: state.myCheckin,
        }),
      }).catch(() => {});
    };

    const pullPartnerState = async () => {
      try {
        const res = await fetch(
          `/api/room?code=${encodeURIComponent(state.couple.inviteCode)}&slotId=${encodeURIComponent(slotId)}`
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          ok: boolean;
          partner: { displayName: string; avatar: string; checkin: MoodCheckin | null } | null;
          messages: AffectionMessage[];
        };
        if (data.ok && data.partner) {
          setState((prev) => {
            const prevTime = prev.couple.partnerLatestCheckin?.createdAt;
            const nextTime = data.partner?.checkin?.createdAt;
            if (nextTime && nextTime !== prevTime) {
              setHasPartnerUpdate(true);
            }
            return {
              ...prev,
              couple: {
                ...prev.couple,
                partnerLinked: true,
                partnerName: data.partner?.displayName ?? prev.couple.partnerName,
                partnerAvatar: data.partner?.avatar ?? prev.couple.partnerAvatar,
                partnerLatestCheckin: data.partner?.checkin ?? prev.couple.partnerLatestCheckin,
              },
              messages: data.messages.length > 0 ? data.messages : prev.messages,
            };
          });
        }
      } catch {
        // Ignore network polling error
      }
    };

    pushMyState();
    pullPartnerState();
    const timer = setInterval(pullPartnerState, 3000);
    return () => clearInterval(timer);
  }, [hydrated, state.couple.inviteCode, state.myCheckin, state.language, slotId]);

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

        {/* Mode Indicator Pill */}
        <div className="mt-3 rounded-2xl bg-white/75 backdrop-blur-sm border border-rose-100 px-3.5 py-2 text-[11px] font-semibold text-rose-800 flex items-center justify-between gap-2">
          <span>
            {isSupabaseConfigured
              ? `🔐 ${UI_TEXT.supabaseActiveBanner[lang]}`
              : `🧪 ${UI_TEXT.demoBanner[lang]}`}
          </span>
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

            {/* Quick CTAs */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  playSoundEffect('pop', state.soundEnabled);
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
            onJoinWithCode={(code) =>
              setState((prev) => ({
                ...prev,
                couple: {
                  ...prev.couple,
                  inviteCode: code,
                  partnerLinked: true,
                },
              }))
            }
            onSimulatePartnerState={(st, shared) =>
              setState((prev) => ({
                ...prev,
                couple: {
                  ...prev.couple,
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
            onSendMessage={(emoji, text) => {
              if (!isSupabaseConfigured) {
                fetch('/api/room', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    code: state.couple.inviteCode,
                    slotId,
                    displayName: lang === 'es' ? 'Tu Pareja' : 'Seu Par',
                    message: { emoji, text },
                  }),
                }).catch(() => {});
              }
              setState((prev) => ({
                ...prev,
                messages: [
                  {
                    id: `msg_${Date.now()}`,
                    senderName: lang === 'es' ? 'Tú' : 'Você',
                    emoji,
                    text,
                    createdAt: new Date().toISOString(),
                    isFromMe: true,
                  },
                  ...prev.messages,
                ].slice(0, 30),
              }));
            }}
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
