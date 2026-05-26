import React from "react";
import { createFileRoute } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import indoor from "../assets/indoor.jpg";
import balcony from "../assets/balcony.jpg";
import landscape from "../assets/landscape.jpg";
import wellness from "../assets/wellness.jpg";
import about from "../assets/about.jpg";
import hero from "../assets/hero.jpg";
const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery \u2014 Yogini Planters" },
      { name: "description", content: "Before and after transformations of homes, offices and balconies." }
    ]
  }),
  component: Gallery
});
const items = [
  { img: hero, t: "Sunlit Living Room", c: "Indoor Styling" },
  { img: balcony, t: "Cozy Balcony Retreat", c: "Balcony Makeover" },
  { img: indoor, t: "Modern Office Plants", c: "Commercial" },
  { img: landscape, t: "Villa Front Lawn", c: "Landscaping" },
  { img: wellness, t: "Plant Recovery", c: "Wellness" },
  { img: about, t: "Curated Pot Display", c: "Styling" }
];
function Gallery() {
  return <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-primary/80">Gallery</p>
        <h1 className="mt-2 font-display text-5xl text-primary md:text-6xl">Before & after transformations</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Ordinary spaces transformed into refreshing green environments through thoughtful plant styling.</p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i, idx) => <figure key={idx} className="group overflow-hidden rounded-2xl border border-border bg-card">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={i.img} alt={i.t} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <figcaption className="p-5">
                <p className="text-xs font-medium uppercase tracking-widest text-primary/70">{i.c}</p>
                <p className="mt-1 font-display text-lg">{i.t}</p>
              </figcaption>
            </figure>)}
        </div>
      </section>
    </SiteLayout>;
}
export {
  Route
};
