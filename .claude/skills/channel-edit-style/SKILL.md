---
name: channel-edit-style
description: House editing style for the channel's 9–10 minute documentary videos (dance history and culture). Use whenever making B-roll, titles, motion graphics, transitions, the mid-video subscribe card, or a full edit of host footage / voiceover for this channel.
---

# Channel edit style

The master reference is a cinematic documentary episode (host on camera in a warm, moody set, intercut with
cinematic AI B-roll). Older secondary references are summarised in `docs/reference-styles.md`.
**Brand: "Velvet Stage"** — Playfair Display italic (key lines/titles) + Montserrat (labels, body),
colours ink `#0D0710`, gold `#E8C27A` (primary accent), rose `#E0457B` (sparing secondary), white `#F4F1EA`.
Import everything from `src/brand/tokens.ts`; full rules in `docs/brand.md`. Don't introduce other fonts or colours.

## Collect-then-build workflow (default from now on)

The owner sends the **script/storyboard first**, then images in batches (the chat allows 5 per message).
1. On the script: save it to `docs/episodes/<episode>/script.md`, reply with the shot plan (scene → line → image
   slot) and anything unclear. Do not build yet.
2. On each image batch: save the files in arrival order to `public/<episode>/NN.jpg` (upscaled to 2400 px wide,
   Lanczos + light unsharp), commit and push so nothing is lost. Reply in 2–3 lines only: which slots were
   filled, what is still missing, and any problem (wrong subject, duplicate, very low resolution). No rendering.
3. When the owner says **"this is the final image"** (or similar): build the whole sequence in one pass, using
   the master-reference style, brand, hero words, split screens, torn-paper transitions etc.; check frames; render
   final clips with text baked in (CRF 10) plus a placement guide; zip and send.

## The two ways we work

1. **Inserts for the owner's CapCut edit** (most common). The owner edits the host footage in CapCut. We deliver
   separate clips: B-roll sequences, title/keyword overlays, transitions, the subscribe card.
   - Full-frame B-roll: MP4, H.264, 1920×1080, 30 fps.
   - Overlays (text, labels, subscribe card): render on pure green `#00FF00` as MP4 so CapCut's Chroma key removes it,
     and also offer ProRes 4444 with alpha (`--codec=prores --prores-profile=4444 --pixel-format=yuva444p10le`)
     if the owner confirms their CapCut imports it.
   - Name files by timecode + purpose, e.g. `03m12s_keyword_bharatanatyam.mp4`.
2. **Full edit in Remotion.** The owner sends host footage and/or voiceover; we build the finished video.

Videos are 9–10 minutes, 16:9, 1920×1080, 30 fps. Some sections are voiceover only, some show the host on camera.

## Structure of a 9–10 minute episode

| Time | Section | Notes |
|---|---|---|
| 0:00–0:08 | **Hook** | Host's strongest line, then a 2–3 s flash of the most dramatic B-roll. Open a question the video answers later. |
| 0:08–1:00 | Setup | Who/where/when. Establishing B-roll. |
| 1:00–~4:30 | Rising story | Alternate host ↔ B-roll. Escalate stakes. |
| **~4:30–5:30** | **First peak → subscribe card** | Fast montage to an emotional peak, then hard cut to the subscribe card (pattern interrupt). Only CTA we use for now. |
| 5:30–~8:30 | Second act | New question or twist; second, bigger montage peak around 7:30–8:00. |
| last 60–90 s | Resolution | Answer the opening question. Calm pacing, return to host. |

Every ~45–60 s something must change: new location, new visual treatment, a montage, a punch-in, or a text beat.

## Editing rules (from the master reference)

**Host ↔ B-roll rhythm**
- Host talks 5–15 s, then B-roll 3–8 s that shows **exactly what is being said** (literal visual of the noun/verb).
- B-roll also covers every jump cut in the host footage.
- Voiceover-only sections: never hold one image longer than ~3 s; keep the camera moving.

**Pacing curve: slow → fast → slow**
- Normal shots 2–4 s. Montage peaks: 6–15 shots at 0.2–0.5 s each, cutting on beats, then drop back to the host.

**Host footage**
- Punch-in zoom (to ~115–125 %) on emphasis words; snap, don't ease slowly. Return on the next sentence.
- One consistent warm grade on the host every time (the "safe" colour of the channel).

