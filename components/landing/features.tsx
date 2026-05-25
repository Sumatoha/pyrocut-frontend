"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, spring } from "@/lib/motion/presets";

type Feature = {
  icon: ReactNode;
  title: string;
  description: string;
  preview: ReactNode;
};

const FEATURES: Feature[] = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="8" cy="8" r="5.5" />
        <line x1="12" y1="12" x2="16" y2="16" />
        <line x1="5.5" y1="8" x2="10.5" y2="8" />
        <line x1="8" y1="5.5" x2="8" y2="10.5" />
      </svg>
    ),
    title: "Auto-zoom on every beat.",
    description:
      "Pyrocut watches the cursor. When you click, the camera glides in. When you breathe, it pulls back. Hand-keyframe quality, generated in a frame.",
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 300 90" preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="0" width="300" height="90" fill="#F4F1E4" />
        <g stroke="#0B0B0E" strokeWidth="1" fill="none" opacity="0.2">
          <line x1="0" y1="22" x2="300" y2="22" />
          <line x1="0" y1="44" x2="300" y2="44" />
          <line x1="0" y1="66" x2="300" y2="66" />
        </g>
        <path
          d="M0 60 Q30 60 50 60 Q70 60 90 30 Q110 18 130 18 Q150 18 170 60 Q200 60 220 60 Q240 60 260 25 Q280 16 300 16"
          stroke="#5B4DEF" strokeWidth="2" fill="none"
        />
        <circle cx="120" cy="18" r="4" fill="#FF5A1F" />
        <circle cx="250" cy="22" r="4" fill="#FF5A1F" />
      </svg>
    ),
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 2 L3 14 L6.5 11 L8.5 15 L10 14.5 L8 10.5 L12 10.5 Z" />
        <circle cx="14" cy="3" r="2" opacity=".6" />
      </svg>
    ),
    title: "Cursor tracking + click rings.",
    description:
      "A focus halo follows your cursor so viewers always know where to look. Ember rings ping on every click. Hovers leave a contrail you can tune.",
    preview: (
      <div className="h-full w-full" style={{ background: "linear-gradient(135deg, #2A1F4F, #0E0B1F)" }}>
        <svg width="100%" height="100%" viewBox="0 0 300 90" preserveAspectRatio="xMidYMid meet">
          <circle cx="80" cy="45" r="20" fill="none" stroke="#FF5A1F" strokeWidth="1.5" opacity=".4" />
          <circle cx="80" cy="45" r="14" fill="none" stroke="#FF5A1F" strokeWidth="1.5" opacity=".7" />
          <circle cx="80" cy="45" r="8" fill="none" stroke="#FF5A1F" strokeWidth="1.5" />
          <path d="M155 25 Q175 45 200 45 Q215 45 230 60" stroke="#FFB85C" strokeWidth="2" fill="none" strokeDasharray="2 3" opacity=".7" />
          <g transform="translate(225 55)">
            <path d="M0 0 L0 13 L3.5 10 L5.5 14 L7 13.5 L5 9.5 L9 9.5 Z" fill="white" stroke="black" strokeWidth="0.6" />
          </g>
          <circle cx="230" cy="60" r="22" fill="rgba(255,255,255,0.08)" />
        </svg>
      </div>
    ),
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="2" width="14" height="14" rx="2" />
        <path d="M2 12 L7 7 L11 11 L16 6" />
      </svg>
    ),
    title: "Cinematic backdrops.",
    description:
      "Twelve curated scenes — ember dusk, indigo grain, studio matte. Or drop in a brand gradient. Window shadow + bokeh fall naturally.",
    preview: (
      <div
        className="h-full w-full rounded-xl"
        style={{ background: "linear-gradient(135deg, #FF5A1F 0%, #FFB85C 50%, #5B4DEF 100%)" }}
      />
    ),
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="9" cy="9" r="3" />
        <circle cx="9" cy="9" r="6" strokeDasharray="2 2" />
        <path d="M9 1 L9 4 M9 14 L9 17 M1 9 L4 9 M14 9 L17 9" />
      </svg>
    ),
    title: "Focus blur.",
    description:
      "Soft-blurs the periphery during zooms so the eye locks on the action. Adjustable radius, smart edge falloff. Looks shot, not screen-grabbed.",
    preview: (
      <div className="h-full w-full bg-white">
        <svg width="100%" height="100%" viewBox="0 0 300 90" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="blur1"><feGaussianBlur stdDeviation="3" /></filter>
            <radialGradient id="vig" cx="50%" cy="50%" r="40%">
              <stop offset="60%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="0.7" />
            </radialGradient>
          </defs>
          <g filter="url(#blur1)">
            <rect x="20" y="14" width="40" height="60" fill="#ECEAFF" />
            <rect x="240" y="14" width="40" height="60" fill="#FFE6D8" />
            <rect x="80" y="14" width="40" height="60" fill="#DCD3FF" />
            <rect x="180" y="14" width="40" height="60" fill="#C9EBD3" />
          </g>
          <rect x="125" y="20" width="50" height="50" rx="6" fill="#0B0B0E" />
          <rect x="133" y="28" width="34" height="34" rx="3" fill="#FF5A1F" />
          <rect x="0" y="0" width="300" height="90" fill="url(#vig)" />
        </svg>
      </div>
    ),
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="4" width="14" height="10" rx="1.5" />
        <rect x="5" y="14" width="8" height="2" />
        <path d="M2 8 L16 8" />
      </svg>
    ),
    title: "Mac, window, Simulator, region.",
    description:
      "Any source: a single app window, an iOS Simulator, an Xcode debugger, a region you draw. Switch sources mid-cut.",
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 300 90" preserveAspectRatio="xMidYMid meet">
        <rect x="14" y="20" width="60" height="50" rx="4" fill="white" stroke="#0B0B0E" strokeWidth="1" />
        <text x="44" y="48" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle">window</text>
        <rect x="88" y="14" width="42" height="62" rx="6" fill="#0B0B0E" />
        <rect x="92" y="20" width="34" height="50" rx="3" fill="white" />
        <text x="109" y="80" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle" fill="#6B6B72">sim</text>
        <rect x="142" y="22" width="64" height="46" rx="4" fill="none" stroke="#FF5A1F" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="174" y="48" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" fill="#FF5A1F">region</text>
        <rect x="220" y="14" width="66" height="62" rx="4" fill="#F4F1E4" stroke="#0B0B0E" strokeWidth="1" />
        <text x="253" y="48" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle">screen</text>
      </svg>
    ),
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 9 L7 13 L15 4" />
      </svg>
    ),
    title: "Twitter-ready exports.",
    description:
      "1080p MP4 at the aspect ratio the post wants — 16:9, 9:16, 1:1. Caption track. GIF fallback. Drag the file straight onto your draft.",
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 300 90" preserveAspectRatio="xMidYMid meet">
        <rect x="14" y="14" width="84" height="52" rx="4" fill="white" stroke="#0B0B0E" strokeWidth="1" />
        <text x="56" y="44" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" fontWeight="700">16:9</text>
        <rect x="110" y="14" width="28" height="52" rx="4" fill="white" stroke="#0B0B0E" strokeWidth="1" />
        <text x="124" y="44" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" fontWeight="700">9:16</text>
        <rect x="150" y="14" width="52" height="52" rx="4" fill="white" stroke="#0B0B0E" strokeWidth="1" />
        <text x="176" y="44" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" fontWeight="700">1:1</text>
        <rect x="214" y="14" width="72" height="52" rx="4" fill="#0B0B0E" />
        <text x="250" y="40" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" fill="white" fontWeight="700">demo.mp4</text>
        <text x="250" y="54" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle" fill="#FF5A1F">4.2 mb</text>
      </svg>
    ),
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <motion.div
      className="relative flex min-h-[280px] flex-col gap-3.5 overflow-hidden rounded-[22px] border border-line bg-surface p-7"
      variants={fadeUp}
      transition={spring.smooth}
    >
      <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-ink text-heat">
        {feature.icon}
      </div>
      <h3 className="font-mono text-xl font-bold tracking-[-0.02em]">
        {feature.title}
      </h3>
      <p className="text-sm text-ink-soft">{feature.description}</p>
      <div className="relative mt-auto h-[90px] overflow-hidden rounded-xl bg-bg-soft">
        {feature.preview}
      </div>
    </motion.div>
  );
}

export function Features() {
  return (
    <section className="bg-bg-soft py-24" id="features">
      <div className="mx-auto max-w-[1240px] px-8">
        <motion.div
          className="mx-auto mb-14 max-w-[720px] text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={spring.smooth}
        >
          <span className="mb-[18px] block text-xs font-medium uppercase tracking-[0.14em] text-violet">
            What pyrocut does
          </span>
          <h2 className="font-mono text-[clamp(36px,5vw,72px)] font-bold leading-[1.02] tracking-[-0.03em]">
            An editor that opens with your demo
            <br />
            <span className="text-muted">already cut.</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid gap-5 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
