// Plano 2D -> piezas 3D para el recorrido. Logica pura (sin three ni React).
// Ejes: x del plano = X (largo), y del plano = Z (ancho), altura = Y. Todo en cm, con origen en la esquina del plano.
import type { Plan, Shape, Zone } from "./plan";

// Medida fija de los contenedores (cliente: 12 x 2,4 x 3 m). Largo y ancho salen de cada Plan.
export const CONTAINER_HEIGHT = 300;

// Valores aproximados para el dibujo (no son medidas del cliente). Ajustar si llegan medidas reales.
export const WALL = 4; // espesor de muro (chapa + aislacion), hacia afuera del plano
export const FRAME = 15; // seccion de parantes de esquina y largueros del contenedor

// Estanterias: valores aproximados, leidos de la foto del panol.
export const SHELVING = {
  levels: 5, // tablas por estanteria
  lowest: 15, // altura de la primera tabla
  highest: 255, // altura de la ultima tabla
  board: 3, // espesor de tabla
  post: 5, // seccion del parante
} as const;

// Equipo frio/calor tipo split (unidad interior) y luminaria de techo: medidas tipicas, aproximadas
export const AC_UNIT = { w: 80, h: 28, d: 20, belowCeiling: 15 } as const;
export const LAMP = { diameter: 25, base: 2, dome: 4 } as const;

// Separacion minima entre caras que de otro modo quedarian en el mismo plano (evita parpadeo)
const NUDGE = 0.2;

export const EYE_HEIGHT = 160; // altura de la camara en el recorrido

// Caja alineada a los ejes: centro (x, y, z) y medidas (w en X, h en Y, d en Z)
export type Box = { x: number; y: number; z: number; w: number; h: number; d: number };

export type Facing = "+x" | "-x" | "+z" | "-z";

// Posicion de cada equipo; la forma la dibuja components/fixtures-3d.tsx.
// ac: (x, y, z) = centro de la cara trasera, apoyada en el muro; facing = hacia donde mira el frente.
// lamp: (x, y, z) = centro de la base, pegada al techo.
export type Fixture3D = { kind: "ac"; x: number; y: number; z: number; facing: Facing } | { kind: "lamp"; x: number; y: number; z: number };

export type Model3D = {
  length: number;
  width: number;
  height: number;
  walls: Box[]; // muros macizos, vistos de adentro y de afuera
  frame: Box[]; // parantes de esquina y largueros superiores e inferiores
  doors: Box[]; // hojas de puerta, abiertas como en el plano
  posts: Box[];
  boards: Box[];
  fixtures: Fixture3D[];
};

// Resta los huecos [a, b] del tramo [0, size]
function subtractGaps(size: number, gaps: [number, number][]): [number, number][] {
  const sorted = [...gaps].sort((g, h) => g[0] - h[0]);
  const out: [number, number][] = [];
  let from = 0;
  for (const [a, b] of sorted) {
    if (a > from) out.push([from, Math.min(a, size)]);
    from = Math.max(from, b);
  }
  if (from < size) out.push([from, size]);
  return out.filter(([a, b]) => b - a > 0.5);
}

type Edge = { along: "x" | "z"; at: number; out: 1 | -1; size: number };

const edgesOf = (L: number, W: number): Edge[] => [
  { along: "x", at: 0, out: -1, size: L },
  { along: "x", at: W, out: 1, size: L },
  { along: "z", at: 0, out: -1, size: W },
  { along: "z", at: L, out: 1, size: W },
];

