import React from "react";
import { createFileRoute } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import { useStore } from "../lib/store";
import { useState } from "react";
import { toast } from "sonner";
import { createLead } from "../api";
import { Phone, Mail, Instagram, MessageCircle, MapPin } from "lucide-react";
const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Yogini Planters" },
      { name: "description", content: "Get in touch for plant styling, balcony makeovers, landscaping, and maintenance." }
    ]
  }),
  component: Contact
});
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
  const phoneHref = settings.phone ? `tel:${settings.phone.replace(/\D/g, "")}` : void 0;
  const whatsappHref = settings.phone ? `https://wa.me/${settings.phone.replace(/\D/g, "")}` : void 0;
  const emailHref = settings.email ? `mailto:${settings.email}` : void 0;
  const instagramHref = settings.instagram ? `https://instagram.com/${settings.instagram.replace(/^@/, "")}` : void 0;
  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Please add your name and phone.");
      return;
    }
    setSubmitting(true);
    try {
      await createLead({ ...form, source: "Website", status: "New" });
      toast.success("Thanks! We'll be in touch shortly.");
      setSent(true);
      setForm({ name: "", phone: "", interest: "Indoor Plant Styling", message: "" });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }
  return <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-primary/80">Contact</p>
            <h1 className="mt-2 font-display text-5xl text-primary md:text-6xl">Let's create your green space</h1>
            <p className="mt-4 text-lg text-muted-foreground">For plant styling, balcony makeovers, landscaping, maintenance or wellness support, connect with Yogini Planters.</p>

            <div className="mt-10 space-y-4">
              {settings.phone && phoneHref && <a href={phoneHref} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary">
                  <Phone className="h-5 w-5 text-primary" />
                  <div><div className="text-xs text-muted-foreground">Phone</div><div className="font-medium">{settings.phone}</div></div>
                </a>}
              {settings.phone && whatsappHref && <a href={whatsappHref} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div><div className="text-xs text-muted-foreground">WhatsApp</div><div className="font-medium">Chat with us</div></div>
                </a>}
              {settings.email && emailHref && <a href={emailHref} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary">
                  <Mail className="h-5 w-5 text-primary" />
                  <div><div className="text-xs text-muted-foreground">Email</div><div className="font-medium">{settings.email}</div></div>
                </a>}
              {settings.instagram && instagramHref && <a href={instagramHref} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary">
                  <Instagram className="h-5 w-5 text-primary" />
                  <div><div className="text-xs text-muted-foreground">Instagram</div><div className="font-medium">{settings.instagram}</div></div>
                </a>}
              {settings.address && <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div><div className="text-xs text-muted-foreground">Location</div><div className="font-medium">{settings.address}</div></div>
                </div>}
            </div>
          </div>

          <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-8">
            <h2 className="font-display text-2xl">Send us a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">We'll respond within 24 hours.</p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-medium">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-medium">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-medium">I'm interested in</label>
                <select value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
                  {["Indoor Plant Styling", "Balcony Makeover", "Landscaping", "Plant Wellness", "Fertilizing", "Partial Maintenance", "Fully Customized Maintenance"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium">Message</label>
                <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <button disabled={submitting} type="submit" className="w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60">{submitting ? "Sending..." : "Send enquiry"}</button>
              {sent && <p className="text-center text-sm text-primary">Submitted. We'll be in touch!</p>}
            </div>
          </form>
        </div>
      </section>
    </SiteLayout>;
}
export {
  Route
};
