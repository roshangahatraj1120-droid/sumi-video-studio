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
import { geoInterpolate, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import world from "world-atlas/countries-110m.json";
import { COLOR, TYPE } from "../brand/tokens";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const ease = (f: number, a: number, b: number, e = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });

// ---------- Slide card ----------
// Glass card that swings in on a 3D hinge: kicker + title, optional icon on the right.
export const SlideCard: React.FC<{
  start: number;
  end?: number;
  kicker: string;
  title: string;
  x: number;
  y: number;
  width?: number;
  titleSize?: number;
  serif?: boolean;
  icon?: React.ReactNode;
  from?: "left" | "right";
  // opaque card, for chroma-green overlays
  solid?: boolean;
}> = ({
  start,
  end,
  kicker,
  title,
  x,
  y,
  width = 560,
  titleSize = 72,
  serif = true,
  icon,
  from = "left",
  solid = false,
}) => {
  const frame = useCurrentFrame();
  if (frame < start || (end !== undefined && frame >= end)) return null;
  const p = ease(frame, start, start + 16, Easing.out(Easing.back(1.2)));
  const out =
    end !== undefined ? interpolate(frame, [end - 8, end], [1, 0], clamp) : 1;
  const s = from === "left" ? -1 : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        perspective: 900,
        opacity: Math.min(1, p * 1.5) * out,
      }}
    >
      <div
        style={{
          transformOrigin: from === "left" ? "left center" : "right center",
          transform: `translateX(${(1 - p) * 90 * s}px) rotateY(${(1 - p) * 38 * -s}deg)`,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "20px 28px",
          background: solid ? COLOR.ink : "rgba(13,7,16,0.66)",
          backdropFilter: solid ? undefined : "blur(8px)",
          border: `1px solid ${COLOR.gold}55`,
          borderLeft: `5px solid ${COLOR.gold}`,
          borderRadius: 6,
          boxShadow: `0 18px 50px rgba(0,0,0,0.55), 0 0 30px ${COLOR.gold}22`,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              ...TYPE.label,
              fontSize: 24,
              letterSpacing: "0.28em",
              color: COLOR.gold,
              opacity: 0.85,
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              ...(serif
                ? TYPE.headline
                : { ...TYPE.heavy, textTransform: "uppercase" as const }),
              fontSize: titleSize,
              lineHeight: 1.05,
              color: COLOR.white,
              marginTop: 6,
              textShadow: `0 0 18px ${COLOR.gold}33`,
            }}
          >
            {title}
          </div>
        </div>
        {icon ? (
          <div style={{ width: 110, height: 110, flexShrink: 0 }}>{icon}</div>
        ) : null}
      </div>
    </div>
  );
};

// ---------- Icosahedron (Laban's kinesphere model) ----------
const PHI = (1 + Math.sqrt(5)) / 2;
const ICO_V: [number, number, number][] = [
  [-1, PHI, 0],
  [1, PHI, 0],
  [-1, -PHI, 0],
  [1, -PHI, 0],
  [0, -1, PHI],
  [0, 1, PHI],
  [0, -1, -PHI],
  [0, 1, -PHI],
  [PHI, 0, -1],
  [PHI, 0, 1],
  [-PHI, 0, -1],
  [-PHI, 0, 1],
];
const ICO_E: [number, number][] = [];
for (let i = 0; i < 12; i++)
  for (let j = i + 1; j < 12; j++) {
    const d = Math.hypot(...ICO_V[i].map((v, k) => v - ICO_V[j][k]));
    if (Math.abs(d - 2) < 0.01) ICO_E.push([i, j]);
  }

