import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { isFinePointer } from '../lib/motion'
import useMotionPreference from '../hooks/useMotionPreference'

const INTERACTIVE = 'a, button'

/**
 * The probe: a lagging ring plus a tight dot that trails the pointer, swelling over
 * anything clickable. Decorative only — the native cursor is deliberately left visible.
 */
export default function CursorProbe() {
  const { allowed } = useMotionPreference()
  const ringRef = useRef(null)
  const dotRef = useRef(null)
  const active = allowed && isFinePointer()

  useLayoutEffect(() => {
    if (!active) return undefined

    const ring = ringRef.current
    const dot = dotRef.current
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power3.out' })
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power2.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power2.out' })

    let shown = false

    const onMove = (event) => {
      if (!shown) {
        shown = true
        gsap.set([ring, dot], { opacity: 1 })
      }
      ringX(event.clientX)
      ringY(event.clientY)
      dotX(event.clientX)
      dotY(event.clientY)
    }

    const onOver = (event) => {
      const hit = event.target instanceof Element && event.target.closest(INTERACTIVE)
      ring.firstElementChild.classList.toggle('probe-target', Boolean(hit))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      gsap.killTweensOf([ring, dot])
    }
  }, [active])

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-40 ${active ? '' : 'opacity-0'}`}
    >
      <div ref={ringRef} className="absolute left-0 top-0 -ml-[19px] -mt-[19px] h-[38px] w-[38px] opacity-0">
        <span className="block h-full w-full rounded-full border border-cyan/55 transition-[transform,border-color,background-color] duration-300" />
      </div>
      <div ref={dotRef} className="absolute left-0 top-0 -ml-[2.5px] -mt-[2.5px] h-[5px] w-[5px] rounded-full bg-cyan opacity-0" />
    </div>
  )
}
