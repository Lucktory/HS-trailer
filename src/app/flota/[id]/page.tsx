import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FloorPlan } from "@/components/floor-plan";
import { Gallery } from "@/components/gallery";
import { Icon, WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/motion";
import { CatalogCard, SectionHeading } from "@/components/ui";
import { LENGTH, WIDTH, catalog, catalogId, documentation, getVariant, spaceOf, units } from "@/lib/fleet";
import { coverFor, galleryOf } from "@/lib/images";
import { baseOpenGraph, whatsappLink } from "@/lib/site";

// Una ficha por modelo (tipo + medida): /flota/vivienda-12m, /flota/comedor-6m…
export function generateStaticParams() {
  return catalog.map((c) => ({ id: c.id }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/flota/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const found = getVariant(id);
  if (!found) return {};
  const { unit, variant } = found;
  return {
    title: `${unit.name} ${variant.size}`,
    description: `${unit.name} ${variant.size} (${variant.capacity}). ${variant.tagline}`,
    alternates: { canonical: `/flota/${id}` },
    openGraph: { ...baseOpenGraph, url: `/flota/${id}`, images: [{ url: coverFor(unit.slug, variant.size) }] },
  };
}

export default async function ModelPage(props: PageProps<"/flota/[id]">) {
  const { id } = await props.params;
  const found = getVariant(id);
  if (!found) notFound();
  const { unit, variant } = found;

  const gallery = galleryOf(unit.slug);
  // La versión de 6 m usa su propia portada si existe (portada-6m.jpg); la de 12 m, la primera foto de la galería.
  const heroImage = variant.size === "12 m" && gallery[0] ? gallery[0] : coverFor(unit.slug, variant.size);
  const included = unit.spaces.filter((s) => spaceOf(s).kind === "space");
  const quoteMsg = `Hola HS Trailers, quisiera consultar disponibilidad del ${unit.name} ${variant.size}.`;
  // Otros tipos, rotando desde el siguiente al actual (cada ficha sugiere algo distinto); misma medida primero.
  const i = units.indexOf(unit);
  const ring = [...units.slice(i + 1), ...units.slice(0, i)];
  const others = ring
    .map((u) => catalog.find((c) => c.slug === u.slug && c.size === variant.size) ?? catalog.find((c) => c.slug === u.slug)!)
    .sort((a, b) => Number(a.size !== variant.size) - Number(b.size !== variant.size))
    .slice(0, 3);

  return (
    <>
      {/* Hero (oscuro, con foto) */}
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-ink">
        <Image src={heroImage} alt={`${unit.name} ${variant.size}`} fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/0" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/50" />
        <div className="container-x w-full pt-32 pb-16 md:pb-20">
          <Link href="/#flota" className="eyebrow inline-flex items-center gap-3 text-white/70 hover:text-white">
            <Icon name="arrowLeft" className="size-4 text-brand" />
            Volver a equipos
          </Link>
          <Reveal>
            <h1 className="display mt-8 text-[clamp(2.6rem,7vw,6.25rem)] font-bold text-white">
              {unit.name}
              <span className="block text-white/90">{variant.size}</span>
            </h1>
            <span className="mt-6 block h-1 w-16 bg-brand" />
            <p className="mt-6 max-w-md text-lg text-white/75">{variant.tagline}</p>

            {included.length > 1 && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Incluye">
                {included.map((s) => {
                  const sp = spaceOf(s);
                  return (
                    <li key={s} className="flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white/85 backdrop-blur-sm">
                      <Icon name={sp.icon} className="size-4" />
                      {sp.label}
                    </li>
                  );
                })}
              </ul>
            )}

            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {[
                ["Largo", LENGTH[variant.size]],
                ["Ancho", WIDTH],
                ["Capacidad", variant.capacity],
              ].map(([k, v]) => (
                <div key={k} className="border-l border-white/20 pl-4">
                  <dt className="eyebrow text-[0.65rem] text-white/50">{k}</dt>
                  <dd className="tabular mt-1 font-display text-xl text-white">{v}</dd>
                </div>
              ))}
            </dl>

            {/* Cambio de medida entre las variantes del mismo tipo */}
            {unit.variants.length > 1 && (
              <nav aria-label="Medida" className="mt-10 inline-flex border border-white/20 bg-white/5 p-1 backdrop-blur-sm">
                {unit.variants.map((v) => {
                  const active = v.size === variant.size;
                  return (
                    <Link
                      key={v.size}
                      href={`/flota/${catalogId(unit.slug, v.size)}`}
                      scroll={false}
                      aria-current={active ? "page" : undefined}
                      className={`tabular px-5 py-2 text-sm font-medium transition-colors ${active ? "bg-white text-ink" : "text-white/75 hover:text-white"}`}
                    >
                      {v.size}
                    </Link>
                  );
                })}
              </nav>
            )}
          </Reveal>
        </div>
      </section>

      {/* Galería: aparece sola con 2 o más imágenes galeria-N en la carpeta del equipo */}
      {gallery.length > 1 && (
        <section className="border-b border-ink/10 bg-white py-16">
          <div className="container-x">
            <Gallery images={gallery} alt={unit.name} />
          </div>
        </section>
      )}

      {/* Plano */}
      <section className="blueprint-grid-light bg-white py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Plano y distribución" title="Distribución optimizada" intro="Pasá el cursor o tocá cada ambiente para ver su equipamiento." />
          <Reveal className="mt-14">
            <FloorPlan key={id} plan={variant.plan} tone="light" />
          </Reveal>
        </div>
      </section>

      {/* Especificaciones + cotización */}
      <section className="border-t border-ink/10 py-24 md:py-32">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div>
            <SectionHeading eyebrow="Especificaciones" title="Todo lo que necesitás para operar" />
            <p className="mt-6 max-w-xl border-l-2 border-brand pl-4 text-ink/65">
              Equipamiento de referencia: puede variar según la unidad. Lo confirmamos al cotizar.
            </p>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {variant.specs.map((g, i) => (
                <Reveal key={g.title} delay={(i % 2) * 0.08} className="border border-ink/[0.07] bg-white p-7 md:p-8">
                  <div className="flex items-center gap-5">
                    <span className="relative grid size-14 shrink-0 place-items-center bg-gradient-to-br from-navy to-navy-900 text-white shadow-[0_10px_24px_-10px_rgb(15_31_56/0.7)]">
                      <span className="absolute -top-px -left-px size-2.5 border-t-2 border-l-2 border-brand" />
                      <span className="absolute -right-px -bottom-px size-2.5 border-r-2 border-b-2 border-brand" />
                      <Icon name={g.icon} weight="duotone" className="size-7" />
                    </span>
                    <h3 className="display text-2xl font-semibold text-ink">{g.title}</h3>
                  </div>
                  <ul className="mt-6 space-y-2.5 text-ink/70">
                    {g.items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <span className="mt-[0.6rem] size-1 shrink-0 bg-brand" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>

          <aside className="lg:pt-40">
            <div className="sticky top-28 bg-gradient-to-b from-navy-900 to-ink p-8 text-white shadow-[0_30px_60px_-30px_rgb(11_18_32/0.6)]">
              <span className="block h-0.5 w-10 bg-brand" />
              <h2 className="display mt-6 text-4xl font-bold">¿Necesitás este modelo?</h2>
              <p className="mt-4 text-white/70">Nuestro equipo te asesora y arma la mejor solución para tu proyecto.</p>
              <a
                href={whatsappLink(quoteMsg)}
                target="_blank"
                rel="noopener"
                className="mt-8 flex items-center justify-center gap-3 bg-brand px-6 py-4 font-display text-sm font-semibold tracking-[0.18em] uppercase transition-colors hover:bg-brand-600"
              >
                <WhatsAppIcon className="size-5" />
                Consultar disponibilidad
              </a>
              <Link
                href={`/?modulo=${id}#contacto`}
                className="mt-3 flex items-center justify-center border border-white/30 px-6 py-4 font-display text-sm font-semibold tracking-[0.18em] uppercase transition-colors hover:border-white"
              >
                Pedir cotización
              </Link>
              <ul className="mt-8 space-y-4 border-t border-white/10 pt-8 text-sm text-white/70">
                <li className="flex items-center gap-3">
                  <Icon name="support" className="size-5 text-white/80" /> Asesoramiento personalizado
                </li>
                {variant.specs.includes(documentation) && (
                  <li className="flex items-center gap-3">
                    <Icon name="shield" className="size-5 text-white/80" /> Documentación técnica firmada
                  </li>
                )}
                <li className="flex items-center gap-3">
                  <Icon name="wrench" className="size-5 text-white/80" /> Mantenimiento durante la operación
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Otros modelos */}
      <section className="border-t border-ink/10 bg-paper py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Equipos" title="Otros modelos" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <CatalogCard key={o.id} item={o} image={coverFor(o.slug, o.size)} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
