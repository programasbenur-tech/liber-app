'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Copy,
  Check,
  Heart,
  Lock,
  Send,
  History,
  Share2,
  RefreshCw,
  MessageCircleHeart,
  Settings2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { VIRTUAL_AFFECTION_MESSAGES } from '@/data/ideas';
import { AFFECTION_TAG_LABELS, TRAFFIC_STATE_META } from '@/i18n/translations';
import { computeCoupleMatch } from '@/lib/match';
import { canCoupleChat } from '@/lib/roomPresence';
import { playSoundEffect } from '@/lib/sound';
import { TrafficLight } from '@/components/TrafficLight';
import { LoveGaugeClock } from '@/components/LoveGaugeClock';
import { DailyDoubleKeyCard } from '@/components/DailyDoubleKeyCard';
import { PeaceBridgeDrawer } from '@/components/PeaceBridgeDrawer';
import { CoupleFlameCard } from '@/components/CoupleFlameCard';
import { AntiStressRitualCard } from '@/components/AntiStressRitualCard';
import type { FlameActionType, FlameSummary } from '@/lib/flameLogic';
import {
  AffectionMessage,
  CoupleState,
  Language,
  MoodCheckin,
  PrivacySettings,
  TrafficState,
} from '@/types/liber';

export type CoupleDashboardSection = 'chat' | 'match' | 'daily';

interface CoupleMatchDashboardProps {
  language: Language;
  soundEnabled: boolean;
  myCheckin: MoodCheckin | null;
  myHistory: MoodCheckin[];
  couple: CoupleState;
  privacy: PrivacySettings;
  messages: AffectionMessage[];
  onJoinWithCode: (code: string) => void;
  onGenerateNewCode: () => void;
  onUpdateMyIdentity: (name: string, avatar: string) => void;
  onToggleMyChatEnabled: () => void;
  onSimulatePartnerState: (state: TrafficState, shared: boolean) => void;
  onTogglePartnerHistoryOptIn: () => void;
  onSendMessage: (emoji: string, text: string) => void;
  onSendRepairMessage?: (emoji: string, text: string) => void;
  slotId?: string;
  flameRefreshKey?: number;
  onLogFlame?: (actionType: FlameActionType, note?: string) => void;
  onFlameSummaryChange?: (summary: FlameSummary) => void;
  initialSection?: CoupleDashboardSection;
}

const AVATAR_CHOICES = ['💖', '🥰', '🐻', '🔥', '🌙', '🌹'];

