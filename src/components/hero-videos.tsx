"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIntroDone } from "./intro";

// Reproduce los videos del hero uno tras otro, en bucle, con fundido entre ellos.
// PLAYBACK_RATE acelera los clips (1 = velocidad original).
const PLAYBACK_RATE = 1.5;
const FADE_MS = 900;

const clips = ["/video/hs-1", "/video/hs-2", "/video/hs-3"];

export function HeroVideos({ className = "" }: { className?: string }) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion() ?? false;
  const visible = useRef(true);
  const ready = useIntroDone();

  // Reproducir el clip activo; los demás quedan en pausa y listos desde el inicio
  useEffect(() => {
    if (reduced) return;
    refs.current.forEach((v, i) => {
      if (!v) return;
      v.defaultPlaybackRate = PLAYBACK_RATE;
      v.playbackRate = PLAYBACK_RATE;
      if (i === active) {
        v.currentTime = 0;
        if (!ready) v.pause();
        else if (visible.current) v.play().catch(() => {});
      } else {
        // se pausa recién cuando terminó el fundido
        window.setTimeout(() => v.pause(), FADE_MS);
      }
    });
    // Precargar el siguiente clip
    const next = refs.current[(active + 1) % clips.length];
    if (next && next.preload !== "auto") {
      next.preload = "auto";
      next.load();
    }
  }, [active, reduced, ready]);

  // Pausar cuando el hero sale de pantalla
  useEffect(() => {
    const el = refs.current[0]?.parentElement;
    if (!el || reduced) return;
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      const v = refs.current[active];
      if (!v) return;
      if (e.isIntersecting && ready) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [active, reduced, ready]);

  return (
    <div className={`relative h-full w-full ${className}`}>
      {clips.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out"
          style={{ opacity: i === active ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
          poster={i === 0 ? `${src}-poster.jpg` : undefined}
          muted
          playsInline
          autoPlay={i === 0 && !reduced}
          preload={i === 0 ? "auto" : "none"}
          onEnded={() => setActive((i + 1) % clips.length)}
          aria-hidden="true"
        >
          <source src={`${src}.webm`} type="video/webm" />
          <source src={`${src}.mp4`} type="video/mp4" />
        </video>
      ))}
    </div>
  );
}
