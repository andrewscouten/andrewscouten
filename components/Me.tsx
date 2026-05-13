"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import meData from "../config/me.yaml";

interface MeConfig {
  greeting: string;
  firstName: string;
  lastName: string;
  roles: string[];
  bio: string;
  cta: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
  socials: { label: string; href: string }[];
}

const me: MeConfig = meData;

export default function Me() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((i) => (i + 1) % me.roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,217,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--cyan), transparent 70%)" }}
      />

      <div className="relative max-w-5xl mx-auto w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="section-label mb-6"
        >
          {me.greeting}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-bold tracking-tight mb-4"
          style={{ color: "var(--text)" }}
        >
          {me.firstName} {me.lastName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl sm:text-3xl font-light mb-8 flex items-center gap-3 h-10"
          style={{ color: "var(--muted)" }}
        >
          <span style={{ color: "var(--cyan)" }}>&gt;</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {me.roles[roleIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base sm:text-lg max-w-2xl leading-relaxed mb-10"
          style={{ color: "var(--muted)" }}
        >
          {me.bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href={me.cta.primary.href}
            onClick={(e) => {
              const target = me.cta.primary.href;
              if (target.startsWith("#")) {
                e.preventDefault();
                document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90"
            style={{
              background: "var(--cyan)",
              color: "#000",
              fontFamily: "var(--font-mono)",
            }}
          >
            {me.cta.primary.label}
          </a>
          <a
            href={me.cta.secondary.href}
            className="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:border-cyan-400"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {me.cta.secondary.label}
          </a>
          <a
            href="/AndrewScouten.pdf"
            download
            className="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:border-cyan-400"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Resume & CV
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex gap-5 mt-12"
        >
          {me.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="section-label hover:opacity-60 transition-opacity"
            >
              {s.label}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="section-label text-xs" style={{ color: "var(--muted)" }}>
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-0.5 h-6 rounded-full"
          style={{ background: "var(--muted)" }}
        />
      </motion.div>
    </section>
  );
}
