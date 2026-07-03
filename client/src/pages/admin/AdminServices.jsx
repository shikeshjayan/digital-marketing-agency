import { useEffect, useMemo, useRef, useState } from "react";
import useServiceStore from "../../store/serviceStore.js";
import ConfirmModal from "../../components/ui/ConfirmModal.jsx";
import Select from "../../components/ui/Select.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import { TableSkeleton } from "../../components/ui/Skeleton.jsx";
import imageUrl from "../../utils/imageUrl.js";

const inputCls = "w-full rounded border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100 placeholder:text-gray-400";

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export default function AdminServices() {
  const { fetchAdminServices, createService, updateService, deleteService, deleteAllServices } =
    useServiceStore();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const emptyForm = useMemo(
    () => ({
      service_id: null,
      service_name: "",
      short_description: "",
      description: "",
      status: "Active",
      image: "",
      offerings: [],
      target_audience: [],
      clients: [],
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

  const [tagInputs, setTagInputs] = useState({ offerings: "", target_audience: "" });

  function onAddTag(field, value) {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (form[field].includes(trimmed)) return;
    setForm((f) => ({ ...f, [field]: [...f[field], trimmed] }));
    setTagInputs((t) => ({ ...t, [field]: "" }));
  }

  function onRemoveTag(field, index) {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== index) }));
  }

  function onAddClient() {
    setForm((f) => ({
      ...f,
      clients: [...f.clients, { name: "", position: "", company: "", quote: "", avatar: "", _avatarFile: null }],
    }));
  }

  function onPickClientAvatar(index, file) {
    if (!file) return;
    setForm((f) => ({
      ...f,
      clients: f.clients.map((c, i) =>
        i === index ? { ...c, _avatarFile: file, avatar: URL.createObjectURL(file) } : c
      ),
    }));
  }

  function onRemoveClient(index) {
    setForm((f) => ({ ...f, clients: f.clients.filter((_, i) => i !== index) }));
  }

  function onUpdateClient(index, key, value) {
    setForm((f) => ({
      ...f,
      clients: f.clients.map((c, i) => (i === index ? { ...c, [key]: value } : c)),
    }));
  }

  const load = async () => {
    setLoading(true);
    try {
      const result = await fetchAdminServices({
        search: search || undefined,
        status: status || undefined,
        page,
        limit: 10,
      });
      setItems(result?.items ?? []);
      setPagination(result?.pagination ?? { total: 0, page: 1, pages: 1 });
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
    setPage(1);
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(() => load(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, status]);

  function onPickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB.");
      return;
    }
    setForm((f) => ({ ...f, image: file }));
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

    if (!form.image && !form.service_id) {
      setError("Please upload an image.");
      setSubmitting(false);
      return;
    }

    if (form.clients.length === 0) {
      setError("Please add at least one client testimonial.");
      setSubmitting(false);
      return;
    }

    for (let i = 0; i < form.clients.length; i++) {
      const c = form.clients[i];
      if (!c.name.trim() || !c.position.trim() || !c.company.trim() || !c.quote.trim()) {
        setError(`Please fill all fields for Client ${i + 1}.`);
        setSubmitting(false);
        return;
      }
    }

    const payload = new FormData();
    if (form.image instanceof File) {
      payload.append("image", form.image);
    } else if (form.service_id && !form.image) {
      payload.append("removeImage", "true");
    }
    payload.append("service_name", form.service_name.trim());
    payload.append("short_description", form.short_description.trim());
    payload.append("description", form.description.trim());
    payload.append("status", form.status);
    payload.append("offerings", JSON.stringify(form.offerings));
    payload.append("target_audience", JSON.stringify(form.target_audience));

    // Append client avatar files as separate fields, strip _avatarFile from JSON
    const clientsForJson = form.clients.map((c, i) => {
      if (c._avatarFile instanceof File) {
        payload.append(`clientAvatar_${i}`, c._avatarFile);
      }
      const { _avatarFile, avatar, ...rest } = c;
      // keep existing avatar URL if no new file picked
      return { ...rest, avatar: c._avatarFile ? "" : (avatar ?? "") };
    });
    payload.append("clients", JSON.stringify(clientsForJson));

    try {
      if (form.service_id) {
        await updateService(form.service_id, payload);
        setToast("Service updated successfully.");
      } else {
        await createService(payload);
        setToast("Service created successfully.");
      }

      setForm(emptyForm);
      setTagInputs({ offerings: "", target_audience: "" });
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

  async function onConfirmDeleteAll() {
    try {
      await deleteAllServices();
      setToast("All services deleted successfully.");
      setDeleteAllTarget(false);
      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Delete all failed.",
      );
      setDeleteAllTarget(false);
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

      <div className="mt-6 bg-white border border-gray-200 rounded p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className={`${inputCls} pl-10`}
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

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div ref={formRef} className="lg:col-span-2 bg-white border border-gray-200 rounded p-4 shadow-xs">
          <div className="font-extrabold text-gray-900">
            {form.service_id ? "Edit Service" : "Add New Service"}
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Service Name
              </label>
              <input
                className={`mt-2 ${inputCls}`}
                value={form.service_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, service_name: e.target.value }))
                }
                placeholder="e.g. SEO Optimization"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Short Description
              </label>
              <input
                className={`mt-2 ${inputCls}`}
                value={form.short_description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, short_description: e.target.value }))
                }
                placeholder="Brief summary of the service"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Description
              </label>
              <textarea
                rows={2}
                className={`mt-2 ${inputCls} resize-none`}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Detailed description of the service"
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

            <div>
              <label className="text-sm font-semibold text-gray-800">Service Offerings</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.offerings.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1 rounded-full border border-red-100">
                    {tag}
                    <button type="button" onClick={() => onRemoveTag("offerings", i)} className="ml-1 text-red-400 hover:text-red-600 cursor-pointer">&times;</button>
                  </span>
                ))}
              </div>
              <input
                className={`mt-2 ${inputCls}`}
                value={tagInputs.offerings}
                onChange={(e) => setTagInputs((t) => ({ ...t, offerings: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAddTag("offerings", tagInputs.offerings); } }}
                placeholder="e.g. SEO, Content Marketing, PPC"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Target Audience</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.target_audience.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                    {tag}
                    <button type="button" onClick={() => onRemoveTag("target_audience", i)} className="ml-1 text-blue-400 hover:text-blue-600 cursor-pointer">&times;</button>
                  </span>
                ))}
              </div>
              <input
                className={`mt-2 ${inputCls}`}
                value={tagInputs.target_audience}
                onChange={(e) => setTagInputs((t) => ({ ...t, target_audience: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAddTag("target_audience", tagInputs.target_audience); } }}
                placeholder="e.g. Small Businesses, E-commerce, Startups"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-800">Client Testimonials</label>
                <button type="button" onClick={onAddClient} className="text-sm font-semibold text-red-600 hover:text-red-500 cursor-pointer">+ Add</button>
              </div>
              {form.clients.map((client, i) => (
                <div key={i} className="mt-3 relative border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Client {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveClient(i)}
                      className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                      title="Remove client">
                      <TrashIcon />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input className={inputCls} placeholder="Name" value={client.name} onChange={(e) => onUpdateClient(i, "name", e.target.value)} />
                    <input className={inputCls} placeholder="Position" value={client.position} onChange={(e) => onUpdateClient(i, "position", e.target.value)} />
                  </div>
                  <input className={inputCls} placeholder="Company" value={client.company} onChange={(e) => onUpdateClient(i, "company", e.target.value)} />
                  <textarea rows={2} className={`${inputCls} resize-none`} placeholder="Quote" value={client.quote} onChange={(e) => onUpdateClient(i, "quote", e.target.value)} />
                  <div>
                    <label className="text-xs font-semibold text-gray-600">Avatar</label>
                    <label className="mt-1.5 flex items-center gap-3 w-full border-2 border-dashed border-gray-300 rounded-lg px-3 py-2.5 cursor-pointer hover:border-red-400 hover:bg-red-50 transition group">
                      {(client._avatarFile || client.avatar) ? (
                        <img
                          src={client._avatarFile ? client.avatar : imageUrl(client.avatar)}
                          alt="avatar"
                          className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600 group-hover:text-red-600 transition">
                          {(client._avatarFile || client.avatar) ? "Change Avatar" : "Upload Avatar"}
                        </span>
                        <span className="text-xs text-gray-400">JPG, PNG, WEBP · max 4MB</span>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickClientAvatar(i, e.target.files?.[0])} />
                    </label>
                  </div>
                </div>
              ))}
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
                className="flex-1 rounded bg-primary text-white py-2.5 font-extrabold hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {submitting ? "Saving..." : form.service_id ? "Update Service" : "Create Service"}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-3 bg-white border border-gray-200 rounded p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between">
            <div className="font-extrabold text-gray-900">Services</div>
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
                {loading ? "Loading..." : `${pagination.total} items`}
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-auto flex-1">
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
                {loading && !items.length ? (
                  <TableSkeleton rows={5} cols={4} />
                ) : items.map((s) => (
                  <tr
                    key={s._id}
                    className="border-t border-gray-100 align-top">
                    <td className="py-3 pr-3 text-gray-700 hidden sm:table-cell">
                      <span className="block max-w-[80px] truncate" title={s._id}>
                        {s._id}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="font-bold text-gray-900 truncate max-w-[200px]">
                        {s.service_name}
                      </div>
                      <div className="text-gray-500 text-xs sm:text-sm truncate max-w-[200px]">{s.short_description}</div>
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
                           className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-gray-600 hover:text-gray-800 rounded transition cursor-pointer"
                          onClick={() => {
                            setForm({
                              service_id: s._id,
                              service_name: s.service_name,
                              short_description: s.short_description,
                              description: s.description,
                              status: s.status,
                              image: s.image ?? "",
                              offerings: s.offerings ?? [],
                              target_audience: s.target_audience ?? [],
                              clients: s.clients ?? [],
                            });
                            formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}>
                          Edit
                        </button>
                        <button
                          type="button"
                           className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-red-600 hover:text-red-500 rounded transition cursor-pointer"
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
          <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
        message="Are you sure you want to delete this service? This action cannot be undone."
      />
      <ConfirmModal
        open={deleteAllTarget}
        onCancel={() => setDeleteAllTarget(false)}
        onConfirm={onConfirmDeleteAll}
        message="Are you sure you want to delete ALL services? This action cannot be undone."
      />
    </div>
  );
}
