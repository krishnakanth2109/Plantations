import React from "react";
import { createFileRoute, useNavigate } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import { LoadingCircle } from "../components/ui/LoadingCircle";
import { ShoppingBag, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { getInventory } from "../api";

const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products & Planters — Yogini Planters" },
      { name: "description", content: "Explore our curated collection of botanical flora, artisan planters, and interior greenery." },
      { property: "og:title", content: "Botanical Catalog — Yogini Planters" },
    ]
  }),
  component: ProductsPage
});

function ProductsPage() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    getInventory()
      .then(data => {
        setItems(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <SiteLayout>
      {/* Header Banner */}
      <section className="relative w-full border-b border-border/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Curated Catalog
          </span>
          <h1 className="mt-5 font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-primary">
            Our Collection
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-base sm:text-xl text-muted-foreground leading-relaxed font-normal">
            Discover our hand-picked selection of premium plants and accessories designed to bring nature into your everyday living.
          </p>
        </div>
      </section>

      {/* Catalog Showcase Section */}
      <section className="bg-background py-16 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 text-muted-foreground">
              <LoadingCircle size="lg" label="Loading catalog collection..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10">
              {items.map((product) => (
                <div
                  key={product._id}
                  className="group flex flex-col cursor-pointer transition-all duration-700 hover:-translate-y-2"
                  onClick={() => navigate("/contact")}
                >
                  {/* Large Hero Image */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[40px] bg-secondary/30 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.05)] transition-shadow duration-700 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)]">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-1000 ease-[0.25,0.1,0.25,1] group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-10 w-10 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>

                  {/* Elegant Product Metadata */}
                  <div className="mt-8 flex flex-col items-center text-center px-4 space-y-3.5">
                    <span className="inline-block rounded-full border border-border/60 bg-transparent px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      {product.category || "Botanical Specimen"}
                    </span>
                    
                    <h3 className="font-display text-xl sm:text-2xl font-normal tracking-tight text-foreground transition-colors duration-500 group-hover:text-primary line-clamp-1">
                      {product.name}
                    </h3>
                    
                    <span className="text-[14px] font-light tracking-[0.1em] text-muted-foreground">
                      ₹{product.price}
                    </span>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  <ShoppingBag className="mx-auto h-12 w-12 text-primary/30 mb-3" />
                  <p className="text-lg font-semibold text-foreground">No products available in the catalog.</p>
                  <p className="text-sm text-muted-foreground mt-1">Please check back soon for our new collection arrival.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

export { Route };
