import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR } from "../brand/tokens";
import { FilmLook } from "../scenes/FilmLook";

// Original motion graphic: direction symbols building up a vertical Laban-style staff.
// Conventions used: read bottom → top; centre line splits left/right; columns from the centre are
// support, leg gesture, body, arm. Shape = direction, shading = level (solid = low, dot = middle,
// stripes = high), length = duration. Inverted (light on ink) to sit in the channel brand.

const CX = 1380;
const BOTTOM = 980;
const TOP = 110;
const COL = 72;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

type Shape = "place" | "right" | "left" | "diagR" | "diagL";
type Level = "low" | "mid" | "high";
type Sym = { col: number; y: number; len: number; shape: Shape; level: Level };

// col: signed column index from centre (±1 support, ±2 leg gesture, ±3 body, ±4 arm)
const SYMBOLS: Sym[] = [
  { col: -1, y: 930, len: 70, shape: "place", level: "mid" },
  { col: 1, y: 930, len: 70, shape: "place", level: "mid" },
  { col: 1, y: 850, len: 70, shape: "right", level: "low" },
  { col: -4, y: 850, len: 150, shape: "left", level: "high" },
  { col: 4, y: 850, len: 150, shape: "right", level: "high" },
  { col: -1, y: 770, len: 70, shape: "diagL", level: "high" },
  { col: 2, y: 690, len: 110, shape: "diagR", level: "mid" },
  { col: -1, y: 690, len: 70, shape: "place", level: "high" },
  { col: 3, y: 610, len: 70, shape: "diagR", level: "mid" },
  { col: -4, y: 610, len: 110, shape: "diagL", level: "mid" },
  { col: 1, y: 530, len: 150, shape: "place", level: "low" },
  { col: -1, y: 530, len: 150, shape: "place", level: "low" },
  { col: 4, y: 450, len: 70, shape: "right", level: "mid" },
  { col: -2, y: 370, len: 110, shape: "left", level: "high" },
  { col: 1, y: 290, len: 70, shape: "diagR", level: "high" },
  { col: -4, y: 290, len: 150, shape: "left", level: "low" },
  { col: 4, y: 210, len: 70, shape: "place", level: "high" },
];
const ROSE_INDEX = 6;
const colX = (c: number) => CX + Math.sign(c) * (Math.abs(c) - 0.5) * COL;

const outline = (s: Shape, x: number, y: number, w: number, h: number) => {
  // (x, y) = bottom-left corner; symbols grow upward
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
  }
};

export const NotationStaff: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const staffDraw = interpolate(frame, [0, 32], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const yStaff = BOTTOM - (BOTTOM - TOP) * staffDraw;
  const playhead = interpolate(frame, [190, 258], [BOTTOM, TOP], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const playOn = frame >= 190 && frame <= 262;

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.ink, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 50% 70% at ${CX}px 540px, rgba(232,194,122,0.10), rgba(13,7,16,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          translate: `0px ${interpolate(frame, [0, durationInFrames], [36, -30])}px`,
          scale: String(interpolate(frame, [0, durationInFrames], [1.0, 1.06])),
          transformOrigin: `${CX}px 540px`,
        }}
      >
        <svg width={1920} height={1080}>
          <defs>
            <pattern
              id="stripes"
              width={11}
              height={11}
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width={4} height={11} fill={COLOR.white} />
            </pattern>
            <pattern
              id="stripesRose"
              width={11}
              height={11}
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width={4} height={11} fill={COLOR.rose} />
            </pattern>
          </defs>
          {/* faint measure grid */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1={CX - 340}
              x2={CX + 340}
              y1={BOTTOM - i * 80}
              y2={BOTTOM - i * 80}
              stroke={COLOR.gold}
              strokeOpacity={0.06}
            />
          ))}
          {/* start position double line */}
          <g opacity={staffDraw}>
            <line
              x1={CX - 160}
              x2={CX + 160}
              y1={BOTTOM + 6}
              y2={BOTTOM + 6}
              stroke={COLOR.gold}
              strokeWidth={3}
            />
            <line
              x1={CX - 160}
              x2={CX + 160}
              y1={BOTTOM + 14}
              y2={BOTTOM + 14}
              stroke={COLOR.gold}
              strokeWidth={3}
            />
          </g>
          {/* three staff lines */}
          {[-2 * COL, 0, 2 * COL].map((dx) => (
            <line
              key={dx}
              x1={CX + dx}
              x2={CX + dx}
              y1={BOTTOM}
              y2={yStaff}
              stroke={COLOR.gold}
              strokeWidth={dx === 0 ? 3 : 2}
              style={{ filter: "drop-shadow(0 0 6px rgba(232,194,122,0.7))" }}
            />
          ))}
          {/* bar lines */}
          {[770, 530, 290].map((y, i) => (
            <line
              key={y}
              x1={CX - 2 * COL}
              x2={CX + 2 * COL}
              y1={y + 8}
              y2={y + 8}
              stroke={COLOR.gold}
              strokeWidth={1.5}
              opacity={interpolate(
                frame,
                [20 + i * 4, 30 + i * 4],
                [0, 0.8],
                clamp,
              )}
            />
          ))}
          {SYMBOLS.map((sym, i) => {
            const t0 = 34 + i * 8.5;
            const grow = interpolate(frame, [t0, t0 + 10], [0, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            });
            if (grow <= 0) return null;
            const shade = interpolate(frame, [t0 + 8, t0 + 16], [0, 1], clamp);
            const w = COL - 18;
            const x = colX(sym.col) - w / 2;
            const h = sym.len * grow;
            const rose = i === ROSE_INDEX && frame >= 120;
            const stroke = rose ? COLOR.rose : COLOR.white;
            const passed = playOn && playhead <= sym.y - sym.len / 2;
            const d = outline(sym.shape, x, sym.y, w, h);
            const fill =
              sym.level === "low"
                ? stroke
                : sym.level === "high"
                  ? rose
                    ? "url(#stripesRose)"
                    : "url(#stripes)"
                  : "none";
            return (
              <g
                key={i}
                style={{
                  filter: `drop-shadow(0 0 ${passed || rose ? 12 : 4}px ${rose ? "rgba(224,69,123,0.9)" : "rgba(244,241,234,0.55)"})`,
                }}
              >
                <path
                  d={d}
                  fill={fill}
                  fillOpacity={shade}
                  stroke={stroke}
                  strokeWidth={3.5}
                  strokeLinejoin="round"
                />
                {sym.level === "mid" ? (
                  <circle
                    cx={x + w / 2}
                    cy={sym.y - h / 2}
                    r={6.5}
                    fill={stroke}
                    opacity={shade}
                  />
                ) : null}
              </g>
            );
          })}
          {/* reading playhead */}
          {playOn ? (
            <line
              x1={CX - 320}
              x2={CX + 320}
              y1={playhead}
              y2={playhead}
              stroke={COLOR.gold}
              strokeWidth={2}
              style={{ filter: "drop-shadow(0 0 10px rgba(232,194,122,1))" }}
            />
          ) : null}
        </svg>
      </AbsoluteFill>
      <FilmLook />
    </AbsoluteFill>
  );
};
