'use client';

import type { Language } from '@/types/liber';

interface LoveGaugeClockProps {
  /** Current running score from 0 to 100 */
  score: number;
  language: Language;
  /** Optional label below the dial */
  hintLabel?: string;
}

/**
 * Animated semicircular "Love Clock" (Reloj del Amor) whose needle smoothly
 * swings toward ANTI LIBER (left), CASI LIBER (center), or LIBER (right)
 * as each question is answered.
 */
export function LoveGaugeClock({ score, language, hintLabel }: LoveGaugeClockProps) {
  const clamped = Math.max(0, Math.min(100, score));
  // Map 0..100 -> -78deg .. +78deg
  const angle = -78 + (clamped / 100) * 156;

  return (
    <div className="flex flex-col items-center justify-center py-1 select-none">
      <div className="relative w-64 h-36">
        <svg viewBox="0 0 240 135" className="w-full h-full overflow-visible">
          {/* Outer soft glow */}
          <defs>
            <linearGradient id="needleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff4d79" />
              <stop offset="100%" stopColor="#2d1635" />
            </linearGradient>
          </defs>

          {/* Left Arc: ANTI LIBER (0 - 39) */}
          <path
            d="M 28 115 A 92 92 0 0 1 82 32"
            fill="none"
            stroke="#fb7185"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.88"
          />

          {/* Center Arc: CASI LIBER (40 - 69) */}
          <path
            d="M 88 29 A 92 92 0 0 1 152 29"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.92"
          />

          {/* Right Arc: LIBER (70 - 100) */}
          <path
            d="M 158 32 A 92 92 0 0 1 212 115"
            fill="none"
            stroke="#34d399"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.92"
          />

          {/* Zone Emoji Markers */}
          <text x="20" y="95" fontSize="16" textAnchor="middle">
            🔴
          </text>
          <text x="120" y="14" fontSize="16" textAnchor="middle">
            🟡
          </text>
          <text x="220" y="95" fontSize="16" textAnchor="middle">
            🟢
          </text>

          {/* Rotating Needle */}
          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: '120px 115px',
              transition: 'transform 650ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <polygon points="116,115 120,34 124,115" fill="url(#needleGrad)" />
            <circle cx="120" cy="36" r="4" fill="#ff4d79" />
          </g>

          {/* Center Pivot */}
          <circle cx="120" cy="115" r="11" fill="#2d1635" />
          <circle cx="120" cy="115" r="5" fill="#fff5f8" />
        </svg>
      </div>

      <div className="flex items-center justify-between w-60 text-[10px] font-extrabold uppercase tracking-wider -mt-1">
        <span className="text-rose-600">Anti Liber</span>
        <span className="text-amber-600">
          {language === 'pt-BR' ? 'Quase' : 'Casi'}
        </span>
        <span className="text-emerald-600">Liber</span>
      </div>

      {hintLabel && (
        <p className="mt-1.5 text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200 rounded-full px-3 py-0.5">
          {hintLabel}
        </p>
      )}
    </div>
  );
}
