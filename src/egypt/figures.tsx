import React from "react";
import { C } from "./theme";

// ---------- Pose rig ----------
// Angles are absolute degrees: 0 points down, 90 forward (the way the figure faces), 180 up.
export type Pose = {
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
type Pt = [number, number];

export const dir = (deg: number): Pt => [
  Math.sin((deg * Math.PI) / 180),
  Math.cos((deg * Math.PI) / 180),
];
const add = (a: Pt, b: Pt, k = 1): Pt => [a[0] + b[0] * k, a[1] + b[1] * k];
const lerp = (a: Pt, b: Pt, t: number): Pt => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];
const pts = (...p: Pt[]) =>
  p.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");

export const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const out = {} as Pose;
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => {
    out[k] = a[k] + (b[k] - a[k]) * t;
  });
  return out;
};

// Smoothly cycles through poses; `speed` is cycles per frame
export const cyclePose = (
  poses: Pose[],
  frame: number,
  speed: number,
  phase = 0,
): Pose => {
  const t = (frame * speed + phase) % poses.length;
  const i = Math.floor(t);
  const f = t - i;
  const e = f * f * (3 - 2 * f);
  return lerpPose(poses[i], poses[(i + 1) % poses.length], e);
};

const THIGH = 70;
const SHIN = 68;
const TORSO = 84;
const UA = 50;
const FA = 46;
const LEG = THIGH + SHIN;

const base = { x: 0, y: 0 };
export const POSES = {
  armsUp: {
    ...base,
    spine: 180,
    lUA: -158,
    lFA: -172,
    rUA: 158,
    rFA: 172,
    lTh: -3,
    lSh: -3,
    rTh: 4,
    rSh: 3,
  },
  kick: {
    ...base,
    spine: 174,
    lUA: -120,
    lFA: -150,
    rUA: 128,
    rFA: 150,
    lTh: -4,
    lSh: -4,
    rTh: 112,
    rSh: 100,
  },
  backbend: {
    ...base,
    y: 6,
    spine: 228,
    lUA: -118,
    lFA: -104,
    rUA: -100,
    rFA: -88,
    lTh: 8,
    lSh: 0,
    rTh: 36,
    rSh: 6,
  },
  clap: {
    ...base,
    y: 4,
    spine: 176,
    lUA: 96,
    lFA: 140,
    rUA: 112,
    rFA: 150,
    lTh: -10,
    lSh: 4,
    rTh: 14,
    rSh: -4,
  },
  sway: {
    ...base,
    spine: 184,
    lUA: -150,
    lFA: 170,
    rUA: 70,
    rFA: 120,
    lTh: -8,
    lSh: -2,
    rTh: 10,
    rSh: 2,
  },
  walkRaise: {
    ...base,
    spine: 178,
    lUA: 40,
    lFA: 20,
    rUA: 120,
    rFA: 150,
    lTh: -14,
    lSh: -10,
    rTh: 16,
    rSh: 6,
  },
  walkRaise2: {
    ...base,
    spine: 178,
    lUA: 30,
    lFA: 10,
    rUA: 128,
    rFA: 160,
    lTh: 14,
    lSh: 6,
    rTh: -14,
    rSh: -10,
  },
  seated: {
    ...base,
    y: LEG - SHIN,
    spine: 180,
    lUA: 12,
    lFA: 70,
    rUA: 34,
    rFA: 104,
    lTh: 90,
    lSh: 2,
    rTh: 92,
    rSh: 0,
  },
  kneelPlay: {
    ...base,
    y: LEG - THIGH,
    spine: 178,
    lUA: 58,
    lFA: 92,
    rUA: 74,
    rFA: 64,
    lTh: 0,
    lSh: -90,
    rTh: 90,
    rSh: 0,
  },
} satisfies Record<string, Pose>;

// ---------- Profile head (faces +x), ~100 units tall ----------
export const HEAD = {
  face: "M 6 -46 C 26 -44 38 -32 39 -18 L 41 -8 L 50 8 L 49 11 L 41 13 L 43 19 L 39 22 L 42 27 L 38 31 L 34 36 C 28 41 16 44 4 44 L -18 44 L -24 10 C -26 -20 -14 -44 6 -46 Z",
  wig: "M 30 -40 C 14 -57 -24 -57 -40 -30 C -50 -10 -48 30 -46 72 L -12 76 L -10 44 C 0 40 6 30 8 18 C 10 6 14 -6 22 -14 C 28 -22 34 -30 30 -40 Z",
  eye: "M 18 -6 Q 26 -12 34 -6 Q 26 -2 18 -6 Z",
  kohl: "M 18 -6 L 7 -3",
  brow: "M 16 -14 Q 26 -19 36 -14",
  band: "M -42 -27 Q -6 -39 31 -37",
};

