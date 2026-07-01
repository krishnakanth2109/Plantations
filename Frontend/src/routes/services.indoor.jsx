import React, { useEffect } from "react";
import { createFileRoute, Link } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import indoor from "../assets/indoor.jpg";
import { 
  Leaf, 
  CheckCircle2, 
  Thermometer, 
  Sun, 
  Wind, 
  Layout, 
  Sofa, 
  BedDouble, 
  Utensils, 
  Bath, 
  Laptop, 
  Sparkles,
  ArrowRight
} from "lucide-react";

const Route = createFileRoute("/services/indoor")({
  head: () => ({
    meta: [
      { title: "Indoor Plant Styling — Yogini Planters" },
      { name: "description", content: "Personalized indoor plant styling planned for room temperature, lighting, AC, and lifestyle." },
      { property: "og:image", content: indoor }
    ]
  }),
  component: IndoorStylingPage
});

function IndoorStylingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const providedServices = [
    "Plant selection",
    "Space analysis",
    "Pot and planter selection",
    "Indoor styling consultation",
    "Plant placement planning",
    "Installation setup",
    "Low-maintenance plant solutions"
  ];

  const approachFactors = [
    { icon: <Thermometer className="h-5 w-5" />, label: "Room temperature" },
    { icon: <Sun className="h-5 w-5" />, label: "Natural & artificial lighting" },
    { icon: <Wind className="h-5 w-5" />, label: "Air circulation & AC" },
    { icon: <Layout className="h-5 w-5" />, label: "Space layout & usage" },
    { icon: <Sofa className="h-5 w-5" />, label: "Interior furniture" },
    { icon: <Sparkles className="h-5 w-5" />, label: "Décor style" },
  ];

  const rooms = [
    {
      title: "Living Room",
      icon: <Sofa className="h-8 w-8 text-primary" />,
      bullets: ["Sofa & furniture arrangement", "Spaciousness", "Lighting availability", "Decorative interiors", "AC environment", "Natural airflow"]
    },
    {
      title: "Bedroom",
      icon: <BedDouble className="h-8 w-8 text-indigo-500" />,
      bullets: ["Calm, relaxing atmosphere", "Air quality improvement", "Low maintenance", "Night-friendly conditions", "Soft styling concepts"]
    },
    {
      title: "Kitchen",
      icon: <Utensils className="h-8 w-8 text-orange-500" />,
      bullets: ["Heat & temperature", "Ventilation", "Humidity", "Available sunlight", "Functional kitchen layout"]
    },
    {
      title: "Bathroom",
      icon: <Bath className="h-8 w-8 text-cyan-500" />,
      bullets: ["Moisture & humidity", "Low-light conditions", "Ventilation", "Compact space styling"]
    },
    {
      title: "Workspace & Study",
      icon: <Laptop className="h-8 w-8 text-blue-500" />,
      bullets: ["Bookshelves & furniture", "Work environment", "Lighting conditions", "AC exposure", "Focus & productivity"]
    }
  ];

  return (
    <SiteLayout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={indoor} alt="Indoor Styling" className="w-full h-full object-cover scale-105 animate-in slide-in-from-bottom-4 duration-1000 ease-out" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/20" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Leaf className="h-4 w-4" /> Indoor Styling
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight text-foreground mb-8">
              Transform your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">indoor spaces</span>
            </h1>
            <p className="text-xl text-foreground/80 leading-relaxed mb-10 max-w-2xl">
              We don't simply place plants — we carefully select them based on room environment, temperature, lighting, furniture, ventilation, and the purpose of the space. Recommendations are personalized to ensure both aesthetics and long-term plant health.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:-translate-y-0.5">
                Book Consultation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* What We Provide */}
      <div className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-foreground">What We Provide</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Comprehensive end-to-end indoor plant styling services tailored to your specific needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {providedServices.map((service, idx) => (
              <div key={idx} className="group p-6 rounded-3xl bg-muted/30 border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all duration-300">
                <CheckCircle2 className="h-6 w-6 text-primary mb-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                <h3 className="font-semibold text-foreground/90">{service}</h3>
              </div>
            ))}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex flex-col justify-center">
              <h3 className="font-semibold text-primary mb-2">And much more...</h3>
              <p className="text-sm text-primary/70">Customized solutions for every unique space.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Approach */}
      <div className="py-24 bg-muted/30 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-6">Our Scientific Approach</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Plant selection is never random. We meticulously plan and select every single plant based on a rigorous analysis of your environment.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {approachFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-background border border-border/50 shadow-sm">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {factor.icon}
                    </div>
                    <span className="font-medium text-sm">{factor.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full relative">
              <div className="aspect-square max-h-[500px] rounded-[3rem] overflow-hidden shadow-2xl">
                <img src={indoor} alt="Approach" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 p-6 rounded-3xl bg-background shadow-xl border border-border max-w-xs animate-in slide-in-from-bottom-8 delay-300 duration-700">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
                    <Leaf className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Guaranteed Health</h4>
                    <p className="text-xs text-muted-foreground mt-1">Right plant for the right spot ensures longevity.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room by Room */}
      <div className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground">Room by Room Styling</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Every room serves a different purpose and has a different micro-climate. We adapt to each.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, idx) => (
              <div key={idx} className="group p-8 rounded-[2rem] bg-card border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  {React.cloneElement(room.icon, { className: "h-32 w-32" })}
                </div>
                
                <div className="relative z-10">
                  <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6 group-hover:bg-background transition-colors shadow-sm">
                    {room.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-6">{room.title}</h3>
                  <ul className="space-y-3">
                    {room.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 text-primary/60 shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            
            {/* Air Purifying Callout Card */}
            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-10 -top-10 opacity-10">
                <Wind className="h-48 w-48" />
              </div>
              <div className="relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 shadow-sm">
                  <Wind className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Air-Purifying Focus</h3>
                <p className="text-emerald-50 mb-6 text-sm leading-relaxed">
                  Beyond aesthetics, our selections actively work to improve your wellness by targeting indoor pollutants.
                </p>
                <ul className="space-y-3">
                  {["Reduce indoor pollutants", "Improve freshness", "Create calming atmosphere", "Enhance wellness & comfort"].map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3 text-emerald-50">
                      <div className="h-1.5 w-1.5 rounded-full bg-white mt-2 shrink-0" />
                      <span className="text-sm">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-primary/5 border-t border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-display font-bold mb-6">Ready to transform your interior?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Let our experts assess your space and create a thriving indoor jungle tailored just for you.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:-translate-y-0.5">
            Schedule a Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}

export { Route };
