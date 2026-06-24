// Shared button styles — use as="a" or as={Link} to render as a link
export default function Button({ as: As = 'button', variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition focus:outline-none'

  const styles =
    variant === 'primary'
      ? 'bg-red-600 text-white hover:bg-orange-500'
      : variant === 'outline'
        ? 'border border-red-200 text-red-700 bg-transparent hover:bg-red-50'
        : variant === 'danger'
          ? 'bg-red-600 text-white hover:bg-orange-500'
          : 'bg-gray-900 text-white hover:bg-gray-800'

  return <As className={`${base} ${styles} ${className}`} {...props} />
}