export const Head: React.FC<{ skin: string; band?: string }> = ({
  skin,
  band = C.turquoise,
}) => (
  <g>
    <path d={HEAD.face} fill={skin} stroke="#2a160c" strokeWidth={2} />
    <path d={HEAD.wig} fill={C.wig} />
    <path
      d={HEAD.band}
      fill="none"
      stroke={band}
      strokeWidth={5}
      strokeLinecap="round"
    />
    <path d={HEAD.eye} fill={C.linen} />
    <circle cx={28} cy={-6} r={2.8} fill="#000" />
    <path d={HEAD.kohl} stroke="#000" strokeWidth={2.4} strokeLinecap="round" />
    <path
      d={HEAD.brow}
      fill="none"
      stroke="#000"
      strokeWidth={2.6}
      strokeLinecap="round"
    />
  </g>
);

// ---------- Props ----------
export const Sistrum: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <line
      x1={0}
      y1={0}
      x2={0}
      y2={-26}
      stroke={C.gold}
      strokeWidth={4}
      strokeLinecap="round"
    />
    <path
      d="M -11 -26 C -16 -56 16 -56 11 -26"
      fill="none"
      stroke={C.gold}
      strokeWidth={3.5}
    />
    {[-33, -40, -47].map((y) => (
      <g key={y}>
        <line
          x1={-15}
          y1={y}
          x2={15}
          y2={y}
          stroke={C.goldDeep}
          strokeWidth={1.6}
        />
        <circle cx={-6} cy={y} r={2} fill={C.gold} />
        <circle cx={6} cy={y} r={2} fill={C.gold} />
      </g>
    ))}
  </g>
);

// Hand-shaped clapper, pivot at the forearm end, fingers toward +x, ~440 units long
export const CLAPPER_PATH =
  "M 0 -30 C 120 -30 230 -26 292 -24 C 316 -27 338 -31 362 -31 C 398 -31 424 -27 438 -17 C 447 -9 447 6 437 12 C 412 20 382 23 352 23 C 338 33 318 38 306 30 C 300 26 296 24 290 24 C 220 26 110 30 0 31 C -10 18 -10 -18 0 -30 Z";

export const Clapper: React.FC<{ id: string; detail?: boolean }> = ({
  id,
  detail = true,
}) => (
  <g>
    <defs>
      <linearGradient id={`ivory-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FBF3E1" />
        <stop offset="0.45" stopColor="#EADBB8" />
        <stop offset="1" stopColor="#B99A6A" />
      </linearGradient>
    </defs>
    <path
      d={CLAPPER_PATH}
      fill={`url(#ivory-${id})`}
      stroke="#6f5636"
      strokeWidth={2.5}
    />
    {detail ? (
      <g>
        {[
          "M 364 -14 C 390 -15 414 -13 434 -7",
          "M 364 -1 C 392 -1 418 0 440 2",
          "M 360 12 C 388 13 410 13 428 11",
        ].map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="#8a6c45"
            strokeWidth={2}
            strokeOpacity={0.7}
          />
        ))}
        <path
          d="M 278 -25 L 278 25 M 266 -26 L 266 26"
          stroke={C.gold}
          strokeWidth={5}
        />
        <path
          d="M 120 -12 C 160 -6 190 -14 230 -8"
          stroke="#8a6c45"
          strokeOpacity={0.35}
          strokeWidth={1.5}
          fill="none"
        />
        <path
          d="M 60 8 C 90 12 120 6 150 12"
          stroke="#8a6c45"
          strokeOpacity={0.3}
          strokeWidth={1.2}
          fill="none"
        />
        <circle cx={20} cy={0} r={7} fill="#3a2a18" />
        <circle cx={330} cy={-12} r={3} fill="#8a6c45" opacity={0.35} />
      </g>
    ) : null}
  </g>
);

