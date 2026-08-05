import React, { useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import fertilizing from "../assets/fertilizing.jpg";
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Sprout,
  Droplets,
  CalendarCheck,
  Leaf,
  Sun,
  FlaskConical,
  Microscope,
  Recycle,
  TreePine
} from "lucide-react";

const Route = createFileRoute("/services/fertilizing")({
  head: () => ({
    meta: [
      { title: "Organic Fertilizing & Soil Nutrition — Yogini Planters" },
      { name: "description", content: "Customized organic fertilizing plans, bio-nutrient soil enrichment, micro-element drenching, and seasonal feeding schedules for lasting plant vitality." },
      { property: "og:image", content: fertilizing }
    ]
  }),
  component: FertilizingPage
});

function FertilizingPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
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

  const nutritionPillars = [
    { icon: Sprout, title: "Organic Bio-Nutrients", desc: "100% chemical-free organic composts tailored to each plant species' nutritional needs" },
    { icon: Microscope, title: "Soil pH Analysis", desc: "Scientific testing of soil acidity and mineral balance before every feeding cycle" },
    { icon: Droplets, title: "Micro-Element Drenching", desc: "Deep root-level feeding with iron, manganese, and calcium micro-nutrients" },
    { icon: CalendarCheck, title: "Seasonal Feeding Schedule", desc: "Customized feeding calendars aligned to each plant's growth and dormancy seasons" },
    { icon: Recycle, title: "Bio-Compost Enrichment", desc: "Vermicompost and coco-peat blends to improve soil texture and moisture retention" },
    { icon: TreePine, title: "Root Aeration & Repotting", desc: "Loosening compacted soil and upgrading pot media for maximum root breathing" },
  ];

  return (
    <SiteLayout>
      {/* HERO SECTION — CINEMATIC FERTILIZING INTRO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <video ref={videoRef} src="https://res.cloudinary.com/dn27v5rhi/video/upload/v1785519779/Fertilizing_t8v86o.mp4" autoPlay loop playsInline className="w-full h-full object-cover scale-105 opacity-55 animate-in fade-in duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest backdrop-blur-md mb-6">
              <Sprout className="h-3.5 w-3.5 text-amber-400" /> Organic Soil & Plant Nutrition
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white mb-6 leading-[1.12]">
              Nourish Your Plants <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-primary to-amber-200">From Root to Leaf</span>
            </h1>
            <p className="text-base sm:text-xl text-white/85 leading-relaxed mb-10 max-w-2xl font-normal">
              Healthy plants start with healthy soil. Our organic fertilizing programs deliver precisely balanced bio-nutrients, micro-elements, and seasonal feeding schedules to unlock your plants' full growth potential.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/contact")}
                className="inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-300 hover:bg-primary/90 hover:scale-105"
              >
                <span>Book a Nutrition Consult</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO SECTION */}
      <section className="bg-[#F9F6F2] py-20 sm:py-32 border-b border-border/40">
        <div className="mx-auto max-w-5xl px-6 sm:px-12 text-center space-y-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
            Fertilizing Philosophy
          </span>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
            "Every struggling plant is a soil story waiting to be rewritten with the right nutrients."
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-normal">
            We don't just add fertilizer — we analyze soil chemistry, diagnose nutrient deficiencies, and design a complete seasonal feeding system that works in harmony with your plant's natural growth cycle.
          </p>
        </div>
      </section>

      {/* WHAT WE PROVIDE — EDITORIAL SPREAD */}
      <section className="bg-background py-20 sm:py-32 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left Image Frame */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] border border-border/40 shadow-2xl bg-muted group">
                <img src={fertilizing} alt="Organic Fertilizing" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-md text-white">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1 block">Soil Nutrition Science</span>
                  <h4 className="font-display text-xl font-bold">Bio-Organic Root & Foliage Feeding</h4>
                </div>
              </div>
            </div>

            {/* Right Story Pillars */}
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
                What We Provide
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
                Complete Plant Nutrition Programs
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                From soil testing and pH balancing to seasonal bio-nutrient feeds and micro-element drenching — we build a complete nutrition ecosystem for every plant we care for.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  { icon: FlaskConical, title: "Soil pH & Mineral Testing", desc: "Accurate analysis of soil acidity, nitrogen, phosphorus, and potassium levels before any treatment." },
                  { icon: Sprout, title: "Custom Organic Feeding Plans", desc: "Species-specific bio-nutrient formulations designed around each plant's unique growth requirements." },
                  { icon: Droplets, title: "Micro-Element Drenching", desc: "Root-level delivery of iron, calcium, magnesium, and trace minerals for deep cellular nutrition." },
                  { icon: CalendarCheck, title: "Seasonal Feeding Schedules", desc: "Growth-season and dormancy-aware feeding calendars to prevent overfeeding and nutrient burn." }
                ].map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div key={idx} className="p-5 rounded-2xl bg-card border border-border/50 shadow-sm space-y-1">
                      <div className="flex items-center gap-2.5 font-display text-lg font-bold text-foreground">
                        <IconComp className="h-4.5 w-4.5 text-primary shrink-0" />
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

      {/* SIX PILLARS OF NUTRITION */}
      <section className="bg-muted/20 py-20 sm:py-32 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
              Our Approach
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Six Pillars of Organic Plant Nutrition
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              Every feeding program we design is grounded in soil science and tailored to your plants' real needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {nutritionPillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div key={idx} className="group rounded-[28px] border border-border/60 bg-card p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEEDING PROGRAMS */}
      <section className="bg-background py-20 sm:py-32 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
              Feeding Programs
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold tracking-tight text-primary">
              Nutrition Archetypes
            </h2>
            <p className="mt-4 text-base sm:text-xl text-muted-foreground leading-relaxed">
              Structured feeding programs designed for different plant types and growth goals.
            </p>
          </div>

          <div className="space-y-16 sm:space-y-24">
            {/* Chapter I: Routine Feeding */}
            <div className="group rounded-[36px] border border-border/60 bg-card p-8 sm:p-12 shadow-md hover:shadow-2xl transition-all duration-500">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div className="w-full lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <CalendarCheck className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Chapter I</span>
                  </div>
                  <h3 className="font-display text-3xl font-bold text-foreground mb-3">Routine Seasonal Feeding</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Scheduled fertilizing visits aligned with growth seasons to consistently supply the right nutrients at the right time.
                  </p>
                </div>
                <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: CalendarCheck, text: "Monthly Feeding Visit Schedule" },
                    { icon: Sprout, text: "Organic Liquid Bio-Nutrient Feed" },
                    { icon: Leaf, text: "Foliar Spray for Leaf Nutrition" },
                    { icon: ShieldCheck, text: "Slow-Release Granule Top Dressing" }
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

            {/* Chapter II: Intensive Nutrition Recovery */}
            <div className="group rounded-[36px] border border-border/60 bg-card p-8 sm:p-12 shadow-md hover:shadow-2xl transition-all duration-500">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div className="w-full lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <FlaskConical className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Chapter II</span>
                  </div>
                  <h3 className="font-display text-3xl font-bold text-foreground mb-3">Intensive Nutrition Recovery</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Emergency soil correction for nutrient-deficient, yellowing, or stunted plants — rebuilding the foundation for vibrant regrowth.
                  </p>
                </div>
                <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Microscope, text: "Soil pH & Deficiency Testing" },
                    { icon: Droplets, text: "Deep Root Micro-Element Drench" },
                    { icon: Recycle, text: "Vermicompost Soil Amendment" },
                    { icon: Sun, text: "Potassium & Phosphorus Correction" }
                  ].map((b, i) => {
                    const BIcon = b.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/40 text-sm font-semibold text-foreground">
                        <BIcon className="h-4 w-4 text-emerald-500 shrink-0" />
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

      {/* ORGANIC GUARANTEE BANNER */}
      <section className="bg-primary text-primary-foreground py-20 sm:py-32 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
                <Sprout className="h-3.5 w-3.5 text-amber-300" /> 100% Chemical-Free
              </div>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                Pure Organic Nutrition — Safe for Pets & Families
              </h2>
              <p className="text-base sm:text-xl text-primary-foreground/85 leading-relaxed font-normal">
                Every product we use is 100% bio-organic, pet-safe, and child-friendly. No synthetic chemicals, no harmful residues — just nature feeding nature.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md">
                <div className="font-display text-4xl font-bold text-amber-300">100%</div>
                <div className="text-xs font-semibold text-white mt-1">Organic Bio-Nutrients</div>
              </div>
              <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md">
                <div className="font-display text-4xl font-bold text-amber-300">Zero</div>
                <div className="text-xs font-semibold text-white mt-1">Synthetic Chemicals Used</div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </SiteLayout>
  );
}

export { Route };
