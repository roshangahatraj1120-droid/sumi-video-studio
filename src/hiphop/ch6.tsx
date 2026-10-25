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
import { SplitPanels } from "../brand/fx";
import { Finish, Sfx } from "../laban/broll";
import { Plate, Rig } from "../laban3/rig";
import { LightSweep } from "../laban9/fx9";
import {
  ANTON,
  CRUSH,
  clamp,
  ease,
  img,
  MONO,
  Pair,
  ReconTag,
  RED,
  SHADE,
  Slam,
  Table,
  Tape,
  WARM,
} from "./kit";
import { TypeOn } from "./kit2";

// Hip-hop episode — Chapter 6 "There was no single inventor" (script part 7). 30 fps.
export const LEN6 = {
  n01: 180,
  n02: 300,
  n03: 270,
  n04: 240,
  n05: 240,
  n06: 300,
  n07: 270,
  n08: 210,
  n09: 600,
  n10: 270,
  n11: 270,
  n12: 330,
};

const Typed: React.FC<{
  text: string;
  at: number;
  y?: number;
  size?: number;
  cursor?: boolean;
}> = ({ text, at, y = 930, size = 42, cursor = true }) => (
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

// ---------- the network of names (world coordinates on a dark table) ----------
const NODES = [
  { t: "Herc", x: 960, y: 520, r: -2, at: 0, main: true },
  { t: "Cindy Campbell", x: 560, y: 300, r: -4, at: 0 },
  { t: "Coke La Rock", x: 1380, y: 280, r: 3, at: 0 },
  { t: "Bambaataa", x: 380, y: 560, r: 2, at: 0 },
  { t: "Flash", x: 1560, y: 540, r: -3, at: 0 },
  { t: "Theodore", x: 1430, y: 800, r: 4, at: 0 },
  { t: "Early dancers", x: 520, y: 820, r: -2, at: 0 },
  { t: "B-boys", x: 820, y: 900, r: 3, at: 0 },
  { t: "B-girls", x: 1140, y: 930, r: -4, at: 0 },
  { t: "Crews", x: 230, y: 330, r: 5, at: 0 },
];
const LINKS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [0, 8],
  [3, 9],
  [6, 7],
  [7, 8],
  [4, 5],
  [1, 2],
  [3, 6],
  [9, 1],
];
const Network: React.FC<{
  start: number;
  every?: number;
  lineFrom?: number;
  dim?: number;
  firstAt?: number;
}> = ({ start, every = 9, lineFrom, dim = 0, firstAt }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        {LINKS.map(([a, b], i) => {
          const at = (lineFrom ?? start) + Math.max(a, b) * every + 4;
          const p = interpolate(frame, [at, at + 12], [0, 1], clamp);
          if (p <= 0) return null;
          const A = NODES[a];
          const B = NODES[b];
          return (
            <line
              key={i}
              x1={A.x}
              y1={A.y}
              x2={A.x + (B.x - A.x) * p}
              y2={A.y + (B.y - A.y) * p}
              stroke={
                a === 0 ? "rgba(245,242,235,0.9)" : "rgba(229,50,45,0.75)"
              }
              strokeWidth={a === 0 ? 7 : 4}
              strokeLinecap="square"
              opacity={1 - dim}
            />
          );
        })}
      </svg>
      {NODES.map((n, i) => (
        <Tape
          key={n.t}
          text={n.t}
          x={n.x}
          y={n.y}
          rot={n.r}
          at={i === 0 && firstAt !== undefined ? firstAt : start + i * every}
          size={n.main ? 64 : 38}
        />
      ))}
    </>
  );
};

