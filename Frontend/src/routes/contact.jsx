import React, { useState } from "react";
import { createFileRoute } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import { useStore } from "../lib/store";
import { toast } from "sonner";
import { createLead } from "../api";
import {
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  MapPin,
  Sparkles,
  Clock,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Check,
  Home,
  Trees,
  HeartPulse,
  Sprout,
  CalendarCheck,
  Sliders
} from "lucide-react";

const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Yogini Planters" },
      { name: "description", content: "Get in touch for plant styling, balcony makeovers, landscaping, and ongoing maintenance." }
    ]
  }),
  component: Contact
});

const serviceOptions = [
  { label: "Indoor Plant Styling", category: "Interior Décor & Lighting", icon: Home },
  { label: "Balcony Makeover", category: "Terrace & Outdoor Seating", icon: Sparkles },
  { label: "Landscaping", category: "Commercial & Estate Architecture", icon: Trees },
  { label: "Plant Wellness", category: "Doctor Health Diagnostics", icon: HeartPulse },
  { label: "Fertilizing", category: "Organic Soil & Plant Nutrition", icon: Sprout },
  { label: "Partial Maintenance", category: "Scheduled Regular Care", icon: CalendarCheck },
  { label: "Fully Customized Maintenance", category: "360° Turnkey Plant Management", icon: ShieldCheck },
];

