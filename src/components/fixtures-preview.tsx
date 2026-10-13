"use client";

import dynamic from "next/dynamic";
import { AC_UNIT, LAMP } from "@/lib/plan-3d";

// three + R3F solo se descargan en el navegador
const FixturesPreviewScene = dynamic(() => import("./fixtures-preview-scene"), {
  ssr: false,
  loading: () => <p className="grid h-full place-items-center text-sm text-white/60">Cargando vista 3D...</p>,
});

const items = [
  { id: "ac", label: "Equipo fr\u00edo/calor (split)", size: `${AC_UNIT.w} x ${AC_UNIT.h} x ${AC_UNIT.d} cm` },
  { id: "lamp", label: "Luminaria de techo", size: `\u00d8 ${LAMP.diameter} cm` },
] as const;

export function FixturesPreview() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {items.map((it) => (
        <figure key={it.id}>
          <div data-lenis-prevent className="h-[60svh] max-h-[34rem] min-h-[20rem] overflow-hidden border border-white/10">
            <FixturesPreviewScene item={it.id} />
          </div>
          <figcaption className="mt-3 flex justify-between text-sm text-white/75">
            {it.label}
            <span className="tabular text-white/50">{it.size} (aprox.)</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
