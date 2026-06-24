// Reusable image placeholder — shown until real photos are uploaded
function PlaceholderIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  )
}

export default function ImagePlaceholder({ label = 'Image', compact = false, className = '' }) {
  // Compact mode fits inside small circles (avatars, thumbnails)
  if (compact) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
        <PlaceholderIcon className="w-1/2 h-1/2 max-w-6 max-h-6" />
      </div>
    )
  }

  // Default mode shows icon + label (cards, hero areas)
  return (
    <div className={`flex flex-col items-center justify-center text-gray-400 ${className}`}>
      <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
        <PlaceholderIcon className="w-8 h-8" />
      </div>
      {label ? (
        <span className="mt-2 text-xs font-semibold uppercase tracking-wide">{label}</span>
      ) : null}
    </div>
  )
}
