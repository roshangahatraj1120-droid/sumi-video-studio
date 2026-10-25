import React, { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLOR } from "../brand/tokens";
import { ANTON, clamp, ease, MONO, RED } from "./kit";

// Hip-hop kit, part 2 (Chapter 1 rebuild): zoom-through text matte, typewriter, photocopy filter,
// 3D tilted evidence board, 3D photo fly-through, film burn, beat-drop shockwave, merging split panels.

// ---------- typewriter ----------
export const TypeOn: React.FC<{
  text: string;
  at: number;
  cps?: number;
  style?: React.CSSProperties;
  cursor?: boolean;
}> = ({ text, at, cps = 1.2, style, cursor = true }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const n = Math.min(text.length, Math.floor((frame - at) * cps));
  const done = n >= text.length;
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <span style={{ ...MONO, whiteSpace: "pre", ...style }}>
      {text.slice(0, n)}
      {cursor && (!done || blink) ? (
        <span style={{ color: RED, marginLeft: 2 }}>▍</span>
      ) : null}
    </span>
  );
};

// ---------- photocopy / newsprint filter (SVG filter referenced from CSS) ----------
export const PhotocopyDefs: React.FC<{ id: string }> = ({ id }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter
      id={id}
      x="0"
      y="0"
      width="100%"
      height="100%"
      colorInterpolationFilters="sRGB"
    >
      <feColorMatrix type="saturate" values="0" result="g" />
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves={2}
        seed={3}
        result="n"
      />
      <feColorMatrix
        in="n"
        type="matrix"
        values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.35 0"
        result="nn"
      />
      <feBlend in="g" in2="nn" mode="multiply" result="b" />
      <feComponentTransfer in="b">
        <feFuncR type="discrete" tableValues="0.06 0.16 0.42 0.8 0.95" />
        <feFuncG type="discrete" tableValues="0.06 0.16 0.42 0.8 0.95" />
        <feFuncB type="discrete" tableValues="0.05 0.15 0.4 0.76 0.9" />
      </feComponentTransfer>
    </filter>
  </svg>
);

// ---------- zoom-through text matte ----------
// The picture shows only inside giant letters; then the letters scale up around a point inside one
// letter until its counter fills the frame and we are inside the full picture.
export const TextMatte: React.FC<{
  text: string;
  src: string;
  size: number;
  y: number;
  zoomAt: number;
  zoomDur: number;
  ox: number;
  oy: number;
  filter?: string;
  imgStyle?: React.CSSProperties;
}> = ({ text, src, size, y, zoomAt, zoomDur, ox, oy, filter, imgStyle }) => {
  const frame = useCurrentFrame();
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const z = interpolate(frame, [zoomAt, zoomAt + zoomDur], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const s = Math.exp(z * Math.log(40));
  const settle = interpolate(frame, [0, zoomAt], [1.06, 1], clamp);
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <clipPath id={`tm${id}`} clipPathUnits="userSpaceOnUse">
          <text
            x={960}
            y={y}
            textAnchor="middle"
            transform={`translate(${ox} ${oy}) scale(${s * settle}) translate(${-ox} ${-oy})`}
            style={{ fontFamily: "Anton", fontSize: size }}
          >
            {text.toUpperCase()}
          </text>
        </clipPath>
      </svg>
      <AbsoluteFill style={{ clipPath: `url(#tm${id})` }}>
        <Img
          src={staticFile(src)}
          style={{
            position: "absolute",
            width: 1920,
            height: 1080,
            filter,
            ...imgStyle,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- 3D tilted board with clippings (reference 4 + 5) ----------
export type Clip = {
  src: string;
  x: number;
  y: number;
  w: number;
  rot: number;
  at: number;
  label?: string;
};
export const Board3D: React.FC<{
  clips: Clip[];
  camX: number;
  camY?: number;
  tilt?: number;
  filterId: string;
  children?: React.ReactNode;
}> = ({ clips, camX, camY = 0, tilt = 20, filterId, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        perspective: 1400,
        perspectiveOrigin: "50% 40%",
        backgroundColor: "#0D0C0B",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 3800,
          height: 1300,
          transformOrigin: "960px 540px",
          transform: `translate(${-camX}px, ${-camY}px) rotateX(${tilt}deg) rotateZ(-2.5deg)`,
          background:
            "linear-gradient(160deg, #2A2724 0%, #1B1917 60%, #141210 100%)",
        }}
      >
        {[0, 1900].map((x) => (
          <Img
            key={x}
            src={staticFile("hiphop/n10.jpg")}
            style={{
              position: "absolute",
              left: x,
              top: 0,
              width: 1900,
              height: 1300,
              objectFit: "cover",
              filter: `url(#${filterId})`,
              opacity: 0.13,
            }}
          />
        ))}
        {/* newsprint grain on the board */}
        <svg
          width={3800}
          height={1300}
          style={{ position: "absolute", opacity: 0.5 }}
        >
          <filter id={`bd${filterId}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves={2}
              seed={9}
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.6  0 0 0 0 0.58  0 0 0 0 0.55  0 0 0 0.18 0"
            />
          </filter>
          <rect width={3800} height={1300} filter={`url(#bd${filterId})`} />
        </svg>
        {clips.map((c, i) => {
          if (frame < c.at) return null;
          const p = interpolate(frame, [c.at, c.at + 8], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.back(1.4)),
          });
          const h = c.w * 0.6;
          const jag = Array.from({ length: 20 })
            .map((_, k) => {
              const t = k / 19;
              return `${(t * 100).toFixed(1)}% ${(random(`j${i}${k}`) * 2.5).toFixed(1)}%`;
            })
            .concat(
              Array.from({ length: 20 }).map((_, k) => {
                const t = 1 - k / 19;
                return `${(t * 100).toFixed(1)}% ${(100 - random(`k${i}${k}`) * 2.5).toFixed(1)}%`;
              }),
            )
            .join(", ");
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: c.x - c.w / 2,
                top: c.y - h / 2,
                width: c.w,
                height: h,
                rotate: `${c.rot + (1 - p) * 8}deg`,
                scale: String(1.3 - 0.3 * p),
                opacity: Math.min(1, (frame - c.at) / 3),
                filter: `drop-shadow(${8 + (1 - p) * 30}px ${12 + (1 - p) * 40}px 14px rgba(0,0,0,0.6))`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: `polygon(${jag})`,
                  background: "#E8E2D6",
                  padding: 10,
                }}
              >
                <Img
                  src={staticFile(c.src)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: `url(#${filterId})`,
                    display: "block",
                  }}
                />
              </div>
              {/* tape */}
              <div
                style={{
                  position: "absolute",
                  left: c.w / 2 - 60,
                  top: -18,
                  width: 120,
                  height: 34,
                  background: "rgba(232,224,200,0.8)",
                  rotate: "-3deg",
                }}
              />
              {c.label ? (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: h + 18,
                    width: c.w * 1.4,
                    ...MONO,
                    fontSize: 30,
                    color: "#EDE7DA",
                  }}
                >
                  <TypeOn text={c.label} at={c.at + 8} cps={1.6} />
                </div>
              ) : null}
            </div>
          );
        })}
        {children}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3D photo fly-through ----------
