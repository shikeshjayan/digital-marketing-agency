// Simple admin login token stored in the browser (demo only — not for production security)
const TOKEN_KEY = 'adminToken'

export function getAdminToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAdminToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Storage may be blocked in private mode — fail silently
  }
}

export function clearAdminToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore
  }
}
