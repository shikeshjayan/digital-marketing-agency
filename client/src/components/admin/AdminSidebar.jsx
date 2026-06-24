// Admin sidebar navigation — links to all admin sections + logout
import { NavLink, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { clearAdminToken } from '../../auth/adminAuth.js'

function Icon({ children }) {
  return <span className="inline-flex items-center justify-center w-5 h-5">{children}</span>
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 12a9 9 0 1 1-3.2-6.9" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.8V21h14V9.8" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 4h7v7H4z" />
      <path d="M13 4h7v7h-7z" />
      <path d="M4 13h7v7H4z" />
      <path d="M13 13h7v7h-7z" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 4h16v16H4z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.05.05-1.7 2.95-.07-.02a1.8 1.8 0 0 0-2.02.62l-.02.06h-3.4l-.02-.06a1.8 1.8 0 0 0-2.02-.62l-.07.02-1.7-2.95.05-.05A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-1.5-1.2l-.1-.01v-3.4l.1-.01A1.8 1.8 0 0 0 4.6 8.98c.1-.43.05-.88-.14-1.27l-.05-.1L6.1 4.66l.08.03c.64.3 1.38.19 1.91-.25l.02-.05h3.4l.02.05c.53.44 1.27.55 1.91.25l.08-.03 1.69 2.95-.05.1c-.19.39-.24.84-.14 1.27A1.8 1.8 0 0 0 19.4 8.99c.43.1.88.05 1.27-.14l.1-.05 2.95 1.69-.03.08a1.8 1.8 0 0 0 .62 2.02l.06.02v3.4l-.06.02a1.8 1.8 0 0 0-.62 2.02l.03.08-2.95 1.7-.1-.05c-.39-.19-.84-.24-1.27-.14z" />
    </svg>
  )
}

function AdjustmentsIcon() {
  return <SettingsIcon />
}

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <HomeIcon /> },
  { to: '/admin/services', label: 'Services', icon: <GridIcon /> },
  { to: '/admin/projects', label: 'Projects', icon: <GridIcon /> },
  { to: '/admin/courses', label: 'Courses', icon: <GridIcon /> },
  { to: '/admin/team', label: 'Team', icon: <UsersIcon /> },
  { to: '/admin/reviews', label: 'Reviews', icon: <ChatIcon /> },
  { to: '/admin/messages', label: 'Messages', icon: <MailIcon /> },
  { to: '/admin/settings', label: 'Settings', icon: <AdjustmentsIcon /> },
]

export default function AdminSidebar() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  const sidebarWidth = collapsed ? 'w-16' : 'w-64'

  const adminName = useMemo(() => 'admin_sensations', [])
  const adminRole = useMemo(() => 'Administrator', [])

  function doLogout() {
    clearAdminToken()
    setLogoutOpen(false)
    setMobileOpen(false)
    navigate('/admin/login', { replace: true })
  }

  const sidebar = (
    <div className={`${sidebarWidth} bg-white border-r border-gray-200`}>
      <div className="h-full flex flex-col">
        <div className="px-4 py-4">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
              A
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 truncate">{adminName}</div>
                <div className="text-xs text-gray-500 truncate">{adminRole}</div>
              </div>
            )}
          </div>
        </div>

        <div className="px-2 flex-1 overflow-auto pb-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
                    isActive
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                <Icon>{item.icon}</Icon>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="px-3 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50 border border-gray-200"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle collapse"
            >
              <span className="text-xs font-semibold text-gray-600">{collapsed ? '>' : '<'}</span>
            </button>
            {!collapsed && <div className="text-xs text-gray-500"> </div>}
          </div>

          <button
            type="button"
            className={`w-full mt-2 flex items-center gap-3 px-3 py-2 rounded-xl text-sm border border-gray-200 hover:bg-gray-50 text-gray-700`}
            onClick={() => setLogoutOpen(true)}
          >
            <Icon>
              <LogoutIcon />
            </Icon>
            {!collapsed && <span className="truncate">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden md:block">{sidebar}</div>

      <div className="md:hidden">
        <button
          type="button"
          className="fixed top-4 left-3 z-50 w-11 h-11 rounded-xl bg-white border border-gray-200 shadow-sm"
          onClick={() => setMobileOpen(true)}
          aria-label="Open admin menu"
        >
          <span className="block w-5 h-0.5 bg-gray-800 mx-auto mb-1" />
          <span className="block w-5 h-0.5 bg-gray-800 mx-auto mb-1" />
          <span className="block w-5 h-0.5 bg-gray-800 mx-auto" />
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0">{sidebar}</div>
          </div>
        )}
      </div>

      {logoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-5">
            <div className="font-semibold text-gray-900">Confirm Logout</div>
            <div className="text-sm text-gray-600 mt-2">
              You will be logged out of the admin panel session.
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                onClick={() => setLogoutOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-orange-500 text-sm"
                onClick={doLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

