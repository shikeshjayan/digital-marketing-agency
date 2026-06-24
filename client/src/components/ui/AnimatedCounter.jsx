import { useEffect, useRef, useState } from 'react'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

export default function AnimatedCounter({ target, suffix = '', durationMs = 900 }) {
  const [value, setValue] = useState(0)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const start = performance.now()
    const tick = (now) => {
      const elapsed = now - start
      const t = clamp(elapsed / durationMs, 0, 1)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      const current = Math.round(eased * target)
      setValue(current)
      if (t < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [durationMs, target])

  return (
    <span className="tabular-nums">
      {value}
      {suffix}
    </span>
  )
}

