export default function AdminListFooter({
  loading,
  total,
  itemsLength,
  onDeleteAll,
  label = "items",
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="font-extrabold text-gray-900">{label}</div>
      <div className="flex items-center gap-3">
        {itemsLength > 0 && (
          <button
            type="button"
            className="text-sm font-semibold text-primary hover:text-primary-hover transition cursor-pointer"
            onClick={onDeleteAll}>
            Delete All
          </button>
        )}
        <div className="text-sm text-gray-500">
          {loading ? "Loading..." : `${total} items`}
        </div>
      </div>
    </div>
  );
}
