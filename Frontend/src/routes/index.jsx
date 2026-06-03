import React from "react";
import { createFileRoute, Link } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";

// CORRECTED IMPORT PATH: Goes up one folder to find the video in the src directory
import logoVideo from "../logo_video_123.mp4";

import hero from "../assets/hero.jpg";
import indoor from "../assets/indoor.jpg";
import balcony from "../assets/balcony.jpg";
import landscape from "../assets/landscape.jpg";
import wellness from "../assets/wellness.jpg";
import { Leaf, Sparkles, ShieldCheck, HeartHandshake, ArrowRight, Star } from "lucide-react";

import { useEffect, useState } from "react";
import { getCms } from "../api";

const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yogini Planters — Indoor Plant Styling, Balcony Makeovers & Wellness" },
      { name: "description", content: "Personalized indoor plant styling, balcony makeovers, landscaping and professional plant maintenance for modern homes, offices and commercial spaces." },
      { property: "og:title", content: "Yogini Planters — Bringing Nature Into Everyday Living" },
      { property: "og:description", content: "Plant styling, balcony makeovers, landscaping, wellness & maintenance." },
      { property: "og:image", content: hero }
    ]
  }),
  component: Index
});

const services = [
  { title: "Indoor Plant Styling", to: "/services/indoor", img: indoor, desc: "Elegant, personalized indoor styling planned for your light, AC, furniture and lifestyle." },
  { title: "Balcony Makeovers", to: "/services/balcony", img: balcony, desc: "Transform balconies into peaceful, green lifestyle spaces — pollution-resistant and beautiful." },
  { title: "Landscaping", to: "/services/landscaping", img: landscape, desc: "Custom landscape design for villas, offices and commercial outdoor spaces." },
  { title: "Plant Wellness", to: "/services/wellness", img: wellness, desc: "Diagnose, treat and revive — keep every plant healthy, fresh and thriving." }
];

