import React from "react";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Glitch,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { ParticleField } from "./ParticleField.jsx";

export default function HeroScene({ isHuman, glitch }) {
  return (
    <div className="bg3d">
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <ParticleField isHuman={isHuman} />
        <EffectComposer>
          {glitch && <Glitch duration={[0.2, 0.4]} strength={[0.3, 0.5]} />}
          <ChromaticAberration offset={isHuman ? [0, 0] : [0.002, 0.002]} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
