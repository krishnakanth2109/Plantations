import React from "react";
import { Link, createFileRoute, useNavigate } from "../lib/router";
import { useEffect, useState } from "react";
import { login, useAuth } from "../lib/auth";
import { toast } from "sonner";
import logo from "../assets/logo.png";
const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in - Yogini Planters" }, { name: "description", content: "Sign in to your dashboard." }] }),
  component: Login
});
function Login() {
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (ready && user) navigate({ to: user.role === "admin" ? "/admin" : "/dashboard" });
  }, [user, ready, navigate]);
  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome, ${u.name}`);
      navigate({ to: u.role === "admin" ? "/admin" : "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  }
  return <div className="flex min-h-screen items-center justify-center bg-leaf-pattern bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="" className="h-16 w-16 rounded-full" />
          <h1 className="mt-4 font-display text-3xl text-primary">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your Yogini Planters dashboard</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs font-medium">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" required />
          </div>
          <div>
            <label className="text-xs font-medium">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" required />
          </div>
          <button disabled={submitting} type="submit" className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Back to website</Link>
        </p>
      </div>
    </div>;
}
export {
  Route
};
