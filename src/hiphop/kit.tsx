import React, { useId } from "react";
import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";

// Hip-hop episode kit: the batch-4 reference styles (kinetic newspaper, evidence table, prints on a
// table, archive smash-cut montage) as reusable pieces. All coordinates are 1920×1080.

loadFont({
  family: "Anton",
  url: staticFile("fonts/Anton.woff2"),
  weight: "400",
});
loadFont({
  family: "JBMono",
  url: staticFile("fonts/JetBrainsMono-Medium.ttf"),
  weight: "500",
});

export const RED = "#E5322D";
export const PAPER = "#EEE7D8";
export const ANTON: React.CSSProperties = {
  fontFamily: "Anton",
  fontWeight: 400,
  textTransform: "uppercase",
  lineHeight: 0.95,
};
export const MONO: React.CSSProperties = {
  fontFamily: "JBMono",
  fontWeight: 500,
  letterSpacing: "0.08em",
};
// crushed high-contrast black and white (reference 7)
export const CRUSH = "grayscale(1) contrast(1.65) brightness(1.04)";
export const WARM = "contrast(1.08) saturate(1.05)";

export const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
export const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
export const img = (k: string) => `hiphop/${k}.jpg`;

// A word that slams in: drops from 125% with a blur and lands with a small shake.
export const Slam: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  const p = ease(frame, at, at + 6);
  const shake = t < 14 ? Math.exp(-t / 4) * 6 : 0;
  return (
    <div
      style={{
        ...style,
        opacity: Math.min(1, t / 2),
        scale: String(1.25 - 0.25 * p),
        filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
        translate: `${(random(`sx${at}${t}`) - 0.5) * shake}px ${(random(`sy${at}${t}`) - 0.5) * shake}px`,
      }}
    >
      {children}
    </div>
  );
};

// Text filled with a photo texture (reference 4's newspaper-in-the-letters look). The letters are an
// SVG clip over a real <Img>, so Remotion waits for the picture to load.
export const TexText: React.FC<{
  text: string;
  src: string;
  size: number;
  drift?: number;
  filter?: string;
  width?: number;
}> = ({ text, src, size, drift = 0, filter, width = 1900 }) => {
  const frame = useCurrentFrame();
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const h = size * 1.05;
  return (
    <div style={{ position: "relative", width, height: h, margin: "0 auto" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <clipPath id={`tx${id}`} clipPathUnits="userSpaceOnUse">
          <text
            x={width / 2}
            y={size * 0.93}
            textAnchor="middle"
            style={{
              fontFamily: "Anton",
              fontSize: size,
              textTransform: "uppercase",
            }}
          >
            {text.toUpperCase()}
          </text>
        </clipPath>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `url(#tx${id})`,
          overflow: "hidden",
          background: "#F4F1EA",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            position: "absolute",
            left: -200 - frame * drift * 10,
            top: -h * 0.6,
            width: width + 600,
            height: (width + 600) * (9 / 16),
            filter,
            mixBlendMode: "multiply",
            opacity: 0.9,
          }}
        />
      </div>
    </div>
  );
};

