# ORBIT — 30–60 second demo recording checklist

Goal: one continuous scroll capture that shows depth, plus two short inserts proving responsive and
reduced-motion behaviour. Record at 1440×900 or larger, 60fps — and keep the window at least 1024×700, since
that is where the orbit scene pins; a shorter window silently swaps it for the unpinned flow.

## Before recording

- [ ] `npm run build` succeeds, then `npm run preview` (or `npm run dev`) at `http://localhost:5173`
- [ ] Browser zoom 100%, window wide enough that the journey rail on the right is visible
- [ ] **Click the header `Motion` switch until it reads `Motion on`** — the page starts in `auto`, so an
      OS reduce-motion setting would otherwise record a completely still site
- [ ] Move the pointer once: the ring + dot probe should trail it, swelling over the nav links, and the
      decorative layers should lean by different amounts
- [ ] OS cursor visible; hide dev tools, bookmarks bar and download shelf
- [ ] Scroll to the very top and let the page rest for 2 seconds so the hero entrance finishes
- [ ] Confirm no console errors

## Main take (≈40s, one continuous scroll)

- [ ] **Launch (0–8s)** — slow scroll: the three star fields separate, the rocket lifts away from the
      pad, the ridge and launch tower slide past in front
- [ ] **Atmosphere (8–16s)** — keep moving: the haze bands drift sideways at different rates and the
      copy reveals in beats up to the dashed Kármán line
- [ ] **Orbit (16–26s)** — pause ~0.5s at the pin, then a steady scroll: the three orbits rotate at
      different speeds, the cyan progress ring draws, and each fact appears
- [ ] **Cursor detail (within the orbit take)** — sweep the pointer across the scene once so the star
      layers and the diagram lean by different amounts, and the probe ring lags behind; do not hover-flick
- [ ] **Deep space (26–34s)** — scroll so nebula clouds slide under a still, readable card grid, then
      hover exactly one card for ~1s; a meteor may cross on its own, wait for it rather than chase it
- [ ] **Return (34–40s)** — land on the horizon, click **Back to launch**, let the page settle on the
      hero and stop

## Insert A — mobile (≈10s)

- [ ] Resize to 360px wide (or use device emulation, iPhone SE)
- [ ] Open the compact menu, tap one link, watch the sheet close and the page jump
- [ ] Show the header `Motion` pill (icon only below 400px) flipping the scene on for the capture
- [ ] Scroll Launch → Return once; no horizontal movement at any point
- [ ] Optional frame: at 768–1023px the same compact sheet is used (the full anchor list only starts at
      1024px), with the `Motion` switch still on screen

## Insert B — reduced motion (≈10s)

- [ ] Click **Motion on → off** without reloading, mid-scene
- [ ] Scroll the whole page: all copy, facts, cards and both journey buttons present, nothing pinned,
      nothing moving on its own, probe and pointer lean gone
- [ ] Confirm the two readouts still work while still: the header progress line and the right-hand rail fill
      track the scroll position, and the orbit diagram shows its outer ring drawn
- [ ] Ideally also enable the OS “reduce motion” setting, reload and show the same still page — proof the
      default follows the system rather than the switch

## Functional spot-checks (do while recording or right after)

- [ ] Every nav link lands on its own section (5 links)
- [ ] Top progress line tracks scroll from 0 to 100%
- [ ] Right-hand rail highlights the current scene and its fill matches scroll depth
- [ ] `Begin the journey` → Atmosphere; `Back to launch` → Launch
- [ ] Keyboard only: `Tab` reaches skip link → nav → Motion switch → buttons → footer, focus ring always visible
- [ ] `Space` / `Enter` on the Motion switch flips `aria-pressed` and rebuilds the animation cleanly
- [ ] Wheel, touch drag and arrow/Page keys scroll normally; no forced or blocked scrolling

## Do not include

- [ ] Dev tools, terminal, editor or file browser in frame
- [ ] Placeholder text, lorem ipsum, fake metrics, awards or user counts
- [ ] Recording start while the page is mid-scroll

## Finish

- [ ] Export MP4, 1080p minimum, 30–60s for the main take
- [ ] Paste the hosted URL into the `Demo URL` line in `README.md` once deployed
