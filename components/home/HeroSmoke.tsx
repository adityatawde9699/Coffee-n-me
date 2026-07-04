"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * HeroSmoke — soft, slowly rising "coffee steam" rendered with raw three.js.
 *
 * A single fullscreen plane runs a fractal-noise (fbm) fragment shader, so there
 * is no texture asset to load. Colors are sampled from the active theme's
 * `--primary` / `--accent` CSS variables and re-sampled when the `dark` class on
 * <html> toggles. Respects `prefers-reduced-motion` (one static frame, no loop)
 * and pauses when the hero scrolls offscreen or the tab is hidden.
 */

/** Parse a shadcn-style `"H S% L%"` CSS var value into a THREE.Color. */
function parseHslVar(value: string, fallback: THREE.Color): THREE.Color {
  const m = value.trim().match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!m) return fallback;
  return new THREE.Color().setHSL(
    parseFloat(m[1]) / 360,
    parseFloat(m[2]) / 100,
    parseFloat(m[3]) / 100
  );
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec3  u_color1;
  uniform vec3  u_color2;
  uniform float u_intensity;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Keep the noise aspect-correct.
    vec2 uv = vUv;
    uv.x *= u_resolution.x / u_resolution.y;

    float t = u_time * 0.06;

    // Domain warp for wispy, curling smoke; drift upward over time.
    vec2 q = vec2(fbm(uv * 3.0 + vec2(0.0, t)),
                  fbm(uv * 3.0 + vec2(5.2, 1.3 - t)));
    float n = fbm(uv * 3.0 + q * 1.5 + vec2(0.0, -t * 1.5));

    // Shape it: more steam low, thinning toward the top.
    float density = smoothstep(0.35, 0.85, n);
    density *= smoothstep(1.05, 0.15, vUv.y); // vertical fade
    density *= u_intensity;

    vec3 color = mix(u_color1, u_color2, n);
    gl_FragColor = vec4(color, clamp(density, 0.0, 0.4));
  }
`;

export function HeroSmoke() {
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
    const camera = new THREE.Camera(); // shader writes clip-space directly

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: {
        value: new THREE.Vector2(container.clientWidth, container.clientHeight),
      },
      u_color1: { value: new THREE.Color() },
      u_color2: { value: new THREE.Color() },
      u_intensity: { value: 0.9 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ── Theme color sampling ──────────────────────────────────────────────
    function applyThemeColors() {
      const styles = getComputedStyle(document.documentElement);
      uniforms.u_color1.value = parseHslVar(
        styles.getPropertyValue("--primary"),
        new THREE.Color(0.55, 0.35, 0.2)
      );
      uniforms.u_color2.value = parseHslVar(
        styles.getPropertyValue("--accent"),
        new THREE.Color(0.85, 0.75, 0.65)
      );
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

    function frame(now: number) {
      uniforms.u_time.value += Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
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
      uniforms.u_resolution.value.set(w, h);
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
