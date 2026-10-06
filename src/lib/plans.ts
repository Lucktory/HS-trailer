// Planos de cada variante. Los de Vivienda, Comedor y Oficina 12 m y el Pañol siguen el catálogo PDF;
// el resto son configuraciones estimadas (ver SUPUESTOS.md).
import { bed, chair, shower, sink, toilet, urinal, type Plan, type Shape } from "./plan";

/* ---------- Tráiler Vivienda 12 m ---------- */

export const vivienda12: Plan = {
  length: 1200,
  width: 244,
  zones: [
    {
      id: "d1",
      label: "Dormitorio 1",
      x: 0,
      y: 0,
      w: 300,
      h: 244,
      items: ["2 camas individuales", "Armario con llave", "2 paneles calefactores 550W", "Aire acondicionado 3500 frigorías"],
    },
    {
      id: "bano",
      label: "Baño completo",
      x: 300,
      y: 0,
      w: 260,
      h: 150,
      items: ["Inodoro y bidet", "Lavamanos con espejo", "Ducha (receptáculo 90 cm)", "Panel calefactor 550W"],
    },
    {
      id: "cocina",
      label: "Cocina / Comedor",
      x: 560,
      y: 0,
      w: 340,
      h: 244,
      mx: 630,
      my: 150,
      items: ["Mesada con bajo mesada y alacena", "Heladera con freezer", "Mesa y 4 sillas", "Termotanque 40 L"],
    },
    {
      id: "d2",
      label: "Dormitorio 2",
      x: 900,
      y: 0,
      w: 300,
      h: 244,
      items: ["2 camas individuales", "Armario con llave", "2 paneles calefactores 550W", "Aire acondicionado 3500 frigorías"],
    },
  ],
  shapes: [
    // Muros interiores
    { t: "wall", x1: 300, y1: 0, x2: 300, y2: 160 },
    { t: "wall", x1: 300, y1: 150, x2: 400, y2: 150 },
    { t: "wall", x1: 470, y1: 150, x2: 560, y2: 150 },
    { t: "wall", x1: 560, y1: 0, x2: 560, y2: 150 },
    { t: "wall", x1: 900, y1: 0, x2: 900, y2: 160 },
    // Puertas
    { t: "door", x: 300, y: 240, w: 76, to: "left" },
    { t: "door", x: 400, y: 150, w: 70, to: "up" },
    { t: "gap", x: 450, y: 239, w: 90, h: 10 },
    { t: "door", x: 450, y: 244, w: 90, to: "down" },
    { t: "door", x: 900, y: 240, w: 76, to: "right" },
    // Ventanas
    { t: "window", x: 60, y: 244, w: 120 },
    { t: "window", x: 1020, y: 244, w: 120 },
    { t: "window", x: 680, y: 244, w: 120 },
    { t: "window", x: 360, y: 0, w: 60 },
    // Dormitorio 1
    ...bed(5, 8),
    ...bed(5, 156),
    { t: "rect", x: 8, y: 102, w: 40, h: 40 },
    { t: "rect", x: 247, y: 8, w: 48, h: 110 },
    { t: "line", x1: 271, y1: 8, x2: 271, y2: 118 },
    // Baño
    { t: "rect", x: 470, y: 6, w: 84, h: 84 },
    { t: "line", x1: 470, y1: 6, x2: 554, y2: 90 },
    { t: "circle", cx: 440, cy: 40, r: 18 },
    { t: "rect", x: 426, y: 8, w: 28, h: 12 },
    { t: "circle", cx: 380, cy: 36, r: 14 },
    { t: "rect", x: 308, y: 100, w: 50, h: 42 },
    { t: "circle", cx: 333, cy: 121, r: 12 },
    // Cocina / comedor (PDF p. 4: mesa contra el muro superior, pasillo libre junto al muro inferior)
    { t: "rect", x: 564, y: 6, w: 58, h: 64, fill: true },
    { t: "rect", x: 624, y: 6, w: 110, h: 60 },
    { t: "rect", x: 644, y: 16, w: 40, h: 36 },
    { t: "circle", cx: 712, cy: 36, r: 12 },
    { t: "rect", x: 776, y: 6, w: 80, h: 120 },
    chair(738, 20),
    chair(738, 78),
    chair(860, 20),
    chair(860, 78),
    // Dormitorio 2
    ...bed(1005, 8, 190, 80, true),
    ...bed(1005, 156, 190, 80, true),
    { t: "rect", x: 1155, y: 102, w: 40, h: 40 },
    { t: "rect", x: 905, y: 8, w: 48, h: 110 },
    { t: "line", x1: 929, y1: 8, x2: 929, y2: 118 },
  ],
};

