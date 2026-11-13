/** Minimal circle physics for the skills playground: springs to a target, collisions, walls. */

export type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  /** Point the body is gently pulled toward. */
  tx: number;
  ty: number;
  /** Pull strength per axis. */
  kx: number;
  ky: number;
  /** Held bodies are moved by the pointer, not by the simulation. */
  held: boolean;
  /** Dropping in from above: the top wall lets the body through until it is inside. */
  entering?: boolean;
};

export type Pointer = { x: number; y: number; active: boolean };

const DAMPING = 0.93;
const WALL_BOUNCE = 0.45;
const POINTER_REACH = 70;

export function step(bodies: Body[], width: number, height: number, time: number, pointer?: Pointer) {
  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    if (b.held) continue;

    b.vx += (b.tx - b.x) * b.kx;
    b.vy += (b.ty - b.y) * b.ky;

    // A slow, per-body drift keeps the field alive.
    b.vx += Math.sin(time * 0.35 + i * 1.7) * 0.03;
    b.vy += Math.cos(time * 0.3 + i * 2.3) * 0.03;

    if (pointer?.active) {
      const dx = b.x - pointer.x;
      const dy = b.y - pointer.y;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = b.r + POINTER_REACH;
      if (dist < reach) {
        const force = (1 - dist / reach) * 0.9;
        b.vx += (dx / dist) * force;
        b.vy += (dy / dist) * force;
      }
    }

    b.vx *= DAMPING;
    b.vy *= DAMPING;
    b.x += b.vx;
    b.y += b.vy;
  }

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const min = a.r + b.r + 4;
      const distSq = dx * dx + dy * dy;
      if (distSq >= min * min) continue;

      const dist = Math.sqrt(distSq) || 0.01;
      const nx = dx / dist;
      const ny = dy / dist;
      const overlap = min - dist;
      const aShare = a.held ? 0 : b.held ? 1 : 0.5;
      const bShare = b.held ? 0 : a.held ? 1 : 0.5;
      a.x -= nx * overlap * aShare;
      a.y -= ny * overlap * aShare;
      b.x += nx * overlap * bShare;
      b.y += ny * overlap * bShare;

      // Trade the velocity along the collision normal.
      const relative = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (relative < 0) {
        if (!a.held) {
          a.vx += nx * relative * 0.5;
          a.vy += ny * relative * 0.5;
        }
        if (!b.held) {
          b.vx -= nx * relative * 0.5;
          b.vy -= ny * relative * 0.5;
        }
      }
    }
  }

  for (const b of bodies) {
    if (b.held) continue;
    if (b.x < b.r) {
      b.x = b.r;
      b.vx = Math.abs(b.vx) * WALL_BOUNCE;
    } else if (b.x > width - b.r) {
      b.x = width - b.r;
      b.vx = -Math.abs(b.vx) * WALL_BOUNCE;
    }
    if (b.entering) {
      if (b.y >= b.r) b.entering = false;
    } else if (b.y < b.r) {
      b.y = b.r;
      b.vy = Math.abs(b.vy) * WALL_BOUNCE;
    } else if (b.y > height - b.r) {
      b.y = height - b.r;
      b.vy = -Math.abs(b.vy) * WALL_BOUNCE;
    }
  }
}
