import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR, TYPE } from "./tokens";

const W = 1920;
const H = 1080;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------- Torn-paper reveal ----------
// The incoming shot is revealed behind a ragged paper edge that sweeps across the frame.
const TornInner: React.FC<{
  dur: number;
  dir: 1 | -1;
  seed: string;
  children: React.ReactNode;
}> = ({ dur, dir, seed, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, dur], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  // edge travels from off one side to off the other
  const edge = dir === 1 ? W + 140 - p * (W + 340) : -140 + p * (W + 340);
  const pts = (offset: number) => {
    const out: string[] = [];
    for (let i = 0; i <= 44; i++) {
      const y = -20 + (i / 44) * (H + 40);
      const jag =
        (random(`${seed}a${i}`) - 0.5) * 40 +
        (random(`${seed}b${i}`) > 0.8 ? 22 : 0);
      const x = edge + (y - H / 2) * 0.14 * dir + jag * dir + offset;
      out.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`);
    }
    const far = dir === 1 ? W + 400 : -400;
    return `polygon(${out.join(", ")}, ${far}px ${H + 40}px, ${far}px -40px)`;
  };
  return (
    <AbsoluteFill
      style={{ filter: `drop-shadow(${-10 * dir}px 0 16px rgba(0,0,0,0.65))` }}
    >
      <AbsoluteFill
        style={{ backgroundColor: "#E9DDC4", clipPath: pts(-18 * dir) }}
      />
      <AbsoluteFill style={{ clipPath: pts(0) }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TornReveal: React.FC<{
  at: number;
  dur?: number;
  dir?: 1 | -1;
  seed?: string;
  children: React.ReactNode;
}> = ({ at, dur = 18, dir = 1, seed = "torn", children }) => (
  <Sequence from={at} layout="absolute-fill">
    <TornInner dur={dur} dir={dir} seed={seed}>
      {children}
    </TornInner>
  </Sequence>
);

// ---------- Split screen ----------
// Panels slide in one after another and share the width; each keeps full-frame scale (centre crop).
export type Panel = {
  start: number;
  node: React.ReactNode;
  label?: React.ReactNode;
};

export const SplitPanels: React.FC<{ panels: Panel[]; ease?: number }> = ({
  panels,
  ease = 14,
}) => {
  const frame = useCurrentFrame();
  const weights = panels.map((p, i) =>
    i === 0
      ? 1
      : interpolate(frame, [p.start, p.start + ease], [0, 1], {
          ...clamp,
          easing: Easing.inOut(Easing.cubic),
        }),
  );
  const total = weights.reduce((a, b) => a + b, 0);
  let x = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {panels.map((p, i) => {
        const w = (W * weights[i]) / total;
        const left = x;
        x += w;
        if (w < 1) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left,
              top: 0,
              width: w,
              height: H,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: (w - W) / 2,
                top: 0,
                width: W,
                height: H,
              }}
            >
              <Sequence from={p.start} layout="absolute-fill">
                {p.node}
              </Sequence>
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(0deg, rgba(8,4,2,0.85) 0%, rgba(8,4,2,0.45) 18%, rgba(8,4,2,0) 36%)",
              }}
            />
            {p.label ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 70,
                  textAlign: "center",
                }}
              >
                <Sequence from={p.start + 6} layout="none">
                  {p.label}
                </Sequence>
              </div>
            ) : null}
            {i > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 3,
                  height: H,
                  background: COLOR.gold,
                  boxShadow: `0 0 14px ${COLOR.gold}`,
                  opacity: weights[i],
                }}
              />
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Thin word over a heavy gold word, sized to sit inside a split panel
export const PanelLabel: React.FC<{
  thin: string;
  heavy: string;
  heavySize?: number;
}> = ({ thin, heavy, heavySize = 104 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 12], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ opacity: t, translate: `0px ${(1 - t) * 30}px` }}>
      <div
        style={{
          ...TYPE.thin,
          fontSize: 50,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: COLOR.white,
          textShadow: "0 2px 12px rgba(0,0,0,0.9)",
        }}
      >
        {thin}
      </div>
      <div
        style={{
          ...TYPE.heavy,
          fontSize: heavySize,
          lineHeight: 1,
          textTransform: "uppercase",
          color: COLOR.gold,
          scale: String(1.15 - 0.15 * t),
          textShadow: `0 0 22px ${COLOR.gold}77, 0 4px 18px rgba(0,0,0,0.9)`,
        }}
      >
        {heavy}
      </div>
    </div>
  );
};

// ---------- Hero word ----------
// Big highlight word: letters rise in out of blur; optionally evaporate letter by letter at the end.
export const HeroWord: React.FC<{
  text: string;
  start: number;
  end?: number;
  size: number;
  look: "heavy" | "serif" | "thin";
  color?: string;
  x?: number;
  right?: number;
  y: number;
  align?: "left" | "center" | "right";
  evaporate?: boolean;
  glitch?: boolean;
}> = ({
  text,
  start,
  end,
  size,
  look,
  color = COLOR.gold,
  x,
  right,
  y,
  align = "center",
  evaporate = false,
  glitch = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const stop = end ?? durationInFrames;
  if (frame < start || frame >= stop) return null;
  const font =
    look === "heavy"
      ? {
          ...TYPE.heavy,
          textTransform: "uppercase" as const,
          letterSpacing: "-0.01em",
        }
      : look === "serif"
        ? { ...TYPE.headline }
        : { ...TYPE.thin, letterSpacing: "0.04em" };
  const chars = text.split("");
  const outLen = evaporate ? 30 : 8;
  const jitter =
    glitch && (frame - start < 8 || Math.floor(frame / 3) % 9 === 0)
      ? (random(`hw${frame}`) - 0.5) * 18
      : 0;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x ?? (align === "center" ? 0 : undefined),
        right: right,
        width: align === "center" && x === undefined ? "100%" : undefined,
        textAlign: align,
        whiteSpace: "pre",
        ...font,
        fontSize: size,
        lineHeight: 1,
        color,
        translate: `${jitter}px 0px`,
        textShadow: glitch
          ? `${4 + Math.abs(jitter) / 3}px 0 0 rgba(224,69,123,0.75), ${-4 - Math.abs(jitter) / 3}px 0 0 rgba(90,200,255,0.6), 0 6px 26px rgba(0,0,0,0.85)`
          : `0 0 26px ${color}66, 0 6px 26px rgba(0,0,0,0.85)`,
      }}
    >
      {chars.map((c, i) => {
        const t0 = start + i * 1.6;
        const inT = interpolate(frame, [t0, t0 + 12], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        const o0 = stop - outLen + (evaporate ? i * 1.4 : 0);
        const outT = interpolate(
          frame,
          [o0, o0 + (evaporate ? 14 : 8)],
          [0, 1],
          clamp,
        );
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: inT * (1 - outT),
              filter: `blur(${(1 - inT) * 10 + outT * (evaporate ? 12 : 0)}px)`,
              translate: `0px ${(1 - inT) * size * 0.25 - outT * (evaporate ? size * 0.3 : 0)}px`,
            }}
          >
            {c}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Scramble reveal ----------
// Letters cycle through data characters before locking in, left to right.
const GLYPHS = "01ABCDEFGHJKLMNPQRSTUVWXYZ#%&@";
export const ScrambleWord: React.FC<{
  text: string;
  start: number;
  size: number;
  y: number;
  x?: number;
}> = ({ text, start, size, y, x = 120 }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const glow = interpolate(
    frame,
    [start + text.length * 2.6, start + text.length * 2.6 + 12],
    [0, 1],
    clamp,
  );
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        ...TYPE.heavy,
        fontSize: size,
        lineHeight: 1,
        textTransform: "uppercase",
        whiteSpace: "pre",
        color: COLOR.gold,
        textShadow: `0 0 ${18 + glow * 30}px ${COLOR.gold}${glow > 0.5 ? "aa" : "66"}, 0 6px 26px rgba(0,0,0,0.85)`,
      }}
    >
      {text.split("").map((c, i) => {
        const lock = start + 6 + i * 2.6;
        const locked = frame >= lock;
        const visible = frame >= start + i * 0.8;
        const ch = locked
          ? c
          : GLYPHS[
              Math.floor(
                random(`sc${i}-${Math.floor(frame / 2)}`) * GLYPHS.length,
              )
            ];
        return (
          <span
            key={i}
            style={{
              position: "relative",
              display: "inline-block",
              opacity: visible ? 1 : 0,
            }}
          >
            <span style={{ color: "transparent", textShadow: "none" }}>
              {c}
            </span>
            <span
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                textAlign: "center",
                color: locked ? COLOR.gold : "rgba(150,210,255,0.85)",
              }}
            >
              {ch}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// ---------- Montage title ----------
// Numbered two-tier topic title: small rose index, big gold key word, white remainder.
export const TopicTitle: React.FC<{
  index: number;
  word: string;
  rest?: string;
  start: number;
  end: number;
}> = ({ index, word, rest, start, end }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame >= end) return null;
  const t = interpolate(frame, [start, start + 7], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const out = interpolate(frame, [end - 4, end], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 110, bottom: 80, opacity: out }}>
      <div
        style={{
          ...TYPE.label,
          fontSize: 30,
          letterSpacing: "0.3em",
          color: COLOR.rose,
          opacity: t,
          textShadow: "0 2px 10px rgba(0,0,0,0.9)",
        }}
      >
        {String(index).padStart(2, "0")} / 08
      </div>
      <div
        style={{
          ...TYPE.heavy,
          fontSize: 132,
          lineHeight: 1,
          textTransform: "uppercase",
          color: COLOR.gold,
          scale: String(1.18 - 0.18 * t),
          transformOrigin: "left bottom",
          opacity: t,
          textShadow: `0 0 24px ${COLOR.gold}66, 0 5px 22px rgba(0,0,0,0.9)`,
        }}
      >
        {word}
      </div>
      {rest ? (
        <div
          style={{
            ...TYPE.body,
            fontSize: 46,
            letterSpacing: "0.08em",
            color: COLOR.white,
            marginTop: 8,
            opacity: interpolate(frame, [start + 4, start + 10], [0, 1], clamp),
            textShadow: "0 2px 12px rgba(0,0,0,0.9)",
          }}
        >
          {rest}
        </div>
      ) : null}
    </div>
  );
};