/* ---------- Tráiler Comedor 12 m ---------- */

const comedorChairs: Shape[] = [];
for (let i = 0; i < 12; i++) {
  const x = 318 + i * 70;
  comedorChairs.push(chair(x, 40, 40, 34), chair(x, 172, 40, 34));
}

export const comedor12: Plan = {
  length: 1200,
  width: 244,
  zones: [
    {
      id: "cocina",
      label: "Cocina",
      x: 0,
      y: 0,
      w: 200,
      h: 244,
      items: ["Mesada y pileta de acero inoxidable", "Bajo mesada y alacena", "Heladera con freezer", "Termotanque 40 L"],
    },
    {
      id: "comedor",
      label: "Comedor 25 personas",
      x: 200,
      y: 0,
      w: 1000,
      h: 244,
      items: ["Mesa móvil de melamina en caño estructural", "25 sillas", "2 aires acondicionados 3500 frigorías", "TV Smart 55\" con soporte"],
    },
  ],
  shapes: [
    { t: "gap", x: 80, y: 239, w: 92, h: 10 },
    { t: "door", x: 80, y: 244, w: 92, to: "down" },
    { t: "window", x: 250, y: 244, w: 120 },
    { t: "window", x: 460, y: 244, w: 120 },
    { t: "window", x: 670, y: 244, w: 120 },
    { t: "window", x: 880, y: 244, w: 120 },
    { t: "window", x: 460, y: 0, w: 120 },
    { t: "window", x: 800, y: 0, w: 120 },
    // Cocina
    { t: "circle", cx: 40, cy: 40, r: 28 },
    { t: "rect", x: 6, y: 80, w: 60, h: 90 },
    { t: "rect", x: 16, y: 104, w: 40, h: 40 },
    { t: "rect", x: 6, y: 176, w: 60, h: 60, fill: true },
    // Mesa y sillas
    { t: "rect", x: 300, y: 82, w: 850, h: 80 },
    { t: "line", x1: 512, y1: 82, x2: 512, y2: 162 },
    { t: "line", x1: 725, y1: 82, x2: 725, y2: 162 },
    { t: "line", x1: 937, y1: 82, x2: 937, y2: 162 },
    ...comedorChairs,
    chair(254, 104, 34, 40),
    // TV
    { t: "rect", x: 1188, y: 80, w: 8, h: 84, fill: true },
  ],
};

/* ---------- Tráiler Oficina 12 m ---------- */

const officeDesks: Shape[] = [];
[70, 360, 650, 940].forEach((x) => {
  officeDesks.push(
    { t: "rect", x, y: 8, w: 130, h: 120 },
    { t: "line", x1: x + 65, y1: 8, x2: x + 65, y2: 128 },
    chair(x - 44, 40, 36, 40),
    chair(x + 138, 40, 36, 40),
  );
});

