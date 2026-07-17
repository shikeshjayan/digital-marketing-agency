import { useEffect, useRef, useState } from "react";
import useDebounce from "../../hooks/useDebounce.js";
import useIsMobile from "../../hooks/useIsMobile.js";
import { toast } from "sonner";
import useServiceStore from "../../store/serviceStore.js";
import ConfirmModal from "../../components/ui/ConfirmModal.jsx";
import Select from "../../components/ui/Select.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import { TableSkeleton } from "../../components/ui/Skeleton.jsx";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import AdminListFooter from "../../components/ui/AdminListFooter.jsx";
import SearchInput from "../../components/ui/SearchInput.jsx";
import TableEmptyState from "../../components/ui/TableEmptyState.jsx";
import FormField from "../../components/ui/FormField.jsx";
import FileUploadField from "../../components/ui/FileUploadField.jsx";
import FormActions from "../../components/ui/FormActions.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

const inputCls =
  "w-full rounded border border-border bg-surface px-4 py-2 text-sm text-text outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary-light placeholder:text-muted";

const EMPTY_FORM = {
  service_id: null,
  service_name: "",
  slug: "",
  short_description: "",
  description: "",
  status: "Active",
  hero_image: "",
  icon: "",
  deliverables: [],
  benefits: [],
  featured: false,
  display_order: 0,
  seo: { meta_title: "", meta_description: "" },
};

