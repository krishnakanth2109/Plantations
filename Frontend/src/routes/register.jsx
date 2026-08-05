import React, { useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "../lib/router";
import { register, useAuth } from "../lib/auth";
import { toast } from "sonner";
import logo from "../assets/logo.png";
import { Leaf, Sparkles, ShieldCheck, Eye, EyeOff, ArrowRight } from "lucide-react";

const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — Yogini Planters" },
      { name: "description", content: "Create your Yogini Planters dashboard account." }
    ]
  }),
  component: Register
});

function Register() {
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) navigate({ to: (user.role === "superadmin" || user.role === "admin") ? "/superadmin" : "/dashboard" });
  }, [user, ready, navigate]);

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await register({ name, email, phone, address, password });
      toast.success(`Welcome, ${created.name}`);
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
        
        {/* Left Editorial Branding Section */}
        <section className="hidden lg:block space-y-8">
          <div className="max-w-xl space-y-6">
            <div className="group relative flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-background shadow-xl p-1 overflow-hidden transition-all duration-500 hover:scale-105">
              <img src={logo} alt="Yogini Planters" className="h-full w-full rounded-full object-cover" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Biophilic Living Portal
            </div>

            <h1 className="font-display text-5xl lg:text-6xl font-bold leading-[1.12] text-primary tracking-tight">
              Bring your green spaces into a calmer care rhythm.
            </h1>

            <p className="text-base lg:text-lg leading-relaxed text-muted-foreground font-normal">
              Create your customer account to schedule spatial light consultations, request plant doctor visits, and manage personalized maintenance plans.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs font-semibold text-foreground shadow-sm">
                <Leaf className="h-3.5 w-3.5 text-primary" /> Indoor Styling
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs font-semibold text-foreground shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Plant Doctor Care
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs font-semibold text-foreground shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Maintenance Plans
              </span>
            </div>
          </div>
        </section>

        {/* Right Registration Card Form */}
        <section className="w-full rounded-[32px] border border-border/60 bg-card/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-primary/5 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center lg:text-left space-y-1">
            <div className="lg:hidden mb-4 flex justify-center">
              <div className="h-16 w-16 rounded-full border border-primary/20 bg-background shadow-md overflow-hidden p-0.5">
                <img src={logo} alt="Yogini Planters" className="h-full w-full rounded-full object-cover" />
              </div>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Create Account
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-normal">
              Start your Yogini Planters customer portal access.
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">
            {/* Outlined Notch Floating Full Name */}
            <div className="relative">
              <input
                id="regName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder=" "
                className="peer w-full rounded-2xl border border-input bg-transparent px-4 py-3.5 text-sm font-semibold text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                required
              />
              <label
                htmlFor="regName"
                className="absolute left-3.5 -top-2.5 z-10 px-1.5 bg-background text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-placeholder-shown:px-0 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-muted-foreground/60 peer-focus:-top-2.5 peer-focus:left-3.5 peer-focus:px-1.5 peer-focus:bg-background peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary"
              >
                Full Name
              </label>
            </div>

            {/* Outlined Notch Floating Email Address */}
            <div className="relative">
              <input
                id="regEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder=" "
                className="peer w-full rounded-2xl border border-input bg-transparent px-4 py-3.5 text-sm font-semibold text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                required
              />
              <label
                htmlFor="regEmail"
                className="absolute left-3.5 -top-2.5 z-10 px-1.5 bg-background text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-placeholder-shown:px-0 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-muted-foreground/60 peer-focus:-top-2.5 peer-focus:left-3.5 peer-focus:px-1.5 peer-focus:bg-background peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary"
              >
                Email Address
              </label>
            </div>

            {/* Outlined Notch Floating Phone Number */}
            <div className="relative">
              <input
                id="regPhone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder=" "
                className="peer w-full rounded-2xl border border-input bg-transparent px-4 py-3.5 text-sm font-semibold text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
              />
              <label
                htmlFor="regPhone"
                className="absolute left-3.5 -top-2.5 z-10 px-1.5 bg-background text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-placeholder-shown:px-0 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-muted-foreground/60 peer-focus:-top-2.5 peer-focus:left-3.5 peer-focus:px-1.5 peer-focus:bg-background peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary"
              >
                Phone Number (Optional)
              </label>
            </div>

            {/* Outlined Notch Floating Address */}
            <div className="relative">
              <textarea
                id="regAddress"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder=" "
                className="peer w-full rounded-2xl border border-input bg-transparent px-4 py-3.5 text-sm font-semibold text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm resize-none"
              />
              <label
                htmlFor="regAddress"
                className="absolute left-3.5 -top-2.5 z-10 px-1.5 bg-background text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-placeholder-shown:px-0 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-muted-foreground/60 peer-focus:-top-2.5 peer-focus:left-3.5 peer-focus:px-1.5 peer-focus:bg-background peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary"
              >
                Address (Optional)
              </label>
            </div>

            {/* Outlined Notch Floating Password */}
            <div className="relative">
              <input
                id="regPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                minLength={6}
                placeholder=" "
                className="peer w-full rounded-2xl border border-input bg-transparent px-4 py-3.5 pr-11 text-sm font-semibold text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                required
              />
              <label
                htmlFor="regPassword"
                className="absolute left-3.5 -top-2.5 z-10 px-1.5 bg-background text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-placeholder-shown:px-0 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-muted-foreground/60 peer-focus:-top-2.5 peer-focus:left-3.5 peer-focus:px-1.5 peer-focus:bg-background peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary"
              >
                Password (Min. 6 chars)
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              disabled={submitting}
              type="submit"
              className="w-full rounded-full bg-primary py-4 text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <span>{submitting ? "Creating account..." : "Create Account"}</span>
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Card Footer Links */}
          <div className="mt-8 pt-6 border-t border-border/40 text-center space-y-3">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-primary hover:underline">
                Sign in
              </Link>
            </p>

            <p className="text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors font-medium">
                &larr; Back to main website
              </Link>
            </p>
          </div>

        </section>
      </div>
    </div>
  );
}

export { Route };
