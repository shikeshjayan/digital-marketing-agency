import { Outlet, Link } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar.jsx'
import NotificationDropdown from '../components/admin/NotificationDropdown.jsx'
import { getAdminProfile } from '../auth/adminAuth.js'
import { useState, useEffect } from 'react'

const resolveUrl = (path) => {
  if (!path || path.startsWith('blob:') || path.startsWith('http')) return path
  const base = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/api\/v1\/?$/, '')
  return base + path
}

export default function AdminLayout() {
  const [profile, setProfile] = useState(() => getAdminProfile())
  const [imgFailed, setImgFailed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    function handleProfileChange() {
      setProfile(getAdminProfile())
      setImgFailed(false)
    }
    window.addEventListener('admin-profile-updated', handleProfileChange)
    return () => window.removeEventListener('admin-profile-updated', handleProfileChange)
  }, [])

  useEffect(() => {
    function handleSidebarState(e) {
      setSidebarOpen(e.detail.open)
    }
    window.addEventListener('admin-sidebar-state', handleSidebarState)
    return () => window.removeEventListener('admin-sidebar-state', handleSidebarState)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="relative flex items-center px-4 sm:px-6 h-16">
          {/* Left: hamburger (mobile) */}
          <div className="flex items-center md:w-64 shrink-0">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              onClick={() => window.dispatchEvent(new Event('toggle-admin-sidebar'))}
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="flex flex-col items-center justify-center w-5 h-5 gap-1">
                <span className={`block h-0.5 bg-gray-600 rounded-full transition-all duration-200 ${sidebarOpen ? 'w-5 rotate-45 translate-y-[3px]' : 'w-5 -translate-y-[3px]'}`} />
                <span className={`block h-0.5 bg-gray-600 rounded-full transition-all duration-200 ${sidebarOpen ? 'w-5 opacity-0' : 'w-5 opacity-100'}`} />
                <span className={`block h-0.5 bg-gray-600 rounded-full transition-all duration-200 ${sidebarOpen ? 'w-5 -rotate-45 -translate-y-[3px]' : 'w-3.5 translate-y-[3px]'}`} />
              </span>
            </button>
          </div>

          {/* Center: logo — absolute on mobile, flex on desktop */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center gap-3 cursor-pointer shrink-0">
            <img src="/crown-96.png" alt="CrawlCrown Logo" className="w-9 h-9 rounded-xl object-contain" />
            <span className="font-bold text-gray-900 text-lg">CrawlCrown</span>
          </Link>

          {/* Right: notifications + profile */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1 min-w-0">
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
