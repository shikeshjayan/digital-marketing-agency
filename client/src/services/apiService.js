import axios from "axios";

// Create an axios instance with cookie support
// The httpOnly cookie is sent automatically by the browser
const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

// On 401, redirect to login page (skip for login/register requests)
apiService.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.includes('/admin/login') && !err.config?.url?.includes('/admin/register')) {
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  },
);

export default apiService;