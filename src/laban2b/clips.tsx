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
import { COLOR, TYPE } from "../brand/tokens";
import { HeroWord } from "../brand/fx";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt } from "../laban/overlays";
import { Key, Plate, Rig } from "../laban3/rig";
import { LightSweep, Parallax } from "../laban9/fx9";

// Laban — Part 2b: modern dance breaks from ballet, and the idea of one system for all movement.
// A fuller replacement for Part 2 clips 06–07. 30 fps. Motion first, little text: depth layers that
// separate the modern dancers from the ballet line, a colour split that drains the ballet cold, a
// speed-ramped pull-back, and a moving spotlight that picks out ballet, modern dance and everyday action.
export const LEN2B = { b01: 240, b02: 270, b03: 210, b04: 270, b05: 300 };

const img = (n: number, kind: "" | "-cut" | "-plate" = "") =>
  `laban2b/a${n}${kind}${kind === "-cut" ? ".png" : ".jpg"}`;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const WARM = "sepia(0.08) saturate(1.06) contrast(1.05)";
const SHADE =
  "linear-gradient(0deg, rgba(14,8,4,0.85) 0%, rgba(14,8,4,0.45) 20%, rgba(14,8,4,0) 40%)";
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

// 01 — "By the early twentieth century, he had become one of the major figures associated with European
// modern dance…" The dancers ride their own depth layer as the camera ramps across the studio.
export const B01ModernDance: React.FC = () => (
  <Finish dust={0.3}>
    <Parallax
      plate={img(2, "-plate")}
      cut={img(2, "-cut")}
      grade={WARM}
      depth={1.08}
      rack={[60, 110, 5]}
      keys={[
        { f: 0, s: 1.28, x: 520, y: 560 },
        { f: 60, s: 1.3, x: 600, y: 560, e: "drift" },
        { f: 96, s: 1.22, x: 1180, y: 560, e: "ramp" },
        { f: 240, s: 1.12, x: 1120, y: 540, e: "drift" },
      ]}
    />
    <AbsoluteFill style={{ background: SHADE }} />
    <LightSweep at={96} dur={90} strength={0.16} />
    <CaptionAt
      text="early twentieth century · a major figure of"
      start={104}
      y={790}
      size={40}
    />
    <HeroWord
      text="European modern dance"
      look="serif"
      size={130}
      y={840}
      start={112}
    />
    <Sfx name="drone" at={0} volume={0.22} />
    <Sfx name="whoosh" at={66} volume={0.5} />
    <Sfx name="hit" at={98} volume={0.3} />
  </Finish>
);

// 02 — "…the movement culture that broke away from the established vocabulary of classical ballet."
// On the ballet line first; a ramped pan to the modern dancers, whose layer pulls forward and glows
// while the ballet behind them drains cold and falls out of focus.
export const B02BrokeAway: React.FC = () => {
  const frame = useCurrentFrame();
  const split = interpolate(frame, [96, 140], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const glow = interpolate(frame, [110, 150, 230, 270], [0, 1, 1, 0.7], clamp);
  const keys: Key[] = [
    { f: 0, s: 1.4, x: 600, y: 520 },
    { f: 80, s: 1.46, x: 640, y: 520, e: "drift" },
    { f: 104, s: 1.3, x: 1240, y: 560, e: "ramp" },
    { f: 270, s: 1.22, x: 1220, y: 560, e: "drift" },
  ];
  const near = keys.map((k) => ({ ...k, s: k.s * (1.06 + 0.04 * split) }));
  return (
    <Finish dust={0.3}>
      <Rig keys={keys}>
        <Plate
          src={img(1, "-plate")}
          filter={`grayscale(${0.75 * split}) brightness(${1 - 0.25 * split}) blur(${5 * split}px) ${WARM}`}
        />
      </Rig>
      <AbsoluteFill>
        <Rig keys={near} opaque={false}>
          <Img
            src={staticFile(img(1, "-cut"))}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
              filter: `${WARM} saturate(${1 + 0.15 * split}) drop-shadow(0 0 ${14 * glow}px rgba(232,194,122,${0.85 * glow})) drop-shadow(0 0 ${36 * glow}px rgba(232,194,122,${0.35 * glow}))`,
            }}
          />
        </Rig>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence durationInFrames={92} layout="none">
        <CaptionAt
          text="the established vocabulary of"
          start={10}
          y={790}
          size={42}
        />
        <HeroWord
          text="classical ballet"
          look="serif"
          size={140}
          y={840}
          start={18}
        />
      </Sequence>
      <HeroWord
        text="broke away."
        look="serif"
        size={180}
        y={820}
        start={126}
      />
      <Sfx name="drone" at={0} volume={0.22} />
      <Sfx name="hit" at={20} volume={0.25} />
      <Sfx name="whoosh" at={84} volume={0.6} />
      <Sfx name="boom" at={128} volume={0.5} />
    </Finish>
  );
};

