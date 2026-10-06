// Datos de contacto y marca. TODO: reemplazar los valores marcados con los datos reales del cliente.
export const site = {
  name: "HS Trailers",
  tagline: "Soluciones logísticas a medida",
  description:
    "Alquiler, construcción y mantenimiento de trailers modulares habitacionales, comedores, oficinas y pañoles para campamentos de la industria en Patagonia.",
  url: "https://hstrailers.com.ar", // TODO: dominio definitivo
  whatsapp: "5492990000000", // TODO: número real, formato internacional sin "+" ni espacios
  phoneDisplay: "+54 9 299 000-0000", // TODO
  email: "info@hstrailers.com.ar", // TODO
  location: "Patagonia, Argentina", // TODO: ciudad / base operativa
  social: {
    instagram: "", // TODO: URL (se oculta si está vacío)
    linkedin: "", // TODO
  },
};

// Datos de Open Graph comunes a todas las páginas (título y descripción los pone cada una)
export const baseOpenGraph = { type: "website", locale: "es_AR", siteName: site.name } as const;

export function whatsappLink(message?: string) {
  const text = message ?? "Hola HS Trailers, quisiera recibir una cotización.";
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const nav = [
  { href: "/#flota", label: "Equipos" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];
