import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";

import hero from "../assets/hero.jpg";
import indoor from "../assets/indoor.jpg";
import balcony from "../assets/balcony.jpg";
import landscape from "../assets/landscape.jpg";
import wellness from "../assets/wellness.jpg";
import fertilizing from "../assets/fertilizing.jpg";
import mossArtsThumbnail from "../assets/Moss arts & Terrariums.png";
// Video URL (Cloudinary)
const logoVideo = "https://res.cloudinary.com/dn27v5rhi/video/upload/v1785519587/logo_video_123_lsbuvb.mp4";
import {
  Leaf,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Star,
  ChevronDown,
  CheckCircle2,
  Quote,
  MapPin,
  Building2,
  Stethoscope,
  Droplets,
  Sun,
  Ruler,
  Compass,
  Award,
  HeartPulse
} from "lucide-react";

import { getCms } from "../api";

const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yogini Planters — Architectural Plant Styling & Landscape Design" },
      { name: "description", content: "Bespoke indoor plant styling, balcony makeovers, architectural landscaping, and turnkey plant doctor maintenance for luxury residences, corporate offices, and commercial venues." },
      { property: "og:title", content: "Yogini Planters — Bringing Nature Into Everyday Living" },
      { property: "og:description", content: "Bespoke plant styling, balcony makeovers, landscaping & professional plant care." },
      { property: "og:image", content: hero }
    ]
  }),
  component: Index
});

const serviceChapters = [
  {
    id: "01",
    chapter: "Chapter I",
    title: "Indoor Plant Styling",
    tag: "Interior Biophilic Architecture",
    to: "/services/indoor",
    img: indoor,
    desc: "We analyze spatial light distribution, AC airflow, furniture geometry, and human interaction to curate plant specimens that feel naturally integrated into your interior decor.",
    highlights: ["Light Mapping & Microclimate Audit", "Artisan Planter Curation", "Zero-Mess On-Site Setup"]
  },
  {
    id: "02",
    chapter: "Chapter II",
    title: "Balcony & Terrace Makeovers",
    tag: "Outdoor Sanctuary",
    to: "/services/balcony",
    img: balcony,
    desc: "Transform exposed urban balconies into lush, private green retreats. Complete with weather-hardy foliage, vertical greenery walls, and wooden deck accents.",
    highlights: ["Pollution & Wind Resistance", "Vertical Living Wall Systems", "Decking & Outdoor Seating Integration"]
  },
  {
    id: "03",
    chapter: "Chapter III",
    title: "Moss Arts & Terrariums",
    tag: "Decor & Installations",
    to: "/services/moss-arts-terrariums",
    img: mossArtsThumbnail,
    desc: "Discover handcrafted moss art installations and beautifully designed terrariums that bring timeless natural beauty into your indoor spaces.",
    highlights: ["Custom Moss Walls", "Miniature Ecosystems", "Maintenance-Free Options"]
  },
  {
    id: "04",
    chapter: "Chapter IV",
    title: "Plant Health & Doctor Care",
    tag: "Turnkey Maintenance",
    to: "/services/wellness",
    img: wellness,
    desc: "Ongoing care visits by expert plant doctors. We diagnose soil nutrition, manage pests organically, trim seasonal growth, and guarantee long-term botanical vitality.",
    highlights: ["Doctor Health Diagnostics", "Organic Soil Nutrition & Feeding", "Scheduled Care Visits"]
  },
  {
    id: "05",
    chapter: "Chapter V",
    title: "Organic Fertilizing",
    tag: "Soil & Root Nutrition",
    to: "/services/fertilizing",
    img: fertilizing,
    desc: "Customized soil nutrition plans and organic bio-nutrients to restore vitality, enhance growth, and ensure the long-term health of your plants.",
    highlights: ["Organic Soil & Bio-Nutrients", "Micro-Element Drenching", "Seasonal Feeding Schedule"]
  }
];

