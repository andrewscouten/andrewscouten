"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import experienceData from "../config/experience.yaml";

function renderInlineLinks(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#a78bfa", textDecoration: "underline" }}
      >
        {match[1]}
      </a>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : parts;
}

interface ExperienceItem {
  type: "work" | "edu";
  title: string;
  org: string;
  location: string;
  period: string;
  bullets: string[];
  coursework?: string[];
}

const allItems: ExperienceItem[] = experienceData;
const eduItems = allItems.filter((i) => i.type === "edu");
const workItems = allItems.filter((i) => i.type === "work");

function TimelineGroup({
  items,
  color,
  inView,
  delayBase,
}: {
  items: ExperienceItem[];
  color: string;
  inView: boolean;
  delayBase: number;
}) {
  return (
    <div className="relative">
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
            transition={{ duration: 0.5, delay: delayBase + i * 0.1 }}
            className="relative pl-12 md:pl-16"
          >
            <div
              className="absolute left-2.5 md:left-4 top-1.5 w-3 h-3 rounded-full border-2"
              style={{ borderColor: color, background: "var(--bg)" }}
            />
            <div className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-semibold text-base" style={{ color: "var(--text)" }}>
                    {renderInlineLinks(item.title)}
                  </h3>
                  <p className="text-sm mt-0.5" style={{ color }}>
                    {renderInlineLinks(item.org)}
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
                      <span>{renderInlineLinks(b)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {item.coursework && item.coursework.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>
                    Relevant Coursework
                  </p>
                  <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                    {item.coursework.map((c, j) => (
                      <li key={j} className="flex gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
                        <span style={{ color: color, flexShrink: 0 }}>▸</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

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
          Education &amp; Experience
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-3xl sm:text-4xl font-bold mb-12"
        >
          What I&apos;ve Done
        </motion.h2>

        {/* Education */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="section-label text-xs mb-6"
          style={{ color: "var(--amber)" }}
        >
          Education
        </motion.p>
        <TimelineGroup
          items={eduItems}
          color="var(--amber)"
          inView={inView}
          delayBase={0.15}
        />

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.35 + eduItems.length * 0.1 }}
          className="flex items-center gap-4 my-12"
        >
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <span className="section-label text-xs" style={{ color: "var(--muted)" }}>
            ✦
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </motion.div>

        {/* Work Experience */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.4 + eduItems.length * 0.1 }}
          className="section-label text-xs mb-6"
          style={{ color: "var(--cyan)" }}
        >
          Work Experience
        </motion.p>
        <TimelineGroup
          items={workItems}
          color="var(--cyan)"
          inView={inView}
          delayBase={0.45 + eduItems.length * 0.1}
        />
      </div>
    </section>
  );
}
