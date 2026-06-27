import { useEffect, useMemo, useState } from 'react'
import useProjectStore from '../../store/projectStore.js'
import Button from '../../components/ui/Button.jsx'
import Select from '../../components/ui/Select.jsx'

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

  const fetchAdminProjects = useProjectStore((s) => s.fetchAdminProjects)
  const createProject = useProjectStore((s) => s.createProject)
  const updateProject = useProjectStore((s) => s.updateProject)
  const deleteProject = useProjectStore((s) => s.deleteProject)

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
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchAdminProjects({
        search: search || undefined,
        category: category || undefined,
        status: status || undefined,
        page: 1,
        limit: 50,
      })
      setItems(data ?? [])
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
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB.')
      return
    }
    const dataUrl = await FileToDataUrl({ file })
    setForm((f) => ({ ...f, image: dataUrl }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setToast('')
    setSubmitting(true)

    if (!form.project_name.trim() || !form.short_description.trim() || !form.live_url.trim()) {
      setError('Please fill Project Name, Short Description, and Live URL.')
      setSubmitting(false)
      return
    }

    if (!form.image && !form.project_id) {
      setError('Please upload an image.')
      setSubmitting(false)
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

    try {
      if (form.project_id) {
        await updateProject(form.project_id, payload)
        setToast('Project updated successfully.')
      } else {
        await createProject(payload)
        setToast('Project created successfully.')
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Operation failed.')
      setSubmitting(false)
      return
    }

    setForm(emptyForm)
    setSubmitting(false)
    await load()
  }

  async function onDelete(id) {
    const ok = window.confirm('Delete this project?')
    if (!ok) return
    try {
      await deleteProject(id)
      setToast('Project deleted successfully.')
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Delete failed.')
    }
  }

  return (
    <div>
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">Projects Management</h2>
        <p className="mt-1 text-sm text-gray-600">Create, update, and remove project records.</p>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
              placeholder="Search by project name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={category}
            onChange={setCategory}
            placeholder="All categories"
            options={[
              { value: '', label: 'All categories' },
              ...categories.map((c) => ({ value: c, label: c })),
            ]}
          />
          <Select
            value={status}
            onChange={setStatus}
            placeholder="All statuses"
            options={[
              { value: '', label: 'All statuses' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
          />
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
                <Select
                  value={form.category}
                  onChange={(val) => setForm((f) => ({ ...f, category: val }))}
                  className="mt-2"
                  options={[
                    { value: 'Static', label: 'Static' },
                    { value: 'Dynamic', label: 'Dynamic' },
                    { value: 'Landing Pages', label: 'Landing Pages' },
                  ]}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Status</label>
                <Select
                  value={form.status}
                  onChange={(val) => setForm((f) => ({ ...f, status: val }))}
                  className="mt-2"
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                  ]}
                />
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
              <label className="text-sm font-semibold text-gray-800">
                Image <span className="text-red-500">*</span>
              </label>
              <label className="mt-2 flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-400 hover:bg-red-50 transition">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-500 mt-1">
                  {form.image ? 'Change Photo' : 'Choose Photo'}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={onPickImage} />
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            {toast && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-xl px-4 py-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {toast}
              </div>
            )}

            <div className="flex gap-2">
              {form.project_id && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setForm(emptyForm)}>
                  Cancel
                </Button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-red-600 text-white py-3 font-extrabold hover:bg-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {submitting ? 'Saving...' : form.project_id ? 'Update Project' : 'Create Project'}
              </button>
            </div>
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
                  <th className="py-2 pr-3 hidden sm:table-cell">ID</th>
                  <th className="py-2 pr-3">Project</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p._id} className="border-t border-gray-100 align-top hover:bg-gray-50 transition">
                    <td className="py-3 pr-3 text-gray-700 hidden sm:table-cell">
                      <span className="block max-w-[80px] truncate" title={p._id}>
                        {p._id}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="font-bold text-gray-900">{p.project_name}</div>
                      <div className="text-gray-500 text-xs sm:text-sm line-clamp-1">{p.short_description}</div>
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
                        }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          type="button"
                          variant="outline"
                          className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"
                          onClick={() => {
                            setForm({
                              project_id: p._id,
                              project_name: p.project_name,
                              category: p.category,
                              short_description: p.short_description,
                              live_url: p.live_url,
                              image: p.image ?? '',
                              status: p.status,
                            })
                          }}>
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm bg-red-600 text-white hover:bg-orange-500 border-none"
                          onClick={() => onDelete(p._id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && !loading && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center text-gray-400">
                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <div className="font-semibold">No projects found</div>
                        <div className="text-sm mt-1">Create a new project to get started.</div>
                      </div>
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
