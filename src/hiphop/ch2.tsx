import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt } from "../laban/overlays";
import { Plate, Rig } from "../laban3/rig";
import { LightSweep } from "../laban9/fx9";
import {
  ANTON,
  CRUSH,
  clamp,
  ease,
  Flicker,
  Hud,
  img,
  MONO,
  Pair,
  ReconTag,
  RED,
  SHADE,
  Slab,
  Slam,
  Tape,
  TornBand,
  WARM,
} from "./kit";

// Hip-hop episode — Chapter 2 "The sound was already there" (script part 3). 30 fps.
export const LENH2 = {
  d01: 240,
  d02: 230,
  d03: 200,
  d04: 180,
  d05: 210,
  d06: 240,
  d07: 360,
  d08: 240,
};

// Chapter title block shared with Chapter 1's look: a tape label, then the title sliding in
const ChapterTitle: React.FC<{ n: number; title: string; at: number }> = ({
  n,
  title,
  at,
}) => {
  const frame = useCurrentFrame();
  const t = ease(frame, at + 6, at + 22);
  return (
    <>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% 50%, rgba(6,5,4,0.75), rgba(6,5,4,0) 100%)",
          opacity: ease(frame, at, at + 12),
        }}
      />
      <Tape text={`Chapter ${n}`} x={960} y={400} rot={-2} at={at} size={30} />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 450,
          textAlign: "center",
          opacity: t,
          translate: `${(1 - t) * 260}px 0px`,
          filter: t < 1 ? `blur(${(1 - t) * 14}px)` : undefined,
        }}
      >
        <span
          style={{
            ...ANTON,
            fontSize: 130,
            color: COLOR.white,
            textShadow: "0 14px 30px rgba(0,0,0,0.85)",
          }}
        >
          {title}
        </span>
      </div>
    </>
  );
};

// 01 — "Before the term hip-hop became common, young people in the Bronx were already surrounded by
// records." Macro on the needle with the chapter title, then a whip to the DJ booth over the crowd.
export const D01Records: React.FC = () => (
  <Finish dust={0.3}>
    <Sequence durationInFrames={110}>
      <Rig
        keys={[
          { f: 0, s: 1.1, x: 1050, y: 560 },
          { f: 110, s: 1.35, x: 1150, y: 600, e: "drift" },
        ]}
        whipOut={1}
      >
        <Plate src={img("d_needle2")} filter={WARM} />
      </Rig>
      <ChapterTitle n={2} title="The sound was already there" at={18} />
      <CaptionAt
        text="before the term hip-hop became common"
        start={50}
        y={660}
        size={40}
      />
    </Sequence>
    <Sequence from={110}>
      <Rig
        keys={[
          { f: 0, s: 1.55, x: 1400, y: 860 },
          { f: 60, s: 1.08, x: 960, y: 560, e: "smooth" },
          { f: 130, s: 1.1, x: 960, y: 550, e: "drift" },
        ]}
        whipIn={1}
      >
        <Plate src={img("d_booth")} filter={WARM} />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <Pair
        thin="young people in the Bronx were already surrounded by"
        heavy="records."
        at={22}
        y={760}
        size={170}
      />
    </Sequence>
    <ReconTag />
    <Sfx name="tick" at={18} volume={0.3} />
    <Sfx name="hit" at={26} volume={0.3} />
    <Sfx name="whoosh" at={104} volume={0.45} />
    <Sfx name="hit" at={112} volume={0.3} />
  </Finish>
);

