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
  clamp,
  ease,
  Flicker,
  img,
  MONO,
  Pair,
  ReconTag,
  RED,
  RewindFx,
  SHADE,
  Slam,
  Table,
  TornBand,
  WARM,
} from "./kit";
import { PhotocopyDefs, TypeOn } from "./kit2";

// Hip-hop episode — Chapter 4 "When the break became a dance space" (script part 5). 30 fps.
export const LEN4 = {
  g01: 240,
  g02: 240,
  g03: 210,
  g04: 150,
  g05: 360,
  g06: 360,
  g07: 300,
  g08: 240,
  g09: 300,
  g10: 300,
  g11: 360,
  g12: 300,
  g13: 270,
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
    <TypeOn text={text} at={at} cps={1.5} cursor={cursor} />
  </div>
);

// A waveform strip that thins out into the break: dense bars, then single hits with room between
const Wave: React.FC<{
  x: number;
  y: number;
  w: number;
  open: number;
  head?: number;
  color?: string;
}> = ({ x, y, w, open, head = -1, color = RED }) => {
  const n = Math.floor(w / 10);
  return (
    <svg
      width={w}
      height={260}
      style={{
        position: "absolute",
        left: x,
        top: y - 130,
        overflow: "visible",
      }}
    >
      {Array.from({ length: n }).map((_, i) => {
        const dense = 40 + random(`w${i}`) * 140;
        const k = i % 8;
        const sparse = k === 0 ? 200 : k === 4 ? 90 : 4;
        const a = dense + (sparse - dense) * open;
        const lit = head >= 0 && i / n <= head;
        return (
          <rect
            key={i}
            x={i * 10 + 2}
            y={130 - a / 2}
            width={5}
            height={a}
            rx={2}
            fill={lit ? color : "rgba(255,255,255,0.75)"}
          />
        );
      })}
    </svg>
  );
};

// ============ G01 — "Imagine you are dancing at a party. The record reaches the break – that stripped-
// down section where the rhythm suddenly has more room." The dancer steps into the circle, then a ramp
// to the needle; the record's waveform strips down and its bars spread apart.
const G1_CUT = 96;
export const G01Imagine: React.FC = () => {
  const frame = useCurrentFrame();
  const open = ease(frame, G1_CUT + 50, G1_CUT + 90);
  return (
    <Finish dust={0.3}>
      <Sequence durationInFrames={G1_CUT}>
        <Rig
          keys={[
            { f: 0, s: 1.35, x: 420, y: 560 },
            { f: G1_CUT, s: 1.18, x: 760, y: 520, e: "smooth" },
          ]}
          whipOut={1}
        >
          <Plate src={img("k1")} filter={WARM} />
        </Rig>
        <AbsoluteFill style={{ background: SHADE }} />
        <Typed
          text="imagine you are dancing at a party."
          at={8}
          y={920}
          size={50}
        />
      </Sequence>
      <Sequence from={G1_CUT}>
        <Rig
          keys={[
            { f: 0, s: 1.3, x: 1040, y: 640 },
            { f: 144, s: 1.55, x: 1060, y: 640, e: "smooth" },
          ]}
          whipIn={1}
        >
          <Plate src={img("k2")} filter="contrast(1.08) brightness(0.85)" />
        </Rig>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(0deg, rgba(5,5,6,0.9) 0%, rgba(5,5,6,0.5) 35%, rgba(5,5,6,0) 60%)",
          }}
        />
        <Wave x={260} y={760} w={1400} open={open} />
        <Pair
          thin="the record reaches"
          heavy="the break"
          at={14}
          y={110}
          size={170}
          color={RED}
        />
        <Sequence from={56} layout="none">
          <Typed
            text="where the rhythm suddenly has more room."
            at={0}
            y={930}
            size={42}
          />
        </Sequence>
      </Sequence>
      <ReconTag />
      <Sfx name="whoosh" at={G1_CUT - 6} volume={0.4} />
      <Sfx name="hit" at={G1_CUT + 18} volume={0.35} />
    </Finish>
  );
};

