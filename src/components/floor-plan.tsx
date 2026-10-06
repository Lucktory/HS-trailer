"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Plan, Shape, Zone } from "@/lib/plan";

// Desplaza el contenedor del plano para dejar la zona en el centro (no toca el scroll de la página)
function centerZone(sc: HTMLDivElement | null, z: Zone, padL: number, vbW: number, smooth: boolean) {
  const inner = sc?.firstElementChild as HTMLElement | null;
  if (!sc || !inner || sc.scrollWidth <= sc.clientWidth) return;
  const cx = parseFloat(getComputedStyle(sc).paddingLeft) + (((z.mx ?? z.x + z.w / 2) + padL) / vbW) * inner.offsetWidth;
  const still = !smooth || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  sc.scrollTo({ left: cx - sc.clientWidth / 2, behavior: still ? "auto" : "smooth" });
}

type Tone = "dark" | "light";

const palette = {
  dark: { bg: "#0b1220", wall: "#e8ecf3", line: "rgba(232,236,243,0.55)", fill: "rgba(232,236,243,0.18)", dim: "rgba(232,236,243,0.5)" },
  light: { bg: "#ffffff", wall: "#0b1220", line: "rgba(11,18,32,0.55)", fill: "rgba(11,18,32,0.14)", dim: "rgba(11,18,32,0.5)" },
};

function renderShape(s: Shape, i: number, c: (typeof palette)["dark"]) {
  switch (s.t) {
    case "rect":
      return <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} fill={s.fill ? c.fill : "none"} stroke={c.line} strokeWidth={1.6} />;
    case "line":
      return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={c.line} strokeWidth={1.2} />;
    case "circle":
      return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="none" stroke={c.line} strokeWidth={1.6} />;
    case "wall":
      return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={c.wall} strokeWidth={5} strokeLinecap="square" />;
    case "gap":
      return <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} fill={c.bg} />;
    case "window":
      return (
        <g key={i}>
          <rect x={s.x} y={s.y - 5} width={s.w} height={10} fill={c.bg} />
          <line x1={s.x} y1={s.y - 2.5} x2={s.x + s.w} y2={s.y - 2.5} stroke={c.wall} strokeWidth={1.2} />
          <line x1={s.x} y1={s.y + 2.5} x2={s.x + s.w} y2={s.y + 2.5} stroke={c.wall} strokeWidth={1.2} />
        </g>
      );
    case "door": {
      const { x, y, w } = s;
      const end = { up: [x, y - w], down: [x, y + w], left: [x - w, y], right: [x + w, y] }[s.to];
      // Arco desde el extremo del vano hasta la hoja abierta
      const horizontal = s.to === "up" || s.to === "down";
      const k = s.flip ? -1 : 1;
      const start = horizontal ? [x + k * w, y] : [x, y - k * w];
      const sweep = (s.to === "down" || s.to === "right" ? 1 : 0) ^ (s.flip ? 1 : 0);
      const path = `M${start[0]},${start[1]} A${w},${w} 0 0 ${sweep} ${end[0]},${end[1]}`;
      return (
        <g key={i}>
          <rect
            x={horizontal ? Math.min(x, start[0]) : x - 4}
            y={horizontal ? y - 4 : Math.min(y, start[1])}
            width={horizontal ? w : 8}
            height={horizontal ? 8 : w}
            fill={c.bg}
          />
          <line x1={x} y1={y} x2={end[0]} y2={end[1]} stroke={c.wall} strokeWidth={2} />
          <path d={path} fill="none" stroke={c.dim} strokeWidth={1} strokeDasharray="4 4" />
        </g>
      );
    }
  }
}

