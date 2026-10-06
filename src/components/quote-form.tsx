"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { SIZES, catalog, generators } from "@/lib/fleet";
import { whatsappLink } from "@/lib/site";
import { Icon, WhatsAppIcon } from "./icons";

// Un grupo por medida (los 12 modelos) + otros servicios
const groups = [
  ...SIZES.map((size) => ({
    label: `Módulos ${size}`,
    options: catalog.filter((c) => c.size === size).map((c) => ({ value: c.id, label: `${c.name} ${size}` })),
  })),
  {
    label: "Otros",
    options: [
      { value: generators.slug, label: generators.name },
      { value: "a-medida", label: "Construcción a medida" },
      { value: "mantenimiento", label: "Mantenimiento" },
    ],
  },
];
const moduleOptions = groups.flatMap((g) => g.options);

const field =
  "w-full border-b border-white/20 bg-transparent py-3 text-white placeholder:text-white/35 outline-none transition-colors focus:border-brand";
const label = "eyebrow text-[0.7rem] text-white/55";

export function QuoteForm() {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [sent, setSent] = useState(false);

  // Permite llegar con el módulo preseleccionado: /?modulo=comedor-6m#contacto
  useEffect(() => {
    const m = new URLSearchParams(window.location.search).get("modulo");
    if (m && selectRef.current && moduleOptions.some((o) => o.value === m)) selectRef.current.value = m;
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    const moduloLabel = moduleOptions.find((o) => o.value === get("modulo"))?.label ?? "";
    const lines = [
      // El "\n" final deja una línea en blanco (un "" suelto lo descartaría filter(Boolean))
      "Hola HS Trailers, quisiera una cotización.\n",
      `Nombre: ${get("nombre")}`,
      get("empresa") && `Empresa: ${get("empresa")}`,
      `Módulo: ${moduloLabel}`,
      get("cantidad") && `Cantidad: ${get("cantidad")}`,
      get("ubicacion") && `Ubicación de la obra: ${get("ubicacion")}`,
      get("inicio") && `Fecha estimada de inicio: ${get("inicio")}`,
      get("duracion") && `Duración estimada: ${get("duracion")}`,
      get("mensaje") && `\n${get("mensaje")}`,
    ].filter(Boolean);
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener");
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      <label className="block">
        <span className={label}>Nombre *</span>
        <input name="nombre" required autoComplete="name" className={field} placeholder="Tu nombre" />
      </label>
      <label className="block">
        <span className={label}>Empresa</span>
        <input name="empresa" autoComplete="organization" className={field} placeholder="Razón social" />
      </label>
      <label className="block">
        <span className={label}>Módulo *</span>
        <span className="relative block">
        <select
          name="modulo"
          required
          ref={selectRef}
          defaultValue=""
          className={`${field} appearance-none pr-8 [&_optgroup]:bg-ink [&_option]:bg-ink`}
        >
          <option value="" disabled>
            Seleccioná una opción
          </option>
          {groups.map((g) => (
            <optgroup key={g.label} label={g.label} className="bg-ink">
              {g.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <Icon name="caretDown" className="pointer-events-none absolute top-1/2 right-1 size-4 -translate-y-1/2 text-white/70" />
        </span>
      </label>
      <label className="block">
        <span className={label}>Cantidad</span>
        <input name="cantidad" inputMode="numeric" className={field} placeholder="Ej: 4 unidades" />
      </label>
      <label className="block">
        <span className={label}>Ubicación de la obra</span>
        <input name="ubicacion" className={field} placeholder="Ciudad / yacimiento" />
      </label>
      <label className="block">
        <span className={label}>Inicio estimado</span>
        <input name="inicio" className={field} placeholder="Ej: noviembre 2026" />
      </label>
      <label className="block sm:col-span-2">
        <span className={label}>Duración estimada</span>
        <input name="duracion" className={field} placeholder="Ej: 6 meses" />
      </label>
      <label className="block sm:col-span-2">
        <span className={label}>Mensaje</span>
        <textarea name="mensaje" rows={3} className={`${field} resize-none`} placeholder="Contanos sobre tu proyecto" />
      </label>
      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
        <button
          type="submit"
          className="group inline-flex items-center gap-3 bg-brand px-8 py-4 font-display text-sm font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:bg-brand-600"
        >
          <WhatsAppIcon className="size-5" />
          Enviar por WhatsApp
          <Icon name="arrow" className="size-4 transition-transform duration-500 ease-premium group-hover:translate-x-1" />
        </button>
        <p className="text-sm text-white/50" aria-live="polite">
          {sent ? "Se abrió WhatsApp con tu consulta. Solo tenés que enviarla." : "Te respondemos a la brevedad."}
        </p>
      </div>
    </form>
  );
}
