import React, { useState, useEffect } from "react";
import { createFileRoute } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import about from "../assets/about.jpg";
import { getCms } from "../api";
import logo from "../../src/assets/logo.png";
import { motion } from "framer-motion";
import {
  Sprout,
  Settings2,
  HeartPulse,
  Flower2,
  Leaf,
  ClipboardCheck,
  CalendarClock,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  ChevronDown
} from "lucide-react";

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
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <SiteLayout>
      {/* Injecting independent natural sway keyframes & falling leaves for each hanging plant */}
      <style>{`
        @keyframes sway-1 {
          0%, 100% { transform: rotate(-3.5deg); }
          50% { transform: rotate(3.5deg); }
        }
        @keyframes sway-2 {
          0%, 100% { transform: rotate(2.8deg); }
          50% { transform: rotate(-4.2deg); }
        }
        @keyframes sway-3 {
          0%, 100% { transform: rotate(-4.5deg); }
          50% { transform: rotate(2.5deg); }
        }
        @keyframes sway-4 {
          0%, 100% { transform: rotate(3.2deg); }
          50% { transform: rotate(-3.8deg); }
        }
        @keyframes shimmer-sweep {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        .shimmer-effect {
          animation: shimmer-sweep 2.5s ease-in-out infinite;
        }
        @keyframes leaf-fall-1 {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          15% {
            opacity: 0.9;
            transform: translateY(35px) translateX(-16px) rotate(40deg) scale(1);
          }
          40% {
            transform: translateY(120px) translateX(20px) rotate(110deg) scale(0.95);
          }
          65% {
            transform: translateY(220px) translateX(-24px) rotate(185deg) scale(0.85);
            opacity: 0.75;
          }
          85% {
            transform: translateY(320px) translateX(16px) rotate(260deg) scale(0.7);
            opacity: 0.4;
          }
          100% {
            transform: translateY(410px) translateX(-10px) rotate(330deg) scale(0.5);
            opacity: 0;
          }
        }
        @keyframes leaf-fall-2 {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(0.75);
            opacity: 0;
          }
          20% {
            opacity: 0.85;
            transform: translateY(45px) translateX(18px) rotate(-35deg) scale(1);
          }
          50% {
            transform: translateY(150px) translateX(-22px) rotate(-125deg) scale(0.9);
          }
          75% {
            transform: translateY(260px) translateX(14px) rotate(-210deg) scale(0.75);
            opacity: 0.55;
          }
          100% {
            transform: translateY(380px) translateX(-15px) rotate(-300deg) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>

      {/* === ANIMATED BOTANICAL HERO SECTION === */}
      <div className="relative overflow-hidden bg-transparent border-b border-border/40">
        <div className="relative flex min-h-[65vh] md:min-h-[75vh] flex-col items-center justify-center py-28 px-6">

          {/* Top hanging plants - Left side (Independent sway timing & angles) */}
          <div className="absolute top-0 left-0 flex w-[42%] sm:w-[35%] md:w-[28%] lg:w-[24%] max-w-[360px] gap-3 sm:gap-6 px-2 sm:px-4 pt-0 pointer-events-none opacity-85 md:opacity-95 z-10">
            <div
              className="relative w-1/2 origin-top transition-transform duration-700 -mt-1 sm:-mt-2"
              style={{ animation: 'sway-1 7.5s ease-in-out infinite', animationDelay: '0s' }}
            >
              <img
                // src="https://d2xsxph8kpxj0f.cloudfront.net/310519663705743956/YHNQNoDDkxmT9DPRPt5vNi/hanging-plant-1-KtZMDWN3hYWNbjQQqwAhQq.webp"
                // src="https://res.cloudinary.com/dn27v5rhi/image/upload/v1785325089/ChatGPT_Image_Jul_29_2026_05_04_25_PM_o6l6kb.png"
                src="https://res.cloudinary.com/dn27v5rhi/image/upload/v1785325558/ChatGPT_Image_Jul_29_2026_05_15_49_PM_bs2bsd.png"
                alt="Pothos hanging plant"
                className="w-full h-auto object-cover mix-blend-multiply scale-120"
              />
              {/* Falling leaf from Plant 1 */}
              <div className="absolute top-[60%] left-1/3 pointer-events-none z-20">
                <div
                  className="absolute text-emerald-700/80 filter drop-shadow-sm"
                  style={{ animation: 'leaf-fall-1 10.5s ease-in-out infinite', animationDelay: '0.8s' }}
                >
                  <Leaf className="h-3.5 w-3.5 fill-emerald-600/35" />
                </div>
              </div>
            </div>

            <div
              className="relative w-1/2 origin-top mt-2 sm:mt-3 transition-transform duration-700"
              style={{ animation: 'sway-2 9.5s ease-in-out infinite', animationDelay: '0.4s' }}
            >
              <img
                // src="https://d2xsxph8kpxj0f.cloudfront.net/310519663705743956/YHNQNoDDkxmT9DPRPt5vNi/hanging-plant-2-3bX6KpArU42mUR3aKDLkGf.webp
                // src="https://res.cloudinary.com/dn27v5rhi/image/upload/v1785326055/ChatGPT_Image_Jul_29_2026_05_24_09_PM_r1umea.png"
                src="https://res.cloudinary.com/dn27v5rhi/image/upload/v1785326545/ChatGPT_Image_Jul_29_2026_05_31_43_PM_h5isfa.png"
                alt="String of pearls hanging plant"
                className="w-full h-auto object-cover mix-blend-multiply scale-170"
              />
              {/* Falling leaf from Plant 2 */}
              <div className="absolute top-[65%] left-1/2 pointer-events-none z-20">
                <div
                  className="absolute text-green-700/80 filter drop-shadow-sm"
                  style={{ animation: 'leaf-fall-2 11.5s ease-in-out infinite', animationDelay: '3.5s' }}
                >
                  <Leaf className="h-3.5 w-3.5 fill-green-600/35" />
                </div>
              </div>
            </div>
          </div>

          {/* Top hanging plants - Right side (Independent sway timing & angles) */}
          <div className="absolute top-0 right-0 flex w-[42%] sm:w-[35%] md:w-[28%] lg:w-[24%] max-w-[360px] gap-3 sm:gap-6 px-2 sm:px-4 pt-0 pointer-events-none opacity-85 md:opacity-95 z-10 justify-end">
            <div
              className="relative w-1/2 origin-top mt-2 sm:mt-3 transition-transform duration-700"
              style={{ animation: 'sway-3 6.8s ease-in-out infinite', animationDelay: '0.8s' }}
            >
              <img
                // src="https://d2xsxph8kpxj0f.cloudfront.net/310519663705743956/YHNQNoDDkxmT9DPRPt5vNi/hanging-plant-4-56HAXANzy4MWgdhZahNfBV.webp"
                // src="https://res.cloudinary.com/dn27v5rhi/image/upload/v1785325878/ChatGPT_Image_Jul_29_2026_05_21_02_PM_krqjls.png"
                src="https://res.cloudinary.com/dn27v5rhi/image/upload/v1785326811/ChatGPT_Image_Jul_29_2026_05_36_36_PM_z7vble.png"
                alt="Purple flowering hanging plant"
                className="w-full h-auto object-cover mix-blend-multiply scale-150"
              />
              {/* Falling leaf from Plant 3 */}
              <div className="absolute top-[60%] right-1/3 pointer-events-none z-20">
                <div
                  className="absolute text-purple-700/80 filter drop-shadow-sm"
                  style={{ animation: 'leaf-fall-1 10.8s ease-in-out infinite', animationDelay: '2.2s' }}
                >
                  <Leaf className="h-3.5 w-3.5 fill-purple-600/35" />
                </div>
              </div>
            </div>

            <div
              className="relative w-1/2 origin-top transition-transform duration-700 -mt-1 sm:-mt-2"
              style={{ animation: 'sway-4 8.2s ease-in-out infinite', animationDelay: '1.2s' }}
            >
              <img
                // src="https://d2xsxph8kpxj0f.cloudfront.net/310519663705743956/YHNQNoDDkxmT9DPRPt5vNi/hanging-plant-3-Uoy43XXXvSxWKR9iM3fi3Z.webp"
                src="https://res.cloudinary.com/dn27v5rhi/image/upload/v1785325355/ChatGPT_Image_Jul_29_2026_05_12_19_PM_thqqny.png"
                alt="Fern hanging plant"
                className="w-full h-auto object-cover mix-blend-multiply"
              />
              {/* Falling leaf from Plant 4 */}
              <div className="absolute top-[65%] right-1/2 pointer-events-none z-20">
                <div
                  className="absolute text-green-600/75 filter drop-shadow-sm"
                  style={{ animation: 'leaf-fall-2 12s ease-in-out infinite', animationDelay: '5s' }}
                >
                  <Leaf className="h-3.5 w-3.5 fill-green-500/30" />
                </div>
              </div>
            </div>
          </div>

          {/* Sequential Stagger Hero Entrance */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="relative z-30 mt-6 sm:mt-10 text-center max-w-3xl mx-auto px-4 flex flex-col items-center"
          >
            {/* Logo Badge */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
              }}
              className="group relative mb-6 flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center rounded-full border-2 border-primary/30 bg-background shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 hover:border-primary hover:shadow-2xl hover:shadow-primary/30 overflow-hidden p-1.5 cursor-pointer"
            >
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse pointer-events-none" />
              <div className="absolute inset-0 z-20 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 shimmer-effect pointer-events-none" />
              <img
                src={logo}
                alt="Yogini Planters Logo"
                className="h-full w-full object-cover rounded-full relative z-10 transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>

            {/* Eyebrow Label */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
              }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-4"
            >
              <Sparkles className="h-3.5 w-3.5" /> Our Story & Heritage
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 25 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
              }}
              className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-primary leading-tight drop-shadow-sm"
            >
              Yogini Planters
            </motion.h1>
          </motion.div>

          {/* Elegant Scroll Down Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 hidden sm:flex flex-col items-center gap-1.5"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Discover Our Legacy</span>
            <ChevronDown className="h-4 w-4 text-primary animate-bounce" />
          </motion.div>
        </div>
      </div>

      {/* === ABOUT CONTENT SECTION WITH FULLSCREEN STICKY SCROLL STORYTELLING === */}
      <section className="relative w-full">
        
        {/* Sticky Background Image Container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <img
            src={about}
            alt="Curated planter collection"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[30s] ease-linear hover:scale-110"
          />
          {/* Gradient Overlay for readability and cinematic effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 md:bg-gradient-to-r md:from-black/90 md:via-black/50 md:to-transparent" />
        </div>

        {/* Scrolling Content Container overlaying the sticky background */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-[50vh] md:pt-[30vh] pb-[20vh]">
          
          {/* The Content that scrolls over the image (Aligned to the left) */}
          <div className="flex flex-col gap-8 sm:gap-12 w-full md:w-[60%] lg:w-[55%]">
            
            {/* The Main Title Block (now scrolling) */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-10%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#e8c187] block mb-4">
                  Craftsmanship & Care
                </span>
                <h4 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal text-white leading-tight drop-shadow-lg mb-8 md:mb-16">
                  Living Microclimate<br />Design Studio
                </h4>
            </motion.div>

            {/* Block 1: Headline */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-10%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-12 bg-white/40 block"></span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                  About Yogini Planters
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.1] drop-shadow-lg">
                {cms.aboutHeadline}
              </h2>
            </motion.div>

            {/* Block 2+: Body Content Split into Storytelling Blocks */}
            <div className="grid gap-8 mt-4">
              {(() => {
                const rawBlocks = cms.aboutBody.split(/\n\n+/);
                const blocks = rawBlocks.length > 1
                  ? rawBlocks
                  : cms.aboutBody.split('. ').filter(Boolean).map(s => s.trim() + (s.trim().endsWith('.') ? '' : '.'));

                return blocks.map((block, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-20%" }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.1 }}
                    className="pl-6 border-l border-white/20"
                  >
                    <p className="text-white/80 leading-[1.8] text-lg sm:text-xl font-light drop-shadow-md">
                      {block}
                    </p>
                  </motion.div>
                ));
              })()}
            </div>

          </div>
        </div>
      </section>

      {/* === WHY CHOOSE US SECTION WITH STAGGERED REVEAL === */}
      <section className="bg-secondary/40 py-20 sm:py-32 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
              Our Difference
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl font-bold tracking-tight text-primary">
              Why Choose Yogini Planters
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              Uncompromising botanical quality, scientific light mapping, and white-glove plant doctor care.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.08 } }
            }}
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          >
            {[
              { text: "Personalized plant solutions", icon: Sprout, desc: "Curated specifically for your lighting & spatial layout" },
              { text: "Professional maintenance support", icon: Settings2, desc: "Scheduled doctor visits to maintain peak vitality" },
              { text: "Plant wellness-focused approach", icon: HeartPulse, desc: "Prioritizing root health & air purification" },
              { text: "Elegant green styling", icon: Flower2, desc: "Harmonizing foliage with luxury interior aesthetics" },
              { text: "Healthy & sustainable care", icon: Leaf, desc: "100% bio-organic fertilizers & pet-safe remedies" },
              { text: "Customized service plans", icon: ClipboardCheck, desc: "Flexible maintenance packages for homes & offices" },
              { text: "Long-term care support", icon: CalendarClock, desc: "Ongoing foliage observation & seasonal care" },
              { text: "Modern aesthetic concepts", icon: Lightbulb, desc: "Artisan pottery pairing & space transformation" },
              { text: "Reliable maintenance guidance", icon: ShieldCheck, desc: "Expert advice from experienced plant doctors" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
                  }}
                  className="group flex flex-col justify-between rounded-[24px] border border-border/70 bg-card p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1.5"
                >
                  <div className="space-y-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {item.text}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}

export { Route };