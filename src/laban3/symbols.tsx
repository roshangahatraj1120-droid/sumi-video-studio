import React from "react";
import { COLOR } from "../brand/tokens";

// Labanotation-style direction symbols, drawn from the documented conventions:
// shape = direction, shading = level (solid = low, centre dot = middle, stripes = high),
// length = duration. Light on ink to sit in the channel brand.
export type Shape = "place" | "right" | "left" | "diagR" | "diagL" | "fwd";
export type Level = "low" | "mid" | "high";

// (x, y) = bottom-left corner; symbols grow upward
export const outline = (
  s: Shape,
  x: number,
  y: number,
  w: number,
  h: number,
) => {
  const l = x,
    r = x + w,
    b = y,
    t = y - h;
  switch (s) {
    case "place":
      return `M ${l} ${b} L ${r} ${b} L ${r} ${t} L ${l} ${t} Z`;
    case "right":
      return `M ${l} ${b} L ${r} ${(b + t) / 2} L ${l} ${t} Z`;
    case "left":
      return `M ${r} ${b} L ${l} ${(b + t) / 2} L ${r} ${t} Z`;
    case "diagR":
      return `M ${l} ${b} L ${r} ${b} L ${r} ${t} L ${l} ${t + w * 0.8} Z`;
    case "diagL":
      return `M ${l} ${b} L ${r} ${b} L ${r} ${t + w * 0.8} L ${l} ${t} Z`;
    case "fwd": {
      // rectangle with the forward notch cut from its top
      const n = Math.min(w * 0.45, h * 0.4);
      return `M ${l} ${b} L ${r} ${b} L ${r} ${t} L ${l + w / 2} ${t} L ${l + w / 2} ${t + n} L ${l} ${t + n} Z`;
    }
  }
};

export const GlyphDefs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    {[
      ["w", COLOR.white],
      ["g", COLOR.gold],
    ].map(([k, c]) => (
      <pattern
        key={k}
        id={`${id}-${k}`}
        width={11}
        height={11}
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <rect width={4} height={11} fill={c} />
      </pattern>
    ))}
  </defs>
);

export const Glyph: React.FC<{
  id: string;
  shape: Shape;
  level: Level;
  x: number;
  y: number;
  w: number;
  h: number;
  shade?: number;
  gold?: boolean;
  glow?: number;
  opacity?: number;
}> = ({
  id,
  shape,
  level,
  x,
  y,
  w,
  h,
  shade = 1,
  gold = false,
  glow = 4,
  opacity = 1,
}) => {
  if (h <= 0.5) return null;
  const c = gold ? COLOR.gold : COLOR.white;
  const fill =
    level === "low"
      ? c
      : level === "high"
        ? `url(#${id}-${gold ? "g" : "w"})`
        : "none";
  return (
    <g
      opacity={opacity}
      style={{
        filter: `drop-shadow(0 0 ${glow}px ${gold ? "rgba(232,194,122,0.9)" : "rgba(244,241,234,0.55)"})`,
      }}
    >
      <path
        d={outline(shape, x, y, w, h)}
        fill={fill}
        fillOpacity={shade}
        stroke={c}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      {level === "mid" && h > 16 ? (
        <circle
          cx={x + w / 2}
          cy={y - h / 2}
          r={6.5}
          fill={c}
          opacity={shade}
        />
      ) : null}
    </g>
  );
};

// A single symbol in its own little SVG, for sitting next to a word
export const GlyphChip: React.FC<{
  id: string;
  shape?: Shape;
  level: Level;
  w?: number;
  h?: number;
  shade?: number;
}> = ({ id, shape = "place", level, w = 46, h = 96, shade = 1 }) => (
  <svg width={w + 12} height={h + 12} style={{ overflow: "visible" }}>
    <GlyphDefs id={id} />
    <Glyph
      id={id}
      shape={shape}
      level={level}
      x={6}
      y={h + 6}
      w={w}
      h={h}
      shade={shade}
      gold
      glow={10}
    />
  </svg>
);
