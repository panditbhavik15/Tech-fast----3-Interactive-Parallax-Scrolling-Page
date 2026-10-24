import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Menu, Pause, Play, X } from 'lucide-react'
import { SECTIONS } from '../lib/sections'
import useMotionPreference from '../hooks/useMotionPreference'

gsap.registerPlugin(ScrollTrigger)

function Wordmark() {
  return (
    <a
      href="#launch"
      className="group flex min-h-[44px] items-center gap-2.5 py-2 text-white"
      aria-label="ORBIT — back to the launch scene"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="3.6" fill="currentColor" className="text-cyan" />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          className="text-violet"
          transform="rotate(-28 12 12)"
        />
      </svg>
      <span className="text-[0.95rem] font-semibold uppercase tracking-[0.42em]">Orbit</span>
    </a>
  )
}

function MotionSwitch({ allowed, toggle, className }) {
  const Icon = allowed ? Play : Pause
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={allowed}
      className={`inline-flex min-h-[44px] items-center gap-2.5 rounded-full border px-3.5 text-[0.7rem] uppercase tracking-[0.16em] transition-colors duration-300 sm:px-4 ${
        allowed
          ? 'border-cyan/50 text-white hover:border-cyan'
          : 'border-white/20 text-ink-soft hover:border-white/45 hover:text-white'
      } ${className || ''}`}
    >
      <Icon size={14} aria-hidden="true" />
      {/* icon only on the narrowest screens, words from 400px up */}
      <span className="sr-only min-[400px]:hidden">Motion {allowed ? 'on' : 'off'}</span>
      <span className="hidden min-[400px]:inline">Motion {allowed ? 'on' : 'off'}</span>
      <span className={`h-1.5 w-1.5 rounded-full ${allowed ? 'bg-cyan' : 'bg-white/25'}`} aria-hidden="true" />
    </button>
  )
}

export default function Nav({ activeId }) {
  const rootRef = useRef(null)
  const barRef = useRef(null)
  const [open, setOpen] = useState(false)
  const { allowed, toggle } = useMotionPreference()

  /* Scroll progress: a lag-free 1:1 mapping, softened by a short scrub while animated.
     `scrub: false` would turn this into a toggle trigger, so the line would sit empty for
     a reduced-motion visitor — the bar has to track real scroll in both versions. */
  useLayoutEffect(() => {
    if (!barRef.current) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: allowed ? 0.2 : true,
          },
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [allowed])

  /* The header's solid backing is written straight onto the element — a scroll event must
     never cost a React render. The current class is the state, so nothing can desync. */
  useLayoutEffect(() => {
    const header = rootRef.current
    if (!header) return undefined
    const onScroll = () => {
      const solid = window.scrollY > 24
      if (header.classList.contains('site-header--solid') === solid) return
      header.classList.toggle('site-header--solid', solid)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close on Escape; a plain <a> menu keeps native anchor scrolling. */
  useLayoutEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <header
        ref={rootRef}
        className="site-header fixed inset-x-0 top-0 z-50"
      >
        <nav aria-label="Journey sections" className="shell flex h-[4.5rem] items-center justify-between gap-4">
          <Wordmark />

          <ul className="hidden items-center gap-1 lg:flex">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={activeId === section.id ? 'true' : undefined}
                  className={`relative block min-h-[44px] px-3.5 py-3 text-[0.78rem] uppercase tracking-[0.16em] transition-colors duration-300 ${
                    activeId === section.id ? 'text-white' : 'text-ink-soft hover:text-white'
                  }`}
                >
                  {section.nav}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3.5 bottom-2 h-px origin-left bg-cyan transition-transform duration-300 ${
                      activeId === section.id ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <MotionSwitch allowed={allowed} toggle={toggle} />

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:border-cyan/70 lg:hidden"
            >
              <span className="sr-only">{open ? 'Close navigation' : 'Open navigation'}</span>
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </nav>

        <div className="relative h-px w-full bg-white/10" aria-hidden="true">
          <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-cyan via-violet to-cyan" />
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-[4.5rem] z-40 border-b border-white/10 bg-abyss/95 backdrop-blur-lg lg:hidden"
      >
        <ul className="shell flex flex-col pb-4 pt-3">
          {SECTIONS.map((section) => (
            <li key={section.id} className="border-b border-white/5 last:border-0">
              <a
                href={`#${section.id}`}
                onClick={() => setOpen(false)}
                className="flex min-h-[52px] items-center justify-between gap-4 py-3 text-[0.95rem] uppercase tracking-[0.14em] text-ink transition-colors hover:text-white"
              >
                {section.nav}
                <span className="font-mono text-[0.7rem] normal-case tracking-normal text-ink-faint">
                  {section.marker}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
