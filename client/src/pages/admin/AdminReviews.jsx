import { useEffect, useRef, useState } from "react";
import useReviewStore from "../../store/reviewStore.js";
import ConfirmModal from "../../components/ui/ConfirmModal.jsx";
import { relativeTime } from "../../utils/time.js";

function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <div className="text-yellow-500 text-sm">
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
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
    Approved: "bg-green-50 text-green-700 border-green-100",
    Rejected: "bg-red-50 text-red-700 border-red-100",
  };
  return map[status] ?? "bg-gray-50 text-gray-600 border-gray-100";
}

function ReviewText({ text }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 150;
  const display = expanded || !isLong ? text : text.slice(0, 150) + "...";

  return (
    <div className="mt-2 text-sm text-gray-700 leading-relaxed">
      &ldquo;{display}&rdquo;
      {isLong && (
        <button
          type="button"
          className="ml-1 text-red-600 hover:text-red-700 font-medium cursor-pointer"
          onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default function AdminReviews() {
  const [tab, setTab] = useState("Pending");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [counters, setCounters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const searchRef = useRef(null);

  const fetchAdminReviews = useReviewStore((s) => s.fetchAdminReviews);
  const approveReview = useReviewStore((s) => s.approveReview);
  const rejectReview = useReviewStore((s) => s.rejectReview);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchAdminReviews({
        status: tab === "All" ? undefined : tab,
        search: search || undefined,
        page: 1,
        limit: 50,
      });
      setItems(result.reviews);
      setCounters(result.counters);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load reviews",
      );
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
    const t = setTimeout(() => load(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleApprove(id) {
    setActionLoading(id);
    try {
      await approveReview(id);
      setDeleteTarget(null);
      setToast("Review approved and published.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Approve failed");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id) {
    setActionLoading(id);
    try {
      await rejectReview(id);
      setDeleteTarget(null);
      setToast("Review rejected.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Reject failed");
    } finally {
      setActionLoading(null);
    }
  }

  const tabs = [
    { key: "Pending", label: "Pending", count: counters?.pending },
    { key: "Approved", label: "Approved", count: counters?.approved },
    { key: "Rejected", label: "Rejected", count: counters?.rejected },
    { key: "All", label: "All", count: null },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Reviews Moderation
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Approve or reject submitted customer reviews.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition cursor-pointer ${
                  tab === t.key
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-700 border-gray-200 hover:text-red-700 hover:bg-red-50"
                }`}
                onClick={() => setTab(t.key)}>
                {t.label}
                {t.count != null && (
                  <span
                    className={`ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full ${
                      tab === t.key
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

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
              ref={searchRef}
              className="w-full md:w-64 rounded border border-gray-200 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-red-100 text-sm"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
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
          <div className="font-extrabold text-gray-900">Reviews</div>
          <div className="text-sm text-gray-500">
            {loading ? "Loading..." : `${items.length} items`}
          </div>
        </div>

        {loading && !items.length ? (
          <div className="mt-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-100 rounded p-4">
                <div className="flex gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-48 bg-gray-100 rounded" />
                    <div className="h-3 w-full bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length ? (
          <div className="mt-4 space-y-3">
            {items.map((r) => (
              <div
                key={r.review_id}
                className="border border-gray-100 rounded p-4 hover:bg-gray-50 transition">
                <div className="flex items-start gap-3 sm:gap-4">
                  <img
                    src={r.user_avatar}
                    alt={r.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 bg-gray-100"
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect fill='%23e5e7eb' width='40' height='40'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-size='16' font-family='sans-serif'>${r.name?.charAt(0)?.toUpperCase() ?? "?"}</text></svg>`;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-bold text-gray-900 truncate">
                        {r.name}
                      </div>
                      <span className="text-xs text-gray-400 truncate">
                        {r.location}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusChip(r.status)}`}>
                        {r.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Stars rating={r.rating} />
                      <span className="text-xs text-gray-400">
                        {relativeTime(r.date)}
                      </span>
                    </div>
                    <ReviewText text={r.review_text} />
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {r.status !== "Approved" && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition cursor-pointer disabled:opacity-50"
                          onClick={() =>
                            setDeleteTarget({
                              type: "approve",
                              id: r.review_id,
                            })
                          }
                          disabled={actionLoading === r.review_id}>
                          {actionLoading === r.review_id ? (
                            <svg
                              className="animate-spin w-3.5 h-3.5"
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
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                          Approve
                        </button>
                      )}
                      {r.status !== "Rejected" && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
                          onClick={() =>
                            setDeleteTarget({
                              type: "reject",
                              id: r.review_id,
                            })
                          }
                          disabled={actionLoading === r.review_id}>
                          {actionLoading === r.review_id ? (
                            <svg
                              className="animate-spin w-3.5 h-3.5"
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
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg
              className="w-12 h-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <div className="mt-3 text-sm font-medium text-gray-500">
              No reviews found
            </div>
            <div className="mt-1 text-xs text-gray-400">
              {tab === "All"
                ? "No reviews have been submitted yet"
                : `No ${tab.toLowerCase()} reviews`}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget?.type === "approve") {
            handleApprove(deleteTarget.id);
          } else {
            handleReject(deleteTarget.id);
          }
        }}
        message={
          deleteTarget?.type === "approve"
            ? "This review will be published on the public site. Continue?"
            : "This review will be rejected and hidden. Continue?"
        }
      />
    </div>
  );
}
