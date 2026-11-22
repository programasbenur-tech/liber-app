'use client';

import type { Language } from '@/types/liber';

interface LoveGaugeClockProps {
  /** Current running score from 0 to 100 */
  score: number;
  language: Language;
  /** Optional label below the dial */
  hintLabel?: string;
  /** Visual variant: classic (light blush) or mystery (velvet night) */
  variant?: 'classic' | 'mystery';
}

/**
 * Animated semicircular "Love Clock" (Reloj del Amor) whose needle smoothly
 * swings toward ANTI LIBER (left), CASI LIBER (center), or LIBER (right)
 * as each question is answered.
 */
export function LoveGaugeClock({
  score,
  language,
  hintLabel,
  variant = 'classic',
}: LoveGaugeClockProps) {
  const clamped = Math.max(0, Math.min(100, score));
  // Map 0..100 -> -78deg .. +78deg
  const angle = -78 + (clamped / 100) * 156;
  const isMystery = variant === 'mystery';

  return (
    <div className="flex flex-col items-center justify-center py-1 select-none">
      <div className="relative w-64 h-36">
        <svg viewBox="0 0 240 135" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={isMystery ? 'needleMystery' : 'needleGrad'} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isMystery ? '#f472b6' : '#ff4d79'} />
              <stop offset="100%" stopColor={isMystery ? '#a855f7' : '#2d1635'} />
            </linearGradient>
          </defs>

          {/* Left Arc */}
          <path
            d="M 28 115 A 92 92 0 0 1 82 32"
            fill="none"
            stroke={isMystery ? '#a855f7' : '#fb7185'}
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.88"
          />

          {/* Center Arc */}
          <path
            d="M 88 29 A 92 92 0 0 1 152 29"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.92"
          />

          {/* Right Arc */}
          <path
            d="M 158 32 A 92 92 0 0 1 212 115"
            fill="none"
            stroke={isMystery ? '#ec4899' : '#34d399'}
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.92"
          />

          {/* Zone Emoji Markers */}
          <text x="20" y="95" fontSize="16" textAnchor="middle">
            {isMystery ? '🌙' : '🔴'}
          </text>
          <text x="120" y="14" fontSize="16" textAnchor="middle">
            {isMystery ? '✨' : '🟡'}
          </text>
          <text x="220" y="95" fontSize="16" textAnchor="middle">
            {isMystery ? '🔥' : '🟢'}
          </text>

          {/* Rotating Needle */}
          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: '120px 115px',
              transition: 'transform 650ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <polygon
              points="116,115 120,34 124,115"
              fill={isMystery ? 'url(#needleMystery)' : 'url(#needleGrad)'}
            />
            <circle cx="120" cy="36" r="4" fill={isMystery ? '#f9a8d4' : '#ff4d79'} />
          </g>

          {/* Center Pivot */}
          <circle cx="120" cy="115" r="11" fill={isMystery ? '#fdf2f8' : '#2d1635'} />
          <circle cx="120" cy="115" r="5" fill={isMystery ? '#2b1238' : '#fff5f8'} />
        </svg>
      </div>

      {isMystery ? (
        <div className="flex items-center justify-between w-60 text-[10px] font-extrabold uppercase tracking-wider -mt-1">
          <span className="text-purple-200">Calma</span>
          <span className="text-amber-300">
            {language === 'pt-BR' ? 'Suspense' : 'Suspenso'}
          </span>
          <span className="text-pink-300">
            {language === 'pt-BR' ? 'Faísca' : 'Chispa'}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between w-60 text-[10px] font-extrabold uppercase tracking-wider -mt-1">
          <span className="text-rose-600">Anti Liber</span>
          <span className="text-amber-600">
            {language === 'pt-BR' ? 'Quase' : 'Casi'}
          </span>
          <span className="text-emerald-600">Liber</span>
        </div>
      )}

      {hintLabel && (
        <p
          className={`mt-1.5 text-xs font-bold rounded-full px-3 py-0.5 border ${
            isMystery
              ? 'text-rose-50 bg-white/15 border-white/25'
              : 'text-purple-900 bg-purple-50 border-purple-200'
          }`}
        >
          {hintLabel}
        </p>
      )}
    </div>
  );
}
