import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function ImageViewerModal({ open, src, alt, onClose }) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-background rounded-lg shadow-xl max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl w-full max-h-[75vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="text-sm font-semibold text-heading truncate">
            {alt ?? "Preview"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center hover:opacity-90 transition cursor-pointer shrink-0 ml-2">
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
          <img
            src={src}
            alt={alt ?? "Preview"}
            className="max-w-full object-contain"
            style={{ maxHeight: "calc(75vh - 3.5rem)" }}
          />
        </div>
      </div>
    </div>
  );
}