// Arched harp; base at (0,0), ~320 units tall
export const Harp: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const bow = (t: number): Pt => {
    // cubic from (0,0) to (-40,-320)
    const p0: Pt = [0, 0],
      p1: Pt = [38, -70],
      p2: Pt = [34, -230],
      p3: Pt = [-40, -320];
    const u = 1 - t;
    return [
      u * u * u * p0[0] +
        3 * u * u * t * p1[0] +
        3 * u * t * t * p2[0] +
        t * t * t * p3[0],
      u * u * u * p0[1] +
        3 * u * u * t * p1[1] +
        3 * u * t * t * p2[1] +
        t * t * t * p3[1],
    ];
  };
  return (
    <g transform={`scale(${s})`}>
      {Array.from({ length: 9 }).map((_, i) => {
        const a = bow(0.22 + i * 0.085);
        return (
          <line
            key={i}
            x1={a[0]}
            y1={a[1]}
            x2={-70 + i * 4}
            y2={-20 - i * 2}
            stroke={C.gold}
            strokeWidth={1.4}
            strokeOpacity={0.85}
          />
        );
      })}
      <path
        d="M -96 -6 C -70 22 30 18 30 -6 C 10 -2 -60 -2 -96 -6 Z"
        fill="#6b3d1f"
        stroke="#2a160c"
        strokeWidth={2}
      />
      <path
        d="M 0 0 C 38 -70 34 -230 -40 -320"
        fill="none"
        stroke="#2a160c"
        strokeWidth={20}
        strokeLinecap="round"
      />
      <path
        d="M 0 0 C 38 -70 34 -230 -40 -320"
        fill="none"
        stroke="#8a5229"
        strokeWidth={15}
        strokeLinecap="round"
      />
      <path
        d="M 4 -40 C 26 -100 24 -200 -30 -296"
        fill="none"
        stroke={C.gold}
        strokeWidth={2.5}
        strokeOpacity={0.7}
      />
      <circle
        cx={-42}
        cy={-322}
        r={11}
        fill={C.gold}
        stroke="#2a160c"
        strokeWidth={2}
      />
    </g>
  );
};

const LotusFlower: React.FC<{
  x: number;
  y: number;
  r: number;
  s?: number;
}> = ({ x, y, r, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path
      d="M 0 0 L -16 -30 L -7 -22 L 0 -38 L 7 -22 L 16 -30 Z"
      fill={C.lapis}
      stroke="#0e1a36"
      strokeWidth={1.5}
    />
    <path
      d="M 0 0 L -7 -22 M 0 0 L 0 -38 M 0 0 L 7 -22"
      stroke={C.turquoise}
      strokeWidth={1.5}
    />
    <path
      d="M -6 0 C -3 4 3 4 6 0"
      stroke={C.ochre}
      strokeWidth={3}
      fill="none"
    />
  </g>
);

// Jar with blue lotus bouquet; base at (0,0), ~300 units tall
export const LotusJar: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    {[
      ["M 0 -150 C -10 -200 -40 -240 -70 -268", -70, -268, -40],
      ["M 0 -150 C 0 -210 4 -250 6 -300", 6, -300, 0],
      ["M 0 -150 C 10 -200 40 -236 74 -258", 74, -258, 38],
    ].map(([d, x, y, r]) => (
      <g key={String(d)}>
        <path d={String(d)} fill="none" stroke="#3f7a3a" strokeWidth={4} />
        <LotusFlower x={Number(x)} y={Number(y)} r={Number(r)} s={1.5} />
      </g>
    ))}
    <path
      d="M -34 -150 L 34 -150 L 30 -136 C 70 -110 74 -50 40 -14 L 30 0 L -30 0 L -40 -14 C -74 -50 -70 -110 -30 -136 Z"
      fill="#b4532a"
      stroke="#2a160c"
      strokeWidth={2.5}
    />
    <path
      d="M -58 -96 C -20 -88 20 -88 58 -96"
      stroke={C.gold}
      strokeWidth={4}
      fill="none"
    />
    <path
      d="M -62 -80 C -20 -72 20 -72 62 -80"
      stroke={C.lapis}
      strokeWidth={4}
      fill="none"
    />
    <path
      d="M -58 -64 C -20 -56 20 -56 58 -64"
      stroke={C.gold}
      strokeWidth={4}
      fill="none"
    />
  </g>
);

