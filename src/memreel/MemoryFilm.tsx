import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import TL from "./timeline.json";

// Landscape memory film (friends → family) in the vintage film-strip style of the reference reel:
// projector light → white flash → fast-forward through the reel → each photo held in the gate.
// Timeline and projector sound come from scripts/memreel_build.py.

loadFont({
  family: "Cinzel",
  url: staticFile("fonts/Cinzel.woff2"),
  weight: "400 900",
});
loadFont({
  family: "Cormorant Garamond",
  url: staticFile("fonts/CormorantItalic.woff2"),
  style: "italic",
  weight: "300 700",
});

type Item = {
  kind: string;
  id?: string;
  w?: number;
  h?: number;
  text?: string;
  sub?: string;
};
type Data = {
  total: number;
  items: Item[];
  keys: [number, number, string][];
  advances: [number, number, number][];
  holds: [number, number, number][];
  stutters: number[];
  flares: [number, number, number][];
  leaks: [number, number, string][];
  ff: [number, number];
  endWhite: [number, number];
};
const D = TL as unknown as Data;
export const MEMORY_TOTAL = D.total;

const W = 1920;
const H = 1080;
const GW = 1133;
const GH = 850;
const GY = (H - GH) / 2;
const PITCH = 1193;
const HOLE = 58;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const ease: Record<string, (x: number) => number> = {
  hold: (x) => x,
  adv: (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2),
  ff: (x) => 1 - (1 - x) ** 4,
  drift: (x) => 1 - (1 - x) ** 2,
};

const posAt = (f: number) => {
  const k = D.keys;
  if (f <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) {
    if (f <= k[i][0]) {
      const [a, pa] = k[i - 1];
      const [b, pb, kind] = k[i];
      const x = b === a ? 1 : (f - a) / (b - a);
      return pa + (pb - pa) * (ease[kind] ?? ease.hold)(x);
    }
  }
  return k[k.length - 1][1];
};

const GRADE =
  "sepia(0.08) saturate(1.22) contrast(1.13) brightness(1.02) hue-rotate(-4deg)";

// ---------------------------------------------------------------- strip content
const Gate: React.FC<{
  it: Item;
  idx: number;
  f: number;
  current: boolean;
}> = ({ it, idx, f, current }) => {
  const hold = D.holds.find((h) => h[2] === idx);
  let p = 0;
  if (hold) p = interpolate(f, [hold[0], hold[1]], [0, 1], clamp);
  const inner: React.ReactNode =
    it.kind === "photo" ? (
      <>
        <Img
          src={staticFile(`memreel/${it.id}_bg.jpg`)}
          style={{
            position: "absolute",
            inset: 0,
            width: GW,
            height: GH,
            objectFit: "cover",
            filter: `${GRADE} brightness(0.45) saturate(0.8)`,
            scale: String(1.04 + 0.03 * p),
          }}
        />
        <Img
          src={staticFile(`memreel/${it.id}.jpg`)}
          style={{
            position: "absolute",
            inset: 0,
            width: GW,
            height: GH,
            objectFit: "contain",
            filter: GRADE,
            scale: String(0.955 + 0.045 * p),
            boxShadow: "0 0 40px rgba(0,0,0,0.5)",
          }}
        />
      </>
    ) : it.kind === "title" ? (
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, #3a2318 0%, #1c110b 60%, #0f0906 100%)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Cinzel",
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: "0.55em",
            color: "#d8a35d",
            marginBottom: 10,
          }}
        >
          {it.sub}
        </div>
        <div
          style={{
            fontFamily: "Cormorant Garamond",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 170,
            lineHeight: 1,
            color: "#f3e6d0",
            textShadow: "0 0 30px rgba(255,190,120,0.35)",
          }}
        >
          {it.text}
        </div>
        <div
          style={{
            width: 220,
            height: 2,
            background: "#d8a35d",
            marginTop: 26,
            opacity: 0.8,
          }}
        />
      </AbsoluteFill>
    ) : (
      <AbsoluteFill style={{ background: "#f4ecdc" }}>
        <div
          style={{
            position: "absolute",
            left: GW / 2 - 18,
            top: GH / 2 - 18,
            width: 36,
            height: 36,
            borderRadius: 18,
            border: "3px solid rgba(60,40,30,0.35)",
          }}
        />
      </AbsoluteFill>
    );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: GW,
        height: GH,
        borderRadius: 16,
        overflow: "hidden",
        background: "#120b08",
        filter: current ? undefined : "brightness(0.8)",
      }}
    >
      {inner}
      {/* soft film-gate vignette + warm/teal split tone */}
      <AbsoluteFill
        style={{
          background: "rgba(214,112,52,0.16)",
          mixBlendMode: "soft-light",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 15%, rgba(120,170,200,0.10), rgba(0,0,0,0) 60%)",
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 90px rgba(10,4,2,0.75)",
          borderRadius: 16,
        }}
      />
    </div>
  );
};

