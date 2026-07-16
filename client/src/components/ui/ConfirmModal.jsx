import { useEffect } from "react";

export default function ConfirmModal({
  open,
  onCancel,
  onConfirm,
  message = "Are you sure? This action cannot be undone.",
  danger = false,
}) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Confirm action">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-background rounded-lg shadow-xl w-full max-w-sm p-6">
        <div className="flex flex-col items-center text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${danger ? "bg-red-100" : "bg-primary-light"}`}>
            <svg
              className={`w-6 h-6 ${danger ? "text-red-600" : "text-primary"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-text small-text">{message}</p>
          <div className="flex gap-3 mt-6 w-full">
            <button
              onClick={onCancel}
              className="flex-1 rounded-lg border border-border py-2.5 small-text font-semibold text-text hover:border-primary transition cursor-pointer">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 rounded-lg py-2.5 small-text font-semibold text-white transition cursor-pointer button-text ${danger ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary-hover"}`}>
              {danger ? "Delete" : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
