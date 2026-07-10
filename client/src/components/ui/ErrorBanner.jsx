export default function ErrorBanner({ message, className = "" }) {
  if (!message) return null;
  return (
    <div role="alert" aria-live="polite" className={`flex items-center gap-2 text-sm text-primary bg-primary-light rounded px-4 py-2 ${className}`}>
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
      {message}
    </div>
  );
}
