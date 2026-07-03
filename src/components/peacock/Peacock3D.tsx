"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import PeacockGLTFModel from "./PeacockGLTFModel";
import * as THREE from "three";
import React from "react";

interface Peacock3DProps {
  scrollProgressRef?: React.RefObject<number> | React.MutableRefObject<number> | { current: number };
}

export default function Peacock3D({ scrollProgressRef }: Peacock3DProps) {
  const featherProgressRef = useRef<number>(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const OPEN_DURATION = 3200;

    const tick = (now: number) => {
      const t = (now - start) / OPEN_DURATION;
      const baseline = Math.min(1, Math.max(0, t));
      const eased = 1 - Math.pow(1 - baseline, 3);

      const scrollT = scrollProgressRef
        ? "current" in scrollProgressRef
          ? scrollProgressRef.current
          : 0
        : 0;
      const scrollClose = Math.min(1, Math.max(0, (scrollT - 0.25) * 2.0));
      const val = eased * (1 - scrollClose * 0.35);
      featherProgressRef.current = val;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollProgressRef]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1]"
      data-testid="pk-peacock-canvas"
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6.5], fov: 45, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[3, 4, 5]} intensity={0.9} color="#F3E5AB" />
          <pointLight position={[-4, -2, 3]} intensity={0.7} color="#0F52BA" />
          <pointLight position={[4, 3, -3]} intensity={0.6} color="#097969" />

          <CameraRig scrollProgressRef={scrollProgressRef} />
          <PeacockGLTFModel progressRef={featherProgressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function CameraRig({ scrollProgressRef }: Peacock3DProps) {
  const { camera } = useThree();
  useFrame(() => {
    const t = scrollProgressRef
      ? "current" in scrollProgressRef
        ? scrollProgressRef.current
        : 0
      : 0;

    const targetZ = THREE.MathUtils.lerp(6.5, 0.5, t);
    const targetY = THREE.MathUtils.lerp(0, -0.3, t) + Math.sin(t * Math.PI * 2) * 0.08;
    const targetX = Math.sin(t * Math.PI * 1.5) * 0.35;
    const targetFov = THREE.MathUtils.lerp(45, 65, t);

    const perspectiveCamera = camera as THREE.PerspectiveCamera;

    camera.position.x += (targetX - camera.position.x) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.position.z += (targetZ - camera.position.z) * 0.08;

    perspectiveCamera.fov += (targetFov - perspectiveCamera.fov) * 0.08;
    camera.lookAt(0, 0, 0);
    perspectiveCamera.updateProjectionMatrix();
  });
  return null;
}
