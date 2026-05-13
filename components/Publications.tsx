"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import publicationsData from "../config/publications.yaml";

interface Publication {
  title: string;
  venue: string;
  year: string;
  description: string;
  tags: string[];
  type: string;
  accent: string;
  url: string;
}

const publications: Publication[] = publicationsData;

export default function Publications() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="publications" className="py-24 px-6">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-label mb-3"
        >
          Publications
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-3xl sm:text-4xl font-bold mb-4"
        >
          Research Output
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm mb-12"
          style={{ color: "var(--muted)" }}
        >
          ORCID:{" "}
          <a
            href="https://orcid.org/0009-0004-6418-7158"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
            style={{ color: "var(--cyan)", fontFamily: "var(--font-mono)" }}
          >
            0009-0004-6418-7158
          </a>
        </motion.p>

        <div className="flex flex-col gap-6">
          {publications.map((pub, i) => (
            <motion.a
              key={i}
              href={pub.url || undefined}
              target={pub.url ? "_blank" : undefined}
              rel={pub.url ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
              className="card p-6"
              style={{ textDecoration: "none", cursor: pub.url ? "pointer" : "default" }}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <span
                  className="section-label text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: "var(--surface2)",
                    color: pub.accent,
                    border: `1px solid ${pub.accent}30`,
                  }}
                >
                  {pub.type}
                </span>
                <span className="section-label text-xs" style={{ color: "var(--muted)" }}>
                  {pub.year}
                </span>
              </div>

              <h3 className="font-semibold text-base mb-1" style={{ color: "var(--text)" }}>
                {pub.title}
              </h3>
              <p className="text-sm mb-3" style={{ color: pub.accent, fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>
                {pub.venue}
              </p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
                {pub.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {pub.tags.map((t) => (
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
