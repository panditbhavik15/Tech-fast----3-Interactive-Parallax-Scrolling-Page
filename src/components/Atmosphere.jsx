import { useRef } from 'react'
import { Wind } from 'lucide-react'
import StarField from './StarField'
import { useParallax, useReveal } from '../hooks/useSceneMotion'
import usePointerDepth from '../hooks/usePointerDepth'

const ALTITUDES = [
  { value: '12 km', label: 'Tropopause' },
  { value: '50 km', label: 'Stratopause' },
  { value: '100 km', label: 'Kármán line' },
]

function Wisp({ className }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute rounded-[100%] bg-[radial-gradient(closest-side,rgba(196,218,255,0.22),transparent)] ${className}`}
    />
  )
}

export default function Atmosphere() {
  const scopeRef = useRef(null)

  useParallax(scopeRef, { start: 'top bottom', end: 'bottom top' })
  useReveal(scopeRef)
  usePointerDepth(scopeRef, { shiftX: 18, shiftY: 12 })

  return (
    <section
      id="atmosphere"
      ref={scopeRef}
      tabIndex={-1}
      aria-labelledby="atmosphere-title"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#03050c_0%,#071238_34%,#0a1a44_64%,#050b1e_100%)] outline-none"
    >
      {/* four depth layers: high stars, two haze bands, foreground wisps that drift sideways */}
      <div className="pointer-events-none absolute left-[-6%] right-[-6%] top-[-20%] h-[140%]" data-parallax="y:150" aria-hidden="true">
        <div className="absolute inset-0" data-depth="0.2">
          <StarField count={54} seed={7} minRadius={0.4} maxRadius={1.3} opacity={0.4} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0" data-parallax="y:64 x:26" aria-hidden="true">
        <div className="absolute inset-0" data-depth="0.4">
          <Wisp className="left-[6%] top-[16%] h-[210px] w-[70%] opacity-60" />
          <Wisp className="right-[4%] top-[44%] h-[170px] w-[58%] opacity-40" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-[-8%]" data-parallax="y:-46 x:70" aria-hidden="true">
        <div className="absolute inset-0" data-depth="0.75">
          <Wisp className="left-[-8%] top-[30%] h-[240px] w-[86%] opacity-70" />
          <Wisp className="right-[-12%] top-[66%] h-[200px] w-[78%] opacity-55" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-[-10%] bottom-[-10%] h-[40vh]" data-parallax="y:-165 x:-120" aria-hidden="true">
        <div className="absolute inset-0" data-depth="1.2">
          <Wisp className="left-[2%] top-[20%] h-[260px] w-[110%] opacity-90" />
        </div>
      </div>

      <div className="shell relative z-10 pb-40 pt-32 sm:pb-52 sm:pt-40">
        <div className="grid gap-x-14 lg:grid-cols-12">
          {/* altitude scale */}
          <aside className="relative order-2 lg:order-1 lg:col-span-3 lg:pt-40" data-reveal-group="0.18">
            <span
              className="absolute left-[5px] top-10 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-cyan/60 via-white/15 to-transparent lg:block"
              aria-hidden="true"
            />
            <ul className="mt-8 space-y-10 lg:mt-0 lg:space-y-24">
              {ALTITUDES.map((item) => (
                <li key={item.value} className="relative flex items-baseline gap-4 lg:pl-8" data-reveal>
                  <span className="absolute left-0 top-[7px] hidden h-[11px] w-[11px] rounded-full border border-cyan/70 bg-void lg:block" aria-hidden="true" />
                  <span className="font-mono text-[0.9rem] text-white">{item.value}</span>
                  <span className="text-[0.78rem] uppercase tracking-[0.16em] text-ink-faint">{item.label}</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* copy column, deliberately offset to the right */}
          <div className="order-1 lg:order-2 lg:col-span-8 lg:col-start-5">
            <p className="kicker flex items-center gap-3 text-cyan" data-reveal>
              <Wind size={14} aria-hidden="true" />
              Mission 02 — the air
            </p>

            <h2 id="atmosphere-title" className="type-section mt-5 font-semibold text-white" data-reveal>
              Thicker than
              <br />
              it looks.
            </h2>

            <div className="mt-9 max-w-[38rem] space-y-6" data-reveal-group="0.2">
              <p className="type-body text-ink" data-reveal>
                Twelve kilometres up, the sky has already handed most of its weight back to the ground. The blue
                deepens, the light turns cold, and the weather you walked through this morning is a thin skin beneath
                you.
              </p>
              <p className="type-body text-ink-soft" data-reveal>
                Fifty kilometres further, colour gives out. The sun stops diffusing and starts simply shining — one
                bare bulb in a darkening room.
              </p>
            </div>

            {/* the Kármán line, crossed as you scroll */}
            <div className="mt-24 sm:mt-36" data-reveal-group="0.16">
              <div className="relative" data-reveal>
                <div className="border-t border-dashed border-cyan/60" aria-hidden="true" />
                <span className="absolute right-0 -top-3 bg-abyss/80 px-3 font-mono text-[0.7rem] tracking-[0.12em] text-cyan">
                  100 km
                </span>
              </div>
              <p className="type-lead mt-8 max-w-[34rem] text-white" data-reveal>
                At the Kármán line the atmosphere stops being a place you fly through and becomes a memory.
              </p>
              <p className="mt-4 max-w-[30rem] text-[0.85rem] leading-relaxed text-ink-faint" data-reveal>
                Nothing changes abruptly up here — the air just forgets how to hold you.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-void" aria-hidden="true" />
    </section>
  )
}
