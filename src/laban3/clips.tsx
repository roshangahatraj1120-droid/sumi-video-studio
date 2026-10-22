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
import { GRADES, Still } from "../cine/Still";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt } from "../laban/overlays";
import { Plate, Rig } from "./rig";
import { GlyphChip } from "./symbols";
import { StickScore, STICK_LEN } from "./StickScore";

// Laban — Part 3: "How the notation works". 30 fps.
export const LEN3 = {
  q01: 180,
  q02: 210,
  q03: 150,
  q04: 180,
  q05: 180,
  q06: 150,
  q07: 300,
  q08: STICK_LEN,
};

const img = (n: number, cut = false) =>
  `laban3/l${n}${cut ? "-cut.png" : ".jpg"}`;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

// Big word placed in world space, so it can sit between a plate and its cut-out
const WorldWord: React.FC<{
  text: string;
  start: number;
  end?: number;
  x: number;
  y: number;
  size: number;
  look?: "heavy" | "thin";
  opacity?: number;
}> = ({ text, start, end = 9999, x, y, size, look = "heavy", opacity = 1 }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame >= end) return null;
  const out = interpolate(frame, [end - 10, end], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 2000,
        width: 4000,
        top: y,
        textAlign: "center",
        ...(look === "heavy" ? TYPE.heavy : TYPE.thin),
        fontSize: size,
        lineHeight: 0.9,
        textTransform: "uppercase",
        color: COLOR.gold,
        opacity: opacity * out,
        whiteSpace: "pre",
        textShadow: `0 0 40px ${COLOR.gold}66`,
      }}
    >
      {text.split("\n").map((line, li) => (
        <div key={li}>
          {line.split("").map((c, i) => {
            const t = ease(
              frame,
              start + (li * 6 + i) * 2,
              start + (li * 6 + i) * 2 + 14,
            );
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: t,
                  translate: `0px ${(1 - t) * size * 0.35}px`,
                  filter: `blur(${(1 - t) * 10}px)`,
                }}
              >
                {c}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// 01 — "Labanotation is written on a vertical staff and read from the bottom upward."
// Speed-ramped push into the staff, then a slow tilt up it while a reading beam climbs.
const STAFF = { x0: 1455, x1: 1860, top: 85, bottom: 965 };
export const Q01Staff: React.FC = () => {
  const frame = useCurrentFrame();
  const beam = interpolate(frame, [66, 170], [STAFF.bottom, STAFF.top], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const dim = interpolate(frame, [34, 60], [0, 0.72], clamp);
  const arrow = interpolate(frame, [66, 170], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.0, x: 960, y: 540 },
          { f: 34, s: 1.03, x: 990, y: 540, e: "drift" },
          { f: 62, s: 1.3, x: 1182, y: 665, e: "ramp" },
          { f: 172, s: 1.32, x: 1182, y: 415, e: "smooth" },
        ]}
        whipOut={1}
      >
        <Plate src={img(6)} />
        {/* push the figures back so the staff carries the frame */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, rgba(5,3,6,${dim}) 0%, rgba(5,3,6,${dim}) 66%, rgba(5,3,6,0) 75%)`,
          }}
        />
        {/* reading beam */}
        {frame >= 66 ? (
          <div
            style={{
              position: "absolute",
              left: STAFF.x0 - 30,
              width: STAFF.x1 - STAFF.x0 + 60,
              top: beam - 60,
              height: 120,
              background: `linear-gradient(0deg, rgba(232,194,122,0) 0%, rgba(232,194,122,0.35) 50%, rgba(232,194,122,0) 100%)`,
              mixBlendMode: "screen",
              opacity: interpolate(
                frame,
                [66, 74, 164, 172],
                [0, 1, 1, 0],
                clamp,
              ),
            }}
          />
        ) : null}
        {frame >= 66 ? (
          <div
            style={{
              position: "absolute",
              left: STAFF.x0 - 32,
              width: STAFF.x1 - STAFF.x0 + 64,
              top: beam - 1,
              height: 3,
              background: COLOR.gold,
              boxShadow: `0 0 16px ${COLOR.gold}`,
              opacity: interpolate(
                frame,
                [66, 72, 166, 172],
                [0, 1, 1, 0],
                clamp,
              ),
            }}
          />
        ) : null}
        {/* direction-of-reading arrow beside the staff */}
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <line
            x1={STAFF.x0 - 60}
            x2={STAFF.x0 - 60}
            y1={STAFF.bottom}
            y2={STAFF.bottom - (STAFF.bottom - STAFF.top - 30) * arrow}
            stroke={COLOR.gold}
            strokeWidth={4}
            style={{ filter: `drop-shadow(0 0 8px ${COLOR.gold})` }}
          />
          {arrow > 0.02 ? (
            <path
              d={`M ${STAFF.x0 - 80} ${STAFF.bottom - (STAFF.bottom - STAFF.top - 30) * arrow + 24} L ${STAFF.x0 - 60} ${STAFF.bottom - (STAFF.bottom - STAFF.top - 30) * arrow - 6} L ${STAFF.x0 - 40} ${STAFF.bottom - (STAFF.bottom - STAFF.top - 30) * arrow + 24}`}
              fill="none"
              stroke={COLOR.gold}
              strokeWidth={4}
            />
          ) : null}
        </svg>
      </Rig>
      <Sequence durationInFrames={64} layout="none">
        <CaptionAt text="written on a" start={6} x={124} y={70} size={40} />
      </Sequence>
      <HeroWord
        text="Vertical staff"
        look="heavy"
        size={120}
        x={110}
        y={120}
        align="left"
        start={10}
        end={64}
      />
      <CaptionAt text="read from the" start={70} x={124} y={70} size={40} />
      <HeroWord
        text="Bottom up"
        look="heavy"
        size={130}
        x={110}
        y={120}
        align="left"
        start={74}
      />
      <Sfx name="drone" at={0} volume={0.25} />
      <Sfx name="whoosh" at={38} volume={0.5} />
      <Sfx name="hit" at={60} volume={0.4} />
      <Sfx name="riser" at={70} volume={0.25} />
      <Sfx name="whoosh" at={170} volume={0.55} />
    </Finish>
  );
};

// ---------------------------------------------------------------------------------------------
// 02 — "Where a symbol sits tells you which part of the body is moving."
// Rotoscoped dancer in front of the words; each body part pulses across to its column.
const ROWS = [
  { name: "Head", yA: 103, yB: 93, seg: [55, 150] },
  { name: "Arms", yA: 297, yB: 287, seg: [180, 395] },
  { name: "Torso", yA: 567, yB: 500, seg: [415, 585] },
  { name: "Legs", yA: 873, yB: 787, seg: [610, 895] },
];
const ROW_AT = [52, 78, 104, 130];
export const Q02BodyPart: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.14, x: 720, y: 520 },
          { f: 200, s: 1.02, x: 960, y: 540, e: "smooth" },
        ]}
        whipOut={1}
      >
        <Plate src={img(1)} />
        <WorldWord
          text="Where"
          start={6}
          end={112}
          x={505}
          y={300}
          size={250}
          opacity={0.95}
        />
        <WorldWord
          text={"Body\npart"}
          start={116}
          x={505}
          y={220}
          size={250}
          opacity={0.95}
        />
        <Plate src={img(1, true)} />
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {ROWS.map((r, i) => {
            const t = ease(frame, ROW_AT[i], ROW_AT[i] + 18);
            if (t <= 0) return null;
            const on =
              0.55 + 0.45 * Math.exp(-Math.max(0, frame - ROW_AT[i] - 18) / 20);
            const a = 660 + (1065 - 660) * Math.min(1, t * 1.6);
            const b = 1170 + (1420 - 1170) * Math.max(0, t * 1.6 - 0.6);
            return (
              <g
                key={r.name}
                style={{ filter: `drop-shadow(0 0 8px ${COLOR.gold})` }}
              >
                <line
                  x1={660}
                  x2={a}
                  y1={r.yA}
                  y2={r.yA}
                  stroke={COLOR.gold}
                  strokeWidth={3}
                  strokeDasharray="10 8"
                />
                <circle cx={1065} cy={r.yA} r={9 * t} fill={COLOR.gold} />
                {t > 0.4 ? (
                  <line
                    x1={1170}
                    x2={b}
                    y1={r.yB}
                    y2={r.yB}
                    stroke={COLOR.gold}
                    strokeWidth={3}
                    strokeDasharray="10 8"
                  />
                ) : null}
                <rect
                  x={1405}
                  y={r.seg[0]}
                  width={85}
                  height={r.seg[1] - r.seg[0]}
                  rx={6}
                  fill={COLOR.gold}
                  fillOpacity={0.12 * on * Math.max(0, t * 2 - 1)}
                  stroke={COLOR.gold}
                  strokeWidth={3}
                  strokeOpacity={on * Math.max(0, t * 2 - 1)}
                />
              </g>
            );
          })}
        </svg>
        {ROWS.map((r, i) => {
          const t = ease(frame, ROW_AT[i] + 10, ROW_AT[i] + 24);
          return (
            <div
              key={r.name}
              style={{
                position: "absolute",
                left: 1615,
                top: (r.seg[0] + r.seg[1]) / 2 - 24,
                ...TYPE.label,
                fontSize: 40,
                color: COLOR.gold,
                opacity: t,
                translate: `${(1 - t) * -30}px 0px`,
                textShadow: "0 2px 12px #000",
              }}
            >
              {r.name}
            </div>
          );
        })}
      </Rig>
      <Sfx name="drone" at={0} volume={0.22} />
      {ROW_AT.map((f) => (
        <Sfx key={f} name="tick" at={f} volume={0.35} />
      ))}
      <Sfx name="hit" at={116} volume={0.35} />
      <Sfx name="whoosh" at={200} volume={0.55} />
    </Finish>
  );
};

// ---------------------------------------------------------------------------------------------
// 03 — "Its shape can indicate direction." Whip in; arrows and the word behind the dancer.
const CHEST: [number, number] = [985, 430];
const ARROWS = [0, 45, 90, 135, 180, -45, -90];
export const Q03Direction: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.06, x: 960, y: 520 },
          { f: 150, s: 1.16, x: 960, y: 470, e: "drift" },
        ]}
        whipIn={1}
        whipOut={1}
      >
        <Plate src={img(2)} />
        {/* direction arrows radiate from the body (behind her) */}
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {ARROWS.map((deg, i) => {
            const t = ease(frame, 16 + i * 6, 40 + i * 6);
            if (t <= 0) return null;
            const r = 200 + 360 * t;
            const a = (-deg * Math.PI) / 180;
            const x = CHEST[0] + Math.cos(a) * r;
            const y = CHEST[1] + Math.sin(a) * r;
            const hx = Math.cos(a);
            const hy = Math.sin(a);
            return (
              <g
                key={deg}
                opacity={0.9}
                style={{ filter: `drop-shadow(0 0 10px ${COLOR.gold})` }}
              >
                <line
                  x1={CHEST[0] + hx * 200}
                  y1={CHEST[1] + hy * 200}
                  x2={x}
                  y2={y}
                  stroke={COLOR.gold}
                  strokeWidth={5}
                  strokeLinecap="round"
                />
                <path
                  d={`M ${x - hx * 30 - hy * 18} ${y - hy * 30 + hx * 18} L ${x} ${y} L ${x - hx * 30 + hy * 18} ${y - hy * 30 - hx * 18}`}
                  fill="none"
                  stroke={COLOR.gold}
                  strokeWidth={5}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>
        <WorldWord text="Direction" start={22} x={960} y={110} size={215} />
        <Plate src={img(2, true)} />
      </Rig>
      <CaptionAt text="ITS SHAPE SHOWS" start={10} y={40} size={34} />
      <Sfx name="whoosh" at={0} volume={0.55} />
      <Sfx name="hit" at={8} volume={0.4} />
      {ARROWS.map((_, i) => (
        <Sfx key={i} name="tick" at={18 + i * 6} volume={0.2} />
      ))}
      <Sfx name="whoosh" at={142} volume={0.55} />
    </Finish>
  );
};

// ---------------------------------------------------------------------------------------------
// 04 — "Its shading can indicate level." Speed ramp from high → middle → low, then pull out.
const LevelWord: React.FC<{
  text: string;
  level: "high" | "mid" | "low";
  start: number;
  end: number;
  x?: number;
  right?: number;
  y: number;
  size?: number;
}> = ({ text, level, start, end, x, right, y, size = 170 }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame >= end) return null;
  const t = ease(frame, start, start + 12);
  const out = interpolate(frame, [end - 6, end], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: x ?? (right === undefined ? 0 : undefined),
        right: right ?? (x === undefined ? 0 : undefined),
        top: y,
        display: "flex",
        justifyContent:
          x === undefined && right === undefined ? "center" : undefined,
        alignItems: "center",
        gap: 28,
        opacity: t * out,
        translate: `0px ${(1 - t) * 30}px`,
      }}
    >
      <GlyphChip
        id={`lv-${level}`}
        level={level}
        w={size * 0.3}
        h={size * 0.62}
        shade={t}
      />
      <div
        style={{
          ...TYPE.heavy,
          fontSize: size,
          lineHeight: 1,
          textTransform: "uppercase",
          color: COLOR.gold,
          textShadow: `0 0 26px ${COLOR.gold}66, 0 6px 26px rgba(0,0,0,0.85)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
const STAFF_SYMS = [
  { y: 120, h: 135, label: "High" },
  { y: 415, h: 140, label: "Middle" },
  { y: 710, h: 145, label: "Low" },
];
export const Q04Level: React.FC = () => {
  const frame = useCurrentFrame();
  const wide = interpolate(frame, [136, 150], [0, 1], clamp);
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.45, x: 330, y: 470 },
          { f: 40, s: 1.48, x: 330, y: 460, e: "drift" },
          { f: 54, s: 1.45, x: 830, y: 600, e: "ramp" },
          { f: 86, s: 1.48, x: 830, y: 600, e: "drift" },
          { f: 100, s: 1.45, x: 1300, y: 700, e: "ramp" },
          { f: 128, s: 1.48, x: 1300, y: 700, e: "drift" },
          { f: 148, s: 1.0, x: 960, y: 540, e: "ramp" },
          { f: 180, s: 1.02, x: 960, y: 540, e: "drift" },
        ]}
        whipIn={1}
        whipOut={1}
      >
        <Plate src={img(3)} />
        {/* the image's own staff symbols light up with their level */}
        {STAFF_SYMS.map((s) => (
          <React.Fragment key={s.label}>
            <div
              style={{
                position: "absolute",
                left: 1718,
                top: s.y - 8,
                width: 70,
                height: s.h + 16,
                border: `3px solid ${COLOR.gold}`,
                borderRadius: 6,
                boxShadow: `0 0 18px ${COLOR.gold}`,
                opacity: wide,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 1920 - 1660,
                top: s.y + s.h / 2 - 30 - (s.label === "Low" ? 40 : 0),
                ...TYPE.label,
                fontSize: 46,
                color: COLOR.gold,
                textShadow: "0 2px 14px #000",
                opacity: wide,
              }}
            >
              {s.label}
            </div>
          </React.Fragment>
        ))}
      </Rig>
      <LevelWord
        text="High"
        level="high"
        start={6}
        end={46}
        right={140}
        y={170}
      />
      <LevelWord
        text="Middle"
        level="mid"
        start={56}
        end={92}
        y={60}
        size={150}
      />
      <LevelWord text="Low" level="low" start={102} end={134} y={100} />
      <CaptionAt text="shading =" start={150} y={60} size={40} />
      <HeroWord text="Level" look="heavy" size={140} y={105} start={152} />
      <Sfx name="whoosh" at={0} volume={0.5} />
      <Sfx name="hit" at={6} volume={0.35} />
      <Sfx name="whoosh" at={42} volume={0.5} />
      <Sfx name="hit" at={56} volume={0.35} />
      <Sfx name="whoosh" at={88} volume={0.5} />
      <Sfx name="hit" at={102} volume={0.35} />
      <Sfx name="whoosh" at={132} volume={0.55} />
      <Sfx name="boom" at={150} volume={0.4} />
      <Sfx name="whoosh" at={172} volume={0.55} />
    </Finish>
  );
};

