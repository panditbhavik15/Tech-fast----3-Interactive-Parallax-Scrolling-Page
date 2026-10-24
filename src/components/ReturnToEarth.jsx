import { useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import StarField from './StarField'
import { useParallax, useReveal } from '../hooks/useSceneMotion'
import usePointerDepth from '../hooks/usePointerDepth'
import { goToSection } from '../lib/motion'
import { SECTIONS } from '../lib/sections'

function Horizon() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 1440 460"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="return-limb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9b7bff" stopOpacity="0.35" />
          <stop offset="45%" stopColor="#bfefff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#35e0ff" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="return-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1a3c" />
          <stop offset="100%" stopColor="#03050c" />
        </linearGradient>
        <filter id="return-glow" x="-20%" y="-60%" width="140%" height="240%">
          <feGaussianBlur stdDeviation="9" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path d="M-60 460 C 260 232 1180 232 1500 460 Z" fill="url(#return-body)" />
      <path
        d="M-60 460 C 260 232 1180 232 1500 460"
        fill="none"
        stroke="url(#return-limb)"
        strokeWidth="2.5"
        filter="url(#return-glow)"
      />
      <path
        d="M-60 500 C 260 268 1180 268 1500 500"
        fill="none"
        stroke="#35e0ff"
        strokeOpacity="0.16"
        strokeWidth="30"
      />
    </svg>
  )
}

export default function ReturnToEarth() {
  const scopeRef = useRef(null)

  useParallax(scopeRef, { start: 'top bottom', end: 'bottom 85%' })
  useReveal(scopeRef)
  usePointerDepth(scopeRef, { shiftX: 20, shiftY: 13 })

  return (
    <section
      id="return"
      ref={scopeRef}
      tabIndex={-1}
      aria-labelledby="return-title"
      className="relative isolate flex scene-tall flex-col overflow-hidden bg-[radial-gradient(120%_90%_at_50%_120%,#0a1330_0%,#04060f_58%,#02030a_100%)] outline-none"
    >
      <div className="pointer-events-none absolute left-[-6%] right-[-6%] top-[-30%] h-[160%]" data-parallax="y:130" aria-hidden="true">
        <div className="absolute inset-0" data-depth="0.18">
          <StarField count={90} seed={31} minRadius={0.4} maxRadius={1.2} opacity={0.45} />
        </div>
      </div>
      <div className="pointer-events-none absolute left-[-8%] right-[-8%] top-[-24%] h-[150%]" data-parallax="y:58 x:22" aria-hidden="true">
        <div className="absolute inset-0" data-depth="0.55">
          <StarField count={22} seed={77} minRadius={1.1} maxRadius={2.4} opacity={0.85} twinkleEvery={6} color="#e7f0ff" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-[-6%] bottom-0 h-[54vh]" data-parallax="y:70" aria-hidden="true">
        <div className="h-full w-full" data-depth="0.9">
          <Horizon />
        </div>
      </div>

      <div className="shell relative z-10 flex flex-1 flex-col justify-center pt-36 pb-40 sm:pt-44">
        <div className="max-w-[44rem] lg:ml-[8%]">
          <p className="kicker text-violet" data-reveal>
            Mission 05 — return
          </p>
          <h2 id="return-title" className="type-section mt-6 font-semibold text-white" data-reveal>
            Every journey changes
            <br />
            your perspective.
          </h2>
          <p className="type-lead mt-8 max-w-[32rem] text-ink-soft" data-reveal>
            The same coastline, the same weather, the same ordinary morning — seen now from far enough away to look
            fragile.
          </p>
          {/* deliberately outside a reveal wrapper: autoAlpha hides with visibility, which would
              take the button out of the tab order until the scene had already been scrolled to */}
          <div className="mt-11">
            <button
              type="button"
              onClick={() => goToSection('launch')}
              className="btn-journey btn-journey--ghost"
            >
              Back to launch
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <footer className="relative z-10 border-t border-white/10 bg-void/70">
        <div className="shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="3.4" fill="#35e0ff" />
              <ellipse
                cx="12"
                cy="12"
                rx="10"
                ry="4.4"
                fill="none"
                stroke="#9b7bff"
                strokeWidth="1.1"
                transform="rotate(-28 12 12)"
              />
            </svg>
            <p className="text-[0.8rem] uppercase tracking-[0.28em] text-white">
              Orbit <span className="text-ink-faint">— A Journey Beyond Earth</span>
            </p>
          </div>

          <nav aria-label="Footer" className="-mx-1 flex flex-wrap gap-x-1">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="inline-flex min-h-[44px] items-center px-3 text-[0.8rem] text-ink-soft transition-colors hover:text-white"
              >
                {section.nav}
              </a>
            ))}
          </nav>
        </div>
        <div className="shell pb-8">
          <p className="font-mono text-[0.7rem] tracking-[0.08em] text-ink-faint">
            Interactive parallax study · React, Vite, Tailwind CSS, GSAP ScrollTrigger
          </p>
        </div>
      </footer>
    </section>
  )
}
