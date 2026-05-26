import React from "react";
import { createFileRoute, Link } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import hero from "../assets/hero.jpg";
import indoor from "../assets/indoor.jpg";
import balcony from "../assets/balcony.jpg";
import landscape from "../assets/landscape.jpg";
import wellness from "../assets/wellness.jpg";
import { Leaf, Sparkles, ShieldCheck, HeartHandshake, ArrowRight, Star } from "lucide-react";
const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yogini Planters \u2014 Indoor Plant Styling, Balcony Makeovers & Wellness" },
      { name: "description", content: "Personalized indoor plant styling, balcony makeovers, landscaping and professional plant maintenance for modern homes, offices and commercial spaces." },
      { property: "og:title", content: "Yogini Planters \u2014 Bringing Nature Into Everyday Living" },
      { property: "og:description", content: "Plant styling, balcony makeovers, landscaping, wellness & maintenance." },
      { property: "og:image", content: hero }
    ]
  }),
  component: Index
});
const services = [
  { title: "Indoor Plant Styling", to: "/services/indoor", img: indoor, desc: "Elegant, personalized indoor styling planned for your light, AC, furniture and lifestyle." },
  { title: "Balcony Makeovers", to: "/services/balcony", img: balcony, desc: "Transform balconies into peaceful, green lifestyle spaces \u2014 pollution-resistant and beautiful." },
  { title: "Landscaping", to: "/services/landscaping", img: landscape, desc: "Custom landscape design for villas, offices and commercial outdoor spaces." },
  { title: "Plant Wellness", to: "/services/wellness", img: wellness, desc: "Diagnose, treat and revive \u2014 keep every plant healthy, fresh and thriving." }
];
function Index() {
  return <SiteLayout>
      {
    /* HERO */
  }
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={hero} alt="" width={1600} height={1100} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:py-40">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary backdrop-blur">
              <Leaf className="h-3.5 w-3.5" /> Indoor Plant Décor & Styling
            </span>
            <h1 className="mt-6 font-display text-5xl font-medium leading-tight text-primary md:text-6xl lg:text-7xl">
              Bringing Nature Into Everyday Living
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/80">
              Indoor plant styling, balcony makeovers, landscaping, and professional plant wellness services — designed to create elegant, healthy green spaces.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90">
                Book a Consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-7 py-3.5 text-sm font-medium text-primary backdrop-blur hover:bg-secondary">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {
    /* PROMISE */
  }
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-4">
          {[
    { icon: Sparkles, title: "Personalized", desc: "Plants chosen for your light, space, lifestyle." },
    { icon: ShieldCheck, title: "Wellness-First", desc: "Air-purifying, low-maintenance, long-lasting." },
    { icon: HeartHandshake, title: "Full Support", desc: "Styling, installation & ongoing care." },
    { icon: Leaf, title: "Sustainable", desc: "Healthy plants, thoughtful design choices." }
  ].map((f) => <div key={f.title} className="rounded-2xl border border-border bg-card p-7 transition hover:shadow-lg hover:shadow-primary/5">
              <f.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-display text-xl text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>)}
        </div>
      </section>

      {
    /* SERVICES */
  }
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-primary/80">What we do</p>
              <h2 className="mt-2 font-display text-4xl text-primary md:text-5xl">Complete Plant Styling Solutions</h2>
            </div>
            <Link to="/services" className="hidden text-sm font-medium text-primary hover:underline md:inline">All services →</Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => <Link key={s.title} to={s.to} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={s.img} alt={s.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Learn more <ArrowRight className="h-3.5 w-3.5" /></span>
                </div>
              </Link>)}
          </div>
        </div>
      </section>

      {
    /* PROCESS */
  }
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-primary/80">Our Process</p>
        <h2 className="mt-2 text-center font-display text-4xl text-primary">From consultation to thriving green space</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-5">
          {[
    { n: "01", t: "Consultation", d: "Understand your space, needs, and lifestyle." },
    { n: "02", t: "Assessment", d: "Analyze light, layout, AC and conditions." },
    { n: "03", t: "Planning", d: "Customized styling or care plan." },
    { n: "04", t: "Installation", d: "Setup, styling, professional care visit." },
    { n: "05", t: "Ongoing Care", d: "Continuous monitoring & wellness." }
  ].map((s) => <div key={s.n} className="rounded-2xl border border-border bg-card p-6">
              <span className="font-display text-3xl text-accent">{s.n}</span>
              <h3 className="mt-3 font-display text-lg">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>)}
        </div>
      </section>

      {
    /* TESTIMONIALS */
  }
      <section className="bg-leaf-pattern py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center font-display text-4xl text-primary">What our customers say</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
    { n: "Priya R.", t: "Yogini Planters completely transformed our balcony into a peaceful green space." },
    { n: "Karan V.", t: "The maintenance support is professional and very helpful for our indoor plants." },
    { n: "Caf\xE9 Mocha", t: "Their plant styling ideas added life and elegance to our interiors." }
  ].map((r) => <div key={r.n} className="rounded-2xl border border-border bg-card/90 p-7 backdrop-blur">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-4 text-base leading-relaxed text-foreground/85">"{r.t}"</p>
                <p className="mt-4 text-sm font-medium text-primary">— {r.n}</p>
              </div>)}
          </div>
        </div>
      </section>

      {
    /* CTA */
  }
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground md:px-16 md:py-20">
          <h2 className="font-display text-4xl md:text-5xl">Let's create your green space</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Book a consultation today and let us bring peace, beauty, and wellness into your home or workspace.
          </p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-accent-foreground transition hover:opacity-90">
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>;
}
export {
  Route
};