export const oficina12: Plan = {
  length: 1200,
  width: 244,
  zones: [
    {
      id: "puestos",
      label: "Puestos de trabajo",
      x: 0,
      y: 0,
      w: 1200,
      h: 150,
      mx: 570,
      my: 75,
      items: ["8 escritorios de melamina", "8 sillas ergonómicas", "TV Smart 55\" con soporte"],
    },
    {
      id: "guardado",
      label: "Guardado y confort",
      x: 0,
      y: 150,
      w: 1200,
      h: 94,
      mx: 600,
      my: 172,
      items: ["3 muebles biblioteca de melamina", "Dispenser frío / calor", "2 aires acondicionados 3500 frigorías", "2 paneles calefactores 550W"],
    },
  ],
  shapes: [
    { t: "gap", x: 300, y: 239, w: 86, h: 10 },
    { t: "door", x: 300, y: 244, w: 86, to: "down" },
    { t: "window", x: 80, y: 244, w: 120 },
    { t: "window", x: 500, y: 244, w: 120 },
    { t: "window", x: 750, y: 244, w: 120 },
    { t: "window", x: 1000, y: 244, w: 120 },
    ...officeDesks,
    { t: "rect", x: 20, y: 200, w: 180, h: 38 },
    { t: "rect", x: 520, y: 200, w: 180, h: 38 },
    { t: "rect", x: 1000, y: 200, w: 180, h: 38 },
    { t: "rect", x: 1188, y: 60, w: 8, h: 84, fill: true },
  ],
};

/* ---------- Pañol con estanterías ---------- */

const shelfLines: Shape[] = [];
for (let x = 190; x < 1190; x += 100) {
  shelfLines.push({ t: "line", x1: x, y1: 6, x2: x, y2: 66 }, { t: "line", x1: x, y1: 178, x2: x, y2: 238 });
}

export const panol12: Plan = {
  length: 1200,
  width: 244,
  padLeft: 170,
  zones: [
    {
      id: "est-a",
      label: "Estantería lateral A",
      x: 90,
      y: 0,
      w: 1110,
      h: 72,
      items: ["Estructura metálica", "Estantes de madera", "Altura de piso a techo"],
    },
    {
      id: "pasillo",
      label: "Pasillo y acceso",
      x: 0,
      y: 72,
      w: 1200,
      h: 100,
      items: ["Puertas originales de contenedor", "Pasillo central de circulación", "Iluminación interior"],
    },
    {
      id: "est-b",
      label: "Estantería lateral B",
      x: 90,
      y: 172,
      w: 1110,
      h: 72,
      items: ["Estructura metálica", "Estantes de madera", "Altura de piso a techo"],
    },
  ],
  shapes: [
    { t: "gap", x: -5, y: 4, w: 10, h: 236 },
    { t: "door", x: 0, y: 4, w: 118, to: "left", flip: true },
    { t: "door", x: 0, y: 240, w: 118, to: "left" },
    { t: "rect", x: 90, y: 6, w: 1100, h: 60 },
    { t: "rect", x: 90, y: 178, w: 1100, h: 60 },
    ...shelfLines,
  ],
};


/* ======================= Configuraciones estimadas (a confirmar con el cliente) ======================= */

/* ---------- Tráiler Comedor 6 m: misma cocina que el de 12 m, mesa para 12 ---------- */

const comedor6Chairs: Shape[] = [];
for (let i = 0; i < 6; i++) {
  const x = 175 + i * 57;
  comedor6Chairs.push(chair(x, 40, 40, 34), chair(x, 170, 40, 34));
}

export const comedor6: Plan = {
  length: 600,
  width: 244,
  zones: [
    { id: "cocina", label: "Cocina", x: 0, y: 0, w: 110, h: 244, mx: 90, my: 60, items: ["Mesada con alacena y pileta de acero inoxidable", "Heladera con freezer", "Termotanque 40 L", "Dispenser frío / calor"] },
    { id: "comedor", label: "Comedor 12 personas", x: 110, y: 0, w: 490, h: 244, items: ["Mesa de melamina y 12 sillas", "Aire acondicionado 3500 frigorías", "Panel calefactor 550W", "TV Smart 55\" con soporte"] },
  ],
  shapes: [
    { t: "gap", x: 80, y: 239, w: 90, h: 10 },
    { t: "door", x: 80, y: 244, w: 90, to: "down" },
    { t: "window", x: 250, y: 244, w: 110 },
    { t: "window", x: 420, y: 244, w: 110 },
    { t: "window", x: 250, y: 0, w: 110 },
    { t: "window", x: 420, y: 0, w: 110 },
    // Cocina
    { t: "circle", cx: 40, cy: 40, r: 28 },
    { t: "rect", x: 72, y: 6, w: 28, h: 28 },
    { t: "rect", x: 6, y: 80, w: 60, h: 90 },
    { t: "rect", x: 16, y: 104, w: 40, h: 40 },
    { t: "rect", x: 6, y: 176, w: 60, h: 60, fill: true },
    // Mesa y sillas
    { t: "rect", x: 170, y: 82, w: 350, h: 80 },
    { t: "line", x1: 345, y1: 82, x2: 345, y2: 162 },
    ...comedor6Chairs,
    { t: "rect", x: 588, y: 80, w: 8, h: 84, fill: true },
  ],
};

