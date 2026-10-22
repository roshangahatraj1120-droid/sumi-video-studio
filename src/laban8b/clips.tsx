import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { TYPE } from "../brand/tokens";
import { HeroWord } from "../brand/fx";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt } from "../laban/overlays";
import { Plate, Rig } from "../laban3/rig";
import { Parallax } from "../laban9/fx9";

// Laban — Part 8b: "…for a project using movement to study decision-making style." 30 fps.
// A fast insert after Part 8 clip 06. Colour first: four quick cuts with push-ins, push-outs, depth
// cut-outs and the flip chart's bars growing. Then black and white, with red only where it matters:
// a red glow round the subject, a red tracking ellipse, a red scanner over the walking studies.
export const LEN8B = { x01: 180, x02: 240 };

const img = (n: number, kind: "" | "-cut" | "-plate" = "") =>
  `laban8b/d${n}${kind}${kind === "-cut" ? ".png" : ".jpg"}`;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const RED = "#D7263D";
const WARM = "contrast(1.06) saturate(0.95)";
const BW = "grayscale(1) contrast(1.25) brightness(0.92)";
const SHADE =
  "linear-gradient(0deg, rgba(6,6,8,0.88) 0%, rgba(6,6,8,0.45) 20%, rgba(6,6,8,0) 40%)";

// Bars and a pie sweep that grow over the flip chart's own chart (world coordinates)
const ChartGrow: React.FC<{ at: number; color?: string }> = ({
  at,
  color = RED,
}) => {
  const frame = useCurrentFrame();
  const bars = [22, 34, 30, 52, 70];
  const pie = interpolate(frame, [at + 10, at + 34], [0, 0.72], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const cx = 1862;
  const cy = 490;
  const r = 34;
  const a = pie * Math.PI * 2 - Math.PI / 2;
  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <defs>
        <filter id="cg" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#cg)">
        {bars.map((h, i) => {
          const t = interpolate(frame, [at + i * 4, at + i * 4 + 14], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.back(1.4)),
          });
          return (
            <rect
              key={i}
              x={1668 + i * 22}
              y={532 - h * t}
              width={14}
              height={h * t}
              fill={color}
              opacity={0.92}
            />
          );
        })}
        {pie > 0.01 ? (
          <path
            d={`M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${pie > 0.5 ? 1 : 0} 1 ${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)} Z`}
            fill={color}
            opacity={0.9}
          />
        ) : null}
      </g>
    </svg>
  );
};

// 01 — "…for a project using movement…" Four cuts in six seconds; the words hold still under them.
const CUT = [0, 36, 72, 126, 180];
export const X01Project: React.FC = () => (
  <Finish dust={0.2}>
    <Sequence durationInFrames={CUT[1]}>
      <Parallax
        plate={img(1, "-plate")}
        cut={img(1, "-cut")}
        grade={WARM}
        depth={1.1}
        keys={[
          { f: 0, s: 1.12, x: 1040, y: 520 },
          { f: 36, s: 1.24, x: 1110, y: 490, e: "drift" },
        ]}
        whipOut={1}
      />
    </Sequence>
    <Sequence from={CUT[1]} durationInFrames={CUT[2] - CUT[1]}>
      <Parallax
        plate={img(2, "-plate")}
        cut={img(2, "-cut")}
        grade={WARM}
        depth={1.1}
        keys={[
          { f: 0, s: 1.4, x: 1230, y: 480 },
          { f: 36, s: 1.26, x: 1180, y: 500, e: "drift" },
        ]}
        whipIn={1}
        whipOut={1}
      />
    </Sequence>
    <Sequence from={CUT[2]} durationInFrames={CUT[3] - CUT[2]}>
      <Rig
        keys={[
          { f: 0, s: 1.1, x: 1100, y: 500 },
          { f: 10, s: 1.14, x: 1150, y: 500, e: "drift" },
          { f: 24, s: 2.0, x: 1700, y: 470, e: "ramp" },
          { f: 54, s: 2.06, x: 1710, y: 470, e: "drift" },
        ]}
        whipIn={1}
      >
        <Plate src={img(3)} filter={WARM} />
        <ChartGrow at={22} />
      </Rig>
    </Sequence>
    <Sequence from={CUT[3]}>
      <Rig
        keys={[
          { f: 0, s: 1.1, x: 1100, y: 480 },
          { f: 54, s: 1.3, x: 1260, y: 360, e: "drift" },
        ]}
        whipIn={1}
      >
        <Plate src={img(4)} filter={WARM} />
      </Rig>
    </Sequence>
    <AbsoluteFill style={{ background: SHADE }} />
    <CaptionAt text="for a project using" start={4} y={780} size={44} />
    <HeroWord text="Movement" look="heavy" size={150} y={830} start={8} />
    <Sfx name="hit" at={0} volume={0.35} />
    {CUT.slice(1, 4).map((f) => (
      <React.Fragment key={f}>
        <Sfx name="whoosh" at={f - 4} volume={0.45} />
        <Sfx name="hit" at={f} volume={0.3} />
      </React.Fragment>
    ))}
    {[96, 100, 104, 108, 112].map((f) => (
      <Sfx key={f} name="tick" at={f} volume={0.3} />
    ))}
  </Finish>
);

