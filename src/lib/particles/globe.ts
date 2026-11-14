/** Points of the globe behind "Say hello.": xyz on a unit sphere, plus (kind, along, seed). */
export type GlobePoints = { position: Float32Array; info: Float32Array };

const ARCS = 7;
const ARC_POINTS = 56;
/** How far an arc rises above the surface at its middle, as a share of the radius. */
const ARC_LIFT = 0.16;

function randomUnit(): [number, number, number] {
  const y = Math.random() * 2 - 1;
  const r = Math.sqrt(1 - y * y);
  const a = Math.random() * Math.PI * 2;
  return [Math.cos(a) * r, y, Math.sin(a) * r];
}

export function buildGlobe(dots: number): GlobePoints {
  const total = dots + ARCS * ARC_POINTS;
  const position = new Float32Array(total * 3);
  const info = new Float32Array(total * 3);

  // Evenly spread dots (Fibonacci sphere).
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < dots; i++) {
    const y = 1 - ((i + 0.5) / dots) * 2;
    const r = Math.sqrt(1 - y * y);
    position.set([Math.cos(golden * i) * r, y, Math.sin(golden * i) * r], i * 3);
    info.set([0, 0, Math.random()], i * 3);
  }

  // Arcs between two places on the surface; a light runs from one to the other.
  let at = dots;
  for (let arc = 0; arc < ARCS; arc++) {
    const a = randomUnit();
    let b = randomUnit();
    let angle = Math.acos(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
    // Neither next door nor on the far side.
    for (let tries = 0; tries < 20 && (angle < 0.7 || angle > 2.2); tries++) {
      b = randomUnit();
      angle = Math.acos(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
    }
    const seed = (arc + Math.random() * 0.6) / ARCS;
    for (let i = 0; i < ARC_POINTS; i++, at++) {
      const s = i / (ARC_POINTS - 1);
      const wa = Math.sin((1 - s) * angle) / Math.sin(angle);
      const wb = Math.sin(s * angle) / Math.sin(angle);
      const lift = 1 + ARC_LIFT * Math.sin(Math.PI * s);
      position.set(
        [(a[0] * wa + b[0] * wb) * lift, (a[1] * wa + b[1] * wb) * lift, (a[2] * wa + b[2] * wb) * lift],
        at * 3,
      );
      info.set([1, s, seed], at * 3);
    }
  }
  return { position, info };
}
