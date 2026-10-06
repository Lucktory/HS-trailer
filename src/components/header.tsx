"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";
import { Icon } from "./icons";
import { Logo } from "./logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,border-color,backdrop-filter] duration-500 ${
        solid ? "border-b border-ink/10 bg-white/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-[4.5rem] items-center justify-between">
        <Link href="/" aria-label="HS Trailers — inicio" onClick={() => setOpen(false)}>
          <Logo tone={solid ? "dark" : "light"} />
        </Link>

        <nav className="hidden items-center gap-10 lg:flex" aria-label="Principal">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative font-display text-[0.8rem] font-medium tracking-[0.22em] uppercase transition-colors ${solid ? "text-ink/70 hover:text-ink" : "text-white/80 hover:text-white"}`}
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-brand transition-all duration-500 ease-premium group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#contacto"
            className="hidden bg-brand px-6 py-3 font-display text-[0.8rem] font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:bg-brand-600 sm:inline-block"
          >
            Cotizar
          </Link>
          <button
            type="button"
            className={`grid size-11 place-items-center lg:hidden ${solid ? "text-ink" : "text-white"}`}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-premium lg:hidden ${open ? "max-h-[80vh]" : "max-h-0"}`}
      >
        <nav className="container-x flex flex-col gap-1 pb-8" aria-label="Móvil">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="display border-b border-ink/10 py-4 text-3xl font-semibold text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#contacto"
            onClick={() => setOpen(false)}
            className="mt-6 bg-brand py-4 text-center font-display text-sm font-semibold tracking-[0.2em] text-white uppercase"
          >
            Solicitar cotización
          </Link>
        </nav>
      </div>
    </header>
  );
}
