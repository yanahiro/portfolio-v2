"use client";

import dynamic from "next/dynamic";

// three.js and the shaders stay out of the initial bundle; the page is readable without them.
const ParticleStage = dynamic(() => import("./ParticleStage"), { ssr: false });

export default function ParticleStageLazy() {
  return <ParticleStage />;
}
