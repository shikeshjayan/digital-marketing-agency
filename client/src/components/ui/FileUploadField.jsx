import { useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faExpand } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "./ConfirmModal.jsx";
import ImageViewerModal from "./ImageViewerModal.jsx";

export default function FileUploadField({
  label,
  required = false,
  file,
  existingUrl = "",
  hidePreview = false,
  onChange,
  onRemove,
  accept = "image/*",
  className = "",
  containerHeight = "h-16",
  confirmText = "",
}) {
  const inputRef = useRef(null);
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const previewUrl = useMemo(() => {
    if (file instanceof File) return URL.createObjectURL(file);
    return "";
  }, [file]);

  const displayUrl = previewUrl || existingUrl;

  const showImage = displayUrl && !hidePreview;

  return (
    <div className={className}>
      <label className="text-sm font-semibold text-heading">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className={`mt-2 relative w-full ${containerHeight}`}>
        <label className={`flex flex-col items-center justify-center w-full ${containerHeight} border-2 border-dashed border-border rounded cursor-pointer hover:border-primary hover:bg-primary-light transition`}>
          {showImage ? (
            <img
              src={displayUrl}
              alt="Preview"
              className={`${containerHeight} w-full object-cover rounded`}
            />
          ) : (
            <>
              <svg
                className="w-5 h-5 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm text-muted mt-1">
                {file ? "Change Photo" : "Choose Photo"}
              </span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (f.size > 5 * 1024 * 1024) {
                alert("Image must be less than 5MB.");
                return;
              }
              onChange?.(f);
            }}
          />
        </label>
        {showImage && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewOpen(true);
            }}
            className="absolute top-1 left-1 p-1 bg-background/80 hover:bg-primary-light rounded-full shadow transition cursor-pointer"
            title="View full size">
            <FontAwesomeIcon icon={faExpand} className="w-4 h-4 text-primary hover:text-primary-hover" />
          </button>
        )}
        {showImage && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (confirmText) {
                setConfirmingRemove(true);
                return;
              }
              if (inputRef.current) inputRef.current.value = "";
              onRemove?.();
            }}
            className="absolute top-1 right-1 p-1 bg-background/80 hover:bg-primary-light rounded-full shadow transition cursor-pointer"
            title="Remove image">
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4 text-primary hover:text-primary-hover" />
          </button>
        )}
      </div>

      <ConfirmModal
        open={confirmingRemove}
        onCancel={() => setConfirmingRemove(false)}
        onConfirm={() => {
          setConfirmingRemove(false);
          if (inputRef.current) inputRef.current.value = "";
          onRemove?.();
        }}
        message={confirmText}
      />

      <ImageViewerModal
        open={viewOpen}
        src={displayUrl}
        alt={label}
        onClose={() => setViewOpen(false)}
      />
    </div>
  );
}
