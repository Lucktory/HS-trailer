import type { IconName } from "@/components/icons";
import type { Plan } from "./plan";
import * as plans from "./plans";

export type { Plan, Shape, Zone } from "./plan";

/* ---------- Medidas ---------- */

export const SIZES = ["12 m", "6 m"] as const;
export type Size = (typeof SIZES)[number];

export const LENGTH: Record<Size, string> = { "12 m": "12,00 m", "6 m": "6,00 m" };
export const WIDTH = "2,44 m";

// Imágenes por convención (ver IMAGENES.md): public/img/equipos/<slug>/portada.jpg
export const coverOf = (slug: string) => `/img/equipos/${slug}/portada.jpg`;

/* ---------- Espacios: lo que el cliente busca en el filtro ---------- */
// Un contenedor aparece en todos los espacios que incluye (ej. la Vivienda: dormitorio + baño + comedor).
// kind "type": la categoría es el propio tipo de unidad (no se muestra como "Incluye" en su tarjeta).

export const SPACES = [
  { id: "dormitorio", label: "Dormitorio", icon: "bed", kind: "space" },
  { id: "comedor", label: "Comedor", icon: "utensils", kind: "space" },
  { id: "oficina", label: "Oficina", icon: "desk", kind: "space" },
  { id: "bano", label: "Baño", icon: "toilet", kind: "space" },
  { id: "deposito", label: "Depósito", icon: "package", kind: "space" },
  { id: "sum", label: "SUM", icon: "users", kind: "space" },
  { id: "company-man", label: "Company Man", icon: "hardhat", kind: "type" },
] as const satisfies readonly { id: string; label: string; icon: IconName; kind: "space" | "type" }[];

export type SpaceId = (typeof SPACES)[number]["id"];

export const spaceOf = (id: SpaceId) => SPACES.find((sp) => sp.id === id)!;

/* ---------- Íconos de la tarjeta: espacios + confort ---------- */
// Se calculan desde los datos de cada variante (espacios y especificaciones), así nunca contradicen la ficha.

export type Feature = { id: string; label: string; icon: IconName; space?: boolean };

const AMENITIES: { id: string; label: string; icon: IconName; test: RegExp }[] = [
  { id: "aire", label: "Aire acondicionado", icon: "snowflake", test: /aires? acondicionados?/i },
  { id: "calefaccion", label: "Calefacción", icon: "heat", test: /calefactor/i },
  { id: "agua", label: "Agua caliente", icon: "drop", test: /termotanque/i },
  { id: "tv", label: "TV Smart", icon: "tv", test: /\bTV\b/ },
  { id: "luz", label: "Iluminación interior", icon: "lightbulb", test: /iluminaci/i },
];

const SPACE_LABEL: Partial<Record<SpaceId, string>> = { sum: "Salón de usos múltiples" };

export function featuresOf(spaces: SpaceId[], specs: SpecGroup[]): Feature[] {
  const text = specs.flatMap((g) => g.items).join(" · ");
  return [
    ...spaces
      .map(spaceOf)
      .filter((sp) => sp.kind === "space")
      .map((sp) => ({ id: sp.id, label: SPACE_LABEL[sp.id] ?? sp.label, icon: sp.icon as IconName, space: true })),
    ...AMENITIES.filter((a) => a.test.test(text)).map(({ id, label, icon }) => ({ id, label, icon })),
  ];
}

/* ---------- Especificaciones ---------- */

export type SpecGroup = { title: string; icon: IconName; items: string[] };

export const documentation: SpecGroup = {
  title: "Documentación",
  icon: "clipboard",
  items: ["Cálculo de vuelco firmado por matriculado", "Plano unifilar firmado por matriculado", "Cálculo de carga de fuego"],
};

// "catalogo": datos del PDF del cliente · "estimado": configuración propuesta por nosotros, a confirmar (SUPUESTOS.md)
export type Source = "catalogo" | "estimado";

export type Variant = {
  size: Size;
  capacity: string;
  summary: string; // una línea para la tarjeta
  tagline: string; // bajada de la ficha
  specs: SpecGroup[];
  plan: Plan;
  source: Source;
};

export type UnitType = {
  slug: string; // carpeta de imágenes: public/img/equipos/<slug>/
  name: string;
  spaces: SpaceId[]; // espacios que incluye; el primero es su uso principal
  variants: Variant[];
};

const TV = 'TV Smart 55" instalada con soporte';
const DISPENSER = "Dispenser frío / calor";

/* ---------- Unidades (orden = orden de los filtros) ---------- */

