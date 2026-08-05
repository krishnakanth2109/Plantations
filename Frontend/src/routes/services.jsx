import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import { PlantCanvas } from "../components/site/PlantCanvas";
import { LoadingCircle } from "../components/ui/LoadingCircle";
import { getServices } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Loader2,
  Building2,
  ShieldCheck,
  Lightbulb,
  Palette,
  LayoutGrid,
  Sun,
  Layers,
  Trees,
  Ruler,
  Droplets,
  HeartPulse,
  Sprout,
  CalendarCheck,
  Scissors,
  Flower2,
  Wind,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import { serviceChapters } from "./index";

const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Yogini Planters" },
      {
        name: "description",
        content:
          "Professional plant decoration, landscaping, green installations, and maintenance services for homes, offices, commercial spaces, and institutions.",
      },
      {
        property: "og:title",
        content: "Bespoke Plant Styling & Maintenance Services — Yogini Planters",
      },
    ],
  }),
  component: ServicesPage,
});

const serviceHighlightsFallback = {
  "indoor-plant-styling": [
    "Personalized Microclimate Matching",
    "Designer Planter Curation",
    "Turnkey On-Site Installation",
    "Zero-Mess Setup Guarantee",
  ],
  "balcony-makeovers": [
    "Weather-Hardy Plant Selection",
    "Custom Outdoor Flooring & Seating",
    "Vertical Green Wall Systems",
    "Pollution & Shade Resistance",
  ],
  "balcony-makeover": [
    "Weather-Hardy Plant Selection",
    "Custom Outdoor Flooring & Seating",
    "Vertical Green Wall Systems",
    "Pollution & Shade Resistance",
  ],
  landscaping: [
    "Masterplan Landscape Architecture",
    "Hardscape & Softscape Integration",
    "Automated Drip Irrigation",
    "Villas & Commercial Estates",
  ],
  "plant-wellness": [
    "Plant Doctor Health Diagnostics",
    "Organic Soil & Nutrition Boosting",
    "Botanical Pest Management",
    "Scheduled Maintenance Visits",
  ],
  fertilizing: [
    "Organic Soil & Bio-Nutrients",
    "Micro-Element Drenching",
    "Seasonal Feeding Schedule",
    "Soil Aeration & Root Care",
  ],
};

const featureIconMap = {
  "Personalized Microclimate Matching": Lightbulb,
  "Designer Planter Curation": Palette,
  "Turnkey On-Site Installation": Home,
  "Zero-Mess Setup Guarantee": ShieldCheck,
  "Weather-Hardy Plant Selection": Sun,
  "Custom Outdoor Flooring & Seating": LayoutGrid,
  "Vertical Green Wall Systems": Layers,
  "Pollution & Shade Resistance": Wind,
  "Masterplan Landscape Architecture": Trees,
  "Hardscape & Softscape Integration": Ruler,
  "Automated Drip Irrigation": Droplets,
  "Villas & Commercial Estates": Building2,
  "Plant Doctor Health Diagnostics": HeartPulse,
  "Organic Soil & Nutrition Boosting": Sprout,
  "Botanical Pest Management": ShieldCheck,
  "Scheduled Maintenance Visits": CalendarCheck,
  "Organic Soil & Bio-Nutrients": Sprout,
  "Micro-Element Drenching": Droplets,
  "Seasonal Feeding Schedule": CalendarCheck,
  "Soil Aeration & Root Care": HeartPulse,
};

