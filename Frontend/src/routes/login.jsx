import React from "react";
import { Link, createFileRoute, useNavigate } from "../lib/router";
import { useEffect, useState } from "react";
import { login, useAuth } from "../lib/auth";
import { forgotPassword } from "../api";
import { toast } from "sonner";
import logo from "../assets/logo.png";
import { Eye, EyeOff } from "lucide-react";

const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in - Yogini Planters" }, { name: "description", content: "Sign in to your dashboard." }] }),
  component: Login
});

function Login() {
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  async function handleForgotPasswordSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await forgotPassword(forgotEmail);
      toast.success("If an account exists with that email, a password reset link has been sent.");
      setIsForgotPassword(false);
      setForgotEmail("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send reset link");
    } finally {
      setSubmitting(false);
    }
  }

  return <div className="flex min-h-screen items-center justify-center bg-leaf-pattern bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="" className="h-16 w-16 rounded-full" />
          <h1 className="mt-4 font-display text-3xl text-primary transition-all duration-300">
            {isForgotPassword ? "Reset password" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground transition-all duration-300">
            {isForgotPassword ? "Enter your email to receive a password reset link" : "Sign in to your Yogini Planters dashboard"}
          </p>
        </div>

        {isForgotPassword ? (
          <form onSubmit={handleForgotPasswordSubmit} className="mt-8 space-y-4 animate-in slide-in-from-bottom duration-300">
            <div>
              <label className="text-xs font-medium">Email Address</label>
              <input
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                type="email"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              disabled={submitting}
              type="submit"
              className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition"
            >
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>
            <p className="mt-4 text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setForgotEmail("");
                }}
                className="font-medium text-primary hover:underline outline-none"
              >
                Back to Sign in
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4 animate-in slide-in-from-bottom duration-300">
            <div>
              <label className="text-xs font-medium">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-xs font-medium text-primary hover:underline outline-none"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative mt-1">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-3 pr-10 text-sm outline-none transition focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition hover:text-primary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              disabled={submitting}
              type="submit"
              className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">Back to website</Link>
        </p>
      </div>
    </div>;
}

export {
  Route
};
