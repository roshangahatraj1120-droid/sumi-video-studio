import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";
import { HeroWord } from "../brand/fx";
import { Glyph, GlyphDefs, Level, Shape } from "./symbols";

// GRAPHIC: an articulated figure moves while Labanotation-style symbols write themselves onto a
// vertical staff beside it. Built from the documented principles, not copied from any score:
// read bottom → top; columns = body parts (support next to the centre line, arms outside);
// shape = direction; shading = level; length = how long the movement takes.
// Then the dancer leaves, and a gold figure is rebuilt from the score alone.
export const STICK_LEN = 450;

export const FLOOR = 880;
const CX = 1420; // staff centre line
const COL = 60;
const BOTTOM = 950;
const PX = 3.4; // staff pixels per frame of movement time
const T0 = 40;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------- figure ----------
type Limb = [number, number]; // upper, lower: degrees from straight down, + = forward (right)
type Leg = [number, number, number]; // thigh, shin, foot tilt below horizontal
export type Pose = {
  hx: number;
  t: number;
  armF: Limb;
  armB: Limb;
  legF: Leg;
  legB: Leg;
  lift?: number;
};

export const STAND: Pose = {
  hx: 600,
  t: 0,
  armF: [6, 4],
  armB: [-4, -2],
  legF: [2, 0, 10],
  legB: [-2, 0, 10],
};
export const PLIE: Pose = {
  hx: 600,
  t: 12,
  armF: [88, 90],
  armB: [80, 86],
  legF: [55, -25, 10],
  legB: [45, -30, 10],
};
export const LUNGE: Pose = {
  hx: 720,
  t: 28,
  armF: [122, 128],
  armB: [-62, -72],
  legF: [70, 5, 10],
  legB: [-55, -60, 40],
};
export const RISE: Pose = {
  hx: 770,
  t: -6,
  armF: [172, 178],
  armB: [160, 168],
  legF: [4, 0, 62],
  legB: [-3, 0, 62],
};

