import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";
import { HeroWord } from "../brand/fx";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt } from "../laban/overlays";
import { Plate, Rig } from "../laban3/rig";
import { LightSweep } from "../laban9/fx9";

// Laban — Part 10b: "A system designed partly to preserve something beautiful also demonstrated…"
// Sits right before Part 10 clip 08's "measured · classified · used". 30 fps. The warm 1920s dancer
// floats on her own depth layer; a scan line crosses the frame and everything behind it turns cold,
// measured and tracked, with markers locking onto her joints as the line passes them.
export const LEN10B = { w01: 270 };

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const PLATE = "laban10/dancer-plate.jpg";
const CUT = "laban10/dancer-cut.png";
const WARM = "sepia(0.12) saturate(1.06) contrast(1.06)";
const COLD =
  "grayscale(1) contrast(1.25) brightness(0.82) sepia(0.1) hue-rotate(170deg) saturate(0.6)";
const TRACK = "#BFE8FF";
const SCAN: [number, number] = [112, 176];
const DEPTH = 1.06;

const KEYS = [
  { f: 0, s: 1.16, x: 990, y: 450 },
  { f: 270, s: 1.32, x: 1000, y: 430, e: "smooth" as const },
];
const NEAR = KEYS.map((k) => ({ ...k, s: k.s * DEPTH }));

// joints in the photo's 1920×1080 space
const J = {
  head: [975, 215],
  neck: [940, 285],
  rSh: [850, 295],
  rEl: [770, 150],
  rHa: [660, 45],
  lSh: [990, 330],
  lEl: [1170, 360],
  lHa: [1365, 395],
  hip: [930, 500],
  fKn: [1300, 575],
  fFt: [1490, 615],
  bKn: [750, 680],
  bFt: [970, 880],
} as const;
type JName = keyof typeof J;
const BONES: [JName, JName][] = [
  ["head", "neck"],
  ["neck", "rSh"],
  ["rSh", "rEl"],
  ["rEl", "rHa"],
  ["neck", "lSh"],
  ["lSh", "lEl"],
  ["lEl", "lHa"],
  ["neck", "hip"],
  ["hip", "fKn"],
  ["fKn", "fFt"],
  ["hip", "bKn"],
  ["bKn", "bFt"],
];
const READOUTS: { j: JName; text: string; down?: boolean }[] = [
  { j: "lHa", text: "R.ARM  ↗ 12°" },
  { j: "rHa", text: "L.ARM  ↑ 81°", down: true },
  { j: "fFt", text: "LEG  → 0.4s" },
];

