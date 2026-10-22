import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";
import { Key, Plate, Rig } from "../laban3/rig";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

// ---------- 2.5D parallax ----------
// The person (rotoscoped cut-out) rides a nearer depth than the clean plate behind them, so every
// camera move separates the layers. Optional rack focus: the plate softens as focus pulls to the subject.
export const Parallax: React.FC<{
  plate: string;
  cut: string;
  keys: Key[];
  depth?: number;
  grade?: string;
  rack?: [number, number, number];
  whipIn?: -1 | 1;
  whipOut?: -1 | 1;
  between?: React.ReactNode;
  // drawn over the subject, riding the subject's depth
  over?: React.ReactNode;
}> = ({
  plate,
  cut,
  keys,
  depth = 1.07,
  grade = "",
  rack,
  whipIn,
  whipOut,
  between,
  over,
}) => {
  const frame = useCurrentFrame();
  const blur = rack
    ? interpolate(frame, [rack[0], rack[1]], [0, rack[2]], {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      })
    : 0;
  const near = keys.map((k) => ({ ...k, s: k.s * depth }));
  return (
    <AbsoluteFill>
      <Rig keys={keys} whipIn={whipIn} whipOut={whipOut}>
        <Plate src={plate} filter={`${grade} blur(${blur.toFixed(2)}px)`} />
        {between}
      </Rig>
      <AbsoluteFill>
        <Rig keys={near} whipIn={whipIn} whipOut={whipOut} opaque={false}>
          <Plate src={cut} filter={grade} />
          {over}
        </Rig>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Name card ----------
// Lower-third: serif name, a gold rule that draws out, a thin tracked role line. The faces are AI
// reconstructions, so a small RECONSTRUCTION chip rides with every name.
export const NameCard: React.FC<{
  at: number;
  end?: number;
  name: string;
  role: string;
  x?: number;
  y?: number;
}> = ({ at, end = 9999, name, role, x = 110, y = 800 }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= end) return null;
  const t = ease(frame, at, at + 18);
  const rule = ease(frame, at + 8, at + 30);
  const sub = ease(frame, at + 16, at + 32);
  const out = interpolate(frame, [end - 10, end], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: out }}>
      <div
        style={{
          ...TYPE.headline,
          fontSize: 88,
          whiteSpace: "nowrap",
          lineHeight: 1,
          color: COLOR.white,
          clipPath: `inset(-20% ${(1 - t) * 100}% -20% 0)`,
          translate: `${(1 - t) * -24}px 0px`,
          textShadow: "0 4px 24px rgba(0,0,0,0.7)",
        }}
      >
        {name}
      </div>
      <div
        style={{
          width: 420 * rule,
          height: 2,
          background: COLOR.gold,
          margin: "18px 0 16px",
          boxShadow: `0 0 10px ${COLOR.gold}`,
        }}
      />
      <div
        style={{ display: "flex", alignItems: "center", gap: 22, opacity: sub }}
      >
        <div
          style={{
            ...TYPE.label,
            fontSize: 26,
            letterSpacing: "0.3em",
            color: COLOR.gold,
            whiteSpace: "nowrap",
          }}
        >
          {role}
        </div>
        <div
          style={{
            ...TYPE.label,
            fontSize: 15,
            letterSpacing: "0.24em",
            color: COLOR.white,
            opacity: 0.7,
            border: "1px solid rgba(244,241,234,0.45)",
            padding: "5px 10px 4px",
            borderRadius: 3,
          }}
        >
          Reconstruction
        </div>
      </div>
    </div>
  );
};