// ============ G02 — OVERLAY for DEMO 1: "And just when your body finds the moment… it is gone."
// Transparent lower third: a BREAK timer that runs 6 seconds and then snaps shut.
export const G02Gone: React.FC<{ bg: "green" | "alpha" | "preview" }> = ({
  bg,
}) => {
  const frame = useCurrentFrame();
  const green = bg === "green";
  const run = interpolate(frame, [20, 200], [0, 1], clamp);
  const sec = (run * 6).toFixed(1);
  const shut = ease(frame, 200, 210);
  const goneIn = ease(frame, 206, 220);
  const sh = green ? undefined : "0 3px 14px rgba(0,0,0,0.85)";
  return (
    <AbsoluteFill style={{ backgroundColor: green ? "#00FF00" : undefined }}>
      {bg === "preview" ? (
        <Img
          src={staticFile(img("k10"))}
          style={{
            position: "absolute",
            width: 1920,
            height: 1080,
            filter: "brightness(0.6)",
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 120,
          bottom: 110,
          width: 900,
          opacity: 1 - 0.4 * goneIn,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            ...MONO,
            fontSize: 30,
            color: "#fff",
            textShadow: sh,
            marginBottom: 12,
          }}
        >
          <span>
            <span style={{ color: RED }}>● </span>THE BREAK
          </span>
          <span>{shut >= 1 ? "0.0 s" : `${sec} s`}</span>
        </div>
        <div
          style={{
            position: "relative",
            height: 18,
            background: green ? "#1A1A1A" : "rgba(255,255,255,0.25)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 18,
              width: `${run * 100 * (1 - shut)}%`,
              background: RED,
            }}
          />
        </div>
      </div>
      {frame >= 206 ? (
        <div
          style={{
            position: "absolute",
            left: 120,
            bottom: 210,
            opacity: goneIn,
            translate: `0px ${(1 - goneIn) * 20}px`,
          }}
        >
          <div
            style={{
              ...TYPE.body,
              fontWeight: 300,
              fontSize: 40,
              letterSpacing: "0.12em",
              color: COLOR.white,
              textShadow: sh,
            }}
          >
            and just when your body finds the moment…
          </div>
          <div
            style={{
              ...ANTON,
              fontSize: 150,
              color: COLOR.white,
              textShadow: sh,
            }}
          >
            it is gone.
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ============ G03 — "Now imagine the DJ gives you that same rhythmic space again… and again… and
// again." The DJ cues; the moment loops back with a tape-rewind stutter, AGAIN stacking each time.
const LOOPS = [36, 96, 150];
export const G03Again: React.FC = () => {
  const frame = useCurrentFrame();
  const k = LOOPS.filter((l) => frame >= l).length;
  const rw = LOOPS.some((l) => frame >= l && frame < l + 8) ? 1 : 0;
  const local = k === 0 ? frame : frame - LOOPS[k - 1];
  const s = 1.18 + local * 0.004;
  return (
    <Finish dust={0.3}>
      <AbsoluteFill
        style={{
          translate: rw ? `${Math.sin(frame * 3) * 16}px 0px` : undefined,
        }}
      >
        <Img
          src={staticFile(img(k % 2 === 1 ? "k2" : "k4"))}
          style={{
            position: "absolute",
            width: 1920,
            height: 1080,
            transformOrigin: k % 2 === 1 ? "1050px 620px" : "700px 600px",
            scale: String(s),
            filter: "contrast(1.08) saturate(1.1)",
          }}
        />
      </AbsoluteFill>
      <RewindFx strength={rw} />
      <AbsoluteFill style={{ background: SHADE }} />
      <Typed
        text="now imagine the DJ gives you that same rhythmic space"
        at={4}
        y={140}
        size={40}
        cursor={false}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 690,
          display: "flex",
          justifyContent: "center",
          gap: 46,
        }}
      >
        {LOOPS.map((l, i) =>
          frame >= l + 4 ? (
            <Slam key={l} at={l + 4}>
              <span
                style={{
                  ...ANTON,
                  fontSize: 150,
                  color: i === 2 ? RED : "#fff",
                  opacity: 0.55 + 0.15 * i,
                  textShadow: "0 8px 30px rgba(0,0,0,0.85)",
                }}
              >
                again{i < 2 ? "…" : "."}
              </span>
            </Slam>
          ) : null,
        )}
      </div>
      <ReconTag />
      {LOOPS.map((l) => (
        <React.Fragment key={l}>
          <Sfx name="glitch" at={l} volume={0.25} />
          <Sfx name="hit" at={l + 4} volume={0.3} />
        </React.Fragment>
      ))}
    </Finish>
  );
};

// ============ G04 — "Now the dancer has time." The dancer on his own layer, TIME huge behind him;
// the crowd slows and dims around him.
const G4_KEYS = [
  { f: 0, s: 1.12, x: 980, y: 560 },
  { f: 150, s: 1.26, x: 980, y: 540, e: "smooth" as const },
];
export const G04Time: React.FC = () => {
  const frame = useCurrentFrame();
  const dim = ease(frame, 10, 50);
  return (
    <Finish dust={0.3}>
      <Rig keys={G4_KEYS}>
        <Plate
          src={img("k3-plate")}
          filter={`${WARM} saturate(${1 - 0.6 * dim}) brightness(${1 - 0.35 * dim}) blur(${dim * 3}px)`}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 140,
            textAlign: "center",
          }}
        >
          <Slam at={18}>
            <span
              style={{
                ...ANTON,
                fontSize: 520,
                color: COLOR.white,
                opacity: 0.92,
                textShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              Time
            </span>
          </Slam>
        </div>
      </Rig>
      <AbsoluteFill>
        <Rig
          keys={G4_KEYS.map((k) => ({ ...k, s: k.s * 1.07 }))}
          opaque={false}
        >
          <Plate src="hiphop/k3-cut.png" filter={WARM} />
        </Rig>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: SHADE }} />
      <Typed
        text="now the dancer has"
        at={4}
        y={940}
        size={44}
        cursor={false}
      />
      <ReconTag />
      <Sfx name="boom" at={18} volume={0.45} />
    </Finish>
  );
};

// ============ G05 — "Time to enter the circle. Time to answer somebody. Time to take a risk. Time to
// repeat an idea. Time to turn movement into identity." TIME TO holds still; each idea gets its own
// shot and its own cut.
const G5 = [
  { src: "k1", x: 380, y: 560, s: 1.55, text: "enter the circle", at: 0 },
  { src: "k5", x: 1300, y: 560, s: 1.25, text: "answer somebody", at: 66 },
  { src: "k8", x: 850, y: 640, s: 1.55, text: "take a risk", at: 132 },
  { src: "k4", x: 1460, y: 600, s: 1.6, text: "repeat an idea", at: 192 },
  {
    src: "k9",
    x: 980,
    y: 520,
    s: 1.3,
    text: "turn movement into identity",
    at: 264,
  },
];
export const G05TimeTo: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = G5.filter((g) => frame >= g.at).length - 1;
  const g = G5[idx];
  const local = frame - g.at;
  const next = G5[idx + 1]?.at ?? 360;
  // "repeat an idea": the shot repeats three times with a stutter
  const rep = idx === 3 ? Math.floor(local / 24) : 0;
  const t = idx === 3 ? local % 24 : local;
  const punch = local < 6 ? (1 - local / 6) * 0.18 : 0;
  return (
    <Finish dust={0.3}>
      <AbsoluteFill
        style={{
          scale: String(1 + punch),
          filter: punch > 0 ? `blur(${punch * 40}px)` : undefined,
        }}
      >
        <Sequence
          from={g.at + (idx === 3 ? rep * 24 : 0)}
          key={`${idx}-${rep}`}
        >
          <Rig
            keys={[
              { f: 0, s: g.s, x: g.x, y: g.y },
              {
                f: idx === 3 ? 24 : next - g.at,
                s: g.s + (idx === 4 ? -0.15 : 0.12),
                x: g.x,
                y: g.y,
                e: idx === 4 ? "smooth" : "drift",
              },
            ]}
          >
            <Plate src={img(g.src)} filter={WARM} />
          </Rig>
        </Sequence>
      </AbsoluteFill>
      {idx === 3 && rep > 0 && t < 3 ? (
        <AbsoluteFill style={{ backgroundColor: "rgba(255,255,255,0.35)" }} />
      ) : null}
      <AbsoluteFill style={{ background: SHADE }} />
      <div style={{ position: "absolute", left: 120, top: 700 }}>
        <div
          style={{
            ...MONO,
            fontSize: 30,
            color: COLOR.gold,
            letterSpacing: "0.2em",
          }}
        >
          {String(idx + 1).padStart(2, "0")} / 05
        </div>
        <div
          style={{
            ...ANTON,
            fontSize: 90,
            color: "#fff",
            lineHeight: 1,
            marginTop: 8,
            textShadow: "0 6px 20px rgba(0,0,0,0.85)",
          }}
        >
          Time to
        </div>
        <Sequence from={g.at} durationInFrames={next - g.at} layout="none">
          <Slam at={2}>
            <div
              style={{
                ...ANTON,
                fontSize: idx === 4 ? 120 : 150,
                color: idx === 4 ? RED : "#fff",
                whiteSpace: "nowrap",
                textShadow: "0 8px 30px rgba(0,0,0,0.85)",
              }}
            >
              {g.text}
              {idx === 3 && rep > 0 ? (
                <span style={{ opacity: 0.5 }}>{" ×" + (rep + 1)}</span>
              ) : null}
            </div>
          </Slam>
        </Sequence>
      </div>
      <ReconTag />
      {G5.map((x) => (
        <Sfx key={x.at} name="hit" at={x.at + 2} volume={0.3} />
      ))}
      <Sfx name="tick" at={192 + 24} volume={0.3} />
      <Sfx name="tick" at={192 + 48} volume={0.3} />
    </Finish>
  );
};

// ============ G06 — "That relationship matters because early hip-hop was not only a music story. The
// DJ was watching the floor. The dancers were responding to the DJ. The party was shaping both of them."
// Split: DJ | dancers, with a feedback loop of arrows between them; then both shrink into one circle.
const LOOP_AT = 70;
const CIRCLE_AT = 230;
export const G06Loop: React.FC = () => {
  const frame = useCurrentFrame();
  const circ = ease(frame, CIRCLE_AT, CIRCLE_AT + 30);
  const a1 = interpolate(frame, [LOOP_AT, LOOP_AT + 26], [0, 1], clamp);
  const a2 = interpolate(frame, [LOOP_AT + 70, LOOP_AT + 96], [0, 1], clamp);
  const flow = -frame * 3;
  const r = 1300 - 900 * circ;
  return (
    <Finish dust={0.3}>
      <AbsoluteFill
        style={{
          clipPath: circ > 0 ? `circle(${r}px at 960px 540px)` : undefined,
        }}
      >
        <SplitPanels
          panels={[
            {
              start: 0,
              node: (
                <Rig
                  keys={[
                    { f: 0, s: 1.4, x: 520, y: 560 },
                    { f: 360, s: 1.5, x: 520, y: 560, e: "drift" },
                  ]}
                >
                  <Plate src={img("k4")} filter={WARM} />
                </Rig>
              ),
            },
            {
              start: 14,
              node: (
                <Rig
                  keys={[
                    { f: 0, s: 1.35, x: 850, y: 600 },
                    { f: 360, s: 1.45, x: 850, y: 600, e: "drift" },
                  ]}
                >
                  <Plate src={img("k8")} filter={WARM} />
                </Rig>
              ),
            },
          ]}
        />
      </AbsoluteFill>
      {circ > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <circle
            cx={960}
            cy={540}
            r={r}
            fill="none"
            stroke={COLOR.gold}
            strokeWidth={6}
            style={{ filter: `drop-shadow(0 0 12px ${COLOR.gold})` }}
          />
        </svg>
      ) : null}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(5,5,6,0.85) 0%, rgba(5,5,6,0) 35%), linear-gradient(180deg, rgba(5,5,6,0.8) 0%, rgba(5,5,6,0) 25%)",
        }}
      />
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", opacity: 1 - circ }}
      >
        <defs>
          <marker
            id="ah"
            markerWidth={10}
            markerHeight={10}
            refX={6}
            refY={5}
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#fff" />
          </marker>
        </defs>
        <path
          d="M 760 380 Q 960 250 1160 380"
          fill="none"
          stroke={COLOR.gold}
          strokeWidth={6}
          strokeDasharray="16 12"
          strokeDashoffset={flow}
          markerEnd="url(#ah)"
          pathLength={1000}
          opacity={a1}
        />
        <path
          d="M 1160 700 Q 960 830 760 700"
          fill="none"
          stroke={RED}
          strokeWidth={6}
          strokeDasharray="16 12"
          strokeDashoffset={flow}
          markerEnd="url(#ah)"
          pathLength={1000}
          opacity={a2}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 262,
          textAlign: "center",
          opacity: a1 * (1 - circ),
          ...MONO,
          fontSize: 30,
          color: "#111",
        }}
      >
        <span
          style={{ background: "rgba(255,255,255,0.92)", padding: "6px 14px" }}
        >
          THE DJ WAS WATCHING THE FLOOR
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 790,
          textAlign: "center",
          opacity: a2 * (1 - circ),
          ...MONO,
          fontSize: 30,
          color: "#fff",
        }}
      >
        <span style={{ background: RED, padding: "6px 14px" }}>
          THE DANCERS WERE RESPONDING TO THE DJ
        </span>
      </div>
      <Sequence durationInFrames={LOOP_AT} layout="none">
        <Typed
          text="early hip-hop was not only a music story."
          at={6}
          y={110}
          size={46}
        />
      </Sequence>
      <Sequence from={CIRCLE_AT + 16} layout="none">
        <Pair
          thin="the party was"
          heavy="shaping both of them."
          at={0}
          y={790}
          size={130}
        />
      </Sequence>
      <ReconTag />
      <Sfx name="whoosh" at={0} volume={0.25} />
      <Sfx name="tick" at={LOOP_AT} volume={0.3} />
      <Sfx name="tick" at={LOOP_AT + 70} volume={0.3} />
      <Sfx name="whoosh" at={CIRCLE_AT} volume={0.35} />
      <Sfx name="hit" at={CIRCLE_AT + 28} volume={0.35} />
    </Finish>
  );
};

