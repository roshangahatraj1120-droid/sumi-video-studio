import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  interpolateColors,
  random,
  useCurrentFrame,
} from "remotion";
import { CORAL, GOLD, IVORY, serif } from "./theme";

// ---------- Figure rig ----------
// All angles are absolute, in degrees: 0 points down, 90 right, 180 up, -90 left.
type Pose = {
  x: number;
  y: number;
  spine: number;
  lUA: number;
  lFA: number;
  rUA: number;
  rFA: number;
  lTh: number;
  lSh: number;
  rTh: number;
  rSh: number;
};

const BASE_X = 1060;
const GROUND_Y = 880;
const LEG = 215; // pelvis height when standing
const TORSO = 150;
const NECK = 42;
const UPPER_ARM = 88;
const FOREARM = 84;
const THIGH = 110;
const SHIN = 105;
const HEAD_R = 26;

const STAND: Pose = {
  x: 0,
  y: 0,
  spine: 180,
  lUA: -15,
  lFA: 20,
  rUA: 15,
  rFA: -20,
  lTh: -5,
  lSh: -3,
  rTh: 5,
  rSh: 3,
};
const CROUCH: Pose = {
  x: 20,
  y: 50,
  spine: 165,
  lUA: -40,
  lFA: -50,
  rUA: -30,
  rFA: -40,
  lTh: 50,
  lSh: -20,
  rTh: 45,
  rSh: -25,
};
const JUMP: Pose = {
  x: 170,
  y: -190,
  spine: 175,
  lUA: -150,
  lFA: -160,
  rUA: 140,
  rFA: 130,
  lTh: -95,
  lSh: -100,
  rTh: 95,
  rSh: 90,
};
const LAND: Pose = { ...CROUCH, x: 300 };
const TURN: Pose = {
  x: 320,
  y: -8,
  spine: 180,
  lUA: -155,
  lFA: 105,
  rUA: 155,
  rFA: -105,
  lTh: 0,
  lSh: 0,
  rTh: 80,
  rSh: -50,
};
const REACH: Pose = {
  x: 360,
  y: -5,
  spine: 160,
  lUA: -100,
  lFA: -95,
  rUA: 115,
  rFA: 105,
  lTh: 0,
  lSh: 0,
  rTh: -100,
  rSh: -105,
};
const REACH_FAR: Pose = {
  x: 390,
  y: -5,
  spine: 150,
  lUA: -105,
  lFA: -100,
  rUA: 108,
  rFA: 100,
  lTh: 2,
  lSh: 0,
  rTh: -110,
  rSh: -112,
};
const FALL: Pose = {
  x: 330,
  y: 190,
  spine: 95,
  lUA: 75,
  lFA: 110,
  rUA: 100,
  rFA: 95,
  lTh: -80,
  lSh: -100,
  rTh: -85,
  rSh: -130,
};

const inOut = Easing.inOut(Easing.cubic);
const KEYS: { f: number; pose: Pose; ease: (t: number) => number }[] = [
  { f: 0, pose: STAND, ease: inOut },
  { f: 12, pose: CROUCH, ease: inOut },
  { f: 24, pose: JUMP, ease: Easing.out(Easing.cubic) },
  { f: 37, pose: LAND, ease: Easing.in(Easing.quad) },
  { f: 48, pose: TURN, ease: inOut },
  { f: 72, pose: TURN, ease: inOut },
  { f: 88, pose: REACH, ease: inOut },
  { f: 108, pose: REACH_FAR, ease: inOut },
  { f: 128, pose: FALL, ease: Easing.bezier(0.5, 0, 0.75, 0.3) },
];

const poseAt = (f: number): Pose => {
  if (f <= KEYS[0].f) return KEYS[0].pose;
  for (let i = 1; i < KEYS.length; i++) {
    const a = KEYS[i - 1];
    const b = KEYS[i];
    if (f <= b.f) {
      const t = b.ease((f - a.f) / (b.f - a.f));
      const out = {} as Pose;
      (Object.keys(a.pose) as (keyof Pose)[]).forEach((k) => {
        out[k] = a.pose[k] + (b.pose[k] - a.pose[k]) * t;
      });
      return out;
    }
  }
  return KEYS[KEYS.length - 1].pose;
};

// Two full pirouettes, read as a horizontal flip of the figure
const spinAt = (f: number) =>
  Math.cos(
    interpolate(f, [48, 72], [0, Math.PI * 4], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: inOut,
    }),
  );

type Pt = [number, number];
const dir = (deg: number): Pt => [
  Math.sin((deg * Math.PI) / 180),
  Math.cos((deg * Math.PI) / 180),
];