// ---------- Range-of-motion arc ----------
// A fine glowing arc swept around a joint by a bright comet head with a fading particle trail, as a
// physiotherapist's goniometer would read it. Coordinates are world (1920×1080) so it rides a Rig.
export const RangeArc: React.FC<{
  cx: number;
  cy: number;
  r: number;
  from: number;
  to: number;
  at: number;
  dur: number;
  label?: string;
}> = ({ cx, cy, r, from, to, at, dur, label }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  if (frame < at) return null;
  const fade = interpolate(frame, [at, at + 8], [0, 1], clamp);
  const ang = from + (to - from) * p;
  const pt = (a: number, rr = r) => [
    cx + rr * Math.cos((a * Math.PI) / 180),
    cy + rr * Math.sin((a * Math.PI) / 180),
  ];
  const [sx, sy] = pt(from);
  const [ex, ey] = pt(ang);
  const large = Math.abs(ang - from) > 180 ? 1 : 0;
  const sweep = to > from ? 1 : 0;
  const ticks = Array.from({ length: 13 }).map(
    (_, i) => from + ((to - from) * i) / 12,
  );
  return (
    <svg
      width={1920}
      height={1080}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        opacity: fade,
        overflow: "visible",
      }}
    >
      <defs>
        <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {ticks.map((a, i) => {
        const [x1, y1] = pt(a, r + 10);
        const [x2, y2] = pt(a, r + (i % 3 === 0 ? 26 : 18));
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={COLOR.white}
            strokeOpacity={0.35}
            strokeWidth={1.5}
          />
        );
      })}
      <path
        d={`M ${sx} ${sy} A ${r} ${r} 0 ${large} ${sweep} ${ex} ${ey}`}
        fill="none"
        stroke={COLOR.gold}
        strokeWidth={3}
        strokeLinecap="round"
        filter="url(#arcGlow)"
      />
      {Array.from({ length: 14 }).map((_, i) => {
        const a = ang - (to - from) * 0.012 * i;
        const [x, y] = pt(a, r + (random(`ra${i}`) - 0.5) * 10);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={3.2 - i * 0.18}
            fill="#FFE7B0"
            opacity={(1 - i / 14) * 0.8}
          />
        );
      })}
      <circle cx={ex} cy={ey} r={8} fill="#FFF3D6" filter="url(#arcGlow)" />
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="none"
        stroke={COLOR.gold}
        strokeWidth={2}
        opacity={0.8}
      />
      {label ? (
        <text
          x={ex + 22}
          y={ey + 8}
          fill={COLOR.white}
          style={{ ...TYPE.label, fontSize: 22, letterSpacing: "0.14em" }}
        >
          {Math.round(Math.abs(ang - from))}°
        </text>
      ) : null}
    </svg>
  );
};

