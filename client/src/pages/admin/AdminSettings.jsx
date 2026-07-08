import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSettingsStore from "../../store/settingsStore.js";
import { setAdminProfile } from "../../auth/adminAuth.js";
import FileUploadField from "../../components/ui/FileUploadField.jsx";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import ErrorBanner from "../../components/ui/ErrorBanner.jsx";
import resolveImagePath from "../../utils/resolveImagePath.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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
      <AdminPageHeader
        title="Admin Settings"
        subtitle="Update your profile and password."
      />

      <div className="mt-6 bg-background border border-border rounded p-5 shadow-xs">
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <div className="font-extrabold text-heading">Profile Image</div>
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
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : resolveImagePath(form.photo)
                  }
                  alt="Preview"
                  className="w-full h-40 object-cover rounded border border-border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setPhotoRemoved(true);
                  }}
                  className="absolute top-1 right-1 p-1 bg-background/80 hover:bg-primary-light rounded-full shadow transition cursor-pointer"
                  title="Remove image">
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4 text-primary hover:text-primary-hover" />
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="font-extrabold text-heading">Profile Details</div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-semibold text-heading">
                  Username
                </label>
                <input
                  className="mt-2 w-full rounded border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. admin"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-heading">
                  Current Password
                </label>
                <input
                  type="password"
                  className="mt-2 w-full rounded border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light"
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
                <label className="text-sm font-semibold text-heading">
                  New Password
                </label>
                <input
                  type="password"
                  className="mt-2 w-full rounded border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light"
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, newPassword: e.target.value }))
                  }
                  placeholder="Enter new password"
                />
              </div>

              <ErrorBanner message={error} />

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
