import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function AdminListFooter({
  loading,
  total,
  itemsLength,
  onDeleteAll,
  label = "items",
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="font-extrabold text-heading">{label}</div>
      <div className="flex items-center gap-3">
        {itemsLength > 0 && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-danger hover:text-red-700 transition cursor-pointer"
            onClick={onDeleteAll}>
            <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete All</span>
          </button>
        )}
        <div className="small-text text-muted">
          {loading ? <span className="inline-block animate-spin w-3 h-3 border-2 border-primary border-t-transparent rounded-full" /> : `${total} items`}
        </div>
      </div>
    </div>
  );
}
