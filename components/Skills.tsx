"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import forgeData from "../config/skills.yaml";

interface Skill {
  label: string;
  category: string;
}

interface CategoryConfig {
  label: string;
  color: string;
}

const skills: Skill[] = forgeData.skills;
const categoryConfig: Record<string, CategoryConfig> = forgeData.categories;

const categoryColors: Record<string, string> = Object.fromEntries(
  Object.entries(categoryConfig).map(([k, v]) => [k, v.color])
);

const categoryLabels: Record<string, string> = Object.fromEntries(
  Object.entries(categoryConfig).map(([k, v]) => [k, v.label])
);

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  orbitTilt: number;
  label: string;
  category: string;
  baseSize: number;
  hovered: boolean;
  opacity: number;
}

export default function Skills() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      const cx = width / 2;
      const cy = height / 2;
      const maxOrbit = Math.min(width, height) * 0.42;

      particlesRef.current = skills.map((s, i) => {
        const orbitRadius = maxOrbit * (0.35 + (i % 3) * 0.22 + Math.random() * 0.08);
        const orbitAngle = (i / skills.length) * Math.PI * 2 + Math.random() * 0.3;
        const orbitSpeed = (0.0003 + Math.random() * 0.0004) * (i % 2 === 0 ? 1 : -1);
        const orbitTilt = (Math.random() - 0.5) * 0.7;

        return {
          x: cx + Math.cos(orbitAngle) * orbitRadius,
          y: cy + Math.sin(orbitAngle) * orbitRadius * Math.cos(orbitTilt),
          vx: 0,
          vy: 0,
          radius: 0,
          orbitRadius,
          orbitAngle,
          orbitSpeed,
          orbitTilt,
          label: s.label,
          category: s.category,
          baseSize: 11 + Math.random() * 3,
          hovered: false,
          opacity: 0.85 + Math.random() * 0.15,
        };
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      const cx = width / 2;
      const cy = height / 2;

      // Center glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
      grd.addColorStop(0, "rgba(0,217,255,0.12)");
      grd.addColorStop(1, "rgba(0,217,255,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,217,255,0.9)";
      ctx.fill();

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particlesRef.current.forEach((p) => {
        // Advance orbit
        p.orbitAngle += p.orbitSpeed;
        p.x = cx + Math.cos(p.orbitAngle) * p.orbitRadius;
        p.y = cy + Math.sin(p.orbitAngle) * p.orbitRadius * Math.cos(p.orbitTilt);

        const dist = Math.hypot(p.x - mx, p.y - my);
        p.hovered = dist < 48;

        const color = categoryColors[p.category] ?? "#00d9ff";
        const isFiltered = activeCategory !== null && p.category !== activeCategory;
        const alpha = isFiltered ? 0.15 : p.opacity;

        // Connection line to center
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `${color}${isFiltered ? "18" : "22"}`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Particle dot
        const dotRadius = p.hovered ? p.baseSize * 0.55 : p.baseSize * 0.4;

        if (p.hovered && !isFiltered) {
          const glowGrd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, dotRadius * 4);
          glowGrd.addColorStop(0, `${color}40`);
          glowGrd.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(p.x, p.y, dotRadius * 4, 0, Math.PI * 2);
          ctx.fillStyle = glowGrd;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.hovered && !isFiltered ? color : `${color}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`;
        ctx.fill();

        // Label
        ctx.save();
        ctx.globalAlpha = isFiltered ? 0.15 : p.hovered ? 1 : 0.75;
        ctx.font = `${p.hovered ? "bold " : ""}${p.baseSize}px var(--font-mono, monospace)`;
        ctx.fillStyle = p.hovered ? color : "#e2e8f0";
        ctx.textAlign = p.x > cx ? "left" : "right";
        ctx.textBaseline = "middle";
        const offset = dotRadius + 6;
        ctx.fillText(p.label, p.x + (p.x > cx ? offset : -offset), p.y);
        ctx.restore();
      });

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
    };
  }, [activeCategory]);

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
          style={{ height: "480px" }}
        >
          <canvas ref={canvasRef} className="w-full h-full" />
          <div
            className="absolute bottom-4 right-4 section-label text-xs"
            style={{ color: "var(--muted)" }}
          >
            hover to inspect · filter by category
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4 mt-5"
        >
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-1.5">
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