// 02 — "Funk. Soul. Disco. Rock. Salsa. Caribbean sound-system culture." The camera hops across the
// crate tabs, boxing each in red, then whips to the speaker shaking the air.
const TABS = [
  { word: "Funk", x: 230, y: 524, w: 330, h: 92 },
  { word: "Soul", x: 660, y: 608, w: 300, h: 92 },
  { word: "Disco", x: 1000, y: 464, w: 230, h: 72 },
  { word: "Rock", x: 1550, y: 480, w: 180, h: 64 },
  { word: "Salsa", x: 1160, y: 524, w: 250, h: 72 },
].map((t, i) => ({ ...t, at: 10 + i * 28 }));
const CRATE_END = 150;
export const D02Genres: React.FC = () => {
  const frame = useCurrentFrame();
  const keys = [
    { f: 0, s: 1.3, x: 900, y: 520 },
    ...TABS.flatMap((t) => [
      { f: t.at - 2, s: 2.05, x: t.x, y: t.y, e: "ramp" as const },
      { f: t.at + 20, s: 2.1, x: t.x + 10, y: t.y, e: "drift" as const },
    ]),
  ];
  const beat = frame >= CRATE_END ? (frame - CRATE_END) % 12 : 99;
  const pump = frame >= CRATE_END ? Math.exp(-beat / 3.5) : 0;
  return (
    <Finish dust={0.3}>
      <Sequence durationInFrames={CRATE_END}>
        <Rig keys={keys} whipOut={1} blurScale={0.6}>
          <Plate src={img("d_crate")} filter={WARM} />
          <svg
            width={1920}
            height={1080}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            {TABS.map((t) => {
              const p = interpolate(frame, [t.at, t.at + 8], [0, 1], clamp);
              if (p <= 0) return null;
              return (
                <rect
                  key={t.word}
                  x={t.x - t.w / 2}
                  y={t.y - t.h / 2}
                  width={t.w}
                  height={t.h}
                  rx={4}
                  fill="none"
                  stroke={RED}
                  strokeWidth={4}
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - p}
                  opacity={frame > t.at + 26 ? 0.55 : 1}
                  style={{ filter: `drop-shadow(0 0 6px ${RED})` }}
                />
              );
            })}
          </svg>
        </Rig>
        <AbsoluteFill style={{ background: SHADE }} />
        {TABS.map((t, i) => (
          <Sequence
            key={t.word}
            from={t.at}
            durationInFrames={(TABS[i + 1]?.at ?? CRATE_END) - t.at}
            layout="none"
          >
            <Slab text={`${t.word}.`} at={0} y={800} size={130} />
          </Sequence>
        ))}
      </Sequence>
      <Sequence from={CRATE_END}>
        <AbsoluteFill
          style={{
            scale: String(1 + 0.03 * pump),
            translate: `${Math.sin(frame * 9) * 5 * pump}px ${Math.cos(frame * 7) * 4 * pump}px`,
          }}
        >
          <Rig
            keys={[
              { f: 0, s: 1.25, x: 760, y: 540 },
              { f: 80, s: 1.12, x: 800, y: 540, e: "drift" },
            ]}
            whipIn={1}
          >
            <Plate src={img("d_bass")} filter="contrast(1.1) saturate(1.15)" />
          </Rig>
        </AbsoluteFill>
        <AbsoluteFill style={{ background: SHADE }} />
        <Pair
          thin="Caribbean"
          heavy="sound-system culture"
          at={6}
          y={780}
          size={140}
        />
      </Sequence>
      <ReconTag />
      {TABS.map((t) => (
        <Sfx key={t.word} name="tick" at={t.at} volume={0.35} />
      ))}
      <Sfx name="whoosh" at={CRATE_END - 6} volume={0.45} />
      <Sfx name="boom" at={CRATE_END + 2} volume={0.45} />
      {Array.from({ length: 6 }).map((_, i) => (
        <Sfx key={i} name="hit" at={CRATE_END + 12 * (i + 1)} volume={0.14} />
      ))}
    </Finish>
  );
};

