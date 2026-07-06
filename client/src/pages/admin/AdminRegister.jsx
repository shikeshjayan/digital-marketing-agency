import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAdminProfile } from "../../auth/adminAuth.js";
import useAuthStore from "../../store/authStore.js";
import apiService from "../../services/apiService.js";

export default function AdminRegister() {
  const navigate = useNavigate();
  const { register, loading, error: authError } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    apiService
      .get("/admin/check")
      .then((res) => {
        if (res.data?.data?.exists) {
          setBlocked(true);
          navigate("/admin/login", { replace: true });
        }
      })
      .catch(() => {});
  }, [navigate]);

  const isValid = useMemo(
    () =>
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      password.trim().length >= 6,
    [name, email, password],
  );

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!isValid) {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
      } else {
        setError("Please fill in all fields.");
      }
      return;
    }

    try {
      const userData = await register({ name, email, password });
      setAdminProfile({
        name: userData?.name || name,
        email: userData?.email || email,
        photo: userData?.photo || "",
        role: userData?.role || "Administrator",
      });
      toast.success("Registration successful!");
      navigate("/admin", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Registration failed";
      setError(msg);
      toast.error(msg);
    }
  }

  if (blocked) return null;

  return (
    <div className="py-10 max-w-md mx-auto">
      <div className="text-center">
        <div className="w-14 h-14 rounded bg-primary mx-auto text-white flex items-center justify-center font-bold">
          A
        </div>
        <h2 className="mt-4 text-xl font-bold text-heading">
          Admin Registration
        </h2>
        <p className="mt-2 text-sm text-text">Create your admin account.</p>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-8 bg-background border border-border rounded p-5 shadow-xs">
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

        <label className="block text-sm font-medium text-heading mt-4">
          Password
        </label>
        <input
          type="password"
          className="mt-2 w-full rounded border border-border bg-surface px-3 py-2 outline-none focus:ring-2 focus:ring-primary-light placeholder:text-muted"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />

        {(error || authError) && (
          <div className="mt-4 text-sm text-primary">{error || authError}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded bg-primary text-white py-2.5 font-semibold hover:bg-primary-hover transition disabled:opacity-50 cursor-pointer">
          {loading ? "Creating Account..." : "Register"}
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
  );
}
