import React, { useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import indoor from "../assets/indoor.jpg";
import { motion } from "framer-motion";
import {
  Leaf,
  CheckCircle2,
  Thermometer,
  Sun,
  Wind,
  Layout,
  Sofa,
  BedDouble,
  Utensils,
  Bath,
  Laptop,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  HeartPulse
} from "lucide-react";
const Route = createFileRoute("/services/indoor")({
  head: () => ({
    meta: [
      { title: "Indoor Plant Styling — Yogini Planters" },
      { name: "description", content: "Bespoke indoor plant styling curated for spatial light footprint, AC airflow, furniture layout, and biophilic wellness." },
      { property: "og:image", content: indoor }
    ]
  }),
  component: IndoorStylingPage
});

function IndoorStylingPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => { });
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.1 }
    );
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const approachFactors = [
    { icon: Thermometer, title: "Thermal Microclimate", desc: "Analyzing AC airflow & room temperature swings" },
    { icon: Sun, title: "Light Footprint Mapping", desc: "Evaluating direct, indirect & ambient LUX levels" },
    { icon: Wind, title: "Air Circulation", desc: "Checking ventilation & natural draft passages" },
    { icon: Layout, title: "Spatial Geometry", desc: "Harmonizing plant heights with architectural lines" },
    { icon: Sofa, title: "Interior Upholstery", desc: "Complementing furniture textures & fabric tones" },
    { icon: Sparkles, title: "Pottery Curation", desc: "Pairing specimens with handcrafted ceramic planters" },
  ];

  return (
    <SiteLayout>
      {/* HERO SECTION — CINEMATIC BIOPHILIC INTRO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop

            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-110 origin-center"
            style={{ objectPosition: "70% 50%" }}
          >
            <source src="https://res.cloudinary.com/dn27v5rhi/video/upload/v1785519777/indoor_styling_vzxmpt.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/35 md:from-black/90 md:via-black/55 md:to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="max-w-3xl"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
              }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest backdrop-blur-md mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Biophilic Interior Architecture
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 25 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
              }}
              className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white mb-6 leading-[1.12]"
            >
              Transform Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-primary to-amber-200">Indoor Sanctuary</span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
              }}
              className="text-base sm:text-xl text-white/85 leading-relaxed mb-10 max-w-2xl font-normal"
            >
              Every interior possesses a unique natural rhythm. We pair spatial light footprints, ambient humidity, and furniture geometry with living botanicals to create peaceful, air-purifying indoor environments.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
              }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => navigate("/contact")}
                className="group/btn inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-xs sm:text-sm font-bold text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-300 hover:bg-primary/90 hover:scale-105 active:scale-98"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MANIFESTO SECTION — SELL THE FEELING */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-[#F9F6F2] py-20 sm:py-32 border-b border-border/40"
      >
        <div className="mx-auto max-w-5xl px-6 sm:px-12 text-center space-y-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
            Design Philosophy
          </span>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
            "Beautiful spaces aren't created by adding plants. They're created by placing the right living specimen in the right light footprint."
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-normal">
            Your home deserves more than superficial decoration. It deserves living foliage that purifies the air, lowers mental fatigue, and restores natural harmony to modern architecture.
          </p>
        </div>
      </motion.section>

      {/* WHAT WE CRAFT — EDITORIAL MAGAZINE SPREAD */}
      <section className="bg-background py-20 sm:py-32 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left Image Frame */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] border border-border/40 shadow-2xl bg-muted group">
                <img src={indoor} alt="Indoor styling" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-md text-white">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1 block">Bespoke Curation</span>
                  <h4 className="font-display text-xl font-bold">Artisan Planter & Specimen Pairing</h4>
                </div>
              </div>
            </div>

            {/* Right Story Pillars */}
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
                What We Provide
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
                End-to-End Interior Styling Excellence
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                From luxury living rooms to corporate executive suites, our interior plant stylists handle every step of your spatial transformation with precision.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  { icon: Sun, title: "Spatial Light Mapping & Microclimate Audit", desc: "Analyzing natural LUX levels, artificial lighting, and AC air currents." },
                  { icon: Sparkles, title: "Artisan Planters & Pottery Pairing", desc: "Matching foliage with handcrafted ceramic, terracotta, and metallic planters." },
                  { icon: Wind, title: "Air-Purifying Botanical Selection", desc: "Curating NASA-backed species that filter VOCs and boost indoor oxygen." },
                  { icon: ShieldCheck, title: "Zero-Mess On-Site Installation", desc: "White-glove placement, soil conditioning, and immediate styling setup." }
                ].map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={idx} className="p-5 rounded-2xl bg-card border border-border/50 shadow-sm space-y-1">
                      <div className="flex items-center gap-2.5 font-display text-lg font-bold text-foreground">
                        <IconComponent className="h-4.5 w-4.5 text-primary shrink-0" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground pl-7">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SCIENTIFIC APPROACH VISUALIZER */}
      <section className="bg-muted/20 py-20 sm:py-32 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
              Our Methodology
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Environmental Analysis & Precision
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              Plant selection is never arbitrary. We evaluate six environmental variables before recommending a single leaf.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {approachFactors.map((factor, idx) => {
              const IconComp = factor.icon;
              return (
                <div key={idx} className="group rounded-[28px] border border-border/60 bg-card p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{factor.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{factor.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ROOM-BY-ROOM CASE STUDY JOURNEY */}
      <section className="bg-background py-20 sm:py-32 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
              Room-by-Room Curation
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold tracking-tight text-primary">
              Tailored Micro-Environments
            </h2>
            <p className="mt-4 text-base sm:text-xl text-muted-foreground leading-relaxed">
              Every room serves a different purpose and possesses a distinct indoor climate. Explore how we tailor botanical styling across your home.
            </p>
          </div>

          <div className="space-y-16 sm:space-y-24">
            {/* Chapter 01: Living Room */}
            <div className="group rounded-[36px] border border-border/60 bg-card p-8 sm:p-12 shadow-md hover:shadow-2xl transition-all duration-500">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div className="w-full lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <Sofa className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Chapter I</span>
                  </div>
                  <h3 className="font-display text-3xl font-bold text-foreground mb-3">The Living Room</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Focal statement plants designed to anchor lounge furniture, harmonize with natural window light, and create an impressive social atmosphere.
                  </p>
                </div>
                <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Sofa, text: "Sofa & Lounge Layout Harmony" },
                    { icon: Sun, text: "Natural Window Light Focus" },
                    { icon: Leaf, text: "Statement Fiddle Leaf & Monstera" },
                    { icon: Wind, text: "Low-VOC Air Filtration" }
                  ].map((b, i) => {
                    const BIcon = b.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/40 text-sm font-semibold text-foreground">
                        <BIcon className="h-4 w-4 text-primary shrink-0" />
                        <span>{b.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Chapter 02: Bedroom */}
            <div className="group rounded-[36px] border border-border/60 bg-card p-8 sm:p-12 shadow-md hover:shadow-2xl transition-all duration-500">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div className="w-full lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                      <BedDouble className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Chapter II</span>
                  </div>
                  <h3 className="font-display text-3xl font-bold text-foreground mb-3">The Bedroom Sanctuary</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Calm, low-maintenance oxygen-releasing foliage selected to purify night-time air and promote deep, restorative sleep.
                  </p>
                </div>
                <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: HeartPulse, text: "Night Oxygen Release (Snake Plant, Pothos)" },
                    { icon: Sparkles, text: "Restorative Calming Aesthetic" },
                    { icon: ShieldCheck, text: "Low-Maintenance & Drought Hardy" },
                    { icon: Layout, text: "Soft Ceramic Pot Styling" }
                  ].map((b, i) => {
                    const BIcon = b.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/40 text-sm font-semibold text-foreground">
                        <BIcon className="h-4 w-4 text-indigo-500 shrink-0" />
                        <span>{b.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Chapter 03: Executive Workspace */}
            <div className="group rounded-[36px] border border-border/60 bg-card p-8 sm:p-12 shadow-md hover:shadow-2xl transition-all duration-500">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div className="w-full lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <Laptop className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Chapter III</span>
                  </div>
                  <h3 className="font-display text-3xl font-bold text-foreground mb-3">Workspace & Executive Office</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Compact desktop and bookshelf botanicals engineered to reduce mental fatigue, absorb electromagnetic radiation, and elevate focus.
                  </p>
                </div>
                <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Laptop, text: "Desk & Bookshelf Scale Curation" },
                    { icon: Sparkles, text: "Mental Fatigue & Stress Reduction" },
                    { icon: Wind, text: "Low-Light & AC Tolerance" },
                    { icon: Layout, text: "Clean Geometric Planters" }
                  ].map((b, i) => {
                    const BIcon = b.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/40 text-sm font-semibold text-foreground">
                        <BIcon className="h-4 w-4 text-blue-500 shrink-0" />
                        <span>{b.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AIR-PURIFYING & WELLNESS FEATURE — DRAMATIC FULL-WIDTH BANNER */}
      <section className="bg-primary text-primary-foreground py-20 sm:py-32 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
                <HeartPulse className="h-3.5 w-3.5 text-amber-300" /> NASA-Backed Air Filtration
              </div>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                Breathe Cleaner, Natural Air Every Single Day
              </h2>
              <p className="text-base sm:text-xl text-primary-foreground/85 leading-relaxed font-normal">
                Beyond pure aesthetics, our indoor styling selections actively target harmful VOCs, formaldehyde, and airborne dust particles to create a healthier home environment.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md">
                <div className="font-display text-4xl font-bold text-amber-300">87%</div>
                <div className="text-xs font-semibold text-white mt-1">Airborne Toxin Filtered</div>
              </div>

              <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md">
                <div className="font-display text-4xl font-bold text-amber-300">24/7</div>
                <div className="text-xs font-semibold text-white mt-1">Oxygen Refresh Cycle</div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </SiteLayout>
  );
}

export { Route };
