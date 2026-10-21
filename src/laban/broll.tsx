import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { COLOR } from "../brand/tokens";
import { ChannelFilters } from "../cine/Shot";
import { GRADES, Still } from "../cine/Still";
import { Dust } from "../egypt/env";
import { FilmLook } from "../scenes/FilmLook";
import { NotationStaff } from "./NotationStaff";
import {
  LEN,
  MEASURE_SPLIT,
  MONTAGE_CUTS,
  MONTAGE_SHOT,
  MONTAGE_TOPICS,
  TEASER_CUTS,
  VERB_CUTS,
  WRITTEN_CUTS,
} from "./timing";

const img = (n: string) => `laban/${n}.png`;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

type SfxName =
  | "whoosh"
  | "hit"
  | "boom"
  | "riser"
  | "tick"
  | "glitch"
  | "drone";
const Sfx: React.FC<{ name: SfxName; at: number; volume?: number }> = ({
  name,
  at,
  volume = 0.5,
}) => (
  <Sequence from={at} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

// Common finish for every B-roll clip
const Finish: React.FC<{ children: React.ReactNode; dust?: number }> = ({
  children,
  dust = 0.45,
}) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <ChannelFilters />
    {children}
    <Dust count={40} seed="laban" opacity={dust} />
    <FilmLook />
  </AbsoluteFill>
);

// 01 — "In 1928, Rudolf Laban published an idea…"
export const B01Portrait: React.FC = () => (
  <Finish>
    <Still
      src={img("01")}
      from={{ s: 1.05 }}
      to={{ s: 1.18, x: 5, y: 8 }}
      grade={GRADES.sepiaGold}
    />
    <Sfx name="drone" at={0} volume={0.25} />
  </Finish>
);

// 02 — "…a written language for human movement."
export const B02Writing: React.FC = () => (
  <Finish>
    <Still
      src={img("02")}
      from={{ s: 1.05 }}
      to={{ s: 1.25, x: 10, y: -11 }}
      grade={GRADES.sepiaGold}
    />
    {[30, 44, 52, 70, 81, 96].map((f) => (
      <Sfx key={f} name="tick" at={f} volume={0.25} />
    ))}
  </Finish>
);

// 03 — teaser flash after "sounds almost impossible"
export const B03Teaser: React.FC = () => {
  const shots = [
    { n: "16", grade: GRADES.bwRose, rose: true },
    { n: "22", grade: GRADES.bwRose, rose: true },
    { n: "24", grade: GRADES.cool, rose: false },
  ];
  return (
    <Finish dust={0.2}>
      {shots.map((s, i) => (
        <Sequence
          key={s.n}
          from={TEASER_CUTS[i]}
          durationInFrames={(TEASER_CUTS[i + 1] ?? LEN.teaser) - TEASER_CUTS[i]}
        >
          <Still
            src={img(s.n)}
            from={{ s: 1.25 }}
            to={{ s: 1.12 }}
            grade={s.grade}
            glitchIn
            rose={s.rose}
            kicks={[0]}
          />
        </Sequence>
      ))}
      <Sfx name="hit" at={0} volume={0.55} />
      <Sfx name="glitch" at={TEASER_CUTS[1]} volume={0.45} />
      <Sfx name="boom" at={TEASER_CUTS[2]} volume={0.5} />
    </Finish>
  );
};

// 04 — "Music… Words… Architecture could be drawn."
export const B04Written: React.FC = () => {
  const shots = [
    { n: "04", from: { s: 1.1, x: 4 }, to: { s: 1.14, x: -4 } },
    { n: "05", from: { s: 1.08 }, to: { s: 1.2, y: -6 } },
    { n: "06", from: { s: 1.1 }, to: { s: 1.25, x: -8, y: 8 } },
  ];
  return (
    <Finish>
      {shots.map((s, i) => (
        <Sequence key={s.n} from={WRITTEN_CUTS[i]} durationInFrames={60}>
          <Still
            src={img(s.n)}
            from={s.from}
            to={s.to}
            grade={GRADES.sepiaGold}
            whipIn={i > 0 ? 1 : 0}
            whipOut={i < 2 ? 1 : 0}
          />
        </Sequence>
      ))}
      <Sfx name="whoosh" at={WRITTEN_CUTS[1] - 5} volume={0.6} />
      <Sfx name="whoosh" at={WRITTEN_CUTS[2] - 5} volume={0.6} />
    </Finish>
  );
};