export function FloorPlan({
  plan,
  tone = "dark",
  lengthLabel,
  widthLabel = "2.44 M",
}: {
  plan: Plan;
  tone?: Tone;
  lengthLabel?: string;
  widthLabel?: string;
}) {
  const [active, setActive] = useState<string>(plan.zones[0].id);
  const scroller = useRef<HTMLDivElement>(null);
  const c = palette[tone];
  const zone = plan.zones.find((z) => z.id === active)!;
  const pad = { l: plan.padLeft ?? 70, r: 20, t: 60, b: 110 };
  const dimX = -pad.l + 30;
  const vbW = plan.length + pad.l + pad.r;
  // 1 para 12 m; ≈0,53 para 6 m: misma cantidad de px por cm que un plano de 12 m
  const frac = vbW / (vbW + 1200 - plan.length);
  const vbH = plan.width + pad.t + pad.b;

  // Plano más ancho que su caja (celulares, 768–1170 px): se centra la zona elegida en la LEYENDA y, al cargar,
  // la primera. Nunca al pasar el mouse por el plano (lo movería bajo el cursor y cambiaría de zona).
  useEffect(() => centerZone(scroller.current, plan.zones[0], pad.l, vbW, false), [plan, pad.l, vbW]);
  const pick = (z: Zone) => {
    setActive(z.id);
    centerZone(scroller.current, z, pad.l, vbW, true);
  };
  const text = tone === "dark" ? "text-white" : "text-ink";
  const muted = tone === "dark" ? "text-white/60" : "text-ink/60";
  const border = tone === "dark" ? "border-white/12" : "border-ink/12";

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
      <div ref={scroller} className="-mx-5 overflow-x-auto overflow-y-hidden px-5 md:mx-0 md:px-0">
        {/* Cada 6 m se dibuja a la misma escala que su 12 m (la mitad de largo) */}
        <div className="relative" style={{ width: `${frac * 100}%`, minWidth: 720 * frac }}>
          <svg viewBox={`${-pad.l} ${-pad.t} ${vbW} ${vbH}`} className="h-auto w-full" role="img" aria-label="Plano de planta">
            {/* Cotas */}
            <g stroke={c.dim} strokeWidth={1}>
              <line x1={0} y1={-32} x2={plan.length} y2={-32} />
              <line x1={0} y1={-42} x2={0} y2={-22} />
              <line x1={plan.length} y1={-42} x2={plan.length} y2={-22} />
              <line x1={dimX} y1={0} x2={dimX} y2={plan.width} />
              <line x1={dimX - 10} y1={0} x2={dimX + 10} y2={0} />
              <line x1={dimX - 10} y1={plan.width} x2={dimX + 10} y2={plan.width} />
            </g>
            <text x={plan.length / 2} y={-42} textAnchor="middle" fill={c.dim} fontSize={16} letterSpacing={3} fontFamily="var(--font-display)">
              {lengthLabel ?? `${(plan.length / 100).toFixed(2)} M`}
            </text>
            <text
              x={dimX - 14}
              y={plan.width / 2}
              textAnchor="middle"
              fill={c.dim}
              fontSize={16}
              letterSpacing={3}
              fontFamily="var(--font-display)"
              transform={`rotate(-90 ${dimX - 14} ${plan.width / 2})`}
            >
              {widthLabel}
            </text>

            {/* Contorno de la zona activa (debajo del dibujo: lo tapan muros y aberturas) */}
            {plan.zones.map((z) => (
              <motion.rect
                key={z.id}
                x={z.x}
                y={z.y}
                width={z.w}
                height={z.h}
                initial={false}
                animate={{ strokeOpacity: active === z.id ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                fill="none"
                stroke="#c8102e"
                strokeWidth={2}
              />
            ))}

            {/* Muro exterior + mobiliario */}
            <rect x={0} y={0} width={plan.length} height={plan.width} fill="none" stroke={c.wall} strokeWidth={7} />
            {plan.shapes.map((s, i) => renderShape(s, i, c))}

            {/* Tinte de la zona activa, por encima del dibujo y mezclado: no deja bandas blancas en puertas y ventanas */}
            {plan.zones.map((z) => (
              <motion.rect
                key={`tint-${z.id}`}
                x={z.x}
                y={z.y}
                width={z.w}
                height={z.h}
                initial={false}
                animate={{ fillOpacity: active === z.id ? 0.22 : 0 }}
                transition={{ duration: 0.4 }}
                fill="#c8102e"
                pointerEvents="none"
                style={{ mixBlendMode: tone === "light" ? "multiply" : "screen" }}
              />
            ))}

            {/* Áreas de interacción y marcadores */}
            {plan.zones.map((z, i) => (
              <g
                key={z.id}
                className="cursor-pointer"
                onMouseEnter={() => setActive(z.id)}
                onFocus={() => setActive(z.id)}
                onClick={() => setActive(z.id)}
                tabIndex={0}
                role="button"
                aria-label={z.label}
                aria-pressed={active === z.id}
              >
                <rect x={z.x} y={z.y} width={z.w} height={z.h} fill="transparent" />
                <circle
                  cx={z.mx ?? z.x + z.w / 2}
                  cy={z.my ?? z.y + z.h / 2}
                  r={17}
                  fill={active === z.id ? "#c8102e" : c.bg}
                  stroke={active === z.id ? "#c8102e" : c.wall}
                  strokeWidth={1.5}
                  className="transition-colors duration-300"
                />
                <text
                  x={z.mx ?? z.x + z.w / 2}
                  y={(z.my ?? z.y + z.h / 2) + 6}
                  textAnchor="middle"
                  fontSize={17}
                  fontWeight={600}
                  fill={active === z.id ? "#fff" : c.wall}
                  fontFamily="var(--font-display)"
                  pointerEvents="none"
                >
                  {i + 1}
                </text>
              </g>
            ))}
          </svg>

          {/* Globo con el detalle de la zona activa. Copias invisibles de TODOS los globos fijan la altura (la del
              más alto): el contenedor no cambia de tamaño y el globo nunca desborda ni hace aparecer barras. */}
          <div className="relative grid">
            {plan.zones.map((z) => (
              <ZoneCard key={z.id} zone={z} className="invisible col-start-1 row-start-1" />
            ))}
          <AnimatePresence mode="wait">
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute top-0"
              style={{
                left: `clamp(0px, calc(${(((zone.mx ?? zone.x + zone.w / 2) + pad.l) / vbW) * 100}% - 7.5rem), calc(100% - 15rem))`,
              }}
            >
              <ZoneCard zone={zone} />
            </motion.div>
          </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Leyenda sincronizada */}
      <ol className={`self-center border-t ${border}`}>
        {plan.zones.map((z, i) => (
          <li key={z.id}>
            <button
              type="button"
              onMouseEnter={() => pick(z)}
              onClick={() => pick(z)}
              className={`flex w-full items-center gap-4 border-b ${border} py-4 text-left transition-colors`}
            >
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full border font-display text-sm transition-colors duration-300 ${
                  active === z.id ? "border-brand bg-brand text-white" : `${border} ${muted}`
                }`}
              >
                {i + 1}
              </span>
              <span className={`transition-colors ${active === z.id ? text : muted}`}>{z.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ZoneCard({ zone, className = "" }: { zone: Zone; className?: string }) {
  return (
    <div className={`w-60 border border-brand bg-ink/95 p-4 text-white shadow-2xl shadow-black/40 ${className}`}>
      <p className="font-display text-sm font-semibold tracking-[0.2em] uppercase">{zone.label}</p>
      <ul className="mt-2 space-y-1 text-[0.8rem] text-white/75">
        {zone.items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className="mt-[0.45rem] size-1 shrink-0 bg-brand" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
