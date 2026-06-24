import { useEffect, useMemo, useState } from 'react'
import {
  adminCreateCourse,
  adminDeleteCourse,
  adminGetCourses,
  adminUpdateCourse,
} from '../../services/mockApi.js'
import Button from '../../components/ui/Button.jsx'

export default function AdminCourses() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const emptyForm = useMemo(
    () => ({
      course_id: null,
      course_name: '',
      description: '',
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
      const res = await adminGetCourses({
        search: search || undefined,
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
  }, [search, status])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setToast('')

    if (!form.course_name.trim() || !form.description.trim()) {
      setError('Please fill Course Name and Description.')
      return
    }

    const payload = {
      course_name: form.course_name.trim(),
      description: form.description.trim(),
      status: form.status,
    }

    if (form.course_id) {
      const res = await adminUpdateCourse(form.course_id, payload)
      if (!res.success) {
        setError(res.error?.message ?? 'Update failed.')
        return
      }
      setToast('Course updated successfully.')
    } else {
      const res = await adminCreateCourse(payload)
      if (!res.success) {
        setError(res.error?.message ?? 'Create failed.')
        return
      }
      setToast('Course created successfully.')
    }

    setForm(emptyForm)
    await load()
  }

  async function onDelete(id) {
    const ok = window.confirm('Delete this course?')
    if (!ok) return
    const res = await adminDeleteCourse(id)
    if (!res.success) {
      setError(res.error?.message ?? 'Delete failed.')
      return
    }
    setToast('Course deleted successfully.')
    await load()
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900">Courses Management</h2>
      <p className="mt-1 text-sm text-gray-600">Add/update/remove course records.</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="font-extrabold text-gray-900">{form.course_id ? 'Edit Course' : 'Add New Course'}</div>

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-800">Course Name</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.course_name}
                onChange={(e) => setForm((f) => ({ ...f, course_name: e.target.value }))}
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

            {error && <div className="text-sm text-red-600">{error}</div>}
            {toast && <div className="text-sm text-green-600">{toast}</div>}

            <button type="submit" className="w-full rounded-xl bg-red-600 text-white py-3 font-extrabold hover:bg-orange-500 transition">
              {form.course_id ? 'Update Course' : 'Create Course'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <div className="font-extrabold text-gray-900">Courses</div>
              <div className="text-sm text-gray-500 mt-1">{loading ? 'Loading...' : `${items.length} items`}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
              <input
                className="rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                placeholder="Search by course name..."
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
                  <th className="py-2 pr-3">Course</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.course_id} className="border-t border-gray-100 align-top">
                    <td className="py-3 pr-3 text-gray-700">{c.course_id}</td>
                    <td className="py-3 pr-3">
                      <div className="font-bold text-gray-900">{c.course_name}</div>
                      <div className="text-gray-500">{c.description}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                          c.status === 'Active'
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                        }`}
                      >
                        {c.status}
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
                              course_id: c.course_id,
                              course_name: c.course_name,
                              description: c.description,
                              status: c.status,
                            })
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          className="px-3 py-2"
                          onClick={() => onDelete(c.course_id)}
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
                      No courses found.
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


