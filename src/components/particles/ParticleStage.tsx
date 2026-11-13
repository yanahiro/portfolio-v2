"use client";

import { useEffect, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { buildShapes, type Shape } from "@/lib/particles/sampleShapes";
import { CAREER_TRIGGER_ID, STOPS, type ShapeId, type Stop } from "@/lib/particles/scenes";
import {
  backdropFragmentShader,
  backdropVertexShader,
  fragmentShader,
  hazeFragmentShader,
  hazeVertexShader,
  vertexShader,
} from "./shaders";

const READY_CLASS = "particles-on";
/** Share of each segment's scroll distance spent holding a finished shape. */
const HOLD = 0.2;
const POINTER_PUSH = 42;
/** Scroll distance per frame (px) beyond which the trail stops growing. */
const MAX_SCROLL_STEP = 70;
/** Seconds between typed glyphs. */
const TYPE_INTERVAL = 0.13;
/** Reveal limit for shapes that are not typed: everything is visible. */
const NOT_TYPED = 1e6;

function particleCount() {
  if (isSmallScreen()) return 12000;
  return (navigator.hardwareConcurrency ?? 8) <= 4 ? 24000 : 40000;
}

function isSmallScreen() {
  return window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
}

type ResolvedStop = Stop & { el: Element | null; y: number };

function resolveStops(): ResolvedStop[] {
  const vh = window.innerHeight;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
  const career = ScrollTrigger.getById(CAREER_TRIGGER_ID);

  const stops = STOPS.map((stop): ResolvedStop => {
    const el = document.querySelector(stop.slot);
    let y = 0;
    if (stop.at.kind === "career" && career) {
      y = career.start + (career.end - career.start) * stop.at.p;
    } else if (stop.at.kind === "center" && el) {
      const rect = el.getBoundingClientRect();
      y = rect.top + window.scrollY + rect.height / 2 - vh / 2;
    }
    return { ...stop, el, y: Math.min(Math.max(y, 0), maxScroll) };
  });

  // Keep positions strictly increasing so every segment has a length.
  for (let i = 1; i < stops.length; i++) {
    if (stops[i].y <= stops[i - 1].y) stops[i].y = stops[i - 1].y + 1;
  }
  return stops;
}

/** Centre (px, origin at viewport centre, y up) and scale that fit a shape into its slot. */
function slotTransform(
  stop: ResolvedStop,
  shape: Shape,
  out: { x: number; y: number; z: number },
  /** Seconds, for the idle bob and pulse; 0 keeps the shape still. */
  time: number,
) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!stop.el) {
    out.x = 0;
    out.y = 0;
    out.z = Math.min(vw, vh) * 0.3;
    return;
  }
  const rect = stop.el.getBoundingClientRect();
  out.x = rect.left + rect.width / 2 - vw / 2;
  out.y = vh / 2 - (rect.top + rect.height / 2);
  if (stop.fit === "cover") {
    out.z = Math.max(rect.width, rect.height) / 2;
  } else if (shape.aspect >= 1) {
    out.z = Math.min(rect.width / 2, (rect.height / 2) * shape.aspect);
  } else {
    out.z = Math.min(rect.height / 2, rect.width / (2 * shape.aspect));
  }
  if (time > 0 && stop.fit !== "cover") {
    out.y += Math.sin(time * 0.5) * 5;
    if (stop.pulse) out.z *= 1 + stop.pulse * Math.sin(time * 1.3);
  }
}

