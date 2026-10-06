import type { Metadata, Viewport } from "next";
import { Mona_Sans } from "next/font/google";
import { Footer, WhatsAppFloat } from "@/components/footer";
import { Header } from "@/components/header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { introScript } from "@/lib/intro";
import { baseOpenGraph, site } from "@/lib/site";
import "./globals.css";

// Mona Sans (GitHub) — variable en peso y ancho: una sola familia para títulos anchos, etiquetas y texto.
const mona = Mona_Sans({
  variable: "--font-mona",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Alquiler de trailers habitacionales y modulares`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "alquiler de trailers",
    "trailers habitacionales",
    "trailer vivienda",
    "trailer comedor",
    "trailer oficina",
    "pañol",
    "campamentos",
    "Neuquén",
    "Vaca Muerta",
    "Patagonia",
  ],
  openGraph: {
    ...baseOpenGraph,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: "/img/secciones/servicio.jpg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1220",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: el script del <head> agrega data-intro a <html> antes de React
    <html lang="es-AR" className={mona.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="grain min-h-dvh">
        <SmoothScroll />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
