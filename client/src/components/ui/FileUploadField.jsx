import { useMemo } from "react";

export default function FileUploadField({
  label,
  required = false,
  file,
  existingUrl = "",
  onChange,
  onRemove,
  accept = "image/*",
  className = "",
}) {
  const previewUrl = useMemo(() => {
    if (file instanceof File) return URL.createObjectURL(file);
    return "";
  }, [file]);

  const displayUrl = previewUrl || existingUrl;

  return (
    <div className={className}>
      <label className="text-sm font-semibold text-heading">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="mt-2 relative w-full h-16">
        <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-border rounded cursor-pointer hover:border-primary hover:bg-primary-light transition">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Preview"
              className="h-16 w-full object-cover rounded"
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
        {displayUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove?.();
            }}
            className="absolute top-1 right-1 p-1 bg-background/80 hover:bg-primary-light rounded-full shadow transition cursor-pointer"
            title="Remove image">
            <svg
              className="w-4 h-4 text-primary hover:text-primary-hover"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
