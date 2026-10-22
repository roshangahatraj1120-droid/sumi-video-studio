import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLOR } from "../brand/tokens";
import { HeroWord } from "../brand/fx";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt } from "../laban/overlays";
import { Plate, Rig } from "../laban3/rig";
import { LightSweep } from "../laban9/fx9";

// Laban — Part 1c: "Think about the problem." Covers the host line between Part 1 clips 03 and 04.
// 30 fps. Tight on the thinker's face (his silhouette on its own depth layer, the background out of
// focus), a speed-ramped whip pan to the red question mark as it thumps and glows, then a slow pull
// back to the whole picture, with a light sweep across the walking figures.
export const LEN1C = { z01: 270 };

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const img = (k: "" | "-cut" | "-plate" | "-red") =>
  `laban1c/q${k}${k === "-cut" || k === "-red" ? ".png" : ".jpg"}`;
const GRADE = "contrast(1.06)";
const FACE = { x: 700, y: 390 };
const QM = { x: 1080, y: 440 };
const THUMP = 54;

const KEYS = [
  { f: 0, s: 2.7, x: FACE.x, y: FACE.y },
  { f: 40, s: 2.85, x: FACE.x + 10, y: FACE.y, e: "drift" as const },
  { f: THUMP - 4, s: 2.05, x: QM.x, y: QM.y, e: "ramp" as const },
  { f: 96, s: 2.12, x: QM.x, y: QM.y, e: "drift" as const },
  { f: 236, s: 1.0, x: 960, y: 540, e: "smooth" as const },
  { f: 270, s: 1.02, x: 960, y: 540, e: "drift" as const },
];

export const Z01ThinkProblem: React.FC = () => {
  const frame = useCurrentFrame();
  // focus: background soft while we're on his face, sharp once we arrive on the question mark
  const bgBlur = interpolate(
    frame,
    [0, 36, THUMP - 6, THUMP + 6],
    [5, 5, 2, 0],
    clamp,
  );
  // the question mark lands with a thump, then breathes
  const t = frame - THUMP;
  const thump = t >= 0 ? Math.exp(-t / 7) : 0;
  const breathe = t >= 0 ? 0.35 + 0.25 * Math.sin(t / 9) : 0;
  const glow = Math.min(1, thump * 1.2 + breathe);
  const near = KEYS.map((k) => ({ ...k, s: k.s * 1.07 }));
  return (
    <Finish dust={0.35}>
      <Rig keys={KEYS} blurScale={0.22}>
        <Plate
          src={img("-plate")}
          filter={`${GRADE} blur(${bgBlur.toFixed(2)}px)`}
        />
        {/* red question mark: hot glow and a tiny scale kick on the beat */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: `${QM.x}px ${QM.y}px`,
            scale: String(1 + 0.035 * thump),
          }}
        >
          <Img
            src={staticFile(img("-red"))}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
              filter: `brightness(${1 + 0.5 * glow}) saturate(${1 + 0.3 * glow}) drop-shadow(0 0 ${30 * glow}px rgba(255,40,40,${0.75 * glow})) drop-shadow(0 0 ${80 * glow}px rgba(220,20,30,${0.45 * glow}))`,
            }}
          />
        </div>
        <LightSweep at={176} dur={70} angle={100} strength={0.22} />
      </Rig>
      <AbsoluteFill>
        <Rig keys={near} opaque={false} blurScale={0.22}>
          <Plate src={img("-cut")} filter={GRADE} />
        </Rig>
      </AbsoluteFill>
      {/* a red flash on the thump */}
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(180,10,20,${0.28 * thump})`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 18%, rgba(0,0,0,0) 34%)",
          opacity: interpolate(frame, [150, 180], [0, 1], clamp),
        }}
      />
      <Sequence from={10} durationInFrames={34} layout="none">
        <CaptionAt text="think about" start={0} y={900} size={48} />
      </Sequence>
      <Sequence from={176} layout="none">
        <CaptionAt text="think about" start={0} y={820} size={46} />
      </Sequence>
      <HeroWord
        text="the problem."
        look="serif"
        size={160}
        y={870}
        start={182}
        color={COLOR.white}
      />
      <Sfx name="drone" at={0} volume={0.3} />
      <Sfx name="whoosh" at={THUMP - 14} volume={0.6} />
      <Sfx name="boom" at={THUMP} volume={0.65} />
      <Sfx name="hit" at={THUMP} volume={0.4} />
      <Sfx name="riser" at={110} volume={0.22} />
      <Sfx name="hit" at={184} volume={0.3} />
    </Finish>
  );
};
