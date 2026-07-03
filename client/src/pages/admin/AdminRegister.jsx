import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    apiService.get("/admin/check")
      .then((res) => {
        if (res.data?.data?.exists) {
          setBlocked(true);
          navigate("/admin/login", { replace: true });
        }
      })
      .catch(() => {})
  }, [navigate]);

  const isValid = useMemo(
    () => name.trim().length > 0 && email.trim().length > 0 && password.trim().length >= 6,
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
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    }
  }

  if (blocked) return null;

  return (
    <div className="py-10 max-w-md mx-auto">
      <div className="text-center">
        <div className="w-14 h-14 rounded bg-primary mx-auto text-white flex items-center justify-center font-bold">
          A
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">Admin Registration</h2>
        <p className="mt-2 text-sm text-gray-600">Create your admin account.</p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 bg-white border border-gray-200 rounded p-5 shadow-xs">
        <label className="block text-sm font-medium text-gray-800">Username</label>
        <input
          type="text"
          className="mt-2 w-full rounded border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. admin"
        />

        <label className="block text-sm font-medium text-gray-800 mt-4">Email</label>
        <input
          type="email"
          className="mt-2 w-full rounded border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
        />

        <label className="block text-sm font-medium text-gray-800 mt-4">Password</label>
        <input
          type="password"
          className="mt-2 w-full rounded border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />

        {(error || authError) && <div className="mt-4 text-sm text-red-600">{error || authError}</div>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded bg-primary text-white py-2.5 font-semibold hover:bg-primary-hover transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link to="/admin/login" className="text-sm text-gray-600 hover:text-red-600 hover:underline">
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  );
}
