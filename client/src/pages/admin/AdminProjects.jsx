import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import useProjectStore from "../../store/projectStore.js";
import ConfirmModal from "../../components/ui/ConfirmModal.jsx";
import Select from "../../components/ui/Select.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import { TableSkeleton } from "../../components/ui/Skeleton.jsx";

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
      short_description: "",
      description: "",
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
    setSubmitting(true);

    if (
      !form.project_name.trim() ||
      !form.short_description.trim() ||
      !form.description.trim() ||
      !form.live_url.trim()
    ) {
      setError("Please fill Project Name, Short Description, Description, and Live URL.");
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
    payload.append("short_description", form.short_description.trim());
    payload.append("description", form.description.trim());
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
      await deleteProject(deleteTarget);
      toast.success("Project deleted successfully.");
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
      await deleteAllProjects();
      toast.success("All projects deleted successfully.");
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
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Projects Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Create, update, and remove project records.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
              placeholder="Search by project name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
          className="lg:col-span-2 bg-white border border-gray-200 rounded p-4 shadow-xs">
          <div className="font-extrabold text-gray-900">
            {form.project_id ? "Edit Project" : "Add New Project"}
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Project Name
              </label>
              <input
                className="mt-2 w-full rounded border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.project_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, project_name: e.target.value }))
                }
                placeholder="e.g. E-commerce Website"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Category
                </label>
                <Select
                  value={form.category}
                  onChange={(val) => setForm((f) => ({ ...f, category: val }))}
                  className="mt-2"
                  options={[
                    { value: "Static", label: "Static" },
                    { value: "Dynamic", label: "Dynamic" },
                    { value: "Landing Pages", label: "Landing Pages" },
                  ]}
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
                placeholder="Brief summary of the project"
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
                placeholder="Detailed description of the project"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Live URL
              </label>
              <input
                className="mt-2 w-full rounded border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.live_url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, live_url: e.target.value }))
                }
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Image <span className="text-red-500">*</span>
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

            <div className="flex gap-2">
              {form.project_id && (
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
                {submitting
                  ? "Saving..."
                  : form.project_id
                    ? "Update Project"
                    : "Create Project"}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-3 bg-white border border-gray-200 rounded p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between">
            <div className="font-extrabold text-gray-900">Projects</div>
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
                  <th className="py-2 pr-3">Project</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && !items.length ? (
                  <TableSkeleton rows={5} cols={5} />
                ) : items.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t border-gray-100 align-top">
                    <td className="py-3 pr-3 text-gray-700 hidden sm:table-cell">
                      <span
                        className="block max-w-[80px] truncate"
                        title={p._id}>
                        {p._id}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="font-bold text-gray-900 truncate max-w-[200px]">
                        {p.project_name}
                      </div>
                      <div className="text-gray-500 text-xs sm:text-sm truncate max-w-[200px]">
                        {p.short_description}
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold text-gray-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                          p.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-yellow-50 text-yellow-700 border-yellow-100"
                        }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                           className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-gray-600 hover:text-gray-800 rounded transition cursor-pointer"
                          onClick={() => {
                            setForm({
                              project_id: p._id,
                              project_name: p.project_name,
                              category: p.category,
                              short_description: p.short_description,
                              description: p.description ?? "",
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
                           className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-red-600 hover:text-red-500 rounded transition cursor-pointer"
                          onClick={() => onDelete(p._id)}>
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
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <div className="font-semibold">No projects found</div>
                        <div className="text-sm mt-1">
                          Create a new project to get started.
                        </div>
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
