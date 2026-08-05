import React from "react";
import { createFileRoute, useNavigate } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import { LoadingCircle } from "../components/ui/LoadingCircle";
import { ShoppingBag, Loader2, Sparkles, ArrowRight, X } from "lucide-react";
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
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [activeImageIdx, setActiveImageIdx] = React.useState(0);
  const navigate = useNavigate();

  const openProduct = (product) => {
    setSelectedProduct(product);
    setActiveImageIdx(0);
  };

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
                  onClick={() => openProduct(product)}
                >
                  {/* Large Hero Image */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[40px] bg-secondary/30 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.05)] transition-shadow duration-700 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)]">
                    {(product.images && product.images.length > 0) ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-1000 ease-[0.25,0.1,0.25,1] group-hover:scale-105"
                      />
                    ) : product.image ? (
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
                      Botanical Specimen
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

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedProduct(null)}>
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-background shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-foreground backdrop-blur-md transition-colors hover:bg-black/20 sm:top-6 sm:right-6">
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col md:flex-row">
              {/* Image Gallery */}
              <div className="w-full md:w-1/2 bg-secondary/20 p-6 sm:p-10 flex flex-col">
                <div className="aspect-[4/5] w-full overflow-hidden rounded-[24px] mb-4 shadow-sm bg-background/50 flex items-center justify-center">
                  {(selectedProduct.images && selectedProduct.images.length > 0) ? (
                    <img src={selectedProduct.images[activeImageIdx]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  ) : selectedProduct.image ? (
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="h-16 w-16 text-muted-foreground/20" />
                  )}
                </div>
                {/* Thumbnails */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedProduct.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setActiveImageIdx(idx)}
                        className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 cursor-pointer transition-all ${activeImageIdx === idx ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                         <img src={img} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Details */}
              <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                <span className="inline-block rounded-full border border-border/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground w-fit mb-5">
                  Botanical Specimen
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-foreground mb-4">
                  {selectedProduct.name}
                </h2>
                <div className="text-2xl font-light tracking-wide text-primary mb-8">
                  ₹{selectedProduct.price}
                </div>
                
                <div className="space-y-4 mb-10">
                  <div className="flex items-center justify-between py-3 border-b border-border/50 text-sm">
                    <span className="text-muted-foreground">Availability</span>
                    <span className="font-medium text-foreground">{selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border/50 text-sm">
                    <span className="text-muted-foreground">Unit Size</span>
                    <span className="font-medium text-foreground capitalize">{selectedProduct.unit || 'pcs'}</span>
                  </div>
                </div>

                <button 
                  onClick={() => { setSelectedProduct(null); navigate("/contact"); }} 
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold tracking-wide text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Inquire Now <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}

export { Route };