// Muros exteriores con espesor hacia afuera. Los laterales largos se estiran WALL en cada punta para cerrar las esquinas.
function buildWalls(plan: Plan, gaps: Extract<Shape, { t: "gap" }>[], height: number): Box[] {
  const { length: L, width: W } = plan;
  return edgesOf(L, W).flatMap((e) => {
    // Un hueco corta este muro si su rectangulo cruza la linea del muro
    const cuts = gaps
      .filter((g) => (e.along === "x" ? g.y <= e.at && e.at <= g.y + g.h : g.x <= e.at && e.at <= g.x + g.w))
      .map((g): [number, number] => (e.along === "x" ? [g.x, g.x + g.w] : [g.y, g.y + g.h]));
    const across = e.at + (e.out * WALL) / 2;
    const h = height - 1; // el tope queda dentro del larguero, no en su mismo plano
    return subtractGaps(e.size, cuts).map(([a, b]): Box => {
      if (e.along === "z") return { x: across, y: h / 2, z: (a + b) / 2, w: WALL, h, d: b - a };
      const a2 = a === 0 ? -WALL : a;
      const b2 = b === e.size ? b + WALL : b;
      return { x: (a2 + b2) / 2, y: h / 2, z: across, w: b2 - a2, h, d: WALL };
    });
  });
}

// Estructura del contenedor: un parante en cada esquina y largueros arriba y abajo en los cuatro lados,
// centrados sobre la cara exterior de los muros.
function buildFrame(L: number, W: number, height: number): Box[] {
  const x0 = -WALL;
  const x1 = L + WALL;
  const z0 = -WALL;
  const z1 = W + WALL;
  const corners = [x0, x1].flatMap((x) => [z0, z1].map((z): Box => ({ x, y: height / 2, z, w: FRAME, h: height, d: FRAME })));
  const rails = [FRAME / 2, height - FRAME / 2].flatMap((y): Box[] => [
    { x: L / 2, y, z: z0, w: x1 - x0, h: FRAME, d: FRAME },
    { x: L / 2, y, z: z1, w: x1 - x0, h: FRAME, d: FRAME },
    { x: x0, y, z: W / 2, w: FRAME, h: FRAME, d: z1 - z0 },
    { x: x1, y, z: W / 2, w: FRAME, h: FRAME, d: z1 - z0 },
  ]);
  return [...corners, ...rails];
}

const DOOR_LEAF = 4; // espesor de la hoja

// La hoja llega hasta el larguero superior
function buildDoor(s: Extract<Shape, { t: "door" }>, height: number): Box {
  const { x, y, w } = s;
  const h = height - FRAME;
  const horizontal = s.to === "left" || s.to === "right";
  const sign = s.to === "right" || s.to === "down" ? 1 : -1;
  return horizontal
    ? { x: x + (sign * w) / 2, y: h / 2, z: y, w, h, d: DOOR_LEAF }
    : { x, y: h / 2, z: y + (sign * w) / 2, w: DOOR_LEAF, h, d: w };
}

// Estanteria a lo largo del lado mayor del rectangulo. Los parantes van en los extremos y en cada
// linea divisoria del plano que cae dentro del rectangulo (las mismas que dibuja el plano 2D).
function buildShelving(r: Extract<Shape, { t: "rect" }>, lines: Extract<Shape, { t: "line" }>[], height: number) {
  const alongX = r.w >= r.h;
  const [u0, uLen, v0, vLen] = alongX ? [r.x, r.w, r.y, r.h] : [r.y, r.h, r.x, r.w];
  const dividers = lines
    .filter((l) => (alongX ? l.x1 === l.x2 : l.y1 === l.y2))
    .map((l) => (alongX ? { u: l.x1, a: Math.min(l.y1, l.y2), b: Math.max(l.y1, l.y2) } : { u: l.y1, a: Math.min(l.x1, l.x2), b: Math.max(l.x1, l.x2) }))
    .filter((d) => d.u > u0 && d.u < u0 + uLen && d.a >= v0 && d.b <= v0 + vLen)
    .map((d) => d.u);
  const { post, board, levels, lowest, highest } = SHELVING;
  const us = [...new Set([u0 + post / 2, ...dividers, u0 + uLen - post / 2])].sort((a, b) => a - b);
  // Caja en coordenadas (u, v) del estante -> caja del modelo
  const box = (u: number, y: number, v: number, du: number, h: number, dv: number): Box =>
    alongX ? { x: u, y, z: v, w: du, h, d: dv } : { x: v, y, z: u, w: dv, h, d: du };

  const posts = us.flatMap((u) => [v0 + post / 2, v0 + vLen - post / 2].map((v) => box(u, height / 2, v, post, height, post)));
  const step = (highest - lowest) / (levels - 1);
  // Tablas apenas mas chicas que el marco: sus caras no coinciden con las de los parantes
  const boards = Array.from({ length: levels }, (_, i) =>
    box(u0 + uLen / 2, lowest + i * step, v0 + vLen / 2, uLen - 2 * NUDGE, board, vLen - 2 * NUDGE),
  );
  return { posts, boards };
}

