import React, { useState } from "react";
import { Link } from "../../lib/router";
import logo from "../../assets/logo.png";
import { Menu, X, ChevronDown, ShoppingBag, ArrowRight } from "lucide-react";
import { getInventory } from "../../api";

const navLeft = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
];

const navRight = [
  { to: "/maintenance", label: "Maintenance" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" }
];

function Header() {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    getInventory().then(setItems).catch(() => {});
  }, []);

  const featuredProducts = items.slice(0, 4);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 relative">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden rounded-full shadow-sm transition-transform duration-500 group-hover:scale-105 group-hover:shadow-md">
            <img src={logo} alt="Yogini Planters" className="h-12 w-12 object-cover" />
            <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <span className="font-display text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent transition-all duration-300 group-hover:to-primary">
            Yogini Planters
          </span>
        </Link>
        
        <nav className="hidden items-center gap-8 lg:flex h-full">
          {navLeft.map((n) => (
            <Link key={n.to} to={n.to} className="relative flex h-full items-center text-sm font-medium text-foreground/80 transition-colors hover:text-primary group" activeProps={{ className: "text-primary" }}>
              {n.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          
          {/* Products Link */}
          <div className="group flex h-full items-center">
            <Link to="/products" className="relative flex h-full items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:text-primary group-hover:text-primary" activeProps={{ className: "text-primary" }}>
              Products
              <span className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
            
            {/* Dropdown Container */}
            {/* <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 w-max z-50">
              <div className="w-[850px] rounded-3xl border border-white/20 bg-background/95 p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10">
                <div className="flex items-end justify-between mb-8 pb-4 border-b border-border/50">
                  <div>
                    <h3 className="font-display text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Featured Collection</h3>
                    <p className="text-sm text-muted-foreground mt-1">Discover our hand-picked selection of premium plants and accessories.</p>
                  </div>
                  <Link to="/products" className="group/link flex items-center gap-2 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-full transition-all">
                    View all catalog 
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-4 gap-6">
                  {featuredProducts.map((product, idx) => (
                    <Link key={product._id} to={`/products`} className="group/item flex flex-col gap-4 rounded-2xl transition-all duration-300 hover:-translate-y-1" style={{ transitionDelay: `${idx * 50}ms` }}>
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted/50 border border-border/30 shadow-sm transition-all duration-300 group-hover/item:shadow-md group-hover/item:border-primary/20">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/item:scale-110" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                            <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
                          </div>
                        )}
                        {product.stock <= 5 && (
                          <div className="absolute top-3 right-3 bg-rose-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                            Low Stock
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover/item:opacity-100" />
                        <div className="absolute bottom-4 left-0 w-full flex justify-center translate-y-4 opacity-0 transition-all duration-300 group-hover/item:translate-y-0 group-hover/item:opacity-100">
                          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/30">
                            Quick View
                          </span>
                        </div>
                      </div>
                      <div className="px-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-medium text-foreground truncate transition-colors group-hover/item:text-primary">{product.name}</h4>
                          <span className="text-sm font-bold text-foreground">₹{product.price}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div> */}
          </div>

          {navRight.map((n) => (
            <Link key={n.to} to={n.to} className="relative flex h-full items-center text-sm font-medium text-foreground/80 transition-colors hover:text-primary group" activeProps={{ className: "text-primary" }}>
              {n.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          
          <div className="ml-2 flex items-center gap-3 border-l border-border/60 pl-6">
            <Link to="/login" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
              Sign in
            </Link>
            <Link to="/register" className="relative overflow-hidden rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 group/btn">
              <span className="relative z-10">Register</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover/btn:translate-y-0" />
            </Link>
          </div>
        </nav>
        
        <button className="lg:hidden relative z-50 p-2 text-foreground/80 hover:text-foreground transition-colors" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Nav */}
      <div className={`fixed inset-0 top-20 z-40 bg-background/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <nav className="flex h-full flex-col p-6 overflow-y-auto pb-24">
          <div className="flex flex-col gap-2">
            {[...navLeft, { to: "/products", label: "Shop" }, ...navRight].map((n, idx) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="flex items-center rounded-2xl px-4 py-4 text-lg font-semibold transition-colors hover:bg-muted/50 hover:text-primary" style={{ animationDelay: `${idx * 50}ms` }}>
                {n.label}
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 pt-8 border-t border-border/50">
            <Link to="/login" onClick={() => setOpen(false)} className="flex items-center justify-center rounded-2xl bg-muted px-4 py-4 text-center text-lg font-medium transition-colors hover:bg-muted/80">
              Sign in
            </Link>
            <Link to="/register" onClick={() => setOpen(false)} className="flex items-center justify-center rounded-2xl bg-primary px-4 py-4 text-center text-lg font-medium text-primary-foreground shadow-sm transition-transform active:scale-95">
              Create an account
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export { Header };
