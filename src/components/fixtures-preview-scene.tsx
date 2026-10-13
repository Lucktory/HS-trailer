"use client";

// Vista de revision de los equipos 3D: cada uno solo, en perspectiva, con luz de dia fuerte.
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";
import { CeilingLamp, SplitAC } from "./fixtures-3d";

const CM = 0.01;

// Balanceo lento para ver el volumen desde varios angulos
function Swing({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.7;
  });
  return <group ref={ref}>{children}</group>;
}

function Daylight() {
  return (
    <>
      <color attach="background" args={["#dbe7f3"]} />
      <ambientLight intensity={0.4} />
      <hemisphereLight args={["#ffffff", "#b9c4cf", 1.3]} />
      <directionalLight
        position={[3, 4, 4]}
        intensity={3.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-left={-1}
        shadow-camera-right={1}
        shadow-camera-top={1}
        shadow-camera-bottom={-1}
      />
    </>
  );
}

function Stage({ camera, target, children }: { camera: [number, number, number]; target: [number, number, number]; children: ReactNode }) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: camera, fov: 35, near: 0.05, far: 20 }}>
      <Daylight />
      <Swing>
        <group scale={CM}>{children}</group>
      </Swing>
      <OrbitControls target={target} enablePan={false} minDistance={0.4} maxDistance={3} />
    </Canvas>
  );
}

export default function FixturesPreviewScene({ item }: { item: "ac" | "lamp" }) {
  if (item === "ac")
    return (
      <Stage camera={[0.75, 0.22, 1.45]} target={[0, -0.02, 0.1]}>
        {/* Tramo de muro detras del equipo */}
        <mesh position={[0, 0, -1]} receiveShadow>
          <boxGeometry args={[140, 70, 2]} />
          <meshStandardMaterial color="#e3e5e7" roughness={0.7} />
        </mesh>
        <SplitAC position={[0, 0, 0]} facing="+z" />
      </Stage>
    );
  return (
    <Stage camera={[0.42, -0.36, 0.56]} target={[0, -0.03, 0]}>
      {/* Tramo de techo sobre la luminaria */}
      <mesh position={[0, 1, 0]} receiveShadow>
        <boxGeometry args={[90, 2, 90]} />
        <meshStandardMaterial color="#e3e5e7" roughness={0.7} />
      </mesh>
      <CeilingLamp position={[0, 0, 0]} />
    </Stage>
  );
}
