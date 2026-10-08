"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  if (images.length < 2) return null;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_12rem]">
      <div className="relative aspect-[16/8] overflow-hidden border border-ink/10 bg-ink">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={images[index]}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* La foto se ve entera (vertical u horizontal) sobre una copia desenfocada de sí misma */}
            <Image src={images[index]} alt="" aria-hidden fill sizes="40vw" className="scale-110 object-cover opacity-60 blur-2xl" />
            <Image src={images[index]} alt={`${alt} — imagen ${index + 1}`} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-contain" />
          </motion.div>
        </AnimatePresence>
      </div>
      {/* En escritorio la columna de miniaturas no pasa del alto de la foto; con muchas fotos, se desplaza */}
      <div className="relative min-w-0">
        <div className="flex gap-4 overflow-x-auto lg:absolute lg:inset-0 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:[scrollbar-width:thin]">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === index}
              className={`relative aspect-video w-40 shrink-0 overflow-hidden border-2 transition-colors lg:w-full ${
                i === index ? "border-brand" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="12rem" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