// ---------------------------------------------------------------------------------------------
// 05 — "Its length communicates duration." Ramp along the five poses; the bar stretches in slow motion.
export const Q05Duration: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [48, 98], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const secs = (grow * 1.5).toFixed(1);
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.5, x: 400, y: 560 },
          { f: 30, s: 1.52, x: 420, y: 560, e: "drift" },
          { f: 46, s: 1.5, x: 960, y: 520, e: "ramp" },
          { f: 100, s: 1.55, x: 960, y: 520, e: "drift" },
          { f: 114, s: 1.5, x: 1520, y: 560, e: "ramp" },
          { f: 132, s: 1.52, x: 1520, y: 560, e: "drift" },
          { f: 152, s: 1.0, x: 960, y: 540, e: "ramp" },
          { f: 180, s: 1.02, x: 960, y: 540, e: "drift" },
        ]}
        whipIn={1}
        whipOut={1}
      >
        <Plate src={img(4)} />
        <WorldWord
          text="Duration"
          start={8}
          x={960}
          y={190}
          size={230}
          opacity={0.95}
        />
        <Plate src={img(4, true)} />
        {/* duration bar on the timeline */}
        <div
          style={{
            position: "absolute",
            left: 750,
            top: 809,
            width: 335 * grow,
            height: 12,
            borderRadius: 6,
            background: COLOR.gold,
            boxShadow: `0 0 18px ${COLOR.gold}`,
          }}
        />
        {grow > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 750 + 335 * grow - 60,
              top: 840,
              width: 120,
              textAlign: "center",
              ...TYPE.label,
              fontSize: 30,
              color: COLOR.gold,
              textShadow: "0 2px 10px #000",
            }}
          >
            {secs}s
          </div>
        ) : null}
        {/* the long symbol on the image's staff */}
        <div
          style={{
            position: "absolute",
            left: 118,
            top: 185,
            width: 40,
            height: 245,
            border: `3px solid ${COLOR.gold}`,
            borderRadius: 5,
            boxShadow: `0 0 18px ${COLOR.gold}`,
            opacity: interpolate(frame, [150, 160], [0, 1], clamp),
          }}
        />
      </Rig>
      <CaptionAt text="its length =" start={150} y={140} size={40} />
      <Sfx name="whoosh" at={0} volume={0.5} />
      <Sfx name="whoosh" at={32} volume={0.5} />
      <Sfx name="riser" at={48} volume={0.25} />
      <Sfx name="hit" at={98} volume={0.35} />
      <Sfx name="whoosh" at={100} volume={0.5} />
      <Sfx name="whoosh" at={136} volume={0.5} />
      <Sfx name="boom" at={152} volume={0.4} />
      <Sfx name="whoosh" at={172} volume={0.55} />
    </Finish>
  );
};

