import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import { Loader2 } from "lucide-react";
import { getGalleryItems } from "../api";
import { toast } from "sonner";
const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery \u2014 Yogini Planters" },
      { name: "description", content: "Before and after transformations of homes, offices and balconies." }
    ]
  }),
  component: Gallery
});
function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getGalleryItems()
      .then((data) => {
        if (active) setItems(data.galleryItems);
      })
      .catch((err) => toast.error(err.message || "Failed to load gallery"))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-primary/80">Gallery</p>
        <h1 className="mt-2 font-display text-5xl text-primary md:text-6xl">Green spaces gallery</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Homes, offices, balconies and gardens refreshed through thoughtful plant styling.</p>

        {loading ? (
          <div className="mt-14 flex h-64 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-7 w-7 animate-spin" />
            Loading gallery...
          </div>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((i) => {
              const image = i.image || i.after || i.before;
              return <figure key={i._id || i.id} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={image} alt={i.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <figcaption className="p-6">
                <p className="text-xs font-medium uppercase tracking-widest text-primary/70">{i.category}</p>
                <p className="mt-2 font-display text-2xl">{i.title}</p>
              </figcaption>
            </figure>;
            })}
            {items.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
                No gallery transformations have been added yet.
              </div>
            )}
          </div>
        )}
      </section>
    </SiteLayout>;
}
export {
  Route
};