// 02 — "…to study decision-making style." Black and white; red marks the subject and the evidence.
export const X02DecisionStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [8, 30], [0, 1], clamp);
  const ring = interpolate(frame, [14, 50], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const flash = interpolate(frame, [118, 120, 128], [0, 0.7, 0], clamp);
  // red scanner box riding along the strip of walking studies on the wall (d4, world coords)
  const scan = interpolate(frame, [150, 226], [1450, 1860], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const keys2 = [
    { f: 0, s: 1.32, x: 1240, y: 480 },
    { f: 120, s: 1.5, x: 1250, y: 470, e: "drift" as const },
  ];
  return (
    <Finish dust={0.2}>
      <Sequence durationInFrames={120}>
        <Rig keys={keys2}>
          <Plate src={img(2, "-plate")} filter={BW} />
          <svg
            width={1920}
            height={1080}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <ellipse
              cx={1250}
              cy={460}
              rx={300}
              ry={360}
              fill="none"
              stroke={RED}
              strokeWidth={4}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - ring}
              transform="rotate(-12 1250 460)"
              style={{ filter: `drop-shadow(0 0 8px ${RED})` }}
            />
          </svg>
        </Rig>
        <AbsoluteFill>
          <Rig
            keys={keys2.map((k) => ({ ...k, s: k.s * 1.08 }))}
            opaque={false}
            whipOut={1}
          >
            <Img
              src={staticFile(img(2, "-cut"))}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 1920,
                height: 1080,
                filter: `${BW} drop-shadow(0 0 ${10 * glow}px ${RED}) drop-shadow(0 0 ${28 * glow}px rgba(215,38,61,0.5))`,
              }}
            />
          </Rig>
        </AbsoluteFill>
        <AbsoluteFill style={{ background: SHADE }} />
        <CaptionAt text="to study" start={10} y={830} size={50} />
      </Sequence>
      <Sequence from={120}>
        <Rig
          keys={[
            { f: 0, s: 1.1, x: 1100, y: 500 },
            { f: 14, s: 1.12, x: 1120, y: 480, e: "drift" },
            { f: 32, s: 2.0, x: 1500, y: 220, e: "ramp" },
            { f: 120, s: 2.08, x: 1520, y: 220, e: "drift" },
          ]}
          whipIn={1}
        >
          <Plate src={img(4)} filter={BW} />
          <svg
            width={1920}
            height={1080}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <rect
              x={scan - 50}
              y={30}
              width={100}
              height={180}
              fill="none"
              stroke={RED}
              strokeWidth={3}
              style={{ filter: `drop-shadow(0 0 6px ${RED})` }}
              opacity={frame >= 150 ? 1 : 0}
            />
            <rect
              x={1440}
              y={30}
              width={Math.max(0, scan - 50 - 1440)}
              height={180}
              fill={RED}
              opacity={0.18}
            />
            <path
              d="M 1300 252 C 1330 200, 1380 120, 1420 80"
              fill="none"
              stroke={RED}
              strokeWidth={4}
              strokeDasharray="10 8"
              opacity={interpolate(frame, [130, 140], [0, 1], clamp)}
              style={{ filter: `drop-shadow(0 0 6px ${RED})` }}
            />
          </svg>
        </Rig>
        <AbsoluteFill style={{ background: SHADE }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 840,
            textAlign: "center",
          }}
        >
          <span
            style={{
              ...TYPE.heavy,
              fontSize: 130,
              lineHeight: 1,
              textTransform: "uppercase",
              color: RED,
              opacity: interpolate(frame, [134, 142], [0, 1], clamp),
              textShadow: `0 0 26px rgba(215,38,61,0.55), 0 6px 26px rgba(0,0,0,0.9)`,
            }}
          >
            Decision-making style
          </span>
        </div>
      </Sequence>
      <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash})` }} />
      <Sfx name="drone" at={0} volume={0.25} />
      <Sfx name="hit" at={10} volume={0.35} />
      <Sfx name="riser" at={60} volume={0.25} />
      <Sfx name="whoosh" at={114} volume={0.55} />
      <Sfx name="glitch" at={120} volume={0.35} />
      <Sfx name="whoosh" at={140} volume={0.4} />
      <Sfx name="boom" at={154} volume={0.5} />
      {Array.from({ length: 9 }).map((_, i) => (
        <Sfx key={i} name="tick" at={160 + i * 8} volume={0.22} />
      ))}
    </Finish>
  );
};