/* ---------- Tráiler Oficina 6 m: 4 puestos (2 módulos dobles) ---------- */

const office6Desks: Shape[] = [];
[80, 370].forEach((x) => {
  office6Desks.push(
    { t: "rect", x, y: 8, w: 130, h: 120 },
    { t: "line", x1: x + 65, y1: 8, x2: x + 65, y2: 128 },
    chair(x - 44, 40, 36, 40),
    chair(x + 138, 40, 36, 40),
  );
});

export const oficina6: Plan = {
  length: 600,
  width: 244,
  zones: [
    { id: "puestos", label: "Puestos de trabajo", x: 0, y: 0, w: 600, h: 150, items: ["4 escritorios de melamina", "4 sillas ergonómicas", "TV Smart 55\" con soporte"] },
    { id: "guardado", label: "Guardado y confort", x: 0, y: 150, w: 600, h: 94, items: ["Mueble biblioteca de melamina", "Dispenser frío / calor", "Aire acondicionado 3500 frigorías", "Panel calefactor 550W"] },
  ],
  shapes: [
    { t: "gap", x: 300, y: 239, w: 86, h: 10 },
    { t: "door", x: 300, y: 244, w: 86, to: "down" },
    { t: "window", x: 60, y: 244, w: 120 },
    ...office6Desks,
    { t: "rect", x: 400, y: 200, w: 150, h: 38 },
    { t: "rect", x: 560, y: 204, w: 28, h: 32 },
    { t: "rect", x: 588, y: 60, w: 8, h: 84, fill: true },
  ],
};

/* ---------- Pañol 6 m ---------- */

const shelfLines6: Shape[] = [];
for (let x = 190; x < 590; x += 100) {
  shelfLines6.push({ t: "line", x1: x, y1: 6, x2: x, y2: 66 }, { t: "line", x1: x, y1: 178, x2: x, y2: 238 });
}

export const panol6: Plan = {
  length: 600,
  width: 244,
  padLeft: 170,
  zones: [
    { id: "est-a", label: "Estantería lateral A", x: 90, y: 0, w: 510, h: 72, items: ["Estructura metálica", "Estantes de madera", "Altura de piso a techo"] },
    { id: "pasillo", label: "Pasillo y acceso", x: 0, y: 72, w: 600, h: 100, items: ["Puertas originales de contenedor", "Pasillo central de circulación", "Iluminación interior"] },
    { id: "est-b", label: "Estantería lateral B", x: 90, y: 172, w: 510, h: 72, items: ["Estructura metálica", "Estantes de madera", "Altura de piso a techo"] },
  ],
  shapes: [
    { t: "gap", x: -5, y: 4, w: 10, h: 236 },
    { t: "door", x: 0, y: 4, w: 118, to: "left", flip: true },
    { t: "door", x: 0, y: 240, w: 118, to: "left" },
    { t: "rect", x: 90, y: 6, w: 500, h: 60 },
    { t: "rect", x: 90, y: 178, w: 500, h: 60 },
    ...shelfLines6,
  ],
};

/* ---------- Tráiler Baño 12 m: inodoros y mingitorios | duchas y lavamanos | acceso y sala técnica | vestuario ---------- */
// Patrón de los tráilers sanitarios petroleros de la región: boxes en un lateral, mingitorios y bachas en el otro.

