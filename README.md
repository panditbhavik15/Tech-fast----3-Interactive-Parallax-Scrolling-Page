# ORBIT — A Journey Beyond Earth

A cinematic parallax-scrolling page that carries you from a launch pad, through the
atmosphere, into low orbit, out to deep space, and back home. Five scenes, each with its
own composition, every one of them layered so that background, midground and foreground
travel at different speeds.

Built with **React + Vite**, **Tailwind CSS**, **GSAP / ScrollTrigger** and **Lucide React**.
No images, no remote services: every star, planet, ridge and orbit line is CSS gradient or
inline SVG, so the whole experience ships in the bundle.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle in dist/
npm run preview    # serve the built bundle locally
```

Requires Node 18 or newer.

---

## The five scenes

| Scene | Anchor | What moves |
| --- | --- | --- |
| Launch | `#launch` | Three star fields at different lag, a distant planet limb, a rocket that lifts off from the pad as the first 60% scrolls, and a foreground ridge + launch tower that leads the scroll |
| Atmosphere | `#atmosphere` | Four haze layers at four speeds, with a strong sideways drift on the nearest wisp; copy reveals in three beats up to the dashed Kármán line |
| Orbit | `#orbital` | Pinned where it fits (1024px wide and at least 700px tall, for 115% of one viewport): scroll rotates three orbits, draws the orbital progress ring, and reveals the facts. Everywhere else the same scene runs unpinned in a normal vertical flow |
| Deep space | `#deep-space` | Two nebula clouds, two star fields and the occasional meteor move underneath a card grid that stays perfectly still |
| Return | `#return` | Slowly lagging stars and an illuminated horizon that rises as the page ends |

---

## Controls

- **Wheel / trackpad, touch drag, arrow / PageUp / PageDown / Home / End, and anchor links** all behave
  natively — nothing hijacks or fakes the scroll.
- **Navigation** (top right, or the compact sheet under 1024px) jumps to each scene; the mobile sheet
  closes itself after a selection and on `Escape`.
- **“Begin the journey”** scrolls to *Atmosphere*; **“Back to launch”** returns to the hero. In the hero
  you may also see **“Play the journey”** — it only appears when your operating system is holding the
  page still, and it is the same control as the header switch.
- **Motion switch** (always in the header, `aria-pressed`) flips the whole site between *still* and
  *animated* without a reload: parallax, reveals, the pinned orbit scene, the meteors, the ambient loops
  and the cursor layer all rebuild or tear down around the choice. It starts on **auto**, meaning it
  follows your system's reduce-motion setting; the moment you touch it, your choice wins.
- **Journey rail** (desktop, right edge) is a read-only altitude marker: sea level → 100 km → 400 km →
  24 billion km → home. It fills as you travel and never intercepts clicks.
- **Cursor layer.** On a machine with a fine pointer, the decorative layers lean toward the cursor and a
  lagging ring + tight dot trail it, swelling over anything clickable. The native cursor stays visible,
  the layer is `pointer-events-none`, and it is purely texture: nothing on the page needs hovering,
  dragging or precise pointing to work.

---

## Animation approach

```
src/
├─ App.jsx                      scene observer, late ScrollTrigger.refresh()
├─ lib/motion.js                pointer/media queries + focus-aware anchor scrolling
├─ lib/motionStore.js           the one decision: is motion allowed right now?
├─ lib/random.js                seeded PRNG (identical star fields every render)
├─ lib/sections.js              one source of truth for nav, rail and footer
├─ hooks/useMotionPreference.js the store, exposed through useSyncExternalStore
├─ hooks/useSceneMotion.js      useParallax() + useReveal()
├─ hooks/usePointerDepth.js     [data-depth] lean toward the cursor
└─ components/                  Nav, JourneyRail, CursorProbe, StarField + five scenes
```

