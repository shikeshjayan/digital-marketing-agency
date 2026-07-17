import axios from "axios";
import { extractError } from "../utils/errorMessages.js";

// Create an axios instance with cookie support
// The httpOnly cookie is sent automatically by the browser
// In dev, use relative URL so Vite proxy forwards /api to localhost:5000
// In production, use the full VITE_API_URL (e.g. https://your-app.vercel.app/api/v1)
const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  withCredentials: true,
});

// Transform all errors with user-friendly messages + redirect 401 admin routes
apiService.interceptors.response.use(
  (res) => res,
  (err) => {
    // Attach a user-friendly message so stores/pages can use it
    err.friendlyMessage = extractError(err);

    // Override the backend message so stores' existing pattern picks it up
    if (err.response?.data) {
      err.response.data.message = err.friendlyMessage;
    } else if (!err.response) {
      err.message = err.friendlyMessage;
    }

    // On 401 for admin routes, redirect to login page
    if (
      err.response?.status === 401 &&
      err.config?.url?.startsWith('/admin/') &&
      !err.config?.url?.includes('/admin/login') &&
      !err.config?.url?.includes('/admin/register')
    ) {
      window.location.href = "/admin/login";
    }

    return Promise.reject(err);
  },
);

export default apiService;