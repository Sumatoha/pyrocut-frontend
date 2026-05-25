"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, spring } from "@/lib/motion/presets";

const STEPS = [
  {
    num: "01",
    title: "Aim.",
    description:
      "Pick what to record — any window, the iOS Simulator, a region, your whole screen. Pyrocut hooks the framebuffer at 60fps. No QuickTime, no permission dance.",
    blob: "var(--pastel-peach)",
    visual: (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 240 80"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          x="20"
          y="14"
          width="200"
          height="52"
          rx="6"
          fill="white"
          stroke="#0B0B0E"
          strokeWidth="1"
        />
        <rect x="20" y="14" width="200" height="10" rx="6" fill="#0B0B0E" />
        <rect x="34" y="34" width="60" height="22" rx="3" fill="#FFE6D8" />
        <rect x="100" y="34" width="60" height="22" rx="3" fill="#ECEAFF" />
        <rect x="166" y="34" width="46" height="22" rx="3" fill="#F4F1E4" />
        <rect
          x="34"
          y="34"
          width="60"
          height="22"
          rx="3"
          fill="none"
          stroke="#FF5A1F"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Record.",
    description:
      "Hit ⌃⇧R. Every click, swipe, scroll, and keystroke is captured as a structured beat with coordinates and timing. The recorder floats. Your hands stay in the work.",
    blob: "var(--pastel-butter)",
    visual: (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 240 80"
        preserveAspectRatio="xMidYMid meet"
      >
        <line
          x1="14"
          y1="40"
          x2="226"
          y2="40"
          stroke="#0B0B0E"
          strokeWidth="1"
          opacity="0.4"
        />
        <g fill="#0B0B0E">
          <circle cx="34" cy="40" r="3" />
          <circle cx="62" cy="40" r="3" />
          <circle cx="86" cy="40" r="3" />
          <circle cx="116" cy="40" r="5" fill="#FF5A1F" />
          <circle cx="148" cy="40" r="3" />
          <circle cx="174" cy="40" r="3" />
          <circle cx="200" cy="40" r="3" />
        </g>
        <text
          x="116"
          y="22"
          fontFamily="JetBrains Mono"
          fontSize="9"
          fill="#FF5A1F"
          textAnchor="middle"
        >
          click
        </text>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Ship.",
    description:
      "Auto-zoom snaps in on every beat. Cursor highlights track gestures. Drop a cinematic backdrop, slap a device frame, export 1080p MP4 → paste into the post draft you already had open.",
    blob: "var(--pastel-lavender)",
    visual: (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 240 80"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect x="14" y="14" width="80" height="52" rx="6" fill="#0B0B0E" />
        <rect x="22" y="22" width="64" height="20" rx="2" fill="#5B4DEF" />
        <rect
          x="22"
          y="46"
          width="40"
          height="3"
          rx="1.5"
          fill="white"
          opacity="0.6"
        />
        <rect
          x="22"
          y="53"
          width="50"
          height="3"
          rx="1.5"
          fill="white"
          opacity="0.4"
        />
        <path
          d="M108 40 L130 40 M124 34 L130 40 L124 46"
          stroke="#0B0B0E"
          strokeWidth="1.5"
          fill="none"
        />
        <rect x="142" y="14" width="84" height="52" rx="6" fill="#FF5A1F" />
        <rect x="150" y="22" width="68" height="20" rx="2" fill="white" />
        <text
          x="184"
          y="56"
          fontFamily="JetBrains Mono"
          fontSize="8"
          fill="white"
          textAnchor="middle"
          fontWeight="700"
        >
          demo.mp4
        </text>
      </svg>
    ),
  },
] as const;

export function Steps() {
  return (
    <section className="py-24" id="how">
      <div className="mx-auto max-w-[1240px] px-8">
        <motion.div
          className="mx-auto mb-14 max-w-[720px] text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={spring.smooth}
        >
          <span className="mb-[18px] block text-xs font-medium uppercase tracking-[0.14em] text-violet">
            How it works
          </span>
          <h2 className="font-mono text-[clamp(36px,5vw,72px)] font-bold leading-[1.02] tracking-[-0.03em]">
            Three steps. One binary.
          </h2>
          <p className="mx-auto mt-[22px] max-w-[560px] font-mono text-base text-ink-soft leading-[1.55]">
            No daemons, no Electron, no helper apps. A 16 MB signed Mac binary
            that opens before your simulator does.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-5 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {STEPS.map((step) => (
            <motion.div
              key={step.num}
              className="relative flex min-h-[360px] flex-col gap-4 overflow-hidden rounded-[22px] border border-line bg-surface p-9"
              variants={fadeUp}
              transition={spring.smooth}
            >
              <div
                className="absolute -right-[70px] -top-[70px] h-[200px] w-[200px] rounded-full opacity-[0.85] blur-[2px]"
                style={{ background: step.blob }}
              />
              <div className="relative z-[1] grid h-[38px] w-[38px] place-items-center rounded-full bg-ink text-xs text-white">
                {step.num}
              </div>
              <h3 className="font-mono text-[30px] font-bold tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="font-mono text-sm leading-[1.6] text-ink-soft">
                {step.description}
              </p>
              <div className="relative mt-auto h-20 overflow-hidden rounded-xl border border-line bg-bg-soft">
                {step.visual}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