const jointsAt = (f: number) => {
  const p = poseAt(f);
  const sx = spinAt(f);
  const px = BASE_X + p.x;
  const py = GROUND_Y - LEG + p.y;
  const at = (from: Pt, deg: number, len: number): Pt => {
    const [dx, dy] = dir(deg);
    return [from[0] + dx * len, from[1] + dy * len];
  };
  const pelvis: Pt = [0, 0];
  const neck = at(pelvis, p.spine, TORSO);
  const head = at(neck, p.spine, NECK);
  const lElbow = at(neck, p.lUA, UPPER_ARM);
  const lHand = at(lElbow, p.lFA, FOREARM);
  const rElbow = at(neck, p.rUA, UPPER_ARM);
  const rHand = at(rElbow, p.rFA, FOREARM);
  const lKnee = at(pelvis, p.lTh, THIGH);
  const lFoot = at(lKnee, p.lSh, SHIN);
  const rKnee = at(pelvis, p.rTh, THIGH);
  const rFoot = at(rKnee, p.rSh, SHIN);
  const world = (q: Pt): Pt => [px + q[0] * sx, py + q[1]];
  return {
    pelvis: world(pelvis),
    neck: world(neck),
    head: world(head),
    lElbow: world(lElbow),
    lHand: world(lHand),
    rElbow: world(rElbow),
    rHand: world(rHand),
    lKnee: world(lKnee),
    lFoot: world(lFoot),
    rKnee: world(rKnee),
    rFoot: world(rFoot),
  };
};

type Joints = ReturnType<typeof jointsAt>;
type JointName = keyof Joints;
const BONES: [JointName, JointName, number][] = [
  ["pelvis", "neck", 22],
  ["neck", "lElbow", 14],
  ["lElbow", "lHand", 12],
  ["neck", "rElbow", 14],
  ["rElbow", "rHand", 12],
  ["pelvis", "lKnee", 17],
  ["lKnee", "lFoot", 14],
  ["pelvis", "rKnee", 17],
  ["rKnee", "rFoot", 14],
];

const Figure: React.FC<{
  j: Joints;
  color: string;
  opacity: number;
  thin?: number;
}> = ({ j, color, opacity, thin = 1 }) => (
  <g opacity={opacity}>
    {BONES.map(([a, b, w]) => (
      <line
        key={`${a}-${b}`}
        x1={j[a][0]}
        y1={j[a][1]}
        x2={j[b][0]}
        y2={j[b][1]}
        stroke={color}
        strokeWidth={w * thin}
        strokeLinecap="round"
      />
    ))}
    <circle cx={j.head[0]} cy={j.head[1]} r={HEAD_R * thin} fill={color} />
  </g>
);

// ---------- Timing (scene-local frames) ----------
const TRAILS_FADE: [number, number] = [132, 176];
const DISSOLVE_AT = 214;

const TRACKS: { joint: JointName; color: string; width: number }[] = [
  { joint: "rHand", color: CORAL, width: 7 },
  { joint: "lHand", color: CORAL, width: 5 },
  { joint: "rFoot", color: GOLD, width: 5 },
  { joint: "head", color: GOLD, width: 3 },
];
const TRACK_LENGTH = 36;

// Points sampled along the resting figure; they drift away when the movement is gone
const PARTICLES = (() => {
  const j = jointsAt(KEYS[KEYS.length - 1].f);
  const pts: { x: number; y: number }[] = [];
  BONES.forEach(([a, b]) => {
    for (let s = 0; s <= 12; s++) {
      const t = s / 12;
      pts.push({
        x: j[a][0] + (j[b][0] - j[a][0]) * t,
        y: j[a][1] + (j[b][1] - j[a][1]) * t,
      });
    }
  });
  for (let s = 0; s < 18; s++) {
    const a = (s / 18) * Math.PI * 2;
    pts.push({
      x: j.head[0] + Math.cos(a) * HEAD_R,
      y: j.head[1] + Math.sin(a) * HEAD_R,
    });
  }
  return pts.map((pt, i) => ({
    ...pt,
    vx: (random(`vx${i}`) - 0.5) * 3.2,
    vy: -(0.6 + random(`vy${i}`) * 2.6),
    delay: random(`d${i}`) * 22,
    life: 34 + random(`l${i}`) * 26,
    r: 2.5 + random(`r${i}`) * 3.5,
    gold: random(`c${i}`) > 0.6,
  }));
})();

const WORDS = [
  { text: "jumps,", at: 16 },
  { text: "turns,", at: 44 },
  { text: "reaches,", at: 78 },
  { text: "falls —", at: 110 },
];
const MOMENT_WORDS = "and the moment the body stops moving,".split(" ");
const GONE = "the movement is gone.".split("");

