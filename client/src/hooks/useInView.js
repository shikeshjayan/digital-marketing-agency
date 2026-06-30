import { useEffect, useRef, useState } from 'react'

export default function useInView({ threshold = 0.15, rootMargin = '0px 0px -40px 0px' } = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        } else {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, isInView]
}
