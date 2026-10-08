import Image from "next/image";
import Link from "next/link";
import { catalog, catalogId, documentation, generators, units } from "@/lib/fleet";
import { coverFor, versioned } from "@/lib/images";
import { site, whatsappLink } from "@/lib/site";
import { CountUp } from "./count-up";
import { FleetGrid } from "./fleet-grid";
import { FloorPlan } from "./floor-plan";
import { Icon, WhatsAppIcon, type IconName } from "./icons";
import { Reveal, ZoomIn } from "./motion";
import { QuoteForm } from "./quote-form";
import { IconTile, SectionHeading } from "./ui";

type Item = { icon: IconName; title: string; text: string };

/* ---------- Ficha técnica flotante (debajo del hero) ---------- */
// Cifras reales del catálogo: se calculan desde los datos, así se actualizan solas si cambia la flota.

type Stat = { icon: IconName; value: number; label: string; text: string };

function stats(): Stat[] {
  const comedor = catalog.find((c) => c.id === catalogId("comedor", "12 m"));
  return [
    { icon: "layers", value: catalog.length, label: "Modelos", text: `${units.length} tipos de unidad, en 12 m y 6 m.` },
    { icon: "utensils", value: parseInt(comedor?.capacity ?? "25", 10), label: "Personas por comedor", text: "Tráiler Comedor 12 m, con sector de cocina." },
    { icon: "snowflake", value: 3500, label: "Frigorías por equipo", text: "Aire acondicionado en dormitorios, comedores y oficinas." },
    { icon: "shield", value: documentation.items.length, label: "Documentos firmados", text: "Cálculo de vuelco, plano unifilar y carga de fuego." },
  ];
}

