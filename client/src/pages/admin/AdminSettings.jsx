import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSettingsStore from "../../store/settingsStore.js";
import FileUploadField from "../../components/ui/FileUploadField.jsx";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import ErrorBanner from "../../components/ui/ErrorBanner.jsx";
import resolveImagePath from "../../utils/resolveImagePath.js";
import { changePasswordSchema } from "../../utils/formSchemas.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function AdminSettings() {
  const { loading, fetchProfile, updateProfile, profile } = useSettingsStore();
  const [form, setForm] = useState({
    name: "",
    photo: "",
    currentPassword: "",
    newPassword: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [originalName, setOriginalName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const matchProgress = useMemo(() => {
    if (!confirmPassword) return 0;
    if (form.newPassword === confirmPassword) return 100;
    let matching = 0;
    const minLen = Math.min(form.newPassword.length, confirmPassword.length);
    for (let i = 0; i < minLen; i++) {
      if (form.newPassword[i] === confirmPassword[i]) matching++;
      else break;
    }
    const maxLen = Math.max(form.newPassword.length, confirmPassword.length, 1);
    return Math.round((matching / maxLen) * 100);
  }, [form.newPassword, confirmPassword]);

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        if (data) {
          setOriginalName(data.name ?? "");
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
    setFieldErrors({});
    setSaving(true);

    const hasPasswordFields =
      form.currentPassword || form.newPassword || confirmPassword;

    if (hasPasswordFields) {
      try {
        changePasswordSchema.validateSync(
          {
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
            confirmPassword,
          },
          { abortEarly: false },
        );
      } catch (err) {
        const errMap = {};
        err.inner.forEach((e) => {
          errMap[e.path] = e.message;
        });
        setFieldErrors(errMap);
        setSaving(false);
        return;
      }
    }

    try {
      const formData = new FormData();
      if (form.name !== originalName) {
        formData.append("name", form.name);
      }
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
        setOriginalName(updatedProfile.name ?? originalName);
        setForm((f) => ({
          ...f,
          name: updatedProfile.name ?? f.name,
          photo: updatedProfile.photo ?? "",
          currentPassword: "",
          newPassword: "",
        }));
        setConfirmPassword("");
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

      {profile && (
        <div className="mt-6 bg-background border border-border rounded p-5 shadow-xs">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-primary border border-border overflow-hidden flex items-center justify-center shrink-0">
              {profile.photo ? (
                <img
                  src={resolveImagePath(profile.photo)}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-background">
                  {profile.name?.charAt(0)?.toUpperCase() ?? "A"}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-extrabold text-heading truncate">
                {profile.name}
              </div>
              <div className="text-sm text-text truncate mt-0.5">
                {profile.email}
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-info/10 text-info border-info/20 capitalize">
                  {profile.role}
                </span>
                <span className="text-xs text-muted">
                  Member since{" "}
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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
              confirmText="Remove photo?"
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
                <div className="relative mt-2">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    className="w-full rounded border border-border bg-surface px-4 py-2 pr-12 outline-none focus:ring-2 focus:ring-primary-light [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                    value={form.currentPassword}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        currentPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-muted hover:text-primary cursor-pointer">
                    <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                  </button>
                </div>
                {fieldErrors.currentPassword && (
                  <span className="text-xs text-primary mt-1 block">
                    {fieldErrors.currentPassword}
                  </span>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-heading">
                  New Password
                </label>
                <div className="relative mt-2">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="w-full rounded border border-border bg-surface px-4 py-2 pr-12 outline-none focus:ring-2 focus:ring-primary-light [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, newPassword: e.target.value }))
                    }
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-muted hover:text-primary cursor-pointer">
                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                  </button>
                </div>
                {fieldErrors.newPassword && (
                  <span className="text-xs text-primary mt-1 block">
                    {fieldErrors.newPassword}
                  </span>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-heading">
                  Confirm Password
                </label>
                <div className="relative mt-2">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full rounded border border-border bg-surface px-4 py-2 pr-12 outline-none focus:ring-2 focus:ring-primary-light [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-muted hover:text-primary cursor-pointer">
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <span className="text-xs text-primary mt-1 block">
                    {fieldErrors.confirmPassword}
                  </span>
                )}
                {confirmPassword.length > 0 && (
                  <div className="mt-3">
                    <div className="h-1 w-full rounded-full bg-border overflow-hidden">
                      <div
                        className={`h-1 rounded-full transition-all duration-300 ${
                          matchProgress === 100 ? "bg-success" : "bg-primary"
                        }`}
                        style={{ width: `${matchProgress}%` }}
                      />
                    </div>
                  </div>
                )}
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