- **`lib/motionStore.js` is the single source of truth.** `forced === null` means “follow the operating
  system”, `true`/`false` means the visitor chose. Every hook reads it, and it mirrors the *resolved* state
  onto `<html data-motion="on|still">` so the CSS loops (twinkle, breathing glow, scroll cue, meteors) and
  the JS timelines can never disagree; the interface copy uses the raw setting (`auto | on | off`) instead.
  `index.html` sets that attribute with a two-line inline script before the first paint, so a reduced-motion
  visitor never sees an animated frame even if the bundle is slow — and if the bundle never boots at all, CSS
  falls back to `@media (prefers-reduced-motion: reduce)` and still stops the loops. A live change of the
  system setting notifies the same store, so the page reacts without a reload.
- **`useParallax`** reads a `data-parallax="y:180 x:-26"` attribute and builds one scrubbed
  `ScrollTrigger` per layer. Positive `y` makes a layer lag the page (reads as far away), negative `y`
  makes it lead (reads as close). Deltas are function-based values with
  `invalidateOnRefresh: true`, so they are re-measured on resize, on mobile viewport changes and after
  fonts load — and both axes are damped by 50% under 768px, where the same travel reads as a shove.
- **`useReveal`** writes entrances as `gsap.from()` tweens. The markup keeps its final, visible state in
  the document, so content is readable even if GSAP never initialises.
- **`usePointerDepth`** animates `data-depth="0..1"` wrappers. They are deliberately *not* the nodes that
  carry a scroll tween, so the cursor lean and the parallax never fight over the same transform component;
  `gsap.quickTo()` keeps the follow cheap and one listener serves the whole layer set.
- **Transforms and opacity only** — no `top`, `height` or layout properties are animated.
- **Scroll-driven React state is avoided.** The nav's active scene comes from a single
  `IntersectionObserver` that fires only when a scene takes over; the progress line, rail fill and all
  parallax are GSAP-owned. React re-renders exactly once per motion choice, never per frame.
- **Cleanup / Strict Mode.** Every scene builds inside `gsap.context()` (and `gsap.matchMedia()` for the
  width/height variants) and reverts on unmount, so the double-invoked mount in development leaves exactly one
  set of timelines. Because the effects depend on `allowed`, flipping the switch reverts the still variant
  and mounts the animated one — no stale spacers, no orphaned `quickTo` tweens.
- **Decorative layers** are `aria-hidden="true"` and `pointer-events-none`, so they can never cover a
  button or be announced.

---

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`), one `h1`, one `h2` per scene.
- Skip-to-content link as the first focusable element.
- Every control is a real `<button>` or `<a>`; hit areas are 44px or larger; a visible cyan
  `:focus-visible` outline is defined globally.
- The orbit diagram carries `role="img"` with a descriptive label; the rail is presentational.
- Text sits at `#c3cde0`/`#93a1bd` on near-black (`#04060f`) for comfortable contrast.
- **`prefers-reduced-motion: reduce` is honoured by default.** `useParallax`, `useReveal`, the pinned
  orbit scene, the pointer lean, the cursor probe, the meteors and the ambient CSS loops are all skipped.
  Layout stays vertical, everything stays readable, both journey buttons and all anchors still work, and
  the CSS transition duration collapses to ~0.
- **Readouts are not decoration, so they keep working.** The header progress line and the journey rail fill
  map to real scroll 1:1 in the still version (`scrub: true` instead of a softened scrub), and the orbit
  diagram rests with its progress ring drawn rather than unwound, because nothing is there to draw it.
- **The opt-in is explicit, never automatic.** The header switch (`<button aria-pressed>`, reachable by
  keyboard and announced as “Motion on/off”) lets a visitor take the animation back; the hero explains it
  the first time. Nothing moves on its own accord while the system asks for calm, and the choice persists
  for the session without touching stored data.
- Scroll behaviour itself is never overridden, so keyboard, touch and anchor navigation are intact.

---

## Responsive notes

Measured in same-origin iframes at 360×640, 768×1024, 1024×600, 1024×768, 1280×720, 1366×640 and 1440×900 —
zero horizontal overflow at every one of them, and the pinned stage only engages where the composition
actually fits.

