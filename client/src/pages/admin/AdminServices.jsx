import { useEffect, useMemo, useRef, useState } from "react";
import useServiceStore from "../../store/serviceStore.js";
import Button from "../../components/ui/Button.jsx";
import Select from "../../components/ui/Select.jsx";

function FileToDataUrl({ file }) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export default function AdminServices() {
  const { fetchAdminServices, createService, updateService, deleteService } =
    useServiceStore();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const emptyForm = useMemo(
    () => ({
      service_id: null,
      service_name: "",
      short_description: "",
      description: "",
      status: "Active",
      image: "",
    }),
    [],
  );

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminServices({
        search: search || undefined,
        status: status || undefined,
        page: 1,
        limit: 50,
      });
      setItems(data ?? []);
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

  async function onPickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB.");
      return;
    }
    const dataUrl = await FileToDataUrl({ file });
    setForm((f) => ({ ...f, image: dataUrl }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setToast("");
    setSubmitting(true);

    if (
      !form.service_name.trim() ||
      !form.short_description.trim() ||
      !form.description.trim()
    ) {
      setError("Please fill Service Name, Short Description, and Description.");
      setSubmitting(false);
      return;
    }

    if (!form.image) {
      setError("Please upload an image.");
      setSubmitting(false);
      return;
    }

    const payload = {
      service_name: form.service_name.trim(),
      short_description: form.short_description.trim(),
      description: form.description.trim(),
      image: form.image,
      status: form.status,
    };

    try {
      if (form.service_id) {
        await updateService(form.service_id, payload);
        setToast("Service updated successfully.");
      } else {
        await createService(payload);
        setToast("Service created successfully.");
      }

      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Operation failed.",
      );
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
      await deleteService(deleteTarget);
      setToast("Service deleted successfully.");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Delete failed.",
      );
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Services Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Create, update, and remove service records.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="w-full rounded border border-gray-200 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
              placeholder="Search by service name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
        <div ref={formRef} className="lg:col-span-2 bg-white border border-gray-200 rounded p-4 shadow-sm self-start">
          <div className="font-extrabold text-gray-900">
            {form.service_id ? "Edit Service" : "Add New Service"}
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Service Name
              </label>
              <input
                className="mt-2 w-full rounded border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.service_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, service_name: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Short Description
              </label>
              <input
                className="mt-2 w-full rounded border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.short_description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, short_description: e.target.value }))
                }
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
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Status
                </label>
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
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Image <span className="text-red-500">*</span>
                </label>
                <label className="mt-2 flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-red-400 hover:bg-red-50 transition">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-500 mt-1">
                    {form.image ? "Change Photo" : "Choose Photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onPickImage}
                  />
                </label>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded px-4 py-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            {toast && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded px-4 py-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {toast}
              </div>
            )}

            <div className="flex gap-2">
              {form.service_id && (
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
                className="flex-1 rounded bg-red-600 text-white py-2.5 font-extrabold hover:bg-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {submitting ? "Saving..." : form.service_id ? "Update Service" : "Create Service"}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-3 bg-white border border-gray-200 rounded p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="font-extrabold text-gray-900">Services</div>
            <div className="text-sm text-gray-500">
              {loading ? "Loading..." : `${items.length} items`}
            </div>
          </div>

          <div className="mt-4 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-3 hidden sm:table-cell">ID</th>
                  <th className="py-2 pr-3">Service</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr
                    key={s._id}
                    className="border-t border-gray-100 align-top">
                    <td className="py-3 pr-3 text-gray-700 hidden sm:table-cell">
                      <span className="block max-w-[80px] truncate" title={s._id}>
                        {s._id}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="font-bold text-gray-900">
                        {s.service_name}
                      </div>
                      <div className="text-gray-500 text-xs sm:text-sm">{s.short_description}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                          s.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-yellow-50 text-yellow-700 border-yellow-100"
                        }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                          className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm text-gray-600 hover:text-gray-800 rounded transition cursor-pointer"
                          onClick={() => {
                            setForm({
                              service_id: s._id,
                              service_name: s.service_name,
                              short_description: s.short_description,
                              description: s.description,
                              status: s.status,
                              image: s.image ?? "",
                            });
                            formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm text-red-600 hover:text-red-500 rounded transition cursor-pointer"
                          onClick={() => onDelete(s._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && !loading && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center text-gray-400">
                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <div className="font-semibold">No services found</div>
                        <div className="text-sm mt-1">Create a new service to get started.</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-gray-700 text-sm">Are you sure you want to delete this service? This action cannot be undone.</p>
              <div className="flex gap-3 mt-6 w-full">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer">
                  Cancel
                </button>
                <button
                  onClick={onConfirmDelete}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition cursor-pointer">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
