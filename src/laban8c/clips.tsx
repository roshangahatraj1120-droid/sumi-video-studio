import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";
import { HeroWord, PanelLabel, SplitPanels } from "../brand/fx";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt } from "../laban/overlays";
import { Plate, Rig } from "../laban3/rig";
import { LightSweep } from "../laban9/fx9";

// Laban — Part 8c: a faster pair for Part 8's "…characteristic patterns connected to how that person
// approached decisions" and "The Warren Lamb Trust says MPA has been used with tens of thousands of
// people, particularly in management and organizational settings." Replaces Part 8 clips 03–04. 30 fps.
export const LEN8C = { c01: 210, c02: 240 };

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const RED = "#D7263D";
const COOL = "contrast(1.08) saturate(0.7) brightness(0.9)";
const BW = "grayscale(1) contrast(1.25) brightness(0.92)";
const SHADE =
  "linear-gradient(0deg, rgba(6,6,8,0.88) 0%, rgba(6,6,8,0.45) 20%, rgba(6,6,8,0) 40%)";

// 01 — "…characteristic patterns connected to how that person approached decisions."
// The presenter on his own depth layer; strobe echoes of him build up behind him like a
// chronophotograph, a gold line threads the repeated gesture, then a whip to the analysis board
// in black and white where only "DECISION" is marked in red.
const SHOT = 105;
const GHOSTS = [
  { dx: -180, at: 22, o: 0.42 },
  { dx: -360, at: 30, o: 0.26 },
  { dx: -540, at: 38, o: 0.14 },
];
const HAND = { x: 1372, y: 385 };
const D3_KEYS = [
  { f: 0, s: 1.55, x: 1340, y: 470 },
  { f: SHOT, s: 1.12, x: 1060, y: 520, e: "smooth" as const },
];

const Echoes: React.FC = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [46, 78], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const pts = [...GHOSTS.map((g) => g.dx).reverse(), 0].map(
    (dx) => `${HAND.x + dx},${HAND.y}`,
  );
  return (
    <>
      {GHOSTS.map((g) => {
        const t = frame - g.at;
        if (t < 0) return null;
        // each echo lands as a bright strobe and settles to its level
        const o = g.o + 0.5 * Math.exp(-t / 3);
        return (
          <Img
            key={g.dx}
            src={staticFile("laban8c/d3-cut.png")}
            style={{
              position: "absolute",
              left: g.dx,
              top: 0,
              width: 1920,
              height: 1080,
              opacity: Math.min(1, o),
              filter: "grayscale(1) sepia(0.6) brightness(1.15) contrast(1.1)",
            }}
          />
        );
      })}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        <polyline
          points={pts.join(" ")}
          fill="none"
          stroke={COLOR.gold}
          strokeWidth={2.5}
          strokeDasharray="2 10"
          strokeLinecap="round"
          opacity={line > 0 ? 0.9 : 0}
          style={{
            clipPath: `inset(0 ${(1 - line) * 100}% 0 0)`,
            filter: `drop-shadow(0 0 6px ${COLOR.gold})`,
          }}
        />
        {[...GHOSTS.map((g) => g.dx), 0].map((dx, i) => (
          <circle
            key={dx}
            cx={HAND.x + dx}
            cy={HAND.y}
            r={7}
            fill={COLOR.gold}
            opacity={line >= (3 - i) / 3 ? 1 : 0}
          />
        ))}
      </svg>
    </>
  );
};

