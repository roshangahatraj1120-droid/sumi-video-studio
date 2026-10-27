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
import { COLOR, TYPE } from "../brand/tokens";
import { Finish, Sfx } from "../laban/broll";
import { LightSweep } from "../laban9/fx9";
import {
  ANTON,
  clamp,
  ease,
  img,
  MONO,
  ReconTag,
  RED,
  Slam,
  Tape,
  WARM,
} from "./kit";
import { TypeOn } from "./kit2";

// Hip-hop episode — "The Smithsonian preserves a disco ball used at parties thrown by Cindy and Herc
// in the recreation room of their apartment building." Two clips, 30 fps:
// K1 a dark museum gallery, a spotlight clunks on over a spinning mirror ball in a glass case, its light
//    flecks crawling over the walls, then a whip-zoom into one mirror tile;
// K2 the rec-room party under the mirror-ball light, then the camera pulls back out through a lit window
//    of the apartment building.
export const LENDISCO = { k1: 180, k2: 240 };

// ---- a procedural mirror ball: lat/long tiles, each shaded by what it reflects
const MirrorBall: React.FC<{
  cx: number;
  cy: number;
  r: number;
  spin: number;
  light: number;
}> = ({ cx, cy, r, spin, light }) => {
  const rows = 22;
  const tilt = 0.22;
  const L = (() => {
    const v = [-0.35, 0.8, 0.5];
    const m = Math.hypot(v[0], v[1], v[2]);
    return v.map((c) => c / m);
  })();
  const polys: React.ReactNode[] = [];
  const glints: React.ReactNode[] = [];
  const proj = (lat: number, lon: number) => {
    const x = Math.cos(lat) * Math.sin(lon + spin);
    const y = Math.sin(lat);
    const z = Math.cos(lat) * Math.cos(lon + spin);
    const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
    const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
    return { x, y: y2, z: z2 };
  };
  for (let i = 0; i < rows; i++) {
    const la0 = -Math.PI / 2 + (i / rows) * Math.PI;
    const la1 = -Math.PI / 2 + ((i + 1) / rows) * Math.PI;
    const mid = (la0 + la1) / 2;
    const n = Math.max(6, Math.round(44 * Math.cos(mid)));
    const g = 0.12;
    for (let j = 0; j < n; j++) {
      const lo0 = (j / n) * Math.PI * 2;
      const lo1 = ((j + 1) / n) * Math.PI * 2;
      const dl = (lo1 - lo0) * g;
      const da = (la1 - la0) * g;
      const c = proj(mid, (lo0 + lo1) / 2);
      if (c.z <= 0.02) continue;
      const pts = [
        proj(la0 + da, lo0 + dl),
        proj(la0 + da, lo1 - dl),
        proj(la1 - da, lo1 - dl),
        proj(la1 - da, lo0 + dl),
      ]
        .map((p) => `${cx + p.x * r},${cy - p.y * r}`)
        .join(" ");
      // reflect the view ray (0,0,1) about the tile normal
      const d = c.z;
      const rx = 2 * d * c.x;
      const ry = 2 * d * c.y;
      const rz = 2 * d * c.z - 1;
      const spec = Math.max(0, rx * L[0] + ry * L[1] + rz * L[2]);
      // a mirror tile shows a patch of the room: dim walls, a few bright lamps, the spot
      const patch = random(`e${Math.round(rx * 5)}_${Math.round(ry * 5)}`);
      const env =
        0.16 +
        0.3 * Math.max(0, ry) +
        0.12 * random(`t${i}-${j}`) +
        0.55 * Math.pow(patch, 6);
      const s = Math.pow(spec, 14) * light;
      const v = Math.min(
        1,
        (env * (0.3 + 0.7 * light) + s * 1.2) * (0.5 + 0.5 * d),
      );
      const warm = 0.92 + 0.08 * random(`w${i}-${j}`);
      polys.push(
        <polygon
          key={`${i}-${j}`}
          points={pts}
          fill={`rgb(${Math.round(255 * v)},${Math.round(246 * v * warm)},${Math.round(232 * v * warm)})`}
        />,
      );
      if (s > 0.8) {
        const gx = cx + c.x * r;
        const gy = cy - c.y * r;
        const k = (s - 0.8) / 0.2;
        glints.push(
          <g key={`g${i}-${j}`} opacity={k}>
            <circle
              cx={gx}
              cy={gy}
              r={10 + 10 * k}
              fill="rgba(255,250,235,0.55)"
              style={{ filter: "blur(6px)" }}
            />
            <line
              x1={gx - 60 * k}
              y1={gy}
              x2={gx + 60 * k}
              y2={gy}
              stroke="#fff"
              strokeWidth={2}
            />
            <line
              x1={gx}
              y1={gy - 60 * k}
              x2={gx}
              y2={gy + 60 * k}
              stroke="#fff"
              strokeWidth={2}
            />
          </g>,
        );
      }
    }
  }
  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
      <defs>
        <radialGradient id="ballShade" cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="80%" stopColor="rgba(0,0,0,0.25)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.75)" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="#0E0D0C" />
      {polys}
      <circle cx={cx} cy={cy} r={r} fill="url(#ballShade)" />
      <g style={{ mixBlendMode: "screen" }}>{glints}</g>
    </svg>
  );
};