const Strip: React.FC<{ f: number; pos: number; vel: number }> = ({
  f,
  pos,
  vel,
}) => {
  const shift = pos * PITCH;
  const near = Math.round(pos);
  const blur = Math.min(46, Math.abs(vel) * 0.32);
  const holeOff = -(((shift % HOLE) + HOLE) % HOLE);
  const holes = Array.from(
    { length: Math.ceil(W / HOLE) + 2 },
    (_, i) => holeOff + i * HOLE,
  );
  const label = (k: number) =>
    `◂ ${String(k + 1).padStart(2, "0")}   SAFETY FILM  5063   ${String(k + 2).padStart(2, "0")} ▸`;
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="mb" x="-10%" y="0" width="120%" height="100%">
          <feGaussianBlur stdDeviation={`${blur} 0`} />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: blur > 0.4 ? "url(#mb)" : undefined }}>
        {/* film base */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 24,
            width: W,
            height: H - 48,
            background:
              "linear-gradient(180deg,#140c08 0%,#0d0805 50%,#140c08 100%)",
          }}
        />
        {/* sprocket holes (lit from behind) */}
        {[46, 1002].map((y) =>
          holes.map((x, i) => (
            <div
              key={`${y}-${i}`}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 28,
                height: 32,
                borderRadius: 6,
                background:
                  "radial-gradient(ellipse at 50% 45%, #ffd2a1 0%, #f09a52 55%, #b4582a 100%)",
                boxShadow: "0 0 10px rgba(240,140,70,0.55)",
                opacity: 0.9,
              }}
            />
          )),
        )}
        {/* edge code */}
        {[-1, 0, 1, 2].map((d) => {
          const k = near + d;
          const x = W / 2 + k * PITCH - shift - GW / 2;
          return (
            <React.Fragment key={d}>
              <div
                style={{
                  position: "absolute",
                  left: x + 30,
                  top: 88,
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 15,
                  letterSpacing: "0.2em",
                  color: "rgba(236,150,80,0.7)",
                }}
              >
                {label(k)}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: x + 30,
                  top: 975,
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 15,
                  letterSpacing: "0.2em",
                  color: "rgba(236,150,80,0.55)",
                }}
              >
                {label(k)}
              </div>
            </React.Fragment>
          );
        })}
        {/* gates */}
        {[-2, -1, 0, 1, 2].map((d) => {
          const k = near + d;
          const it = D.items[k];
          if (!it) return null;
          const x = W / 2 + k * PITCH - shift - GW / 2;
          if (x > W || x + GW < 0) return null;
          return (
            <div key={k} style={{ position: "absolute", left: x, top: GY }}>
              <Gate
                it={it}
                idx={k}
                f={f}
                current={d === 0 && Math.abs(pos - k) < 0.5}
              />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- projector intro (0–84)
const SHAFTS: [number, number, number][] = [
  [8, 15, 0.08],
  [19, 30, 0.12],
  [36, 41, 0.06],
  [47, 60, 0.1],
  [66, 72, 0.07],
  [78, 92, 0.11],
  [99, 104, 0.05],
  [110, 124, 0.09],
  [131, 140, 0.07],
];
const Projector: React.FC<{ f: number }> = ({ f }) => {
  const on = f >= 5;
  const warm = interpolate(f, [5, 16], [0.25, 1], clamp);
  const shutter = 1 + 0.07 * Math.sin(f * Math.PI); // 24-ish fps flicker
  const lamp = on ? warm * shutter * (0.92 + 0.08 * random(`l${f}`)) : 0.04;
  const L = { x: 1290, y: 540 };
  const rays = (f * 0.6) % 360;
  return (
    <AbsoluteFill style={{ background: "#070504" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 900px 700px at ${L.x}px ${L.y}px, rgba(90,60,40,${0.25 * lamp}) 0%, rgba(0,0,0,0) 70%)`,
        }}
      />
      {/* projector body */}
      <div
        style={{
          position: "absolute",
          left: 1180,
          top: 330,
          width: 560,
          height: 430,
          borderRadius: 60,
          background: "linear-gradient(160deg,#1c1510,#0c0907)",
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.8)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 1460,
          top: 250,
          width: 210,
          height: 210,
          borderRadius: 105,
          border: "10px solid #120d0a",
          background: "#0c0907",
        }}
      />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 1600 + i * 26,
            top: 700,
            width: 8,
            height: 8,
            borderRadius: 4,
            background: "#ff9a3c",
            opacity: on ? 0.5 + 0.5 * random(`d${i}${Math.floor(f / 6)}`) : 0.1,
            boxShadow: "0 0 10px #ff8a2a",
          }}
        />
      ))}
      {/* the beam toward the camera: soft cone (blurred after clipping, so its edges stay soft) */}
      <div style={{ position: "absolute", inset: 0, filter: "blur(38px)" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 1500px 900px at ${L.x}px ${L.y}px, rgba(255,240,214,${0.6 * lamp}) 0%, rgba(255,226,190,${0.24 * lamp}) 38%, rgba(0,0,0,0) 72%)`,
            clipPath: `polygon(${L.x + 40}px ${L.y - 80}px, ${L.x + 40}px ${L.y + 80}px, -200px 1300px, -200px -220px)`,
          }}
        />
      </div>
      {/* uneven light shafts */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: "blur(22px)",
          mixBlendMode: "screen",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `conic-gradient(from ${200 + rays * 0.15}deg at ${L.x}px ${L.y}px, ${SHAFTS.map(([a, b, o]) => `rgba(0,0,0,0) ${a}deg, rgba(255,236,206,${o * lamp}) ${(a + b) / 2}deg, rgba(0,0,0,0) ${b}deg`).join(", ")})`,
            clipPath: `polygon(${L.x}px ${L.y}px, -200px 1300px, -200px -220px)`,
          }}
        />
      </div>
      {/* drifting smoke in the beam */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: "blur(16px)",
          mixBlendMode: "screen",
          opacity: 0.55 * lamp,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `polygon(${L.x}px ${L.y}px, -200px 1300px, -200px -220px)`,
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile("memreel/grain3.jpg")}
            style={{
              position: "absolute",
              left: -300 + f * 2.2,
              top: -100,
              width: 2600,
              height: 1400,
              opacity: 0.5,
              filter: "contrast(1.8) brightness(0.9)",
            }}
          />
        </div>
      </div>
      {/* dust floating in the beam */}
      {Array.from({ length: 90 }).map((_, i) => {
        const x = (random(`x${i}`) * 1400 + f * (0.6 + random(`v${i}`))) % 1400;
        const y = 140 + random(`y${i}`) * 800 + Math.sin(f / 20 + i) * 8;
        const inBeam = Math.abs(y - L.y) < (L.x - x) * 0.42;
        const s = 2 + random(`s${i}`) * 4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: s,
              background: "#fff4e2",
              opacity: inBeam ? 0.35 * lamp : 0.04,
              filter: "blur(0.6px)",
            }}
          />
        );
      })}
      {/* lens */}
      <div
        style={{
          position: "absolute",
          left: L.x - 95,
          top: L.y - 95,
          width: 190,
          height: 190,
          borderRadius: 95,
          background: `radial-gradient(circle, rgba(255,255,250,${lamp}) 0%, rgba(255,236,200,${0.9 * lamp}) 28%, rgba(240,170,110,${0.35 * lamp}) 55%, rgba(30,20,14,1) 72%)`,
          boxShadow: `0 0 ${120 * lamp}px rgba(255,220,170,${0.8 * lamp})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: L.x - 120,
          top: L.y - 120,
          width: 240,
          height: 240,
          borderRadius: 120,
          border: "3px solid rgba(255,230,200,0.12)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: L.x - 260,
          top: L.y - 4,
          width: 520,
          height: 8,
          borderRadius: 4,
          background: `rgba(255,220,180,${0.35 * lamp})`,
          filter: "blur(4px)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- overlays
const LEAK: Record<string, string> = {
  red: "255,40,30",
  pink: "255,95,150",
  magenta: "230,60,170",
  amber: "255,150,60",
};

const Overlays: React.FC<{ f: number }> = ({ f }) => {
  const out: React.ReactNode[] = [];
  D.leaks.forEach(([a, b, c], i) => {
    if (f < a - 2 || f > b + 8) return;
    const p = interpolate(f, [a, (a + b) / 2, b + 8], [0, 1, 0], clamp);
    const fromRight = i % 2 === 0;
    out.push(
      <AbsoluteFill
        key={`l${i}`}
        style={{
          mixBlendMode: "screen",
          opacity: 0.75 * p,
          background: `radial-gradient(ellipse 900px 1200px at ${fromRight ? 1900 : 20}px 540px, rgba(${LEAK[c]},0.95) 0%, rgba(${LEAK[c]},0.35) 45%, rgba(${LEAK[c]},0) 75%)`,
        }}
      />,
    );
  });
  // thin red edge-burn line once in a while during holds
  D.holds.forEach(([a], i) => {
    const t = a + 60;
    if (i % 2 === 1 && f >= t && f < t + 4) {
      out.push(
        <div
          key={`r${i}`}
          style={{
            position: "absolute",
            left: 1878,
            top: 0,
            width: 7,
            height: H,
            background: "#ff2a1a",
            boxShadow: "0 0 24px 8px rgba(255,40,20,0.6)",
            opacity: 0.85,
          }}
        />,
      );
    }
  });
  // white blooms (projector flash / into family)
  D.flares.forEach(([a, b, s], i) => {
    if (f < a || f > b) return;
    const mid = a + (b - a) * 0.55;
    const white = interpolate(f, [a, mid, b], [0, 1, 0], clamp) * s;
    const pink = interpolate(f, [mid - 4, mid + 6, b], [0, 0.8, 0], clamp) * s;
    out.push(
      <React.Fragment key={`f${i}`}>
        <AbsoluteFill style={{ background: `rgba(255,248,236,${white})` }} />
        <AbsoluteFill
          style={{
            mixBlendMode: "screen",
            opacity: pink,
            background:
              "radial-gradient(circle 520px at 62% 48%, rgba(255,200,230,0.9), rgba(240,90,170,0.45) 50%, rgba(0,0,0,0) 75%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 520,
            width: W,
            height: 40,
            opacity: pink,
            background:
              "linear-gradient(90deg, rgba(255,120,190,0), rgba(255,170,220,0.85), rgba(255,120,190,0))",
            filter: "blur(8px)",
          }}
        />
      </React.Fragment>,
    );
  });
  // projector "skip": black frames
  D.stutters.forEach((s, i) => {
    const r = f - s;
    if ([2, 3, 6, 7, 8, 11].includes(r))
      out.push(<AbsoluteFill key={`s${i}`} style={{ background: "#000" }} />);
  });
  // run-out: light floods, then black
  const [ea, eb] = D.endWhite;
  if (f >= ea) {
    const wht =
      interpolate(f, [ea, eb], [0, 1], clamp) * (0.9 + 0.1 * random(`e${f}`));
    const blk = interpolate(f, [D.total - 30, D.total - 6], [0, 1], clamp);
    out.push(
      <AbsoluteFill
        key="ew"
        style={{ background: `rgba(255,247,232,${wht})` }}
      />,
    );
    out.push(
      <AbsoluteFill key="eb" style={{ background: `rgba(0,0,0,${blk})` }} />,
    );
  }
  return <>{out}</>;
};

const FilmTexture: React.FC<{ f: number }> = ({ f }) => {
  const specks = Array.from({ length: 7 }).map((_, i) => {
    if (random(`p${f}-${i}`) > 0.55) return null;
    const s = 2 + random(`ps${f}-${i}`) * 5;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: random(`px${f}-${i}`) * W,
          top: random(`py${f}-${i}`) * H,
          width: s,
          height: s * (0.6 + random(`pr${f}-${i}`)),
          borderRadius: s,
          background:
            random(`pc${f}-${i}`) > 0.3
              ? "rgba(255,250,240,0.8)"
              : "rgba(0,0,0,0.7)",
        }}
      />
    );
  });
  const hair = random(`h${Math.floor(f / 9)}`) > 0.86;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Img
        src={staticFile(`memreel/grain${f % 8}.jpg`)}
        style={{
          position: "absolute",
          inset: 0,
          width: W,
          height: H,
          opacity: 0.16,
          mixBlendMode: "overlay",
        }}
      />
      {specks}
      {hair ? (
        <div
          style={{
            position: "absolute",
            left: random(`hx${Math.floor(f / 9)}`) * W,
            top: 0,
            width: 1.5,
            height: H,
            background: "rgba(255,250,240,0.25)",
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      <AbsoluteFill
        style={{ background: `rgba(255,236,210,${0.025 * random(`fl${f}`)})` }}
      />
    </AbsoluteFill>
  );
};

export const MemoryFilm: React.FC = () => {
  const f = useCurrentFrame();
  const pos = posAt(f);
  const vel = (posAt(f + 0.5) - posAt(f - 0.5)) * PITCH;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {f >= D.ff[0] ? <Strip f={f} pos={pos} vel={vel} /> : null}
      {f < 70 ? (
        <AbsoluteFill
          style={{ opacity: interpolate(f, [60, 70], [1, 0], clamp) }}
        >
          <Projector f={f} />
        </AbsoluteFill>
      ) : null}
      <Overlays f={f} />
      <FilmTexture f={f} />
      <Audio src={staticFile("memreel/projector.wav")} />
    </AbsoluteFill>
  );
};
