import React, { useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "../lib/router";
import { login, useAuth } from "../lib/auth";
import { forgotPassword } from "../api";
import { toast } from "sonner";
import logo from "../assets/logo.png";
import { Eye, EyeOff, Sparkles, Leaf, Sprout, ArrowRight, Lock, Mail, ChevronLeft } from "lucide-react";

const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Yogini Planters" }, { name: "description", content: "Sign in to your Yogini Planters dashboard." }] }),
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
    if (ready && user) navigate({ to: (user.role === "superadmin" || user.role === "admin") ? "/superadmin" : "/dashboard" });
  }, [user, ready, navigate]);

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome, ${u.name}`);
      navigate({ to: (u.role === "superadmin" || u.role === "admin") ? "/superadmin" : "/dashboard" });
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

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-[32px] border border-border/60 bg-card/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-primary/5 animate-in fade-in zoom-in-95 duration-500">

        {/* Header with Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="group relative mb-5 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border border-primary/20 bg-background shadow-xl p-1 overflow-hidden transition-all duration-500 hover:scale-105 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 rounded-full pointer-events-none" />
            <img src={logo} alt="Yogini Planters" className="h-full w-full rounded-full object-cover relative z-10" />
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground transition-all duration-300">
            {isForgotPassword ? "Reset Password" : "Welcome Back"}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground transition-all duration-300 font-normal">
            {isForgotPassword ? "Enter your email to receive a password reset link" : "Sign in to your Yogini Planters dashboard"}
          </p>
        </div>

        {/* FORGOT PASSWORD FORM */}
        {isForgotPassword ? (
          <form onSubmit={handleForgotPasswordSubmit} className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Outlined Notch Floating Email Input */}
            <div className="relative">
              <input
                id="forgotEmail"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                type="email"
                placeholder=" "
                className="peer w-full rounded-2xl border border-input bg-transparent px-4 py-3.5 text-sm font-semibold text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                required
              />
              <label
                htmlFor="forgotEmail"
                className="absolute left-3.5 -top-2.5 z-10 px-1.5 bg-background text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-placeholder-shown:px-0 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-muted-foreground/60 peer-focus:-top-2.5 peer-focus:left-3.5 peer-focus:px-1.5 peer-focus:bg-background peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary"
              >
                Email Address
              </label>
            </div>

            <button
              disabled={submitting}
              type="submit"
              className="w-full rounded-full bg-primary py-4 text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <span>{submitting ? "Sending..." : "Send Reset Link"}</span>
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setForgotEmail("");
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline outline-none"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Back to Sign in</span>
              </button>
            </div>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={submit} className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Outlined Notch Floating Email Input */}
            <div className="relative">
              <input
                id="loginEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder=" "
                className="peer w-full rounded-2xl border border-input bg-transparent px-4 py-3.5 text-sm font-semibold text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                required
              />
              <label
                htmlFor="loginEmail"
                className="absolute left-3.5 -top-2.5 z-10 px-1.5 bg-background text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-placeholder-shown:px-0 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-muted-foreground/60 peer-focus:-top-2.5 peer-focus:left-3.5 peer-focus:px-1.5 peer-focus:bg-background peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary"
              >
                Email Address
              </label>
            </div>

            {/* Outlined Notch Floating Password Input */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  id="loginPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  className="peer w-full rounded-2xl border border-input bg-transparent px-4 py-3.5 pr-11 text-sm font-semibold text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                  required
                />
                <label
                  htmlFor="loginPassword"
                  className="absolute left-3.5 -top-2.5 z-10 px-1.5 bg-background text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-placeholder-shown:px-0 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-muted-foreground/60 peer-focus:-top-2.5 peer-focus:left-3.5 peer-focus:px-1.5 peer-focus:bg-background peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary"
                >
                  Password
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

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-xs font-semibold text-primary hover:underline outline-none"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              disabled={submitting}
              type="submit"
              className="w-full rounded-full bg-primary py-4 text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <span>{submitting ? "Signing in..." : "Sign in to Dashboard"}</span>
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        )}

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-border/40 text-center space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            New to Yogini Planters?{" "}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Create an account
            </Link>
          </p>

          <p className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors font-medium">
              &larr; Back to main website
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export { Route };
