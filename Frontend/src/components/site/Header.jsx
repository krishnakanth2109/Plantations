import React from "react";
import { Link } from "../../lib/router";
import { useState } from "react";
import logo from "../../assets/logo.png";
import { Menu, X } from "lucide-react";
const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/maintenance", label: "Maintenance" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" }
];
function Header() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur">
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
      <Link to="/" className="flex items-center gap-3">
        <img src={logo} alt="Yogini Planters" className="h-12 w-12 rounded-full object-cover" />
        <span className="font-display text-2xl font-semibold text-primary">Yogini Planters</span>
      </Link>
      <nav className="hidden items-center gap-8 lg:flex">
        {nav.map((n) => <Link key={n.to} to={n.to} className="text-sm font-medium text-foreground/80 transition hover:text-primary" activeProps={{ className: "text-primary" }}>
          {n.label}
        </Link>)}
        <Link to="/login" className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
          Sign in
        </Link>
        <Link to="/register" className="rounded-full border border-primary/25 px-5 py-2 text-sm font-medium text-primary transition hover:bg-primary/10">
          Register
        </Link>
      </nav>
      <button className="lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
        {open ? <X /> : <Menu />}
      </button>
    </div>
    {open && <div className="border-t border-border/60 bg-background lg:hidden">
      <nav className="flex flex-col gap-1 px-4 py-3">
        {nav.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
          {n.label}
        </Link>)}
        <Link to="/login" onClick={() => setOpen(false)} className="mt-2 rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground">
          Sign in
        </Link>
        <Link to="/register" onClick={() => setOpen(false)} className="rounded-md border border-primary/25 px-3 py-2 text-center text-sm font-medium text-primary">
          Register
        </Link>
      </nav>
    </div>}
  </header>;
}
export {
  Header
};
