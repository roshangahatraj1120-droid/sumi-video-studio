import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Camera framing over a cover-fitted image: zoom, offset (% of frame), rotation (deg)
export type Cam = { s: number; x?: number; y?: number; r?: number };

export const GRADES = {
  sepiaGold: "grayscale(0.25) sepia(0.38) saturate(1.05) contrast(1.08)",
  bwRose: "grayscale(1) contrast(1.22) brightness(0.95)",
  cool: "saturate(1.1) contrast(1.06) brightness(0.98)",
  natural: "contrast(1.05) saturate(0.98)",
};

const WHIP = 7;
const GLITCH = 5;

export const Still: React.FC<{
  src: string;
  from: Cam;
  to: Cam;
  // Seconds-free camera path: [start, end] frames of the move inside the clip (defaults to whole clip)
  move?: [number, number];
  ease?: (t: number) => number;
  grade?: string;
  whipIn?: -1 | 0 | 1;
  whipOut?: -1 | 0 | 1;
  glitchIn?: boolean;
  kicks?: number[];
  rose?: boolean;
  // CSS object-position for the cover fit, e.g. "50% 15%" to keep a head in frame
  pos?: string;
  children?: React.ReactNode;
}> = ({
  src,
  from,
  to,
  move,
  ease = Easing.bezier(0.33, 0, 0.2, 1),
  grade = GRADES.natural,
  whipIn = 0,
  whipOut = 0,
  glitchIn = false,
  kicks = [],
  rose = false,
  pos = "50% 50%",
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const [m0, m1] = move ?? [0, durationInFrames];
  const t = interpolate(frame, [m0, m1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const lerp = (a: number, b: number) => a + (b - a) * t;
  const s = lerp(from.s, to.s);
  const x = lerp(from.x ?? 0, to.x ?? 0);
  const y = lerp(from.y ?? 0, to.y ?? 0);
  const r = lerp(from.r ?? 0, to.r ?? 0);

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
  const motion = Math.max(inP, outP);
  const slide = whipIn * inP * 520 - whipOut * outP * 520;
  const glitch = glitchIn && frame < GLITCH ? 1 - frame / GLITCH : 0;
  const split = motion * 22 + glitch * 26;
  const kick = kicks.reduce(
    (acc, k) => acc + (frame >= k ? 0.04 * Math.exp(-(frame - k) / 4) : 0),
    0,
  );
  const driftX = Math.sin(frame / 31) * 4 + Math.sin(frame / 11) * 1.2;
  const driftY = Math.cos(frame / 27) * 3;

  const img = (dx: number, extra?: React.CSSProperties) => (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: pos,
        translate: `${dx}px 0px`,
        ...extra,
      }}
    />
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          translate: `calc(${x}% + ${slide + driftX}px) calc(${y}% + ${driftY}px)`,
          scale: String(s * (1 + kick)),
          rotate: `${r}deg`,
          filter: `${grade}${motion > 0.02 ? ` blur(${motion * 12}px)` : ""}`,
        }}
      >
        {split > 0.5 ? (
          <AbsoluteFill
            style={{ isolation: "isolate", backgroundColor: "#000" }}
          >
            {img(split, { filter: "url(#chR)", mixBlendMode: "screen" })}
            {img(0, { filter: "url(#chG)", mixBlendMode: "screen" })}
            {img(-split, { filter: "url(#chB)", mixBlendMode: "screen" })}
          </AbsoluteFill>
        ) : (
          img(0)
        )}
        {glitch > 0
          ? [0, 1, 2].map((i) => {
              const top = random(`gl${frame}${i}`) * 90;
              return (
                <AbsoluteFill
                  key={i}
                  style={{
                    clipPath: `inset(${top}% 0 ${100 - top - 6}% 0)`,
                    translate: `${(random(`gx${frame}${i}`) - 0.5) * 120}px 0px`,
                  }}
                >
                  {img(0)}
                </AbsoluteFill>
              );
            })
          : null}
      </AbsoluteFill>
      {rose ? (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 85% 15%, rgba(224,69,123,0.45), rgba(224,69,123,0) 55%)",
            mixBlendMode: "screen",
          }}
        />
      ) : null}
      <AbsoluteFill style={{ opacity: 1 - motion }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