// ============ N01 — "This is where the 'who invented hip-hop?' question starts to fall apart."
const N1_BREAK = 80;
const Q = "WHO INVENTED HIP-HOP?";
export const N01Question: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Finish dust={0.35}>
      <Rig
        keys={[
          { f: 0, s: 1.1, x: 960, y: 540 },
          { f: 180, s: 1.2, x: 960, y: 560, e: "drift" },
        ]}
      >
        <Plate src={img("o_street")} filter={`${CRUSH} brightness(0.55)`} />
      </Rig>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 390,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {Q.split("").map((ch, i) => {
          const d = frame - (N1_BREAK + random(`d${i}`) * 26);
          const fall = d > 0 ? d : 0;
          const inP = ease(frame, 6 + i * 1.2, 14 + i * 1.2);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                ...ANTON,
                fontSize: 170,
                color: ch === "?" ? RED : "#fff",
                opacity: inP * (fall > 0 ? Math.max(0, 1 - fall / 40) : 1),
                translate: `${(random(`x${i}`) - 0.5) * fall * 6}px ${fall * fall * 0.6}px`,
                rotate: `${(random(`r${i}`) - 0.5) * fall * 4}deg`,
                textShadow: "0 8px 30px rgba(0,0,0,0.85)",
                minWidth: ch === " " ? 40 : undefined,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <Sequence from={N1_BREAK + 10} layout="none">
        <Typed
          text="this is where the question starts to fall apart."
          at={0}
          y={640}
          size={44}
        />
      </Sequence>
      <ReconTag />
      <Sfx name="hit" at={10} volume={0.3} />
      <Sfx name="glitch" at={N1_BREAK} volume={0.3} />
      <Sfx name="whoosh" at={N1_BREAK + 6} volume={0.3} />
    </Finish>
  );
};

// ============ N02 — GRAPHIC: HERC alone, then the frame expands to the whole network.
// "Herc is essential. But he was not alone."
const N2_PULL = 80;
export const N02Network: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Finish dust={0.25}>
      <AbsoluteFill
        style={{
          rotate: `${interpolate(frame, [0, 300], [3, -2])}deg`,
          scale: "1.1",
        }}
      >
        <Rig
          keys={[
            { f: 0, s: 2.6, x: 960, y: 520 },
            { f: N2_PULL, s: 2.5, x: 960, y: 520, e: "drift" },
            { f: N2_PULL + 70, s: 1.0, x: 960, y: 560, e: "smooth" },
            { f: 300, s: 1.02, x: 960, y: 560, e: "drift" },
          ]}
          blurScale={0.3}
        >
          <Table tone="felt" />
          <svg
            width={1920}
            height={1080}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <rect
              x={760}
              y={440}
              width={400}
              height={160}
              fill="none"
              stroke={COLOR.gold}
              strokeWidth={4}
              opacity={
                ease(frame, 10, 22) * (1 - ease(frame, N2_PULL, N2_PULL + 20))
              }
            />
          </svg>
          <Network start={N2_PULL} every={7} firstAt={6} />
        </Rig>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: SHADE }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,5,6,0.8) 0%, rgba(5,5,6,0) 26%)",
        }}
      />
      <Sequence durationInFrames={N2_PULL} layout="none">
        <Typed text="Herc is essential." at={12} y={900} size={50} />
      </Sequence>
      <Sequence from={N2_PULL + 80} layout="none">
        <Pair
          thin="but he was"
          heavy="not alone."
          at={0}
          y={34}
          size={120}
          color={RED}
        />
      </Sequence>
      <ReconTag />
      <Sfx name="tick" at={0} volume={0.3} />
      <Sfx name="whoosh" at={N2_PULL} volume={0.4} />
      {NODES.slice(1).map((_, i) => (
        <Sfx key={i} name="tick" at={N2_PULL + (i + 1) * 7} volume={0.2} />
      ))}
      <Sfx name="hit" at={N2_PULL + 82} volume={0.35} />
    </Finish>
  );
};

