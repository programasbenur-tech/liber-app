'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Copy,
  Check,
  Heart,
  Lock,
  Send,
  Users,
  History,
  Share2,
  RefreshCw,
  MessageCircleHeart,
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
}: CoupleMatchDashboardProps) {
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
  }, [messages.length]);

  const partnerCheckin = couple.partnerLatestCheckin;
  const match = computeCoupleMatch(myCheckin, partnerCheckin);

  const partnerStatus = couple.partnerStatus ?? (couple.isSimulatedPartner ? 'simulated' : couple.partnerLinked ? 'online' : 'waiting');
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
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 px-3 py-1 text-xs font-extrabold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {language === 'es' ? 'En línea ahora' : 'Online agora'} · {couple.partnerAvatar}{' '}
          {couple.partnerName || (language === 'es' ? 'Pareja' : 'Par')}
        </span>
      );
    }
    if (partnerStatus === 'recent') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          {language === 'es'
            ? `Conectado/a hace ${recentMinutes} min`
            : `Conectado(a) há ${recentMinutes} min`}{' '}
          · {couple.partnerAvatar} {couple.partnerName}
        </span>
      );
    }
    if (partnerStatus === 'simulated') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1 text-xs font-bold">
          🧪{' '}
          {language === 'es'
            ? 'Simulador Demo (sin pareja real)'
            : 'Simulador Demo (sem par real)'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 px-3 py-1 text-xs font-bold">
        <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
        {language === 'es'
          ? 'Esperando a tu pareja (1/2 en sala)'
          : 'Aguardando seu par (1/2 na sala)'}
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
              ? `¡Entra a jugar conmigo en LIBER ❤️! Código: ${couple.inviteCode}`
              : `Vem jogar comigo no LIBER ❤️! Código: ${couple.inviteCode}`,
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
    <div className="space-y-6">
      {/* 1. Live Connection & Identity Card */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-extrabold text-rose-950 flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-500" />
            {language === 'es' ? 'Conexión de Pareja' : 'Conexão do Casal'}
          </h2>
          {renderPresencePill()}
        </div>

        {partnerStatus === 'waiting' && (
          <div className="rounded-2xl bg-amber-50/80 border border-amber-200 px-4 py-3 text-xs text-amber-950 leading-relaxed">
            ⏳{' '}
            {language === 'es'
              ? 'Cuando tu pareja abra tu enlace o ingrese el código, aquí cambiará automáticamente a 🟢 En línea ahora.'
              : 'Quando seu par abrir seu link ou digitar o código, aqui mudará automaticamente para 🟢 Online agora.'}
          </div>
        )}

        {/* My Name & Avatar in this Room */}
        <div className="rounded-2xl bg-rose-50/50 border border-rose-100 p-3.5 space-y-2.5">
          <label className="text-xs font-bold text-rose-900 block">
            {language === 'es'
              ? 'Tu nombre y avatar en esta sala'
              : 'Seu nome e avatar nesta sala'}
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              maxLength={32}
              value={couple.myDisplayName ?? ''}
              onChange={(e) =>
                onUpdateMyIdentity(e.target.value, couple.myAvatar || '💖')
              }
              placeholder={language === 'es' ? 'Ej: Tu nombre...' : 'Ex: Seu nome...'}
              className="flex-1 min-w-[140px] rounded-xl bg-white border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <div className="flex gap-1">
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
                      ? 'bg-rose-500 border-rose-500 scale-110 shadow'
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
          <div className="rounded-2xl bg-rose-50/80 border border-rose-200 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-rose-800">
                {language === 'es' ? 'Tu código de invitación' : 'Seu código de convite'}
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
              <code className="text-base font-extrabold tracking-widest text-rose-950">
                {couple.inviteCode}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-rose-700 border border-rose-200 hover:bg-rose-50 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleCopyInviteLink}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 px-3 py-2 text-xs font-bold text-white hover:bg-rose-600 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              {linkCopied
                ? language === 'es'
                  ? '¡Enlace copiado! Mándalo por WhatsApp'
                  : 'Link copiado! Mande no WhatsApp'
                : language === 'es'
                ? 'Enviar enlace directo a mi pareja'
                : 'Enviar link direto para meu par'}
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
            className="rounded-2xl bg-purple-50/70 border border-purple-200 p-3.5 flex items-end gap-2"
          >
            <div className="flex-1">
              <label className="text-xs font-bold text-purple-900 block">
                {language === 'es' ? 'Unirse con código' : 'Entrar com código'}
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="LIBER-2026"
                className="mt-1 w-full rounded-xl bg-white border border-purple-200 px-3 py-1.5 text-sm font-semibold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-purple-700 cursor-pointer"
            >
              {language === 'es' ? 'Unir' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>

      {/* 2. Match Comparison Card */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-extrabold text-rose-950 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            {language === 'es' ? 'Match del Semáforo' : 'Match do Semáforo'}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-rose-50/60 border border-rose-100 p-4 flex flex-col items-center text-center gap-2">
            <span className="text-xs font-bold text-rose-700">
              {couple.myAvatar || '💖'} {couple.myDisplayName || (language === 'es' ? 'Tú' : 'Você')}
            </span>
            {myCheckin && myCheckin.shareMoodState ? (
              <>
                <TrafficLight language={language} activeState={myCheckin.finalState} compact />
                <span className="text-xs font-extrabold text-rose-950">
                  {TRAFFIC_STATE_META[myCheckin.finalState].headline[language]}
                </span>
              </>
            ) : (
              <p className="text-xs text-rose-800/70 py-4">
                🔒 {language === 'es' ? 'No compartido aún' : 'Ainda não compartilhado'}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-purple-50/60 border border-purple-100 p-4 flex flex-col items-center text-center gap-2">
            <span className="text-xs font-bold text-purple-700">
              {couple.partnerAvatar} {couple.partnerName || (language === 'es' ? 'Tu pareja' : 'Seu par')}
            </span>
            {partnerCheckin && partnerCheckin.shareMoodState ? (
              <>
                <TrafficLight language={language} activeState={partnerCheckin.finalState} compact />
                <span className="text-xs font-extrabold text-purple-950">
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
          <div className={`rounded-2xl bg-gradient-to-br border p-5 space-y-3 ${match.toneClass}`}>
            <h3 className="text-lg font-extrabold text-rose-950">{match.headline[language]}</h3>
            <p className="text-sm text-rose-900/90 leading-relaxed">{match.message[language]}</p>
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
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-center text-sm text-rose-900">
            {language === 'es'
              ? 'Ambos necesitan compartir su semáforo actual para ver el Match.'
              : 'Os dois precisam compartilhar o semáforo atual para ver o Match.'}
          </div>
        )}

        {/* Detailed Partner Shared Result Card */}
        {partnerCheckin && partnerCheckin.shareMoodState && (
          <div className="rounded-2xl bg-purple-50/70 border border-purple-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-purple-950">
                {couple.partnerAvatar}{' '}
                {language === 'es'
                  ? `Resultado compartido de ${couple.partnerName || 'tu pareja'}`
                  : `Resultado compartilhado de ${couple.partnerName || 'seu par'}`}
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
              <div className="rounded-xl bg-white border border-purple-200 px-3.5 py-2.5 text-xs font-semibold text-purple-950">
                💬 &ldquo;{partnerCheckin.customNote}&rdquo;
              </div>
            )}

            {partnerCheckin.shareAffectionPrefs && partnerCheckin.affectionPrefs.length > 0 && (
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

      <DailyDoubleKeyCard
        language={language}
        soundEnabled={soundEnabled}
        roomCode={couple.inviteCode}
        slotId={slotId}
        myDisplayName={couple.myDisplayName || ''}
        onDiscussInChat={onSendMessage}
        onAnswerSubmitted={() => onLogFlame?.('daily_key')}
      />

      <AntiStressRitualCard
        language={language}
        soundEnabled={soundEnabled}
        onSendToChat={onSendMessage}
        onCompleteRitual={() => onLogFlame?.('anti_stress')}
      />

      {/* 3. Voluntary 2-Way Private Couple Conversation */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-rose-100 p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-extrabold text-rose-950 flex items-center gap-2">
              <MessageCircleHeart className="w-5 h-5 text-rose-500" />
              {language === 'es'
                ? 'Conversación Privada de Pareja'
                : 'Conversa Privada do Casal'}
            </h3>
            <p className="text-[11px] font-semibold text-rose-800/75 mt-0.5">
              {partnerStatus === 'waiting'
                ? language === 'es'
                  ? '⚪ Esperando a que tu pareja se conecte'
                  : '⚪ Aguardando seu par se conectar'
                : partnerChatEnabled
                ? language === 'es'
                  ? `🟢 ${couple.partnerName || 'Tu pareja'} acepta conversar`
                  : `🟢 ${couple.partnerName || 'Seu par'} aceita conversar`
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
            className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold border transition-colors cursor-pointer ${
              myChatEnabled
                ? 'bg-emerald-100 text-emerald-900 border-emerald-200 hover:bg-emerald-200'
                : 'bg-rose-100 text-rose-900 border-rose-200 hover:bg-rose-200'
            }`}
          >
            {myChatEnabled
              ? language === 'es'
                ? '💬 Chat activo (Pausar)'
                : '💬 Chat ativo (Pausar)'
              : language === 'es'
              ? '⏸️ Chat pausado (Activar)'
              : '⏸️ Chat pausado (Ativar)'}
          </button>
        </div>

        {!myChatEnabled ? (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-900 text-center">
            {language === 'es'
              ? 'Pausaste la conversación. Actívala cuando quieras charlar.'
              : 'Você pausou a conversa. Ative quando quiser conversar.'}
          </div>
        ) : partnerStatus === 'waiting' ? (
          <div className="rounded-2xl bg-purple-50/70 border border-purple-200 p-4 text-xs font-semibold text-purple-900 text-center">
            {language === 'es'
              ? 'Cuando tu pareja entre a la sala podrán conversar aquí en vivo.'
              : 'Quando seu par entrar na sala vocês poderão conversar aqui ao vivo.'}
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
              className="h-64 overflow-y-auto rounded-2xl bg-gradient-to-b from-rose-50/50 to-purple-50/40 border border-rose-100 p-3.5 space-y-2.5"
            >
              {messages.length === 0 ? (
                <p className="text-center text-xs text-rose-800/65 py-16">
                  {language === 'es'
                    ? 'Aún no hay mensajes. ¡Rompan el hielo con un mensaje tierno!'
                    : 'Ainda sem mensagens. Quebrem o gelo com uma mensagem carinhosa!'}
                </p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.isFromMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                        m.isFromMe
                          ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-br-sm'
                          : 'bg-white border border-purple-200 text-purple-950 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-[10px] font-bold opacity-80 mb-0.5">
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

            {/* Chat Input */}
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
                className="flex-1 rounded-2xl bg-rose-50/60 border border-rose-200 px-4 py-2.5 text-sm text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <button
                type="submit"
                className="rounded-2xl bg-rose-500 px-4 py-2.5 text-white font-bold hover:bg-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : null}
      </div>

      {/* 4. Demo Partner Simulator (Strictly separated for solo testing) */}
      <div className="rounded-3xl bg-slate-50/90 border border-slate-200 p-4 space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
          🧪{' '}
          {language === 'es'
            ? 'Simulador de Pareja (Solo para probar en solitario)'
            : 'Simulador de Par (Apenas para testar sozinho)'}
        </p>
        <div className="flex flex-wrap gap-2">
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
      </div>

      {/* 5. Private Couple History (Mutual Opt-in Only) */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-extrabold text-rose-950 flex items-center gap-2">
            <History className="w-4 h-4 text-purple-500" />
            {language === 'es'
              ? 'Historial Privado de Pareja (Opt-in Mutuo)'
              : 'Histórico Privado do Casal (Opt-in Mútuo)'}
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
              ? 'Simular aceptación de pareja'
              : 'Simular aceite do par'}
          </button>
        </div>

        {!mutualHistoryUnlocked ? (
          <div className="rounded-2xl bg-purple-50/70 border border-purple-200 p-4 text-xs text-purple-900 flex items-center gap-2.5">
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
                className="flex items-center justify-between rounded-xl bg-rose-50/60 px-3.5 py-2 text-xs"
              >
                <span className="font-bold text-rose-950">
                  {TRAFFIC_STATE_META[item.finalState].emoji}{' '}
                  {TRAFFIC_STATE_META[item.finalState].headline[language]}
                </span>
                <span className="text-rose-700/75">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
