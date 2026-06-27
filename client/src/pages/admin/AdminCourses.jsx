import { useEffect, useMemo, useRef, useState } from "react";
import useCourseStore from "../../store/courseStore.js";
import ConfirmModal from "../../components/ui/ConfirmModal.jsx";
import Select from "../../components/ui/Select.jsx";

export default function AdminCourses() {
  const {
    fetchAdminCourses,
    fetchCategories,
    createCourse,
    updateCourse,
    deleteCourse,
  } = useCourseStore();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const emptyForm = useMemo(
    () => ({
      course_id: null,
      course_name: "",
      category: "Marketing",
      description: "",
      status: "Active",
    }),
    [],
  );

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminCourses({
        search: search || undefined,
        category: category || undefined,
        status: status || undefined,
        page: 1,
        limit: 50,
      });
      setItems(data ?? []);
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
    const t = setTimeout(() => load(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, status]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setToast("");
    setSubmitting(true);

    if (!form.course_name.trim() || !form.description.trim()) {
      setError("Please fill Course Name and Description.");
      setSubmitting(false);
      return;
    }

    const payload = {
      course_name: form.course_name.trim(),
      category: form.category,
      description: form.description.trim(),
      status: form.status,
    };

    try {
      if (form.course_id) {
        await updateCourse(form.course_id, payload);
        setToast("Course updated successfully.");
      } else {
        await createCourse(payload);
        setToast("Course created successfully.");
      }

      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Operation failed.",
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
      await deleteCourse(deleteTarget);
      setToast("Course deleted successfully.");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Delete failed.",
      );
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Courses Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Create, update, and remove course records.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded p-5 shadow-sm">
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
              placeholder="Search by course name..."
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
          className="lg:col-span-2 bg-white border border-gray-200 rounded p-4 shadow-sm self-start">
          <div className="font-extrabold text-gray-900">
            {form.course_id ? "Edit Course" : "Add New Course"}
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Course Name
              </label>
              <input
                className="mt-2 w-full rounded border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.course_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, course_name: e.target.value }))
                }
                placeholder="e.g. Digital Marketing 101"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Category
              </label>
              <input
                className="mt-2 w-full rounded border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                placeholder="e.g. Marketing, Design"
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
                placeholder="Detailed description of the course"
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
            {toast && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded px-4 py-2">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {toast}
              </div>
            )}

            <div className="flex gap-2">
              {form.course_id && (
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
                className="flex-1 rounded bg-red-600 text-white py-2.5 font-extrabold hover:bg-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {submitting
                  ? "Saving..."
                  : form.course_id
                    ? "Update Course"
                    : "Create Course"}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-3 bg-white border border-gray-200 rounded p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="font-extrabold text-gray-900">Courses</div>
            <div className="text-sm text-gray-500">
              {loading ? "Loading..." : `${items.length} items`}
            </div>
          </div>

          <div className="mt-4 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-3 hidden sm:table-cell">ID</th>
                  <th className="py-2 pr-3">Course</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr
                    key={c._id}
                    className="border-t border-gray-100 align-top">
                    <td className="py-3 pr-3 text-gray-700 hidden sm:table-cell">
                      <span
                        className="block max-w-[80px] truncate"
                        title={c._id}>
                        {c._id}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="font-bold text-gray-900 truncate max-w-[200px]">
                        {c.course_name}
                      </div>
                      <div className="text-gray-500 text-xs sm:text-sm truncate max-w-[200px]">
                        {c.description}
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold text-gray-700">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                          c.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-yellow-50 text-yellow-700 border-yellow-100"
                        }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                           className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-gray-600 hover:text-gray-800 rounded transition cursor-pointer"
                          onClick={() => {
                            setForm({
                              course_id: c._id,
                              course_name: c.course_name,
                              category: c.category ?? "Marketing",
                              description: c.description,
                              status: c.status,
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
                          onClick={() => onDelete(c._id)}>
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
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <div className="font-semibold">No courses found</div>
                        <div className="text-sm mt-1">
                          Create a new course to get started.
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
        message="Are you sure you want to delete this course? This action cannot be undone."
      />
    </div>
  );
}
