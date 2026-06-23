export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center">
      {eyebrow && <div className="text-red-700 font-semibold text-sm">{eyebrow}</div>}
      {title && <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">{title}</h2>}
      {subtitle && <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm md:text-base">{subtitle}</p>}
    </div>
  )
}

