"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const fmt = (n: number) => Math.round(n).toLocaleString("es-AR"); // 3500 → "3.500"

// Número que cuenta desde 0 al entrar en pantalla. El HTML ya trae el valor final (SEO / sin JS),
// y una copia invisible reserva el ancho para que el texto no salte mientras cuenta.
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = fmt(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span className="relative inline-grid">
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {fmt(value)}
      </span>
      <span ref={ref} className="col-start-1 row-start-1">
        {fmt(value)}
      </span>
    </span>
  );
}
