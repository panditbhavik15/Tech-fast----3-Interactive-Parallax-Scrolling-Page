import { motionAllowed } from './motionStore'

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

export function isFinePointer() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(FINE_POINTER_QUERY).matches
}

/**
 * Anchor-style navigation for buttons. Keeps native scrolling (no hijacking) and
 * moves keyboard focus to the destination so screen readers follow the journey.
 */
export function goToSection(id) {
  const target = document.getElementById(id)
  if (!target) return

  const smooth = motionAllowed()
  target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })

  // an instant jump can be focused straight away; a smooth one needs to land first
  window.setTimeout(() => target.focus({ preventScroll: true }), smooth ? 340 : 0)
}
