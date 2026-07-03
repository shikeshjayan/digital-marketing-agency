import { useEffect, useState } from "react";
import useSettingsStore from "../../store/settingsStore.js";
import { setAdminProfile } from "../../auth/adminAuth.js";

export default function AdminSettings() {
  const { profile, loading, fetchProfile, updateProfile } = useSettingsStore();
  const [form, setForm] = useState({
    name: "",
    photo: "",
    currentPassword: "",
    newPassword: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        if (data) {
          setForm((f) => ({
            ...f,
            name: data.name ?? "",
            photo: data.photo ?? "",
          }));
          setPhotoRemoved(false);
        }
      })
      .catch(() => {});
  }, [fetchProfile]);

  function onPickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB.");
      return;
    }
    setImageFile(file);
    setPhotoRemoved(false);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setToast("");
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("currentPassword", form.currentPassword);
      formData.append("newPassword", form.newPassword);
      if (imageFile) {
        formData.append("photo", imageFile);
      } else if (photoRemoved) {
        formData.append("removePhoto", "true");
      }
      const res = await updateProfile(formData);
      const updatedProfile = res?.data;
      setImageFile(null);
      setPhotoRemoved(false);
      if (updatedProfile) {
        setForm((f) => ({
          ...f,
          name: updatedProfile.name ?? f.name,
          photo: updatedProfile.photo ?? "",
          currentPassword: "",
          newPassword: "",
        }));
        setAdminProfile({
          name: updatedProfile.name ?? form.name,
          email: updatedProfile.email,
          photo: updatedProfile.photo ?? "",
          role: updatedProfile.role || "Administrator",
        });
      }
      setToast("Profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "Save failed.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Admin Settings
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Update your profile and password.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded p-5 shadow-xs">
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <div className="font-extrabold text-gray-900">Profile Image</div>
            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-800">
                Photo
              </label>
              <label className="mt-2 flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-red-400 hover:bg-red-50 transition">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-gray-500 mt-1">Choose Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickImage}
                />
              </label>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="font-extrabold text-gray-900">
              Profile Details
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Username
                </label>
                <input
                  className="mt-2 w-full rounded border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. admin"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Current Password
                </label>
                <input
                  type="password"
                  className="mt-2 w-full rounded border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                  value={form.currentPassword}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  New Password
                </label>
                <input
                  type="password"
                  className="mt-2 w-full rounded border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, newPassword: e.target.value }))
                  }
                  placeholder="Enter new password"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded px-4 py-2">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </div>
              )}
              {toast && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded px-4 py-2">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {toast}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving || loading}
                  className="w-full rounded bg-primary text-white py-2.5 font-extrabold hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