export default function AdminServices() {
  const {
    fetchAdminServices,
    createService,
    updateService,
    deleteService,
    deleteAllServices,
  } = useServiceStore();

  const isMobile = useIsMobile();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteAllTarget, setDeleteAllTarget] = useState(false);

  const [tagInputs, setTagInputs] = useState({
    deliverables: "",
    benefits: "",
  });

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

  const load = async () => {
    setLoading(true);
    try {
      const result = await fetchAdminServices({
        search: search || undefined,
        status: status === "Featured" ? undefined : status || undefined,
        featured: status === "Featured" ? "true" : undefined,
        page,
        limit: isMobile ? 200 : 8,
      });
      setItems(result?.items ?? []);
      setPagination(result?.pagination ?? { total: 0, page: 1, pages: 1 });
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load services."
      );
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

  useDebounce(() => load(), [page, search, status], 250);

  function onPickHeroImage(file) {
    setForm((f) => ({ ...f, hero_image: file }));
  }

  function onPickIcon(file) {
    setForm((f) => ({ ...f, icon: file }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    if (
      !form.service_name.trim() ||
      !form.short_description.trim() ||
      !form.description.trim()
    ) {
      toast.error("Please fill Service Name, Short Description, and Description.");
      setSubmitting(false);
      return;
    }

    if (!form.hero_image && !form.service_id) {
      toast.error("Please upload a hero image.");
      setSubmitting(false);
      return;
    }

    const payload = new FormData();

    if (form.hero_image instanceof File) {
      payload.append("hero_image", form.hero_image);
    } else if (form.service_id && !form.hero_image) {
      payload.append("removeHeroImage", "true");
    }

    if (form.icon instanceof File) {
      payload.append("icon", form.icon);
    } else if (typeof form.icon === "string") {
      payload.append("icon", form.icon);
    }

    payload.append("service_name", form.service_name.trim());
    payload.append("short_description", form.short_description.trim());
    payload.append("description", form.description.trim());
    payload.append("status", form.status);
    payload.append("featured", String(form.featured));
    payload.append("display_order", String(form.display_order || 0));
    payload.append("deliverables", JSON.stringify(form.deliverables));
    payload.append("benefits", JSON.stringify(form.benefits));
    payload.append("seo", JSON.stringify(form.seo));

    try {
      if (form.service_id) {
        await updateService(form.service_id, payload);
        toast.success("Service updated successfully.");
      } else {
        await createService(payload);
        toast.success("Service created successfully.");
      }

      setForm(EMPTY_FORM);
      setTagInputs({ deliverables: "", benefits: "" });
      await load();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Operation failed."
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
      toast.success("Service deleted successfully.");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Delete failed."
      );
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
      toast.error(
        err?.response?.data?.message || err?.message || "Delete all failed."
      );
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

      <div className="mt-6 bg-background border border-border rounded p-5 shadow-xs hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by service name..."
          />
          <Select
            value={status}
            onChange={setStatus}
            placeholder="All items"
            options={[
              { value: "", label: "All items" },
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
              { value: "Featured", label: "Featured" },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div
          ref={formRef}
          className="lg:col-span-2 bg-background border border-border rounded p-4 shadow-xs lg:h-[80vh] flex flex-col">
          <div className="font-extrabold text-heading shrink-0">
            {form.service_id ? "Edit Service" : "Add New Service"}
          </div>

          <form
            onSubmit={onSubmit}
            className="mt-4 flex flex-col flex-1 min-h-0 gap-3">
            <div className="flex-1 overflow-y-auto space-y-3">
              <FormField
                label="Service Name"
                value={form.service_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, service_name: e.target.value }))
                }
                maxLength={50}
                maxWords={6}
                showWordCount
                placeholder="e.g. SEO Optimization"
              />

              {form.slug && (
                <div>
                  <label className="text-sm font-semibold text-heading">
                    Slug
                  </label>
                  <input
                    className={`${inputCls} bg-surface/50 cursor-not-allowed`}
                    value={form.slug}
                    readOnly
                  />
                </div>
              )}

              <FormField
                label="Short Description"
                value={form.short_description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, short_description: e.target.value }))
                }
                maxLength={160}
                maxWords={25}
                showWordCount
                placeholder="Brief summary of the service"
              />
              <FormField
                label="Description"
                textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                maxLength={2000}
                maxWords={300}
                showWordCount
                placeholder="Detailed description of the service"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  label="Status"
                  value={form.status}
                  onChange={(val) => setForm((f) => ({ ...f, status: val }))}
                  selectOptions={[
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                  ]}
                />
                <FormField
                  label="Display Order"
                  type="number"
                  value={form.display_order}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setForm((f) => ({
                      ...f,
                      display_order: raw === "" ? raw : Math.max(0, Number(raw)),
                    }));
                  }}
                  min={0}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, featured: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                </label>
                <span className="text-sm font-semibold text-heading">
                  Featured Service
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FileUploadField
                  label="Hero Image"
                  required
                  file={
                    form.hero_image instanceof File ? form.hero_image : null
                  }
                  existingUrl={
                    typeof form.hero_image === "string" ? form.hero_image : ""
                  }
                  onChange={onPickHeroImage}
                  onRemove={() => setForm((f) => ({ ...f, hero_image: "" }))}
                  confirmText="Remove hero image?"
                />
                <FileUploadField
                  label="Icon"
                  file={form.icon instanceof File ? form.icon : null}
                  existingUrl={typeof form.icon === "string" ? form.icon : ""}
                  onChange={onPickIcon}
                  onRemove={() => setForm((f) => ({ ...f, icon: "" }))}
                  confirmText="Remove icon?"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-heading">
                  Deliverables
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.deliverables.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 bg-primary-light text-primary text-sm font-semibold px-3 py-1 rounded-full border border-primary/20">
                      {tag}
                      <button
                        type="button"
                        onClick={() => onRemoveTag("deliverables", i)}
                        className="ml-1 text-danger hover:text-red-700 cursor-pointer">
                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  className={`mt-2 ${inputCls}`}
                  value={tagInputs.deliverables}
                  onChange={(e) =>
                    setTagInputs((t) => ({
                      ...t,
                      deliverables: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onAddTag("deliverables", tagInputs.deliverables);
                    }
                  }}
                  maxLength={60}
                  placeholder="e.g. Keyword Research, On-Page SEO, Link Building"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-heading">
                  Benefits
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.benefits.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 bg-success/10 text-success text-sm font-semibold px-3 py-1 rounded-full border border-success/20">
                      {tag}
                      <button
                        type="button"
                        onClick={() => onRemoveTag("benefits", i)}
                        className="ml-1 text-success hover:text-success/80 cursor-pointer">
                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  className={`mt-2 ${inputCls}`}
                  value={tagInputs.benefits}
                  onChange={(e) =>
                    setTagInputs((t) => ({ ...t, benefits: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onAddTag("benefits", tagInputs.benefits);
                    }
                  }}
                  maxLength={200}
                  placeholder="e.g. Increased ROI, Faster Results"
                />
              </div>

              <div className="border border-border rounded-lg p-3 space-y-3">
                <div className="text-sm font-semibold text-heading">
                  SEO Settings
                </div>
                <FormField
                  label="Meta Title"
                  value={form.seo.meta_title}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      seo: { ...f.seo, meta_title: e.target.value },
                    }))
                  }
                  maxLength={60}
                  maxWords={10}
                  showWordCount
                  placeholder="SEO page title"
                />
                <FormField
                  label="Meta Description"
                  textarea
                  rows={2}
                  value={form.seo.meta_description}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      seo: { ...f.seo, meta_description: e.target.value },
                    }))
                  }
                  maxLength={155}
                  maxWords={25}
                  showWordCount
                  placeholder="SEO page description"
                />
              </div>
            </div>

            <div className="shrink-0">
              <FormActions
                submitting={submitting}
                editId={form.service_id}
                onSubmit={onSubmit}
                onReset={() => setForm(EMPTY_FORM)}
                submitLabel={
                  form.service_id ? "Update Service" : "Create Service"
                }
              />
            </div>
          </form>
        </div>

        <div className="md:hidden">
          <div className="bg-background border border-border rounded p-5 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by service name..."
              />
              <Select
                value={status}
                onChange={setStatus}
                placeholder="All items"
                options={[
                  { value: "", label: "All items" },
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                  { value: "Featured", label: "Featured" },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-background border border-border rounded p-5 shadow-xs flex flex-col sm:max-h-none max-h-[70vh] lg:h-[80vh]">
          <AdminListFooter
            loading={loading}
            total={pagination.total}
            itemsLength={items.length}
            onDeleteAll={() => setDeleteAllTarget(true)}
            label="Services"
          />

          <div className="mt-4 overflow-auto flex-1">
            <table className="w-full text-sm block sm:table">
              <thead className="hidden sm:table-header-group">
                <tr className="text-left text-text">
                  <th className="py-2 pr-3 pl-3">Service</th>
                  <th className="py-2 pr-3 hidden md:table-cell">Featured</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="block sm:table-row-group">
                {loading && !items.length ? (
                  <TableSkeleton rows={5} cols={4} />
                ) : (
                  items.map((s) => (
                    <tr
                      key={s._id}
                      className="block sm:table-row border sm:border-t border-border mb-3 sm:mb-0 p-3 sm:p-0 rounded-lg sm:rounded-none bg-surface/50 sm:bg-transparent">
                      <td className="block sm:table-cell py-1 sm:py-3 pl-0 sm:pl-3 pr-0 sm:pr-3">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">
                          Service
                        </span>
                        <div className="font-bold text-heading break-words sm:truncate sm:max-w-[200px]">
                          {s.service_name}
                        </div>
                        <div className="text-muted text-sm break-words sm:truncate sm:max-w-[200px]">
                          {s.short_description}
                        </div>
                      </td>
                      <td className="block sm:table-cell py-1 sm:py-3 pr-0 sm:pr-3">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">
                          Featured
                        </span>
                        {s.featured && (
                          <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold border bg-info/10 text-info border-info/20">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="block sm:table-cell py-1 sm:py-3 pr-0 sm:pr-3">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">
                          Status
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold border ${
                            s.status === "Active"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="block sm:table-cell py-1 sm:py-3">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">
                          Actions
                        </span>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            type="button"
                            className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-text hover:text-heading rounded transition cursor-pointer"
                            onClick={() => {
                              setForm({
                                service_id: s._id,
                                service_name: s.service_name,
                                slug: s.slug ?? "",
                                short_description: s.short_description,
                                description: s.description,
                                status: s.status,
                                hero_image: s.hero_image ?? "",
                                icon: s.icon ?? "",
                                deliverables: s.deliverables ?? [],
                                benefits: s.benefits ?? [],
                                featured: s.featured ?? false,
                                display_order: s.display_order ?? 0,
                                seo: s.seo ?? {
                                  meta_title: "",
                                  meta_description: "",
                                },
                              });
                              formRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            }}
                            title="Edit"
                            aria-label="Edit">
                            <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-danger hover:text-primary-hover rounded transition cursor-pointer"
                            title="Delete"
                            aria-label="Delete"
                            onClick={() => onDelete(s._id)}>
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="w-4 h-4"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
          <div className="hidden sm:block">
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        danger
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
        message="Are you sure you want to delete this service? This action cannot be undone."
      />
      <ConfirmModal
        danger
        open={deleteAllTarget}
        onCancel={() => setDeleteAllTarget(false)}
        onConfirm={onConfirmDeleteAll}
        message="Are you sure you want to delete ALL services? This action cannot be undone."
      />
    </div>
  );
}