**B-roll treatment**
- Realistic AI stills animated with push-ins/pans/parallax; image-to-video clips for the big moments.
- **Real human movement comes from the invideo connector** (project "Rudolf Laban documentary · Velvet
  Stage", https://invideo.io/@roshan-271628/rudolf-laban-documentary-velvet-stage; register as
  `velvet-editor`). Upload the owner's photo with add_media, then generate image-to-video with a short,
  physical motion prompt (Seedance 2.5 / Wan 3.0 / MiniMax H3; ~5 s). Always `dry_run` first and tell the
  owner the credit price before spending. Download the result into public/, then cut it in with Remotion
  (speed ramps, whips, masking, brand text) like any other shot. Use it where movement *is* the point
  (dancers moving, workers repeating a motion); keep stills with still-movement everywhere else.
- **Photos only: never invent our own illustrations.** The owner finds self-made motion graphics (stick
  figures, drawn crowds, vector maps, timelines, torn-photo props, glass cards) childish. Every B-roll
  shot is one of the owner's photos with subtle still movement: a slow push-in, pull-out or lateral drift,
  an occasional gentle tilt, keyed to the line. Allowed on top: the keyword text, grade, grain/dust, and the
  usual transitions (whip, torn-paper cut, glitch, split screen of photos). If a line has no fitting
  photo, reuse the closest one with a different crop and say which ones are missing, rather than
  drawing something.
- Colour = emotion: past/secrets → B&W with one red accent; tradition/history → warm sepia gold;
  danger/climax → deep red; joy/celebration → warm saturated. Host stays warm amber throughout.
- Always: grain, slight vignette, occasional dust/embers, light halation.

**Text — minimal**
- No full subtitles. Only keywords and key lines.
- **Keyword label**: short term (1–3 words) typed on near lower-left in the brand accent colour with a soft glow,
  held ~1.5–2.5 s, when a new name/term is introduced.
- **Key line**: one dramatic sentence; first part glows in accent colour, second part types on in white with a
  coloured cursor block. Use 1–3 times per video, never more.
- **Title wipe**: glowing title wiped on with a light streak for names, places and chapter starts.
- Kinetic thin + heavy word pair for contrasts (A vs B).

**Transitions** (pick by energy; never plain crossfades between B-roll)
- Radial zoom-blur punch into B-roll; smear/whip pan; glitch/RGB flash; torn-paper split for duality
  ("two lives", "then vs now"); light-leak flash for warm/joyful moments; hard cut to black for weight.

## Documentary-recreation style (reference 3, from 2026-10-22)

Use this for story beats where something *happened between people*: a meeting, a decision, a rejection,
a quote from a source. It sits alongside the still-movement style above, not instead of it.

- **Moving recreations, not stills.** The scene is a short AI video made from the owner's photo with the
  invideo connector: people gesture, turn their heads, lean in. The camera changes angle between speakers
  (wide two-shot, then a medium on the speaker, then a reverse on the listener). Hold each about 3–5 s.
- **Subject glow.** The person who matters gets a warm glowing outline (brand gold, not orange), built from
  a rotoscoped cut-out: first a quick bright stroke traced round the figure, then a soft pulsing halo.
  The background can be slightly desaturated so the subject pops.
- **Speech bubbles for quoted words.** A white rounded comic bubble with a tail toward the speaker's head
  pops in (scale overshoot), then the line types on letter by letter in Montserrat heavy uppercase, ink
  colour. Only for words a source actually records someone saying; never invent dialogue.
- **Source pages.** Show the real source (book page, article, archive record) as a sheet tilted in 3D,
  with a slow drift and rotation across it and a small **SOURCE:** header naming it. A highlighter sweeps
  line by line over the key sentence: gold on light paper, rose on dark pages. This is the channel's
  credibility device; use the owner's screenshots of real sources, never fabricate a document.
- **Inset clipping.** During a recreation, a small torn-edge clipping of the same source sits lower-left
  with its key line highlighted, so the viewer sees the evidence beside the scene.
- **Keyword title** at top-left over a colour-punched still: one or two words, heavy uppercase, gold with a
  dark outline and soft glow (the reference used orange-to-yellow; we keep brand gold).
- **Transitions:** fast zoom-blur whips with a directional smear and a slight brightness flash between
  every shot in these sequences.
- **Host sections:** warm practical-lamp A-roll; optional handle tag sliding in bottom-right.
- **Colour:** teal/cool backgrounds, warm amber on the subject; contrast punched up.

## Investigative and archive styles (references 4–6, from 2026-10-24)

Three more looks to vary episodes, so the 50 don't feel like one template. Pick the one that suits the
story beat; full breakdown in `docs/reference-styles.md` (batch 4).

- **Kinetic newspaper (ref 4), for hooks, cold opens and "the myth vs the truth" beats.** B&W print
  textures, red as the only accent; a thin word over a huge heavy word with the texture inside the
  letters; censor bars sliding over a line; diagonal slash wipes carrying a two-line label; a torn band
  across the middle; red RGB-glitch letters; a scratched-through title, then the date. Fast: 0.5–1 s per beat.
