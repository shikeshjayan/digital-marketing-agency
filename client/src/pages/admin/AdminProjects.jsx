import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import useProjectStore from "../../store/projectStore.js";
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

export default function AdminProjects() {
  const {
    fetchAdminProjects,
    fetchCategories,
    createProject,
    updateProject,
    deleteProject,
    deleteAllProjects,
  } = useProjectStore();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const emptyForm = useMemo(
    () => ({
      project_id: null,
      project_name: "",
      category: "Dynamic",
      client_name: "",
      industry: "",
      technologies: "",
      duration: "",
      before_after: [],
      short_description: "",
      description: "",
      challenge: "",
      solution: "",
      client_testimonial: "",
      live_url: "",
      image: "",
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
      const result = await fetchAdminProjects({
        search: search || undefined,
        category: category || undefined,
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
    const t = setTimeout(() => {
      load();
      fetchCategories().then((cats) => setCategories(cats));
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, category, status]);

  useEffect(() => {
    const t = setTimeout(() => load(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, category, status]);

  function onPickImage(file) {
    setForm((f) => ({ ...f, image: file }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (
      !form.project_name.trim() ||
      !form.short_description.trim() ||
      !form.description.trim() ||
      !form.live_url.trim()
    ) {
      setError(
        "Please fill Project Name, Short Description, Description, and Live URL.",
      );
      setSubmitting(false);
      return;
    }

    if (!form.image && !form.project_id) {
      setError("Please upload an image.");
      setSubmitting(false);
      return;
    }

    const payload = new FormData();
    if (form.image instanceof File) {
      payload.append("image", form.image);
    } else if (form.project_id && !form.image) {
      payload.append("removeImage", "true");
    }
    payload.append("project_name", form.project_name.trim());
    payload.append("category", form.category);
    payload.append("client_name", form.client_name.trim());
    payload.append("industry", form.industry.trim());
    payload.append("technologies", JSON.stringify(form.technologies.split(",").map((t) => t.trim()).filter(Boolean)));
    payload.append("duration", form.duration.trim());
    payload.append("before_after", JSON.stringify(form.before_after));
    payload.append("short_description", form.short_description.trim());
    payload.append("description", form.description.trim());
    payload.append("challenge", form.challenge.trim());
    payload.append("solution", form.solution.trim());
    payload.append("client_testimonial", form.client_testimonial.trim());
    payload.append("live_url", form.live_url.trim());
    payload.append("status", form.status);

    try {
      if (form.project_id) {
        await updateProject(form.project_id, payload);
        toast.success("Project updated successfully.");
      } else {
        await createProject(payload);
        toast.success("Project created successfully.");
      }

      setForm(emptyForm);
      await load();
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Operation failed.";
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
      await deleteProject(deleteTarget);
      toast.success("Project deleted successfully.");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Delete failed.";
      setError(msg);
      toast.error(msg);
      setDeleteTarget(null);
    }
  }

  async function onConfirmDeleteAll() {
    try {
      await deleteAllProjects();
      toast.success("All projects deleted successfully.");
      setDeleteAllTarget(false);
      await load();
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Delete all failed.";
      setError(msg);
      toast.error(msg);
      setDeleteAllTarget(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <AdminPageHeader
          title="Projects Management"
          subtitle="Create, update, and remove project records."
        />
      </div>

      <div className="mt-6 bg-background border border-border rounded p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by project name..."
          />
          <Select
            value={category}
            onChange={setCategory}
            placeholder="All categories"
            options={[
              { value: "", label: "All categories" },
              ...categories.map((c) => ({ value: c, label: c })),
            ]}
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
            {form.project_id ? "Edit Project" : "Add New Project"}
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <FormField
              label="Project Name"
              value={form.project_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, project_name: e.target.value }))
              }
              placeholder="e.g. E-commerce Website"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Category"
                value={form.category}
                onChange={(val) => setForm((f) => ({ ...f, category: val }))}
                selectOptions={[
                  { value: "Static", label: "Static" },
                  { value: "Dynamic", label: "Dynamic" },
                  { value: "Landing Pages", label: "Landing Pages" },
                  { value: "SEO", label: "SEO" },
                  { value: "Web Design", label: "Web Design" },
                  { value: "Google Ads", label: "Google Ads" },
                  { value: "Meta Ads", label: "Meta Ads" },
                  { value: "Branding", label: "Branding" },
                  { value: "E-commerce", label: "E-commerce" },
                ]}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Client Name"
                value={form.client_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, client_name: e.target.value }))
                }
                placeholder="e.g. ABC Hospital"
              />
              <FormField
                label="Industry"
                value={form.industry}
                onChange={(e) =>
                  setForm((f) => ({ ...f, industry: e.target.value }))
                }
                placeholder="e.g. Healthcare"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Technologies"
                value={form.technologies}
                onChange={(e) =>
                  setForm((f) => ({ ...f, technologies: e.target.value }))
                }
                placeholder="Comma-separated, e.g. React, Node.js, MongoDB"
              />
              <FormField
                label="Duration"
                value={form.duration}
                onChange={(e) =>
                  setForm((f) => ({ ...f, duration: e.target.value }))
                }
                placeholder="e.g. 6 Months"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-heading">
                  Before / After Results
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      before_after: [
                        ...f.before_after,
                        { metric: "", before: "", after: "" },
                      ],
                    }))
                  }
                  className="text-xs text-primary hover:underline cursor-pointer">
                  + Add Metric
                </button>
              </div>
              {form.before_after.length === 0 && (
                <p className="mt-1 text-xs text-muted">
                  Optional — add before/after metrics for this project.
                </p>
              )}
              {form.before_after.map((item, idx) => (
                <div key={idx} className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                  <input
                    type="text"
                    className="rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light placeholder:text-muted"
                    placeholder="Metric (e.g. Traffic)"
                    value={item.metric}
                    onChange={(e) => {
                      const updated = [...form.before_after];
                      updated[idx] = { ...updated[idx], metric: e.target.value };
                      setForm((f) => ({ ...f, before_after: updated }));
                    }}
                  />
                  <input
                    type="text"
                    className="rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light placeholder:text-muted"
                    placeholder="Before"
                    value={item.before}
                    onChange={(e) => {
                      const updated = [...form.before_after];
                      updated[idx] = { ...updated[idx], before: e.target.value };
                      setForm((f) => ({ ...f, before_after: updated }));
                    }}
                  />
                  <input
                    type="text"
                    className="rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light placeholder:text-muted"
                    placeholder="After"
                    value={item.after}
                    onChange={(e) => {
                      const updated = [...form.before_after];
                      updated[idx] = { ...updated[idx], after: e.target.value };
                      setForm((f) => ({ ...f, before_after: updated }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        before_after: f.before_after.filter((_, i) => i !== idx),
                      }))
                    }
                    className="sm:col-span-3 px-2 py-2 text-primary hover:text-primary-hover cursor-pointer text-sm font-medium">
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <FormField
              label="Short Description"
              value={form.short_description}
              onChange={(e) =>
                setForm((f) => ({ ...f, short_description: e.target.value }))
              }
              placeholder="Brief summary of the project"
            />
            <FormField
              label="Description"
              textarea
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Detailed description of the project"
            />
            <FormField
              label="Challenge"
              textarea
              rows={2}
              value={form.challenge}
              onChange={(e) =>
                setForm((f) => ({ ...f, challenge: e.target.value }))
              }
              placeholder="Key challenges faced in this project"
            />
            <FormField
              label="Solution"
              textarea
              rows={2}
              value={form.solution}
              onChange={(e) =>
                setForm((f) => ({ ...f, solution: e.target.value }))
              }
              placeholder="How we solved the challenges"
            />
            <FormField
              label="Client Testimonial"
              textarea
              rows={2}
              value={form.client_testimonial}
              onChange={(e) =>
                setForm((f) => ({ ...f, client_testimonial: e.target.value }))
              }
              placeholder="Optional — client feedback or quote"
            />
            <FormField
              label="Live URL"
              value={form.live_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, live_url: e.target.value }))
              }
              placeholder="https://example.com"
            />
            <FileUploadField
              label="Image"
              required
              file={form.image instanceof File ? form.image : null}
              existingUrl={typeof form.image === "string" ? form.image : ""}
              onChange={onPickImage}
              onRemove={() => setForm((f) => ({ ...f, image: "" }))}
            />

            <ErrorBanner message={error} />

            <FormActions
              submitting={submitting}
              editId={form.project_id}
              onSubmit={onSubmit}
              onReset={() => setForm(emptyForm)}
              submitLabel={
                form.project_id ? "Update Project" : "Create Project"
              }
            />
          </form>
        </div>

        <div className="lg:col-span-3 bg-background border border-border rounded p-5 shadow-xs flex flex-col">
          <AdminListFooter
            loading={loading}
            total={pagination.total}
            itemsLength={items.length}
            onDeleteAll={() => setDeleteAllTarget(true)}
            label="Projects"
          />

          <div className="mt-4 overflow-auto flex-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text">
                  <th className="py-2 pr-3 hidden sm:table-cell">ID</th>
                  <th className="py-2 pr-3">Project</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && !items.length ? (
                  <TableSkeleton rows={5} cols={5} />
                ) : (
                  items.map((p) => (
                    <tr
                      key={p._id}
                      className="border-t border-border align-top">
                      <td className="py-3 pr-3 text-text hidden sm:table-cell">
                        <span
                          className="block max-w-[80px] truncate"
                          title={p._id}>
                          {p._id}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="font-bold text-heading truncate max-w-[200px]">
                          {p.project_name}
                        </div>
                        <div className="text-muted text-xs sm:text-sm truncate max-w-[200px]">
                          {p.short_description}
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold text-text">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                            p.status === "Active"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            type="button"
                            className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-text hover:text-heading rounded transition cursor-pointer"
                            onClick={() => {
                              setForm({
                                project_id: p._id,
                                project_name: p.project_name,
                                category: p.category,
                                client_name: p.client_name ?? "",
                                industry: p.industry ?? "",
                                technologies: Array.isArray(p.technologies)
                                  ? p.technologies.join(", ")
                                  : "",
                                duration: p.duration ?? "",
                                before_after: Array.isArray(p.before_after)
                                  ? p.before_after
                                  : [],
                                short_description: p.short_description,
                                description: p.description ?? "",
                                challenge: p.challenge ?? "",
                                solution: p.solution ?? "",
                                client_testimonial: p.client_testimonial ?? "",
                                live_url: p.live_url,
                                image: p.image ?? "",
                                status: p.status,
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
                            className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-primary hover:text-primary-hover rounded transition cursor-pointer"
                            onClick={() => onDelete(p._id)}>
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
                    message="No projects found"
                    submessage="Create a new project to get started."
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
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    }
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
        message="Are you sure you want to delete this project? This action cannot be undone."
      />
      <ConfirmModal
        open={deleteAllTarget}
        onCancel={() => setDeleteAllTarget(false)}
        onConfirm={onConfirmDeleteAll}
        message="Are you sure you want to delete ALL projects? This action cannot be undone."
      />
    </div>
  );
}
