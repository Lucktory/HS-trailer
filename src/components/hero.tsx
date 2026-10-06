"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { HeroVideos } from "./hero-videos";
import { Icon } from "./icons";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0]);

  const lines = ["Campamentos", "listos para", "operar"];

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
      <motion.div className="absolute inset-0 -z-20" style={{ y: videoY }}>
        <HeroVideos className="scale-105" />
      </motion.div>
      {/* Degradados para legibilidad */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/70 to-ink/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/60" />

      <motion.div style={{ opacity: contentOpacity }} className="container-x w-full pt-32 pb-28 md:pb-44">
        <motion.p
          className="eyebrow mb-6 flex items-center gap-4 text-white/70"
          initial={reduce ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease, delay: 0.2 }}
        >
          <span className="h-px w-10 bg-brand" />
          Soluciones logísticas a medida
        </motion.p>

        <h1 className="display max-w-5xl text-[clamp(2.6rem,8vw,7.5rem)] font-bold text-white">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease, delay: 0.35 + i * 0.12 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.9 }}
        >
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75 md:text-xl">
            Alquiler, construcción y mantenimiento de trailers modulares para la industria. Viviendas, comedores, oficinas y
            pañoles listos para instalar en obra.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/#contacto"
              className="group inline-flex items-center gap-3 bg-brand px-8 py-4 font-display text-sm font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:bg-brand-600"
            >
              Cotizar ahora
              <Icon name="arrow" className="size-4 transition-transform duration-500 ease-premium group-hover:translate-x-1" />
            </Link>
            <Link
              href="/#flota"
              className="group inline-flex items-center gap-3 border border-white/40 px-8 py-4 font-display text-sm font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:border-white hover:bg-white hover:text-ink"
            >
              Ver flota
              <Icon name="arrow" className="size-4 transition-transform duration-500 ease-premium group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Cota decorativa estilo plano */}
      <div className="pointer-events-none absolute right-10 bottom-36 hidden items-center gap-3 text-white/45 lg:flex" aria-hidden="true">
        <span className="h-3 w-px bg-white/45" />
        <span className="h-px w-40 bg-white/30" />
        <span className="font-display text-xs tracking-[0.3em]">12.00 M</span>
        <span className="h-px w-40 bg-white/30" />
        <span className="h-3 w-px bg-white/45" />
      </div>

      <a
        href="#intro"
        className="absolute bottom-32 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 lg:flex"
        aria-label="Bajar"
      >
        <motion.span
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon name="scroll" className="size-8" />
        </motion.span>
        <span className="font-display text-[0.65rem] tracking-[0.35em]">SCROLL</span>
      </a>
    </section>
  );
}