export const Icosahedron: React.FC<{
  size: number;
  spin?: number;
  draw?: number;
  stroke?: string;
}> = ({ size, spin = 0, draw = 1, stroke = COLOR.gold }) => {
  const a = spin;
  const b = spin * 0.6 + 0.5;
  const proj = ([x, y, z]: [number, number, number]) => {
    const x1 = x * Math.cos(a) - z * Math.sin(a);
    const z1 = x * Math.sin(a) + z * Math.cos(a);
    const y1 = y * Math.cos(b) - z1 * Math.sin(b);
    const z2 = y * Math.sin(b) + z1 * Math.cos(b);
    const k = 5 / (5 - z2);
    return [
      (x1 * k * size) / 4.2 + size / 2,
      (y1 * k * size) / 4.2 + size / 2,
      z2,
    ] as const;
  };
  const P = ICO_V.map(proj);
  return (
    <svg
      width={size}
      height={size}
      style={{ overflow: "visible", filter: `drop-shadow(0 0 6px ${stroke})` }}
    >
      {ICO_E.map(([i, j], n) => {
        const depth = (P[i][2] + P[j][2]) / 2;
        return (
          <line
            key={n}
            x1={P[i][0]}
            y1={P[i][1]}
            x2={
              P[i][0] +
              (P[j][0] - P[i][0]) * Math.min(1, Math.max(0, draw * 30 - n))
            }
            y2={
              P[i][1] +
              (P[j][1] - P[i][1]) * Math.min(1, Math.max(0, draw * 30 - n))
            }
            stroke={stroke}
            strokeWidth={depth > 0 ? 2.2 : 1.1}
            strokeOpacity={depth > 0 ? 1 : 0.45}
          />
        );
      })}
      {P.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={p[2] > 0 ? 3.2 : 2}
          fill={stroke}
          opacity={draw}
        />
      ))}
    </svg>
  );
};

// ---------- Concept icons for direction / shape / geometry / weight / time ----------
export const ConceptIcon: React.FC<{
  kind: "direction" | "shape" | "geometry" | "weight" | "time";
  t: number;
}> = ({ kind, t }) => {
  const frame = useCurrentFrame();
  const g = COLOR.gold;
  const sw = {
    stroke: g,
    strokeWidth: 4,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (kind === "geometry")
    return <Icosahedron size={110} spin={frame / 40} draw={t} />;
  return (
    <svg
      width={110}
      height={110}
      viewBox="0 0 110 110"
      style={{ overflow: "visible", filter: `drop-shadow(0 0 5px ${g})` }}
    >
      {kind === "direction"
        ? [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const a = (i / 8) * Math.PI * 2;
            const len = 40 * Math.min(1, Math.max(0, t * 8 - i));
            return (
              <g key={i}>
                <line
                  x1={55}
                  y1={55}
                  x2={55 + Math.cos(a) * len}
                  y2={55 + Math.sin(a) * len}
                  {...sw}
                  strokeWidth={3}
                />
                {i === 0 ? (
                  <path
                    d={`M ${55 + len - 10} 47 L ${55 + len} 55 L ${55 + len - 10} 63`}
                    {...sw}
                    strokeWidth={3}
                  />
                ) : null}
              </g>
            );
          })
        : null}
      {kind === "shape" ? (
        <path
          d="M 55 8 L 98 40 L 82 98 L 28 98 L 12 40 Z"
          {...sw}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - t}
        />
      ) : null}
      {kind === "weight" ? (
        <g>
          <line x1={10} y1={100} x2={100} y2={100} {...sw} />
          <rect
            x={30}
            y={interpolate(t, [0, 0.7, 0.85, 1], [-10, 52, 46, 52], clamp)}
            width={50}
            height={44}
            fill={g}
            opacity={Math.min(1, t * 2)}
          />
          <path
            d="M 55 8 L 55 30 M 47 22 L 55 30 L 63 22"
            {...sw}
            strokeWidth={3}
            opacity={1 - t * 0.6}
          />
        </g>
      ) : null}
      {kind === "time" ? (
        <g>
          <circle cx={55} cy={55} r={44} {...sw} strokeOpacity={0.4} />
          <circle
            cx={55}
            cy={55}
            r={44}
            {...sw}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - ((frame / 60) % 1) * t}
            transform="rotate(-90 55 55)"
          />
          <line
            x1={55}
            y1={55}
            x2={55 + Math.sin((frame / 60) * Math.PI * 2) * 32}
            y2={55 - Math.cos((frame / 60) * Math.PI * 2) * 32}
            {...sw}
            strokeWidth={3}
          />
        </g>
      ) : null}
    </svg>
  );
};