// 05 — "jumps, turns, reaches, falls –": one camera move per verb
export const B05Verbs: React.FC = () => {
  const verbs = [
    // jumps: camera rises with the leap
    {
      n: "07",
      from: { s: 1.12, y: 4 },
      to: { s: 1.22, y: -6 },
      ease: Easing.out(Easing.cubic),
    },
    // turns: rotate through the pivot
    {
      n: "08",
      from: { s: 1.18, r: -5, x: 3 },
      to: { s: 1.22, r: 5, x: -3 },
      ease: Easing.inOut(Easing.cubic),
    },
    // reaches: push up toward the hand
    {
      n: "09",
      from: { s: 1.08 },
      to: { s: 1.32, x: -4, y: 10 },
      ease: Easing.out(Easing.quad),
    },
    // falls: camera drops and settles
    {
      n: "10",
      from: { s: 1.28, y: -9, r: -2 },
      to: { s: 1.1, y: 4, r: 0 },
      ease: Easing.out(Easing.exp),
    },
  ];
  return (
    <Finish>
      {verbs.map((v, i) => {
        const len = (VERB_CUTS[i + 1] ?? LEN.verbs) - VERB_CUTS[i];
        return (
          <Sequence key={v.n} from={VERB_CUTS[i]} durationInFrames={len}>
            <Still
              src={img(v.n)}
              from={v.from}
              to={v.to}
              ease={v.ease}
              move={i === 3 ? [0, 16] : undefined}
              grade={GRADES.sepiaGold}
              kicks={[0]}
            />
          </Sequence>
        );
      })}
      {VERB_CUTS.slice(0, 3).map((f) => (
        <Sfx key={f} name="hit" at={f} volume={0.45} />
      ))}
      <Sfx name="boom" at={VERB_CUTS[3]} volume={0.55} />
    </Finish>
  );
};

// 06 — "…and the moment the body stops moving, the movement is gone."
export const B06Gone: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Finish dust={0.7}>
      <Still
        src={img("11")}
        from={{ s: 1.22 }}
        to={{ s: 1.02 }}
        ease={Easing.out(Easing.sin)}
        grade={GRADES.sepiaGold}
      />
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: interpolate(frame, [60, LEN.gone], [0, 0.45], clamp),
        }}
      />
      <Sfx name="drone" at={0} volume={0.3} />
    </Finish>
  );
};