// light flecks thrown by the ball, sweeping across the walls as it turns
const BallFlecks: React.FC<{
  spin: number;
  light: number;
  n?: number;
  seed?: string;
}> = ({ spin, light, n = 120, seed = "bf" }) => (
  <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
    {Array.from({ length: n }).map((_, i) => {
      const lon = random(`${seed}o${i}`) * Math.PI * 2 + spin * 2;
      const lat = (random(`${seed}a${i}`) - 0.5) * 1.6;
      const face = Math.cos(lon);
      if (face < 0.05) return null;
      const x = 960 + Math.sin(lon) * 1500;
      const y = 540 - Math.sin(lat) * 900;
      const s = (8 + random(`${seed}s${i}`) * 16) * (0.6 + 0.4 * face);
      const hue = random(`${seed}h${i}`);
      const c =
        hue < 0.65 ? "255,242,215" : hue < 0.85 ? "255,180,120" : "180,205,255";
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: s * (0.5 + 0.5 * face),
            height: s * 0.8,
            borderRadius: 3,
            background: `rgba(${c},${(0.3 + 0.6 * face) * light})`,
            boxShadow: `0 0 ${s}px rgba(${c},${0.6 * light})`,
            filter: "blur(1.2px)",
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// ============ K1 — "The Smithsonian preserves a disco ball…"
const ON = 14;
const ZOOM = 156;
const BALL = { x: 1260, y: 430, r: 230 };
const CASE = { x0: 930, y0: 120, x1: 1590, y1: 820 };
export const K1Museum: React.FC = () => {
  const frame = useCurrentFrame();
  // spotlight clunks on with two flickers
  const flick =
    frame < ON
      ? 0
      : frame < ON + 3
        ? 1
        : frame < ON + 5
          ? 0.25
          : frame < ON + 7
            ? 1
            : frame < ON + 9
              ? 0.5
              : 1;
  const light = flick * ease(frame, ON, ON + 1);
  const spin = frame * 0.018;
  const push = interpolate(frame, [0, ZOOM], [1, 1.07], clamp);
  const zoom = interpolate(frame, [ZOOM, 180], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const s = push * Math.pow(9, zoom);
  const orbit = interpolate(frame, [0, ZOOM], [-30, 30], clamp);
  return (
    <Finish dust={0.25}>
      <AbsoluteFill style={{ backgroundColor: "#060505" }} />
      <AbsoluteFill
        style={{
          transformOrigin: `${BALL.x + 70}px ${BALL.y - 60}px`,
          scale: String(s),
          filter: zoom > 0.05 ? `blur(${zoom * 6}px)` : undefined,
        }}
      >
        {/* back wall + floor */}
        <AbsoluteFill
          style={{
            translate: `${orbit * 0.4}px 0px`,
            background: `radial-gradient(ellipse 900px 700px at ${BALL.x}px 380px, rgba(70,60,50,${0.9 * light}) 0%, rgba(25,22,20,${light}) 55%, #070606 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -200,
            top: 860,
            width: 2400,
            height: 400,
            background: `linear-gradient(180deg, rgba(40,34,30,${light}) 0%, #050404 100%)`,
          }}
        />
        <AbsoluteFill style={{ translate: `${orbit * 0.4}px 0px` }}>
          <BallFlecks spin={spin} light={light} />
        </AbsoluteFill>
        <AbsoluteFill style={{ translate: `${orbit}px 0px` }}>
          {/* spotlight cone */}
          <svg
            width={1920}
            height={1080}
            style={{
              position: "absolute",
              mixBlendMode: "screen",
              opacity: light,
            }}
          >
            <defs>
              <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,236,200,0.35)" />
                <stop offset="100%" stopColor="rgba(255,236,200,0)" />
              </linearGradient>
            </defs>
            <polygon
              points={`${BALL.x - 40},-20 ${BALL.x + 40},-20 ${BALL.x + 420},1000 ${BALL.x - 420},1000`}
              fill="url(#cone)"
              style={{ filter: "blur(18px)" }}
            />
          </svg>
          {/* plinth */}
          <div
            style={{
              position: "absolute",
              left: CASE.x0 - 20,
              top: CASE.y1,
              width: CASE.x1 - CASE.x0 + 40,
              height: 300,
              background: `linear-gradient(180deg, rgb(${30 + 40 * light},${26 + 34 * light},${22 + 28 * light}) 0%, #0A0908 40%)`,
              boxShadow: "0 -2px 0 rgba(255,240,220,0.25)",
            }}
          />
          {/* the chain and the ball */}
          <div
            style={{
              position: "absolute",
              left: BALL.x - 1,
              top: CASE.y0,
              width: 2,
              height: BALL.y - BALL.r - CASE.y0,
              background: `rgba(200,190,175,${0.3 + 0.5 * light})`,
            }}
          />
          <MirrorBall
            cx={BALL.x}
            cy={BALL.y}
            r={BALL.r}
            spin={spin}
            light={light}
          />
          {/* glass case */}
          <div
            style={{
              position: "absolute",
              left: CASE.x0,
              top: CASE.y0,
              width: CASE.x1 - CASE.x0,
              height: CASE.y1 - CASE.y0,
              border: `2px solid rgba(255,245,230,${0.15 + 0.25 * light})`,
              background: `linear-gradient(115deg, rgba(255,255,255,0) 20%, rgba(255,250,240,${0.07 * light}) 32%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 70%, rgba(255,250,240,${0.05 * light}) 78%, rgba(255,255,255,0) 84%)`,
            }}
          />
          {/* museum placard */}
          <div
            style={{
              position: "absolute",
              left: CASE.x0 + 30,
              top: CASE.y1 + 34,
              width: 360,
              padding: "16px 20px",
              background: "#EFEBE3",
              opacity: ease(frame, 96, 108) * light,
              translate: `0px ${(1 - ease(frame, 96, 108)) * 20}px`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                ...MONO,
                fontSize: 13,
                letterSpacing: "0.2em",
                color: "#6B6256",
              }}
            >
              SMITHSONIAN COLLECTION
            </div>
            <div
              style={{
                ...TYPE.headline,
                fontSize: 30,
                color: "#17130F",
                margin: "6px 0",
              }}
            >
              Disco ball
            </div>
            <div
              style={{ height: 2, width: 50, background: RED, marginBottom: 8 }}
            />
            <div
              style={{
                ...TYPE.body,
                fontSize: 15,
                lineHeight: 1.4,
                color: "#2A241D",
              }}
            >
              Used at parties thrown by Cindy Campbell and Clive &ldquo;DJ Kool
              Herc&rdquo; Campbell.
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {zoom > 0.7 ? (
        <AbsoluteFill
          style={{ backgroundColor: `rgba(255,248,232,${(zoom - 0.7) / 0.3})` }}
        />
      ) : null}
      {frame >= ON && frame < ON + 2 ? (
        <AbsoluteFill style={{ backgroundColor: "rgba(255,240,215,0.25)" }} />
      ) : null}

      {/* titles */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 330,
          opacity: 1 - ease(frame, ZOOM - 6, ZOOM + 4),
        }}
      >
        <div
          style={{
            ...MONO,
            fontSize: 30,
            color: COLOR.gold,
            letterSpacing: "0.18em",
            minHeight: 40,
          }}
        >
          <TypeOn text="THE SMITHSONIAN" at={30} cps={0.7} cursor={false} />
        </div>
        <div
          style={{
            ...TYPE.body,
            fontWeight: 300,
            fontSize: 52,
            color: "#fff",
            marginTop: 18,
            opacity: ease(frame, 52, 62),
          }}
        >
          preserves a
        </div>
        <Slam at={68}>
          <div
            style={{
              ...ANTON,
              fontSize: 180,
              color: "#fff",
              lineHeight: 1,
              textShadow: "0 8px 30px rgba(0,0,0,0.85)",
            }}
          >
            Disco Ball
          </div>
        </Slam>
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          bottom: 60,
          ...MONO,
          fontSize: 16,
          letterSpacing: "0.16em",
          color: "rgba(255,255,255,0.45)",
          opacity: ease(frame, 40, 50) * (1 - zoom),
        }}
      >
        OBJECT RENDERED FOR ILLUSTRATION
      </div>
      <ReconTag />
      <Sfx name="hit" at={ON} volume={0.35} />
      <Sfx name="tick" at={30} volume={0.2} />
      <Sfx name="hit" at={70} volume={0.3} />
      <Sfx name="riser" at={ZOOM - 20} volume={0.25} />
      <Sfx name="whoosh" at={ZOOM + 6} volume={0.45} />
    </Finish>
  );
};

// ============ K2 — "…used at parties thrown by Cindy and Herc in the recreation room of their apartment
// building." The party, then a pull-back out through the building's lit window.
const OUT = 112;
const OUT_END = 176;
const S0 = 38;
const WIN = { x0: 1354, y0: 686, x1: 1405, y1: 893 };
const WC = { x: (WIN.x0 + WIN.x1) / 2, y: (WIN.y0 + WIN.y1) / 2 };
const BAR_Y = 790;
const PUSH_END = 1.15;

const Party: React.FC<{ spin: number; light: number }> = ({ spin, light }) => (
  <>
    <Img
      src={staticFile(img("o_party"))}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: `${WARM} contrast(1.06) brightness(0.88)`,
      }}
    />
    <BallFlecks spin={spin} light={light} n={140} seed="pf" />
  </>
);

