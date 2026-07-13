import axios from "axios";

// Create an axios instance with cookie support
// The httpOnly cookie is sent automatically by the browser
// In dev, use relative URL so Vite proxy forwards /api to localhost:5000
// In production, use the full VITE_API_URL (e.g. https://your-app.vercel.app/api/v1)
const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  withCredentials: true,
});

// On 401 for admin routes, redirect to login page
apiService.interceptors.response.use(
  (res) => res,
  (err) => {
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