// ============ G07 — "The dancers who became associated with those breaks were called B-boys and
// B-girls – break boys and break girls. And from that environment, breaking began to develop."
// [ON-SCREEN TEXT: B-BOY / B-GIRL / BREAKING]
const G7_BRK = 186;
export const G07Names: React.FC = () => {
  const frame = useCurrentFrame();
  const shake =
    frame >= G7_BRK && frame < G7_BRK + 12
      ? Math.exp(-(frame - G7_BRK) / 3) * 10
      : 0;
  return (
    <Finish dust={0.35}>
      <AbsoluteFill
        style={{
          translate: `${Math.sin(frame * 7) * shake}px ${Math.cos(frame * 5) * shake}px`,
        }}
      >
        <SplitPanels
          panels={[
            {
              start: 0,
              node: (
                <Rig
                  keys={[
                    { f: 0, s: 1.45, x: 850, y: 620 },
                    { f: 300, s: 1.6, x: 850, y: 620, e: "drift" },
                  ]}
                >
                  <Plate src={img("k5")} filter={WARM} />
                </Rig>
              ),
              label: (
                <div>
                  <div
                    style={{
                      ...ANTON,
                      fontSize: 150,
                      color: "#fff",
                      textShadow: "0 8px 30px rgba(0,0,0,0.9)",
                    }}
                  >
                    B-boy
                  </div>
                  <div style={{ fontSize: 34, color: COLOR.gold }}>
                    <TypeOn text="break boy" at={20} cps={1} cursor={false} />
                  </div>
                </div>
              ),
            },
            {
              start: 60,
              node: (
                <Rig
                  keys={[
                    { f: 0, s: 1.45, x: 1700, y: 600 },
                    { f: 240, s: 1.6, x: 1700, y: 600, e: "drift" },
                  ]}
                >
                  <Plate src={img("k5")} filter={WARM} />
                </Rig>
              ),
              label: (
                <div>
                  <div
                    style={{
                      ...ANTON,
                      fontSize: 150,
                      color: "#fff",
                      textShadow: "0 8px 30px rgba(0,0,0,0.9)",
                    }}
                  >
                    B-girl
                  </div>
                  <div style={{ fontSize: 34, color: COLOR.gold }}>
                    <TypeOn text="break girl" at={20} cps={1} cursor={false} />
                  </div>
                </div>
              ),
            },
          ]}
        />
        <Typed
          text="the dancers associated with those breaks were called"
          at={4}
          y={100}
          size={38}
          cursor={false}
        />
        {frame >= G7_BRK - 4 ? (
          <AbsoluteFill
            style={{
              backgroundColor: `rgba(5,5,6,${0.55 * ease(frame, G7_BRK - 4, G7_BRK + 6)})`,
            }}
          />
        ) : null}
        <TornBand at={G7_BRK} y={560} h={240}>
          <span
            style={{ ...ANTON, fontSize: 210, color: "#fff", paddingTop: 10 }}
          >
            Breaking
          </span>
        </TornBand>
        <Sequence from={G7_BRK + 30} layout="none">
          <Typed
            text="and from that environment, breaking began to develop."
            at={0}
            y={760}
            size={40}
          />
        </Sequence>
      </AbsoluteFill>
      <ReconTag />
      <Sfx name="hit" at={4} volume={0.3} />
      <Sfx name="whoosh" at={60} volume={0.3} />
      <Sfx name="hit" at={62} volume={0.3} />
      <Sfx name="boom" at={G7_BRK + 2} volume={0.5} />
    </Finish>
  );
};

