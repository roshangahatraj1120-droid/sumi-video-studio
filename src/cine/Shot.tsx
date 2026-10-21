import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Source images are 16:9 (3344x1882), so a crop is just {x, y, w}: normalized top-left + width (height = w)
export type Rect = { x: number; y: number; w: number };

const IMG_W = 3344;
const IMG_H = 1882;
const WHIP = 7;

const clampRect = (r: Rect): Rect => ({
  w: r.w,
  x: Math.min(Math.max(0, r.x), 1 - r.w),
  y: Math.min(Math.max(0, r.y), 1 - r.w),
});

// Colour channels split apart for the chromatic-aberration whip
export const ChannelFilters: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    {[
      ["chR", "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"],
      ["chG", "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"],
      ["chB", "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"],
    ].map(([id, values]) => (
      <filter key={id} id={id} colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values={values} />
      </filter>
    ))}
  </svg>
);

export const Shot: React.FC<{
  src: string;
  from: Rect;
  to: Rect;
  whipIn?: -1 | 0 | 1;
  whipOut?: -1 | 0 | 1;
  kicks?: number[];
  grade?: string;
  children?: React.ReactNode;
}> = ({
  src,
  from,
  to,
  whipIn = 0,
  whipOut = 0,
  kicks = [],
  grade,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });
  const a = clampRect(from);
  const b = clampRect(to);
  const r: Rect = {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    w: a.w + (b.w - a.w) * t,
  };
  const scale = 1920 / (r.w * IMG_W);

  // Whip pan in/out: fast slide + blur + channel split
  const inP = whipIn
    ? interpolate(frame, [0, WHIP], [1, 0], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : 0;
  const outP = whipOut
    ? interpolate(frame, [durationInFrames - WHIP, durationInFrames], [0, 1], {
        extrapolateLeft: "clamp",
        easing: Easing.in(Easing.cubic),
      })
    : 0;
  const slide = whipIn * inP * 520 - whipOut * outP * 520;
  const motion = Math.max(inP, outP);
  const split = motion * 22;

  const kick = kicks.reduce(
    (acc, k) => acc + (frame >= k ? 0.035 * Math.exp(-(frame - k) / 4) : 0),
    0,
  );
  const driftX = Math.sin(frame / 31) * 4 + Math.sin(frame / 11) * 1.2;
  const driftY = Math.cos(frame / 27) * 3;

  const imgStyle = (dx: number): React.CSSProperties => ({
    position: "absolute",
    left: -r.x * IMG_W * scale + dx,
    top: -r.y * IMG_H * scale,
    width: IMG_W * scale,
    height: IMG_H * scale,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          translate: `${slide + driftX}px ${driftY}px`,
          scale: String(1.02 + kick),
          filter: `${grade ?? "contrast(1.06) saturate(0.95)"}${motion > 0.02 ? ` blur(${motion * 12}px)` : ""}`,
        }}
      >
        {split > 0.5 ? (
          <AbsoluteFill
            style={{ isolation: "isolate", backgroundColor: "#000" }}
          >
            <Img
              src={staticFile(src)}
              style={{
                ...imgStyle(split),
                filter: "url(#chR)",
                mixBlendMode: "screen",
              }}
            />
            <Img
              src={staticFile(src)}
              style={{
                ...imgStyle(0),
                filter: "url(#chG)",
                mixBlendMode: "screen",
              }}
            />
            <Img
              src={staticFile(src)}
              style={{
                ...imgStyle(-split),
                filter: "url(#chB)",
                mixBlendMode: "screen",
              }}
            />
          </AbsoluteFill>
        ) : (
          <Img src={staticFile(src)} style={imgStyle(0)} />
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - motion }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