export const C01Patterns: React.FC = () => {
  const frame = useCurrentFrame();
  const box = interpolate(frame, [SHOT + 32, SHOT + 44], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Finish dust={0.2}>
      <Sequence durationInFrames={SHOT}>
        <Rig keys={D3_KEYS} blurScale={0.3}>
          <Plate
            src="laban8c/d3-plate.jpg"
            filter={`${COOL} brightness(0.8)`}
          />
        </Rig>
        <AbsoluteFill>
          <Rig
            keys={D3_KEYS.map((k) => ({ ...k, s: k.s * 1.06 }))}
            opaque={false}
            blurScale={0.3}
            whipOut={1}
          >
            <Echoes />
            <Plate src="laban8c/d3-cut.png" filter={COOL} />
          </Rig>
        </AbsoluteFill>
        <AbsoluteFill style={{ background: SHADE }} />
        <CaptionAt text="they could identify" start={6} y={790} size={44} />
        <HeroWord
          text="characteristic patterns"
          look="serif"
          size={124}
          y={840}
          start={30}
        />
      </Sequence>
      <Sequence from={SHOT}>
        <Rig
          keys={[
            { f: 0, s: 1.1, x: 1100, y: 520 },
            { f: 10, s: 1.12, x: 1120, y: 510, e: "drift" },
            { f: 30, s: 2.4, x: 1520, y: 225, e: "ramp" },
            { f: 105, s: 2.5, x: 1520, y: 225, e: "drift" },
          ]}
          whipIn={1}
        >
          <Plate src="laban8/h05.jpg" filter={BW} />
          <svg
            width={1920}
            height={1080}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <rect
              x={1734}
              y={140}
              width={110}
              height={34}
              fill={RED}
              fillOpacity={0.16 * box}
              stroke={RED}
              strokeWidth={2}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - box}
              style={{ filter: `drop-shadow(0 0 5px ${RED})` }}
            />
          </svg>
        </Rig>
        <AbsoluteFill style={{ background: SHADE }} />
        <CaptionAt
          text="connected to how that person approached"
          start={8}
          y={790}
          size={44}
        />
        <HeroWord
          text="decisions."
          look="heavy"
          size={150}
          y={840}
          start={34}
          color={RED}
        />
      </Sequence>
      <Sfx name="drone" at={0} volume={0.22} />
      {GHOSTS.map((g) => (
        <Sfx key={g.at} name="tick" at={g.at} volume={0.35} />
      ))}
      <Sfx name="hit" at={32} volume={0.25} />
      <Sfx name="whoosh" at={SHOT - 6} volume={0.5} />
      <Sfx name="whoosh" at={SHOT + 14} volume={0.35} />
      <Sfx name="hit" at={SHOT + 32} volume={0.4} />
    </Finish>
  );
};

// 02 — "The Warren Lamb Trust says MPA has been used with tens of thousands of people,
// particularly in management and organizational settings."
// A pull-back from one handshake into a wall of hundreds of sessions that switch on one by one,
// then a whip into a split screen: MANAGEMENT | ORGANIZATIONS.
const WALL = 135;
const N = 11;
const MID = (N - 1) / 2;
const PX = 2040;
const PY = 1148;
// office and workplace sessions only (no title cards, no war or therapy scenes)
const THUMBS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 22, 23];
const TILES = Array.from({ length: N * N }).map((_, i) => {
  const c = i % N;
  const r = Math.floor(i / N);
  const d = Math.hypot(c - MID, (r - MID) * 1.2);
  return {
    c,
    r,
    centre: c === MID && r === MID,
    src: `laban8c/t${String(THUMBS[Math.floor(random(`t${i}`) * THUMBS.length)]).padStart(2, "0")}.jpg`,
    on: 22 + d * 13 + random(`o${i}`) * 26,
    lvl: 0.35 + random(`l${i}`) * 0.4,
  };
});