export type FlyCard = {
  src: string;
  fx: number;
  fy: number;
  zoom: number;
  x: number;
  y: number;
  z: number;
  word: string;
  rot?: number;
};
const CW = 1240;
const CH = 698;
export const Fly3D: React.FC<{
  cards: FlyCard[];
  camZ: number;
  camX?: number;
}> = ({ cards, camZ, camX = 0 }) => {
  return (
    <AbsoluteFill
      style={{
        perspective: 1100,
        perspectiveOrigin: "50% 50%",
        overflow: "hidden",
      }}
    >
      {/* bokeh specks at many depths for parallax */}
      {Array.from({ length: 70 }).map((_, i) => {
        const z = -random(`bz${i}`) * 9000;
        const rel = z - camZ;
        if (rel > 900) return null;
        return (
          <div
            key={`b${i}`}
            style={{
              position: "absolute",
              left: 960,
              top: 540,
              width: 10 + random(`bs${i}`) * 26,
              height: 10 + random(`bs${i}`) * 26,
              borderRadius: "50%",
              background: "rgba(255,190,110,0.55)",
              filter: "blur(4px)",
              transform: `translate3d(${(random(`bx${i}`) - 0.5) * 4200}px, ${(random(`by${i}`) - 0.5) * 2400}px, ${rel}px)`,
            }}
          />
        );
      })}
      {cards.map((c, i) => {
        const rel = c.z - camZ;
        if (rel > 1000) return null;
        const k = (c.zoom * CW) / 1920;
        const fade = interpolate(
          rel,
          [-2300, -1500, -900, 0, 320],
          [0, 0.3, 1, 1, 0],
          clamp,
        );
        const near = interpolate(rel, [-1100, -700], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 960 - CW / 2,
              top: 540 - CH / 2,
              width: CW,
              height: CH,
              transform: `translate3d(${c.x - camX}px, ${c.y}px, ${rel}px) rotateY(${c.rot ?? 0}deg)`,
              opacity: fade,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
                outline: "6px solid #F2EEE6",
              }}
            >
              <Img
                src={staticFile(c.src)}
                style={{
                  position: "absolute",
                  width: 1920 * k,
                  height: 1080 * k,
                  left: CW / 2 - c.fx * k,
                  top: CH / 2 - c.fy * k,
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                width: CW,
                top: CH + 26,
                textAlign: "center",
                opacity: near,
                ...ANTON,
                fontSize: 120,
                color: COLOR.white,
                textShadow: "0 10px 30px rgba(0,0,0,0.9)",
              }}
            >
              {c.word}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- film burn ----------
// A burning hole opens from a point: hot orange edge, then the new picture.
export const BurnReveal: React.FC<{
  at: number;
  dur?: number;
  src: string;
  cx?: number;
  cy?: number;
  scale?: number;
  filter?: string;
}> = ({ at, dur = 22, src, cx = 980, cy = 520, scale = 1.12, filter }) => {
  const frame = useCurrentFrame();
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  if (frame < at) return null;
  const p = interpolate(frame, [at, at + dur], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const r = p * 1500;
  const w = 1920 * scale;
  const h = 1080 * scale;
  return (
    <AbsoluteFill>
      <Img
        src={staticFile(src)}
        style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          <filter id={`bf${id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009"
              numOctaves={3}
              seed={11}
            />
            <feDisplacementMap in="SourceGraphic" scale={220} />
          </filter>
          <filter id={`bg${id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009"
              numOctaves={3}
              seed={11}
            />
            <feDisplacementMap in="SourceGraphic" scale={220} />
            <feGaussianBlur stdDeviation={18} />
          </filter>
          <mask id={`bm${id}`}>
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="#fff"
              filter={`url(#bf${id})`}
            />
          </mask>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={r + 70}
          fill="#FF8A1E"
          filter={`url(#bg${id})`}
          opacity={p < 0.98 ? 0.95 : 0}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r + 30}
          fill="#FFE2A0"
          filter={`url(#bg${id})`}
          opacity={p < 0.98 ? 0.9 : 0}
        />
        <image
          href={staticFile(src)}
          x={(1920 - w) / 2}
          y={(1080 - h) / 2}
          width={w}
          height={h}
          preserveAspectRatio="xMidYMid slice"
          mask={`url(#bm${id})`}
          style={{ filter }}
        />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- beat-drop shockwave ----------
export const Shockwave: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 24) return null;
  const p = t / 24;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(255,245,230,${0.7 * Math.exp(-t / 2.5)})`,
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <circle
          cx={960}
          cy={540}
          r={80 + p * 1300}
          fill="none"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth={60 * (1 - p) + 4}
          style={{ filter: "blur(10px)" }}
          opacity={1 - p}
        />
      </svg>
    </AbsoluteFill>
  );
};

// RGB split of a full-frame picture (used for a few frames on the drop)
export const RgbSplit: React.FC<{
  src: string;
  amount: number;
  filter?: string;
}> = ({ src, amount, filter }) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const chans = [
    { k: "r", m: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0", dx: -amount },
    { k: "g", m: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0", dx: 0 },
    { k: "b", m: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0", dx: amount },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", isolation: "isolate" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        {chans.map((c) => (
          <filter key={c.k} id={`${c.k}${id}`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={c.m} />
          </filter>
        ))}
      </svg>
      {chans.map((c) => (
        <Img
          key={c.k}
          src={staticFile(src)}
          style={{
            position: "absolute",
            width: 1920 * 1.06,
            height: 1080 * 1.06,
            left: -57 + c.dx,
            top: -32,
            filter: `${filter ?? ""} url(#${c.k}${id})`,
            mixBlendMode: "screen",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ---------- split panels that merge into one picture ----------
// Each panel starts zoomed on its own subject; at merge they relax into the one full photo.
export type MergePanel = {
  sx: number;
  sy: number;
  s0: number;
  start: number;
  label?: React.ReactNode;
};
export const MergeSplit: React.FC<{
  src: string;
  panels: MergePanel[];
  mergeAt: number;
  mergeDur: number;
  filter?: string;
}> = ({ src, panels, mergeAt, mergeDur, filter }) => {
  const frame = useCurrentFrame();
  const m = interpolate(frame, [mergeAt, mergeAt + mergeDur], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const W = 1920 / panels.length;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {panels.map((p, i) => {
        const inP = ease(frame, p.start, p.start + 12);
        if (inP <= 0) return null;
        const s = p.s0 + (1 - p.s0) * m;
        const cx = p.sx + (i * W + W / 2 - p.sx) * m;
        const cy = p.sy + (540 - p.sy) * m;
        // screen x of image point X inside the panel: (X - cx) * s + W/2
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i * W,
              top: 0,
              width: W,
              height: 1080,
              overflow: "hidden",
              clipPath: `inset(${(1 - inP) * 100}% 0 0 0)`,
            }}
          >
            <Img
              src={staticFile(src)}
              style={{
                position: "absolute",
                width: 1920 * s,
                height: 1080 * s,
                left: W / 2 - cx * s,
                top: 540 - cy * s,
                filter,
              }}
            />
            {p.label ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 70,
                  textAlign: "center",
                  opacity: 1 - m,
                }}
              >
                {p.label}
              </div>
            ) : null}
            {i > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 3,
                  height: 1080,
                  background: COLOR.gold,
                  opacity: 1 - m,
                }}
              />
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Shared pieces
export const StampWord: React.FC<{
  text: string;
  at: number;
  size?: number;
  color?: string;
  rot?: number;
}> = ({ text, at, size = 150, color = RED, rot = -4 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = interpolate(frame, [at, at + 5], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(2.2)),
  });
  return (
    <span
      style={{
        display: "inline-block",
        ...ANTON,
        fontSize: size,
        color,
        border: `8px solid ${color}`,
        padding: "0 22px",
        rotate: `${rot}deg`,
        scale: String(1.6 - 0.6 * p),
        opacity: Math.min(1, (frame - at) / 2),
        mixBlendMode: "normal",
      }}
    >
      {text}
    </span>
  );
};
