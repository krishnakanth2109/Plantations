import React from "react";
import { Link } from "../../lib/router";
import logo from "../../assets/logo.png";
import { Instagram, Youtube, Phone, Mail } from "lucide-react";
import { useStore } from "../../lib/store";
function Footer() {
  const [settings] = useStore("settings", {
    businessName: "Yogini Planters",
    phone: "",
    email: "",
    instagram: ""
  });
  return <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Yogini Planters" className="h-12 w-12 rounded-full" />
            <span className="font-display text-2xl font-semibold text-primary">{settings.businessName}</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Plant wellness and green styling for homes, offices, cafes, and commercial spaces. We design, place, decorate, and maintain so your plants thrive.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/maintenance" className="hover:text-primary">Maintenance</Link></li>
            <li><Link to="/gallery" className="hover:text-primary">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Connect</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {settings.phone && <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {settings.phone}</li>}
            {settings.email && <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> {settings.email}</li>}
            {settings.instagram && <li className="flex items-center gap-2"><Instagram className="h-4 w-4" /> {settings.instagram}</li>}
            <li className="flex items-center gap-2"><Youtube className="h-4 w-4" /> Yogini Planters</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        &copy; {(/* @__PURE__ */ new Date()).getFullYear()} {settings.businessName}. Bringing nature into everyday living.
      </div>
    </footer>;
}
export {
  Footer
};
