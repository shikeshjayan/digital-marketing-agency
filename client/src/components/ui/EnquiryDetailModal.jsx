import { useEffect } from "react";
import { relativeTime } from "../../utils/time.js";

function statusChip(status) {
  const map = {
    New: "bg-info/10 text-info border-info/20",
    Pending: "bg-warning/10 text-warning border-warning/20",
    Replied: "bg-success/10 text-success border-success/20",
    Spam: "bg-primary-light text-primary border-primary/20",
  };
  return map[status] ?? "bg-surface text-text border-border";
}

export default function EnquiryDetailModal({
  open,
  onClose,
  enquiry,
  onMarkReplied,
  onMarkSpam,
}) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open || !enquiry) return null;

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

        <h2 className="text-lg font-extrabold text-heading mb-4">
          Enquiry Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-xs text-muted uppercase tracking-wide mb-0.5">
              Name
            </div>
            <div className="text-sm font-semibold text-heading break-words">
              {enquiry.name}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted uppercase tracking-wide mb-0.5">
              Email
            </div>
            <div className="text-sm text-text break-words">{enquiry.email}</div>
          </div>
          {enquiry.phone && (
            <div>
              <div className="text-xs text-muted uppercase tracking-wide mb-0.5">
                Phone
              </div>
              <div className="text-sm text-text">{enquiry.phone}</div>
            </div>
          )}
          {enquiry.service && (
            <div>
              <div className="text-xs text-muted uppercase tracking-wide mb-0.5">
                Service
              </div>
              <div className="text-sm text-text">{enquiry.service}</div>
            </div>
          )}
          <div>
            <div className="text-xs text-muted uppercase tracking-wide mb-0.5">
              Status
            </div>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold border ${statusChip(enquiry.status)}`}>
              {enquiry.status}
            </span>
          </div>
          <div>
            <div className="text-xs text-muted uppercase tracking-wide mb-0.5">
              Date
            </div>
            <div className="text-sm text-text">
              {new Date(enquiry.date).toLocaleDateString()}{" "}
              <span className="text-muted">
                ({relativeTime(enquiry.date)})
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-muted uppercase tracking-wide mb-0.5">
            Message
          </div>
          <div className="text-sm text-text leading-relaxed bg-surface border border-border rounded p-3 whitespace-pre-wrap">
            &ldquo;{enquiry.message}&rdquo;
          </div>
        </div>

        <div className="flex gap-2 border-t border-border pt-4">
          {(enquiry.status === "New" || enquiry.status === "Pending") && (
            <button
              type="button"
              className="flex-1 px-3 py-2 text-sm font-semibold text-text bg-surface border border-border rounded hover:text-heading hover:bg-primary-light transition cursor-pointer"
              onClick={() => {
                onMarkReplied(enquiry.enquiry_id);
                onClose();
              }}>
              Mark Replied
            </button>
          )}
          {enquiry.status !== "Spam" && (
            <button
              type="button"
              className="flex-1 px-3 py-2 text-sm font-semibold text-warning bg-warning/10 border border-warning/20 rounded hover:bg-warning/20 transition cursor-pointer"
              onClick={() => {
                onMarkSpam(enquiry.enquiry_id);
                onClose();
              }}>
              Mark Spam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
