import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useMotionPreference from './useMotionPreference'

gsap.registerPlugin(ScrollTrigger)

const MOBILE_DAMPING = 0.5

/*
 * Convention for `data-parallax`:
 *   positive y  -> layer lags the page  -> reads as far away
 *   negative y  -> layer leads the page -> reads as close / foreground
 *   x           -> sideways drift, used sparingly on foreground scenery
 * Example: <div data-parallax="y:140 x:-24" aria-hidden="true" />
 */

function parseDeltas(raw) {
  const deltas = {}
  raw.split(/\s+/).forEach((pair) => {
    const [key, value] = pair.split(':')
    const number = Number.parseFloat(value)
    if (key && Number.isFinite(number)) deltas[key] = number
  })
  return deltas
}

export function useParallax(scopeRef, { start = 'top bottom', end = 'bottom top' } = {}) {
  const { allowed } = useMotionPreference()

  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope || !allowed) return undefined

    // short travel distances on phones: the same deltas read as a shove on a small screen
    const damp = (value) => (window.innerWidth < 768 ? value * MOBILE_DAMPING : value)

    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-parallax]', scope).forEach((node) => {
        const deltas = parseDeltas(node.dataset.parallax)
        const vars = { ease: 'none' }

        if (deltas.y !== undefined) vars.y = () => damp(deltas.y)
        if (deltas.x !== undefined) vars.x = () => damp(deltas.x)

        if (!('y' in vars) && !('x' in vars)) return

        vars.scrollTrigger = {
          trigger: scope,
          start,
          end,
          scrub: 0.6,
          invalidateOnRefresh: true,
        }

        gsap.to(node, vars)
      })
    }, scope)

    return () => ctx.revert()
  }, [allowed, scopeRef, start, end])
}

/*
 * Reveals are written as `from` tweens so the markup keeps its final visible state in the
 * document (and stays readable if GSAP never initialises); GSAP
 * only borrows the hidden state while it is running.
 */
export function useReveal(scopeRef) {
  const { allowed } = useMotionPreference()

  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope || !allowed) return undefined

    const ctx = gsap.context(() => {
      const groups = gsap.utils.toArray('[data-reveal-group]', scope)
      const singles = gsap
        .utils.toArray('[data-reveal]', scope)
        .filter((node) => !node.closest('[data-reveal-group]'))

      singles.forEach((node) => {
        gsap.from(node, {
          autoAlpha: 0,
          y: 26,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: node, start: 'top 86%' },
        })
      })

      groups.forEach((group) => {
        const items = Array.from(group.querySelectorAll('[data-reveal]'))
        if (!items.length) return
        gsap.from(items, {
          autoAlpha: 0,
          y: 30,
          duration: 0.85,
          ease: 'power2.out',
          stagger: Number.parseFloat(group.dataset.revealGroup || '0.14'),
          scrollTrigger: { trigger: group, start: 'top 82%' },
        })
      })
    }, scope)

    return () => ctx.revert()
  }, [allowed, scopeRef])
}
