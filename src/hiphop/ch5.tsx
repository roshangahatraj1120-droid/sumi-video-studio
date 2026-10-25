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
import { COLOR } from "../brand/tokens";
import { Finish, Sfx } from "../laban/broll";
import { Plate, Rig } from "../laban3/rig";
import {
  ANTON,
  clamp,
  ease,
  img,
  MONO,
  Pair,
  ReconTag,
  RED,
  SHADE,
  Slam,
  WARM,
} from "./kit";
import { TypeOn } from "./kit2";

// Hip-hop episode — Chapter 5 "Breaking: the foundation before the spectacle" (script part 6).
// A "movement lab" look: thin measuring frame, beat counters, level meter, weight points. 30 fps.
// Each demo also gets a transparent overlay (bg "alpha"/"green") to lay over the host's own footage.
export const LEN5 = {
  l01: 240,
  l02: 270,
  l03: 360,
  l04: 360,
  l05: 390,
  l06: 300,
  l07: 360,
  l08: 360,
  l09: 420,
  ov1: 300,
  ov2: 240,
  ov3: 300,
  ov4: 210,
};
type Bg = "green" | "alpha" | "preview";
const BEAT = 15; // 120 BPM
const LAB_GRADE = "contrast(1.08) saturate(0.92)";

// ---------- lab pieces ----------
const LabFrame: React.FC<{ n: string; tag: string; opacity?: number }> = ({
  n,
  tag,
  opacity = 1,
}) => {
  const c = "rgba(255,255,255,0.75)";
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <rect
          x={44}
          y={44}
          width={1832}
          height={992}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={1.5}
        />
        {/* height ruler on the left edge */}
        {Array.from({ length: 41 }).map((_, i) => (
          <line
            key={i}
            x1={44}
            y1={44 + i * 24.8}
            x2={i % 5 === 0 ? 70 : 56}
            y2={44 + i * 24.8}
            stroke={c}
            strokeWidth={1.2}
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 62,
          ...MONO,
          fontSize: 22,
          color: "#fff",
          letterSpacing: "0.18em",
          textShadow: "0 0 8px rgba(0,0,0,0.8)",
        }}
      >
        MOVEMENT LAB · {n}
      </div>
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 62,
          ...MONO,
          fontSize: 22,
          color: COLOR.gold,
          letterSpacing: "0.18em",
          textShadow: "0 0 8px rgba(0,0,0,0.8)",
        }}
      >
        {tag}
      </div>
    </AbsoluteFill>
  );
};

// 8-count beat counter (frame-driven)
const Counter: React.FC<{
  start: number;
  x?: number;
  y?: number;
  green?: boolean;
}> = ({ start, x = 90, y = 960, green }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const k = Math.floor((frame - start) / BEAT);
  const cur = k % 8;
  const pulse = Math.exp(-((frame - start) % BEAT) / 4);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          ...ANTON,
          fontSize: 64,
          color: "#fff",
          width: 60,
          textAlign: "center",
          scale: String(1 + 0.15 * pulse),
          textShadow: green ? undefined : "0 0 10px rgba(0,0,0,0.8)",
        }}
      >
        {cur + 1}
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 34,
            height: 34,
            border: "2px solid rgba(255,255,255,0.8)",
            background:
              i === cur
                ? RED
                : i < cur
                  ? "rgba(255,255,255,0.55)"
                  : green
                    ? "#1A1A1A"
                    : "rgba(0,0,0,0.25)",
          }}
        />
      ))}
    </div>
  );
};

// level meter on the right edge: UPRIGHT / MID / FLOOR
const LEVELS = ["Upright", "Mid", "Floor"];
const LevelMeter: React.FC<{ level: number; x?: number; green?: boolean }> = ({
  level,
  x = 1700,
  green,
}) => {
  const y0 = 220;
  const h = 600;
  const my = y0 + (level / 2) * h;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 0,
        width: 160,
        height: 1080,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 20,
          top: y0,
          width: 4,
          height: h,
          background: "rgba(255,255,255,0.6)",
        }}
      />
      {LEVELS.map((l, i) => (
        <div
          key={l}
          style={{
            position: "absolute",
            left: 36,
            top: y0 + (i / 2) * h - 14,
            ...MONO,
            fontSize: 22,
            color:
              Math.round(level) === i ? COLOR.gold : "rgba(255,255,255,0.7)",
            textShadow: green ? undefined : "0 0 8px rgba(0,0,0,0.9)",
          }}
        >
          — {l.toUpperCase()}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 6,
          top: my - 16,
          width: 32,
          height: 32,
          borderRadius: 16,
          background: RED,
          boxShadow: `0 0 14px ${RED}`,
        }}
      />
    </div>
  );
};

// joint / weight marker with a pulse ring
const Point: React.FC<{
  x: number;
  y: number;
  at: number;
  label?: string;
  color?: string;
  dir?: 1 | -1;
}> = ({ x, y, at, label, color = RED, dir = 1 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = frame - at;
  const ring = (t % 30) / 30;
  const inP = ease(frame, at, at + 6);
  return (
    <>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        <circle cx={x} cy={y} r={10 * inP} fill={color} />
        <circle
          cx={x}
          cy={y}
          r={14 + ring * 34}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          opacity={1 - ring}
        />
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: dir === 1 ? x + 26 : undefined,
            right: dir === -1 ? 1920 - x + 26 : undefined,
            top: y - 46,
            ...MONO,
            fontSize: 22,
            color: "#111",
            background: "rgba(255,255,255,0.92)",
            padding: "4px 10px",
            opacity: ease(frame, at + 4, at + 12),
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      ) : null}
    </>
  );
};

