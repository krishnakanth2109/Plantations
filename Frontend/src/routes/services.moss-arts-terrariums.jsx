import React, { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import { motion, AnimatePresence } from "framer-motion";
import mossArtsImg from "../assets/Moss Arts.jpg";
import terrariumImg from "../assets/Terrarium.jpeg";
import {
  Sparkles,
  Leaf,
  Layers,
  ArrowRight,
  ShieldCheck,
  Palette,
  Box,
  Gift
} from "lucide-react";

const Route = createFileRoute("/services/moss-arts-terrariums")({
  head: () => ({
    meta: [
      { title: "Moss Arts & Terrariums — Yogini Planters" },
      { name: "description", content: "Handcrafted moss art installations and beautifully designed terrariums for indoor spaces." },
    ]
  }),
  component: MossArtsTerrariumsPage
});

const tabData = {
  moss: {
    title: "Moss Arts",
    image: mossArtsImg,
    description: "Our custom moss art installations transform plain walls into stunning botanical masterpieces using preserved natural moss. Designed to enhance interiors with texture, greenery, and a calming biophilic atmosphere, moss art offers a maintenance-free solution for modern spaces.",
    features: [
      { text: "Custom Moss Wall Designs", icon: Palette },
      { text: "Preserved Natural Moss", icon: Leaf },
      { text: "Residential & Commercial Installations", icon: Layers },
      { text: "Low Maintenance & Long Lasting", icon: ShieldCheck }
    ],
    priceNote: "Pricing depends on the design, size, materials, and customization requirements."
  },
  terrariums: {
    title: "Terrariums",
    image: terrariumImg,
    description: "Our handcrafted terrariums are miniature living landscapes created inside premium glass containers. Perfect for homes, offices, cafés, gifting, and workspaces, each terrarium is carefully designed using high-quality plants and decorative natural elements.",
    features: [
      { text: "Open & Closed Terrariums", icon: Box },
      { text: "Premium Glass Containers", icon: Sparkles },
      { text: "Miniature Landscape Designs", icon: Leaf },
      { text: "Custom Gifting Options", icon: Gift }
    ],
    priceNote: "Pricing depends on the design, size, materials, and customization requirements."
  }
};

function MossArtsTerrariumsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("moss");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activeData = tabData[activeTab];

  return (
    <SiteLayout>
      {/* HEADER SECTION */}
      <section className="relative pt-32 pb-12 lg:pt-48 lg:pb-20 bg-background border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-6"
          >
            <Leaf className="h-3.5 w-3.5" /> Decor & Installations
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.12]"
          >
            Moss Arts & <br className="hidden sm:inline" />
            <span className="text-primary">Terrariums</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-normal"
          >
            Discover handcrafted moss art installations and beautifully designed terrariums that bring timeless natural beauty into your indoor spaces.
          </motion.p>

          {/* PREMIUM SEGMENTED CONTROL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12 inline-flex items-center p-1.5 rounded-full bg-muted/40 border border-border/60 shadow-sm backdrop-blur-md"
          >
            {Object.entries(tabData).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-colors duration-300 ${
                  activeTab === key ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {activeTab === key && (
                  <motion.div
                    layoutId="activeTabHighlight"
                    className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/25 z-0"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{data.title}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SHOWCASE SECTION */}
      <section className="bg-background py-16 sm:py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* IMAGE SIDE */}
            <div className="relative w-full aspect-[4/5] rounded-[36px] overflow-hidden bg-muted/30 border border-border/50 shadow-xl group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeTab}
                  src={activeData.image}
                  alt={activeData.title}
                  initial={{ opacity: 0, scale: 1.05, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>

            {/* CONTENT SIDE */}
            <div className="w-full flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                      {activeData.title}
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      {activeData.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeData.features.map((feature, idx) => {
                      const IconComp = feature.icon;
                      return (
                        <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/40 text-sm font-semibold text-foreground transition-colors hover:bg-muted/50">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <IconComp className="h-5 w-5" />
                          </div>
                          <span>{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-5 rounded-2xl bg-primary/5 border border-primary/15 flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/85 leading-relaxed">
                      <span className="font-semibold text-primary">Price Note: </span>
                      {activeData.priceNote}
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => navigate("/contact")}
                      className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] group"
                    >
                      <span>Enquire About {activeData.title}</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

    </SiteLayout>
  );
}

export { Route };
