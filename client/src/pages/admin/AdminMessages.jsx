import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce.js";
import { toast } from "sonner";
import useContactStore from "../../store/contactStore.js";
import ConfirmModal from "../../components/ui/ConfirmModal.jsx";
import Select from "../../components/ui/Select.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import { TableSkeleton } from "../../components/ui/Skeleton.jsx";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import AdminListFooter from "../../components/ui/AdminListFooter.jsx";
import SearchInput from "../../components/ui/SearchInput.jsx";
import TableEmptyState from "../../components/ui/TableEmptyState.jsx";
import ErrorBanner from "../../components/ui/ErrorBanner.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import EnquiryDetailModal from "../../components/ui/EnquiryDetailModal.jsx";

function statusChip(status) {
  const map = {
    New: "bg-info/10 text-info border-info/20",
    Pending: "bg-warning/10 text-warning border-warning/20",
    Replied: "bg-success/10 text-success border-success/20",
    Spam: "bg-primary-light text-primary border-primary/20",
  };
  return map[status] ?? "bg-surface text-text border-border";
}

export default function AdminMessages() {
  const {
    fetchAdminEnquiries,
    updateEnquiryStatus,
    deleteEnquiry,
    deleteAllEnquiries,
  } = useContactStore();

  const [items, setItems] = useState([]);
  const [counters, setCounters] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteAllTarget, setDeleteAllTarget] = useState(false);
  const [spamTarget, setSpamTarget] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchAdminEnquiries({
        search: search || undefined,
        status: status || undefined,
        date: date || undefined,
        page,
        limit: 10,
      });
      setItems(res.enquiries ?? []);
      setCounters(res.counters ?? null);
      setPagination(res.pagination ?? { total: 0, page: 1, pages: 1 });
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [search, status, date]);

  useDebounce(() => load(), [page, search, status, date], 250);

  async function transition(id, nextStatus) {
    try {
      await updateEnquiryStatus(id, nextStatus);
      toast.success("Status updated successfully.");
      window.dispatchEvent(new Event("refresh-badges"));
      await load();
    } catch (e) {
      const msg = e?.message ?? "Update failed.";
      setError(msg);
      toast.error(msg);
    }
  }

  async function onDelete(id) {
    setDeleteTarget(id);
  }

  async function onConfirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteEnquiry(deleteTarget);
      toast.success("Enquiry deleted successfully.");
      setDeleteTarget(null);
      window.dispatchEvent(new Event("refresh-badges"));
      await load();
    } catch (e) {
      const msg = e?.message ?? "Delete failed.";
      setError(msg);
      toast.error(msg);
      setDeleteTarget(null);
    }
  }

  async function onConfirmDeleteAll() {
    try {
      await deleteAllEnquiries();
      toast.success("All enquiries deleted successfully.");
      setDeleteAllTarget(false);
      window.dispatchEvent(new Event("refresh-badges"));
      await load();
    } catch (e) {
      const msg = e?.message ?? "Delete all failed.";
      setError(msg);
      toast.error(msg);
      setDeleteAllTarget(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <AdminPageHeader
          title="Contact Enquiries"
          subtitle="Search and manage enquiry status workflow."
        />
      </div>

      <div className="mt-6 bg-background border border-border rounded p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name..."
          />
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
            className="rounded border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            type="button"
            className="rounded border border-border py-2 text-sm font-semibold text-text hover:bg-surface hover:text-primary transition cursor-pointer"
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
            <div className="text-center bg-surface border border-border rounded py-3">
              <div className="text-xl font-extrabold text-heading">
                {counters.new ?? 0}
              </div>
              <div className="text-sm text-text">New</div>
            </div>
            <div className="text-center bg-surface border border-border rounded py-3">
              <div className="text-xl font-extrabold text-heading">
                {counters.pending ?? 0}
              </div>
              <div className="text-sm text-text">Pending</div>
            </div>
            <div className="text-center bg-surface border border-border rounded py-3">
              <div className="text-xl font-extrabold text-heading">
                {counters.replied ?? 0}
              </div>
              <div className="text-sm text-text">Replied</div>
            </div>
            <div className="text-center bg-surface border border-border rounded py-3">
              <div className="text-xl font-extrabold text-heading">
                {counters.spam ?? 0}
              </div>
              <div className="text-sm text-text">Spam</div>
            </div>
          </div>
        )}
      </div>

      <ErrorBanner message={error} className="mt-4" />

      <div className="mt-4 bg-background border border-border rounded p-5 shadow-xs">
        <AdminListFooter
          loading={loading}
          total={pagination.total}
          itemsLength={items.length}
          onDeleteAll={() => setDeleteAllTarget(true)}
          label="Enquiries"
        />

        <div className="mt-4 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text">
                <th className="py-2 pr-3 hidden sm:table-cell">ID</th>
                <th className="py-2 pr-3">Sender</th>
                <th className="py-2 pr-3 hidden md:table-cell">Service</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3 hidden sm:table-cell">Date</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && !items.length ? (
                <TableSkeleton rows={5} cols={6} />
              ) : (
                items.map((e) => (
                  <tr
                    key={e.enquiry_id}
                    className="border-t border-border align-top">
                    <td className="py-3 pr-3 text-text hidden sm:table-cell">
                      <span
                        className="block max-w-20 truncate"
                        title={e.enquiry_id}>
                        {e.enquiry_id}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="font-bold text-heading truncate max-w-[150px]">
                        {e.name}
                      </div>
                      <div className="text-sm text-muted truncate max-w-[150px]">
                        {e.email}
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-text hidden md:table-cell truncate max-w-[120px]">
                      {e.service}
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold border ${statusChip(e.status)}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-sm text-muted hidden sm:table-cell">
                      {new Date(e.date).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2 flex-wrap">
                          <button
                            type="button"
                            className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-primary hover:text-primary/80 rounded transition cursor-pointer"
                            title="View"
                            aria-label="View"
                            onClick={() => setSelectedEnquiry(e)}>
                            <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                          </button>
                        {(e.status === "New" || e.status === "Pending") && (
                          <button
                            type="button"
                            className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-text hover:text-heading rounded transition cursor-pointer"
                            onClick={() => transition(e.enquiry_id, "Replied")}>
                            Mark Replied
                          </button>
                        )}
                        {e.status !== "Spam" && (
                          <button
                            type="button"
                            className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-warning hover:text-warning/80 rounded transition cursor-pointer"
                            onClick={() => setSpamTarget(e.enquiry_id)}>
                            Mark Spam
                          </button>
                        )}
                        <button
                          type="button"
                          className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-danger hover:text-red-700 rounded transition cursor-pointer"
                           title="Delete"
                           aria-label="Delete"
                           onClick={() => onDelete(e.enquiry_id)}>
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!items.length && !loading && (
                <TableEmptyState
                  colSpan={6}
                  message="No enquiries found"
                  submessage="Enquiries will appear here when users submit the contact form."
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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

      <EnquiryDetailModal
        open={!!selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        enquiry={selectedEnquiry}
        onMarkReplied={(id) => transition(id, "Replied")}
        onMarkSpam={(id) => transition(id, "Spam")}
      />

      <ConfirmModal
        open={!!spamTarget}
        danger={false}
        onCancel={() => setSpamTarget(null)}
        onConfirm={() => {
          if (spamTarget) {
            transition(spamTarget, "Spam");
            setSpamTarget(null);
          }
        }}
        message="Mark this enquiry as spam? It will be hidden from the main list."
      />
      <ConfirmModal
        danger
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
        message="Are you sure you want to delete this enquiry? This action cannot be undone."
      />
      <ConfirmModal
        danger
        open={deleteAllTarget}
        onCancel={() => setDeleteAllTarget(false)}
        onConfirm={onConfirmDeleteAll}
        message="Are you sure you want to delete ALL enquiries? This action cannot be undone."
      />
    </div>
  );
}
