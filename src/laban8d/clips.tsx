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

// Laban — Part 8d: "…a certified analyst was later hired by the Pentagon's Office of Net Assessment…"
// Sits between the "stranger" opening of Part 8 clip 06 and Part 8b, so the whole sentence plays as
// one fast run. 30 fps. The analyst on her own depth layer with an ID bracket locking onto her, a
// white flash and whip for "later", then a speed-ramped punch into the briefing room's world map in
// cold black and white, with a red reticle locking on.
export const LEN8D = { n01: 150 };

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const RED = "#D7263D";
const CLINICAL = "saturate(0.72) contrast(1.06) brightness(1.02)";
const COLD = "grayscale(1) contrast(1.28) brightness(0.9)";
const SHADE =
  "linear-gradient(0deg, rgba(6,6,8,0.88) 0%, rgba(6,6,8,0.45) 20%, rgba(6,6,8,0) 40%)";
const CUT = 66;

// the analyst in world space (d4)
const BOX = { x0: 850, y0: 140, x1: 1320, y1: 720 };
const A_KEYS = [
  { f: 0, s: 1.22, x: 1060, y: 440 },
  { f: CUT, s: 1.4, x: 1080, y: 440, e: "drift" as const },
];

const Brackets: React.FC = () => {
  const frame = useCurrentFrame();
  // the box starts wide and snaps in onto her, like a tracker acquiring
  const t = interpolate(frame, [4, 16], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const g = (1 - t) * 90;
  const { x0, y0, x1, y1 } = {
    x0: BOX.x0 - g,
    y0: BOX.y0 - g,
    x1: BOX.x1 + g,
    y1: BOX.y1 + g,
  };
  const L = 46;
  const label = interpolate(frame, [18, 28], [0, 1], clamp);
  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
      <g
        stroke={COLOR.gold}
        strokeWidth={3}
        fill="none"
        opacity={t}
        style={{ filter: `drop-shadow(0 0 6px ${COLOR.gold})` }}
      >
        <path d={`M ${x0} ${y0 + L} V ${y0} H ${x0 + L}`} />
        <path d={`M ${x1 - L} ${y0} H ${x1} V ${y0 + L}`} />
        <path d={`M ${x0} ${y1 - L} V ${y1} H ${x0 + L}`} />
        <path d={`M ${x1 - L} ${y1} H ${x1} V ${y1 - L}`} />
      </g>
      <g opacity={label}>
        <rect
          x={BOX.x0}
          y={BOX.y0 - 52}
          width={300}
          height={38}
          fill="rgba(8,8,10,0.78)"
        />
        <rect
          x={BOX.x0}
          y={BOX.y0 - 52}
          width={5}
          height={38}
          fill={COLOR.gold}
        />
        <text
          x={BOX.x0 + 18}
          y={BOX.y0 - 26}
          fill={COLOR.gold}
          style={{ ...TYPE.label, fontSize: 19, letterSpacing: "0.2em" }}
        >
          {"MPA · CERTIFIED".slice(0, Math.ceil(15 * label))}
        </text>
      </g>
    </svg>
  );
};

// map in the h05 briefing room, top-left wall screen (world coords)
// the origin of the map's own arc
const MAP = { x: 75, y: 232 };
const Reticle: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  const r = 34 + 70 * Math.exp(-t / 5);
  const spin = 45 * Math.exp(-t / 8);
  return (
    <g
      stroke={RED}
      fill="none"
      strokeWidth={2.5}
      style={{ filter: `drop-shadow(0 0 6px ${RED})` }}
      transform={`rotate(${spin} ${MAP.x} ${MAP.y})`}
    >
      <circle cx={MAP.x} cy={MAP.y} r={r} />
      {[0, 90, 180, 270].map((a) => (
        <line
          key={a}
          x1={MAP.x + (r - 10) * Math.cos((a * Math.PI) / 180)}
          y1={MAP.y + (r - 10) * Math.sin((a * Math.PI) / 180)}
          x2={MAP.x + (r + 14) * Math.cos((a * Math.PI) / 180)}
          y2={MAP.y + (r + 14) * Math.sin((a * Math.PI) / 180)}
        />
      ))}
      <circle cx={MAP.x} cy={MAP.y} r={4} fill={RED} />
    </g>
  );
};

export const N01NetAssessment: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = interpolate(
    frame,
    [CUT - 2, CUT, CUT + 8],
    [0, 0.75, 0],
    clamp,
  );
  const rule = interpolate(frame, [CUT + 40, CUT + 56], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Finish dust={0.2}>
      <Sequence durationInFrames={CUT}>
        <Rig keys={A_KEYS} blurScale={0.3} whipOut={1}>
          <Plate
            src="laban8d/d4-plate.jpg"
            filter={`${CLINICAL} brightness(0.78) blur(2px)`}
          />
        </Rig>
        <AbsoluteFill>
          <Rig
            keys={A_KEYS.map((k) => ({ ...k, s: k.s * 1.07 }))}
            opaque={false}
            blurScale={0.3}
            whipOut={1}
          >
            <Plate src="laban8d/d4-cut.png" filter={CLINICAL} />
            <Brackets />
          </Rig>
        </AbsoluteFill>
        <AbsoluteFill style={{ background: SHADE }} />
        <CaptionAt text="a" start={2} y={790} size={44} />
        <HeroWord
          text="certified analyst"
          look="serif"
          size={130}
          y={840}
          start={4}
        />
      </Sequence>
      <Sequence from={CUT}>
        <Rig
          keys={[
            { f: 0, s: 1.1, x: 900, y: 520 },
            { f: 8, s: 1.12, x: 880, y: 500, e: "drift" },
            { f: 28, s: 2.5, x: 330, y: 230, e: "ramp" },
            { f: 84, s: 2.62, x: 330, y: 225, e: "drift" },
          ]}
          whipIn={1}
        >
          <Plate src="laban8/h05.jpg" filter={COLD} />
          <svg
            width={1920}
            height={1080}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              overflow: "visible",
            }}
          >
            <Reticle at={26} />
          </svg>
        </Rig>
        <AbsoluteFill style={{ background: SHADE }} />
        <CaptionAt
          text="was later hired by the Pentagon's"
          start={2}
          y={790}
          size={44}
        />
        <HeroWord
          text="Office of Net Assessment"
          look="heavy"
          size={92}
          y={845}
          start={28}
          color={COLOR.white}
        />
        <div
          style={{
            position: "absolute",
            left: 960 - 260 * rule,
            width: 520 * rule,
            top: 975,
            height: 4,
            background: RED,
            boxShadow: `0 0 12px ${RED}`,
          }}
        />
      </Sequence>
      <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash})` }} />
      <Sfx name="drone" at={0} volume={0.22} />
      <Sfx name="tick" at={14} volume={0.35} />
      <Sfx name="tick" at={20} volume={0.25} />
      <Sfx name="whoosh" at={CUT - 8} volume={0.5} />
      <Sfx name="hit" at={CUT} volume={0.3} />
      <Sfx name="whoosh" at={CUT + 10} volume={0.35} />
      <Sfx name="boom" at={CUT + 28} volume={0.45} />
    </Finish>
  );
};