const Caption: React.FC<{
  text: string;
  at: number;
  y?: number;
  size?: number;
  cursor?: boolean;
}> = ({ text, at, y = 900, size = 42, cursor = true }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      width: 1920,
      top: y,
      textAlign: "center",
      fontSize: size,
      color: "#fff",
      textShadow: "0 2px 12px rgba(0,0,0,0.95)",
    }}
  >
    <TypeOn text={text} at={at} cps={1.6} cursor={cursor} />
  </div>
);

// still photo that "steps": alternates between poses on the beat (stop-motion)
const Steps: React.FC<{
  srcs: string[];
  start: number;
  every?: number;
  scale?: number;
  ox?: number;
  oy?: number;
}> = ({ srcs, start, every = BEAT, scale = 1.08, ox = 960, oy = 540 }) => {
  const frame = useCurrentFrame();
  const k = Math.max(0, Math.floor((frame - start) / every));
  const src = srcs[k % srcs.length];
  const kick = frame >= start ? Math.exp(-((frame - start) % every) / 3) : 0;
  return (
    <Img
      src={staticFile(img(src))}
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
        transformOrigin: `${ox}px ${oy}px`,
        scale: String(scale + 0.012 * kick),
        filter: LAB_GRADE,
      }}
    />
  );
};

// ============ L01 — "When people who do not dance hear 'breakdancing,' they often picture one thing:
// headspins, windmills, flares, freezes – the spectacular moves." Fast spinning spectacle montage.
const SPEC = [
  { w: "Headspins", src: "m9b", rot: 8 },
  { w: "Windmills", src: "m4", rot: -10 },
  { w: "Flares", src: "m3", rot: 12 },
  { w: "Freezes", src: "m9b", rot: -6 },
];
const SPEC_AT = 70;
export const L01Spectacle: React.FC = () => {
  const frame = useCurrentFrame();
  const k = Math.min(
    SPEC.length - 1,
    Math.max(0, Math.floor((frame - SPEC_AT) / 26)),
  );
  const local = frame - SPEC_AT - k * 26;
  const s = SPEC[k];
  const spin = frame >= SPEC_AT ? s.rot * (1 - Math.min(1, local / 20)) : 0;
  return (
    <Finish dust={0.3}>
      {frame < SPEC_AT ? (
        <>
          <Rig
            keys={[
              { f: 0, s: 1.1, x: 960, y: 540 },
              { f: SPEC_AT, s: 1.18, x: 960, y: 560, e: "drift" },
            ]}
          >
            <Plate
              src={img("m2")}
              filter={`${LAB_GRADE} blur(2px) brightness(0.7)`}
            />
          </Rig>
          <Caption
            text='when people who do not dance hear "breakdancing,"'
            at={4}
            y={480}
            size={44}
          />
        </>
      ) : (
        <AbsoluteFill
          style={{
            rotate: `${spin}deg`,
            scale: String(1.15 + (1 - Math.min(1, local / 20)) * 0.2),
          }}
        >
          <Img
            src={staticFile(img(s.src))}
            style={{
              position: "absolute",
              width: 1920,
              height: 1080,
              objectFit: "cover",
              filter: `${WARM} blur(${Math.max(0, 6 - local)}px)`,
            }}
          />
        </AbsoluteFill>
      )}
      {frame >= SPEC_AT && local < 2 ? (
        <AbsoluteFill style={{ backgroundColor: "rgba(255,255,255,0.45)" }} />
      ) : null}
      <AbsoluteFill style={{ background: SHADE }} />
      {frame >= SPEC_AT ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 760,
            textAlign: "center",
          }}
        >
          <Sequence from={SPEC_AT + k * 26} key={k} layout="none">
            <Slam at={0}>
              <span
                style={{
                  ...ANTON,
                  fontSize: 200,
                  color: "#fff",
                  textShadow: "0 8px 30px rgba(0,0,0,0.85)",
                }}
              >
                {s.w}
              </span>
            </Slam>
          </Sequence>
        </div>
      ) : null}
      <Sequence from={SPEC_AT + 4 * 26} layout="none">
        <Caption text="— the spectacular moves." at={0} y={140} size={46} />
      </Sequence>
      <ReconTag />
      {SPEC.map((_, i) => (
        <React.Fragment key={i}>
          <Sfx name="whoosh" at={SPEC_AT + i * 26 - 4} volume={0.3} />
          <Sfx name="hit" at={SPEC_AT + i * 26} volume={0.3} />
        </React.Fragment>
      ))}
    </Finish>
  );
};

