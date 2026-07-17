import { useCallback, useEffect, useState } from 'react'

export default function useInView({ threshold = 0.15, rootMargin = '0px 0px -40px 0px', once = true } = {}) {
  const [node, setNode] = useState(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) {
            observer.unobserve(node)
          }
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [node, threshold, rootMargin, once])

  const ref = useCallback((el) => {
    setNode(el)
  }, [])

  return [ref, isInView]
}
