import Image from "next/image";
import onDark from "@/assets/brand/logo-on-dark.png";
import onLight from "@/assets/brand/logo-on-light.png";

// tone="light": texto blanco (sobre fondos oscuros) · tone="dark": texto oscuro (sobre fondos claros).
// Ambas versiones quedan superpuestas para que el cambio en el header sea un fundido suave.
export function Logo({ tone = "light", className = "h-11" }: { tone?: "light" | "dark"; className?: string }) {
  const img = "absolute inset-0 h-full w-full transition-opacity duration-500";
  return (
    <span className={`relative block ${className}`} style={{ aspectRatio: `${onDark.width} / ${onDark.height}` }}>
      <Image src={onDark} alt="HS Trailers" priority sizes="180px" className={`${img} ${tone === "light" ? "opacity-100" : "opacity-0"}`} />
      <Image src={onLight} alt="" aria-hidden priority sizes="180px" className={`${img} ${tone === "dark" ? "opacity-100" : "opacity-0"}`} />
    </span>
  );
}