// A contributor card: tape name on an index card, three typed tags, over a moving photo
const Contributor: React.FC<{
  name: string;
  tags: string[];
  src: string;
  keys: {
    f: number;
    s: number;
    x: number;
    y: number;
    e?: "ramp" | "drift" | "smooth";
  }[];
  grade?: string;
  note?: string;
  shift?: number;
}> = ({ name, tags, src, keys, grade = WARM, note, shift = 0 }) => {
  const frame = useCurrentFrame();
  const card = ease(frame, 14, 30);
  return (
    <>
      <AbsoluteFill
        style={{
          translate: `${shift * 10}px 0px`,
          filter: shift ? `blur(${Math.abs(shift) * 1.5}px)` : undefined,
        }}
      >
        <Rig keys={keys}>
          <Plate src={img(src)} filter={grade} />
        </Rig>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,6,0.9) 0%, rgba(5,5,6,0.55) 40%, rgba(5,5,6,0) 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 300,
          opacity: card,
          translate: `${(1 - card) * -40}px 0px`,
        }}
      >
        <div
          style={{
            ...MONO,
            fontSize: 24,
            color: COLOR.gold,
            letterSpacing: "0.2em",
          }}
        >
          CONTRIBUTOR
        </div>
        <div
          style={{
            ...ANTON,
            fontSize: 150,
            color: "#fff",
            lineHeight: 0.95,
            marginTop: 10,
            maxWidth: 900,
          }}
        >
          {name}
        </div>
        <div
          style={{
            width: 420 * ease(frame, 26, 40),
            height: 6,
            background: RED,
            margin: "22px 0 26px",
          }}
        />
        {tags.map((t, i) => (
          <div
            key={t}
            style={{ fontSize: 34, color: "#fff", marginTop: 8, minHeight: 44 }}
          >
            <TypeOn text={`— ${t}`} at={40 + i * 22} cps={1.8} cursor={false} />
          </div>
        ))}
      </div>
      {note ? (
        <div
          style={{
            position: "absolute",
            left: 110,
            bottom: 70,
            ...MONO,
            fontSize: 20,
            color: "rgba(255,255,255,0.8)",
            maxWidth: 1100,
            opacity: ease(frame, 120, 135),
          }}
        >
          {note}
        </div>
      ) : null}
    </>
  );
};

// ============ N03 — "Afrika Bambaataa became important for musical selection, organization and the
// culture around crews." `withNote` adds a one-line factual note about the allegations against him.
export const N03Bambaataa: React.FC<{ withNote?: boolean }> = ({
  withNote = false,
}) => (
  <Finish dust={0.25}>
    <Contributor
      name="Afrika Bambaataa"
      tags={["musical selection", "organization", "the culture around crews"]}
      src="d_crate"
      keys={[
        { f: 0, s: 1.25, x: 1200, y: 520 },
        { f: 270, s: 1.42, x: 1250, y: 560, e: "smooth" },
      ]}
      note={
        withNote
          ? "Bambaataa has since faced serious sexual-abuse allegations, which he has denied."
          : undefined
      }
    />
    <ReconTag />
    <Sfx name="hit" at={16} volume={0.3} />
    {[0, 1, 2].map((i) => (
      <Sfx key={i} name="tick" at={40 + i * 22} volume={0.2} />
    ))}
  </Finish>
);

// ============ N04 — "Grandmaster Flash pushed turntable technique toward a new level of precision."
// Macro on the hand on the record with a precision HUD: reticle, ruler and a millisecond counter.
export const N04Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const ms = Math.floor((frame / 30) * 1000);
  const lock = ease(frame, 60, 80);
  return (
    <Finish dust={0.2}>
      <Contributor
        name="Grandmaster Flash"
        tags={["turntable technique", "a new level of precision"]}
        src="n8d"
        keys={[
          { f: 0, s: 1.2, x: 1300, y: 560 },
          { f: 240, s: 1.5, x: 1420, y: 600, e: "smooth" },
        ]}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <g stroke="#fff" fill="none" strokeWidth={2} opacity={0.9}>
          <circle cx={1500} cy={560} r={70 + (1 - lock) * 120} />
          <line x1={1500 - 110} y1={560} x2={1500 - 40} y2={560} />
          <line x1={1500 + 40} y1={560} x2={1500 + 110} y2={560} />
          <line x1={1500} y1={560 - 110} x2={1500} y2={560 - 40} />
          <line x1={1500} y1={560 + 40} x2={1500} y2={560 + 110} />
        </g>
        {Array.from({ length: 31 }).map((_, i) => (
          <line
            key={i}
            x1={1180 + i * 20}
            y1={900}
            x2={1180 + i * 20}
            y2={i % 5 === 0 ? 870 : 885}
            stroke="#fff"
            strokeWidth={1.5}
            opacity={0.8}
          />
        ))}
        <rect
          x={1180 + ((frame * 4) % 600)}
          y={860}
          width={4}
          height={50}
          fill={RED}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 1440,
          top: 940,
          ...MONO,
          fontSize: 30,
          color: COLOR.gold,
        }}
      >{`00:0${Math.floor(ms / 1000) % 10}.${String(ms % 1000).padStart(3, "0")}`}</div>
      <div
        style={{
          position: "absolute",
          left: 1600,
          top: 470,
          ...MONO,
          fontSize: 22,
          color: "#111",
          background: "rgba(255,255,255,0.92)",
          padding: "4px 10px",
          opacity: lock,
        }}
      >
        PRECISION
      </div>
      <ReconTag />
      <Sfx name="hit" at={16} volume={0.3} />
      <Sfx name="tick" at={78} volume={0.35} />
    </Finish>
  );
};