// ---------------------------------------------------------------------------------------------
// 06 — recap split screen: the three rules side by side
export const Q06Rules: React.FC = () => (
  <Finish>
    <SplitPanels
      panels={[
        {
          start: 0,
          node: (
            <Still
              src={img(2)}
              from={{ s: 1.08 }}
              to={{ s: 1.16 }}
              grade={GRADES.natural}
            />
          ),
          label: <PanelLabel thin="shape" heavy="direction" heavySize={78} />,
        },
        {
          start: 30,
          node: (
            <Still
              src={img(3)}
              from={{ s: 1.15, x: 2 }}
              to={{ s: 1.08 }}
              grade={GRADES.natural}
            />
          ),
          label: <PanelLabel thin="shading" heavy="level" heavySize={92} />,
        },
        {
          start: 60,
          node: (
            <Still
              src={img(4)}
              from={{ s: 1.12 }}
              to={{ s: 1.2 }}
              grade={GRADES.natural}
            />
          ),
          label: <PanelLabel thin="length" heavy="duration" heavySize={82} />,
        },
      ]}
    />
    <Sfx name="hit" at={6} volume={0.35} />
    <Sfx name="whoosh" at={26} volume={0.55} />
    <Sfx name="hit" at={36} volume={0.35} />
    <Sfx name="whoosh" at={56} volume={0.55} />
    <Sfx name="hit" at={66} volume={0.35} />
  </Finish>
);

