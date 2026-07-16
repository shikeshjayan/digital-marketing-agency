export default function FormActions({
  submitting,
  editId,
  onSubmit,
  onReset,
  submitLabel = "Submit",
  resetLabel = "Cancel",
}) {
  return (
    <div className="flex gap-2">
      {editId && (
        <button
          type="button"
          className="flex-1 rounded border border-border py-2.5 small-text font-semibold text-text hover:border-primary transition cursor-pointer"
          onClick={onReset}>
          {resetLabel}
        </button>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="flex-1 rounded bg-primary text-white py-2.5 font-extrabold hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
        {submitting ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}
