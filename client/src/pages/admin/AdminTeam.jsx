import { useEffect, useRef, useState } from "react";
import useDebounce from "../../hooks/useDebounce.js";
import useIsMobile from "../../hooks/useIsMobile.js";
import { toast } from "sonner";
import useTeamStore from "../../store/teamStore.js";
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
import resolveImagePath from "../../utils/resolveImagePath.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

const EMPTY_FORM = {
  _id: null,
  photo: "",
  name: "",
  designation: "",
  description: "",
  linkedin: "",
  email: "",
  display_order: 0,
  status: "Active",
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

  const isMobile = useIsMobile();

  const {
    fetchAdminTeam,
    createMember,
    updateMember,
    deleteMember,
    deleteAllMembers,
  } = useTeamStore();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteAllTarget, setDeleteAllTarget] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchAdminTeam({
        search: search || undefined,
        status: status || undefined,
        page,
        limit: isMobile ? 200 : 5,
      });
      setItems(result?.items ?? []);
      setPagination(result?.pagination ?? { total: 0, page: 1, pages: 1 });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load team members.";
      setError(msg);
      toast.error(msg);
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

  function onPickImage(file) {
    setForm((f) => ({ ...f, photo: file }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
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
    payload.append("linkedin", form.linkedin.trim());
    payload.append("email", form.email.trim());
    payload.append("display_order", form.display_order);
    payload.append("status", form.status);

    try {
      if (form._id) {
        await updateMember(form._id, payload);
        toast.success("Team member updated successfully.");
      } else {
        await createMember(payload);
        toast.success("Team member added successfully.");
      }
      setForm(EMPTY_FORM);
      await load();
    } catch (err) {
      const msg = err?.message || "Operation failed.";
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
      await deleteMember(deleteTarget);
      toast.success("Team member deleted successfully.");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      const msg = err?.message || "Delete failed.";
      setError(msg);
      toast.error(msg);
      setDeleteTarget(null);
    }
  }

  async function onConfirmDeleteAll() {
    try {
      await deleteAllMembers();
      toast.success("All team members deleted successfully.");
      setDeleteAllTarget(false);
      await load();
    } catch (err) {
      const msg = err?.message || "Delete all failed.";
      setError(msg);
      toast.error(msg);
      setDeleteAllTarget(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <AdminPageHeader
          title="Team Management"
          subtitle="Create, update, and remove team member records."
        />
      </div>

      <div className="mt-6 bg-background border border-border rounded p-5 shadow-xs hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by member name..."
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
          className="lg:col-span-2 bg-background border border-border rounded p-4 shadow-xs lg:h-[78vh] lg:overflow-y-auto flex flex-col">
          <div className="font-extrabold text-heading">
            {form._id ? "Edit Member" : "Add New Member"}
          </div>

          <form onSubmit={onSubmit} className="mt-4 flex flex-col flex-1 justify-between gap-3">
            <div className="space-y-3">
              <FileUploadField
                label="Photo"
                file={form.photo instanceof File ? form.photo : null}
                existingUrl={
                  typeof form.photo === "string" ? resolveImagePath(form.photo) : ""
                }
                onChange={onPickImage}
                onRemove={() => setForm((f) => ({ ...f, photo: "" }))}
                confirmText="Remove photo?"
              />
              <FormField
                label="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. John Doe"
              />
              <FormField
                label="Designation"
                value={form.designation}
                onChange={(e) =>
                  setForm((f) => ({ ...f, designation: e.target.value }))
                }
                placeholder="e.g. Frontend Developer"
              />
              <FormField
                label="Description"
                textarea
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief bio or details about the member"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  label="LinkedIn URL"
                  value={form.linkedin}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, linkedin: e.target.value }))
                  }
                  placeholder="https://linkedin.com/in/..."
                />
                <FormField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="member@example.com"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  label="Display Order"
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      display_order: Math.max(0, Number(e.target.value)),
                    }))
                  }
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
            </div>

            <div>
              <ErrorBanner message={error} />

              <FormActions
                submitting={submitting}
                editId={form._id}
                onSubmit={onSubmit}
                onReset={() => setForm(EMPTY_FORM)}
                submitLabel={form._id ? "Update Member" : "Create Member"}
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
                placeholder="Search by member name..."
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

        <div className="lg:col-span-3 bg-background border border-border rounded p-5 shadow-xs flex flex-col sm:max-h-none max-h-[70vh] lg:h-[78vh]">
          <AdminListFooter
            loading={loading}
            total={pagination.total}
            itemsLength={items.length}
            onDeleteAll={() => setDeleteAllTarget(true)}
            label="Team Members"
          />

          <div className="mt-4 overflow-auto flex-1">
            <table className="w-full text-sm block sm:table">
              <thead className="hidden sm:table-header-group">
                <tr className="text-left text-text">
                  <th className="py-2 pr-3 pl-3 hidden sm:table-cell">ID</th>
                  <th className="py-2 pr-3">Member</th>
                  <th className="py-2 pr-3">Designation</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="block sm:table-row-group">
                {loading && !items.length ? (
                  <TableSkeleton rows={5} cols={5} />
                ) : (
                  items.map((m) => (
                    <tr
                      key={m._id}
                      className="block sm:table-row border sm:border-t border-border mb-3 sm:mb-0 p-3 sm:p-0 rounded-lg sm:rounded-none bg-surface/50 sm:bg-transparent">
                      <td className="block sm:table-cell py-1 sm:py-3 pl-0 sm:pl-3 pr-0 sm:pr-3 text-text">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">ID</span>
                        <span
                          className="block break-all sm:truncate sm:max-w-[80px]"
                          title={m._id}>
                          {m._id}
                        </span>
                      </td>
                      <td className="block sm:table-cell py-1 sm:py-3 pr-0 sm:pr-3">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">Member</span>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0">
                            {m.photo ? (
                              <img
                                src={resolveImagePath(m.photo)}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-bold text-muted">
                                {getInitials(m.name)}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-heading sm:truncate sm:max-w-[150px]">
                              {m.name}
                            </div>
                            <div className="text-sm text-muted">
                              Order: {m.display_order}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="block sm:table-cell py-1 sm:py-3 pr-0 sm:pr-3 text-text sm:truncate sm:max-w-[150px]">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">Designation</span>
                        {m.designation}
                      </td>
                      <td className="block sm:table-cell py-1 sm:py-3 pr-0 sm:pr-3">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">Status</span>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold border ${
                            m.status === "Active"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="block sm:table-cell py-1 sm:py-3">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">Actions</span>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            type="button"
                            className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-text hover:text-heading rounded transition cursor-pointer"
                            onClick={() => {
                              setForm({
                                _id: m._id,
                                photo: m.photo ?? "",
                                name: m.name,
                                designation: m.designation,
                                description: m.description ?? "",
                                linkedin: m.linkedin ?? "",
                                email: m.email ?? "",
                                display_order: m.display_order ?? 1,
                                status: m.status,
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
                            className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-danger hover:text-red-700 rounded transition cursor-pointer"
                            title="Delete"
                            aria-label="Delete"
                            onClick={() => setDeleteTarget(m._id)}>
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
                    message="No members found"
                    submessage="Add a new team member to get started."
                    icon={
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
                    }
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
        message="Are you sure you want to delete this team member? This action cannot be undone."
      />
      <ConfirmModal
        danger
        open={deleteAllTarget}
        onCancel={() => setDeleteAllTarget(false)}
        onConfirm={onConfirmDeleteAll}
        message="Are you sure you want to delete ALL team members? This action cannot be undone."
      />
    </div>
  );
}
