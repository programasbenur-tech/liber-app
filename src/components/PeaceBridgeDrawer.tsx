'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HeartHandshake, Send, Check } from 'lucide-react';
import {
  CLINICAL_SUPPORT_NOTE,
  REPAIR_CATEGORY_META,
  REPAIR_PHRASES,
  SOFTENED_FEELINGS,
  SOFTENED_NEEDS,
  buildSoftenedStartupMessage,
  type RepairCategory,
} from '@/data/repairBridge';
import { playSoundEffect } from '@/lib/sound';
import type { Language } from '@/types/liber';

interface PeaceBridgeDrawerProps {
  language: Language;
  soundEnabled: boolean;
  onSendToChat: (emoji: string, text: string) => void;
}

const CATEGORIES: RepairCategory[] = [
  'pause_calm',
  'soften_listen',
  'team_bridge',
  'warm_apology',
];

export function PeaceBridgeDrawer({
  language,
  soundEnabled,
  onSendToChat,
}: PeaceBridgeDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'repair' | 'softened'>('repair');
  const [selectedCategory, setSelectedCategory] = useState<RepairCategory>('pause_calm');
  const [selectedFeelingId, setSelectedFeelingId] = useState(SOFTENED_FEELINGS[0].id);
  const [situation, setSituation] = useState('');
  const [selectedNeedId, setSelectedNeedId] = useState(SOFTENED_NEEDS[0].id);
  const [sentToast, setSentToast] = useState<string | null>(null);

  const selectedFeeling =
    SOFTENED_FEELINGS.find((f) => f.id === selectedFeelingId) ?? SOFTENED_FEELINGS[0];
  const selectedNeed =
    SOFTENED_NEEDS.find((n) => n.id === selectedNeedId) ?? SOFTENED_NEEDS[0];

  const softenedPreview = buildSoftenedStartupMessage({
    feelingLabel: selectedFeeling.label[language],
    situation,
    needLabel: selectedNeed.label[language],
    language,
  });

  const handleSendPhrase = (emoji: string, text: string) => {
    playSoundEffect('message', soundEnabled);
    onSendToChat(emoji, text);
    setSentToast(language === 'es' ? 'Enviado al chat ✓' : 'Enviado ao chat ✓');
    setTimeout(() => setSentToast(null), 2200);
  };

  const filteredPhrases = REPAIR_PHRASES.filter((p) => p.category === selectedCategory);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-50/90 via-purple-50/70 to-rose-50/80 border border-sky-200 p-3.5 space-y-3">
      <button
        type="button"
        onClick={() => {
          playSoundEffect('pop', soundEnabled);
          setIsOpen((v) => !v);
        }}
        className="w-full flex items-center justify-between gap-2 text-left cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-sky-600 shrink-0" />
          <div>
            <p className="text-xs font-extrabold text-sky-950">
              🕊️{' '}
              {language === 'es'
                ? 'Puente de Paz (Tregua e Inicio Suave)'
                : 'Ponte de Paz (Trégua e Início Suave)'}
            </p>
            <p className="text-[11px] text-sky-900/75">
              {language === 'es'
                ? 'Frases rápidas para bajar la tensión o hablar sin reclamos'
                : 'Frases rápidas para aliviar a tensão ou falar sem cobranças'}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-white/80 border border-sky-200 p-1 text-sky-700">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {sentToast && (
        <div className="rounded-xl bg-emerald-100 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-900 flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          <span>{sentToast}</span>
        </div>
      )}

      {isOpen && (
        <div className="space-y-3 pt-1 border-t border-sky-200/70">
          {/* Sub-mode tabs */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveMode('repair')}
              className={`rounded-xl py-2 px-3 text-xs font-extrabold border transition-colors cursor-pointer ${
                activeMode === 'repair'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-50'
              }`}
            >
              🕊️ {language === 'es' ? 'Tregua (1 toque)' : 'Trégua (1 toque)'}
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('softened')}
              className={`rounded-xl py-2 px-3 text-xs font-extrabold border transition-colors cursor-pointer ${
                activeMode === 'softened'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
              }`}
            >
              💛 {language === 'es' ? 'Inicio Suave (3 pasos)' : 'Início Suave (3 passos)'}
            </button>
          </div>

          {activeMode === 'repair' ? (
            <div className="space-y-2.5">
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const meta = REPAIR_CATEGORY_META[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold border transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-sky-500 text-white border-sky-500'
                          : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-50'
                      }`}
                    >
                      {meta.emoji} {meta.label[language]}
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-2">
                {filteredPhrases.map((phrase) => (
                  <button
                    key={phrase.id}
                    type="button"
                    onClick={() => handleSendPhrase(phrase.emoji, phrase.text[language])}
                    className="w-full text-left rounded-xl bg-white hover:bg-sky-50 border border-sky-200 px-3 py-2.5 text-xs font-semibold text-sky-950 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>
                      {phrase.emoji} {phrase.text[language]}
                    </span>
                    <Send className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 rounded-xl bg-white/90 border border-purple-200 p-3">
              {/* Step 1: Feeling */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-extrabold text-purple-900">
                  {language === 'es' ? '1. ¿Cómo me sentí?' : '1. Como eu me senti?'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SOFTENED_FEELINGS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFeelingId(f.id)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold border cursor-pointer ${
                        selectedFeelingId === f.id
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-purple-50 text-purple-950 border-purple-200'
                      }`}
                    >
                      {f.emoji} {f.label[language]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Situation */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-purple-900 block">
                  {language === 'es'
                    ? '2. ¿Qué situación pasó? (sin acusar)'
                    : '2. O que aconteceu? (sem acusar)'}
                </label>
                <input
                  type="text"
                  maxLength={120}
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder={
                    language === 'es'
                      ? 'Ej: nos interrumpimos y subió la voz'
                      : 'Ex: nos interrompemos e a voz subiu'
                  }
                  className="w-full rounded-xl bg-purple-50/40 border border-purple-200 px-3 py-1.5 text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Step 3: Positive Need */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-extrabold text-purple-900">
                  {language === 'es'
                    ? '3. ¿Qué me ayudaría hoy?'
                    : '3. O que me ajudaria hoje?'}
                </p>
                <div className="grid gap-1.5">
                  {SOFTENED_NEEDS.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setSelectedNeedId(n.id)}
                      className={`text-left rounded-xl px-3 py-1.5 text-[11px] font-bold border cursor-pointer ${
                        selectedNeedId === n.id
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-purple-50/60 text-purple-950 border-purple-200'
                      }`}
                    >
                      {n.emoji} {n.label[language]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-2.5 text-xs font-semibold text-amber-950">
                <p className="text-[10px] font-extrabold uppercase text-amber-800 mb-0.5">
                  {language === 'es' ? 'Vista previa:' : 'Prévia:'}
                </p>
                &ldquo;{softenedPreview}&rdquo;
              </div>

              <button
                type="button"
                onClick={() => {
                  handleSendPhrase('💛', softenedPreview);
                  setSituation('');
                }}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-rose-500 py-2.5 px-4 text-xs font-extrabold text-white shadow hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {language === 'es'
                  ? 'Enviar inicio suave al chat'
                  : 'Enviar início suave ao chat'}
              </button>
            </div>
          )}

          <p className="text-[10px] text-sky-900/75 leading-relaxed">
            {CLINICAL_SUPPORT_NOTE[language]}
          </p>
        </div>
      )}
    </div>
  );
}
