"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import experienceData from "../config/experience.yaml";

interface ExperienceItem {
  type: "work" | "edu";
  title: string;
  org: string;
  location: string;
  period: string;
  bullets: string[];
}

const items: ExperienceItem[] = experienceData;

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-label mb-3"
        >
          Experience &amp; Education
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-3xl sm:text-4xl font-bold mb-12"
        >
          What I&apos;ve Done
        </motion.h2>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-4 md:left-6 top-0 bottom-0 w-px"
            style={{ background: "var(--border)" }}
          />

          <div className="flex flex-col gap-10">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="relative pl-12 md:pl-16"
              >
                {/* Dot */}
                <div
                  className="absolute left-2.5 md:left-4 top-1.5 w-3 h-3 rounded-full border-2 transition-colors"
                  style={{
                    borderColor: item.type === "edu" ? "var(--amber)" : "var(--cyan)",
                    background: "var(--bg)",
                  }}
                />

                <div className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-base" style={{ color: "var(--text)" }}>
                        {item.title}
                      </h3>
                      <p className="text-sm mt-0.5" style={{ color: item.type === "edu" ? "var(--amber)" : "var(--cyan)" }}>
                        {item.org}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="section-label text-xs">{item.period}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                        {item.location}
                      </p>
                    </div>
                  </div>

                  {item.bullets.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {item.bullets.map((b, j) => (
                        <li key={j} className="flex gap-2 text-sm" style={{ color: "var(--muted)" }}>
                          <span style={{ color: "var(--cyan)", flexShrink: 0 }}>▸</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
