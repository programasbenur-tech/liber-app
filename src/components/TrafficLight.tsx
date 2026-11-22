'use client';

import { TRAFFIC_STATE_META } from '@/i18n/translations';
import { Language, TrafficState } from '@/types/liber';

interface TrafficLightProps {
  language: Language;
  activeState: TrafficState;
  onSelectState?: (state: TrafficState) => void;
  compact?: boolean;
}

const ORDER: TrafficState[] = ['ANTI_LIBER', 'CASI_LIBER', 'LIBER'];

export function TrafficLight({
  language,
  activeState,
  onSelectState,
  compact = false,
}: TrafficLightProps) {
  const activeMeta = TRAFFIC_STATE_META[activeState];

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`flex ${
          compact
            ? 'flex-row gap-1.5 sm:gap-2.5 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border-2'
            : 'flex-col gap-3.5 p-4 rounded-[2rem] border-4'
        } bg-[#2d1635] shadow-xl border-rose-200/40 max-w-full`}
        role="group"
        aria-label="Semáforo del Amor"
      >
        {ORDER.map((state) => {
          const isActive = state === activeState;
          const bulbColors: Record<TrafficState, string> = {
            ANTI_LIBER: isActive
              ? 'bg-gradient-to-br from-rose-400 to-pink-600 shadow-[0_0_26px_rgba(244,63,94,0.85)] ring-4 ring-rose-300/60'
              : 'bg-rose-950/60 opacity-45 hover:opacity-75',
            CASI_LIBER: isActive
              ? 'bg-gradient-to-br from-amber-300 to-orange-500 shadow-[0_0_26px_rgba(245,158,11,0.85)] ring-4 ring-amber-200/60'
              : 'bg-amber-950/60 opacity-45 hover:opacity-75',
            LIBER: isActive
              ? 'bg-gradient-to-br from-emerald-300 to-teal-500 shadow-[0_0_26px_rgba(16,185,129,0.85)] ring-4 ring-emerald-200/60'
              : 'bg-emerald-950/60 opacity-45 hover:opacity-75',
          };

          return (
            <button
              key={state}
              type="button"
              onClick={() => onSelectState?.(state)}
              disabled={!onSelectState}
              title={TRAFFIC_STATE_META[state].headline[language]}
              className={`${compact ? 'w-7 h-7 sm:w-10 sm:h-10 text-xs sm:text-base' : 'w-16 h-16 text-2xl'} rounded-full flex items-center justify-center transition-all duration-300 ${
                bulbColors[state]
              } ${isActive && !compact ? 'animate-pulse-glow scale-105' : isActive ? 'scale-105' : ''} ${
                onSelectState ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span className="sr-only">{TRAFFIC_STATE_META[state].headline[language]}</span>
              {isActive ? TRAFFIC_STATE_META[state].emoji : ''}
            </button>
          );
        })}
      </div>

      {!compact && (
        <div
          className={`w-full rounded-2xl border p-4 text-center transition-all ${activeMeta.bgSoftClass}`}
        >
          <p className="text-lg font-extrabold tracking-tight">
            {activeMeta.emoji} {activeMeta.headline[language]}
          </p>
          <p className="mt-1 text-sm opacity-90 leading-relaxed">
            {activeMeta.description[language]}
          </p>
        </div>
      )}
    </div>
  );
}
