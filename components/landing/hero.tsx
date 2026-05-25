"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { fadeUp, staggerContainer, spring } from "@/lib/motion/presets";
import { HeroPreview } from "./hero-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-6 pt-14 text-center">
      <motion.div
        className="mx-auto w-full max-w-[1240px] px-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="mx-auto max-w-[1000px] font-mono text-[clamp(48px,7.2vw,110px)] font-bold leading-[0.98] tracking-[-0.035em]"
          variants={fadeUp}
          transition={spring.smooth}
        >
          Screen demos
          <br />
          for founders <span className="text-violet">building</span>
          <br />
          <span className="relative -rotate-1 inline-block rounded-[14px] bg-heat px-[0.16em] text-ink shadow-[0_12px_30px_-10px_rgba(255,90,31,0.55),0_0_0_1px_rgba(255,90,31,0.4)]">
            in&nbsp;public.
            <span className="absolute inset-[-2px_-4px] -z-10 rounded-[16px] bg-heat opacity-15 blur-[8px]" />
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-7 max-w-[640px] font-mono text-base leading-[1.55] text-ink-soft"
          variants={fadeUp}
          transition={spring.smooth}
        >
          {SITE.description}
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap justify-center gap-4"
          variants={fadeUp}
          transition={spring.smooth}
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-violet px-[26px] py-[18px] text-[15px] font-medium text-white shadow-[0_6px_0_-2px_rgba(91,77,239,0.4),0_14px_34px_-12px_rgba(91,77,239,0.6)] transition-transform hover:-translate-y-px active:translate-y-0"
          >
            Download for macOS · free →
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-transparent px-[26px] py-[18px] text-[15px] font-medium text-ink transition-colors hover:bg-black/[0.04]"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-white">
              <svg width="9" height="9" viewBox="0 0 9 9">
                <path d="M2 1 L8 4.5 L2 8 Z" fill="white" />
              </svg>
            </span>
            Watch 60-sec demo
          </button>
        </motion.div>

        <motion.div
          className="mt-7 flex flex-wrap items-center justify-center gap-7 font-mono text-[13px] text-muted"
          variants={fadeUp}
          transition={spring.smooth}
        >
          {["16 mb · signed binary", "Apple silicon native", "Open .cut format", "macOS 14+"].map(
            (item, i) => (
              <span key={item} className="inline-flex items-center gap-7">
                {i > 0 && (
                  <span className="inline-block h-1 w-1 rounded-full bg-muted" />
                )}
                {item}
              </span>
            ),
          )}
        </motion.div>
      </motion.div>

      <motion.div
        className="mx-auto mt-[88px] max-w-[1180px] px-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring.gentle, delay: 0.4 }}
      >
        <HeroPreview />
      </motion.div>
    </section>
  );
}
