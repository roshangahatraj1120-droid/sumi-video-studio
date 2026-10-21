import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const display = "Cinzel";
export const sans = "Inter Var";
export const glyphs = "Noto Sans Egyptian Hieroglyphs";
export const condensed = "Oswald";

loadFont({
  family: display,
  url: staticFile("fonts/Cinzel.woff2"),
  weight: "400 900",
});
loadFont({
  family: sans,
  url: staticFile("fonts/InterVar.woff2"),
  weight: "100 900",
});
loadFont({
  family: condensed,
  url: staticFile("fonts/Oswald.woff2"),
  weight: "200 700",
});
loadFont({
  family: glyphs,
  url: staticFile("fonts/Hieroglyphs.woff2"),
  weight: "400",
});

export const C = {
  black: "#0A0705",
  shadow: "#1A110A",
  stone: "#9A7A55",
  gold: "#E0B25A",
  goldDeep: "#A8792E",
  ivory: "#F1E4C6",
  lapis: "#2B4C8C",
  lapisDeep: "#14244A",
  turquoise: "#3FA6A0",
  ochre: "#B4532A",
  ochreLight: "#D99A5B",
  linen: "#F4EEDD",
  wig: "#16100C",
};

// Hand-picked glyphs (birds, reeds, ankh, eye, water, sun...) used purely as decorative wall texture
export const GLYPHS = [
  "𓀀",
  "𓀁",
  "𓁐",
  "𓂀",
  "𓂋",
  "𓂝",
  "𓃀",
  "𓃭",
  "𓄿",
  "𓅃",
  "𓅓",
  "𓆑",
  "𓆣",
  "𓇋",
  "𓇳",
  "𓈖",
  "𓉐",
  "𓊃",
  "𓊪",
  "𓋴",
  "𓌳",
  "𓍯",
  "𓎛",
  "𓏏",
  "𓐍",
  "𓋹",
  "𓊹",
  "𓆓",
  "𓅱",
  "𓂻",
  "𓇯",
  "𓈎",
];