- Fluid type via `clamp()` (`.type-display`, `.type-section`, `.type-lead`) and fluid section padding.
- `overflow-x: clip` on `body` (not `hidden`) prevents sideways overflow while keeping native scrolling,
  sticky elements and ScrollTrigger pinning working; every decorative layer is inset instead of
  translated off-canvas, so there is nothing to clip in the first place.
- The header keeps the wordmark, the Motion switch and the menu inside the viewport at every width: the full
  anchor list appears from `lg`, and below it the compact sheet takes over — the switch never gets pushed past
  the clipped right edge.
- Under `lg` the reserved right gutter and the rail disappear, and the orbit scene returns to a normal
  vertical flow (heading → diagram → facts). A wide-but-short desktop window (under 700px tall) is sent to
  that same flow instead of being pinned with the last fact below the fold.
- Mobile viewport changes (`100svh`, dynamic toolbars) are handled by `svh` units plus
  `invalidateOnRefresh` and `ScrollTrigger.refresh()` on `load` / `document.fonts.ready`.

---

## Performance

- One `<svg>` node per star field rather than hundreds of positioned divs; star positions are memoised
  with a seeded PRNG so re-renders cannot reshuffle the sky.
- No 3D library, no video, no autoplay, no external requests at runtime.
- `will-change: transform` is applied only to the hero's large moving layers; GSAP's default `force3d`
  handles the rest.
- Bundle after `npm run build`: ~7kB gzipped CSS and ~105kB gzipped JS (React + GSAP + Lucide), with
  no runtime requests beyond the bundle itself and the favicon.

---

## Deployment

Both hosts build `dist/` from the same scripts; `vite.config.js` uses `base: './'` so the bundle works
from any path.

### Vercel

1. Push this folder to a Git repository and import it on Vercel.
2. Framework preset **Vite** — build command `npm run build`, output directory `dist`.
3. `vercel.json` is already included (SPA rewrite); no further configuration is needed.

### Netlify

1. “Add new site → Import an existing project”, choose the repository.
2. Build command `npm run build`, publish directory `dist`.
3. `netlify.toml` is already included, so deploys and `netlify dev` work out of the box.

### Hosted demo

> **Demo URL:** `<!-- PLACEHOLDER — paste the real Vercel or Netlify URL here once the project is deployed -->`
>
> Not published yet. Leave this line untouched until a live deployment exists, then replace the
> placeholder with the URL.

---

## Submission demo recording checklist

A 30–60 second capture. See [DEMO_CHECKLIST.md](./DEMO_CHECKLIST.md) for the printable version.

1. Start at the very top, wait 2s so the hero settles, then scroll slowly through all five scenes.
2. Let the rocket visibly lift and the ridge slide past it in the opening scene (≈8s).
3. Scroll through *Atmosphere* without stopping, so the sideways haze drift reads (≈8s).
4. Pause half a second in *Orbit*, then scroll steadily to show the pinned orbits and the ring drawing
   (≈10s); wiggle the cursor once to show the depth lean.
5. Show the *Deep space* cards arriving on different axes, then hover one card (≈8s).
6. End on *Return*, click **Back to launch**, and finish in the hero (≈6s).
7. Optional 10s insert: reload the page at 360px width and scroll Launch → Return.
8. Optional 10s insert: click **Motion on → off** mid-scene to show the page going still with every word
   still in place, then back on. Record the OS reduce-motion case too if you can set it beforehand.

---

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve `dist/` locally |

## Known limits

- The pinned orbit scene needs 1024px of width *and* 700px of height; everything else gets the same scene
  unpinned, so the “pinned” part of the experience cannot be seen on a phone or a short window.
- The cursor probe and the pointer lean need a fine pointer — that is the one layer that is desktop-only by
  definition. Width does not matter, but a touch device keeps every other layer of depth and never sees the
  probe.
- The Motion choice lives in memory for the visit — a reload returns to “follow the system”, which is the
  honest default for an accessibility preference.
- Scroll and pointer behaviour here was verified by reading real transform values out of the live GSAP
  instances at several scroll offsets, not by watching the page. Motion *smoothness* still needs a look on a
  real display, so capture the demo on one.