// Camcorder / surveillance overlay (reference 7): brackets, REC, timecode, date stamp, tags
export const Hud: React.FC<{
  date: string;
  tag?: string;
  rec?: boolean;
  label?: string;
  startTc?: number;
  opacity?: number;
}> = ({ date, tag, rec = true, label, startTc = 0, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const f = startTc + frame;
  const tc = [
    Math.floor(f / 108000),
    Math.floor(f / 1800) % 60,
    Math.floor(f / 30) % 60,
    f % 30,
  ]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
  const L = 54;
  const m = 60;
  const c = "rgba(255,255,255,0.8)";
  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <g stroke={c} strokeWidth={2} fill="none">
          <path d={`M ${m} ${m + L} V ${m} H ${m + L}`} />
          <path d={`M ${1920 - m - L} ${m} H ${1920 - m} V ${m + L}`} />
          <path d={`M ${m} ${1080 - m - L} V ${1080 - m} H ${m + L}`} />
          <path
            d={`M ${1920 - m - L} ${1080 - m} H ${1920 - m} V ${1080 - m - L}`}
          />
          <path
            d="M 940 540 H 980 M 960 520 V 560"
            strokeWidth={1.2}
            opacity={0.5}
          />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: m + 26,
          top: m + 20,
          ...MONO,
          fontSize: 24,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 12,
          textShadow: "0 0 6px rgba(0,0,0,0.8)",
        }}
      >
        {rec ? (
          <>
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                background: RED,
                opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0.15,
              }}
            />
            REC
          </>
        ) : null}
        {label ? <span>{label}</span> : null}
      </div>
      <div
        style={{
          position: "absolute",
          right: m + 26,
          top: m + 20,
          ...MONO,
          fontSize: 24,
          color: "#fff",
          textShadow: "0 0 6px rgba(0,0,0,0.8)",
        }}
      >
        {tc}
      </div>
      <div
        style={{
          position: "absolute",
          right: m + 26,
          bottom: m + 20,
          ...MONO,
          fontSize: 30,
          color: "#FFB13B",
          textShadow: "0 0 8px rgba(255,140,0,0.6)",
        }}
      >
        {date}
      </div>
      {tag ? (
        <div
          style={{
            position: "absolute",
            left: m + 26,
            bottom: m + 20,
            ...MONO,
            fontSize: 20,
            color: "#fff",
            border: "1.5px solid rgba(255,255,255,0.7)",
            padding: "6px 12px",
            textShadow: "0 0 6px rgba(0,0,0,0.8)",
          }}
        >
          {tag}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Small honesty tag for AI-made archive-style pictures
export const ReconTag: React.FC<{ opacity?: number }> = ({ opacity = 0.7 }) => (
  <div
    style={{
      position: "absolute",
      right: 60,
      bottom: 26,
      ...MONO,
      fontSize: 14,
      letterSpacing: "0.22em",
      color: "#fff",
      opacity,
    }}
  >
    VISUAL RECONSTRUCTION
  </div>
);

// Per-frame exposure flicker for the archive look
export const Flicker: React.FC<{ amount?: number }> = ({ amount = 0.07 }) => {
  const frame = useCurrentFrame();
  const v = (random(`fl${frame}`) - 0.5) * amount;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: v > 0 ? `rgba(255,255,255,${v})` : `rgba(0,0,0,${-v})`,
      }}
    />
  );
};

// Shared dark bottom shade for captions
export const SHADE =
  "linear-gradient(0deg, rgba(5,5,6,0.88) 0%, rgba(5,5,6,0.45) 22%, rgba(5,5,6,0) 42%)";

// ---------- evidence table / prints (references 5 and 6) ----------

