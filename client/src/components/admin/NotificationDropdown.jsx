import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../../services/apiService.js'

const LAST_VIEWED_KEY = 'notifications_last_viewed'

function BellIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}

function EnvelopeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
}

function getLastViewed() {
  try {
    return localStorage.getItem(LAST_VIEWED_KEY) || null
  } catch {
    return null
  }
}

function setLastViewed() {
  try {
    localStorage.setItem(LAST_VIEWED_KEY, new Date().toISOString())
  } catch {
    // ignore
  }
}

export default function NotificationDropdown() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastViewed, setLastViewedState] = useState(() => getLastViewed())
  const dropdownRef = useRef(null)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const [enquiriesRes, reviewsRes] = await Promise.all([
        apiService.get('/admin/contact/enquiries', { params: { limit: 10, status: 'New' } }),
        apiService.get('/admin/reviews', { params: { limit: 10, status: 'Pending' } }),
      ])

      const enquiries = (enquiriesRes.data.data ?? []).map((e) => ({
        id: e.enquiry_id,
        type: 'message',
        title: e.name,
        subtitle: e.email,
        preview: e.message?.slice(0, 60),
        time: e.date,
        status: e.status,
      }))

      const reviews = (reviewsRes.data.data ?? []).map((r) => ({
        id: r.review_id,
        type: 'review',
        title: r.name,
        subtitle: `${r.rating}.0 rating`,
        preview: r.review_text?.slice(0, 60),
        time: r.date,
        status: r.status,
      }))

      const combined = [...enquiries, ...reviews]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 10)

      setNotifications(combined)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = lastViewed
    ? notifications.filter((n) => new Date(n.time).getTime() > new Date(lastViewed).getTime()).length
    : notifications.length

  function handleToggle() {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    if (newIsOpen) {
      setLastViewed()
      setLastViewedState(new Date().toISOString())
    }
  }

  function handleItemClick(notification) {
    setIsOpen(false)
    setLastViewed()
    setLastViewedState(new Date().toISOString())
    if (notification.type === 'message') {
      navigate('/admin/messages')
    } else {
      navigate('/admin/reviews')
    }
  }

  function timeAgo(date) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
        onClick={handleToggle}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 sm:translate-x-0 mt-2 sm:w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden top-16 sm:top-auto sm:mt-2">
          <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-gray-900 text-sm sm:text-base">Notifications</span>
            <span className="text-xs text-gray-500">{notifications.length} total</span>
          </div>

          <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">No new notifications</div>
            ) : (
              notifications.map((n, i) => {
                const isUnread = lastViewed
                  ? new Date(n.time).getTime() > new Date(lastViewed).getTime()
                  : true

                return (
                  <button
                    key={`${n.type}-${n.id}-${i}`}
                    type="button"
                    className={`w-full flex items-start gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 hover:bg-gray-50 transition-colors duration-150 text-left border-b border-gray-50 last:border-0 cursor-pointer ${isUnread ? 'bg-red-50/30' : ''}`}
                    onClick={() => handleItemClick(n)}
                  >
                    <div className={`mt-0.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      n.type === 'message' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {n.type === 'message' ? <EnvelopeIcon /> : <StarIcon />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-sm font-medium text-gray-900 truncate">{n.title}</span>
                        {isUnread && <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />}
                        <span className="text-[11px] sm:text-xs text-gray-400 flex-shrink-0">{timeAgo(n.time)}</span>
                      </div>
                      <div className="text-xs text-gray-500 truncate">{n.subtitle}</div>
                      {n.preview && (
                        <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">"{n.preview}..."</div>
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-gray-100 px-3 sm:px-4 py-2">
              <button
                type="button"
                className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium py-2.5 min-h-[44px] cursor-pointer"
                onClick={() => {
                  setIsOpen(false)
                  setLastViewed()
                  setLastViewedState(new Date().toISOString())
                  navigate('/admin/messages')
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
