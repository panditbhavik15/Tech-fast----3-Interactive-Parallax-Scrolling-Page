import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, Play } from 'lucide-react'
import StarField from './StarField'
import { useParallax } from '../hooks/useSceneMotion'
import usePointerDepth from '../hooks/usePointerDepth'
import useMotionPreference from '../hooks/useMotionPreference'
import { goToSection } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

function RidgeSilhouette() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 1440 400"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="ridge-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070c1c" />
          <stop offset="100%" stopColor="#02030a" />
        </linearGradient>
      </defs>
      <path
        d="M0 296 C 190 252 330 300 520 272 C 700 246 840 300 1010 268 C 1180 236 1320 286 1440 252 L1440 400 L0 400 Z"
        fill="url(#ridge-fill)"
      />
      {/* launch tower */}
      <g stroke="#04060f" strokeWidth="6" fill="none">
        <path d="M1168 88 V272 M1216 88 V272" />
        <path d="M1168 268 L1216 232 M1168 232 L1216 196 M1168 196 L1216 160 M1168 160 L1216 124 M1168 124 L1216 88" />
      </g>
      <path d="M1148 78 H1236 V92 H1148 Z" fill="#04060f" />
      <path d="M1216 120 H1284" stroke="#04060f" strokeWidth="5" />
      <circle cx="1192" cy="66" r="4" fill="#35e0ff" opacity="0.55" />
    </svg>
  )
}

function DistantPlanet() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 900 620"
      preserveAspectRatio="xMinYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="planet-body" cx="34%" cy="26%" r="86%">
          <stop offset="0%" stopColor="#1d3f6b" />
          <stop offset="52%" stopColor="#0d1c3a" />
          <stop offset="100%" stopColor="#05081a" />
        </radialGradient>
        <linearGradient id="planet-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7ce9ff" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#35e0ff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#9b7bff" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <circle cx="180" cy="520" r="440" fill="url(#planet-body)" />
      <circle cx="180" cy="520" r="440" fill="none" stroke="url(#planet-rim)" strokeWidth="3" />
      <g fill="#0b2246" opacity="0.5">
        <ellipse cx="60" cy="360" rx="150" ry="34" />
        <ellipse cx="250" cy="440" rx="190" ry="28" />
      </g>
    </svg>
  )
}