// ============ G08 — "A lot of people today say 'breakdancing.' That word became widely popular through
// media and commercial coverage." An old TV set on the table: the word on screen, newsprint headlines
// and price tags pile up around it.
export const G08Media: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = (frame * 6) % 1080;
  const zoomOut = interpolate(frame, [0, 70], [1.9, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <Finish dust={0.4}>
      <PhotocopyDefs id="pc8" />
      <AbsoluteFill style={{ scale: String(zoomOut) }}>
        <Table tone="wood" />
        {[
          { t: "BREAKDANCING CRAZE!", x: 330, y: 230, r: -8, at: 70 },
          { t: "LEARN TO BREAKDANCE", x: 1600, y: 250, r: 7, at: 92 },
          { t: "THE BREAKDANCE MOVIE", x: 360, y: 860, r: 5, at: 114 },
          { t: "BREAKDANCE KIT · $9.99", x: 1580, y: 850, r: -6, at: 136 },
        ].map((c) =>
          frame >= c.at ? (
            <div
              key={c.t}
              style={{
                position: "absolute",
                left: c.x - 320,
                top: c.y - 90,
                width: 640,
                height: 180,
                background: "#E9E3D6",
                rotate: `${c.r + (1 - ease(frame, c.at, c.at + 8)) * 8}deg`,
                scale: String(1.3 - 0.3 * ease(frame, c.at, c.at + 8)),
                boxShadow: "8px 14px 20px rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...ANTON,
                fontSize: 54,
                color: "#141210",
                filter: "url(#pc8)",
              }}
            >
              {c.t}
            </div>
          ) : null,
        )}
        {/* the TV */}
        <div
          style={{
            position: "absolute",
            left: 960 - 470,
            top: 540 - 300,
            width: 940,
            height: 600,
            background: "#2B2621",
            borderRadius: 34,
            padding: 36,
            boxShadow: "0 30px 70px rgba(0,0,0,0.7)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 40,
              overflow: "hidden",
              background: "#0B0B0B",
            }}
          >
            <Img
              src={staticFile(img("k8"))}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "saturate(1.4) contrast(1.2) blur(1px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 5px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: scan * 0.5,
                width: "100%",
                height: 40,
                background: "rgba(255,255,255,0.08)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 40,
                textAlign: "center",
                ...ANTON,
                fontSize: 96,
                color: "#FFE14A",
                textShadow: "4px 4px 0 #C62828, 0 0 20px rgba(0,0,0,0.6)",
              }}
            >
              Breakdancing!
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <Flicker amount={0.05} />
      <Typed
        text='a lot of people today say "breakdancing."'
        at={6}
        y={60}
        size={40}
        cursor={false}
      />
      <Sequence from={150} layout="none">
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 960,
            textAlign: "center",
            ...MONO,
            fontSize: 30,
            color: "#111",
          }}
        >
          <span
            style={{
              background: "rgba(255,255,255,0.92)",
              padding: "6px 14px",
            }}
          >
            POPULARISED BY MEDIA AND COMMERCIAL COVERAGE
          </span>
        </div>
      </Sequence>
      <ReconTag />
      {[70, 92, 114, 136].map((f) => (
        <Sfx key={f} name="hit" at={f} volume={0.22} />
      ))}
    </Finish>
  );
};

