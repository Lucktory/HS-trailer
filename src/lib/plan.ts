// Planos de planta: primitivas en centímetros (12 m = 1200 × 244, 6 m = 600 × 244).
export type Shape =
  | { t: "rect"; x: number; y: number; w: number; h: number; fill?: boolean }
  | { t: "line"; x1: number; y1: number; x2: number; y2: number }
  | { t: "circle"; cx: number; cy: number; r: number }
  | { t: "wall"; x1: number; y1: number; x2: number; y2: number }
  // Hueco en el muro exterior (para puertas y ventanas)
  | { t: "gap"; x: number; y: number; w: number; h: number }
  | { t: "window"; x: number; y: number; w: number; vertical?: boolean }
  // Puerta con bisagra en (x, y), hoja de ancho w, abriendo hacia `to`
  // (flip: la hoja cerrada queda del otro lado de la bisagra)
  | { t: "door"; x: number; y: number; w: number; to: "up" | "down" | "left" | "right"; flip?: boolean };

export type Zone = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  items: string[];
  mx?: number; // posición del número (por defecto, el centro de la zona)
  my?: number;
};

export type Plan = {
  length: number; // cm
  width: number; // cm
  padLeft?: number; // margen extra si hay puertas que abren hacia afuera por la izquierda
  zones: Zone[];
  shapes: Shape[];
};


/* ---------- Helpers de dibujo ---------- */

// headRight: cabecera contra el extremo derecho (almohada a la derecha)
export const bed = (x: number, y: number, w = 190, h = 80, headRight = false): Shape[] => {
  const px = headRight ? x + w - 36 : x + 6;
  const lx = headRight ? x + w - 60 : x + 60;
  return [
    { t: "rect", x, y, w, h },
    { t: "rect", x: px, y: y + 12, w: 30, h: h - 24, fill: true }, // almohada
    { t: "line", x1: lx, y1: y, x2: lx, y2: y + h },
  ];
};

export const chair = (x: number, y: number, w = 34, h = 34): Shape => ({ t: "rect", x, y, w, h });

// Inodoro visto desde arriba: mochila contra la pared (wallY) y taza hacia adentro.
export const toilet = (cx: number, wallY: number, dir: 1 | -1 = 1): Shape[] => [
  { t: "rect", x: cx - 14, y: dir === 1 ? wallY + 4 : wallY - 16, w: 28, h: 12 },
  { t: "circle", cx, cy: wallY + dir * 34, r: 17 },
];

// Plato de ducha con diagonal
export const shower = (x: number, y: number, s = 84): Shape[] => [
  { t: "rect", x, y, w: s, h: s },
  { t: "line", x1: x, y1: y, x2: x + s, y2: y + s },
];

// Lavamanos: mueble con bacha
export const sink = (x: number, y: number, w = 50, h = 42): Shape[] => [
  { t: "rect", x, y, w, h },
  { t: "circle", cx: x + w / 2, cy: y + h / 2, r: Math.min(w, h) / 2 - 8 },
];

// Mingitorio contra la pared inferior
export const urinal = (x: number, wallY: number): Shape[] => [{ t: "rect", x, y: wallY - 22, w: 34, h: 18 }];
