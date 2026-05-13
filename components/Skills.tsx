"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import forgeData from "../config/skills.yaml";

interface Skill { label: string; category: string; }
interface CategoryConfig { label: string; color: string; }

const skills: Skill[] = forgeData.skills;
const categoryConfig: Record<string, CategoryConfig> = forgeData.categories;
const categoryColors: Record<string, string> = Object.fromEntries(
  Object.entries(categoryConfig).map(([k, v]) => [k, v.color])
);
const categoryLabels: Record<string, string> = Object.fromEntries(
  Object.entries(categoryConfig).map(([k, v]) => [k, v.label])
);

interface Particle {
  x: number; y: number;
  orbitRadius: number; orbitAngle: number; orbitSpeed: number; orbitTilt: number;
  label: string; category: string;
  baseSize: number; hovered: boolean; opacity: number;
}

interface Hub { x: number; y: number; category: string; }

function hexAlpha(color: string, alpha: number): string {
  return `${color}${Math.round(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, "0")}`;
}

export default function Skills() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const hubsRef = useRef<Hub[]>([]);
  const hubMapRef = useRef<Record<string, Hub>>({});
  const canvasHovCatRef = useRef<string | null>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const activeCategoryRef = useRef<string | null>(null);
  const hoveredCategoryRef = useRef<string | null>(null);
  const controlsRef = useRef<{ zoomIn: () => void; zoomOut: () => void; reset: () => void } | null>(null);
  const pendingTransitionRef = useRef<{ x: number; y: number; scale: number } | null>(null);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    activeCategoryRef.current = activeCategory;
    if (activeCategory === null) {
      pendingTransitionRef.current = { x: 0, y: 0, scale: 1 };
    } else {
      const hub = hubMapRef.current[activeCategory];
      const container = containerRef.current;
      if (hub && container) {
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        const scale = 2.4;
        pendingTransitionRef.current = {
          x: cw / 2 - hub.x * scale,
          y: ch / 2 - hub.y * scale,
          scale,
        };
      }
    }
  }, [activeCategory]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0, height = 0;
    let maxOrbitFromHub = 0;
    const catKeys = Object.keys(categoryConfig);

    const initParticles = () => {
      const cx = width / 2;
      const cy = height / 2;
      const base = Math.min(width, height);
      const hubOrbitRadius = base * 0.28;
      maxOrbitFromHub = base * 0.115;

      hubsRef.current = catKeys.map((cat, i) => {
        const angle = (i / catKeys.length) * Math.PI * 2 - Math.PI / 2;
        return {
          x: cx + Math.cos(angle) * hubOrbitRadius,
          y: cy + Math.sin(angle) * hubOrbitRadius,
          category: cat,
        };
      });

      hubMapRef.current = {};
      hubsRef.current.forEach(h => { hubMapRef.current[h.category] = h; });

      particlesRef.current = skills.map((s, i) => {
        const sameCategory = skills.filter(sk => sk.category === s.category);
        const indexInCat = sameCategory.findIndex(sk => sk.label === s.label);
        const countInCat = sameCategory.length;

        const orbitRadius = maxOrbitFromHub * (0.55 + (indexInCat % 2) * 0.35 + Math.random() * 0.1);
        const orbitAngle = (indexInCat / countInCat) * Math.PI * 2;
        const orbitSpeed = (0.0003 + Math.random() * 0.0004) * (i % 2 === 0 ? 1 : -1);
        const orbitTilt = (Math.random() - 0.5) * 0.4;
        const hub = hubMapRef.current[s.category];

        return {
          x: hub.x + Math.cos(orbitAngle) * orbitRadius,
          y: hub.y + Math.sin(orbitAngle) * orbitRadius,
          orbitRadius, orbitAngle, orbitSpeed, orbitTilt,
          label: s.label, category: s.category,
          baseSize: 11 + Math.random() * 3,
          hovered: false, opacity: 0.85 + Math.random() * 0.15,
        };
      });
    };

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
      transformRef.current = { x: 0, y: 0, scale: 1 };
      pendingTransitionRef.current = null;
      initParticles();
    };

    const zoomAround = (factor: number) => {
      const cx = width / 2;
      const cy = height / 2;
      const newScale = Math.max(0.25, Math.min(6, transformRef.current.scale * factor));
      const ratio = newScale / transformRef.current.scale;
      transformRef.current.x = cx - (cx - transformRef.current.x) * ratio;
      transformRef.current.y = cy - (cy - transformRef.current.y) * ratio;
      transformRef.current.scale = newScale;
    };

    controlsRef.current = {
      zoomIn: () => zoomAround(1.25),
      zoomOut: () => zoomAround(0.8),
      reset: () => { pendingTransitionRef.current = { x: 0, y: 0, scale: 1 }; },
    };

    const screenToWorld = (sx: number, sy: number) => {
      const t = transformRef.current;
      return { x: (sx - t.x) / t.scale, y: (sy - t.y) / t.scale };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      mouseRef.current = { x: sx, y: sy };
      if (isDraggingRef.current) {
        transformRef.current.x = dragStartRef.current.tx + (sx - dragStartRef.current.x);
        transformRef.current.y = dragStartRef.current.ty + (sy - dragStartRef.current.y);
        return;
      }
      // Hub hover → dim other clusters
      const mw = screenToWorld(sx, sy);
      const hub = hubsRef.current.find(h => Math.hypot(h.x - mw.x, h.y - mw.y) < 30);
      const newCat = hub?.category ?? null;
      if (newCat !== canvasHovCatRef.current) {
        canvasHovCatRef.current = newCat;
        hoveredCategoryRef.current = newCat;
        setHoveredCategory(newCat);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      const rect = canvas.getBoundingClientRect();
      dragStartRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        tx: transformRef.current.x,
        ty: transformRef.current.y,
      };
      canvas.style.cursor = "grabbing";
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = "grab";
    };

    const handleCanvasLeave = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = "grab";
      if (canvasHovCatRef.current !== null) {
        canvasHovCatRef.current = null;
        hoveredCategoryRef.current = null;
        setHoveredCategory(null);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      const newScale = Math.max(0.25, Math.min(6, transformRef.current.scale * factor));
      const ratio = newScale / transformRef.current.scale;
      transformRef.current.x = sx - (sx - transformRef.current.x) * ratio;
      transformRef.current.y = sy - (sy - transformRef.current.y) * ratio;
      transformRef.current.scale = newScale;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleCanvasLeave);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.style.cursor = "grab";

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera transition
      if (pendingTransitionRef.current) {
        const tgt = pendingTransitionRef.current;
        const cur = transformRef.current;
        const lf = 0.12;
        const nx = cur.x + (tgt.x - cur.x) * lf;
        const ny = cur.y + (tgt.y - cur.y) * lf;
        const ns = cur.scale + (tgt.scale - cur.scale) * lf;
        transformRef.current = { x: nx, y: ny, scale: ns };
        if (Math.abs(nx - tgt.x) < 0.5 && Math.abs(ny - tgt.y) < 0.5 && Math.abs(ns - tgt.scale) < 0.005) {
          transformRef.current = { ...tgt };
          pendingTransitionRef.current = null;
        }
      }

      const t = transformRef.current;
      ctx.save();
      ctx.setTransform(t.scale, 0, 0, t.scale, t.x, t.y);

      const cx = width / 2;
      const cy = height / 2;
      const mw = screenToWorld(mouseRef.current.x, mouseRef.current.y);
      const isolatedCat = activeCategoryRef.current;
      const dimCat = isolatedCat !== null ? null : hoveredCategoryRef.current;
      const hubs = hubsRef.current;



      // Hub nodes + category labels
      hubs.forEach(hub => {
        if (isolatedCat !== null && hub.category !== isolatedCat) return;
        const color = categoryColors[hub.category];
        const isDimmed = dimCat !== null && hub.category !== dimCat;
        const hubHovered = Math.hypot(hub.x - mw.x, hub.y - mw.y) < 22;

        if (!isDimmed) {
          const glowGrd = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, 30);
          glowGrd.addColorStop(0, hexAlpha(color, 0.22));
          glowGrd.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(hub.x, hub.y, 30, 0, Math.PI * 2);
          ctx.fillStyle = glowGrd;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(hub.x, hub.y, hubHovered ? 9 : 7, 0, Math.PI * 2);
        ctx.fillStyle = isDimmed ? hexAlpha(color, 0.2) : color;
        ctx.fill();

        // Hub label — pushed radially outward beyond particle orbits
        const dx = hub.x - cx;
        const dy = hub.y - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const labelDist = maxOrbitFromHub + 14;
        const lx = hub.x + (dx / dist) * labelDist;
        const ly = hub.y + (dy / dist) * labelDist;
        const radAngle = Math.atan2(dy, dx);
        ctx.save();
        ctx.globalAlpha = isDimmed ? 0.2 : 1;
        ctx.font = "bold 12px var(--font-mono, monospace)";
        ctx.fillStyle = color;
        if (Math.abs(Math.cos(radAngle)) >= 0.4) {
          ctx.textAlign = dx >= 0 ? "left" : "right";
          ctx.textBaseline = "middle";
        } else {
          ctx.textAlign = "center";
          ctx.textBaseline = dy >= 0 ? "top" : "bottom";
        }
        ctx.fillText(categoryLabels[hub.category], lx, ly);
        ctx.restore();
      });

      // Skill particles
      particlesRef.current.forEach((p) => {
        if (isolatedCat !== null && p.category !== isolatedCat) return;
        const hub = hubMapRef.current[p.category];
        p.orbitAngle += p.orbitSpeed;
        p.x = hub.x + Math.cos(p.orbitAngle) * p.orbitRadius;
        p.y = hub.y + Math.sin(p.orbitAngle) * p.orbitRadius * Math.cos(p.orbitTilt);

        p.hovered = Math.hypot(p.x - mw.x, p.y - mw.y) < 40;

        const color = categoryColors[p.category] ?? "#00d9ff";
        const isFiltered = dimCat !== null && p.category !== dimCat;
        const alpha = isFiltered ? 0.13 : p.opacity;

        // Hub → particle line
        ctx.beginPath();
        ctx.moveTo(hub.x, hub.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = hexAlpha(color, isFiltered ? 0.09 : 0.18);
        ctx.lineWidth = 0.5;
        ctx.stroke();

        const dotRadius = p.hovered ? p.baseSize * 0.55 : p.baseSize * 0.4;

        if (p.hovered && !isFiltered) {
          const glowGrd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, dotRadius * 4);
          glowGrd.addColorStop(0, hexAlpha(color, 0.25));
          glowGrd.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(p.x, p.y, dotRadius * 4, 0, Math.PI * 2);
          ctx.fillStyle = glowGrd;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.hovered && !isFiltered ? color : hexAlpha(color, alpha);
        ctx.fill();

        ctx.save();
        ctx.globalAlpha = isFiltered ? 0.13 : p.hovered ? 1 : 0.75;
        ctx.font = `${p.hovered ? "bold " : ""}${p.baseSize}px var(--font-mono, monospace)`;
        ctx.fillStyle = p.hovered ? color : "#e2e8f0";
        ctx.textAlign = p.x > cx ? "left" : "right";
        ctx.textBaseline = "middle";
        ctx.fillText(p.label, p.x + (p.x > cx ? dotRadius + 5 : -(dotRadius + 5)), p.y);
        ctx.restore();
      });

      ctx.restore();
      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleCanvasLeave);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const categories = Object.keys(categoryLabels);

  return (
    <section id="skills" className="py-24 px-6" ref={sectionRef}>
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-label mb-3"
        >
          Skills
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-3xl sm:text-4xl font-bold mb-4"
        >
          Skills &amp; Tools
        </motion.h2>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          <button
            onClick={() => setActiveCategory(null)}
            className="section-label text-xs px-3 py-1.5 rounded-full transition-all"
            style={{
              background: activeCategory === null ? "var(--cyan)" : "var(--surface2)",
              color: activeCategory === null ? "#000" : "var(--muted)",
              border: "1px solid var(--border)",
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className="section-label text-xs px-3 py-1.5 rounded-full transition-all"
              style={{
                background: activeCategory === cat ? categoryColors[cat] : "var(--surface2)",
                color: activeCategory === cat ? "#000" : "var(--muted)",
                border: `1px solid ${activeCategory === cat ? categoryColors[cat] : "var(--border)"}`,
              }}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </motion.div>

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          ref={containerRef}
          className="card relative w-full overflow-hidden"
          style={{ height: "520px" }}
        >
          <canvas ref={canvasRef} className="w-full h-full" />
          {/* Zoom / reset controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {[
              { label: "+", title: "Zoom in",  action: () => controlsRef.current?.zoomIn()  },
              { label: "−", title: "Zoom out", action: () => controlsRef.current?.zoomOut() },
              { label: "⟳", title: "Reset view", action: () => controlsRef.current?.reset()  },
            ].map(({ label, title, action }) => (
              <button
                key={title}
                title={title}
                onClick={action}
                className="section-label text-sm leading-none select-none"
                style={{
                  width: 28, height: 28,
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  color: "var(--muted)",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div
            className="absolute bottom-4 right-4 section-label text-xs"
            style={{ color: "var(--muted)" }}
          >
            scroll to zoom · drag to pan · hover to inspect
          </div>
        </motion.div>

        {/* Legend — hover dims other categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4 mt-5"
        >
          {categories.map((cat) => (
            <div
              key={cat}
              className="flex items-center gap-1.5 cursor-pointer transition-opacity"
              style={{
                opacity: hoveredCategory !== null && hoveredCategory !== cat ? 0.3 : 1,
              }}
              onMouseEnter={() => { hoveredCategoryRef.current = cat; setHoveredCategory(cat); }}
              onMouseLeave={() => { hoveredCategoryRef.current = null; setHoveredCategory(null); }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: categoryColors[cat] }}
              />
              <span className="section-label text-xs" style={{ color: "var(--muted)" }}>
                {categoryLabels[cat]}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