export default function Hero() {
  const scopeRef = useRef(null)
  const rocketRef = useRef(null)
  const plumeRef = useRef(null)
  const { allowed, mode, toggle } = useMotionPreference()

  useParallax(scopeRef, { start: 'top top', end: 'bottom top' })
  usePointerDepth(scopeRef, { shiftX: 34, shiftY: 22 })

  /* Entrance + the little launch sequence — only while motion is allowed. */
  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope || !allowed) return undefined

    const ctx = gsap.context(() => {
      gsap.from('[data-hero-line]', {
        yPercent: 118,
        opacity: 0,
        duration: 1.15,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.15,
      })

      gsap.from('[data-hero-soft]', {
        autoAlpha: 0,
        y: 18,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.11,
        delay: 0.7,
      })

      // Rocket lifts away from the pad as the first 60% of the hero scrolls past.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: scope,
          start: 'top top',
          end: 'bottom 45%',
          scrub: 0.7,
        },
      })
      tl.to(rocketRef.current, { y: -340, x: 46, rotation: 4, scale: 0.82, ease: 'power1.in' }, 0).fromTo(
        plumeRef.current,
        { opacity: 0.15, scaleY: 0.35 },
        { opacity: 0.75, scaleY: 1.6, transformOrigin: 'top center' },
        0,
      )
    }, scope)

    return () => ctx.revert()
  }, [allowed])

  const begin = () => goToSection('atmosphere')

  return (
    <section
      id="launch"
      ref={scopeRef}
      tabIndex={-1}
      aria-labelledby="launch-title"
      className="relative isolate flex scene-full flex-col overflow-hidden bg-[radial-gradient(125%_85%_at_72%_-10%,#0d1a3d_0%,#060b1c_46%,#03050c_100%)] outline-none"
    >
      {/* depth layers, back to front — outer node carries the scroll parallax,
          inner node the cursor lean, so the two never write the same transform */}
      <div className="pointer-events-none absolute left-[-6%] right-[-6%] top-[-35%] h-[170%] will-soft" data-parallax="y:180" aria-hidden="true">
        <div className="absolute inset-0" data-depth="0.22">
          <StarField count={130} seed={11} minRadius={0.4} maxRadius={1.2} opacity={0.55} />
        </div>
      </div>

      <div className="pointer-events-none absolute left-[-8%] right-[-8%] top-[-30%] h-[160%] will-soft" data-parallax="y:110 x:18" aria-hidden="true">
        <div className="absolute inset-0" data-depth="0.45">
          <StarField count={72} seed={4} minRadius={0.7} maxRadius={1.8} opacity={0.8} twinkleEvery={11} />
        </div>
      </div>

      <div className="pointer-events-none absolute left-[-10%] right-[-10%] top-[-25%] h-[150%] will-soft" data-parallax="y:52 x:-26" aria-hidden="true">
        <div className="absolute inset-0" data-depth="0.8">
          <StarField count={24} seed={29} minRadius={1.3} maxRadius={2.6} opacity={0.95} twinkleEvery={4} />
        </div>
      </div>

      <div
        className="breathe pointer-events-none absolute -right-[18%] -top-[22%] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(circle,rgba(53,224,255,0.16),transparent_62%)]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute bottom-[-6%] left-0 h-[62vh] w-[86vw] sm:w-[68vw] will-soft"
        data-parallax="y:96 x:-34"
        aria-hidden="true"
      >
        <div className="absolute inset-0" data-depth="0.35">
          <DistantPlanet />
        </div>
      </div>

      {/* ascending rocket + exhaust */}
      <div
        ref={rocketRef}
        className="pointer-events-none absolute bottom-[22%] right-[16%] h-[130px] w-[34px] will-soft sm:right-[21%]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 34 130" className="h-full w-full" aria-hidden="true" focusable="false">
          <path d="M17 2 C 24 16 26 30 26 46 V84 H8 V46 C8 30 10 16 17 2 Z" fill="#0b1430" stroke="#35e0ff" strokeOpacity="0.45" strokeWidth="1" />
          <circle cx="17" cy="38" r="4.5" fill="#04060f" stroke="#9b7bff" strokeOpacity="0.8" strokeWidth="1.2" />
          <path d="M8 62 L0 92 H8 Z M26 62 L34 92 H26 Z" fill="#0b1430" stroke="#35e0ff" strokeOpacity="0.3" strokeWidth="1" />
        </svg>
        <div
          ref={plumeRef}
          className="absolute left-1/2 top-full -ml-[1.5px] h-[120px] w-[3px] bg-gradient-to-b from-cyan/80 via-violet/30 to-transparent"
        />
      </div>

      {/* ridge + launch tower: nearest layer, so it leads the scroll */}
      <div
        className="pointer-events-none absolute inset-x-[-4%] bottom-[-14%] h-[46vh] will-soft"
        data-parallax="y:-150 x:56"
        aria-hidden="true"
      >
        <div className="absolute inset-0" data-depth="1.15">
          <RidgeSilhouette />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void via-void/70 to-transparent" aria-hidden="true" />

      {/* copy */}
      <div className="shell relative z-10 flex flex-1 flex-col justify-end pb-28 pt-32 sm:pb-32">
        <div className="max-w-[46rem] lg:ml-[4%]">
          <p className="kicker flex items-center gap-3 text-cyan" data-hero-soft>
            <span className="inline-block h-[7px] w-[7px] rounded-full bg-cyan shadow-[0_0_12px_rgba(53,224,255,0.9)]" />
            Mission 01 — leave the ground
          </p>

          <h1 id="launch-title" className="type-display mt-6 overflow-hidden pb-2 font-semibold text-white">
            <span className="block" data-hero-line>
              Scroll beyond
            </span>
            <span className="block" data-hero-line>
              the ordinary.
            </span>
          </h1>

          <p className="type-lead mt-6 max-w-[34rem] text-ink-soft" data-hero-soft>
            A journey through motion, depth, and the unknown.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5" data-hero-soft>
            <button type="button" onClick={begin} className="btn-journey btn-journey--solid">
              Begin the journey
              <ArrowDown size={16} aria-hidden="true" />
            </button>
            <p className="font-mono text-[0.72rem] leading-relaxed tracking-[0.08em] text-ink-faint">
              T−00:00:12 · pad 39A · visibility clear
            </p>
          </div>

          {/* Only shown when the operating system is holding the scene still. */}
          {mode === 'auto' && !allowed ? (
            <div className="mt-9 max-w-[31rem] rounded-2xl border border-cyan/25 bg-cyan/[0.06] p-5">
              <p className="text-[0.85rem] leading-relaxed text-ink">
                Your system asks for reduced motion, so this page is standing still. Nothing is lost — the whole
                journey reads without it. You can also take the animation back.
              </p>
              <button
                type="button"
                onClick={toggle}
                className="mt-4 inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-cyan/50 px-4 text-[0.7rem] uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:border-cyan"
              >
                <Play size={14} aria-hidden="true" />
                Play the journey
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-8 right-6 z-10 flex items-end gap-4 sm:right-10 lg:right-28">
        <span className="hidden text-[0.65rem] uppercase tracking-ultra text-ink-faint sm:block [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="relative block h-16 w-px bg-white/20" aria-hidden="true">
          <span className="cue-dot absolute left-1/2 top-0 block h-2 w-2 -translate-x-1/2 rounded-full bg-cyan" />
        </span>
      </div>
    </section>
  )
}