function Index() {
  const [cms, setCms] = useState({
    heroTitle: "Bringing Nature Into Everyday Living",
    heroSubtitle: "Indoor plant styling, balcony makeovers, landscaping, and professional plant wellness services — designed to create elegant, healthy green spaces.",
    bannerActive: false,
    bannerText: ""
  });

  // useEffect(() => {
  //   getCms()
  //     .then((data) => {
  //       if (data.cms) {
  //         setCms(data.cms);
  //         if (data.cms.metaTitle) {
  //           document.title = data.cms.metaTitle;
  //         }
  //         const metaDesc = document.querySelector('meta[name="description"]');
  //         if (metaDesc && data.cms.metaDescription) {
  //           metaDesc.setAttribute("content", data.cms.metaDescription);
  //         }
  //       }
  //     })
  //     .catch((err) => console.error("Error loading CMS settings on homepage:", err));
  // }, []);


  return (
    <SiteLayout>
      {/* CMS Marquee Banner */}
      {cms.bannerActive && cms.bannerText && (
        <div className="relative w-full overflow-hidden bg-primary text-primary-foreground py-2.5 text-xs sm:text-sm font-semibold tracking-wide border-b border-white/10 z-30">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-custom {
              display: inline-flex;
              white-space: nowrap;
              animation: marquee 25s linear infinite;
            }
            .animate-marquee-custom:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="animate-marquee-custom">
            <span className="px-10">{cms.bannerText}</span>
            <span className="px-10">{cms.bannerText}</span>
            <span className="px-10">{cms.bannerText}</span>
            <span className="px-10">{cms.bannerText}</span>
            <span className="px-10">{cms.bannerText}</span>
            <span className="px-10">{cms.bannerText}</span>
          </div>
        </div>
      )}

      {/* ACT I: ATMOSPHERIC CINEMATIC HERO */}
      <section className="relative w-full overflow-hidden bg-[#050505] flex items-center min-h-[78vh] sm:min-h-[90vh] md:min-h-[100svh]">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 shrink-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-100 object-[50%_35%] md:scale-110 md:object-[70%_50%]"
          >
            <source src={logoVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/85 via-black/65 to-black/90 md:bg-gradient-to-r md:from-black/90 md:via-black/55 md:to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-12 md:px-16 lg:px-24 py-12 sm:py-24 md:py-32 flex items-center">
          <div className="w-full max-w-[660px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="mb-3.5 sm:mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 sm:px-4.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md">
                <Compass className="h-3.5 w-3.5 text-amber-400 shrink-0" /> Botanical Architecture Studio
              </span>
            </div>

            <h1 className="mb-4 sm:mb-6 font-display font-bold text-3xl sm:text-6xl lg:text-7xl leading-[1.14] sm:leading-[1.12] text-white tracking-tight drop-shadow-md">
              Bringing Nature Into <br className="hidden sm:inline" /> Everyday Living
            </h1>

            <p className="mb-8 sm:mb-10 max-w-[540px] text-sm sm:text-lg leading-relaxed text-white/90 drop-shadow-sm font-normal">
              {cms.heroSubtitle || "Indoor plant styling, balcony makeovers, landscaping, and professional plant wellness services — designed to create elegant, healthy green spaces."}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto justify-center inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-300 hover:bg-primary/90 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
              >
                Book a Consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="w-full sm:w-auto justify-center inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Explore Portfolio
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 hidden sm:flex flex-col items-center gap-2 pointer-events-none opacity-80">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Scroll To Discover</span>
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        </div>

        {/* Organic Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-30 pointer-events-none">
          <svg
            className="relative block w-full h-[50px] sm:h-[75px] md:h-[90px]"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              fill="#F9F6F2"
              d="M 0,20 C 180,60 360,75 540,40 C 630,22 680,45 720,78 C 760,45 810,22 900,40 C 1080,75 1260,60 1440,20 L 1440,120 L 0,120 Z"
            />
            <circle cx="720" cy="78" r="4" fill="#F28500" className="opacity-90" />
          </svg>
        </div>
      </section>

      {/* ACT II: THE MANIFESTO */}
      <section className="relative z-10 bg-[#F9F6F2] py-20 sm:py-32 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">

            {/* Left Manifesto Quote */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
                The Yogini Manifesto
              </span>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.12]">
                "We don't place plants. We architect living microclimates that soothe the senses."
              </h2>
              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed font-normal">
                Modern luxury is not defined by excess furniture. It is defined by clean oxygen, natural sunlight footprints, and living foliage harmonized with interior architecture.
              </p>
            </div>

            {/* Right Impact Metric Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-[32px] bg-white p-8 shadow-xl border border-border/40 space-y-4 transition-all duration-500 hover:shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Architectural Impact</span>
                  <Sparkles className="h-5 w-5 text-amber-500" />
                </div>
                <div className="font-display text-4xl sm:text-5xl font-bold text-foreground">500+</div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Luxury villas, executive penthouses, and corporate spaces transformed across South India.
                </p>
              </div>

              <div className="rounded-[32px] bg-white p-8 shadow-xl border border-border/40 space-y-4 transition-all duration-500 hover:shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Foliage Vitality Rate</span>
                  <HeartPulse className="h-5 w-5 text-primary" />
                </div>
                <div className="font-display text-4xl sm:text-5xl font-bold text-primary">99%</div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Sustained plant health through scientific environmental light mapping and doctor care.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ACT III: SPATIAL TRANSFORMATION CASE STUDY */}
      <section className="bg-background py-20 sm:py-32 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">

            {/* Left Case Study Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] overflow-hidden rounded-[36px] border border-border/40 shadow-2xl bg-muted group">
                <img
                  src={landscape}
                  alt="Jubilee Hills Estate Landscape"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-md text-white">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                    <MapPin className="h-3.5 w-3.5" /> Jubilee Hills Estate Villa
                  </div>
                  <h4 className="font-display text-xl font-bold">Spatial Architectural Transformation</h4>
                </div>
              </div>
            </div>

            {/* Right Case Study Details */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
                Case Study Highlight
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
                Harmonizing Architecture with Nature
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                For this 8,000 sq.ft private estate, Yogini Planters developed a biophilic microclimate integration. We paired high-ceiling indoor Monstera specimens with an automated drip terrace garden and custom terracotta pottery.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  { icon: Sparkles, text: "Acclimatized indoor foliage paired with artisan ceramic planters" },
                  { icon: Droplets, text: "Automated drip irrigation system requiring zero manual effort" },
                  { icon: HeartPulse, text: "Monthly plant doctor diagnostic visits for organic nutrition" }
                ].map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-foreground">
                      <IconComp className="h-4.5 w-4.5 text-primary shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6">
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-xs sm:text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:scale-105"
                >
                  Explore Full Portfolio <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ACT IV: THE FOUR CHAPTERS OF BOTANICAL CRAFT (SERVICES) */}
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

      {/* ACT V: THE FOUR PILLARS OF YOGINI EXCELLENCE */}
      <section className="bg-[#F9F6F2] py-24 sm:py-36 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
              Why Choose Us
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              The Yogini Standard of Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Sparkles, title: "Personalized Design", desc: "Every plant and planter is hand-selected based on lighting, airflow, and interior aesthetics." },
              { icon: ShieldCheck, title: "Wellness First", desc: "Air-purifying, pet-safe, and low-maintenance varieties chosen for long-term health." },
              { icon: HeartHandshake, title: "Turnkey Service", desc: "End-to-end handling from spatial light mapping and delivery to clean installation." },
              { icon: Leaf, title: "Lifetime Doctor Care", desc: "Ongoing diagnostic visits, organic fertilizing, and seasonal pruning by plant doctors." }
            ].map((p, idx) => (
              <div key={idx} className="group rounded-[32px] border border-border/50 bg-card p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACT VI: THE ARCHITECTURAL WORKFLOW (5-STEP PROCESS) */}
      <section className="bg-background py-24 sm:py-36 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
              Our Process
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl font-bold tracking-tight text-primary">
              From Concept to Thriving Sanctuary
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              A structured 5-step journey ensuring flawless execution and zero hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8">
            {[
              { step: "01", title: "Consultation", desc: "We discuss your aesthetic preferences, functional goals, and budget." },
              { step: "02", title: "Microclimate Audit", desc: "Evaluating sunlight angles, AC drafts, and humidity conditions." },
              { step: "03", title: "Bespoke Proposal", desc: "Curated plant & planter selection paired with layout mockups." },
              { step: "04", title: "Clean Installation", desc: "Professional on-site placement with zero mess or hassle." },
              { step: "05", title: "Routine Care", desc: "Scheduled doctor visits to maintain peak botanical health." }
            ].map((s) => (
              <div key={s.step} className="rounded-3xl border border-border/60 bg-muted/20 p-6 flex flex-col justify-between">
                <div>
                  <span className="font-display text-3xl font-bold text-primary/40">{s.step}</span>
                  <h3 className="mt-3 font-display text-lg font-bold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACT VII: EDITORIAL MAGAZINE TESTIMONIALS */}
      <section className="bg-[#F9F6F2] py-24 sm:py-36 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Quote className="mx-auto h-10 w-10 text-primary/40 mb-3" />
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Client Experiences
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya R.", location: "Jubilee Hills Villa", quote: "Yogini Planters completely transformed our balcony into a peaceful, green outdoor living room. Their plant choices have stayed lush for over a year!" },
              { name: "Karan V.", location: "Financial District Office", quote: "The maintenance support is remarkably professional. Our indoor office plants always look fresh, and the doctor visits handle all feeding effortlessly." },
              { name: "Café Mocha", location: "Banjara Hills", quote: "Their plant styling ideas added incredible warmth and luxury to our dining interiors. Customers constantly compliment the greenery!" }
            ].map((t, idx) => (
              <div key={idx} className="rounded-[32px] border border-border/60 bg-card p-8 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex text-amber-400 gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-base leading-relaxed text-foreground/90 font-normal italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-border/40">
                  <div className="font-display font-bold text-foreground text-base">{t.name}</div>
                  <div className="text-xs text-muted-foreground font-medium">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </SiteLayout>
  );
}

export { Route };