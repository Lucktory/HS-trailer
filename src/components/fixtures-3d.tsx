"use client";

// Equipos 3D reutilizables (en cm, dentro del grupo escalado del modelo). Cualquier plano los ubica
// con Plan.fixtures; las medidas viven en lib/plan-3d.ts.
import { RoundedBox } from "@react-three/drei";
import { useState } from "react";
import { Object3D } from "three";
import type { Facing } from "@/lib/plan-3d";
import { AC_UNIT, LAMP } from "@/lib/plan-3d";

const facingRotation: Record<Facing, number> = { "+z": 0, "-z": Math.PI, "+x": Math.PI / 2, "-x": -Math.PI / 2 };

const white = "#f7f8f9";

// Unidad interior de split. Origen: centro de la cara trasera (contra el muro); el frente mira a +z.
export function SplitAC({ position, facing }: { position: [number, number, number]; facing: Facing }) {
  const { w, h, d } = AC_UNIT;
  const slats = Array.from({ length: 9 }, (_, i) => 3 + i * ((d - 8) / 8));
  return (
    <group position={position} rotation={[0, facingRotation[facing], 0]}>
      {/* Cuerpo con cantos redondeados */}
      <RoundedBox args={[w, h, d]} radius={4} smoothness={4} position={[0, 0, d / 2]} castShadow receiveShadow>
        <meshStandardMaterial color={white} roughness={0.35} />
      </RoundedBox>
      {/* Panel frontal liso, apenas sobresaliente */}
      <RoundedBox args={[w - 3, h - 10, 0.8]} radius={0.4} smoothness={2} position={[0, 3, d + 0.2]} castShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </RoundedBox>
      {/* Toma de aire superior: rejilla de varillas sobre fondo oscuro */}
      <mesh position={[0, h / 2 + 0.05, d / 2]}>
        <boxGeometry args={[w - 12, 0.2, d - 6]} />
        <meshStandardMaterial color="#5f656b" roughness={0.8} />
      </mesh>
      {slats.map((z) => (
        <mesh key={z} position={[0, h / 2 + 0.3, z]}>
          <boxGeometry args={[w - 12, 0.4, 0.6]} />
          <meshStandardMaterial color={white} roughness={0.4} />
        </mesh>
      ))}
      {/* Salida de aire abajo al frente, con la aleta inclinada */}
      <mesh position={[0, -h / 2 + 1.6, d - 4]}>
        <boxGeometry args={[w - 10, 3, 8.4]} />
        <meshStandardMaterial color="#1f2327" roughness={0.9} />
      </mesh>
      <mesh position={[0, -h / 2 - 0.6, d - 2.5]} rotation={[-0.45, 0, 0]} castShadow>
        <boxGeometry args={[w - 12, 0.6, 7]} />
        <meshStandardMaterial color={white} roughness={0.35} />
      </mesh>
      {/* Luz de estado */}
      <mesh position={[w / 2 - 9, -h / 2 + 6.5, d + 0.65]}>
        <boxGeometry args={[1.4, 0.5, 0.1]} />
        <meshBasicMaterial color="#5ec8ff" toneMapped={false} />
      </mesh>
    </group>
  );
}

// Plafon redondo de techo. Origen: centro de la base, pegada al techo; la cupula cuelga hacia -y.
// Ilumina hacia abajo en un cono amplio, como un plafon real (no quema el techo que lo rodea).
export function CeilingLamp({ position }: { position: [number, number, number] }) {
  const r = LAMP.diameter / 2;
  const [aim] = useState(() => new Object3D());
  return (
    <group position={position}>
      <mesh position={[0, -LAMP.base / 2, 0]} castShadow>
        <cylinderGeometry args={[r, r, LAMP.base, 40]} />
        <meshStandardMaterial color={white} roughness={0.4} />
      </mesh>
      {/* Difusor opalino: media esfera achatada que brilla */}
      <mesh position={[0, -LAMP.base, 0]} scale={[1, LAMP.dome / (r - 1.5), 1]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[r - 1.5, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#fffdf5" emissive="#fff4d6" emissiveIntensity={1.4} roughness={0.3} />
      </mesh>
      <primitive object={aim} position={[0, -100, 0]} />
      <spotLight position={[0, -LAMP.base - LAMP.dome, 0]} target={aim} angle={1.2} penumbra={1} intensity={6} distance={0} decay={2} color="#fff4e0" />
    </group>
  );
}