// ---------- Light sweep ----------
export const LightSweep: React.FC<{
  at: number;
  dur: number;
  angle?: number;
  strength?: number;
}> = ({ at, dur, angle = 105, strength = 0.22 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [-25, 125], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  if (frame < at || frame > at + dur) return null;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, rgba(255,226,170,0) ${p - 14}%, rgba(255,226,170,${strength}) ${p}%, rgba(255,226,170,0) ${p + 14}%)`,
        mixBlendMode: "screen",
      }}
    />
  );
};

// ---------- Warm burn ----------
// A film-burn colour-temperature turn: cold image flares to amber and the warm one emerges.
export const WarmBurn: React.FC<{ at: number; dur?: number }> = ({
  at,
  dur = 24,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(
    frame,
    [at, at + dur * 0.5, at + dur],
    [0, 1, 0],
    clamp,
  );
  if (p <= 0) return null;
  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 90% at ${30 + p * 40}% 60%, rgba(255,190,110,${0.95 * p}), rgba(255,120,40,${0.55 * p}) 45%, rgba(120,30,0,0) 80%)`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(255,236,210,${0.35 * Math.max(0, p - 0.6) * 2.5})`,
        }}
      />
    </>
  );
};

// ---------- Projector light ----------
// A soft beam from a source with flicker, drifting dust and a warm cone, laid over an archive shot.
export const ProjectorBeam: React.FC<{
  sx: number;
  sy: number;
  strength?: number;
}> = ({ sx, sy, strength = 1 }) => {
  const frame = useCurrentFrame();
  const flick = 0.82 + 0.18 * random(`pf${Math.floor(frame / 2)}`);
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: strength }}>
      <AbsoluteFill
        style={{
          background: `conic-gradient(from 250deg at ${sx}px ${sy}px, rgba(255,214,150,0) 0deg, rgba(255,214,150,${0.2 * flick}) 18deg, rgba(255,214,150,${0.28 * flick}) 26deg, rgba(255,214,150,${0.2 * flick}) 34deg, rgba(255,214,150,0) 52deg)`,
          filter: "blur(14px)",
        }}
      />
      {Array.from({ length: 40 }).map((_, i) => {
        const x =
          sx - 80 - random(`bx${i}`) * 1200 + Math.sin(frame / 40 + i) * 14;
        const y =
          sy -
          60 +
          (random(`by${i}`) - 0.5) * 260 +
          ((frame * (0.2 + random(`bv${i}`) * 0.4)) % 80);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 3,
              height: 3,
              borderRadius: 2,
              background: "#FFE9C4",
              opacity: 0.35 + random(`bo${i}`) * 0.4,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- 35mm film strip ----------
// A strip of real frames (the owner's photos) running through in perspective: amber base, sprocket
// holes, frame lines, edge numbers, gate weave and flicker.
export const FilmStrip: React.FC<{
  frames: string[];
  speed?: number;
  y?: number;
  tilt?: number;
  height?: number;
  offset?: number;
}> = ({
  frames,
  speed = 14,
  y = 540,
  tilt = -18,
  height = 420,
  offset = 0,
}) => {
  const frame = useCurrentFrame();
  const fw = height * 1.5;
  const pitch = fw + 18;
  const total = pitch * frames.length * 3;
  const x = -((frame * speed + offset) % (pitch * frames.length));
  const weave = Math.sin(frame / 3.1) * 1.5;
  const flick = 0.9 + 0.1 * random(`ff${frame}`);
  const base = "#2a1b10";
  return (
    <AbsoluteFill style={{ perspective: 1600 }}>
      <div
        style={{
          position: "absolute",
          left: -400,
          top: y - height / 2 - 70 + weave,
          width: total,
          height: height + 140,
          transform: `translateX(${x}px) rotateY(${tilt}deg) rotateZ(-4deg)`,
          transformOrigin: "50% 50%",
          background: `linear-gradient(180deg, ${base}, #3b2614 50%, ${base})`,
          boxShadow: "0 30px 70px rgba(0,0,0,0.7)",
          filter: `brightness(${flick})`,
        }}
      >
        {[14, height + 140 - 44].map((ty) => (
          <div
            key={ty}
            style={{
              position: "absolute",
              left: 0,
              top: ty,
              width: total,
              height: 30,
              display: "flex",
              gap: 22,
              paddingLeft: 12,
            }}
          >
            {Array.from({ length: Math.ceil(total / 48) }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 26,
                  height: 30,
                  borderRadius: 5,
                  background: "#0b0705",
                  flexShrink: 0,
                  boxShadow: "inset 0 0 3px rgba(255,200,140,0.25)",
                }}
              />
            ))}
          </div>
        ))}
        {Array.from({ length: frames.length * 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i * pitch + 9,
              top: 70,
              width: fw,
              height,
            }}
          >
            <Img
              src={staticFile(frames[i % frames.length])}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "sepia(0.35) contrast(1.08) brightness(0.95)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 6,
                top: height + 22,
                ...TYPE.label,
                fontSize: 14,
                letterSpacing: "0.2em",
                color: "rgba(255,190,120,0.65)",
              }}
            >
              {`▸ ${String(10 + i).padStart(2, "0")}A`}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Map threads ----------
// Lights the real strings and pins on the wall map: each pin pulses as a gold thread draws to it.
export const MapThreads: React.FC<{
  hub: [number, number];
  pins: { p: [number, number]; at: number }[];
}> = ({ hub, pins }) => {
  const frame = useCurrentFrame();
  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <defs>
        <filter id="thr" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {pins.map(({ p, at }, i) => {
        const t = interpolate(frame, [at, at + 16], [0, 1], {
          ...clamp,
          easing: Easing.inOut(Easing.cubic),
        });
        if (t <= 0) return null;
        const x = hub[0] + (p[0] - hub[0]) * t;
        const y = hub[1] + (p[1] - hub[1]) * t;
        const ring = (frame - at - 16) % 40;
        return (
          <g key={i} filter="url(#thr)">
            <line
              x1={hub[0]}
              y1={hub[1]}
              x2={x}
              y2={y}
              stroke={COLOR.gold}
              strokeWidth={2}
            />
            {t >= 1 ? (
              <>
                <circle cx={p[0]} cy={p[1]} r={5} fill="#FFE7B0" />
                <circle
                  cx={p[0]}
                  cy={p[1]}
                  r={6 + ring * 0.6}
                  fill="none"
                  stroke={COLOR.gold}
                  strokeWidth={1.5}
                  opacity={1 - ring / 40}
                />
              </>
            ) : null}
          </g>
        );
      })}
      <circle
        cx={hub[0]}
        cy={hub[1]}
        r={6}
        fill="#FFF3D6"
        filter="url(#thr)"
        opacity={ease(frame, pins[0]?.at ?? 0, (pins[0]?.at ?? 0) + 8)}
      />
    </svg>
  );
};