export const K2RecRoom: React.FC = () => {
  const frame = useCurrentFrame();
  const spin = frame * 0.02;
  const beat = Math.exp(-(frame % 15) / 4);
  const z = interpolate(frame, [OUT, OUT_END], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const S = Math.exp(Math.log(S0) * (1 - z));
  const drift = interpolate(frame, [OUT_END, 240], [1, 1.1], clamp);
  const u = z;
  const wcx = 960 + (WC.x - 960) * u;
  const wcy = 540 + (WC.y - 540) * u;
  // screen-space window rect
  const sx = (bx: number) => wcx + (bx - WC.x) * S;
  const sy = (by: number) => wcy + (by - WC.y) * S;
  const pScale =
    interpolate(frame, [0, OUT], [1, PUSH_END], clamp) * Math.pow(S / S0, 0.45);
  const pw = 1920 * pScale;
  const ph = 1080 * pScale;
  const speed = frame > OUT && frame < OUT_END ? Math.sin(z * Math.PI) : 0;
  const text1 = 1 - ease(frame, OUT - 10, OUT);
  const end = ease(frame, OUT_END - 4, OUT_END + 10);
  return (
    <Finish dust={0.25}>
      <AbsoluteFill
        style={{ transformOrigin: `${WC.x}px ${WC.y}px`, scale: String(drift) }}
      >
        {/* the building (only once we are back outside) */}
        {S < S0 * 0.98 ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
              transformOrigin: "0 0",
              transform: `translate(${sx(0)}px, ${sy(0)}px) scale(${S})`,
              filter:
                speed > 0.05
                  ? `blur(${(speed * 3) / Math.max(1, S / 6)}px)`
                  : undefined,
            }}
          >
            <Img
              src={staticFile(img("o_lamp"))}
              style={{ width: 1920, height: 1080, filter: "contrast(1.05)" }}
            />
          </div>
        ) : null}
        {/* the party inside the window */}
        <div
          style={{
            position: "absolute",
            left: sx(WIN.x0),
            top: sy(WIN.y0),
            width: (WIN.x1 - WIN.x0) * S,
            height: (WIN.y1 - WIN.y0) * S,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: wcx - pw / 2 - sx(WIN.x0),
              top: wcy - ph / 2 - sy(WIN.y0),
              width: pw,
              height: ph,
            }}
          >
            <div
              style={{
                width: 1920,
                height: 1080,
                transformOrigin: "0 0",
                scale: String(pScale),
              }}
            >
              <Party spin={spin} light={1} />
            </div>
          </div>
          {/* the glass: a warm sheen and the window crossbar, fading in as we leave */}
          <AbsoluteFill
            style={{
              opacity: z,
              background:
                "linear-gradient(160deg, rgba(255,200,130,0.25) 0%, rgba(255,170,90,0.05) 60%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: (BAR_Y - WIN.y0) * S,
              height: Math.max(1, 3 * S),
              background: "#1C120B",
              opacity: z,
            }}
          />
        </div>
        {/* spill of party light on the brick */}
        {S < S0 * 0.98 ? (
          <AbsoluteFill
            style={{
              mixBlendMode: "screen",
              opacity: z * (0.6 + 0.4 * beat),
              background: `radial-gradient(ellipse ${90 * S}px ${150 * S}px at ${wcx}px ${wcy}px, rgba(255,170,90,0.35) 0%, rgba(255,170,90,0) 70%)`,
            }}
          />
        ) : null}
        {/* HUD bracket on the window */}
        {end > 0 ? (
          <svg
            width={1920}
            height={1080}
            style={{ position: "absolute", left: 0, top: 0, opacity: end }}
          >
            {[
              [WIN.x0 - 22, WIN.y0 - 22, 1, 1],
              [WIN.x1 + 22, WIN.y0 - 22, -1, 1],
              [WIN.x0 - 22, WIN.y1 + 22, 1, -1],
              [WIN.x1 + 22, WIN.y1 + 22, -1, -1],
            ].map(([x, y, dx, dy], i) => (
              <path
                key={i}
                d={`M ${x} ${y + dy * 30} L ${x} ${y} L ${x + dx * 30} ${y}`}
                fill="none"
                stroke={RED}
                strokeWidth={4}
              />
            ))}
          </svg>
        ) : null}
      </AbsoluteFill>
      {end > 0 ? (
        <Tape
          text="Recreation room"
          x={WIN.x1 + 240}
          y={WIN.y0 + 10}
          rot={-3}
          at={OUT_END + 6}
          size={30}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(5,5,6,0.85) 0%, rgba(5,5,6,0.3) 30%, rgba(5,5,6,0) 50%)",
        }}
      />

      {/* text — the party */}
      {text1 > 0 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 90,
              textAlign: "center",
              fontSize: 44,
              color: "#fff",
              textShadow: "0 2px 12px rgba(0,0,0,0.95)",
              opacity: text1,
            }}
          >
            <TypeOn
              text="used at parties thrown by"
              at={4}
              cps={1.3}
              cursor={false}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 690,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: 40,
              opacity: text1,
            }}
          >
            <Slam at={38}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    ...ANTON,
                    fontSize: 200,
                    lineHeight: 1,
                    color: COLOR.gold,
                    textShadow: "0 8px 30px rgba(0,0,0,0.85)",
                  }}
                >
                  Cindy
                </div>
                <div
                  style={{
                    ...MONO,
                    fontSize: 22,
                    color: "#fff",
                    letterSpacing: "0.2em",
                  }}
                >
                  CINDY CAMPBELL
                </div>
              </div>
            </Slam>
            <div
              style={{
                ...TYPE.body,
                fontWeight: 300,
                fontSize: 90,
                color: "#fff",
                opacity: ease(frame, 48, 56),
                paddingBottom: 60,
              }}
            >
              &amp;
            </div>
            <Slam at={56}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    ...ANTON,
                    fontSize: 200,
                    lineHeight: 1,
                    color: "#fff",
                    textShadow: "0 8px 30px rgba(0,0,0,0.85)",
                  }}
                >
                  Herc
                </div>
                <div
                  style={{
                    ...MONO,
                    fontSize: 22,
                    color: "#fff",
                    letterSpacing: "0.2em",
                  }}
                >
                  CLIVE &ldquo;DJ KOOL HERC&rdquo; CAMPBELL
                </div>
              </div>
            </Slam>
          </div>
        </>
      ) : null}

      {/* text — the building */}
      {frame >= OUT_END - 6 ? (
        <div style={{ position: "absolute", left: 110, top: 700 }}>
          <div
            style={{
              ...TYPE.body,
              fontWeight: 300,
              fontSize: 50,
              color: "#fff",
              opacity: ease(frame, OUT_END - 6, OUT_END + 6),
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
            }}
          >
            in the recreation room of their
          </div>
          <Slam at={OUT_END + 8}>
            <div
              style={{
                ...ANTON,
                fontSize: 118,
                color: "#fff",
                lineHeight: 1.02,
                textShadow: "0 8px 30px rgba(0,0,0,0.85)",
              }}
            >
              Apartment Building
            </div>
          </Slam>
          <div
            style={{
              ...MONO,
              fontSize: 24,
              color: COLOR.gold,
              letterSpacing: "0.18em",
              marginTop: 12,
              minHeight: 32,
            }}
          >
            <TypeOn
              text="1520 SEDGWICK AVENUE · THE BRONX"
              at={OUT_END + 20}
              cps={1.6}
              cursor={false}
            />
          </div>
        </div>
      ) : null}
      <LightSweep at={OUT_END + 12} dur={45} angle={100} strength={0.12} />
      <ReconTag />
      {frame < 6 ? (
        <AbsoluteFill
          style={{ backgroundColor: `rgba(255,248,232,${1 - frame / 6})` }}
        />
      ) : null}
      <Sfx name="whoosh" at={0} volume={0.3} />
      <Sfx name="hit" at={40} volume={0.35} />
      <Sfx name="hit" at={58} volume={0.35} />
      <Sfx name="whoosh" at={OUT + 4} volume={0.45} />
      <Sfx name="hit" at={OUT_END + 10} volume={0.3} />
      <Sfx name="tick" at={OUT_END + 20} volume={0.2} />
    </Finish>
  );
};
