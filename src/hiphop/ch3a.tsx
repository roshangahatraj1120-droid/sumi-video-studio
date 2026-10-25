import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";
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
  Print,
  ReconTag,
  RED,
  SHADE,
  Slam,
  Table,
  Tape,
  WARM,
} from "./kit";
import { TypeOn } from "./kit2";

// Hip-hop episode — Chapter 3 part 1 "Cindy, Herc and 1520 Sedgwick" (script part 4). 30 fps.
export const LEN3A = {
  f01: 210,
  f02: 240,
  f03: 240,
  f04: 240,
  f05: 210,
  f06: 300,
};

// ============ F01 — "Today, 1520 Sedgwick Avenue has become one of the most famous addresses in
// hip-hop history." Dusk push onto the towers, a pin drops, the address builds.
const PIN = { x: 1450, y: 430 };
export const F01Address: React.FC = () => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [34, 46], [-260, 0], {
    ...clamp,
    easing: Easing.out(Easing.bounce),
  });
  const rings = frame >= 46 ? ((frame - 46) % 30) / 30 : -1;
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.05, x: 960, y: 540 },
          { f: 30, s: 1.08, x: 1000, y: 530, e: "drift" },
          { f: 60, s: 1.5, x: 1300, y: 500, e: "ramp" },
          { f: 210, s: 1.58, x: 1310, y: 500, e: "drift" },
        ]}
        blurScale={0.5}
      >
        <Plate src={img("o_dusk")} filter="contrast(1.08) saturate(1.05)" />
        {frame >= 34 ? (
          <svg
            width={1920}
            height={1080}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              overflow: "visible",
            }}
          >
            {rings >= 0 ? (
              <ellipse
                cx={PIN.x}
                cy={PIN.y + 6}
                rx={14 + rings * 70}
                ry={5 + rings * 24}
                fill="none"
                stroke={RED}
                strokeWidth={3}
                opacity={1 - rings}
              />
            ) : null}
            <g
              transform={`translate(${PIN.x} ${PIN.y + drop})`}
              style={{ filter: `drop-shadow(0 0 10px ${RED})` }}
            >
              <path
                d="M 0 0 C -6 -14 -22 -26 -22 -44 A 22 22 0 1 1 22 -44 C 22 -26 6 -14 0 0 Z"
                fill={RED}
              />
              <circle cx={0} cy={-44} r={8} fill="#fff" />
            </g>
          </svg>
        ) : null}
      </Rig>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,6,0.85) 0%, rgba(5,5,6,0.5) 35%, rgba(5,5,6,0) 60%)",
          opacity: ease(frame, 50, 70),
        }}
      />
      <div style={{ position: "absolute", left: 120, top: 330 }}>
        <Slam at={64}>
          <span
            style={{
              ...ANTON,
              fontSize: 300,
              color: COLOR.white,
              textShadow: "0 12px 40px rgba(0,0,0,0.8)",
            }}
          >
            1520
          </span>
        </Slam>
        <div
          style={{ marginTop: 14, fontSize: 54, color: "#fff", minHeight: 70 }}
        >
          <TypeOn
            text="SEDGWICK AVENUE"
            at={74}
            cps={1.2}
            style={{ fontWeight: 500, letterSpacing: "0.12em" }}
          />
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 26,
            color: COLOR.gold,
            minHeight: 40,
          }}
        >
          <TypeOn text="THE BRONX, NEW YORK" at={92} cps={1.4} cursor={false} />
        </div>
        <div
          style={{
            marginTop: 34,
            display: "inline-block",
            ...MONO,
            fontSize: 22,
            color: "#111",
            background: "rgba(255,255,255,0.92)",
            padding: "6px 14px",
            opacity: ease(frame, 120, 132),
          }}
        >
          TODAY: ONE OF THE MOST FAMOUS ADDRESSES IN HIP-HOP
        </div>
      </div>
      <ReconTag />
      <Sfx name="whoosh" at={34} volume={0.4} />
      <Sfx name="hit" at={46} volume={0.3} />
      <Sfx name="boom" at={64} volume={0.45} />
      <Sfx name="tick" at={74} volume={0.2} />
    </Finish>
  );
};

