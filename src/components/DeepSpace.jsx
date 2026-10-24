import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Moon, Orbit, RadioTower } from 'lucide-react'
import StarField from './StarField'
import { useParallax, useReveal } from '../hooks/useSceneMotion'
import usePointerDepth from '../hooks/usePointerDepth'
import useMotionPreference from '../hooks/useMotionPreference'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  {
    index: '01',
    icon: Moon,
    title: 'The farside',
    body: 'The far face of the Moon never points at us, so a relay satellite has to carry every message around the curve.',
    stat: '384,400 km',
    accent: 'cyan',
    layout: 'lg:col-span-5 lg:col-start-1 lg:row-start-1',
    from: { y: 46 },
  },
  {
    index: '02',
    icon: Orbit,
    title: 'Gravitational parking',
    body: 'Five Lagrange points let a spacecraft hold a position between two bodies with almost no fuel spent.',
    stat: '1.5 million km · L2',
    accent: 'violet',
    layout: 'lg:col-span-4 lg:col-start-8 lg:row-start-1 lg:mt-20',
    from: { x: -44, y: 14 },
  },
  {
    index: '03',
    icon: RadioTower,
    title: 'The long dark',
    body: 'Past the heliopause the sun is simply the brightest star in the sky, and a reply takes most of a day to arrive.',
    stat: '24 billion km · Voyager 1',
    accent: 'white',
    layout: 'lg:col-span-6 lg:col-start-3 lg:row-start-2 lg:mt-6',
    from: { y: 60 },
  },
]

const ACCENTS = {
  cyan: { text: 'text-cyan', ring: 'group-hover:border-cyan/45', glow: 'bg-cyan' },
  violet: { text: 'text-violet', ring: 'group-hover:border-violet/45', glow: 'bg-violet' },
  white: { text: 'text-white', ring: 'group-hover:border-white/40', glow: 'bg-white/70' },
}

export default function DeepSpace() {
  const scopeRef = useRef(null)
  const { allowed } = useMotionPreference()

  useParallax(scopeRef)
  useReveal(scopeRef)
  usePointerDepth(scopeRef, { shiftX: 22, shiftY: 15 })

  /* Each card enters on its own axis so the grid never feels like a stamping press. */
  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope || !allowed) return undefined

    const ctx = gsap.context(() => {
      gsap.from('[data-nebula="a"]', {
        xPercent: -6,
        duration: 1.4,
        ease: 'power1.out',
        scrollTrigger: { trigger: scope, start: 'top 75%', end: 'center center', scrub: 0.8 },
      })

      CARDS.forEach((card) => {
        const node = scope.querySelector(`[data-card="${card.index}"]`)
        if (!node) return
        gsap.from(node, {
          ...card.from,
          autoAlpha: 0,
          duration: 0.95,
          ease: 'power2.out',
          // hand the transform back to CSS so the hover lift still works
          onComplete: () => gsap.set(node, { clearProps: 'all' }),
          scrollTrigger: { trigger: node, start: 'top 90%' },
        })
      })
    }, scope)

    return () => ctx.revert()
  }, [allowed])

  return (
    <section
      id="deep-space"
      ref={scopeRef}
      tabIndex={-1}
      aria-labelledby="deep-space-title"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#03050c_0%,#060517_45%,#04060f_100%)] outline-none"
    >
      {/* nebula — two clouds at different speeds, text stays put above them */}
      <div
        data-nebula="a"
        className="pointer-events-none absolute left-[-24%] top-[6%] h-[80vh] w-[110vw]"
        data-parallax="y:120 x:40"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(155,123,255,0.2),transparent_70%)]"
          data-depth="0.28"
        />
      </div>
      <div
        data-nebula="b"
        className="pointer-events-none absolute right-[-20%] top-[42%] h-[70vh] w-[92vw]"
        data-parallax="y:-70 x:-56"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(53,224,255,0.15),transparent_68%)]"
          data-depth="0.5"
        />
      </div>

      {/* two meteors, hours apart in the loop — the only unrequested thing down here */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="meteor left-[62%] top-[14%]" style={{ animationDelay: '4s' }} />
        <span className="meteor left-[38%] top-[58%]" style={{ animationDelay: '12.5s', width: '110px' }} />
      </div>

      <div className="pointer-events-none absolute left-[-6%] right-[-6%] top-[-30%] h-[160%]" data-parallax="y:150" aria-hidden="true">
        <div className="absolute inset-0" data-depth="0.15">
          <StarField count={140} seed={17} minRadius={0.4} maxRadius={1.3} opacity={0.55} />
        </div>
      </div>
      <div className="pointer-events-none absolute left-[-8%] right-[-8%] top-[-22%] h-[144%]" data-parallax="y:56 x:-30" aria-hidden="true">
        <div className="absolute inset-0" data-depth="0.6">
          <StarField count={30} seed={63} minRadius={1.2} maxRadius={2.6} opacity={0.9} twinkleEvery={5} color="#dbe7ff" />
        </div>
      </div>

      <div className="shell relative z-10 py-32 sm:py-40">
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="kicker flex items-center gap-3 text-cyan" data-reveal>
              <span className="font-mono tracking-normal text-ink-faint" aria-hidden="true">
                04
              </span>
              Mission 04 — deep space
            </p>
            <h2 id="deep-space-title" className="type-section mt-5 font-semibold text-white" data-reveal>
              The part
              <br />
              with no sound.
            </h2>
          </div>
          <p className="type-body max-w-[26rem] self-end text-ink-soft lg:col-span-4 lg:col-start-9" data-reveal>
            Out here, distance stops being a number you can feel. Three places worth looking at, and none of them
            waiting for you.
          </p>
        </div>

        <div className="mt-20 grid gap-6 sm:mt-24 lg:grid-cols-12 lg:gap-y-14">
          {CARDS.map((card) => {
            const Icon = card.icon
            const accent = ACCENTS[card.accent]
            return (
              <article
                key={card.index}
                data-card={card.index}
                className={`group relative flex flex-col justify-between gap-10 overflow-hidden rounded-2xl border border-white/10 bg-abyss/55 p-6 backdrop-blur-[2px] transition-all duration-500 hover:-translate-y-1 sm:p-8 ${card.layout} ${accent.ring}`}
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-white/50 to-transparent transition-transform duration-500 group-hover:scale-x-100"
                />
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className={`font-mono text-[0.72rem] tracking-[0.2em] ${accent.text}`}>
                      {card.index}
                    </span>
                    <Icon size={18} className={`${accent.text} opacity-70 transition-opacity duration-500 group-hover:opacity-100`} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-[1.3rem] font-semibold leading-tight text-white sm:text-[1.45rem]">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-[24rem] text-[0.92rem] leading-relaxed text-ink-soft">{card.body}</p>
                </div>
                <p className="flex items-center gap-3 font-mono text-[0.74rem] tracking-[0.1em] text-ink-faint">
                  <span className={`h-1.5 w-1.5 rounded-full ${accent.glow}`} aria-hidden="true" />
                  {card.stat}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
