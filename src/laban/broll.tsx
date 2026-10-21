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
import { TornReveal } from "../brand/fx";
import {
  LEN,
  MEASURE_SPLIT,
  SYMBOLS_SPLIT,
  WRITING_SPLIT,
  MONTAGE_CUTS,
  MONTAGE_SHOT,
  MONTAGE_TOPICS,
  TEASER_CUTS,
  VERB_CUTS,
  WRITTEN_CUTS,
} from "./timing";

export const img = (n: string) => `laban/${n}.jpg`;
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
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number }> = ({
  name,
  at,
  volume = 0.5,
}) => (
  <Sequence from={at} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

// Common finish for every B-roll clip
export const Finish: React.FC<{ children: React.ReactNode; dust?: number }> = ({
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
      from={{ s: 1.05, x: 2, y: 2 }}
      to={{ s: 1.3, x: 7, y: 14 }}
      grade={GRADES.sepiaGold}
    />
    <Sfx name="drone" at={0} volume={0.25} />
  </Finish>
);

// 02 — "…a written language for human movement."
export const B02Writing: React.FC = () => (
  <Finish>
    <Sequence durationInFrames={WRITING_SPLIT}>
      <Still
        src={img("02")}
        from={{ s: 1.05 }}
        to={{ s: 1.28, x: 14, y: -14 }}
        grade={GRADES.sepiaGold}
        whipOut={1}
      />
    </Sequence>
    <Sequence from={WRITING_SPLIT}>
      <Still
        src={img("03")}
        from={{ s: 1.16, x: 6 }}
        to={{ s: 1.22, x: -6 }}
        grade={GRADES.sepiaGold}
        whipIn={1}
      />
    </Sequence>
    {[20, 34, 42, 58].map((f) => (
      <Sfx key={f} name="tick" at={f} volume={0.25} />
    ))}
    <Sfx name="whoosh" at={WRITING_SPLIT - 5} volume={0.6} />
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
      from: { s: 1.04, y: -1 },
      to: { s: 1.12, y: 6 },
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
  { x: 430, y: 640, shape: "tri" },
  { x: 730, y: 560, shape: "rect" },
  { x: 1000, y: 700, shape: "stripe" },
  { x: 1290, y: 760, shape: "dot" },
  { x: 1580, y: 540, shape: "tri" },
  { x: 860, y: 860, shape: "rect" },
  { x: 1440, y: 880, shape: "dot" },
];
export const B07Symbols: React.FC = () => {
  const frame = useCurrentFrame();
  const lf = frame - SYMBOLS_SPLIT;
  return (
    <Finish>
      <Sequence>
        <Still
          src={img("12")}
          from={{ s: 1.04 }}
          to={{ s: 1.22, x: -6, y: 2 }}
          grade={GRADES.sepiaGold}
        />
      </Sequence>
      <TornReveal at={SYMBOLS_SPLIT - 10} seed="sym">
        <Still
          src={img("15")}
          from={{ s: 1.12 }}
          to={{ s: 1.04 }}
          grade={GRADES.sepiaGold}
        />
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 55% 50%, rgba(0,0,0,0.3), rgba(0,0,0,0.7) 75%)",
            opacity: interpolate(lf, [6, 40], [0, 1], clamp),
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
          {RISING.map((sym, i) => {
            const t0 = 10 + i * 7;
            const p = interpolate(lf, [t0, t0 + 50], [0, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            });
            if (p <= 0) return null;
            const y = sym.y - p * 170;
            const o = interpolate(p, [0, 0.15, 0.85, 1], [0, 1, 1, 0.85]);
            const w = 70;
            const h = 110;
            return (
              <g
                key={i}
                opacity={o}
                transform={`translate(${sym.x} ${y}) rotate(${(1 - p) * 12})`}
                style={{
                  filter:
                    "drop-shadow(0 0 1.5px rgba(40,20,6,1)) drop-shadow(0 0 14px rgba(232,194,122,0.95))",
                }}
              >
                {sym.shape === "tri" ? (
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
                      sym.shape === "rect"
                        ? COLOR.gold
                        : sym.shape === "stripe"
                          ? "url(#riseStripe)"
                          : "none"
                    }
                    stroke={COLOR.gold}
                    strokeWidth={4.5}
                  />
                )}
                {sym.shape === "dot" ? (
                  <circle r={8} fill={COLOR.gold} />
                ) : null}
              </g>
            );
          })}
        </svg>
      </TornReveal>
      {[12, 30, 44, 62].map((f) => (
        <Sfx key={f} name="tick" at={f} volume={0.25} />
      ))}
      <Sfx name="whoosh" at={SYMBOLS_SPLIT - 5} volume={0.6} />
      <Sfx name="riser" at={SYMBOLS_SPLIT} volume={0.25} />
      {RISING.map((_, i) => (
        <Sfx key={i} name="tick" at={SYMBOLS_SPLIT + 10 + i * 7} volume={0.3} />
      ))}
    </Finish>
  );
};

// 08 — "…what the body did, where it moved, how high or low, and how long"
export const B08Measure: React.FC = () => (
  <Finish>
    <Sequence>
      {/* "where it moved": drift toward the direction circle at the reaching hand */}
      <Still
        src={img("13")}
        from={{ s: 1.03, x: 2 }}
        to={{ s: 1.16, x: -6, y: 6 }}
        grade={GRADES.sepiaGold}
      />
    </Sequence>
    <TornReveal at={MEASURE_SPLIT - 10} dir={-1} seed="meas">
      {/* "how high / how low / how long": settle over the height box, then the floor timeline */}
      <Still
        src={img("14")}
        from={{ s: 1.14, x: -4, y: 4 }}
        to={{ s: 1.04, y: -2 }}
        grade={GRADES.sepiaGold}
      />
    </TornReveal>
    {Array.from({ length: 4 }).map((_, i) => (
      <Sfx key={i} name="tick" at={18 + i * 5} volume={0.22} />
    ))}
    <Sfx name="whoosh" at={MEASURE_SPLIT - 5} volume={0.6} />
    <Sfx name="riser" at={MEASURE_SPLIT + 70} volume={0.2} />
  </Finish>
);

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