// ============ N05 — "Grand Wizzard Theodore became associated with innovations including scratching."
// The vinyl rocks back and forth with a scrubbing waveform.
export const N05Theodore: React.FC = () => {
  const frame = useCurrentFrame();
  const rock = Math.sin(frame / 3.2) * (frame > 70 ? 1 : 0);
  const pts: string[] = [];
  for (let x = 1050; x <= 1820; x += 6) {
    const k = (x - 1050) / 770;
    const env = frame > 70 ? Math.sin(k * Math.PI) : 0.1;
    pts.push(
      `${x},${(780 + Math.sin(x / 9 + frame * 0.9 * Math.sign(rock || 1)) * 50 * env * Math.abs(rock)).toFixed(1)}`,
    );
  }
  return (
    <Finish dust={0.3}>
      <Contributor
        name="Grand Wizzard Theodore"
        tags={["innovations including", "scratching"]}
        src="x_vinyl"
        grade="contrast(1.1)"
        keys={[
          { f: 0, s: 1.15, x: 760, y: 700 },
          { f: 240, s: 1.3, x: 760, y: 720, e: "smooth" },
        ]}
        shift={rock}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <path
          d={`M ${pts.join(" L ")}`}
          fill="none"
          stroke={RED}
          strokeWidth={4}
          style={{ filter: `drop-shadow(0 0 8px ${RED})` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 1060,
          top: 860,
          ...MONO,
          fontSize: 24,
          color: "#fff",
          opacity: ease(frame, 72, 82),
        }}
      >
        {rock > 0 ? "▶ FORWARD" : "◀ BACK"} · SCRATCH
      </div>
      <ReconTag />
      <Sfx name="hit" at={16} volume={0.3} />
      <Sfx name="glitch" at={72} volume={0.25} />
    </Finish>
  );
};

// ============ N06 — "MCs moved from announcements and crowd control toward rhythmic routines, rhymes and
// performance." Speech bars that are ragged and off-beat line up onto a beat grid.
export const N06MCs: React.FC = () => {
  const frame = useCurrentFrame();
  const lock = interpolate(frame, [130, 190], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const n = 16;
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.1, x: 960, y: 500 },
          { f: 300, s: 1.22, x: 980, y: 480, e: "smooth" },
        ]}
      >
        <Plate src={img("o_party")} filter={`${CRUSH} brightness(0.5)`} />
      </Rig>
      <AbsoluteFill style={{ background: "rgba(5,5,6,0.45)" }} />
      <div style={{ position: "absolute", left: 110, top: 120 }}>
        <div
          style={{
            ...MONO,
            fontSize: 24,
            color: COLOR.gold,
            letterSpacing: "0.2em",
          }}
        >
          THE MC
        </div>
        <div style={{ ...ANTON, fontSize: 110, color: "#fff" }}>
          {lock < 0.5 ? "Announcements" : "Rhythmic routines"}
        </div>
        <div
          style={{
            ...MONO,
            fontSize: 28,
            color: lock < 0.5 ? "rgba(255,255,255,0.8)" : RED,
          }}
        >
          {lock < 0.5 ? "CROWD CONTROL" : "RHYMES · PERFORMANCE"}
        </div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {Array.from({ length: n }).map((_, i) => {
          const gx = 220 + i * 95;
          const rx = gx + (random(`ox${i}`) - 0.5) * 70;
          const x = rx + (gx - rx) * lock;
          const hr = 40 + random(`h${i}`) * 220;
          const hg = i % 4 === 0 ? 260 : i % 2 === 0 ? 170 : 110;
          const h = hr + (hg - hr) * lock;
          const show = ease(frame, 20 + i * 4, 28 + i * 4);
          return (
            <rect
              key={i}
              x={x - 18}
              y={760 - h * show}
              width={36}
              height={h * show}
              fill={lock > 0.5 ? RED : COLOR.gold}
            />
          );
        })}
        {Array.from({ length: n }).map((_, i) => (
          <line
            key={`g${i}`}
            x1={220 + i * 95}
            y1={460}
            x2={220 + i * 95}
            y2={790}
            stroke="rgba(255,255,255,0.35)"
            strokeDasharray="4 8"
            opacity={lock}
          />
        ))}
        <line
          x1={160}
          y1={760}
          x2={1760}
          y2={760}
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={2}
        />
      </svg>
      <Typed
        text="MCs moved from announcements and crowd control toward…"
        at={6}
        y={850}
        size={38}
        cursor={false}
      />
      <ReconTag />
      <Sfx name="whoosh" at={130} volume={0.3} />
      <Sfx name="hit" at={190} volume={0.35} />
    </Finish>
  );
};

