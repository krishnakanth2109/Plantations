import React, { useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import wellness from "../assets/wellness.jpg";
import {
  Sparkles,
  CheckCircle2,
  Sun,
  Wind,
  ShieldCheck,
  ArrowRight,
  HeartPulse,
  Stethoscope,
  Sprout,
  Droplets,
  CalendarCheck,
  Bug
} from "lucide-react";

const Route = createFileRoute("/services/wellness")({
  head: () => ({
    meta: [
      { title: "Plant Wellness & Health Care — Yogini Planters" },
      { name: "description", content: "Professional plant doctor diagnostics, yellow leaf revival, organic soil nutrition, and pest recovery care." },
      { property: "og:image", content: wellness }
    ]
  }),
  component: PlantWellnessPage
});

function PlantWellnessPage() {
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

  const diagnosticFactors = [
    { icon: Stethoscope, title: "Doctor Health Diagnostics", desc: "Evaluating foliage discoloration, leaf drop, and root vitality" },
    { icon: Sprout, title: "Organic Soil Enrichment", desc: "Formulating bio-organic nutrients & micro-element feeds" },
    { icon: Bug, title: "Organic Pest Eradication", desc: "Safely eliminating mealybugs, mites, and fungal spores" },
    { icon: Droplets, title: "Root Moisture & Aeration", desc: "Checking sub-surface soil compaction & drainage" },
    { icon: Sun, title: "Light Footprint Re-alignment", desc: "Adjusting plant positioning for optimum photosynthesis" },
    { icon: CalendarCheck, title: "Scheduled Care Visits", desc: "Routine maintenance inspections by senior plant doctors" },
  ];

  return (
    <SiteLayout>
      {/* HERO SECTION — CINEMATIC BOTANICAL WELLNESS INTRO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <video ref={videoRef} src="https://res.cloudinary.com/dn27v5rhi/video/upload/v1785519786/plant_wellness_rsmz5u.mp4" autoPlay loop playsInline className="w-full h-full object-cover scale-105 opacity-55 animate-in fade-in duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest backdrop-blur-md mb-6">
              <HeartPulse className="h-3.5 w-3.5 text-amber-400" /> Botanical Health & Doctor Care
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white mb-6 leading-[1.12]">
              Revive & Protect Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-primary to-amber-200">Botanical Sanctuary</span>
            </h1>
            <p className="text-base sm:text-xl text-white/85 leading-relaxed mb-10 max-w-2xl font-normal">
              Plants don't struggle of old age — they suffer from microclimate stress, soil deficiencies, and hidden pests. Our plant doctors bring diagnostic science to keep every leaf thriving.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/contact")}
                className="inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-300 hover:bg-primary/90 hover:scale-105"
              >
                <span>Book Doctor Visit</span>
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
            Wellness Philosophy
          </span>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
            "Plants don't die of old age. They struggle due to improper lighting, microclimate stress, and hidden soil deficiencies."
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-normal">
            We provide comprehensive diagnostic assessments, organic soil feeding, pest eradication, and seasonal pruning to restore vibrant health to indoor and outdoor greenery.
          </p>
        </div>
      </section>

      {/* WHAT WE CRAFT — EDITORIAL SPREAD */}
      <section className="bg-background py-20 sm:py-32 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left Image Frame */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] border border-border/40 shadow-2xl bg-muted group">
                <img src={wellness} alt="Plant Wellness" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-md text-white">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1 block">Plant Diagnostics</span>
                  <h4 className="font-display text-xl font-bold">Organic Nutrition & Health Recovery</h4>
                </div>
              </div>
            </div>

            {/* Right Story Pillars */}
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
                What We Provide
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
                Complete Botanical Doctor Services
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Whether maintaining thriving indoor collections or diagnosing yellowing leaves, our plant doctors deliver complete biological care.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  { icon: Stethoscope, title: "On-Site Doctor Health Assessment", desc: "Evaluating soil moisture, root rot, leaf yellowing, and nutrient deficiencies." },
                  { icon: Bug, title: "Organic Pest & Disease Eradication", desc: "Non-toxic neem & bio-extract sprays targeting mealybugs, scale, and fungal spores." },
                  { icon: Sprout, title: "Soil Enrichment & Bio-Fertilizing", desc: "Custom organic compost, micro-element drenching, and root aeration." },
                  { icon: CalendarCheck, title: "Seasonal Pruning & Growth Styling", desc: "Trimming dead foliage, shaping canopy growth, and repotting overgrown roots." }
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

      {/* DIAGNOSTIC METHODOLOGY VISUALIZER */}
      <section className="bg-muted/20 py-20 sm:py-32 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
              Biological Science
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Six Pillars of Plant Diagnostics
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              Our plant doctors analyze root condition, soil pH, and pest presence before treating any plant.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {diagnosticFactors.map((factor, idx) => {
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

      {/* CARE CASE STUDY CHAPTERS */}
      <section className="bg-background py-20 sm:py-32 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
              Care Programs
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold tracking-tight text-primary">
              Wellness & Recovery Archetypes
            </h2>
            <p className="mt-4 text-base sm:text-xl text-muted-foreground leading-relaxed">
              Explore how our plant doctors support both preventative care and intensive plant revival.
            </p>
          </div>

          <div className="space-y-16 sm:space-y-24">
            {/* Chapter I: Preventative Care */}
            <div className="group rounded-[36px] border border-border/60 bg-card p-8 sm:p-12 shadow-md hover:shadow-2xl transition-all duration-500">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div className="w-full lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <CalendarCheck className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Chapter I</span>
                  </div>
                  <h3 className="font-display text-3xl font-bold text-foreground mb-3">Routine Preventative Care</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Scheduled care visits ensuring ongoing leaf health, pest prevention, and organic nutrient top-ups.
                  </p>
                </div>
                <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: CalendarCheck, text: "Scheduled Plant Doctor Visits" },
                    { icon: Sprout, text: "Organic Soil Top-Up & Feeding" },
                    { icon: Sparkles, text: "Leaf Dusting & Shine Application" },
                    { icon: ShieldCheck, text: "Seasonal Pruning & Shape Control" }
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

            {/* Chapter II: Intensive Revival */}
            <div className="group rounded-[36px] border border-border/60 bg-card p-8 sm:p-12 shadow-md hover:shadow-2xl transition-all duration-500">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div className="w-full lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <HeartPulse className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Chapter II</span>
                  </div>
                  <h3 className="font-display text-3xl font-bold text-foreground mb-3">Intensive Plant Revival</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Emergency care for struggling, yellowing, or pest-infested specimens — bringing your plants back to vibrant life.
                  </p>
                </div>
                <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: HeartPulse, text: "Root Rot & Waterlogging Remediation" },
                    { icon: Bug, text: "Organic Neem Pest Eradication" },
                    { icon: Sprout, text: "Soil pH & Mineral Re-balancing" },
                    { icon: Droplets, text: "Repotting Overgrown Plant Roots" }
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

      {/* ORGANIC GUARANTEE FEATURE — DRAMATIC BANNER */}
      <section className="bg-primary text-primary-foreground py-20 sm:py-32 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
                <Sprout className="h-3.5 w-3.5 text-amber-300" /> 100% Organic Soil Feeding
              </div>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                Chemical-Free Biological Nutrition
              </h2>
              <p className="text-base sm:text-xl text-primary-foreground/85 leading-relaxed font-normal">
                We strictly use pet-safe, 100% bio-organic composts and botanical pest sprays, ensuring your home air remains pure and chemical-free.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md">
                <div className="font-display text-4xl font-bold text-amber-300">100%</div>
                <div className="text-xs font-semibold text-white mt-1">Pet-Safe Organic Formula</div>
              </div>

              <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md">
                <div className="font-display text-4xl font-bold text-amber-300">99%</div>
                <div className="text-xs font-semibold text-white mt-1">Plant Revival Success</div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </SiteLayout>
  );
}

export { Route };
