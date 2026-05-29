import React from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { getCms, updateCms } from "../api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const init = {
  heroTitle: "Bringing Nature Into Everyday Living",
  heroSubtitle: "Indoor plant styling, balcony makeovers, landscaping and wellness services.",
  aboutHeadline: "Yogini \u2014 meaning the divine balance of nature",
  aboutBody: "At Yogini Planters, we believe plants are more than decoration \u2014 they bring peace, beauty, wellness, health and positive energy.",
  metaTitle: "Yogini Planters \u2014 Indoor Plant Styling & Wellness, Hyderabad",
  metaDescription: "Elegant indoor plant styling, balcony makeovers, landscaping and plant wellness for modern homes, offices and caf\xE9s.",
  bannerActive: false,
  bannerText: "Monsoon offer: 20% off all maintenance plans \u2014 use code GREEN20"
};
const Route = createFileRoute("/admin/cms")({ component: Page });
function Page() {
  const [c, setC] = useState(init);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCms()
      .then((data) => {
        if (data.cms) {
          setC(data.cms);
        }
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load CMS settings: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    try {
      await updateCms(c);
      toast.success("Website content saved successfully");
    } catch (err) {
      toast.error("Failed to save changes: " + err.message);
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading CMS settings…</div>;
  }
  return <div className="space-y-6">
      <PageHeader title="Website CMS" subtitle="Edit homepage content, banner & SEO" />

      <div className="max-w-2xl space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-xl text-primary">Hero section</h3>
          <div className="mt-4 space-y-3">
            <div><label className="text-xs font-medium">Headline</label><input value={c.heroTitle} onChange={(e) => setC({ ...c, heroTitle: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" /></div>
            <div><label className="text-xs font-medium">Subtitle</label><textarea rows={2} value={c.heroSubtitle} onChange={(e) => setC({ ...c, heroSubtitle: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" /></div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-xl text-primary">About section</h3>
          <div className="mt-4 space-y-3">
            <div><label className="text-xs font-medium">Headline</label><input value={c.aboutHeadline} onChange={(e) => setC({ ...c, aboutHeadline: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" /></div>
            <div><label className="text-xs font-medium">Body</label><textarea rows={4} value={c.aboutBody} onChange={(e) => setC({ ...c, aboutBody: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" /></div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-xl text-primary">Announcement banner</h3>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={c.bannerActive} onChange={(e) => setC({ ...c, bannerActive: e.target.checked })} /> Show banner on website</label>
            <textarea rows={2} value={c.bannerText} onChange={(e) => setC({ ...c, bannerText: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-xl text-primary">SEO</h3>
          <div className="mt-4 space-y-3">
            <div><label className="text-xs font-medium">Meta title</label><input value={c.metaTitle} onChange={(e) => setC({ ...c, metaTitle: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" /></div>
            <div><label className="text-xs font-medium">Meta description</label><textarea rows={2} value={c.metaDescription} onChange={(e) => setC({ ...c, metaDescription: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" /></div>
          </div>
        </section>

        <button onClick={handleSave} className="rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Save all changes</button>
      </div>
    </div>;
}
export {
  Route
};
