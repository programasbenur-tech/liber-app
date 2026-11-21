import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-5">
      <h1 className="text-2xl font-extrabold text-rose-950">
        Política de Privacidad / Política de Privacidade — LIBER ❤️
      </h1>
      <section className="rounded-3xl bg-white/90 border border-rose-100 p-6 space-y-3 text-sm text-rose-950 leading-relaxed">
        <p>
          <strong>1. Uso exclusivo para adultos (18+):</strong> LIBER está destinado únicamente a personas mayores de 18 años.
        </p>
        <p>
          <strong>2. Privacidad por diseño:</strong> Las respuestas individuales del cuestionario son estrictamente privadas y nunca se muestran a tu pareja ni a administradores sin tu permiso explícito.
        </p>
        <p>
          <strong>3. Sin rastreo ni vigilancia:</strong> No recolectamos ubicación GPS, no realizamos monitoreo oculto de pareja y no inferimos consentimiento sexual a partir de puntajes.
        </p>
        <p>
          <strong>4. Cumplimiento LGPD (Brasil) y Ley 18.331 (Uruguay):</strong> Puedes exportar tus datos en formato JSON o eliminar tu cuenta y todos tus registros en cualquier momento desde la pestaña Privacidad.
        </p>
      </section>
      <Link href="/" className="inline-block text-sm font-bold text-rose-600 hover:underline">
        ← Volver a LIBER ❤️
      </Link>
    </main>
  );
}
