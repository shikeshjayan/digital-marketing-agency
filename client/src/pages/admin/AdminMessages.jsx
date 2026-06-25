import { useEffect, useState } from 'react'
import {
  adminDeleteEnquiry,
  adminGetContactEnquiries,
  adminUpdateEnquiryStatus,
} from '../../services/mockApi.js'
import Button from '../../components/ui/Button.jsx'
import DropdownSelect from '../../components/ui/DropdownSelect.jsx'

const enquiryStatusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'New', label: 'New' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Replied', label: 'Replied' },
  { value: 'Spam', label: 'Spam' },
]

function statusChip(status) {
  const map = {
    New: 'bg-blue-50 text-blue-700 border-blue-100',
    Pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    Replied: 'bg-green-50 text-green-700 border-green-100',
    Spam: 'bg-red-50 text-red-700 border-red-100',
  }
  return map[status] ?? 'bg-gray-50 text-gray-700 border-gray-100'
}

export default function AdminMessages() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [date, setDate] = useState('')
  const [items, setItems] = useState([])
  const [counters, setCounters] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await adminGetContactEnquiries({
        search: search || undefined,
        status: status || undefined,
        date: date || undefined,
        page: 1,
        limit: 50,
      })
      setItems(res.data ?? [])
      setCounters(res.counters ?? null)
    } catch (e) {
      setError(e?.message ?? 'Failed to load.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => load(), 0)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = setTimeout(() => load(), 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, date])

  async function transition(id, nextStatus) {
    const res = await adminUpdateEnquiryStatus(id, { status: nextStatus })
    if (!res.success) {
      alert(res.error?.message ?? 'Update failed.')
      return
    }
    await load()
  }

  async function onDelete(id) {
    const ok = window.confirm('Delete this enquiry?')
    if (!ok) return
    const res = await adminDeleteEnquiry(id)
    if (!res.success) {
      alert(res.error?.message ?? 'Delete failed.')
      return
    }
    await load()
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900">Contact Enquiries</h2>
      <p className="mt-1 text-sm text-gray-600">Search and manage enquiry status workflow.</p>

      <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <DropdownSelect
            value={status}
            onChange={setStatus}
            placeholder="All statuses"
            options={enquiryStatusOptions}
          />
          <input
            type="date"
            className="rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Button type="button" variant="outline" className="w-full justify-center" onClick={() => { setSearch(''); setStatus(''); setDate(''); }}>
            Reset Filters
          </Button>
        </div>

        {counters && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center bg-gray-50 border border-gray-200 rounded-2xl py-3">
              <div className="text-xl font-extrabold text-gray-900">{counters.new ?? 0}</div>
              <div className="text-sm text-gray-600">New</div>
            </div>
            <div className="text-center bg-gray-50 border border-gray-200 rounded-2xl py-3">
              <div className="text-xl font-extrabold text-gray-900">{counters.pending ?? 0}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center bg-gray-50 border border-gray-200 rounded-2xl py-3">
              <div className="text-xl font-extrabold text-gray-900">{counters.replied ?? 0}</div>
              <div className="text-sm text-gray-600">Replied</div>
            </div>
            <div className="text-center bg-gray-50 border border-gray-200 rounded-2xl py-3">
              <div className="text-xl font-extrabold text-gray-900">{counters.spam ?? 0}</div>
              <div className="text-sm text-gray-600">Spam</div>
            </div>
          </div>
        )}
      </div>

      {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

      <div className="mt-4 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="font-extrabold text-gray-900">Enquiries ({loading ? 'Loading...' : items.length})</div>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-3">ID</th>
                <th className="py-2 pr-3">Sender</th>
                <th className="py-2 pr-3">Service</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.enquiry_id} className="border-t border-gray-100 align-top">
                  <td className="py-3 pr-3 text-gray-700">{e.enquiry_id}</td>
                  <td className="py-3 pr-3">
                    <div className="font-bold text-gray-900">{e.name}</div>
                    <div className="text-xs text-gray-500">{e.email}</div>
                  </td>
                  <td className="py-3 pr-3 text-gray-600">{e.service}</td>
                  <td className="py-3 pr-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${statusChip(e.status)}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-xs text-gray-500">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2 flex-wrap">
                      {(e.status === 'New' || e.status === 'Pending') && (
                        <Button type="button" className="px-3 py-2" onClick={() => transition(e.enquiry_id, 'Replied')}>
                          Mark Replied
                        </Button>
                      )}
                      {e.status !== 'Spam' && (
                        <Button type="button" variant="outline" className="px-3 py-2" onClick={() => transition(e.enquiry_id, 'Spam')}>
                          Mark Spam
                        </Button>
                      )}
                      <Button type="button" variant="danger" className="px-3 py-2" onClick={() => onDelete(e.enquiry_id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td colSpan={6} className="py-7 text-center text-gray-600">
                    No enquiries found.
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


