import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useIsMobile from "../../hooks/useIsMobile.js";
import ConfirmModal from "../ui/ConfirmModal.jsx";
import Select from "../ui/Select.jsx";
import Pagination from "../ui/Pagination.jsx";
import { TableSkeleton } from "../ui/Skeleton.jsx";
import AdminPageHeader from "../ui/AdminPageHeader.jsx";
import AdminListFooter from "../ui/AdminListFooter.jsx";
import SearchInput from "../ui/SearchInput.jsx";
import TableEmptyState from "../ui/TableEmptyState.jsx";
import FormField from "../ui/FormField.jsx";
import FileUploadField from "../ui/FileUploadField.jsx";
import FormActions from "../ui/FormActions.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import resolveImagePath from "../../utils/resolveImagePath.js";
import useDebounce from "../../hooks/useDebounce.js";

const EMPTY_FORM = {
  _id: null,
  name: "",
  description: "",
  icon: "",
  iconType: "fontawesome",
  display_order: 0,
  status: "Active",
};

export default function CategoryManagement({ config }) {
  const {
    icon: IconComponent,
    label,
    labelPlural,
    useStore,
    searchPlaceholder,
    fetchKey = "fetchItems",
    createKey = "createItem",
    updateKey = "updateItem",
    deleteKey = "deleteItem",
    deleteAllKey = "deleteAllItems",
  } = config;

  const store = useStore();
  const fetchItems = store[fetchKey];
  const createItem = store[createKey];
  const updateItem = store[updateKey];
  const deleteItem = store[deleteKey];
  const deleteAllItems = store[deleteAllKey];

  const isMobile = useIsMobile();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const [form, setForm] = useState(EMPTY_FORM);
  const [iconFile, setIconFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [leftHeight, setLeftHeight] = useState(null);
  const formRef = useRef(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteAllTarget, setDeleteAllTarget] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const result = await fetchItems({
        search: search || undefined,
        status: status || undefined,
        page,
        limit: isMobile ? 200 : 5,
      });
      setItems(result?.items ?? []);
      setPagination(result?.pagination ?? { total: 0, page: 1, pages: 1 });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || `Failed to load ${labelPlural.toLowerCase()}.`);
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
    setSubmitting(true);

    if (!form.name.trim()) {
      toast.error(`${label} name is required.`);
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
        payload.append("display_order", String(form.display_order || 0));
        payload.append("status", form.status);
        payload.append("icon", iconFile);
      } else {
        payload.name = form.name.trim();
        payload.description = form.description.trim();
        payload.icon = form.icon.trim();
        payload.iconType = form.iconType;
        payload.display_order = form.display_order || 0;
        payload.status = form.status;
        if (!form.icon && form._id) payload.removeIcon = "true";
      }

      if (form._id) {
        await updateItem(form._id, payload);
        toast.success(`${label} updated successfully.`);
      } else {
        await createItem(payload);
        toast.success(`${label} created successfully.`);
      }
      setForm(EMPTY_FORM);
      setIconFile(null);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Operation failed.");
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
      await deleteItem(deleteTarget);
      toast.success(`${label} deleted successfully.`);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed.");
      setDeleteTarget(null);
    }
  }

  async function onConfirmDeleteAll() {
    try {
      await deleteAllItems();
      toast.success(`All ${labelPlural.toLowerCase()} deleted successfully.`);
      setDeleteAllTarget(false);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete all failed.");
      setDeleteAllTarget(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <AdminPageHeader
          title={`${label} Management`}
          subtitle={`Create, update, and remove ${label.toLowerCase()} records.`}
        />
      </div>

      <div className="mt-6 bg-background border border-border rounded p-5 shadow-xs hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={searchPlaceholder}
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
            {form._id ? `Edit ${label}` : `Add New ${label}`}
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <FormField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              maxLength={30}
              maxWords={4}
              showWordCount
              placeholder={`e.g. ${searchPlaceholder.replace("Search by ", "")}`}
            />
            <FormField
              label="Description"
              textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              maxLength={200}
              maxWords={30}
              showWordCount
              placeholder={`Brief description of this ${label.toLowerCase()}`}
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
                maxLength={50}
                showWordCount
                placeholder={`e.g. fa-${label.toLowerCase()} (optional)`}
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
              <div className="flex items-center gap-2 text-sm text-muted">
                <span>Current:</span>
                {form.iconType === "image" ? (
                  <img src={resolveImagePath(form.icon)} alt="" className="w-6 h-6 object-contain rounded" />
                ) : (
                  <FontAwesomeIcon icon={IconComponent} className="text-primary" />
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Display Order"
                type="number"
                value={form.display_order}
                onChange={(e) => {
                  const raw = e.target.value;
                  setForm((f) => ({ ...f, display_order: raw === "" ? raw : Math.max(0, Number(raw)) }));
                }}
                min={0}
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

            <FormActions
              submitting={submitting}
              editId={form._id}
              onSubmit={onSubmit}
              onReset={() => { setForm(EMPTY_FORM); setIconFile(null); }}
              submitLabel={form._id ? `Update ${label}` : `Create ${label}`}
            />
          </form>
        </div>

        <div className="md:hidden">
          <div className="bg-background border border-border rounded p-5 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder={searchPlaceholder}
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
        </div>

        <div className="lg:col-span-3 bg-background border border-border rounded p-5 shadow-xs flex flex-col sm:max-h-none max-h-[70vh]"
          style={leftHeight ? { height: leftHeight } : undefined}>
          <AdminListFooter
            loading={loading}
            total={pagination.total}
            itemsLength={items.length}
            onDeleteAll={() => setDeleteAllTarget(true)}
            label={labelPlural}
          />

          <div className="mt-4 sm:overflow-auto overflow-y-auto flex-1 min-h-0">
            <table className="w-full text-sm block sm:table">
              <thead className="hidden sm:table-header-group">
                <tr className="text-left text-text">
                  <th className="py-2 pr-3 pl-3">Name</th>
                  <th className="py-2 pr-3">Order</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="block sm:table-row-group">
                {loading && !items.length ? (
                  <TableSkeleton rows={5} cols={4} />
                ) : (
                  items.map((item) => (
                    <tr key={item._id} className="block sm:table-row border sm:border-t border-border mb-3 sm:mb-0 p-3 sm:p-0 rounded-lg sm:rounded-none bg-surface/50 sm:bg-transparent">
                      <td className="block sm:table-cell py-1 sm:py-3 pl-0 sm:pl-3 pr-0 sm:pr-3">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">Name</span>
                        <div className="font-bold text-heading sm:truncate sm:max-w-[200px]">
                          {item.name}
                        </div>
                        {item.description && (
                          <div className="text-sm text-muted sm:truncate sm:max-w-[200px]">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="block sm:table-cell py-1 sm:py-3 pr-0 sm:pr-3 text-text">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">Order</span>
                        {item.display_order}
                      </td>
                      <td className="block sm:table-cell py-1 sm:py-3 pr-0 sm:pr-3">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">Status</span>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold border ${
                            item.status === "Active"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="block sm:table-cell py-1 sm:py-3">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">Actions</span>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            type="button"
                            className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-text hover:text-heading rounded transition cursor-pointer"
                            title="Edit"
                            aria-label="Edit"
                            onClick={() => onEdit(item)}>
                            <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-danger hover:text-red-700 rounded transition cursor-pointer"
                            title="Delete"
                            aria-label="Delete"
                            onClick={() => setDeleteTarget(item._id)}>
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {!items.length && !loading && (
                  <TableEmptyState
                    colSpan={4}
                    message={`No ${labelPlural.toLowerCase()} found`}
                    submessage={`Add a new ${label.toLowerCase()} to get started.`}
                  />
                )}
              </tbody>
            </table>
          </div>
          <div className="hidden sm:block pb-3">
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
        message={`Are you sure you want to delete this ${label.toLowerCase()}? This action cannot be undone.`}
      />
      <ConfirmModal
        danger
        open={deleteAllTarget}
        onCancel={() => setDeleteAllTarget(false)}
        onConfirm={onConfirmDeleteAll}
        message={`Are you sure you want to delete ALL ${labelPlural.toLowerCase()}? This action cannot be undone.`}
      />
    </div>
  );
}