// Temple doorway with cavetto cornice and winged sun disk; base centre at (0,0)
export const Shrine: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect
      x={-90}
      y={-330}
      width={180}
      height={330}
      fill="#c8a06b"
      stroke="#2a160c"
      strokeWidth={3}
    />
    <rect x={-52} y={-250} width={104} height={250} fill="#2a1a10" />
    <path
      d="M -110 -330 L 110 -330 L 100 -370 L -100 -370 Z"
      fill="#d8b47c"
      stroke="#2a160c"
      strokeWidth={3}
    />
    {Array.from({ length: 11 }).map((_, i) => (
      <line
        key={i}
        x1={-95 + i * 19}
        y1={-334}
        x2={-90 + i * 18}
        y2={-366}
        stroke={i % 2 ? C.lapis : C.ochre}
        strokeWidth={6}
      />
    ))}
    <g transform="translate(0 -292)">
      <path
        d="M -14 0 C -50 -14 -80 -6 -86 4 C -60 2 -36 8 -14 8 Z"
        fill={C.lapis}
        stroke="#0e1a36"
        strokeWidth={1.5}
      />
      <path
        d="M 14 0 C 50 -14 80 -6 86 4 C 60 2 36 8 14 8 Z"
        fill={C.lapis}
        stroke="#0e1a36"
        strokeWidth={1.5}
      />
      <path
        d="M -16 4 C -46 -4 -68 2 -74 8 M 16 4 C 46 -4 68 2 74 8"
        stroke={C.turquoise}
        strokeWidth={3}
        fill="none"
      />
      <circle r={15} fill="#c4321e" stroke="#2a160c" strokeWidth={1.5} />
    </g>
  </g>
);

export const OfferingTable: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path
      d="M -8 0 L -4 -70 L 4 -70 L 8 0 Z"
      fill="#c8a06b"
      stroke="#2a160c"
      strokeWidth={2}
    />
    <rect
      x={-50}
      y={-78}
      width={100}
      height={8}
      fill="#c8a06b"
      stroke="#2a160c"
      strokeWidth={2}
    />
    <ellipse
      cx={-26}
      cy={-88}
      rx={18}
      ry={10}
      fill="#d99a5b"
      stroke="#2a160c"
      strokeWidth={1.5}
    />
    <ellipse
      cx={4}
      cy={-92}
      rx={16}
      ry={14}
      fill="#c47a3a"
      stroke="#2a160c"
      strokeWidth={1.5}
    />
    <ellipse
      cx={30}
      cy={-88}
      rx={16}
      ry={9}
      fill="#e0b25a"
      stroke="#2a160c"
      strokeWidth={1.5}
    />
    <LotusFlower x={2} y={-104} r={0} s={1.1} />
  </g>
);

export const Chair: React.FC = () => (
  <g stroke="#2a160c" strokeWidth={2}>
    <path d="M -34 -70 L 46 -70 L 46 -62 L -34 -62 Z" fill="#7a4a26" />
    <path
      d="M -30 -62 L -30 0 M 40 -62 L 40 0"
      strokeWidth={5}
      stroke="#5a3418"
    />
    <path
      d="M -34 -70 C -44 -110 -40 -140 -30 -150"
      fill="none"
      strokeWidth={6}
      stroke="#5a3418"
    />
  </g>
);

