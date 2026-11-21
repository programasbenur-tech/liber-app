'use client';

const HEARTS = [
  { left: '8%', size: 'text-xl', duration: '15s', delay: '0s', char: '💗' },
  { left: '22%', size: 'text-lg', duration: '18s', delay: '3s', char: '💖' },
  { left: '38%', size: 'text-2xl', duration: '13s', delay: '6s', char: '💕' },
  { left: '55%', size: 'text-lg', duration: '16s', delay: '2s', char: '💘' },
  { left: '72%', size: 'text-xl', duration: '19s', delay: '5s', char: '❤️' },
  { left: '88%', size: 'text-lg', duration: '14s', delay: '8s', char: '💓' },
];

export function FloatingHearts() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {HEARTS.map((h, idx) => (
        <span
          key={idx}
          className={`absolute -bottom-12 select-none animate-float-heart ${h.size}`}
          style={
            {
              left: h.left,
              '--float-duration': h.duration,
              '--float-delay': h.delay,
            } as React.CSSProperties
          }
        >
          {h.char}
        </span>
      ))}
    </div>
  );
}