// ============ N07 — "B-boys, B-girls and crews kept developing breaking through circles, battles and
// shared movement."
const PanelPhoto: React.FC<{
  src: string;
  s: number;
  x: number;
  y: number;
}> = ({ src, s, x, y }) => (
  <Rig
    keys={[
      { f: 0, s, x, y },
      { f: 270, s: s + 0.12, x, y, e: "drift" },
    ]}
  >
    <Plate src={img(src)} filter={WARM} />
  </Rig>
);
const PL: React.FC<{ top: string; main: string }> = ({ top, main }) => (
  <div>
    <div
      style={{
        ...TYPE.body,
        fontWeight: 300,
        fontSize: 28,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "#fff",
      }}
    >
      {top}
    </div>
    <div
      style={{
        ...ANTON,
        fontSize: 80,
        color: "#fff",
        textShadow: "0 6px 20px rgba(0,0,0,0.9)",
      }}
    >
      {main}
    </div>
  </div>
);
export const N07Circles: React.FC = () => (
  <Finish dust={0.25}>
    <SplitPanels
      panels={[
        {
          start: 0,
          node: <PanelPhoto src="k5" s={1.5} x={850} y={600} />,
          label: <PL top="B-boys" main="Circles" />,
        },
        {
          start: 40,
          node: <PanelPhoto src="k9" s={1.45} x={960} y={560} />,
          label: <PL top="B-girls" main="Battles" />,
        },
        {
          start: 80,
          node: <PanelPhoto src="k8" s={1.3} x={1000} y={600} />,
          label: <PL top="Crews" main="Shared movement" />,
        },
      ]}
    />
    <Typed
      text="kept developing breaking through"
      at={130}
      y={90}
      size={40}
      cursor={false}
    />
    <ReconTag />
    {[0, 40, 80].map((f) => (
      <Sfx key={f} name="whoosh" at={f} volume={0.25} />
    ))}
  </Finish>
);

// ============ N08 — "And none of them were creating in isolation." Every name in its own taped box,
// apart; then the boxes break and the lines join.
export const N08Isolation: React.FC = () => {
  const frame = useCurrentFrame();
  const join = 100;
  const boxOp = 1 - ease(frame, join, join + 10);
  return (
    <Finish dust={0.25}>
      <AbsoluteFill style={{ scale: "1.06" }}>
        <Table tone="felt" />
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          {NODES.map((n) => (
            <rect
              key={n.t}
              x={n.x - 170}
              y={n.y - 50}
              width={340}
              height={100}
              fill="none"
              stroke="rgba(245,242,235,0.85)"
              strokeWidth={6}
              opacity={boxOp}
            />
          ))}
        </svg>
        <Network start={-200} lineFrom={join - 4} every={2} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: SHADE }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,5,6,0.8) 0%, rgba(5,5,6,0) 26%)",
        }}
      />
      <Sequence durationInFrames={join} layout="none">
        <Typed
          text="and none of them were creating"
          at={6}
          y={880}
          size={48}
          cursor={false}
        />
      </Sequence>
      <Sequence from={join + 10} layout="none">
        <Pair
          thin="none of them were creating"
          heavy="in isolation."
          at={0}
          y={34}
          size={120}
          color={RED}
        />
      </Sequence>
      <ReconTag />
      <Sfx name="glitch" at={join} volume={0.25} />
      <Sfx name="hit" at={join + 12} volume={0.35} />
    </Finish>
  );
};

