import { useEffect, useRef, useState } from 'react'

export default function Select({ value, onChange, options, placeholder = 'Select...', className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-2 text-left text-sm text-gray-700 outline-none focus:ring-2 focus:ring-red-100 cursor-pointer"
      >
        <span>{selected?.label || placeholder}</span>
        <svg className={`h-4 w-4 text-gray-400 transition ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full rounded border border-gray-200 bg-white py-1 text-sm text-gray-700 shadow-lg">
          {options.map((o) => (
            <li
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false) }}
              className={`px-4 py-2 cursor-pointer hover:bg-red-50 transition ${value === o.value ? 'bg-red-50 font-semibold text-red-600' : ''}`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
