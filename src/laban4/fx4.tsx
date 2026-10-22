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
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import world from "world-atlas/countries-110m.json";
import { COLOR, TYPE } from "../brand/tokens";
import {
  Figure,
  FLOOR,
  LUNGE,
  mix,
  PLIE,
  Pose,
  RISE,
  STAND,
} from "../laban3/StickScore";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------- Map of Europe with Germany glowing ----------
const countries = feature(
  world as unknown as Topology,
  (world as unknown as Topology).objects.countries as GeometryCollection,
) as unknown as FeatureCollection<Geometry, { name: string }>;
const projection = geoNaturalEarth1().fitExtent(
  [
    [60, 40],
    [1860, 1040],
  ],
  {
    type: "MultiPoint",
    coordinates: [
      [-11, 36],
      [32, 36],
      [-11, 61],
      [32, 61],
    ],
  },
);
const pathGen = geoPath(projection);
const LAND = countries.features.map((f) => ({
  name: f.properties.name,
  d: pathGen(f) ?? "",
}));
const GERMANY = countries.features.find((f) => f.properties.name === "Germany");
export const GERMANY_AT = GERMANY
  ? (pathGen.centroid(GERMANY) as [number, number])
  : ([960, 540] as [number, number]);

export const GermanyMap: React.FC<{ drawAt: number }> = ({ drawAt }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [drawAt, drawAt + 40], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const pulse = 0.65 + 0.35 * Math.sin(frame / 9);
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.ink }}>
      <svg width={1920} height={1080}>
        <defs>
          <filter id="deGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {LAND.map((c) =>
          c.name === "Germany" ? null : (
            <path
              key={c.name}
              d={c.d}
              fill="#1b1220"
              stroke={COLOR.gold}
              strokeOpacity={0.22}
              strokeWidth={1}
            />
          ),
        )}
        {GERMANY ? (
          <>
            <path
              d={pathGen(GERMANY) ?? ""}
              fill={COLOR.rose}
              fillOpacity={0.12 + 0.45 * draw * pulse}
              filter="url(#deGlow)"
            />
            <path
              d={pathGen(GERMANY) ?? ""}
              fill="none"
              stroke={COLOR.gold}
              strokeWidth={2.5}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - draw}
              filter="url(#deGlow)"
            />
          </>
        ) : null}
      </svg>
      <div
        style={{
          position: "absolute",
          left: GERMANY_AT[0] - 200,
          width: 400,
          top: GERMANY_AT[1] - 16,
          textAlign: "center",
          ...TYPE.label,
          fontSize: 26,
          letterSpacing: "0.3em",
          color: COLOR.white,
          opacity: interpolate(
            frame,
            [drawAt + 26, drawAt + 40],
            [0, 1],
            clamp,
          ),
          textShadow: "0 2px 10px #000",
        }}
      >
        Germany
      </div>
    </AbsoluteFill>
  );
};

// ---------- Rolling year counter ----------
export const YearCounter: React.FC<{
  from: number;
  to: number;
  start: number;
  end: number;
  size?: number;
}> = ({ from, to, start, end, size = 220 }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, end], [from, to], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const year = Math.round(v);
  const settle = frame >= end ? Math.exp(-(frame - end) / 6) : 0;
  return (
    <div
      style={{
        ...TYPE.heavy,
        fontSize: size,
        lineHeight: 1,
        color: frame >= end ? COLOR.gold : COLOR.white,
        fontVariantNumeric: "tabular-nums",
        scale: String(1 + 0.08 * settle),
        transformOrigin: "left center",
        opacity: interpolate(frame, [start - 6, start], [0, 1], clamp),
        textShadow:
          frame >= end
            ? `0 0 30px ${COLOR.gold}88, 0 6px 26px rgba(0,0,0,0.85)`
            : "0 6px 26px rgba(0,0,0,0.85)",
      }}
    >
      {year}
    </div>
  );
};

// ---------- Timeline 1930–1940 ----------
const T_X0 = 200;
const T_X1 = 1720;
export const yearX = (y: number) => T_X0 + ((y - 1930) / 10) * (T_X1 - T_X0);

