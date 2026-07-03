"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import React from "react";

interface PeacockGLTFModelProps {
  progressRef?: React.RefObject<number> | React.MutableRefObject<number> | { current: number };
}

const MODEL_URL = "/models/peacock-hero.glb";
const SCALE = 4.6;
const HALF_WIDTH = 0.5;

export default function PeacockGLTFModel({ progressRef }: PeacockGLTFModelProps) {
  const { scene } = useGLTF(MODEL_URL) as unknown as { scene: THREE.Group };
  const groupRef = useRef<THREE.Group>(null);

  const progressUniform = useMemo(() => ({ value: 0 }), []);
  const timeUniform = useMemo(() => ({ value: 0 }), []);

  const cloned = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      mesh.castShadow = false;
      mesh.receiveShadow = false;

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((m) => {
        if (!m) return;
        const mat = m as THREE.MeshStandardMaterial;
        mat.envMapIntensity = 1.1;

        mat.onBeforeCompile = (shader) => {
          shader.uniforms.uProgress = progressUniform;
          shader.uniforms.uTime = timeUniform;

          shader.vertexShader =
            `
            uniform float uProgress;
            uniform float uTime;
            varying float vReveal;
            varying float vEdge;
            ` + shader.vertexShader;

          shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",
            `
            #include <begin_vertex>
            float delay = clamp(abs(position.x) / ${HALF_WIDTH.toFixed(2)}, 0.0, 1.0) * 0.55;
            float local = clamp((uProgress - delay) / max(0.001, 1.0 - delay), 0.0, 1.0);
            float eased = local * local * (3.0 - 2.0 * local);
            vReveal = eased;
            vEdge = 1.0 - smoothstep(0.0, 0.09, abs(delay - uProgress));
            float growth = mix(0.06, 1.0, eased);
            transformed *= growth;
            transformed.z += sin(uTime * 0.6 + position.x * 4.0) * 0.01 * eased;
            `
          );

          shader.fragmentShader =
            `
            uniform float uTime;
            varying float vReveal;
            varying float vEdge;
            ` + shader.fragmentShader;

          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <color_fragment>",
            `
            #include <color_fragment>
            diffuseColor.rgb *= (0.35 + vReveal * 0.75);
            `
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <emissivemap_fragment>",
            `
            #include <emissivemap_fragment>
            vec3 shimmerViewDir = normalize(vViewPosition);
            float shimmerFresnel = pow(1.0 - max(dot(shimmerViewDir, normalize(vNormal)), 0.0), 2.5);
            vec3 shimmerColor = mix(
              vec3(0.90, 0.70, 0.28),
              vec3(0.06, 0.55, 0.55),
              0.5 + 0.5 * sin(uTime * 2.0 + vReveal * 6.0)
            );
            totalEmissiveRadiance += shimmerColor * shimmerFresnel * vEdge * 1.6;
            `
          );

          mat.userData.shader = shader;
        };

        mat.needsUpdate = true;
      });
    });

    return clone;
  }, [scene, progressUniform, timeUniform]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    timeUniform.value = t;

    const progress = progressRef ? ("current" in progressRef ? progressRef.current : 0) : 0;
    progressUniform.value = progress;

    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.25) * 0.02;
      groupRef.current.rotation.y = -Math.PI / 2 + Math.sin(t * 0.4) * 0.12;
      groupRef.current.position.y = -1.7 + Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <group>
      <mesh position={[0, 0.6, -1.6]}>
        <circleGeometry args={[3.4, 64]} />
        <meshBasicMaterial color={new THREE.Color("#050B18")} transparent opacity={0.35} />
      </mesh>

      <group ref={groupRef} position={[0, -1.7, 0]} scale={SCALE}>
        <primitive object={cloned} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
