# ORBIT — A Journey Beyond Earth

A cinematic parallax scroll built for the *Interactive Parallax Scrolling Page* challenge. One
page, five scenes, a launch pad to deep space and back: background, midground and foreground travel
at different speeds the whole way down, so depth is something you feel while scrolling rather than
something the copy claims.

ORBIT is a single-page front-end experience with no backend and no runtime dependencies beyond the
bundle. Every star, planet, ridge, haze band and orbit line is a CSS gradient or inline SVG drawn in
code — there is not one image file, webfont or remote API call in the finished page.

> **Status: challenge entry, fully functional.** The narrative is fictional; the astronomical
> figures in the cards (384,400 km, L2 at 1.5 million km, Voyager 1 at ~24 billion km) are real but
> rounded, and Voyager's distance grows by roughly 800 million km a year. Nothing here claims
> awards, users, traffic or performance numbers that were not measured on this machine.

**Live demo:** _not deployed at the time of writing._ See [Deployment](#deployment); replace this
line with the live URL once it is published and opened in a browser.

---

## Features

**Sixteen layers, sixteen distances** — each scene carries three to five independently scrubbed
layers, and no two share a travel distance. The hero's farthest star field lags the page by 180 px
while its foreground ridge leads by 150 px in the opposite direction; the nearest wisp in
*Atmosphere* takes a 165 px lead **and** a 120 px sideways drift, which is what makes it read as
vapour crossing a window. See [How the scroll is wired](#how-the-scroll-is-wired).

**One pinned scene that opts out gracefully** — *Orbit* pins for 115% of a viewport height and turns
scrolling into rotation: three orbital systems sweep around a shared centre while a progress ring
draws itself and three facts stagger in. It pins only where the composition actually fits (1024 px
wide *and* at least 700 px tall). Everywhere else — phones, tablets, a short laptop window — the same
scene runs unpinned in a normal vertical flow with the identical content. Nothing is hidden because a
media query did not match.

**Readouts that survive reduced motion** — the header progress line and the right-hand altitude rail
are functional instruments, not decoration, so they are wired to real scroll in both versions. The
animated build softens them with a 0.2 s scrub; the still version maps them 1:1 (`scrub: true`). The
orbit ring, which the scroll timeline normally draws from `stroke-dashoffset: 1684`, rests *drawn*
when no timeline is running — otherwise a reduced-motion visitor would see an empty circle.

**A motion switch, not a motion dump** — the site follows your operating system's reduce-motion
setting by default, and a header control (`<button aria-pressed>`) hands the animation back without a
reload. Flipping it reverts every `gsap.context()`, tears down the pinned variant and mounts the other
one, so there are no stale pin spacers and no orphaned tweens. It never turns itself on: the choice is
explicit, and it is the visitor's.

**Depth that answers the cursor** — on a fine pointer, the decorative layers lean toward the cursor by
a per-layer factor (`data-depth="0..1.2"`), while a lagging ring and a tight dot trail the pointer and
the ring swells over anything clickable. The lean writes to inner wrappers and the scroll tween writes
to outer ones, so the two never fight over one transform. The native cursor stays visible, the layer is
`pointer-events-none`, and no interaction anywhere on the page requires hover.

**Nothing hijacks the scroll** — wheel, trackpad, touch drag, arrows, PageUp/PageDown, Home/End,
anchor links and browser back-to-top all behave natively. No fake inertia, no forced scrolling, no
long empty gaps. The two journey buttons scroll and then move keyboard focus to the destination, so a
screen reader follows the jump instead of being stranded at the top of the page.

**Zero network weight** — the page renders no `<img>`, no `<iframe>`, no video, no webfont and no
analytics. Measured on the dev server: 34 resource requests, every one of them `localhost`, zero font
requests, zero image requests.

**Strict Mode safe by construction** — every scene builds inside `gsap.context()` (and
`gsap.matchMedia()` for the width/height variants) inside a layout effect and reverts on cleanup, so
React 18's double-invoked mount in development leaves exactly one set of timelines.

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | React 18.3.1 (JavaScript + JSX only, no TypeScript) |
| Build tool | Vite 5.4.21 with `@vitejs/plugin-react` 4.7.0, `base: './'` |
| Styling | Tailwind CSS 3.4.19 (PostCSS 8.5.31 + Autoprefixer 10.6.1), custom tokens in `tailwind.config.js` |
| Scroll motion | GSAP 3.15.0 + ScrollTrigger — parallax, reveals, the pinned scene, both progress readouts |
| Pointer motion | GSAP `quickTo()` for the cursor follow and the depth lean |
| Icons | lucide-react 0.454.0 — five modules imported through its ESM entry and tree-shaken |
| Artwork | CSS gradients + inline SVG, generated in JSX with a seeded PRNG (`src/lib/random.js`) |
| Fonts | The system UI stack plus `ui-monospace` — nothing is downloaded |

There is no state-management library, and none is needed: see
[Scroll never re-renders React](#scroll-never-renders-react).

---

## Getting started

**Prerequisites:** Node.js 20 or newer (built here on Node 24.14.1 / npm 11.11.0) and any modern
browser. No API keys, no database, no services to configure.

```bash
npm install       # install dependencies
npm run dev       # start the dev server → http://localhost:5173
```

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server with HMR on port 5173 (`host: true`, so a phone on the same network can open it). |
| `npm run build` | Production bundle in `dist/`. |
| `npm run preview` | Serve the built `dist/` folder locally. |

There is deliberately **no lint or type-check step** — the project is plain JS with no tooling debt to
clear. Adding ESLint is a real gap worth closing before this becomes anything larger.

---

## Project structure

```
.
├── index.html                     # metadata, theme-color, pre-paint motion script, root mount
├── vite.config.js                 # base: './', outDir dist, host + port for device testing
├── tailwind.config.js             # palette, mono stack, ultra tracking, 84rem shell
├── postcss.config.js              # tailwind + autoprefixer
├── vercel.json / netlify.toml     # SPA rewrites; both hosts need no further setup
├── public/
│   └── favicon.svg                # original 6-line orbit mark
├── README.md
├── DEMO_CHECKLIST.md              # printable shot list for the submission clip
└── src/                           # 19 files, 2,085 lines
    ├── main.jsx                   # React root in StrictMode
    ├── App.jsx                    # page composition, skip link, one IntersectionObserver
    ├── index.css                  # tokens, fluid type, .shell, header, buttons, ambient loops,
    │                              #   the whole still version
    ├── lib/
    │   ├── motionStore.js         # the single decision: is motion allowed right now?
    │   ├── motion.js              # focus-aware anchor scrolling + fine-pointer detection
    │   ├── sections.js            # one source of truth for nav, rail and footer
    │   └── random.js              # seeded PRNG so star fields never reshuffle
    ├── hooks/
    │   ├── useMotionPreference.js # the store, exposed via useSyncExternalStore
    │   ├── useSceneMotion.js      # useParallax() + useReveal()
    │   └── usePointerDepth.js     # [data-depth] lean toward the cursor
    └── components/
        ├── Nav.jsx                # header, anchor list, mobile sheet, progress line, Motion switch
        ├── JourneyRail.jsx        # fixed altitude readout (desktop, aria-hidden)
        ├── CursorProbe.jsx        # lagging ring + dot, fine pointers only
        ├── StarField.jsx          # one SVG per field, memoised positions
        ├── Hero.jsx               # scene 01 — launch
        ├── Atmosphere.jsx         # scene 02 — haze layers, Kármán line
        ├── OrbitalPlayground.jsx  # scene 03 — the pinned orbital diagram
        ├── DeepSpace.jsx          # scene 04 — three cards over still layers
        └── ReturnToEarth.jsx      # scene 05 — horizon, footer
```

---

## Design system

Colour lives in `tailwind.config.js`, not in components. Every surface is one of two near-blacks;
every piece of text is one of three greys; and the two accents are the only saturated values on the
page.

| Token | Value | Role |
| --- | --- | --- |
| `void` | `#04060f` | page background, header scrim, footer |
| `abyss` | `#060b1c` | cards and inset panels |
| `ink` | `#c3cde0` | lead paragraphs, emphasized body |
| `ink-soft` | `#93a1bd` | default body copy |
| `ink-faint` | `#74869f` | HUD labels, distances, footer meta |
| `white` | `#ffffff` | every heading |
| `cyan` | `#35e0ff` | primary accent: kickers, focus ring, progress, buttons |
| `violet` | `#9b7bff` | secondary accent, used sparingly |

- **Type** — the system UI stack for prose, `ui-monospace → Consolas` for labels and readouts. Headings
  are `font-semibold` on purpose: at 11 px of negative tracking, bold is what keeps 6 rem legible.
- **Type scale** — four fluid classes, no breakpoint overrides:
  `.type-display` `clamp(2.6rem … 6.5rem)` at `0.94` line-height and `-0.035em` tracking,
  `.type-section` `clamp(2rem … 4.25rem)`, `.type-lead` `clamp(1.02rem … 1.3rem)`,
  `.type-body` `clamp(0.95rem … 1.03rem)` at `1.75`.
- **Labels** — `.kicker` is 11 px uppercase at `0.32em` tracking (`tracking-ultra`), the voice of the
  instrument panel; it appears on every scene heading.
- **Layout** — one `.shell` (`max-w-shell` 84rem, `px-5 → sm:px-8 → lg:px-12 lg:pr-40`). The reserved
  right gutter is where the fixed altitude rail lives, so content never slides under it.
- **Surfaces** — the background is never a flat fill: each scene is a `radial-gradient` of its own, and
  the only "cards" on the page are `bg-abyss/55` with a 1 px `border-white/10` and a hairline that
  wipes in on hover.

---

## The motion decision

```
OS setting ──┐
             ├─► src/lib/motionStore.js ──► <html data-motion="on | still"> ──► CSS
user choice ─┘        (forced | auto)                │
                                                     └─► useMotionPreference() ─► every GSAP hook
```

`motionStore` holds one value: `forced === null` means *follow the operating system*, `true`/`false`
means *the visitor decided*. Three things hang off it, and they must not be able to disagree:

- **The resolved state is mirrored onto the document** as `data-motion="on|still"`. CSS owns the
  looping ambient motion (`.twinkle`, `.breathe`, `.cue-dot`, `.meteor`); JS owns everything
  scroll-driven. Because both read the same attribute, a scene can never animate while its loops are
  stopped.
- **A two-line inline script in `index.html` sets that attribute before first paint**, so a
  reduced-motion visitor never sees one animated frame even if the bundle is slow. If the bundle
  *never* boots — JS off, module blocked — the `@media (prefers-reduced-motion: reduce)` block in
  `index.css` still stops every loop and still draws the orbit ring. Content never depends on JS.
- **A live change to the system setting notifies the same store**, so the page reacts without a reload.

The interface copy uses the *raw* value (`auto | on | off`) rather than the resolved one, which is why
the switch can honestly say "following your system" instead of "off".

---

## How the scroll is wired

Parallax is declarative. A layer opts in with one attribute and the hook builds exactly one scrubbed
`ScrollTrigger` for it:

```jsx
<div data-parallax="y:150 x:-120" aria-hidden="true">   {/* outer: owns the scroll transform */}
  <div data-depth="0.75"> … </div>                       {/* inner: owns the cursor lean */}
</div>
```

Positive `y` makes a layer lag the page (reads as far away), negative `y` makes it lead (reads as
close). Sign and magnitude are the whole depth argument.

| Scene | Parallax layers | Lag range | Lead range | Extra |
| --- | --- | --- | --- | --- |
| Launch | 5 | `y:180`, `y:110 x:18`, `y:96 x:-34` | `y:-150 x:56`, `y:52 x:-26` | rocket lifts over the first 60% |
| Atmosphere | 4 | `y:150`, `y:64 x:26` | `y:-46 x:70`, `y:-165 x:-120` | the strongest sideways drift on the page |
| Orbit | 0 | — | — | pinned rotation instead of translation |
| Deep space | 4 | `y:150`, `y:120 x:40`, `y:56 x:-30` | `y:-70 x:-56` | the card grid stays perfectly still |
| Return | 3 | `y:130`, `y:70`, `y:58 x:22` | — | the closing scene only lags; it calms down |

Both axes are damped by 50% under 768 px, where the same travel reads as a shove rather than depth.
Deltas are function-based values with `invalidateOnRefresh: true`, so they are re-measured on resize,
on mobile toolbar changes and after fonts load.

### Scroll never re-renders React

- The active scene comes from **one `IntersectionObserver`** in `App.jsx` that fires only when a scene
  takes over, and feeds both the nav and the rail.
- The progress line, rail fill, every parallax layer and the pinned timeline are **GSAP-owned**.
- The header's solid backing is written **straight onto the element** by a passive scroll listener that
  reads its own current class as the state — so a scroll tick costs zero React renders and cannot
  desync if something else touches the class.
- React re-renders once per motion choice and once per scene change. Measured at 1280×800 with motion
  on: **41 ScrollTrigger instances**, 16 of them moving a layer.

Reveals are written as `gsap.from()` on `autoAlpha`, never as CSS that hides by default: the markup
keeps its final visible state in the document, so if GSAP fails to initialise you get a complete,
readable page instead of a blank one. For the same reason the closing **Back to launch** button sits
*outside* its reveal wrapper — `autoAlpha` hides with `visibility`, which would have removed the only
call-to-action from the tab order until the scene had already been scrolled to.

Transforms and opacity only. `will-change: transform` is applied to the six hero layers and nowhere
else.

---

## Accessibility

The colour audit is arithmetic, not pixels: each text token was measured against the three
backgrounds it actually sits on using the WCAG 2 relative-luminance formula. Small text needs 4.5:1.

| Foreground | Used for | `void` | `abyss` | `#0a1330` | AA |
| --- | --- | --- | --- | --- | --- |
| `#ffffff` | headings | 20.23 | 19.58 | 18.28 | pass |
| `#35e0ff` | kickers, accents | 12.77 | 12.36 | 11.54 | pass |
| `#c3cde0` | lead copy | 12.65 | 12.24 | 11.43 | pass |
| `#9b7bff` | secondary accent | 6.43 | 6.22 | 5.81 | pass |
| `#93a1bd` | body copy | 7.78 | 7.53 | 7.03 | pass |
| `#74869f` | HUD labels | 5.45 | 5.27 | 4.92 | pass |

That last row is a fix, not a default. The label token shipped as `#61708c`, which measured **4.05:1**
on `void` and **3.66:1** over the horizon gradient while being used for 11.2 px text in nine places —
a genuine AA failure across the whole page. It was raised to `#74869f`, the smallest change in the same
blue-grey hue that clears 4.5:1 on every background in the palette.

Structure, counted in the DOM rather than asserted:

- One `h1`, four `h2` (one per scene) and six `h3`; `header` ×2, `nav` ×2, `main`, `footer`, five
  `section`s. `lang="en"` on the document.
- **All 17 in-page anchors resolve — 0 broken targets, 0 external links.**
- **0 of 5 buttons without an accessible name** at every width; the Motion switch states its action in
  `aria-label` and carries `aria-pressed`.
- Every section is `<section tabIndex={-1} aria-labelledby="…">` with `scroll-margin-top: 88px`, so an
  anchor lands below the fixed header instead of under it.
- A visible 2 px cyan `:focus-visible` outline with a 3 px offset is defined globally; the skip link is
  the first focusable element and uses `focus:fixed` so it stays on screen when activated mid-page.
- Every decorative layer is `aria-hidden="true"` **and** `pointer-events-none`. The orbit diagram
  carries `role="img"` with a written description; the rail is presentational.
- Tap targets: measured inside same-origin iframes at 360×640 and 768×1024, every visible control is
  44 px or taller — including the Motion switch at 60×44 in a 360 px header. The only sub-44 match is
  the skip link at `1×1`, which is correct: it is `sr-only` until it receives focus.
- `prefers-reduced-motion: reduce` is honoured *by default* — parallax, reveals, the pin, the pointer
  lean, the cursor probe, the meteors and every ambient loop are skipped, the layout stays vertical,
  and all content, links and both journey buttons still work.

---

## Performance

Production bundle from `npm run build` on the current commit (1,592 modules, 12.5 s):

| Asset | Raw | Gzipped |
| --- | --- | --- |
| `dist/assets/index-*.js` (React + GSAP + Lucide + app) | 308.60 kB | **104.95 kB** |
| `dist/assets/index-*.css` | 32.49 kB | **7.01 kB** |
| `dist/index.html` | 0.98 kB | 0.55 kB |
| `dist/favicon.svg` | 0.34 kB | served as its own file, referenced as `./favicon.svg` |

About **112 kB gzipped** to boot, plus a third-of-a-kilobyte favicon, with no second request for fonts,
images or analytics. GSAP is the single largest dependency and is not code-split, because every scene
uses it.

- The sky is **ten `<svg>` elements holding 710 `<circle>` stars** rather than 710 positioned divs —
  one node per field to composite, one transform to animate, and coordinates memoised from a seeded
  PRNG so a re-render cannot reshuffle it.
- No 3D library, no video, no canvas, no autoplay, no observers beyond the single
  `IntersectionObserver`, no per-frame React state.
- Pointer work goes through `gsap.quickTo()`, which reuses one tween per axis instead of allocating a
  tween per `pointermove` event, and bails out when the scope is off screen.
- `overflow-x: clip` on `body` (not `hidden`, which would break sticky and pinning), and every
  decorative layer is inset with negative percentages rather than translated off-canvas — so there is
  nothing large to clip and no paint cost for it.

---

## Screenshots

**Not captured.** This build environment has no visible browser surface (`visibilityState: hidden`),
so screenshot capture is refused at the protocol level; a gallery of images that do not exist would be
worse than no gallery. `docs/screenshots/` is intentionally absent.

To capture the set for a README gallery, run `npm run dev` on a real display and take:

1. Hero at 1440×900, at rest, and again 40% into the scene so the rocket has visibly lifted.
2. *Atmosphere* mid-scroll, where the four haze layers separate.
3. *Orbit* at the middle of the pin, ring partly drawn.
4. *Deep space* with the three cards staggered on their own rows.
5. *Return* with the horizon lit and the footer in frame.
6. 360×640: hero, the opened mobile sheet, and *Orbit* unpinned.
7. The still version of *Orbit* — proof that the ring is drawn and the content is complete with no
   animation running.

---

## Editing the content

Copy lives next to the scene it belongs to, which keeps a section readable in one file.

| File | Contains |
| --- | --- |
| `src/lib/sections.js` | The five `{ id, nav, marker }` entries — **one source of truth** for the nav, the mobile sheet, the altitude rail and the footer links. Add a scene by adding a row and a component. |
| `src/components/Hero.jsx` | The opening lockup, the opt-in card and the scroll cue. |
| `src/components/Atmosphere.jsx` | The four haze layers and the altitude items. |
| `src/components/OrbitalPlayground.jsx` | The orbit diagram geometry, the `orbits()` rotation map and the three facts. |
| `src/components/DeepSpace.jsx` | The `CARDS` array — title, body, stat, accent, grid layout and entry axis. |
| `src/components/ReturnToEarth.jsx` | Closing copy, the journey button and the footer. |
| `tailwind.config.js` + `src/index.css` | The palette, the fluid type scale, `.shell`, buttons and the still version. |

Depth is data too: a layer's whole animation is its `data-parallax` string, so re-blocking a scene
does not mean touching a timeline.

---

## Deployment

The output in `dist/` is fully static — no backend, no secrets, no environment variables.
`vite.config.js` sets `base: './'`, so the bundle works from a domain root *or* a repository
sub-path (verified by inspecting the built `index.html`: `/favicon.svg` is rewritten to `./favicon.svg`).

**Vercel** — import the repository, framework preset *Vite*, build `npm run build`, output `dist`.
`vercel.json` is already present (SPA rewrite).

**Netlify** — *Add new site → Import an existing project*, build `npm run build`, publish `dist`.
`netlify.toml` is already present.

**GitHub Pages** — `base: './'` already covers the `/repository/` sub-path:

```bash
npm run build
npm i -D gh-pages
npx gh-pages -d dist
```

Then: Settings → Pages → branch `gh-pages` / root.

```bash
npm run build && npm run preview   # always check the production bundle before deploying
```

Once it is live, replace the **Live demo** line at the top of this file with the real URL — and only
after opening it in a browser.

---

## Demo recording

Not generated automatically. The printable shot list is
[`DEMO_CHECKLIST.md`](./DEMO_CHECKLIST.md); the short version for a 30–60 s clip:

1. Open at 1440×900 **with the window at least 700 px tall**, or the pinned scene will not pin.
2. Start at the very top, wait two seconds, then scroll slowly through all five scenes.
3. Let the rocket lift and the ridge slide past it; keep *Atmosphere* moving so the sideways haze
   drift reads.
4. Pause mid-*Orbit* to show the ring partly drawn, then wiggle the cursor once for the depth lean.
5. Show the *Deep space* cards arriving on different axes, hover one.
6. End on *Return*, click **Back to launch**, finish in the hero.
7. Insert A: reload at 360 px, open the sheet, pick a scene, scroll Launch → Return.
8. Insert B: click **Motion** mid-scene so the page goes still with every word in place — and confirm
   the two readouts still track the scroll, and the orbit ring is drawn at rest.

---

## Verification status

What was actually measured, and how. The page was inspected in real Chrome over CDP, inside
same-origin iframes at exact sizes, and by reading values out of the live DOM and GSAP instances.

- `npm run build` clean: 1,592 modules, 32.49 kB CSS / 7.01 kB gzip, 308.60 kB JS / 104.95 kB gzip.
- **Console: zero errors and zero warnings** on a fresh load and after every edit in this pass (only
  Vite's debug lines and React DevTools' notice).
- **Network: zero external requests.** 34 resource entries, all `localhost:5173`; 0 font requests,
  0 image requests, no XHR or fetch at all.
- Layout: 0 px horizontal overflow at 360×640, 768×1024, 1024×600, 1024×768, 1280×720, 1366×640 and
  1440×900. The desktop anchor list is `flex` at 1440 and the mobile sheet takes over below 1024; the
  rail is `display: none` until `lg` and its reserved gutter disappears with it.
- Pinning: at 1440×900 with motion on there is **exactly one `.pin-spacer`** (the orbit scene, 1,935 px
  of content in a 900 px viewport), and **zero** in the still version. Page height 6,092 px pinned.
- Motion behaviour: 16 parallax layers verified at several scroll offsets — signed amplitudes correct,
  damped by half under 768 px, and reversing exactly on the way back up. The cursor lean is strictly
  proportional to `data-depth`, the dot lands on the cursor and the ring lags it.
- Both readouts verified 1:1 in the still version (bar and rail both at 0 → 0.335 → 0.718 → 1 across the
  page) — the bug this pass fixed, from `scrub: false`, which silently converts a trigger into a toggle.
- Function: all 17 anchors land; **Begin the journey** arrives within 0 px of the target section top and
  leaves keyboard focus on it; **Back to launch** jumps to the hero and is focusable *before* its scene
  has been scrolled to; the sheet closes on selection and on `Escape`.

Not verified, and worth checking by eye before submitting:

- **Smoothness.** Frame pacing, scrub feel and the pin's hand-off cannot be judged from DOM values. The
  inspection tab renders no frames, so this needs a real display.
- Touch behaviour on a physical device (the checks here were width/media-query checks).
- Composited contrast — the table above is token arithmetic. Text sitting over the brightest star
  fields was not measured against rendered pixels, because that needs screenshots.

---

## Known limitations

- The pinned orbit scene needs 1024 px of width **and** 700 px of height. Everything else gets the same
  scene unpinned, so the pinned half of the experience cannot be seen on a phone or in a short window.
- The cursor probe and pointer lean require a fine pointer. That is the one layer that is desktop-only
  by definition; a touch device keeps every other depth layer and never sees the probe.
- The Motion choice lasts the visit. A reload returns to "follow your system", which is the honest
  default for an accessibility preference — but it does mean a returning reduced-motion visitor has to
  opt in twice.
- No lint, no type-check, no tests, and no CI.
- Voyager 1's quoted distance will drift out of date; the card is a snapshot, not a live figure.
- No audio, and no reduced-motion "play everything once" mode — both were left out deliberately rather
  than shipped half-finished.

---

## Credit & licence

Built for the *Interactive Parallax Scrolling Page* challenge. Not affiliated with or endorsed by any
institution, and no claim is made about awards, placement or users.

Released under the **MIT licence** — see [`LICENSE`](./LICENSE). The copyright line uses the GitHub
handle; edit it to your legal name if you would rather it read that way.

One thing to read before reusing this: MIT covers **this repository's source**, and nothing else. The
dependencies keep their own terms, and they are not uniform —

| Dependency | Licence |
| --- | --- |
| GSAP + ScrollTrigger | GreenSock **"no charge" Standard License** — free to use, including commercially, but it is *not* an open-source licence and restricts redistribution |
| lucide-react | ISC |
| React, Tailwind CSS, Vite, PostCSS, Autoprefixer | MIT |

So a fork that ships GSAP as-is inherits GreenSock's terms for that part. Replace it (or write the
scroll layer by hand) if you need a pure-MIT redistribution. Fonts are the operating system's own and
carry no licence obligation here.

All geometry, artwork, gradients and copy were generated for this project and live in the repository.
Nothing is hotlinked at runtime.
