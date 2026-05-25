"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { spring } from "@/lib/motion/presets";

export function CtaBand() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-[1240px] px-8">
        <motion.div
          className="relative overflow-hidden rounded-[28px] bg-ink px-12 py-[84px] text-center text-white"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={spring.smooth}
        >
          {/* Gradient blobs */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(40% 60% at 15% 0%, rgba(91,77,239,0.55), transparent 60%),
                radial-gradient(40% 60% at 85% 100%, rgba(255,90,31,0.55), transparent 60%)
              `,
            }}
          />

          <div className="relative z-[1]">
            <h2 className="font-mono text-[clamp(36px,5vw,72px)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
              Ship the demo.
              <br />
              Then ship the&nbsp;thing.
            </h2>
            <p className="mx-auto mt-[18px] font-mono text-base text-white/70 leading-[1.55]">
              Pyrocut is free to record, free to keep. Pay only if you want the
              polish.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-violet px-[26px] py-[18px] text-[15px] font-medium text-white shadow-[0_6px_0_-2px_rgba(91,77,239,0.4),0_14px_34px_-12px_rgba(91,77,239,0.6)] transition-transform hover:-translate-y-px active:translate-y-0"
              >
                Download for macOS · free →
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-[26px] py-[18px] text-[15px] font-medium text-white transition-colors hover:bg-white/[0.06]"
              >
                Try the editor →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
