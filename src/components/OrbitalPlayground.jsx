import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RotateCw, Satellite, Sunrise } from 'lucide-react'
import StarField from './StarField'
import usePointerDepth from '../hooks/usePointerDepth'
import useMotionPreference from '../hooks/useMotionPreference'

gsap.registerPlugin(ScrollTrigger)

const FACTS = [
  {
    icon: Satellite,
    title: 'Orbit is falling with style',
    body: 'At 400 km a spacecraft crosses 7.8 km every second — fast enough that the ground curves away as quickly as it falls.',
  },
  {
    icon: RotateCw,
    title: 'Space still has friction',
    body: 'The thermosphere tugs at everything that moves through it, so low satellites need regular boosts to hold their height.',
  },
  {
    icon: Sunrise,
    title: 'Ninety minutes per sunrise',
    body: 'A crew in low orbit watches sixteen sunrises and sixteen sunsets before their day is done.',
  },
]

const CENTER = 310

function OrbitDiagram() {
  return (
    <svg
      viewBox="0 0 620 620"
      className="h-full w-full"
      role="img"
      aria-label="Diagram of three spacecraft in circular orbit around Earth"
    >
      <defs>
        <radialGradient id="earth-body" cx="36%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#2a6fa8" />
          <stop offset="45%" stopColor="#13406f" />
          <stop offset="100%" stopColor="#061530" />
        </radialGradient>
        <linearGradient id="earth-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7ce9ff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#9b7bff" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="rgba(196,214,240,0.18)" strokeDasharray="2 7" strokeLinecap="round">
        <circle cx={CENTER} cy={CENTER} r="140" />
        <circle cx={CENTER} cy={CENTER} r="205" />
        <circle cx={CENTER} cy={CENTER} r="268" />
      </g>

      {/* orbital progress marker, drawn as the scene scrolls */}
      <circle
        data-orbit-progress
        cx={CENTER}
        cy={CENTER}
        r="268"
        fill="none"
        stroke="url(#earth-light)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="1684"
        strokeDashoffset="1684"
        transform={`rotate(-90 ${CENTER} ${CENTER})`}
      />

      <circle cx={CENTER} cy={CENTER} r="88" fill="url(#earth-body)" />
      <g fill="#0d4a70" opacity="0.42">
        <path d="M258 268c30-16 60-6 82 10s14 40-8 52-58 8-74-8-20-42 0-54Z" />
        <path d="M312 348c24-6 46 8 44 26s-30 28-52 20-24-38-8-46Z" />
        <ellipse cx="286" cy="240" rx="26" ry="10" />
      </g>
      <circle cx={CENTER} cy={CENTER} r="88" fill="none" stroke="#35e0ff" strokeOpacity="0.32" strokeWidth="1.2" />
      <path d="M310 222a88 88 0 0 1 0 176" fill="none" stroke="#9b7bff" strokeOpacity="0.5" strokeWidth="2" />

      {/* inner orbit: satellite */}
      <g data-orbit="1">
        <g transform={`translate(${CENTER + 140} ${CENTER})`}>
          <rect x="-9" y="-6" width="18" height="12" rx="2" fill="#c9d8f2" />
          <rect x="-31" y="-3" width="18" height="6" rx="1" fill="#35e0ff" opacity="0.8" />
          <rect x="13" y="-3" width="18" height="6" rx="1" fill="#35e0ff" opacity="0.8" />
        </g>
      </g>

      {/* middle orbit: station */}
      <g data-orbit="2">
        <g transform={`translate(${CENTER} ${CENTER - 205}) rotate(140)`}>
          <circle r="15" fill="none" stroke="#e6eeff" strokeWidth="3" />
          <circle r="15" fill="none" stroke="#9b7bff" strokeWidth="3" strokeDasharray="14 80" />
          <rect x="-34" y="-2" width="68" height="4" rx="2" fill="#c9d8f2" opacity="0.75" />
        </g>
      </g>

      {/* outer orbit: probe + marker body */}
      <g data-orbit="3">
        <g transform={`translate(${CENTER - 190} ${CENTER + 190}) rotate(-30)`}>
          <path d="M0 0 l14 -8 v16 Z" fill="#e6eeff" />
          <rect x="-14" y="-4" width="14" height="8" rx="2" fill="#8fa4c8" />
          <path d="M-14 0 l-16 -10 v20 Z" fill="#35e0ff" opacity="0.55" />
        </g>
      </g>
      <g data-orbit="3b">
        <g transform={`translate(${CENTER + 190} ${CENTER - 190})`}>
          <circle r="3.4" fill="#ffffff" />
          <circle r="9" fill="none" stroke="#35e0ff" strokeOpacity="0.5" />
        </g>
      </g>
    </svg>
  )
}