// ============ N09 — "They were listening to records created before them. They were learning from
// neighborhoods around them. They were reacting to Caribbean sound culture, Black American music, Puerto
// Rican and Latino musical environments, technology, older social dances and each other."
// An influence map: everything flows into one centre, THE BRONX, 1970s.
const INF = [
  { t: "Records created before them", src: "x_records", a: -150, at: 10 },
  { t: "Neighborhoods around them", src: "n6", a: -110, at: 110 },
  { t: "Caribbean sound culture", src: "d_bass", a: -60, at: 210 },
  { t: "Black American music", src: "d_disco", a: -20, at: 260 },
  { t: "Puerto Rican & Latino music", src: "d_conga", a: 20, at: 310 },
  { t: "Technology", src: "x_cables", a: 70, at: 365 },
  { t: "Older social dances", src: "d_jam", a: 120, at: 410 },
  { t: "Each other", src: "k5", a: 165, at: 470 },
];
const CX = 960;
const CY = 560;
export const N09Influences: React.FC = () => {
  const frame = useCurrentFrame();
  const camS = interpolate(frame, [0, 600], [1.12, 1.0], clamp);
  return (
    <Finish dust={0.25}>
      <AbsoluteFill style={{ backgroundColor: "#0D0C0B" }} />
      <AbsoluteFill style={{ scale: String(camS) }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          {INF.map((n, i) => {
            const r = 440;
            const x = CX + Math.cos((n.a * Math.PI) / 180) * r * 1.5;
            const y = CY + Math.sin((n.a * Math.PI) / 180) * r * 0.85;
            const p = interpolate(frame, [n.at + 8, n.at + 26], [0, 1], clamp);
            if (p <= 0) return null;
            return (
              <line
                key={i}
                x1={x}
                y1={y}
                x2={x + (CX - x) * p}
                y2={y + (CY - y) * p}
                stroke={i % 2 === 0 ? COLOR.gold : RED}
                strokeWidth={4}
                strokeDasharray="4 12"
                strokeDashoffset={-frame * 2}
                style={{
                  filter: `drop-shadow(0 0 6px ${i % 2 === 0 ? COLOR.gold : RED})`,
                }}
              />
            );
          })}
        </svg>
        {/* centre */}
        <div
          style={{
            position: "absolute",
            left: CX - 170,
            top: CY - 170,
            width: 340,
            height: 340,
            borderRadius: 170,
            overflow: "hidden",
            border: `6px solid ${RED}`,
            boxShadow: `0 0 40px rgba(229,50,45,0.5)`,
          }}
        >
          <Img
            src={staticFile(img("o_party"))}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: WARM,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: CX - 300,
            width: 600,
            top: CY + 180,
            textAlign: "center",
            ...ANTON,
            fontSize: 52,
            color: "#fff",
          }}
        >
          The Bronx · 1970s
        </div>
        {INF.map((n, i) => {
          const x = CX + Math.cos((n.a * Math.PI) / 180) * 440 * 1.5;
          const y = CY + Math.sin((n.a * Math.PI) / 180) * 440 * 0.85;
          const p = interpolate(frame, [n.at, n.at + 10], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.back(1.6)),
          });
          if (p <= 0) return null;
          return (
            <div
              key={n.t}
              style={{
                position: "absolute",
                left: x - 160,
                top: y - 120,
                width: 320,
                textAlign: "center",
                scale: String(p),
              }}
            >
              <div
                style={{
                  width: 280,
                  height: 180,
                  margin: "0 auto",
                  overflow: "hidden",
                  border: "5px solid #F2EEE6",
                  boxShadow: "0 14px 30px rgba(0,0,0,0.6)",
                  rotate: `${(random(`q${i}`) - 0.5) * 8}deg`,
                }}
              >
                <Img
                  src={staticFile(img(n.src))}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: WARM,
                  }}
                />
              </div>
              <div
                style={{
                  ...MONO,
                  fontSize: 25,
                  color: "#fff",
                  marginTop: 10,
                  lineHeight: 1.25,
                }}
              >
                {n.t.toUpperCase()}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 50,
          textAlign: "center",
          ...MONO,
          fontSize: 28,
          color: COLOR.gold,
          letterSpacing: "0.2em",
        }}
      >
        {frame < 200
          ? "THEY WERE LISTENING · LEARNING"
          : "THEY WERE REACTING TO"}
      </div>
      <ReconTag />
      {INF.map((n) => (
        <Sfx key={n.at} name="tick" at={n.at} volume={0.25} />
      ))}
    </Finish>
  );
};