// 03 — "Music with percussion strong enough to pull people onto a floor." Hands on congas, pulsing
// with the hits, then a ramp out of the drums to the whole dance floor.
const CONGA_END = 84;
export const D03Percussion: React.FC = () => {
  const frame = useCurrentFrame();
  const hit = frame < CONGA_END ? Math.exp(-(frame % 10) / 3) : 0;
  return (
    <Finish dust={0.3}>
      <Sequence durationInFrames={CONGA_END}>
        <AbsoluteFill
          style={{
            scale: String(1 + 0.012 * hit),
            translate: `${Math.sin(frame * 13) * 3 * hit}px ${Math.cos(frame * 11) * 2 * hit}px`,
          }}
        >
          <Rig
            keys={[
              { f: 0, s: 1.12, x: 960, y: 560 },
              { f: CONGA_END, s: 1.3, x: 960, y: 620, e: "drift" },
            ]}
            whipOut={1}
          >
            <Plate src={img("d_conga")} filter={WARM} />
          </Rig>
        </AbsoluteFill>
        <AbsoluteFill style={{ background: SHADE }} />
        <Pair thin="music with" heavy="percussion" at={6} y={760} size={180} />
      </Sequence>
      <Sequence from={CONGA_END}>
        <Rig
          keys={[
            { f: 0, s: 1.9, x: 330, y: 880 },
            { f: 50, s: 1.0, x: 960, y: 540, e: "smooth" },
            { f: 116, s: 1.04, x: 960, y: 540, e: "drift" },
          ]}
          whipIn={1}
          blurScale={0.4}
        >
          <Plate src={img("d_disco")} filter={WARM} />
        </Rig>
        <AbsoluteFill style={{ background: SHADE }} />
        <Pair
          thin="strong enough to pull people"
          heavy="onto a floor."
          at={36}
          y={760}
          size={170}
        />
      </Sequence>
      <ReconTag />
      {Array.from({ length: 8 }).map((_, i) => (
        <Sfx key={i} name="hit" at={i * 10} volume={0.12} />
      ))}
      <Sfx name="whoosh" at={CONGA_END - 6} volume={0.45} />
      <Sfx name="hit" at={CONGA_END + 40} volume={0.3} />
    </Finish>
  );
};

// 04 — "And across all those records, dancers kept reacting to one thing in particular: rhythm."
// The b-boy on his own depth layer; RHYTHM sits behind him, pulsing on the beat.
const D4_KEYS = [
  { f: 0, s: 1.06, x: 980, y: 560 },
  { f: 180, s: 1.16, x: 980, y: 540, e: "smooth" as const },
];
const RHYTHM_AT = 60;
export const D04Rhythm: React.FC = () => {
  const frame = useCurrentFrame();
  const since = frame - RHYTHM_AT;
  const pulse = since >= 0 ? Math.exp(-(since % 15) / 4) : 0;
  return (
    <Finish dust={0.3}>
      <Rig keys={D4_KEYS}>
        <Plate src={img("d_cypher-plate")} filter={WARM} />
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 120,
            textAlign: "center",
            scale: String(1 + 0.035 * pulse),
          }}
        >
          <Slam at={RHYTHM_AT}>
            <span
              style={{
                ...ANTON,
                fontSize: 400,
                color: COLOR.white,
                textShadow: `0 0 ${30 + 30 * pulse}px rgba(255,200,120,0.5), 0 12px 40px rgba(0,0,0,0.6)`,
              }}
            >
              Rhythm
            </span>
          </Slam>
        </div>
      </Rig>
      <AbsoluteFill>
        <Rig
          keys={D4_KEYS.map((k) => ({ ...k, s: k.s * 1.06 }))}
          opaque={false}
        >
          <Plate src="hiphop/d_cypher-cut.png" filter={WARM} />
        </Rig>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt
        text="across all those records, dancers kept reacting to one thing:"
        start={6}
        y={960}
        size={40}
      />
      <ReconTag />
      <Sfx name="boom" at={RHYTHM_AT} volume={0.45} />
      {Array.from({ length: 8 }).map((_, i) => (
        <Sfx key={i} name="hit" at={RHYTHM_AT + 15 * (i + 1)} volume={0.12} />
      ))}
    </Finish>
  );
};

