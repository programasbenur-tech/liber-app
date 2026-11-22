'use client';

type SoundKind = 'liber' | 'casi' | 'anti' | 'pop' | 'roulette' | 'message' | 'mystery' | 'insight';

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(freq: number, startOffset: number, duration: number, type: OscillatorType = 'sine', gainPeak = 0.08) {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);

  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startOffset);
  gain.gain.exponentialRampToValueAtTime(gainPeak, ctx.currentTime + startOffset + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startOffset + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startOffset);
  osc.stop(ctx.currentTime + startOffset + duration + 0.02);
}

export function playSoundEffect(kind: SoundKind, enabled: boolean) {
  if (!enabled) return;
  try {
    switch (kind) {
      case 'liber':
        playTone(523.25, 0, 0.14, 'triangle');
        playTone(659.25, 0.09, 0.14, 'triangle');
        playTone(783.99, 0.18, 0.25, 'triangle');
        break;
      case 'casi':
        playTone(440, 0, 0.14, 'sine');
        playTone(554.37, 0.1, 0.2, 'sine');
        break;
      case 'anti':
        playTone(392, 0, 0.16, 'sine', 0.06);
        playTone(329.63, 0.12, 0.24, 'sine', 0.06);
        break;
      case 'roulette':
        playTone(480, 0, 0.06, 'triangle', 0.05);
        playTone(600, 0.07, 0.06, 'triangle', 0.05);
        playTone(720, 0.14, 0.12, 'triangle', 0.06);
        break;
      case 'message':
        playTone(587.33, 0, 0.1, 'sine', 0.06);
        playTone(880, 0.08, 0.18, 'sine', 0.06);
        break;
      case 'mystery':
        playTone(392, 0, 0.16, 'sine', 0.05);
        playTone(493.88, 0.11, 0.18, 'sine', 0.05);
        playTone(587.33, 0.22, 0.28, 'triangle', 0.06);
        break;
      case 'insight':
        playTone(523.25, 0, 0.12, 'triangle', 0.05);
        playTone(783.99, 0.09, 0.2, 'sine', 0.06);
        break;
      case 'pop':
      default:
        playTone(620, 0, 0.08, 'sine', 0.04);
        break;
    }
  } catch {
    // Ignore audio errors if browser blocks autoplay
  }
}
