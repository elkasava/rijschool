/**
 * motion-presets.ts — Central motion language for the site.
 *
 * Rules:
 *  - GSAP owns scroll-triggered reveals (do not duplicate those here)
 *  - This file owns: hover, tap, form feedback, state transitions
 *  - All durations stay between 180 ms – 450 ms
 *  - Animate only transform + opacity (GPU-accelerated)
 *  - Consumers call `useReducedMotion()` and pass undefined to disable
 */

import type { Variants, Transition } from "framer-motion";

/** Duration tokens in seconds */
export const dur = { fast: 0.18, base: 0.26, slow: 0.42 } as const;

/** Spring presets — use instead of ease curves for interactive elements */
export const spring = {
  snappy: { type: "spring", stiffness: 480, damping: 30 } as Transition,
  bouncy: { type: "spring", stiffness: 340, damping: 16 } as Transition,
};

// ── Scroll-reveal variants (available for future use; GSAP handles current ones) ──

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.base, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: dur.base } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: dur.base, ease: [0.16, 1, 0.3, 1] },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: dur.base, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Container that staggers its children on enter */
export const staggerChildren: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

// ── Interaction props — spread directly onto motion elements ──────────────────

/**
 * CTA / button tap + hover.
 * Usage: <m.div whileHover={r ? undefined : scaleTap.whileHover} whileTap={...} transition={...}>
 */
export const scaleTap = {
  whileHover: { scale: 1.025 },
  whileTap: { scale: 0.96 },
  transition: spring.snappy,
} as const;

/** Card hover lift — replaces CSS hover:-translate-y-1 */
export const cardLift = {
  whileHover: { y: -5 },
  transition: spring.snappy,
} as const;

// ── Animated UI states ────────────────────────────────────────────────────────

/** Form field error — gentle fade + slide in/out */
export const errorVariants: Variants = {
  hidden: { opacity: 0, y: -4 },
  visible: { opacity: 1, y: 0, transition: { duration: dur.fast } },
  exit: { opacity: 0, y: -4, transition: { duration: dur.fast } },
};

/** Success / confirmation pop-in */
export const successPop: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: spring.bouncy },
};
