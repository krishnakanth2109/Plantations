import React, { useState, useEffect } from "react";
import { Link } from "../../lib/router";
import logo from "../../assets/logo.png";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Products" },
  { to: "/maintenance", label: "Maintenance" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-500 ease-in-out ${scrolled
        ? "border-border/60 bg-background/85 backdrop-blur-xl shadow-md shadow-primary/5"
        : "border-border/30 bg-background/70 backdrop-blur-md shadow-none"
        }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 transition-all duration-500 ease-in-out ${scrolled ? "h-16 sm:h-18" : "h-20"
          }`}
      >
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="relative overflow-hidden rounded-full border border-primary/20 bg-background p-0.5 shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:border-primary/40 group-hover:shadow-md">
            <img src={logo} alt="Yogini Planters" className="h-10 w-10 sm:h-11 sm:w-11 object-cover rounded-full" />
            <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-primary transition-all duration-300 group-hover:opacity-90">
            Yogini Planters
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1.5 lg:flex h-full">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative flex h-full items-center px-3.5 text-sm font-semibold text-foreground/80 transition-colors duration-300 hover:text-primary group"
              activeProps={{ className: "!text-primary font-bold [&>span.nav-underline]:scale-x-100" }}
            >
              <span>{n.label}</span>
              {/* Animated Underline Indicator */}
              <span className="nav-underline absolute bottom-4 left-3.5 right-3.5 h-[2px] rounded-full bg-primary origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100" />
            </Link>
          ))}

          {/* Action Buttons */}
          <div className="ml-4 flex items-center gap-3 border-l border-border/50 pl-6">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-semibold text-foreground/80 transition-all duration-300 hover:text-primary px-4 py-2 rounded-full hover:bg-primary/5"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="group/btn relative inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] overflow-hidden"
            >
              <span>Register</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="lg:hidden relative z-50 p-2.5 rounded-full text-foreground/80 hover:text-foreground hover:bg-primary/10 transition-colors"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay & Menu Container */}
      <div
        className={`absolute top-full left-0 w-full h-screen border-t border-border/40 bg-background/95 backdrop-blur-3xl transition-all duration-500 lg:hidden ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-4 pointer-events-none"
          }`}
      >
        <nav className="flex h-[calc(100vh-100px)] flex-col px-8 py-12 overflow-y-auto pb-32 max-w-md mx-auto w-full">
          <div className="flex flex-col gap-8 items-center text-center mt-4">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="font-display text-2xl sm:text-5xl text-foreground/50 transition-all duration-300 hover:text-primary hover:scale-105"
                activeProps={{ className: "!text-primary font-medium" }}
              >
                {n.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-12 flex flex-col gap-4 w-full">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-full border border-border/80 bg-transparent px-4 py-4 text-center text-sm font-semibold uppercase tracking-wider text-foreground transition-all hover:border-primary hover:bg-primary/5"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-4 text-center text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-95"
            >
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export { Header };
