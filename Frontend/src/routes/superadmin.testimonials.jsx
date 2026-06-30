import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge } from "../components/dashboard/DashboardShell";
import { approveReview, deleteReview, getAllReviews } from "../api";
import { Star, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Route = createFileRoute("/superadmin/testimonials")({ component: Page });

function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAllReviews()
      .then((data) => {
        if (active) setItems(data.reviews);
      })
      .catch((error) => toast.error(error.message))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function approve(id) {
    try {
      const data = await approveReview(id);
      setItems((p) => p.map((t) => ((t._id || t.id) === id ? data.review : t)));
      toast.success("Approved");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function del(id) {
    if (!confirm("Delete?")) return;
    try {
      await deleteReview(id);
      setItems((p) => p.filter((t) => (t._id || t.id) !== id));
      toast.success("Deleted");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Testimonials" subtitle={loading ? "Loading..." : "Moderate customer reviews"} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => {
          const id = t._id || t.id;
          return (
            <div key={id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="flex text-accent">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
                </div>
                <Badge tone={t.approved ? "success" : "warn"}>{t.approved ? "Live" : "Hidden"}</Badge>
              </div>
              <p className="mt-3 text-sm text-foreground/80">"{t.text}"</p>
              <div className="mt-4 flex gap-2">
                {!t.approved && (
                  <button onClick={() => approve(id)} className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs">
                    <Check className="h-3 w-3" /> Approve
                  </button>
                )}
                <button onClick={() => del(id)} className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-rose-600">
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Route };
