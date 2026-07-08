import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import apiService from "../../services/apiService.js";
import useBrandSettingsStore from "../../store/brandSettingsStore.js";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP + new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const { content, fetchBrandSettings } = useBrandSettingsStore();

  useEffect(() => {
    fetchBrandSettings();
  }, [fetchBrandSettings]);

  const isEmailValid = useMemo(() => email.trim().length > 0, [email]);

  const isResetValid = useMemo(
    () =>
      otp.trim().length === 6 &&
      newPassword.trim().length >= 6 &&
      newPassword === confirmPassword,
    [otp, newPassword, confirmPassword],
  );

  async function onSendOTP(e) {
    e.preventDefault();
    setError(null);

    if (!isEmailValid) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.post("/admin/forgot-password", { email });
      setOtpToken(res.data?.data?.otpToken || "");
      setStep(2);
      setSuccess("OTP sent to your email. Check your inbox.");
      toast.success("OTP sent to your email. Check your inbox.");
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to send OTP";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function onResetPassword(e) {
    e.preventDefault();
    setError(null);

    if (!isResetValid) {
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
      } else if (newPassword.length < 6) {
        setError("Password must be at least 6 characters.");
      } else {
        setError("Please enter a valid 6-digit OTP.");
      }
      return;
    }

    setLoading(true);
    try {
      await apiService.post("/admin/verify-otp", {
        otpToken,
        otp: otp.trim(),
        newPassword,
      });
      setSuccess("Password reset successful! Redirecting to login...");
      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/admin/login", { replace: true }), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Reset failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--color-primary)_8%,transparent),transparent_60%)] px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center">
      <Toaster position="top-right" richColors closeButton />
      <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-background shadow-sm lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        {/* Form — first in DOM so it appears first on mobile */}
        <div className="p-5 sm:p-6 lg:p-10">
          <div className="flex items-center gap-3 lg:hidden">
            <img
              src={content?.brand?.logo || "/crown-99.png"}
              alt={`${content?.brand?.name || "CrawlCrown"} Logo`}
              className="h-9 w-9 rounded-lg object-contain bg-background p-0.5 shadow-sm"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-tight">{content?.brand?.name || "CrawlCrown"}</p>
              <p className="text-xs text-muted">Admin Portal</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-start text-left lg:mt-0">
            <h3 className="text-xl font-semibold text-heading sm:text-2xl">
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </h3>
            <p className="mt-2 text-xs text-text sm:text-sm">
              {step === 1
                ? "Enter your email to receive a one-time password."
                : `Enter the OTP sent to ${email}`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={onSendOTP} className="mt-8">
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

              {error && (
                <div className="mt-4 rounded border border-primary/20 bg-primary-light px-3 py-2 text-sm text-primary">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 rounded border border-success/20 bg-success/10 px-3 py-2 small-text text-success">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={onResetPassword} className="mt-8">
              <label className="block text-sm font-medium text-heading">
                OTP Code
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded border border-border bg-surface px-3 py-2 outline-none focus:ring-2 focus:ring-primary-light text-center tracking-widest font-headings subheading"
                placeholder="000000"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
              />

              <label className="block text-sm font-medium text-heading mt-4">
                New Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full rounded border border-border bg-surface px-3 py-2 pr-16 outline-none focus:ring-2 focus:ring-primary-light placeholder:text-muted"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-sm font-medium text-muted hover:text-primary">
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>

              <label className="block text-sm font-medium text-heading mt-4">
                Confirm Password
              </label>
              <input
                type="password"
                className="mt-2 w-full rounded border border-border bg-surface px-3 py-2 outline-none focus:ring-2 focus:ring-primary-light placeholder:text-muted"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />

              {error && (
                <div className="mt-4 rounded border border-primary/20 bg-primary-light px-3 py-2 text-sm text-primary">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 rounded border border-success/20 bg-success/10 px-3 py-2 small-text text-success">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError(null);
                  setSuccess("");
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="mt-3 w-full rounded-lg bg-surface py-2.5 font-semibold text-text transition hover:bg-border cursor-pointer">
                Back to Email
              </button>
            </form>
          )}

          <div className="mt-4 text-center">
            <Link
              to="/admin/login"
              className="text-sm text-text hover:text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </div>

        {/* Branded panel — second in DOM, moved left on desktop via order */}
        <div className="hidden lg:order-first lg:flex lg:flex-col lg:justify-between relative overflow-hidden bg-primary px-10 py-10 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,white_20%,transparent),transparent_45%)]" />
          <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <div>
              <div className="flex flex-wrap items-center gap-3">
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
              </div>
              <h2 className="mt-6 text-xl font-semibold leading-tight sm:text-2xl lg:text-3xl">
                {step === 1
                  ? "Forgot your password?"
                  : "Reset your password"}
              </h2>
              <p className="mt-3 max-w-md small-text text-white/70 sm:text-sm lg:text-base">
                {step === 1
                  ? "No worries — enter your email and we'll send you a one-time code to regain access."
                  : "Enter the verification code and set a new password to secure your account."}
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm font-medium">Secure reset</p>
              <p className="mt-1 small-text text-white/70 sm:text-sm">
                The OTP expires shortly. Check your inbox and follow the steps
                to restore access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
