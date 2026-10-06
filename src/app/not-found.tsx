import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-ink pt-24">
      <div className="container-x">
        <p className="eyebrow text-brand">Error 404</p>
        <h1 className="display mt-5 text-[clamp(2.4rem,6vw,5rem)] font-bold text-white">Página no encontrada</h1>
        <Link
          href="/"
          className="mt-10 inline-block bg-brand px-8 py-4 font-display text-sm font-semibold tracking-[0.2em] text-white uppercase hover:bg-brand-600"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