// 03 — "But his project became bigger than choreography." Tight on one sketch, then a speed-ramped
// pull-back reveals the whole studio of drawings, instruments and models.
export const B03Bigger: React.FC = () => (
  <Finish dust={0.3}>
    <Rig
      keys={[
        { f: 0, s: 2.4, x: 760, y: 820 },
        { f: 70, s: 2.32, x: 800, y: 820, e: "drift" },
        { f: 110, s: 1.02, x: 960, y: 540, e: "ramp" },
        { f: 210, s: 1.06, x: 960, y: 520, e: "drift" },
      ]}
    >
      <Plate src={img(4)} filter={WARM} />
    </Rig>
    <LightSweep at={110} dur={80} strength={0.18} />
    <AbsoluteFill style={{ background: SHADE }} />
    <CaptionAt text="his project became" start={112} y={790} size={44} />
    <HeroWord
      text="bigger than choreography."
      look="serif"
      size={130}
      y={840}
      start={118}
    />
    <Sfx name="drone" at={0} volume={0.22} />
    <Sfx name="riser" at={60} volume={0.3} />
    <Sfx name="whoosh" at={88} volume={0.55} />
    <Sfx name="boom" at={112} volume={0.45} />
  </Finish>
);

// 04 — "He wanted a system capable of describing movement…" A ramped push past the people into the wall
// of notation charts, then a whip to the dancer framed by the notation and the red circle.
export const B04System: React.FC = () => (
  <Finish dust={0.3}>
    <Sequence durationInFrames={150}>
      <Rig
        keys={[
          { f: 0, s: 1.06, x: 960, y: 560 },
          { f: 40, s: 1.1, x: 980, y: 540, e: "drift" },
          { f: 76, s: 2.0, x: 1330, y: 270, e: "ramp" },
          { f: 150, s: 2.08, x: 1340, y: 270, e: "drift" },
        ]}
        whipOut={1}
      >
        <Plate src={img(5)} filter={WARM} />
      </Rig>
      <LightSweep at={80} dur={60} strength={0.16} />
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt
        text="he wanted a system capable of describing"
        start={84}
        y={790}
        size={42}
      />
      <HeroWord text="movement" look="serif" size={160} y={840} start={92} />
    </Sequence>
    <Sequence from={150}>
      <Rig
        keys={[
          { f: 0, s: 1.24, x: 1000, y: 480 },
          { f: 120, s: 1.12, x: 960, y: 520, e: "smooth" },
        ]}
        whipIn={1}
      >
        <Plate src={img(7)} filter={WARM} />
      </Rig>
      <LightSweep at={14} dur={80} strength={0.2} />
    </Sequence>
    <Sfx name="drone" at={0} volume={0.22} />
    <Sfx name="whoosh" at={50} volume={0.5} />
    <Sfx name="hit" at={78} volume={0.35} />
    <Sfx name="whoosh" at={144} volume={0.55} />
    <Sfx name="hit" at={160} volume={0.3} />
  </Finish>
);

