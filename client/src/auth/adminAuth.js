const ADMIN_KEY = 'adminProfile'
export const ADMIN_PROFILE_EVENT = 'admin-profile-updated'

export function getAdminProfile() {
  try {
    const raw = localStorage.getItem(ADMIN_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setAdminProfile(profile) {
  try {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(profile))
    window.dispatchEvent(new Event(ADMIN_PROFILE_EVENT))
  } catch {
    // ignore
  }
}

export function clearAdminProfile() {
  try {
    localStorage.removeItem(ADMIN_KEY)
  } catch {
    // ignore
  }
}
