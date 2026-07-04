"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * HeroParticles — a subtle field of drifting "coffee dust" particles rendered
 * behind the landing-page hero headline with raw three.js.
 *
 * Design notes:
 * - One BufferGeometry + PointsMaterial → a single draw call.
 * - Particle colors are sampled from the active theme's `--primary` / `--accent`
 *   CSS variables, and re-sampled when the `dark` class on <html> toggles.
 * - Respects `prefers-reduced-motion` (renders one static frame, no loop).
 * - Pauses the animation loop when the hero scrolls offscreen or the tab is hidden.
 */

const PARTICLE_COUNT = 220;

/** Parse a shadcn-style `"H S% L%"` CSS var value into a THREE.Color. */
function parseHslVar(value: string, fallback: THREE.Color): THREE.Color {
  const m = value.trim().match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!m) return fallback;
  const h = parseFloat(m[1]) / 360;
  const s = parseFloat(m[2]) / 100;
  const l = parseFloat(m[3]) / 100;
  return new THREE.Color().setHSL(h, s, l);
}

export function HeroParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ── Renderer / scene / camera ─────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 30;

    // Visible half-extents at z=0, used to spawn/wrap particles.
    const halfH = Math.tan(THREE.MathUtils.degToRad(30)) * camera.position.z;
    let halfW = halfH * camera.aspect;

    // ── Soft round sprite (radial gradient on an offscreen canvas) ────────
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext("2d")!;
    const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.6)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(sprite);

    // ── Geometry: positions + per-particle colors + motion params ─────────
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT); // upward drift
    const swayPhase = new Float32Array(PARTICLE_COUNT);
    const swayAmp = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * halfW;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * halfH;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * 6;
      speeds[i] = 0.6 + Math.random() * 1.2;
      swayPhase[i] = Math.random() * Math.PI * 2;
      swayAmp[i] = 0.3 + Math.random() * 0.8;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Theme color sampling ──────────────────────────────────────────────
    function applyThemeColors() {
      const styles = getComputedStyle(document.documentElement);
      const primary = parseHslVar(
        styles.getPropertyValue("--primary"),
        new THREE.Color(0.55, 0.35, 0.2)
      );
      const accent = parseHslVar(
        styles.getPropertyValue("--accent"),
        new THREE.Color(0.85, 0.75, 0.65)
      );
      const tmp = new THREE.Color();
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        tmp.copy(primary).lerp(accent, Math.random());
        colors[i * 3] = tmp.r;
        colors[i * 3 + 1] = tmp.g;
        colors[i * 3 + 2] = tmp.b;
      }
      geometry.attributes.color.needsUpdate = true;
    }
    applyThemeColors();

    const themeObserver = new MutationObserver(() => {
      applyThemeColors();
      renderer.render(scene, camera); // reflect immediately if loop is paused
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // ── Animation loop (paused when offscreen / hidden) ───────────────────
    let rafId = 0;
    let running = false;
    let lastTime = performance.now();
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;

    function frame(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const t = now / 1000;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        let y = positions[i * 3 + 1] + speeds[i] * dt;
        if (y > halfH + 1) {
          y = -halfH - 1;
          positions[i * 3] = (Math.random() * 2 - 1) * halfW;
        }
        positions[i * 3 + 1] = y;
        positions[i * 3] +=
          Math.sin(t * 0.5 + swayPhase[i]) * swayAmp[i] * dt;
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduceMotion) return;
      running = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    // ── Resize handling ───────────────────────────────────────────────────
    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      halfW = halfH * camera.aspect;
      if (!running) renderer.render(scene, camera);
    });
    resizeObserver.observe(container);

    // ── Visibility: pause offscreen / on hidden tab ───────────────────────
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    document.addEventListener("visibilitychange", onVisibility);

    // Initial paint (covers reduced-motion + before first intersection).
    renderer.render(scene, camera);

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      stop();
      themeObserver.disconnect();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
    />
  );
}