// ============ G09 — "But inside the culture, the older and more precise terms are breaking, B-boying
// and B-girling. The name matters because it points us back to the music: the break."
// Back in the cypher; the three terms type on as a list; then -ING is cut off BREAKING and BREAK drops
// onto the record's break.
const G9_CUT = 170;
export const G09Inside: React.FC = () => {
  const frame = useCurrentFrame();
  const chop = ease(frame, G9_CUT - 30, G9_CUT - 18);
  return (
    <Finish dust={0.3}>
      <Sequence durationInFrames={G9_CUT}>
        <Rig
          keys={[
            { f: 0, s: 1.15, x: 1100, y: 560 },
            { f: G9_CUT, s: 1.3, x: 1150, y: 560, e: "smooth" },
          ]}
          whipOut={1}
        >
          <Plate src={img("k5")} filter={WARM} />
        </Rig>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(5,5,6,0.88) 0%, rgba(5,5,6,0.55) 45%, rgba(5,5,6,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 200,
            fontSize: 36,
            color: "#fff",
          }}
        >
          <TypeOn
            text="inside the culture, the older and more precise terms:"
            at={6}
            cps={1.8}
            cursor={false}
          />
        </div>
        {["Breaking", "B-boying", "B-girling"].map((w, i) => (
          <div
            key={w}
            style={{ position: "absolute", left: 120, top: 300 + i * 170 }}
          >
            <Slam at={44 + i * 22}>
              <span
                style={{
                  ...ANTON,
                  fontSize: 150,
                  color: "#fff",
                  textShadow: "0 8px 30px rgba(0,0,0,0.85)",
                }}
              >
                {i === 0 ? (
                  <>
                    <span
                      style={{ color: frame >= G9_CUT - 30 ? RED : "#fff" }}
                    >
                      Break
                    </span>
                    <span
                      style={{
                        opacity: 1 - chop,
                        display: "inline-block",
                        translate: `${chop * 120}px ${chop * 60}px`,
                        rotate: `${chop * 20}deg`,
                      }}
                    >
                      ing
                    </span>
                  </>
                ) : (
                  w
                )}
              </span>
            </Slam>
          </div>
        ))}
        <Sequence from={G9_CUT - 34} layout="none">
          <Typed
            text="the name points us back to the music:"
            at={0}
            y={930}
            size={40}
            cursor={false}
          />
        </Sequence>
      </Sequence>
      <Sequence from={G9_CUT}>
        <Rig
          keys={[
            { f: 0, s: 1.45, x: 1080, y: 640 },
            { f: 130, s: 1.25, x: 1060, y: 620, e: "smooth" },
          ]}
          whipIn={1}
        >
          <Plate src={img("k2")} filter="contrast(1.08) brightness(0.8)" />
        </Rig>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(0deg, rgba(5,5,6,0.9) 0%, rgba(5,5,6,0.5) 35%, rgba(5,5,6,0) 60%)",
          }}
        />
        <Wave
          x={260}
          y={800}
          w={1400}
          open={1}
          head={interpolate(frame - G9_CUT, [10, 120], [0, 1], clamp)}
        />
        <Pair
          thin="the music:"
          heavy="the break."
          at={10}
          y={130}
          size={210}
          color={RED}
        />
      </Sequence>
      <ReconTag />
      {[44, 66, 88].map((f) => (
        <Sfx key={f} name="hit" at={f} volume={0.3} />
      ))}
      <Sfx name="glitch" at={G9_CUT - 30} volume={0.3} />
      <Sfx name="whoosh" at={G9_CUT - 6} volume={0.4} />
      <Sfx name="boom" at={G9_CUT + 12} volume={0.45} />
    </Finish>
  );
};

