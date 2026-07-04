import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import useServiceStore from "../../store/serviceStore.js";
import ConfirmModal from "../../components/ui/ConfirmModal.jsx";
import Select from "../../components/ui/Select.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import { TableSkeleton } from "../../components/ui/Skeleton.jsx";
import imageUrl from "../../utils/imageUrl.js";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import AdminListFooter from "../../components/ui/AdminListFooter.jsx";
import SearchInput from "../../components/ui/SearchInput.jsx";
import TableEmptyState from "../../components/ui/TableEmptyState.jsx";
import FormField from "../../components/ui/FormField.jsx";
import FileUploadField from "../../components/ui/FileUploadField.jsx";
import FormActions from "../../components/ui/FormActions.jsx";
import ErrorBanner from "../../components/ui/ErrorBanner.jsx";

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
      category: "",
      offerings: [],
      benefits: [],
      target_audience: [],
      faq: [],
      case_study: { title: "", description: "", stats: [] },
      clients: [],
    }),
    [],
  );

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteAllTarget, setDeleteAllTarget] = useState(false);

  const [tagInputs, setTagInputs] = useState({ offerings: "", target_audience: "", benefits: "" });

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

  function onAddFaq() {
    setForm((f) => ({
      ...f,
      faq: [...f.faq, { q: "", a: "" }],
    }));
  }

  function onRemoveFaq(index) {
    setForm((f) => ({ ...f, faq: f.faq.filter((_, i) => i !== index) }));
  }

  function onUpdateFaq(index, key, value) {
    setForm((f) => ({
      ...f,
      faq: f.faq.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }));
  }

  function onAddCaseStudyStat() {
    setForm((f) => ({
      ...f,
      case_study: {
        ...f.case_study,
        stats: [...f.case_study.stats, { value: "", suffix: "", label: "" }],
      },
    }));
  }

  function onRemoveCaseStudyStat(index) {
    setForm((f) => ({
      ...f,
      case_study: {
        ...f.case_study,
        stats: f.case_study.stats.filter((_, i) => i !== index),
      },
    }));
  }

  function onUpdateCaseStudyStat(index, key, value) {
    setForm((f) => ({
      ...f,
      case_study: {
        ...f.case_study,
        stats: f.case_study.stats.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
      },
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

  function onPickImage(file) {
    setForm((f) => ({ ...f, image: file }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
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
    payload.append("category", form.category.trim());
    payload.append("offerings", JSON.stringify(form.offerings));
    payload.append("benefits", JSON.stringify(form.benefits));
    payload.append("target_audience", JSON.stringify(form.target_audience));
    payload.append("faq", JSON.stringify(form.faq));
    payload.append("case_study", JSON.stringify(form.case_study));

    const clientsForJson = form.clients.map((c, i) => {
      if (c._avatarFile instanceof File) {
        payload.append(`clientAvatar_${i}`, c._avatarFile);
      }
      const { _avatarFile, avatar, ...rest } = c;
      return { ...rest, avatar: c._avatarFile ? "" : (avatar ?? "") };
    });
    payload.append("clients", JSON.stringify(clientsForJson));

    try {
      if (form.service_id) {
        await updateService(form.service_id, payload);
        toast.success("Service updated successfully.");
      } else {
        await createService(payload);
        toast.success("Service created successfully.");
      }

      setForm(emptyForm);
      setTagInputs({ offerings: "", target_audience: "", benefits: "" });
      await load();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Operation failed.";
      setError(msg);
      toast.error(msg);
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
      toast.success("Service deleted successfully.");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Delete failed.";
      setError(msg);
      toast.error(msg);
      setDeleteTarget(null);
    }
  }

  async function onConfirmDeleteAll() {
    try {
      await deleteAllServices();
      toast.success("All services deleted successfully.");
      setDeleteAllTarget(false);
      await load();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Delete all failed.";
      setError(msg);
      toast.error(msg);
      setDeleteAllTarget(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <AdminPageHeader
          title="Services Management"
          subtitle="Create, update, and remove service records."
        />
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by service name..."
          />
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
            <FormField
              label="Service Name"
              value={form.service_name}
              onChange={(e) => setForm((f) => ({ ...f, service_name: e.target.value }))}
              placeholder="e.g. SEO Optimization"
            />
            <FormField
              label="Short Description"
              value={form.short_description}
              onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
              placeholder="Brief summary of the service"
            />
            <FormField
              label="Description"
              textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Detailed description of the service"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Status"
                value={form.status}
                onChange={(val) => setForm((f) => ({ ...f, status: val }))}
                selectOptions={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                ]}
              />
              <FileUploadField
                label="Image"
                required
                file={form.image instanceof File ? form.image : null}
                existingUrl={typeof form.image === "string" ? form.image : ""}
                onChange={onPickImage}
                onRemove={() => setForm((f) => ({ ...f, image: "" }))}
              />
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

            <FormField
              label="Category"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="e.g. Digital Marketing, Web Development"
            />

            <div>
              <label className="text-sm font-semibold text-gray-800">Benefits</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.benefits.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-100">
                    {tag}
                    <button type="button" onClick={() => onRemoveTag("benefits", i)} className="ml-1 text-green-400 hover:text-green-600 cursor-pointer">&times;</button>
                  </span>
                ))}
              </div>
              <input
                className={`mt-2 ${inputCls}`}
                value={tagInputs.benefits}
                onChange={(e) => setTagInputs((t) => ({ ...t, benefits: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAddTag("benefits", tagInputs.benefits); } }}
                placeholder="e.g. Increased ROI, Faster Results"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-800">FAQ</label>
                <button type="button" onClick={onAddFaq} className="text-sm font-semibold text-red-600 hover:text-red-500 cursor-pointer">+ Add</button>
              </div>
              {form.faq.map((item, i) => (
                <div key={i} className="mt-3 relative border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">FAQ {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveFaq(i)}
                      className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                      title="Remove FAQ">
                      <TrashIcon />
                    </button>
                  </div>
                  <input className={inputCls} placeholder="Question" value={item.q} onChange={(e) => onUpdateFaq(i, "q", e.target.value)} />
                  <textarea rows={2} className={`${inputCls} resize-none`} placeholder="Answer" value={item.a} onChange={(e) => onUpdateFaq(i, "a", e.target.value)} />
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-800">Case Study</label>
              </div>
              <input
                className={`mt-2 ${inputCls}`}
                value={form.case_study.title}
                onChange={(e) => setForm((f) => ({ ...f, case_study: { ...f.case_study, title: e.target.value } }))}
                placeholder="Case study title"
              />
              <textarea
                rows={2}
                className={`mt-2 ${inputCls} resize-none`}
                value={form.case_study.description}
                onChange={(e) => setForm((f) => ({ ...f, case_study: { ...f.case_study, description: e.target.value } }))}
                placeholder="Case study description"
              />
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">Stats</span>
                  <button type="button" onClick={onAddCaseStudyStat} className="text-xs font-semibold text-red-600 hover:text-red-500 cursor-pointer">+ Add Stat</button>
                </div>
                {form.case_study.stats.map((stat, i) => (
                  <div key={i} className="mt-2 flex gap-2 items-center">
                    <input className={inputCls} placeholder="Value" value={stat.value} onChange={(e) => onUpdateCaseStudyStat(i, "value", e.target.value)} />
                    <input className={`${inputCls} w-20`} placeholder="Suffix" value={stat.suffix} onChange={(e) => onUpdateCaseStudyStat(i, "suffix", e.target.value)} />
                    <input className={inputCls} placeholder="Label" value={stat.label} onChange={(e) => onUpdateCaseStudyStat(i, "label", e.target.value)} />
                    <button type="button" onClick={() => onRemoveCaseStudyStat(i)} className="text-gray-400 hover:text-red-500 cursor-pointer shrink-0"><TrashIcon /></button>
                  </div>
                ))}
              </div>
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
                  <div className="relative">
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
                    {(client._avatarFile || client.avatar) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setForm((f) => ({
                            ...f,
                            clients: f.clients.map((c, ci) =>
                              ci === i ? { ...c, _avatarFile: null, avatar: "" } : c
                            ),
                          }));
                        }}
                        className="absolute top-5 right-1 p-1 bg-white/80 hover:bg-red-50 rounded-full shadow transition cursor-pointer"
                        title="Remove avatar">
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
                    )}
                  </div>
                </div>
              ))}
            </div>

            <ErrorBanner message={error} />

            <FormActions
              submitting={submitting}
              editId={form.service_id}
              onSubmit={onSubmit}
              onReset={() => setForm(emptyForm)}
              submitLabel={form.service_id ? "Update Service" : "Create Service"}
            />
          </form>
        </div>

        <div className="lg:col-span-3 bg-white border border-gray-200 rounded p-5 shadow-xs flex flex-col">
          <AdminListFooter
            loading={loading}
            total={pagination.total}
            itemsLength={items.length}
            onDeleteAll={() => setDeleteAllTarget(true)}
            label="Services"
          />

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
                              category: s.category ?? "",
                              offerings: s.offerings ?? [],
                              benefits: s.benefits ?? [],
                              target_audience: s.target_audience ?? [],
                              faq: s.faq ?? [],
                              case_study: s.case_study ?? { title: "", description: "", stats: [] },
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
                  <TableEmptyState
                    colSpan={4}
                    message="No services found"
                    submessage="Create a new service to get started."
                  />
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
