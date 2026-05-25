"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { spring } from "@/lib/motion/presets";
import { FAQ_ITEMS } from "@/lib/constants";

function FaqItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof FAQ_ITEMS)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 px-1 py-6 text-left font-mono text-lg tracking-[-0.01em] transition-colors hover:text-ink"
        aria-expanded={isOpen}
      >
        {item.question}
        <span
          className={`shrink-0 font-mono text-[22px] text-muted transition-transform duration-200 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="max-w-[580px] pb-6 text-[15px] leading-[1.6] text-ink-soft">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }, []);

  return (
    <section className="py-24" id="faq">
      <div className="mx-auto max-w-[1240px] px-8">
        <motion.div
          className="mx-auto mb-14 max-w-[720px] text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={spring.smooth}
        >
          <span className="mb-[18px] block text-xs font-medium uppercase tracking-[0.14em] text-violet">
            Questions
          </span>
          <h2 className="font-mono text-[clamp(36px,5vw,72px)] font-bold leading-[1.02] tracking-[-0.03em]">
            The fine print.
          </h2>
        </motion.div>

        <div className="mx-auto max-w-[760px] border-t border-line">
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem
              key={item.question}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
