import { useEffect, useMemo, useState } from 'react'
import {
  adminCreateService,
  adminDeleteService,
  adminGetServices,
  adminUpdateService,
} from '../../services/mockApi.js'
import Button from '../../components/ui/Button.jsx'

function FileToDataUrl({ file }) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}

export default function AdminServices() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const emptyForm = useMemo(
    () => ({
      service_id: null,
      service_name: '',
      short_description: '',
      description: '',
      status: 'Active',
      image: '',
    }),
    [],
  )

  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await adminGetServices({ search: search || undefined, status: status || undefined, page: 1, limit: 50 })
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
    setForm((f) => ({ ...f, image: dataUrl }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setToast('')

    if (!form.service_name.trim() || !form.short_description.trim() || !form.description.trim()) {
      setError('Please fill Service Name, Short Description, and Description.')
      return
    }

    const payload = {
      service_name: form.service_name.trim(),
      short_description: form.short_description.trim(),
      description: form.description.trim(),
      image: form.image,
      status: form.status,
    }

    if (form.service_id) {
      const res = await adminUpdateService(form.service_id, payload)
      if (!res.success) {
        setError(res.error?.message ?? 'Update failed.')
        return
      }
      setToast('Service updated successfully.')
    } else {
      const res = await adminCreateService(payload)
      if (!res.success) {
        setError(res.error?.message ?? 'Create failed.')
        return
      }
      setToast('Service created successfully.')
    }

    setForm(emptyForm)
    await load()
  }

  async function onDelete(id) {
    const ok = window.confirm('Delete this service?')
    if (!ok) return
    const res = await adminDeleteService(id)
    if (!res.success) {
      setError(res.error?.message ?? 'Delete failed.')
      return
    }
    setToast('Service deleted successfully.')
    await load()
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Services Management</h2>
          <p className="mt-1 text-sm text-gray-600">Create, update, and remove service records.</p>
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
            placeholder="Search by service name..."
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
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center"
              onClick={() => setForm(emptyForm)}
            >
              Reset Form
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="font-extrabold text-gray-900">{form.service_id ? 'Edit Service' : 'Add New Service'}</div>

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-800">Service Name</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.service_name}
                onChange={(e) => setForm((f) => ({ ...f, service_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Short Description</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.short_description}
                onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Description</label>
              <textarea
                rows={4}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100 resize-none"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div>
                <label className="text-sm font-semibold text-gray-800">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 w-full"
                  onChange={onPickImage}
                />
              </div>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {toast && <div className="text-sm text-green-600">{toast}</div>}

            <button
              type="submit"
              className="w-full rounded-xl bg-red-600 text-white py-3 font-extrabold hover:bg-orange-500 transition"
            >
              {form.service_id ? 'Update Service' : 'Create Service'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="font-extrabold text-gray-900">Services</div>
            <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${items.length} items`}</div>
          </div>

          <div className="mt-4 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-3">ID</th>
                  <th className="py-2 pr-3">Service</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.service_id} className="border-t border-gray-100 align-top">
                    <td className="py-3 pr-3 text-gray-700">{s.service_id}</td>
                    <td className="py-3 pr-3">
                      <div className="font-bold text-gray-900">{s.service_name}</div>
                      <div className="text-gray-500">{s.short_description}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                          s.status === 'Active'
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          type="button"
                          variant="outline"
                          className="px-4 py-2"
                          onClick={() =>
                            setForm({
                              service_id: s.service_id,
                              service_name: s.service_name,
                              short_description: s.short_description,
                              description: s.description,
                              status: s.status,
                              image: s.image ?? '',
                            })
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          className="px-4 py-2 bg-red-600 text-white hover:bg-orange-500 border-none"
                          onClick={() => onDelete(s.service_id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-600">
                      No services found.
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