const bano12Shapes: Shape[] = [];
[0, 90, 180, 270].forEach((x) => bano12Shapes.push(...toilet(x + 45, 0), { t: "door", x: x + 15, y: 100, w: 60, to: "down" }));
[360, 450, 540, 630].forEach((x) => bano12Shapes.push(...shower(x + 4, 6, 82), { t: "door", x: x + 15, y: 100, w: 60, to: "down" }));
[35, 115, 195, 275].forEach((x) => bano12Shapes.push(...urinal(x, 244)));
[92, 172, 252].forEach((x) => bano12Shapes.push({ t: "line", x1: x, y1: 206, x2: x, y2: 244 }));
bano12Shapes.push({ t: "rect", x: 380, y: 200, w: 330, h: 38 });
[412, 478, 544, 610, 676].forEach((cx) => bano12Shapes.push({ t: "circle", cx, cy: 219, r: 12 }));
[880, 1040].forEach((x) => {
  bano12Shapes.push({ t: "rect", x, y: 6, w: 140, h: 40 });
  for (let i = 1; i < 6; i++) bano12Shapes.push({ t: "line", x1: x + (140 / 6) * i, y1: 6, x2: x + (140 / 6) * i, y2: 46 });
});
// Bancos fuera del giro de la puerta del vestuario
[955, 1035, 1115].forEach((x) => bano12Shapes.push({ t: "rect", x, y: 112, w: 70, h: 32 }));

export const bano12: Plan = {
  length: 1200,
  width: 244,
  zones: [
    { id: "inodoros", label: "Inodoros y mingitorios", x: 0, y: 0, w: 360, h: 244, mx: 135, my: 180, items: ["4 inodoros en boxes con puerta", "4 mingitorios con separadores", "Extractor en cada box", "Panel calefactor 550W"] },
    { id: "duchas", label: "Duchas y lavamanos", x: 360, y: 0, w: 360, h: 244, mx: 540, my: 178, items: ["4 duchas 90 × 90 cm con puerta", "Mesada con 5 bachas y espejos", "Dispensers de jabón y toallas", "Aire 3500 frigorías y panel 550W"] },
    { id: "tecnica", label: "Acceso y sala técnica", x: 720, y: 0, w: 130, h: 244, items: ["2 termotanques eléctricos de 150 L", "Ingreso principal", "Paso al vestuario"] },
    { id: "vestuario", label: "Vestuario", x: 850, y: 0, w: 350, h: 244, mx: 1100, my: 180, items: ["2 lockers metálicos de 6 casilleros", "3 bancos y percheros", "Aire 3500 frigorías y 2 paneles 550W"] },
  ],
  shapes: [
    // Boxes de inodoro y de ducha
    { t: "wall", x1: 90, y1: 0, x2: 90, y2: 100 },
    { t: "wall", x1: 180, y1: 0, x2: 180, y2: 100 },
    { t: "wall", x1: 270, y1: 0, x2: 270, y2: 100 },
    { t: "wall", x1: 360, y1: 0, x2: 360, y2: 100 },
    { t: "wall", x1: 450, y1: 0, x2: 450, y2: 100 },
    { t: "wall", x1: 540, y1: 0, x2: 540, y2: 100 },
    { t: "wall", x1: 630, y1: 0, x2: 630, y2: 100 },
    { t: "wall", x1: 720, y1: 0, x2: 720, y2: 100 },
    { t: "wall", x1: 0, y1: 100, x2: 850, y2: 100 },
    // Sala técnica
    { t: "wall", x1: 850, y1: 0, x2: 850, y2: 110 },
    { t: "wall", x1: 850, y1: 190, x2: 850, y2: 244 },
    { t: "door", x: 760, y: 100, w: 60, to: "down" },
    { t: "circle", cx: 752, cy: 46, r: 24 },
    { t: "circle", cx: 812, cy: 46, r: 24 },
    // Acceso y puerta al vestuario
    { t: "gap", x: 740, y: 239, w: 90, h: 10 },
    { t: "door", x: 740, y: 244, w: 90, to: "down" },
    { t: "door", x: 850, y: 190, w: 80, to: "right" },
    { t: "window", x: 960, y: 244, w: 100 },
    ...bano12Shapes,
  ],
};

