import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import useTechnologyStore from "../../store/technologyStore.js";
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
import ErrorBanner from "../../components/ui/ErrorBanner.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faMicrochip } from "@fortawesome/free-solid-svg-icons";
import resolveImagePath from "../../utils/resolveImagePath.js";

export default function AdminTechnologies() {
  const {
    fetchAdminTechnologies,
    createTechnology,
    updateTechnology,
    deleteTechnology,
    deleteAllTechnologies,
  } = useTechnologyStore();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const emptyForm = useMemo(
    () => ({
      _id: null,
      name: "",
      description: "",
      icon: "",
      iconType: "fontawesome",
      display_order: 0,
      status: "Active",
    }),
    [],
  );

  const [form, setForm] = useState(emptyForm);
  const [iconFile, setIconFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [leftHeight, setLeftHeight] = useState(null);
  const formRef = useRef(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteAllTarget, setDeleteAllTarget] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const result = await fetchAdminTechnologies({
        search: search || undefined,
        status: status || undefined,
        page,
        limit: 4,
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

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setLeftHeight(entry.target.offsetHeight);
    });
    ro.observe(el);
    setLeftHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!form.name.trim()) {
      setError("Technology name is required.");
      setSubmitting(false);
      return;
    }

    try {
      const isFile = iconFile instanceof File;
      const payload = isFile ? new FormData() : {};

      if (isFile) {
        payload.append("name", form.name.trim());
        payload.append("description", form.description.trim());
        payload.append("iconType", form.iconType);
        payload.append("display_order", String(form.display_order));
        payload.append("status", form.status);
        payload.append("icon", iconFile);
      } else {
        payload.name = form.name.trim();
        payload.description = form.description.trim();
        payload.icon = form.icon.trim();
        payload.iconType = form.iconType;
        payload.display_order = form.display_order;
        payload.status = form.status;
        if (!form.icon && form._id) payload.removeIcon = "true";
      }

      if (form._id) {
        await updateTechnology(form._id, payload);
        toast.success("Technology updated successfully.");
      } else {
        await createTechnology(payload);
        toast.success("Technology created successfully.");
      }
      setForm(emptyForm);
      setIconFile(null);
      await load();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Operation failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function onEdit(item) {
    setForm({
      _id: item._id,
      name: item.name,
      description: item.description ?? "",
      icon: item.icon ?? "",
      iconType: item.iconType ?? "fontawesome",
      display_order: item.display_order ?? 0,
      status: item.status,
    });
    setIconFile(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onConfirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteTechnology(deleteTarget);
      toast.success("Technology deleted successfully.");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      const msg = err?.response?.data?.message || "Delete failed.";
      setError(msg);
      toast.error(msg);
      setDeleteTarget(null);
    }
  }

  async function onConfirmDeleteAll() {
    try {
      await deleteAllTechnologies();
      toast.success("All technologies deleted successfully.");
      setDeleteAllTarget(false);
      await load();
    } catch (err) {
      const msg = err?.response?.data?.message || "Delete all failed.";
      setError(msg);
      toast.error(msg);
      setDeleteAllTarget(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <AdminPageHeader
          title="Technology Management"
          subtitle="Create, update, and remove technology records."
        />
      </div>

      <div className="mt-6 bg-background border border-border rounded p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by technology name..."
          />
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

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:items-start">
        <div
          ref={formRef}
          className="lg:col-span-2 bg-background border border-border rounded p-4 shadow-xs lg:h-fit">
          <div className="font-extrabold text-heading">
            {form._id ? "Edit Technology" : "Add New Technology"}
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <FormField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. React, Node.js, MongoDB"
            />
            <FormField
              label="Description"
              textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of this technology"
            />
            <div>
              <label className="text-sm font-semibold text-heading">Icon</label>
              <div className="mt-2 flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="iconType"
                    value="fontawesome"
                    checked={form.iconType === "fontawesome"}
                    onChange={() => setForm((f) => ({ ...f, iconType: "fontawesome" }))}
                    className="accent-primary"
                  />
                  <span className="text-sm text-text">FontAwesome Class</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="iconType"
                    value="image"
                    checked={form.iconType === "image"}
                    onChange={() => setForm((f) => ({ ...f, iconType: "image" }))}
                    className="accent-primary"
                  />
                  <span className="text-sm text-text">Upload Image</span>
                </label>
              </div>
            </div>

            {form.iconType === "fontawesome" ? (
              <FormField
                label="FontAwesome Class"
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                placeholder="e.g. fa-brands fa-react (optional)"
              />
            ) : (
              <FileUploadField
                label="Icon Image"
                file={iconFile}
                existingUrl={form._id && typeof form.icon === "string" && !iconFile ? resolveImagePath(form.icon) : ""}
                onChange={(f) => setIconFile(f)}
                onRemove={() => {
                  setIconFile(null);
                  setForm((f) => ({ ...f, icon: "" }));
                }}
                confirmText="Remove icon image?"
              />
            )}

            {form.icon && !iconFile && (
              <div className="flex items-center gap-2 text-xs text-muted">
                <span>Current:</span>
                {form.iconType === "image" ? (
                  <img src={resolveImagePath(form.icon)} alt="" className="w-6 h-6 object-contain rounded" />
                ) : (
                  <FontAwesomeIcon icon={faMicrochip} className="text-primary" />
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Display Order"
                type="number"
                value={form.display_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, display_order: Number(e.target.value) }))
                }
              />
              <FormField
                label="Status"
                value={form.status}
                onChange={(val) => setForm((f) => ({ ...f, status: val }))}
                selectOptions={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
              />
            </div>

            <ErrorBanner message={error} />

            <FormActions
              submitting={submitting}
              editId={form._id}
              onSubmit={onSubmit}
              onReset={() => { setForm(emptyForm); setIconFile(null); }}
              submitLabel={form._id ? "Update Technology" : "Create Technology"}
            />
          </form>
        </div>

        <div className="lg:col-span-3 bg-background border border-border rounded p-5 shadow-xs flex flex-col lg:overflow-y-auto"
          style={leftHeight ? { height: leftHeight } : undefined}>
          <AdminListFooter
            loading={loading}
            total={pagination.total}
            itemsLength={items.length}
            onDeleteAll={() => setDeleteAllTarget(true)}
            label="Technologies"
          />

          <div className="mt-4 overflow-auto flex-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text">
                  <th className="py-2 pr-3 hidden sm:table-cell">ID</th>
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Order</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && !items.length ? (
                  <TableSkeleton rows={5} cols={5} />
                ) : (
                  items.map((t) => (
                    <tr key={t._id} className="border-t border-border align-top">
                      <td className="py-3 pr-3 text-text hidden sm:table-cell">
                        <span className="block max-w-[80px] truncate" title={t._id}>
                          {t._id}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="font-bold text-heading truncate max-w-[200px]">
                          {t.name}
                        </div>
                        {t.description && (
                          <div className="text-xs text-muted truncate max-w-[200px]">
                            {t.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 pr-3 text-text">{t.display_order}</td>
                      <td className="py-3 pr-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                            t.status === "Active"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            type="button"
                            className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-text hover:text-heading rounded transition cursor-pointer"
                            title="Edit"
                            onClick={() => onEdit(t)}>
                            <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-danger hover:text-red-700 rounded transition cursor-pointer"
                            title="Delete"
                            onClick={() => setDeleteTarget(t._id)}>
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {!items.length && !loading && (
                  <TableEmptyState
                    colSpan={5}
                    message="No technologies found"
                    submessage="Add a new technology to get started."
                  />
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            onPageChange={setPage}
          />
        </div>
      </div>

      <ConfirmModal
        danger
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
        message="Are you sure you want to delete this technology? This action cannot be undone."
      />
      <ConfirmModal
        danger
        open={deleteAllTarget}
        onCancel={() => setDeleteAllTarget(false)}
        onConfirm={onConfirmDeleteAll}
        message="Are you sure you want to delete ALL technologies? This action cannot be undone."
      />
    </div>
  );
}
