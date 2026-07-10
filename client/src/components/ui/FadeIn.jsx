import useInView from '../../hooks/useInView.js'

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  as: Tag = 'div',
  ...props
}) {
  const [ref, isInView] = useInView()

  const transforms = {
    up: 'translate-y-6',
    down: '-translate-y-6',
    left: 'translate-x-6',
    right: '-translate-x-6',
    none: '',
  }

  const base = 'transition-all duration-500 ease-out'
  const hidden = `opacity-0 ${transforms[direction]}`
  const visible = 'opacity-100 translate-x-0 translate-y-0'

  const child = typeof children === 'function'
    ? children({ isInView, ref })
    : (
      <Tag
        ref={ref}
        className={`${base} ${isInView ? visible : hidden} ${className}`}
        style={{ transitionDelay: `${delay}ms` }}
        {...props}
      >
        {children}
      </Tag>
    )

  return child
}