// ============ L02 — "Those moves became important. But if we start there, we miss the foundation."
// A stack of blocks: the visible top is POWER MOVES; the camera tilts down and the hidden foundation
// lights up block by block: TOPROCK · GO-DOWN · FOOTWORK · FREEZE.
const STACK = ["Power moves", "Freeze", "Footwork", "Go-down", "Toprock"];
export const L02Foundation: React.FC = () => {
  const frame = useCurrentFrame();
  const tilt = interpolate(frame, [70, 130], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const camY = -260 + tilt * 520;
  return (
    <Finish dust={0.25}>
      <Img
        src={staticFile(img("m2"))}
        style={{
          position: "absolute",
          width: 1920,
          height: 1080,
          filter: `${LAB_GRADE} blur(8px) brightness(0.45)`,
        }}
      />
      <AbsoluteFill style={{ translate: `0px ${-camY}px` }}>
        {STACK.map((b, i) => {
          const top = i === 0;
          const lit = top
            ? 1
            : ease(
                frame,
                130 + (STACK.length - 1 - i) * 14,
                140 + (STACK.length - 1 - i) * 14,
              );
          const w = 520 + i * 150;
          const y = 120 + i * 170;
          return (
            <div
              key={b}
              style={{
                position: "absolute",
                left: 960 - w / 2,
                top: y,
                width: w,
                height: 150,
                border: `3px solid ${top ? "#fff" : `rgba(232,194,122,${0.3 + 0.7 * lit})`}`,
                background: top
                  ? "rgba(255,255,255,0.12)"
                  : `rgba(232,194,122,${0.08 + 0.22 * lit})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  !top && lit > 0.5
                    ? `0 0 30px rgba(232,194,122,${0.4 * lit})`
                    : undefined,
              }}
            >
              <span
                style={{
                  ...ANTON,
                  fontSize: 86,
                  color: top
                    ? "#fff"
                    : `rgba(255,255,255,${0.25 + 0.75 * lit})`,
                }}
              >
                {b}
              </span>
              {!top ? (
                <span
                  style={{
                    position: "absolute",
                    left: 18,
                    top: 10,
                    ...MONO,
                    fontSize: 18,
                    color: COLOR.gold,
                    opacity: lit,
                  }}
                >
                  0{STACK.length - i}
                </span>
              ) : null}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 960 - 640,
            top: 120 + 1 * 170 - 30,
            width: 1280,
            height: 4,
            background: RED,
            opacity: ease(frame, 120, 130),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 960 + 660,
            top: 120 + 1 * 170 - 46,
            ...MONO,
            fontSize: 22,
            color: RED,
            opacity: ease(frame, 120, 130),
          }}
        >
          FOUNDATION ↓
        </div>
      </AbsoluteFill>
      <Sequence durationInFrames={70} layout="none">
        <Caption
          text="those moves became important."
          at={4}
          y={900}
          size={46}
        />
      </Sequence>
      <Sequence from={196} layout="none">
        <AbsoluteFill style={{ background: SHADE }} />
        <Pair
          thin="but if we start there, we miss"
          heavy="the foundation."
          at={0}
          y={830}
          size={130}
          color={COLOR.gold}
        />
      </Sequence>
      <LabFrame n="00" tag="WHERE BREAKING STARTS" opacity={0.8} />
      <Sfx name="whoosh" at={70} volume={0.3} />
      {[1, 2, 3, 4].map((i) => (
        <Sfx key={i} name="tick" at={130 + (i - 1) * 14} volume={0.3} />
      ))}
    </Finish>
  );
};

// ============ L03 — "Breaking begins with how you stand in the music. Toprock lets a dancer establish
// rhythm, character and presence while upright." Stop-motion toprock on the beat, an 8-count counter,
// and three lab labels.
export const L03Toprock: React.FC = () => {
  const frame = useCurrentFrame();
  const showLabels = frame >= 190;
  return (
    <Finish dust={0.2}>
      <Rig
        keys={[
          { f: 0, s: 1.02, x: 960, y: 540 },
          { f: 360, s: 1.12, x: 1040, y: 520, e: "smooth" },
        ]}
      >
        <Steps srcs={["m1", "m7"]} start={20} />
      </Rig>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,6,0.75) 0%, rgba(5,5,6,0.25) 40%, rgba(5,5,6,0) 60%)",
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* body axis */}
        <line
          x1={1080}
          y1={140}
          x2={1060}
          y2={900}
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={2}
          strokeDasharray="8 10"
          opacity={ease(frame, 30, 40)}
        />
      </svg>
      <div style={{ position: "absolute", left: 110, top: 190, width: 720 }}>
        <div style={{ fontSize: 40, color: "#fff", minHeight: 110 }}>
          <TypeOn
            text="breaking begins with how you stand in the music."
            at={6}
            cps={1.5}
            cursor={false}
          />
        </div>
        <Sequence from={150} layout="none">
          <Slam at={0}>
            <div
              style={{ ...ANTON, fontSize: 200, color: "#fff", lineHeight: 1 }}
            >
              Toprock
            </div>
          </Slam>
          <div
            style={{ ...MONO, fontSize: 24, color: COLOR.gold, marginTop: 8 }}
          >
            UPRIGHT · ESTABLISHING
          </div>
        </Sequence>
        {showLabels
          ? ["Rhythm", "Character", "Presence"].map((w, i) => (
              <div
                key={w}
                style={{
                  marginTop: i === 0 ? 40 : 12,
                  ...ANTON,
                  fontSize: 84,
                  color: i === 2 ? RED : "#fff",
                  opacity: ease(frame, 200 + i * 28, 210 + i * 28),
                  translate: `${(1 - ease(frame, 200 + i * 28, 210 + i * 28)) * -40}px 0px`,
                }}
              >
                {String(i + 1).padStart(2, "0")} {w}
              </div>
            ))
          : null}
      </div>
      <Counter start={20} />
      <LabFrame n="01" tag="TOPROCK" />
      <ReconTag />
      <Sfx name="hit" at={152} volume={0.35} />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} name="tick" at={200 + i * 28} volume={0.3} />
      ))}
    </Finish>
  );
};

// ============ L04 — "Then the dancer changes level. The transition into the floor is not dead space.
// It is part of the sentence." Stop-motion go-down with a level meter; then the move as a sentence.
const DOWN = [
  { src: "m7", at: 0, lvl: 0 },
  { src: "m5", at: 40, lvl: 0.7 },
  { src: "m8", at: 76, lvl: 1.4 },
  { src: "m6", at: 112, lvl: 2 },
];
const SENT_AT = 200;
export const L04GoDown: React.FC = () => {
  const frame = useCurrentFrame();
  const k = DOWN.filter((d) => frame >= d.at).length - 1;
  const d = DOWN[k];
  const nxt = DOWN[k + 1];
  const lvl = nxt
    ? d.lvl + (nxt.lvl - d.lvl) * ease(frame, nxt.at - 10, nxt.at)
    : d.lvl;
  const strike = interpolate(frame, [150, 162], [0, 1], clamp);
  const sent = ease(frame, SENT_AT, SENT_AT + 14);
  const words = ["Toprock", "Go-down", "Footwork", "Freeze"];
  return (
    <Finish dust={0.2}>
      <AbsoluteFill
        style={{
          filter:
            sent > 0
              ? `brightness(${1 - 0.55 * sent}) blur(${sent * 4}px)`
              : undefined,
        }}
      >
        <Img
          src={staticFile(img(d.src))}
          style={{
            position: "absolute",
            width: 1920,
            height: 1080,
            transformOrigin: "1000px 600px",
            scale: String(1.08 + (frame - d.at) * 0.0015),
            filter: LAB_GRADE,
          }}
        />
      </AbsoluteFill>
      {frame - d.at < 3 && k > 0 ? (
        <AbsoluteFill style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
      ) : null}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,6,0.75) 0%, rgba(5,5,6,0.2) 40%, rgba(5,5,6,0) 60%)",
          opacity: 1 - sent,
        }}
      />
      <LevelMeter level={lvl} />
      <div
        style={{ position: "absolute", left: 110, top: 200, opacity: 1 - sent }}
      >
        <div style={{ fontSize: 40, color: "#fff" }}>
          <TypeOn
            text="then the dancer changes"
            at={4}
            cps={1.6}
            cursor={false}
          />
        </div>
        <Slam at={30}>
          <div
            style={{ ...ANTON, fontSize: 200, color: "#fff", lineHeight: 1 }}
          >
            Level.
          </div>
        </Slam>
        <div
          style={{ marginTop: 50, ...MONO, fontSize: 26, color: COLOR.gold }}
        >
          {frame >= 128 ? "THE TRANSITION INTO THE FLOOR IS" : ""}
        </div>
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginTop: 6,
            ...ANTON,
            fontSize: 110,
            color: "rgba(255,255,255,0.85)",
            opacity: ease(frame, 134, 144),
          }}
        >
          not dead space
          <span
            style={{
              position: "absolute",
              left: -10,
              top: "50%",
              height: 10,
              width: `calc(${strike} * (100% + 20px))`,
              background: RED,
            }}
          />
        </div>
      </div>
      {frame >= SENT_AT ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 420,
            textAlign: "center",
            opacity: sent,
          }}
        >
          <div
            style={{
              ...MONO,
              fontSize: 26,
              color: COLOR.gold,
              letterSpacing: "0.2em",
              marginBottom: 20,
            }}
          >
            IT IS PART OF THE SENTENCE
          </div>
          <div
            style={{ display: "inline-flex", alignItems: "baseline", gap: 0 }}
          >
            {words.map((w, i) => (
              <span
                key={w}
                style={{
                  ...ANTON,
                  fontSize: 120,
                  color: i === 1 ? RED : "#fff",
                  opacity: ease(frame, SENT_AT + i * 10, SENT_AT + 8 + i * 10),
                  textDecoration: i === 1 ? "underline" : undefined,
                  textUnderlineOffset: 14,
                }}
              >
                {w}
                {i < words.length - 1 ? (
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>
                    {" — "}
                  </span>
                ) : (
                  <span style={{ color: RED }}>.</span>
                )}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <LabFrame n="02" tag="GO-DOWN" />
      <ReconTag />
      {DOWN.slice(1).map((x) => (
        <Sfx key={x.at} name="hit" at={x.at} volume={0.25} />
      ))}
      <Sfx name="whoosh" at={150} volume={0.3} />
      <Sfx name="hit" at={SENT_AT + 10} volume={0.3} />
    </Finish>
  );
};

// ============ L05 — "On the floor, footwork creates pathways around the body. Hands and feet share
// weight. Direction changes. Rhythm continues." Pathways drawn round the dancer in perspective, weight
// points on hands and feet, direction arrows flipping, the counter running underneath.
const W_POINTS = [
  { x: 788, y: 388, l: "HAND", d: -1 as const },
  { x: 1388, y: 808, l: "HAND", d: 1 as const },
  { x: 688, y: 748, l: "FOOT", d: -1 as const },
  { x: 1088, y: 798, l: "FOOT", d: 1 as const },
];
const L5_BEATS = [0, 96, 190, 280];
export const L05Footwork: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = L5_BEATS.filter((b) => frame >= b).length - 1;
  const ring = interpolate(frame, [20, 80], [0, 1], clamp);
  const dirFlip =
    frame >= L5_BEATS[2] ? Math.floor((frame - L5_BEATS[2]) / BEAT) % 2 : 0;
  const lines = [
    "Footwork creates pathways",
    "Hands and feet share weight",
    "Direction changes",
    "Rhythm continues",
  ];
  return (
    <Finish dust={0.2}>
      <Rig
        keys={[
          { f: 0, s: 1.15, x: 1040, y: 600 },
          { f: 390, s: 1.25, x: 1020, y: 600, e: "smooth" },
        ]}
      >
        <Img
          src={staticFile(img(frame >= L5_BEATS[2] && dirFlip ? "m8" : "m6"))}
          style={{
            position: "absolute",
            width: 1920,
            height: 1080,
            filter: LAB_GRADE,
          }}
        />
        {/* pathways on the floor in perspective */}
        <div
          style={{
            position: "absolute",
            left: 1040,
            top: 800,
            width: 0,
            height: 0,
            perspective: 900,
          }}
        >
          <svg
            width={1200}
            height={700}
            viewBox="-600 -350 1200 700"
            style={{
              position: "absolute",
              left: -600,
              top: -350,
              transform: "rotateX(70deg) scale(1.5)",
              overflow: "visible",
            }}
          >
            <g
              fill="none"
              stroke={COLOR.gold}
              strokeWidth={9}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${COLOR.gold})` }}
            >
              <circle
                cx={0}
                cy={0}
                r={300}
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - ring}
              />
              <circle
                cx={0}
                cy={0}
                r={200}
                pathLength={1}
                strokeDasharray="0.04 0.03"
                strokeDashoffset={-frame * 0.01}
                opacity={ring}
              />
            </g>
          </svg>
        </div>
        {beat >= 1
          ? W_POINTS.map((p, i) => (
              <Point
                key={i}
                x={p.x}
                y={p.y}
                at={L5_BEATS[1] + i * 8}
                label={p.l}
                dir={p.d}
                color={i < 2 ? RED : COLOR.gold}
              />
            ))
          : null}
        {beat >= 1 ? (
          <svg
            width={1920}
            height={1080}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <polygon
              points={W_POINTS.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="rgba(229,50,45,0.12)"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth={2}
              strokeDasharray="6 6"
              opacity={ease(frame, L5_BEATS[1] + 30, L5_BEATS[1] + 40)}
            />
          </svg>
        ) : null}
      </Rig>
      {beat >= 2 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 380,
            textAlign: "center",
            ...ANTON,
            fontSize: 220,
            color: "rgba(255,255,255,0.85)",
            textShadow: "0 0 30px rgba(0,0,0,0.6)",
          }}
        >
          {dirFlip ? "←" : "→"}
        </div>
      ) : null}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,5,6,0.75) 0%, rgba(5,5,6,0) 25%)",
        }}
      />
      <div style={{ position: "absolute", left: 110, top: 120 }}>
        <div style={{ ...MONO, fontSize: 24, color: COLOR.gold }}>
          ON THE FLOOR
        </div>
        <Sequence from={L5_BEATS[beat]} key={beat} layout="none">
          <Slam at={2}>
            <div
              style={{
                ...ANTON,
                fontSize: 110,
                color: beat === 3 ? RED : "#fff",
                whiteSpace: "nowrap",
              }}
            >
              {lines[beat]}
            </div>
          </Slam>
        </Sequence>
      </div>
      <Counter start={0} />
      <LabFrame n="03" tag="FOOTWORK" />
      <ReconTag />
      {L5_BEATS.slice(1).map((b) => (
        <Sfx key={b} name="hit" at={b + 2} volume={0.3} />
      ))}
    </Finish>
  );
};