// ============ N10 — "That is why a culture is harder to date than a record release."
// A record has one release date (a stamp); a culture's date won't settle (rolling digits).
export const N10Date: React.FC = () => {
  const frame = useCurrentFrame();
  const stamp = ease(frame, 40, 48);
  const roll = (i: number) => {
    const v = Math.floor(frame / (2 + i) + i * 3) % 10;
    return frame > 230 ? "?" : String(v);
  };
  return (
    <Finish dust={0.25}>
      <AbsoluteFill style={{ backgroundColor: "#0C0B0A" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 958,
          height: 1080,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(img("x_records"))}
          style={{
            position: "absolute",
            width: 1920,
            height: 1080,
            left: -400,
            filter: `${WARM} brightness(0.7)`,
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
        }}
      >
        <Img
          src={staticFile(img("n1"))}
          style={{
            position: "absolute",
            width: 1920,
            height: 1080,
            left: -700,
            filter: `${WARM} brightness(0.6)`,
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
      <div style={{ position: "absolute", left: 80, top: 120 }}>
        <div style={{ ...MONO, fontSize: 26, color: COLOR.gold }}>A RECORD</div>
        <div style={{ ...ANTON, fontSize: 90, color: "#fff" }}>
          One release date
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 520,
          rotate: "-7deg",
          opacity: stamp,
          scale: String(1.5 - 0.5 * stamp),
        }}
      >
        <div
          style={{
            ...ANTON,
            fontSize: 96,
            color: RED,
            border: `8px solid ${RED}`,
            padding: "0 24px",
          }}
        >
          Released
        </div>
      </div>
      <div style={{ position: "absolute", left: 1040, top: 120 }}>
        <div style={{ ...MONO, fontSize: 26, color: COLOR.gold }}>
          A CULTURE
        </div>
        <div style={{ ...ANTON, fontSize: 90, color: "#fff" }}>
          Harder to date
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1040,
          top: 470,
          display: "flex",
          gap: 10,
          opacity: ease(frame, 60, 70),
        }}
      >
        {["1", "9", "x", "y"].map((d, i) => (
          <div
            key={i}
            style={{
              width: 160,
              height: 220,
              background: "#141210",
              border: "3px solid rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...ANTON,
              fontSize: 180,
              color: i > 1 ? RED : "#fff",
            }}
          >
            {i < 2 ? d : roll(i)}
          </div>
        ))}
      </div>
      <Typed
        text="that is why a culture is harder to date than a record release."
        at={130}
        y={900}
        size={42}
      />
      <ReconTag />
      <Sfx name="hit" at={40} volume={0.4} />
      <Sfx name="tick" at={60} volume={0.2} />
    </Finish>
  );
};

