import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Monoline & Solid Botanical Vector Leaf Shapes
const LEAF_SVG_SHAPES = [
  // Classic Leaf
  "M17 8C8 10 5 16 5 22C11 22 17 19 19 10C19 9 18 8 17 8ZM12 17C10 15 8 12 8 12",
  // Pothos / Teardrop Leaf
  "M12 2C6.5 2 2 6.5 2 12c0 4.5 3 8.3 7 9.5.5.1 1-.3 1-.8v-2.2c-3 0-3.5-1.5-3.5-1.5-.4-1-.9-1.3-.9-1.3-.8-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1 2.9.8.1-.6.3-1 .6-1.3-2.4-.3-4.9-1.2-4.9-5.4 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-3 0 0 .9-.3 3 1.1 1-.3 2-.4 3-.4s2 .1 3 .4c2.1-1.4 3-1.1 3-1.1.6 1.6.2 2.7.1 3 .7.8 1.1 1.8 1.1 3 0 4.2-2.5 5.1-4.9 5.4.4.3.7.9.7 1.9v2.8c0 .5.5.9 1 .8 4-1.2 7-5 7-9.5 0-5.5-4.5-10-10-10z",
  // Ginkgo / Fan Leaf
  "M12 2L10.5 8.5L4 10L10.5 11.5L12 18L13.5 11.5L20 10L13.5 8.5L12 2Z"
];

// Rich Emerald & Forest Green Palette
const GREEN_LEAF_COLORS = [
  "rgba(46, 125, 50, 0.75)",   // Deep Forest Green
  "rgba(76, 175, 80, 0.75)",   // Vibrant Leaf Green
  "rgba(21, 128, 61, 0.75)",   // Emerald Green
  "rgba(129, 199, 132, 0.7)",  // Soft Mint Green
  "rgba(101, 163, 13, 0.7)"    // Olive Green
];

export function BotanicalCursorTrail() {
  const [leaves, setLeaves] = useState([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const isEnabled = useRef(true);

  useEffect(() => {
    // Enable on non-touch devices or desktop viewports (>= 768px)
    const isTouch = 'ontouchstart' in window && window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      isEnabled.current = false;
      return;
    }

    const handleMouseMove = (e) => {
      if (!isEnabled.current) return;

      const now = Date.now();
      const dist = Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y);

      // Infrequent trigger: require 40px movement & 80ms spacing
      if (dist > 40 && now - lastTime.current > 80) {
        lastPos.current = { x: e.clientX, y: e.clientY };
        lastTime.current = now;

        const id = now + Math.random();
        const size = Math.floor(Math.random() * 5) + 10; // 10px to 15px
        const offsetX = (Math.random() - 0.5) * 12;
        const offsetY = (Math.random() - 0.5) * 6;
        const startRotation = Math.random() * 360;
        const endRotation = startRotation + (Math.random() > 0.5 ? 60 : -60);
        const color = GREEN_LEAF_COLORS[Math.floor(Math.random() * GREEN_LEAF_COLORS.length)];
        const path = LEAF_SVG_SHAPES[Math.floor(Math.random() * LEAF_SVG_SHAPES.length)];
        const duration = 0.8 + Math.random() * 0.35; // 800ms to 1150ms
        const fallDistance = 35 + Math.random() * 25; // 35px to 60px downward fall

        const newLeaf = {
          id,
          x: e.clientX + offsetX,
          y: e.clientY + offsetY,
          size,
          startRotation,
          endRotation,
          color,
          path,
          duration,
          fallDistance
        };

        // Sparse buffer: keep up to 4 falling leaves max
        setLeaves((prev) => [...prev.slice(-3), newLeaf]);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isEnabled.current) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {leaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            initial={{
              opacity: 0.9,
              scale: 1,
              x: leaf.x,
              y: leaf.y,
              rotate: leaf.startRotation,
            }}
            animate={{
              opacity: 0,
              scale: 0.4,
              y: leaf.y + leaf.fallDistance,
              x: leaf.x + (Math.random() - 0.5) * 20,
              rotate: leaf.endRotation,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: leaf.duration,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            onAnimationComplete={() => {
              setLeaves((prev) => prev.filter((item) => item.id !== leaf.id));
            }}
            aria-hidden="true"
            className="absolute top-0 left-0 pointer-events-none"
            style={{ width: leaf.size, height: leaf.size }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full filter drop-shadow-sm"
              fill={leaf.color}
              stroke="none"
            >
              <path d={leaf.path} />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
