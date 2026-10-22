# Reference style guide

Notes from 5 reference videos (all 9:16 shorts), used to steer the motion design of this project.
The narration in these videos could not be transcribed here; observations come from frame analysis.

## The references at a glance

| # | Video | Genre | Look |
|---|-------|-------|------|
| 1 | Mossad spy Eli Cohen (74s) | Story documentary short | Talking head + cinematic AI stills, red/black grade |
| 2 | Bollywood screen-clash explainer (60s) | News explainer | Talking head + collage cutouts, stamps, maps, article cards |
| 3 | Web Rank Studio promo (19s) | Agency motion-design ad | Purple/white editorial kinetic type + 3D objects |
| 4 | Brands Tailer ad (25s) | Agency direct-response ad | Clean white grid, red/blue UI cards, CTA |
| 5 | "Who Broke American Healthcare" showreel (86s, 16:9 edit inside) | Cinematic documentary | AI photoreal stills in 2.5D, teal grade, text in 3D space |

**Most relevant to our dance documentary: #5, then #1.** #2–#4 supply techniques (counters, highlights, stamps, kinetic type).

---

## 1. Visual treatment

- **Photoreal AI-generated stills as "footage"** (#1, #5). Every shot is a still image brought to life with camera moves,
  parallax, particles and light. No real video needed.
- **Strong single-hue grades:** #5 teal/cyan shadows with warm orange accents (red carpet, lamps); #1 deep red + black;
  #1 also warm sepia for intimate flashbacks. Desaturated near-B&W shots with one colour accent (red name text).
- **Film texture always on:** grain, dust specks, floating embers/particles (#1), soft vignette, light leaks.
- **Letterboxing** of widescreen images inside the vertical frame (#1) — cinematic bars.
- Shallow depth of field, haze/volumetric light (spotlight cones on a desk, fog in an alley).

## 2. Camera / motion

- **Constant slow push-ins** (scale ~1.0 → 1.08 over a shot) and lateral pans across stills; nothing sits still.
- **2.5D parallax:** foreground cutouts (silhouette crowd, people) move faster than the background (#2, #5).
- **Dolly-through** transitions: camera pushes through a doorway/elevator into the next scene (#5 elevator → desk).
- **Punch-in jump cuts** on the talking head for emphasis (sudden 2× crop on mouth/chin) (#1).
- Objects **drop/fly into frame** with motion blur and settle with a slight overshoot: papers, documents, cash (#5, #4).
- Rapid flicker montage of 0.1–0.3s cuts at climaxes (#1 at 35–37s, 69–73s).

## 3. Typography & text animation

- **Text placed in the 3D scene** (#5): "Not for fraud / Not for cover-up" floats in perspective beside a document,
  slides laterally while letter-spacing widens and letters fade out one by one at the edge.
- **Glowing text** (#1): white/yellow with soft outer glow ("Syria President", "He lived two lives.").
  Reveal = left-to-right wipe with a slanted light streak under it; second line types on with a red cursor block.
- **Small caps serif/sans with glow** for quotes; **condensed bold all-caps** for titles (MOSSAD SPY / ELI COHEN lower third).
- **Tag/label chips** (#5): dark rounded chip, quote marks, red keyword + grey rest ("SOLD – Q4 2023", "LIQUIDATED"),
  chip drops in, text types on, chip slides off with the camera.
- **Rolling counters tied to the scene** (#5 hospital bills $1,959 → $10,231 at several points on the frame; #2 "5000 SCREENS"
  3D bevel text with flickering/scrambled digits). Numbers grow in size as they increase.
- **Kinetic editorial type** (#3): mix of italic serif (Playfair-like) + bold sans; huge ghosted outline/grey word behind
  the main word; words slide/mask in; rotated vertical words.
- **Highlighter + circle annotations** (#2, #4): yellow marker sweeps across key words word by word; red hand-drawn
  ellipse around a word ("your offer").
- **Typewriter/letter-by-letter builds** for short punchy lines (#4 "It's because your content strategy isn't built to stop the scroll").
- **Big cracked 3D title card** at the end (#5 "WHO BROKE AMERICAN HEALTHCARE": white + red, chiselled, crack running
  through) over a collage background of headlines.

## 4. Graphic devices

- **Rubber stamps** (#2): 3D stamp tool slams down, lifts off, leaves red ink "BOYCOTT" / "REJECTED" with icon.
- **Red ink/paint splash** wipes and reveals (#2 "LOSS", #5 "CLOSED" building) — red splatter covers the frame then clears.
- **Torn-paper edges** revealing another layer (#2).
- **Cutout people on solid shapes** (#2 yellow circle behind subject, topographic line pattern background).
- **Logo replacing a head** for humour/symbolism (#2).
- **News/article cards** on sticky-note paper with source line, logo circled in red (#2).
- **Maps:** satellite map with country highlighted, camera zooms, flag fills the country (#2, #5).
- **3D objects as visual metaphors** (#3): brain, eyeball, theatre masks, diamond on column, chess king; (#4) cash stacks,
  classical statue holding a phone.
- **Charts** as bold red cards with an animated falling line + arrow (#4); glowing neon line chart (#3).
- **Evidence-board** opening (#5): pinned photos and notes on a dark wall, "UNPRECEDENTED STEP?" handwritten.

## 5. Transitions

- Light-leak flash (warm orange/yellow burst) between scenes (#5).
- Wipe-by: a foreground object/blur passes across the lens to hide the cut (#5).
- Halftone-dot zoom transition (comic dots grow over the image) (#1).
- Red/white stripe wipes (#2), torn paper, ink splash, push-through.
- Hard cut to black for dramatic beats.

## 6. Structure & pacing

- Hook in the first 1–2s with a question or bold claim ("EVER WONDERED?", "Your Ads Spend is going up").
- New visual every **1.5–3s**; talking-head segments 3–8s, b-roll bursts 2–6s.
- Every spoken key phrase gets on-screen text or a visual metaphor.
- Ending: **branded end card** — circular avatar + name/handle (#2, #5), or CTA card with contact buttons (#4),
  "Watch the full video on our YouTube channel".

## 7. Remotion recipes to reuse

| Effect | How |
|---|---|
| Push-in / pan on stills | `scale` + `translate` interpolations over the shot |
| Parallax | 2–4 image layers (PNG cutouts) with different translate speeds |
| Glow text | `textShadow` stack (0 0 8px, 0 0 24px colour) |
| Wipe-reveal text with light streak | `clipPath: inset(0 X% 0 0)` + a skewed gradient bar moving across |
| Text in 3D space | `perspective` on parent + `rotateY` / `translateZ` on text, animate `letterSpacing` |
| Counters | `Math.round(interpolate(...))` + `toLocaleString()`, scramble digits with `random()` before settling |
| Highlighter | absolutely-positioned bar behind each word, `scaleX` 0→1 with `transformOrigin: left` staggered |
| Stamp | spring scale 1.6→1 + rotate, ink texture via mask, slight camera shake on impact |
| Ink splash / light leak | `@remotion/effects` light leak; splash as animated SVG blobs or a mask PNG sequence |
| Grain, dust, vignette | SVG `feTurbulence` grain overlay (already in `FilmLook.tsx`), random drifting dots, radial gradient |

---

# Part 2 — second batch of references

| # | Video | Genre | Look |
|---|-------|-------|------|
| 6 | Serial-killer evidence board (35s, 9:16) | True-crime explainer | One continuous 3D camera move over a corkboard, warm brown, spotlight |
| 7 | "Mystery Crime / Project 313" opener (21s, 16:9) | Investigative title sequence | B&W newspapers, thin+black sans, redaction bars, torn paper, red accents |
| 8 | Vintage history slideshow (53s, 16:9) | Historical/memories template | B&W photo collage, brush-edged frames, rose brush-bar titles, script text |
| 9 | "The History of Alexander" (6s, 16:9) | Thumbnail/title design reveal | Sketch → final; giant red condensed title behind a statue, parchment map |
| 10 | Antique globe macro (16s, 16:9) | Atmospheric b-roll | Slow rotating globe, shallow focus, warm sepia |

## 8. Colour palettes (new)

| Style | Palette |
|---|---|
| Evidence board (#6) | Cork brown `#5a4632`, paper ivory `#efe8da`, marker red `#c4161c`, deep shadow `#120d09` |
| Crime newspaper (#7) | Newsprint greys, pure black, blood red `#b3121b`, white type |
| Vintage memories (#8) | Cool desaturated B&W `#c9ccd3`, rose/burgundy bar `#a3405e` (semi-transparent), off-white |
| History title (#9, #10) | Parchment `#e8cfa0`, oxblood red `#7a0f12`, bronze `#6b4e2e`, sepia gold `#b8873b` |

## 9. Typography (new)

- **Weight contrast pairing** (#7): same sans family, one word ultra-thin (`MYSTERY`, Thin 100) stacked over one word
  ultra-black (`CRIME`, Black 900). Huge — fills the frame edge to edge, cropped by the frame. White with a vertical
  gradient fade into black at the bottom.
- **Tiny tracked caps over a big title** (#7 "JOURNALISTIC INVESTIGATION" above "PROJECT 313"; #9 "T H E  H I S T O R Y  O F").
- **Distressed condensed red title** with a scratch/slash mark through it and grunge texture (#7 "PROJECT 313", "2020").
- **Tall condensed caps** (Bebas Neue / Oswald style) in white on a **rose brush-stroke bar**, a small tracked date
  under it ("OCTOBER 4th, 1944"), and a **handwritten script paragraph** nearby (#8).
- **Giant condensed serif title behind the subject** (#9): the statue cuts in front of "HISTORY" (depth layering),
  title fades with a gradient toward the bottom, subtitle in bold slab serif ("ALEXANDER THE GREAT").
- Names on polaroids written on letter by letter (#6).

## 10. Text animation (new)

- **Scattered letter reveal** (#8): letters of a word pop in in random order (S _ C _ _ D  B I _ T H → SECOND BIRTH) while
  the bar wipes in behind; exit also random-order.
- **Horizontal tracking drift** (#7): huge words slide slowly sideways off frame while the next word slides in.
- **Redaction bars** (#7): solid black bars slide across faces/text like censorship, then slide away.
- **Glitch flicker** (#7): RGB split + horizontal slice offsets on 2–3 frames at transitions.
- **Marker circle** (#6): red hand-drawn ellipse draws around a face (stroke-dashoffset), slightly imperfect loop.

## 11. Camera & layout (new)

- **One-take camera** (#6): no cuts for 35s. The camera starts on a dark board, pushes in, glides from item to item
  (tilted 3D perspective), then pulls back to show the whole board. Items float up and pin into place.
- **Layered collage with depth** (#8): 3–5 photos at different depths, each drifting at its own speed; frames have
  torn/brush edges, white borders, light scratches; fast motion-blurred slide to the next collage.
- **Spotlight sweep** (#7): a soft light pool moves across a dark newspaper, revealing it.
- **Macro b-roll** (#10): extreme close-up with very shallow depth of field and a slow rotation; good under narration.
- **Process reveal** (#9): annotated sketch with handwritten notes dissolves into the finished design.

## 12. Transitions (new)

- Diagonal **torn black paper strip** slashing across the frame with a label on it (#7).
- **Torn horizontal band** opening to reveal a red layer behind (#7).
- **Chromatic aberration whip** + pink light leak between collages (#8).
- **Spotlight fade** to darkness at the end of a sequence (#6).

## 13. Remotion recipes (new)

| Effect | How |
|---|---|
| One-take board camera | Lay all items out on one large `div` (e.g. 4000×3000), animate the parent's `translate`, `scale`, `rotateX` through keyframes |
| Scattered letter reveal | Split into letters, give each a `random(seed)` delay, fade/scale each letter at its delay |
| Torn paper edges | SVG `clipPath`/`mask` with a jagged polyline generated from `random()`; add a paper-white edge stroke |
| Redaction bars | black `div`s with `scaleX` 0→1 (origin left), staggered |
| Weight-contrast title | One family with weights 100 + 900 (Inter/Roboto variable font), `background-clip: text` gradient |
| Glitch | 2–3 copies with `mixBlendMode: screen`, red/cyan offsets, random horizontal `clipPath` slices on a few frames |
| Brush-stroke bar | PNG/SVG brush shape scaled in with `scaleX`, `mixBlendMode: multiply` |
| Subject in front of title | Cutout PNG of subject layered above the title layer |


## Reference 3 — documentary recreation (WhatsApp clip, 28.6 s, 2026-10-22)
Eli Cohen spy story. Shots in order: colour-punched still with "JOB LOSS" keyword and a traced yellow
outline round the subject (0–3 s) → zoom-blur whip into a white book page, "source: …" header, yellow
highlighter sweeping three lines (3–7 s) → host A-roll by a lamp, handle tag bottom-right (7–14 s) →
AI-video café recreation: wide two-shot, then medium on the speaker with a glowing yellow outline, a white
speech bubble typing "If You Want You Can Join Ministry of Defence", torn source clipping lower-left
(14–18 s) → whip to the reverse angle, listener glowing, bubble "OK I AM READY" (18–22 s) → black book
pages in 3D drift with blue highlighter and "SOURCE:" headers, two pages joined by a blur whip (22–29 s).