// ---------- Painted figure ----------
export const EgyptFigure: React.FC<{
  pose: Pose;
  x: number;
  y: number;
  scale?: number;
  facing?: 1 | -1;
  skin?: string;
  holding?: "sistrum" | "clappers" | "lotus" | null;
  band?: string;
  skirtLong?: boolean;
}> = ({
  pose,
  x,
  y,
  scale = 1,
  facing = 1,
  skin = C.ochreLight,
  holding = null,
  band,
  skirtLong = false,
}) => {
  const P: Pt = [pose.x, -LEG + pose.y];
  const sd = dir(pose.spine);
  const perp: Pt = [-sd[1], sd[0]];
  const N = add(P, sd, TORSO);
  const Hc = add(N, sd, 30);
  const Sf = add(N, perp, 19);
  const Sb = add(N, perp, -19);
  const bElbow = add(Sb, dir(pose.lUA), UA);
  const bHand = add(bElbow, dir(pose.lFA), FA);
  const fElbow = add(Sf, dir(pose.rUA), UA);
  const fHand = add(fElbow, dir(pose.rFA), FA);
  const Hf = add(P, perp, 7);
  const Hb = add(P, perp, -7);
  const bKnee = add(Hb, dir(pose.lTh), THIGH);
  const bAnkle = add(bKnee, dir(pose.lSh), SHIN);
  const fKnee = add(Hf, dir(pose.rTh), THIGH);
  const fAnkle = add(fKnee, dir(pose.rSh), SHIN);
  const foot = (ankle: Pt, sh: number): Pt => {
    const s = dir(sh);
    return add(ankle, [s[1], -s[0]], 18);
  };
  const Wf = add(add(P, perp, 12), sd, 16);
  const Wb = add(add(P, perp, -12), sd, 16);
  const bust = add(add(N, sd, -30), perp, 22);

  // Outlines first, then fills, so joints merge into one painted shape
  const limbs = (segs: [Pt, Pt, number][]) => (
    <>
      {segs.map(([a, b, w], i) => (
        <line
          key={`o${i}`}
          x1={a[0]}
          y1={a[1]}
          x2={b[0]}
          y2={b[1]}
          stroke="#2a160c"
          strokeWidth={w + 3}
          strokeLinecap="round"
        />
      ))}
      {segs.map(([a, b, w], i) => (
        <line
          key={`f${i}`}
          x1={a[0]}
          y1={a[1]}
          x2={b[0]}
          y2={b[1]}
          stroke={skin}
          strokeWidth={w}
          strokeLinecap="round"
        />
      ))}
    </>
  );
  const skirtT = skirtLong ? 1.05 : 0.72;
  const skirt = pts(
    add(add(P, perp, -16), sd, 10),
    add(add(P, perp, 16), sd, 10),
    add(lerp(Hf, skirtLong ? fAnkle : fKnee, skirtT), perp, 8),
    add(lerp(Hb, skirtLong ? bAnkle : bKnee, skirtT), perp, -8),
  );
  const headTilt = (pose.spine - 180) * 0.45;

  return (
    <g transform={`translate(${x} ${y}) scale(${facing * scale} ${scale})`}>
      {limbs([
        [Sb, bElbow, 11],
        [bElbow, bHand, 10],
        [Hb, bKnee, 14],
        [bKnee, bAnkle, 12],
        [bAnkle, foot(bAnkle, pose.lSh), 6],
      ])}
      <polygon
        points={pts(Sb, Sf, bust, Wf, Wb)}
        fill={skin}
        stroke="#2a160c"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {limbs([
        [Hf, fKnee, 14],
        [fKnee, fAnkle, 12],
        [fAnkle, foot(fAnkle, pose.rSh), 6],
      ])}
      <polygon
        points={skirt}
        fill={C.linen}
        fillOpacity={0.88}
        stroke="#2a160c"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d={`M ${pts(Sb)} Q ${pts(add(N, sd, -46))} ${pts(Sf)}`}
        fill="none"
        stroke={C.turquoise}
        strokeWidth={10}
      />
      <path
        d={`M ${pts(Sb)} Q ${pts(add(N, sd, -38))} ${pts(Sf)}`}
        fill="none"
        stroke={C.gold}
        strokeWidth={3}
      />
      {limbs([
        [Sf, fElbow, 11],
        [fElbow, fHand, 10],
      ])}
      {holding === "sistrum" ? (
        <g
          transform={`translate(${fHand[0]} ${fHand[1]}) rotate(${180 - pose.rFA})`}
        >
          <Sistrum s={1.1} />
        </g>
      ) : null}
      {holding === "clappers" ? (
        <>
          {[
            [fHand, pose.rFA],
            [bHand, pose.lFA],
          ].map(([h, a], i) => (
            <g
              key={i}
              transform={`translate(${(h as Pt)[0]} ${(h as Pt)[1]}) rotate(${90 - (a as number)}) scale(0.1)`}
            >
              <Clapper id={`mini-${i}`} detail={false} />
            </g>
          ))}
        </>
      ) : null}
      {holding === "lotus" ? (
        <LotusFlower x={fHand[0]} y={fHand[1] - 4} r={20} s={0.9} />
      ) : null}
      <g
        transform={`translate(${Hc[0]} ${Hc[1]}) rotate(${headTilt}) scale(0.42)`}
      >
        <Head skin={skin} band={band} />
      </g>
    </g>
  );
};

// ---------- Goddess heads (line art, large) ----------
// Both face +x and sit around (0,0); draw progress 0..1 animates the strokes.
const stroke = (draw: number, w = 4) => ({
  stroke: C.gold,
  strokeWidth: w,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1 - draw,
});
const line = (draw: number, w = 4) => ({ ...stroke(draw, w), fill: "none" });

