import { useId } from "react";
import Select from "./Select.jsx";
import DatePicker from "./DatePicker.jsx";

const inputCls =
  "mt-2 w-full rounded border border-border bg-surface px-4 py-2 text-sm text-heading outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary-light placeholder:text-muted";

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
  ...rest
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold text-heading">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {selectOptions ? (
        <Select
          id={id}
          value={value}
          onChange={onChange}
          className="mt-2"
          options={selectOptions}
        />
      ) : type === "date" ? (
        <DatePicker
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="mt-2"
          dropdownAlign={rest.dropdownAlign}
        />
      ) : textarea ? (
        <textarea
          id={id}
          rows={rows}
          className={`${inputCls} resize-none`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={inputCls}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          {...rest}
        />
      )}
    </div>
  );
}
