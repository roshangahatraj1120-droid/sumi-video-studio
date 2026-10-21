import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { COLOR, glow, TYPE } from "./tokens";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// Overlays render either on chroma green (for CapCut's Chroma key) or transparent (ProRes 4444 alpha)
export const overlaySchema = z.object({ bg: z.enum(["green", "alpha"]) });
export type OverlayProps = z.infer<typeof overlaySchema>;

export const OverlayCanvas: React.FC<
  OverlayProps & { children: React.ReactNode }
> = ({ bg, children }) => (
  <AbsoluteFill
    style={{ backgroundColor: bg === "green" ? "#00FF00" : "transparent" }}
  >
    {children}
  </AbsoluteFill>
);

// On green, soft glows key badly (green bleeds into the halo), so they are tightened
const softGlow = (bg: OverlayProps["bg"], c: string = COLOR.gold) =>
  bg === "green" ? `0 0 6px ${c}cc, 0 2px 0 rgba(0,0,0,0.55)` : glow(c);

const fadeOut = (frame: number, end: number, len = 8) =>
  interpolate(frame, [end - len, end], [1, 0], clamp);

// Keyword label: gold Montserrat caps typed on, optional white sub-line
export const Label: React.FC<{
  bg: OverlayProps["bg"];
  text: string;
  sub?: string;
  x?: number;
  y?: number;
  start?: number;
  end?: number;
  size?: number;
  align?: "left" | "center";
  // frames per character while typing
  speed?: number;
}> = ({
  bg,
  text,
  sub,
  x = 120,
  y = 860,
  start = 0,
  end,
  size = 54,
  align = "left",
  speed = 1.1,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const stop = end ?? durationInFrames;
  if (frame < start || frame >= stop) return null;
  const typed = Math.floor(
    interpolate(
      frame,
      [start, start + text.length * speed],
      [0, text.length],
      clamp,
    ),
  );
  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? x : 0,
        width: align === "center" ? "100%" : undefined,
        textAlign: align,
        top: y,
        opacity: fadeOut(frame, stop),
      }}
    >
      <div
        style={{
          ...TYPE.label,
          fontSize: size,
          color: COLOR.gold,
          textShadow: softGlow(bg),
          whiteSpace: "pre",
        }}
      >
        {text.slice(0, typed)}
        <span style={{ color: "transparent", textShadow: "none" }}>
          {text.slice(typed)}
        </span>
      </div>
      {sub ? (
        <div
          style={{
            ...TYPE.body,
            fontSize: size * 0.62,
            letterSpacing: "0.3em",
            color: COLOR.white,
            marginTop: 6,
            opacity: interpolate(frame, [start + 8, start + 16], [0, 1], clamp),
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

// Key line: gold Playfair italic lead + white Montserrat type-on with a rose cursor
export const KeyLine: React.FC<{
  bg: OverlayProps["bg"];
  lead: string;
  rest: string;
  x?: number;
  y?: number;
  start?: number;
  restAt?: number;
  leadSize?: number;
  restSize?: number;
  width?: number;
  leadAfter?: boolean;
}> = ({
  bg,
  lead,
  rest,
  x = 120,
  y = 700,
  start = 0,
  restAt,
  leadSize = 104,
  restSize = 46,
  width = 1100,
  leadAfter = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (frame < start) return null;
  const rStart = restAt ?? start + 14;
  const restEnd = rStart + rest.length * 1.4;
  const leadStart = leadAfter ? restEnd + 4 : start;
  const leadT = interpolate(frame, [leadStart, leadStart + 18], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const typed = Math.floor(
    interpolate(frame, [rStart, restEnd], [0, rest.length], clamp),
  );
  const typing = typed < rest.length;
  const cursorOn =
    (typing || Math.floor(frame / 9) % 2 === 0) &&
    !(leadAfter && frame >= leadStart);
  const leadEl = (
    <div
      style={{
        ...TYPE.headline,
        fontSize: leadSize,
        lineHeight: 1.05,
        color: COLOR.gold,
        textShadow: softGlow(bg),
        opacity: leadT,
        clipPath: `inset(0 ${100 - leadT * 100}% 0 0)`,
      }}
    >
      {lead}
    </div>
  );
  const restEl =
    frame >= rStart ? (
      <div
        style={{
          ...TYPE.body,
          fontSize: restSize,
          color: COLOR.white,
          marginTop: leadAfter ? 0 : 14,
          marginBottom: leadAfter ? 10 : 0,
        }}
      >
        {rest.slice(0, typed)}
        <span
          style={{
            display: "inline-block",
            width: restSize * 0.34,
            height: restSize * 0.95,
            marginLeft: 6,
            verticalAlign: "-0.12em",
            background: COLOR.rose,
            opacity: cursorOn ? 1 : 0,
          }}
        />
      </div>
    ) : (
      <div style={{ height: restSize * 1.3 }} />
    );
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        opacity: fadeOut(frame, durationInFrames, 10),
      }}
    >
      {leadAfter ? (
        <>
          {restEl}
          {frame >= leadStart ? (
            leadEl
          ) : (
            <div style={{ height: leadSize * 1.05 }} />
          )}
        </>
      ) : (
        <>
          {leadEl}
          {restEl}
        </>
      )}
    </div>
  );
};

// Thin + heavy contrast pair, sliding in opposite directions
export const WordPair: React.FC<{
  bg: OverlayProps["bg"];
  thin: string;
  heavy: string;
  start: number;
  end: number;
  y?: number;
  size?: number;
}> = ({ bg, thin, heavy, start, end, y = 430, size = 150 }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame >= end) return null;
  const p = interpolate(frame, [start, end], [0, 1]);
  const inT = interpolate(frame, [start, start + 8], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const o = inT * fadeOut(frame, end, 6);
  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-start", alignItems: "center" }}
    >
      <div
        style={{
          position: "absolute",
          top: y,
          width: "100%",
          textAlign: "center",
          ...TYPE.thin,
          textTransform: "uppercase",
          fontSize: size * 0.62,
          letterSpacing: "0.12em",
          color: COLOR.white,
          opacity: o,
          translate: `${(1 - p) * -60}px 0px`,
          textShadow:
            bg === "green"
              ? "0 2px 0 rgba(0,0,0,0.6)"
              : "0 2px 14px rgba(0,0,0,0.7)",
        }}
      >
        {thin}
      </div>
      <div
        style={{
          position: "absolute",
          top: y + size * 0.72,
          width: "100%",
          textAlign: "center",
          ...TYPE.heavy,
          textTransform: "uppercase",
          fontSize: size,
          letterSpacing: "-0.01em",
          lineHeight: 1,
          color: COLOR.gold,
          opacity: o,
          translate: `${(1 - p) * 60}px 0px`,
          textShadow: softGlow(bg),
        }}
      >
        {heavy}
      </div>
    </AbsoluteFill>
  );
};
