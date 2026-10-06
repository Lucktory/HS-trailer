"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { onIntroDone } from "@/lib/intro";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } });
    if (document.documentElement.dataset.intro === "on") lenis.stop();
    const offIntro = onIntroDone(() => lenis.start());
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      offIntro();
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return null;
}
