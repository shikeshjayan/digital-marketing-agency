const API_BASE = (import.meta.env.VITE_API_URL || "/api/v1").replace(/\/api\/v1\/?$/, "");

export default function imageUrl(path) {
  if (!path) return "";
  if (path.startsWith("data:") || path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}
