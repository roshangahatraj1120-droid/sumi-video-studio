import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Channel brand: "Velvet Stage" (chosen 2026-10-21). See docs/brand.md.
export const FONT = {
  headline: "Playfair Display",
  body: "Montserrat Var",
};

loadFont({
  family: FONT.headline,
  url: staticFile("fonts/PlayfairDisplay.woff2"),
  weight: "400 900",
  style: "normal",
});
loadFont({
  family: FONT.headline,
  url: staticFile("fonts/PlayfairDisplay-Italic.woff2"),
  weight: "400 900",
  style: "italic",
});
loadFont({
  family: FONT.body,
  url: staticFile("fonts/MontserratVar.woff2"),
  weight: "100 900",
});

export const COLOR = {
  ink: "#0D0710", // backgrounds, cards
  gold: "#E8C27A", // primary accent: keywords, key lines, glow
  rose: "#E0457B", // secondary accent: cursor, bars, highlights, danger beats
  white: "#F4F1EA", // body text
};

// Soft glow used on accent-coloured text
export const glow = (c: string = COLOR.gold) =>
  `0 0 10px ${c}aa, 0 0 26px ${c}66, 0 2px 10px rgba(0,0,0,0.8)`;

export const TYPE = {
  // Key line / chapter title: Playfair Display italic, bold
  headline: {
    fontFamily: FONT.headline,
    fontStyle: "italic" as const,
    fontWeight: 700,
  },
  // Keyword label: Montserrat bold, uppercase, tracked
  label: {
    fontFamily: FONT.body,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  },
  // Supporting line under a key line
  body: { fontFamily: FONT.body, fontWeight: 500 },
  // Thin + heavy contrast pair
  thin: { fontFamily: FONT.body, fontWeight: 200 },
  heavy: { fontFamily: FONT.body, fontWeight: 900 },
};
