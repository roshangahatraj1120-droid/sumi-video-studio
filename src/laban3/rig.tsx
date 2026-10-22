import React, { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Camera rig over a 1920×1080 "world": every child layer (plate, text, cut-out) shares the same
// move, so text placed between a plate and its rotoscoped cut-out sits *behind* the subject.
// Speed ramps come from keyframe easing; motion blur is derived from the camera's own velocity,
// so fast moves and whip pans smear and holds stay sharp.

export type Key = {
  f: number;
  // zoom and the world point the camera looks at
  s: number;
  x: number;
  y: number;
  // easing into this key: "ramp" = slow-fast-slow burst, "drift" = linear hold, default smooth
  e?: "ramp" | "drift" | "smooth";
};

const EASE = {
  ramp: Easing.inOut(Easing.exp),
  drift: Easing.linear,
  smooth: Easing.inOut(Easing.cubic),
};
const WHIP = 8;

const camAt = (keys: Key[], f: number) => {
  let i = keys.findIndex((k) => k.f > f);
  if (i === -1) i = keys.length;
  const a = keys[Math.max(0, i - 1)];
  const b = keys[Math.min(keys.length - 1, i)];
  const t =
    a === b
      ? 0
      : interpolate(f, [a.f, b.f], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE[b.e ?? "smooth"],
        });
  const s = a.s + (b.s - a.s) * t;
  // keep the frame covered: the look-at point can't get closer to an edge than half the view
  const cx = Math.min(1920 - 960 / s, Math.max(960 / s, a.x + (b.x - a.x) * t));
  const cy = Math.min(1080 - 540 / s, Math.max(540 / s, a.y + (b.y - a.y) * t));
  return { s, cx, cy };
};

export const Rig: React.FC<{
  keys: Key[];
  whipIn?: -1 | 1;
  whipOut?: -1 | 1;
  // false for a layer stacked over another rig (a cut-out on its own depth)
  opaque?: boolean;
  children: React.ReactNode;
}> = ({ keys, whipIn, whipOut, opaque = true, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const id = `rig${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const whipP = (f: number) => {
    const inP = whipIn
      ? interpolate(f, [0, WHIP], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
      : 0;
    const outP = whipOut
      ? interpolate(
          f,
          [durationInFrames - WHIP, durationInFrames - 1],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.cubic),
          },
        )
      : 0;
    // whip in arrives from the given side; whip out leaves toward it
    return {
      p: Math.max(inP, outP),
      ox: (whipIn ?? 0) * inP * 500 - (whipOut ?? 0) * outP * 500,
    };
  };
  const screen = (f: number) => {
    const c = camAt(keys, f);
    const w = whipP(f);
    const s = c.s * (1 + 0.6 * w.p);
    return { s, tx: 960 - c.cx * s + w.ox, ty: 540 - c.cy * s, p: w.p };
  };
  const now = screen(frame);
  const prev = screen(frame - 1);
  const ds = Math.abs(now.s - prev.s) * 900;
  const bx = Math.min(48, Math.abs(now.tx - prev.tx) * 0.4 + ds + now.p * 40);
  const by = Math.min(48, Math.abs(now.ty - prev.ty) * 0.4 + ds);
  const blur = bx > 0.4 || by > 0.4;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: opaque ? "#000" : undefined,
        overflow: "hidden",
      }}
    >
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} />
        </filter>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          transformOrigin: "0 0",
          transform: `translate(${now.tx}px, ${now.ty}px) scale(${now.s})`,
          filter: blur ? `url(#${id})` : undefined,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// A full-frame image in world space (plates and their transparent cut-outs line up exactly)
export const Plate: React.FC<{
  src: string;
  filter?: string;
  style?: React.CSSProperties;
}> = ({ src, filter, style }) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: 1920,
      height: 1080,
      filter,
      ...style,
    }}
  />
);