function Index() {
  const [cms, setCms] = useState({
    heroTitle: "Bringing Nature Into Everyday Living",
    heroSubtitle: "Indoor plant styling, balcony makeovers, landscaping, and professional plant wellness services — designed to create elegant, healthy green spaces.",
    bannerActive: false,
    bannerText: ""
  });

  useEffect(() => {
    getCms()
      .then((data) => {
        if (data.cms) {
          setCms(data.cms);
          if (data.cms.metaTitle) {
            document.title = data.cms.metaTitle;
          }
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc && data.cms.metaDescription) {
            metaDesc.setAttribute("content", data.cms.metaDescription);
          }
        }
      })
      .catch((err) => console.error("Error loading CMS settings on homepage:", err));
  }, []);

  return (
    <SiteLayout>
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

      {/* HERO — RESPONSIVE LAYOUT */}
      {/* Mobile: Flex Column with White bg | Desktop: Fullscreen Block with Dark bg */}
      <section className="relative w-full overflow-hidden bg-background md:bg-[#050505] flex flex-col md:block md:min-h-[100svh]">

        {/* Video Container */}
        <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-full md:absolute md:inset-0 z-0 shrink-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={logoVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Gradient Overlay */}
          {/* Mobile: Fades to white at the bottom | Desktop: Full dark overlay for text readability */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/20 to-transparent md:bg-gradient-to-b md:from-black/60 md:via-black/40 md:to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-1 items-center md:absolute md:inset-0 md:pointer-events-none">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-0 md:pointer-events-auto">
            <div className="max-w-2xl">
              
              {/* Tag / Badge */}
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-widest text-primary backdrop-blur md:border-white/20 md:bg-white/10 md:text-white">
                <Leaf className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Indoor Plant Décor & Styling
              </span>
              
              {/* Main Heading (Orange on Mobile, White on Desktop) */}
              <h1 className="mt-4 sm:mt-6 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-tight text-primary md:text-white drop-shadow-none md:drop-shadow-lg">
                {cms.heroTitle}
              </h1>
              
              {/* Subtitle (Dark Gray on Mobile, White on Desktop) */}
              <p className="mt-3 sm:mt-6 max-w-xl text-sm sm:text-lg leading-relaxed text-foreground/80 md:text-white/85 drop-shadow-none md:drop-shadow">
                {cms.heroSubtitle}
              </p>
              
              {/* Call to Action Buttons */}
              <div className="mt-6 sm:mt-9 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 sm:px-7 sm:py-3.5 text-xs sm:text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                >
                  Book a Consultation <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/50 px-5 py-3 sm:px-7 sm:py-3.5 text-xs sm:text-sm font-medium text-primary backdrop-blur hover:bg-secondary md:border-white/30 md:bg-white/10 md:text-white md:hover:bg-white/20 transition"
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* PROMISE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {[
            { icon: Sparkles, title: "Personalized", desc: "Plants chosen for your light, space, lifestyle." },
            { icon: ShieldCheck, title: "Wellness-First", desc: "Air-purifying, low-maintenance, long-lasting." },
            { icon: HeartHandshake, title: "Full Support", desc: "Styling, installation & ongoing care." },
            { icon: Leaf, title: "Sustainable", desc: "Healthy plants, thoughtful design choices." }
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-5 sm:p-7 transition hover:shadow-lg hover:shadow-primary/5">
              <f.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              <h3 className="mt-3 sm:mt-4 font-display text-base sm:text-xl text-foreground">{f.title}</h3>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-secondary/40 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-medium uppercase tracking-widest text-primary/80">What we do</p>
              <h2 className="mt-2 font-display text-2xl sm:text-4xl text-primary md:text-5xl">Complete Plant Styling Solutions</h2>
            </div>
            <Link to="/services" className="hidden text-sm font-medium text-primary hover:underline md:inline shrink-0">All services →</Link>
          </div>
          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link key={s.title} to={s.to} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={s.img} alt={s.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="font-display text-lg sm:text-xl text-foreground">{s.title}</h3>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <span className="mt-3 sm:mt-4 inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-primary">Learn more <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" /></span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Link to="/services" className="text-sm font-medium text-primary hover:underline">All services →</Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20">
        <p className="text-center text-xs sm:text-sm font-medium uppercase tracking-widest text-primary/80">Our Process</p>
        <h2 className="mt-2 text-center font-display text-2xl sm:text-4xl text-primary">From consultation to thriving green space</h2>
        <div className="mt-8 sm:mt-14 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {[
            { n: "01", t: "Consultation", d: "Understand your space, needs, and lifestyle." },
            { n: "02", t: "Assessment", d: "Analyze light, layout, AC and conditions." },
            { n: "03", t: "Planning", d: "Customized styling or care plan." },
            { n: "04", t: "Installation", d: "Setup, styling, professional care visit." },
            { n: "05", t: "Ongoing Care", d: "Continuous monitoring & wellness." }
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <span className="font-display text-2xl sm:text-3xl text-accent">{s.n}</span>
              <h3 className="mt-2 sm:mt-3 font-display text-base sm:text-lg">{s.t}</h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-leaf-pattern py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center font-display text-2xl sm:text-4xl text-primary">What our customers say</h2>
          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[
              { n: "Priya R.", t: "Yogini Planters completely transformed our balcony into a peaceful green space." },
              { n: "Karan V.", t: "The maintenance support is professional and very helpful for our indoor plants." },
              { n: "Café Mocha", t: "Their plant styling ideas added life and elegance to our interiors." }
            ].map((r) => (
              <div key={r.n} className="rounded-2xl border border-border bg-card/90 p-5 sm:p-7 backdrop-blur">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" />)}
                </div>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-foreground/85">"{r.t}"</p>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-primary">— {r.n}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20">
        <div className="rounded-3xl bg-primary px-6 py-10 text-center text-primary-foreground sm:px-8 sm:py-14 md:px-16 md:py-20">
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl">Let's create your green space</h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-sm sm:text-base text-primary-foreground/80">
            Book a consultation today and let us bring peace, beauty, and wellness into your home or workspace.
          </p>
          <Link
            to="/contact"
            className="mt-6 sm:mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            Get in touch <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </section>

    </SiteLayout>
  );
}

export { Route };