import React from "react";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";

export function CinematicLuxuryLoader({
  label = "Architecting Living Microclimates",
  size = "md",
  className = "",
}) {
  const isLarge = size === "lg";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col items-center justify-center text-center p-8 sm:p-12 ${
        isLarge ? "min-h-[380px] sm:min-h-[460px] w-full" : "py-10 px-6"
      } ${className}`}
    >
      {/* Soft Ambient Radial Atmosphere Glow */}
      <div className="absolute inset-0 max-w-md mx-auto my-auto h-64 w-64 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/20 via-primary/10 to-transparent blur-3xl animate-pulse pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center max-w-lg space-y-6">
        {/* Subtle Botanical Monogram Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: [0.75, 1, 0.75], scale: [0.95, 1.03, 0.95] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-black/40 border border-white/10 shadow-2xl backdrop-blur-2xl p-1"
        >
          <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse pointer-events-none" />
          <img src={logo} alt="Yogini Planters" className="h-full w-full rounded-full object-cover opacity-90 drop-shadow-md" />
        </motion.div>

        {/* Studio Tag */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-[0.28em] uppercase text-primary/80">
            Botanical Architecture Studio
          </span>
        </motion.div>

        {/* Brand Name Reveal */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-primary to-emerald-200 drop-shadow-sm"
        >
          YOGINI PLANTERS
        </motion.h2>

        {/* Minimal Expand Accent Line */}
        <motion.div
          initial={{ width: "0px", opacity: 0 }}
          animate={{ width: "64px", opacity: 0.6 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeInOut" }}
          className="h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"
        />

        {/* Philosophy Line / Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0.65, 0.95, 0.65], y: 0 }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="text-xs sm:text-sm font-serif italic text-white/80 tracking-wide font-normal max-w-xs sm:max-w-sm"
        >
          "{label}"
        </motion.p>
      </div>
    </motion.div>
  );
}

export const BotanicalGrowthLoader = CinematicLuxuryLoader;

export function LoadingCircle({
  size = "md",
  label = "Architecting Living Microclimates",
  className = "",
}) {
  return (
    <CinematicLuxuryLoader
      size={size}
      label={label}
      className={className}
    />
  );
}