export const Timeline: React.FC<{
  y: number;
  drawAt: number;
  marks: {
    year: number;
    at: number;
    label: string;
    rose?: boolean;
    drop?: number;
  }[];
  bar: { from: number; to: number; at: number; dur: number; label: string };
}> = ({ y, drawAt, marks, bar }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [drawAt, drawAt + 30], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const grow = interpolate(frame, [bar.at, bar.at + bar.dur], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const bx0 = yearX(bar.from);
  const bx1 = bx0 + (yearX(bar.to) - bx0) * grow;
  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <defs>
        <linearGradient id="tlBar" x1="0" x2="1">
          <stop offset="0" stopColor={COLOR.gold} stopOpacity={1} />
          <stop offset="0.7" stopColor={COLOR.gold} stopOpacity={0.9} />
          <stop offset="1" stopColor={COLOR.gold} stopOpacity={0} />
        </linearGradient>
      </defs>
      <line
        x1={T_X0}
        x2={T_X0 + (T_X1 - T_X0) * draw}
        y1={y}
        y2={y}
        stroke={COLOR.white}
        strokeOpacity={0.6}
        strokeWidth={2}
      />
      {Array.from({ length: 11 }).map((_, i) => {
        const yr = 1930 + i;
        const o = interpolate(
          frame,
          [drawAt + i * 2, drawAt + i * 2 + 8],
          [0, 1],
          clamp,
        );
        return (
          <g key={yr} opacity={o}>
            <line
              x1={yearX(yr)}
              x2={yearX(yr)}
              y1={y - 10}
              y2={y + 10}
              stroke={COLOR.white}
              strokeOpacity={0.6}
              strokeWidth={2}
            />
            <text
              x={yearX(yr)}
              y={y + 52}
              textAnchor="middle"
              fill={COLOR.white}
              fillOpacity={0.75}
              style={{ ...TYPE.label, fontSize: 24, letterSpacing: "0.08em" }}
            >
              {yr}
            </text>
          </g>
        );
      })}
      {grow > 0 ? (
        <>
          <rect
            x={bx0}
            y={y - 9}
            width={Math.max(0, bx1 - bx0)}
            height={18}
            rx={9}
            fill="url(#tlBar)"
            style={{ filter: `drop-shadow(0 0 12px ${COLOR.gold})` }}
          />
          <text
            x={bx0}
            y={y - 30}
            fill={COLOR.gold}
            opacity={interpolate(
              frame,
              [bar.at + 10, bar.at + 24],
              [0, 1],
              clamp,
            )}
            style={{ ...TYPE.label, fontSize: 24, letterSpacing: "0.2em" }}
          >
            {bar.label}
          </text>
        </>
      ) : null}
      {marks.map((m) => {
        const t = interpolate(frame, [m.at, m.at + 12], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.back(1.6)),
        });
        if (t <= 0) return null;
        const c = m.rose ? COLOR.rose : COLOR.gold;
        const x = yearX(m.year);
        return (
          <g key={m.year} opacity={Math.min(1, t)}>
            <line
              x1={x}
              x2={x}
              y1={y + 70}
              y2={y + 70 + (90 + (m.drop ?? 0)) * t}
              stroke={c}
              strokeWidth={2}
            />
            <circle
              cx={x}
              cy={y}
              r={14 * t}
              fill={c}
              style={{ filter: `drop-shadow(0 0 10px ${c})` }}
            />
            <text
              x={x}
              y={y + 200 + (m.drop ?? 0)}
              textAnchor="middle"
              fill={COLOR.white}
              style={{ ...TYPE.heavy, fontSize: 40 }}
            >
              {m.year}
            </text>
            <text
              x={x}
              y={y + 238 + (m.drop ?? 0)}
              textAnchor="middle"
              fill={c}
              style={{ ...TYPE.label, fontSize: 22, letterSpacing: "0.14em" }}
            >
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ---------- A printed photo that tears, then is put back ----------
export const TearPhoto: React.FC<{
  src: string;
  tearAt: number;
  backAt: number;
  pos?: string;
}> = ({ src, tearAt, backAt, pos = "30% 40%" }) => {
  const frame = useCurrentFrame();
  const W = 1120;
  const H = 680;
  const tear = interpolate(frame, [tearAt, tearAt + 30], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const back = interpolate(frame, [backAt, backAt + 30], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const p = tear * (1 - back);
  const tape = interpolate(frame, [backAt + 30, backAt + 40], [0, 1], clamp);
  // ragged seam a little right of centre
  const seam = Array.from({ length: 24 }).map((_, i) => [
    W * 0.58 + (random(`seam${i}`) - 0.5) * 34,
    (H * i) / 23,
  ]);
  const seamPts = seam
    .map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`)
    .join(", ");
  const left = `polygon(0px 0px, ${seamPts}, 0px ${H}px)`;
  const right = `polygon(${seamPts}, ${W}px ${H}px, ${W}px 0px)`;
  const card = (clip: string, style: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: W,
        height: H,
        clipPath: clip,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#efe6d3",
          padding: 26,
          boxSizing: "border-box",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: pos,
            filter: "grayscale(1) contrast(1.1) sepia(0.15)",
          }}
        />
      </div>
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 960 - W / 2,
        top: 540 - H / 2 - 20,
        width: W,
        height: H,
        rotate: "-2deg",
        filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.7))",
      }}
    >
      {card(left, {
        translate: `${-p * 40}px ${p * 10}px`,
        rotate: `${-p * 2}deg`,
      })}
      {card(right, {
        translate: `${p * 380}px ${p * 90}px`,
        rotate: `${p * 14}deg`,
        transformOrigin: "58% 100%",
      })}
      {tape > 0 ? (
        <div
          style={{
            position: "absolute",
            left: W * 0.58 - 70,
            top: H * 0.38,
            width: 140,
            height: 46,
            background: "rgba(244,236,214,0.55)",
            rotate: "-12deg",
            opacity: tape,
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          }}
        />
      ) : null}
    </div>
  );
};

// ---------- Crowd: a movement choir that becomes a drilled mass ----------
const C = (p: Pose): Pose => ({ ...p, hx: 0 });
const CHOIR = [C(STAND), C(RISE), C(LUNGE), C(PLIE)];
const DRILL: Pose = {
  hx: 0,
  t: 0,
  armF: [90, 90],
  armB: [90, 90],
  legF: [28, 0, 10],
  legB: [-28, 0, 10],
};
const SOLO = [
  C(RISE),
  { ...C(LUNGE), armB: [150, 170] as [number, number] },
  C(PLIE),
  { ...C(RISE), armF: [120, 90] as [number, number] },
];
const loop = (keys: Pose[], ph: number) => {
  const n = keys.length;
  const x = (((ph % 1) + 1) % 1) * n;
  const i = Math.floor(x);
  const t = Easing.inOut(Easing.sin)(x - i);
  return mix(keys[i], keys[(i + 1) % n], t);
};
const ROWS = 6;
const COLS = 11;
export const SOLO_INDEX = 5 * COLS + 6;

export const Crowd: React.FC<{
  // 0 = movement choir (organic, rippling) → 1 = drilled mass (grid, unison)
  t: number;
  solo?: number;
}> = ({ t, solo = 0 }) => {
  const frame = useCurrentFrame();
  // the drill snaps between two poses on a hard beat
  const beat = Math.floor(frame / 22);
  const snap = Easing.out(Easing.exp)(Math.min(1, (frame % 22) / 5));
  const drill =
    beat % 2 === 0 ? mix(C(STAND), DRILL, snap) : mix(DRILL, C(STAND), snap);
  const warm = "#F1E6CF";
  const cold = "#DCE2EA";
  const figs: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    const k = 0.16 + 0.065 * r;
    const spacing = 160 * (k / 0.35);
    const rowY = 520 + r * 100;
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      const jx =
        (random(`cx${i}`) - 0.5) * spacing * 0.8 +
        Math.sin(r * 1.3 + c * 0.7) * spacing * 0.3;
      const jy = (random(`cy${i}`) - 0.5) * 40;
      const x = 960 + (c - (COLS - 1) / 2) * spacing + jx * (1 - t);
      const y = rowY + jy * (1 - t);
      const ripple = c * 0.035 + r * 0.06 + random(`co${i}`) * 0.06;
      const choirPose = loop(CHOIR, frame / 150 + ripple);
      const isSolo = i === SOLO_INDEX && solo > 0;
      const own = isSolo
        ? mix(choirPose, loop(SOLO, frame / 110), solo * (1 - t))
        : choirPose;
      const pose = mix(own, drill, t);
      const color = isSolo && t < 0.5 ? COLOR.rose : t > 0.5 ? cold : warm;
      figs.push(
        <g
          key={i}
          transform={`translate(${x} ${y}) scale(${k}) translate(0 ${-FLOOR})`}
        >
          <Figure
            pose={pose}
            color={color}
            glow={isSolo}
            opacity={0.55 + 0.45 * (r / (ROWS - 1))}
          />
        </g>,
      );
    }
  }
  const soloR = Math.floor(SOLO_INDEX / COLS);
  const soloK = 0.16 + 0.065 * soloR;
  const soloX =
    960 +
    ((SOLO_INDEX % COLS) - (COLS - 1) / 2) * 160 * (soloK / 0.35) +
    ((random(`cx${SOLO_INDEX}`) - 0.5) * 160 * (soloK / 0.35) * 0.8 +
      Math.sin(soloR * 1.3 + (SOLO_INDEX % COLS) * 0.7) *
        160 *
        (soloK / 0.35) *
        0.3) *
      (1 - t);
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 70%, rgba(232,194,122,${0.12 * (1 - t)}), rgba(13,7,16,0) 70%), radial-gradient(ellipse 70% 40% at 50% 100%, rgba(224,69,123,${0.22 * t}), rgba(0,0,0,0) 70%)`,
        }}
      />
      {/* spotlight on the one dancer moving her own way */}
      {solo > 0 && t < 1 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle 260px at ${soloX}px ${520 + soloR * 100 - 150}px, rgba(224,69,123,${0.22 * solo * (1 - t)}), rgba(0,0,0,0) 100%)`,
          }}
        />
      ) : null}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <line
          x1={0}
          x2={1920}
          y1={520 + (ROWS - 1) * 100 + 8}
          y2={520 + (ROWS - 1) * 100 + 8}
          stroke={COLOR.white}
          strokeOpacity={0.12}
        />
        {figs}
      </svg>
    </AbsoluteFill>
  );
};
