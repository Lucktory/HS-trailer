"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { SIZES, SPACES, type CatalogItem, type Size, type SpaceId } from "@/lib/fleet";
import { Icon, type IconName } from "./icons";
import { CatalogCard } from "./ui";

export type GridItem = { item: CatalogItem; image: string };

const ALL = "all";
type SizeFilter = typeof ALL | Size;
type SpaceFilter = typeof ALL | SpaceId;

const typeOptions: { id: SpaceFilter; label: string; icon: IconName }[] = [{ id: ALL, label: "Todos", icon: "grid" }, ...SPACES];
const sizeOptions: { id: SizeFilter; label: string }[] = [{ id: ALL, label: "Todas" }, ...SIZES.map((s) => ({ id: s, label: s }))];

// Orden: uso principal (según SPACES) y, dentro de cada uno, 12 m antes que 6 m.
const spaceIndex = (id: SpaceId) => SPACES.findIndex((sp) => sp.id === id);

// Un contenedor coincide si INCLUYE el espacio elegido (la Vivienda aparece en Dormitorio, Baño y Comedor).
function matches({ item }: GridItem, space: SpaceFilter, size: SizeFilter) {
  return (space === ALL || item.spaces.includes(space)) && (size === ALL || item.size === size);
}

// Filtro combinado: por espacio (dormitorio, baño, depósito…) y por medida.
// Las opciones sin resultados para la combinación actual quedan deshabilitadas, así nunca hay una grilla vacía.
export function FleetGrid({ items }: { items: GridItem[] }) {
  const [type, setType] = useState<SpaceFilter>(ALL);
  const [size, setSize] = useState<SizeFilter>(ALL);
  const reduce = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  const todosRef = useRef<HTMLButtonElement>(null);

  const count = (t: SpaceFilter, s: SizeFilter) => items.filter((it) => matches(it, t, s)).length;
  // Con un espacio elegido, primero las unidades dedicadas a ese uso (ej. en Baño: los módulos sanitarios, después la Vivienda).
  const dedicated = (it: GridItem) => (type !== ALL && it.item.spaces[0] === type ? 0 : 1);
  const visible = items
    .filter((it) => matches(it, type, size))
    .sort(
      (a, b) =>
        dedicated(a) - dedicated(b) ||
        SIZES.indexOf(a.item.size) - SIZES.indexOf(b.item.size) ||
        spaceIndex(a.item.spaces[0]) - spaceIndex(b.item.spaces[0]),
    );
  const filtered = type !== ALL || size !== ALL;

  const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
  // Dentro de la fila deslizable el contorno va hacia adentro (si no, el overflow lo recorta)
  const focusInset = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand";

  return (
    <>
      {/* Barra de filtros: espacios (pestañas con ícono) y, a la derecha, medida (control segmentado) */}
      <div className="mt-12 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between xl:gap-10 xl:border-b xl:border-ink/10">
        {/* Por espacio: la línea roja se desliza hasta la pestaña activa; fila deslizable si no entra */}
        <div
          ref={rowRef}
          role="group"
          aria-label="Filtrar por espacio"
          className="-mx-5 flex snap-x overflow-x-auto scroll-px-5 border-b border-ink/10 px-5 xl:border-b-0 [scrollbar-width:none] md:mx-0 md:px-0 xl:min-w-0 xl:flex-1 [&::-webkit-scrollbar]:hidden"
        >
          {typeOptions.map((o) => {
            const n = count(o.id, size);
            const active = type === o.id;
            return (
              <button
                key={o.id}
                ref={o.id === ALL ? todosRef : undefined}
                type="button"
                aria-pressed={active}
                disabled={n === 0}
                onClick={() => setType(o.id)}
                className={`group relative flex min-w-[5.25rem] shrink-0 snap-start flex-col items-center gap-2.5 px-3 pt-3 pb-4 transition-opacity disabled:cursor-not-allowed disabled:opacity-30 ${focusInset}`}
              >
                <Icon
                  name={o.icon}
                  weight={active ? "regular" : "light"}
                  className={`size-7 transition-[color,transform] duration-300 ease-premium ${
                    active ? "text-ink" : "text-ink/45 group-enabled:group-hover:-translate-y-0.5 group-enabled:group-hover:text-ink/80"
                  }`}
                />
                <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                  <span className={`text-[0.8125rem] font-medium transition-colors ${active ? "text-ink" : "text-ink/60 group-enabled:group-hover:text-ink"}`}>
                    {o.label}
                  </span>
                  <span className={`tabular text-[0.6875rem] ${active ? "text-brand" : "text-ink/45"}`}>{n}</span>
                </span>
                {active ? (
                  <motion.span
                    layoutId="space-indicator"
                    className="absolute inset-x-3 -bottom-px h-0.5 bg-brand"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 42 }}
                  />
                ) : (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 bg-ink/20 opacity-0 transition-opacity group-enabled:group-hover:opacity-100" />
                )}
              </button>
            );
          })}
        </div>

        {/* Por medida: selector blanco que se desliza sobre la pista + limpiar */}
        <div className="flex items-center gap-3 xl:pb-3">
          <div role="group" aria-label="Filtrar por medida" className="flex bg-ink/[0.06] p-1">
            {sizeOptions.map((o) => {
              const n = count(type, o.id);
              const active = size === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={active}
                  disabled={n === 0}
                  onClick={() => setSize(o.id)}
                  className={`tabular relative px-4 py-2 text-[0.8125rem] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${focus} ${
                    active ? "text-ink" : "text-ink/55 enabled:hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="size-thumb"
                      className="absolute inset-0 bg-white shadow-[0_1px_2px_rgb(11_18_32/0.08),0_4px_12px_-4px_rgb(11_18_32/0.18)]"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 42 }}
                    />
                  )}
                  <span className="relative">{o.label}</span>
                </button>
              );
            })}
          </div>
          {filtered && (
            <button
              type="button"
              aria-label="Limpiar filtros"
              title="Limpiar filtros"
              onClick={() => {
                setType(ALL);
                setSize(ALL);
                // Este botón desaparece: el foco pasa a "Todos" y la fila vuelve al inicio (móvil)
                todosRef.current?.focus({ preventScroll: true });
                rowRef.current?.scrollTo({ left: 0, behavior: reduce ? "auto" : "smooth" });
              }}
              className={`grid size-10 place-items-center text-ink/55 transition-colors hover:bg-ink/[0.06] hover:text-brand ${focus}`}
            >
              <Icon name="close" className="size-4" weight="regular" />
            </button>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length === 1 ? "1 modelo" : `${visible.length} modelos`}
      </p>

      <motion.div layout={!reduce} className="relative mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((it, i) => (
            <motion.div
              key={it.item.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % 4) * 0.06 }}
            >
              <CatalogCard item={it.item} image={it.image} highlight={type === ALL ? undefined : type} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