// ============ L06 — "And the freeze works like punctuation. The music hits. The body answers. Stop.
// [BEAT OF SILENCE]" A tall panel; a waveform hit, the body answers, everything stops and drains.
const HIT = 120;
const STOP = 186;
export const L06Freeze: React.FC = () => {
  const frame = useCurrentFrame();
  const stopped = frame >= STOP;
  const drain = ease(frame, STOP, STOP + 4);
  const dot = frame >= 60;
  return (
    <Finish dust={stopped ? 0 : 0.2}>
      <AbsoluteFill style={{ backgroundColor: "#0A0908" }} />
      <div
        style={{
          position: "absolute",
          left: 960 - 470,
          top: 60,
          width: 940,
          height: 1030,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
        }}
      >
        <Img
          src={staticFile(img("m9b"))}
          style={{
            position: "absolute",
            width: 940 * 1.1,
            height: 1031 * 1.1,
            left: -47,
            top: -30,
            scale: String(stopped ? 1.1 : 1 + Math.min(frame, STOP) * 0.0005),
            filter: `${WARM} grayscale(${drain}) contrast(${1 + 0.2 * drain})`,
          }}
        />
      </div>
      {/* the hit */}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {Array.from({ length: 60 }).map((_, i) => {
          const x = 80 + i * 6;
          const near =
            frame >= HIT && frame < HIT + 20 && i > 40
              ? (1 - (frame - HIT) / 20) * 180 * random(`h${i}`)
              : 0;
          const a =
            6 +
            random(`a${i}${Math.floor(frame / 3)}`) * (stopped ? 0 : 18) +
            near;
          return (
            <rect
              key={i}
              x={x}
              y={540 - a / 2}
              width={3}
              height={a}
              fill={i > 40 && near > 0 ? RED : "rgba(255,255,255,0.7)"}
            />
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 70, top: 200, width: 420 }}>
        <div style={{ fontSize: 27, color: "#fff" }}>
          <TypeOn
            text="the freeze works like"
            at={4}
            cps={1.6}
            cursor={false}
          />
        </div>
        <Slam at={30}>
          <div style={{ ...ANTON, fontSize: 74, color: "#fff" }}>
            Punctuation
          </div>
        </Slam>
      </div>
      {dot ? (
        <div style={{ position: "absolute", left: 1450, top: 520 }}>
          <Slam at={60}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                background: RED,
                boxShadow: `0 0 40px ${RED}`,
              }}
            />
          </Slam>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 1450, top: 700, width: 420 }}>
        {[
          { t: "The music hits.", at: HIT },
          { t: "The body answers.", at: HIT + 32 },
        ].map((l) =>
          frame >= l.at ? (
            <div
              key={l.t}
              style={{
                ...ANTON,
                fontSize: 64,
                color: "#fff",
                opacity: ease(frame, l.at, l.at + 6),
              }}
            >
              {l.t}
            </div>
          ) : null,
        )}
        {stopped ? (
          <div style={{ ...ANTON, fontSize: 150, color: RED, lineHeight: 1 }}>
            Stop.
          </div>
        ) : null}
      </div>
      <LabFrame n="04" tag={stopped ? "■ FREEZE" : "FREEZE"} />
      <ReconTag />
      <Sfx name="hit" at={32} volume={0.3} />
      <Sfx name="boom" at={HIT} volume={0.45} />
      <Sfx name="hit" at={STOP} volume={0.5} />
    </Finish>
  );
};

