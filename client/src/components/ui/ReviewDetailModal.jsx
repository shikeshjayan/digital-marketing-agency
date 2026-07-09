import { useEffect } from "react";
import { relativeTime } from "../../utils/time.js";

function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <div className="text-warning text-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < full ? "\u2605" : "\u2606"}</span>
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

function Avatar({ avatar, name }) {
  const isDefault = !avatar || avatar.includes("data:image/svg+xml");
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";

  if (isDefault) {
    return (
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-background text-lg font-medium shrink-0">
        {initial}
      </div>
    );
  }

  return (
    <img
      src={avatar}
      alt={name}
      className="w-10 h-10 rounded-full object-cover shrink-0"
    />
  );
}

export default function ReviewDetailModal({
  open,
  onClose,
  review,
  onApprove,
  onReject,
  actionLoading,
}) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open || !review) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-lg shadow-xl w-full max-w-lg md:max-w-2xl max-h-[80vh] overflow-y-auto p-5">
        <button
          type="button"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-muted hover:text-text rounded transition cursor-pointer"
          onClick={onClose}
          aria-label="Close">
          <svg
            className="w-5 h-5 hover:bg-primary hover:text-background rounded transition"
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
        </button>

        <div className="flex items-center gap-3 mb-4">
          <Avatar avatar={review.user_avatar} name={review.name} />
          <div className="min-w-0">
            <div className="font-bold text-heading truncate">{review.name}</div>
            {review.location && (
              <div className="text-xs text-muted truncate">
                {review.location}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <Stars rating={review.rating} />
        </div>

        <div className="mb-4 text-sm text-text leading-relaxed">
          &ldquo;{review.review_text}&rdquo;
        </div>

        <div className="flex items-center gap-3 text-xs text-muted border-t border-border pt-3">
          <span>{relativeTime(review.date)}</span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium border ${statusChip(review.status)}`}>
            {review.status}
          </span>
        </div>

        {review.status === "Pending" && (
          <div className="flex gap-2 mt-4 border-t border-border pt-4">
            <button
              type="button"
              className="flex-1 px-3 py-2 text-sm font-semibold text-success bg-success/10 border border-success/20 rounded hover:bg-success/20 transition cursor-pointer disabled:opacity-50"
              onClick={() => {
                onApprove(review.review_id);
                onClose();
              }}
              disabled={actionLoading === review.review_id}>
              {actionLoading === review.review_id ? (
                <span className="flex items-center justify-center gap-1.5">
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
                  Approving...
                </span>
              ) : (
                "Approve"
              )}
            </button>
            <button
              type="button"
              className="flex-1 px-3 py-2 text-sm font-semibold text-primary bg-primary-light border border-primary/20 rounded hover:bg-primary/10 transition cursor-pointer disabled:opacity-50"
              onClick={() => {
                onReject(review.review_id);
                onClose();
              }}
              disabled={actionLoading === review.review_id}>
              {actionLoading === review.review_id ? (
                <span className="flex items-center justify-center gap-1.5">
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
                  Rejecting...
                </span>
              ) : (
                "Reject"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