function Contact() {
  const [settings] = useStore("settings", {
    phone: "",
    email: "",
    instagram: "",
    address: ""
  });
  const [form, setForm] = useState({ name: "", phone: "", interest: "Indoor Plant Styling", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedOpt = serviceOptions.find(o => o.label === form.interest) || serviceOptions[0];
  const SelectedIcon = selectedOpt.icon;

  const phoneHref = settings.phone ? `tel:${settings.phone.replace(/\D/g, "")}` : void 0;
  const whatsappHref = settings.phone ? `https://wa.me/${settings.phone.replace(/\D/g, "")}` : void 0;
  const emailHref = settings.email ? `mailto:${settings.email}` : void 0;
  const instagramHref = settings.instagram ? `https://instagram.com/${settings.instagram.replace(/^@/, "")}` : void 0;

  function handlePhoneChange(e) {
    const raw = e.target.value;
    // Allow digits, spaces, plus, hyphens, parentheses
    const sanitized = raw.replace(/[^\d\s+\-()]/g, "");
    setForm((prev) => ({ ...prev, phone: sanitized }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    const digitsOnly = form.phone.replace(/\D/g, "");
    if (!digitsOnly || digitsOnly.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSubmitting(true);
    try {
      await createLead({ ...form, source: "Website", status: "New" });
      toast.success("Thanks! We'll be in touch shortly.");
      setSent(true);
      setForm({ name: "", phone: "", interest: "Indoor Plant Styling", message: "" });
    } catch (error) {
      toast.error(error.message || "Failed to submit lead");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      {/* Hero Header Section */}
      <section className="relative w-full border-b border-border/40 py-16 sm:py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Get in Touch
          </span>
          <h1 className="mt-5 font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-primary">
            Let's Transform Your Space
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-base sm:text-xl text-muted-foreground leading-relaxed font-normal">
            Connect with our senior plant stylists for bespoke interior decoration, balcony makeovers, commercial landscaping, and ongoing botanical maintenance.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-12">
          <div className="grid gap-12 lg:grid-cols-2 items-start">

            {/* Left Column: Contact Cards & Trust Section */}
            <div className="space-y-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Direct Contact</span>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-foreground">Reach Our Styling Team</h2>
                <p className="mt-2 text-base text-muted-foreground">
                  Whether you are planning a residential makeover or a corporate green installation, we are here to bring your vision to life.
                </p>
              </div>

              {/* Contact Information Cards */}
              <div className="space-y-4">
                {settings.phone && phoneHref && (
                  <a
                    href={phoneHref}
                    className="group flex items-center gap-4.5 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40 hover:-translate-y-1"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</div>
                      <div className="font-semibold text-base text-foreground mt-0.5 group-hover:text-primary transition-colors">{settings.phone}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </a>
                )}

                {settings.phone && whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4.5 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40 hover:-translate-y-1"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">WhatsApp Instant Chat</div>
                      <div className="font-semibold text-base text-foreground mt-0.5 group-hover:text-primary transition-colors">Chat with our team</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </a>
                )}

                {settings.email && emailHref && (
                  <a
                    href={emailHref}
                    className="group flex items-center gap-4.5 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40 hover:-translate-y-1"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</div>
                      <div className="font-semibold text-base text-foreground mt-0.5 group-hover:text-primary transition-colors">{settings.email}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </a>
                )}

                {settings.instagram && instagramHref && (
                  <a
                    href={instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4.5 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40 hover:-translate-y-1"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                      <Instagram className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Instagram</div>
                      <div className="font-semibold text-base text-foreground mt-0.5 group-hover:text-primary transition-colors">{settings.instagram}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </a>
                )}

                {settings.address && (
                  <div className="flex items-center gap-4.5 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Office Location</div>
                      <div className="font-semibold text-base text-foreground mt-0.5">{settings.address}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-border/40 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Why Partner With Us</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: Clock, title: "Quick Response", desc: "Replies within 24h" },
                    { icon: UserCheck, title: "Expert Advice", desc: "Senior plant stylists" },
                    { icon: ShieldCheck, title: "Bespoke Care", desc: "Customized solutions" },
                  ].map((t) => (
                    <div key={t.title} className="rounded-2xl border border-border/40 bg-muted/30 p-4 text-center">
                      <t.icon className="mx-auto h-5 w-5 text-primary mb-2" />
                      <div className="text-xs font-bold text-foreground">{t.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Enquiry Form */}
            <form onSubmit={submit} className="rounded-3xl border border-border/60 p-8 sm:p-10 shadow-sm space-y-6">
              <div className="border-b border-border/50 pb-5">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Send Us a Message</h2>
                <p className="mt-1 text-sm text-muted-foreground">Fill in your details below and our team will get back to you shortly.</p>
              </div>

              <div className="space-y-6">
                {/* Outlined Floating Label: Full Name */}
                <div className="relative">
                  <input
                    required
                    id="contact-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder=" "
                    className="peer w-full rounded-2xl border border-input bg-transparent px-4 py-3.5 text-sm font-semibold text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                  />
                  <label
                    htmlFor="contact-name"
                    className="absolute left-3.5 -top-2.5 z-10 px-1.5 bg-background text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-placeholder-shown:px-0 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-muted-foreground/60 peer-focus:-top-2.5 peer-focus:left-3.5 peer-focus:px-1.5 peer-focus:bg-background peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary"
                  >
                    Enter your name *
                  </label>
                </div>

                {/* Outlined Floating Label: Phone Number */}
                <div className="relative">
                  <input
                    required
                    type="tel"
                    id="contact-phone"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    placeholder=" "
                    maxLength={16}
                    className="peer w-full rounded-2xl border border-input bg-transparent px-4 py-3.5 text-sm font-semibold text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                  />
                  <label
                    htmlFor="contact-phone"
                    className="absolute left-3.5 -top-2.5 z-10 px-1.5 bg-background text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-placeholder-shown:px-0 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-muted-foreground/60 peer-focus:-top-2.5 peer-focus:left-3.5 peer-focus:px-1.5 peer-focus:bg-background peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary"
                  >
                    Mobile number (10 digits) *
                  </label>
                </div>

                {/* Outlined Floating Label: Service Interest Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full flex items-center justify-between rounded-2xl border border-input bg-transparent px-4 py-3.5 text-sm font-medium text-foreground outline-none transition-all duration-300 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm text-left relative"
                  >
                    <span className="absolute left-3.5 -top-2.5 z-10 px-1.5 bg-background text-[11px] font-semibold uppercase tracking-wider text-primary pointer-events-none">
                      Select a service
                    </span>
                    <span className="flex items-center gap-2.5 font-semibold text-foreground">
                      <SelectedIcon className="h-4 w-4 text-primary shrink-0" />
                      {form.interest}
                    </span>
                    <Sliders className={`h-4 w-4 text-primary transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute left-0 right-0 top-full mt-2 z-30 max-h-80 overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 space-y-1">
                        {serviceOptions.map((opt) => {
                          const IconComp = opt.icon;
                          const isSelected = form.interest === opt.label;
                          return (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => {
                                setForm({ ...form, interest: opt.label });
                                setDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 ${isSelected
                                  ? "bg-primary/10 border border-primary/30 text-primary font-semibold"
                                  : "hover:bg-muted/80 text-foreground"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/75"}`}>
                                  <IconComp className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold">{opt.label}</div>
                                  <div className="text-[11px] text-muted-foreground">{opt.category}</div>
                                </div>
                              </div>
                              {isSelected && <Sparkles className="h-4 w-4 text-primary shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Outlined Floating Label: Message */}
                <div className="relative">
                  <textarea
                    rows={4}
                    id="contact-message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder=" "
                    className="peer w-full rounded-2xl border border-input bg-transparent px-4 py-3.5 text-sm font-medium text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm resize-none"
                  />
                  <label
                    htmlFor="contact-message"
                    className="absolute left-3.5 -top-2.5 z-10 px-1.5 bg-background text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-placeholder-shown:px-0 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-muted-foreground/60 peer-focus:-top-2.5 peer-focus:left-3.5 peer-focus:px-1.5 peer-focus:bg-background peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary"
                  >
                    Tell us about your project...
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    disabled={submitting}
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 group"
                  >
                    <span>{submitting ? "Submitting..." : "Send Enquiry"}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>

                {sent && (
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                    <p className="text-sm font-semibold text-primary flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Thank you! We have received your enquiry.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export { Route };
