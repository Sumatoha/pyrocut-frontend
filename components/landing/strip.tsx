"use client";

import { motion } from "framer-motion";
import { fadeIn, spring } from "@/lib/motion/presets";
import { STRIP_ITEMS } from "@/lib/constants";

export function Strip() {
  return (
    <motion.div
      className="overflow-hidden border-y border-line py-7"
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      transition={spring.smooth}
    >
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-12 px-8 text-[13px] text-muted">
        <span>
          Built for shipping <b className="font-medium text-ink">in public</b>{" "}
          on
        </span>
        {STRIP_ITEMS.map((item, i) => (
          <span key={item} className="inline-flex items-center gap-12">
            {i > 0 && <span>·</span>}
            <span>{item}</span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}
