import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge, statusTone } from "../components/dashboard/DashboardShell";
import { createWellnessTicket, getMyWellnessTickets, deleteWellnessTicket, uploadFile } from "../api";
import { Trash2, ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Route = createFileRoute("/dashboard/wellness")({ component: Page });

function mapTicket(ticket) {
  return {
    id: ticket._id || ticket.id,
    issue: ticket.issue,
    photos: ticket.photos || [],
    status: ticket.status,
    diagnosis: ticket.diagnosis,
    created: ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("en-IN") : "",
  };
}

function Page() {
  const [items, setItems] = useState([]);
  const [issue, setIssue] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this wellness ticket?")) return;
    try {
      await deleteWellnessTicket(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
      toast.success("Ticket deleted");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function fetchTickets() {
    setLoading(true);
    try {
      const data = await getMyWellnessTickets();
      setItems(data.tickets.map(mapTicket));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  async function handleUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (photos.length + files.length > 2) {
      toast.error("You can upload a maximum of 2 images.");
      return;
    }

    setUploading(true);
    try {
      const newPhotos = [];
      for (const file of files) {
        if (photos.length + newPhotos.length >= 2) break;
        const res = await uploadFile(file, "wellness");
        newPhotos.push(res.url);
      }
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, 2));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  }

  async function raise() {
    if (!issue) {
      toast.error("Describe the issue");
      return;
    }
    setSubmitting(true);
    try {
      const data = await createWellnessTicket({ issue, photos });
      setItems((p) => [mapTicket(data.ticket), ...p]);
      setIssue("");
      setPhotos([]);
      toast.success("Ticket raised. Expert will respond soon.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Plant wellness support" subtitle={loading ? "Loading tickets..." : "Raise an issue and our experts will diagnose"} />
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-xl">Raise a new issue</h3>
        <textarea rows={3} value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="e.g. Money plant leaves turning yellow..." className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        
        <div className="mt-4 flex flex-wrap gap-3">
          {photos.map((photo, i) => (
            <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-border">
              <img src={photo} alt="Issue" className="h-full w-full object-cover" />
              <button onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {photos.length < 2 && (
            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/50 text-muted-foreground transition hover:bg-secondary">
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
              <span className="mt-1 text-[10px] font-medium">{uploading ? "Uploading..." : "Add Image"}</span>
              <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading || submitting} />
            </label>
          )}
        </div>

        <button disabled={submitting || uploading} onClick={raise} className="mt-4 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
          {submitting ? "Submitting..." : "Submit ticket"}
        </button>
      </div>
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{t.created}</div>
              <div className="flex items-center gap-3">
                <Badge tone={statusTone(t.status)}>{t.status}</Badge>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="rounded-full p-1.5 hover:bg-secondary text-rose-600 transition"
                  aria-label="Delete ticket"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <h4 className="mt-1 font-medium">{t.issue}</h4>
            {t.photos && t.photos.length > 0 && (
              <div className="mt-3 flex gap-2">
                {t.photos.map((photo, i) => (
                  <img key={i} src={photo} alt="Ticket issue" className="h-16 w-16 rounded-md object-cover border border-border" />
                ))}
              </div>
            )}
            {t.diagnosis && <p className="mt-3 rounded-lg bg-secondary/60 p-3 text-sm"><strong>Expert says:</strong> {t.diagnosis}</p>}
          </div>
        ))}
        {!loading && items.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">No wellness tickets yet.</div>}
      </div>
    </div>
  );
}

export { Route };