export default function ParticleStage() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const count = particleCount();
      const reduced = prefersReducedMotion();
      const rootStyle = getComputedStyle(document.documentElement);
      const displayFont = rootStyle.getPropertyValue("--ff-display").trim() || "sans-serif";

      const monoFont = rootStyle.getPropertyValue("--ff-mono").trim() || "monospace";
      const shapes = await buildShapes(count, displayFont, monoFont);
      if (disposed) return;

      const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);

      const scene = new Scene();
      const camera = new OrthographicCamera(-1, 1, 1, -1, -5000, 5000);

      const rand = new Float32Array(count * 4);
      for (let i = 0; i < rand.length; i++) rand[i] = Math.random();

      const geometry = new BufferGeometry();
      const fromPos = new BufferAttribute(new Float32Array(count * 3), 3);
      const toPos = new BufferAttribute(new Float32Array(count * 3), 3);
      const fromBri = new BufferAttribute(new Float32Array(count), 1);
      const toBri = new BufferAttribute(new Float32Array(count), 1);
      // three.js needs a "position" attribute to draw; the shader ignores it.
      geometry.setAttribute("position", fromPos);
      geometry.setAttribute("aFrom", fromPos);
      geometry.setAttribute("aTo", toPos);
      geometry.setAttribute("aFromB", fromBri);
      geometry.setAttribute("aToB", toBri);
      geometry.setAttribute("aRand", new BufferAttribute(rand, 4));

      const uniforms = {
        uMix: { value: 0 },
        uTime: { value: 0 },
        uDpr: { value: dpr },
        uReduced: { value: reduced ? 1 : 0 },
        uScatter: { value: 160 },
        uFromX: { value: { x: 0, y: 0, z: 1 } },
        uToX: { value: { x: 0, y: 0, z: 1 } },
        uRot: { value: { x: 0, y: 0 } },
        uPointer: { value: { x: 0, y: 0, z: 0 } },
        uAlpha: { value: { x: 1, y: 1 } },
        uSize: { value: { x: 1.7, y: 1.7 } },
        uAccent: { value: { x: 0, y: 0 } },
        uCycle: { value: { x: 0, y: 0 } },
        uVelocity: { value: 0 },
        uType: { value: { x: NOT_TYPED, y: 0 } },
        uColor: { value: new Color(rootStyle.getPropertyValue("--color-fg").trim() || "#e8e8e4") },
        uAccentColor: { value: new Color(rootStyle.getPropertyValue("--color-accent").trim() || "#b6ff3c") },
      };
      const material = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });
      const points = new Points(geometry, material);
      points.frustumCulled = false;
      scene.add(points);

      // Backdrop, drawn first: a slow haze, then a far layer of drifting specks.
      const backdropUniforms = {
        uRes: { value: { x: 1, y: 1 } },
        uScroll: { value: 0 },
        uTime: { value: 0 },
        uDpr: { value: dpr },
        uTint: { value: 0 },
        uColor: uniforms.uColor,
        uAccentColor: uniforms.uAccentColor,
      };
      const hazeGeometry = new PlaneGeometry(2, 2);
      const hazeMaterial = new ShaderMaterial({
        vertexShader: hazeVertexShader,
        fragmentShader: hazeFragmentShader,
        uniforms: backdropUniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });
      const haze = new Mesh(hazeGeometry, hazeMaterial);
      haze.frustumCulled = false;
      haze.renderOrder = -2;
      scene.add(haze);

      const speckCount = isSmallScreen() ? 500 : 1400;
      const seeds = new Float32Array(speckCount * 4);
      for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
      const speckGeometry = new BufferGeometry();
      speckGeometry.setAttribute("position", new BufferAttribute(new Float32Array(speckCount * 3), 3));
      speckGeometry.setAttribute("aSeed", new BufferAttribute(seeds, 4));
      const speckMaterial = new ShaderMaterial({
        vertexShader: backdropVertexShader,
        fragmentShader: backdropFragmentShader,
        uniforms: backdropUniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });
      const specks = new Points(speckGeometry, speckMaterial);
      specks.frustumCulled = false;
      specks.renderOrder = -1;
      scene.add(specks);

      const resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.left = -w / 2;
        camera.right = w / 2;
        camera.top = h / 2;
        camera.bottom = -h / 2;
        camera.updateProjectionMatrix();
        uniforms.uScatter.value = Math.min(w, h) * 0.2;
        backdropUniforms.uRes.value = { x: w, y: h };
      };
      resize();

      let stops = resolveStops();
      let segment = -1;
      const refreshStops = () => {
        stops = resolveStops();
        segment = -1;
      };
      ScrollTrigger.addEventListener("refresh", refreshStops);
      window.addEventListener("resize", resize);

      const setSegment = (index: number) => {
        segment = index;
        const from = stops[index];
        const to = stops[Math.min(index + 1, stops.length - 1)];
        (fromPos.array as Float32Array).set(shapes[from.shape as ShapeId].pos);
        (toPos.array as Float32Array).set(shapes[to.shape as ShapeId].pos);
        (fromBri.array as Float32Array).set(shapes[from.shape as ShapeId].bri);
        (toBri.array as Float32Array).set(shapes[to.shape as ShapeId].bri);
        fromPos.needsUpdate = toPos.needsUpdate = fromBri.needsUpdate = toBri.needsUpdate = true;
        uniforms.uAlpha.value = { x: from.alpha, y: to.alpha };
        uniforms.uSize.value = { x: from.size, y: to.size };
        uniforms.uAccent.value = { x: from.accent, y: to.accent };
        uniforms.uCycle.value = { x: from.cycle ?? 0, y: to.cycle ?? 0 };
      };

      // Pointer: push particles away, tilt the shape, drag to spin it.
      const pointer = { x: 0, y: 0, active: false };
      const smooth = { x: 0, y: 0, push: 0 };
      const rot = { x: 0, y: 0, dragX: 0, dragY: 0 };
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      let lastScroll = window.scrollY;
      let velocity = 0;
      /** When typing began (seconds), or -1 before it has. It plays once. */
      let typingStart = reduced ? -Infinity : -1;

      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        pointer.x = e.clientX - window.innerWidth / 2;
        pointer.y = window.innerHeight / 2 - e.clientY;
        pointer.active = true;
        if (dragging) {
          rot.dragX += (e.clientX - lastX) * 0.006;
          rot.dragY += (e.clientY - lastY) * 0.006;
          lastX = e.clientX;
          lastY = e.clientY;
        }
      };
      const onPointerDown = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || e.button !== 0) return;
        if ((e.target as Element | null)?.closest("a, button, [data-no-stage-drag]")) return;
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
      };
      const onPointerUp = () => {
        dragging = false;
      };
      const onPointerLeave = () => {
        pointer.active = false;
        dragging = false;
      };
      if (!reduced) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointerup", onPointerUp);
        document.documentElement.addEventListener("pointerleave", onPointerLeave);
      }

      const render = (time: number) => {
        if (document.hidden) return;

        const y = window.scrollY;
        let index = 0;
        while (index < stops.length - 2 && y >= stops[index + 1].y) index++;
        if (index !== segment) setSegment(index);

        const from = stops[index];
        const to = stops[Math.min(index + 1, stops.length - 1)];
        const raw = to.y > from.y ? (y - from.y) / (to.y - from.y) : 0;
        uniforms.uMix.value = Math.min(Math.max((raw - HOLD) / (1 - HOLD * 2), 0), 1);

        const step = Math.min(Math.max(y - lastScroll, -MAX_SCROLL_STEP), MAX_SCROLL_STEP);
        lastScroll = y;
        velocity += (step - velocity) * 0.12;
        uniforms.uVelocity.value = reduced ? 0 : velocity;

        // Reduced motion: nothing moves on its own.
        const idle = reduced ? 0 : time;
        const typing = shapes[to.shape].typing;
        if (typing) {
          // Start once the text has gathered, then add a glyph every TYPE_INTERVAL.
          if (typingStart === -1 && uniforms.uMix.value > 0.9) typingStart = time;
          const last = typing.reveal.length - 1;
          const typedGlyphs =
            typingStart === -1 ? 0 : Math.min(last, Math.floor((time - typingStart) / TYPE_INTERVAL));
          uniforms.uType.value = { x: typing.reveal[typedGlyphs], y: typing.cursorShift[typedGlyphs] };
          if (typedGlyphs === last) document.documentElement.dataset.helloTyped = "true";
        } else {
          uniforms.uType.value = { x: NOT_TYPED, y: 0 };
        }

        slotTransform(from, shapes[from.shape], uniforms.uFromX.value, idle);
        slotTransform(to, shapes[to.shape], uniforms.uToX.value, idle);

        smooth.x += (pointer.x - smooth.x) * 0.18;
        smooth.y += (pointer.y - smooth.y) * 0.18;
        smooth.push += ((pointer.active ? POINTER_PUSH : 0) - smooth.push) * 0.1;
        uniforms.uPointer.value = { x: smooth.x, y: smooth.y, z: smooth.push };

        if (!dragging) {
          rot.dragX *= 0.94;
          rot.dragY *= 0.94;
        }
        const tiltX = pointer.active ? (pointer.x / window.innerWidth) * 0.5 : 0;
        const tiltY = pointer.active ? (-pointer.y / window.innerHeight) * 0.35 : 0;
        // The shape slowly looks from side to side even when nobody touches it.
        const swayX = Math.sin(idle * 0.27) * 0.16;
        const swayY = Math.sin(idle * 0.19 + 1.3) * 0.07;
        rot.x += (tiltX + swayX + rot.dragX - rot.x) * 0.08;
        rot.y += (tiltY + swayY + rot.dragY - rot.y) * 0.08;
        uniforms.uRot.value = { x: rot.x, y: rot.y };

        uniforms.uTime.value = time;
        backdropUniforms.uTime.value = idle;
        backdropUniforms.uScroll.value = reduced ? 0 : y;
        const mix = uniforms.uMix.value;
        backdropUniforms.uTint.value = from.accent + (to.accent - from.accent) * mix;
        renderer.render(scene, camera);
      };
      gsap.ticker.add(render);
      document.documentElement.classList.add(READY_CLASS);

      cleanup = () => {
        gsap.ticker.remove(render);
        ScrollTrigger.removeEventListener("refresh", refreshStops);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
        document.documentElement.removeEventListener("pointerleave", onPointerLeave);
        document.documentElement.classList.remove(READY_CLASS);
        delete document.documentElement.dataset.helloTyped;
        geometry.dispose();
        material.dispose();
        hazeGeometry.dispose();
        hazeMaterial.dispose();
        speckGeometry.dispose();
        speckMaterial.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    start().catch((error) => {
      // Without WebGL the page keeps its static fallbacks (logo, photo, text).
      console.warn("Particle stage disabled:", error);
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
