import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { Intro } from "@/components/intro";
import { Contact, Equipment, FeaturedPlan, Fleet, Highlights, IntegralService, Process, WhyUs } from "@/components/sections";

// Canonical de la home (cubre también los /?modulo=<id> del formulario)
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <Intro />
      <Hero />
      <Highlights />
      <Fleet />
      <Equipment />
      <IntegralService />
      <FeaturedPlan />
      <WhyUs />
      <Process />
      <Contact />
    </>
  );
}
