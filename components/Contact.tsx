"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import contactData from "../config/contact.yaml";

const { subtitle, links } = contactData as {
  subtitle: string;
  links: { label: string; value: string; href: string; mono: boolean }[];
};

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="pt-24 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-label mb-3"
        >
          Contact
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-3xl sm:text-4xl font-bold mb-4"
        >
          Get in Touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base max-w-xl mb-12 leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {subtitle}
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-4">
          {links.map((l, i) => (
            <motion.a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              className="card p-5 flex items-center justify-between group"
            >
              <div>
                <span className="section-label text-xs block mb-1">{l.label}</span>
                <span
                  className="text-sm transition-colors group-hover:text-white"
                  style={{
                    color: "var(--muted)",
                    fontFamily: l.mono ? "var(--font-mono)" : undefined,
                  }}
                >
                  {l.value}
                </span>
              </div>
              <span
                className="text-lg transition-transform group-hover:translate-x-1"
                style={{ color: "var(--cyan)" }}
              >
                →
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
