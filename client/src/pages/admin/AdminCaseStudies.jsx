import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import useCaseStudyStore from "../../store/caseStudyStore.js";
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

export default function AdminCaseStudies() {
  const {
    fetchAdminCaseStudies,
    createCaseStudy,
    updateCaseStudy,
    deleteCaseStudy,
    deleteAllCaseStudies,
  } = useCaseStudyStore();

  const { fetchProjects, projects } = useProjectStore();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const galleryRef = useRef(null);

  const emptyForm = useMemo(
    () => ({
      case_study_id: null,
      title: "",
      project: "",
      hero_image: "",
      overview: "",
      challenge: "",
      objectives: [],
      strategy: "",
      solution: "",
      deliverables: [],
      timeline_duration: "",
      timeline_started_at: "",
      timeline_completed_at: "",
      development_process: [],
      challenges_and_solutions: [],
      results: [],
      gallery: [],
      client_testimonial_quote: "",
      client_testimonial_name: "",
      client_testimonial_designation: "",
      client_testimonial_company: "",
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
  const [confirmItemDelete, setConfirmItemDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const result = await fetchAdminCaseStudies({
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
      fetchProjects();
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

  function onPickHeroImage(file) {
    setForm((f) => ({ ...f, hero_image: file }));
  }

  function onPickGallery(files) {
    setForm((f) => ({ ...f, gallery: [...f.gallery, ...files] }));
  }

  function removeGalleryImage(index) {
    if (galleryRef.current) galleryRef.current.value = "";
    setForm((f) => ({ ...f, gallery: f.gallery.filter((_, i) => i !== index) }));
  }

  function addArrayItem(field) {
    setForm((f) => ({ ...f, [field]: [...f[field], ""] }));
  }

  function updateArrayItem(field, index, value) {
    setForm((f) => {
      const arr = [...f[field]];
      arr[index] = value;
      return { ...f, [field]: arr };
    });
  }

  function removeArrayItem(field, index) {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== index) }));
  }

  function addObjectItem(field) {
    setForm((f) => {
      if (field === "development_process") {
        return { ...f, [field]: [...f[field], { title: "", description: "" }] };
      }
      if (field === "challenges_and_solutions") {
        return { ...f, [field]: [...f[field], { challenge: "", solution: "" }] };
      }
      if (field === "results") {
        return { ...f, [field]: [...f[field], { title: "", value: "" }] };
      }
      return f;
    });
  }

  function updateObjectItem(field, index, key, value) {
    setForm((f) => {
      const arr = [...f[field]];
      arr[index] = { ...arr[index], [key]: value };
      return { ...f, [field]: arr };
    });
  }

  function removeObjectItem(field, index) {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== index) }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!form.title.trim() || !form.overview.trim() || !form.challenge.trim() || !form.solution.trim()) {
      setError("Please fill Title, Overview, Challenge, and Solution.");
      setSubmitting(false);
      return;
    }

    if (!form.hero_image && !form.case_study_id) {
      setError("Please upload a hero image.");
      setSubmitting(false);
      return;
    }

    if (!form.project) {
      setError("Please select a project.");
      setSubmitting(false);
      return;
    }

    const payload = new FormData();

    if (form.hero_image instanceof File) {
      payload.append("hero_image", form.hero_image);
    } else if (form.case_study_id && !form.hero_image) {
      payload.append("removeHeroImage", "true");
    }

    form.gallery.forEach((file) => {
      if (file instanceof File) {
        payload.append("gallery", file);
      }
    });

    payload.append("title", form.title.trim());
    payload.append("project", form.project);
    payload.append("overview", form.overview.trim());
    payload.append("challenge", form.challenge.trim());
    payload.append("strategy", form.strategy.trim());
    payload.append("solution", form.solution.trim());
    payload.append("objectives", JSON.stringify(form.objectives));
    payload.append("deliverables", JSON.stringify(form.deliverables));
    payload.append("development_process", JSON.stringify(form.development_process));
    payload.append("challenges_and_solutions", JSON.stringify(form.challenges_and_solutions));
    payload.append("results", JSON.stringify(form.results));
    payload.append("timeline_duration", form.timeline_duration);
    payload.append("timeline_started_at", form.timeline_started_at || "");
    payload.append("timeline_completed_at", form.timeline_completed_at || "");
    payload.append("client_testimonial_quote", form.client_testimonial_quote);
    payload.append("client_testimonial_name", form.client_testimonial_name);
    payload.append("client_testimonial_designation", form.client_testimonial_designation);
    payload.append("client_testimonial_company", form.client_testimonial_company);
    payload.append("featured", form.featured);
    payload.append("seo", JSON.stringify({
      meta_title: form.seo_meta_title.trim(),
      meta_description: form.seo_meta_description.trim(),
    }));
    payload.append("status", form.status);

    try {
      if (form.case_study_id) {
        await updateCaseStudy(form.case_study_id, payload);
        toast.success("Case study updated successfully.");
      } else {
        await createCaseStudy(payload);
        toast.success("Case study created successfully.");
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

  function onEdit(cs) {
    setForm({
      case_study_id: cs._id,
      title: cs.title,
      project: typeof cs.project === "object" ? cs.project._id : cs.project,
      hero_image: cs.hero_image ?? "",
      overview: cs.overview ?? "",
      challenge: cs.challenge ?? "",
      objectives: cs.objectives ?? [],
      strategy: cs.strategy ?? "",
      solution: cs.solution ?? "",
      deliverables: cs.deliverables ?? [],
      timeline_duration: cs.timeline?.duration ?? "",
      timeline_started_at: cs.timeline?.started_at ? cs.timeline.started_at.slice(0, 10) : "",
      timeline_completed_at: cs.timeline?.completed_at ? cs.timeline.completed_at.slice(0, 10) : "",
      development_process: cs.development_process ?? [],
      challenges_and_solutions: cs.challenges_and_solutions ?? [],
      results: cs.results ?? [],
      gallery: cs.gallery ?? [],
      client_testimonial_quote: cs.client_testimonial?.quote ?? "",
      client_testimonial_name: cs.client_testimonial?.client_name ?? "",
      client_testimonial_designation: cs.client_testimonial?.designation ?? "",
      client_testimonial_company: cs.client_testimonial?.company ?? "",
      featured: cs.featured ?? false,
      seo_meta_title: cs.seo?.meta_title ?? "",
      seo_meta_description: cs.seo?.meta_description ?? "",
      status: cs.status,
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onConfirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCaseStudy(deleteTarget);
      toast.success("Case study deleted successfully.");
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
      await deleteAllCaseStudies();
      toast.success("All case studies deleted successfully.");
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
          title="Case Studies Management"
          subtitle="Create, update, and remove case study records."
        />
      </div>

      <div className="mt-6 bg-background border border-border rounded p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by title..."
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
            {form.case_study_id ? "Edit Case Study" : "Add New Case Study"}
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <FormField
              label="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. E-commerce Growth Strategy"
            />

            <div>
              <label className="block text-sm font-medium text-heading mb-1">Project *</label>
              <select
                value={form.project}
                onChange={(e) => setForm((f) => ({ ...f, project: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary-light outline-none">
                <option value="">Select a project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.project_name}</option>
                ))}
              </select>
              {projects.length === 0 && <p className="text-xs text-muted mt-1">No projects found. Create projects first.</p>}
            </div>

            <FormField
              label="Overview"
              textarea
              rows={3}
              value={form.overview}
              onChange={(e) => setForm((f) => ({ ...f, overview: e.target.value }))}
              placeholder="Brief overview of the case study"
            />

            <FormField
              label="Challenge"
              textarea
              rows={3}
              value={form.challenge}
              onChange={(e) => setForm((f) => ({ ...f, challenge: e.target.value }))}
              placeholder="What challenge did the client face?"
            />

            <FormField
              label="Strategy"
              textarea
              rows={2}
              value={form.strategy}
              onChange={(e) => setForm((f) => ({ ...f, strategy: e.target.value }))}
              placeholder="High-level strategy overview"
            />

            <FormField
              label="Solution"
              textarea
              rows={3}
              value={form.solution}
              onChange={(e) => setForm((f) => ({ ...f, solution: e.target.value }))}
              placeholder="How did you solve the problem?"
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
                  <span className="text-sm font-semibold text-heading">Featured</span>
                </div>
              </div>
            </div>

            <FileUploadField
              label="Hero Image"
              required
              file={form.hero_image instanceof File ? form.hero_image : null}
              existingUrl={typeof form.hero_image === "string" ? resolveUrl(form.hero_image) : ""}
              onChange={onPickHeroImage}
              onRemove={() => setForm((f) => ({ ...f, hero_image: "" }))}
              confirmText="Remove hero image?"
            />

            <div>
              <label className="block text-sm font-medium text-heading mb-1">Gallery Images</label>
              <input
                ref={galleryRef}
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
                        onClick={() => setConfirmItemDelete({ type: "gallery", index: idx })}
                        className="absolute top-0 right-0 bg-primary text-white w-4 h-4 flex items-center justify-center text-xs cursor-pointer">
                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Objectives */}
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-heading">Objectives</span>
                <button type="button" onClick={() => addArrayItem("objectives")} className="text-xs text-primary hover:text-primary-hover cursor-pointer">+ Add</button>
              </div>
              {form.objectives.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayItem("objectives", idx, e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary-light outline-none"
                    placeholder="Objective"
                  />
                  <button type="button" onClick={() => setConfirmItemDelete({ type: "objectives", index: idx })} className="text-primary hover:text-primary-hover cursor-pointer"><FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>

            {/* Deliverables */}
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-heading">Deliverables</span>
                <button type="button" onClick={() => addArrayItem("deliverables")} className="text-xs text-primary hover:text-primary-hover cursor-pointer">+ Add</button>
              </div>
              {form.deliverables.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayItem("deliverables", idx, e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary-light outline-none"
                    placeholder="Deliverable"
                  />
                  <button type="button" onClick={() => setConfirmItemDelete({ type: "deliverables", index: idx })} className="text-primary hover:text-primary-hover cursor-pointer"><FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="border-t border-border pt-3">
              <div className="text-sm font-bold text-heading mb-2">Timeline</div>
              <div className="space-y-3">
                <FormField
                  label="Duration"
                  value={form.timeline_duration}
                  onChange={(e) => setForm((f) => ({ ...f, timeline_duration: e.target.value }))}
                  placeholder="e.g. 3 months"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    label="Start Date"
                    type="date"
                    value={form.timeline_started_at}
                    onChange={(e) => setForm((f) => ({ ...f, timeline_started_at: e.target.value }))}
                  />
                  <FormField
                    label="Completion Date"
                    type="date"
                    value={form.timeline_completed_at}
                    onChange={(e) => setForm((f) => ({ ...f, timeline_completed_at: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Development Process */}
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-heading">Development Process</span>
                <button type="button" onClick={() => addObjectItem("development_process")} className="text-xs text-primary hover:text-primary-hover cursor-pointer">+ Add</button>
              </div>
              {form.development_process.map((item, idx) => (
                <div key={idx} className="border border-border rounded p-2 mb-2 space-y-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateObjectItem("development_process", idx, "title", e.target.value)}
                    className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary-light outline-none"
                    placeholder="Step title"
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) => updateObjectItem("development_process", idx, "description", e.target.value)}
                    rows={2}
                    className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary-light outline-none"
                    placeholder="Step description"
                  />
                  <button type="button" onClick={() => setConfirmItemDelete({ type: "development_process", index: idx })} className="text-primary hover:text-primary-hover cursor-pointer"><FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>

            {/* Challenges & Solutions */}
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-heading">Challenges & Solutions</span>
                <button type="button" onClick={() => addObjectItem("challenges_and_solutions")} className="text-xs text-primary hover:text-primary-hover cursor-pointer">+ Add</button>
              </div>
              {form.challenges_and_solutions.map((item, idx) => (
                <div key={idx} className="border border-border rounded p-2 mb-2 space-y-2">
                  <textarea
                    value={item.challenge}
                    onChange={(e) => updateObjectItem("challenges_and_solutions", idx, "challenge", e.target.value)}
                    rows={2}
                    className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary-light outline-none"
                    placeholder="Challenge"
                  />
                  <textarea
                    value={item.solution}
                    onChange={(e) => updateObjectItem("challenges_and_solutions", idx, "solution", e.target.value)}
                    rows={2}
                    className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary-light outline-none"
                    placeholder="Solution"
                  />
                  <button type="button" onClick={() => setConfirmItemDelete({ type: "challenges_and_solutions", index: idx })} className="text-primary hover:text-primary-hover cursor-pointer"><FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>

            {/* Results */}
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-heading">Results</span>
                <button type="button" onClick={() => addObjectItem("results")} className="text-xs text-primary hover:text-primary-hover cursor-pointer">+ Add</button>
              </div>
              {form.results.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2 mb-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateObjectItem("results", idx, "title", e.target.value)}
                    className="rounded border border-border bg-background px-3 py-2 text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary-light outline-none"
                    placeholder="Metric name"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => updateObjectItem("results", idx, "value", e.target.value)}
                      className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary-light outline-none"
                      placeholder="Value"
                    />
                    <button type="button" onClick={() => setConfirmItemDelete({ type: "results", index: idx })} className="text-primary hover:text-primary-hover cursor-pointer"><FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Client Testimonial */}
            <div className="border-t border-border pt-3">
              <div className="text-sm font-bold text-heading mb-2">Client Testimonial</div>
              <div className="space-y-3">
                <FormField
                  label="Quote"
                  textarea
                  rows={2}
                  value={form.client_testimonial_quote}
                  onChange={(e) => setForm((f) => ({ ...f, client_testimonial_quote: e.target.value }))}
                  placeholder="Client testimonial quote"
                />
                <FormField
                  label="Client Name"
                  value={form.client_testimonial_name}
                  onChange={(e) => setForm((f) => ({ ...f, client_testimonial_name: e.target.value }))}
                  placeholder="e.g. John Smith"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    label="Designation"
                    value={form.client_testimonial_designation}
                    onChange={(e) => setForm((f) => ({ ...f, client_testimonial_designation: e.target.value }))}
                    placeholder="e.g. CEO"
                  />
                  <FormField
                    label="Company"
                    value={form.client_testimonial_company}
                    onChange={(e) => setForm((f) => ({ ...f, client_testimonial_company: e.target.value }))}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="border-t border-border pt-3">
              <div className="text-sm font-bold text-heading mb-2">SEO</div>
              <div className="space-y-3">
                <FormField
                  label="Meta Title"
                  value={form.seo_meta_title}
                  onChange={(e) => setForm((f) => ({ ...f, seo_meta_title: e.target.value }))}
                  placeholder="SEO title for the case study page"
                />
                <FormField
                  label="Meta Description"
                  textarea
                  rows={2}
                  value={form.seo_meta_description}
                  onChange={(e) => setForm((f) => ({ ...f, seo_meta_description: e.target.value }))}
                  placeholder="SEO description for the case study page"
                />
              </div>
            </div>

            <ErrorBanner message={error} />

            <FormActions
              submitting={submitting}
              editId={form.case_study_id}
              onSubmit={onSubmit}
              onReset={() => setForm(emptyForm)}
              submitLabel={form.case_study_id ? "Update Case Study" : "Create Case Study"}
            />
          </form>
        </div>

        <div className="lg:col-span-2 bg-background border border-border rounded p-5 shadow-xs flex flex-col lg:h-[80vh]">
          <AdminListFooter
            loading={loading}
            total={pagination.total}
            itemsLength={items.length}
            onDeleteAll={() => setDeleteAllTarget(true)}
            label="Case Studies"
          />

          <div className="mt-4 overflow-auto flex-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text">
                  <th className="py-2 pr-3 hidden sm:table-cell">ID</th>
                  <th className="py-2 pr-3">Title</th>
                  <th className="py-2 pr-3">Project</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && !items.length ? (
                  <TableSkeleton rows={5} cols={5} />
                ) : (
                  items.map((cs) => (
                    <tr key={cs._id} className="border-t border-border align-top">
                      <td className="py-3 pr-3 text-text hidden sm:table-cell">
                        <span className="block max-w-20 truncate" title={cs._id}>
                          {cs._id}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          {cs.hero_image && (
                            <img
                              src={resolveUrl(cs.hero_image)}
                              alt=""
                              className="w-10 h-10 rounded object-cover border border-border shrink-0"
                            />
                          )}
                          <div>
                            <div className="font-bold text-heading truncate max-w-50">
                              {cs.title}
                            </div>
                            <div className="text-muted text-xs truncate max-w-50">
                              {cs.overview}
                            </div>
                            {cs.featured && (
                              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <span className="text-xs text-text">
                          {typeof cs.project === "object" ? cs.project.project_name : "N/A"}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                            cs.status === "Published"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }`}>
                          {cs.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            type="button"
                            className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-text hover:text-heading rounded transition cursor-pointer"
                            title="Edit"
                            onClick={() => onEdit(cs)}>
                            <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-primary hover:text-primary-hover rounded transition cursor-pointer"
                            title="Delete"
                            onClick={() => setDeleteTarget(cs._id)}>
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
                    message="No case studies found"
                    submessage="Create a new case study to get started."
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
        message="Are you sure you want to delete this case study? This action cannot be undone."
      />
      <ConfirmModal
        open={deleteAllTarget}
        onCancel={() => setDeleteAllTarget(false)}
        onConfirm={onConfirmDeleteAll}
        message="Are you sure you want to delete ALL case studies? This action cannot be undone."
      />
      <ConfirmModal
        open={confirmItemDelete !== null}
        onCancel={() => setConfirmItemDelete(null)}
        onConfirm={() => {
          if (!confirmItemDelete) return;
          const { type, index } = confirmItemDelete;
          if (type === "gallery") removeGalleryImage(index);
          else if (type === "objectives" || type === "deliverables") removeArrayItem(type, index);
          else removeObjectItem(type, index);
          setConfirmItemDelete(null);
        }}
        message="Remove this item?"
      />
    </div>
  );
}