export default function OrbitalPlayground() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const { allowed } = useMotionPreference()

  usePointerDepth(sectionRef, { shiftX: 24, shiftY: 16 })

  useLayoutEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage || !allowed) return undefined

    const mm = gsap.matchMedia()
    const orbits = () => ({
      1: { rotation: 210 },
      2: { rotation: 132 },
      3: { rotation: 74 },
      '3b': { rotation: 46 },
    })

    /* Desktop with room to spare: a short pinned scene — scroll drives the orbits and reveals each fact.
       The scene needs ~694px of height at its tightest (1024px wide), so a shorter window gets the
       unpinned flow rather than a pinned stage with the last fact clipped off-screen. */
    mm.add('(min-width: 1024px) and (min-height: 700px)', () => {
      const ctx = gsap.context(() => {
        gsap.set('[data-fact]', { autoAlpha: 0, y: 24 })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: '+=115%',
            pin: true,
            anticipatePin: 1,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })

        const spins = orbits()
        Object.entries(spins).forEach(([key, vars]) => {
          tl.to(`[data-orbit="${key}"]`, { ...vars, svgOrigin: `${CENTER} ${CENTER}` }, 0)
        })

        tl.to('[data-orbit-progress]', { strokeDashoffset: 0 }, 0)
          .to('[data-scene="dust"]', { y: -64 }, 0)
          .to('[data-scene="stars-far"]', { y: 44 }, 0)
          .to('[data-scene="glow"]', { scale: 1.07 }, 0)

        gsap.utils.toArray('[data-fact]').forEach((fact, index) => {
          tl.to(fact, { autoAlpha: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.12 + index * 0.27)
        })

        tl.to('.orbital-copy', { y: -16, duration: 0.35, ease: 'power1.inOut' }, 0.6)
      }, section)

      return () => ctx.revert()
    })

    /* Everything else: identical content, unpinned, orbits drift with normal scrolling. */
    mm.add('(max-width: 1023.98px), (max-height: 699.98px)', () => {
      const ctx = gsap.context(() => {
        const scroll = {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true,
        }

        Object.entries(orbits()).forEach(([key, vars]) => {
          gsap.to(`[data-orbit="${key}"]`, {
            ...vars,
            svgOrigin: `${CENTER} ${CENTER}`,
            ease: 'none',
            scrollTrigger: scroll,
          })
        })

        gsap.to('[data-orbit-progress]', { strokeDashoffset: 0, ease: 'none', scrollTrigger: scroll })

        gsap.from('[data-fact]', {
          autoAlpha: 0,
          y: 26,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.14,
          scrollTrigger: { trigger: '[data-fact-list]', start: 'top 84%' },
        })

        gsap.from('[data-reveal-orbital]', {
          autoAlpha: 0,
          y: 24,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: { trigger: section, start: 'top 76%' },
        })
      }, section)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [allowed])

  return (
    <section
      id="orbital"
      ref={sectionRef}
      tabIndex={-1}
      aria-labelledby="orbital-title"
      className="relative isolate outline-none"
    >
      <div
        ref={stageRef}
        className="relative flex scene-full items-center overflow-hidden bg-[radial-gradient(110%_85%_at_50%_50%,#081333_0%,#04060f_72%)] py-24 sm:py-16 lg:py-10"
      >
        <div
          data-scene="stars-far"
          className="pointer-events-none absolute left-[-6%] right-[-6%] top-[-40%] h-[180%]"
          aria-hidden="true"
        >
          <div className="absolute inset-0" data-depth="0.15">
            <StarField count={110} seed={53} minRadius={0.4} maxRadius={1.4} opacity={0.5} />
          </div>
        </div>

        <div
          data-scene="dust"
          className="pointer-events-none absolute left-[-8%] right-[-8%] top-[-30%] h-[160%]"
          aria-hidden="true"
        >
          <div className="absolute inset-0" data-depth="0.3">
            <StarField count={38} seed={91} minRadius={1} maxRadius={2.2} opacity={0.8} twinkleEvery={7} />
          </div>
        </div>

        <div
          data-scene="glow"
          className="pointer-events-none absolute inset-0 m-auto h-[56vh] w-[56vh] rounded-full bg-[radial-gradient(circle,rgba(53,224,255,0.15),transparent_66%)]"
          aria-hidden="true"
        />

        <div className="shell relative z-10 w-full">
          <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-14">
            <header className="orbital-copy order-1 lg:col-span-6 lg:col-start-1 lg:row-start-1">
              <p className="kicker text-violet" data-reveal-orbital>
                Mission 03 — orbit
              </p>
              <h2 id="orbital-title" className="type-section mt-5 font-semibold text-white" data-reveal-orbital>
                Falling,
                <br />
                endlessly.
              </h2>
            </header>

            <div
              data-depth="1"
              className="order-2 mx-auto aspect-square w-full max-w-[330px] sm:max-w-[400px] lg:col-span-6 lg:col-start-7 lg:row-span-3 lg:row-start-1 lg:max-w-none"
            >
              <OrbitDiagram />
            </div>

            <ul
              data-fact-list
              className="order-3 mt-2 space-y-8 lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:mt-6 lg:space-y-6"
            >
              {FACTS.map((fact) => {
                const Icon = fact.icon
                return (
                  <li key={fact.title} data-fact className="flex max-w-[30rem] gap-5">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-cyan">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-[1.02rem] font-semibold leading-snug text-white">{fact.title}</h3>
                      <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">{fact.body}</p>
                    </div>
                  </li>
                )
              })}
            </ul>

            <p className="order-4 font-mono text-[0.7rem] tracking-[0.1em] text-ink-faint lg:col-span-6 lg:col-start-1 lg:row-start-3 lg:mt-6">
              Keep scrolling — the orbits follow.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
