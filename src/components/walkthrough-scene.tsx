"use client";

// Escena 3D del recorrido. Se carga solo en el cliente (next/dynamic con ssr: false) desde walkthrough.tsx.
import { CameraControls, CameraControlsImpl, ContactShadows, Sky } from "@react-three/drei";
import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, Vector3, type Texture } from "three";
import type { Box, Model3D, TourStop } from "@/lib/plan-3d";
import type { Zone } from "@/lib/plan";
import { CeilingLamp, SplitAC } from "./fixtures-3d";

const CM = 0.01; // el modelo esta en cm; la escena en metros

// Colores tomados de las fotos del panol (contenedor blanco, piso gris gastado, estantes oscuros)
const colors = {
  wall: "#e3e5e7",
  frame: "#dfe2e5",
  post: "#eceef0",
  board: "#4a3d32",
  floor: "#55585b",
  grass: "#4f7637",
  zone: "#c8102e",
};

// Libera la textura de la GPU cuando se reemplaza o se desmonta
function useDispose<T extends Texture>(t: T): T {
  useEffect(() => () => t.dispose(), [t]);
  return t;
}

function canvasTexture(size: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("walkthrough: canvas 2D no disponible");
  draw(ctx);
  const t = new CanvasTexture(canvas);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.colorSpace = SRGBColorSpace;
  return t;
}

// Chapa ondulada: franjas claras y oscuras que se repiten a lo largo del muro
function corrugation() {
  return canvasTexture(64, 4, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 64, 0);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.35, "#d3d6d9");
    g.addColorStop(0.5, "#bfc3c7");
    g.addColorStop(0.65, "#d3d6d9");
    g.addColorStop(1, "#ffffff");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 4);
  });
}

// Manchas al azar sobre blanco: desgaste del piso y textura del pasto (toma el color del material)
function speckle(spots: number, min: number, max: number) {
  return canvasTexture(256, 256, (ctx) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < spots; i++) {
      const v = Math.round(min + Math.random() * (max - min));
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 3, 1 + Math.random() * 3);
    }
  });
}

const RIB = 25; // cm entre ondas de la chapa

// Caja con chapa ondulada en sus caras largas
function Corrugated({ box, color, base }: { box: Box; color: string; base: CanvasTexture }) {
  const map = useDispose(
    useMemo(() => {
      const t = base.clone();
      t.repeat.set(Math.max(box.w, box.d) / RIB, 1);
      t.needsUpdate = true;
      return t;
    }, [base, box.w, box.d]),
  );
  return (
    <mesh position={[box.x, box.y, box.z]}>
      <boxGeometry args={[box.w, box.h, box.d]} />
      <meshStandardMaterial color={color} map={map} roughness={0.6} metalness={0.15} />
    </mesh>
  );
}