// movement timeline: [start, end] frames and the pose reached
const MOVES: { a: number; b: number; to: Pose; ramp: boolean }[] = [
  { a: 40, b: 110, to: PLIE, ramp: false }, // slow: long symbols
  { a: 130, b: 148, to: LUNGE, ramp: true }, // fast burst: short symbols
  { a: 190, b: 260, to: RISE, ramp: false }, // slow again
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const mix = (p: Pose, q: Pose, t: number): Pose => ({
  hx: lerp(p.hx, q.hx, t),
  t: lerp(p.t, q.t, t),
  armF: [lerp(p.armF[0], q.armF[0], t), lerp(p.armF[1], q.armF[1], t)],
  armB: [lerp(p.armB[0], q.armB[0], t), lerp(p.armB[1], q.armB[1], t)],
  legF: [
    lerp(p.legF[0], q.legF[0], t),
    lerp(p.legF[1], q.legF[1], t),
    lerp(p.legF[2], q.legF[2], t),
  ],
  legB: [
    lerp(p.legB[0], q.legB[0], t),
    lerp(p.legB[1], q.legB[1], t),
    lerp(p.legB[2], q.legB[2], t),
  ],
});

// pose at movement time τ (frames on the original timeline)
const poseAt = (tau: number): Pose => {
  let p = STAND;
  for (const m of MOVES) {
    if (tau < m.a) return p;
    const t = interpolate(tau, [m.a, m.b], [0, 1], {
      ...clamp,
      easing: m.ramp ? Easing.inOut(Easing.exp) : Easing.inOut(Easing.sin),
    });
    if (tau < m.b) return mix(p, m.to, t);
    p = m.to;
  }
  return p;
};

const rad = (d: number) => (d * Math.PI) / 180;
const down = (
  o: [number, number],
  len: number,
  a: number,
): [number, number] => [
  o[0] + len * Math.sin(rad(a)),
  o[1] + len * Math.cos(rad(a)),
];
const LEG_H = (l: Leg) =>
  150 * Math.cos(rad(l[0])) +
  150 * Math.cos(rad(l[1])) +
  Math.max(14, 45 * Math.sin(rad(l[2])));

export const Figure: React.FC<{
  pose: Pose;
  color: string;
  opacity?: number;
  breathe?: number;
  // per-figure glow; off for crowds, where hundreds of filters get slow
  glow?: boolean;
}> = ({ pose, color, opacity = 1, breathe = 0, glow = true }) => {
  const hip: [number, number] = [
    pose.hx,
    FLOOR - Math.max(LEG_H(pose.legF), LEG_H(pose.legB)) - breathe,
  ];
  const up: [number, number] = [Math.sin(rad(pose.t)), -Math.cos(rad(pose.t))];
  const neck: [number, number] = [hip[0] + 190 * up[0], hip[1] + 190 * up[1]];
  const sh: [number, number] = [neck[0] - 16 * up[0], neck[1] - 16 * up[1]];
  const head: [number, number] = [neck[0] + 52 * up[0], neck[1] + 52 * up[1]];
  const arm = (l: Limb) => {
    const e = down(sh, 120, l[0]);
    return [sh, e, down(e, 110, l[1])];
  };
  const leg = (l: Leg) => {
    const k = down(hip, 150, l[0]);
    const an = down(k, 150, l[1]);
    const toe: [number, number] = [
      an[0] + 45 * Math.cos(rad(l[2])),
      an[1] + 45 * Math.sin(rad(l[2])),
    ];
    return [hip, k, an, toe];
  };
  const bone = (pts: [number, number][], far: boolean, key: string) => (
    <g key={key} opacity={far ? 0.45 : 1}>
      {pts.slice(1).map((p, i) => (
        <React.Fragment key={i}>
          <line
            x1={pts[i][0]}
            y1={pts[i][1]}
            x2={p[0]}
            y2={p[1]}
            stroke={color}
            strokeWidth={30}
            strokeLinecap="round"
          />
          <line
            x1={pts[i][0]}
            y1={pts[i][1]}
            x2={p[0]}
            y2={p[1]}
            stroke={COLOR.ink}
            strokeWidth={23}
            strokeLinecap="round"
          />
          <line
            x1={pts[i][0]}
            y1={pts[i][1]}
            x2={p[0]}
            y2={p[1]}
            stroke={color}
            strokeOpacity={0.16}
            strokeWidth={23}
            strokeLinecap="round"
          />
        </React.Fragment>
      ))}
      {pts.slice(0, -1).map((p, i) => (
        <circle
          key={`j${i}`}
          cx={p[0]}
          cy={p[1]}
          r={8}
          fill={COLOR.ink}
          stroke={color}
          strokeWidth={3}
        />
      ))}
    </g>
  );
  return (
    <g
      opacity={opacity}
      style={glow ? { filter: `drop-shadow(0 0 8px ${color}55)` } : undefined}
    >
      {bone(arm(pose.armB) as [number, number][], true, "ab")}
      {bone(leg(pose.legB) as [number, number][], true, "lb")}
      {bone([hip, neck], false, "torso")}
      {bone(leg(pose.legF) as [number, number][], false, "lf")}
      {bone(arm(pose.armF) as [number, number][], false, "af")}
      <circle
        cx={head[0]}
        cy={head[1]}
        r={34}
        fill={COLOR.ink}
        stroke={color}
        strokeWidth={4}
      />
    </g>
  );
};

// ---------- score ----------
type Sym = { move: number; col: number; shape: Shape; level: Level };
// col: signed column from the centre line (±1 support, ±4 arm)
const SYMS: Sym[] = [
  // 1 · plié with arms forward: supports low in place, arms forward middle
  { move: 0, col: -1, shape: "place", level: "low" },
  { move: 0, col: 1, shape: "place", level: "low" },
  { move: 0, col: -4, shape: "fwd", level: "mid" },
  { move: 0, col: 4, shape: "fwd", level: "mid" },
  // 2 · quick lunge forward: right support forward middle, right arm forward-high, left arm back-low
  { move: 1, col: 1, shape: "fwd", level: "mid" },
  { move: 1, col: 4, shape: "diagR", level: "high" },
  { move: 1, col: -4, shape: "diagL", level: "low" },
  // 3 · slow rise, arms up: supports high, arms place high
  { move: 2, col: -1, shape: "place", level: "high" },
  { move: 2, col: 1, shape: "place", level: "high" },
  { move: 2, col: -4, shape: "place", level: "high" },
  { move: 2, col: 4, shape: "place", level: "high" },
];
const colX = (c: number) => CX + Math.sign(c) * (Math.abs(c) - 0.5) * COL;
const yAt = (tau: number) => BOTTOM - (tau - T0) * PX;

const RULES = [
  { at: 52, k: "01", a: "Column", b: "body part" },
  { at: 132, k: "02", a: "Shape", b: "direction" },
  { at: 196, k: "03", a: "Shading", b: "level" },
  { at: 268, k: "04", a: "Length", b: "duration" },
];

export const StickScore: React.FC = () => {
  const frame = useCurrentFrame();
  const staffDraw = interpolate(frame, [0, 34], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const leave = interpolate(frame, [318, 344], [0, 1], clamp);
  const READ0 = 350;
  const READ1 = 428;
  const playY = interpolate(frame, [READ0, READ1], [BOTTOM, yAt(266)], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const reading = frame >= READ0;
  // reading the score back plays the movement again, sped up
  const tau = reading ? T0 + (BOTTOM - playY) / PX : frame;
  const pose = poseAt(Math.min(tau, 300));
  const breathe = Math.sin(frame / 14) * 2;
  // onion-skin trails during the fast burst
  const speed = MOVES.some((m) => m.ramp && tau > m.a - 1 && tau < m.b + 3);
  const rulesOut = interpolate(frame, [334, 346], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.ink, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 45% 60% at 40% 60%, rgba(232,194,122,0.07), rgba(13,7,16,0) 70%), radial-gradient(ellipse 30% 55% at ${CX}px 540px, rgba(232,194,122,0.08), rgba(13,7,16,0) 70%)`,
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <GlyphDefs id="ss" />
        {/* faint construction grid, like a draughtsman's sheet */}
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={`g${i}`}
            x1={i * 100}
            x2={i * 100}
            y1={0}
            y2={1080}
            stroke={COLOR.gold}
            strokeOpacity={0.035}
          />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            x2={1920}
            y1={i * 100}
            y2={i * 100}
            stroke={COLOR.gold}
            strokeOpacity={0.035}
          />
        ))}
        {/* floor */}
        <line
          x1={120}
          x2={1120}
          y1={FLOOR + 2}
          y2={FLOOR + 2}
          stroke={COLOR.white}
          strokeOpacity={0.35 * staffDraw}
          strokeWidth={2}
        />

        {/* the dancer: leaves the room, then a gold figure is rebuilt from the score */}
        {speed
          ? [6, 4, 2].map((d, i) => (
              <Figure
                key={d}
                pose={poseAt(tau - d * (reading ? 2 : 1))}
                color={reading ? COLOR.gold : COLOR.white}
                opacity={0.1 + i * 0.07}
              />
            ))
          : null}
        {leave < 1 ? (
          <Figure
            pose={reading ? STAND : pose}
            color={COLOR.white}
            opacity={1 - leave}
            breathe={breathe}
          />
        ) : null}
        {reading ? (
          <Figure
            pose={pose}
            color={COLOR.gold}
            opacity={interpolate(frame, [READ0, READ0 + 10], [0, 1], clamp)}
          />
        ) : null}
        {/* dust as the dancer leaves */}
        {leave > 0 && leave < 1
          ? Array.from({ length: 60 }).map((_, i) => {
              const x0 = 600 + (random(`dx${i}`) - 0.5) * 260;
              const y0 = 560 + (random(`dy${i}`) - 0.5) * 600;
              return (
                <circle
                  key={`d${i}`}
                  cx={x0 + leave * (random(`dv${i}`) - 0.3) * 160}
                  cy={y0 - leave * (80 + random(`du${i}`) * 200)}
                  r={2 + random(`dr${i}`) * 2.5}
                  fill={COLOR.gold}
                  opacity={(1 - leave) * 0.8}
                />
              );
            })
          : null}

        {/* staff: three lines, read bottom → top */}
        <g opacity={staffDraw}>
          {[0, 8].map((d) => (
            <line
              key={d}
              x1={CX - 150}
              x2={CX + 150}
              y1={BOTTOM + 6 + d}
              y2={BOTTOM + 6 + d}
              stroke={COLOR.gold}
              strokeWidth={3}
            />
          ))}
        </g>
        {[-2 * COL, 0, 2 * COL].map((dx) => (
          <line
            key={dx}
            x1={CX + dx}
            x2={CX + dx}
            y1={BOTTOM}
            y2={BOTTOM - (BOTTOM - 110) * staffDraw}
            stroke={COLOR.gold}
            strokeWidth={dx === 0 ? 3 : 2}
            style={{ filter: "drop-shadow(0 0 6px rgba(232,194,122,0.7))" }}
          />
        ))}
        {/* column highlight for rule 01 */}
        {[-4, -1, 1, 4].map((c) => {
          const on = interpolate(
            frame,
            [52, 60, 118, 128],
            [0, 1, 1, 0],
            clamp,
          );
          return (
            <rect
              key={c}
              x={colX(c) - 26}
              y={120}
              width={52}
              height={BOTTOM - 120}
              fill={COLOR.gold}
              opacity={0.06 * on}
              rx={4}
            />
          );
        })}
        {[-4, -1, 1, 4].map((c) => (
          <text
            key={`t${c}`}
            x={colX(c)}
            y={BOTTOM + 52}
            textAnchor="middle"
            fill={COLOR.gold}
            opacity={interpolate(frame, [54, 66], [0, 0.9], clamp)}
            style={{ ...TYPE.label, fontSize: 19, letterSpacing: "0.18em" }}
          >
            {Math.abs(c) === 4 ? "ARM" : "LEG"}
          </text>
        ))}

        {/* symbols grow for exactly as long as their movement lasts */}
        {SYMS.map((s, i) => {
          const m = MOVES[s.move];
          const now = Math.min(frame, m.b);
          if (frame < m.a) return null;
          const yb = yAt(m.a) - 4;
          const h = yb - yAt(now) - 4;
          const shade = interpolate(frame, [m.a + 6, m.a + 14], [0, 1], clamp);
          const passed = reading && playY <= yb - 6;
          return (
            <Glyph
              key={i}
              id="ss"
              shape={s.shape}
              level={s.level}
              x={colX(s.col) - 20}
              y={yb}
              w={40}
              h={h}
              shade={shade}
              gold={passed}
              glow={passed ? 12 : 4}
            />
          );
        })}
        {/* hold signs in the gaps between movements */}
        {[
          [110, 130],
          [148, 190],
        ].map(([a], i) =>
          frame >= a + 4
            ? [-1, 1].map((c) => (
                <circle
                  key={`o${i}${c}`}
                  cx={colX(c)}
                  cy={yAt(a) - 16}
                  r={7}
                  fill="none"
                  stroke={COLOR.white}
                  strokeWidth={2.5}
                />
              ))
            : null,
        )}

        {/* duration comparison for rule 04 */}
        {(() => {
          const o = interpolate(
            frame,
            [270, 282, 334, 344],
            [0, 1, 1, 0],
            clamp,
          );
          if (o <= 0) return null;
          const br = (y0: number, y1: number, label: string) => (
            <g opacity={o}>
              <path
                d={`M ${CX + 290} ${y0} h 14 V ${y1} h -14`}
                fill="none"
                stroke={COLOR.gold}
                strokeWidth={2.5}
              />
              <text
                x={CX + 320}
                y={(y0 + y1) / 2 + 7}
                fill={COLOR.gold}
                style={{ ...TYPE.label, fontSize: 22, letterSpacing: "0.16em" }}
              >
                {label}
              </text>
            </g>
          );
          return (
            <>
              {br(yAt(40) - 4, yAt(110) + 4, "SLOW")}
              {br(yAt(130) - 4, yAt(148) + 4, "QUICK")}
              {br(yAt(190) - 4, yAt(260) + 4, "SLOW")}
            </>
          );
        })()}

        {/* reading playhead */}
        {reading && frame <= READ1 + 6 ? (
          <line
            x1={CX - 300}
            x2={CX + 300}
            y1={playY}
            y2={playY}
            stroke={COLOR.gold}
            strokeWidth={2.5}
            style={{ filter: "drop-shadow(0 0 10px rgba(232,194,122,1))" }}
          />
        ) : null}
      </svg>

      {/* the four rules, stacking in as each one is shown */}
      <div
        style={{ position: "absolute", left: 90, top: 80, opacity: rulesOut }}
      >
        {RULES.map((r) => {
          const t = interpolate(frame, [r.at, r.at + 14], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.back(1.3)),
          });
          if (t <= 0) return null;
          return (
            <div
              key={r.k}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                marginBottom: 18,
                opacity: Math.min(1, t * 1.4),
                translate: `${(1 - t) * -60}px 0px`,
                padding: "12px 22px",
                background: "rgba(13,7,16,0.7)",
                border: `1px solid ${COLOR.gold}44`,
                borderLeft: `4px solid ${COLOR.gold}`,
                width: 540,
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  ...TYPE.label,
                  fontSize: 18,
                  color: COLOR.gold,
                  letterSpacing: "0.2em",
                }}
              >
                {r.k}
              </span>
              <span
                style={{
                  ...TYPE.heavy,
                  fontSize: 40,
                  color: COLOR.white,
                  textTransform: "uppercase",
                }}
              >
                {r.a}
              </span>
              <span style={{ ...TYPE.thin, fontSize: 34, color: COLOR.gold }}>
                = {r.b}
              </span>
            </div>
          );
        })}
      </div>

      {/* read → reconstruct */}
      <HeroWord
        text="Read"
        look="heavy"
        size={110}
        x={110}
        y={930}
        align="left"
        start={READ0 - 2}
        end={388}
      />
      <HeroWord
        text="Reconstruct"
        look="heavy"
        size={110}
        x={110}
        y={930}
        align="left"
        start={390}
      />
    </AbsoluteFill>
  );
};
