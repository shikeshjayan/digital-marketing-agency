import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSettingsStore from "../../store/settingsStore.js";
import { setAdminProfile } from "../../auth/adminAuth.js";
import FileUploadField from "../../components/ui/FileUploadField.jsx";
import resolveImagePath from "../../utils/resolveImagePath.js";

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

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
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
      toast.success("Profile updated successfully.");
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? "Save failed.";
      setError(msg);
      toast.error(msg);
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
            <FileUploadField
              label="Photo"
              file={null}
              existingUrl=""
              onChange={(f) => {
                setImageFile(f);
                setPhotoRemoved(false);
              }}
              onRemove={() => {
                setImageFile(null);
                setPhotoRemoved(true);
              }}
              className="mt-4"
            />
            {(imageFile || (form.photo && !photoRemoved)) && (
              <div className="mt-3 relative">
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : resolveImagePath(form.photo)}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setPhotoRemoved(true);
                  }}
                  className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-red-50 rounded-full shadow transition cursor-pointer"
                  title="Remove image">
                  <svg
                    className="w-4 h-4 text-red-500 hover:text-red-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            )}
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
