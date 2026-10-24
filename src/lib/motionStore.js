const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'

/*
 * Single source of truth for motion.
 *   forced === null  -> follow the operating system (the honest default)
 *   true / false     -> the visitor overrode it with the in-page Motion switch
 * Nothing else may decide whether animation runs.
 */
let forced = null
const listeners = new Set()

function emit() {
  listeners.forEach((fn) => fn())
}

function osPrefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(REDUCE_QUERY).matches
}

export function motionAllowed() {
  return forced === null ? !osPrefersReducedMotion() : forced
}

/** The raw setting, for interface copy: auto | on | off. */
export function motionMode() {
  return forced === null ? 'auto' : forced ? 'on' : 'off'
}

/**
 * Mirrors the *resolved* decision onto <html data-motion="on | still"> so the CSS loops and the
 * GSAP timelines read the same answer, and so a live change of the system setting repaints too.
 */
function applyMotionAttribute() {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.motion = motionAllowed() ? 'on' : 'still'
}

function setForcedMotion(value) {
  forced = value
  applyMotionAttribute()
  emit()
}

export function toggleMotion() {
  setForcedMotion(!motionAllowed())
}

export function subscribeMotion(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

if (typeof window !== 'undefined' && window.matchMedia) {
  applyMotionAttribute()
  const mq = window.matchMedia(REDUCE_QUERY)
  const onChange = () => {
    applyMotionAttribute()
    emit()
  }
  if (mq.addEventListener) mq.addEventListener('change', onChange)
  else mq.addListener(onChange)
}
