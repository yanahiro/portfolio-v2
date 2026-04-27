"use client";

import { useEffect, useRef } from "react";

type Props = {
  color?: string;
  particleCount?: number;
  opacity?: number;
};

export default function Streamlines({
  color = "rgba(182, 255, 60, 0.7)",
  particleCount = 110,
  opacity = 0.22,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;
    let visible = true;

    type P = { x: number; y: number; px: number; py: number; life: number; max: number };
    const particles: P[] = [];

    const seed = (p: P) => {
      p.x = Math.random() * w;
      p.y = Math.random() * h;
      p.px = p.x;
      p.py = p.y;
      p.life = 0;
      p.max = 80 + Math.random() * 160;
    };

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        const p: P = { x: 0, y: 0, px: 0, py: 0, life: 0, max: 0 };
        seed(p);
        particles.push(p);
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fillRect(0, 0, w, h);
    };

    // Smooth pseudo flow field via combined sines
    const field = (x: number, y: number) => {
      const nx = x / w;
      const ny = y / h;
      const a =
        Math.sin(nx * 4 + t * 0.0008) * 1.4 +
        Math.cos(ny * 5 - t * 0.0006) * 1.0 +
        Math.sin((nx + ny) * 6 + t * 0.0004) * 0.6;
      return a * Math.PI;
    };

    const draw = () => {
      // semi-transparent black overlay = trail fade
      ctx.fillStyle = "rgba(5, 6, 10, 0.06)";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = color;
      ctx.lineWidth = 0.6;

      for (const p of particles) {
        const a = field(p.x, p.y);
        p.px = p.x;
        p.py = p.y;
        p.x += Math.cos(a) * 0.9;
        p.y += Math.sin(a) * 0.9;
        p.life++;

        if (p.life > p.max || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          seed(p);
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      t += 1;
      if (visible) raf = requestAnimationFrame(draw);
    };

    resize();
    if (reduced) {
      // a single still frame
      for (let i = 0; i < 200; i++) draw();
      cancelAnimationFrame(raf);
      return () => {};
    }
    window.addEventListener("resize", resize);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
          if (visible && !raf) raf = requestAnimationFrame(draw);
          if (!visible) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        }
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      io.disconnect();
    };
  }, [color, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      style={{ opacity }}
    />
  );
}
