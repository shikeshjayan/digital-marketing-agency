import { useState } from 'react'
import { fileToDataUrl } from '../../utils/fileToDataUrl.js'

export default function ImageFileInput({ onChange, className = '' }) {
  const [fileName, setFileName] = useState('')

  async function handleChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const dataUrl = await fileToDataUrl(file)
    onChange(dataUrl)
  }

  return (
    <label
      className={`mt-2 flex flex-col items-center justify-center w-full min-h-[7rem] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-5 cursor-pointer hover:border-red-200 hover:bg-red-50/40 transition ${className}`}
    >
      <input type="file" accept="image/*" className="sr-only" onChange={handleChange} />
      <span className="rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm">
        Choose File
      </span>
      <span className="mt-2 text-xs text-gray-500 text-center truncate max-w-full">
        {fileName || 'PNG, JPG or WEBP'}
      </span>
    </label>
  )
}
