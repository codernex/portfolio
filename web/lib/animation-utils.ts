import type { Variants } from "framer-motion";

// ─── Viewport defaults ────────────────────────────────────────────────────────
/** Shared viewport options so every section triggers at the same threshold. */
export const defaultViewport = { once: true, amount: 0.2 } as const;

// ─── Fade & slide variants ────────────────────────────────────────────────────

/** Fades in from below (default 24 px offset). */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Fades in from the left. */
export const fadeLeftVariants: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Fades in from the right. */
export const fadeRightVariants: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Simple opacity-only fade. */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ─── Container / stagger variants ────────────────────────────────────────────

/**
 * Parent container that staggers its children.
 * @param stagger  Delay between each child (seconds). Default 0.1.
 * @param delayChildren  Delay before the first child starts. Default 0.
 */
export function staggerContainerVariants(
  stagger = 0.1,
  delayChildren = 0,
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren,
      },
    },
  };
}

/**
 * Child item that fades up. Meant to be used inside a stagger container.
 * @param yOffset  Vertical offset in pixels. Default 20.
 */
export function staggerItemVariants(yOffset = 20): Variants {
  return {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

// ─── Scale / pop variants ─────────────────────────────────────────────────────

/** Scales in from slightly smaller. Good for cards or badges. */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Heading "reveal" helper ──────────────────────────────────────────────────

/** Slide-and-clip reveal for section headings. */
export const headingRevealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
