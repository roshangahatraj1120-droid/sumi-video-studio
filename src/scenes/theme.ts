import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts so rendering works offline
export const serif = "Playfair Display";
export const sans = "Inter";

loadFont({
  family: serif,
  url: staticFile("fonts/PlayfairDisplay.woff2"),
  weight: "400 900",
  style: "normal",
});
loadFont({
  family: serif,
  url: staticFile("fonts/PlayfairDisplay-Italic.woff2"),
  weight: "400 900",
  style: "italic",
});
loadFont({
  family: sans,
  url: staticFile("fonts/Inter.woff2"),
  weight: "100 900",
});

// Used by SVG drawings. Text styles hardcode the same values inline so they stay editable in Studio.
export const INK = "#0B0A0F";
export const IVORY = "#F2EBDD";
export const GOLD = "#D4A55A";
export const CORAL = "#EF5B5B";