// ============ F02 — "And the story is often told through DJ Kool Herc. But his sister, Cindy Campbell,
// belongs in the frame too." One print in a gold frame; a second slides in; the frame widens.
export const F02Frame: React.FC = () => {
  const frame = useCurrentFrame();
  const widen = ease(frame, 120, 146);
  // frame bracket: around print A only, then around both
  const fx0 = 960 - 340 - 30 - widen * 380;
  const fx1 = 960 + 340 + 30 + widen * 380;
  const slide = ease(frame, 96, 118);
  const roll = interpolate(frame, [0, 240], [-1.5, 1.2], clamp);
  return (
    <Finish dust={0.25}>
      <AbsoluteFill style={{ rotate: `${roll}deg`, scale: "1.06" }}>
        <Rig
          keys={[
            { f: 0, s: 1.35, x: 960, y: 520 },
            { f: 96, s: 1.42, x: 960, y: 520, e: "drift" },
            { f: 146, s: 1.0, x: 960, y: 540, e: "smooth" },
            { f: 240, s: 1.03, x: 960, y: 540, e: "drift" },
          ]}
          blurScale={0.3}
        >
          <Table tone="felt" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              translate: `${-380 * widen}px 0px`,
            }}
          >
            <Print
              src={img("n8a")}
              x={960}
              y={500}
              w={680}
              rot={-1.5}
              filter={WARM}
            />
            <Tape
              text="DJ Kool Herc"
              x={960}
              y={720}
              rot={-2}
              at={10}
              size={40}
            />
          </div>
          {frame >= 96 ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                translate: `${380 + (1 - slide) * 900}px 0px`,
              }}
            >
              <Print
                src={img("o_party")}
                x={960}
                y={500}
                w={680}
                rot={1.5}
                filter={WARM}
              />
              <Tape
                text="Cindy Campbell"
                x={960}
                y={720}
                rot={2}
                at={108}
                size={40}
              />
            </div>
          ) : null}
          <svg
            width={1920}
            height={1080}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <g
              stroke={COLOR.gold}
              strokeWidth={5}
              fill="none"
              style={{ filter: `drop-shadow(0 0 8px ${COLOR.gold})` }}
              opacity={ease(frame, 14, 26)}
            >
              {(() => {
                const y0 = 240;
                const y1 = 790;
                const L = 70;
                return (
                  <>
                    <path d={`M ${fx0} ${y0 + L} V ${y0} H ${fx0 + L}`} />
                    <path d={`M ${fx1 - L} ${y0} H ${fx1} V ${y0 + L}`} />
                    <path d={`M ${fx0} ${y1 - L} V ${y1} H ${fx0 + L}`} />
                    <path d={`M ${fx1 - L} ${y1} H ${fx1} V ${y1 - L}`} />
                  </>
                );
              })()}
            </g>
          </svg>
        </Rig>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence durationInFrames={96} layout="none">
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 900,
            textAlign: "center",
            fontSize: 44,
            color: "#fff",
            textShadow: "0 2px 10px rgba(0,0,0,0.9)",
          }}
        >
          <TypeOn
            text="the story is often told through DJ Kool Herc."
            at={6}
            cps={1.4}
          />
        </div>
      </Sequence>
      <Sequence from={150} layout="none">
        <Pair
          thin="but his sister, Cindy Campbell, belongs"
          heavy="in the frame too."
          at={0}
          y={800}
          size={130}
        />
      </Sequence>
      <ReconTag />
      <Sfx name="tick" at={10} volume={0.3} />
      <Sfx name="whoosh" at={96} volume={0.4} />
      <Sfx name="tick" at={108} volume={0.3} />
      <Sfx name="hit" at={146} volume={0.35} />
    </Finish>
  );
};

