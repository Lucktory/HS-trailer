import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/ui";
import { Walkthrough } from "@/components/walkthrough";
import { getVariant } from "@/lib/fleet";

// Prototipo del recorrido 3D: sin enlaces ni sitemap, y fuera de los buscadores
export const metadata: Metadata = {
  title: "Recorrido 3D (prototipo)",
  robots: { index: false, follow: false },
};

export default function Prototipo3DPage() {
  const found = getVariant("panol-12m");
  if (!found) notFound();
  const { unit, variant } = found;
  return (
    <section className="bg-ink pt-32 pb-24 md:pb-32">
      <div className="container-x">
        <SectionHeading tone="dark" size="md" eyebrow="Prototipo" title={`Recorrido 3D: ${unit.name} ${variant.size}`} />
        <div className="mt-12">
          <Walkthrough plan={variant.plan} />
        </div>
      </div>
    </section>
  );
}