const inwardFacing = (e: Edge): Facing => (e.along === "x" ? (e.out === 1 ? "-z" : "+z") : e.out === 1 ? "-x" : "+x");

function buildFixture(f: NonNullable<Plan["fixtures"]>[number], L: number, W: number, height: number): Fixture3D {
  if (f.kind === "lamp") return { kind: "lamp", x: f.x, y: height, z: f.y };
  // Equipo colgado arriba, centrado en (f.x, f.y) sobre el muro donde cae ese punto
  const edge = edgesOf(L, W).find((e) => (e.along === "x" ? f.y === e.at : f.x === e.at));
  if (!edge) throw new Error(`plan-3d: el equipo en (${f.x}, ${f.y}) no esta sobre un muro exterior`);
  return { kind: "ac", x: f.x, y: height - AC_UNIT.belowCeiling - AC_UNIT.h / 2, z: f.y, facing: inwardFacing(edge) };
}

export function buildModel3D(plan: Plan): Model3D {
  const height = CONTAINER_HEIGHT;
  const gaps: Extract<Shape, { t: "gap" }>[] = [];
  const lines: Extract<Shape, { t: "line" }>[] = [];
  const doors: Box[] = [];
  const shelving: Extract<Shape, { t: "rect" }>[] = [];

  for (const s of plan.shapes) {
    switch (s.t) {
      case "gap":
        gaps.push(s);
        break;
      case "line":
        lines.push(s);
        break;
      case "door":
        doors.push(buildDoor(s, height));
        break;
      case "rect":
        if (s.kind === "shelving") shelving.push(s);
        break;
      case "circle":
        break; // solo 2D por ahora
      case "wall":
      case "window":
        // El prototipo cubre el panol; muros interiores y ventanas se agregan con el siguiente plano.
        throw new Error(`plan-3d: "${s.t}" todavia no esta soportado en 3D`);
      default: {
        const never: never = s;
        throw new Error(`plan-3d: forma desconocida ${JSON.stringify(never)}`);
      }
    }
  }

  const parts = shelving.map((r) => buildShelving(r, lines, height));
  return {
    length: plan.length,
    width: plan.width,
    height,
    walls: buildWalls(plan, gaps, height),
    frame: buildFrame(plan.length, plan.width, height),
    doors,
    posts: parts.flatMap((p) => p.posts),
    boards: parts.flatMap((p) => p.boards),
    fixtures: (plan.fixtures ?? []).map((f) => buildFixture(f, plan.length, plan.width, height)),
  };
}

export type TourStop = { zone: Zone; eye: [number, number, number]; look: [number, number, number] };

// Paradas del recorrido, en el orden de las zonas. Toda zona necesita su `view`.
export function buildTour(plan: Plan): TourStop[] {
  return plan.zones.map((zone) => {
    if (!zone.view) throw new Error(`plan-3d: la zona "${zone.id}" no tiene view para el recorrido`);
    const { x, y, lookX, lookY } = zone.view;
    return { zone, eye: [x, EYE_HEIGHT, y], look: [lookX, EYE_HEIGHT - 20, lookY] };
  });
}
