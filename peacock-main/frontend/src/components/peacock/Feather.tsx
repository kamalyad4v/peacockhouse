"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React from 'react';

interface FeatherProps {
  angle?: number;
  radius?: number;
  index?: number;
  total?: number;
  progressRef?: React.RefObject<number> | React.MutableRefObject<number> | { current: number };
  swayPhase?: number;
}

export default function Feather({
  angle = 0,
  radius = 1.6,
  index = 0,
  total = 30,
  progressRef,
  swayPhase = 0,
}: FeatherProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uColorA: { value: new THREE.Color("#097969") },
      uColorB: { value: new THREE.Color("#0F52BA") },
      uColorC: { value: new THREE.Color("#008080") },
      uColorGold: { value: new THREE.Color("#D4AF37") },
      uColorDark: { value: new THREE.Color("#050B18") },
    }),
    []
  );

  const revealDelay = useMemo(() => {
    const centerBias = Math.abs(index - total / 2) / (total / 2);
    return centerBias * 0.55;
  }, [index, total]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const progress = progressRef ? ('current' in progressRef ? progressRef.current : 0) : 0;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }

    const local = THREE.MathUtils.clamp(
      (progress - revealDelay) / Math.max(0.001, 1 - revealDelay),
      0,
      1
    );

    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = local;
    }

    const targetAngle = angle * local;
    const sway = Math.sin(t * 0.6 + swayPhase) * 0.02 * local;
    groupRef.current.rotation.z = targetAngle + sway;

    const s = 0.05 + local * 1.15;
    groupRef.current.scale.set(s, s, s);
  });

  const vertexShader = `
    varying vec2 vUv;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec3 pos = position;
      float bend = smoothstep(0.4, 1.0, uv.y) * 0.15 * (0.7 + 0.3 * sin(uTime + uv.x * 6.0));
      pos.z += bend;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uProgress;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform vec3 uColorGold;
    uniform vec3 uColorDark;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      float xCentered = (vUv.x - 0.5) * 2.0;
      float y = vUv.y;

      // Elliptical envelope with narrow tip and rounded base
      float envX = pow(1.0 - abs(xCentered), 0.75);
      float envY = smoothstep(0.02, 0.14, y) * (1.0 - smoothstep(0.94, 1.0, y));
      float shape = envX * envY;

      // Barbs (subtle striations)
      float barb = 0.5 + 0.5 * sin((y - abs(xCentered) * 0.3) * 220.0);
      barb = mix(0.85, 1.0, barb);

      // Central rachis (feather spine)
      float rachis = smoothstep(0.05, 0.0, abs(xCentered));

      // Peacock eye — concentric rings near the top
      vec2 eyeCenter = vec2(0.5, 0.82);
      vec2 diff = vUv - eyeCenter;
      diff.x *= 2.4;
      float d = length(diff);

      float ringDark   = smoothstep(0.085, 0.070, d);
      float ringBlue   = smoothstep(0.130, 0.110, d) - ringDark;
      float ringGreen  = smoothstep(0.170, 0.150, d) - smoothstep(0.130, 0.110, d);
      float ringGold   = smoothstep(0.220, 0.200, d) - smoothstep(0.170, 0.150, d);

      // Iridescent base — teal→emerald→sapphire based on length
      float shift = 0.5 + 0.5 * sin(y * 5.0 + uTime * 0.35);
      vec3 iridA = mix(uColorC, uColorA, shift);
      vec3 iridB = mix(uColorA, uColorB, 0.5 + 0.5 * sin(uTime * 0.25 + y * 2.4));
      vec3 base = mix(iridA, iridB, smoothstep(0.05, 0.95, y));
      base *= barb;

      vec3 color = base;
      color = mix(color, uColorGold, ringGold * 0.85);
      color = mix(color, uColorA * 1.2, ringGreen);
      color = mix(color, uColorB * 1.1, ringBlue);
      color = mix(color, uColorDark, ringDark);

      // Gold rachis highlight
      color = mix(color, uColorGold * 1.4, rachis * 0.65);

      // Warm edge glow
      float edge = pow(1.0 - envX, 3.5);
      color += uColorGold * edge * 0.25;

      // Grain sparkle
      float n = hash(floor(vUv * 240.0));
      color += vec3(n * 0.04);

      // Reveal brightness pulse
      float pulse = smoothstep(0.0, 1.0, uProgress);
      color *= (0.55 + pulse * 0.9);

      float alpha = clamp(shape, 0.0, 1.0);
      alpha *= (0.22 + pulse * 0.78);

      if (alpha < 0.015) discard;

      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <group ref={groupRef}>
      <mesh position={[0, radius, 0]}>
        <planeGeometry args={[0.6, 2.4, 16, 96]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </group>
  );
}
