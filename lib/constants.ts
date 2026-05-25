export const SITE = {
  name: "pyrocut",
  tagline: "Screen demos for founders building in public",
  description:
    "Pyrocut records anything on your Mac — a window, the Simulator, your whole desktop — then cuts it into a polished demo. Auto-zoom on every click, focus blur, cursor tracking, cinematic backdrops. Twitter-ready in thirty seconds.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pyrocut.app",
  twitter: "@pyrocutapp",
  email: "hello@pyrocut.app",
} as const;

export const PRICING = {
  free: {
    name: "Hobby",
    price: 0,
    period: "forever",
    description: "For weekend projects",
    cta: "Download",
    ctaStyle: "dark" as const,
    features: [
      "Unlimited recording",
      "CLI + menubar",
      "Open .cut format",
      "720p export · watermark",
    ],
  },
  pro: {
    name: "Founder",
    price: { monthly: 19, yearly: 149 },
    period: "per month",
    description: "For builders shipping in public",
    cta: "Start 14-day trial",
    ctaStyle: "primary" as const,
    popular: true,
    features: [
      "Everything in Hobby",
      "AI auto-cut + auto-zoom",
      "4K export, no watermark",
      "Cinematic backdrops + brand kit",
      "Private share links",
      "3 device activations",
    ],
  },
  lifetime: {
    name: "Lifetime",
    price: 199,
    period: "one-time",
    description: "One payment. Yours forever.",
    cta: "Buy lifetime",
    ctaStyle: "dark" as const,
    features: [
      "Everything in Founder",
      "All future updates included",
      "5 device activations",
      "Priority support",
    ],
  },
} as const;

export const FAQ_ITEMS = [
  {
    question: "Is the recording lossless?",
    answer:
      "Yes. Pyrocut captures the framebuffer at 60fps and stores it as H.265 by default, or ProRes if you tell it to. The .cut file also holds the structured input track — clicks, scrolls, keystrokes with sub-frame timing — so re-editing later doesn't lose anything.",
  },
  {
    question: "Does it need screen-recording permission?",
    answer:
      "Once, on first launch — the standard macOS prompt. No background daemons, no helper app, no kernel extension. You can revoke it any time in System Settings and pyrocut still opens to edit existing cuts.",
  },
  {
    question: "What's in the .cut format?",
    answer:
      "An open container: H.265/ProRes video, a JSON track of input beats, a manifest of polish edits (zoom curves, blur radii, backdrop choice, brand kit), and a thumbnail. Inspect it with any text editor, diff it on GitHub, re-render it on CI.",
  },
  {
    question: "Can I record without showing my cursor?",
    answer:
      "Yes. Toggle the cursor off, or replace it with a \"spotlight\" mode that only highlights on click. Useful for SaaS dashboards where the cursor is noise.",
  },
  {
    question: "How fast is the AI auto-cut?",
    answer:
      "It runs locally on Apple silicon. A 60-second clip auto-zooms, blurs, and renders in roughly 8 seconds on an M2. No cloud round-trip — your work-in-progress never leaves your Mac.",
  },
  {
    question: "What macOS version do I need?",
    answer:
      "macOS 14 (Sonoma) or later. It's a native Swift app — no Electron, no web wrappers. Apple Silicon or Intel, 4GB RAM minimum. The app itself is under 30MB.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes. Email us within 14 days of purchase for a full refund, no questions asked.",
  },
  {
    question: "How many devices can I activate?",
    answer:
      "Founder licenses support 3 device activations. Lifetime licenses support 5. You can deactivate devices from your account portal anytime.",
  },
  {
    question: "Does it work offline?",
    answer:
      "Yes. Pyrocut validates your license once every 7 days. Between checks, everything works offline. Recording and editing never require an internet connection.",
  },
  {
    question: "Do you upload my recordings?",
    answer:
      "Never. All processing happens locally on your Mac. Your screen recordings never leave your machine.",
  },
] as const;

export const HERO_META = [
  "16 mb · signed binary",
  "Apple silicon native",
  "Open .cut format",
  "macOS 14+",
] as const;

export const STRIP_ITEMS = [
  "𝕏 / Twitter",
  "Product Hunt",
  "YouTube Shorts",
  "your changelog",
  "investor updates",
] as const;
