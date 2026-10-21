import React from "react";
import {
  AbsoluteFill,
  Img,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C, GLYPHS, glyphs } from "./theme";

// Torch flicker in roughly 0.85..1.1
export const flicker = (f: number, seed = 0) =>
  1 +
  0.05 * Math.sin(f * 0.83 + seed) +
  0.035 * Math.sin(f * 2.31 + seed * 2) +
  0.02 * Math.sin(f * 5.7 + seed * 3);

// Handheld camera: slow drift, tiny rotation, optional push and focus
export const Camera: React.FC<{
  children: React.ReactNode;
  scale?: number;
  x?: number;
  y?: number;
  blur?: number;
  shake?: number;
}> = ({ children, scale = 1, x = 0, y = 0, blur = 0, shake = 0 }) => {
  const f = useCurrentFrame();
  const dx =
    Math.sin(f / 37) * 6 + Math.sin(f / 13 + 1) * 2 + Math.sin(f * 1.9) * shake;
  const dy =
    Math.cos(f / 29) * 5 +
    Math.sin(f / 17 + 2) * 1.5 +
    Math.cos(f * 2.3) * shake;
  return (
    <AbsoluteFill
      style={{
        translate: `${x + dx}px ${y + dy}px`,
        scale: String(scale),
        rotate: `${Math.sin(f / 41) * 0.15}deg`,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// The tomb wall image, positioned in a 2600x1500 "world"
export const WallImage: React.FC<{ brightness?: number }> = ({
  brightness = 1,
}) => (
  <Img
    src={staticFile("egypt/wall.jpg")}
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: 2600,
      height: 1500,
      filter: `brightness(${brightness})`,
    }}
  />
);

export type Light = { x: number; y: number; radius: number; seed?: number };

// Darkness everywhere except warm pools of torchlight (several lights don't stack their darkness)
export const TorchLight: React.FC<{ lights: Light[]; warmth?: number }> = ({
  lights,
  warmth = 1,
}) => {
  const f = useCurrentFrame();
  const sized = lights.map((l) => ({
    ...l,
    r: Math.max(1, l.radius * flicker(f, l.seed ?? 0)),
  }));
  const masks = sized
    .map(
      (l) =>
        `radial-gradient(circle ${l.r * 1.15}px at ${l.x}px ${l.y}px, transparent 0%, rgba(0,0,0,0.4) 50%, black 100%)`,
    )
    .join(", ");
  return (
    <>
      <AbsoluteFill
        style={{
          background: sized
            .map(
              (l) =>
                `radial-gradient(circle ${l.r}px at ${l.x}px ${l.y}px, rgba(255,170,80,${0.22 * warmth}) 0%, rgba(255,120,40,${0.1 * warmth}) 45%, rgba(0,0,0,0) 75%)`,
            )
            .join(", "),
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(10,7,5,0.94)",
          maskImage: masks,
          WebkitMaskImage: masks,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
    </>
  );
};

// Dust motes floating through the light
export const Dust: React.FC<{
  count?: number;
  seed?: string;
  opacity?: number;
}> = ({ count = 60, seed = "d", opacity = 1 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      <svg width={1920} height={1080}>
        {Array.from({ length: count }).map((_, i) => {
          const r = (k: string) => random(`${seed}${k}${i}`);
          const x =
            ((r("x") * 2100 +
              f * (0.2 + r("vx") * 0.5) +
              Math.sin(f / 30 + i) * 12) %
              2000) -
            40;
          const y =
            ((r("y") * 1200 - f * (0.15 + r("vy") * 0.35) + 1200) % 1200) - 60;
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / (12 + r("t") * 20) + i));
          const size = 0.8 + r("s") * 2.4;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={size}
              fill={r("c") > 0.7 ? "#ffd59a" : "#f6e6c8"}
              opacity={(0.25 + r("o") * 0.5) * tw}
              style={size > 2.6 ? { filter: "blur(1.5px)" } : undefined}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// Columns of carved hieroglyphs (decorative); x/y in world px
export const GlyphColumns: React.FC<{
  x: number;
  y: number;
  columns: number;
  rows: number;
  seed: string;
  size?: number;
  painted?: boolean;
  opacity?: number;
  color?: string;
}> = ({
  x,
  y,
  columns,
  rows,
  seed,
  size = 64,
  painted = false,
  opacity = 1,
  color,
}) => {
  const colW = size * 1.35;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        opacity,
        fontFamily: glyphs,
        fontSize: size,
        lineHeight: 1.18,
      }}
    >
      {Array.from({ length: columns }).map((_, c) => (
        <div
          key={c}
          style={{
            width: colW,
            textAlign: "center",
            borderLeft: "2px solid rgba(60,35,18,0.45)",
            borderRight:
              c === columns - 1 ? "2px solid rgba(60,35,18,0.45)" : undefined,
            color:
              color ??
              (painted
                ? c % 2
                  ? "rgba(43,76,140,0.85)"
                  : "rgba(40,24,12,0.8)"
                : "rgba(52,30,15,0.72)"),
            textShadow: color
              ? undefined
              : "1.5px 1.5px 0 rgba(255,228,185,0.28), -1px -1px 0 rgba(0,0,0,0.35)",
          }}
        >
          {Array.from({ length: rows }).map((__, r) => (
            <div key={r}>
              {GLYPHS[Math.floor(random(`${seed}-${c}-${r}`) * GLYPHS.length)]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Painted block border used above and below a register of figures
export const RegisterBorder: React.FC<{
  x: number;
  y: number;
  width: number;
  h?: number;
}> = ({ x, y, width, h = 26 }) => {
  const colors = [C.lapis, C.ochre, C.turquoise, C.ochre];
  const block = 34;
  const n = Math.ceil(width / block);
  return (
    <svg
      width={width}
      height={h + 8}
      style={{ position: "absolute", left: x, top: y, opacity: 0.92 }}
    >
      <rect x={0} y={0} width={width} height={4} fill="#1e120a" />
      {Array.from({ length: n }).map((_, i) => (
        <rect
          key={i}
          x={i * block + 2}
          y={6}
          width={block - 4}
          height={h - 4}
          fill={colors[i % colors.length]}
          opacity={0.75 + random(`rb${x}${i}`) * 0.25}
        />
      ))}
      <rect x={0} y={h + 4} width={width} height={4} fill="#1e120a" />
    </svg>
  );
};

// Paint wear: speckled plaster showing through painted figures
export const PaintWear: React.FC<{ id: string }> = ({ id }) => (
  <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.06"
      numOctaves={3}
      seed={9}
      result="n"
    />
    <feColorMatrix
      in="n"
      type="matrix"
      values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -5 4.3"
      result="m"
    />
    <feComposite in="SourceGraphic" in2="m" operator="in" />
  </filter>
);
