"use client";

import dynamic from "next/dynamic";
import { Component, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/icons";
import type { Plan } from "@/lib/plan";
import { buildModel3D, buildTour } from "@/lib/plan-3d";

// three + R3F solo se descargan cuando se monta el recorrido
const WalkthroughScene = dynamic(() => import("./walkthrough-scene"), {
  ssr: false,
  loading: () => <p className="grid h-full place-items-center text-sm text-white/60">Cargando vista 3D...</p>,
});

// Si WebGL falla, se muestra el error en el recuadro en vez de romper la pagina
class SceneBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error)
      return (
        <div className="grid h-full place-items-center p-6 text-center text-sm text-white/70">
          No se pudo cargar la vista 3D. Probar con otro navegador o dispositivo.
        </div>
      );
    return this.props.children;
  }
}

export function Walkthrough({ plan }: { plan: Plan }) {
  const model = useMemo(() => buildModel3D(plan), [plan]);
  const stops = useMemo(() => buildTour(plan), [plan]);
  const [active, setActive] = useState<number | null>(null); // null = vista general
  const view = useRef<HTMLDivElement>(null);

  // En pantallas angostas el panel queda debajo de la vista: al elegir una parada, volver a mostrarla
  const go = (i: number | null) => {
    setActive(i);
    const box = view.current?.getBoundingClientRect();
    if (box && (box.top < 0 || box.bottom > window.innerHeight)) view.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:gap-10">
      <div ref={view} data-lenis-prevent className="relative h-[62svh] min-h-[22rem] overflow-hidden border border-white/10 bg-navy-900 lg:h-[70svh]">
        <SceneBoundary>
          <WalkthroughScene model={model} stops={stops} active={active} onSelect={setActive} />
        </SceneBoundary>
        <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-4 pt-10 pb-3 text-xs text-white/70">
          {active === null ? "Arrastrar para girar, rueda o pellizco para acercar. Tocar un sector para entrar." : "Arrastrar para mirar alrededor."}
        </p>
      </div>

      <aside className="flex flex-col text-white">
        <button
          type="button"
          onClick={() => go(null)}
          aria-pressed={active === null}
          className={`eyebrow flex items-center justify-between border px-4 py-3 text-[0.7rem] transition-colors ${
            active === null ? "border-white bg-white text-ink" : "border-white/20 text-white/75 hover:text-white"
          }`}
        >
          Vista general
          <Icon name="arrow" className="size-4" />
        </button>

        <ol className="mt-4 divide-y divide-white/10 border-y border-white/10">
          {stops.map((s, i) => (
            <li key={s.zone.id}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-pressed={active === i}
                className={`flex w-full items-center gap-4 py-3 text-left transition-colors ${active === i ? "text-white" : "text-white/65 hover:text-white"}`}
              >
                <span
                  className={`tabular grid size-7 shrink-0 place-items-center rounded-full border text-xs ${
                    active === i ? "border-brand bg-brand text-white" : "border-white/30"
                  }`}
                >
                  {i + 1}
                </span>
                {s.zone.label}
              </button>
            </li>
          ))}
        </ol>

        {active !== null && (
          <div className="mt-6">
            <ul className="space-y-2 text-sm text-white/75">
              {stops[active].zone.items.map((it) => (
                <li key={it} className="flex gap-3">
                  <span className="mt-2 h-px w-3 shrink-0 bg-brand" />
                  {it}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => go((active - 1 + stops.length) % stops.length)}
                className="flex-1 border border-white/20 px-4 py-2.5 text-sm text-white/80 hover:text-white"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => go((active + 1) % stops.length)}
                className="flex-1 bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
