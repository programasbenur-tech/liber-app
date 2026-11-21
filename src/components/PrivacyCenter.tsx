'use client';

import Link from 'next/link';
import { Shield, Trash2, Volume2, VolumeX, Globe, Lock, Download } from 'lucide-react';
import { UI_TEXT } from '@/i18n/translations';
import { Language, PrivacySettings } from '@/types/liber';

interface PrivacyCenterProps {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  privacy: PrivacySettings;
  onUpdatePrivacy: (next: PrivacySettings) => void;
  onExportData: () => void;
  onDeleteAllData: () => void;
}

export function PrivacyCenter({
  language,
  onChangeLanguage,
  soundEnabled,
  onToggleSound,
  privacy,
  onUpdatePrivacy,
  onExportData,
  onDeleteAllData,
}: PrivacyCenterProps) {
  const toggleField = (key: keyof PrivacySettings) => {
    onUpdatePrivacy({ ...privacy, [key]: !privacy[key] });
  };

  return (
    <div className="space-y-5">
      {/* Language & Sound */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 p-5 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-rose-950 flex items-center gap-2">
          <Globe className="w-5 h-5 text-rose-500" />
          {language === 'es' ? 'Idioma y Sonido' : 'Idioma e Som'}
        </h2>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-rose-950">
            {language === 'es' ? 'Idioma de la app' : 'Idioma do aplicativo'}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChangeLanguage('es')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold border cursor-pointer ${
                language === 'es'
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-white text-rose-900 border-rose-200'
              }`}
            >
              🇪🇸 Español
            </button>
            <button
              type="button"
              onClick={() => onChangeLanguage('pt-BR')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold border cursor-pointer ${
                language === 'pt-BR'
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-white text-rose-900 border-rose-200'
              }`}
            >
              🇧🇷 Português
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-rose-100">
          <span className="text-sm font-semibold text-rose-950 flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-rose-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-rose-400" />
            )}
            {language === 'es' ? 'Efectos de sonido divertidos' : 'Efeitos sonoros divertidos'}
          </span>
          <button
            type="button"
            onClick={onToggleSound}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              soundEnabled ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {soundEnabled
              ? language === 'es'
                ? 'Activado'
                : 'Ativado'
              : language === 'es'
              ? 'Silenciado'
              : 'Silenciado'}
          </button>
        </div>
      </div>

      {/* Sharing Controls */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 p-5 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-rose-950 flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-500" />
          {language === 'es' ? '¿Qué compartes con tu pareja?' : 'O que você compartilha com seu par?'}
        </h2>
        <p className="text-xs text-rose-800/80">
          {language === 'es'
            ? 'Tus respuestas individuales del cuestionario son SIEMPRE privadas. Solo se compara lo que autorices aquí.'
            : 'Suas respostas individuais do questionário são SEMPRE privadas. Só é comparado o que você autorizar aqui.'}
        </p>

        {[
          {
            key: 'shareMoodState' as const,
            es: 'Compartir mi estado del Semáforo (Verde / Amarillo / Rojo)',
            pt: 'Compartilhar meu estado do Semáforo (Verde / Amarelo / Vermelho)',
          },
          {
            key: 'shareAffectionPrefs' as const,
            es: 'Compartir mis preferencias de cariño (abrazos, masajes, pelis)',
            pt: 'Compartilhar minhas preferências de carinho (abraços, massagem, filme)',
          },
          {
            key: 'shareEnergyLevel' as const,
            es: 'Compartir mi nivel de energía general',
            pt: 'Compartilhar meu nível de energia geral',
          },
          {
            key: 'historyOptInSelf' as const,
            es: 'Autorizar historial privado de pareja (requiere aceptación mutua)',
            pt: 'Autorizar histórico privado do casal (requer aceite mútuo)',
          },
        ].map((item) => (
          <label
            key={item.key}
            className="flex items-center justify-between gap-3 py-2 border-t border-rose-100 cursor-pointer"
          >
            <span className="text-sm font-medium text-rose-950">
              {language === 'es' ? item.es : item.pt}
            </span>
            <input
              type="checkbox"
              checked={privacy[item.key]}
              onChange={() => toggleField(item.key)}
              className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
            />
          </label>
        ))}
      </div>

      {/* Safety Commitments & Data Deletion */}
      <div className="rounded-3xl bg-purple-50/80 border border-purple-200 p-5 space-y-3">
        <h3 className="font-bold text-purple-950 flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-purple-600" />
          {language === 'es' ? 'Compromisos de Privacidad y Seguridad' : 'Compromissos de Privacidade e Segurança'}
        </h3>
        <ul className="text-xs text-purple-900/90 space-y-1.5 list-disc pl-4">
          <li>
            {language === 'es'
              ? 'Cero rastreo de ubicación, cero vigilancia y cero predicción de consentimiento.'
              : 'Zero rastreamento de localização, zero vigilância e zero previsão de consentimento.'}
          </li>
          <li>
            {language === 'es'
              ? 'LIBER nunca presiona ni sugiere insistir cuando tu pareja está en Anti Liber o Casi Liber.'
              : 'LIBER nunca pressiona nem sugere insistir quando seu par está em Anti Liber ou Quase Liber.'}
          </li>
        </ul>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={onExportData}
            className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {language === 'es' ? 'Exportar mis datos (JSON)' : 'Exportar meus dados (JSON)'}
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm(UI_TEXT.deleteConfirm[language])) {
                onDeleteAllData();
              }
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            {UI_TEXT.deleteAllData[language]}
          </button>
        </div>

        <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-purple-700">
          <Link href="/privacy" className="hover:underline">
            {language === 'es' ? 'Política de Privacidad' : 'Política de Privacidade'}
          </Link>
          <Link href="/terms" className="hover:underline">
            {language === 'es' ? 'Términos de Servicio' : 'Termos de Uso'}
          </Link>
          <Link href="/admin" className="hover:underline">
            Admin (/admin)
          </Link>
        </div>
      </div>
    </div>
  );
}
