// Short text labels used instead of emoji icons on the contact page
const labels = {
  phone: 'Tel',
  mail: 'Mail',
  address: 'Loc',
}

export default function ContactIcon({ type, className = 'text-red-700' }) {
  return (
    <span className={`text-xs font-bold uppercase tracking-wide ${className}`}>
      {labels[type] ?? 'Info'}
    </span>
  )
}
