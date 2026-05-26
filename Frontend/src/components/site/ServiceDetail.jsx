import React, { useEffect, useState } from "react";
import { Link } from "../../lib/router";
import { SiteLayout } from "./SiteLayout";
import { getServiceBySlug } from "../../api";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
function ServiceDetail({ slug, eyebrow, title, intro, image, provide, sections = [] }) {
  const [service, setService] = useState(null);
  useEffect(() => {
    if (!slug) return;
    getServiceBySlug(slug)
      .then((data) => setService(data.service))
      .catch((error) => toast.error(error.message));
  }, [slug]);
  const displayTitle = service?.title || title;
  const displayIntro = service?.description || intro;
  const displayProvide = service?.features?.length ? service.features : provide;
  const displayImage = service?.imageUrl || image;
  return <SiteLayout>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={displayImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="text-sm font-medium uppercase tracking-widest text-primary/80">{eyebrow}</p>
          <h1 className="mt-2 max-w-3xl font-display text-5xl text-primary md:text-6xl">{displayTitle}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/85">{displayIntro}</p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Book consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-display text-3xl text-primary">What we provide</h2>
        <ul className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {displayProvide.map((p) => <li key={p} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm">{p}</span>
            </li>)}
        </ul>
      </section>

      {sections.length > 0 && <section className="bg-secondary/40 py-16">
          <div className="mx-auto max-w-7xl space-y-12 px-6">
            {sections.map((sec) => <div key={sec.title} className="rounded-2xl border border-border bg-card p-8">
                <h3 className="font-display text-2xl text-primary">{sec.title}</h3>
                {sec.note && <p className="mt-2 text-sm text-muted-foreground">{sec.note}</p>}
                <ul className="mt-5 grid gap-2 md:grid-cols-2">
                  {sec.bullets.map((b) => <li key={b} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 text-primary" /> {b}</li>)}
                </ul>
              </div>)}
          </div>
        </section>}
    </SiteLayout>;
}
export {
  ServiceDetail
};
