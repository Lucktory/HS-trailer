"use client";

import dynamic from "next/dynamic";
import { Component, useMemo, useState, type ReactNode } from "react";
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

// Botones sobre la vista 3D: redondos, 44 px (comodos para el pulgar)
const roundBtn =
  "pointer-events-auto grid size-11 shrink-0 place-items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const idle = "border-white/30 bg-ink/75 text-white hover:bg-ink";

export function Walkthrough({ plan }: { plan: Plan }) {
  const model = useMemo(() => buildModel3D(plan), [plan]);
  const stops = useMemo(() => buildTour(plan), [plan]);
  const [active, setActive] = useState<number | null>(null); // null = vista general
  const [showItems, setShowItems] = useState(false);
  const zone = active === null ? null : stops[active].zone;
  const step = (d: number) => setActive((a) => ((a ?? 0) + d + stops.length) % stops.length);

  return (
    <div data-lenis-prevent className="relative h-[62svh] min-h-[22rem] overflow-hidden border border-white/10 bg-navy-900 lg:h-[72svh]">
      <SceneBoundary>
        <WalkthroughScene model={model} stops={stops} active={active} onSelect={setActive} />
      </SceneBoundary>

      {/* Controles sobre la vista: el contenedor no captura toques, solo los botones */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-pressed={active === null}
            aria-label="Vista general"
            title="Vista general"
            className={`${roundBtn} ${active === null ? "border-white bg-white text-ink" : idle}`}
          >
            <Icon name="cube" className="size-5" />
          </button>
          <p className="max-w-[14rem] bg-ink/75 px-3 py-1.5 text-right text-xs text-white/80">
            {active === null ? "Arrastrar para girar. Tocar un sector o una parada para entrar." : "Arrastrar para mirar alrededor."}
          </p>
        </div>

        {/* Flechas anterior / siguiente, solo dentro del recorrido */}
        {zone && (
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => step(-1)} aria-label="Parada anterior" className={`${roundBtn} ${idle}`}>
              <Icon name="arrowLeft" className="size-5" />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Parada siguiente" className={`${roundBtn} ${idle}`}>
              <Icon name="arrow" className="size-5" />
            </button>
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          {zone && showItems && (
            <ul id="walkthrough-items" className="pointer-events-auto w-full max-w-sm space-y-1.5 bg-ink/90 px-4 py-3 text-sm text-white/85">
              {zone.items.map((it) => (
                <li key={it} className="flex gap-3">
                  <span className="mt-2 h-px w-3 shrink-0 bg-brand" />
                  {it}
                </li>
              ))}
            </ul>
          )}
          {zone && (
            <button
              type="button"
              onClick={() => setShowItems((v) => !v)}
              aria-expanded={showItems}
              aria-controls="walkthrough-items"
              className="pointer-events-auto flex items-center gap-2 bg-ink/75 px-3 py-1.5 text-sm text-white hover:bg-ink focus-visible:outline-2 focus-visible:outline-white"
            >
              {zone.label}
              <Icon name="caretDown" className={`size-4 transition-transform ${showItems ? "" : "rotate-180"}`} />
            </button>
          )}
          <ol className="flex gap-2" aria-label="Paradas del recorrido">
            {stops.map((s, i) => (
              <li key={s.zone.id}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  aria-label={`Parada ${i + 1}: ${s.zone.label}`}
                  title={s.zone.label}
                  className={`${roundBtn} tabular text-sm ${active === i ? "border-brand bg-brand text-white" : idle}`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
