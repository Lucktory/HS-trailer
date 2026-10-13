import type { Metadata } from "next";
import { FixturesPreview } from "@/components/fixtures-preview";
import { SectionHeading } from "@/components/ui";

// Revision de los equipos 3D con luz de dia: sin enlaces ni sitemap, y fuera de los buscadores
export const metadata: Metadata = {
  title: "Equipos 3D (prototipo)",
  robots: { index: false, follow: false },
};

export default function Equipos3DPage() {
  return (
    <section className="bg-ink pt-32 pb-24 md:pb-32">
      <div className="container-x">
        <SectionHeading tone="dark" size="md" eyebrow="Prototipo" title="Equipos 3D con luz de d&iacute;a" />
        <div className="mt-12">
          <FixturesPreview />
        </div>
      </div>
    </section>
  );
}