/* ---------- Tráiler Baño 6 m: la misma organización a media escala ---------- */

const bano6Shapes: Shape[] = [];
[0, 90].forEach((x) => bano6Shapes.push(...toilet(x + 45, 0), { t: "door", x: x + 15, y: 100, w: 60, to: "down" }));
[180, 270].forEach((x) => bano6Shapes.push(...shower(x + 4, 6, 82), { t: "door", x: x + 15, y: 100, w: 60, to: "down" }));
bano6Shapes.push(...urinal(35, 244), ...urinal(115, 244), { t: "line", x1: 92, y1: 206, x2: 92, y2: 244 });
bano6Shapes.push({ t: "rect", x: 190, y: 200, w: 160, h: 38 }, { t: "circle", cx: 230, cy: 219, r: 12 }, { t: "circle", cx: 310, cy: 219, r: 12 });
bano6Shapes.push({ t: "rect", x: 470, y: 6, w: 120, h: 40 });
for (let i = 1; i < 6; i++) bano6Shapes.push({ t: "line", x1: 470 + 20 * i, y1: 6, x2: 470 + 20 * i, y2: 46 });
bano6Shapes.push({ t: "rect", x: 515, y: 196, w: 75, h: 30 }); // banco fuera del giro de la puerta

export const bano6: Plan = {
  length: 600,
  width: 244,
  zones: [
    { id: "inodoros", label: "Inodoros y mingitorios", x: 0, y: 0, w: 180, h: 244, mx: 90, my: 182, items: ["2 inodoros en boxes con puerta", "2 mingitorios con separador", "Extractor en cada box"] },
    { id: "duchas", label: "Duchas y lavamanos", x: 180, y: 0, w: 180, h: 244, mx: 270, my: 178, items: ["2 duchas 90 × 90 cm con puerta", "Mesada con 2 bachas y espejos", "Panel calefactor 550W"] },
    { id: "tecnica", label: "Acceso y sala técnica", x: 360, y: 0, w: 90, h: 244, items: ["Termotanque eléctrico de 150 L", "Ingreso principal", "Paso al vestuario"] },
    { id: "vestuario", label: "Vestuario", x: 450, y: 0, w: 150, h: 244, items: ["Locker metálico de 6 casilleros", "Banco y percheros", "Aire 3500 frigorías y panel 550W"] },
  ],
  shapes: [
    { t: "wall", x1: 90, y1: 0, x2: 90, y2: 100 },
    { t: "wall", x1: 180, y1: 0, x2: 180, y2: 100 },
    { t: "wall", x1: 270, y1: 0, x2: 270, y2: 100 },
    { t: "wall", x1: 360, y1: 0, x2: 360, y2: 100 },
    { t: "wall", x1: 0, y1: 100, x2: 450, y2: 100 },
    { t: "wall", x1: 450, y1: 0, x2: 450, y2: 110 },
    { t: "wall", x1: 450, y1: 190, x2: 450, y2: 244 },
    { t: "door", x: 375, y: 100, w: 60, to: "down" },
    { t: "circle", cx: 405, cy: 46, r: 26 },
    { t: "gap", x: 365, y: 239, w: 80, h: 10 },
    { t: "door", x: 365, y: 244, w: 80, to: "down" },
    { t: "door", x: 450, y: 190, w: 80, to: "right" },
    { t: "window", x: 500, y: 244, w: 70 },
    ...bano6Shapes,
  ],
};

/* ---------- Tráiler SUM 12 m: sector de servicio + salón para 24 ---------- */

const sum12Tables: Shape[] = [];
for (let i = 0; i < 6; i++) {
  const x = 200 + i * 150;
  sum12Tables.push({ t: "rect", x, y: 87, w: 140, h: 70 }, chair(x + 15, 47, 34, 32), chair(x + 90, 47, 34, 32), chair(x + 15, 165, 34, 32), chair(x + 90, 165, 34, 32));
}

