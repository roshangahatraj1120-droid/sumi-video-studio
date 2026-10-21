import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { condensed, display, sans } from "../egypt/theme";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// Text floating in perspective; letters arrive left-to-right, then drift apart and evaporate (ref #5)
export const Track3D: React.FC<{
  text: string;
  top: number;
  left?: number;
  size?: number;
  weight?: number;
  color?: string;
  start?: number;
  rotate?: number;
  font?: string;
}> = ({
  text,
  top,
  left,
  size = 44,
  weight = 600,
  color = "#F6EBD2",
  start = 4,
  rotate = -16,
  font = sans,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const chars = text.split("");
  const outStart = durationInFrames - 14;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: left ?? 0,
        width: left === undefined ? "100%" : undefined,
        textAlign: left === undefined ? "center" : "left",
        perspective: 900,
      }}
    >
      <div
        style={{
          display: "inline-block",
          transform: `rotateY(${rotate}deg) rotateX(4deg) translateX(${interpolate(frame, [0, durationInFrames], [40, -40])}px)`,
          fontFamily: font,
          fontWeight: weight,
          fontSize: size,
          letterSpacing: `${interpolate(frame, [start, durationInFrames], [0.28, 0.46], clamp)}em`,
          color,
          textShadow:
            "0 0 18px rgba(255,214,150,0.35), 0 2px 10px rgba(0,0,0,0.6)",
          whiteSpace: "pre",
        }}
      >
        {chars.map((c, i) => {
          const inT = interpolate(
            frame,
            [start + i * 0.9, start + i * 0.9 + 8],
            [0, 1],
            clamp,
          );
          const outT = interpolate(
            frame,
            [outStart + i * 0.5, outStart + i * 0.5 + 8],
            [0, 1],
            clamp,
          );
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: inT * (1 - outT),
                filter: `blur(${(1 - inT) * 6 + outT * 6}px)`,
                translate: `${outT * 30}px 0px`,
              }}
            >
              {c}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Huge word cropped by the frame, thin or heavy weight, sliding sideways (ref #7)
export const BigWord: React.FC<{
  text: string;
  top: number;
  weight: number;
  size?: number;
  dir?: 1 | -1;
  kicker?: string;
  color?: string;
}> = ({
  text,
  top,
  weight,
  size = 300,
  dir = -1,
  kicker,
  color = "#FFF4DE",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {kicker ? (
        <div
          style={{
            position: "absolute",
            top: top - 50,
            width: "100%",
            textAlign: "center",
            fontFamily: sans,
            fontWeight: 300,
            fontSize: 40,
            letterSpacing: "0.06em",
            color: "#F6EBD2",
            textShadow: "0 2px 12px rgba(0,0,0,0.7)",
            opacity: interpolate(frame, [0, 8], [0, 1], clamp),
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          top,
          left: "50%",
          translate: `calc(-50% + ${interpolate(frame, [0, durationInFrames], [120 * -dir, 120 * dir])}px) 0px`,
          whiteSpace: "nowrap",
          fontFamily: sans,
          fontWeight: weight,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: weight < 300 ? "0.04em" : "-0.02em",
          background: `linear-gradient(180deg, ${color} 0%, ${color} 45%, rgba(255,244,222,0.05) 100%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          filter: "drop-shadow(0 6px 30px rgba(0,0,0,0.45))",
          opacity: interpolate(
            frame,
            [0, 6, durationInFrames - 6, durationInFrames],
            [0, 1, 1, 0],
            clamp,
          ),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// Letters pop in in random order over a brush bar (ref #8)
export const Scatter: React.FC<{
  text: string;
  top: number;
  left?: number;
  size?: number;
  start?: number;
  sub?: string;
  bar?: string;
}> = ({
  text,
  top,
  left,
  size = 120,
  start = 2,
  sub,
  bar = "rgba(122,15,18,0.62)",
}) => {
  const frame = useCurrentFrame();
  const barT = interpolate(frame, [start, start + 10], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: left ?? 0,
        width: left === undefined ? "100%" : undefined,
        textAlign: left === undefined ? "center" : "left",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "inline-block",
          padding: "0 34px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "22%",
            bottom: "14%",
            background: bar,
            transformOrigin: "left center",
            scale: `${barT} 1`,
            borderRadius: "40% 8% 30% 10% / 20% 60% 30% 50%",
            mixBlendMode: "multiply",
          }}
        />
        <div
          style={{
            position: "relative",
            fontFamily: condensed,
            fontWeight: 600,
            fontSize: size,
            lineHeight: 1.05,
            letterSpacing: "0.04em",
            color: "#FFF4DE",
            textShadow: "0 4px 18px rgba(0,0,0,0.55)",
          }}
        >
          {text.split("").map((c, i) => {
            const at = start + 2 + random(`${text}-${i}`) * 12;
            return (
              <span
                key={i}
                style={{ opacity: frame >= at ? 1 : 0, whiteSpace: "pre" }}
              >
                {c}
              </span>
            );
          })}
        </div>
        {sub ? (
          <div
            style={{
              position: "relative",
              fontFamily: sans,
              fontWeight: 500,
              fontSize: 22,
              letterSpacing: "0.42em",
              color: "#F6EBD2",
              opacity: interpolate(
                frame,
                [start + 10, start + 18],
                [0, 1],
                clamp,
              ),
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// Museum label chip: drops in, then types on; optional pointer line to a detail (ref #5)
export const Tag: React.FC<{
  label: string;
  x: number;
  y: number;
  start?: number;
  point?: [number, number];
  accent?: string;
}> = ({ label, x, y, start = 3, point, accent = "#E0B25A" }) => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [start, start + 8], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.6)),
  });
  const typed = Math.floor(
    interpolate(
      frame,
      [start + 4, start + 4 + label.length * 1.2],
      [0, label.length],
      clamp,
    ),
  );
  const line = interpolate(frame, [start + 2, start + 12], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {point ? (
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <line
            x1={x}
            y1={y + 30}
            x2={x + (point[0] - x) * line}
            y2={y + 30 + (point[1] - y - 30) * line}
            stroke={accent}
            strokeWidth={2}
            style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.8))" }}
          />
          <circle
            cx={point[0]}
            cy={point[1]}
            r={7 * line}
            fill="none"
            stroke={accent}
            strokeWidth={2}
          />
          <circle cx={point[0]} cy={point[1]} r={2.5 * line} fill={accent} />
        </svg>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          translate: `-50% ${(1 - drop) * -40}px`,
          rotate: `${(1 - drop) * -6}deg`,
          opacity: Math.min(1, drop * 1.4),
          padding: "12px 22px 12px 26px",
          backgroundColor: "rgba(16,11,8,0.78)",
          border: `1.5px solid ${accent}`,
          borderRadius: 6,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          fontFamily: condensed,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: "0.22em",
          color: accent,
          whiteSpace: "pre",
        }}
      >
        “{label.slice(0, typed)}
        <span style={{ color: "transparent" }}>{label.slice(typed)}</span>”
      </div>
    </AbsoluteFill>
  );
};

// Hand-drawn marker ellipse around a detail (ref #6)
export const Marker: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  start?: number;
  color?: string;
}> = ({ cx, cy, rx, ry, start = 6, color = "#E0B25A" }) => {
  const frame = useCurrentFrame();
  const d = interpolate(frame, [start, start + 16], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const path = `M ${cx + rx * 0.9} ${cy - ry * 0.5} C ${cx + rx * 1.1} ${cy + ry * 0.9}, ${cx - rx * 1.1} ${cy + ry * 1.1}, ${cx - rx} ${cy} C ${cx - rx * 0.95} ${cy - ry * 1.15}, ${cx + rx * 0.8} ${cy - ry * 1.2}, ${cx + rx * 1.05} ${cy - ry * 0.1}`;
  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", pointerEvents: "none" }}
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - d}
        style={{ filter: "drop-shadow(0 0 6px rgba(224,178,90,0.8))" }}
      />
    </svg>
  );
};

// Gold title wiped on with a light streak
export const TitleReveal: React.FC<{
  text: string;
  top: number;
  size?: number;
  start?: number;
  kicker?: string;
}> = ({ text, top, size = 168, start = 4, kicker }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const reveal = interpolate(frame, [start, start + 26], [0, 100], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {kicker ? (
        <div
          style={{
            position: "absolute",
            top: top - 46,
            width: "100%",
            textAlign: "center",
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: "0.6em",
            color: "#E0B25A",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            opacity: interpolate(frame, [0, 10], [0, 1], clamp),
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          top,
          width: "100%",
          textAlign: "center",
          clipPath: `inset(0 ${100 - reveal}% 0 0)`,
        }}
      >
        <span
          style={{
            fontFamily: display,
            fontWeight: 600,
            fontSize: size,
            letterSpacing: `${interpolate(frame, [start, durationInFrames], [0.04, 0.09])}em`,
            background:
              "linear-gradient(180deg, #FFF1C6 0%, #E0B25A 50%, #8E5B1A 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter:
              "drop-shadow(0 0 22px rgba(224,178,90,0.5)) drop-shadow(0 6px 18px rgba(0,0,0,0.7))",
          }}
        >
          {text}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: top - 10,
          left: `${6 + reveal * 0.88}%`,
          width: 7,
          height: size * 1.25,
          rotate: "14deg",
          background:
            "linear-gradient(180deg, rgba(255,244,210,0), rgba(255,244,210,1), rgba(255,244,210,0))",
          filter: "blur(2px)",
          opacity: reveal > 0 && reveal < 100 ? 1 : 0,
        }}
      />
    </AbsoluteFill>
  );
};

// Small supporting line
export const Caption: React.FC<{
  text: string;
  top: number;
  start?: number;
  size?: number;
  left?: number;
}> = ({ text, top, start = 2, size = 44, left }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: left ?? 0,
        width: left === undefined ? "100%" : undefined,
        textAlign: left === undefined ? "center" : "left",
        fontFamily: sans,
        fontWeight: 300,
        fontSize: size,
        letterSpacing: "0.04em",
        color: "#F6EBD2",
        textShadow: "0 2px 14px rgba(0,0,0,0.85)",
        opacity: interpolate(frame, [start, start + 10], [0, 1], clamp),
        translate: `0px ${interpolate(frame, [start, start + 16], [16, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) })}px`,
      }}
    >
      {text}
    </div>
  );
};

// Darkening behind text for legibility
export const Shade: React.FC<{
  side: "top" | "bottom" | "left";
  amount?: number;
}> = ({ side, amount = 0.7 }) => (
  <AbsoluteFill
    style={{
      background:
        side === "top"
          ? `linear-gradient(180deg, rgba(0,0,0,${amount}) 0%, rgba(0,0,0,0) 45%)`
          : side === "bottom"
            ? `linear-gradient(0deg, rgba(0,0,0,${amount}) 0%, rgba(0,0,0,0) 45%)`
            : `linear-gradient(90deg, rgba(0,0,0,${amount}) 0%, rgba(0,0,0,0) 55%)`,
    }}
  />
);
