import React from "react";
import { createFileRoute } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import about from "../assets/about.jpg";
const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About \u2014 Yogini Planters" },
      { name: "description", content: "Yogini Planters is a plant wellness and green styling brand focused on creating beautiful, healthy, long-lasting green spaces." },
      { property: "og:title", content: "About Yogini Planters" },
      { property: "og:image", content: about }
    ]
  }),
  component: About
});
function About() {
  return <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-primary/80">About us</p>
            <h1 className="mt-2 font-display text-5xl text-primary md:text-6xl">A plant wellness & green styling brand</h1>
            <div className="mt-6 space-y-5 text-foreground/85 leading-relaxed">
              <p>Yogini Planters specializes in creating beautiful, healthy, and long-lasting green spaces. We focus on indoor plant styling, balcony transformations, landscaping, and professional plant maintenance — tailored to each client's space and lifestyle.</p>
              <p>Our goal is to make plant care simple, elegant, and sustainable while helping customers enjoy the wellness benefits of nature in everyday spaces.</p>
              <p>We provide personalized plant solutions for homes, offices, cafés, restaurants, villas, and commercial spaces — with a focus on aesthetics, plant health, and long-term maintenance.</p>
            </div>
          </div>
          <img src={about} alt="Curated planter collection" loading="lazy" className="aspect-[4/5] w-full rounded-3xl object-cover shadow-xl" />
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-4xl text-primary">Why choose Yogini Planters</h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
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
  ].map((p) => <li key={p} className="rounded-2xl border border-border bg-card px-6 py-5 font-medium">{p}</li>)}
          </ul>
        </div>
      </section>
    </SiteLayout>;
}
export {
  Route
};