// ============ N11 — B-ROLL hands on cables / records / dancers entering the circle:
// "It is not one person handing the world a finished product." Smash cuts of many hands; a FINISHED
// PRODUCT tag gets torn off.
const HANDS = [
  { src: "n8b", x: 960, y: 500 },
  { src: "x_cables", x: 1300, y: 600 },
  { src: "b21", x: 960, y: 540 },
  { src: "n8d", x: 1300, y: 560 },
  { src: "d_crate", x: 600, y: 500 },
  { src: "k1", x: 420, y: 560 },
];
export const N11NotOnePerson: React.FC = () => {
  const frame = useCurrentFrame();
  const k = Math.min(HANDS.length - 1, Math.floor(frame / 22));
  const h = HANDS[k];
  const local = frame - k * 22;
  const tear = ease(frame, 170, 182);
  return (
    <Finish dust={0.3}>
      <Sequence from={k * 22} key={k}>
        <Rig
          keys={[
            { f: 0, s: 1.35, x: h.x, y: h.y },
            {
              f: k === HANDS.length - 1 ? 270 - k * 22 : 22,
              s: 1.45,
              x: h.x,
              y: h.y,
              e: "drift",
            },
          ]}
        >
          <Plate
            src={img(h.src)}
            filter={k % 2 === 0 ? WARM : `${CRUSH} brightness(0.9)`}
          />
        </Rig>
      </Sequence>
      {local < 2 && k > 0 ? (
        <AbsoluteFill style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
      ) : null}
      <AbsoluteFill style={{ background: SHADE }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,5,6,0.8) 0%, rgba(5,5,6,0) 26%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 720,
          textAlign: "center",
        }}
      >
        <Slam at={10}>
          <span
            style={{
              ...ANTON,
              fontSize: 130,
              color: "#fff",
              textShadow: "0 8px 30px rgba(0,0,0,0.85)",
            }}
          >
            Not one person
          </span>
        </Slam>
      </div>
      {frame >= 100 ? (
        <div
          style={{
            position: "absolute",
            left: 960 - 300,
            top: 300,
            width: 600,
            padding: "26px 30px",
            background: "#F2EEE4",
            rotate: `${-4 + tear * 30}deg`,
            translate: `${tear * 500}px ${tear * 600}px`,
            opacity: 1 - tear,
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ ...MONO, fontSize: 22, color: "#7A6F60" }}>
            HANDED TO THE WORLD AS:
          </div>
          <div style={{ ...ANTON, fontSize: 80, color: "#17130F" }}>
            A finished product
          </div>
        </div>
      ) : null}
      <ReconTag />
      {HANDS.slice(1).map((_, i) => (
        <Sfx key={i} name="hit" at={(i + 1) * 22} volume={0.2} />
      ))}
      <Sfx name="tick" at={100} volume={0.3} />
      <Sfx name="whoosh" at={170} volume={0.35} />
    </Finish>
  );
};

// ============ N12 — "It is a network of people repeatedly changing the same environment."
// The network of names returns over the rec room itself; light pulses run along the lines, again and
// again, while the room keeps changing (grade and light shift with each pulse).
export const N12Environment: React.FC = () => {
  const frame = useCurrentFrame();
  const cycle = Math.floor(frame / 60);
  const grades = [
    WARM,
    "contrast(1.1) saturate(1.3) hue-rotate(-8deg)",
    `${CRUSH} brightness(0.8)`,
    "contrast(1.1) saturate(1.1) sepia(0.3)",
    WARM,
    WARM,
  ];
  const pulse = (frame % 60) / 60;
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.05, x: 960, y: 540 },
          { f: 330, s: 1.15, x: 960, y: 520, e: "smooth" },
        ]}
      >
        <Plate
          src={img("o_party")}
          filter={`${grades[cycle % grades.length]} brightness(0.55)`}
        />
      </Rig>
      <LightSweep at={cycle * 60} dur={40} angle={100} strength={0.12} />
      <AbsoluteFill style={{ background: "rgba(5,5,6,0.35)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {LINKS.map(([a, b], i) => {
          if (frame < 60) return null;
          const A = NODES[a];
          const B = NODES[b];
          const t = (pulse + i * 0.07) % 1;
          return (
            <circle
              key={i}
              cx={A.x + (B.x - A.x) * t}
              cy={A.y + (B.y - A.y) * t}
              r={9}
              fill={COLOR.gold}
              style={{ filter: `drop-shadow(0 0 8px ${COLOR.gold})` }}
            />
          );
        })}
      </svg>
      <Network start={6} every={4} />
      <AbsoluteFill style={{ background: SHADE }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,5,6,0.8) 0%, rgba(5,5,6,0) 26%)",
        }}
      />
      <Sequence from={90} layout="none">
        <Pair
          thin="it is a network of people repeatedly changing"
          heavy="the same environment."
          at={0}
          y={34}
          size={120}
        />
      </Sequence>
      <ReconTag />
      <Sfx name="drone" at={0} volume={0.2} />
      <Sfx name="hit" at={92} volume={0.35} />
    </Finish>
  );
};
