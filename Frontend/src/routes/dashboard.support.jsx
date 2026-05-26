import React from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { Phone, MessageCircle, Mail } from "lucide-react";
const Route = createFileRoute("/dashboard/support")({ component: Page });
function Page() {
  return <div className="space-y-6">
      <PageHeader title="Support center" subtitle="We're here to help" />
      <div className="grid gap-4 md:grid-cols-3">
        <a href="tel:+918897484114" className="rounded-2xl border border-border bg-card p-6 hover:border-primary"><Phone className="h-6 w-6 text-primary" /><h3 className="mt-3 font-display text-lg">Call us</h3><p className="mt-1 text-sm text-muted-foreground">+91 88974 84114</p></a>
        <a href="https://wa.me/918897484114" className="rounded-2xl border border-border bg-card p-6 hover:border-primary"><MessageCircle className="h-6 w-6 text-primary" /><h3 className="mt-3 font-display text-lg">WhatsApp</h3><p className="mt-1 text-sm text-muted-foreground">Chat with our team</p></a>
        <a href="mailto:hello@yoginiplanters.in" className="rounded-2xl border border-border bg-card p-6 hover:border-primary"><Mail className="h-6 w-6 text-primary" /><h3 className="mt-3 font-display text-lg">Email</h3><p className="mt-1 text-sm text-muted-foreground">hello@yoginiplanters.in</p></a>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-xl">Frequently asked</h3>
        <div className="mt-4 space-y-3 text-sm">
          <details className="rounded-lg border border-border p-4"><summary className="cursor-pointer font-medium">How often does the team visit?</summary><p className="mt-2 text-muted-foreground">Depends on your plan — typically weekly or bi-weekly for Fully Customized, monthly for Partial.</p></details>
          <details className="rounded-lg border border-border p-4"><summary className="cursor-pointer font-medium">Do you provide the plants?</summary><p className="mt-2 text-muted-foreground">Yes — we source healthy plants matched to your space, or we can work with your existing collection.</p></details>
          <details className="rounded-lg border border-border p-4"><summary className="cursor-pointer font-medium">Service areas?</summary><p className="mt-2 text-muted-foreground">Currently Hyderabad. Reach out for nearby cities.</p></details>
        </div>
      </div>
    </div>;
}
export {
  Route
};
