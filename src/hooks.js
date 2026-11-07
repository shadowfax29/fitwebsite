import { useEffect, useRef, useState } from 'react'

export const prefersReduced = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** true once the element has scrolled into view */
export function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect() }
    }, { threshold })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [threshold])
  return [ref, on]
}

/** play a <video> only while it is on screen */
export function usePlayInView(ref, threshold = 0.35) {
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold })
    io.observe(v)
    return () => io.disconnect()
  }, [ref, threshold])
}

/** eased number tween toward `target` */
export function useCount(target, { ms = 700, delay = 0, pow = 3, initial = target } = {}) {
  const [v, setV] = useState(initial)
  const cur = useRef(initial)
  useEffect(() => {
    if (prefersReduced()) { cur.current = target; setV(target); return }
    let id
    const to = setTimeout(() => {
      const from = cur.current
      const t0 = performance.now()
      const tick = (t) => {
        const p = Math.min(Math.max((t - t0) / ms, 0), 1)
        const val = Math.round(from + (target - from) * (1 - Math.pow(1 - p, pow)))
        cur.current = val
        setV(val)
        if (p < 1) id = requestAnimationFrame(tick)
      }
      id = requestAnimationFrame(tick)
    }, delay)
    return () => { clearTimeout(to); cancelAnimationFrame(id) }
  }, [target, ms, delay, pow])
  return v
}
