import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-5">
      <h1 className="text-2xl font-extrabold text-rose-950">
        Términos de Servicio / Termos de Uso — LIBER ❤️
      </h1>
      <section className="rounded-3xl bg-white/90 border border-rose-100 p-6 space-y-3 text-sm text-rose-950 leading-relaxed">
        <p>
          <strong>1. Naturaleza del servicio:</strong> LIBER es un juego recreativo de comunicación para parejas adultas (18+). No es terapia psicológica, asesoramiento médico ni un predictor científico.
        </p>
        <p>
          <strong>2. Consentimiento y límites:</strong> Ningún puntaje del juego sustituye el consentimiento explícito, libre y actual entre adultos. Un &quot;No&quot; o &quot;Ahora no&quot; siempre prevalece.
        </p>
        <p>
          <strong>3. Suscripciones (Mercado Pago Brasil y Uruguay):</strong> Cuando los pagos estén habilitados, las suscripciones se procesan de forma segura mediante Mercado Pago (BRL en Brasil, UYU en Uruguay) y el acceso Premium se activa únicamente tras confirmación verificada del servidor.
        </p>
      </section>
      <Link href="/" className="inline-block text-sm font-bold text-rose-600 hover:underline">
        ← Volver a LIBER ❤️
      </Link>
    </main>
  );
}
