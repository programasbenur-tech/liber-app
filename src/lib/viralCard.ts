import type { Language, TrafficState } from '../types/liber.ts';

export type ViralCardTheme =
  | 'traffic_mood'
  | 'flame_team'
  | 'peace_bridge'
  | 'mystery_vibe';

export interface ViralCardPayload {
  theme: ViralCardTheme;
  badge: string;
  moodEmoji: string;
  title: string;
  subtitle: string;
  footerTag: string;
  publicUrl: string;
  whatsappText: string;
  whatsappShareHref: string;
  gradientStops: [string, string, string];
}

export const DEFAULT_PUBLIC_APP_URL = 'https://liber-app.programasbenur.workers.dev';

/**
 * Strips private room codes, query params, and local network addresses so
 * viral share cards NEVER leak personal couple room codes or private host IPs.
 */
export function sanitizePublicShareUrl(rawUrl?: string): string {
  if (!rawUrl || !rawUrl.trim()) {
    return DEFAULT_PUBLIC_APP_URL;
  }

  try {
    const trimmed = rawUrl.trim();
    const withProtocol =
      trimmed.startsWith('http://') || trimmed.startsWith('https://')
        ? trimmed
        : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    const host = parsed.hostname.toLowerCase();

    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    ) {
      return DEFAULT_PUBLIC_APP_URL;
    }

    return parsed.origin;
  } catch {
    return DEFAULT_PUBLIC_APP_URL;
  }
}

export function buildViralCardPayload(params: {
  language: Language;
  trafficState: TrafficState;
  flamePoints: number;
  flameStageTitle?: string;
  theme: ViralCardTheme;
  rawAppUrl?: string;
}): ViralCardPayload {
  const { language, trafficState, flamePoints, flameStageTitle, theme, rawAppUrl } =
    params;
  const publicUrl = sanitizePublicShareUrl(rawAppUrl);

  let badge =
    language === 'es' ? 'SEMÁFORO LIBER ❤️ DE HOY' : 'SEMÁFORO LIBER ❤️ DE HOJE';
  let moodEmoji = '✨';
  let title = '';
  let subtitle = '';
  let gradientStops: [string, string, string] = ['#f43f5e', '#ec4899', '#9333ea'];

  if (theme === 'traffic_mood') {
    if (trafficState === 'LIBER') {
      moodEmoji = '🔥✨';
      title =
        language === 'es' ? 'Modo Chispa Encendida' : 'Modo Faísca Acesa';
      subtitle =
        language === 'es'
          ? 'Hoy tocó tiempo juntos, mimos y cero prisas.'
          : 'Hoje teve tempo juntos, carinho e zero pressa.';
      gradientStops = ['#f43f5e', '#e11d48', '#9333ea'];
    } else if (trafficState === 'CASI_LIBER') {
      moodEmoji = '💛🤗';
      title =
        language === 'es'
          ? 'Modo Mimos y Paciencia'
          : 'Modo Carinho e Paciência';
      subtitle =
        language === 'es'
          ? 'Vamos paso a paso con escucha real y abrazos largos.'
          : 'Vamos passo a passo com escuta real e abraços longos.';
      gradientStops = ['#f59e0b', '#f43f5e', '#db2777'];
    } else {
      moodEmoji = '🐻🌙';
      title =
        language === 'es'
          ? 'Modo Ositos Dormilones'
          : 'Modo Ursinhos Sonolentos';
      subtitle =
        language === 'es'
          ? 'Hoy recargamos energía en paz: peli, descanso y respeto.'
          : 'Hoje recarregamos a energia em paz: filme, descanso e respeito.';
      gradientStops = ['#4f46e5', '#7c3aed', '#ec4899'];
    }
  } else if (theme === 'flame_team') {
    badge = language === 'es' ? 'NUESTRA LLAMA LIBER' : 'CHAMA DE VOCÊS LIBER';
    moodEmoji = '🔥🤝';
    title =
      flameStageTitle ||
      (language === 'es' ? 'Nuestro Equipo LIBER' : 'Nosso Time LIBER');
    subtitle =
      language === 'es'
        ? `${flamePoints} puntos de cariño, escucha y cero rachas tóxicas.`
        : `${flamePoints} pontos de carinho, escuta e zero pressão.`;
    gradientStops = ['#ea580c', '#e11d48', '#9333ea'];
  } else if (theme === 'peace_bridge') {
    badge = language === 'es' ? 'PUENTE DE PAZ' : 'PONTE DE PAZ';
    moodEmoji = '🕊️💛';
    title =
      language === 'es'
        ? 'Elegimos hablar en Modo Equipo'
        : 'Escolhemos falar em Modo Time';
    subtitle =
      language === 'es'
        ? 'En lugar de pelear, bajamos la guardia y nos escuchamos 10 minutos.'
        : 'Em vez de brigar, baixamos a guarda e nos ouvimos por 10 minutos.';
    gradientStops = ['#0284c7', '#4f46e5', '#9333ea'];
  } else {
    badge = language === 'es' ? 'MODO MISTERIO LIBER' : 'MODO MISTÉRIO LIBER';
    moodEmoji = '🌙✨';
    title =
      language === 'es'
        ? 'Jugando en Modo Misterio'
        : 'Jogando no Modo Mistério';
    subtitle =
      language === 'es'
        ? 'Pistas sutiles, complicidad y cero presión para reconectar.'
        : 'Pistas sutis, cumplicidade e zero pressão para reconectar.';
    gradientStops = ['#311042', '#7e22ce', '#e11d48'];
  }

  const footerTag =
    language === 'es'
      ? '100% privada para parejas · sin chats ni datos expuestos'
      : '100% privada para casais · sem chats nem dados expostos';

  const whatsappText =
    language === 'es'
      ? `${moodEmoji} *${title}*\n${subtitle}\n\nPrueba LIBER ❤️ con tu pareja: ${publicUrl}`
      : `${moodEmoji} *${title}*\n${subtitle}\n\nTeste o LIBER ❤️ com seu par: ${publicUrl}`;

  const whatsappShareHref = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  return {
    theme,
    badge,
    moodEmoji,
    title,
    subtitle,
    footerTag,
    publicUrl,
    whatsappText,
    whatsappShareHref,
    gradientStops,
  };
}