export function Highlights() {
  return (
    <div id="intro" className="relative z-10 -mt-16 scroll-mt-28 md:-mt-24">
      <div className="container-x">
        <Reveal>
          <ul className="grid grid-cols-2 gap-px overflow-hidden border border-ink/[0.06] bg-[rgb(234_235_237)] shadow-[0_40px_80px_-40px_rgb(11_18_32/0.45)] lg:grid-cols-4">
            {stats().map((s, i) => (
              <li key={s.label} className="group relative isolate overflow-hidden bg-white p-5 sm:p-7 lg:p-8">
                {/* Ícono grande de fondo, centrado (marca de agua); al pasar el mouse crece y se tiñe de rojo */}
                <Icon
                  name={s.icon}
                  weight="thin"
                  className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-28 -translate-x-1/2 -translate-y-1/2 text-ink/[0.06] transition-[scale,color] duration-700 ease-premium group-hover:scale-110 group-hover:text-brand/[0.1] sm:size-40 lg:size-44"
                />
                <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-700 ease-premium group-hover:scale-x-100" />
                <span className="tabular flex items-center gap-2.5 font-display text-xs tracking-[0.2em] text-ink/40">
                  <span className="h-px w-6 bg-brand" />
                  0{i + 1}
                </span>
                <p className="display tabular mt-6 text-[clamp(1.9rem,8vw,3.25rem)] font-semibold text-ink lg:text-[clamp(2.5rem,4vw,4rem)]">
                  <CountUp value={s.value} />
                </p>
                <p className="eyebrow mt-3 text-[0.68rem] text-ink/70">{s.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/55">{s.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}

/* ---------- Equipos ---------- */

export function Fleet() {
  return (
    <section id="flota" className="scroll-mt-20 py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
          <SectionHeading eyebrow="Nuestros equipos" title="Unidades listas para trabajar" />
          <Reveal className="max-w-md">
            <p className="text-lg leading-relaxed text-ink/60">
              Trailers equipados para brindar comodidad y eficiencia en campamentos, obras y proyectos industriales.
            </p>
          </Reveal>
        </div>
        <FleetGrid items={catalog.map((item) => ({ item, image: coverFor(item.slug, item.size) }))} />

        {/* Generadores: no son contenedores, van aparte de los 12 modelos */}
        <Reveal className="mt-5">
          <a
            href={whatsappLink(`Hola HS Trailers, quisiera consultar por ${generators.name}.`)}
            target="_blank"
            rel="noopener"
            className="group grid overflow-hidden border border-ink/[0.07] bg-white transition-shadow duration-500 hover:shadow-[0_24px_48px_-20px_rgb(11_18_32/0.25)] sm:grid-cols-[18rem_1fr]"
          >
            <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto">
              <Image
                src={coverFor(generators.slug)}
                alt={generators.name}
                fill
                sizes="(min-width: 640px) 18rem, 100vw"
                className="object-cover transition-transform duration-[1.4s] ease-premium group-hover:scale-105"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-6 p-6 md:px-10">
              <div className="flex items-center gap-5">
                <Icon name="generator" className="size-10 shrink-0 text-ink" />
                <div>
                  <h3 className="display text-[1.4rem] font-semibold text-ink">{generators.name}</h3>
                  <p className="mt-1 text-ink/65">{generators.summary} Disponibles en alquiler.</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 font-display text-sm font-semibold tracking-[0.18em] text-brand uppercase">
                Consultar
                <Icon name="arrow" className="size-4 transition-transform duration-500 ease-premium group-hover:translate-x-1" />
              </span>
            </div>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Equipamiento (texto del cliente) ---------- */

// Lo que traen los trailers en general, según Alejandro. La cocina depende del módulo (el pañol no tiene).
const equipment: Item[] = [
  { icon: "snowflake", title: "Aire acondicionado frío/calor", text: "Confort en los ambientes durante todo el año." },
  { icon: "heat", title: "Calefactores eléctricos", text: "Calefacción adicional para el invierno patagónico." },
  { icon: "window", title: "Máxima aislación térmica", text: "Aberturas herméticas con DVH (doble vidriado hermético) y pisos de excelente calidad." },
  { icon: "bolt", title: "Instalación eléctrica reglamentaria", text: "Con plano unifilar firmado por matriculado." },
  { icon: "drop", title: "Agua fría y caliente", text: "Sistema de agua con recirculación." },
  { icon: "oven", title: "Cocina equipada", text: "Heladera, microondas, anafe y horno eléctricos, según el módulo." },
];

export function Equipment() {
  return (
    <section id="equipamiento" className="scroll-mt-20 bg-white py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
          <SectionHeading eyebrow="Equipamiento" title="Preparados para el clima más exigente" />
          <Reveal className="max-w-md">
            <p className="text-lg leading-relaxed text-ink/60">
              Trailers adaptados a las necesidades de la industria, con climatización, aislación y servicios listos para operar.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* Foto real de un interior; en escritorio acompaña el alto de la lista */}
          <div className="relative aspect-[4/3] overflow-hidden bg-ink lg:aspect-auto">
            <ZoomIn className="absolute inset-0">
              <Image
                src={versioned("/img/secciones/equipamiento.jpg")}
                alt="Interior de un tráiler HS con aire acondicionado, aberturas con DVH y piso de madera"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </ZoomIn>
            <span className="absolute top-0 left-0 size-5 border-t-2 border-l-2 border-brand" />
            <span className="absolute right-0 bottom-0 size-5 border-r-2 border-b-2 border-brand" />
          </div>
          <ul className="border-t border-ink/10">
            {equipment.map((e, i) => (
              <Reveal as="li" key={e.title} delay={i * 0.05} className="flex items-center gap-6 border-b border-ink/10 py-6">
                <IconTile name={e.icon} />
                <div className="min-w-0 flex-1">
                  <p className="display text-lg font-semibold text-ink md:text-xl">{e.title}</p>
                  <p className="mt-1 text-ink/60">{e.text}</p>
                </div>
                <span className="tabular hidden font-display text-xs font-semibold tracking-[0.2em] text-ink/30 sm:block">0{i + 1}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Servicio integral (banda navy) ---------- */

// Los tres servicios del catálogo del cliente
const services: Omit<Item, "text">[] = [
  { icon: "home", title: "Alquiler de trailers y generadores" },
  { icon: "ruler", title: "Construcción de trailers a medida" },
  { icon: "wrench", title: "Mantenimiento de trailers y generadores" },
];

export function IntegralService() {
  return (
    <section id="servicios" className="relative isolate scroll-mt-20 overflow-hidden bg-navy-900">
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-[44%] [clip-path:polygon(20%_0,100%_0,100%_100%,0_100%)] lg:block">
        <ZoomIn className="absolute inset-0">
          <Image src={versioned("/img/secciones/servicio.jpg")} alt="" fill sizes="44vw" className="object-cover" />
        </ZoomIn>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/50 to-transparent" />
      </div>

      <div className="container-x py-24 md:py-28">
        <div className="grid gap-12 lg:w-[64%] lg:grid-cols-[1fr_1.25fr] lg:items-center">
          <SectionHeading
            tone="dark"
            size="md"
            eyebrow="Nuestro servicio"
            title="Más que un alquiler, una solución integral"
            intro="Nos encargamos de que cada proyecto cuente con las unidades y el soporte que necesita."
          />
          <ul className="grid gap-px bg-white/15 sm:grid-cols-3">
            {services.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.1} className="flex flex-col items-start gap-5 bg-navy-900 py-6 sm:items-center sm:px-5 sm:text-center">
                <Icon name={s.icon} className="size-9 text-white" />
                <p className="display text-base leading-snug font-semibold text-white">{s.title}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative aspect-[16/9] md:hidden">
        <Image src={versioned("/img/secciones/servicio.jpg")} alt="" fill sizes="100vw" className="object-cover" />
      </div>
    </section>
  );
}

/* ---------- Producto destacado con plano interactivo ---------- */

export function FeaturedPlan() {
  const unit = units[0];
  const variant = unit.variants[0];
  return (
    <section className="blueprint-grid-light bg-white py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Producto destacado"
            title={`${unit.name} ${variant.size}`}
            intro="Recorré el plano: pasá el cursor o tocá cada ambiente para ver su equipamiento."
          />
          <Reveal>
            <Link
              href={`/flota/${catalogId(unit.slug, variant.size)}`}
              className="group inline-flex items-center gap-3 border border-ink px-7 py-4 font-display text-sm font-semibold tracking-[0.2em] text-ink uppercase transition-colors hover:bg-ink hover:text-white"
            >
              Ver ficha completa
              <Icon name="arrow" className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <Reveal className="mt-14">
          <FloorPlan plan={variant.plan} tone="light" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Por qué elegirnos ---------- */

// Solo afirmaciones respaldadas por el catálogo del cliente. Confirmar con él antes de sumar
// años de experiencia, cobertura geográfica o venta de unidades.
const reasons: Item[] = [
  { icon: "bed", title: "Confort para tu equipo", text: "Calefacción y aire acondicionado en dormitorios, comedores y oficinas, colchones de 20 cm y TV Smart." },
  { icon: "shield", title: "Seguridad documentada", text: "Cálculo de vuelco y plano unifilar firmados por matriculado, y cálculo de carga de fuego." },
  { icon: "ruler", title: "Construcción a medida", text: "Diseñamos y fabricamos módulos según la necesidad de tu operación." },
  { icon: "wrench", title: "Mantenimiento", text: "Servicio técnico de trailers y generadores durante toda la operación." },
  { icon: "layers", title: "Un solo proveedor", text: "Alojamiento, comedor, oficinas, sanitarios, depósito y energía." },
  { icon: "support", title: "Atención personalizada", text: "Te asesoramos para armar el campamento que tu proyecto necesita." },
];

export function WhyUs() {
  const photo = versioned("/img/secciones/nosotros.jpg");
  return (
    <section id="nosotros" className="scroll-mt-20 py-24 md:py-32">
      <div className="container-x">
        {/* Panel navy: título y foto en diagonal */}
        <Reveal className="relative isolate overflow-hidden bg-navy-900 text-white shadow-[0_40px_80px_-40px_rgb(11_18_32/0.5)]">
          <div className="blueprint-grid absolute inset-0 -z-20" />
          <div className="absolute inset-y-0 right-0 -z-10 hidden w-[40%] md:block xl:w-[34%]">
            <div className="absolute inset-0 [clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]">
              <Image src={photo} alt="" fill sizes="(min-width: 1280px) 34vw, 40vw" className="object-cover object-[42%_center]" />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-900/60 via-navy-900/15 to-navy-900/5" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 via-transparent to-navy-900/20" />
            </div>
            {/* Filo rojo sobre la diagonal */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
              <line x1="22" y1="0" x2="0" y2="100" stroke="var(--color-brand)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>

          <div className="flex flex-col gap-12 px-6 pt-14 pb-10 md:min-h-[24rem] md:justify-between md:py-12 md:pr-[44%] md:pl-10 lg:py-14 xl:min-h-[27rem] xl:pr-[37%] xl:pl-12">
            <SectionHeading
              tone="dark"
              size="md"
              eyebrow="Por qué elegirnos"
              title="Diseño, calidad y compromiso"
              intro="Soluciones confiables y a medida, con el equipamiento necesario para cada tipo de proyecto."
            />
            <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.65rem] text-white/55">
              <span className="h-px w-8 bg-brand" />
              {["Modulares", "Patagonia", "Oil & Gas", "Minería"].map((t, i, a) => (
                <span key={t} className="whitespace-nowrap">
                  {t}
                  {i < a.length - 1 && <span className="ml-3 text-white/25">/</span>}
                </span>
              ))}
            </p>
          </div>

          <div className="relative aspect-[16/10] border-t-2 border-brand md:hidden">
            <Image src={photo} alt="" fill sizes="100vw" className="object-cover" />
          </div>
        </Reveal>

        {/* Razones: ícono, índice rojo, título y texto, separados por líneas finas */}
        <ul className="mt-6 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal as="li" key={r.title} delay={(i % 3) * 0.08} className="group relative bg-paper py-7 sm:px-8 sm:py-9 md:px-10 xl:px-12">
              <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-700 ease-premium group-hover:scale-x-100" />
              <Icon
                name={r.icon}
                className="size-9 text-navy transition-[translate,color] duration-500 ease-premium group-hover:-translate-y-0.5 group-hover:text-brand"
              />
              <span className="tabular mt-6 flex items-center gap-2 font-display text-xs font-semibold tracking-[0.2em] text-brand">
                <span className="h-px w-5 bg-brand" />
                0{i + 1}
              </span>
              <p className="display mt-3 text-lg font-semibold text-ink">{r.title}</p>
              <p className="mt-2 max-w-sm text-[0.95rem] leading-relaxed text-ink/60">{r.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Proceso ---------- */

const steps: Item[] = [
  { icon: "chat", title: "Consulta", text: "Nos contás tu proyecto, locación y plazos." },
  { icon: "doc", title: "Propuesta", text: "Te enviamos una solución a medida." },
  // TODO: confirmar con el cliente que incluye traslado/instalación
  { icon: "truck", title: "Entrega", text: "Coordinamos el envío de las unidades a tu locación." },
  { icon: "wrench", title: "Soporte", text: "Mantenimiento durante toda la operación." },
];

export function Process() {
  return (
    <section id="proceso" className="scroll-mt-20 border-t border-ink/10 bg-white py-24 md:py-32">
      <div className="container-x">
        <SectionHeading eyebrow="Nuestro proceso" title="Simple, rápido y sin complicaciones" />
        <ol className="relative mt-16 grid gap-12 md:grid-cols-4 md:gap-6">
          <span className="absolute top-7 right-0 left-0 hidden h-px bg-gradient-to-r from-brand via-ink/15 to-transparent md:block" />
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.12} className="relative">
              <span className="relative grid size-14 place-items-center rounded-full border border-ink/20 bg-white font-display text-lg text-ink">
                {i + 1}
              </span>
              <Icon name={s.icon} className="mt-8 size-7 text-brand" />
              <h3 className="display mt-4 text-2xl font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 max-w-xs text-ink/60">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- CTA + contacto (oscuro) ---------- */

export function Contact() {
  return (
    <section id="contacto" className="relative isolate scroll-mt-20 overflow-hidden bg-ink">
      <ZoomIn className="absolute inset-0 -z-20">
        <Image src={versioned("/img/secciones/contacto.jpg")} alt="" fill sizes="100vw" className="object-cover" />
      </ZoomIn>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/65" />
      <div className="container-x grid gap-16 py-24 md:py-32 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading
            tone="dark"
            eyebrow="Contacto"
            title={
              <>
                ¿Necesitás un <span className="text-brand">campamento?</span>
              </>
            }
            intro="Contanos qué necesitás y armamos la solución para tu operación."
          />
          <Reveal className="mt-12 space-y-5 text-white/80">
            <a href={whatsappLink()} target="_blank" rel="noopener" className="flex items-center gap-4 transition-colors hover:text-white">
              <WhatsAppIcon className="size-5 text-brand" />
              {site.phoneDisplay}
            </a>
            <p className="flex items-center gap-4">
              <Icon name="mail" className="size-5 text-brand" />
              <span className="select-all">{site.email}</span>
            </p>
            <p className="flex items-center gap-4">
              <Icon name="pin" className="size-5 text-brand" />
              {site.location}
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="border border-white/10 bg-ink/70 p-7 backdrop-blur-md md:p-10">
          <QuoteForm />
        </Reveal>
      </div>
    </section>
  );
}
