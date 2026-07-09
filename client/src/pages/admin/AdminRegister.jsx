import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import useAuthStore from "../../store/authStore.js";
import apiService from "../../services/apiService.js";
import useBrandSettingsStore from "../../store/brandSettingsStore.js";
import { registerSchema } from "../../utils/formSchemas.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function AdminRegister() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [consent, setConsent] = useState(false);
  const { content, fetchBrandSettings } = useBrandSettingsStore();

  useEffect(() => {
    fetchBrandSettings();
    apiService
      .get("/admin/check")
      .then((res) => {
        if (res.data?.data?.exists) {
          navigate("/admin/login", { replace: true });
        }
      })
      .catch(() => {});
  }, [navigate, fetchBrandSettings]);

  const matchProgress = useMemo(() => {
    if (!confirmPassword) return 0;
    if (password === confirmPassword) return 100;
    let matching = 0;
    const minLen = Math.min(password.length, confirmPassword.length);
    for (let i = 0; i < minLen; i++) {
      if (password[i] === confirmPassword[i]) matching++;
      else break;
    }
    const maxLen = Math.max(password.length, confirmPassword.length, 1);
    return Math.round((matching / maxLen) * 100);
  }, [password, confirmPassword]);

  async function onSubmit(e) {
    e.preventDefault();
    setFieldErrors({});

    try {
      registerSchema.validateSync(
        { username: name, email, password, confirmPassword, consent },
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
      const userData = await register({ name, email, password });
      toast.success("Registration successful!");
      navigate("/admin/login", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Registration failed";
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
            <h3 className="text-xl font-semibold text-heading sm:text-2xl">Admin Registration</h3>
            <p className="mt-2 text-xs text-text sm:text-sm">
              Create your admin account to get started.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8" noValidate>
            <label className="block text-sm font-medium text-heading">
              Username
            </label>
            <input
              type="text"
              className="mt-2 w-full rounded border border-border bg-surface px-3 py-2 outline-none focus:ring-2 focus:ring-primary-light placeholder:text-muted"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. admin"
            />
            {fieldErrors.username && (
              <span className="text-xs text-primary mt-1 block">
                {fieldErrors.username}
              </span>
            )}

            <label className="block text-sm font-medium text-heading mt-4">
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
                placeholder="At least 6 characters"
                autoComplete="new-password"
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

            <label className="block text-sm font-medium text-heading mt-4">
              Confirm Password
            </label>
            <div className="relative mt-2">
              <input
                type={confirmShowPassword ? "text" : "password"}
                className="w-full rounded border border-border bg-surface px-3 py-2 pr-20 outline-none focus:ring-2 focus:ring-primary-light placeholder:text-muted [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setConfirmShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-muted hover:text-primary">
                <FontAwesomeIcon icon={confirmShowPassword ? faEyeSlash : faEye} className="h-4 w-4" />
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <span className="text-xs text-primary mt-1 block">
                {fieldErrors.confirmPassword}
              </span>
            )}

            {/* Password Match Progress Bar */}
            {confirmPassword.length > 0 && (
              <div className="mt-4">
                <div className="h-1 w-full rounded-full bg-border overflow-hidden">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      matchProgress === 100 ? "bg-success" : "bg-primary"
                    }`}
                    style={{ width: `${matchProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Consent Checkbox */}
            <div className="mt-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  disabled={loading}
                  className="mt-1 h-4 w-4 rounded border-border accent-primary-hover focus:ring-primary-hover cursor-pointer"
                />
                <label
                  htmlFor="consent"
                  className="text-sm text-text leading-snug cursor-pointer">
                  I agree to the{" "}
                  <a
                    href="/internal-data-policies"
                    target="_blank"
                    className="text-primary underline hover:text-primary-hover">
                    Internal Data Policies
                  </a>
                  .
                </label>
              </div>
              {fieldErrors.consent && (
                <span className="text-xs text-primary mt-1 block">
                  {fieldErrors.consent}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/admin/login"
              className="text-sm text-text hover:text-primary hover:underline">
              Already have an account? Sign In
            </Link>
          </div>
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
              Create your admin account
            </h2>
            <p className="mt-3 max-w-md small-text text-white/70 sm:text-sm lg:text-base">
              Set up the first administrator to start managing services, projects, reviews, and client enquiries from one secure dashboard.
            </p>
          </div>

          <div className="rounded-md border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-sm font-medium">Secure setup</p>
            <p className="mt-1 small-text text-white/70 sm:text-sm">
              Only one admin account can exist. Your credentials will be the sole access to the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
