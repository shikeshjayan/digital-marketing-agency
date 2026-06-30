import { useEffect, useMemo, useRef, useState } from "react";
import useTeamStore from "../../store/teamStore.js";
import ConfirmModal from "../../components/ui/ConfirmModal.jsx";
import Select from "../../components/ui/Select.jsx";

const resolveUrl = (path) => {
  if (!path || path.startsWith("blob:") || path.startsWith("http")) return path;
  const base = (import.meta.env.VITE_API_URL || "/api/v1").replace(/\/api\/v1\/?$/, "");
  return base + path;
};

export default function AdminTeam() {
  function getInitials(name) {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  const { fetchAdminTeam, createMember, updateMember, deleteMember, deleteAllMembers } =
    useTeamStore();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const emptyForm = useMemo(
    () => ({
      _id: null,
      photo: "",
      name: "",
      designation: "",
      description: "",
      display_order: 1,
      status: "Active",
    }),
    [],
  );

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteAllTarget, setDeleteAllTarget] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminTeam({
        search: search || undefined,
        status: status || undefined,
        page: 1,
        limit: 50,
      });
      setItems(res ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => load(), 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  function onPickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB.");
      return;
    }
    setForm((f) => ({ ...f, photo: file }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setToast("");
    setSubmitting(true);

    if (!form.name.trim() || !form.designation.trim()) {
      setError("Please fill member name and designation.");
      setSubmitting(false);
      return;
    }

    const payload = new FormData();
    if (form.photo instanceof File) {
      payload.append("photo", form.photo);
    } else if (form._id && !form.photo) {
      payload.append("removePhoto", "true");
    }
    payload.append("name", form.name.trim());
    payload.append("designation", form.designation.trim());
    payload.append("description", form.description.trim());
    payload.append("display_order", form.display_order);
    payload.append("status", form.status);

    try {
      if (form._id) {
        await updateMember(form._id, payload);
        setToast("Team member updated successfully.");
      } else {
        await createMember(payload);
        setToast("Team member added successfully.");
      }
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err?.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id) {
    setDeleteTarget(id);
  }

  async function onConfirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMember(deleteTarget);
      setToast("Team member deleted successfully.");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err?.message || "Delete failed.");
      setDeleteTarget(null);
    }
  }

  async function onConfirmDeleteAll() {
    try {
      await deleteAllMembers();
      setToast("All team members deleted successfully.");
      setDeleteAllTarget(false);
      await load();
    } catch (err) {
      setError(err?.message || "Delete all failed.");
      setDeleteAllTarget(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Team Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Create, update, and remove team member records.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              className="w-full rounded border border-gray-200 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
              placeholder="Search by member name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={status}
            onChange={setStatus}
            placeholder="All statuses"
            options={[
              { value: "", label: "All statuses" },
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div
          ref={formRef}
          className="lg:col-span-2 bg-white border border-gray-200 rounded p-4 shadow-sm self-start">
          <div className="font-extrabold text-gray-900">
            {form._id ? "Edit Member" : "Add New Member"}
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div>
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
                <span className="text-sm text-gray-500 mt-1">
                  {form.photo ? "Change Photo" : "Choose Photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickImage}
                />
              </label>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Name
              </label>
              <input
                className="mt-2 w-full rounded border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Designation
              </label>
              <input
                className="mt-2 w-full rounded border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.designation}
                onChange={(e) =>
                  setForm((f) => ({ ...f, designation: e.target.value }))
                }
                placeholder="e.g. Frontend Developer"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Description
              </label>
              <textarea
                rows={2}
                className="mt-2 w-full rounded border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100 resize-none"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief bio or details about the member"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Display Order
                </label>
                <input
                  type="number"
                  className="mt-2 w-full rounded border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      display_order: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Status
                </label>
                <Select
                  value={form.status}
                  onChange={(val) => setForm((f) => ({ ...f, status: val }))}
                  className="mt-2"
                  options={[
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                  ]}
                />
              </div>
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

            <div className="flex gap-2">
              {form._id && (
                <button
                  type="button"
                  className="flex-1 rounded border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setForm(emptyForm)}>
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded bg-red-600 text-white py-2.5 font-extrabold hover:bg-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {submitting
                  ? "Saving..."
                  : form._id
                    ? "Update Member"
                    : "Create Member"}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-3 bg-white border border-gray-200 rounded p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="font-extrabold text-gray-900">Team Members</div>
            <div className="flex items-center gap-3">
              {items.length > 0 && (
                <button
                  type="button"
                  className="text-sm font-semibold text-red-600 hover:text-red-500 transition cursor-pointer"
                  onClick={() => setDeleteAllTarget(true)}>
                  Delete All
                </button>
              )}
              <div className="text-sm text-gray-500">
                {loading ? "Loading..." : `${items.length} items`}
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-3 hidden sm:table-cell">ID</th>
                  <th className="py-2 pr-3">Member</th>
                  <th className="py-2 pr-3">Designation</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((m) => (
                  <tr
                    key={m._id}
                    className="border-t border-gray-100 align-top">
                    <td className="py-3 pr-3 text-gray-700 hidden sm:table-cell">
                      <span
                        className="block max-w-[80px] truncate"
                        title={m._id}>
                        {m._id}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                          {m.photo ? (
                            <img
                              src={resolveUrl(m.photo)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-gray-500">
                              {getInitials(m.name)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 truncate max-w-[150px]">
                            {m.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Order: {m.display_order}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-gray-600 truncate max-w-[150px]">
                      {m.designation}
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                          m.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-yellow-50 text-yellow-700 border-yellow-100"
                        }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                           className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-gray-600 hover:text-gray-800 rounded transition cursor-pointer"
                          onClick={() => {
                            setForm({
                              _id: m._id,
                              photo: m.photo ?? "",
                              name: m.name,
                              designation: m.designation,
                              description: m.description ?? "",
                              display_order: m.display_order ?? 1,
                              status: m.status,
                            });
                            formRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }}>
                          Edit
                        </button>
                        <button
                          type="button"
                           className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-red-600 hover:text-red-500 rounded transition cursor-pointer"
                          onClick={() => onDelete(m._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && !loading && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center text-gray-400">
                        <svg
                          className="w-12 h-12 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <div className="font-semibold">No members found</div>
                        <div className="text-sm mt-1">
                          Add a new team member to get started.
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
        message="Are you sure you want to delete this team member? This action cannot be undone."
      />
      <ConfirmModal
        open={deleteAllTarget}
        onCancel={() => setDeleteAllTarget(false)}
        onConfirm={onConfirmDeleteAll}
        message="Are you sure you want to delete ALL team members? This action cannot be undone."
      />
    </div>
  );
}
