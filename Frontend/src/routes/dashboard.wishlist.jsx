import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { addWishlistItem, getServices, getWishlist, removeWishlistItem } from "../api";
import { Heart, X } from "lucide-react";
import { toast } from "sonner";

const Route = createFileRoute("/dashboard/wishlist")({ component: Page });

function Page() {
  const [services, setServices] = useState([]);
  const [items, setItems] = useState([]);
  const savedIds = new Set(items.map((item) => item.serviceId?._id || item.serviceId));

  useEffect(() => {
    Promise.all([getServices(), getWishlist()])
      .then(([serviceData, wishlistData]) => {
        setServices(serviceData.services);
        setItems(wishlistData.items);
      })
      .catch((error) => toast.error(error.message));
  }, []);

  async function toggle(service) {
    const saved = savedIds.has(service._id);
    try {
      if (saved) {
        await removeWishlistItem(service._id);
        setItems((p) => p.filter((item) => (item.serviceId?._id || item.serviceId) !== service._id));
      } else {
        const data = await addWishlistItem(service._id);
        setItems((p) => [data.item, ...p]);
      }
      toast.success("Wishlist updated");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Wishlist" subtitle="Save services for later" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const saved = savedIds.has(service._id);
          return (
            <div key={service._id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5">
              <div>
                <div className="font-medium">{service.title}</div>
                <div className="text-xs text-muted-foreground">{service.category}</div>
              </div>
              <button onClick={() => toggle(service)} className={`rounded-full p-2 ${saved ? "bg-primary text-primary-foreground" : "border border-border"}`}>
                {saved ? <X className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Route };
