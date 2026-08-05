import React from "react";
import { Link, useLocation } from "../../lib/router";
import logo from "../../assets/logo.png";
import { Instagram, Youtube, Phone, Mail, ArrowRight, Sparkles, MapPin } from "lucide-react";
import { useStore } from "../../lib/store";
import { CurveDivider } from "./CurveDivider";

function Footer() {
  const location = useLocation();
  const isContactPage = location.pathname === "/contact";

  const [settings] = useStore("settings", {
    businessName: "Yogini Planters",
    phone: "",
    email: "",
    instagram: "",
  });

  return (
    <footer className="relative w-full mt-12 sm:mt-20">
      {/* SUBTLE PRE-FOOTER CALL-TO-ACTION BANNER (Hidden on Contact page) */}
      {!isContactPage && (
        <div className="bg-[#F9F6F2] py-10 sm:py-16 md:py-20 relative overflow-hidden">
          <div className="mx-auto max-w-5xl px-5 sm:px-6 text-center relative z-10 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] sm:text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 shrink-0" /> Start Your Spatial Journey
            </div>
            <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.18]">
              Ready to Architect Your Green Sanctuary?
            </h3>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Schedule an on-site spatial light mapping consultation with our senior plant stylists today.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                to="/contact"
                className="w-full sm:w-auto justify-center inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:scale-105"
              >
                <span>Book Spatial Consultation</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TOP ORGANIC WAVE TRANSITION CURVE */}
      <CurveDivider className="text-white/75" />

      {/* MAIN FOOTER CONTAINER */}
      <div className="bg-white/75 backdrop-blur-2xl text-foreground pt-10 sm:pt-12 pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-12 lg:gap-20 border-b border-border/40 pb-10 sm:pb-16">
            {/* Brand Info (Full width on mobile grid) */}
            <div className="col-span-2 sm:col-span-2 md:col-span-5 lg:col-span-4 flex flex-col gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-background shadow-sm overflow-hidden p-0.5 shrink-0">
                  <img src={logo} alt="Yogini Planters" className="h-full w-full rounded-full object-cover" />
                </div>
                <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-primary">
                  {settings.businessName}
                </span>
              </div>
              <p className="text-xs sm:text-[15px] leading-relaxed sm:leading-loose text-muted-foreground font-light max-w-sm">
                Bespoke plant wellness and biophilic styling for luxury residences, corporate venues, and private estates.
              </p>
            </div>

            {/* Navigation */}
            <div className="col-span-1 md:col-span-3 lg:col-span-2 flex flex-col gap-4 sm:gap-6">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">Navigation</h4>
              <ul className="flex flex-col gap-2.5 sm:gap-4 text-xs sm:text-[15px] font-medium text-foreground/80">
                {[
                  { label: "Our Services", path: "/services" },
                  { label: "Maintenance", path: "/maintenance" },
                  { label: "Portfolio", path: "/gallery" },
                  { label: "About Studio", path: "/about" },
                  { label: "Contact Us", path: "/contact" },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      className="group inline-flex items-center gap-1.5 hover:text-primary transition-colors duration-300"
                    >
                      <span className="relative overflow-hidden">
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                      </span>
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 hidden sm:inline-block" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inquiries */}
            <div className="col-span-1 md:col-span-4 lg:col-span-3 flex flex-col gap-4 sm:gap-6">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">Inquiries</h4>
              <ul className="flex flex-col gap-2.5 sm:gap-4 text-xs sm:text-[15px] font-light text-muted-foreground leading-relaxed">
                {(settings.phone || "Consultations Available") && (
                  <li>
                    <a href={`tel:${settings.phone}`} className="hover:text-primary transition-colors">
                      {settings.phone || "Request callback"}
                    </a>
                  </li>
                )}
                {settings.email && (
                  <li className="break-all sm:break-normal">
                    <a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">
                      {settings.email}
                    </a>
                  </li>
                )}
                <li className="pt-1 sm:pt-2">
                  <span>
                    Design Studio
                    <br />
                    Hyderabad, India
                  </span>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="col-span-2 sm:col-span-2 md:col-span-12 lg:col-span-3 flex flex-col gap-3 sm:gap-6 pt-2 sm:pt-0">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">Social</h4>
              <ul className="flex flex-row md:flex-col gap-4 sm:gap-4 text-xs sm:text-[15px] font-medium text-foreground/80">
                {[
                  { label: "Instagram", url: settings.instagram || "#" },
                  { label: "WhatsApp", url: `https://wa.me/${settings.phone?.replace(/[^0-9]/g, "") || ""}` },
                  { label: "YouTube", url: "#" },
                ].map((social, idx) => (
                  <li key={idx}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 hover:text-primary transition-colors duration-300"
                    >
                      <span className="relative overflow-hidden">
                        {social.label}
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 hidden md:inline-block" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs sm:text-[13px] text-muted-foreground font-light">
            <div>
              &copy; {new Date().getFullYear()} {settings.businessName}. All rights reserved.
            </div>
            <div className="flex items-center gap-6 sm:gap-10">
              <Link to="/contact" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