- **Overhead evidence table (ref 5), for "who was involved" and connection beats.** One continuous
  top-down camera over a dark tabletop, drifting and rotating between objects. White tape lines box each
  object and lead to the next one; handwritten notes and label tapes with names; lines join everything,
  then a pull-back reveals the whole network. Props are photographed objects (AI or the owner's), never
  drawn icons.
- **Archive prints on a table (ref 6), for history and people.** A 2.5D photo push-in with dust and
  scratches, pulling out to reveal it's a print on a wooden table; prints fall into place at angles; a 3D
  extruded name title; page-flip transitions; a newspaper or flyer as the climax; an ink-blot transition
  to black.
- **Archive smash-cut montage (ref 7), for montages, recaps and "everything changed" beats.** 0.2–0.4 s per
  shot cut on the beat, crushed high-contrast B&W across every source, black/white flash frames and flares
  as punctuation, and a thin HUD layer: corner brackets, a reticle locking onto someone in a crowd, a
  running timecode, `[REC]`, small location tags. Never real agency logos or officials' faces.
- **Adapting the look to the topic.** Swap the props and textures, keep the grammar. For hip-hop: party
  flyers and photocopies instead of newspapers, a spray-paint burst instead of the ink blot, records,
  cables, sneakers and a mic on the evidence table.
- **Rules stay the same:** photos and real textures only, no childish icons; no AI faces given a real
  person's name; no fake official documents; names appear as typography on tape or label cards.

## Mid-video subscribe card (the only CTA for now)
- Placed right after the first emotional peak (~45–55 % into the video).
- Hard cut from the peak to a dark background; a clean card shows the channel's real
  **Not subscribed / Subscribed** percentages from YouTube Studio with animated bars, then the host or a line asks
  viewers to subscribe. 4–6 s. Needs a fresh screenshot of the owner's YouTube Studio audience stats — ask for it;
  never invent numbers.

## Sound (no library yet)
- Until the owner's pack arrives, synthesise simple SFX with ffmpeg (`aevalsrc`/`anoisesrc`): whoosh on whip and
  zoom transitions, low sub-hit on hard cuts and montage peaks, soft riser into peaks, typing ticks on type-on text.
  Keep SFX 6–10 dB under the voice. When the pack arrives, put it in `public/sfx/` and swap.

## Building blocks already in this repo
- `src/cine/Still.tsx` — **use this for all new B-roll**: any image size (cover fit + `pos`), camera move `from`/`to`
  ({s, x, y, r}), whip in/out, `glitchIn`, beat `kicks`, `GRADES` (sepiaGold, bwRose, cool, natural), `rose` tint.
- `src/brand/fx.tsx` — `TornReveal` (paper-cut transition), `SplitPanels` + `PanelLabel` (split screens that
  build 1→2→3 panels), `HeroWord` (big highlight word, optional evaporate/glitch), `ScrambleWord` (data lock-in),
  `TopicTitle` (numbered montage title). Use a hero word on the 1–2 strongest words of each beat.
- Default delivery: **final clips with text baked in** (`laban-c*` pattern in `src/laban/combined.tsx`), CRF 10,
  so the owner drops them straight onto the CapCut timeline. Green-screen overlays only on request.
- `src/brand/text.tsx` — branded overlays: `Label`, `KeyLine`, `WordPair`, `OverlayCanvas` (`bg: green | alpha`).
- `scripts/make-sfx.sh` — synthesised placeholder SFX in `public/sfx/`.
- `scripts/render-laban.sh` — pattern for rendering a B-roll + green/alpha overlay delivery set.
- Episode example: `src/laban/` + `docs/episodes/laban-intro.md` (placement guide format to reuse).
- Overlays and their B-roll share lengths from one `timing.ts` so they stack at the same start point in CapCut.
- `src/cine/Shot.tsx` — animated still (crop/push/pan, whip in/out with blur + RGB split, beat punch-ins).
- `src/cine/texts.tsx` — Track3D, BigWord (thin/heavy), Scatter, Tag, Marker, TitleReveal, Caption.
- `src/cine/overlays.tsx` — LightLeak, Flash, Dip, TornStrip, Grade, ConnectRow.
- `src/scenes/FilmLook.tsx` — grain + vignette.
- Reference build: `src/cine/CineVideo.tsx` (Egypt dance clip).

## Checks before delivering
- Render stills from every scene and look at them; check text legibility and that nothing sits in the outer 5 %.
- Verify the final file's duration/resolution with ffprobe and sample frames from the actual MP4.