// ============ L07 — "Later generations pushed the dance further with faster spins, more difficult
// transitions and what became known as power moves. But difficulty is not the same thing as foundation."
// A spinning motion-blurred cypher, then a lab chart: DIFFICULTY climbs; FOUNDATION stays the base line.
const CHART = 150;
export const L07Difficulty: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [CHART + 10, CHART + 90], [0, 1], clamp);
  const neq = ease(frame, CHART + 130, CHART + 145);
  return (
    <Finish dust={0.25}>
      {frame < CHART ? (
        <>
          <AbsoluteFill style={{ rotate: `${frame * 0.25}deg`, scale: "1.25" }}>
            <Img
              src={staticFile(img("m4"))}
              style={{
                position: "absolute",
                width: 1920,
                height: 1080,
                filter: `${WARM} blur(${2 + Math.sin(frame / 5) * 1.5}px)`,
              }}
            />
          </AbsoluteFill>
          <AbsoluteFill style={{ background: SHADE }} />
          {[
            { t: "faster spins", at: 30 },
            { t: "more difficult transitions", at: 64 },
            { t: "power moves", at: 100 },
          ].map((l, i) =>
            frame >= l.at ? (
              <div
                key={l.t}
                style={{ position: "absolute", left: 120, top: 520 + i * 120 }}
              >
                <Slam at={l.at}>
                  <span
                    style={{
                      ...ANTON,
                      fontSize: 110,
                      color: i === 2 ? RED : "#fff",
                    }}
                  >
                    {l.t}
                  </span>
                </Slam>
              </div>
            ) : null,
          )}
          <Caption
            text="later generations pushed the dance further with"
            at={4}
            y={120}
            size={40}
            cursor={false}
          />
        </>
      ) : (
        <>
          <AbsoluteFill style={{ backgroundColor: "#0C0B0A" }} />
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            <line
              x1={240}
              y1={860}
              x2={1700}
              y2={860}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={2}
            />
            <line
              x1={240}
              y1={860}
              x2={240}
              y2={180}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={2}
            />
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={240}
                y1={860 - (i + 1) * 160}
                x2={1700}
                y2={860 - (i + 1) * 160}
                stroke="rgba(255,255,255,0.08)"
              />
            ))}
            <path
              d="M 240 820 C 700 800, 1100 600, 1700 210"
              fill="none"
              stroke={RED}
              strokeWidth={8}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - draw}
              style={{ filter: `drop-shadow(0 0 10px ${RED})` }}
            />
            <path
              d="M 240 760 L 1700 760"
              fill="none"
              stroke={COLOR.gold}
              strokeWidth={8}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - draw}
              style={{ filter: `drop-shadow(0 0 10px ${COLOR.gold})` }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 1500,
              top: 160,
              ...MONO,
              fontSize: 28,
              color: RED,
              opacity: draw,
            }}
          >
            DIFFICULTY
          </div>
          <div
            style={{
              position: "absolute",
              left: 1500,
              top: 700,
              ...MONO,
              fontSize: 28,
              color: COLOR.gold,
              opacity: draw,
            }}
          >
            FOUNDATION
          </div>
          <div
            style={{
              position: "absolute",
              left: 240,
              top: 880,
              ...MONO,
              fontSize: 22,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            EARLY BREAKING
          </div>
          <div
            style={{
              position: "absolute",
              left: 1560,
              top: 880,
              ...MONO,
              fontSize: 22,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            LATER
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 330,
              textAlign: "center",
              opacity: neq,
            }}
          >
            <span
              style={{
                ...ANTON,
                fontSize: 130,
                color: "#fff",
                textShadow: "0 8px 30px rgba(0,0,0,0.85)",
              }}
            >
              Difficulty <span style={{ color: RED }}>≠</span> foundation
            </span>
          </div>
        </>
      )}
      <LabFrame
        n="05"
        tag="DIFFICULTY ≠ FOUNDATION"
        opacity={frame >= CHART ? 1 : 0.6}
      />
      <ReconTag />
      {[30, 64, 100].map((f) => (
        <Sfx key={f} name="hit" at={f} volume={0.3} />
      ))}
      <Sfx name="whoosh" at={CHART - 6} volume={0.35} />
      <Sfx name="hit" at={CHART + 132} volume={0.4} />
    </Finish>
  );
};

