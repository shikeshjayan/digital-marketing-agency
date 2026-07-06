import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { setAdminProfile } from "../../auth/adminAuth.js";
import useAuthStore from "../../store/authStore.js";
import apiService from "../../services/apiService.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [adminExists, setAdminExists] = useState(null);

  useEffect(() => {
    apiService
      .get("/admin/check")
      .then((res) => {
        setAdminExists(res.data?.data?.exists ?? true);
      })
      .catch((err) => {
        console.error("Failed to check admin:", err);
        setAdminExists(true);
      });
  }, []);

  const isValid = useMemo(
    () => email.trim().length > 0 && password.trim().length > 0,
    [email, password],
  );

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!isValid) {
      setError("Please enter email and password.");
      return;
    }

    try {
      const userData = await login({ email, password });
      setAdminProfile({
        name: userData?.name || email.split("@")[0],
        email: userData?.email || email,
        photo: userData?.photo || "",
        role: userData?.role || "Administrator",
      });
      toast.success("Login successful!");
      navigate("/admin", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      setError(msg);
      toast.error(msg);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.08),transparent_60%)] px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center">
      <Toaster position="top-right" richColors closeButton />
      <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-background shadow-sm lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        {/* Form — first in DOM so it appears first on mobile */}
        <div className="p-5 sm:p-6 lg:p-10">
          <div className="flex items-center gap-3 lg:hidden">
            <img
              src="/crown-99.png"
              alt="CrawlCrown Logo"
              className="h-9 w-9 rounded-lg object-contain bg-background p-0.5 shadow-sm"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-tight">CrawlCrown</p>
              <p className="text-xs text-muted">Admin Portal</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-start text-left lg:mt-0">
            <h3 className="text-xl font-semibold text-heading sm:text-2xl">Admin Login</h3>
            <p className="mt-2 text-xs text-text sm:text-sm">
              Enter your credentials to sign in.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8">
            <label className="block text-sm font-medium text-heading">
              Email
            </label>
            <input
              type="email"
              className="mt-2 w-full rounded border border-border bg-surface px-3 py-2 outline-none focus:ring-2 focus:ring-primary-light placeholder:text-muted"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
            />

            <label className="block text-sm font-medium text-heading mt-4">
              Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded border border-border bg-surface px-3 py-2 pr-16 outline-none focus:ring-2 focus:ring-primary-light placeholder:text-muted"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-sm font-medium text-muted hover:text-primary">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="mt-2 text-right">
              <Link
                to="/admin/forgot-password"
                className="text-sm text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>

            {(error || authError) && (
              <div className="mt-4 rounded border border-primary/20 bg-primary-light px-3 py-2 text-sm text-primary">
                {error || authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {!adminExists && (
            <div className="mt-4 text-center">
              <Link
                to="/admin/register"
                className="text-sm text-text hover:text-primary hover:underline">
                Don't have an account? Register
              </Link>
            </div>
          )}
        </div>

        {/* Branded panel — second in DOM, moved left on desktop via order */}
        <div className="hidden lg:order-first lg:flex lg:flex-col lg:justify-between relative overflow-hidden bg-primary px-10 py-10 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_45%)]" />
          <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <img
                  src="/crown-99.png"
                  alt="CrawlCrown Logo"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-contain bg-background p-1 shadow-sm"
                />
                <div className="min-w-0">
                  <p className="text-base font-semibold tracking-tight sm:text-lg">
                    CrawlCrown
                  </p>
                  <p className="small-text text-white/70 sm:text-sm">Admin Portal</p>
                </div>
              </div>
              <h2 className="mt-6 text-xl font-semibold leading-tight sm:text-2xl lg:text-3xl">
                Welcome back to your admin workspace
              </h2>
              <p className="mt-3 max-w-md small-text text-white/70 sm:text-sm lg:text-base">
                Manage services, projects, reviews, and client enquiries from
                one secure dashboard.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm font-medium">Secure access</p>
              <p className="mt-1 small-text text-white/70 sm:text-sm">
                Use your admin credentials to continue managing the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