// ============ G10 — B-ROLL: record break → dancer feet → circle → floor; "Breaking did not appear
// fully formed with every move we recognize today. It developed through dancers, crews, battles and
// generations." Circle-to-circle match cuts: the record becomes the crowd's circle, then feet, then floor.
const G10 = [
  { src: "k2", ox: 980, oy: 860, s0: 1.2, s1: 1.45, word: "" },
  { src: "k10", ox: 980, oy: 720, s0: 1.6, s1: 1.25, word: "Dancers" },
  { src: "k3", ox: 960, oy: 980, s0: 2.2, s1: 2.0, word: "Crews" },
  { src: "k8", ox: 1100, oy: 640, s0: 1.4, s1: 1.25, word: "Battles" },
  { src: "k9", ox: 900, oy: 560, s0: 1.3, s1: 1.15, word: "Generations" },
];
const G10_AT = [0, 70, 120, 170, 225];
export const G10Developed: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = G10_AT.filter((a) => frame >= a).length - 1;
  const g = G10[idx];
  const from = G10_AT[idx];
  const to = G10_AT[idx + 1] ?? 300;
  const p = interpolate(frame, [from, to], [0, 1], clamp);
  const s = g.s0 + (g.s1 - g.s0) * p;
  const iris = idx > 0 ? ease(frame, from, from + 10) : 1;
  return (
    <Finish dust={0.3}>
      {idx > 0 ? (
        <Img
          src={staticFile(img(G10[idx - 1].src))}
          style={{
            position: "absolute",
            width: 1920,
            height: 1080,
            transformOrigin: `${G10[idx - 1].ox}px ${G10[idx - 1].oy}px`,
            scale: String(G10[idx - 1].s1 * (1 + iris * 0.6)),
            filter: `${WARM} blur(${iris * 10}px)`,
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{ clipPath: `circle(${iris * 1200}px at 960px 600px)` }}
      >
        <Img
          src={staticFile(img(g.src))}
          style={{
            position: "absolute",
            width: 1920,
            height: 1080,
            transformOrigin: `${g.ox}px ${g.oy}px`,
            scale: String(s),
            rotate: idx === 0 ? `${frame * 0.4}deg` : undefined,
            filter: WARM,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence durationInFrames={70} layout="none">
        <Typed
          text="breaking did not appear fully formed"
          at={6}
          y={880}
          size={48}
        />
      </Sequence>
      {idx > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 760,
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
            IT DEVELOPED THROUGH
          </div>
          <Sequence from={from} durationInFrames={to - from} layout="none">
            <Slam at={4}>
              <span
                style={{
                  ...ANTON,
                  fontSize: 170,
                  color: idx === 4 ? RED : "#fff",
                  textShadow: "0 8px 30px rgba(0,0,0,0.85)",
                }}
              >
                {g.word}
              </span>
            </Slam>
          </Sequence>
        </div>
      ) : null}
      <ReconTag />
      {G10_AT.slice(1).map((a) => (
        <React.Fragment key={a}>
          <Sfx name="whoosh" at={a - 4} volume={0.3} />
          <Sfx name="hit" at={a + 4} volume={0.25} />
        </React.Fragment>
      ))}
    </Finish>
  );
};

// ============ G11 — "Early accounts describe freestyling, rocking, burning, spins, freezes and
// competitive movement before the spectacular power vocabulary became the public image of the dance."
// An archive drawer of typed index cards, one per term, each with a photo; then a later card POWER
// MOVES drops in front, labelled THE PUBLIC IMAGE.
const CARDS = [
  { t: "Freestyling", src: "k3", fx: 980, fy: 520 },
  { t: "Rocking", src: "k8", fx: 260, fy: 300 },
  { t: "Burning", src: "k5", fx: 1300, fy: 520 },
  { t: "Spins", src: "k8", fx: 1650, fy: 650 },
  { t: "Freezes", src: "k4", fx: 1460, fy: 600 },
  { t: "Competitive movement", src: "k5", fx: 900, fy: 600 },
];
const POWER_AT = 250;
export const G11Accounts: React.FC = () => {
  const frame = useCurrentFrame();
  const dimEarly = ease(frame, POWER_AT, POWER_AT + 14);
  return (
    <Finish dust={0.3}>
      <PhotocopyDefs id="pc11" />
      <AbsoluteFill
        style={{
          rotate: `${interpolate(frame, [0, 360], [-2, 2])}deg`,
          scale: "1.08",
        }}
      >
        <Table tone="felt" />
        {CARDS.map((c, i) => {
          const at = 20 + i * 30;
          if (frame < at) return null;
          const p = interpolate(frame, [at, at + 8], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.back(1.4)),
          });
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 330 + col * 630;
          const y = 300 + row * 420;
          return (
            <div
              key={c.t}
              style={{
                position: "absolute",
                left: x - 270,
                top: y - 170,
                width: 540,
                height: 340,
                background: "#F2EEE4",
                rotate: `${(random(`r${i}`) - 0.5) * 6 + (1 - p) * 8}deg`,
                scale: String(1.25 - 0.25 * p),
                opacity: Math.min(1, (frame - at) / 3) * (1 - 0.6 * dimEarly),
                boxShadow: "8px 14px 20px rgba(0,0,0,0.55)",
                padding: 18,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 64,
                  height: 2,
                  background: "rgba(214,60,60,0.55)",
                }}
              />
              <div style={{ ...MONO, fontSize: 18, color: "#7A6F60" }}>
                EARLY ACCOUNTS · No. {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  ...MONO,
                  fontSize: 38,
                  color: "#17130F",
                  marginTop: 12,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                <TypeOn
                  text={c.t.toUpperCase()}
                  at={at + 6}
                  cps={1.8}
                  cursor={false}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 18,
                  right: 18,
                  bottom: 18,
                  height: 190,
                  overflow: "hidden",
                }}
              >
                <Img
                  src={staticFile(img(c.src))}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: `${(c.fx / 1920) * 100}% ${(c.fy / 1080) * 100}%`,
                    filter: "grayscale(1) contrast(1.35) brightness(1.2)",
                  }}
                />
              </div>
            </div>
          );
        })}
        {frame >= POWER_AT ? (
          <div
            style={{
              position: "absolute",
              left: 960 - 420,
              top: 540 - 230,
              width: 840,
              height: 460,
              background: "#111",
              rotate: `${-3 + (1 - ease(frame, POWER_AT, POWER_AT + 10)) * 10}deg`,
              scale: String(1.3 - 0.3 * ease(frame, POWER_AT, POWER_AT + 10)),
              boxShadow: "0 30px 70px rgba(0,0,0,0.8)",
              overflow: "hidden",
            }}
          >
            <Img
              src={staticFile(img("k8"))}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "85% 60%",
                filter: "contrast(1.15) saturate(1.3)",
              }}
            />
            <div style={{ position: "absolute", left: 30, bottom: 26 }}>
              <div style={{ ...MONO, fontSize: 22, color: "#FFE14A" }}>
                LATER: THE PUBLIC IMAGE
              </div>
              <div
                style={{
                  ...ANTON,
                  fontSize: 110,
                  color: "#fff",
                  textShadow: "0 6px 20px rgba(0,0,0,0.9)",
                }}
              >
                Power moves
              </div>
            </div>
          </div>
        ) : null}
      </AbsoluteFill>
      <Typed
        text="early accounts describe…"
        at={4}
        y={56}
        size={40}
        cursor={false}
      />
      <ReconTag />
      {CARDS.map((_, i) => (
        <Sfx key={i} name="tick" at={20 + i * 30} volume={0.3} />
      ))}
      <Sfx name="whoosh" at={POWER_AT - 6} volume={0.4} />
      <Sfx name="hit" at={POWER_AT + 6} volume={0.4} />
    </Finish>
  );
};