// 05 — OVERLAY for the host demo: "A song can have lyrics, melody, horns, strings – but when the rhythm
// opens up, your body hears space." Right-third layout; the letters of SPACE drift apart.
const D5_WORDS = ["Lyrics", "Melody", "Horns", "Strings"];
export const D05Space: React.FC<{ bg: "green" | "alpha" | "preview" }> = ({
  bg,
}) => {
  const frame = useCurrentFrame();
  const green = bg === "green";
  const fadeWords = 1 - ease(frame, 112, 124);
  const dim = ease(frame, 96, 106);
  const sp = ease(frame, 116, 176);
  const shadow = green ? undefined : "0 3px 14px rgba(0,0,0,0.85)";
  return (
    <AbsoluteFill style={{ backgroundColor: green ? "#00FF00" : undefined }}>
      {bg === "preview" ? (
        <Img
          src={staticFile(img("o_party"))}
          style={{
            position: "absolute",
            width: 1920,
            height: 1080,
            filter: "brightness(0.55)",
          }}
        />
      ) : null}
      {D5_WORDS.map((w, i) => {
        const at = 8 + i * 18;
        const t = ease(frame, at, at + 10);
        return (
          <div
            key={w}
            style={{
              position: "absolute",
              left: 1320,
              top: 230 + i * 110,
              opacity: t * fadeWords * (1 - 0.65 * dim),
              translate: `${(1 - t) * 40}px 0px`,
              ...TYPE.body,
              fontWeight: 300,
              fontSize: 66,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: COLOR.white,
              textShadow: shadow,
            }}
          >
            {w}
            <div
              style={{
                position: "absolute",
                left: -6,
                top: "52%",
                height: 4,
                width: `${dim * 105}%`,
                background: RED,
              }}
            />
          </div>
        );
      })}
      {frame >= 112 ? (
        <div
          style={{
            position: "absolute",
            left: 980,
            width: 920,
            top: 640,
            textAlign: "center",
          }}
        >
          <div
            style={{
              ...TYPE.body,
              fontWeight: 300,
              fontSize: 40,
              letterSpacing: "0.14em",
              color: COLOR.white,
              opacity: ease(frame, 112, 124),
              textShadow: shadow,
            }}
          >
            your body hears
          </div>
          <div
            style={{
              ...ANTON,
              fontSize: 190,
              color: COLOR.white,
              letterSpacing: `${0.02 + sp * 0.3}em`,
              marginRight: `-${0.02 + sp * 0.3}em`,
              opacity: ease(frame, 114, 126),
              textShadow: shadow,
            }}
          >
            Space
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// 06 — "That space is where dancers start making decisions." GRAPHIC: a record's timeline, VERSE →
// CHORUS → BREAK. The waveform empties out in the break, then we zoom through it onto the floor.
const X0 = 160;
const XV = 700;
const XC = 1240;
const X1 = 1760;
const BARS = Array.from({ length: (X1 - X0) / 10 }).map((_, i) => {
  const x = X0 + i * 10 + 5;
  let a: number;
  if (x < XV) a = 40 + random(`v${i}`) * 80;
  else if (x < XC) a = 70 + random(`c${i}`) * 110;
  else {
    const k = (x - XC) % 80;
    a = k < 10 ? 190 : k >= 40 && k < 50 ? 70 : 5;
  }
  return { x, a, brk: x >= XC };
});
const SEGS = [
  { word: "Verse", x: (X0 + XV) / 2, from: X0 },
  { word: "Chorus", x: (XV + XC) / 2, from: XV },
  { word: "Break", x: (XC + X1) / 2, from: XC },
];
const ZOOM = 160;
export const D06Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const head = interpolate(frame, [20, 150], [X0, X1], clamp);
  const z = interpolate(frame, [ZOOM, ZOOM + 28], [1, 6], {
    ...clamp,
    easing: (t) => t * t * t,
  });
  const gOut = 1 - ease(frame, ZOOM + 16, ZOOM + 30);
  const imgIn = ease(frame, ZOOM + 14, ZOOM + 30);
  return (
    <Finish dust={0.25}>
      <Img
        src={staticFile(img("d_needle2"))}
        style={{
          position: "absolute",
          width: 1920,
          height: 1080,
          filter: "blur(10px) brightness(0.22) saturate(0.6)",
          scale: String(1.1),
        }}
      />
      <AbsoluteFill
        style={{
          opacity: gOut,
          transformOrigin: "1500px 560px",
          scale: String(z),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 160,
            top: 180,
            ...MONO,
            fontSize: 20,
            color: "#fff",
            opacity: 0.7,
          }}
        >
          ONE RECORD · TIMELINE
        </div>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <line
            x1={X0}
            y1={560}
            x2={X1}
            y2={560}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={1}
          />
          {[XV, XC].map((x) => (
            <line
              key={x}
              x1={x}
              y1={330}
              x2={x}
              y2={790}
              stroke="rgba(255,255,255,0.25)"
              strokeDasharray="4 6"
            />
          ))}
          {BARS.map((b) => {
            const lit = b.x <= head;
            const c = b.brk ? RED : "#fff";
            return (
              <rect
                key={b.x}
                x={b.x - 2.5}
                y={560 - b.a / 2}
                width={5}
                height={b.a}
                rx={2}
                fill={lit ? c : "rgba(255,255,255,0.18)"}
                opacity={lit ? 0.95 : 1}
              />
            );
          })}
          <line
            x1={head}
            y1={300}
            x2={head}
            y2={820}
            stroke={COLOR.gold}
            strokeWidth={3}
            style={{ filter: `drop-shadow(0 0 8px ${COLOR.gold})` }}
          />
        </svg>
        {SEGS.map((s, i) => {
          const at = 20 + ((s.from - X0) / (X1 - X0)) * 130;
          const brk = i === 2;
          return (
            <div
              key={s.word}
              style={{
                position: "absolute",
                left: s.x - 300,
                width: 600,
                top: 330,
                textAlign: "center",
              }}
            >
              <Slam at={Math.round(at)}>
                <span
                  style={{
                    ...ANTON,
                    fontSize: brk ? 120 : 90,
                    color: brk ? RED : COLOR.white,
                  }}
                >
                  {s.word}
                </span>
              </Slam>
              {i < 2 && frame >= at + 6 ? (
                <span
                  style={{
                    position: "absolute",
                    right: -30,
                    top: 30,
                    ...ANTON,
                    fontSize: 60,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  →
                </span>
              ) : null}
            </div>
          );
        })}
        {/* the gaps in the break */}
        {[0, 1, 2].map((k) => {
          const x = XC + 25 + k * 80 + 160;
          const t = ease(frame, 150 + k * 4, 160 + k * 4);
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: x - 40,
                width: 80,
                top: 600,
                textAlign: "center",
                opacity: t,
                ...MONO,
                fontSize: 16,
                color: COLOR.gold,
              }}
            >
              SPACE
            </div>
          );
        })}
      </AbsoluteFill>
      {frame >= ZOOM + 10 ? (
        <AbsoluteFill style={{ opacity: imgIn }}>
          <Sequence from={ZOOM + 10}>
            <Rig
              keys={[
                { f: 0, s: 1.45, x: 1120, y: 700 },
                { f: 70, s: 1.15, x: 1060, y: 640, e: "smooth" },
              ]}
            >
              <Plate src={img("d_jam")} filter={WARM} />
            </Rig>
          </Sequence>
          <AbsoluteFill style={{ background: SHADE }} />
          <ReconTag />
        </AbsoluteFill>
      ) : null}
      <Sequence from={ZOOM + 34} layout="none">
        <Pair
          thin="that space is where dancers start"
          heavy="making decisions."
          at={0}
          y={760}
          size={160}
        />
      </Sequence>
      {SEGS.map((s) => (
        <Sfx
          key={s.word}
          name="tick"
          at={Math.round(20 + ((s.from - X0) / (X1 - X0)) * 130)}
          volume={0.35}
        />
      ))}
      <Sfx name="whoosh" at={ZOOM + 6} volume={0.5} />
      <Sfx name="hit" at={ZOOM + 30} volume={0.35} />
    </Finish>
  );
};

// A target circle that snaps onto a point, with a label line (world coordinates inside a Rig)
const Lock: React.FC<{
  x: number;
  y: number;
  at: number;
  label: string;
  red?: boolean;
  dir?: 1 | -1;
}> = ({ x, y, at, label, red, dir = 1 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  const r = 34 + 60 * Math.exp(-t / 4);
  const c = red ? RED : "#fff";
  const lt = ease(frame, at + 6, at + 14);
  const lx = x + dir * 70;
  const ly = y - 70;
  return (
    <>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        <g
          stroke={c}
          fill="none"
          strokeWidth={2.5}
          style={{
            filter: `drop-shadow(0 0 5px ${red ? RED : "rgba(0,0,0,0.8)"})`,
          }}
        >
          <circle cx={x} cy={y} r={r} />
          {[0, 90, 180, 270].map((a) => (
            <line
              key={a}
              x1={x + (r - 8) * Math.cos((a * Math.PI) / 180)}
              y1={y + (r - 8) * Math.sin((a * Math.PI) / 180)}
              x2={x + (r + 12) * Math.cos((a * Math.PI) / 180)}
              y2={y + (r + 12) * Math.sin((a * Math.PI) / 180)}
            />
          ))}
          <line
            x1={x + dir * r * 0.7}
            y1={y - r * 0.7}
            x2={x + dir * 34 + (lx - x - dir * 34) * lt}
            y2={y - 34 + (ly - y + 34) * lt}
          />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: dir === 1 ? lx : undefined,
          right: dir === -1 ? 1920 - lx : undefined,
          top: ly - 44,
          opacity: lt,
          ...MONO,
          fontSize: 26,
          color: red ? "#fff" : "#111",
          background: red ? RED : "rgba(255,255,255,0.92)",
          padding: "6px 14px",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </>
  );
};

// 07 — "Early DJs noticed those reactions. They noticed when the floor changed. They noticed which
// sections made dancers wait, rush toward the circle, or suddenly become more aggressive…"
// From over the DJ's shoulder into his eye-line: targets lock onto what he's reading on the floor.
const D7_A = 75;
export const D07Noticed: React.FC = () => {
  const frame = useCurrentFrame();
  const b = frame - D7_A;
  const box = ease(frame, D7_A + 12, D7_A + 24);
  return (
    <Finish dust={0.3}>
      <Sequence durationInFrames={D7_A}>
        <Rig
          keys={[
            { f: 0, s: 1.15, x: 700, y: 500 },
            { f: D7_A, s: 1.45, x: 1150, y: 560, e: "smooth" },
          ]}
          whipOut={1}
        >
          <Plate src={img("d_booth")} filter={WARM} />
        </Rig>
        <AbsoluteFill style={{ background: SHADE }} />
        <Pair
          thin="early DJs noticed"
          heavy="those reactions."
          at={8}
          y={760}
          size={160}
        />
      </Sequence>
      <Sequence from={D7_A}>
        <Rig
          keys={[
            { f: 0, s: 1.15, x: 1150, y: 700 },
            { f: 52, s: 1.15, x: 1130, y: 700, e: "drift" },
            { f: 70, s: 1.6, x: 380, y: 600, e: "ramp" },
            { f: 112, s: 1.62, x: 390, y: 600, e: "drift" },
            { f: 130, s: 1.6, x: 1720, y: 640, e: "ramp" },
            { f: 172, s: 1.62, x: 1710, y: 640, e: "drift" },
            { f: 190, s: 1.7, x: 1120, y: 700, e: "ramp" },
            { f: 250, s: 1.74, x: 1120, y: 700, e: "drift" },
            { f: 285, s: 1.05, x: 960, y: 560, e: "smooth" },
          ]}
          whipIn={1}
          blurScale={0.5}
        >
          <Plate src={img("d_jam")} filter={WARM} />
          {b >= 12 ? (
            <svg
              width={1920}
              height={1080}
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              <g stroke="#fff" strokeWidth={3} fill="none" opacity={box}>
                {(() => {
                  const g = (1 - box) * 60;
                  const [x0, y0, x1, y1] = [
                    560 - g,
                    690 - g,
                    1720 + g,
                    950 + g,
                  ];
                  const L = 60;
                  return (
                    <>
                      <path d={`M ${x0} ${y0 + L} V ${y0} H ${x0 + L}`} />
                      <path d={`M ${x1 - L} ${y0} H ${x1} V ${y0 + L}`} />
                      <path d={`M ${x0} ${y1 - L} V ${y1} H ${x0 + L}`} />
                      <path d={`M ${x1 - L} ${y1} H ${x1} V ${y1 - L}`} />
                    </>
                  );
                })()}
              </g>
            </svg>
          ) : null}
          {b >= 18 ? (
            <div
              style={{
                position: "absolute",
                left: 580,
                top: 640,
                ...MONO,
                fontSize: 24,
                color: "#111",
                background: "rgba(255,255,255,0.92)",
                padding: "5px 12px",
                opacity: ease(frame, D7_A + 18, D7_A + 26),
              }}
            >
              THE FLOOR CHANGES
            </div>
          ) : null}
          <Sequence from={74} layout="none">
            <Lock x={360} y={580} at={0} label="WAIT" />
          </Sequence>
          <Sequence from={134} layout="none">
            <Lock x={1780} y={620} at={0} label="RUSH THE CIRCLE" dir={-1} />
          </Sequence>
          <Sequence from={194} layout="none">
            <Lock x={1120} y={690} at={0} label="MORE AGGRESSIVE" red />
          </Sequence>
        </Rig>
        <AbsoluteFill style={{ background: SHADE }} />
        <Sequence durationInFrames={66} layout="none">
          <CaptionAt
            text="they noticed when the floor changed"
            start={4}
            y={940}
            size={42}
          />
        </Sequence>
        <Sequence from={68} durationInFrames={190} layout="none">
          <CaptionAt
            text="which sections made dancers…"
            start={0}
            y={940}
            size={42}
          />
        </Sequence>
        <Hud
          date="THE BRONX · 1970s"
          rec={false}
          label="DJ'S EYE-LINE"
          opacity={0.85}
        />
      </Sequence>
      <ReconTag />
      <Sfx name="whoosh" at={D7_A - 6} volume={0.4} />
      <Sfx name="tick" at={D7_A + 12} volume={0.3} />
      {[74, 134, 194].map((f) => (
        <React.Fragment key={f}>
          <Sfx name="whoosh" at={D7_A + f - 6} volume={0.2} />
          <Sfx name="tick" at={D7_A + f} volume={0.35} />
        </React.Fragment>
      ))}
      <Sfx name="hit" at={D7_A + 196} volume={0.35} />
    </Finish>
  );
};

// 08 — "…a Jamaican-born teenager named Clive Campbell." ON SCREEN: CLIVE CAMPBELL / DJ KOOL HERC.
// Typography only (no face is given his name): Kingston → the Bronx on tape, a black bar slides off
// the name, then DJ KOOL HERC on a red torn band.
const NAME_AT = 84;
export const D08Herc: React.FC = () => {
  const frame = useCurrentFrame();
  const route = interpolate(frame, [20, 42], [0, 1], clamp);
  const bar = ease(frame, NAME_AT, NAME_AT + 12);
  return (
    <Finish dust={0.4}>
      <Rig
        keys={[
          { f: 0, s: 1.2, x: 1100, y: 580 },
          { f: 240, s: 1.36, x: 1150, y: 600, e: "drift" },
        ]}
      >
        <Plate src={img("d_needle2")} filter={`${CRUSH} brightness(0.6)`} />
      </Rig>
      <Flicker amount={0.05} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(6,6,6,0.55), rgba(6,6,6,0.85) 100%)",
        }}
      />
      <Tape
        text="Kingston, Jamaica"
        x={560}
        y={300}
        rot={-2}
        at={8}
        size={34}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line
          x1={800}
          y1={300}
          x2={800 + 380 * route}
          y2={300}
          stroke={RED}
          strokeWidth={4}
          strokeDasharray="14 10"
        />
        {route >= 1 ? (
          <path d="M 1166 286 L 1192 300 L 1166 314 Z" fill={RED} />
        ) : null}
      </svg>
      <Tape text="The Bronx" x={1360} y={300} rot={2} at={42} size={34} />
      <CaptionAt
        text="a Jamaican-born teenager named"
        start={50}
        y={420}
        size={42}
      />
      {frame >= NAME_AT ? (
        <div style={{ position: "absolute", left: 0, width: 1920, top: 490 }}>
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                ...ANTON,
                fontSize: 200,
                color: COLOR.white,
                textShadow: "0 10px 30px rgba(0,0,0,0.8)",
              }}
            >
              Clive Campbell
            </span>
          </div>
          {/* the black bar that slides off the name */}
          <div
            style={{
              position: "absolute",
              top: 10,
              height: 200,
              left: 260 + 1400 * bar,
              width: 1400 * (1 - bar),
              background: "#050505",
            }}
          />
        </div>
      ) : null}
      <TornBand at={140} y={860} h={150}>
        <span style={{ ...ANTON, fontSize: 120, color: "#fff", paddingTop: 6 }}>
          DJ Kool Herc
        </span>
      </TornBand>
      <LightSweep at={170} dur={40} angle={100} strength={0.12} />
      <Sfx name="tick" at={8} volume={0.3} />
      <Sfx name="tick" at={42} volume={0.3} />
      <Sfx name="whoosh" at={NAME_AT} volume={0.4} />
      <Sfx name="hit" at={NAME_AT + 8} volume={0.4} />
      <Sfx name="whoosh" at={136} volume={0.35} />
      <Sfx name="boom" at={142} volume={0.5} />
    </Finish>
  );
};
