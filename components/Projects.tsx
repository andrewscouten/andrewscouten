"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import projectsData from "../config/projects.yaml";

interface Project {
  name: string;
  year: string;
  tag: string;
  description: string;
  tech: string[];
  accent: string;
  url: string;
}

const projects: Project[] = projectsData;

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-label mb-3"
        >
          Projects
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-3xl sm:text-4xl font-bold mb-3"
        >
          What I&apos;ve Built
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-xs mb-10 flex items-center gap-1.5"
          style={{ color: "var(--muted)" }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: "#a855f7" }}
          />
          - external link
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.url || undefined}
              target={p.url ? "_blank" : undefined}
              rel={p.url ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="card p-6 flex flex-col"
              style={{ textDecoration: "none", cursor: p.url ? "pointer" : "default" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-base mb-0.5 flex items-center gap-1.5" style={{ color: "var(--text)" }}>
                    {p.url && (
                      <span
                        className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: "#a855f7" }}
                      />
                    )}
                    {p.name}
                  </h3>
                  <span className="section-label text-xs" style={{ color: p.accent }}>
                    {p.tag}
                  </span>
                </div>
                <span className="section-label text-xs" style={{ color: "var(--muted)" }}>
                  {p.year}
                </span>
              </div>

              <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "var(--muted)" }}>
                {p.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "var(--surface2)",
                      color: "var(--muted)",
                      border: "1px solid var(--border)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
