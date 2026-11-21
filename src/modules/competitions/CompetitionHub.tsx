'use client';

import { useState } from 'react';
import { Trophy, Lock, CheckCircle2 } from 'lucide-react';
import type { Language } from '@/types/liber';

export function isCompetitionModeEnabled(flagOverride?: boolean): boolean {
  if (typeof flagOverride === 'boolean') return flagOverride;
  return process.env.NEXT_PUBLIC_ENABLE_COUPLE_COMPETITIONS === 'true';
}

interface CompetitionHubProps {
  language: Language;
  enabled: boolean;
}

export function CompetitionHub({ language, enabled }: CompetitionHubProps) {
  const [optInSelf, setOptInSelf] = useState(false);
  const [optInPartner, setOptInPartner] = useState(false);
  const [teamName, setTeamName] = useState('Equipo Cupido 💘');

  if (!enabled) {
    return (
      <div className="rounded-3xl bg-white/85 border border-purple-200 p-5 text-center space-y-2">
        <Lock className="w-6 h-6 text-purple-500 mx-auto" />
        <h3 className="font-bold text-purple-950 text-sm">
          {language === 'es'
            ? 'Modo Competencias desactivado por defecto'
            : 'Modo Competições desativado por padrão'}
        </h3>
        <p className="text-xs text-purple-800/80">
          {language === 'es'
            ? 'Feature flag ENABLE_COUPLE_COMPETITIONS=false. Puede activarse desde /admin en el futuro.'
            : 'Feature flag ENABLE_COUPLE_COMPETITIONS=false. Pode ser ativado em /admin no futuro.'}
        </p>
      </div>
    );
  }

  const bothOptedIn = optInSelf && optInPartner;

  return (
    <div className="rounded-3xl bg-white/90 border border-amber-200 p-6 shadow-md space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-amber-950 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          {language === 'es' ? 'Competencias Amistosas' : 'Competições Amigáveis'}
        </h2>
        <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold">
          Beta
        </span>
      </div>

      <p className="text-xs text-amber-900/85 leading-relaxed">
        {language === 'es'
          ? 'Los puntos reflejan únicamente trivias románticas y retos cooperativos, jamás preferencias íntimas ni respuestas privadas.'
          : 'Os pontos refletem apenas quizzes românticos e desafios cooperativos, nunca preferências íntimas ou respostas privadas.'}
      </p>

      <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 space-y-3">
        <label className="flex items-center justify-between text-xs font-bold text-amber-950 cursor-pointer">
          <span>{language === 'es' ? 'Mi aceptación voluntaria' : 'Meu aceite voluntário'}</span>
          <input
            type="checkbox"
            checked={optInSelf}
            onChange={() => setOptInSelf(!optInSelf)}
            className="w-4 h-4 accent-amber-500"
          />
        </label>
        <label className="flex items-center justify-between text-xs font-bold text-amber-950 cursor-pointer">
          <span>
            {language === 'es' ? 'Aceptación de mi pareja' : 'Aceite do meu par'}
          </span>
          <input
            type="checkbox"
            checked={optInPartner}
            onChange={() => setOptInPartner(!optInPartner)}
            className="w-4 h-4 accent-amber-500"
          />
        </label>
      </div>

      {bothOptedIn && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-amber-900">
              {language === 'es' ? 'Nombre del equipo' : 'Nome do time'}
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-amber-200 px-3 py-2 text-sm font-bold text-amber-950"
            />
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 p-4 space-y-2">
            <div className="flex items-center justify-between text-sm font-extrabold text-amber-950">
              <span>1. {teamName}</span>
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" /> 120 pts
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-amber-900/80">
              <span>2. Ositos Felices 🐻</span>
              <span>95 pts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