// ============ L08 — SPLIT-SCREEN: "A difficult move can impress you. A foundation tells you whether the
// dancer understands the music." Groove vs airborne move, each over a beat grid: the groove's steps land
// on the grid lines; the big move's spike floats between them.
const BeatGrid: React.FC<{
  x: number;
  w: number;
  on: boolean;
  start: number;
}> = ({ x, w, on, start }) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  if (t < 0) return null;
  const n = 8;
  return (
    <svg
      width={w}
      height={160}
      style={{ position: "absolute", left: x, top: 880 }}
    >
      {Array.from({ length: n }).map((_, i) => (
        <line
          key={i}
          x1={20 + i * ((w - 40) / (n - 1))}
          y1={10}
          x2={20 + i * ((w - 40) / (n - 1))}
          y2={150}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={2}
        />
      ))}
      {on
        ? Array.from({ length: n }).map((_, i) => {
            const lit = t >= i * 12;
            return (
              <circle
                key={i}
                cx={20 + i * ((w - 40) / (n - 1))}
                cy={80}
                r={lit ? 16 : 0}
                fill={COLOR.gold}
              />
            );
          })
        : (() => {
            const lit = t >= 50;
            const cx = 20 + 3.55 * ((w - 40) / (n - 1));
            return lit ? (
              <rect x={cx - 10} y={10} width={20} height={140} fill={RED} />
            ) : null;
          })()}
    </svg>
  );
};
export const L08Split: React.FC = () => {
  const frame = useCurrentFrame();
  const inL = ease(frame, 0, 14);
  const inR = ease(frame, 20, 34);
  return (
    <Finish dust={0.2}>
      <AbsoluteFill style={{ backgroundColor: "#0A0908" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 958,
          height: 1080,
          overflow: "hidden",
          clipPath: `inset(0 ${(1 - inL) * 100}% 0 0)`,
        }}
      >
        <Steps srcs={["m9a", "m9a"]} start={0} scale={1} />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(0deg, rgba(5,5,6,0.85) 0%, rgba(5,5,6,0) 45%)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 962,
          top: 0,
          width: 958,
          height: 1080,
          overflow: "hidden",
          clipPath: `inset(0 0 0 ${(1 - inR) * 100}%)`,
        }}
      >
        <Img
          src={staticFile(img("m9b"))}
          style={{
            position: "absolute",
            width: 958 * 1.12,
            height: 1051 * 1.12,
            left: -50,
            top: -40,
            filter: LAB_GRADE,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(0deg, rgba(5,5,6,0.85) 0%, rgba(5,5,6,0) 45%)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 958,
          top: 0,
          width: 4,
          height: 1080,
          background: COLOR.gold,
        }}
      />
      {/* labels */}
      <div style={{ position: "absolute", left: 80, top: 640, width: 820 }}>
        <div style={{ ...MONO, fontSize: 24, color: COLOR.gold }}>
          SIMPLE GROOVE · STRONG TIMING
        </div>
        <Sequence from={180} layout="none">
          <Slam at={0}>
            <div
              style={{
                ...ANTON,
                fontSize: 70,
                color: "#fff",
                lineHeight: 1.05,
              }}
            >
              A foundation tells you whether the dancer understands the music.
            </div>
          </Slam>
        </Sequence>
      </div>
      <div style={{ position: "absolute", left: 1040, top: 640, width: 820 }}>
        <div style={{ ...MONO, fontSize: 24, color: RED }}>
          HARDER MOVE · OFF THE MUSIC
        </div>
        <Sequence from={60} layout="none">
          <Slam at={0}>
            <div
              style={{
                ...ANTON,
                fontSize: 70,
                color: "#fff",
                lineHeight: 1.05,
              }}
            >
              A difficult move can impress you.
            </div>
          </Slam>
        </Sequence>
      </div>
      <BeatGrid x={60} w={840} on start={40} />
      <BeatGrid x={1020} w={840} on={false} start={40} />
      <LabFrame n="06" tag="TIMING TEST" />
      <ReconTag />
      <Sfx name="whoosh" at={0} volume={0.25} />
      <Sfx name="whoosh" at={20} volume={0.25} />
      <Sfx name="hit" at={60} volume={0.3} />
      <Sfx name="glitch" at={90} volume={0.2} />
      <Sfx name="hit" at={180} volume={0.35} />
    </Finish>
  );
};