// Mirror-ball light flecks drifting across a room
const Flecks: React.FC<{ n?: number; speed?: number }> = ({
  n = 150,
  speed = 3.2,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const y = random(`fy${i}`) * 1080;
        const x =
          ((random(`fx${i}`) * 2400 +
            frame * speed * (0.7 + random(`fv${i}`) * 0.6)) %
            2400) -
          240;
        const s = 10 + random(`fs${i}`) * 22;
        const tw = 0.5 + 0.5 * Math.sin(frame / 4 + i);
        const hue = random(`fh${i}`);
        const c =
          hue < 0.6 ? "255,240,210" : hue < 0.8 ? "255,170,120" : "170,200,255";
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s * 0.8,
              rotate: "18deg",
              background: `rgba(${c},${0.35 + 0.5 * tw})`,
              boxShadow: `0 0 ${s}px rgba(${c},0.6)`,
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ============ F03 — "The Smithsonian preserves a disco ball used at parties thrown by Cindy and Herc
// in the recreation room of their apartment building." The rec room with mirror-ball light, and a
// museum label (text only: the real object photo can drop in later if it's Open Access).
export const F03DiscoBall: React.FC = () => {
  const frame = useCurrentFrame();
  const card = ease(frame, 40, 58);
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.15, x: 1100, y: 420 },
          { f: 240, s: 1.32, x: 1120, y: 380, e: "drift" },
        ]}
      >
        <Plate
          src={img("o_party")}
          filter="contrast(1.06) saturate(1.05) brightness(0.8)"
        />
      </Rig>
      <Flecks />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,6,0.8) 0%, rgba(5,5,6,0.35) 45%, rgba(5,5,6,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 300,
          width: 640,
          background: "#F2EEE6",
          padding: "34px 40px 36px",
          boxShadow: "0 30px 70px rgba(0,0,0,0.6)",
          opacity: card,
          translate: `0px ${(1 - card) * 60}px`,
          rotate: "-1deg",
        }}
      >
        <div
          style={{
            ...MONO,
            fontSize: 20,
            color: "#6B6256",
            letterSpacing: "0.22em",
          }}
        >
          PRESERVED BY THE SMITHSONIAN
        </div>
        <div
          style={{
            ...TYPE.headline,
            fontSize: 64,
            color: "#17130F",
            margin: "14px 0 10px",
          }}
        >
          Disco ball
        </div>
        <div
          style={{
            height: 3,
            width: 90 * ease(frame, 56, 70),
            background: RED,
            marginBottom: 18,
          }}
        />
        <div
          style={{
            ...TYPE.body,
            fontSize: 28,
            lineHeight: 1.45,
            color: "#2A241D",
          }}
        >
          Used at parties thrown by <b>Cindy Campbell</b> and{" "}
          <b>Clive “DJ Kool Herc” Campbell</b> in the recreation room of their
          apartment building.
        </div>
      </div>
      <LightSweep at={150} dur={50} angle={100} strength={0.12} />
      <ReconTag />
      <Sfx name="riser" at={10} volume={0.2} />
      <Sfx name="hit" at={44} volume={0.3} />
    </Finish>
  );
};

// ============ F04 — "On August 11, 1973, Cindy organized a back-to-school party there, with Herc
// handling the music." Overhead felt table: the rec-room floor plan draws itself in white tape.
const ROOM = { x0: 300, y0: 190, x1: 1620, y1: 900 };
export const F04Plan: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [8, 46], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const inner = interpolate(frame, [40, 62], [0, 1], clamp);
  const roll = interpolate(frame, [0, 240], [4, -3], clamp);
  return (
    <Finish dust={0.25}>
      <AbsoluteFill style={{ rotate: `${roll}deg`, scale: "1.12" }}>
        <Rig
          keys={[
            { f: 0, s: 2.0, x: 560, y: 300 },
            { f: 36, s: 1.9, x: 600, y: 320, e: "drift" },
            { f: 120, s: 1.0, x: 960, y: 540, e: "smooth" },
            { f: 240, s: 1.04, x: 960, y: 540, e: "drift" },
          ]}
          blurScale={0.3}
        >
          <Table tone="felt" />
          <svg
            width={1920}
            height={1080}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <g
              stroke="rgba(245,242,235,0.9)"
              fill="none"
              strokeLinecap="square"
            >
              <path
                d={`M ${ROOM.x0 + 260} ${ROOM.y0} H ${ROOM.x1} V ${ROOM.y1} H ${ROOM.x0} V ${ROOM.y0} H ${ROOM.x0 + 120}`}
                strokeWidth={14}
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - draw}
              />
              {/* the DJ corner and a divider, like masking tape on the floor */}
              <path
                d={`M 1180 ${ROOM.y0} V 470 H ${ROOM.x1}`}
                strokeWidth={10}
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - inner}
              />
              <path
                d={`M ${ROOM.x0} 640 H 640`}
                strokeWidth={10}
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - inner}
              />
            </g>
          </svg>
          <Tape
            text="Rec room · 1520 Sedgwick Ave"
            x={830}
            y={160}
            rot={-1}
            at={44}
            size={30}
          />
          <Print
            src={img("o_party")}
            x={760}
            y={560}
            w={560}
            rot={-4}
            at={62}
            filter={WARM}
          />
          <Print
            src={img("o_djsys")}
            x={1400}
            y={330}
            w={380}
            rot={5}
            at={84}
            filter={WARM}
          />
          <Tape
            text="Aug 11 · 1973"
            x={560}
            y={300}
            rot={-4}
            at={14}
            size={46}
          />
          <Tape
            text="Back-to-school party"
            x={760}
            y={800}
            rot={2}
            at={74}
            size={34}
          />
          <Tape
            text="Organized by Cindy"
            x={1180}
            y={720}
            rot={-3}
            at={104}
            size={34}
          />
          <Tape
            text="Music: Herc"
            x={1400}
            y={540}
            rot={4}
            at={116}
            size={34}
          />
          <svg
            width={1920}
            height={1080}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <path
              d="M 1090 700 Q 1000 660 960 600"
              fill="none"
              stroke={RED}
              strokeWidth={5}
              strokeDasharray="10 8"
              opacity={ease(frame, 106, 116)}
            />
            <path
              d="M 1400 500 L 1400 450"
              fill="none"
              stroke={RED}
              strokeWidth={5}
              strokeDasharray="10 8"
              opacity={ease(frame, 118, 128)}
            />
          </svg>
        </Rig>
      </AbsoluteFill>
      <ReconTag />
      <Sfx name="tick" at={14} volume={0.35} />
      <Sfx name="whoosh" at={40} volume={0.3} />
      <Sfx name="tick" at={62} volume={0.3} />
      <Sfx name="tick" at={84} volume={0.3} />
      <Sfx name="tick" at={104} volume={0.3} />
      <Sfx name="tick" at={116} volume={0.3} />
    </Finish>
  );
};