export const GoddessFace: React.FC<{ draw: number; fill: number }> = ({
  draw,
  fill,
}) => (
  <g>
    <path
      d={HEAD.face}
      fill={C.lapisDeep}
      fillOpacity={0.8 * fill}
      {...stroke(draw, 1.6)}
    />
    <path
      d={HEAD.wig}
      fill={C.lapis}
      fillOpacity={0.9 * fill}
      {...stroke(draw, 1.6)}
    />
    {[-30, -16, -2, 12, 26, 40, 54].map((y) => (
      <path
        key={y}
        d={`M -44 ${y} C -30 ${y + 3} -16 ${y + 3} -4 ${y}`}
        {...line(draw, 0.9)}
        opacity={0.7}
      />
    ))}
    <path
      d={HEAD.eye}
      fill={C.ivory}
      fillOpacity={fill}
      {...stroke(draw, 1.4)}
    />
    <circle cx={28} cy={-6} r={2.6} fill={C.gold} opacity={fill} />
    <path d={HEAD.kohl} {...line(draw, 1.8)} />
    <path d={HEAD.brow} {...line(draw, 1.8)} />
    <path
      d="M -2 52 C 10 60 30 62 44 58 M -6 60 C 8 70 30 72 48 68"
      {...line(draw, 1.4)}
    />
  </g>
);

export const Hathor: React.FC<{ draw: number; fill: number; glow: number }> = ({
  draw,
  fill,
  glow,
}) => (
  <g>
    <circle
      cx={-2}
      cy={-108}
      r={44}
      fill="#d2462b"
      fillOpacity={fill}
      style={{ filter: `drop-shadow(0 0 ${8 + glow * 18}px #ff9a4a)` }}
      {...stroke(draw, 1.8)}
    />
    <path d="M -46 -58 C -88 -82 -82 -150 -40 -172" {...line(draw, 2.4)} />
    <path d="M 42 -58 C 84 -82 78 -150 36 -172" {...line(draw, 2.4)} />
    <path
      d="M -24 -60 L 22 -60 L 18 -48 L -20 -48 Z"
      fill={C.goldDeep}
      fillOpacity={fill}
      {...stroke(draw, 1.4)}
    />
    {/* uraeus at the brow */}
    <path
      d="M 30 -40 C 40 -50 44 -40 38 -34 C 44 -30 40 -24 34 -28"
      {...line(draw, 1.4)}
    />
    <GoddessFace draw={draw} fill={fill} />
  </g>
);

export const Mut: React.FC<{ draw: number; fill: number; glow: number }> = ({
  draw,
  fill,
  glow,
}) => (
  <g>
    {/* double crown: white crown inside the red crown */}
    <path
      d="M -14 -52 C -18 -100 -10 -150 -2 -178 C 6 -186 14 -182 14 -170 C 18 -140 20 -100 18 -54 Z"
      fill={C.ivory}
      fillOpacity={0.85 * fill}
      style={{
        filter: `drop-shadow(0 0 ${4 + glow * 10}px rgba(255,220,160,0.7))`,
      }}
      {...stroke(draw, 1.8)}
    />
    <path
      d="M -42 -46 L -40 -132 L -22 -132 L -20 -84 L 30 -84 L 34 -46 Z"
      fill="#b3261e"
      fillOpacity={0.9 * fill}
      {...stroke(draw, 1.8)}
    />
    <path
      d="M 10 -84 C 18 -100 34 -104 40 -94 C 46 -84 36 -76 30 -82"
      {...line(draw, 1.6)}
    />
    {/* vulture headdress: wing over the wig, head at the brow */}
    <path
      d="M -38 -34 C -10 -50 20 -46 30 -36 L 22 -28 C 0 -36 -20 -34 -38 -24 Z"
      fill={C.gold}
      fillOpacity={0.6 * fill}
      {...stroke(draw, 1.6)}
    />
    <path
      d="M -40 -22 C -46 10 -44 40 -38 70 M -30 -18 C -34 12 -32 40 -26 70 M -20 -12 C -22 14 -20 40 -16 66"
      {...line(draw, 1.2)}
    />
    <path
      d="M 30 -36 C 40 -42 46 -36 44 -30 L 50 -26 L 42 -26 C 40 -22 34 -24 32 -28"
      {...line(draw, 1.4)}
    />
    <GoddessFace draw={draw} fill={fill} />
  </g>
);