// ============ L09 — "That is why I want breaking in this story – not as a list of tricks, but as evidence
// of what happened when DJs gave dancers more rhythmic space and dancers turned that space into their
// own movement language." The trick list is struck; an EVIDENCE tag; then DJ → space → dancer → language.
const TRICKS = ["Headspin", "Windmill", "Flare", "Air freeze"];
const CHAIN_AT = 120;
const CHAIN = [
  {
    src: "m10",
    label: "DJs gave dancers",
    word: "Rhythmic space",
    at: CHAIN_AT,
  },
  {
    src: "m4",
    label: "dancers turned that space into",
    word: "Their own language",
    at: CHAIN_AT + 120,
  },
];
export const L09Evidence: React.FC = () => {
  const frame = useCurrentFrame();
  const struck = interpolate(frame, [56, 80], [0, 1], clamp);
  const k = CHAIN.filter((c) => frame >= c.at).length - 1;
  return (
    <Finish dust={0.25}>
      {k < 0 ? (
        <>
          <AbsoluteFill style={{ backgroundColor: "#0C0B0A" }} />
          <div
            style={{
              position: "absolute",
              left: 160,
              top: 200,
              width: 900,
              background: "#F2EEE4",
              padding: "40px 48px",
              rotate: "-1.5deg",
              boxShadow: "0 30px 70px rgba(0,0,0,0.7)",
            }}
          >
            <div style={{ ...MONO, fontSize: 22, color: "#7A6F60" }}>
              NOT A LIST OF TRICKS
            </div>
            {TRICKS.map((t, i) => (
              <div
                key={t}
                style={{
                  position: "relative",
                  ...MONO,
                  fontSize: 52,
                  color: "#17130F",
                  marginTop: 18,
                  opacity: ease(frame, 6 + i * 8, 12 + i * 8),
                }}
              >
                ☐ {t.toUpperCase()}
                <div
                  style={{
                    position: "absolute",
                    left: -10,
                    top: "50%",
                    height: 6,
                    width: `${Math.max(0, Math.min(1, struck * 4 - i)) * 105}%`,
                    background: RED,
                  }}
                />
              </div>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: 1180,
              top: 330,
              rotate: "-8deg",
              opacity: ease(frame, 88, 96),
              scale: String(1.5 - 0.5 * ease(frame, 88, 96)),
            }}
          >
            <div
              style={{
                ...ANTON,
                fontSize: 150,
                color: RED,
                border: `10px solid ${RED}`,
                padding: "0 30px",
              }}
            >
              Evidence
            </div>
          </div>
        </>
      ) : (
        <Sequence
          from={CHAIN[k].at}
          key={k}
          durationInFrames={CHAIN_AT + 250 - CHAIN[k].at}
        >
          <Rig
            keys={[
              { f: 0, s: 1.3, x: 960, y: 560 },
              { f: 120, s: 1.12, x: 960, y: 540, e: "smooth" },
            ]}
            whipIn={1}
          >
            <Plate src={img(CHAIN[k].src)} filter={WARM} />
          </Rig>
          <AbsoluteFill style={{ background: SHADE }} />
          <Pair
            thin={CHAIN[k].label}
            heavy={CHAIN[k].word}
            at={10}
            y={760}
            size={150}
            color={k === 1 ? RED : COLOR.gold}
          />
        </Sequence>
      )}
      <Sequence from={CHAIN_AT + 250} layout="none">
        <Img
          src={staticFile(img("m4"))}
          style={{
            position: "absolute",
            width: 1920,
            height: 1080,
            filter: `${WARM} blur(6px) brightness(0.45)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 300,
            textAlign: "center",
          }}
        >
          <div
            style={{
              ...MONO,
              fontSize: 28,
              color: COLOR.gold,
              letterSpacing: "0.2em",
            }}
          >
            BREAKING IS EVIDENCE OF
          </div>
          <Slam at={4}>
            <div style={{ ...ANTON, fontSize: 150, color: "#fff" }}>
              What the break made possible.
            </div>
          </Slam>
        </div>
      </Sequence>
      <Caption
        text="that is why I want breaking in this story —"
        at={4}
        y={80}
        size={38}
        cursor={false}
      />
      <ReconTag />
      <Sfx name="tick" at={56} volume={0.25} />
      <Sfx name="hit" at={90} volume={0.4} />
      <Sfx name="whoosh" at={CHAIN_AT - 6} volume={0.35} />
      <Sfx name="whoosh" at={CHAIN_AT + 114} volume={0.35} />
      <Sfx name="hit" at={CHAIN_AT + 254} volume={0.35} />
    </Finish>
  );
};

// ---------- transparent overlays for the host's own demos ----------
const OverlayBase: React.FC<{
  bg: Bg;
  children: React.ReactNode;
  preview: string;
}> = ({ bg, children, preview }) => (
  <AbsoluteFill
    style={{ backgroundColor: bg === "green" ? "#00FF00" : undefined }}
  >
    {bg === "preview" ? (
      <Img
        src={staticFile(img(preview))}
        style={{
          position: "absolute",
          width: 1920,
          height: 1080,
          filter: "brightness(0.8)",
        }}
      />
    ) : null}
    {children}
  </AbsoluteFill>
);
const OvTitle: React.FC<{
  top: string;
  main: string;
  at: number;
  green?: boolean;
}> = ({ top, main, at, green }) => {
  const frame = useCurrentFrame();
  const t = ease(frame, at, at + 10);
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 130,
        opacity: t,
        translate: `${(1 - t) * -30}px 0px`,
      }}
    >
      <div
        style={{
          ...MONO,
          fontSize: 24,
          color: COLOR.gold,
          textShadow: green ? undefined : "0 0 8px rgba(0,0,0,0.9)",
        }}
      >
        {top}
      </div>
      <div
        style={{
          ...ANTON,
          fontSize: 120,
          color: "#fff",
          textShadow: green ? undefined : "0 6px 20px rgba(0,0,0,0.85)",
        }}
      >
        {main}
      </div>
    </div>
  );
};
// OV1 — DEMO toprock, 8 counts
export const Ov1Toprock: React.FC<{ bg: Bg }> = ({ bg }) => {
  const frame = useCurrentFrame();
  const g = bg === "green";
  return (
    <OverlayBase bg={bg} preview="m1">
      <OvTitle top="MOVEMENT LAB · 01" main="Toprock" at={6} green={g} />
      {["Rhythm", "Character", "Presence"].map((w, i) => (
        <div
          key={w}
          style={{
            position: "absolute",
            left: 114,
            top: 320 + i * 70,
            ...ANTON,
            fontSize: 56,
            color: i === 2 ? RED : "#fff",
            opacity: ease(frame, 140 + i * 24, 150 + i * 24),
          }}
        >
          {String(i + 1).padStart(2, "0")} {w}
        </div>
      ))}
      <Counter start={20} green={g} />
    </OverlayBase>
  );
};
// OV2 — DEMO toprock → go-down: level meter falls on the drop
export const Ov2GoDown: React.FC<{ bg: Bg }> = ({ bg }) => {
  const frame = useCurrentFrame();
  const lvl = interpolate(frame, [90, 150], [0, 2], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <OverlayBase bg={bg} preview="m8">
      <OvTitle
        top="MOVEMENT LAB · 02"
        main="Go-down"
        at={6}
        green={bg === "green"}
      />
      <LevelMeter level={lvl} green={bg === "green"} />
      <div
        style={{
          position: "absolute",
          left: 114,
          top: 330,
          ...MONO,
          fontSize: 28,
          color: "#fff",
          opacity: ease(frame, 150, 162),
        }}
      >
        NOT DEAD SPACE · PART OF THE SENTENCE
      </div>
    </OverlayBase>
  );
};
// OV3 — DEMO footwork: labels change on the beat, counter keeps going
export const Ov3Footwork: React.FC<{ bg: Bg }> = ({ bg }) => {
  const frame = useCurrentFrame();
  const lines = [
    "Pathways",
    "Hands + feet share weight",
    "Direction changes",
    "Rhythm continues",
  ];
  const k = Math.min(3, Math.floor(frame / 70));
  return (
    <OverlayBase bg={bg} preview="m6">
      <OvTitle
        top="MOVEMENT LAB · 03"
        main="Footwork"
        at={6}
        green={bg === "green"}
      />
      <Sequence from={k * 70} key={k} layout="none">
        <div
          style={{
            position: "absolute",
            left: 114,
            top: 320,
            ...ANTON,
            fontSize: 70,
            color: k === 3 ? RED : "#fff",
            opacity: ease(frame, k * 70, k * 70 + 8),
          }}
        >
          {lines[k]}
        </div>
      </Sequence>
      <Counter start={0} green={bg === "green"} />
    </OverlayBase>
  );
};
// OV4 — DEMO freeze: line up "STOP." with the accent at 3.0s
export const Ov4Freeze: React.FC<{ bg: Bg }> = ({ bg }) => {
  const frame = useCurrentFrame();
  const stop = 90;
  return (
    <OverlayBase bg={bg} preview="m9b">
      <OvTitle
        top="MOVEMENT LAB · 04"
        main="Freeze"
        at={6}
        green={bg === "green"}
      />
      {frame >= stop ? (
        <div
          style={{
            position: "absolute",
            right: 140,
            bottom: 150,
            textAlign: "right",
          }}
        >
          <Slam at={stop}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <span style={{ ...ANTON, fontSize: 200, color: RED }}>Stop</span>
              <span
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  background: RED,
                  display: "inline-block",
                  marginTop: 90,
                }}
              />
            </div>
          </Slam>
        </div>
      ) : null}
    </OverlayBase>
  );
};
