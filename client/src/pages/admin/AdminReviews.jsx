import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import useDebounce from "../../hooks/useDebounce.js";
import useIsMobile from "../../hooks/useIsMobile.js";
import { toast } from "sonner";
import useReviewStore from "../../store/reviewStore.js";
import ConfirmModal from "../../components/ui/ConfirmModal.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import { relativeTime } from "../../utils/time.js";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import AdminListFooter from "../../components/ui/AdminListFooter.jsx";
import ErrorBanner from "../../components/ui/ErrorBanner.jsx";
import SearchInput from "../../components/ui/SearchInput.jsx";
import { TableSkeleton } from "../../components/ui/Skeleton.jsx";
import TableEmptyState from "../../components/ui/TableEmptyState.jsx";
import ReviewDetailModal from "../../components/ui/ReviewDetailModal.jsx";
import Select from "../../components/ui/Select.jsx";

function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <div className="text-warning text-sm whitespace-nowrap">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true">
          {i < full ? "\u2605" : "\u2606"}
        </span>
      ))}
    </div>
  );
}

function statusChip(status) {
  const map = {
    Pending: "bg-warning/10 text-warning border-warning/20",
    Approved: "bg-success/10 text-success border-success/20",
    Rejected: "bg-primary-light text-primary border-primary/20",
  };
  return map[status] ?? "bg-surface text-text border-border";
}

