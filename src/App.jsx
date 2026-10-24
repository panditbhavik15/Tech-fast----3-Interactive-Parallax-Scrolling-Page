import { useLayoutEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Nav from './components/Nav'
import JourneyRail from './components/JourneyRail'
import CursorProbe from './components/CursorProbe'
import Hero from './components/Hero'
import Atmosphere from './components/Atmosphere'
import OrbitalPlayground from './components/OrbitalPlayground'
import DeepSpace from './components/DeepSpace'
import ReturnToEarth from './components/ReturnToEarth'
import useMotionPreference from './hooks/useMotionPreference'
import { SECTIONS } from './lib/sections'

export default function App() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id)
  const { mode } = useMotionPreference()

  /* One observer feeds both the nav and the journey rail, so scrolling never
     triggers per-frame React work — it fires only when a scene takes over. */
  useLayoutEffect(() => {
    const nodes = SECTIONS.map((section) => document.getElementById(section.id)).filter(Boolean)
    if (!nodes.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          .slice(0, 1)
          .forEach((entry) => setActiveId(entry.target.id))
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.6] },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  /* Re-measure once late-loading paint (fonts, the SVG favicon) can change layout. */
  useLayoutEffect(() => {
    const refresh = () => ScrollTrigger.refresh()

    window.addEventListener('load', refresh)
    if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {})

    return () => window.removeEventListener('load', refresh)
  }, [])

  /* A motion flip rebuilds every scene, including the pinned one, so re-measure. */
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(frame)
  }, [mode])

  return (
    <div className="relative bg-void">
      <a
        href="#main"
        className="sr-only z-[60] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-full focus:border focus:border-cyan focus:bg-void focus:px-5 focus:py-3 focus:text-[0.8rem] focus:text-white"
      >
        Skip to content
      </a>

      <Nav activeId={activeId} />
      <JourneyRail activeId={activeId} />
      <CursorProbe />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Atmosphere />
        <OrbitalPlayground />
        <DeepSpace />
        <ReturnToEarth />
      </main>
    </div>
  )
}
