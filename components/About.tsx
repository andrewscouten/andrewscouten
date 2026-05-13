"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const facts = [
  { label: "Location", value: "San Marcos, TX" },
  { label: "Degree", value: "M.S. Computer Science (Dec 2026)" },
  { label: "Focus", value: "Applied Deep Learning & Data Pipelines" },
  { label: "Languages", value: "English (Native), German (A2/B1)" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-label mb-3"
        >
          About
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-3xl sm:text-4xl font-bold mb-10"
        >
          Who I Am
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-base leading-relaxed mb-5" style={{ color: "var(--muted)" }}>
              I&apos;m a machine learning engineer and researcher with a track record of shipping
              production-quality pipelines and models in collaborative, cross-disciplinary
              environments. My research spans infrastructure-scale pavement analysis with TxDOT
              and microbiology imaging aboard the International Space Station under a
              NASA/SpaceX-21 mission.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
              Beyond research, I&apos;ve led hackathon teams of up to 15 contributors, built
              multi-modal ML systems for cancer genomics, and spent three years as the sole
              developer of a distributed Minecraft network — sharpening my instincts for reading,
              extending, and shipping production code independently.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            {facts.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.07 }}
                className="card px-5 py-4"
              >
                <span className="section-label text-xs block mb-1">{f.label}</span>
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  {f.value}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