// 07 — "So Laban developed a system of geometric symbols…"
const RISING = [
  { x: 1180, y: 640, shape: "tri" },
  { x: 1320, y: 560, shape: "rect" },
  { x: 1460, y: 680, shape: "stripe" },
  { x: 1240, y: 760, shape: "dot" },
  { x: 1560, y: 520, shape: "tri" },
  { x: 1400, y: 820, shape: "rect" },
  { x: 1100, y: 520, shape: "dot" },
];
export const B07Symbols: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Finish>
      <Still
        src={img("12")}
        from={{ s: 1.05 }}
        to={{ s: 1.15, x: -6, y: -6 }}
        grade={GRADES.sepiaGold}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 70% 55%, rgba(0,0,0,0.35), rgba(0,0,0,0.75) 75%)",
          opacity: interpolate(frame, [20, 80], [0, 1], clamp),
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          <pattern
            id="riseStripe"
            width={7}
            height={7}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width={2.5} height={7} fill={COLOR.gold} />
          </pattern>
        </defs>
        {RISING.map((s, i) => {
          const t0 = 30 + i * 12;
          const p = interpolate(frame, [t0, t0 + 70], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          });
          if (p <= 0) return null;
          const y = s.y - p * 170;
          const o = interpolate(p, [0, 0.15, 0.85, 1], [0, 1, 1, 0.85]);
          const w = 70;
          const h = 110;
          return (
            <g
              key={i}
              opacity={o}
              transform={`translate(${s.x} ${y}) rotate(${(1 - p) * 12})`}
              style={{
                filter:
                  "drop-shadow(0 0 1.5px rgba(40,20,6,1)) drop-shadow(0 0 14px rgba(232,194,122,0.95))",
              }}
            >
              {s.shape === "tri" ? (
                <path
                  d={`M ${-w / 2} ${h / 2} L ${w / 2} 0 L ${-w / 2} ${-h / 2} Z`}
                  fill="none"
                  stroke={COLOR.gold}
                  strokeWidth={4.5}
                />
              ) : (
                <rect
                  x={-w / 2}
                  y={-h / 2}
                  width={w}
                  height={h}
                  fill={
                    s.shape === "rect"
                      ? COLOR.gold
                      : s.shape === "stripe"
                        ? "url(#riseStripe)"
                        : "none"
                  }
                  stroke={COLOR.gold}
                  strokeWidth={4.5}
                />
              )}
              {s.shape === "dot" ? <circle r={8} fill={COLOR.gold} /> : null}
            </g>
          );
        })}
      </svg>
      <Sfx name="riser" at={20} volume={0.25} />
      {RISING.map((_, i) => (
        <Sfx key={i} name="tick" at={30 + i * 12} volume={0.3} />
      ))}
    </Finish>
  );
};

// 08 — "…what the body did, where it moved, how high or low, and how long"
export const B08Measure: React.FC = () => {
  const frame = useCurrentFrame();
  const rays = interpolate(frame, [15, 60], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const lf = frame - MEASURE_SPLIT;
  const hi = interpolate(lf, [12, 36], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const lo = interpolate(lf, [26, 50], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const marker = interpolate(lf, [52, 66, 80, 94], [300, 820, 300, 560], clamp);
  const dur = interpolate(lf, [76, 128], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const gold = {
    stroke: COLOR.gold,
    filter: "drop-shadow(0 0 8px rgba(232,194,122,0.9))",
  };
  return (
    <Finish>
      <Sequence durationInFrames={MEASURE_SPLIT}>
        <Still
          src={img("13")}
          pos="50% 15%"
          from={{ s: 1.02 }}
          to={{ s: 1.08 }}
          grade={GRADES.sepiaGold}
          whipOut={1}
        />
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <circle
            cx={960}
            cy={560}
            r={300 * rays}
            fill="none"
            strokeWidth={2}
            style={gold}
            opacity={0.8}
          />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={960}
                y1={560}
                x2={960 + Math.cos(a) * 420 * rays}
                y2={560 + Math.sin(a) * 420 * rays}
                strokeWidth={2}
                strokeDasharray="10 10"
                style={gold}
                opacity={0.85}
              />
            );
          })}
        </svg>
      </Sequence>
      <Sequence from={MEASURE_SPLIT}>
        <Still
          src={img("14")}
          from={{ s: 1.08 }}
          to={{ s: 1.14 }}
          grade={GRADES.sepiaGold}
          whipIn={1}
        />
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <line
            x1={240}
            x2={240 + 1440 * hi}
            y1={300}
            y2={300}
            strokeWidth={2.5}
            style={gold}
          />
          <line
            x1={240}
            x2={240 + 1440 * lo}
            y1={820}
            y2={820}
            strokeWidth={2.5}
            style={gold}
          />
          {lf >= 52 ? (
            <g>
              <line
                x1={1700}
                x2={1700}
                y1={300}
                y2={820}
                strokeWidth={2}
                strokeDasharray="6 8"
                style={gold}
                opacity={0.7}
              />
              <circle
                cx={1700}
                cy={marker}
                r={12}
                fill={COLOR.rose}
                style={{ filter: "drop-shadow(0 0 10px rgba(224,69,123,1))" }}
              />
            </g>
          ) : null}
          <rect
            x={240}
            y={968}
            width={1440 * dur}
            height={10}
            rx={5}
            fill={COLOR.gold}
            style={{ filter: "drop-shadow(0 0 8px rgba(232,194,122,0.9))" }}
          />
          {dur > 0
            ? Array.from({ length: Math.floor(dur * 9) + 1 }).map((_, i) => (
                <line
                  key={i}
                  x1={240 + i * 180}
                  x2={240 + i * 180}
                  y1={950}
                  y2={996}
                  strokeWidth={2}
                  style={gold}
                />
              ))
            : null}
        </svg>
      </Sequence>
      {Array.from({ length: 8 }).map((_, i) => (
        <Sfx key={i} name="tick" at={15 + i * 5} volume={0.25} />
      ))}
      <Sfx name="whoosh" at={MEASURE_SPLIT - 5} volume={0.6} />
      <Sfx name="whoosh" at={MEASURE_SPLIT + 12} volume={0.3} />
      <Sfx name="riser" at={MEASURE_SPLIT + 70} volume={0.2} />
    </Finish>
  );
};

