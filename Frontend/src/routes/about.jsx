import React, { useState, useEffect } from "react";
import { createFileRoute } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import about from "../assets/about.jpg";
import { getCms } from "../api";
import logo from "../../src/assets/logo.png";

const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Yogini Planters" },
      { name: "description", content: "Yogini Planters is a plant wellness and green styling brand focused on creating beautiful, healthy, long-lasting green spaces." },
      { property: "og:title", content: "About Yogini Planters" },
      { property: "og:image", content: about }
    ]
  }),
  component: About
});

function About() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cms, setCms] = useState({
    aboutHeadline: "A plant wellness & green styling brand",
    aboutBody: "Yogini Planters specializes in creating beautiful, healthy, and long-lasting green spaces. We focus on indoor plant styling, balcony transformations, landscaping, and professional plant maintenance — tailored to each client's space and lifestyle."
  });

  useEffect(() => {
    getCms()
      .then((data) => {
        if (data.cms) {
          setCms(data.cms);
          if (data.cms.metaTitle) {
            document.title = "About — " + data.cms.metaTitle;
          }
        }
      })
      .catch((err) => console.error("Error loading CMS settings on About page:", err));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <SiteLayout>
      {/* Injecting custom keyframes for the natural plant sway */}
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes sway-reverse {
          0%, 100% { transform: rotate(3deg); }
          50% { transform: rotate(-3deg); }
        }
      `}</style>

      {/* === ANIMATED BOTANICAL HERO SECTION === */}
      <div className="home-container relative overflow-hidden bg-secondary/20 border-b border-border">
        <div className="hero-section relative flex min-h-[60vh] md:min-h-[70vh] flex-col items-center justify-center py-24 px-4">
          
          {/* Top hanging plants - Left side */}
          {/* Added gap-4/gap-8 for clean spacing and removed negative overlapping margins */}
          <div className="absolute top-0 left-0 flex w-[40%] sm:w-[35%] md:w-[30%] lg:w-[25%] max-w-[350px] gap-2 sm:gap-6 p-2 sm:p-4 pointer-events-none opacity-50 md:opacity-90 z-0">
            {/* Inner plant */}
            <div 
              className="w-1/2 drop-shadow-xl origin-top"
              style={{ animation: 'sway 7s ease-in-out infinite' }}
            >
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663705743956/YHNQNoDDkxmT9DPRPt5vNi/hanging-plant-1-KtZMDWN3hYWNbjQQqwAhQq.webp" 
                alt="Pothos hanging plant"
                className="w-full h-auto object-cover mix-blend-multiply"
              />
            </div>
            {/* Outer plant - pushed down slightly to stagger the heights naturally */}
            <div 
              className="w-1/2 drop-shadow-2xl origin-top mt-8 sm:mt-12"
              style={{ animation: 'sway-reverse 9s ease-in-out infinite' }}
            >
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663705743956/YHNQNoDDkxmT9DPRPt5vNi/hanging-plant-2-3bX6KpArU42mUR3aKDLkGf.webp" 
                alt="String of pearls hanging plant"
                className="w-full h-auto object-cover mix-blend-multiply scale-110"
              />
            </div>
          </div>

          {/* Top hanging plants - Right side */}
          {/* Added gap-4/gap-8 for clean spacing and removed negative overlapping margins */}
          <div className="absolute top-0 right-0 flex w-[40%] sm:w-[35%] md:w-[30%] lg:w-[25%] max-w-[350px] gap-2 sm:gap-6 p-2 sm:p-4 pointer-events-none opacity-50 md:opacity-90 z-0 justify-end">
            {/* Outer plant - pushed down slightly to stagger the heights naturally */}
            <div 
              className="w-1/2 drop-shadow-2xl origin-top mt-6 sm:mt-10"
              style={{ animation: 'sway-reverse 6.5s ease-in-out infinite' }}
            >
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663705743956/YHNQNoDDkxmT9DPRPt5vNi/hanging-plant-4-56HAXANzy4MWgdhZahNfBV.webp" 
                alt="Purple flowering hanging plant"
                className="w-full h-auto object-cover mix-blend-multiply scale-110"
              />
            </div>
            {/* Inner plant */}
            <div 
              className="w-1/2 drop-shadow-xl origin-top"
              style={{ animation: 'sway 8s ease-in-out infinite' }}
            >
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663705743956/YHNQNoDDkxmT9DPRPt5vNi/hanging-plant-3-Uoy43XXXvSxWKR9iM3fi3Z.webp" 
                alt="Fern hanging plant"
                className="w-full h-auto object-cover mix-blend-multiply"
              />
            </div>
          </div>

          {/* Center logo area */}
          <div className="logo-container relative z-30 mt-8 sm:mt-12 text-center max-w-3xl mx-auto px-4">
            <div className="logo-wrapper flex flex-col items-center">
              {/* Perfectly sized logo wrapper with full 360 rotation on hover */}
              <div className="logo-circle mb-4 sm:mb-6 flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full border border-primary/20 bg-background shadow-xl backdrop-blur-md transition-all duration-1000 ease-in-out hover:rotate-[360deg] hover:scale-110 overflow-hidden">
                <img 
                  src={logo} 
                  alt="Yogini Planters Logo" 
                  className="h-full w-full object-cover" 
                />
              </div>
              <p className="mb-2 sm:mb-4 text-xs sm:text-sm font-medium uppercase tracking-widest text-primary/80">
                Our Story
              </p>
              <h1 className="logo-title font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary leading-tight drop-shadow-sm">
                Yogini Planters
              </h1>
            </div>
          </div>

          {/* Decorative floating elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            <div 
              className="absolute text-2xl sm:text-4xl opacity-60 transition-transform duration-300 ease-out"
              style={{ top: '25%', left: '15%', transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) rotate(15deg)` }}
            >🍃</div>
            <div 
              className="absolute text-xl sm:text-3xl opacity-50 transition-transform duration-300 ease-out"
              style={{ top: '65%', right: '10%', transform: `translate(${mousePosition.x * -0.7}px, ${mousePosition.y * -0.7}px) rotate(-20deg)` }}
            >🍃</div>
            <div 
              className="absolute text-3xl sm:text-5xl opacity-40 transition-transform duration-300 ease-out"
              style={{ bottom: '15%', left: '25%', transform: `translate(${mousePosition.x * 1.2}px, ${mousePosition.y * -1.2}px) rotate(45deg)` }}
            >🍃</div>
          </div>
        </div>
      </div>

      {/* === ORIGINAL ABOUT CONTENT === */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 md:py-24">
        <div className="grid items-center gap-8 md:gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary leading-tight">
              {cms.aboutHeadline}
            </h2>
            <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5 text-foreground/85 leading-relaxed text-base sm:text-lg">
              <p className="whitespace-pre-wrap">{cms.aboutBody}</p>
            </div>
          </div>
          <img 
            src={about} 
            alt="Curated planter collection" 
            loading="lazy" 
            className="aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl shadow-primary/10 transition duration-500 hover:-translate-y-2" 
          />
        </div>
      </section>

      {/* === WHY CHOOSE US === */}
      <section className="bg-secondary/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center font-display text-3xl sm:text-4xl text-primary">Why choose Yogini Planters</h2>
          <ul className="mt-10 sm:mt-12 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[
              "Personalized plant solutions",
              "Professional maintenance support",
              "Plant wellness-focused approach",
              "Elegant green styling",
              "Healthy & sustainable care",
              "Customized service plans",
              "Long-term care support",
              "Modern aesthetic concepts",
              "Reliable maintenance guidance"
            ].map((p) => (
              <li key={p} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 sm:px-6 sm:py-5 font-medium text-sm sm:text-base text-foreground/90 transition hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                <span className="text-primary text-lg sm:text-xl shrink-0">✓</span> 
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}

export { Route };