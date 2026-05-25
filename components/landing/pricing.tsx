"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, spring } from "@/lib/motion/presets";
import { PRICING } from "@/lib/constants";

const CHECK_VIOLET = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5B4DEF" strokeWidth="2">
    <path d="M3 8 L7 12 L13 4" />
  </svg>
);

const CHECK_HEAT = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#FF5A1F" strokeWidth="2">
    <path d="M3 8 L7 12 L13 4" />
  </svg>
);

type TierKey = keyof typeof PRICING;

function PriceAmount({ tier }: { tier: TierKey }) {
  const plan = PRICING[tier];

  if (tier === "free") {
    return (
      <div className="flex items-baseline gap-2">
        <span className="font-sans text-[62px] font-bold tracking-[-0.04em]">
          $0
        </span>
        <span className="font-mono text-[13px] text-muted">/ {plan.period}</span>
      </div>
    );
  }

  if (tier === "pro") {
    const price = plan.price as { monthly: number; yearly: number };
    return (
      <div className="flex items-baseline gap-2">
        <span className="font-sans text-[62px] font-bold tracking-[-0.04em]">
          ${price.monthly}
        </span>
        <span className="font-mono text-[13px] text-white/55">/ per month</span>
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-2">
      <span className="font-sans text-[62px] font-bold tracking-[-0.04em]">
        ${plan.price as number}
      </span>
      <span className="font-mono text-[13px] text-muted">/ {plan.period}</span>
    </div>
  );
}

function PricingCard({ tier }: { tier: TierKey }) {
  const plan = PRICING[tier];
  const isPopular = "popular" in plan && plan.popular;
  const checkIcon = isPopular ? CHECK_HEAT : CHECK_VIOLET;

  return (
    <motion.div
      className={`relative flex flex-col gap-7 rounded-[22px] border p-9 ${
        isPopular
          ? "border-ink bg-ink text-white"
          : "border-line bg-surface"
      }`}
      variants={fadeUp}
      transition={spring.smooth}
    >
      {isPopular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-heat px-3 py-[5px] text-xs font-medium text-ink">
          Most popular
        </span>
      )}

      <div>
        <div className={`font-sans text-[22px] font-bold tracking-[-0.01em] ${isPopular ? "text-white" : ""}`}>
          {plan.name}
        </div>
        <div className={`font-mono text-[13px] ${isPopular ? "text-white/55" : "text-muted"}`}>
          {plan.description}
        </div>
      </div>

      <PriceAmount tier={tier} />

      <a
        href={tier === "free" ? "/api/download/pyrocut" : "/signup"}
        className={`flex w-full items-center justify-center gap-2 rounded-full px-[22px] py-[14px] font-mono text-sm font-medium transition-transform hover:-translate-y-px active:translate-y-0 ${
          isPopular
            ? "bg-violet text-white shadow-[0_6px_0_-2px_rgba(91,77,239,0.4),0_14px_34px_-12px_rgba(91,77,239,0.6)]"
            : "bg-ink text-white"
        }`}
      >
        {plan.cta} →
      </a>

      <ul className="flex flex-col gap-3.5">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className={`flex items-center gap-3 text-sm ${
              isPopular ? "text-white/85" : ""
            }`}
          >
            <span className="shrink-0">{checkIcon}</span>
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Pricing() {
  return (
    <section className="bg-bg-soft py-24" id="pricing">
      <div className="mx-auto max-w-[1240px] px-8">
        <motion.div
          className="mx-auto mb-14 max-w-[720px] text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={spring.smooth}
        >
          <span className="mb-[18px] block text-xs font-medium uppercase tracking-[0.14em] text-violet">
            Pricing
          </span>
          <h2 className="font-mono text-[clamp(36px,5vw,72px)] font-bold leading-[1.02] tracking-[-0.03em]">
            Free to record.
            <br />
            Pay for{" "}
            <span className="relative -rotate-1 inline-block rounded-[14px] bg-heat px-[0.16em] text-ink shadow-[0_12px_30px_-10px_rgba(255,90,31,0.55),0_0_0_1px_rgba(255,90,31,0.4)]">
              the polish.
            </span>
          </h2>
          <p className="mx-auto mt-[22px] max-w-[560px] font-mono text-base text-ink-soft leading-[1.55]">
            Recording stays free and unlimited, forever. The AI editor unlocks
            at the price of a coffee subscription.
          </p>
        </motion.div>

        <motion.div
          className="grid items-stretch gap-5 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <PricingCard tier="free" />
          <PricingCard tier="pro" />
          <PricingCard tier="lifetime" />
        </motion.div>
      </div>
    </section>
  );
}
