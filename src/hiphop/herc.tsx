import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLOR } from "../brand/tokens";
import { Finish, Sfx } from "../laban/broll";
import { Plate, Rig } from "../laban3/rig";
import { LightSweep } from "../laban9/fx9";
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
  Tape,
  WARM,
} from "./kit";
import { StampWord, TypeOn } from "./kit2";

// Hip-hop episode — "And one of the DJs who became famous for understanding that reaction was a
// Jamaican-born teenager named Clive Campbell." Three clips, 30 fps:
// H1 contact sheet + loupe + grease pencil → punch into the chosen frame and the crowd's reaction;
// H2 flight path Kingston → the Bronx; H3 a spinning record label that stops on his name.
export const LENHERC = { h1: 210, h2: 135, h3: 165 };

// ============ H1 — "And one of the DJs who became famous for understanding that reaction…"
const FRAMES = ["o_djsys", "d_booth", "k4", "n8a", "e1", "x_cables"];
const PICK = 4;
const FW = 560;
const FH = 315;
const GAP = 70;
const STRIP_Y = 470;
const fx = (i: number) => 260 + i * (FW + GAP);
const PUNCH = 128;

const Strip: React.FC<{ off: number; bw: number }> = ({ off, bw }) => {
  const total = FRAMES.length * (FW + GAP) + 200;
  return (
    <div
      style={{
        position: "absolute",
        left: -off,
        top: STRIP_Y - FH / 2 - 60,
        width: total,
        height: FH + 120,
        background: "#15110E",
      }}
    >
      {/* sprocket holes */}
      {Array.from({ length: Math.floor(total / 46) }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              position: "absolute",
              left: 20 + i * 46,
              top: 14,
              width: 24,
              height: 18,
              borderRadius: 4,
              background: "#EDEBE4",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 20 + i * 46,
              top: FH + 88,
              width: 24,
              height: 18,
              borderRadius: 4,
              background: "#EDEBE4",
            }}
          />
        </React.Fragment>
      ))}
      {FRAMES.map((f, i) => (
        <div
          key={f}
          style={{
            position: "absolute",
            left: fx(i) - 130,
            top: 60,
            width: FW,
            height: FH,
          }}
        >
          <Img
            src={staticFile(img(f))}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: `grayscale(${bw}) contrast(1.15)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 6,
              bottom: -25,
              ...MONO,
              fontSize: 16,
              color: "#E9A24A",
            }}
          >{`${14 + i}${i % 2 ? "A" : ""}  ▶`}</div>
        </div>
      ))}
    </div>
  );
};

export const H1Contact: React.FC = () => {
  const frame = useCurrentFrame();
  // strip slides so each frame passes under the centre; it settles on the chosen one
  const target = fx(PICK) - 130 + FW / 2 - 960;
  const off = interpolate(
    frame,
    [0, 90],
    [fx(0) - 130 + FW / 2 - 960 - 200, target],
    { ...clamp, easing: Easing.inOut(Easing.cubic) },
  );
  const loupeX = 960;
  const loupeY = STRIP_Y;
  const pencil = interpolate(frame, [92, 112], [0, 1], clamp);
  const punch = interpolate(frame, [PUNCH - 6, PUNCH + 10], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const s = 1 + punch * (1920 / FW - 1);
  const loupeOut = ease(frame, 112, 124);
  return (
    <Finish dust={0.25}>
      {frame < PUNCH + 10 ? (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, #FFF8EC 0%, #E8E1D2 55%, #B9B0A0 100%)",
          }}
        >
          <AbsoluteFill
            style={{ transformOrigin: `960px ${STRIP_Y}px`, scale: String(s) }}
          >
            <Strip off={off} bw={1} />
            <svg
              width={1920}
              height={1080}
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              <path
                d={`M ${960 - 330} ${STRIP_Y - 20} C ${960 - 330} ${STRIP_Y - 230}, ${960 + 340} ${STRIP_Y - 225}, ${960 + 335} ${STRIP_Y} S ${960 - 300} ${STRIP_Y + 230}, ${960 - 340} ${STRIP_Y - 40}`}
                fill="none"
                stroke={RED}
                strokeWidth={14}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - pencil}
                opacity={0.85}
              />
            </svg>
          </AbsoluteFill>
          {/* the loupe: the same strip magnified inside a circle */}
          <AbsoluteFill
            style={{
              opacity: 1 - loupeOut,
              clipPath: `circle(170px at ${loupeX}px ${loupeY}px)`,
            }}
          >
            <AbsoluteFill
              style={{
                transformOrigin: `${loupeX}px ${loupeY}px`,
                scale: "1.9",
                background: "#E8E1D2",
              }}
            >
              <Strip off={off} bw={1} />
            </AbsoluteFill>
          </AbsoluteFill>
          <svg
            width={1920}
            height={1080}
            style={{ position: "absolute", opacity: 1 - loupeOut }}
          >
            <circle
              cx={loupeX}
              cy={loupeY}
              r={172}
              fill="none"
              stroke="#2A2622"
              strokeWidth={16}
            />
            <circle
              cx={loupeX}
              cy={loupeY}
              r={160}
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={3}
            />
          </svg>
        </AbsoluteFill>
      ) : (
        <Sequence from={PUNCH + 10}>
          <Rig
            keys={[
              { f: 0, s: 1.05, x: 960, y: 540 },
              { f: 72, s: 1.18, x: 1100, y: 420, e: "smooth" },
            ]}
          >
            <Plate src={img("e1")} filter={WARM} />
            <svg
              width={1920}
              height={1080}
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              <ellipse
                cx={1450}
                cy={330}
                rx={360}
                ry={150}
                fill="none"
                stroke={COLOR.gold}
                strokeWidth={5}
                strokeDasharray="14 10"
                opacity={ease(frame, PUNCH + 24, PUNCH + 36)}
              />
            </svg>
          </Rig>
        </Sequence>
      )}
      {frame >= PUNCH + 10 && frame < PUNCH + 14 ? (
        <AbsoluteFill style={{ backgroundColor: "rgba(255,240,215,0.5)" }} />
      ) : null}
      {frame >= PUNCH + 10 ? (
        <AbsoluteFill style={{ background: SHADE }} />
      ) : null}
      {frame < PUNCH ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 840,
            textAlign: "center",
            fontSize: 44,
            color: "#1A1714",
          }}
        >
          <TypeOn
            text="and one of the DJs who became famous for"
            at={10}
            cps={1.4}
          />
        </div>
      ) : null}
      {frame >= PUNCH + 30 ? (
        <div
          style={{
            position: "absolute",
            left: 1220,
            top: 470,
            ...MONO,
            fontSize: 26,
            color: "#111",
            background: "rgba(255,255,255,0.92)",
            padding: "6px 14px",
            opacity: ease(frame, PUNCH + 30, PUNCH + 40),
          }}
        >
          THE CROWD&apos;S REACTION
        </div>
      ) : null}
      <Sequence from={PUNCH + 16} layout="none">
        <Pair
          thin="understanding"
          heavy="that reaction."
          at={0}
          y={770}
          size={170}
          color={COLOR.gold}
        />
      </Sequence>
      <ReconTag />
      <Sfx name="whoosh" at={10} volume={0.2} />
      <Sfx name="tick" at={92} volume={0.3} />
      <Sfx name="whoosh" at={PUNCH} volume={0.45} />
      <Sfx name="hit" at={PUNCH + 12} volume={0.35} />
    </Finish>
  );
};

// ============ H2 — "…was a Jamaican-born teenager…" A flight path, Kingston → the Bronx.
const KIN = { x: 520, y: 820 };
const BRX = { x: 1460, y: 300 };
export const H2Route: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [26, 80], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const ctrl = { x: 760, y: 220 };
  const pt = (t: number) => ({
    x: (1 - t) ** 2 * KIN.x + 2 * (1 - t) * t * ctrl.x + t * t * BRX.x,
    y: (1 - t) ** 2 * KIN.y + 2 * (1 - t) * t * ctrl.y + t * t * BRX.y,
  });
  const dot = pt(p);
  const camX = interpolate(frame, [0, 135], [-60, 60], clamp);
  return (
    <Finish dust={0.25}>
      <Img
        src={staticFile(img("o_dusk"))}
        style={{
          position: "absolute",
          width: 1920,
          height: 1080,
          filter: "blur(14px) brightness(0.28) saturate(0.6)",
          scale: "1.1",
        }}
      />
      <AbsoluteFill style={{ translate: `${-camX}px 0px` }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          {Array.from({ length: 13 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * 160}
              y1={0}
              x2={i * 160 + 80}
              y2={1080}
              stroke="rgba(255,255,255,0.08)"
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <path
              key={`h${i}`}
              d={`M -40 ${i * 150} Q 960 ${i * 150 - 50} 1960 ${i * 150}`}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
            />
          ))}
          <path
            d={`M ${KIN.x} ${KIN.y} Q ${ctrl.x} ${ctrl.y} ${BRX.x} ${BRX.y}`}
            fill="none"
            stroke={RED}
            strokeWidth={5}
            strokeDasharray="14 12"
            opacity={0.25}
          />
          <path
            d={`M ${KIN.x} ${KIN.y} Q ${ctrl.x} ${ctrl.y} ${BRX.x} ${BRX.y}`}
            fill="none"
            stroke={RED}
            strokeWidth={6}
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - p}
            style={{ filter: `drop-shadow(0 0 8px ${RED})` }}
          />
          {p > 0 && p < 1 ? (
            <circle
              cx={dot.x}
              cy={dot.y}
              r={12}
              fill="#fff"
              style={{ filter: "drop-shadow(0 0 10px #fff)" }}
            />
          ) : null}
          {[KIN, BRX].map((c, i) => {
            const on = i === 0 ? ease(frame, 6, 16) : ease(frame, 78, 88);
            const ring = ((frame + i * 15) % 30) / 30;
            return (
              <g key={i} opacity={on}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={14}
                  fill={i === 0 ? COLOR.gold : RED}
                />
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={18 + ring * 40}
                  fill="none"
                  stroke={i === 0 ? COLOR.gold : RED}
                  strokeWidth={3}
                  opacity={1 - ring}
                />
              </g>
            );
          })}
        </svg>
        <Tape
          text="Kingston, Jamaica"
          x={KIN.x + 40}
          y={KIN.y + 70}
          rot={-2}
          at={8}
          size={34}
        />
        <div
          style={{
            position: "absolute",
            left: KIN.x - 120,
            top: KIN.y + 110,
            ...MONO,
            fontSize: 22,
            color: COLOR.gold,
          }}
        >
          <TypeOn text="17.97° N · 76.79° W" at={14} cps={1.6} cursor={false} />
        </div>
        <Tape
          text="The Bronx, New York"
          x={BRX.x + 30}
          y={BRX.y - 70}
          rot={2}
          at={80}
          size={34}
        />
        <div
          style={{
            position: "absolute",
            left: BRX.x - 110,
            top: BRX.y - 140,
            ...MONO,
            fontSize: 22,
            color: RED,
          }}
        >
          <TypeOn text="40.84° N · 73.86° W" at={86} cps={1.6} cursor={false} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 1020, top: 640 }}>
        <div
          style={{
            ...MONO,
            fontSize: 30,
            color: "#fff",
            opacity: ease(frame, 20, 30),
          }}
        >
          A JAMAICAN-BORN
        </div>
        <Slam at={56}>
          <div
            style={{
              ...ANTON,
              fontSize: 190,
              color: "#fff",
              lineHeight: 1,
              textShadow: "0 8px 30px rgba(0,0,0,0.8)",
            }}
          >
            Teenager
          </div>
        </Slam>
      </div>
      <Sfx name="tick" at={8} volume={0.25} />
      <Sfx name="whoosh" at={26} volume={0.35} />
      <Sfx name="hit" at={58} volume={0.3} />
      <Sfx name="tick" at={80} volume={0.25} />
    </Finish>
  );
};

// ============ H3 — "…named Clive Campbell." A record spins in, slows and stops dead with his name
// upright on the label; then DJ KOOL HERC is stamped.
const STOPF = 62;
const RC = { x: 640, y: 540 };
export const H3Label: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, STOPF], [0, 1], clamp);
  const angle = -1440 * (1 - (1 - t) ** 3) + 1440; // spins down, lands on 0
  const speed = 1 - t;
  const shake =
    frame >= STOPF && frame < STOPF + 10
      ? Math.exp(-(frame - STOPF) / 3) * 8
      : 0;
  return (
    <Finish dust={0.3}>
      <Img
        src={staticFile(img("x_vinyl"))}
        style={{
          position: "absolute",
          width: 1920,
          height: 1080,
          filter: "blur(16px) brightness(0.3)",
          scale: "1.1",
        }}
      />
      <AbsoluteFill
        style={{
          translate: `${Math.sin(frame * 7) * shake}px ${Math.cos(frame * 5) * shake}px`,
        }}
      >
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <defs>
            <path
              id="lblTop"
              d={`M ${RC.x - 118} ${RC.y} A 118 118 0 0 1 ${RC.x + 118} ${RC.y}`}
            />
            <path
              id="lblBot"
              d={`M ${RC.x - 128} ${RC.y} A 128 128 0 0 0 ${RC.x + 128} ${RC.y}`}
            />
          </defs>
          <g
            transform={`rotate(${angle} ${RC.x} ${RC.y})`}
            style={{
              filter: speed > 0.05 ? `blur(${speed * 4}px)` : undefined,
            }}
          >
            <circle cx={RC.x} cy={RC.y} r={430} fill="#0B0B0C" />
            {Array.from({ length: 48 }).map((_, i) => (
              <circle
                key={i}
                cx={RC.x}
                cy={RC.y}
                r={180 + i * 5.2}
                fill="none"
                stroke={`rgba(255,255,255,${0.03 + (i % 5 === 0 ? 0.05 : 0)})`}
                strokeWidth={1.4}
              />
            ))}
            <path
              d={`M ${RC.x - 300} ${RC.y - 300} A 424 424 0 0 1 ${RC.x + 60} ${RC.y - 420}`}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={30}
            />
            <circle cx={RC.x} cy={RC.y} r={170} fill={RED} />
            <circle
              cx={RC.x}
              cy={RC.y}
              r={160}
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={2}
            />
            <text
              style={{ fontFamily: "Anton", fontSize: 44, letterSpacing: 4 }}
              fill="#fff"
            >
              <textPath href="#lblTop" startOffset="50%" textAnchor="middle">
                CLIVE CAMPBELL
              </textPath>
            </text>
            <text
              style={{ fontFamily: "JBMono", fontSize: 20, letterSpacing: 3 }}
              fill="rgba(255,255,255,0.85)"
            >
              <textPath href="#lblBot" startOffset="50%" textAnchor="middle">
                · THE BRONX · NY ·
              </textPath>
            </text>
            <text
              x={RC.x}
              y={RC.y + 64}
              textAnchor="middle"
              style={{ fontFamily: "JBMono", fontSize: 18 }}
              fill="rgba(255,255,255,0.8)"
            >
              SIDE A
            </text>
            <circle cx={RC.x} cy={RC.y} r={12} fill="#DDD" />
          </g>
        </svg>
        <div style={{ position: "absolute", left: 1140, top: 300 }}>
          <div
            style={{
              ...MONO,
              fontSize: 30,
              color: COLOR.gold,
              letterSpacing: "0.2em",
              opacity: ease(frame, 10, 20),
            }}
          >
            NAMED
          </div>
          <Slam at={STOPF}>
            <div
              style={{
                ...ANTON,
                fontSize: 170,
                color: "#fff",
                lineHeight: 0.95,
              }}
            >
              Clive
            </div>
            <div
              style={{
                ...ANTON,
                fontSize: 170,
                color: "#fff",
                lineHeight: 0.95,
              }}
            >
              Campbell
            </div>
          </Slam>
          {frame >= STOPF + 34 ? (
            <div style={{ marginTop: 36 }}>
              <StampWord
                text="DJ Kool Herc"
                at={STOPF + 34}
                size={92}
                rot={-5}
              />
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
      {frame >= STOPF && frame < STOPF + 3 ? (
        <AbsoluteFill style={{ backgroundColor: "rgba(255,240,215,0.45)" }} />
      ) : null}
      <LightSweep at={STOPF + 40} dur={40} angle={100} strength={0.14} />
      <Sfx name="whoosh" at={0} volume={0.3} />
      <Sfx name="hit" at={STOPF} volume={0.45} />
      <Sfx name="boom" at={STOPF + 34} volume={0.45} />
    </Finish>
  );
};