export function CoupleMatchDashboard({
  language,
  soundEnabled,
  myCheckin,
  myHistory,
  couple,
  privacy,
  messages,
  onJoinWithCode,
  onGenerateNewCode,
  onUpdateMyIdentity,
  onToggleMyChatEnabled,
  onSimulatePartnerState,
  onTogglePartnerHistoryOptIn,
  onSendMessage,
  onSendRepairMessage,
  slotId = 'slot_default',
  flameRefreshKey = 0,
  onLogFlame,
  onFlameSummaryChange,
  initialSection = 'chat',
}: CoupleMatchDashboardProps) {
  const initialPartnerStatus =
    couple.partnerStatus ??
    (couple.isSimulatedPartner ? 'simulated' : couple.partnerLinked ? 'online' : 'waiting');

  const [activeSection, setActiveSection] = useState<CoupleDashboardSection>(initialSection);
  const [setupOpen, setSetupOpen] = useState<boolean>(initialPartnerStatus === 'waiting');
  const [demoOpen, setDemoOpen] = useState<boolean>(false);
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [nowMs, setNowMs] = useState<number | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const syncClock = () => setNowMs(Date.now());
    const initTimer = setTimeout(syncClock, 0);
    const interval = setInterval(syncClock, 15_000);
    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages.length, activeSection]);

  const partnerCheckin = couple.partnerLatestCheckin;
  const match = computeCoupleMatch(myCheckin, partnerCheckin);

  const partnerStatus =
    couple.partnerStatus ??
    (couple.isSimulatedPartner ? 'simulated' : couple.partnerLinked ? 'online' : 'waiting');
  const myChatEnabled = couple.myChatEnabled !== false;
  const partnerChatEnabled = couple.partnerChatEnabled !== false;
  const chatAllowed = canCoupleChat({
    myChatEnabled,
    partnerChatEnabled,
    partnerStatus,
  });

  const recentMinutes =
    nowMs && couple.partnerLastSeenAt
      ? Math.max(1, Math.round((nowMs - couple.partnerLastSeenAt) / 60_000))
      : 1;

  const renderPresencePill = () => {
    if (partnerStatus === 'online') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 px-3 py-1 text-xs font-extrabold max-w-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="truncate">
            {language === 'es' ? 'En línea' : 'Online'} · {couple.partnerAvatar}{' '}
            {couple.partnerName || (language === 'es' ? 'Pareja' : 'Par')}
          </span>
        </span>
      );
    }
    if (partnerStatus === 'recent') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1 text-xs font-bold max-w-full">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span className="truncate">
            {language === 'es'
              ? `Hace ${recentMinutes} min`
              : `Há ${recentMinutes} min`}{' '}
            · {couple.partnerAvatar} {couple.partnerName}
          </span>
        </span>
      );
    }
    if (partnerStatus === 'simulated') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1 text-xs font-bold">
          🧪{' '}
          {language === 'es'
            ? 'Simulador Demo'
            : 'Simulador Demo'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 px-3 py-1 text-xs font-bold">
        <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
        {language === 'es' ? 'Esperando pareja (1/2)' : 'Aguardando par (1/2)'}
      </span>
    );
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(couple.inviteCode).catch(() => {});
    setCopied(true);
    playSoundEffect('pop', soundEnabled);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleCopyInviteLink = () => {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const inviteUrl = `${base}/?room=${encodeURIComponent(couple.inviteCode)}`;
    if (navigator.share) {
      navigator
        .share({
          title: 'LIBER ❤️',
          text:
            language === 'es'
              ? `¡Entra a nuestra sala privada en LIBER ❤️! Código: ${couple.inviteCode}`
              : `Entre na nossa sala privada no LIBER ❤️! Código: ${couple.inviteCode}`,
          url: inviteUrl,
        })
        .catch(() => {
          navigator.clipboard?.writeText(inviteUrl).catch(() => {});
        });
    } else {
      navigator.clipboard?.writeText(inviteUrl).catch(() => {});
    }
    setLinkCopied(true);
    playSoundEffect('pop', soundEnabled);
    setTimeout(() => setLinkCopied(false), 2200);
  };

  const mutualHistoryUnlocked = privacy.historyOptInSelf && privacy.historyOptInPartner;

  return (
    <div className="space-y-4">
      {/* 1. Compact Status & Collapsible Room Setup Card */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-rose-100 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="min-w-0">{renderPresencePill()}</div>

          <button
            type="button"
            onClick={() => {
              playSoundEffect('pop', soundEnabled);
              setSetupOpen((v) => !v);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 text-xs font-extrabold text-rose-900 cursor-pointer shrink-0"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Sala / Invitar' : 'Sala / Convidar'}</span>
            {setupOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {!setupOpen && (
          <div className="flex items-center justify-between gap-2 flex-wrap rounded-2xl bg-rose-50/60 border border-rose-100 px-3 py-2 text-xs">
            <span className="font-bold text-rose-900">
              🔑 {language === 'es' ? 'Sala:' : 'Sala:'}{' '}
              <code className="font-extrabold tracking-wider">{couple.inviteCode}</code>
            </span>
            <button
              type="button"
              onClick={handleCopyInviteLink}
              className="inline-flex items-center gap-1 rounded-lg bg-white border border-rose-200 px-2.5 py-1 text-[11px] font-extrabold text-rose-700 hover:bg-rose-50 cursor-pointer"
            >
              <Share2 className="w-3 h-3" />
              {linkCopied
                ? language === 'es'
                  ? '¡Enlace copiado!'
                  : 'Link copiado!'
                : language === 'es'
                ? 'Copiar enlace'
                : 'Copiar link'}
            </button>
          </div>
        )}

        {setupOpen && (
          <div className="space-y-3 pt-2 border-t border-rose-100">
            {partnerStatus === 'waiting' && (
              <div className="rounded-2xl bg-amber-50/90 border border-amber-200 px-3.5 py-2.5 text-xs text-amber-950 leading-relaxed">
                ⏳{' '}
                {language === 'es'
                  ? 'Comparte el enlace de abajo con tu pareja. Cuando entre, pasará a 🟢 En línea.'
                  : 'Compartilhe o link abaixo com seu par. Quando entrar, ficará 🟢 Online.'}
              </div>
            )}

            {/* My Name & Avatar in this Room */}
            <div className="rounded-2xl bg-rose-50/50 border border-rose-100 p-3 space-y-2">
              <label className="text-xs font-bold text-rose-900 block">
                {language === 'es'
                  ? 'Tu nombre y avatar en esta sala'
                  : 'Seu nome e avatar nesta sala'}
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <input
                  type="text"
                  maxLength={32}
                  value={couple.myDisplayName ?? ''}
                  onChange={(e) =>
                    onUpdateMyIdentity(e.target.value, couple.myAvatar || '💖')
                  }
                  placeholder={language === 'es' ? 'Ej: Tu nombre...' : 'Ex: Seu nome...'}
                  className="w-full sm:flex-1 min-w-0 rounded-xl bg-white border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <div className="flex flex-wrap gap-1.5">
                  {AVATAR_CHOICES.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        playSoundEffect('pop', soundEnabled);
                        onUpdateMyIdentity(couple.myDisplayName ?? '', av);
                      }}
                      className={`w-8 h-8 rounded-xl text-base flex items-center justify-center border transition-all cursor-pointer ${
                        (couple.myAvatar || '💖') === av
                          ? 'bg-rose-500 border-rose-500 scale-105 shadow'
                          : 'bg-white border-rose-200 hover:bg-rose-50'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-rose-50/80 border border-rose-200 p-3.5 space-y-2 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-rose-800">
                    {language === 'es' ? 'Tu código de sala' : 'Seu código da sala'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      playSoundEffect('pop', soundEnabled);
                      onGenerateNewCode();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {language === 'es' ? 'Nuevo código' : 'Novo código'}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-base font-extrabold tracking-wider text-rose-950 break-all">
                    {couple.inviteCode}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-rose-700 border border-rose-200 hover:bg-rose-50 cursor-pointer shrink-0"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleCopyInviteLink}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 px-3 py-2 text-xs font-bold text-white hover:bg-rose-600 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {linkCopied
                      ? language === 'es'
                        ? '¡Enlace copiado!'
                        : 'Link copiado!'
                      : language === 'es'
                      ? 'Enviar enlace directo a mi pareja'
                      : 'Enviar link direto para meu par'}
                  </span>
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (joinCode.trim().length >= 4) {
                    onJoinWithCode(joinCode.trim().toUpperCase());
                    setJoinCode('');
                    playSoundEffect('message', soundEnabled);
                  }
                }}
                className="rounded-2xl bg-purple-50/70 border border-purple-200 p-3.5 flex items-end gap-2 min-w-0"
              >
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-bold text-purple-900 block">
                    {language === 'es' ? 'Unirse con código' : 'Entrar com código'}
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="LIBER-2026"
                    className="mt-1 w-full min-w-0 rounded-xl bg-white border border-purple-200 px-3 py-1.5 text-sm font-semibold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-purple-700 cursor-pointer shrink-0"
                >
                  {language === 'es' ? 'Unir' : 'Entrar'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* 2. Clear 3-Sub-Tab Switcher (Eliminates vertical scroll overload) */}
      <div
        role="tablist"
        aria-label={language === 'es' ? 'Secciones de pareja' : 'Seções do casal'}
        className="grid grid-cols-3 gap-1.5 rounded-2xl bg-white/95 backdrop-blur-md p-1.5 border border-rose-100 shadow-sm"
      >
        {(
          [
            {
              id: 'chat' as const,
              emoji: '💬',
              labelEs: 'Chat',
              labelPt: 'Chat',
              badge: messages.length > 0 ? messages.length : null,
            },
            {
              id: 'match' as const,
              emoji: '🚦',
              labelEs: 'Match',
              labelPt: 'Match',
              badge: null,
            },
            {
              id: 'daily' as const,
              emoji: '🔑',
              labelEs: 'Diario',
              labelPt: 'Diário',
              badge: null,
            },
          ]
        ).map((tab) => {
          const active = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                playSoundEffect('pop', soundEnabled);
                setActiveSection(tab.id);
              }}
              className={`rounded-xl py-2.5 px-2 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                active
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-sm'
                  : 'text-rose-900/80 hover:bg-rose-50'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{language === 'es' ? tab.labelEs : tab.labelPt}</span>
              {tab.badge !== null && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold leading-none ${
                    active ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION A: 2-WAY PRIVATE COUPLE CHAT + PEACE BRIDGE */}
      {activeSection === 'chat' && (
        <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-rose-100 p-4 sm:p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-extrabold text-rose-950 flex items-center gap-2">
                <MessageCircleHeart className="w-5 h-5 text-rose-500 shrink-0" />
                <span>
                  {language === 'es'
                    ? 'Conversación Privada'
                    : 'Conversa Privada'}
                </span>
              </h2>
              <p className="text-[11px] font-semibold text-rose-800/75 mt-0.5">
                {partnerStatus === 'waiting'
                  ? language === 'es'
                    ? '⚪ Conecta a tu pareja en "Sala / Invitar" para chatear aquí'
                    : '⚪ Conecte seu par em "Sala / Convidar" para conversar aqui'
                  : partnerChatEnabled
                  ? language === 'es'
                    ? `🟢 ${couple.partnerName || 'Tu pareja'} tiene el chat activo`
                    : `🟢 ${couple.partnerName || 'Seu par'} está com o chat ativo`
                  : language === 'es'
                  ? `🔒 ${couple.partnerName || 'Tu pareja'} pausó el chat`
                  : `🔒 ${couple.partnerName || 'Seu par'} pausou o chat`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                playSoundEffect('pop', soundEnabled);
                onToggleMyChatEnabled();
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-extrabold border transition-colors cursor-pointer shrink-0 ${
                myChatEnabled
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-200 hover:bg-emerald-200'
                  : 'bg-rose-100 text-rose-900 border-rose-200 hover:bg-rose-200'
              }`}
            >
              {myChatEnabled
                ? language === 'es'
                  ? '💬 Activo'
                  : '💬 Ativo'
                : language === 'es'
                ? '⏸️ Pausado'
                : '⏸️ Pausado'}
            </button>
          </div>

          {!myChatEnabled ? (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-900 text-center">
              {language === 'es'
                ? 'Pausaste tu chat. Toca "Pausado" arriba para reactivarlo.'
                : 'Você pausou o chat. Toque em "Pausado" acima para reativar.'}
            </div>
          ) : partnerStatus === 'waiting' ? (
            <div className="rounded-2xl bg-purple-50/70 border border-purple-200 p-4 text-xs font-semibold text-purple-900 text-center space-y-2.5">
              <p>
                {language === 'es'
                  ? 'Cuando tu pareja abra tu enlace de sala podrán conversar aquí en vivo.'
                  : 'Quando seu par abrir seu link da sala vocês poderão conversar aqui ao vivo.'}
              </p>
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-extrabold text-white hover:bg-purple-700 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                {linkCopied
                  ? language === 'es'
                    ? '¡Enlace copiado!'
                    : 'Link copiado!'
                  : language === 'es'
                  ? 'Compartir enlace a mi pareja'
                  : 'Compartilhar link com meu par'}
              </button>
            </div>
          ) : !partnerChatEnabled && partnerStatus !== 'simulated' ? (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs font-semibold text-amber-950 text-center">
              {language === 'es'
                ? 'Tu pareja pausó el chat por ahora. Respeta su espacio con cariño 💛.'
                : 'Seu par pausou o chat por enquanto. Respeite o espaço com carinho 💛.'}
            </div>
          ) : chatAllowed ? (
            <>
              {/* Scrollable 2-Way Chat Bubbles */}
              <div
                ref={chatScrollRef}
                className="h-72 overflow-y-auto rounded-2xl bg-gradient-to-b from-rose-50/50 to-purple-50/40 border border-rose-100 p-3.5 space-y-2.5"
              >
                {messages.length === 0 ? (
                  <p className="text-center text-xs text-rose-800/65 py-20">
                    {language === 'es'
                      ? 'Aún no hay mensajes. ¡Escribe algo tierno o usa el Puente de Paz abajo!'
                      : 'Ainda sem mensagens. Escreva algo carinhoso ou use a Ponte de Paz abaixo!'}
                  </p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.isFromMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm shadow-sm break-words ${
                          m.isFromMe
                            ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-br-sm'
                            : 'bg-white border border-purple-200 text-purple-950 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-[10px] font-bold opacity-85 mb-0.5">
                          {m.isFromMe
                            ? couple.myDisplayName || (language === 'es' ? 'Tú' : 'Você')
                            : m.senderName}
                        </p>
                        <p className="leading-snug">
                          {m.emoji} {m.text}
                        </p>
                      </div>
                      <span className="text-[10px] text-rose-800/60 mt-0.5 px-1">
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input right under the bubbles */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!customMsg.trim()) return;
                  playSoundEffect('message', soundEnabled);
                  onSendMessage('💖', customMsg.trim());
                  setCustomMsg('');
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  maxLength={300}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder={
                    language === 'es'
                      ? 'Escribe un mensaje para conversar...'
                      : 'Escreva uma mensagem para conversar...'
                  }
                  className="flex-1 min-w-0 rounded-2xl bg-rose-50/60 border border-rose-200 px-3.5 py-2.5 text-sm text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-rose-500 px-4 py-2.5 text-white font-bold hover:bg-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  aria-label={language === 'es' ? 'Enviar mensaje' : 'Enviar mensagem'}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Romantic Prompts */}
              <div className="flex flex-wrap gap-1.5">
                {VIRTUAL_AFFECTION_MESSAGES.map((tpl) => (
                  <button
                    key={tpl.key}
                    type="button"
                    onClick={() => {
                      playSoundEffect('message', soundEnabled);
                      onSendMessage(tpl.emoji, tpl.text[language]);
                    }}
                    className="rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 text-[11px] font-semibold text-rose-950 transition-colors cursor-pointer"
                  >
                    {tpl.emoji} {tpl.text[language]}
                  </button>
                ))}
              </div>

              <PeaceBridgeDrawer
                language={language}
                soundEnabled={soundEnabled}
                onSendToChat={(emoji, text) => {
                  if (onSendRepairMessage) {
                    onSendRepairMessage(emoji, text);
                  } else {
                    onSendMessage(emoji, text);
                    onLogFlame?.('repair');
                  }
                }}
              />
            </>
          ) : null}
        </div>
      )}

      {/* SECTION B: TRAFFIC LIGHT MATCH + FLAME + HISTORY + COLLAPSIBLE DEMO */}
      {activeSection === 'match' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-rose-100 p-4 sm:p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-rose-950 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0" />
                {language === 'es' ? 'Match del Semáforo' : 'Match do Semáforo'}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              <div className="rounded-2xl bg-rose-50/60 border border-rose-100 p-3 sm:p-4 min-w-0 overflow-hidden flex flex-col items-center text-center gap-2">
                <span className="text-xs font-bold text-rose-700 w-full truncate">
                  {couple.myAvatar || '💖'}{' '}
                  {couple.myDisplayName || (language === 'es' ? 'Tú' : 'Você')}
                </span>
                {myCheckin && myCheckin.shareMoodState ? (
                  <>
                    <TrafficLight language={language} activeState={myCheckin.finalState} compact />
                    <span className="text-[11px] sm:text-xs font-extrabold text-rose-950 break-words leading-snug">
                      {TRAFFIC_STATE_META[myCheckin.finalState].headline[language]}
                    </span>
                  </>
                ) : (
                  <p className="text-xs text-rose-800/70 py-4">
                    🔒 {language === 'es' ? 'No compartido aún' : 'Ainda não compartilhado'}
                  </p>
                )}
              </div>

              <div className="rounded-2xl bg-purple-50/60 border border-purple-100 p-3 sm:p-4 min-w-0 overflow-hidden flex flex-col items-center text-center gap-2">
                <span className="text-xs font-bold text-purple-700 w-full truncate">
                  {couple.partnerAvatar}{' '}
                  {couple.partnerName || (language === 'es' ? 'Tu pareja' : 'Seu par')}
                </span>
                {partnerCheckin && partnerCheckin.shareMoodState ? (
                  <>
                    <TrafficLight
                      language={language}
                      activeState={partnerCheckin.finalState}
                      compact
                    />
                    <span className="text-[11px] sm:text-xs font-extrabold text-purple-950 break-words leading-snug">
                      {TRAFFIC_STATE_META[partnerCheckin.finalState].headline[language]}
                    </span>
                  </>
                ) : (
                  <p className="text-xs text-purple-800/70 py-4">
                    {partnerStatus === 'waiting'
                      ? language === 'es'
                        ? '⏳ Esperando conexión'
                        : '⏳ Aguardando conexão'
                      : language === 'es'
                      ? '🔒 Aún no envió resultado'
                      : '🔒 Ainda não enviou resultado'}
                  </p>
                )}
              </div>
            </div>

            {match ? (
              <div
                className={`rounded-2xl bg-gradient-to-br border p-4 sm:p-5 space-y-2.5 ${match.toneClass}`}
              >
                <h3 className="text-base sm:text-lg font-extrabold text-rose-950">
                  {match.headline[language]}
                </h3>
                <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed">
                  {match.message[language]}
                </p>
                <div className="rounded-xl bg-white/75 p-3 text-xs font-semibold text-rose-900">
                  💡 {language === 'es' ? 'Idea sugerida:' : 'Ideia sugerida:'}{' '}
                  {match.suggestedActivity[language]}
                </div>
                {match.sharedAffectionPrefs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {match.sharedAffectionPrefs.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/85 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-900"
                      >
                        {AFFECTION_TAG_LABELS[tag]?.[language] ?? tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-center text-xs sm:text-sm text-rose-900">
                {language === 'es'
                  ? 'Ambos necesitan compartir su semáforo actual para ver el Match.'
                  : 'Os dois precisam compartilhar o semáforo atual para ver o Match.'}
              </div>
            )}

            {/* Detailed Partner Shared Result Card */}
            {partnerCheckin && partnerCheckin.shareMoodState && (
              <div className="rounded-2xl bg-purple-50/70 border border-purple-200 p-4 space-y-3 overflow-hidden">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-sm font-extrabold text-purple-950">
                    {couple.partnerAvatar}{' '}
                    {language === 'es'
                      ? `Resultado de ${couple.partnerName || 'tu pareja'}`
                      : `Resultado de ${couple.partnerName || 'seu par'}`}
                  </h3>
                  <span className="text-[11px] font-semibold text-purple-700">
                    {new Date(partnerCheckin.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <LoveGaugeClock
                  score={partnerCheckin.score}
                  language={language}
                  hintLabel={`${TRAFFIC_STATE_META[partnerCheckin.finalState].emoji} ${
                    TRAFFIC_STATE_META[partnerCheckin.finalState].headline[language]
                  }`}
                />

                {partnerCheckin.customNote && (
                  <div className="rounded-xl bg-white border border-purple-200 px-3.5 py-2.5 text-xs font-semibold text-purple-950 break-words">
                    💬 &ldquo;{partnerCheckin.customNote}&rdquo;
                  </div>
                )}

                {partnerCheckin.shareAffectionPrefs &&
                  partnerCheckin.affectionPrefs.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-purple-800">
                        {language === 'es' ? 'Lo que le provoca hoy:' : 'O que dá vontade hoje:'}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {partnerCheckin.affectionPrefs.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white border border-purple-200 px-3 py-1 text-xs font-bold text-purple-900"
                          >
                            {AFFECTION_TAG_LABELS[tag]?.[language] ?? tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>

          <CoupleFlameCard
            language={language}
            soundEnabled={soundEnabled}
            roomCode={couple.inviteCode}
            slotId={slotId}
            myDisplayName={couple.myDisplayName || ''}
            refreshKey={flameRefreshKey}
            onFlameSummaryChange={onFlameSummaryChange}
          />

          {/* Private Couple History (Mutual Opt-in Only) */}
          <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-rose-100 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-rose-950 flex items-center gap-2">
                <History className="w-4 h-4 text-purple-500 shrink-0" />
                {language === 'es'
                  ? 'Historial Privado (Opt-in Mutuo)'
                  : 'Histórico Privado (Opt-in Mútuo)'}
              </h3>
              <button
                type="button"
                onClick={onTogglePartnerHistoryOptIn}
                className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-xl px-3 py-1 cursor-pointer"
              >
                {privacy.historyOptInPartner
                  ? language === 'es'
                    ? 'Pareja aceptó ✓'
                    : 'Par aceitou ✓'
                  : language === 'es'
                  ? 'Simular aceptación'
                  : 'Simular aceite'}
              </button>
            </div>

            {!mutualHistoryUnlocked ? (
              <div className="rounded-2xl bg-purple-50/70 border border-purple-200 p-3.5 text-xs text-purple-900 flex items-center gap-2.5">
                <Lock className="w-4 h-4 shrink-0 text-purple-600" />
                <span>
                  {language === 'es'
                    ? 'El historial solo se muestra cuando AMBOS activan el permiso mutuo en Privacidad.'
                    : 'O histórico só aparece quando AMBOS ativam a permissão mútua em Privacidade.'}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {myHistory.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-rose-50/60 px-3.5 py-2 text-xs gap-2"
                  >
                    <span className="font-bold text-rose-950 truncate">
                      {TRAFFIC_STATE_META[item.finalState].emoji}{' '}
                      {TRAFFIC_STATE_META[item.finalState].headline[language]}
                    </span>
                    <span className="text-rose-700/75 shrink-0">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collapsible Demo Partner Simulator */}
          <div className="rounded-3xl bg-slate-50/90 border border-slate-200 p-4 space-y-2.5">
            <button
              type="button"
              onClick={() => setDemoOpen((v) => !v)}
              className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-600 cursor-pointer"
            >
              <span>
                🧪{' '}
                {language === 'es'
                  ? 'Probar en solitario (Simulador Demo)'
                  : 'Testar sozinho (Simulador Demo)'}
              </span>
              {demoOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {demoOpen && (
              <div className="flex flex-wrap gap-2 pt-1">
                {(['LIBER', 'CASI_LIBER', 'ANTI_LIBER'] as TrafficState[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      playSoundEffect('pop', soundEnabled);
                      onSimulatePartnerState(st, true);
                    }}
                    className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer"
                  >
                    {TRAFFIC_STATE_META[st].emoji} {TRAFFIC_STATE_META[st].badge[language]}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    playSoundEffect('pop', soundEnabled);
                    onSimulatePartnerState('CASI_LIBER', false);
                  }}
                  className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  🔒 {language === 'es' ? 'Pareja en Privado' : 'Par no Privado'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION C: DAILY DOUBLE-KEY & GUIDED ANTI-STRESS RITUAL */}
      {activeSection === 'daily' && (
        <div className="space-y-4">
          <DailyDoubleKeyCard
            language={language}
            soundEnabled={soundEnabled}
            roomCode={couple.inviteCode}
            slotId={slotId}
            myDisplayName={couple.myDisplayName || ''}
            onDiscussInChat={(emoji, text) => {
              onSendMessage(emoji, text);
              setActiveSection('chat');
            }}
            onAnswerSubmitted={() => onLogFlame?.('daily_key')}
          />

          <AntiStressRitualCard
            language={language}
            soundEnabled={soundEnabled}
            defaultOpen
            onSendToChat={onSendMessage}
            onCompleteRitual={() => onLogFlame?.('anti_stress')}
          />
        </div>
      )}
    </div>
  );
}
