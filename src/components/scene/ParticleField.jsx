import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

export function ParticleField({ isHuman }) {
  const ref = useRef();
  const { mouse } = useThree();

  const [{ cloud, sphere }] = useState(() => {
    const count = 6000;
    const cloudPts = new Float32Array(count * 3);
    const spherePts = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      cloudPts[i * 3] = (Math.random() - 0.5) * 6;
      cloudPts[i * 3 + 1] = (Math.random() - 0.5) * 6;
      cloudPts[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      spherePts[i * 3] = Math.cos(theta) * Math.sin(phi) * 1.2;
      spherePts[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * 1.2;
      spherePts[i * 3 + 2] = Math.cos(phi) * 1.2;
    }

    return { cloud: cloudPts, sphere: spherePts };
  });

  useFrame((state, delta) => {
    if (!ref.current) return;

    const targetZ = isHuman ? 1.8 : 2.5;
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      targetZ,
      0.05,
    );

    ref.current.rotation.y += delta * 0.1;

    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      mouse.x * 0.2,
      0.1,
    );
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      mouse.y * 0.2,
      0.1,
    );

    const currentPositions = ref.current.geometry.attributes.position.array;
    const targetPositions = isHuman ? sphere : cloud;

    for (let i = 0; i < currentPositions.length; i++) {
      currentPositions[i] = THREE.MathUtils.lerp(
        currentPositions[i],
        targetPositions[i],
        0.05,
      );
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <Points ref={ref} positions={cloud} stride={3}>
        <PointMaterial
          transparent
          color={isHuman ? "#ff7e5f" : "#00d4ff"}
          size={0.015}
          sizeAttenuation
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}
