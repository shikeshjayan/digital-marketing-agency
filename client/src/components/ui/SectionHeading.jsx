export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center">
      {eyebrow && <div className="text-primary font-semibold text-sm">{eyebrow}</div>}
      {title && <h2 className="mt-2 section-heading text-heading">{title}</h2>}
      {subtitle && <p className="mt-3 text-text max-w-2xl mx-auto small-text md:body-text">{subtitle}</p>}
    </div>
  )
}

