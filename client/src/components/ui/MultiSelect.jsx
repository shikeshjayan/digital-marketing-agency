import { useEffect, useRef, useState } from "react";

export default function MultiSelect({
  label,
  required,
  options = [],
  value = [],
  onChange,
  placeholder = "Select...",
  emptyMessage = "No options available",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggle(val) {
    const next = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val];
    onChange(next);
  }

  const selectedCount = value.length;

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-sm font-medium text-heading mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary-light cursor-pointer">
        <span className={selectedCount ? "" : "text-muted"}>
          {selectedCount ? `${selectedCount} selected` : placeholder}
        </span>
        <svg
          className={`h-4 w-4 text-muted transition ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {selectedCount > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {value.map((v) => {
            const opt = options.find((o) => o.value === v);
            return opt ? (
              <span
                key={v}
                className="inline-flex items-center gap-1 bg-primary-light text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                {opt.label}
                <button
                  type="button"
                  onClick={() => toggle(v)}
                  className="text-danger hover:text-red-700 cursor-pointer leading-none">
                  ×
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded border border-border bg-background py-1 text-sm text-text shadow-lg max-h-48 overflow-y-auto">
          {options.length === 0 ? (
            <p className="px-3 py-2 text-muted">{emptyMessage}</p>
          ) : (
            options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-primary-light transition">
                <input
                  type="checkbox"
                  checked={value.includes(opt.value)}
                  onChange={() => toggle(opt.value)}
                  className="w-3.5 h-3.5 rounded border-border accent-primary"
                />
                <span>{opt.label}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
}
