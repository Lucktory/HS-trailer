import Link from "next/link";
import { nav, site, whatsappLink } from "@/lib/site";
import { Icon, WhatsAppIcon } from "./icons";
import { Logo } from "./logo";

export function Footer() {
  const social = [
    { href: site.social.linkedin, icon: "linkedin" as const, label: "LinkedIn" },
    { href: site.social.instagram, icon: "instagram" as const, label: "Instagram" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-white/10 bg-ink pb-[env(safe-area-inset-bottom)]">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo className="h-14" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">{site.description}</p>
        </div>
        <ul className="space-y-3 text-sm text-white/70">
          <li className="flex items-center gap-3">
            <Icon name="pin" className="size-4 text-brand" />
            {site.location}
          </li>
          <li>
            <a href={whatsappLink()} target="_blank" rel="noopener" className="flex items-center gap-3 hover:text-white">
              <Icon name="phone" className="size-4 text-brand" />
              {site.phoneDisplay}
            </a>
          </li>
          <li className="flex items-center gap-3">
            <Icon name="mail" className="size-4 text-brand" />
            <span className="select-all">{site.email}</span>
          </li>
        </ul>
        <div className="flex flex-col gap-6 md:items-end">
          <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Pie de página">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="font-display text-sm tracking-[0.18em] text-white/70 uppercase hover:text-white">
                {n.label}
              </Link>
            ))}
          </nav>
          {social.length > 0 && (
            <div className="flex gap-3">
              {social.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener" aria-label={s.label} className="grid size-10 place-items-center border border-white/15 text-white/80 hover:border-brand hover:text-white">
                  <Icon name={s.icon} className="size-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="container-x flex flex-wrap justify-between gap-4 border-t border-white/10 py-6 text-xs text-white/40">
        <p>
          © {new Date().getFullYear()} {site.name}. {site.tagline}.
        </p>
        <p className="tracking-[0.2em] uppercase">Patagonia · Argentina</p>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener"
      aria-label="Escribinos por WhatsApp"
      className="fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lg shadow-black/40 transition-transform duration-300 hover:scale-110"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
