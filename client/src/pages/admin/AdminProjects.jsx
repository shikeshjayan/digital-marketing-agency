import { useEffect, useMemo, useState } from 'react'
import {
  adminCreateProject,
  adminDeleteProject,
  adminGetProjects,
  adminUpdateProject,
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

const categories = ['Static', 'Dynamic', 'Landing Pages']

export default function AdminProjects() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const emptyForm = useMemo(
    () => ({
      project_id: null,
      project_name: '',
      category: 'Dynamic',
      short_description: '',
      live_url: '',
      image: '',
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
      const res = await adminGetProjects({
        search: search || undefined,
        category: category || undefined,
        status: status || undefined,
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
  }, [])

  useEffect(() => {
    const t = setTimeout(() => load(), 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, status])

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

    if (!form.project_name.trim() || !form.short_description.trim() || !form.live_url.trim()) {
      setError('Please fill Project Name, Short Description, and Live URL.')
      return
    }

    const payload = {
      project_name: form.project_name.trim(),
      category: form.category,
      short_description: form.short_description.trim(),
      live_url: form.live_url.trim(),
      image: form.image,
      status: form.status,
    }

    if (form.project_id) {
      const res = await adminUpdateProject(form.project_id, payload)
      if (!res.success) {
        setError(res.error?.message ?? 'Update failed.')
        return
      }
      setToast('Project updated successfully.')
    } else {
      const res = await adminCreateProject(payload)
      if (!res.success) {
        setError(res.error?.message ?? 'Create failed.')
        return
      }
      setToast('Project created successfully.')
    }

    setForm(emptyForm)
    await load()
  }

  async function onDelete(id) {
    const ok = window.confirm('Delete this project?')
    if (!ok) return
    const res = await adminDeleteProject(id)
    if (!res.success) {
      setError(res.error?.message ?? 'Delete failed.')
      return
    }
    setToast('Project deleted successfully.')
    await load()
  }

  return (
    <div>
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">Projects Management</h2>
        <p className="mt-1 text-sm text-gray-600">Create, update, and remove project records.</p>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100 md:col-span-1"
            placeholder="Search by project name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <Button type="button" variant="outline" className="w-full justify-center" onClick={() => setForm(emptyForm)}>
            Reset Form
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="font-extrabold text-gray-900">{form.project_id ? 'Edit Project' : 'Add New Project'}</div>

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-800">Project Name</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.project_name}
                onChange={(e) => setForm((f) => ({ ...f, project_name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-800">Category</label>
                <select
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
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
            <div>
              <label className="text-sm font-semibold text-gray-800">Short Description</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.short_description}
                onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Live URL</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.live_url}
                onChange={(e) => setForm((f) => ({ ...f, live_url: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Image</label>
              <input type="file" accept="image/*" className="mt-2 w-full" onChange={onPickImage} />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {toast && <div className="text-sm text-green-600">{toast}</div>}

            <button type="submit" className="w-full rounded-xl bg-red-600 text-white py-3 font-extrabold hover:bg-orange-500 transition">
              {form.project_id ? 'Update Project' : 'Create Project'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="font-extrabold text-gray-900">Projects</div>
            <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${items.length} items`}</div>
          </div>

          <div className="mt-4 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-3">ID</th>
                  <th className="py-2 pr-3">Project</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.project_id} className="border-t border-gray-100 align-top">
                    <td className="py-3 pr-3 text-gray-700">{p.project_id}</td>
                    <td className="py-3 pr-3">
                      <div className="font-bold text-gray-900">{p.project_name}</div>
                      <div className="text-gray-500">{p.short_description}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold border border-gray-200 bg-gray-50 text-gray-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                          p.status === 'Active'
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                        }`}
                      >
                        {p.status}
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
                              project_id: p.project_id,
                              project_name: p.project_name,
                              category: p.category,
                              short_description: p.short_description,
                              live_url: p.live_url,
                              image: p.image ?? '',
                              status: p.status,
                            })
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          className="px-3 py-2 border-none"
                          onClick={() => onDelete(p.project_id)}
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
                      No projects found.
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


