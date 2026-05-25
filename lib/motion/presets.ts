import type { Transition, Variants } from "framer-motion";

export const spring = {
  snappy: { type: "spring", stiffness: 400, damping: 30 } as const,
  smooth: { type: "spring", stiffness: 200, damping: 25 } as const,
  gentle: { type: "spring", stiffness: 120, damping: 20 } as const,
  bouncy: { type: "spring", stiffness: 300, damping: 15 } as const,
} satisfies Record<string, Transition>;

export const heroZoom = {
  duration: 1.8,
  ease: [0.5, 0.1, 0.2, 1],
} as const;

export const cursorMove = {
  duration: 1.4,
  ease: [0.4, 0.1, 0.2, 1],
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0 },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};
