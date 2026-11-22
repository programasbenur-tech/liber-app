'use client';

import { useEffect, useState } from 'react';
import { Download, Share2, Copy, Check, ShieldCheck } from 'lucide-react';
import {
  buildViralCardPayload,
  type ViralCardTheme,
} from '@/lib/viralCard';
import { playSoundEffect } from '@/lib/sound';
import type { Language, TrafficState } from '@/types/liber';

interface ViralCardStudioProps {
  language: Language;
  soundEnabled: boolean;
  trafficState: TrafficState;
  flamePoints: number;
  flameStageTitle?: string;
}

const THEME_OPTIONS: Array<{
  id: ViralCardTheme;
  emoji: string;
  labelEs: string;
  labelPt: string;
}> = [
  { id: 'traffic_mood', emoji: '🚦', labelEs: 'Mi Semáforo', labelPt: 'Meu Semáforo' },
  { id: 'flame_team', emoji: '🔥', labelEs: 'Nuestra Llama', labelPt: 'Nossa Chama' },
  { id: 'peace_bridge', emoji: '🕊️', labelEs: 'Modo Equipo', labelPt: 'Modo Time' },
  { id: 'mystery_vibe', emoji: '🌙', labelEs: 'Modo Misterio', labelPt: 'Modo Mistério' },
];

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i += 1) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = words[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

async function renderCardPngBlob(
  payload: ReturnType<typeof buildViralCardPayload>
): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
  grad.addColorStop(0, payload.gradientStops[0]);
  grad.addColorStop(0.5, payload.gradientStops[1]);
  grad.addColorStop(1, payload.gradientStops[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Soft decorative glow circles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.beginPath();
  ctx.arc(220, 340, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
  ctx.beginPath();
  ctx.arc(880, 1520, 310, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';

  // Badge text
  ctx.font = 'bold 34px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(payload.badge, 540, 420);

  // Giant emoji
  ctx.font = '180px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(payload.moodEmoji, 540, 710);

  // Headline
  ctx.font = '800 76px system-ui, -apple-system, sans-serif';
  const afterTitleY = drawWrappedText(ctx, payload.title, 540, 900, 860, 92);

  // Subtitle
  ctx.font = '500 44px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  drawWrappedText(ctx, payload.subtitle, 540, afterTitleY + 48, 840, 64);

  // Footer box
  ctx.font = 'bold 46px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('LIBER ❤️', 540, 1650);

  ctx.font = '500 30px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText(payload.publicUrl.replace(/^https?:\/\//, ''), 540, 1715);
  ctx.fillText(payload.footerTag, 540, 1775);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

export function ViralCardStudio({
  language,
  soundEnabled,
  trafficState,
  flamePoints,
  flameStageTitle,
}: ViralCardStudioProps) {
  const [selectedTheme, setSelectedTheme] =
    useState<ViralCardTheme>('traffic_mood');
  const [originHint, setOriginHint] = useState<string | undefined>(undefined);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOriginHint(window.location.origin);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const payload = buildViralCardPayload({
    language,
    trafficState,
    flamePoints,
    flameStageTitle,
    theme: selectedTheme,
    rawAppUrl: originHint,
  });

  const handleDownloadStoryPng = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const blob = await renderCardPngBlob(payload);
      if (!blob) return;

      const fileName = `liber-story-${payload.theme}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (
        typeof navigator !== 'undefined' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: 'LIBER ❤️',
            text: payload.whatsappText,
          });
          playSoundEffect('liber', soundEnabled);
          return;
        } catch {
          // Fall back cleanly to direct file download if user closes share sheet
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      playSoundEffect('liber', soundEnabled);
    } finally {
      setExporting(false);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(payload.whatsappText);
      playSoundEffect('pop', soundEnabled);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Ignore clipboard denial
    }
  };

  return (
    <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-rose-100 p-5 shadow-md space-y-4">
      <div className="space-y-1">
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 border border-rose-200 px-3 py-0.5 text-[11px] font-extrabold text-rose-800">
          📲{' '}
          {language === 'es'
            ? 'Tarjeta Viral Anónima (WhatsApp / Stories)'
            : 'Cartão Viral Anônimo (WhatsApp / Stories)'}
        </span>
        <h3 className="text-lg font-extrabold text-rose-950">
          {language === 'es'
            ? 'Comparte tu vibra de hoy sin exponer nada privado'
            : 'Compartilhe o clima de hoje sem expor nada privado'}
        </h3>
        <p className="text-xs text-rose-900/75 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          {language === 'es'
            ? '100% anónima: sin nombres reales, sin chats y sin tu código de sala.'
            : '100% anônimo: sem nomes reais, sem chats e sem o código da sala.'}
        </p>
      </div>

      {/* Theme Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {THEME_OPTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              playSoundEffect('pop', soundEnabled);
              setSelectedTheme(item.id);
            }}
            className={`rounded-2xl px-3 py-2 text-xs font-extrabold border transition-all cursor-pointer ${
              selectedTheme === item.id
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-rose-50/70 text-rose-950 border-rose-200 hover:bg-rose-100'
            }`}
          >
            {item.emoji} {language === 'es' ? item.labelEs : item.labelPt}
          </button>
        ))}
      </div>

      {/* Live Preview Card */}
      <div
        className="mx-auto max-w-xs rounded-[2rem] p-6 text-white text-center shadow-xl space-y-4 border border-white/30"
        style={{
          background: `linear-gradient(155deg, ${payload.gradientStops[0]}, ${payload.gradientStops[1]}, ${payload.gradientStops[2]})`,
        }}
      >
        <p className="text-[10px] font-extrabold tracking-widest uppercase text-white/90">
          {payload.badge}
        </p>
        <p className="text-5xl py-1">{payload.moodEmoji}</p>
        <h4 className="text-xl font-extrabold leading-tight">{payload.title}</h4>
        <p className="text-xs text-white/90 leading-relaxed">{payload.subtitle}</p>
        <div className="pt-3 border-t border-white/25 space-y-0.5">
          <p className="text-sm font-extrabold">LIBER ❤️</p>
          <p className="text-[10px] text-white/85">
            {payload.publicUrl.replace(/^https?:\/\//, '')}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={handleDownloadStoryPng}
          disabled={exporting}
          className="rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 py-2.5 px-3 text-xs font-extrabold text-white shadow-sm hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4 shrink-0" />
          {exporting
            ? '...'
            : language === 'es'
            ? 'Descargar PNG (Stories)'
            : 'Baixar PNG (Stories)'}
        </button>

        <a
          href={payload.whatsappShareHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playSoundEffect('pop', soundEnabled)}
          className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-2.5 px-3 text-xs font-extrabold text-white shadow-sm flex items-center justify-center gap-1.5"
        >
          <Share2 className="w-4 h-4 shrink-0" />
          {language === 'es' ? 'Enviar por WhatsApp' : 'Enviar no WhatsApp'}
        </a>

        <button
          type="button"
          onClick={handleCopyText}
          className="rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 py-2.5 px-3 text-xs font-extrabold text-rose-900 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              {language === 'es' ? 'Copiado ✓' : 'Copiado ✓'}
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 shrink-0" />
              {language === 'es' ? 'Copiar texto' : 'Copiar texto'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
