"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, spring } from "@/lib/motion/presets";

const SHOWCASE_ITEMS = [
  {
    bg: "radial-gradient(80% 60% at 50% 30%, #FF5A1F, #2A0B14)",
    label: "@noah · MRR dashboard · 0:18",
  },
  {
    bg: "radial-gradient(60% 70% at 70% 70%, #5B4DEF, #0A0825)",
    label: "@kira · Onboarding rev · 0:42",
  },
  {
    bg: "linear-gradient(160deg, #C9EBD3, #2D5A3F)",
    label: "@taro · iOS Sim ship · 0:31",
  },
  {
    bg: "radial-gradient(70% 60% at 30% 30%, #FFB85C, #4A2618)",
    label: "@lena · Stripe webhook · 0:24",
  },
] as const;

export function Showcase() {
  return (
    <section className="py-24" id="showcase">
      <div className="mx-auto max-w-[1240px] px-8">
        <motion.div
          className="mx-auto mb-14 max-w-[720px] text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={spring.smooth}
        >
          <span className="mb-[18px] block text-xs font-medium uppercase tracking-[0.14em] text-violet">
            Showcase
          </span>
          <h2 className="font-mono text-[clamp(36px,5vw,72px)] font-bold leading-[1.02] tracking-[-0.03em]">
            Made by founders.
            <br />
            <span className="text-muted">Posted, not parked.</span>
          </h2>
          <p className="mx-auto mt-[22px] max-w-[560px] font-mono text-base text-ink-soft leading-[1.55]">
            Real cuts shipped from pyrocut. Click any to play.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {SHOWCASE_ITEMS.map((item) => (
            <motion.div
              key={item.label}
              className="group relative overflow-hidden rounded-[18px] bg-ink transition-transform hover:-translate-y-1"
              style={{ aspectRatio: "9/16" }}
              variants={fadeUp}
              transition={spring.smooth}
            >
              <div
                className="absolute inset-0"
                style={{ background: item.bg }}
              />
              <div className="absolute inset-0 grid place-items-center text-white opacity-85">
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="rgba(0,0,0,0.4)"
                    className="transition-transform group-hover:scale-110"
                  />
                  <path d="M20 16 L33 24 L20 32 Z" fill="white" />
                </svg>
              </div>
              <div className="absolute bottom-3.5 left-3.5 rounded-lg bg-black/50 px-2.5 py-1.5 text-xs text-white backdrop-blur-lg">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