// 05 — "…whether that movement came from ballet, modern dance – or potentially everyday human action."
// One frame holds all three. A soft spotlight (and the camera) moves from the ballerina to the modern
// dancer to the people walking and carrying, then opens to the whole room.
type Hole = { x: number; y: number; rx: number; ry: number };
const lerpHole = (a: Hole, b: Hole, t: number): Hole => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  rx: a.rx + (b.rx - a.rx) * t,
  ry: a.ry + (b.ry - a.ry) * t,
});
const BALLET: Hole = { x: 400, y: 470, rx: 380, ry: 500 };
const MODERN: Hole = { x: 1240, y: 590, rx: 430, ry: 360 };
const WALKER: Hole = { x: 720, y: 540, rx: 190, ry: 290 };
const WORKER: Hole = { x: 1630, y: 520, rx: 300, ry: 320 };
const OPEN: Hole = { x: 960, y: 540, rx: 1500, ry: 1100 };
const STOPS = [
  { at: 0, a: BALLET, b: BALLET, label: ["", "Ballet"] },
  { at: 92, a: MODERN, b: MODERN, label: ["", "Modern dance"] },
  {
    at: 178,
    a: WALKER,
    b: WORKER,
    label: ["or potentially", "Everyday action"],
  },
  { at: 262, a: OPEN, b: OPEN, label: null },
];
const Spotlight: React.FC = () => {
  const frame = useCurrentFrame();
  let i = 0;
  while (i < STOPS.length - 1 && frame >= STOPS[i + 1].at) i++;
  const cur = STOPS[i];
  const prev = STOPS[Math.max(0, i - 1)];
  const t =
    i === 0
      ? 1
      : interpolate(frame, [cur.at, cur.at + 18], [0, 1], {
          ...clamp,
          easing: Easing.inOut(Easing.cubic),
        });
  const A = lerpHole(prev.a, cur.a, t);
  const B = lerpHole(prev.b, cur.b, t);
  const intro = interpolate(frame, [0, 20], [0, 1], clamp);
  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <defs>
        <filter id="spotSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="60" />
        </filter>
        <mask
          id="spotMask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1920"
          height="1080"
        >
          <rect x={-200} y={-200} width={2320} height={1480} fill="#fff" />
          <g filter="url(#spotSoft)">
            {[A, B].map((h, k) => (
              <ellipse
                key={k}
                cx={h.x}
                cy={h.y}
                rx={h.rx}
                ry={h.ry}
                fill="#000"
              />
            ))}
          </g>
        </mask>
      </defs>
      <rect
        x={-200}
        y={-200}
        width={2320}
        height={1480}
        fill="rgba(6,3,6,0.78)"
        mask="url(#spotMask)"
        opacity={intro}
      />
    </svg>
  );
};
export const B05ThreeKinds: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.35, x: 480, y: 520 },
          { f: 88, s: 1.4, x: 500, y: 520, e: "drift" },
          { f: 110, s: 1.35, x: 1230, y: 600, e: "ramp" },
          { f: 174, s: 1.4, x: 1240, y: 600, e: "drift" },
          { f: 196, s: 1.06, x: 1160, y: 540, e: "ramp" },
          { f: 258, s: 1.08, x: 1150, y: 540, e: "drift" },
          { f: 300, s: 1.02, x: 960, y: 540, e: "smooth" },
        ]}
      >
        <Plate src={img(6)} filter={WARM} />
        <Spotlight />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      {STOPS.map((s, i) => {
        if (!s.label) return null;
        const end = STOPS[i + 1].at;
        if (frame < s.at + 6 || frame >= end) return null;
        const t = ease(frame, s.at + 6, s.at + 20);
        const out = interpolate(frame, [end - 8, end], [1, 0], clamp);
        return (
          <div
            key={s.label[1]}
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 830,
              textAlign: "center",
              opacity: t * out,
            }}
          >
            {s.label[0] ? (
              <div
                style={{
                  ...TYPE.thin,
                  fontSize: 40,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: COLOR.white,
                }}
              >
                {s.label[0]}
              </div>
            ) : null}
            <div
              style={{
                ...TYPE.heavy,
                fontSize: 120,
                lineHeight: 1,
                textTransform: "uppercase",
                color: COLOR.gold,
                scale: String(1.12 - 0.12 * t),
                textShadow: `0 0 26px ${COLOR.gold}66, 0 6px 26px rgba(0,0,0,0.85)`,
              }}
            >
              {s.label[1]}
            </div>
          </div>
        );
      })}
      <Sfx name="drone" at={0} volume={0.22} />
      <Sfx name="hit" at={8} volume={0.3} />
      <Sfx name="whoosh" at={92} volume={0.5} />
      <Sfx name="hit" at={100} volume={0.3} />
      <Sfx name="whoosh" at={178} volume={0.5} />
      <Sfx name="hit" at={186} volume={0.3} />
      <Sfx name="riser" at={232} volume={0.25} />
      <Sfx name="hit" at={264} volume={0.3} />
    </Finish>
  );
};
