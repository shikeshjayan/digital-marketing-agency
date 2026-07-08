// Shared utility functions used across controllers and models

// Generate a URL-safe slug from a name string
export function generateSlug(name) {
  return String(name ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Parse a JSON string field (e.g. from FormData) into an array; returns fallback on failure
export function parseJsonField(value, fallback = []) {
  if (!value) return fallback;
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// Parse a JSON string field (e.g. from FormData) into an object; returns fallback on failure
export function parseJsonObject(value, fallback = {}) {
  if (!value) return fallback;
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
}

// Escape special regex characters to prevent ReDoS attacks
export function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
