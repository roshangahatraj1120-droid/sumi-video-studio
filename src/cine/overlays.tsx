import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { condensed } from "../egypt/theme";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const bell = (frame: number, d: number) =>
  Math.sin(Math.PI * Math.min(1, Math.max(0, frame / d)));

// Warm light leak sweeping across a cut (refs #5, #8)
export const LightLeak: React.FC<{ seed?: number; strength?: number }> = ({
  seed = 0,
  strength = 1,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames;
  const k = bell(frame, durationInFrames) * strength;
  const x1 = interpolate(p, [0, 1], [-20 + seed * 10, 120]);
  const x2 = interpolate(p, [0, 1], [110, -10 + seed * 15]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 90% at ${x1}% 40%, rgba(255,150,60,${0.85 * k}), rgba(255,90,30,${0.35 * k}) 40%, rgba(0,0,0,0) 70%), radial-gradient(ellipse 45% 70% at ${x2}% 70%, rgba(255,220,150,${0.7 * k}), rgba(0,0,0,0) 65%)`,
        }}
      />
      <AbsoluteFill
        style={{ backgroundColor: `rgba(255,210,150,${0.25 * k * k})` }}
      />
    </AbsoluteFill>
  );
};

// Quick bright flash on a cut
export const Flash: React.FC<{ color?: string; strength?: number }> = ({
  color = "255,236,200",
  strength = 0.75,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundColor: `rgba(${color},${strength * bell(frame, durationInFrames)})`,
        mixBlendMode: "screen",
      }}
    />
  );
};

// Dip through black
export const Dip: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundColor: `rgba(0,0,0,${bell(frame, durationInFrames)})`,
      }}
    />
  );
};

// Diagonal torn-papyrus strip slashing across the frame to hide the cut (ref #7)
export const TornStrip: React.FC<{ dir?: 1 | -1; label?: string }> = ({
  dir = 1,
  label,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const x =
    dir > 0
      ? interpolate(p, [0, 1], [-1700, 1900])
      : interpolate(p, [0, 1], [1900, -1700]);
  const W = 1500;
  const H = 2400;
  const edge = (side: 0 | 1) => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const y = (i / 60) * H;
      const j =
        (random(`torn${side}${i}`) - 0.5) * 46 +
        (random(`tornb${side}${i}`) > 0.85 ? 30 : 0);
      pts.push(`${side ? W + j : j},${y}`);
    }
    return side ? pts.reverse() : pts;
  };
  const poly = [...edge(0), ...edge(1)].join(" ");
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <svg
        width={W + 80}
        height={H}
        style={{
          position: "absolute",
          left: x,
          top: -660,
          rotate: "22deg",
          overflow: "visible",
        }}
      >
        <defs>
          <filter id="papyrus">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.25"
              numOctaves={3}
              seed={4}
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.86  0 0 0 0 0.74  0 0 0 0 0.52  0 0 0 0.6 0"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <polygon points={poly} fill="#DCC08E" transform="translate(-18 0)" />
        <polygon points={poly} fill="#0B0806" />
        <polygon
          points={poly}
          fill="#000"
          filter="url(#papyrus)"
          opacity={0.18}
        />
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: x + 420,
            top: 470,
            rotate: "22deg",
            fontFamily: condensed,
            fontWeight: 600,
            fontSize: 54,
            letterSpacing: "0.3em",
            color: "#F6EBD2",
          }}
        >
          {label}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Shared colour grade: teal in the shadows, warm highlights and halation
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        backgroundColor: "#0b3c4a",
        mixBlendMode: "soft-light",
        opacity: 0.42,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, rgba(255,190,110,0.10), rgba(0,0,0,0) 60%)",
        mixBlendMode: "screen",
      }}
    />
  </AbsoluteFill>
);

// Words building into one connected line across the montage (music · movement · ceremony · celebration)
export const ConnectRow: React.FC<{ words: string[]; times: number[] }> = ({
  words,
  times,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    clamp,
  );
  const lineW = interpolate(
    frame,
    [times[0], times[times.length - 1] + 10],
    [0, 1],
    clamp,
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <div
        style={{
          position: "absolute",
          left: 260,
          right: 260,
          top: 956,
          height: 2,
          background:
            "linear-gradient(90deg, rgba(224,178,90,0), #E0B25A 15%, #E0B25A 85%, rgba(224,178,90,0))",
          transformOrigin: "left",
          scale: `${lineW} 1`,
          boxShadow: "0 0 10px rgba(224,178,90,0.8)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 260,
          right: 260,
          top: 900,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: condensed,
          fontWeight: 500,
          fontSize: 34,
          letterSpacing: "0.3em",
        }}
      >
        {words.map((w, i) => {
          const on = frame >= times[i];
          const current =
            on && (i === words.length - 1 || frame < times[i + 1]);
          return (
            <div
              key={w}
              style={{
                color: current ? "#FFE3A3" : "rgba(246,235,210,0.55)",
                textShadow: current
                  ? "0 0 16px rgba(224,178,90,0.9)"
                  : "0 2px 10px rgba(0,0,0,0.8)",
                opacity: on ? 1 : 0,
                translate: `0px ${on ? Math.max(0, 12 - (frame - times[i]) * 2) : 12}px`,
              }}
            >
              {w}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