// 09 — "An alphabet – not for speech – but for the body." (original motion graphic)
export const B09Staff: React.FC = () => (
  <AbsoluteFill>
    <NotationStaff />
    {Array.from({ length: 17 }).map((_, i) => (
      <Sfx key={i} name="tick" at={Math.round(34 + i * 8.5)} volume={0.22} />
    ))}
    <Sfx name="riser" at={160} volume={0.25} />
  </AbsoluteFill>
);

// 10 — montage peak: the strange afterlife of Laban's ideas
export const B10Montage: React.FC = () => (
  <Finish dust={0.25}>
    {MONTAGE_TOPICS.map((t, i) => {
      const last = i === MONTAGE_TOPICS.length - 1;
      const len = last ? LEN.montage - MONTAGE_CUTS[i] : MONTAGE_SHOT;
      const zoomIn = i % 2 === 0;
      return (
        <Sequence key={t.img} from={MONTAGE_CUTS[i]} durationInFrames={len}>
          <Still
            src={img(t.img)}
            from={{ s: zoomIn ? 1.08 : 1.22 }}
            to={{ s: zoomIn ? 1.22 : 1.08 }}
            grade={last ? GRADES.cool : GRADES.bwRose}
            rose={!last}
            glitchIn
            kicks={[0]}
          />
        </Sequence>
      );
    })}
    <Sfx name="drone" at={0} volume={0.25} />
    <Sfx name="riser" at={MONTAGE_CUTS[7] - 90} volume={0.35} />
    {MONTAGE_CUTS.slice(0, 7).map((f) => (
      <React.Fragment key={f}>
        <Sfx name="hit" at={f} volume={0.4} />
        <Sfx name="glitch" at={f} volume={0.2} />
      </React.Fragment>
    ))}
    <Sfx name="boom" at={MONTAGE_CUTS[7]} volume={0.6} />
  </Finish>
);

// 11 — "…what happens when human movement becomes information."
export const B11Information: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Finish dust={0.3}>
      <Still
        src={img("24")}
        from={{ s: 1.0 }}
        to={{ s: 1.16, x: 2 }}
        ease={Easing.inOut(Easing.sin)}
        grade={GRADES.cool}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 55% 45%, rgba(120,190,255,0.18), rgba(0,0,0,0) 60%)",
          mixBlendMode: "screen",
          opacity: 0.6 + 0.4 * Math.sin(frame / 14),
        }}
      />
      <Sfx name="drone" at={0} volume={0.3} />
    </Finish>
  );
};
