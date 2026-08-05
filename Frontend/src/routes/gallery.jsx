import React, { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import { LoadingCircle } from "../components/ui/LoadingCircle";
import { Loader2, Sparkles, MapPin, CheckCircle2, ArrowRight, X, Building2, Filter, ChevronRight } from "lucide-react";
import { getGalleryItems } from "../api";
import { toast } from "sonner";

const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Portfolio & Gallery — Yogini Planters" },
      { name: "description", content: "Explore our completed plant styling, architectural green installations, balcony makeovers, and landscaping projects across residential, corporate, healthcare, and commercial spaces." },
      { property: "og:title", content: "Spaces We've Transformed — Yogini Planters Portfolio" },
    ]
  }),
  component: Gallery
});

function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    setLoading(true);
    getGalleryItems()
      .then((data) => {
        if (active) setItems(data.galleryItems || []);
      })
      .catch((err) => toast.error(err.message || "Failed to load gallery items"))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Dynamic grid span patterns for a large architectural portfolio layout
  const getItemSpan = (idx) => {
    const pattern = idx % 3;
    if (pattern === 0) return "md:col-span-2 lg:col-span-2 aspect-[4/5] sm:aspect-[21/9]";
    if (pattern === 1) return "md:col-span-1 lg:col-span-1 aspect-[4/5]";
    return "md:col-span-1 lg:col-span-1 aspect-[4/5]";
  };

  return (
    <SiteLayout>
      {/* Hero Header Section */}
      <section className="relative w-full py-16 sm:pt-24 sm:pb-8">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <Building2 className="h-3.5 w-3.5" /> Project Portfolio
          </span>
          <h1 className="mt-5 font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-primary">
            Spaces We've Transformed
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-base sm:text-xl text-muted-foreground leading-relaxed font-normal">
            A showcase of completed botanical styling, custom balcony makeovers, commercial green installations, and masterplanned landscapes built for homes, headquarters, and public venues.
          </p>
        </div>
      </section>

      {/* Portfolio Gallery Section */}
      <section className="bg-background py-8 sm:py-16 pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 text-muted-foreground">
              <LoadingCircle size="lg" label="Loading portfolio projects..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              {items.map((i, idx) => {
                const image = i.image || i.after || i.before;
                const spanClass = getItemSpan(idx);
                const location = i.location || "Hyderabad, India";

                return (
                  <figure
                    key={i._id || i.id || idx}
                    onClick={() => setSelectedProject(i)}
                    className={`group relative overflow-hidden rounded-[32px] sm:rounded-[40px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] transition-all duration-1000 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-2 cursor-pointer bg-secondary/10 ${spanClass}`}
                  >
                    {/* Image with subtle zoom and tilt */}
                    <div className="absolute inset-0 transition-transform duration-1000 ease-[0.25,0.1,0.25,1] group-hover:scale-105 group-hover:rotate-[1deg]">
                      <img
                        src={image}
                        alt={i.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Gradient Overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 transition-opacity duration-700 group-hover:opacity-60" />

                    {/* Elegant Refined Glass Overlay Box */}
                    <figcaption className="absolute bottom-3 left-3 right-3 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col justify-end">
                      <div className="relative overflow-hidden rounded-[20px] sm:rounded-[32px] bg-white/5 backdrop-blur-md border border-white/20 p-5 sm:p-8 shadow-2xl transition-all duration-700 group-hover:-translate-y-2 group-hover:bg-white/10 group-hover:backdrop-blur-lg">
                        <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-3 mb-3 sm:pb-4 sm:mb-4 transition-colors duration-700">
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
                            {i.category || "Plant Styling"}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                            {new Date().getFullYear()}
                          </span>
                        </div>
                        <h3 className="font-display text-xl sm:text-3xl lg:text-4xl font-medium text-white tracking-tight leading-[1.1] drop-shadow-md line-clamp-2">
                          {i.title}
                        </h3>
                        <div className="mt-3 sm:mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-medium text-white/80 uppercase tracking-widest drop-shadow-sm">
                            <MapPin className="h-3.5 w-3.5 text-white/60" /> {location}
                          </div>
                          <div className="h-8 w-8 rounded-full border border-white/30 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:border-white group-hover:text-black text-white shadow-sm">
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                );
              })}

              {items.length === 0 && (
                <div className="col-span-full rounded-3xl border border-dashed border-border bg-card p-16 text-center text-muted-foreground">
                  <Building2 className="mx-auto h-12 w-12 text-primary/40 mb-3" />
                  <p className="text-lg font-semibold text-foreground">No projects found in the portfolio.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500">
          <div 
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[32px] sm:rounded-[48px] bg-background border border-border/40 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] p-6 sm:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 p-3 rounded-full bg-secondary/20 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 z-20"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Modal Content */}
            <div className="space-y-8 sm:space-y-12">
              <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-[24px] sm:rounded-[32px] shadow-sm">
                <img
                  src={selectedProject.image || selectedProject.after || selectedProject.before}
                  alt={selectedProject.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="max-w-4xl mx-auto space-y-6 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                  <span className="rounded-full bg-transparent border border-border/80 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    {selectedProject.category || "Project Showcase"}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary/70" /> {selectedProject.location || "Hyderabad, India"}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50/50 px-4 py-1.5 rounded-full border border-emerald-100">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Completed Project
                  </span>
                </div>

                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground tracking-tight leading-[1.1]">
                  {selectedProject.title}
                </h2>

                <p className="text-lg sm:text-xl leading-[1.8] font-light text-muted-foreground max-w-3xl">
                  {selectedProject.description || "Custom botanical styling and spatial green installation designed and executed to perfection by Yogini Planters. This project focused on integrating organic life into architectural constraints, bringing warmth and vitality to the space."}
                </p>

                <div className="pt-8 sm:pt-12 mt-8 sm:mt-12 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left bg-secondary/10 p-8 rounded-[24px]">
                  <div>
                    <p className="font-display text-2xl font-medium tracking-tight text-foreground">Inspired by this space?</p>
                    <p className="text-sm font-medium text-muted-foreground mt-2">Schedule a personalized styling consultation.</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      navigate("/contact");
                    }}
                    className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                  >
                    <span>Book Consultation</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}

export { Route };