// A table surface built from noise: warm wood grain, or the dark teal felt of reference 5
export const Table: React.FC<{ tone?: "wood" | "felt" }> = ({
  tone = "wood",
}) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const wood = tone === "wood";
  return (
    <AbsoluteFill style={{ backgroundColor: wood ? "#2A1A10" : "#17302E" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <filter id={`t${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={wood ? "0.0025 0.06" : "0.6"}
            numOctaves={wood ? 4 : 2}
            seed={7}
          />
          <feColorMatrix
            type="matrix"
            values={
              wood
                ? "0 0 0 0 0.55  0 0 0 0 0.33  0 0 0 0 0.18  0 0 0 0.9 0"
                : "0 0 0 0 0.3  0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 0.25 0"
            }
          />
        </filter>
        <rect
          width={1920}
          height={1080}
          filter={`url(#t${id})`}
          opacity={wood ? 0.55 : 1}
        />
      </svg>
      {/* lamp pool and vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 60% 65% at 50% 45%, rgba(255,210,150,0.16), rgba(0,0,0,0) 60%), radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// A photo print with a white border, lying on the table; it can drop into place
export const Print: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  rot?: number;
  at?: number;
  filter?: string;
  border?: number;
}> = ({ src, x, y, w, rot = 0, at, filter, border = 14 }) => {
  const frame = useCurrentFrame();
  const h = (w - 2 * border) * (9 / 16) + 2 * border;
  let s = 1;
  let o = 1;
  let r = rot;
  let lift = 0;
  if (at !== undefined) {
    if (frame < at) return null;
    const p = interpolate(frame, [at, at + 9], [0, 1], {
      ...clamp,
      easing: Easing.out(Easing.back(1.3)),
    });
    s = 1.35 - 0.35 * p;
    o = Math.min(1, (frame - at) / 3);
    r = rot + (1 - p) * 9;
    lift = 1 - p;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        background: "#F2EEE6",
        padding: border,
        boxSizing: "border-box",
        rotate: `${r}deg`,
        scale: String(s),
        opacity: o,
        boxShadow: `${6 + lift * 30}px ${10 + lift * 40}px ${18 + lift * 40}px rgba(0,0,0,${0.55 - lift * 0.2})`,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter,
          display: "block",
        }}
      />
    </div>
  );
};

// A strip of label tape with a typed name, stuck on at an angle
export const Tape: React.FC<{
  text: string;
  x: number;
  y: number;
  rot?: number;
  at?: number;
  size?: number;
}> = ({ text, x, y, rot = -2, at = 0, size = 30 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = interpolate(frame, [at, at + 6], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(2)),
  });
  const jag = (side: "l" | "r") =>
    Array.from({ length: 6 })
      .map((_, i) => {
        const yy = (i / 5) * 100;
        const xx = (random(`${text}${side}${i}`) * 3).toFixed(1);
        return side === "l"
          ? `${xx}% ${yy}%`
          : `${100 - Number(xx)}% ${100 - yy}%`;
      })
      .join(", ");
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        rotate: `${rot}deg`,
        scale: String(0.8 + 0.2 * p),
        opacity: p,
        background: "rgba(236,228,206,0.95)",
        clipPath: `polygon(${jag("l")}, ${jag("r")})`,
        padding: `${size * 0.28}px ${size * 0.8}px`,
        boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
        ...MONO,
        fontWeight: 500,
        fontSize: size,
        color: "#17130F",
        whiteSpace: "nowrap",
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};

// ---------- transitions ----------

// A red torn-paper band that unfolds from the centre across the frame, holding a label
export const TornBand: React.FC<{
  at: number;
  y: number;
  h: number;
  color?: string;
  children: React.ReactNode;
}> = ({ at, y, h, color = RED, children }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = interpolate(frame, [at, at + 10], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const edge = (top: boolean) =>
    Array.from({ length: 49 }).map((_, i) => {
      const xx = (i / 48) * 100;
      const j = random(`tb${top ? "t" : "b"}${i}`) * 9;
      return `${xx}% ${top ? j : 100 - j}%`;
    });
  const poly = `polygon(${edge(true).join(", ")}, ${edge(false).reverse().join(", ")})`;
  const half = (1 - p) * 50;
  return (
    <div
      style={{
        position: "absolute",
        left: -20,
        width: 1960,
        top: y - h / 2,
        height: h,
        clipPath: `inset(0 ${half}% 0 ${half}%)`,
        filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.6))",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: color,
          clipPath: poly,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// A diagonal black brush slash crosses the frame; the incoming shot is revealed behind it
export const SlashReveal: React.FC<{
  at: number;
  dur?: number;
  children: React.ReactNode;
}> = ({ at, dur = 14, children }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = interpolate(frame, [at, at + dur], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  // the edge is a line x = c + 0.55*(y - 540), moving left to right
  const c = -700 + p * 3300;
  const ragged = (off: number, seed: string) => {
    const pts: string[] = [];
    for (let i = 0; i <= 30; i++) {
      const yy = -40 + (i / 30) * 1160;
      const xx =
        c + 0.55 * (yy - 540) + off + (random(`${seed}${i}`) - 0.5) * 34;
      pts.push(`${xx.toFixed(1)}px ${yy.toFixed(1)}px`);
    }
    return pts;
  };
  const behind = ragged(-150, "sb");
  const front = ragged(0, "sf");
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: `polygon(-400px -40px, ${behind.join(", ")}, -400px 1120px)`,
        }}
      >
        {children}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "#050505",
          clipPath: `polygon(${behind.join(", ")}, ${front.reverse().join(", ")})`,
          filter: "drop-shadow(0 0 20px rgba(0,0,0,0.9))",
        }}
      />
    </AbsoluteFill>
  );
};

// Spray-paint burst: the incoming picture blooms in through organic, speckled blots
export const SprayReveal: React.FC<{
  at: number;
  dur?: number;
  src: string;
  filter?: string;
  scale?: number;
}> = ({ at, dur = 16, src, filter, scale = 1.08 }) => {
  const frame = useCurrentFrame();
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  if (frame < at) return null;
  const p = interpolate(frame, [at, at + dur], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const blobs = [
    { x: 960, y: 540, r: 1150 },
    { x: 520, y: 380, r: 700 },
    { x: 1450, y: 700, r: 760 },
    { x: 1250, y: 260, r: 520 },
    { x: 380, y: 860, r: 560 },
  ];
  const w = 1920 * scale;
  const h = 1080 * scale;
  return (
    <AbsoluteFill>
      {/* preload through Img so Remotion waits for the picture */}
      <Img
        src={staticFile(src)}
        style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          <filter id={`sp${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves={3}
              seed={4}
            />
            <feDisplacementMap in="SourceGraphic" scale={160} />
          </filter>
          <mask id={`m${id}`}>
            <g filter={`url(#sp${id})`} fill="#fff">
              {blobs.map((b, i) => {
                const local = interpolate(
                  p,
                  [i * 0.08, 0.6 + i * 0.08],
                  [0, 1],
                  clamp,
                );
                return <circle key={i} cx={b.x} cy={b.y} r={b.r * local} />;
              })}
            </g>
            {Array.from({ length: 140 }).map((_, i) => {
              const a = random(`ang${i}`) * Math.PI * 2;
              const d = (300 + random(`d${i}`) * 900) * p;
              return (
                <circle
                  key={i}
                  cx={960 + Math.cos(a) * d}
                  cy={540 + Math.sin(a) * d * 0.7}
                  r={2 + random(`r${i}`) * 9}
                  fill="#fff"
                  opacity={p < 0.95 ? 1 : 0}
                />
              );
            })}
          </mask>
        </defs>
        <image
          href={staticFile(src)}
          x={(1920 - w) / 2}
          y={(1080 - h) / 2}
          width={w}
          height={h}
          preserveAspectRatio="xMidYMid slice"
          mask={`url(#m${id})`}
          style={{ filter }}
        />
      </svg>
    </AbsoluteFill>
  );
};

// VHS-style rewind: tracking bands, jitter and a "◀◀ REWIND" label
export const RewindFx: React.FC<{ strength: number }> = ({ strength }) => {
  const frame = useCurrentFrame();
  if (strength <= 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 7 }).map((_, i) => {
        const y =
          (random(`rw${i}${Math.floor(frame / 2)}`) * 1080 +
            frame * 40 * (i + 1)) %
          1080;
        const h = 6 + random(`rh${i}${frame}`) * 40;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: y,
              width: 1920,
              height: h,
              background: `rgba(255,255,255,${0.1 + random(`ra${i}${frame}`) * 0.25 * strength})`,
              mixBlendMode: "screen",
              filter: "blur(1px)",
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 80,
          ...MONO,
          fontSize: 30,
          color: "#fff",
          opacity: strength,
          textShadow: "0 0 8px rgba(0,0,0,0.9)",
        }}
      >
        ◀◀ REWIND
      </div>
    </AbsoluteFill>
  );
};

// Thin tracked caption above a heavy line, centred (the episode's main text pair)
export const Pair: React.FC<{
  thin?: string;
  heavy: string;
  at: number;
  y?: number;
  size?: number;
  color?: string;
  x?: number;
  align?: "center" | "left";
}> = ({
  thin,
  heavy,
  at,
  y = 800,
  size = 140,
  color = "#fff",
  x = 120,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const t = ease(frame, at, at + 10);
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x,
        width: align === "center" ? 1920 : undefined,
        top: y,
        textAlign: align,
      }}
    >
      {thin ? (
        <div
          style={{
            ...TYPE.body,
            fontWeight: 300,
            fontSize: 38,
            letterSpacing: "0.12em",
            color: COLOR.white,
            opacity: t,
            marginBottom: 6,
            textShadow: "0 2px 10px rgba(0,0,0,0.9)",
          }}
        >
          {thin}
        </div>
      ) : null}
      <Slam at={at + 4}>
        <div
          style={{
            ...ANTON,
            fontSize: size,
            color,
            textShadow: "0 8px 30px rgba(0,0,0,0.85)",
            whiteSpace: "nowrap",
          }}
        >
          {heavy}
        </div>
      </Slam>
    </div>
  );
};

// A black slab label that slides in, white heavy type with a red edge (kinetic newspaper style)
export const Slab: React.FC<{
  text: string;
  at: number;
  x?: number;
  y?: number;
  size?: number;
}> = ({ text, at, x = 120, y = 780, size = 110 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = ease(frame, at, at + 9);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <div style={{ width: 12, background: RED }} />
      <div
        style={{
          background: "#070707",
          padding: "6px 26px 2px",
          ...ANTON,
          fontSize: size,
          color: "#fff",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};
