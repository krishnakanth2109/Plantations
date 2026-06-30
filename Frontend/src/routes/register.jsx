import React from "react";
import { Link, createFileRoute, useNavigate } from "../lib/router";
import { useEffect, useState } from "react";
import { register, useAuth } from "../lib/auth";
import { toast } from "sonner";
import logo from "../assets/logo.png";
import { Leaf, Sparkles } from "lucide-react";
const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account - Yogini Planters" },
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
  return <div className="min-h-screen bg-leaf-pattern bg-background px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <img src={logo} alt="Yogini Planters" className="h-20 w-20 rounded-full object-cover" />
            <h1 className="mt-8 font-display text-6xl leading-tight text-primary">
              Bring your plants into a calmer care rhythm.
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Create your dashboard to book consultations, track wellness tickets, and manage plant maintenance plans.
            </p>
            <div className="mt-8 flex gap-3 text-sm text-primary">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2">
                <Leaf className="h-4 w-4" /> Styling
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2">
                <Sparkles className="h-4 w-4" /> Wellness
              </span>
            </div>
          </div>
        </section>

        <section className="w-full rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <div className="text-center lg:text-left">
            <img src={logo} alt="" className="mx-auto h-14 w-14 rounded-full lg:mx-0" />
            <h2 className="mt-4 font-display text-3xl text-primary">Create account</h2>
            <p className="mt-1 text-sm text-muted-foreground">Start your Yogini Planters customer dashboard.</p>
          </div>

          <form onSubmit={submit} className="mt-8 grid gap-4">
            <div>
              <label className="text-xs font-medium">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" required />
            </div>
            <div>
              <label className="text-xs font-medium">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" required />
            </div>
            <div>
              <label className="text-xs font-medium">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-medium">Address</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="mt-1 w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-medium">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={6} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" required />
            </div>
            <button disabled={submitting} type="submit" className="mt-2 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>;
}
export {
  Route
};
