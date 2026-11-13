"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, SKILLS, type SkillCategory } from "@/data/skills";
import { prefersReducedMotion } from "@/lib/gsap";
import { step, type Body, type Pointer } from "@/lib/physics";

type Filter = SkillCategory | "all";

/** Steps run up front so the field appears settled instead of exploding into place. */
const SETTLE_STEPS = 240;
/** Share of the field that must be on screen before the logos drop in. */
const ENTER_RATIO = 0.3;

export default function LogoPlayground() {
  const fieldRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<Filter>("all");
  const applyFilterRef = useRef<(filter: Filter) => void>(() => {});
  const [filter, setFilter] = useState<Filter>("all");
  const [live, setLive] = useState(false);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const reduced = prefersReducedMotion();
    const items = Array.from(field.children) as HTMLElement[];
    const pointer: Pointer = { x: 0, y: 0, active: false };
    let width = field.clientWidth;
    let height = field.clientHeight;
    let time = 0;
    let raf = 0;
    let visible = false;
    let hasEntered = reduced;

    const radius = (major: boolean | undefined, scale = 1) => {
      const compact = width < 640;
      return (major ? (compact ? 38 : 66) : compact ? 27 : 46) * scale;
    };

    const bodies: Body[] = SKILLS.map((skill) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      r: radius(skill.major),
      tx: width / 2,
      ty: height / 2,
      kx: 0,
      ky: 0,
      held: false,
    }));

    const applyFilter = (next: Filter) => {
      filterRef.current = next;
      SKILLS.forEach((skill, i) => {
        const b = bodies[i];
        const match = next === "all" || skill.category === next;
        b.r = radius(skill.major, match ? 1 : 0.62);
        if (match) {
          // Spread wide, stay vertically centred; pack tighter when filtered.
          b.tx = width / 2;
          b.ty = height / 2;
          b.kx = next === "all" ? 0.0003 : 0.004;
          b.ky = next === "all" ? 0.004 : 0.005;
        } else {
          // Retreat to the nearer side.
          b.tx = b.x < width / 2 ? b.r : width - b.r;
          b.ty = b.y;
          b.kx = 0.006;
          b.ky = 0;
        }
        const el = items[i];
        el.style.width = el.style.height = `${b.r * 2}px`;
        el.dataset.dimmed = match ? "false" : "true";
      });
      if (reduced || !visible) settle();
    };
    applyFilterRef.current = applyFilter;

    const draw = () => {
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        items[i].style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0)`;
      }
    };

    const settle = () => {
      for (let i = 0; i < SETTLE_STEPS; i++) step(bodies, width, height, 0);
      for (const b of bodies) b.vx = b.vy = 0;
      draw();
    };

    const tick = () => {
      time += 1 / 60;
      step(bodies, width, height, time, pointer);
      draw();
      raf = requestAnimationFrame(tick);
    };

    const toLocal = (e: PointerEvent) => {
      const rect = field.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onFieldMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const p = toLocal(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = true;
    };
    const onFieldLeave = () => {
      pointer.active = false;
    };

    // Grab a logo, drag it, and throw it on release.
    const stopDrag: (() => void)[] = [];
    items.forEach((el, i) => {
      const b = bodies[i];
      let lastX = 0, lastY = 0, velX = 0, velY = 0;

      const onDown = (e: PointerEvent) => {
        if (reduced) return;
        el.setPointerCapture(e.pointerId);
        b.held = true;
        el.dataset.held = "true";
        const p = toLocal(e);
        lastX = p.x;
        lastY = p.y;
        velX = velY = 0;
      };
      const onMove = (e: PointerEvent) => {
        if (!b.held) return;
        const p = toLocal(e);
        velX = p.x - lastX;
        velY = p.y - lastY;
        lastX = p.x;
        lastY = p.y;
        b.x = Math.min(Math.max(p.x, b.r), width - b.r);
        b.y = Math.min(Math.max(p.y, b.r), height - b.r);
      };
      const onUp = () => {
        if (!b.held) return;
        b.held = false;
        el.dataset.held = "false";
        b.vx = Math.max(-40, Math.min(40, velX));
        b.vy = Math.max(-40, Math.min(40, velY));
      };
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
      stopDrag.push(() => {
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
      });
    });

    const resizeObserver = new ResizeObserver(() => {
      width = field.clientWidth;
      height = field.clientHeight;
      applyFilter(filterRef.current);
      settle();
    });
    resizeObserver.observe(field);

    // The first time the field is properly on screen, the logos drop in from above.
    const enter = () => {
      hasEntered = true;
      for (const b of bodies) {
        b.entering = true;
        b.y = -b.r - Math.random() * height * 0.9;
        b.vx = (Math.random() - 0.5) * 6;
        b.vy = 4 + Math.random() * 6;
      }
      draw();
      field.dataset.entered = "true";
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!hasEntered && entry.intersectionRatio >= ENTER_RATIO) enter();
        cancelAnimationFrame(raf);
        if (visible && !reduced) raf = requestAnimationFrame(tick);
      },
      { threshold: [0, ENTER_RATIO] },
    );
    intersectionObserver.observe(field);

    field.addEventListener("pointermove", onFieldMove);
    field.addEventListener("pointerleave", onFieldLeave);

    applyFilter("all");
    settle();
    // The server renders a wrapped list; switch to the simulated layout once it has positions.
    setLive(true);
    if (reduced) field.dataset.entered = "true";

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      field.removeEventListener("pointermove", onFieldMove);
      field.removeEventListener("pointerleave", onFieldLeave);
      stopDrag.forEach((fn) => fn());
    };
  }, []);

  const choose = (next: Filter) => {
    setFilter(next);
    applyFilterRef.current(next);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-xl font-medium tracking-[0.3em]">SKILLS</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-1" role="group" aria-label="カテゴリで絞り込み">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              aria-pressed={filter === c.key}
              onClick={() => choose(c.key)}
              className="filter-button font-mono text-xs uppercase tracking-[0.2em]"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <ul ref={fieldRef} className="logo-field" data-live={live} data-entered="false" data-no-stage-drag>
        {SKILLS.map((skill) => (
          <li key={skill.name} className="logo-chip">
            <span className="logo-chip-disc">
              <Image src={skill.src} alt={skill.name} width={96} height={96} draggable={false} />
            </span>
            <span className="logo-chip-label" aria-hidden>
              {skill.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
