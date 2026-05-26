import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import indoor from "../assets/indoor.jpg";
import balcony from "../assets/balcony.jpg";
import landscape from "../assets/landscape.jpg";
import wellness from "../assets/wellness.jpg";
import { getServices } from "../api";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services - Yogini Planters" },
      { name: "description", content: "Indoor plant styling, balcony makeovers, landscaping, plant wellness, fertilizing, and maintenance services." },
      { property: "og:title", content: "Our Services - Yogini Planters" },
    ],
  }),
  component: Services,
});

const fallbackImages = {
  "indoor-plant-styling": indoor,
  "balcony-makeovers": balcony,
  landscaping: landscape,
  "plant-wellness": wellness,
};

function imageFor(service) {
  return service.imageUrl || fallbackImages[service.slug] || indoor;
}

function toFor(service) {
  const known = {
    "indoor-plant-styling": "/services/indoor",
    "balcony-makeovers": "/services/balcony",
    landscaping: "/services/landscaping",
    "plant-wellness": "/services/wellness",
  };
  return known[service.slug] || "/dashboard/book";
}

function Services() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getServices()
      .then((data) => {
        if (active) setList(data.services);
      })
      .catch((error) => toast.error(error.message))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-primary/80">Services</p>
        <h1 className="mt-2 font-display text-5xl text-primary md:text-6xl">Complete plant solutions</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{loading ? "Loading services..." : "From thoughtful styling to long-term wellness - choose what your space needs."}</p>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <Link key={s._id || s.slug} to={toFor(s)} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={imageFor(s)} alt={s.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">View <ArrowRight className="h-3.5 w-3.5" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

export { Route };
