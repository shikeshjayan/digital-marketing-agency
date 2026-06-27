import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar.jsx'
import NotificationDropdown from '../components/admin/NotificationDropdown.jsx'
import { getAdminProfile } from '../auth/adminAuth.js'
import { useState, useEffect } from 'react'

const resolveUrl = (path) => {
  if (!path || path.startsWith('blob:') || path.startsWith('http')) return path
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '')
  return base + path
}

export default function AdminLayout() {
  const [profile, setProfile] = useState(() => getAdminProfile())
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    function handleProfileChange() {
      setProfile(getAdminProfile())
      setImgFailed(false)
    }
    window.addEventListener('admin-profile-updated', handleProfileChange)
    return () => window.removeEventListener('admin-profile-updated', handleProfileChange)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="flex items-center justify-end px-4 sm:px-6 h-16">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>

            <div className="h-6 w-px bg-gray-200 hidden sm:block" />

            <NotificationDropdown />

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex items-center gap-2">
              {profile?.photo && !imgFailed ? (
                <img
                  src={resolveUrl(profile.photo)}
                  alt={profile?.name || 'Admin'}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {profile?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              )}
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-gray-900 leading-tight">{profile?.name || 'Admin'}</div>
                <div className="text-xs text-gray-500">{profile?.role || 'Administrator'}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
