# Channel brand — "Velvet Stage"

**Status: CHOSEN (2026-10-21).** Code tokens: `src/brand/tokens.ts` — always import from there.
Preview board: render `BrandBoard` still with `{"option": 1}`.

## Fonts (bundled in `public/fonts/`)
| Use | Font | Style |
|---|---|---|
| Key lines, chapter titles, names | **Playfair Display** | Italic, Bold 700, sentence case |
| Keyword labels | **Montserrat** | Bold 700, UPPERCASE, tracking 0.06em |
| Supporting lines, body, card text | **Montserrat** | Medium 500 |
| Thin + heavy contrast pairs | **Montserrat** | 200 vs 900, uppercase |

## Colours
| Token | Hex | Use |
|---|---|---|
| ink | `#0D0710` | Backgrounds, cards, letterbox |
| gold | `#E8C27A` | Primary accent: keywords, key lines, soft glow |
| rose | `#E0457B` | Secondary accent: type-on cursor, subscribe bars, highlights, danger/peak beats |
| white | `#F4F1EA` | Body text |

## Rules
- Gold is the default accent; rose is used sparingly (one element per frame at most).
- Accent text always gets the soft glow (`glow()` in tokens).
- Host footage keeps the warm amber grade; brand colours appear in graphics, not in the host grade.

## Still open
- On-screen text language (Hindi/Nepali needs a Devanagari font, e.g. Mukta — pairs well with Montserrat).
- Channel name and logo.
- YouTube Studio audience-stats screenshot for the subscribe card.
