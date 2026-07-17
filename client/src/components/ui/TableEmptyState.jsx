export default function TableEmptyState({
  icon,
  message = "No items found",
  submessage = "",
  colSpan = 4,
}) {
  return (
    <tr className="block sm:table-row">
      <td
        colSpan={colSpan}
        className="block sm:table-cell border sm:border-t border-border mb-3 sm:mb-0 p-6 sm:p-0 rounded-lg sm:rounded-none bg-surface/50 sm:bg-transparent py-8 sm:py-12 text-center">
        <div className="flex flex-col items-center text-muted">
          {icon || (
            <svg
              className="w-12 h-12 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          )}
          <div className="font-semibold">{message}</div>
          {submessage && (
            <div className="small-text mt-1">{submessage}</div>
          )}
        </div>
      </td>
    </tr>
  );
}
