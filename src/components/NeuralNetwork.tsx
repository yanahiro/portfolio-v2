"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const NODE_COUNT = 90;
const RADIUS = 1.6;
const EDGE_THRESHOLD = 0.85;

export default function NeuralNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const positions: THREE.Vector3[] = [];
    const baseDirections: THREE.Vector3[] = [];

    // Fibonacci sphere distribution
    for (let i = 0; i < NODE_COUNT; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / NODE_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = Math.cos(theta) * Math.sin(phi) * RADIUS;
      const y = Math.sin(theta) * Math.sin(phi) * RADIUS;
      const z = Math.cos(phi) * RADIUS;
      positions.push(new THREE.Vector3(x, y, z));
      baseDirections.push(new THREE.Vector3(x, y, z).normalize());
    }

    // Nodes (points)
    const nodeGeo = new THREE.BufferGeometry();
    const nodeArr = new Float32Array(NODE_COUNT * 3);
    positions.forEach((p, i) => {
      nodeArr[i * 3] = p.x;
      nodeArr[i * 3 + 1] = p.y;
      nodeArr[i * 3 + 2] = p.z;
    });
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodeArr, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0xb6ff3c,
      size: 0.06,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodes);

    // Outer halo (white tiny sparkles for depth)
    const haloGeo = new THREE.BufferGeometry();
    const haloCount = 220;
    const haloArr = new Float32Array(haloCount * 3);
    for (let i = 0; i < haloCount; i++) {
      const r = 2.4 + Math.random() * 1.2;
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      haloArr[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      haloArr[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      haloArr[i * 3 + 2] = Math.cos(phi) * r;
    }
    haloGeo.setAttribute("position", new THREE.BufferAttribute(haloArr, 3));
    const haloMat = new THREE.PointsMaterial({
      color: 0xe7e9f0,
      size: 0.015,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const halo = new THREE.Points(haloGeo, haloMat);
    scene.add(halo);

    // Edges
    const edgeIndices: [number, number][] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (positions[i].distanceTo(positions[j]) < EDGE_THRESHOLD) {
          edgeIndices.push([i, j]);
        }
      }
    }
    const edgeGeo = new THREE.BufferGeometry();
    const edgeArr = new Float32Array(edgeIndices.length * 2 * 3);
    edgeIndices.forEach(([a, b], i) => {
      edgeArr[i * 6] = positions[a].x;
      edgeArr[i * 6 + 1] = positions[a].y;
      edgeArr[i * 6 + 2] = positions[a].z;
      edgeArr[i * 6 + 3] = positions[b].x;
      edgeArr[i * 6 + 4] = positions[b].y;
      edgeArr[i * 6 + 5] = positions[b].z;
    });
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgeArr, 3));
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x5dffe6,
      transparent: true,
      opacity: 0.18,
    });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    scene.add(edges);

    const group = new THREE.Group();
    group.add(nodes);
    group.add(edges);
    scene.add(group);

    // Mouse-follow target
    const mouse = new THREE.Vector2(0, 0);
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("mousemove", onMouseMove);

    const targetRot = { x: 0, y: 0 };
    const currentRot = { x: 0, y: 0 };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let raf = 0;
    let t = 0;

    const positionAttr = nodes.geometry.getAttribute("position") as THREE.BufferAttribute;
    const edgePositionAttr = edges.geometry.getAttribute("position") as THREE.BufferAttribute;

    const tick = () => {
      t += 0.01;

      // pulse: each node breathes radially based on noise-like sine
      for (let i = 0; i < NODE_COUNT; i++) {
        const dir = baseDirections[i];
        const pulse = 1 + Math.sin(t * 1.3 + i * 0.35) * 0.06;
        const x = dir.x * RADIUS * pulse;
        const y = dir.y * RADIUS * pulse;
        const z = dir.z * RADIUS * pulse;
        positionAttr.setXYZ(i, x, y, z);
        positions[i].set(x, y, z);
      }
      positionAttr.needsUpdate = true;

      edgeIndices.forEach(([a, b], i) => {
        edgePositionAttr.setXYZ(i * 2, positions[a].x, positions[a].y, positions[a].z);
        edgePositionAttr.setXYZ(i * 2 + 1, positions[b].x, positions[b].y, positions[b].z);
      });
      edgePositionAttr.needsUpdate = true;

      // mouse-follow rotation (clamped)
      targetRot.y = mouse.x * 0.6;
      targetRot.x = mouse.y * 0.4;
      currentRot.x += (targetRot.x - currentRot.x) * 0.06;
      currentRot.y += (targetRot.y - currentRot.y) * 0.06;
      group.rotation.x = currentRot.x;
      group.rotation.y = currentRot.y + t * 0.08;
      halo.rotation.y = -t * 0.04;

      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      nodeGeo.dispose();
      edgeGeo.dispose();
      haloGeo.dispose();
      nodeMat.dispose();
      edgeMat.dispose();
      haloMat.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0 h-full w-full [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