const Wall: React.FC = () => {
  const frame = useCurrentFrame();
  const ls = interpolate(
    frame,
    [0, 14, 122],
    [Math.log(1), Math.log(1.03), Math.log(0.125)],
    { ...clamp, easing: Easing.inOut(Easing.cubic) },
  );
  const s = Math.exp(ls);
  // leave with a whip to the left
  const w = interpolate(frame, [WALL - 9, WALL], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const frameGold = interpolate(s, [0.3, 0.6], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#050506", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "960px 540px",
          transform: `translateX(${-w * 900}px) scale(${s})`,
          filter: w > 0 ? `blur(${w * 24}px)` : undefined,
        }}
      >
        {TILES.map((t, i) => {
          const o = t.centre
            ? 1
            : interpolate(frame, [t.on, t.on + 5], [0.05, t.lvl], clamp);
          return (
            <Img
              key={i}
              src={staticFile(t.centre ? "laban8/h03.jpg" : t.src)}
              style={{
                position: "absolute",
                left: (t.c - MID) * PX,
                top: (t.r - MID) * PY,
                width: 1920,
                height: 1080,
                opacity: o,
                filter: t.centre ? COOL : "contrast(1.1)",
                outline: t.centre
                  ? `${Math.max(12, 3 / s)}px solid rgba(201,162,90,${frameGold})`
                  : undefined,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Panel: React.FC<{ src: string; x: number; y: number }> = ({
  src,
  x,
  y,
}) => (
  <Rig
    keys={[
      { f: 0, s: 1.32, x, y },
      { f: 105, s: 1.18, x: x - 30, y, e: "drift" },
    ]}
    whipIn={1}
  >
    <Plate src={src} filter={COOL} />
  </Rig>
);

export const C02TensOfThousands: React.FC = () => {
  const frame = useCurrentFrame();
  const tag = interpolate(frame, [6, 20], [0, 1], clamp);
  return (
    <Finish dust={0.2}>
      <Sequence durationInFrames={WALL}>
        <Wall />
        <LightSweep at={60} dur={60} angle={100} strength={0.12} />
        <AbsoluteFill style={{ background: SHADE }} />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(6,6,8,0.8) 0%, rgba(6,6,8,0.35) 16%, rgba(6,6,8,0) 28%)",
            opacity: tag,
          }}
        />
        {/* attribution */}
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 96,
            opacity: tag,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div style={{ width: 46 * tag, height: 2, background: COLOR.gold }} />
          <span
            style={{
              ...TYPE.label,
              fontSize: 24,
              letterSpacing: "0.26em",
              color: COLOR.white,
              textShadow: "0 2px 10px rgba(0,0,0,0.9)",
            }}
          >
            ACCORDING TO THE WARREN LAMB TRUST
          </span>
        </div>
        <CaptionAt
          text="Movement Pattern Analysis has been used with"
          start={10}
          y={790}
          size={44}
        />
        <HeroWord
          text="tens of thousands"
          look="heavy"
          size={136}
          y={840}
          start={58}
        />
      </Sequence>
      <Sequence from={WALL}>
        <SplitPanels
          panels={[
            {
              start: 0,
              node: <Panel src="laban8b/d2.jpg" x={1120} y={500} />,
              label: (
                <PanelLabel
                  thin="particularly in"
                  heavy="Management"
                  heavySize={84}
                />
              ),
            },
            {
              start: 30,
              node: <Panel src="laban8/h04.jpg" x={1080} y={470} />,
              label: (
                <PanelLabel
                  thin="and in"
                  heavy="Organizations"
                  heavySize={84}
                />
              ),
            },
          ]}
        />
      </Sequence>
      <Sfx name="drone" at={0} volume={0.22} />
      <Sfx name="riser" at={20} volume={0.2} />
      {Array.from({ length: 14 }).map((_, i) => (
        <Sfx key={i} name="tick" at={30 + i * 6} volume={0.12} />
      ))}
      <Sfx name="hit" at={60} volume={0.35} />
      <Sfx name="whoosh" at={WALL - 8} volume={0.5} />
      <Sfx name="hit" at={WALL + 2} volume={0.3} />
      <Sfx name="whoosh" at={WALL + 28} volume={0.35} />
      <Sfx name="hit" at={WALL + 32} volume={0.25} />
    </Finish>
  );
};
