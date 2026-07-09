import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import useAuthStore from "../../store/authStore.js";
import apiService from "../../services/apiService.js";
import useBrandSettingsStore from "../../store/brandSettingsStore.js";
import { loginSchema } from "../../utils/formSchemas.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [adminExists, setAdminExists] = useState(null);
  const { content, fetchBrandSettings } = useBrandSettingsStore();

  async function handleForgotPassword() {
    try {
      const res = await apiService.post("/admin/check-email", { email });
      if (!res.data?.data?.exists) {
        toast.error("No account found with this email address.");
        return;
      }
      navigate("/admin/forgot-password", { state: { email } });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  useEffect(() => {
    fetchBrandSettings();
    apiService
      .get("/admin/check")
      .then((res) => {
        setAdminExists(res.data?.data?.exists ?? true);
      })
      .catch((err) => {
        console.error("Failed to check admin:", err);
        setAdminExists(true);
      });
  }, [fetchBrandSettings]);

  async function onSubmit(e) {
    e.preventDefault();
    setFieldErrors({});

    try {
      loginSchema.validateSync(
        { email, password },
        { abortEarly: false },
      );
    } catch (err) {
      const errMap = {};
      err.inner.forEach((e) => {
        errMap[e.path] = e.message;
      });
      setFieldErrors(errMap);
      return;
    }

    try {
      const userData = await login({ email, password });
      toast.success("Login successful!");
      navigate("/admin", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      toast.error(msg);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--color-primary)_8%,transparent),transparent_60%)] px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center">
      <Toaster position="top-right" richColors closeButton />
      <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-background shadow-sm lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        {/* Form — first in DOM so it appears first on mobile */}
        <div className="p-5 sm:p-6 lg:p-10">
          <Link to="/" className="flex items-center gap-3 lg:hidden cursor-pointer">
            <img
              src={content?.brand?.logo || "/crown-99.png"}
              alt={`${content?.brand?.name || "CrawlCrown"} Logo`}
              className="h-9 w-9 rounded-lg object-contain bg-background p-0.5 shadow-sm"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-tight">{content?.brand?.name || "CrawlCrown"}</p>
              <p className="text-xs text-muted">Admin Portal</p>
            </div>
          </Link>

          <div className="mt-6 flex flex-col items-start text-left lg:mt-0">
            <h3 className="text-xl font-semibold text-heading sm:text-2xl">Admin Login</h3>
            <p className="mt-2 text-xs text-text sm:text-sm">
              Enter your credentials to sign in.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8" noValidate>
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
            {fieldErrors.email && (
              <span className="text-xs text-primary mt-1 block">
                {fieldErrors.email}
              </span>
            )}

            <label className="block text-sm font-medium text-heading mt-4">
              Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded border border-border bg-surface px-3 py-2 pr-20 outline-none focus:ring-2 focus:ring-primary-light placeholder:text-muted [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-muted hover:text-primary">
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-4 w-4" />
              </button>
            </div>
            {fieldErrors.password && (
              <span className="text-xs text-primary mt-1 block">
                {fieldErrors.password}
              </span>
            )}

            <div className="mt-2 text-right">
              {email.trim().length > 0 ? (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:underline cursor-pointer">
                  Forgot Password?
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => toast.error("Please enter your email first.")}
                  className="text-sm text-muted cursor-pointer hover:text-muted/80">
                  Forgot Password?
                </button>
              )}
            </div>

            {/* Remember Me */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="h-4 w-4 rounded border-border accent-primary-hover focus:ring-primary-hover cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-text cursor-pointer select-none">
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <p className="mt-4 text-xs text-muted text-center leading-snug">
              By logging in, you agree to our{" "}
              <a
                href="/internal-data-policies"
                target="_blank"
                className="text-primary underline hover:text-primary-hover">
                Internal Data Policies
              </a>
              .
            </p>
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
        <div className="hidden lg:order-first lg:flex lg:flex-col relative overflow-hidden bg-primary px-10 py-10 text-white">
          <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

          <div className="flex-1">
            <Link to="/" className="flex flex-wrap items-center gap-3 cursor-pointer">
              <img
                src={content?.brand?.logo || "/crown-99.png"}
                alt={`${content?.brand?.name || "CrawlCrown"} Logo`}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-contain bg-background p-1 shadow-sm"
              />
              <div className="min-w-0">
                <p className="text-base font-semibold tracking-tight sm:text-lg">
                  {content?.brand?.name || "CrawlCrown"}
                </p>
                <p className="small-text text-white/70 sm:text-sm">Admin Portal</p>
              </div>
            </Link>
            <h2 className="mt-6 text-xl font-semibold leading-tight sm:text-2xl lg:text-3xl">
              Welcome back to your admin workspace
            </h2>
            <p className="mt-3 max-w-md small-text text-white/70 sm:text-sm lg:text-base">
              Manage services, projects, reviews, and client enquiries from
              one secure dashboard.
            </p>
          </div>

          <div className="rounded-md border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-sm font-medium">Secure access</p>
            <p className="mt-1 small-text text-white/70 sm:text-sm">
              Use your admin credentials to continue managing the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