// where a joint sits on screen at frame f (near layer), so the marker locks as the scan line passes it
const screenX = (x: number, f: number) => {
  const t = interpolate(f, [0, 270], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const s = (KEYS[0].s + (KEYS[1].s - KEYS[0].s) * t) * DEPTH;
  const cx = KEYS[0].x + (KEYS[1].x - KEYS[0].x) * t;
  return 960 + (x - cx) * s;
};
const scanAt = (f: number) =>
  interpolate(f, SCAN, [-80, 2000], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
const lockFrame = (x: number) => {
  for (let f = SCAN[0]; f <= SCAN[1]; f++)
    if (scanAt(f) >= screenX(x, f)) return f;
  return SCAN[1];
};

const Tracking: React.FC = () => {
  const frame = useCurrentFrame();
  const lit = (n: JName) => frame >= lockFrame(J[n][0]);
  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
      <defs>
        <filter id="trk" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#trk)">
        {BONES.map(([a, b]) =>
          lit(a) && lit(b) ? (
            <line
              key={`${a}${b}`}
              x1={J[a][0]}
              y1={J[a][1]}
              x2={J[b][0]}
              y2={J[b][1]}
              stroke={TRACK}
              strokeWidth={2}
              strokeOpacity={0.7}
            />
          ) : null,
        )}
        {(Object.keys(J) as JName[]).map((n) => {
          const at = lockFrame(J[n][0]);
          if (frame < at) return null;
          const t = frame - at;
          // a ring that snaps in from large to small, like a tracker acquiring its point
          const r = 8 + 26 * Math.exp(-t / 4);
          const red = n === "lHa";
          const c = red ? "#E0303F" : TRACK;
          return (
            <g key={n}>
              <circle
                cx={J[n][0]}
                cy={J[n][1]}
                r={r}
                fill="none"
                stroke={c}
                strokeWidth={2}
                opacity={0.9}
              />
              <circle cx={J[n][0]} cy={J[n][1]} r={4} fill={c} />
              {n === "head" ? null : (
                <path
                  d={`M ${J[n][0] - 14} ${J[n][1]} h 6 M ${J[n][0] + 8} ${J[n][1]} h 6`}
                  stroke={c}
                  strokeWidth={1.5}
                  opacity={0.6}
                />
              )}
            </g>
          );
        })}
      </g>
      {READOUTS.map((r) => {
        const at = lockFrame(J[r.j][0]) + 8;
        if (frame < at) return null;
        const t = interpolate(frame, [at, at + 10], [0, 1], clamp);
        const [x, y] = J[r.j];
        const d = r.down ? 1 : -1;
        return (
          <g key={r.j} opacity={t}>
            <line
              x1={x + 10}
              y1={y + 10 * d}
              x2={x + (r.down ? 80 : 46)}
              y2={y + 46 * d}
              stroke={TRACK}
              strokeWidth={1.2}
            />
            <text
              x={x + (r.down ? 88 : 52)}
              y={y + (r.down ? 66 : -50)}
              fill={TRACK}
              style={{ ...TYPE.label, fontSize: 18, letterSpacing: "0.14em" }}
            >
              {r.text.slice(0, Math.ceil(r.text.length * t))}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const Stack: React.FC<{ cold?: boolean }> = ({ cold }) => (
  <AbsoluteFill>
    <Rig keys={KEYS}>
      <Plate src={PLATE} filter={cold ? COLD : WARM} />
    </Rig>
    <AbsoluteFill>
      <Rig keys={NEAR} opaque={false}>
        <Plate src={CUT} filter={cold ? COLD : WARM} />
        {cold ? <Tracking /> : null}
      </Rig>
    </AbsoluteFill>
    {cold ? (
      // a faint measuring grid over the cold side
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(191,232,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(191,232,255,0.07) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    ) : null}
  </AbsoluteFill>
);

export const W01Preserve: React.FC = () => {
  const frame = useCurrentFrame();
  const x = scanAt(frame);
  const scanning = frame >= SCAN[0] && frame <= SCAN[1] + 2;
  return (
    <Finish dust={0.3}>
      <Stack />
      <LightSweep at={24} dur={80} strength={0.16} />
      {frame >= SCAN[0] ? (
        <AbsoluteFill
          style={{ clipPath: `inset(0 ${Math.max(0, 1920 - x)}px 0 0)` }}
        >
          <Stack cold />
        </AbsoluteFill>
      ) : null}
      {scanning ? (
        <>
          <div
            style={{
              position: "absolute",
              left: x - 90,
              top: 0,
              width: 90,
              height: 1080,
              background:
                "linear-gradient(90deg, rgba(191,232,255,0), rgba(191,232,255,0.22))",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: x - 2,
              top: 0,
              width: 4,
              height: 1080,
              background: "#F2FBFF",
              boxShadow: "0 0 18px #BFE8FF, 0 0 50px rgba(150,210,255,0.8)",
            }}
          />
        </>
      ) : null}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(6,6,8,0.85) 0%, rgba(6,6,8,0.42) 20%, rgba(6,6,8,0) 40%)",
        }}
      />
      <Sequence durationInFrames={110} layout="none">
        <CaptionAt
          text="a system designed partly to preserve"
          start={8}
          y={790}
          size={44}
        />
        <HeroWord
          text="something beautiful"
          look="serif"
          size={140}
          y={840}
          start={16}
        />
      </Sequence>
      <Sequence from={184} layout="none">
        <HeroWord
          text="also demonstrated…"
          look="serif"
          size={140}
          y={840}
          start={0}
          color={COLOR.white}
        />
      </Sequence>
      <Sfx name="drone" at={0} volume={0.22} />
      <Sfx name="hit" at={18} volume={0.22} />
      <Sfx name="riser" at={90} volume={0.25} />
      <Sfx name="whoosh" at={SCAN[0] + 4} volume={0.5} />
      {(Object.keys(J) as JName[]).map((n) => (
        <Sfx key={n} name="tick" at={lockFrame(J[n][0])} volume={0.16} />
      ))}
      <Sfx name="hit" at={186} volume={0.3} />
    </Finish>
  );
};
