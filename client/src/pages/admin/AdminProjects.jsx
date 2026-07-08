import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import useProjectStore from "../../store/projectStore.js";
import useServiceStore from "../../store/serviceStore.js";
import useTechnologyStore from "../../store/technologyStore.js";
import useIndustryStore from "../../store/industryStore.js";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

const resolveUrl = (path) => {
  if (!path || path.startsWith("blob:") || path.startsWith("http")) return path;
  const base = (import.meta.env.VITE_API_URL || "/api/v1").replace(
    /\/api\/v1\/?$/,
    "",
  );
  return base + path;
};

export default function AdminProjects() {
  const {
    fetchAdminProjects,
    createProject,
    updateProject,
    deleteProject,
    deleteAllProjects,
  } = useProjectStore();

  const { fetchServices, adminServices } = useServiceStore();
  const { fetchAdminTechnologies, adminTechnologies } = useTechnologyStore();
  const { fetchAdminIndustries, adminIndustries } = useIndustryStore();
  const { fetchAdminTeam, adminTeam } = useTeamStore();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const emptyForm = useMemo(
    () => ({
      project_id: null,
      project_name: "",
      short_description: "",
      description: "",
      thumbnail: "",
      gallery: [],
      services: [],
      technologies: [],
      industries: [],
      team: [],
      client_name: "",
      client_company: "",
      client_website: "",
      client_location: "",
      project_url: "",
      github_url: "",
      completion_date: "",
      featured: false,
      seo_meta_title: "",
      seo_meta_description: "",
      status: "Published",
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
      fetchServices();
      fetchAdminTechnologies({ limit: 200 });
      fetchAdminIndustries({ limit: 200 });
      fetchAdminTeam({ limit: 200 });
    }, 0);
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

  function onPickThumbnail(file) {
    setForm((f) => ({ ...f, thumbnail: file }));
  }

  function onPickGallery(files) {
    setForm((f) => ({ ...f, gallery: [...f.gallery, ...files] }));
  }

  function removeGalleryImage(index) {
    setForm((f) => ({ ...f, gallery: f.gallery.filter((_, i) => i !== index) }));
  }

  function toggleMultiSelect(field, value) {
    setForm((f) => {
      const arr = f[field];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...f, [field]: next };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!form.project_name.trim() || !form.short_description.trim() || !form.description.trim()) {
      setError("Please fill Project Name, Short Description, and Description.");
      setSubmitting(false);
      return;
    }

    if (!form.thumbnail && !form.project_id) {
      setError("Please upload a thumbnail image.");
      setSubmitting(false);
      return;
    }

    if (form.services.length === 0) {
      setError("Please select at least one service.");
      setSubmitting(false);
      return;
    }

    const payload = new FormData();

    if (form.thumbnail instanceof File) {
      payload.append("thumbnail", form.thumbnail);
    } else if (form.project_id && !form.thumbnail) {
      payload.append("removeThumbnail", "true");
    }

    form.gallery.forEach((file) => {
      if (file instanceof File) {
        payload.append("gallery", file);
      }
    });

    payload.append("project_name", form.project_name.trim());
    payload.append("short_description", form.short_description.trim());
    payload.append("description", form.description.trim());
    payload.append("services", JSON.stringify(form.services));
    payload.append("technologies", JSON.stringify(form.technologies));
    payload.append("industries", JSON.stringify(form.industries));
    payload.append("team", JSON.stringify(form.team));
    payload.append("client", JSON.stringify({
      name: form.client_name.trim(),
      company: form.client_company.trim(),
      website: form.client_website.trim(),
      location: form.client_location.trim(),
    }));
    payload.append("project_url", form.project_url.trim());
    payload.append("github_url", form.github_url.trim());
    payload.append("completion_date", form.completion_date || "");
    payload.append("featured", form.featured);
    payload.append("seo", JSON.stringify({
      meta_title: form.seo_meta_title.trim(),
      meta_description: form.seo_meta_description.trim(),
    }));
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

  function onEdit(p) {
    const clientObj = p.client || {};
    setForm({
      project_id: p._id,
      project_name: p.project_name,
      short_description: p.short_description,
      description: p.description ?? "",
      thumbnail: p.thumbnail ?? "",
      gallery: p.gallery ?? [],
      services: (p.services || []).map((s) => (typeof s === "object" ? s._id : s)),
      technologies: (p.technologies || []).map((t) => (typeof t === "object" ? t._id : t)),
      industries: (p.industries || []).map((i) => (typeof i === "object" ? i._id : i)),
      team: (p.team || []).map((t) => (typeof t === "object" ? t._id : t)),
      client_name: clientObj.name ?? "",
      client_company: clientObj.company ?? "",
      client_website: clientObj.website ?? "",
      client_location: clientObj.location ?? "",
      project_url: p.project_url ?? "",
      github_url: p.github_url ?? "",
      completion_date: p.completion_date ? p.completion_date.slice(0, 10) : "",
      featured: p.featured ?? false,
      seo_meta_title: p.seo?.meta_title ?? "",
      seo_meta_description: p.seo?.meta_description ?? "",
      status: p.status,
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onConfirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProject(deleteTarget);
      toast.success("Project deleted successfully.");
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
      await deleteAllProjects();
      toast.success("All projects deleted successfully.");
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
            value={status}
            onChange={setStatus}
            placeholder="All statuses"
            options={[
              { value: "", label: "All statuses" },
              { value: "Draft", label: "Draft" },
              { value: "Published", label: "Published" },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          ref={formRef}
          className="lg:col-span-1 bg-background border border-border rounded p-4 shadow-xs lg:h-[80vh] lg:overflow-y-auto">
          <div className="font-extrabold text-heading">
            {form.project_id ? "Edit Project" : "Add New Project"}
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <FormField
              label="Project Name"
              value={form.project_name}
              onChange={(e) => setForm((f) => ({ ...f, project_name: e.target.value }))}
              placeholder="e.g. E-commerce Website"
            />
            <FormField
              label="Short Description"
              value={form.short_description}
              onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
              placeholder="Brief summary (max 200 chars)"
            />
            <FormField
              label="Description"
              textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Detailed description of the project"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Status"
                value={form.status}
                onChange={(val) => setForm((f) => ({ ...f, status: val }))}
                selectOptions={[
                  { value: "Draft", label: "Draft" },
                  { value: "Published", label: "Published" },
                ]}
              />
              <div className="flex items-end pb-1">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                  </label>
                  <span className="text-sm font-semibold text-heading">Featured Project</span>
                </div>
              </div>
            </div>

            <FileUploadField
              label="Thumbnail"
              required
              file={form.thumbnail instanceof File ? form.thumbnail : null}
              existingUrl={typeof form.thumbnail === "string" ? resolveUrl(form.thumbnail) : ""}
              onChange={onPickThumbnail}
              onRemove={() => setForm((f) => ({ ...f, thumbnail: "" }))}
            />

            <div>
              <label className="block text-sm font-medium text-heading mb-1">Gallery Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => onPickGallery(Array.from(e.target.files))}
                className="text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover cursor-pointer"
              />
              {form.gallery.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.gallery.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 border border-border rounded overflow-hidden">
                      <img
                        src={img instanceof File ? URL.createObjectURL(img) : resolveUrl(img)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-0 right-0 bg-primary text-white w-4 h-4 flex items-center justify-center text-xs cursor-pointer">
                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Services multi-select */}
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Services *</label>
              <div className="max-h-32 overflow-y-auto border border-border rounded p-2 space-y-1">
                {adminServices.map((s) => (
                  <label key={s._id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.services.includes(s._id)}
                      onChange={() => toggleMultiSelect("services", s._id)}
                      className="w-3 h-3 rounded border-border accent-primary"
                    />
                    <span className="text-xs text-text">{s.service_name}</span>
                  </label>
                ))}
                {adminServices.length === 0 && <p className="text-xs text-muted">No services found. Create services first.</p>}
              </div>
            </div>

            {/* Technologies multi-select */}
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Technologies</label>
              <div className="max-h-32 overflow-y-auto border border-border rounded p-2 space-y-1">
                {adminTechnologies.map((t) => (
                  <label key={t._id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.technologies.includes(t._id)}
                      onChange={() => toggleMultiSelect("technologies", t._id)}
                      className="w-3 h-3 rounded border-border accent-primary"
                    />
                    <span className="text-xs text-text">{t.name}</span>
                  </label>
                ))}
                {adminTechnologies.length === 0 && <p className="text-xs text-muted">No technologies found. Create them first.</p>}
              </div>
            </div>

            {/* Industries multi-select */}
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Industries</label>
              <div className="max-h-32 overflow-y-auto border border-border rounded p-2 space-y-1">
                {adminIndustries.map((ind) => (
                  <label key={ind._id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.industries.includes(ind._id)}
                      onChange={() => toggleMultiSelect("industries", ind._id)}
                      className="w-3 h-3 rounded border-border accent-primary"
                    />
                    <span className="text-xs text-text">{ind.name}</span>
                  </label>
                ))}
                {adminIndustries.length === 0 && <p className="text-xs text-muted">No industries found. Create them first.</p>}
              </div>
            </div>

            {/* Team multi-select */}
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Team Members</label>
              <div className="max-h-32 overflow-y-auto border border-border rounded p-2 space-y-1">
                {adminTeam.map((m) => (
                  <label key={m._id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.team.includes(m._id)}
                      onChange={() => toggleMultiSelect("team", m._id)}
                      className="w-3 h-3 rounded border-border accent-primary"
                    />
                    <span className="text-xs text-text">{m.name}</span>
                  </label>
                ))}
                {adminTeam.length === 0 && <p className="text-xs text-muted">No team members found.</p>}
              </div>
            </div>

            {/* Client info */}
            <div className="border-t border-border pt-3">
              <div className="text-sm font-bold text-heading mb-2">Client Information</div>
              <div className="space-y-3">
                <FormField
                  label="Client Name"
                  value={form.client_name}
                  onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
                  placeholder="e.g. John Smith"
                />
                <FormField
                  label="Company"
                  value={form.client_company}
                  onChange={(e) => setForm((f) => ({ ...f, client_company: e.target.value }))}
                  placeholder="e.g. Acme Corp"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    label="Website"
                    value={form.client_website}
                    onChange={(e) => setForm((f) => ({ ...f, client_website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                  <FormField
                    label="Location"
                    value={form.client_location}
                    onChange={(e) => setForm((f) => ({ ...f, client_location: e.target.value }))}
                    placeholder="e.g. New York, USA"
                  />
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Project URL"
                value={form.project_url}
                onChange={(e) => setForm((f) => ({ ...f, project_url: e.target.value }))}
                placeholder="https://live-project.com"
              />
              <FormField
                label="GitHub URL"
                value={form.github_url}
                onChange={(e) => setForm((f) => ({ ...f, github_url: e.target.value }))}
                placeholder="https://github.com/..."
              />
            </div>

            <FormField
              label="Completion Date"
              type="date"
              value={form.completion_date}
              onChange={(e) => setForm((f) => ({ ...f, completion_date: e.target.value }))}
            />

            {/* SEO */}
            <div className="border-t border-border pt-3">
              <div className="text-sm font-bold text-heading mb-2">SEO</div>
              <div className="space-y-3">
                <FormField
                  label="Meta Title"
                  value={form.seo_meta_title}
                  onChange={(e) => setForm((f) => ({ ...f, seo_meta_title: e.target.value }))}
                  placeholder="SEO title for the project page"
                />
                <FormField
                  label="Meta Description"
                  textarea
                  rows={2}
                  value={form.seo_meta_description}
                  onChange={(e) => setForm((f) => ({ ...f, seo_meta_description: e.target.value }))}
                  placeholder="SEO description for the project page"
                />
              </div>
            </div>

            <ErrorBanner message={error} />

            <FormActions
              submitting={submitting}
              editId={form.project_id}
              onSubmit={onSubmit}
              onReset={() => setForm(emptyForm)}
              submitLabel={form.project_id ? "Update Project" : "Create Project"}
            />
          </form>
        </div>

        <div className="lg:col-span-2 bg-background border border-border rounded p-5 shadow-xs flex flex-col lg:h-[80vh]">
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
                  <th className="py-2 pr-3">Services</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && !items.length ? (
                  <TableSkeleton rows={5} cols={5} />
                ) : (
                  items.map((p) => (
                    <tr key={p._id} className="border-t border-border align-top">
                      <td className="py-3 pr-3 text-text hidden sm:table-cell">
                        <span className="block max-w-[80px] truncate" title={p._id}>
                          {p._id}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          {p.thumbnail && (
                            <img
                              src={resolveUrl(p.thumbnail)}
                              alt=""
                              className="w-10 h-10 rounded object-cover border border-border shrink-0"
                            />
                          )}
                          <div>
                            <div className="font-bold text-heading truncate max-w-[200px]">
                              {p.project_name}
                            </div>
                            <div className="text-muted text-xs truncate max-w-[200px]">
                              {p.short_description}
                            </div>
                            {p.featured && (
                              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex flex-wrap gap-1">
                          {(p.services || []).slice(0, 2).map((s, i) => (
                            <span key={i} className="inline-block px-2 py-0.5 text-[10px] bg-surface border border-border rounded text-text">
                              {typeof s === "object" ? s.service_name : "Service"}
                            </span>
                          ))}
                          {(p.services || []).length > 2 && (
                            <span className="text-[10px] text-muted">+{p.services.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                            p.status === "Published"
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
                            title="Edit"
                            onClick={() => onEdit(p)}>
                            <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-primary hover:text-primary-hover rounded transition cursor-pointer"
                            title="Delete"
                            onClick={() => setDeleteTarget(p._id)}>
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
                    message="No projects found"
                    submessage="Create a new project to get started."
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
