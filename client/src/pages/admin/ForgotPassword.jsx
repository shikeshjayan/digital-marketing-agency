import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../../services/apiService.js";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP + new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpToken, setOtpToken] = useState("");

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
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to send OTP");
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
      setTimeout(() => navigate("/admin/login", { replace: true }), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-10 max-w-md mx-auto">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-600 mx-auto text-white flex items-center justify-center font-bold">
          A
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {step === 1
            ? "Enter your email to receive a one-time password."
            : `Enter the OTP sent to ${email}`}
        </p>
      </div>

      {step === 1 ? (
        <form
          onSubmit={onSendOTP}
          className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <label className="block text-sm font-medium text-gray-800">
            Email Address
          </label>
          <input
            type="email"
            className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            autoComplete="email"
          />

          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
          {success && <div className="mt-4 text-sm text-green-600">{success}</div>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-red-600 text-white py-2.5 font-semibold hover:bg-red-500 transition disabled:opacity-50 cursor-pointer">
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={onResetPassword}
          className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <label className="block text-sm font-medium text-gray-800">
            OTP Code
          </label>
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200 text-center tracking-widest font-mono text-lg"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
          />

          <label className="block text-sm font-medium text-gray-800 mt-4">
            New Password
          </label>
          <input
            type="password"
            className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />

          <label className="block text-sm font-medium text-gray-800 mt-4">
            Confirm Password
          </label>
          <input
            type="password"
            className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
          {success && <div className="mt-4 text-sm text-green-600">{success}</div>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-red-600 text-white py-2.5 font-semibold hover:bg-red-500 transition disabled:opacity-50 cursor-pointer">
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => { setStep(1); setError(null); setSuccess(""); setOtp(""); setNewPassword(""); setConfirmPassword(""); }}
            className="mt-3 w-full rounded-xl bg-gray-100 text-gray-700 py-2.5 font-semibold hover:bg-gray-200 transition cursor-pointer">
            Back to Email
          </button>
        </form>
      )}

      <div className="mt-4 text-center">
        <Link
          to="/admin/login"
          className="text-sm text-gray-600 hover:text-red-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
