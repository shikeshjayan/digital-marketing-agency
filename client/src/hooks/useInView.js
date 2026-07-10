import { useCallback, useEffect, useState } from 'react'

export default function useInView({ threshold = 0.15, rootMargin = '0px 0px -40px 0px' } = {}) {
  const [node, setNode] = useState(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!node) return

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

    observer.observe(node)
    return () => observer.disconnect()
  }, [node, threshold, rootMargin])

  const ref = useCallback((el) => {
    setNode(el)
  }, [])

  return [ref, isInView]
}
