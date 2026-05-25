"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const POSITIONS = [
  { top: "62%", left: "56%", zoomed: true },
  { top: "38%", left: "34%", zoomed: false },
  { top: "52%", left: "72%", zoomed: true },
  { top: "46%", left: "50%", zoomed: false },
] as const;

const CURSOR_TRANSITION = {
  duration: 1.4,
  ease: [0.4, 0.1, 0.2, 1] as const,
};

const DEVICE_TRANSITION = {
  duration: 1.8,
  ease: [0.5, 0.1, 0.2, 1] as const,
};

export function HeroPreview() {
  const [posIndex, setPosIndex] = useState(0);
  const pos = POSITIONS[posIndex % POSITIONS.length];

  useEffect(() => {
    const id = setInterval(() => {
      setPosIndex((prev) => prev + 1);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative">
      <div
        className="overflow-hidden rounded-[18px] border border-black/40 bg-noir"
        style={{
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.05) inset, 0 30px 80px -30px rgba(11,11,14,0.55), 0 12px 40px -16px rgba(11,11,14,0.4)",
        }}
      >
        {/* Title bar */}
        <div className="flex h-[38px] items-center gap-3.5 border-b border-white/[0.06] bg-noir-2 px-4">
          <div className="flex gap-[7px]">
            <span className="h-[11px] w-[11px] rounded-full bg-[#FF5F57]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#FEBC2E]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 text-center font-mono text-xs text-white/50">
            Untitled.cut — pyrocut
          </div>
          <div className="inline-flex items-center gap-[7px] font-mono text-[11px] text-heat">
            <span className="h-[7px] w-[7px] animate-[rec_1.3s_ease-in-out_infinite] rounded-full bg-heat" />
            REC 00:00:14
          </div>
        </div>

        {/* Stage */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {/* Background gradients */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(120% 80% at 20% 0%, #2A1F4F 0%, transparent 55%),
                radial-gradient(140% 90% at 90% 100%, #5B1F3E 0%, transparent 60%),
                linear-gradient(180deg, #1A1230 0%, #0E0B1F 100%)
              `,
            }}
          />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: `
                radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "38px 38px, 19px 19px",
              backgroundPosition: "0 0, 9px 9px",
            }}
          />
          {/* Glow overlay */}
          <div
            className="pointer-events-none absolute inset-[-10%] blur-[40px]"
            style={{
              background: `
                radial-gradient(35% 30% at 30% 70%, rgba(255,90,31,0.25), transparent 70%),
                radial-gradient(40% 35% at 75% 25%, rgba(91,77,239,0.30), transparent 70%)
              `,
            }}
          />

          {/* Device window */}
          <motion.div
            className="absolute left-1/2 top-1/2 w-[64%] overflow-hidden rounded-xl bg-white"
            style={{
              aspectRatio: "16/10",
              boxShadow:
                "0 30px 80px -20px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
            animate={{
              x: pos.zoomed ? "-58%" : "-50%",
              y: pos.zoomed ? "-45%" : "-50%",
              scale: pos.zoomed ? 1.45 : 1.05,
            }}
            transition={DEVICE_TRANSITION}
          >
            <div className="flex h-[26px] items-center gap-1.5 border-b border-black/5 bg-[#F2F0EA] px-2.5">
              <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
              <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
              <span className="h-2 w-2 rounded-full bg-[#28C840]" />
            </div>
            <div className="grid h-[calc(100%-26px)] grid-cols-[110px_1fr] gap-4 p-[18px_22px] font-sans">
              <div className="flex flex-col gap-1.5 rounded-lg bg-[#FAF8F2] p-2.5 text-[9px]">
                {["Inbox", "Pipeline", "Customers", "Revenue", "Settings"].map(
                  (item) => (
                    <div
                      key={item}
                      className={`flex items-center gap-1.5 rounded-[5px] px-2 py-1.5 ${
                        item === "Pipeline"
                          ? "bg-violet text-white"
                          : "text-muted"
                      }`}
                    >
                      <span
                        className={`h-[5px] w-[5px] rounded-full opacity-50 ${
                          item === "Pipeline" ? "bg-white" : "bg-current"
                        }`}
                      />
                      {item}
                    </div>
                  ),
                )}
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="text-sm font-bold tracking-[-0.01em] text-noir">
                  Pipeline · Q4
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: "MRR", value: "$4.2k" },
                    { label: "Trials", value: "128" },
                    { label: "Churn", value: "0.8%" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-md bg-[#F4F1E4] px-2.5 py-2 text-[9px] text-muted"
                    >
                      {stat.label}
                      <span className="mt-0.5 block text-base font-bold text-noir">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="relative overflow-hidden rounded-md bg-[#FAF8F2]" style={{ height: 50 }}>
                  <svg
                    viewBox="0 0 200 50"
                    preserveAspectRatio="none"
                    className="h-full w-full"
                  >
                    <defs>
                      <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor="#5B4DEF" stopOpacity="0.4" />
                        <stop offset="1" stopColor="#5B4DEF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 40 L20 36 L40 38 L60 30 L80 32 L100 22 L120 24 L140 14 L160 18 L180 10 L200 6 L200 50 L0 50 Z"
                      fill="url(#g1)"
                    />
                    <path
                      d="M0 40 L20 36 L40 38 L60 30 L80 32 L100 22 L120 24 L140 14 L160 18 L180 10 L200 6"
                      fill="none"
                      stroke="#5B4DEF"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Click ring */}
          <motion.div
            className="pointer-events-none absolute h-[18px] w-[18px]"
            animate={{ top: pos.top, left: pos.left }}
            transition={CURSOR_TRANSITION}
          >
            <span className="absolute inset-[-10px] animate-[click_2.2s_ease-out_infinite] rounded-full border-2 border-heat opacity-0" />
          </motion.div>

          {/* Cursor */}
          <motion.div
            className="absolute z-[5] h-[18px] w-[18px]"
            animate={{ top: pos.top, left: pos.left }}
            transition={CURSOR_TRANSITION}
          >
            <span className="absolute inset-[-14px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45),transparent_70%)]" />
            <svg width="18" height="18" viewBox="0 0 18 18" className="relative">
              <path
                d="M2 1 L2 14 L5.5 11.2 L8 16 L10 15 L7.5 10 L12 10 Z"
                fill="white"
                stroke="black"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          {/* Floating chips */}
          <div className="absolute left-[6%] top-[10%] z-[4] flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-black/[0.78] px-3.5 py-2.5 text-xs text-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)] backdrop-blur-[20px]">
            <span className="text-heat">●</span>
            <div>
              <div className="text-[11px] text-white/55">zoom</div>
              <strong className="font-medium">1.45×</strong>
            </div>
          </div>

          <div className="absolute bottom-[12%] right-[6%] z-[4] flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-black/[0.78] px-3.5 py-2.5 text-xs text-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)] backdrop-blur-[20px]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
            >
              <circle cx="7" cy="7" r="3" />
              <circle cx="7" cy="7" r="6" opacity=".5" />
            </svg>
            <div>
              <div className="text-[11px] text-white/55">cursor</div>
              <strong className="font-medium">highlighted</strong>
            </div>
          </div>

          <div className="absolute right-[7%] top-[14%] z-[4] flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-black/[0.78] px-3.5 py-2.5 text-xs text-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)] backdrop-blur-[20px]">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <rect
                x="1"
                y="1"
                width="12"
                height="12"
                rx="2"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            <div>
              <div className="text-[11px] text-white/55">backdrop</div>
              <strong className="font-medium">ember dusk</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