export default function AdminReviews() {
  const isMobile = useIsMobile();

  const [tab, setTab] = useState("Pending");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [counters, setCounters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteAllTarget, setDeleteAllTarget] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchAdminReviews = useReviewStore((s) => s.fetchAdminReviews);
  const approveReview = useReviewStore((s) => s.approveReview);
  const rejectReview = useReviewStore((s) => s.rejectReview);
  const deleteReview = useReviewStore((s) => s.deleteReview);
  const deleteAllReviews = useReviewStore((s) => s.deleteAllReviews);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchAdminReviews({
        status: tab === "All" ? undefined : tab,
        search: search || undefined,
        page,
        limit: isMobile ? 200 : 10,
      });
      setItems(result.reviews);
      setCounters(result.counters);
      setPagination(result.pagination ?? { total: 0, page: 1, pages: 1 });
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to load reviews";
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
  }, [tab]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [tab, search]);

  useDebounce(() => load(), [page, search], 300);

  async function handleApprove(id) {
    setActionLoading(id);
    try {
      await approveReview(id);
      setDeleteTarget(null);
      toast.success("Review approved and published.");
      window.dispatchEvent(new Event("refresh-badges"));
      await load();
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Approve failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id) {
    setActionLoading(id);
    try {
      await rejectReview(id);
      setDeleteTarget(null);
      toast.success("Review rejected.");
      window.dispatchEvent(new Event("refresh-badges"));
      await load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Reject failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id) {
    setActionLoading(id);
    try {
      await deleteReview(id);
      setDeleteTarget(null);
      toast.success("Review deleted permanently.");
      window.dispatchEvent(new Event("refresh-badges"));
      await load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Delete failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  }

  async function onConfirmDeleteAll() {
    try {
      await deleteAllReviews();
      toast.success("All reviews deleted successfully.");
      setDeleteAllTarget(false);
      window.dispatchEvent(new Event("refresh-badges"));
      await load();
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Delete all failed";
      setError(msg);
      toast.error(msg);
      setDeleteAllTarget(false);
    }
  }

  const tabs = [
    { key: "Pending", label: "Pending", count: counters?.pending },
    { key: "Approved", label: "Approved", count: counters?.approved },
    { key: "Rejected", label: "Rejected", count: counters?.rejected },
    { key: "All", label: "All", count: null },
  ];

  const filterOptions = tabs.map((t) => ({
    value: t.key,
    label: `${t.label}${t.count != null ? ` (${t.count})` : ""}`,
  }));

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <AdminPageHeader
          title="Reviews Moderation"
          subtitle="Approve or reject submitted customer reviews."
        />
      </div>

      <div className="mt-6 bg-background border border-border rounded p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Select
            id="tab-filter"
            value={tab}
            onChange={setTab}
            options={filterOptions}
            placeholder="All Statuses"
            className="md:w-48"
          />

          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name..."
            className="md:w-64"
          />
        </div>
      </div>

      <ErrorBanner message={error} className="mt-4" />

      <div className="mt-4 bg-background border border-border rounded p-5 shadow-xs flex flex-col sm:max-h-none max-h-[70vh]">
        <AdminListFooter
          loading={loading}
          total={pagination.total}
          itemsLength={items.length}
          onDeleteAll={() => setDeleteAllTarget(true)}
          label="Reviews"
        />

        <div className="mt-4 overflow-y-auto flex-1 min-h-0">
          <table className="w-full text-sm block sm:table">
            <thead className="hidden sm:table-header-group">
              <tr className="text-left text-text">
                <th className="py-2 pr-3 pl-3 whitespace-nowrap">Name / User</th>
                <th className="py-2 pr-3 whitespace-nowrap hidden sm:table-cell">Rating</th>
                <th className="py-2 pr-3 whitespace-nowrap">Review Comment</th>
                <th className="py-2 pr-3 whitespace-nowrap hidden md:table-cell">Date / Time</th>
                <th className="py-2 pr-3 whitespace-nowrap hidden sm:table-cell">Status</th>
                <th className="py-2 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="block sm:table-row-group">
              {loading && !items.length ? (
                <TableSkeleton rows={5} cols={6} />
              ) : (
                items.map((r) => (
                  <tr
                    key={r.review_id}
                    className="block sm:table-row border sm:border-t border-border mb-3 sm:mb-0 p-3 sm:p-0 rounded-lg sm:rounded-none bg-surface/50 sm:bg-transparent">
                    <td className="block sm:table-cell py-1 sm:py-3 pl-0 sm:pl-3 pr-0 sm:pr-3">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">Name / User</span>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const isDefault = !r.user_avatar || (r.user_avatar.includes("data:image/svg+xml") && r.user_avatar.includes("%3F"));
                          const initial = r.name?.charAt(0)?.toUpperCase() ?? "?";
                          return isDefault ? (
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background text-sm font-medium shrink-0">
                              {initial}
                            </div>
                          ) : (
                            <img
                              src={r.user_avatar}
                              alt={r.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0 bg-surface"
                            />
                          );
                        })()}
                        <div className="min-w-0">
                          <div className="font-bold text-heading sm:truncate sm:max-w-[130px]">
                            {r.name}
                          </div>
                          {r.location && (
                            <div className="text-sm text-muted sm:truncate sm:max-w-[130px]">
                              {r.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="block sm:table-cell py-1 sm:py-3 pr-0 sm:pr-3">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">Rating</span>
                      <Stars rating={r.rating} />
                    </td>
                    <td className="block sm:table-cell py-1 sm:py-3 pr-0 sm:pr-3 sm:max-w-[240px] sm:min-w-[160px]">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">Review Comment</span>
                      <div className="flex items-start gap-1">
                        <span className="sm:truncate text-sm text-text" title={r.review_text}>
                          {r.review_text}
                        </span>
                        {r.review_text.length > 150 && (
                          <button
                            type="button"
                            className="hidden sm:inline text-primary hover:text-primary-hover text-sm font-medium whitespace-nowrap flex-shrink-0 cursor-pointer"
                            onClick={() => setSelectedReview(r)}>
                            Read more
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="block sm:table-cell py-1 sm:py-3 pr-0 sm:pr-3 text-sm text-muted sm:whitespace-nowrap">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">Date / Time</span>
                      {relativeTime(r.date)}
                    </td>
                    <td className="block sm:table-cell py-1 sm:py-3 pr-0 sm:pr-3">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">Status</span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusChip(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="block sm:table-cell py-1 sm:py-3">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide block sm:hidden mb-1">Actions</span>
                      <div className="flex gap-1.5 items-center flex-wrap">
                        {r.status !== "Approved" && (
                          <button
                            type="button"
                            aria-label="Approve"
                            title="Approve"
                            className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-success hover:text-green-700 rounded transition cursor-pointer disabled:opacity-50"
                            onClick={() =>
                              setDeleteTarget({
                                type: "approve",
                                id: r.review_id,
                              })
                            }
                            disabled={actionLoading === r.review_id}>
                            {actionLoading === r.review_id ? (
                              <svg
                                className="animate-spin w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none">
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                            ) : (
                              <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        {r.status !== "Rejected" && (
                          <button
                            type="button"
                            aria-label="Reject"
                            title="Reject"
                            className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-danger hover:text-red-700 rounded transition cursor-pointer disabled:opacity-50"
                            onClick={() =>
                              setDeleteTarget({
                                type: "reject",
                                id: r.review_id,
                              })
                            }
                            disabled={actionLoading === r.review_id}>
                            {actionLoading === r.review_id ? (
                              <svg
                                className="animate-spin w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none">
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                            ) : (
                              <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        {r.status === "Rejected" && (
                          <button
                            type="button"
                            aria-label="Delete"
                            title="Delete"
                            className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-sm min-h-[44px] text-danger hover:text-red-700 rounded transition cursor-pointer disabled:opacity-50"
                            onClick={() =>
                              setDeleteTarget({
                                type: "delete",
                                id: r.review_id,
                              })
                            }
                            disabled={actionLoading === r.review_id}>
                            {actionLoading === r.review_id ? (
                              <svg
                                className="animate-spin w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none">
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                            ) : (
                              <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!items.length && !loading && (
                <TableEmptyState
                  colSpan={6}
                  message="No reviews found"
                  submessage={
                    tab === "All"
                      ? "No reviews have been submitted yet"
                      : `No ${tab.toLowerCase()} reviews`
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

      <ConfirmModal
        open={!!deleteTarget}
        danger={deleteTarget?.type !== "approve"}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget?.type === "approve") {
            handleApprove(deleteTarget.id);
          } else if (deleteTarget?.type === "delete") {
            handleDelete(deleteTarget.id);
          } else {
            handleReject(deleteTarget.id);
          }
        }}
        message={
          deleteTarget?.type === "approve"
            ? "This review will be published on the public site. Continue?"
            : deleteTarget?.type === "delete"
              ? "Delete this rejected review permanently? This action cannot be undone."
              : "This review will be rejected and hidden. Continue?"
        }
      />
      <ConfirmModal
        danger
        open={deleteAllTarget}
        onCancel={() => setDeleteAllTarget(false)}
        onConfirm={onConfirmDeleteAll}
        message="Are you sure you want to delete ALL reviews? This action cannot be undone."
      />
      <ReviewDetailModal
        open={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        review={selectedReview}
        onApprove={handleApprove}
        onReject={handleReject}
        actionLoading={actionLoading}
      />
    </div>
  );
}
