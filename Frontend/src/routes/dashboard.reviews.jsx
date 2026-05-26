import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { createReview, getMyReviews } from "../api";
import { Star } from "lucide-react";
import { toast } from "sonner";

const Route = createFileRoute("/dashboard/reviews")({ component: Page });

function Page() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getMyReviews()
      .then((data) => setItems(data.reviews))
      .catch((error) => toast.error(error.message));
  }, []);

  async function submit() {
    if (!text) {
      toast.error("Write a review");
      return;
    }
    setSubmitting(true);
    try {
      const data = await createReview({ text, rating });
      setItems((p) => [data.review, ...p]);
      setText("");
      toast.success("Submitted for review");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Write a review" subtitle="Share your experience" />
      <div className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} type="button">
              <Star className={`h-6 w-6 ${n <= rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
            </button>
          ))}
        </div>
        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Tell us about your experience..." className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <button disabled={submitting} onClick={submit} className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground disabled:opacity-60">
          {submitting ? "Submitting..." : "Submit review"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((review) => (
          <div key={review._id || review.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex text-accent">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
            <p className="mt-3 text-sm text-foreground/80">"{review.text}"</p>
            <p className="mt-3 text-xs text-muted-foreground">{review.approved ? "Approved" : "Waiting for approval"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export { Route };
