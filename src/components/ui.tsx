import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { CatalogItem, Feature, Size, SpaceId } from "@/lib/fleet";
import { Icon, type IconName } from "./icons";
import { Reveal } from "./motion";

// Ícono en baldosa navy con esquinas rojas (especificaciones de las fichas y equipamiento de la home)
export function IconTile({ name }: { name: IconName }) {
  return (
    <span className="relative grid size-14 shrink-0 place-items-center bg-gradient-to-br from-navy to-navy-900 text-white shadow-[0_10px_24px_-10px_rgb(15_31_56/0.7)]">
      <span className="absolute -top-px -left-px size-2.5 border-t-2 border-l-2 border-brand" />
      <span className="absolute -right-px -bottom-px size-2.5 border-r-2 border-b-2 border-brand" />
      <Icon name={name} weight="duotone" className="size-7" />
    </span>
  );
}

// tone = color del fondo sobre el que va el título
export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  size = "lg",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  tone?: "dark" | "light";
  size?: "lg" | "md";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <Reveal className={`max-w-3xl ${className}`}>
      <p className={`eyebrow flex items-center gap-4 ${dark ? "text-white/70" : "text-ink/55"}`}>
        <span className="h-px w-10 bg-brand" />
        {eyebrow}
      </p>
      <h2
        className={`display mt-5 font-bold ${dark ? "text-white" : "text-ink"} ${
          size === "lg" ? "text-[clamp(2rem,5vw,4.25rem)]" : "text-[clamp(1.85rem,3.2vw,2.9rem)]"
        }`}
      >
        {title}
      </h2>
      {intro && <p className={`mt-6 max-w-xl text-lg leading-relaxed ${dark ? "text-white/70" : "text-ink/60"}`}>{intro}</p>}
    </Reveal>
  );
}

export function UnitCard({
  href,
  external,
  image,
  name,
  sizes,
  features = [],
  highlight,
  summary,
  cta,
  priority,
}: {
  href: string;
  external?: boolean;
  image: string;
  name: string;
  sizes: Size[];
  features?: Feature[];
  highlight?: SpaceId;
  summary: string;
  cta: string;
  priority?: boolean;
}) {
  const spaces = features.filter((ft) => ft.space);
  const comforts = features.filter((ft) => !ft.space);
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className="group relative flex h-full flex-col overflow-hidden border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgb(11_18_32/0.04)] transition-[box-shadow,transform] duration-500 ease-premium hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgb(11_18_32/0.25)]"
    >
      <span className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-700 ease-premium group-hover:scale-x-100" />
      <div className="relative aspect-[16/10] overflow-hidden bg-paper">
        <Image
          src={image}
          alt="" // la foto decora el enlace; el título (h3) ya nombra la unidad
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.4s] ease-premium group-hover:scale-105"
        />
        {sizes.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-1.5">
            {sizes.map((sz) => (
              <span key={sz} className="bg-ink/85 px-2.5 py-1 font-display text-xs font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-sm">
                {sz}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="display text-[1.4rem] font-semibold text-ink">{name}</h3>
        {/* Qué incluye, solo con íconos: espacios | confort. Nombre en un tooltip al pasar el mouse. */}
        {features.length > 0 && (
          <>
            <ul className="mt-4 flex flex-wrap items-center gap-x-3.5 gap-y-2" aria-hidden="true">
              {spaces.map((ft) => (
                <FeatureIcon key={ft.id} feature={ft} on={ft.id === highlight} />
              ))}
              {spaces.length > 0 && comforts.length > 0 && <li className="h-4 w-px bg-ink/15" />}
              {comforts.map((ft) => (
                <FeatureIcon key={ft.id} feature={ft} />
              ))}
            </ul>
            <span className="sr-only">Incluye: {features.map((ft) => ft.label.toLowerCase()).join(", ")}.</span>
          </>
        )}
        <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink/65">{summary}</p>
        <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold tracking-[0.18em] text-brand uppercase">
          {cta}
          <Icon name="arrow" className="size-4 transition-transform duration-500 ease-premium group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

// Un modelo concreto (tipo + medida); todos tienen su ficha.
export function CatalogCard({ item, image, highlight, priority }: { item: CatalogItem; image: string; highlight?: SpaceId; priority?: boolean }) {
  return (
    <UnitCard
      href={item.href}
      image={image}
      name={item.name}
      sizes={[item.size]}
      features={item.features}
      highlight={highlight}
      summary={item.summary}
      cta="Ver más"
      priority={priority}
    />
  );
}

function FeatureIcon({ feature, on = false }: { feature: Feature; on?: boolean }) {
  return (
    <li className="group/feat relative">
      <Icon name={feature.icon} className={`size-5 transition-colors ${on ? "text-brand" : "text-ink/55"}`} weight={on ? "fill" : undefined} />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 bg-ink px-2 py-1 text-[0.7rem] font-medium whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover/feat:opacity-100">
        {feature.label}
      </span>
    </li>
  );
}