function Solid({ box, color, roughness = 0.6, metalness = 0 }: { box: Box; color: string; roughness?: number; metalness?: number }) {
  return (
    <mesh position={[box.x, box.y, box.z]}>
      <boxGeometry args={[box.w, box.h, box.d]} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

// inside: camara dentro del contenedor. Las luminarias cuelgan del techo, que en la vista general no esta.
function Model({ model, inside }: { model: Model3D; inside: boolean }) {
  const ribs = useDispose(useMemo(() => corrugation(), []));
  const wear = useDispose(
    useMemo(() => {
      const t = speckle(2500, 150, 235);
      t.repeat.set(6, 1.2);
      return t;
    }, []),
  );
  const { length: L, width: W, height: H } = model;
  return (
    <group scale={CM} position={[(-L / 2) * CM, 0, (-W / 2) * CM]}>
      <mesh position={[L / 2, 1, W / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[L, W]} />
        <meshStandardMaterial color={colors.floor} map={wear} roughness={0.95} />
      </mesh>
      {/* Techo de una sola cara, mirando hacia abajo: se ve desde adentro y desaparece desde arriba */}
      <mesh position={[L / 2, H, W / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[L, W]} />
        <meshStandardMaterial color={colors.wall} roughness={0.8} />
      </mesh>
      {model.walls.map((b, i) => (
        <Corrugated key={i} box={b} color={colors.wall} base={ribs} />
      ))}
      {model.doors.map((b, i) => (
        <Corrugated key={i} box={b} color={colors.wall} base={ribs} />
      ))}
      {model.frame.map((b, i) => (
        <Solid key={i} box={b} color={colors.frame} roughness={0.5} metalness={0.2} />
      ))}
      {model.posts.map((b, i) => (
        <Solid key={i} box={b} color={colors.post} roughness={0.5} metalness={0.2} />
      ))}
      {model.boards.map((b, i) => (
        <Solid key={i} box={b} color={colors.board} roughness={0.85} />
      ))}
      {model.fixtures.map((f, i) =>
        f.kind === "ac" ? (
          <SplitAC key={i} position={[f.x, f.y, f.z]} facing={f.facing} />
        ) : (
          inside && <CeilingLamp key={i} position={[f.x, f.y, f.z]} />
        ),
      )}
    </group>
  );
}

// Cielo de dia: el pasto llega al horizonte y se pierde en la bruma (sin borde visible)
const SUN: [number, number, number] = [-8, 12, 6];
const GROUND_RADIUS = 300; // m
const HAZE = { color: "#d3e2ef", near: 60, far: 260 }; // la camara nunca pasa de ~50 m: el contenedor no se empana

function Ground() {
  const grass = useDispose(
    useMemo(() => {
      const t = speckle(9000, 120, 255);
      t.repeat.set(GROUND_RADIUS / 0.95, GROUND_RADIUS / 0.95); // una baldosa de textura cada ~1,9 m
      return t;
    }, []),
  );
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[GROUND_RADIUS, 64]} />
      <meshStandardMaterial color={colors.grass} map={grass} roughness={1} />
    </mesh>
  );
}

// Volumenes invisibles por zona: en la vista general, tocar uno lleva a esa parada
function ZoneTargets({ zones, model, onSelect }: { zones: Zone[]; model: Model3D; onSelect: (i: number) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const { length: L, width: W, height: H } = model;
  useEffect(() => {
    document.body.style.cursor = hover === null ? "" : "pointer";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hover]);
  return (
    <group scale={CM} position={[(-L / 2) * CM, 0, (-W / 2) * CM]}>
      {zones.map((z, i) => (
        <mesh
          key={z.id}
          position={[z.x + z.w / 2, H / 2, z.y + z.h / 2]}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setHover(i);
          }}
          onPointerOut={() => setHover((h) => (h === i ? null : h))}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            if (e.delta < 6) onSelect(i); // un arrastre para girar no cuenta como toque
          }}
        >
          <boxGeometry args={[z.w, H, z.h]} />
          <meshBasicMaterial color={colors.zone} transparent opacity={hover === i ? 0.18 : 0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// Vista general alta: con el techo abierto, el interior se ve desde arriba y los muros tapan poco
const OVERVIEW = { position: new Vector3(1.5, 12.4, 6.4), target: new Vector3(0, 0.3, 0) };
const OVERVIEW_MAX_POLAR = Math.PI * 0.25;
const LOOK_RADIUS = 0.05; // m: la camara gira sobre un punto pegado a los ojos (mirar alrededor)

function toWorld(p: [number, number, number], L: number, W: number) {
  return new Vector3((p[0] - L / 2) * CM, p[1] * CM, (p[2] - W / 2) * CM);
}

function Rig({ model, stops, active }: { model: Model3D; stops: TourStop[]; active: number | null }) {
  const ref = useRef<CameraControlsImpl>(null);
  const aspect = useThree((s) => s.size.width / s.size.height);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { ACTION } = CameraControlsImpl;
    // Los limites se fijan antes de la transicion: camera-controls los aplica al destino, no al recorrido.
    // (Si se fijaban al terminar la transicion, con frameloop "demand" a veces nunca se aplicaban y la
    // camara podia pasar por debajo del pasto.)
    if (active === null) {
      // Pantallas angostas: alejar la camara para que entren los 12 m
      const dir = OVERVIEW.position.clone().sub(OVERVIEW.target).multiplyScalar(Math.max(1, 1.35 / aspect));
      const pos = OVERVIEW.target.clone().add(dir);
      c.azimuthRotateSpeed = c.polarRotateSpeed = 1;
      c.minDistance = 5;
      c.maxDistance = dir.length() * 1.6;
      c.maxPolarAngle = OVERVIEW_MAX_POLAR;
      c.mouseButtons.left = ACTION.ROTATE;
      c.mouseButtons.right = ACTION.NONE;
      c.mouseButtons.wheel = ACTION.DOLLY;
      c.touches.one = ACTION.TOUCH_ROTATE;
      c.touches.two = ACTION.TOUCH_DOLLY;
      void Promise.all([
        c.zoomTo(1, smooth),
        c.setLookAt(pos.x, pos.y, pos.z, OVERVIEW.target.x, OVERVIEW.target.y, OVERVIEW.target.z, smooth),
      ]);
    } else {
      const stop = stops[active];
      const eye = toWorld(stop.eye, model.length, model.width);
      const look = toWorld(stop.look, model.length, model.width);
      const target = eye.clone().add(look.sub(eye).normalize().multiplyScalar(LOOK_RADIUS));
      // Girar invertido: arrastrar mueve la mirada, no la camara alrededor de un objeto
      c.azimuthRotateSpeed = c.polarRotateSpeed = -0.35;
      c.minDistance = c.maxDistance = LOOK_RADIUS;
      c.maxPolarAngle = Math.PI;
      c.mouseButtons.left = ACTION.ROTATE;
      c.mouseButtons.right = ACTION.NONE;
      c.mouseButtons.wheel = ACTION.ZOOM;
      c.touches.one = ACTION.TOUCH_ROTATE;
      c.touches.two = ACTION.TOUCH_ZOOM;
      void c.setLookAt(eye.x, eye.y, eye.z, target.x, target.y, target.z, smooth);
    }
  }, [active, stops, model, aspect]);

  return <CameraControls ref={ref} makeDefault minZoom={1} maxZoom={2.5} smoothTime={0.6} />;
}

export default function WalkthroughScene({
  model,
  stops,
  active,
  onSelect,
}: {
  model: Model3D;
  stops: TourStop[];
  active: number | null;
  onSelect: (i: number) => void;
}) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: OVERVIEW.position.toArray(), fov: 50, near: 0.1, far: 400 }}
      fallback={<p className="p-6 text-white/70">Tu navegador no puede mostrar la vista 3D.</p>}
    >
      <Sky distance={350} sunPosition={SUN} turbidity={3} rayleigh={0.8} mieCoefficient={0.004} mieDirectionalG={0.8} />
      <fog attach="fog" args={[HAZE.color, HAZE.near, HAZE.far]} />
      {/* Luz de dia de costado (marca el relieve de la chapa) + cielo/pasto */}
      <ambientLight intensity={0.7} />
      {/* Rebote desde abajo neutro: adentro el piso es gris (un tono verde ensuciaba techo y tablas) */}
      <hemisphereLight args={["#dfe8f5", "#8c8f92", 1.1]} />
      <directionalLight position={SUN} intensity={2.2} />
      <Ground />
      <ContactShadows position={[0, 0.002, 0]} scale={[16, 6]} resolution={512} opacity={0.55} blur={2.4} far={3.2} frames={1} />
      <Model model={model} inside={active !== null} />
      {active === null && <ZoneTargets zones={stops.map((s) => s.zone)} model={model} onSelect={onSelect} />}
      <Rig model={model} stops={stops} active={active} />
    </Canvas>
  );
}
