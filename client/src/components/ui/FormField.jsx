import Select from "./Select.jsx";

const inputCls =
  "mt-2 w-full rounded border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100 placeholder:text-gray-400";

export default function FormField({
  label,
  required = false,
  type = "text",
  value,
  onChange,
  placeholder = "",
  className = "",
  textarea = false,
  rows = 2,
  selectOptions = null,
  disabled = false,
}) {
  return (
    <div className={className}>
      <label className="text-sm font-semibold text-gray-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {selectOptions ? (
        <Select
          value={value}
          onChange={onChange}
          className="mt-2"
          options={selectOptions}
        />
      ) : textarea ? (
        <textarea
          rows={rows}
          className={`${inputCls} resize-none`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          className={inputCls}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </div>
  );
}
