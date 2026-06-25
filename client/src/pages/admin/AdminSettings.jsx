import { useEffect, useState } from 'react'
import { adminGetSettings, adminUpdateSettings } from '../../services/mockApi.js'
import ImageFileInput from '../../components/admin/ImageFileInput.jsx'

export default function AdminSettings() {
  const [settings, setSettings] = useState(null)
  const [form, setForm] = useState({
    username: '',
    profile_image: '',
    current_password: '',
    new_password: '',
  })
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminGetSettings().then((res) => {
      const data = res.data ?? {}
      setSettings(data)
      setForm((f) => ({
        ...f,
        username: data.username ?? '',
        profile_image: data.profile_image ?? '',
      }))
    })
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setToast('')
    setSaving(true)
    try {
      const res = await adminUpdateSettings({
        username: form.username,
        profile_image: form.profile_image,
        current_password: form.current_password,
        new_password: form.new_password,
      })
      if (!res.success) {
        setError(res.error?.message ?? 'Save failed.')
        return
      }
      setToast('Profile updated successfully.')
    } finally {
      setSaving(false)
    }
  }

  const preview = form.profile_image || settings?.profile_image

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900">Admin Settings</h2>
      <p className="mt-1 text-sm text-gray-600">Update your profile and password.</p>

      <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl border border-gray-200 bg-gray-100 overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  '👤'
                )}
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-800">Profile Image</label>
                <ImageFileInput
                  onChange={(dataUrl) => setForm((f) => ({ ...f, profile_image: dataUrl }))}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-800">Username</label>
                <input
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">Current Password</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                  value={form.current_password}
                  onChange={(e) => setForm((f) => ({ ...f, current_password: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">New Password</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                  value={form.new_password}
                  onChange={(e) => setForm((f) => ({ ...f, new_password: e.target.value }))}
                />
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}
              {toast && <div className="text-sm text-green-600">{toast}</div>}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-red-600 text-white py-3 font-extrabold hover:bg-orange-500 transition disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}


