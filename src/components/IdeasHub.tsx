'use client';

import { useState } from 'react';
import { Sparkles, HeartHandshake, CalendarHeart } from 'lucide-react';
import { ROMANTIC_IDEAS } from '@/data/ideas';
import { UI_TEXT } from '@/i18n/translations';
import { playSoundEffect } from '@/lib/sound';
import { Language, RomanticIdea } from '@/types/liber';

interface IdeasHubProps {
  language: Language;
  soundEnabled: boolean;
}

export function IdeasHub({ language, soundEnabled }: IdeasHubProps) {
  const [filter, setFilter] = useState<'all' | RomanticIdea['type']>('all');
  const [surpriseIdea, setSurpriseIdea] = useState<RomanticIdea | null>(ROMANTIC_IDEAS[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSurpriseMe = () => {
    playSoundEffect('roulette', soundEnabled);
    setIsAnimating(true);
    setTimeout(() => {
      const pool = ROMANTIC_IDEAS.filter((i) => i.id !== surpriseIdea?.id);
      const next = pool[Math.floor(Math.random() * pool.length)] ?? ROMANTIC_IDEAS[0];
      setSurpriseIdea(next);
      setIsAnimating(false);
    }, 260);
  };

  const filtered =
    filter === 'all' ? ROMANTIC_IDEAS : ROMANTIC_IDEAS.filter((item) => item.type === filter);

  const filterLabels: Record<typeof filter, Record<Language, string>> = {
    all: { es: 'Todas', 'pt-BR': 'Todas' },
    surprise: { es: 'Sorpresas', 'pt-BR': 'Surpresas' },
    date: { es: 'Citas Románticas', 'pt-BR': 'Encontros' },
    nonsexual_bonding: { es: 'Conexión sin sexo', 'pt-BR': 'Conexão sem sexo' },
  };

  return (
    <div className="space-y-6">
      {/* SORPRÉNDEME Card */}
      <div className="rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 p-6 text-white shadow-xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'es' ? 'Momento bonito' : 'Momento especial'}
            </span>
            <h2 className="mt-2 text-2xl font-extrabold">
              {language === 'es' ? '¿Sin ideas hoy?' : 'Sem ideias hoje?'}
            </h2>
            <p className="text-sm text-rose-100 mt-1">
              {language === 'es'
                ? 'Toca el botón para recibir una idea tierna, romántica y cero presión.'
                : 'Toque no botão para receber uma ideia fofa, romântica e sem pressão.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="w-full sm:w-auto rounded-2xl bg-white px-6 py-3.5 text-base font-extrabold text-rose-600 shadow-lg hover:scale-[1.03] active:scale-95 transition-transform cursor-pointer"
          >
            {UI_TEXT.surpriseMe[language]}
          </button>
        </div>

        {surpriseIdea && (
          <div
            className={`mt-5 rounded-2xl bg-white/15 backdrop-blur-md p-4 border border-white/25 transition-all duration-300 ${
              isAnimating ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{surpriseIdea.emoji}</span>
              <div>
                <h3 className="font-bold text-lg">{surpriseIdea.title[language]}</h3>
                <p className="text-sm text-rose-50 mt-1 leading-relaxed">
                  {surpriseIdea.description[language]}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'date', 'nonsexual_bonding', 'surprise'] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              playSoundEffect('pop', soundEnabled);
              setFilter(key);
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
              filter === key
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/80 text-rose-900 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            {filterLabels[key][language]}
          </button>
        ))}
      </div>

      {/* Ideas Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((idea) => (
          <div
            key={idea.id}
            className="rounded-2xl bg-white/85 backdrop-blur-md border border-rose-100 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{idea.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-rose-950">{idea.title[language]}</h3>
                  {idea.type === 'nonsexual_bonding' ? (
                    <HeartHandshake className="w-4 h-4 text-purple-500 shrink-0" />
                  ) : (
                    <CalendarHeart className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                </div>
                <p className="text-sm text-rose-900/80 mt-1 leading-relaxed">
                  {idea.description[language]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