export const sum12: Plan = {
  length: 1200,
  width: 244,
  zones: [
    { id: "servicio", label: "Sector de servicio", x: 0, y: 0, w: 160, h: 244, items: ["Mesada con pileta y alacena", "Heladera con freezer y microondas", "Termotanque 40 L y dispenser"] },
    { id: "salon", label: "Salón 24 personas", x: 160, y: 0, w: 1040, h: 244, items: ["6 mesas plegables y 24 sillas", "TV Smart 55\", pizarra y biblioteca", "2 aires acondicionados 3500 frigorías", "2 paneles calefactores 550W"] },
  ],
  shapes: [
    { t: "gap", x: 160, y: 239, w: 90, h: 10 },
    { t: "door", x: 160, y: 244, w: 90, to: "down" },
    { t: "window", x: 330, y: 0, w: 120 },
    { t: "window", x: 630, y: 0, w: 120 },
    { t: "window", x: 930, y: 0, w: 120 },
    { t: "window", x: 480, y: 244, w: 120 },
    { t: "window", x: 780, y: 244, w: 120 },
    // Servicio
    { t: "rect", x: 6, y: 6, w: 140, h: 60 },
    { t: "circle", cx: 46, cy: 36, r: 13 },
    { t: "rect", x: 6, y: 176, w: 58, h: 60, fill: true },
    { t: "rect", x: 72, y: 200, w: 32, h: 36 },
    // Salón
    ...sum12Tables,
    { t: "rect", x: 1105, y: 6, w: 80, h: 8, fill: true },
    { t: "rect", x: 1105, y: 206, w: 78, h: 32 },
    { t: "rect", x: 1188, y: 80, w: 8, h: 84, fill: true },
  ],
};

/* ---------- Tráiler SUM 6 m: salón para 10 ---------- */

const sum6Tables: Shape[] = [];
[150, 300].forEach((x) => {
  sum6Tables.push({ t: "rect", x, y: 87, w: 140, h: 70 }, chair(x + 15, 47, 34, 32), chair(x + 90, 47, 34, 32), chair(x + 15, 165, 34, 32), chair(x + 90, 165, 34, 32));
});

export const sum6: Plan = {
  length: 600,
  width: 244,
  zones: [
    { id: "salon", label: "Salón 10 personas", x: 0, y: 0, w: 600, h: 244, items: ["2 mesas plegables y 10 sillas", "TV Smart 55\" y pizarra", "Rincón de servicio: mesada, frigobar y dispenser", "Aire 3500 frigorías y panel calefactor 550W"] },
  ],
  shapes: [
    { t: "gap", x: 30, y: 239, w: 90, h: 10 },
    { t: "door", x: 30, y: 244, w: 90, to: "down" },
    { t: "window", x: 170, y: 0, w: 110 },
    { t: "window", x: 340, y: 0, w: 110 },
    { t: "window", x: 250, y: 244, w: 110 },
    { t: "rect", x: 6, y: 6, w: 60, h: 100 },
    { t: "rect", x: 6, y: 112, w: 60, h: 48, fill: true },
    { t: "rect", x: 72, y: 6, w: 30, h: 30 },
    { t: "rect", x: 480, y: 6, w: 80, h: 8, fill: true },
    ...sum6Tables,
    chair(104, 105, 34, 34),
    chair(452, 105, 34, 34),
    { t: "rect", x: 588, y: 80, w: 8, h: 84, fill: true },
  ],
};

/* ---------- Tráiler Company Man 12 m: dormitorio | baño | cocina-comedor | oficina con sala de reuniones ---------- */
// Programa habitual de los Company Man de la región (Neuquén): dormitorio para 2, baño completo, cocina-comedor y
// oficina. Del sector privado al público: las visitas entran directo a la oficina sin pasar por el dormitorio.