// ---------------------------------------------------------------------------------------------
// 07 — "…another person can read and reconstruct long after the original dancer has left the room."
// Split: the dancer | the reader. The dancer dissolves, the reader's side wipes across the frame,
// and the remembered dancers pulse behind her.
const LEAVE = [96, 136];
const WIPE = [150, 172];
const DancerPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const g = interpolate(frame, LEAVE, [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#060406" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle 360px at 930px 420px, rgba(150,20,30,0.75), rgba(6,4,6,0) 100%)",
        }}
      />
      <Img
        src={staticFile(img(2, true))}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          opacity: 1 - g,
          filter: `blur(${g * 14}px)`,
          translate: `0px ${-g * 40}px`,
          scale: String(1 + 0.03 * Math.sin(frame / 30)),
        }}
      />
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        {g > 0 && g < 1
          ? Array.from({ length: 90 }).map((_, i) => (
              <circle
                key={i}
                cx={
                  600 +
                  random(`px${i}`) * 800 +
                  g * (random(`pv${i}`) - 0.3) * 200
                }
                cy={
                  100 +
                  random(`py${i}`) * 800 -
                  g * (100 + random(`pu${i}`) * 300)
                }
                r={2 + random(`pr${i}`) * 3}
                fill={COLOR.gold}
                opacity={Math.sin(g * Math.PI) * 0.9}
              />
            ))
          : null}
      </svg>
    </AbsoluteFill>
  );
};
const SwapLabel: React.FC<{
  at: number;
  a: [string, string];
  b: [string, string];
}> = ({ at, a, b }) => (
  <>
    <Sequence durationInFrames={at} layout="none">
      <PanelLabel thin={a[0]} heavy={a[1]} />
    </Sequence>
    <Sequence from={at} layout="none">
      <PanelLabel thin={b[0]} heavy={b[1]} />
    </Sequence>
  </>
);
const ReaderFull: React.FC = () => {
  const frame = useCurrentFrame();
  // the three remembered dancers pulse one after another
  const bands = [
    [640, 1130, 20],
    [1040, 1490, 50],
    [1490, 1900, 80],
  ];
  return (
    <Rig
      keys={[
        { f: 0, s: 1.12, x: 760, y: 560 },
        { f: 150, s: 1.04, x: 960, y: 540, e: "smooth" },
      ]}
    >
      <Plate src={img(5)} />
      {bands.map(([x0, x1, at]) => {
        const p = Math.max(0, Math.sin(((frame - at) / 40) * Math.PI));
        return (
          <Plate
            key={x0}
            src={img(5)}
            filter="brightness(1.6) blur(3px)"
            style={{
              mixBlendMode: "screen",
              opacity: frame > at ? 0.55 * p : 0,
              WebkitMaskImage: `linear-gradient(90deg, transparent ${(x0 / 1920) * 100}%, #000 ${((x0 + 80) / 1920) * 100}%, #000 ${((x1 - 80) / 1920) * 100}%, transparent ${(x1 / 1920) * 100}%)`,
            }}
          />
        );
      })}
      <Plate src={img(5, true)} />
    </Rig>
  );
};
export const Q07Reconstruct: React.FC = () => {
  const frame = useCurrentFrame();
  const wipe = interpolate(frame, WIPE, [50, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <Finish dust={0.3}>
      <SplitPanels
        panels={[
          {
            start: 0,
            node: <DancerPanel />,
            label: (
              <SwapLabel
                at={LEAVE[0] - 6}
                a={["the", "dancer"]}
                b={["has", "left"]}
              />
            ),
          },
          {
            start: 18,
            node: (
              <Still
                src={img(5)}
                from={{ s: 1.35, x: 18 }}
                to={{ s: 1.3, x: 16 }}
                grade={GRADES.natural}
              />
            ),
            label: <PanelLabel thin="the" heavy="reader" />,
          },
        ]}
      />
      {frame >= WIPE[0] ? (
        <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${wipe}%)` }}>
          <Sequence from={WIPE[0]} layout="absolute-fill">
            <ReaderFull />
            <AbsoluteFill
              style={{
                background:
                  "linear-gradient(0deg, rgba(8,4,2,0.8) 0%, rgba(8,4,2,0.4) 20%, rgba(8,4,2,0) 40%)",
              }}
            />
          </Sequence>
          <div
            style={{
              position: "absolute",
              left: `${wipe}%`,
              top: 0,
              width: 3,
              height: 1080,
              background: COLOR.gold,
              boxShadow: `0 0 14px ${COLOR.gold}`,
              opacity: wipe > 0.5 ? 1 : 0,
            }}
          />
        </AbsoluteFill>
      ) : null}
      <CaptionAt
        text="another person can"
        start={178}
        x={890}
        y={790}
        size={42}
      />
      <HeroWord
        text="Read"
        look="heavy"
        size={140}
        x={880}
        y={845}
        align="left"
        start={184}
        end={228}
      />
      <HeroWord
        text="Reconstruct"
        look="heavy"
        size={110}
        x={880}
        y={855}
        align="left"
        start={230}
      />
      <Sfx name="drone" at={0} volume={0.25} />
      <Sfx name="whoosh" at={14} volume={0.5} />
      <Sfx name="hit" at={22} volume={0.3} />
      <Sfx name="riser" at={86} volume={0.25} />
      <Sfx name="glitch" at={98} volume={0.2} />
      <Sfx name="whoosh" at={WIPE[0] - 2} volume={0.6} />
      <Sfx name="hit" at={184} volume={0.35} />
      <Sfx name="boom" at={230} volume={0.4} />
    </Finish>
  );
};

// ---------------------------------------------------------------------------------------------
// 08 — GRAPHIC: stick figure moves while the symbols write themselves onto the staff
export const Q08StickScore: React.FC = () => (
  <Finish dust={0.2}>
    <StickScore />
    <Sfx name="drone" at={0} volume={0.25} />
    {[40, 190].map((f) => (
      <Sfx key={f} name="riser" at={f} volume={0.2} />
    ))}
    <Sfx name="whoosh" at={128} volume={0.55} />
    <Sfx name="hit" at={148} volume={0.4} />
    {[52, 132, 196, 268].map((f) => (
      <Sfx key={`r${f}`} name="tick" at={f} volume={0.35} />
    ))}
    <Sfx name="glitch" at={320} volume={0.2} />
    <Sfx name="riser" at={350} volume={0.3} />
    <Sfx name="boom" at={392} volume={0.45} />
  </Finish>
);