function getFeatureIcon(featureText, index) {
  if (featureIconMap[featureText]) {
    return featureIconMap[featureText];
  }
  const text = (featureText || "").toLowerCase();
  if (text.includes("light") || text.includes("microclimate") || text.includes("sun")) return Lightbulb;
  if (text.includes("design") || text.includes("decor") || text.includes("curation") || text.includes("style")) return Palette;
  if (text.includes("install") || text.includes("setup") || text.includes("site") || text.includes("home")) return Home;
  if (text.includes("guarantee") || text.includes("shield") || text.includes("pest") || text.includes("quality")) return ShieldCheck;
  if (text.includes("floor") || text.includes("layout") || text.includes("space") || text.includes("grid")) return LayoutGrid;
  if (text.includes("wall") || text.includes("vertical") || text.includes("layer")) return Layers;
  if (text.includes("weather") || text.includes("outdoor") || text.includes("air") || text.includes("wind")) return Wind;
  if (text.includes("garden") || text.includes("tree") || text.includes("landscape") || text.includes("park")) return Trees;
  if (text.includes("plan") || text.includes("ruler") || text.includes("architecture") || text.includes("measure")) return Ruler;
  if (text.includes("water") || text.includes("drip") || text.includes("irrigation") || text.includes("nutrition")) return Droplets;
  if (text.includes("building") || text.includes("commercial") || text.includes("villa") || text.includes("estate")) return Building2;
  if (text.includes("health") || text.includes("doctor") || text.includes("wellness") || text.includes("pulse")) return HeartPulse;
  if (text.includes("soil") || text.includes("sprout") || text.includes("grow") || text.includes("organic")) return Sprout;
  if (text.includes("visit") || text.includes("schedule") || text.includes("calendar") || text.includes("care")) return CalendarCheck;

  const slotFallback = [Lightbulb, Palette, Home, ShieldCheck];
  return slotFallback[index % slotFallback.length] || Sparkles;
}

function toFor(service) {
  const known = {
    "indoor-plant-styling": "/services/indoor",
    "balcony-makeovers": "/services/balcony",
    "balcony-makeover": "/services/balcony",
    "moss-arts-terrariums": "/services/moss-arts-terrariums",
    "plant-wellness": "/services/wellness",
    fertilizing: "/services/fertilizing",
  };
  if (known[service.slug]) return known[service.slug];
  const slug = (service.slug || "").toLowerCase();
  const title = (service.title || "").toLowerCase();
  if (slug.includes("balcony") || title.includes("balcony")) return "/services/balcony";
  if (slug.includes("indoor") || title.includes("indoor")) return "/services/indoor";
  if (slug.includes("moss") || title.includes("moss") || slug.includes("terrarium") || title.includes("terrarium")) return "/services/moss-arts-terrariums";
  if (slug.includes("fertiliz") || title.includes("fertiliz")) return "/services/fertilizing";
  if (slug.includes("wellness") || title.includes("wellness")) return "/services/wellness";
  return "/contact";
}

const featureContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09, // 90ms delay between feature cards
    },
  },
};

const featureItemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getServices()
      .then((data) => {
        if (active && data.services) {
          const fetchedServices = data.services.filter(s => s.slug !== 'landscaping');
          
          const newServices = [
            {
              _id: 'moss-arts-terrariums',
              title: "Moss Arts & Terrariums",
              slug: "moss-arts-terrariums",
              category: "Decor & Installations",
              description: "Discover handcrafted moss art installations and beautifully designed terrariums that bring timeless natural beauty into your indoor spaces. Whether you're looking for artistic green wall décor or miniature living ecosystems, we create elegant botanical pieces tailored to homes, offices, cafés, hotels, and commercial interiors.",
              priceNote: "Pricing depends on the design, size, materials, and customization requirements.",
              sections: [
                {
                  title: "Moss Arts",
                  description: "Our custom moss art installations transform plain walls into stunning botanical masterpieces using preserved natural moss. Designed to enhance interiors with texture, greenery, and a calming biophilic atmosphere, moss art offers a maintenance-free solution for modern spaces.",
                  features: ["Custom Moss Wall Designs", "Preserved Natural Moss", "Residential & Commercial Installations", "Low Maintenance & Long Lasting"]
                },
                {
                  title: "Terrariums",
                  description: "Our handcrafted terrariums are miniature living landscapes created inside premium glass containers. Perfect for homes, offices, cafés, gifting, and workspaces, each terrarium is carefully designed using high-quality plants and decorative natural elements.",
                  features: ["Open & Closed Terrariums", "Premium Glass Containers", "Miniature Landscape Designs", "Custom Gifting Options"]
                }
              ]
            }
          ];

          fetchedServices.splice(2, 0, ...newServices);
          setServices(fetchedServices);
        }
      })
      .catch((error) => toast.error(error.message))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const activeService = services[selectedIndex] || services[0];

  return (
    <SiteLayout>
      {/* Hero Header Section */}
      <section className="relative w-full border-b border-border/30 pt-16 pb-12 sm:pt-24 sm:pb-16 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" /> Interactive 3D Showcase
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.12]"
          >
            Bespoke Botanical <br className="hidden sm:inline" />
            <span className="text-primary">Services & Styling</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 max-w-3xl mx-auto text-base sm:text-xl text-muted-foreground leading-relaxed font-normal"
          >
            Explore our architectural plant styling, balcony transformations, masterplan landscaping, and specialized plant doctor care.
          </motion.p>
        </div>
      </section>

      {/* Main 3D Hero Services Section */}
      <section className="relative w-full py-12 lg:py-24 bg-background overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 sm:px-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
              <LoadingCircle size="lg" label="Loading 3D experience & services..." />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>No services currently available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start relative">
              {/* LEFT COLUMN: 3D Plant Model Canvas */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-5 relative w-full flex flex-col items-center lg:sticky lg:top-32"
              >
                {/* Subtle soft ambient glow behind model */}
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl -z-10 transform scale-75 pointer-events-none" />

                {/* 3D Canvas with angle rotation sync */}
                <PlantCanvas selectedIndex={selectedIndex} />

                {/* Model Legend */}
                <div className="mt-2 text-center pointer-events-none select-none">
                  <span className="text-[11px] font-mono tracking-widest text-muted-foreground/70 uppercase">
                    3D Botanical Specimen • Realtime Render
                  </span>
                </div>
              </motion.div>

              {/* RIGHT COLUMN: Service Selector & Content */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
                {/* Service Tabs Navigation (Apple/Tesla sliding pill selector) */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-wrap gap-2 sm:gap-2.5 pb-3 border-b border-border/40"
                >
                  {services.map((s, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <button
                        key={s._id || s.slug || idx}
                        onClick={() => setSelectedIndex(idx)}
                        className="relative px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200"
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="activeTabHighlight"
                            className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/25"
                            transition={{ type: "spring", stiffness: 450, damping: 35 }}
                          />
                        )}
                        <span
                          className={`relative z-10 transition-colors duration-200 ${
                            isSelected
                              ? "text-primary-foreground font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {s.title}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>

                {/* Active Service Content Display */}
                {activeService && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeService._id || activeService.slug || selectedIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="space-y-6"
                    >
                      {/* Meta Header */}
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold tracking-widest text-primary uppercase">
                          0{selectedIndex + 1} / 0{services.length}
                        </span>
                        <div className="h-[1px] w-12 bg-primary/30" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {activeService.category || "Service Offering"}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
                        {activeService.title}
                      </h2>

                      {activeService.sections ? (
                        <div className="space-y-8">
                          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                            {activeService.description}
                          </p>
                          {activeService.sections.map((section, idx) => (
                            <div key={idx} className="space-y-5">
                              {idx > 0 && <div className="w-full h-px bg-border/40 my-2" />}
                              <h3 className="font-display text-2xl font-semibold text-foreground">{section.title}</h3>
                              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                                {section.description}
                              </p>
                              <motion.div
                                variants={featureContainerVariants}
                                initial="hidden"
                                animate="show"
                                className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-3"
                              >
                                {section.features.map((h, hIdx) => {
                                  const IconComp = getFeatureIcon(h, hIdx);
                                  return (
                                    <motion.div
                                      key={h}
                                      variants={featureItemVariants}
                                      className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/40 text-sm font-medium text-foreground"
                                    >
                                      <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <IconComp className="h-4 w-4" />
                                      </div>
                                      <span className="text-xs sm:text-sm">{h}</span>
                                    </motion.div>
                                  );
                                })}
                              </motion.div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          {/* Description */}
                          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                            {activeService.description}
                          </p>

                          {/* Highlights Feature Grid with Stagger Animation */}
                          <motion.div
                            variants={featureContainerVariants}
                            initial="hidden"
                            animate="show"
                            className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3"
                          >
                            {(
                              activeService.features && activeService.features.length > 0
                                ? activeService.features.slice(0, 4)
                                : serviceHighlightsFallback[activeService.slug] || [
                                    "Custom Aesthetic Design",
                                    "Professional Installation",
                                    "Ongoing Maintenance Support",
                                    "Eco-Friendly Solutions",
                                  ]
                            ).map((h, hIdx) => {
                              const IconComp = getFeatureIcon(h, hIdx);
                              return (
                                <motion.div
                                  key={h}
                                  variants={featureItemVariants}
                                  className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/40 text-sm font-medium text-foreground"
                                >
                                  <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <IconComp className="h-4 w-4" />
                                  </div>
                                  <span className="text-xs sm:text-sm">{h}</span>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        </>
                      )}

                      {/* Pricing / Assessment Note Animated Entry */}
                      {activeService.priceNote && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.45 }}
                          className="p-4 rounded-2xl bg-primary/5 border border-primary/15 flex items-start gap-3"
                        >
                          <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                            <span className="font-semibold text-primary">Price Note: </span>
                            {activeService.priceNote}
                          </p>
                        </motion.div>
                      )}

                      {/* CTA Button */}
                      <div className="pt-2 flex flex-wrap items-center gap-4">
                        <Link
                          to={toFor(activeService)}
                          className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] group"
                        >
                          <span>Explore {activeService.title}</span>
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                        </Link>
                        <Link
                          to="/contact"
                          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-4 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-muted"
                        >
                          <span>Book Consultation</span>
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modern Minimal Process Section */}
      <section className="bg-muted/20 py-20 sm:py-28 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-3">
              The Experience
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Designed For Perfection
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: "1. Spatial Light Audit",
                desc: "We measure natural light exposure, humidity, and airflow before curating suitable plant species.",
              },
              {
                icon: Palette,
                title: "2. Artisan Curation",
                desc: "Select hand-crafted terracotta, ceramic, or modern fiberglass planters matching your interior aesthetics.",
              },
              {
                icon: HeartPulse,
                title: "3. Doctor Maintenance",
                desc: "Ongoing organic nutrition, pest management, and regular visits by our plant wellness team.",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-8 rounded-[28px] bg-card border border-border/50 shadow-sm space-y-4"
                >
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
          <section className="bg-muted/20 py-24 sm:py-36 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
              Our Craft
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold tracking-tight text-primary">
              Specialized Services
            </h2>
            <p className="mt-4 text-base sm:text-xl text-muted-foreground leading-relaxed">
              Explore our decoration, landscaping, and maintenance offerings tailored for residences, corporate offices, and commercial venues.
            </p>
          </div>

          <div className="space-y-24 sm:space-y-36">
            {serviceChapters.map((story, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={story.id}
                  className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 lg:gap-20`}
                >
                  {/* Image Hero */}
                  <div className="w-full lg:w-1/2">
                    <div className="group relative aspect-[16/11] overflow-hidden rounded-[36px] border border-border/40 shadow-xl bg-card">
                      {story.img.endsWith('.mp4') ? (
                        <video
                          src={story.img}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <img
                          src={story.img}
                          alt={story.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute top-6 left-6 bg-black/40 border border-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                        {story.tag}
                      </div>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-md">{story.chapter}</span>
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                      {story.title}
                    </h3>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      {story.desc}
                    </p>

                    <div className="space-y-3 pt-2">
                      {story.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-semibold text-foreground">
                          <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <Link
                        to={story.to}
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline group"
                      >
                        <span>Explore {story.title}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </section>

    </SiteLayout>
  );
}

export { Route };