export const companyMan12: Plan = {
  length: 1200,
  width: 244,
  zones: [
    { id: "dormitorio", label: "Dormitorio", x: 0, y: 0, w: 290, h: 244, items: ["2 camas individuales con colchón de 20 cm", "2 armarios con llave", "Aire 3500 frigorías y 2 paneles 550W", "TV Smart 55\" y cortina blackout"] },
    { id: "bano", label: "Baño completo", x: 290, y: 0, w: 220, h: 150, items: ["Inodoro y bidet", "Lavamanos con espejo", "Ducha (receptáculo 90 cm)", "Panel calefactor 550W"] },
    { id: "cocina", label: "Cocina / Comedor", x: 510, y: 0, w: 290, h: 244, mx: 740, my: 120, items: ["Mesada con pileta de acero inoxidable", "Heladera con freezer y microondas", "Mesa y 4 sillas", "Termotanque 40 L y dispenser"] },
    { id: "oficina", label: "Oficina y sala de reuniones", x: 800, y: 0, w: 400, h: 244, mx: 1050, my: 180, items: ["2 escritorios con sillas ergonómicas", "Mesa de reuniones para 4", "TV Smart 55\" y pizarra", "Biblioteca y archivero con llave"] },
  ],
  shapes: [
    // Muros interiores
    { t: "wall", x1: 290, y1: 0, x2: 290, y2: 160 },
    { t: "wall", x1: 510, y1: 0, x2: 510, y2: 150 },
    { t: "wall", x1: 290, y1: 150, x2: 510, y2: 150 },
    // Puertas
    { t: "door", x: 290, y: 240, w: 76, to: "left" },
    { t: "door", x: 380, y: 150, w: 64, to: "up" },
    { t: "gap", x: 800, y: 239, w: 90, h: 10 },
    { t: "door", x: 800, y: 244, w: 90, to: "down" },
    // Ventanas
    { t: "window", x: 90, y: 0, w: 110 },
    { t: "window", x: 90, y: 244, w: 110 },
    { t: "window", x: 440, y: 0, w: 50 },
    { t: "window", x: 540, y: 0, w: 90 },
    { t: "window", x: 590, y: 244, w: 90 },
    { t: "window", x: 1010, y: 0, w: 100 },
    // Dormitorio: 2 camas, mesa de luz compartida, 2 armarios
    ...bed(5, 8),
    ...bed(5, 156),
    { t: "rect", x: 8, y: 102, w: 40, h: 40 },
    { t: "rect", x: 238, y: 8, w: 48, h: 110 },
    { t: "line", x1: 262, y1: 8, x2: 262, y2: 118 },
    // Baño: ducha, inodoro, bidet, lavamanos
    ...shower(422, 6, 82),
    ...toilet(330, 0),
    { t: "circle", cx: 380, cy: 30, r: 13 },
    ...sink(296, 98, 50, 44),
    // Cocina-comedor
    { t: "rect", x: 516, y: 6, w: 150, h: 60 },
    { t: "circle", cx: 556, cy: 36, r: 13 },
    { t: "rect", x: 672, y: 6, w: 58, h: 60, fill: true },
    { t: "circle", cx: 764, cy: 34, r: 24 },
    { t: "rect", x: 611, y: 170, w: 110, h: 70 },
    chair(626, 130, 34, 34),
    chair(676, 130, 34, 34),
    chair(573, 188, 32, 34),
    chair(727, 188, 32, 34),
    { t: "rect", x: 766, y: 200, w: 30, h: 36 },
    // Oficina: escritorios contra el testero, mesa de reuniones, biblioteca, archivero, TV y pizarra
    { t: "rect", x: 1134, y: 10, w: 60, h: 105 },
    chair(1092, 45, 36, 36),
    { t: "rect", x: 1134, y: 129, w: 60, h: 105 },
    chair(1092, 163, 36, 36),
    { t: "rect", x: 900, y: 46, w: 120, h: 80 },
    ...[913, 967].flatMap((x) => [chair(x, 6, 34, 32), chair(x, 134, 34, 32)]),
    { t: "rect", x: 812, y: 6, w: 60, h: 34 },
    { t: "rect", x: 1030, y: 6, w: 44, h: 32 },
    { t: "rect", x: 930, y: 230, w: 80, h: 8, fill: true },
    { t: "rect", x: 1020, y: 230, w: 70, h: 8, fill: true },
  ],
};
