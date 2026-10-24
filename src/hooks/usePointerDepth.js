import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { isFinePointer } from '../lib/motion'
import useMotionPreference from './useMotionPreference'

/**
 * Pointer depth: inner wrappers marked [data-depth="0..1"] lean toward the cursor.
 * These are never the nodes carrying a scroll tween, so the two never fight over
 * the same transform component. Desktop pointers only, and only while motion is on.
 */
export default function usePointerDepth(scopeRef, { shiftX = 26, shiftY = 18 } = {}) {
  const { allowed } = useMotionPreference()

  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope || !allowed || !isFinePointer()) return undefined

    const layers = gsap.utils.toArray('[data-depth]', scope).map((node) => ({
      node,
      factor: Number.parseFloat(node.dataset.depth) || 0.5,
      x: gsap.quickTo(node, 'x', { duration: 0.65, ease: 'power3.out' }),
      y: gsap.quickTo(node, 'y', { duration: 0.65, ease: 'power3.out' }),
    }))

    if (!layers.length) return undefined

    const onMove = (event) => {
      const rect = scope.getBoundingClientRect()
      if (rect.bottom < -60 || rect.top > window.innerHeight + 60) return
      const nx = event.clientX / window.innerWidth - 0.5
      const ny = event.clientY / window.innerHeight - 0.5
      layers.forEach(({ factor, x, y }) => {
        x(nx * shiftX * factor)
        y(ny * shiftY * factor)
      })
    }

    const onLeave = () => {
      layers.forEach(({ x, y }) => {
        x(0)
        y(0)
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      layers.forEach(({ node }) => gsap.killTweensOf(node))
      gsap.set(layers.map(({ node }) => node), { x: 0, y: 0 })
    }
  }, [allowed, scopeRef, shiftX, shiftY])
}
