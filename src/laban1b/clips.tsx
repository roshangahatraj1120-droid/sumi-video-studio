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
import { COLOR, TYPE } from "../brand/tokens";
import { HeroWord } from "../brand/fx";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt } from "../laban/overlays";
import { Plate, Rig } from "../laban3/rig";
import { LightSweep } from "../laban9/fx9";

// Laban — Part 1b: "But this is where the story becomes much stranger. Because the ideas Laban developed
// would eventually move far beyond the dance studio. They would become connected…" Leads into Part 1's
// numbered montage. 30 fps. Photographic throughout: the empty studio breaking up like a failing
// signal, a pull-back that reveals the studio is only a projection in an archive, and an evidence board
// of anonymous object prints joined to one notation page by red thread.
export const LEN1B = { y01: 150, y02: 210, y03: 360 };

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const STUDIO = "laban10/dancer-plate.jpg";
const SHADE =
  "linear-gradient(0deg, rgba(8,5,4,0.85) 0%, rgba(8,5,4,0.45) 20%, rgba(8,5,4,0) 40%)";
const WARM = "sepia(0.1) saturate(1.04) contrast(1.06)";

// ---------- 01: the studio, and the picture starts to fail ----------
const Glitchy: React.FC<{ src: string; amount: number; filter?: string }> = ({
  src,
  amount,
  filter = "",
}) => {
  const frame = useCurrentFrame();
  const base = {
    position: "absolute" as const,
    left: 0,
    top: 0,
    width: 1920,
    height: 1080,
  };
  if (amount <= 0.01)
    return <Img src={staticFile(src)} style={{ ...base, filter }} />;
  const split = 6 + amount * 30;
  const rows = Array.from({ length: 7 }).map((_, i) => {
    const top = random(`gy${Math.floor(frame / 2)}-${i}`) * 100;
    const h = 2 + random(`gh${Math.floor(frame / 2)}-${i}`) * 7;
    const dx = (random(`gx${Math.floor(frame / 2)}-${i}`) - 0.5) * 160 * amount;
    return { top, h, dx };
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", isolation: "isolate" }}>
      <Img
        src={staticFile(src)}
        style={{
          ...base,
          filter: `${filter} url(#chR)`,
          translate: `${split}px 0px`,
          mixBlendMode: "screen",
        }}
      />
      <Img
        src={staticFile(src)}
        style={{
          ...base,
          filter: `${filter} url(#chG)`,
          mixBlendMode: "screen",
        }}
      />
      <Img
        src={staticFile(src)}
        style={{
          ...base,
          filter: `${filter} url(#chB)`,
          translate: `${-split}px 0px`,
          mixBlendMode: "screen",
        }}
      />
      {rows.map((r, i) => (
        <AbsoluteFill
          key={i}
          style={{
            clipPath: `inset(${r.top}% 0 ${Math.max(0, 100 - r.top - r.h)}% 0)`,
            translate: `${r.dx}px 0px`,
          }}
        >
          <Img src={staticFile(src)} style={{ ...base, filter }} />
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};
// bursts of signal failure, each with a short tail
const BURSTS = [
  [52, 6],
  [70, 4],
  [84, 10],
  [128, 8],
];
const burst = (f: number) =>
  BURSTS.reduce(
    (acc, [at, len]) =>
      Math.max(acc, f >= at && f < at + len ? 1 - (f - at) / (len + 2) : 0),
    0,
  );

export const Y01Stranger: React.FC = () => {
  const frame = useCurrentFrame();
  const g = burst(frame);
  const flick = 0.92 + 0.08 * Math.sin(frame * 1.7) * (g > 0 ? 1 : 0.2);
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.04, x: 960, y: 560 },
          { f: 150, s: 1.22, x: 980, y: 520, e: "drift" },
        ]}
      >
        <Glitchy
          src={STUDIO}
          amount={g}
          filter={`${WARM} brightness(${flick})`}
        />
      </Rig>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt
        text="but this is where the story becomes much"
        start={8}
        y={780}
        size={44}
      />
      <HeroWord
        text="Stranger."
        look="heavy"
        size={190}
        color={COLOR.white}
        y={830}
        start={52}
        glitch
      />
      <Sfx name="drone" at={0} volume={0.3} />
      {BURSTS.map(([at]) => (
        <Sfx key={at} name="glitch" at={at} volume={0.4} />
      ))}
      <Sfx name="boom" at={54} volume={0.5} />
    </Finish>
  );
};

// ---------- 02: far beyond the dance studio ----------
// The studio is projected on the screening-room screen; the camera starts filling the screen and
// speed-ramps back out into the archive. The viewer's head stays in front of the projection.
const SCREEN = { x: 1220, y: 6, w: 528, h: 396 };
const SCREEN_CLIP = "polygon(0% 14%, 100% 0%, 100% 100%, 0% 99.2%)";
export const Y02Beyond: React.FC = () => {
  const frame = useCurrentFrame();
  const sCx = SCREEN.x + SCREEN.w / 2;
  const sCy = SCREEN.y + SCREEN.h / 2 + 14;
  const keys = [
    { f: 0, s: 3.62, x: sCx, y: sCy },
    { f: 26, s: 3.5, x: sCx, y: sCy, e: "drift" as const },
    { f: 76, s: 1.0, x: 960, y: 540, e: "ramp" as const },
    { f: 210, s: 1.04, x: 980, y: 530, e: "drift" as const },
  ];
  // the projector look fades in as the screen edges come into view
  const proj = interpolate(frame, [26, 60], [0, 1], clamp);
  return (
    <Finish dust={0.3}>
      <Rig keys={keys} blurScale={0.12}>
        <Plate src="laban1b/room.jpg" filter={WARM} />
        <div
          style={{
            position: "absolute",
            left: SCREEN.x,
            top: SCREEN.y,
            width: SCREEN.w,
            height: SCREEN.h,
            clipPath: SCREEN_CLIP,
          }}
        >
          <Img
            src={staticFile(STUDIO)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: `${WARM} contrast(${1 - 0.18 * proj}) brightness(${1 + 0.12 * proj}) saturate(${1 - 0.35 * proj}) blur(${0.6 * proj}px)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 40% 45%, rgba(255,240,215,0.12), rgba(0,0,0,0.25) 100%)",
              opacity: proj,
            }}
          />
        </div>
        <Plate src="laban1b/room-cut.png" filter={WARM} />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence durationInFrames={74} layout="none">
        <CaptionAt
          text="because the ideas Laban developed would"
          start={6}
          y={880}
          size={44}
        />
      </Sequence>
      <Sequence from={80} layout="none">
        <CaptionAt
          text="eventually move far beyond"
          start={0}
          y={790}
          size={44}
        />
        <HeroWord
          text="the dance studio"
          look="serif"
          size={150}
          y={840}
          start={6}
        />
      </Sequence>
      <Sfx name="drone" at={0} volume={0.25} />
      <Sfx name="riser" at={8} volume={0.3} />
      <Sfx name="whoosh" at={34} volume={0.6} />
      <Sfx name="boom" at={76} volume={0.45} />
      {Array.from({ length: 12 }).map((_, i) => (
        <Sfx key={i} name="tick" at={90 + i * 9} volume={0.1} />
      ))}
    </Finish>
  );
};

// ---------- 03: they would become connected ----------
// A dark cork board under a warm lamp. One notation page in the centre; anonymous object prints are
// pinned around it, and a red thread runs from the centre pin to each one as the camera follows it.
type Print = {
  src: string;
  crop: [number, number, number, number]; // x, y, w, h in the source photo's 1920×1080 space
  x: number;
  y: number;
  w: number;
  rot: number;
  label?: string;
  at?: number; // when the thread reaches it (unthreaded prints are just board clutter)
  grade?: string;
};
const CENTER = { x: 960, y: 520 };
const PAGE_TOP = CENTER.y - 200 - 12 + 14; // pin on the 400px notation page's top border
const PRINTS: Print[] = [
  {
    src: "laban/24.jpg",
    crop: [1260, 40, 640, 620],
    x: 300,
    y: 250,
    w: 250,
    rot: -3,
    label: "Machines",
    at: 222,
  },
  {
    src: "laban6/f02.jpg",
    crop: [610, 380, 420, 300],
    x: 560,
    y: 170,
    w: 270,
    rot: 2.5,
    label: "Factories",
    at: 54,
    grade: "grayscale(0.2)",
  },
  {
    src: "laban8/h04.jpg",
    crop: [60, 580, 560, 500],
    x: 1350,
    y: 190,
    w: 270,
    rot: -2,
    label: "Corporate hiring",
    at: 86,
  },
  {
    src: "laban7/g07.jpg",
    crop: [500, 300, 900, 500],
    x: 1640,
    y: 470,
    w: 290,
    rot: 3,
    label: "Copyright",
    at: 118,
  },
  {
    src: "laban9b/m7.jpg",
    crop: [120, 0, 300, 200],
    x: 1380,
    y: 800,
    w: 270,
    rot: -3.5,
    label: "Therapy",
    at: 150,
  },
  {
    src: "laban9b/m1.jpg",
    crop: [0, 560, 420, 500],
    x: 560,
    y: 830,
    w: 230,
    rot: 2,
    label: "Anthropology",
    at: 186,
  },
  {
    src: "laban8b/d4.jpg",
    crop: [1180, 40, 700, 420],
    x: 250,
    y: 620,
    w: 300,
    rot: -1.5,
    label: "Military analysis",
    at: 254,
    grade: "grayscale(1) contrast(1.2)",
  },
  // clutter
  {
    src: "laban6/f03.jpg",
    crop: [500, 300, 500, 400],
    x: 1700,
    y: 140,
    w: 200,
    rot: 6,
    grade: "grayscale(0.6) brightness(0.8)",
  },
  {
    src: "laban/16.jpg",
    crop: [500, 500, 800, 450],
    x: 980,
    y: 930,
    w: 220,
    rot: -5,
    grade: "grayscale(1) brightness(0.75)",
  },
  {
    src: "laban9b/m3.jpg",
    crop: [1300, 880, 600, 200],
    x: 100,
    y: 960,
    w: 240,
    rot: 4,
    grade: "brightness(0.75)",
  },
];
const BORDER = 12;
const pinOf = (p: Print) => ({
  x: p.x,
  y: p.y - (p.w * (p.crop[3] / p.crop[2])) / 2 - BORDER + 14,
});

const CorkBoard: React.FC = () => (
  <AbsoluteFill>
    <svg
      width={1920}
      height={1080}
      style={{
        position: "absolute",
        left: -60,
        top: -60,
        width: 2040,
        height: 1200,
      }}
    >
      <defs>
        <filter id="cork" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.95"
            numOctaves={3}
            seed={4}
            result="fine"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves={3}
            seed={9}
            result="blot"
          />
          <feColorMatrix
            in="fine"
            type="matrix"
            values="0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0 0.10  0 0 0 0.55 0"
            result="f2"
          />
          <feColorMatrix
            in="blot"
            type="matrix"
            values="0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 0.6 0"
            result="b2"
          />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="f2" />
          </feMerge>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="#2c1f15" />
      <rect width="100%" height="100%" filter="url(#cork)" />
    </svg>
    {/* a warm practical lamp pooling on the board */}
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 55% 60% at 52% 42%, rgba(255,205,140,0.32), rgba(255,170,90,0.08) 45%, rgba(0,0,0,0.55) 100%)",
      }}
    />
  </AbsoluteFill>
);

const PrintCard: React.FC<{ p: Print; placeAt: number }> = ({ p, placeAt }) => {
  const frame = useCurrentFrame();
  const [cx, cy, cw, ch] = p.crop;
  const w = p.w;
  const h = w * (ch / cw);
  const sc = w / cw;
  const t = interpolate(frame, [placeAt, placeAt + 8], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  if (t <= 0) return null;
  const lift = 1 - t;
  const pin = pinOf(p);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: p.x - w / 2 - BORDER,
          top: p.y - h / 2 - BORDER,
          width: w + BORDER * 2,
          height: h + BORDER * 2 + (p.label ? 0 : 0),
          background: "linear-gradient(160deg, #f1ebdf, #ddd4c2)",
          rotate: `${p.rot + lift * 6}deg`,
          scale: String(1 + lift * 0.12),
          opacity: Math.min(1, t * 2),
          boxShadow: `${4 + lift * 20}px ${10 + lift * 30}px ${18 + lift * 30}px rgba(0,0,0,${0.55 - lift * 0.2})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: BORDER,
            top: BORDER,
            width: w,
            height: h,
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile(p.src)}
            style={{
              position: "absolute",
              left: -cx * sc,
              top: -cy * sc,
              width: 1920 * sc,
              height: 1080 * sc,
              filter: `${p.grade ?? ""} contrast(1.05) sepia(0.12)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(150deg, rgba(255,255,255,0.12), rgba(0,0,0,0.12))",
            }}
          />
        </div>
        {p.label ? (
          <div
            style={{
              position: "absolute",
              left: w * 0.12,
              top: h + BORDER + 4,
              padding: "6px 12px 5px",
              background: "#efe7d4",
              boxShadow: "0 3px 6px rgba(0,0,0,0.4)",
              rotate: `${-p.rot * 0.6}deg`,
              ...TYPE.label,
              fontSize: 17,
              letterSpacing: "0.16em",
              color: "#2a2018",
              whiteSpace: "nowrap",
            }}
          >
            {p.label}
          </div>
        ) : null}
      </div>
      <PushPin x={pin.x} y={pin.y} at={placeAt + 4} red={!!p.label} />
    </>
  );
};
const PushPin: React.FC<{
  x: number;
  y: number;
  at: number;
  red?: boolean;
}> = ({ x, y, at, red }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 5], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(2)),
  });
  if (t <= 0) return null;
  const c = red ? "#B3202E" : "#bfb7a6";
  return (
    <div
      style={{
        position: "absolute",
        left: x - 11,
        top: y - 11,
        width: 22,
        height: 22,
        borderRadius: "50%",
        scale: String(t),
        background: `radial-gradient(circle at 35% 30%, #fff8 0%, ${c} 35%, #000a 100%)`,
        boxShadow: "3px 6px 6px rgba(0,0,0,0.6)",
      }}
    />
  );
};
// red thread from the centre pin: shoots out, overshoots its sag a little, then settles taut-ish
const Thread: React.FC<{ to: { x: number; y: number }; at: number }> = ({
  to,
  at,
}) => {
  const frame = useCurrentFrame();
  const from = { x: CENTER.x, y: PAGE_TOP };
  const t = interpolate(frame, [at - 12, at], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  if (t <= 0) return null;
  const ex = from.x + (to.x - from.x) * t;
  const ey = from.y + (to.y - from.y) * t;
  const len = Math.hypot(ex - from.x, ey - from.y);
  const settle =
    frame > at ? Math.exp(-(frame - at) / 6) * Math.cos((frame - at) / 2.2) : 1;
  const sag = len * (0.05 + 0.05 * settle);
  const mx = (from.x + ex) / 2;
  const my = (from.y + ey) / 2 + sag;
  const d = `M ${from.x} ${from.y} Q ${mx} ${my} ${ex} ${ey}`;
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="rgba(0,0,0,0.45)"
        strokeWidth={4}
        transform="translate(5 9)"
        style={{ filter: "blur(2px)" }}
      />
      <path d={d} fill="none" stroke="#B3202E" strokeWidth={3} />
      <path d={d} fill="none" stroke="#ff6a6a" strokeWidth={1} opacity={0.5} />
    </g>
  );
};
const THREADED = PRINTS.filter((p) => p.at !== undefined) as Required<Print>[];
const ORDER = [...THREADED].sort((a, b) => a.at - b.at);
export const Y03Connected: React.FC = () => {
  const frame = useCurrentFrame();
  const page: Print = {
    src: "laban2/r6.jpg",
    crop: [500, 90, 900, 900],
    x: CENTER.x,
    y: CENTER.y,
    w: 400,
    rot: -1,
  };
  // camera: centre page, then follow the thread to each print, then pull back for the whole web
  const keys = [
    { f: 0, s: 2.0, x: CENTER.x, y: CENTER.y - 40 },
    { f: 34, s: 1.9, x: CENTER.x, y: CENTER.y - 60, e: "drift" as const },
    ...ORDER.flatMap((p) => [
      { f: p.at - 6, s: 2.2, x: p.x, y: p.y, e: "ramp" as const },
      { f: p.at + 18, s: 2.25, x: p.x, y: p.y, e: "drift" as const },
    ]),
    { f: 300, s: 1.0, x: 960, y: 540, e: "ramp" as const },
    { f: 360, s: 1.03, x: 960, y: 540, e: "drift" as const },
  ];
  const sweepAt = 300;
  return (
    <Finish dust={0.35}>
      <Rig keys={keys}>
        <CorkBoard />
        {PRINTS.filter((p) => !p.label).map((p, i) => (
          <PrintCard key={`c${i}`} p={p} placeAt={0} />
        ))}
        <PrintCard p={page} placeAt={0} />
        {THREADED.map((p) => (
          <PrintCard key={p.label} p={p} placeAt={p.at - 10} />
        ))}
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        >
          {THREADED.map((p) => (
            <Thread key={p.label} to={pinOf(p)} at={p.at} />
          ))}
        </svg>
        <PushPin x={CENTER.x} y={PAGE_TOP} at={10} red />
      </Rig>
      <LightSweep at={sweepAt} dur={50} strength={0.14} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: SHADE,
          opacity: interpolate(frame, [296, 312], [0, 1], clamp),
        }}
      />
      <Sequence from={12} durationInFrames={36} layout="none">
        <CaptionAt text="they would become" start={0} y={900} size={48} />
      </Sequence>
      <HeroWord text="connected" look="serif" size={180} y={830} start={304} />
      <Sfx name="drone" at={0} volume={0.28} />
      <Sfx name="hit" at={12} volume={0.3} />
      {ORDER.map((p) => (
        <React.Fragment key={p.at}>
          <Sfx name="whoosh" at={p.at - 12} volume={0.35} />
          <Sfx name="tick" at={p.at} volume={0.45} />
          <Sfx name="hit" at={p.at} volume={0.22} />
        </React.Fragment>
      ))}
      <Sfx name="riser" at={262} volume={0.3} />
      <Sfx name="whoosh" at={290} volume={0.5} />
      <Sfx name="boom" at={304} volume={0.55} />
    </Finish>
  );
};
