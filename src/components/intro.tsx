"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { INTRO_EVENT, INTRO_KEY, onIntroDone } from "@/lib/intro";
import { Icon } from "./icons";

const ease = [0.22, 1, 0.36, 1] as const;
// Si el video no avanza en este tiempo (red lenta, autoplay bloqueado), se pasa directo al sitio
const STALL_MS = 5000;

// true cuando no hay intro o cuando el telón empieza a subir: el hero espera a esto para animarse y reproducir.
export function useIntroDone() {
  const [done, setDone] = useState(() => typeof document !== "undefined" && document.documentElement.dataset.intro !== "on");
  useEffect(() => onIntroDone(() => setDone(true)), []);
  return done;
}

// Telón con el video de presentación. Solo se ve si <html data-intro> lo pide (ver lib/intro.ts).
export function Intro() {
  const [leaving, setLeaving] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const glowRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const leave = useRef(() => {});

  useEffect(() => {
    const root = document.documentElement;
    const v = videoRef.current;
    if (root.dataset.intro !== "on" || !v) return;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}

    let gone = false;
    let frame = 0;
    const go = () => {
      if (gone) return;
      gone = true;
      cancelAnimationFrame(frame);
      if (barRef.current) barRef.current.style.transform = "scaleX(1)";
      root.dataset.intro = "leaving";
      window.dispatchEvent(new Event(INTRO_EVENT));
      setLeaving(true);
    };
    leave.current = go;

    // Cada cuadro: barra de avance, control de video trabado y resplandor (el cuadro en miniatura,
    // ampliado y desenfocado detrás del video; rellena arriba y abajo en pantallas verticales)
    const glow = glowRef.current?.getContext("2d");
    let seen = -1;
    let movedAt = performance.now();
    frame = requestAnimationFrame(function tick(now) {
      if (v.currentTime !== seen) {
        seen = v.currentTime;
        movedAt = now;
      } else if (now - movedAt > STALL_MS) {
        return go();
      }
      if (v.readyState >= 2) glow?.drawImage(v, 0, 0, 32, 18);
      if (barRef.current && v.duration) barRef.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
      frame = requestAnimationFrame(tick);
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") go();
    };
    v.addEventListener("ended", go);
    v.addEventListener("error", go);
    window.addEventListener("keydown", onKey);
    v.muted = true;
    v.play().catch(go);
    return () => {
      cancelAnimationFrame(frame);
      v.removeEventListener("ended", go);
      v.removeEventListener("error", go);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <motion.div
      id="intro"
      className="fixed inset-0 z-[100] touch-none overflow-hidden overscroll-none bg-[#545354]"
      animate={leaving ? { y: "-100%" } : undefined}
      transition={{ duration: 1.1, ease }}
      onAnimationComplete={() => {
        if (!leaving) return;
        document.documentElement.dataset.intro = "done";
        videoRef.current?.pause();
      }}
    >
      <canvas ref={glowRef} width={32} height={18} className="absolute inset-0 size-full scale-125 object-cover blur-2xl" aria-hidden="true" />
      {/* Horizontal: cubre la pantalla. Vertical: banda ancha centrada, para que el logo final entre completo */}
      <video
        ref={videoRef}
        id="intro-video"
        className="absolute top-1/2 left-1/2 aspect-video w-[min(max(100vw,177.78vh),160vw)] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover [@media(max-aspect-ratio:1/1)]:[mask-image:linear-gradient(transparent,black_18%,black_82%,transparent)]"
        poster="/video/intro-poster.jpg"
        muted
        playsInline
        preload="none"
        aria-hidden="true"
      >
        <source src="/video/intro.webm" type="video/webm" />
        <source src="/video/intro.mp4" type="video/mp4" />
      </video>

      <motion.div
        className="absolute right-5 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] flex gap-2 md:right-10 md:bottom-10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: leaving ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: leaving ? 0 : 0.8 }}
      >
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Activar sonido" : "Silenciar"}
          className="grid size-11 place-items-center bg-ink/55 text-white backdrop-blur-md transition-colors hover:bg-ink/80"
        >
          <Icon name={muted ? "soundOff" : "soundOn"} className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => leave.current()}
          className="inline-flex h-11 items-center gap-3 bg-ink/55 px-5 font-display text-xs font-semibold tracking-[0.2em] text-white uppercase backdrop-blur-md transition-colors hover:bg-ink/80"
        >
          Saltar intro
          <Icon name="skip" className="size-4" />
        </button>
      </motion.div>

      {/* Avance del video; al subir el telón queda como su borde rojo */}
      <span ref={barRef} className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand" />
    </motion.div>
  );
}