// ---------- 3D space: panels floating in depth, camera dollies through ----------
export type SpacePanel = {
  src: string;
  x: number;
  y: number;
  z: number;
  ry?: number;
  label: string;
  kicker: string;
};

export const Space3D: React.FC<{
  panels: SpacePanel[];
  camZ: number;
  width?: number;
}> = ({ panels, camZ, width = 1280 }) => {
  const frame = useCurrentFrame();
  const P = 1200;
  const height = width * 0.5625;
  return (
    <AbsoluteFill
      style={{ backgroundColor: COLOR.ink, perspective: P, overflow: "hidden" }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(232,194,122,0.10), rgba(13,7,16,0) 65%)",
        }}
      />
      <AbsoluteFill
        style={{
          transformStyle: "preserve-3d",
          transform: `translateZ(${camZ}px)`,
        }}
      >
        {/* drifting motes at many depths for parallax */}
        {Array.from({ length: 90 }).map((_, i) => {
          const z = -2600 + random(`mz${i}`) * 3400;
          const d = z + camZ;
          if (d > P - 60) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 960 + (random(`mx${i}`) - 0.5) * 3600,
                top:
                  540 +
                  (random(`my${i}`) - 0.5) * 2200 +
                  Math.sin(frame / 30 + i) * 10,
                width: 6,
                height: 6,
                borderRadius: 3,
                background: COLOR.gold,
                opacity: 0.25 + random(`mo${i}`) * 0.5,
                boxShadow: `0 0 10px ${COLOR.gold}`,
                transform: `translateZ(${z}px)`,
              }}
            />
          );
        })}
        {/* paint far panels first so labels never bleed through nearer ones */}
        {[...panels]
          .sort((a, b) => a.z - b.z)
          .map((p, i) => {
            const d = p.z + camZ;
            const o = interpolate(
              d,
              [-2600, -1700, 700, 1000],
              [0, 1, 1, 0],
              clamp,
            );
            if (o <= 0) return null;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 960 - width / 2,
                  top: 540 - height / 2,
                  width,
                  height,
                  transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateY(${p.ry ?? 0}deg)`,
                  opacity: o,
                }}
              >
                <Img
                  src={staticFile(p.src)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    border: `2px solid ${COLOR.gold}aa`,
                    boxShadow: `0 30px 80px rgba(0,0,0,0.7), 0 0 40px ${COLOR.gold}33`,
                    filter: "grayscale(0.2) sepia(0.3) contrast(1.06)",
                  }}
                />
                <div style={{ position: "absolute", left: 34, bottom: 28 }}>
                  <div
                    style={{
                      ...TYPE.label,
                      fontSize: 26,
                      letterSpacing: "0.3em",
                      color: COLOR.gold,
                      textShadow: "0 2px 10px #000",
                    }}
                  >
                    {p.kicker}
                  </div>
                  <div
                    style={{
                      ...TYPE.heavy,
                      fontSize: 96,
                      lineHeight: 1,
                      textTransform: "uppercase",
                      color: COLOR.white,
                      textShadow: `0 4px 24px rgba(0,0,0,0.9), 0 0 24px ${COLOR.gold}55`,
                    }}
                  >
                    {p.label}
                  </div>
                </div>
              </div>
            );
          })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- World map with a data arc (Europe → USA) ----------
const countries = feature(
  world as unknown as Topology,
  (world as unknown as Topology).objects.countries as GeometryCollection,
) as unknown as FeatureCollection<Geometry, { name: string }>;

const projection = geoNaturalEarth1().fitExtent(
  [
    [40, 60],
    [1880, 1040],
  ],
  {
    type: "MultiPoint",
    coordinates: [
      [-110, 18],
      [40, 18],
      [-110, 66],
      [40, 66],
    ],
  },
);
const pathGen = geoPath(projection);
const LAND = countries.features.map((f) => ({
  name: f.properties.name,
  d: pathGen(f) ?? "",
}));
const EUROPE_HL = new Set([
  "Austria",
  "Hungary",
  "Slovakia",
  "Czechia",
  "Germany",
]);
const USA = "United States of America";
const FROM: [number, number] = [17.1, 48.15]; // Bratislava
const TO: [number, number] = [-74.0, 40.7]; // New York
const interp = geoInterpolate(FROM, TO);
const ARC = Array.from({ length: 81 }).map(
  (_, i) => projection(interp(i / 80)) as [number, number],
);
const ARC_D = ARC.map(
  (p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`,
).join(" ");
export const MAP_FROM = projection(FROM) as [number, number];
export const MAP_TO = projection(TO) as [number, number];

export const WorldArc: React.FC<{
  arcStart: number;
  arcEnd: number;
  usaAt: number;
}> = ({ arcStart, arcEnd, usaAt }) => {
  const frame = useCurrentFrame();
  const draw = ease(frame, arcStart, arcEnd, Easing.inOut(Easing.cubic));
  const land = ease(frame, 0, 30);
  const eu = ease(frame, 14, 40);
  const us = ease(frame, usaAt, usaAt + 20);
  const head = ARC[Math.min(80, Math.floor(draw * 80))];
  const pulse = (at: number) => {
    const t = (frame - at) % 40;
    return frame < at ? null : { r: 10 + t * 1.6, o: Math.max(0, 1 - t / 40) };
  };
  const pA = pulse(20);
  const pB = pulse(usaAt);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <defs>
        <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* graticule */}
      {Array.from({ length: 13 }).map((_, i) => {
        const lon = -150 + i * 20;
        const pts = Array.from({ length: 30 }).map(
          (__, k) => projection([lon, -10 + k * 3]) as [number, number],
        );
        return (
          <path
            key={i}
            d={pts.map((p, k) => `${k ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ")}
            stroke={COLOR.gold}
            strokeOpacity={0.07 * land}
            fill="none"
          />
        );
      })}
      {LAND.map((c) => {
        const isEu = EUROPE_HL.has(c.name);
        const isUs = c.name === USA;
        return (
          <path
            key={c.name}
            d={c.d}
            fill={
              isEu
                ? `rgba(224,69,123,${0.55 * eu})`
                : isUs
                  ? `rgba(232,194,122,${0.45 * us})`
                  : "rgba(244,241,234,0.06)"
            }
            stroke={isEu || isUs ? COLOR.gold : "rgba(232,194,122,0.35)"}
            strokeWidth={isEu || isUs ? 1.6 : 0.7}
            strokeOpacity={land}
            filter={
              (isEu && eu > 0) || (isUs && us > 0) ? "url(#mapGlow)" : undefined
            }
          />
        );
      })}
      <path
        d={ARC_D}
        fill="none"
        stroke={COLOR.gold}
        strokeOpacity={0.25}
        strokeWidth={2}
        strokeDasharray="6 10"
      />
      <path
        d={ARC_D}
        fill="none"
        stroke={COLOR.gold}
        strokeWidth={4}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
        filter="url(#mapGlow)"
      />
      {draw > 0 && draw < 1 ? (
        <circle
          cx={head[0]}
          cy={head[1]}
          r={9}
          fill="#FFF1CC"
          filter="url(#mapGlow)"
        />
      ) : null}
      {[
        { p: MAP_FROM, pl: pA },
        { p: MAP_TO, pl: pB },
      ].map(({ p, pl }, i) =>
        pl ? (
          <g key={i}>
            <circle
              cx={p[0]}
              cy={p[1]}
              r={pl.r}
              fill="none"
              stroke={COLOR.gold}
              strokeWidth={2}
              opacity={pl.o}
            />
            <circle
              cx={p[0]}
              cy={p[1]}
              r={7}
              fill={COLOR.gold}
              filter="url(#mapGlow)"
            />
          </g>
        ) : null,
      )}
    </svg>
  );
};
