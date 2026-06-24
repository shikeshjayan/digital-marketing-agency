// Admin — approve or reject customer reviews
import { useEffect, useMemo, useState } from 'react'
import {
  adminApproveReview,
  adminGetReviews,
  adminRejectReview,
} from '../../services/mockApi.js'
import Button from '../../components/ui/Button.jsx'

function Stars({ rating }) {
  const full = Math.round(rating)
  return (
    <div className="text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true">
          {i < full ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}

export default function AdminReviews() {
  const [tab, setTab] = useState('Pending')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await adminGetReviews({
        status: tab === 'All' ? undefined : tab,
        search: search || undefined,
        page: 1,
        limit: 50,
      })
      setItems(res.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => load(), 0)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  useEffect(() => {
    const t = setTimeout(() => load(), 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const tabs = useMemo(() => ['Pending', 'Approved', 'Rejected', 'All'], [])

  async function approve(id) {
    const res = await adminApproveReview(id)
    if (!res.success) {
      alert(res.error?.message ?? 'Approve failed.')
      return
    }
    await load()
  }

  async function reject(id) {
    const res = await adminRejectReview(id)
    if (!res.success) {
      alert(res.error?.message ?? 'Reject failed.')
      return
    }
    await load()
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900">Reviews Moderation</h2>
      <p className="mt-1 text-sm text-gray-600">Approve or reject submitted reviews.</p>

      <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  tab === t
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:text-red-700 hover:bg-red-50'
                }`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <input
            className="rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
            placeholder="Search by name/location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="font-extrabold text-gray-900">
            Reviews ({loading ? 'Loading...' : items.length})
          </div>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-3">ID</th>
                <th className="py-2 pr-3">Reviewer</th>
                <th className="py-2 pr-3">Rating</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.review_id} className="border-t border-gray-100 align-top">
                  <td className="py-3 pr-3 text-gray-700">{r.review_id}</td>
                  <td className="py-3 pr-3">
                    <div className="font-bold text-gray-900">{r.name}</div>
                    <div className="text-xs text-gray-500">{r.location}</div>
                    <div className="mt-2 text-gray-700 leading-relaxed line-clamp-3">
                      "{r.review_text}"
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <Stars rating={r.rating} />
                  </td>
                  <td className="py-3 pr-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold border ${
                        r.status === 'Approved'
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : r.status === 'Rejected'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2 flex-wrap">
                      {r.status === 'Pending' && (
                        <>
                          <Button type="button" className="px-3 py-2" onClick={() => approve(r.review_id)}>
                            Approve
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            className="px-3 py-2 border-none"
                            onClick={() => reject(r.review_id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {r.status === 'Approved' && (
                        <Button
                          type="button"
                          variant="danger"
                          className="px-3 py-2 border-none"
                          onClick={() => reject(r.review_id)}
                        >
                          Reject
                        </Button>
                      )}
                      {r.status === 'Rejected' && (
                        <Button type="button" className="px-3 py-2" onClick={() => approve(r.review_id)}>
                          Approve
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-600">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