// "A dancer jumps, turns, reaches, falls — and the moment the body stops moving, the movement is gone."
export const DancerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const j = jointsAt(frame);

  const trails = interpolate(frame, TRAILS_FADE, [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bodyOpacity = interpolate(
    frame,
    [0, 10, DISSOLVE_AT, DISSOLVE_AT + 10],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const lift = Math.max(0, GROUND_Y - LEG - j.pelvis[1]);

  return (
    <AbsoluteFill
      name="Dancer"
      style={{ backgroundColor: "#0B0A0F", fontFamily: serif }}
    >
      {/* Spotlight following the dancer */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 520px 760px at ${j.pelvis[0]}px 640px, rgba(242,235,221,0.10), rgba(242,235,221,0) 70%)`,
          opacity: bodyOpacity,
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="floor" x1="0" x2="1">
            <stop offset="0" stopColor={IVORY} stopOpacity={0} />
            <stop offset="0.5" stopColor={IVORY} stopOpacity={0.35} />
            <stop offset="1" stopColor={IVORY} stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect
          x={760}
          y={GROUND_Y + 1}
          width={1160}
          height={2}
          fill="url(#floor)"
          opacity={interpolate(
            frame,
            [0, 20, DISSOLVE_AT, DISSOLVE_AT + 40],
            [0, 1, 1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          )}
        />
        <ellipse
          cx={j.pelvis[0] + 40}
          cy={GROUND_Y + 4}
          rx={150 - Math.min(90, lift * 0.4)}
          ry={10}
          fill="#000"
          opacity={0.6 * bodyOpacity}
        />

        {/* Ribbon trails traced by hands, foot and head */}
        <g
          style={{ filter: `drop-shadow(0 0 10px ${CORAL})` }}
          opacity={trails}
        >
          {TRACKS.map(({ joint, color, width }) => {
            const segs: React.ReactNode[] = [];
            for (let k = 0; k < TRACK_LENGTH; k++) {
              const f0 = frame - k;
              const f1 = frame - k - 1;
              if (f1 < 0) break;
              const a = jointsAt(f0)[joint];
              const b = jointsAt(f1)[joint];
              const fade = 1 - k / TRACK_LENGTH;
              segs.push(
                <line
                  key={k}
                  x1={a[0]}
                  y1={a[1]}
                  x2={b[0]}
                  y2={b[1]}
                  stroke={color}
                  strokeWidth={width * fade + 0.5}
                  strokeLinecap="round"
                  opacity={fade * 0.9}
                />,
              );
            }
            return <g key={joint}>{segs}</g>;
          })}
        </g>

        {/* Ghost echoes of earlier poses */}
        <g opacity={trails}>
          {[10, 8, 6, 4, 2].map((k) =>
            frame - k * 1.6 >= 0 ? (
              <Figure
                key={k}
                j={jointsAt(frame - k * 1.6)}
                color={CORAL}
                opacity={0.42 * Math.pow(1 - k / 11, 1.4)}
                thin={0.85}
              />
            ) : null,
          )}
        </g>

        <Figure j={j} color={IVORY} opacity={bodyOpacity} />

        {frame >= DISSOLVE_AT
          ? PARTICLES.map((pt, i) => {
              const t = Math.max(0, frame - DISSOLVE_AT - pt.delay);
              const opacity = interpolate(t, [0, pt.life], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              if (opacity <= 0) return null;
              return (
                <circle
                  key={i}
                  cx={pt.x + pt.vx * t + Math.sin(t / 7 + i) * 6}
                  cy={pt.y + pt.vy * t - 0.02 * t * t}
                  r={pt.r * (1 - t / (pt.life * 1.6))}
                  fill={pt.gold ? GOLD : IVORY}
                  opacity={opacity}
                />
              );
            })
          : null}
      </svg>

      {/* Verb column */}
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 230,
          opacity: interpolate(frame, [146, 162], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: `${interpolate(frame, [146, 162], [0, -60], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.cubic),
          })}px 0px`,
        }}
      >
        <Interactive.Div
          name="A dancer"
          style={{
            fontSize: 56,
            color: "#8C8794",
            letterSpacing: "0.04em",
            marginBottom: 6,
            opacity: interpolate(frame, [0, 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          A dancer
        </Interactive.Div>
        {WORDS.map((w, i) => {
          const next = WORDS[i + 1]?.at ?? 150;
          return (
            <div
              key={w.text}
              style={{
                fontSize: 124,
                lineHeight: 1.08,
                fontStyle: "italic",
                color: interpolateColors(
                  frame,
                  [next, next + 8],
                  [CORAL, "#5E5A66"],
                ),
                opacity: interpolate(frame, [w.at, w.at + 8], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                translate: `${interpolate(frame, [w.at, w.at + 14], [-50, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                })}px 0px`,
              }}
            >
              {w.text}
            </div>
          );
        })}
      </div>

      {/* "and the moment the body stops moving," */}
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 300,
          width: 920,
          fontSize: 76,
          lineHeight: 1.25,
          color: "#F2EBDD",
          display: "flex",
          flexWrap: "wrap",
          columnGap: "0.28em",
          opacity: interpolate(frame, [244, 266], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {MOMENT_WORDS.map((word, i) => {
          const at = 160 + i * 4;
          return (
            <span
              key={i}
              style={{
                opacity: interpolate(frame, [at, at + 10], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                translate: `0px ${interpolate(frame, [at, at + 14], [24, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                })}px`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* "the movement is gone." — letters evaporate after the figure does */}
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 540,
          fontSize: 132,
          fontStyle: "italic",
          color: "#D4A55A",
          whiteSpace: "pre",
          opacity: interpolate(frame, [198, 212], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {GONE.map((ch, i) => {
          const at = 240 + i * 1.3;
          const t = interpolate(frame, [at, at + 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.quad),
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: 1 - t,
                filter: `blur(${t * 10}px)`,
                translate: `0px ${-t * 40}px`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
