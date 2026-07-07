import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import useIndustryStore from "../../store/industryStore.js";
import ConfirmModal from "../../components/ui/ConfirmModal.jsx";
import Select from "../../components/ui/Select.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import { TableSkeleton } from "../../components/ui/Skeleton.jsx";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import AdminListFooter from "../../components/ui/AdminListFooter.jsx";
import SearchInput from "../../components/ui/SearchInput.jsx";
import TableEmptyState from "../../components/ui/TableEmptyState.jsx";
import FormField from "../../components/ui/FormField.jsx";
import FormActions from "../../components/ui/FormActions.jsx";
import ErrorBanner from "../../components/ui/ErrorBanner.jsx";

export default function AdminIndustries() {
  const {
    fetchAdminIndustries,
    createIndustry,
    updateIndustry,
    deleteIndustry,
    deleteAllIndustries,
  } = useIndustryStore();

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
      display_order: 0,
      status: "Active",
    }),
    [],
  );

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteAllTarget, setDeleteAllTarget] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const result = await fetchAdminIndustries({
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

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!form.name.trim()) {
      setError("Industry name is required.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        icon: form.icon.trim(),
        display_order: form.display_order,
        status: form.status,
      };

      if (form._id) {
        await updateIndustry(form._id, payload);
        toast.success("Industry updated successfully.");
      } else {
        await createIndustry(payload);
        toast.success("Industry created successfully.");
      }
      setForm(emptyForm);
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
      display_order: item.display_order ?? 0,
      status: item.status,
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onConfirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteIndustry(deleteTarget);
      toast.success("Industry deleted successfully.");
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
      await deleteAllIndustries();
      toast.success("All industries deleted successfully.");
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
          title="Industry Management"
          subtitle="Create, update, and remove industry records."
        />
      </div>

      <div className="mt-6 bg-background border border-border rounded p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by industry name..."
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

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div
          ref={formRef}
          className="lg:col-span-2 bg-background border border-border rounded p-4 shadow-xs">
          <div className="font-extrabold text-heading">
            {form._id ? "Edit Industry" : "Add New Industry"}
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <FormField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Healthcare, E-Commerce, Education"
            />
            <FormField
              label="Description"
              textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of this industry"
            />
            <FormField
              label="Icon"
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              placeholder="FontAwesome class or icon name (optional)"
            />
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
              onReset={() => setForm(emptyForm)}
              submitLabel={form._id ? "Update Industry" : "Create Industry"}
            />
          </form>
        </div>

        <div className="lg:col-span-3 bg-background border border-border rounded p-5 shadow-xs flex flex-col">
          <AdminListFooter
            loading={loading}
            total={pagination.total}
            itemsLength={items.length}
            onDeleteAll={() => setDeleteAllTarget(true)}
            label="Industries"
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
                  items.map((ind) => (
                    <tr key={ind._id} className="border-t border-border align-top">
                      <td className="py-3 pr-3 text-text hidden sm:table-cell">
                        <span className="block max-w-[80px] truncate" title={ind._id}>
                          {ind._id}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="font-bold text-heading truncate max-w-[200px]">
                          {ind.name}
                        </div>
                        {ind.description && (
                          <div className="text-xs text-muted truncate max-w-[200px]">
                            {ind.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 pr-3 text-text">{ind.display_order}</td>
                      <td className="py-3 pr-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                            ind.status === "Active"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }`}>
                          {ind.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            type="button"
                            className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-text hover:text-heading rounded transition cursor-pointer"
                            onClick={() => onEdit(ind)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-primary hover:text-primary-hover rounded transition cursor-pointer"
                            onClick={() => setDeleteTarget(ind._id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {!items.length && !loading && (
                  <TableEmptyState
                    colSpan={5}
                    message="No industries found"
                    submessage="Add a new industry to get started."
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
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
        message="Are you sure you want to delete this industry? This action cannot be undone."
      />
      <ConfirmModal
        open={deleteAllTarget}
        onCancel={() => setDeleteAllTarget(false)}
        onConfirm={onConfirmDeleteAll}
        message="Are you sure you want to delete ALL industries? This action cannot be undone."
      />
    </div>
  );
}
