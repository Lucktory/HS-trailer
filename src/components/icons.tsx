// Íconos: Phosphor Icons (https://phosphoricons.com). Import "ssr" = sirve en componentes de servidor y cliente.
import {
  ArrowLeft,
  ArrowRight,
  CaretDown,
  ChatCircleText,
  ClipboardText,
  Couch,
  Desk,
  Engine,
  Drop,
  EnvelopeSimple,
  FileText,
  GridFour,
  ForkKnife,
  Headset,
  HouseLine,
  InstagramLogo,
  HardHat,
  Lightbulb,
  Lightning,
  LinkedinLogo,
  List,
  MapPin,
  MouseScroll,
  Oven,
  Package,
  Phone,
  Ruler,
  ShieldCheck,
  SkipForward,
  Snowflake,
  SpeakerHigh,
  SpeakerSlash,
  SquaresFour,
  Stack,
  Television,
  ThermometerHot,
  Toilet,
  Truck,
  UsersThree,
  Warehouse,
  WhatsappLogo,
  Wrench,
  X,
} from "@phosphor-icons/react/ssr";
import type { Icon as PhosphorIcon, IconWeight } from "@phosphor-icons/react";
import { BedDouble, ShowerHead, type LucideIcon } from "lucide-react";

const icons = {
  arrow: ArrowRight,
  arrowLeft: ArrowLeft,
  menu: List,
  close: X,
  home: HouseLine,
  utensils: ForkKnife,
  desk: Desk,
  warehouse: Warehouse,
  sofa: Couch,
  toilet: Toilet,
  package: Package,
  users: UsersThree,
  hardhat: HardHat,
  grid: SquaresFour,
  caretDown: CaretDown,
  scroll: MouseScroll,
  snowflake: Snowflake,
  heat: ThermometerHot,
  drop: Drop,
  lightbulb: Lightbulb,
  tv: Television,
  generator: Engine,
  bolt: Lightning,
  layers: Stack,
  ruler: Ruler,
  wrench: Wrench,
  truck: Truck,
  shield: ShieldCheck,
  clipboard: ClipboardText,
  doc: FileText,
  chat: ChatCircleText,
  support: Headset,
  pin: MapPin,
  phone: Phone,
  mail: EnvelopeSimple,
  instagram: InstagramLogo,
  linkedin: LinkedinLogo,
  window: GridFour,
  oven: Oven,
  skip: SkipForward,
  soundOn: SpeakerHigh,
  soundOff: SpeakerSlash,
} satisfies Record<string, PhosphorIcon>;

// Íconos de Lucide donde el dibujo de Phosphor no convence (la cama de Phosphor, de perfil, se lee poco).
// Mismo trazo redondeado; el grosor se ajusta al peso de Phosphor para que convivan sin diferencias.
const lucideIcons = {
  bed: BedDouble,
  shower: ShowerHead,
} satisfies Record<string, LucideIcon>;

// Phosphor dibuja en 256 u (thin 8, light 12, regular 16, bold 24); Lucide en 24 u
const STROKE: Record<IconWeight, number> = { thin: 0.75, light: 1.125, regular: 1.5, bold: 2.25, fill: 1.5, duotone: 1.5 };

export type IconName = keyof typeof icons | keyof typeof lucideIcons;

// Trazo fino ("light") para el estilo premium; flechas y controles un poco más firmes.
const regular: IconName[] = ["arrow", "arrowLeft", "menu", "close", "skip", "soundOn", "soundOff"];

export function Icon({ name, className = "size-6", weight }: { name: IconName; className?: string; weight?: IconWeight }) {
  const w = weight ?? (regular.includes(name) ? "regular" : "light");
  if (name in lucideIcons) {
    const Lucide = lucideIcons[name as keyof typeof lucideIcons];
    // duotone = relleno suave al 20 % (como Phosphor); fill = trazo más firme + relleno parcial (sin tapar el detalle)
    return (
      <Lucide
        className={className}
        strokeWidth={w === "fill" ? 2 : STROKE[w]}
        fill={w === "duotone" || w === "fill" ? "currentColor" : "none"}
        fillOpacity={w === "duotone" ? 0.2 : w === "fill" ? 0.3 : undefined}
        aria-hidden="true"
      />
    );
  }
  const Cmp = icons[name as keyof typeof icons];
  return <Cmp className={className} weight={w} aria-hidden="true" />;
}

export function WhatsAppIcon({ className = "size-6" }: { className?: string }) {
  return <WhatsappLogo className={className} weight="fill" aria-hidden="true" />;
}
