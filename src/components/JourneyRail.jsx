import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useMotionPreference from '../hooks/useMotionPreference'
import { SECTIONS } from '../lib/sections'

gsap.registerPlugin(ScrollTrigger)

/**
 * Journey rail — the memorable detail: an altitude marker that fills as you travel
 * from sea level to deep space. Purely indicative, so it is hidden from assistive tech.
 */
export default function JourneyRail({ activeId }) {
  const rootRef = useRef(null)
  const fillRef = useRef(null)
  const { allowed } = useMotionPreference()

  useLayoutEffect(() => {
    const fill = fillRef.current
    const root = rootRef.current
    if (!fill || !root) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            // 1:1 with scroll in the still version, so the altitude stays truthful either way
            scrub: allowed ? 0.2 : true,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [allowed])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed right-8 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative h-[19rem] w-24">
        <div className="absolute left-0 top-0 h-full w-px bg-white/12" />
        <div
          ref={fillRef}
          className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-cyan via-violet to-cyan/40"
        />

        <ul className="absolute inset-0 flex flex-col justify-between">
          {SECTIONS.map((section) => {
            const active = activeId === section.id
            return (
              <li key={section.id} className="relative flex items-center gap-3 pl-0">
                <span
                  className={`block h-[7px] w-[7px] -translate-x-[3.5px] rounded-full border transition-all duration-500 ${
                    active
                      ? 'scale-150 border-cyan bg-cyan shadow-[0_0_14px_rgba(53,224,255,0.75)]'
                      : 'border-white/30 bg-void'
                  }`}
                />
                <span
                  className={`flex flex-col leading-tight transition-opacity duration-500 ${
                    active ? 'opacity-100' : 'opacity-45'
                  }`}
                >
                  <span className="text-[0.68rem] uppercase tracking-[0.2em] text-white">{section.nav}</span>
                  <span className="font-mono text-[0.6rem] text-ink-faint">{section.marker}</span>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
