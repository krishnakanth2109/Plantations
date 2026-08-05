import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import { BotanicalCursorTrail } from "../ui/BotanicalCursorTrail";
import { BotanicalGrowthLoader } from "../ui/LoadingCircle";

function SiteLayout({ children }) {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("yp_initial_preloaded");
    }
    return false;
  });

  useEffect(() => {
    if (!loading) return;

    // ~1.4s luxury cinematic brand intro sequence on first session visit
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("yp_initial_preloaded", "true");
    }, 1400);

    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      {/* Full-Screen Initial Botanical Growth Preloader Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="botanical-preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F9F6F2] dark:bg-[#050505] backdrop-blur-3xl select-none"
          >
            <BotanicalGrowthLoader
              size="lg"
              label="Cultivating Beautiful Spaces..."
            />
          </motion.div>
        )}
      </AnimatePresence>

      <BotanicalCursorTrail />
      <Header />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}

export { SiteLayout };
