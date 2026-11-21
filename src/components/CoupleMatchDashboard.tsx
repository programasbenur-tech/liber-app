'use client';

import { useState } from 'react';
import { Copy, Check, Heart, Lock, Send, Users, History, Share2 } from 'lucide-react';
import { VIRTUAL_AFFECTION_MESSAGES } from '@/data/ideas';
import { AFFECTION_TAG_LABELS, TRAFFIC_STATE_META } from '@/i18n/translations';
import { computeCoupleMatch } from '@/lib/match';
import { playSoundEffect } from '@/lib/sound';
import { TrafficLight } from '@/components/TrafficLight';
import { LoveGaugeClock } from '@/components/LoveGaugeClock';
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
  onSimulatePartnerState: (state: TrafficState, shared: boolean) => void;
  onTogglePartnerHistoryOptIn: () => void;
  onSendMessage: (emoji: string, text: string) => void;
}

export function CoupleMatchDashboard({
  language,
  soundEnabled,
  myCheckin,
  myHistory,
  couple,
  privacy,
  messages,
  onJoinWithCode,
  onSimulatePartnerState,
  onTogglePartnerHistoryOptIn,
  onSendMessage,
}: CoupleMatchDashboardProps) {
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const partnerCheckin = couple.partnerLatestCheckin;
  const match = computeCoupleMatch(myCheckin, partnerCheckin);

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
      {/* Couple Linking Card */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-extrabold text-rose-950 flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-500" />
            {language === 'es' ? 'Conexión de Pareja' : 'Conexão do Casal'}
          </h2>
          <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
            {couple.partnerLinked
              ? `${couple.partnerAvatar} ${couple.partnerName}`
              : language === 'es'
              ? 'Esperando pareja'
              : 'Aguardando par'}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-rose-50/80 border border-rose-200 p-3.5">
            <p className="text-xs font-bold text-rose-800">
              {language === 'es' ? 'Tu código de invitación' : 'Seu código de convite'}
            </p>
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <code className="text-base font-extrabold tracking-widest text-rose-950">
                {couple.inviteCode}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-rose-700 border border-rose-200 hover:bg-rose-50 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied
                  ? language === 'es'
                    ? 'Copiado'
                    : 'Copiado'
                  : language === 'es'
                  ? 'Copiar'
                  : 'Copiar'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleCopyInviteLink}
              className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 px-3 py-2 text-xs font-bold text-white hover:bg-rose-600 cursor-pointer"
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
                {language === 'es' ? 'Vincular con código' : 'Vincular com código'}
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
              {language === 'es' ? 'Unir' : 'Unir'}
            </button>
          </form>
        </div>
      </div>

      {/* Match Comparison Card */}
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
              {language === 'es' ? 'Tú' : 'Você'}
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
              {couple.partnerAvatar} {couple.partnerName}
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
                🔒 {language === 'es' ? 'Modo privado' : 'Modo privado'}
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
                  ? `Resultado compartido de ${couple.partnerName}`
                  : `Resultado compartilhado de ${couple.partnerName}`}
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
                  {language === 'es'
                    ? 'Lo que le provoca hoy:'
                    : 'O que dá vontade hoje:'}
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

        {/* Demo Partner Simulator */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            🧪 {language === 'es' ? 'Simulador de Pareja (Modo Demo)' : 'Simulador de Par (Modo Demo)'}
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
      </div>

      {/* Virtual Affectionate Messages */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 p-5 shadow-sm space-y-4">
        <h3 className="text-lg font-extrabold text-rose-950">
          💌 {language === 'es' ? 'Mensajes Cariñosos Virtuales' : 'Mensagens Carinhosas Virtuais'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {VIRTUAL_AFFECTION_MESSAGES.map((tpl) => (
            <button
              key={tpl.key}
              type="button"
              onClick={() => {
                playSoundEffect('message', soundEnabled);
                onSendMessage(tpl.emoji, tpl.text[language]);
              }}
              className="rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 text-xs font-semibold text-rose-950 transition-colors cursor-pointer"
            >
              {tpl.emoji} {tpl.text[language]}
            </button>
          ))}
        </div>

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
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder={
              language === 'es'
                ? 'Escribe un mensajito dulce sin presión...'
                : 'Escreva uma mensagem doce sem pressão...'
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

        {messages.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto pt-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-2xl px-4 py-2.5 text-sm ${
                  m.isFromMe
                    ? 'bg-rose-100/80 text-rose-950 ml-6'
                    : 'bg-purple-100/80 text-purple-950 mr-6'
                }`}
              >
                <span className="font-bold">{m.senderName}: </span>
                <span>
                  {m.emoji} {m.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Private Couple History (Mutual Opt-in Only) */}
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
