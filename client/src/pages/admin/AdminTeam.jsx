// Admin — manage team members
import { useEffect, useMemo, useState } from 'react'
import {
  adminCreateTeamMember,
  adminDeleteTeamMember,
  adminGetTeam,
  adminUpdateTeamMember,
} from '../../services/mockApi.js'
import Button from '../../components/ui/Button.jsx'
import ImagePlaceholder from '../../components/ui/ImagePlaceholder.jsx'

function FileToDataUrl({ file }) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}

export default function AdminTeam() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const emptyForm = useMemo(
    () => ({
      member_id: null,
      photo: '',
      name: '',
      designation: '',
      display_order: 1,
      status: 'Active',
    }),
    [],
  )

  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await adminGetTeam({ search: search || undefined, status: status || undefined, page: 1, limit: 50 })
      setItems(res.data ?? [])
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
  }, [search, status])

  async function onPickImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await FileToDataUrl({ file })
    setForm((f) => ({ ...f, photo: dataUrl }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setToast('')

    if (!form.name.trim() || !form.designation.trim()) {
      setError('Please fill member name and designation.')
      return
    }

    const payload = {
      photo: form.photo,
      name: form.name.trim(),
      designation: form.designation.trim(),
      display_order: form.display_order,
      status: form.status,
    }

    if (form.member_id) {
      const res = await adminUpdateTeamMember(form.member_id, payload)
      if (!res.success) {
        setError(res.error?.message ?? 'Update failed.')
        return
      }
      setToast('Team member updated successfully.')
    } else {
      const res = await adminCreateTeamMember(payload)
      if (!res.success) {
        setError(res.error?.message ?? 'Create failed.')
        return
      }
      setToast('Team member added successfully.')
    }

    setForm(emptyForm)
    await load()
  }

  async function onDelete(id) {
    const ok = window.confirm('Delete this team member?')
    if (!ok) return
    const res = await adminDeleteTeamMember(id)
    if (!res.success) {
      setError(res.error?.message ?? 'Delete failed.')
      return
    }
    setToast('Team member deleted successfully.')
    await load()
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900">Team Management</h2>
      <p className="mt-1 text-sm text-gray-600">Add/update team members with photos.</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="font-extrabold text-gray-900">{form.member_id ? 'Edit Member' : 'Add New Member'}</div>

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl border border-gray-200 bg-gray-100 overflow-hidden flex items-center justify-center text-2xl">
                {form.photo ? <img src={form.photo} alt="preview" className="w-full h-full object-cover" /> : <ImagePlaceholder compact />}
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-800">Photo</label>
                <input type="file" accept="image/*" className="mt-2 w-full" onChange={onPickImage} />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Name</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Designation</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.designation}
                onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-800">Display Order</label>
                <input
                  type="number"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                  value={form.display_order}
                  onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Status</label>
                <select
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {toast && <div className="text-sm text-green-600">{toast}</div>}

            <button type="submit" className="w-full rounded-xl bg-red-600 text-white py-3 font-extrabold hover:bg-orange-500 transition">
              {form.member_id ? 'Update Member' : 'Create Member'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <div className="font-extrabold text-gray-900">Team Members</div>
              <div className="text-sm text-gray-500 mt-1">{loading ? 'Loading...' : `${items.length} items`}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
              <input
                className="rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-3">ID</th>
                  <th className="py-2 pr-3">Member</th>
                  <th className="py-2 pr-3">Designation</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((m) => (
                  <tr key={m.member_id} className="border-t border-gray-100 align-top">
                    <td className="py-3 pr-3 text-gray-700">{m.member_id}</td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                          {m.photo ? <img src={m.photo} alt="" className="w-full h-full object-cover" /> : <ImagePlaceholder compact />}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{m.name}</div>
                          <div className="text-xs text-gray-500">Order: {m.display_order}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-gray-600">{m.designation}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                          m.status === 'Active'
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          type="button"
                          variant="outline"
                          className="px-3 py-2"
                          onClick={() =>
                            setForm({
                              member_id: m.member_id,
                              photo: m.photo ?? '',
                              name: m.name,
                              designation: m.designation,
                              display_order: m.display_order ?? 1,
                              status: m.status,
                            })
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          className="px-3 py-2"
                          onClick={() => onDelete(m.member_id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-600">
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


