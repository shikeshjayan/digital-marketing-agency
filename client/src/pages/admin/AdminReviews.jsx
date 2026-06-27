import { useCallback, useEffect, useRef, useState } from 'react'
import useReviewStore from '../../store/reviewStore'
import { relativeTime } from '../../utils/time'

function Stars({ rating }) {
  const full = Math.round(rating)
  return (
    <div className="text-yellow-500 text-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true">
          {i < full ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}

function statusChip(status) {
  const map = {
    Pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    Approved: 'bg-green-50 text-green-700 border-green-100',
    Rejected: 'bg-red-50 text-red-700 border-red-100',
  }
  return map[status] ?? 'bg-gray-50 text-gray-600 border-gray-100'
}

function SkeletonBlock({ className }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
}

function LoadingSkeleton() {
  return (
    <div>
      <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="mt-2 h-4 w-64 bg-gray-100 rounded animate-pulse" />

      <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <SkeletonBlock key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>
      </div>

      <div className="mt-4 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <SkeletonBlock className="h-5 w-32" />
        <div className="mt-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <SkeletonBlock className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="h-3 w-48" />
                <SkeletonBlock className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-5">
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="text-sm text-gray-600 mt-2">{message}</div>
        <div className="flex gap-3 mt-5 justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm cursor-pointer"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-orange-500 text-sm cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

function ReviewText({ text }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > 150
  const display = expanded || !isLong ? text : text.slice(0, 150) + '...'

  return (
    <div className="mt-2 text-sm text-gray-700 leading-relaxed">
      "{display}"
      {isLong && (
        <button
          type="button"
          className="ml-1 text-red-600 hover:text-red-700 font-medium cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  )
}

export default function AdminReviews() {
  const [tab, setTab] = useState('Pending')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])
  const [counters, setCounters] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, type: null, id: null })
  const searchRef = useRef(search)
  const fetchedOnce = useRef(false)

  const fetchAdminReviews = useReviewStore((s) => s.fetchAdminReviews)
  const approveReview = useReviewStore((s) => s.approveReview)
  const rejectReview = useReviewStore((s) => s.rejectReview)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchAdminReviews({
        status: tab === 'All' ? undefined : tab,
        search: search || undefined,
        page: 1,
        limit: 50,
      })
      setItems(result.reviews)
      setCounters(result.counters)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }, [tab, search, fetchAdminReviews])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!fetchedOnce.current) {
      fetchedOnce.current = true
      return
    }
    const t = setTimeout(() => load(), 300)
    return () => clearTimeout(t)
  }, [search])

  async function handleApprove(id) {
    setActionLoading(id)
    try {
      await approveReview(id)
      setConfirm({ open: false, type: null, id: null })
      await load()
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Approve failed')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReject(id) {
    setActionLoading(id)
    try {
      await rejectReview(id)
      setConfirm({ open: false, type: null, id: null })
      await load()
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Reject failed')
    } finally {
      setActionLoading(null)
    }
  }

  const tabs = [
    { key: 'Pending', label: 'Pending', count: counters?.pending },
    { key: 'Approved', label: 'Approved', count: counters?.approved },
    { key: 'Rejected', label: 'Rejected', count: counters?.rejected },
    { key: 'All', label: 'All', count: null },
  ]

  if (loading && !items.length) return <LoadingSkeleton />

  if (error && !items.length) {
    return (
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">Reviews Moderation</h2>
        <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
          <div className="text-sm text-red-600">{error}</div>
          <button
            type="button"
            className="mt-3 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition cursor-pointer"
            onClick={load}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900">Reviews Moderation</h2>
      <p className="mt-1 text-sm text-gray-600">Approve or reject submitted customer reviews.</p>

      <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition cursor-pointer ${
                  tab === t.key
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:text-red-700 hover:bg-red-50'
                }`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
                {t.count != null && (
                  <span className={`ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full ${
                    tab === t.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchRef}
              className="w-full md:w-64 rounded-xl border border-gray-200 pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-red-100 text-sm"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="font-extrabold text-gray-900">
            Reviews
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({loading ? 'Loading...' : items.length})
            </span>
          </div>
        </div>

        {items.length ? (
          <div className="mt-4 space-y-3">
            {items.map((r) => (
              <div key={r.review_id} className="border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition">
                <div className="flex items-start gap-4">
                  <img
                    src={r.user_avatar}
                    alt={r.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 bg-gray-100"
                    onError={(e) => { e.target.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect fill='%23e5e7eb' width='40' height='40'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-size='16' font-family='sans-serif'>${r.name?.charAt(0)?.toUpperCase() ?? '?'}</text></svg>` }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-bold text-gray-900">{r.name}</div>
                      <span className="text-xs text-gray-400">{r.location}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusChip(r.status)}`}>
                        {r.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Stars rating={r.rating} />
                      <span className="text-xs text-gray-400">{relativeTime(r.date)}</span>
                    </div>
                    <ReviewText text={r.review_text} />
                    <div className="mt-3 flex gap-2">
                      {r.status !== 'Approved' && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition cursor-pointer disabled:opacity-50"
                          onClick={() => setConfirm({ open: true, type: 'approve', id: r.review_id })}
                          disabled={actionLoading === r.review_id}
                        >
                          {actionLoading === r.review_id ? (
                            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                          Approve
                        </button>
                      )}
                      {r.status !== 'Rejected' && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
                          onClick={() => setConfirm({ open: true, type: 'reject', id: r.review_id })}
                          disabled={actionLoading === r.review_id}
                        >
                          {actionLoading === r.review_id ? (
                            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          )}
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg className="w-12 h-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z" />
            </svg>
            <div className="mt-3 text-sm font-medium text-gray-500">No reviews found</div>
            <div className="mt-1 text-xs text-gray-400">
              {tab === 'All' ? 'No reviews have been submitted yet' : `No ${tab.toLowerCase()} reviews`}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirm.open}
        title={confirm.type === 'approve' ? 'Approve Review' : 'Reject Review'}
        message={confirm.type === 'approve'
          ? 'This review will be published on the public site. Continue?'
          : 'This review will be rejected and hidden. Continue?'}
        onConfirm={() => confirm.type === 'approve' ? handleApprove(confirm.id) : handleReject(confirm.id)}
        onCancel={() => setConfirm({ open: false, type: null, id: null })}
        loading={actionLoading === confirm.id}
      />
    </div>
  )
}
