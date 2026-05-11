import { motion, type Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const easeOutQuad: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easeOutQuad,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Wraps page content with a fade + slide-up entrance animation.
 * Use inside page components for smooth transitions.
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
}

// ── Staggered list animation ──────────────────────────────────────────

const listContainerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const listItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easeOutQuad,
    },
  },
};

/**
 * Container that staggers the entrance of its children.
 * Wrap a list/grid of items, and wrap each item with <StaggerItem>.
 */
export function StaggerContainer({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={listContainerVariants}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual item within a StaggerContainer. Fades and slides in.
 */
export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={listItemVariants}>
      {children}
    </motion.div>
  );
}