// ============ G12 — "And B-girls belong in that history too. Women were not an afterthought to a
// finished male culture; they were part of the dance world as it developed." Rack focus from the crowd
// onto the b-girl; AN AFTERTHOUGHT is stamped out; she holds the frame.
const G12_KEYS = [
  { f: 0, s: 1.15, x: 960, y: 560 },
  { f: 300, s: 1.32, x: 980, y: 540, e: "smooth" as const },
];
export const G12BGirls: React.FC = () => {
  const frame = useCurrentFrame();
  const rack = ease(frame, 20, 50);
  const strike = interpolate(frame, [150, 162], [0, 1], clamp);
  return (
    <Finish dust={0.3}>
      <Rig keys={G12_KEYS}>
        <Plate
          src={img("k9-plate")}
          filter={`${WARM} blur(${rack * 6}px) brightness(${1 - 0.2 * rack})`}
        />
      </Rig>
      <AbsoluteFill>
        <Rig
          keys={G12_KEYS.map((k) => ({ ...k, s: k.s * 1.03 }))}
          opaque={false}
        >
          <Plate
            src="hiphop/k9-cut.png"
            filter={`${WARM} blur(${(1 - rack) * 4}px)`}
          />
        </Rig>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,6,0.85) 0%, rgba(5,5,6,0.45) 38%, rgba(5,5,6,0) 60%)",
        }}
      />
      <div style={{ position: "absolute", left: 110, top: 220 }}>
        <Slam at={30}>
          <div
            style={{ ...ANTON, fontSize: 170, color: "#fff", lineHeight: 0.95 }}
          >
            B-girls
          </div>
        </Slam>
        <div
          style={{
            fontSize: 40,
            color: COLOR.gold,
            marginTop: 10,
            minHeight: 52,
          }}
        >
          <TypeOn text="belong in that history too." at={44} cps={1.4} />
        </div>
        <div
          style={{
            marginTop: 70,
            ...ANTON,
            fontSize: 84,
            color: "rgba(255,255,255,0.75)",
            position: "relative",
            display: "inline-block",
            opacity: ease(frame, 110, 122),
          }}
        >
          Not an afterthought
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
        <div style={{ marginTop: 18, opacity: ease(frame, 176, 190) }}>
          <div
            style={{
              ...TYPE.body,
              fontWeight: 300,
              fontSize: 34,
              letterSpacing: "0.1em",
              color: "#fff",
            }}
          >
            part of the dance world
          </div>
          <div style={{ ...ANTON, fontSize: 110, color: RED }}>
            as it developed.
          </div>
        </div>
      </div>
      <LightSweep at={200} dur={50} angle={100} strength={0.12} />
      <ReconTag />
      <Sfx name="hit" at={30} volume={0.35} />
      <Sfx name="whoosh" at={150} volume={0.3} />
      <Sfx name="hit" at={178} volume={0.35} />
    </Finish>
  );
};

