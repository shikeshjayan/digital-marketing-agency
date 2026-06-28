import { useEffect, useState } from "react";
import useContactStore from "../../store/contactStore.js";
import ConfirmModal from "../../components/ui/ConfirmModal.jsx";
import Select from "../../components/ui/Select.jsx";

function statusChip(status) {
  const map = {
    New: "bg-blue-50 text-blue-700 border-blue-100",
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
    Replied: "bg-green-50 text-green-700 border-green-100",
    Spam: "bg-red-50 text-red-700 border-red-100",
  };
  return map[status] ?? "bg-gray-50 text-gray-700 border-gray-100";
}

export default function AdminMessages() {
  const { fetchAdminEnquiries, updateEnquiryStatus, deleteEnquiry } =
    useContactStore();

  const [items, setItems] = useState([]);
  const [counters, setCounters] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchAdminEnquiries({
        search: search || undefined,
        status: status || undefined,
        date: date || undefined,
        page: 1,
        limit: 50,
      });
      setItems(res.enquiries ?? []);
      setCounters(res.counters ?? null);
    } catch (e) {
      setError(e?.message ?? "Failed to load.");
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
    const t = setTimeout(() => load(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, date]);

  async function transition(id, nextStatus) {
    try {
      await updateEnquiryStatus(id, nextStatus);
      setToast("Status updated successfully.");
      await load();
    } catch (e) {
      setError(e?.message ?? "Update failed.");
    }
  }

  async function onDelete(id) {
    setDeleteTarget(id);
  }

  async function onConfirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteEnquiry(deleteTarget);
      setToast("Enquiry deleted successfully.");
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setError(e?.message ?? "Delete failed.");
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Contact Enquiries
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Search and manage enquiry status workflow.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={status}
            onChange={setStatus}
            placeholder="All statuses"
            options={[
              { value: "", label: "All statuses" },
              { value: "New", label: "New" },
              { value: "Pending", label: "Pending" },
              { value: "Replied", label: "Replied" },
              { value: "Spam", label: "Spam" },
            ]}
          />
          <input
            type="date"
            className="rounded border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            type="button"
            className="rounded border border-gray-200 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            onClick={() => {
              setSearch("");
              setStatus("");
              setDate("");
            }}>
            Reset Filters
          </button>
        </div>

        {counters && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center bg-gray-50 border border-gray-200 rounded py-3">
              <div className="text-xl font-extrabold text-gray-900">
                {counters.new ?? 0}
              </div>
              <div className="text-sm text-gray-600">New</div>
            </div>
            <div className="text-center bg-gray-50 border border-gray-200 rounded py-3">
              <div className="text-xl font-extrabold text-gray-900">
                {counters.pending ?? 0}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center bg-gray-50 border border-gray-200 rounded py-3">
              <div className="text-xl font-extrabold text-gray-900">
                {counters.replied ?? 0}
              </div>
              <div className="text-sm text-gray-600">Replied</div>
            </div>
            <div className="text-center bg-gray-50 border border-gray-200 rounded py-3">
              <div className="text-xl font-extrabold text-gray-900">
                {counters.spam ?? 0}
              </div>
              <div className="text-sm text-gray-600">Spam</div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded px-4 py-2">
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
        <div className="mt-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded px-4 py-2">
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

      <div className="mt-4 bg-white border border-gray-200 rounded p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="font-extrabold text-gray-900">Enquiries</div>
          <div className="text-sm text-gray-500">
            {loading ? "Loading..." : `${items.length} items`}
          </div>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-3 hidden sm:table-cell">ID</th>
                <th className="py-2 pr-3">Sender</th>
                <th className="py-2 pr-3 hidden md:table-cell">Service</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3 hidden sm:table-cell">Date</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr
                  key={e.enquiry_id}
                  className="border-t border-gray-100 align-top">
                  <td className="py-3 pr-3 text-gray-700 hidden sm:table-cell">
                    <span
                      className="block max-w-[80px] truncate"
                      title={e.enquiry_id}>
                      {e.enquiry_id}
                    </span>
                  </td>
                  <td className="py-3 pr-3">
                    <div className="font-bold text-gray-900 truncate max-w-[150px]">
                      {e.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]">
                      {e.email}
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-gray-600 hidden md:table-cell truncate max-w-[120px]">
                    {e.service}
                  </td>
                  <td className="py-3 pr-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${statusChip(e.status)}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-xs text-gray-500 hidden sm:table-cell">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2 flex-wrap">
                      {(e.status === "New" || e.status === "Pending") && (
                        <button
                          type="button"
                          className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm text-gray-600 hover:text-gray-800 rounded transition cursor-pointer"
                          onClick={() =>
                            transition(e.enquiry_id, "Replied")
                          }>
                          Mark Replied
                        </button>
                      )}
                      {e.status !== "Spam" && (
                        <button
                          type="button"
                          className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm text-yellow-600 hover:text-yellow-500 rounded transition cursor-pointer"
                          onClick={() =>
                            transition(e.enquiry_id, "Spam")
                          }>
                          Mark Spam
                        </button>
                      )}
                      <button
                        type="button"
                        className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm text-red-600 hover:text-red-500 rounded transition cursor-pointer"
                        onClick={() => onDelete(e.enquiry_id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && !loading && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <div className="font-semibold">No enquiries found</div>
                      <div className="text-sm mt-1">
                        Enquiries will appear here when users submit the contact
                        form.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
        message="Are you sure you want to delete this enquiry? This action cannot be undone."
      />
    </div>
  );
}
