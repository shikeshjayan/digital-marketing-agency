import { useEffect, useState } from 'react'
import useSettingsStore from '../../store/settingsStore.js'

export default function AdminSettings() {
  const { profile, loading, fetchProfile, updateProfile } = useSettingsStore()
  const [form, setForm] = useState({
    name: '',
    photo: '',
    currentPassword: '',
    newPassword: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile().then((data) => {
      if (data) {
        setForm((f) => ({
          ...f,
          name: data.name ?? '',
          photo: data.photo ?? '',
        }))
        setImagePreview(data.photo ?? '')
      }
    }).catch(() => {})
  }, [fetchProfile])

  function onPickImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setToast('')
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('currentPassword', form.currentPassword)
      formData.append('newPassword', form.newPassword)
      if (imageFile) {
        formData.append('photo', imageFile)
      }
      await updateProfile(formData)
      setToast('Profile updated successfully.')
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const preview = imagePreview || profile?.photo

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
                <input type="file" accept="image/*" className="mt-2 w-full" onChange={onPickImage} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-800">Username</label>
                <input
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">Current Password</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                  value={form.currentPassword}
                  onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">New Password</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                  value={form.newPassword}
                  onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                />
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}
              {toast && <div className="text-sm text-green-600">{toast}</div>}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving || loading}
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