// ============ G13 — "[MUSIC DIP. HOLD ON A CIRCLE WITH NO ONE IN THE CENTER.] The floor was becoming a
// language." The empty circle; footwork paths write themselves onto the floor in perspective.
const PATHS = [
  "M 0 0 C 80 -60 160 -40 200 20 S 300 120 380 60",
  "M -60 40 C -120 120 -40 200 40 180 S 180 120 220 200",
  "M -200 -40 Q -140 -120 -60 -80 T 60 -140",
  "M 120 -160 C 200 -120 260 -60 240 20",
  "M -320 100 Q -240 40 -160 100 T 0 100",
];
const MARKS = [
  [200, 20],
  [380, 60],
  [-60, 40],
  [220, 200],
  [60, -140],
  [-320, 100],
];
export const G13Language: React.FC = () => {
  const frame = useCurrentFrame();
  const write = (i: number) =>
    interpolate(frame, [30 + i * 22, 70 + i * 22], [0, 1], clamp);
  return (
    <Finish dust={0.35}>
      <Rig
        keys={[
          { f: 0, s: 1.25, x: 980, y: 700 },
          { f: 270, s: 1.4, x: 980, y: 720, e: "smooth" },
        ]}
      >
        <Plate src={img("k10")} filter="contrast(1.06) brightness(0.92)" />
        <div
          style={{
            position: "absolute",
            left: 980,
            top: 760,
            perspective: 900,
            width: 0,
            height: 0,
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
              transform: "rotateX(68deg) scale(1.7)",
              overflow: "visible",
            }}
          >
            <g
              fill="none"
              stroke="rgba(255,240,210,0.95)"
              strokeWidth={11}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 8px rgba(255,210,150,0.8))" }}
            >
              {PATHS.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - write(i)}
                />
              ))}
            </g>
            {MARKS.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={16}
                fill={RED}
                opacity={write(Math.min(4, Math.floor(i * 0.8)))}
              />
            ))}
          </svg>
        </div>
      </Rig>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence from={150} layout="none">
        <Pair
          thin="the floor was becoming a"
          heavy="language."
          at={0}
          y={760}
          size={200}
        />
      </Sequence>
      <ReconTag />
      <Sfx name="drone" at={0} volume={0.2} />
      <Sfx name="hit" at={154} volume={0.35} />
    </Finish>
  );
};
