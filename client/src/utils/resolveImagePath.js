import imageUrl from "./imageUrl.js";

export default function resolveImagePath(path) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;

  const isDev = import.meta.env.DEV;
  const hasApiUrlEnv = !!import.meta.env.VITE_API_URL;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (isDev && !hasApiUrlEnv) {
    return `http://localhost:5000${cleanPath}`;
  }
  return imageUrl(cleanPath);
}
