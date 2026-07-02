import React from "react";
import { createFileRoute, useNavigate } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import { ShoppingBag, Loader2, MessageCircle } from "lucide-react";
import { getInventory } from "../api";

const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products - Yogini Planters" },
      { name: "description", content: "Browse our exclusive collection of plants, pots, and care tools." }
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
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <SiteLayout>
      <div className="bg-background pt-24 pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h1 className="font-display text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">Our Collection</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our hand-picked selection of premium plants and accessories designed to bring nature into your everyday living.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center p-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {items.map((product) => (
              <div key={product._id} className="group flex flex-col gap-4 rounded-3xl transition-all duration-300">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted/50 border border-border/50 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-primary/30">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  
                  {product.stock <= 5 && (
                    <div className="absolute top-4 right-4 bg-rose-500/95 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                      Low Stock
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  <div className="absolute bottom-6 left-0 w-full flex justify-center translate-y-8 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <button 
                      onClick={() => navigate("/contact")}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-sm font-semibold px-6 py-2.5 rounded-full border border-white/30 transition-all flex items-center gap-2 shadow-lg"
                    >
                      Enquire Now <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="px-2">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-semibold text-lg text-foreground transition-colors group-hover:text-primary">{product.name}</h3>
                    <span className="font-bold text-lg text-foreground">₹{product.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">{product.category}</p>
                    {product.stock > 0 ? (
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">In Stock ({product.stock})</span>
                    ) : (
                      <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-md">Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No products available at the moment.
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

export { Route };
