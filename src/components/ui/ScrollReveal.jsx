"use client";

import { motion } from "framer-motion";

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up", // up, down, left, right, none
  duration = 0.5,
}) {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  };

  const initial = {
    opacity: 0,
    ...directions[direction],
  };

  const whileInView = {
    opacity: 1,
    y: 0,
    x: 0,
  };

  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.25, 0.25, 0, 1], // Custom easing for smooth reveal
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
