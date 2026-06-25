import { useEffect, useRef, useState } from 'react'

export default function DropdownSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  className = '',
  triggerClassName = '',
  menuClassName = '',
  disabled = false,
  'aria-label': ariaLabel,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    function handlePointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const selected = options.find((option) => option.value === value)
  const hasValue = value !== '' && value != null
  const displayLabel = selected?.label ?? placeholder

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-left outline-none transition focus:ring-2 focus:ring-red-100 hover:bg-red-50/40 disabled:cursor-not-allowed disabled:opacity-60 ${
          hasValue ? 'text-gray-900' : 'text-gray-500'
        } ${triggerClassName}`}
      >
        <span className="truncate">{displayLabel}</span>
        <span className="text-xs text-gray-400 shrink-0" aria-hidden="true">
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div className={`absolute z-30 top-full pt-2 left-0 w-full min-w-[12rem] ${menuClassName}`}>
          <div
            role="listbox"
            className="bg-white border border-gray-200 rounded-xl shadow-lg p-2 max-h-60 overflow-y-auto"
          >
            {options.map((option) => {
              const isSelected = option.value === value
              return (
                <button
                  key={`${option.value}::${option.label}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    isSelected
                      ? 'bg-red-50 text-red-700 font-semibold'
                      : 'text-gray-700 hover:bg-red-50 hover:text-red-700'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