// ============ F05 — "But I think it's more useful to call it a window. A window into something that
// had already been forming." Up the dark stairwell toward the glowing doorway, then through it: the
// street scenes from earlier flicker past inside, and we land in the party.
const DOOR_IN = 92;
const INSIDE = ["n1", "n4", "n6", "n3", "o_party"];
export const F05Window: React.FC = () => {
  const frame = useCurrentFrame();
  const dive = interpolate(frame, [DOOR_IN - 14, DOOR_IN], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const t = frame - DOOR_IN;
  const idx = t < 0 ? -1 : Math.min(INSIDE.length - 1, Math.floor(t / 9));
  return (
    <Finish dust={0.3}>
      {t < 0 ? (
        <AbsoluteFill
          style={{
            scale: String(1 + 1.6 * dive),
            transformOrigin: "1530px 520px",
            filter: dive > 0 ? `blur(${dive * 10}px)` : undefined,
          }}
        >
          <Rig
            keys={[
              { f: 0, s: 1.6, x: 1440, y: 540 },
              { f: DOOR_IN, s: 1.9, x: 1500, y: 520, e: "smooth" },
            ]}
          >
            <Plate
              src={img("o_stair")}
              filter="contrast(1.08) brightness(0.9)"
            />
          </Rig>
          <AbsoluteFill style={{ background: SHADE }} />
          <Pair
            thin="it's more useful to call it a"
            heavy="window."
            at={14}
            y={760}
            size={190}
          />
        </AbsoluteFill>
      ) : (
        <Sequence from={DOOR_IN + idx * 9} key={idx}>
          <Rig
            keys={[
              {
                f: 0,
                s: idx === INSIDE.length - 1 ? 1.4 : 1.25,
                x: 960,
                y: 540,
              },
              {
                f: idx === INSIDE.length - 1 ? 210 - DOOR_IN - idx * 9 : 9,
                s: idx === INSIDE.length - 1 ? 1.12 : 1.32,
                x: 960,
                y: 540,
                e: "smooth",
              },
            ]}
          >
            <Plate src={img(INSIDE[idx])} filter={WARM} />
          </Rig>
        </Sequence>
      )}
      {t >= 0 && t < 4 ? (
        <AbsoluteFill
          style={{ backgroundColor: `rgba(255,200,130,${0.8 - t * 0.2})` }}
        />
      ) : null}
      {t >= 0 && idx < INSIDE.length - 1 && t % 9 < 2 ? (
        <AbsoluteFill style={{ backgroundColor: "rgba(255,230,190,0.25)" }} />
      ) : null}
      {t >= 40 ? (
        <AbsoluteFill
          style={{
            background: SHADE,
            opacity: ease(frame, DOOR_IN + 40, DOOR_IN + 50),
          }}
        />
      ) : null}
      <Sequence from={DOOR_IN + 46} layout="none">
        <Pair
          thin="a window into something that had"
          heavy="already been forming."
          at={0}
          y={770}
          size={140}
        />
      </Sequence>
      <ReconTag />
      <Sfx name="whoosh" at={DOOR_IN - 12} volume={0.5} />
      <Sfx name="hit" at={DOOR_IN} volume={0.35} />
      <Sfx name="hit" at={DOOR_IN + 46} volume={0.3} />
    </Finish>
  );
};

// ============ F06 — "Herc became known for focusing on the instrumental break – the percussion-heavy
// part of a record – and extending that energy by moving between records."
// Two turntables side by side, each with its record's timeline; the playhead plays one break, jumps to
// the same break on the other record, and back; a master timeline shows the break getting longer.
const SEG = { verse: 0.42, chorus: 0.78 }; // fractions where chorus and break start
const TL = { w: 760, h: 24 };
const Timeline: React.FC<{
  x: number;
  y: number;
  head: number;
  active: boolean;
  color: string;
  label: string;
}> = ({ x, y, head, active, color, label }) => (
  <div style={{ position: "absolute", left: x, top: y, width: TL.w }}>
    <div
      style={{
        ...MONO,
        fontSize: 20,
        color: "#fff",
        opacity: 0.85,
        marginBottom: 10,
      }}
    >
      {label}
    </div>
    <div
      style={{ position: "relative", height: TL.h, display: "flex", gap: 6 }}
    >
      <div style={{ flex: SEG.verse, background: "rgba(255,255,255,0.28)" }} />
      <div
        style={{
          flex: SEG.chorus - SEG.verse,
          background: "rgba(255,255,255,0.45)",
        }}
      />
      <div
        style={{
          flex: 1 - SEG.chorus,
          background: color,
          boxShadow: active ? `0 0 16px ${color}` : undefined,
          opacity: active ? 1 : 0.55,
        }}
      />
      {head >= 0 ? (
        <div
          style={{
            position: "absolute",
            left: head * TL.w - 2,
            top: -12,
            width: 4,
            height: TL.h + 24,
            background: COLOR.gold,
            boxShadow: `0 0 10px ${COLOR.gold}`,
          }}
        />
      ) : null}
    </div>
    <div
      style={{
        position: "relative",
        height: 34,
        ...MONO,
        fontSize: 22,
        color: "#fff",
        opacity: 0.7,
      }}
    >
      <span style={{ position: "absolute", left: 0, top: 6 }}>VERSE</span>
      <span
        style={{ position: "absolute", left: SEG.verse * TL.w + 4, top: 6 }}
      >
        CHORUS
      </span>
      <span
        style={{
          position: "absolute",
          left: SEG.chorus * TL.w + 8,
          top: 6,
          color,
          opacity: 1,
        }}
      >
        BREAK
      </span>
    </div>
  </div>
);
// which record is playing its break, frame by frame (A, B, A, B…)
const SWAPS = [100, 136, 168, 196, 222];
export const F06Break: React.FC = () => {
  const frame = useCurrentFrame();
  const split = ease(frame, 40, 56);
  // record A plays from the start to its break, then the break bounces between A and B
  let headA = -1;
  let headB = -1;
  let side = 0;
  if (frame < SWAPS[0]) {
    headA = interpolate(frame, [56, SWAPS[0]], [0.55, 1], clamp);
    if (frame < 56) headA = -1;
  } else {
    side = SWAPS.filter((s) => frame >= s).length % 2; // 1 = B
    const k = SWAPS.filter((s) => frame >= s).length - 1;
    const from = SWAPS[k];
    const to = SWAPS[k + 1] ?? 300;
    const h = interpolate(frame, [from, to], [SEG.chorus, 1], clamp);
    if (side === 1) headB = h;
    else headA = h;
  }
  const inBreak = frame >= 86;
  const master = Math.max(0, SWAPS.filter((s) => frame >= s).length);
  const masterGrow = (i: number) =>
    ease(frame, i === 0 ? 86 : SWAPS[i - 1], i === 0 ? 100 : SWAPS[i - 1] + 10);
  return (
    <Finish dust={0.25}>
      {/* full-frame hands cueing a record, then it splits into two decks */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920 - 960 * split,
            height: 1080,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -480 * split,
              top: 0,
              width: 1920,
              height: 1080,
            }}
          >
            <Rig
              keys={[
                { f: 0, s: 1.15, x: 960, y: 560 },
                { f: 300, s: 1.3, x: 960, y: 560, e: "drift" },
              ]}
            >
              <Plate src={img("n8d")} filter={WARM} />
            </Rig>
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow:
                side === 0 && inBreak ? `inset 0 0 0 6px ${RED}` : undefined,
            }}
          />
        </div>
        {split > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 1920 - 960 * split,
              top: 0,
              width: 960,
              height: 1080,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -480,
                top: 0,
                width: 1920,
                height: 1080,
              }}
            >
              <Rig
                keys={[
                  { f: 0, s: 1.2, x: 960, y: 560 },
                  { f: 300, s: 1.32, x: 980, y: 560, e: "drift" },
                ]}
              >
                <Plate src={img("n8a")} filter={WARM} />
              </Rig>
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 4,
                height: 1080,
                background: COLOR.gold,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                boxShadow:
                  side === 1 ? `inset 0 0 0 6px ${COLOR.gold}` : undefined,
              }}
            />
          </div>
        ) : null}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(5,5,6,0.92) 0%, rgba(5,5,6,0.6) 30%, rgba(5,5,6,0) 55%)",
        }}
      />
      {split > 0.5 ? (
        <>
          <Timeline
            x={100}
            y={700}
            head={headA}
            active={side === 0 && inBreak}
            color={RED}
            label="RECORD 1"
          />
          <Timeline
            x={1060}
            y={700}
            head={headB}
            active={side === 1}
            color={COLOR.gold}
            label="RECORD 2"
          />
        </>
      ) : null}
      {/* master: the break, extended */}
      {frame >= 86 ? (
        <div style={{ position: "absolute", left: 100, top: 880, width: 1720 }}>
          <div
            style={{
              ...MONO,
              fontSize: 20,
              color: "#fff",
              marginBottom: 10,
              opacity: 0.85,
            }}
          >
            ON THE DANCE FLOOR
          </div>
          <div style={{ display: "flex", gap: 4, height: 26 }}>
            {Array.from({ length: Math.min(6, master + 1) }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 280 * masterGrow(i),
                  background: i % 2 === 0 ? RED : COLOR.gold,
                  boxShadow: `0 0 12px ${i % 2 === 0 ? RED : COLOR.gold}`,
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
      {/* text beats */}
      <Sequence durationInFrames={84} layout="none">
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 120,
            textAlign: "center",
            fontSize: 40,
            color: "#fff",
            textShadow: "0 2px 10px rgba(0,0,0,0.9)",
          }}
        >
          <TypeOn
            text="Herc became known for focusing on"
            at={4}
            cps={1.5}
            cursor={false}
          />
        </div>
      </Sequence>
      <Sequence from={60} durationInFrames={110} layout="none">
        <Pair
          thin="the instrumental"
          heavy="break"
          at={0}
          y={110}
          size={170}
          color={RED}
        />
      </Sequence>
      <Sequence from={98} durationInFrames={72} layout="none">
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 330,
            textAlign: "center",
            ...MONO,
            fontSize: 24,
            color: "#111",
          }}
        >
          <span
            style={{
              background: "rgba(255,255,255,0.92)",
              padding: "6px 14px",
            }}
          >
            THE PERCUSSION-HEAVY PART OF A RECORD
          </span>
        </div>
      </Sequence>
      <Sequence from={174} layout="none">
        <Pair
          thin="extending that energy by moving between records"
          heavy="the break, extended."
          at={0}
          y={110}
          size={150}
        />
      </Sequence>
      <ReconTag />
      <Sfx name="tick" at={4} volume={0.2} />
      <Sfx name="whoosh" at={40} volume={0.35} />
      <Sfx name="hit" at={64} volume={0.35} />
      {SWAPS.map((s) => (
        <Sfx key={s} name="tick" at={s} volume={0.3} />
      ))}
      <Sfx name="hit" at={178} volume={0.35} />
    </Finish>
  );
};
