import { memo, useMemo } from "react";

function ChevronLeft() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

const Pagination = memo(function Pagination({ page, pages, onPageChange }) {
  const pageNumbers = useMemo(() => {
    if (pages <= 7) {
      return Array.from({ length: pages }, (_, i) => i + 1);
    }
    const nums = [];
    nums.push(1);
    if (page > 3) nums.push("...");
    const start = Math.max(2, page - 1);
    const end = Math.min(pages - 1, page + 1);
    for (let i = start; i <= end; i++) nums.push(i);
    if (page < pages - 2) nums.push("...");
    nums.push(pages);
    return nums;
  }, [page, pages]);

  if (pages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1 mt-4" aria-label="Pagination">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg small-text font-medium transition disabled:opacity-40 disabled:cursor-not-allowed text-muted hover:bg-surface cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft />
      </button>

      {pageNumbers.map((num, i) =>
        num === "..." ? (
          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center small-text text-muted">
            ...
          </span>
        ) : (
          <button
            key={num}
            type="button"
            onClick={() => onPageChange(num)}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-lg small-text font-medium transition cursor-pointer ${
              num === page
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:bg-surface"
            }`}
            aria-current={num === page ? "page" : undefined}
          >
            {num}
          </button>
        )
      )}

      <button
        type="button"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg small-text font-medium transition disabled:opacity-40 disabled:cursor-not-allowed text-muted hover:bg-surface cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRight />
      </button>
    </nav>
  );
});

export default Pagination;
