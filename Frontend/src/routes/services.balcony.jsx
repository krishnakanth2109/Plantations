import React, { useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import balcony from "../assets/balcony.jpg";
import {
  Sparkles,
  CheckCircle2,
  Sun,
  Wind,
  ShieldCheck,
  ArrowRight,
  Layers,
  LayoutGrid,
  Building2,
  HeartPulse,
  MapPin,
  Droplets
} from "lucide-react";
const Route = createFileRoute("/services/balcony")({
  head: () => ({
    meta: [
      { title: "Balcony & Terrace Makeovers — Yogini Planters" },
      { name: "description", content: "Transform urban balconies into peaceful, pollution-resistant green sanctuaries with vertical foliage walls and automated drip irrigation." },
      { property: "og:image", content: balcony }
    ]
  }),
  component: BalconyMakeoversPage
});

function BalconyMakeoversPage() {
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

  const balconyFactors = [
    { icon: Sun, title: "Sunlight & UV Exposure", desc: "Evaluating direct solar hours & shade angles" },
    { icon: Wind, title: "High-Altitude Wind Drafts", desc: "Selecting sturdy, wind-resilient foliage" },
    { icon: ShieldCheck, title: "Vehicle Pollution Buffer", desc: "Toxin-tolerant plants that filter traffic dust" },
    { icon: Layers, title: "Vertical Space Optimization", desc: "Maximizing wall surface area with living green walls" },
    { icon: LayoutGrid, title: "Decking & Seating Harmony", desc: "Integrating wooden tiles & outdoor furniture" },
    { icon: Droplets, title: "Automated Drip Systems", desc: "Zero-effort irrigation pipelines for busy lifestyles" },
  ];

  return (
    <SiteLayout>
      {/* HERO SECTION — CINEMATIC OUTDOOR INTRO */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#050505] min-h-[75vh] sm:min-h-0 flex items-center">
        <div className="absolute inset-0 z-0 shrink-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop

            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-100 object-[50%_35%] md:scale-110 md:object-[70%_50%]"
          >
            <source src="https://res.cloudinary.com/dn27v5rhi/video/upload/v1785519775/Balcony_Makeover_o164nb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/85 via-black/65 to-black/90 md:bg-gradient-to-r md:from-black/90 md:via-black/55 md:to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-12 lg:px-16 w-full">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[11px] sm:text-xs font-semibold uppercase tracking-widest backdrop-blur-md mb-4 sm:mb-6">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" /> Urban Sanctuary Design
            </div>
            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white mb-4 sm:mb-6 leading-[1.14] sm:leading-[1.12]">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-primary to-amber-200">Balcony Sanctuary</span>
            </h1>
            <p className="text-sm sm:text-xl text-white/90 leading-relaxed mb-8 sm:mb-10 max-w-2xl font-normal">
              Turn concrete outdoor balconies into private, pollution-resistant green havens. Engineered for high-rise wind drafts, harsh sunlight, and urban traffic dust.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/contact")}
                className="w-full sm:w-auto justify-center inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-300 hover:bg-primary/90 hover:scale-105"
              >
                <span>Book Balcony Consultation</span>
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
            Outdoor Philosophy
          </span>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
            "An urban balcony shouldn't be a storage corner. It should be your private retreat where morning coffee meets living nature."
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-normal">
            We design outdoor micro-gardens that thrive under intense sunlight, resist city pollution, and provide an instant escape from concrete surroundings.
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
                <img src={balcony} alt="Balcony Makeover" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-md text-white">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1 block">Outdoor Living</span>
                  <h4 className="font-display text-xl font-bold">Vertical Green Wall & Decking Integration</h4>
                </div>
              </div>
            </div>

            {/* Right Story Pillars */}
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
                What We Provide
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
                Turnkey Balcony Transformation
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                From high-rise apartment balconies to expansive villa terraces, we engineer green spaces that look stunning and require zero maintenance stress.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  { icon: ShieldCheck, title: "Pollution & Traffic Dust Resistance", desc: "Selecting hardy plant varieties that absorb vehicle emissions and thrive in urban heat." },
                  { icon: Layers, title: "Vertical Greenery Wall Systems", desc: "Converting blank walls into dense, living foliage carpets to maximize space." },
                  { icon: LayoutGrid, title: "Decking & Outdoor Seating Concepts", desc: "Harmonizing teak wooden tiles, ambient lighting, and planter layouts." },
                  { icon: Droplets, title: "Automated Drip Irrigation Setup", desc: "Smart timer-controlled watering lines for total peace of mind during travel." }
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

      {/* ENVIRONMENTAL ANALYSIS VISUALIZER */}
      <section className="bg-muted/20 py-20 sm:py-32 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
              Outdoor Engineering
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Designed Around Your Environment
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              We analyze six microclimate factors before building your balcony installation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {balconyFactors.map((factor, idx) => {
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

      {/* BALCONY CASE STUDY CHAPTERS */}
      <section className="bg-background py-20 sm:py-32 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
              Spatial Solutions
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold tracking-tight text-primary">
              Terrace & Balcony Archetypes
            </h2>
            <p className="mt-4 text-base sm:text-xl text-muted-foreground leading-relaxed">
              Explore how we transform various balcony dimensions and architectural layouts.
            </p>
          </div>

          <div className="space-y-16 sm:space-y-24">
            {/* Chapter I: High Rise Balcony */}
            <div className="group rounded-[36px] border border-border/60 bg-card p-8 sm:p-12 shadow-md hover:shadow-2xl transition-all duration-500">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div className="w-full lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Chapter I</span>
                  </div>
                  <h3 className="font-display text-3xl font-bold text-foreground mb-3">High-Rise Apartment Balcony</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Engineered for high-altitude wind resistance and traffic pollution defense with vertical green wall systems.
                  </p>
                </div>
                <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Wind, text: "Wind-Resilient Palms & Bougainvillea" },
                    { icon: Layers, text: "Vertical Wall Carpet Panels" },
                    { icon: LayoutGrid, text: "Railing Planter Systems" },
                    { icon: ShieldCheck, text: "Traffic Pollution Filtration" }
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

            {/* Chapter II: Villa Terrace Garden */}
            <div className="group rounded-[36px] border border-border/60 bg-card p-8 sm:p-12 shadow-md hover:shadow-2xl transition-all duration-500">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div className="w-full lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Layers className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Chapter II</span>
                  </div>
                  <h3 className="font-display text-3xl font-bold text-foreground mb-3">Spacious Villa Terrace</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Luxury outdoor living spaces combining wooden deck flooring, ambient lighting, and automated drip irrigation.
                  </p>
                </div>
                <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: LayoutGrid, text: "Teak Decking & Ambient Lighting" },
                    { icon: Droplets, text: "Automated Drip Irrigation Line" },
                    { icon: Sun, text: "Pergola & Lounge Greenery" },
                    { icon: Sparkles, text: "Seasonal Flowering Specimen" }
                  ].map((b, i) => {
                    const BIcon = b.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/40 text-sm font-semibold text-foreground">
                        <BIcon className="h-4 w-4 text-amber-500 shrink-0" />
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

      {/* POLLUTION DEFENSE FEATURE — DRAMATIC BANNER */}
      <section className="bg-primary text-primary-foreground py-20 sm:py-32 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-300" /> Urban Defense Technology
              </div>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                Pollution-Resistant Botanical Shield
              </h2>
              <p className="text-base sm:text-xl text-primary-foreground/85 leading-relaxed font-normal">
                For balconies facing traffic roads and city heat, we select hardy plant species engineered by nature to absorb particulate dust, lower ambient heat, and maintain lush green aesthetics year-round.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md">
                <div className="font-display text-4xl font-bold text-amber-300">95%</div>
                <div className="text-xs font-semibold text-white mt-1">Dust & Emission Buffer</div>
              </div>

              <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md">
                <div className="font-display text-4xl font-bold text-amber-300">100%</div>
                <div className="text-xs font-semibold text-white mt-1">Drip Irrigation Automated</div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </SiteLayout>
  );
}

export { Route };
