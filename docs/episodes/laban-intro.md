# Laban intro: CapCut placement guide

Files: `out/laban/broll/` (B-roll, with sound effects) and `out/laban/text-green/` (text overlays on green).
Numbers match the order of the script. **Same number = a pair: put the TEXT clip on the track above its
BROLL clip, at exactly the same start point.**

| # | Script line | Main track | Track above |
|---|---|---|---|
| — | *(1 s silence)* "In 1928, Rudolf Laban…" | Host A-roll | — |
| 01 | "…Rudolf Laban published an idea…" | `01_BROLL_laban-portrait` | `01_TEXT_label-rudolf-laban` |
| 02 | "…a written language for human movement." | `02_BROLL_laban-writing` | — |
| 03 | right after "sounds almost impossible" (2 s teaser) | `03_BROLL_teaser-flash` | — |
| — | "Think about the problem." | Host: **punch-in to ~120 %** | — |
| 04 | "Music… Words… Architecture could be drawn." | `04_BROLL_music-words-architecture` | `04_TEXT_words-written-down` |
| 05 | "But dance?" | Host or black | `05_TEXT_but-dance` |
| 06 | "jumps, turns, reaches, falls –" | `06_BROLL_jumps-turns-reaches-falls` | `06_TEXT_verbs` |
| 07 | "…the moment the body stops moving, the movement is gone." | `07_BROLL_movement-is-gone` | — |
| 08 | "So Laban developed a system of geometric symbols…" | `08_BROLL_geometric-symbols` | — |
| 09 | "…where it moved, how high or low… how long" | `09_BROLL_where-high-low-long` | `09_TEXT_where-high-low-long` |
| 10 | "An alphabet – not for speech – but for the body." | `10_BROLL_notation-staff` | `10_TEXT_keyline-alphabet` |
| — | "But this is where the story becomes much stranger." | Host: punch-in + CapCut glitch effect | — |
| 11 | The list: Nazi politics → machines that read motion | `11_BROLL_montage-stranger` | `11_TEXT_montage-topics` |
| — | "This isn't only the history of dance notation." | Host | — |
| 12 | "…when human movement becomes information." | `12_BROLL_movement-becomes-information` | `12_TEXT_keyline-information` |

## Removing the green in CapCut
Select the TEXT clip → **Video → Remove BG → Chroma key** → pick the green with the eyedropper →
**Intensity ~20, Shadow ~10**. (Tested here with an equivalent key: edges come out clean.)
If your CapCut imports ProRes with transparency, the `_ALPHA.mov` versions need no keying at all.

## Timing
- Clips are cut to a natural narration pace. If your voice is slower/faster, change the clip **speed**
  (keep each TEXT clip at the same speed as its BROLL partner), or trim the tail.
- Montage (11): each topic is 1.2 s; the label changes on each cut. If your list is read faster or slower,
  tell me the timestamps and I'll re-time it exactly.

## Sound
B-roll clips carry placeholder SFX (hits, whooshes, risers, ticks). In CapCut set B-roll clip volume to
about **−10 dB** under your voice, or mute them and use your own pack.
