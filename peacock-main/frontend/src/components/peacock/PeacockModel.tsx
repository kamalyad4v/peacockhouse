"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Feather from "./Feather";
import React from 'react';

interface PeacockModelProps {
  progressRef?: React.RefObject<number> | React.MutableRefObject<number> | { current: number };
}

export default function PeacockModel({ progressRef }: PeacockModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  const feathers = useMemo(() => {
    const TOTAL = 28;
    const arc = Math.PI * 1.05;
    const start = -arc / 2;
    const out = [];
    for (let i = 0; i < TOTAL; i++) {
      const t = i / (TOTAL - 1);
      const angle = start + t * arc;
      out.push({ angle, index: i, total: TOTAL, phase: i * 0.37 });
    }
    return out;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 0.25) * 0.02;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.05 - 0.05;

    if (bodyRef.current) {
      bodyRef.current.rotation.y = Math.sin(t * 0.4) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient back-glow disc */}
      <mesh position={[0, 0.6, -1.6]}>
        <circleGeometry args={[3.4, 64]} />
        <meshBasicMaterial
          color={new THREE.Color("#050B18")}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Feather fan (rendered first so body appears in front) */}
      <group position={[0, -0.4, 0]}>
        {feathers.map((f) => (
          <Feather
            key={f.index}
            angle={f.angle}
            index={f.index}
            total={f.total}
            swayPhase={f.phase}
            progressRef={progressRef}
          />
        ))}
      </group>

      {/* Peacock body silhouette (front layer) */}
      <group ref={bodyRef} position={[0, -0.45, 0.2]} scale={0.6}>
        {/* Neck */}
        <mesh position={[0, 0.35, 0.02]}>
          <cylinderGeometry args={[0.09, 0.16, 0.55, 24]} />
          <meshStandardMaterial
            color="#0A1F2A"
            emissive="#0F52BA"
            emissiveIntensity={0.45}
            roughness={0.3}
            metalness={0.85}
          />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.75, 0.05]}>
          <sphereGeometry args={[0.15, 24, 24]} />
          <meshStandardMaterial
            color="#0F52BA"
            emissive="#0F52BA"
            emissiveIntensity={0.4}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        {/* Crest — 3 tiny feathers */}
        {[-0.09, 0, 0.09].map((dx, i) => (
          <mesh
            key={i}
            position={[dx, 0.95 + Math.abs(dx) * -0.03, 0.05]}
            rotation={[0, 0, dx * 2.5]}
          >
            <cylinderGeometry args={[0.004, 0.018, 0.16, 8]} />
            <meshStandardMaterial
              color="#D4AF37"
              emissive="#D4AF37"
              emissiveIntensity={0.7}
              roughness={0.4}
              metalness={0.9}
            />
          </mesh>
        ))}
        {/* Crest orbs */}
        {[-0.09, 0, 0.09].map((dx, i) => (
          <mesh
            key={`orb-${i}`}
            position={[dx * 1.15, 1.03, 0.05]}
          >
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshStandardMaterial
              color="#097969"
              emissive="#097969"
              emissiveIntensity={0.9}
              roughness={0.3}
              metalness={0.9}
            />
          </mesh>
        ))}
        {/* Eye dot */}
        <mesh position={[0.06, 0.77, 0.16]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshBasicMaterial color="#F3E5AB" />
        </mesh>
        {/* Beak */}
        <mesh position={[0, 0.73, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.035, 0.12, 12]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>
    </group>
  );
}
