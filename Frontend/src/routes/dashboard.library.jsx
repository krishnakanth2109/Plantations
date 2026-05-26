import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { getLibraryArticles } from "../api";
import { toast } from "sonner";

const Route = createFileRoute("/dashboard/library")({ component: Page });

function Page() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getLibraryArticles()
      .then((data) => {
        if (active) setGuides(data.articles);
      })
      .catch((error) => toast.error(error.message))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Plant care library" subtitle={loading ? "Loading..." : "Tips & guides for healthy plants"} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <div key={g._id || g.slug} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium uppercase tracking-widest text-primary/70">{g.category}</p>
            <h3 className="mt-1 font-display text-lg text-primary">{g.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{g.summary}</p>
          </div>
        ))}
        {!loading && guides.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground md:col-span-2 lg:col-span-3">No library articles found.</div>}
      </div>
    </div>
  );
}

export { Route };