export const units: UnitType[] = [
  {
    slug: "vivienda",
    name: "Tráiler Vivienda",
    spaces: ["dormitorio", "bano", "comedor"],
    variants: [
      {
        size: "12 m",
        source: "catalogo",
        capacity: "4 personas",
        summary: "2 dormitorios, baño completo y cocina-comedor para 4 personas.",
        tagline: "Espacio, confort y seguridad para tu equipo en cualquier entorno.",
        specs: [
          {
            title: "Dormitorios",
            icon: "bed",
            items: [
              "2 dormitorios de 6 m² mínimo",
              "2 camas individuales por dormitorio",
              "4 colchones de 20 cm",
              "Mesa de luz compartida y velador individual",
              "Armario individual con llave",
              "2 paneles calefactores eléctricos 550W por dormitorio",
              "2 aires acondicionados 3500 frigorías (1 por dormitorio)",
              TV,
            ],
          },
          {
            title: "Baño",
            icon: "shower",
            items: ["Inodoro", "Bidet", "Lavamanos y espejo", "Ducha (receptáculo mínimo 90 cm)", "Cortina de baño", "Panel calefactor eléctrico 550W"],
          },
          {
            title: "Comedor",
            icon: "utensils",
            items: [
              "Mesada con bajo mesada y alacena",
              "Dispenser",
              "Heladera con freezer",
              "Mesa móvil y 4 sillas",
              "Aire acondicionado 3500 frigorías",
              "Panel calefactor eléctrico 550W",
              "Termotanque 40 L con conexión al exterior",
            ],
          },
          documentation,
        ],
        plan: plans.vivienda12,
      },
    ],
  },
  {
    slug: "comedor",
    name: "Tráiler Comedor",
    spaces: ["comedor"],
    variants: [
      {
        size: "12 m",
        source: "catalogo",
        capacity: "25 personas",
        summary: "Comedor para 25 personas con sector de cocina.",
        tagline: "Un comedor completo para 25 personas, listo para operar desde el primer día.",
        specs: [
          {
            title: "Comedor",
            icon: "utensils",
            items: [
              "Mesada con bajo mesada, alacena y pileta de acero inoxidable",
              "Heladera con freezer",
              "Mesa móvil de melamina con estructura en caño estructural para 25 personas",
              "25 sillas",
              "2 aires acondicionados 3500 frigorías",
              "2 paneles calefactores eléctricos 550W",
              "Termotanque 40 L con conexión al exterior",
            ],
          },
          { title: "Equipamiento", icon: "tv", items: [DISPENSER, TV] },
          documentation,
        ],
        plan: plans.comedor12,
      },
      {
        size: "6 m",
        source: "estimado",
        capacity: "12 personas",
        summary: "Comedor para 12 personas con sector de cocina.",
        tagline: "La versión compacta del comedor, para cuadrillas de hasta 12 personas.",
        specs: [
          {
            title: "Comedor",
            icon: "utensils",
            items: [
              "Mesada con bajo mesada, alacena y pileta de acero inoxidable",
              "Heladera con freezer",
              "Mesa de melamina para 12 personas",
              "12 sillas",
              "Aire acondicionado 3500 frigorías",
              "Panel calefactor eléctrico 550W",
              "Termotanque 40 L con conexión al exterior",
            ],
          },
          { title: "Equipamiento", icon: "tv", items: [DISPENSER, TV] },
          documentation,
        ],
        plan: plans.comedor6,
      },
    ],
  },
  {
    slug: "oficina",
    name: "Tráiler Oficina",
    spaces: ["oficina"],
    variants: [
      {
        size: "12 m",
        source: "catalogo",
        capacity: "8 puestos",
        summary: "Oficina técnica climatizada con 8 puestos de trabajo.",
        tagline: "Oficina técnica equipada para 8 personas, climatizada todo el año.",
        specs: [
          {
            title: "Equipamiento",
            icon: "desk",
            items: ["8 escritorios de melamina", "8 sillas ergonómicas", "3 muebles biblioteca de melamina", TV, DISPENSER],
          },
          { title: "Climatización", icon: "heat", items: ["2 aires acondicionados 3500 frigorías", "2 paneles calefactores eléctricos 550W"] },
          documentation,
        ],
        plan: plans.oficina12,
      },
      {
        size: "6 m",
        source: "estimado",
        capacity: "4 puestos",
        summary: "Oficina técnica climatizada con 4 puestos de trabajo.",
        tagline: "Oficina compacta para 4 personas, climatizada todo el año.",
        specs: [
          {
            title: "Equipamiento",
            icon: "desk",
            items: ["4 escritorios de melamina", "4 sillas ergonómicas", "1 mueble biblioteca de melamina", TV, DISPENSER],
          },
          { title: "Climatización", icon: "heat", items: ["Aire acondicionado 3500 frigorías", "Panel calefactor eléctrico 550W"] },
          documentation,
        ],
        plan: plans.oficina6,
      },
    ],
  },
  {
    slug: "bano",
    name: "Tráiler Baño",
    spaces: ["bano"],
    variants: [
      {
        size: "12 m",
        source: "estimado",
        capacity: "4 inodoros · 4 duchas",
        summary: "Módulo sanitario con 4 inodoros, 4 mingitorios, 4 duchas y vestuario.",
        tagline: "Sanitarios y vestuario para el personal del campamento, con agua caliente y calefacción.",
        specs: [
          {
            title: "Sanitarios",
            icon: "toilet",
            items: ["4 inodoros en boxes con puerta", "4 mingitorios con separadores", "Mesada con 5 bachas y espejos", "Dispensers de jabón y toallas de papel"],
          },
          {
            title: "Duchas",
            icon: "shower",
            items: ["4 duchas de 90 × 90 cm con receptáculo y puerta", "2 termotanques eléctricos de 150 L", "Extractor en cada box de ducha e inodoro"],
          },
          { title: "Vestuario", icon: "users", items: ["2 lockers metálicos de 6 casilleros", "3 bancos", "Percheros"] },
          { title: "Climatización", icon: "heat", items: ["2 aires acondicionados 3500 frigorías", "4 paneles calefactores eléctricos 550W"] },
          documentation,
        ],
        plan: plans.bano12,
      },
      {
        size: "6 m",
        source: "estimado",
        capacity: "2 inodoros · 2 duchas",
        summary: "Módulo sanitario compacto con 2 inodoros, 2 mingitorios, 2 duchas y vestuario.",
        tagline: "Sanitarios completos en formato compacto, ideal para cuadrillas en locación y obras.",
        specs: [
          { title: "Sanitarios", icon: "toilet", items: ["2 inodoros en boxes con puerta", "2 mingitorios con separador", "Mesada con 2 bachas y espejos"] },
          { title: "Duchas", icon: "shower", items: ["2 duchas de 90 × 90 cm con receptáculo y puerta", "Termotanque eléctrico de 150 L", "Extractor en cada box"] },
          { title: "Vestuario", icon: "users", items: ["Locker metálico de 6 casilleros", "Banco", "Percheros"] },
          { title: "Climatización", icon: "heat", items: ["Aire acondicionado 3500 frigorías", "2 paneles calefactores eléctricos 550W"] },
          documentation,
        ],
        plan: plans.bano6,
      },
    ],
  },
  {
    slug: "panol",
    name: "Pañol",
    spaces: ["deposito"],
    variants: [
      {
        size: "12 m",
        source: "catalogo",
        capacity: "2 estanterías de 11 m",
        summary: "Depósito con estanterías en ambos laterales.",
        tagline: "Depósito de herramientas y materiales, ordenado y bajo llave.",
        specs: [
          {
            title: "Equipamiento",
            icon: "warehouse",
            items: ["Estanterías en ambos laterales", "Estructura metálica y estantes de madera", "Pasillo central de circulación", "Iluminación interior"],
          },
          documentation,
        ],
        plan: plans.panol12,
      },
      {
        size: "6 m",
        source: "catalogo",
        capacity: "2 estanterías de 5 m",
        summary: "Pañol con estanterías en formato compacto de 6 m.",
        tagline: "Depósito compacto de herramientas y materiales, ordenado y bajo llave.",
        specs: [
          {
            title: "Equipamiento",
            icon: "warehouse",
            items: ["Estanterías en ambos laterales", "Estructura metálica y estantes de madera", "Pasillo central de circulación", "Iluminación interior"],
          },
          documentation,
        ],
        plan: plans.panol6,
      },
    ],
  },
  {
    slug: "sum",
    name: "Tráiler SUM",
    spaces: ["sum"],
    variants: [
      {
        size: "12 m",
        source: "estimado",
        capacity: "24 personas",
        summary: "Salón para reuniones, capacitaciones y descanso de hasta 24 personas.",
        tagline: "Un espacio flexible para charlas de seguridad, capacitaciones y descanso del personal.",
        specs: [
          { title: "Salón", icon: "users", items: ["6 mesas plegables de melamina", "24 sillas apilables", TV, "Pizarra blanca", "Mueble biblioteca"] },
          {
            title: "Sector de servicio",
            icon: "utensils",
            items: [
              "Mesada con bajo mesada, alacena y pileta de acero inoxidable",
              "Heladera con freezer",
              "Microondas",
              DISPENSER,
              "Termotanque 40 L con conexión al exterior",
            ],
          },
          { title: "Climatización", icon: "heat", items: ["2 aires acondicionados 3500 frigorías", "2 paneles calefactores eléctricos 550W"] },
          documentation,
        ],
        plan: plans.sum12,
      },
      {
        size: "6 m",
        source: "estimado",
        capacity: "10 personas",
        summary: "Salón compacto para reuniones y descanso de hasta 10 personas.",
        tagline: "Salón de usos múltiples compacto para reuniones, charlas y descanso.",
        specs: [
          { title: "Salón", icon: "users", items: ["2 mesas plegables de melamina", "10 sillas apilables", TV, "Pizarra blanca"] },
          { title: "Rincón de servicio", icon: "utensils", items: ["Mesada con bajo mesada", "Frigobar", "Microondas", DISPENSER] },
          { title: "Climatización", icon: "heat", items: ["Aire acondicionado 3500 frigorías", "Panel calefactor eléctrico 550W"] },
          documentation,
        ],
        plan: plans.sum6,
      },
    ],
  },
  {
    slug: "company-man",
    name: "Tráiler Company Man",
    spaces: ["company-man", "oficina", "dormitorio", "bano", "comedor"],
    variants: [
      {
        size: "12 m",
        source: "estimado",
        capacity: "2 personas",
        summary: "Dormitorio para 2, baño completo, cocina-comedor y oficina con sala de reuniones.",
        tagline: "Alojamiento y oficina para la supervisión de la operación, en una sola unidad.",
        specs: [
          {
            title: "Oficina",
            icon: "desk",
            items: [
              "2 escritorios de melamina con cajonera",
              "2 sillas ergonómicas",
              "Mesa de reuniones para 4 personas",
              "Mueble biblioteca y archivero con llave",
              "Pizarra",
              TV,
              "Aire acondicionado 3500 frigorías",
              "Panel calefactor eléctrico 550W",
            ],
          },
          {
            title: "Dormitorio",
            icon: "bed",
            items: [
              "2 camas individuales",
              "2 colchones de 20 cm",
              "Mesa de luz compartida y velador individual",
              "2 armarios individuales con llave",
              "Cortina blackout",
              TV,
              "Aire acondicionado 3500 frigorías",
              "2 paneles calefactores eléctricos 550W",
            ],
          },
          {
            title: "Baño",
            icon: "shower",
            items: ["Inodoro", "Bidet", "Lavamanos y espejo", "Ducha (receptáculo mínimo 90 cm)", "Cortina de baño", "Panel calefactor eléctrico 550W"],
          },
          {
            title: "Cocina-comedor",
            icon: "utensils",
            items: [
              "Mesada con bajo mesada, alacena y pileta de acero inoxidable",
              "Heladera con freezer",
              "Microondas",
              DISPENSER,
              "Mesa móvil y 4 sillas",
              "Termotanque 40 L con conexión al exterior",
              "Aire acondicionado 3500 frigorías",
              "Panel calefactor eléctrico 550W",
            ],
          },
          documentation,
        ],
        plan: plans.companyMan12,
      },
    ],
  },
];

/* ---------- Catálogo: cada tipo en cada medida = los 12 modelos ---------- */

export const catalogId = (slug: string, size: Size) => `${slug}-${size.replace(" ", "")}`; // "comedor-6m"

// Liviano a propósito: viaja al componente cliente del filtro.
export type CatalogItem = {
  id: string;
  slug: string;
  name: string;
  size: Size;
  spaces: SpaceId[];
  features: Feature[];
  summary: string;
  capacity: string;
  href: string;
};

export const catalog: CatalogItem[] = units.flatMap((u) =>
  u.variants.map((v) => {
    const id = catalogId(u.slug, v.size);
    return {
      id,
      slug: u.slug,
      name: u.name,
      size: v.size,
      spaces: u.spaces,
      features: featuresOf(u.spaces, v.specs),
      summary: v.summary,
      capacity: v.capacity,
      href: `/flota/${id}`,
    };
  }),
);

export function getVariant(id: string) {
  for (const unit of units) for (const variant of unit.variants) if (catalogId(unit.slug, variant.size) === id) return { unit, variant };
  return undefined;
}

export const generators = { slug: "generadores", name: "Generadores", summary: "Energía para operar en locaciones sin red eléctrica." };
