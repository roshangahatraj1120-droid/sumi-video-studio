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
import { Finish, Sfx } from "../laban/broll";
import { Plate, Rig } from "../laban3/rig";
import { LightSweep } from "../laban9/fx9";
import {
  ANTON,
  CRUSH,
  clamp,
  ease,
  Flicker,
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
  TexText,
  TornBand,
  WARM,
} from "./kit";
import { RgbSplit, Shockwave, StampWord, TextMatte, TypeOn } from "./kit2";

// Hip-hop episode — Chapter 7 "So what was being built in the Bronx?" + CTA + end card. 30 fps.
export const LEN7 = {
  p01: 240,
  p02: 300,
  p03: 330,
  p04: 180,
  p05: 180,
  p06: 180,
  p07: 450,
  p08: 420,
  p09: 270,
  p10: 270,
  p11: 420,
  p12: 210,
  p13: 300,
  p14: 450,
};
type Bg = "green" | "alpha" | "preview";
const BEAT = 15;

const Typed: React.FC<{
  text: string;
  at: number;
  y?: number;
  size?: number;
  cursor?: boolean;
  cps?: number;
}> = ({ text, at, y = 930, size = 42, cursor = true, cps = 1.6 }) => (
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
    <TypeOn text={text} at={at} cps={cps} cursor={cursor} />
  </div>
);

// ============ P01 — "So… was hip-hop born on August 11, 1973?" [2-SECOND SILENCE]
// The opening's date returns, now with a question mark; then everything but the ? goes dark.
const SIL = 128;
export const P01Question: React.FC = () => {
  const frame = useCurrentFrame();
  const dark = ease(frame, SIL, SIL + 20);
  const breathe = frame >= SIL ? 1 + 0.05 * Math.sin((frame - SIL) / 9) : 1;
  return (
    <Finish dust={0.3 * (1 - dark)}>
      <AbsoluteFill style={{ opacity: 1 - dark }}>
        <Rig
          keys={[
            { f: 0, s: 1.3, x: 1240, y: 420 },
            { f: 240, s: 1.4, x: 1250, y: 410, e: "drift" },
          ]}
        >
          <Plate src={img("o_lamp")} filter={`${CRUSH} brightness(0.4)`} />
        </Rig>
        <Flicker amount={0.05} />
        <Typed
          text="so… was hip-hop born on"
          at={8}
          y={250}
          size={46}
          cursor={false}
        />
        <div
          style={{ position: "absolute", left: -120, width: 1920, top: 340 }}
        >
          <Slam at={44}>
            <TexText
              text="August 11,"
              src={img("o_street")}
              size={250}
              drift={0.06}
              filter="grayscale(1) brightness(1.7) contrast(1.3)"
            />
          </Slam>
        </div>
        <div
          style={{
            position: "absolute",
            left: -120,
            width: 1920,
            top: 610,
            textAlign: "center",
          }}
        >
          <Slam at={62}>
            <span style={{ ...ANTON, fontSize: 250, color: "#fff" }}>1973</span>
          </Slam>
        </div>
      </AbsoluteFill>
      {frame >= 84 ? (
        <div
          style={{
            position: "absolute",
            left: 1500,
            top: 300,
            scale: String(breathe),
            transformOrigin: "50% 60%",
          }}
        >
          <Slam at={84}>
            <span
              style={{
                ...ANTON,
                fontSize: 620,
                color: RED,
                textShadow: `0 0 ${40 + 30 * dark}px rgba(229,50,45,0.6)`,
              }}
            >
              ?
            </span>
          </Slam>
        </div>
      ) : null}
      <ReconTag opacity={0.7 * (1 - dark)} />
      <Sfx name="hit" at={44} volume={0.3} />
      <Sfx name="hit" at={62} volume={0.3} />
      <Sfx name="boom" at={84} volume={0.45} />
    </Finish>
  );
};

// ============ P02 — "That date matters. It gives us a place, a party, a family, a DJ and a moment we
// can point to." Five prints pinned to a board, camera ramping to each, then pulling back.
const PTS = [
  { src: "o_dusk", x: 430, y: 320, rot: -5, w: 560, word: "A place", at: 50 },
  { src: "o_party", x: 1490, y: 320, rot: 4, w: 560, word: "A party", at: 92 },
  { src: "b09", x: 430, y: 800, rot: 3, w: 560, word: "A family", at: 134 },
  { src: "e1", x: 1490, y: 800, rot: -4, w: 560, word: "A DJ", at: 170 },
  {
    src: "o_needle",
    x: 960,
    y: 560,
    rot: -1,
    w: 640,
    word: "A moment",
    at: 206,
  },
];
const Pin: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const d = interpolate(frame, [at, at + 8], [-120, 0], {
    ...clamp,
    easing: Easing.out(Easing.bounce),
  });
  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
      <g
        transform={`translate(${x} ${y + d})`}
        style={{ filter: `drop-shadow(0 6px 6px rgba(0,0,0,0.6))` }}
      >
        <line x1={0} y1={0} x2={0} y2={-26} stroke="#bbb" strokeWidth={4} />
        <circle cx={0} cy={-34} r={18} fill={RED} />
        <circle cx={-5} cy={-39} r={5} fill="rgba(255,255,255,0.6)" />
      </g>
    </svg>
  );
};
export const P02Points: React.FC = () => {
  const frame = useCurrentFrame();
  const keys = [
    { f: 0, s: 1.0, x: 960, y: 540 },
    { f: 40, s: 1.02, x: 960, y: 540, e: "drift" as const },
    ...PTS.flatMap((p) => [
      { f: p.at - 2, s: 1.75, x: p.x, y: p.y + 30, e: "ramp" as const },
      { f: p.at + 26, s: 1.8, x: p.x, y: p.y + 30, e: "drift" as const },
    ]),
    { f: 262, s: 1.0, x: 960, y: 560, e: "smooth" as const },
    { f: 300, s: 1.02, x: 960, y: 560, e: "drift" as const },
  ];
  const lines = ease(frame, 240, 262);
  return (
    <Finish dust={0.25}>
      <Rig keys={keys} blurScale={0.4}>
        <Table tone="wood" />
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {PTS.slice(0, 4).map((p, i) => (
            <line
              key={i}
              x1={p.x}
              y1={p.y}
              x2={p.x + (960 - p.x) * lines}
              y2={p.y + (560 - p.y) * lines}
              stroke={RED}
              strokeWidth={5}
            />
          ))}
        </svg>
        {PTS.map((p) => (
          <React.Fragment key={p.word}>
            <Print
              src={img(p.src)}
              x={p.x}
              y={p.y}
              w={p.w}
              rot={p.rot}
              at={p.at}
              filter={WARM}
            />
            <Pin x={p.x} y={p.y - p.w * 0.27} at={p.at + 6} />
            <Tape
              text={p.word}
              x={p.x}
              y={p.y + p.w * 0.3}
              rot={-p.rot * 0.5}
              at={p.at + 10}
              size={40}
            />
          </React.Fragment>
        ))}
        <Tape
          text="Aug 11 · 1973"
          x={960}
          y={392}
          rot={-2}
          at={214}
          size={34}
        />
      </Rig>
      <Sequence durationInFrames={48} layout="none">
        <Typed text="that date matters." at={4} y={480} size={56} />
      </Sequence>
      <Sequence from={262} layout="none">
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(5,5,6,0.8) 0%, rgba(5,5,6,0) 25%)",
          }}
        />
        <Pair
          thin="it gives us"
          heavy="a moment we can point to."
          at={0}
          y={30}
          size={100}
        />
      </Sequence>
      <ReconTag />
      {PTS.map((p) => (
        <React.Fragment key={p.at}>
          <Sfx name="whoosh" at={p.at - 6} volume={0.2} />
          <Sfx name="hit" at={p.at + 6} volume={0.25} />
        </React.Fragment>
      ))}
    </Finish>
  );
};

// ============ P03 — "But if we treat that night like a switch that suddenly turned hip-hop on, we miss the
// people, sounds and movement that made the night possible." A switch flips the party ON; then the camera
// pulls back: the party is one tile in a wall of everything that came before it.
const FLIP = 62;
const PULL = 120;
const TILE_SRC = [
  "n1",
  "n3",
  "n4",
  "n5",
  "n6",
  "n7",
  "k1",
  "k3",
  "k4",
  "k5",
  "k8",
  "k9",
  "k10",
  "d_booth",
  "d_conga",
  "d_crate",
  "d_disco",
  "d_jam",
  "d_bass",
  "o_djsys",
  "o_cables",
  "e1",
  "e2",
  "e4",
  "e6",
  "m1",
  "m4",
  "x_records",
];
const N = 9;
const MID = (N - 1) / 2;
const TILES = Array.from({ length: N * N }).map((_, i) => {
  const c = i % N;
  const r = Math.floor(i / N);
  return {
    c,
    r,
    centre: c === MID && r === MID,
    src: TILE_SRC[Math.floor(random(`ts${i}`) * TILE_SRC.length)],
    cat: Math.floor(random(`tc${i}`) * 3),
    d: Math.hypot(c - MID, r - MID),
  };
});
const CATS = [
  { w: "People", at: 190, c: COLOR.gold },
  { w: "Sounds", at: 228, c: RED },
  { w: "Movement", at: 266, c: "#7FD1FF" },
];
export const P03Switch: React.FC = () => {
  const frame = useCurrentFrame();
  const on = frame >= FLIP;
  const knob = ease(frame, FLIP - 4, FLIP + 2);
  const ls = interpolate(
    frame,
    [PULL, PULL + 60],
    [Math.log(1), Math.log(0.13)],
    { ...clamp, easing: Easing.inOut(Easing.cubic) },
  );
  const s = Math.exp(ls);
  const switchOut = ease(frame, PULL - 10, PULL + 6);
  return (
    <Finish dust={0.25}>
      <AbsoluteFill style={{ backgroundColor: "#060505", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "960px 540px",
            transform: `scale(${s})`,
          }}
        >
          {TILES.map((t, i) => {
            const lit = t.centre
              ? 1
              : ease(frame, PULL + 30 + t.d * 6, PULL + 40 + t.d * 6);
            const hl = !t.centre && CATS[t.cat] && frame >= CATS[t.cat].at;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: (t.c - MID) * 2040,
                  top: (t.r - MID) * 1148,
                  width: 1920,
                  height: 1080,
                  outline: hl ? `40px solid ${CATS[t.cat].c}` : undefined,
                }}
              >
                <Img
                  src={staticFile(img(t.centre ? "o_party" : t.src))}
                  style={{
                    width: 1920,
                    height: 1080,
                    opacity: t.centre ? 1 : 0.15 + 0.6 * lit,
                    filter: t.centre
                      ? `${WARM} brightness(${on ? 1.05 : 0.22})`
                      : hl
                        ? WARM
                        : `${WARM} grayscale(0.6) brightness(0.7)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {on && frame < FLIP + 5 ? (
        <AbsoluteFill
          style={{
            backgroundColor: `rgba(255,240,210,${0.6 - (frame - FLIP) * 0.12})`,
          }}
        />
      ) : null}
      {/* the switch */}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 300,
          opacity: 1 - switchOut,
        }}
      >
        <div
          style={{
            width: 170,
            height: 300,
            borderRadius: 26,
            background: "#E9E3D6",
            boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 45,
              top: 40,
              width: 80,
              height: 220,
              borderRadius: 40,
              background: "#2B2621",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 35,
              top: 40 + (1 - knob) * 120,
              width: 100,
              height: 100,
              borderRadius: 50,
              background: on ? RED : "#7B746B",
              boxShadow: on ? `0 0 30px ${RED}` : undefined,
            }}
          />
        </div>
        <div
          style={{
            ...MONO,
            fontSize: 30,
            color: "#fff",
            marginTop: 18,
            textAlign: "center",
          }}
        >
          {on ? "HIP-HOP: ON" : "OFF"}
        </div>
      </div>
      <Sequence durationInFrames={PULL} layout="none">
        <Typed
          text="if we treat that night like a switch that turned hip-hop on,"
          at={4}
          y={940}
          size={38}
          cursor={false}
        />
      </Sequence>
      <Sequence from={PULL + 10} layout="none">
        <Typed
          text="we miss the people, sounds and movement that made the night possible."
          at={0}
          y={960}
          size={36}
          cursor={false}
          cps={2}
        />
      </Sequence>
      {CATS.map((c) =>
        frame >= c.at ? (
          <div
            key={c.w}
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 250 + CATS.indexOf(c) * 180,
              textAlign: "center",
            }}
          >
            <Slam at={c.at}>
              <span
                style={{
                  ...ANTON,
                  fontSize: 140,
                  color: "#fff",
                  padding: "0 30px",
                  background: "rgba(5,5,6,0.75)",
                  borderLeft: `14px solid ${c.c}`,
                }}
              >
                {c.w}
              </span>
            </Slam>
          </div>
        ) : null,
      )}
      <ReconTag />
      <Sfx name="tick" at={FLIP} volume={0.5} />
      <Sfx name="hit" at={FLIP} volume={0.35} />
      <Sfx name="riser" at={PULL} volume={0.25} />
      {CATS.map((c) => (
        <Sfx key={c.at} name="hit" at={c.at} volume={0.3} />
      ))}
    </Finish>
  );
};

// ============ P04 — "What was being built in the Bronx was bigger than one invention."
// ONE INVENTION shrinks in a small box; BIGGER grows huge with the Bronx inside it; we fly through it.
const ZOOM4 = 128;
const B4_OX = 360;
const B4_OY = 560;

export const P04Bigger: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [14, 60], [0.35, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const small = interpolate(frame, [70, 110], [1, 0.55], clamp);
  return (
    <Finish dust={0.25}>
      {frame >= ZOOM4 + 12 ? (
        <Rig
          keys={[
            { f: 0, s: 1.25, x: 960, y: 560 },
            { f: 180, s: 1.12, x: 960, y: 540, e: "smooth" },
          ]}
          whipOut={1}
        >
          <Plate src={img("e10")} filter={WARM} />
        </Rig>
      ) : (
        <AbsoluteFill style={{ backgroundColor: "#0A0908" }}>
          <AbsoluteFill style={{ scale: String(grow) }}>
            <TextMatte
              text="Bigger"
              src={img("e10")}
              size={600}
              y={790}
              zoomAt={ZOOM4}
              zoomDur={18}
              ox={B4_OX}
              oy={B4_OY}
              filter="contrast(1.1) saturate(1.1) brightness(1.6)"
            />
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      {frame < ZOOM4 ? (
        <>
          <Typed
            text="what was being built in the Bronx was"
            at={4}
            y={110}
            size={44}
            cursor={false}
          />
          {frame >= 66 ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                width: 1920,
                top: 900,
                textAlign: "center",
                opacity: ease(frame, 66, 74),
              }}
            >
              <span style={{ ...MONO, fontSize: 30, color: "#fff" }}>
                than{" "}
              </span>
              <span
                style={{
                  display: "inline-block",
                  ...MONO,
                  fontSize: 30 * small,
                  color: "#111",
                  background: "rgba(255,255,255,0.92)",
                  padding: "4px 12px",
                }}
              >
                ONE INVENTION
              </span>
            </div>
          ) : null}
        </>
      ) : null}
      {frame >= ZOOM4 + 8 && frame < ZOOM4 + 14 ? (
        <AbsoluteFill style={{ backgroundColor: "rgba(255,220,170,0.5)" }} />
      ) : null}
      <ReconTag />
      <Sfx name="riser" at={20} volume={0.2} />
      <Sfx name="whoosh" at={ZOOM4 + 2} volume={0.5} />
      <Sfx name="hit" at={ZOOM4 + 12} volume={0.35} />
    </Finish>
  );
};

// ============ P05 — "DJs were changing how records could be played." PLAYED stutters like a scratch.
export const P05DJs: React.FC = () => {
  const frame = useCurrentFrame();
  const scr = frame >= 60 && frame < 104;
  const cut = scr ? 0.25 + 0.6 * Math.abs(Math.sin((frame - 60) / 3.2)) : 1;
  const jit = scr ? Math.sin(frame * 2.3) * 14 : 0;
  const spin = -frame * 0.02;
  return (
    <Finish dust={0.25}>
      <Rig
        keys={[
          { f: 0, s: 1.25, x: 640, y: 480 },
          { f: 180, s: 1.42, x: 760, y: 520, e: "smooth" },
        ]}
      >
        <Plate src={img("e1")} filter={WARM} />
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <ellipse
            cx={720}
            cy={555}
            rx={330}
            ry={88}
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={4}
            strokeDasharray="0.03 0.05"
            pathLength={1}
            strokeDashoffset={spin}
          />
          <ellipse
            cx={720}
            cy={555}
            rx={230}
            ry={60}
            fill="none"
            stroke={RED}
            strokeWidth={4}
            strokeDasharray="0.05 0.08"
            pathLength={1}
            strokeDashoffset={spin * 1.6}
          />
        </svg>
      </Rig>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(5,5,6,0.9) 0%, rgba(5,5,6,0.4) 30%, rgba(5,5,6,0) 50%)",
        }}
      />
      <div style={{ position: "absolute", left: 120, top: 660 }}>
        <div
          style={{
            ...MONO,
            fontSize: 28,
            color: COLOR.gold,
            letterSpacing: "0.2em",
          }}
        >
          DJS WERE CHANGING HOW RECORDS COULD BE
        </div>
        {frame >= 60 ? (
          <div style={{ position: "relative", marginTop: 6 }}>
            {scr ? (
              <span
                style={{
                  position: "absolute",
                  left: jit - 10,
                  top: 0,
                  ...ANTON,
                  fontSize: 250,
                  color: RED,
                  opacity: 0.6,
                  clipPath: `inset(0 ${(1 - cut) * 100}% 0 0)`,
                }}
              >
                Played
              </span>
            ) : null}
            <span
              style={{
                display: "inline-block",
                ...ANTON,
                fontSize: 250,
                color: "#fff",
                translate: `${jit}px 0px`,
                clipPath: `inset(0 ${(1 - cut) * 100}% 0 0)`,
                textShadow: "0 10px 30px rgba(0,0,0,0.8)",
              }}
            >
              Played.
            </span>
          </div>
        ) : null}
      </div>
      <ReconTag />
      <Sfx name="glitch" at={60} volume={0.25} />
      <Sfx name="glitch" at={78} volume={0.25} />
      <Sfx name="hit" at={104} volume={0.4} />
    </Finish>
  );
};

// ============ P06 — "MCs were changing what a voice could do inside a party." The MC on his own layer;
// sound rings pulse from the mic; A VOICE's letters bounce like a level meter.
const MIC = { x: 920, y: 340 };
const E2_KEYS = [
  { f: 0, s: 1.08, x: 960, y: 540 },
  { f: 180, s: 1.2, x: 1000, y: 520, e: "smooth" as const },
];
export const P06MCs: React.FC = () => {
  const frame = useCurrentFrame();
  const word = "A VOICE";
  return (
    <Finish dust={0.25}>
      <Rig keys={E2_KEYS}>
        <Plate src={img("e2-plate")} filter={WARM} />
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const t = ((frame + i * 12) % 60) / 60;
            return (
              <circle
                key={i}
                cx={MIC.x}
                cy={MIC.y}
                r={40 + t * 900}
                fill="none"
                stroke={COLOR.gold}
                strokeWidth={6 * (1 - t) + 1}
                opacity={0.8 * (1 - t)}
              />
            );
          })}
        </svg>
      </Rig>
      <AbsoluteFill>
        <Rig
          keys={E2_KEYS.map((k) => ({ ...k, s: k.s * 1.05 }))}
          opaque={false}
        >
          <Plate src="hiphop/e2-cut.png" filter={WARM} />
        </Rig>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(270deg, rgba(5,5,6,0.85) 0%, rgba(5,5,6,0.3) 35%, rgba(5,5,6,0) 55%)",
        }}
      />
      <div style={{ position: "absolute", left: 1250, top: 400, width: 640 }}>
        <div
          style={{
            ...MONO,
            fontSize: 26,
            color: COLOR.gold,
            letterSpacing: "0.18em",
          }}
        >
          MCS WERE CHANGING WHAT
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            height: 200,
            marginTop: 6,
          }}
        >
          {word.split("").map((ch, i) => {
            const show = ease(frame, 20 + i * 3, 28 + i * 3);
            const lvl =
              Math.abs(Math.sin(frame / 3 + i * 1.7)) *
              Math.abs(Math.sin(frame / 7 + i));
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  ...ANTON,
                  fontSize: 170,
                  color: i < 2 ? "#fff" : RED,
                  opacity: show,
                  translate: `0px ${-lvl * 34}px`,
                  minWidth: ch === " " ? 40 : undefined,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        <div
          style={{ fontSize: 40, color: "#fff", marginTop: 10, minHeight: 50 }}
        >
          <TypeOn text="could do inside a party." at={60} cps={1.4} />
        </div>
      </div>
      <ReconTag />
      <Sfx name="hit" at={22} volume={0.3} />
    </Finish>
  );
};

// ============ P07 — "Dancers were taking a few seconds of percussion and turning them into breaking –
// groove, character, competition, footwork, freezes and eventually an expanding technical vocabulary."
const POSES = [
  { x: 170, w: "Groove" },
  { x: 560, w: "Character" },
  { x: 950, w: "Competition" },
  { x: 1370, w: "Footwork" },
  { x: 1760, w: "Freezes" },
].map((p, i) => ({ ...p, at: 100 + i * 46 }));
const VOCAB = [
  "toprock",
  "indian step",
  "six-step",
  "three-step",
  "CC",
  "swipe",
  "windmill",
  "flare",
  "airflare",
  "headspin",
  "backspin",
  "turtle",
  "baby freeze",
  "chair freeze",
  "airchair",
  "hollowback",
  "jackhammer",
  "1990",
  "kick-out",
  "coin drop",
  "sweep",
  "pretzel",
  "drop",
  "uprock",
  "zulu spin",
  "go-down",
  "spin",
  "suicide",
];
const VOC_AT = 340;
export const P07Dancers: React.FC = () => {
  const frame = useCurrentFrame();
  const keys = [
    { f: 90, s: 1.0, x: 960, y: 560 },
    ...POSES.flatMap((p) => [
      { f: p.at - 4, s: 2.1, x: p.x, y: 560, e: "ramp" as const },
      { f: p.at + 34, s: 2.15, x: p.x, y: 560, e: "drift" as const },
    ]),
    { f: VOC_AT, s: 1.0, x: 960, y: 560, e: "smooth" as const },
    { f: 450, s: 1.04, x: 960, y: 560, e: "drift" as const },
  ];
  const sel = interpolate(frame, [30, 60], [0, 1], clamp);
  const cur = POSES.filter((p) => frame >= p.at).length - 1;
  return (
    <Finish dust={0.25}>
      {frame < 90 ? (
        <>
          <Img
            src={staticFile(img("e5"))}
            style={{
              position: "absolute",
              width: 1920,
              height: 1080,
              filter: "blur(10px) brightness(0.35)",
            }}
          />
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            {Array.from({ length: 150 }).map((_, i) => {
              const x = 160 + i * 10.7;
              const a = 30 + random(`pw${i}`) * 200;
              const inSel = x > 760 && x < 1160;
              return (
                <rect
                  key={i}
                  x={x}
                  y={560 - a / 2}
                  width={5}
                  height={a}
                  rx={2}
                  fill={inSel && sel > 0 ? RED : "rgba(255,255,255,0.6)"}
                />
              );
            })}
            <rect
              x={760 - 10}
              y={400}
              width={420 * sel}
              height={320}
              fill="none"
              stroke={RED}
              strokeWidth={4}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 300,
              textAlign: "center",
              ...MONO,
              fontSize: 30,
              color: RED,
              opacity: sel,
            }}
          >
            ≈ A FEW SECONDS OF PERCUSSION
          </div>
          <Typed
            text="dancers were taking a few seconds of percussion…"
            at={4}
            y={820}
            size={44}
            cursor={false}
          />
        </>
      ) : (
        <Rig keys={keys} blurScale={0.4}>
          <Plate src={img("e5")} filter="contrast(1.06)" />
        </Rig>
      )}
      {frame >= 90 && frame < VOC_AT ? (
        <>
          <AbsoluteFill style={{ background: SHADE }} />
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 770,
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
              {cur >= 0
                ? `TURNING THEM INTO BREAKING · 0${cur + 1}`
                : "TURNING THEM INTO BREAKING"}
            </div>
            {cur >= 0 ? (
              <Sequence from={POSES[cur].at} key={cur} layout="none">
                <Slam at={0}>
                  <span
                    style={{
                      ...ANTON,
                      fontSize: 180,
                      color: cur === 4 ? RED : "#fff",
                      textShadow: "0 8px 30px rgba(0,0,0,0.85)",
                    }}
                  >
                    {POSES[cur].w}
                  </span>
                </Slam>
              </Sequence>
            ) : null}
          </div>
        </>
      ) : null}
      {frame >= VOC_AT ? (
        <AbsoluteFill style={{ perspective: 900 }}>
          <AbsoluteFill
            style={{
              backgroundColor: `rgba(5,5,6,${0.6 * ease(frame, VOC_AT, VOC_AT + 20)})`,
            }}
          />
          {VOCAB.map((v, i) => {
            const at = VOC_AT + 10 + i * 2.5;
            const p = interpolate(frame, [at, at + 24], [0, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            });
            if (p <= 0) return null;
            const a = random(`va${i}`) * Math.PI * 2;
            const r = 500 + random(`vr${i}`) * 360;
            const x = 960 + Math.cos(a) * r * 1.3;
            const y = 540 + Math.sin(a) * r * 0.6;
            return (
              <div
                key={v}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  translate: "-50% -50%",
                  transform: `translateZ(${(1 - p) * -1800}px)`,
                  opacity: p * (0.55 + random(`vo${i}`) * 0.45),
                  ...MONO,
                  fontSize: 26 + random(`vs${i}`) * 20,
                  color: random(`vc${i}`) > 0.7 ? COLOR.gold : "#fff",
                  whiteSpace: "nowrap",
                  textTransform: "uppercase",
                }}
              >
                {v}
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 400,
              textAlign: "center",
            }}
          >
            <div
              style={{
                ...MONO,
                fontSize: 28,
                color: COLOR.gold,
                letterSpacing: "0.2em",
                opacity: ease(frame, VOC_AT + 6, VOC_AT + 14),
              }}
            >
              AND EVENTUALLY
            </div>
            <Slam at={VOC_AT + 10}>
              <div
                style={{
                  ...ANTON,
                  fontSize: 130,
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                An expanding
              </div>
              <div
                style={{ ...ANTON, fontSize: 130, color: RED, lineHeight: 1 }}
              >
                technical vocabulary
              </div>
            </Slam>
          </div>
        </AbsoluteFill>
      ) : null}
      <ReconTag />
      <Sfx name="hit" at={60} volume={0.3} />
      {POSES.map((p) => (
        <React.Fragment key={p.at}>
          <Sfx name="whoosh" at={p.at - 6} volume={0.25} />
          <Sfx name="hit" at={p.at} volume={0.25} />
        </React.Fragment>
      ))}
      <Sfx name="boom" at={VOC_AT + 10} volume={0.45} />
    </Finish>
  );
};

// A slot-machine word: a column of words spins and lands on `word`
const Slot: React.FC<{
  word: string;
  at: number;
  color?: string;
  size?: number;
}> = ({ word, at, color = RED, size = 170 }) => {
  const frame = useCurrentFrame();
  const pool = [
    "STYLE",
    "NOISE",
    "FAME",
    "SOUND",
    "RULES",
    "MONEY",
    "TRICKS",
    "HISTORY",
    "HYPE",
    "PRIDE",
  ];
  const p = interpolate(frame, [at, at + 26], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const h = size * 1.05;
  const n = 10;
  const off = (1 - p) * n * h;
  return (
    <div style={{ height: h, overflow: "hidden", position: "relative" }}>
      <div
        style={{
          translate: `0px ${-off}px`,
          filter: p < 0.95 ? `blur(${(1 - p) * 6}px)` : undefined,
        }}
      >
        <div style={{ ...ANTON, fontSize: size, lineHeight: 1.05, color }}>
          {word}
        </div>
        {Array.from({ length: n }).map((_, i) => (
          <div
            key={i}
            style={{
              ...ANTON,
              fontSize: size,
              lineHeight: 1.05,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {pool[(i + at) % pool.length]}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ P08 — "Crews were creating identity. Parties were creating community. A neighborhood was
// creating culture from the tools, records, spaces and people it already had."
const SECT = [
  { who: "Crews", word: "Identity", src: "e6", x: 900, y: 560, at: 0 },
  { who: "Parties", word: "Community", src: "e4", x: 1100, y: 520, at: 100 },
  {
    who: "A neighborhood",
    word: "Culture",
    src: "e10",
    x: 960,
    y: 560,
    at: 200,
  },
];
const INV_AT = 300;
const INV = ["Tools", "Records", "Spaces", "People"];
export const P08Creating: React.FC = () => {
  const frame = useCurrentFrame();
  const k = Math.min(2, SECT.filter((s) => frame >= s.at).length - 1);
  const sct = SECT[k];
  const inv = frame >= INV_AT;
  return (
    <Finish dust={0.25}>
      <Sequence from={sct.at} key={k}>
        <Rig
          keys={[
            { f: 0, s: 1.35, x: sct.x, y: sct.y },
            {
              f: k === 2 ? 420 - sct.at : 100,
              s: k === 2 ? 1.08 : 1.2,
              x: sct.x,
              y: sct.y,
              e: "smooth",
            },
          ]}
          whipIn={k > 0 ? 1 : undefined}
          whipOut={k < 2 ? 1 : undefined}
        >
          <Plate
            src={img(sct.src)}
            filter={`${WARM} brightness(${inv ? 0.4 : 1})`}
          />
        </Rig>
      </Sequence>
      <AbsoluteFill style={{ background: SHADE, opacity: inv ? 0 : 1 }} />
      {!inv ? (
        <div style={{ position: "absolute", left: 120, top: 640 }}>
          <div
            style={{
              ...ANTON,
              fontSize: 90,
              color: "#fff",
              lineHeight: 1,
              textShadow: "0 6px 20px rgba(0,0,0,0.85)",
            }}
          >
            {sct.who}
          </div>
          <div
            style={{
              ...MONO,
              fontSize: 28,
              color: COLOR.gold,
              margin: "8px 0",
            }}
          >
            {k === 2 ? "WAS CREATING" : "WERE CREATING"}
          </div>
          <Sequence from={sct.at} key={`s${k}`} layout="none">
            <Slot word={sct.word.toUpperCase()} at={10} />
          </Sequence>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 250,
            textAlign: "center",
          }}
        >
          <div
            style={{
              ...MONO,
              fontSize: 30,
              color: COLOR.gold,
              letterSpacing: "0.2em",
            }}
          >
            CULTURE, FROM WHAT IT ALREADY HAD
          </div>
          <div
            style={{
              display: "inline-block",
              marginTop: 30,
              textAlign: "left",
            }}
          >
            {INV.map((w, i) => {
              const at = INV_AT + 14 + i * 22;
              return (
                <div
                  key={w}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 30,
                    marginTop: 14,
                    opacity: ease(frame, at - 6, at),
                  }}
                >
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      border: "6px solid #fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {frame >= at ? (
                      <svg width={70} height={70} viewBox="0 0 24 24">
                        <path
                          d="M4 12.5l5 5L20 6.5"
                          fill="none"
                          stroke={RED}
                          strokeWidth={4}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          pathLength={1}
                          strokeDasharray="1"
                          strokeDashoffset={1 - ease(frame, at, at + 6)}
                        />
                      </svg>
                    ) : null}
                  </div>
                  <span style={{ ...ANTON, fontSize: 110, color: "#fff" }}>
                    {w}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <ReconTag />
      {SECT.map((s) => (
        <React.Fragment key={s.at}>
          <Sfx name="whoosh" at={s.at === 0 ? 0 : s.at - 6} volume={0.3} />
          <Sfx name="hit" at={s.at + 36} volume={0.35} />
        </React.Fragment>
      ))}
      {INV.map((_, i) => (
        <Sfx key={i} name="tick" at={INV_AT + 14 + i * 22} volume={0.35} />
      ))}
    </Finish>
  );
};

// ============ P09 — "Maybe hip-hop was not born like a person. Maybe it emerged like a language."
const EM = "EMERGED";
export const P09Language: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [86, 100], [0, 1], clamp);
  const part2 = frame >= 120;
  return (
    <Finish dust={0.3}>
      <Img
        src={staticFile(img("e7"))}
        style={{
          position: "absolute",
          width: 1920,
          height: 1080,
          filter: "blur(14px) brightness(0.35) saturate(0.8)",
          scale: "1.15",
        }}
      />
      {/* drifting glyphs, pulled toward the centre in part 2 */}
      {Array.from({ length: 90 }).map((_, i) => {
        const ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZ♪•—/"[
          Math.floor(random(`g${i}`) * 30)
        ];
        const x0 = random(`gx${i}`) * 1920;
        const y0 = random(`gy${i}`) * 1080;
        const pull = part2
          ? ease(
              frame,
              120 + random(`gp${i}`) * 40,
              170 + random(`gp${i}`) * 40,
            )
          : 0;
        const x = x0 + (960 - x0) * pull * 0.85 + Math.sin(frame / 30 + i) * 20;
        const y = y0 + (540 - y0) * pull * 0.85 + Math.cos(frame / 34 + i) * 16;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              ...MONO,
              fontSize: 20 + random(`gs${i}`) * 30,
              color:
                random(`gc${i}`) > 0.8 ? COLOR.gold : "rgba(255,255,255,0.35)",
              opacity: 1 - pull * 0.9,
            }}
          >
            {ch}
          </div>
        );
      })}
      {!part2 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 330,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 46, color: "#fff" }}>
            <TypeOn
              text="maybe hip-hop was not"
              at={6}
              cps={1.5}
              cursor={false}
            />
          </div>
          {frame >= 40 ? (
            <div
              style={{
                position: "relative",
                display: "inline-block",
                marginTop: 10,
              }}
            >
              <TypeOn
                text="BORN"
                at={40}
                cps={0.25}
                cursor={false}
                style={{
                  ...ANTON,
                  fontSize: 230,
                  color: "#fff",
                  fontFamily: "Anton",
                  letterSpacing: 0,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: -20,
                  top: "52%",
                  height: 22,
                  width: `calc(${strike} * (100% + 40px))`,
                  background: RED,
                  rotate: "-3deg",
                }}
              />
            </div>
          ) : null}
          <div
            style={{
              fontSize: 46,
              color: COLOR.gold,
              marginTop: 10,
              opacity: ease(frame, 64, 74),
            }}
          >
            like a person.
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 330,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 46, color: "#fff" }}>
            <TypeOn text="maybe it" at={122} cps={1.5} cursor={false} />
          </div>
          <div style={{ marginTop: 10, whiteSpace: "nowrap" }}>
            {EM.split("").map((ch, i) => {
              const p = interpolate(frame, [130 + i * 5, 160 + i * 5], [0, 1], {
                ...clamp,
                easing: Easing.out(Easing.cubic),
              });
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    ...ANTON,
                    fontSize: 230,
                    color: "#fff",
                    opacity: p,
                    translate: `${(random(`ex${i}`) - 0.5) * 900 * (1 - p)}px ${(random(`ey${i}`) - 0.5) * 700 * (1 - p)}px`,
                    rotate: `${(random(`er${i}`) - 0.5) * 140 * (1 - p)}deg`,
                    filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
                    textShadow: "0 10px 30px rgba(0,0,0,0.8)",
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
          <div
            style={{
              ...TYPE.headline,
              fontSize: 70,
              color: COLOR.gold,
              marginTop: 6,
              opacity: ease(frame, 200, 214),
            }}
          >
            like a language.
          </div>
        </div>
      )}
      <ReconTag />
      <Sfx name="tick" at={40} volume={0.3} />
      <Sfx name="whoosh" at={86} volume={0.3} />
      <Sfx name="riser" at={120} volume={0.25} />
      <Sfx name="hit" at={170} volume={0.35} />
    </Finish>
  );
};

// ============ P10 — "A rhythm from here. A technique from there. A rhyme. A response. A battle. A break.
// A move." [1–2 SECONDS OF COMPLETE SILENCE] Accelerating smash cuts, then hard cut to black, no sound.
const RAPID = [
  { w: "A rhythm", sub: "from here ↘", src: "d_conga", at: 0 },
  { w: "A technique", sub: "↙ from there", src: "n8d", at: 42 },
  { w: "A rhyme.", src: "e2", at: 82 },
  { w: "A response.", src: "k5", at: 110 },
  { w: "A battle.", src: "k8", at: 134 },
  { w: "A break.", src: "k2", at: 154 },
  { w: "A move.", src: "e4", at: 172 },
];
const BLACK = 226;
export const P10Rapid: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= BLACK)
    return <AbsoluteFill style={{ backgroundColor: "#000" }} />;
  const k = RAPID.filter((r) => frame >= r.at).length - 1;
  const r = RAPID[k];
  const local = frame - r.at;
  const last = k === RAPID.length - 1;
  const freeze = last && local > 26;
  return (
    <Finish dust={0.3}>
      {local < 3 ? (
        <RgbSplit
          src={img(r.src)}
          amount={28 * (1 - local / 3)}
          filter="contrast(1.12) saturate(1.2)"
        />
      ) : (
        <Sequence from={r.at} key={k}>
          <Rig
            keys={[
              { f: 0, s: 1.3, x: 960, y: 540 },
              {
                f: last ? 60 : 40,
                s: freeze ? 1.36 : 1.42,
                x: 960,
                y: 540,
                e: "drift",
              },
            ]}
          >
            <Plate
              src={img(r.src)}
              filter={
                freeze
                  ? "contrast(1.1) saturate(0.4)"
                  : "contrast(1.12) saturate(1.2)"
              }
            />
          </Rig>
        </Sequence>
      )}
      {local < 2 ? (
        <AbsoluteFill style={{ backgroundColor: "rgba(255,255,255,0.35)" }} />
      ) : null}
      <AbsoluteFill style={{ background: SHADE }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 690,
          textAlign: "center",
        }}
      >
        <Sequence from={r.at} key={`w${k}`} layout="none">
          <Slam at={0}>
            <div
              style={{
                ...ANTON,
                fontSize: last ? 240 : 200,
                color: last ? RED : "#fff",
                textShadow: "0 8px 30px rgba(0,0,0,0.85)",
              }}
            >
              {r.w}
            </div>
          </Slam>
          {r.sub ? (
            <div
              style={{ ...MONO, fontSize: 36, color: COLOR.gold, marginTop: 6 }}
            >
              {r.sub}
            </div>
          ) : null}
        </Sequence>
      </div>
      <ReconTag />
      {RAPID.map((x) => (
        <Sfx key={x.at} name="hit" at={x.at} volume={0.3} />
      ))}
    </Finish>
  );
};

// ============ P11 — "Hip-hop was not born in one night. It was built – person by person, party by party,
// beat by beat, and move by move." The title card returns; BORN is crossed out for BUILT; then a wall is
// built brick by brick, one row per phrase.
const ROWS = [
  {
    w: "Person by person",
    srcs: ["n6", "k9", "e6", "n1", "e2", "k3", "n5", "m1"],
    at: 120,
  },
  {
    w: "Party by party",
    srcs: ["o_party", "e4", "d_jam", "e10", "d_disco", "k4", "n4", "o_djsys"],
    at: 186,
  },
  { w: "Beat by beat", srcs: [], at: 252 },
  {
    w: "Move by move",
    srcs: ["m7", "m1", "m5", "m8", "m6", "m9b", "k5", "e5"],
    at: 318,
  },
];
const BW = 300;
const BH = 170;
const Brick: React.FC<{ src?: string; i: number; row: number; at: number }> = ({
  src,
  i,
  row,
  at,
}) => {
  const frame = useCurrentFrame();
  const t0 = at + i * 3;
  if (frame < t0) return null;
  const p = interpolate(frame, [t0, t0 + 10], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.bounce),
  });
  const off = row % 2 === 0 ? 0 : BW / 2;
  const x = 960 - 4 * BW + i * BW + off - BW / 2 + 10;
  const y = 980 - (row + 1) * (BH + 8);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - (1 - p) * 500,
        width: BW - 8,
        height: BH,
        overflow: "hidden",
        background: "#111",
        boxShadow: "0 10px 20px rgba(0,0,0,0.6)",
        border: "3px solid #2A2420",
      }}
    >
      {src ? (
        <Img
          src={staticFile(img(src))}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: WARM,
          }}
        />
      ) : (
        <svg width={BW - 8} height={BH} style={{ position: "absolute" }}>
          {Array.from({ length: 26 }).map((_, k) => {
            const a = 10 + random(`bb${i}${k}`) * 120;
            return (
              <rect
                key={k}
                x={8 + k * 11}
                y={BH / 2 - a / 2}
                width={5}
                height={a}
                fill={k % 4 === 0 ? RED : "rgba(255,255,255,0.7)"}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
};
export const P11Built: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOut = ease(frame, 104, 118);
  const scratch = interpolate(frame, [56, 72], [0, 1], clamp);
  const camS = interpolate(frame, [118, 150, 370, 410], [1.6, 1.6, 1.6, 0.86], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const rowNow = ROWS.filter((r) => frame >= r.at).length - 1;
  const focusY = rowNow < 0 ? 980 - BH : 980 - (rowNow + 1) * (BH + 8) + BH / 2;
  const camY =
    interpolate(frame, [118, 410], [0, 1], clamp) < 1 && frame < 370
      ? focusY
      : 540;
  const cy =
    frame < 370
      ? camY
      : interpolate(frame, [370, 410], [focusY, 520], {
          ...clamp,
          easing: Easing.inOut(Easing.cubic),
        });
  return (
    <Finish dust={0.3}>
      {frame < 118 ? (
        <AbsoluteFill
          style={{ opacity: 1 - titleOut, backgroundColor: "#0B0A0A" }}
        >
          <div style={{ position: "absolute", left: 0, width: 1920, top: 180 }}>
            <Slam at={4}>
              <TexText
                text="Hip-Hop"
                src={img("b17")}
                size={230}
                drift={0.05}
                filter="grayscale(1) brightness(1.7) contrast(1.3)"
              />
            </Slam>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 430,
              textAlign: "center",
            }}
          >
            <Slam at={14}>
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                  ...ANTON,
                  fontSize: 150,
                  color: "#fff",
                }}
              >
                wasn&apos;t born
                <span
                  style={{
                    position: "absolute",
                    left: -20,
                    top: "50%",
                    height: 18,
                    width: `calc(${scratch} * (100% + 40px))`,
                    background: RED,
                    rotate: "-2deg",
                  }}
                />
              </span>
            </Slam>
          </div>
          <TornBand at={24} y={680} h={160}>
            <span
              style={{ ...ANTON, fontSize: 130, color: "#fff", paddingTop: 6 }}
            >
              in one night
            </span>
          </TornBand>
          {frame >= 76 ? (
            <div style={{ position: "absolute", left: 1440, top: 400 }}>
              <StampWord text="Built." at={76} size={130} rot={-8} />
            </div>
          ) : null}
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ backgroundColor: "#0B0A0A" }}>
          <Img
            src={staticFile(img("e10"))}
            style={{
              position: "absolute",
              width: 1920,
              height: 1080,
              filter: "blur(12px) brightness(0.3)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: `960px ${cy}px`,
              transform: `translateY(${540 - cy}px) scale(${camS})`,
            }}
          >
            {ROWS.map((r, row) =>
              Array.from({ length: 8 }).map((_, i) => (
                <Brick
                  key={`${row}-${i}`}
                  src={r.srcs[i]}
                  i={i}
                  row={row}
                  at={r.at}
                />
              )),
            )}
            {ROWS.map((r, row) =>
              frame >= r.at + 24 ? (
                <div
                  key={r.w}
                  style={{
                    position: "absolute",
                    left: 0,
                    width: 1920,
                    top: 980 - (row + 1) * (BH + 8) + BH / 2 - 44,
                    textAlign: "center",
                    opacity: ease(frame, r.at + 24, r.at + 32),
                  }}
                >
                  <span
                    style={{
                      ...ANTON,
                      fontSize: 64,
                      color: row === 3 ? RED : "#fff",
                      background: "rgba(8,7,7,0.82)",
                      padding: "4px 28px",
                    }}
                  >
                    {r.w}
                  </span>
                </div>
              ) : null,
            )}
          </div>
          {frame >= 380 ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                width: 1920,
                top: 60,
                textAlign: "center",
              }}
            >
              <Slam at={380}>
                <span
                  style={{
                    ...ANTON,
                    fontSize: 150,
                    color: "#fff",
                    textShadow: "0 10px 30px rgba(0,0,0,0.85)",
                  }}
                >
                  It was <span style={{ color: RED }}>built.</span>
                </span>
              </Slam>
            </div>
          ) : null}
        </AbsoluteFill>
      )}
      <ReconTag />
      <Sfx name="hit" at={4} volume={0.3} />
      <Sfx name="whoosh" at={56} volume={0.3} />
      <Sfx name="boom" at={76} volume={0.45} />
      {ROWS.map((r) =>
        Array.from({ length: 8 }).map((_, i) => (
          <Sfx
            key={`${r.at}-${i}`}
            name="tick"
            at={r.at + i * 3 + 6}
            volume={0.12}
          />
        )),
      )}
      <Sfx name="hit" at={382} volume={0.4} />
    </Finish>
  );
};

// ============ P12 — "And that is the story I wanted to understand." [MUSIC RETURNS VERY SOFTLY]
// The empty floor; the chapter's network of names ghosts across it and fades.
const GHOST = [
  "Cindy Campbell",
  "Herc",
  "Coke La Rock",
  "B-girls",
  "B-boys",
  "Crews",
  "The break",
  "1520 Sedgwick",
  "The Bronx",
  "The circle",
];
export const P12Story: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.05, x: 960, y: 560 },
          { f: 210, s: 1.16, x: 960, y: 580, e: "smooth" },
        ]}
      >
        <Plate src={img("m2")} filter="contrast(1.05) brightness(0.9)" />
      </Rig>
      {GHOST.map((g, i) => {
        const at = 10 + i * 8;
        const o = interpolate(
          frame,
          [at, at + 20, at + 70, at + 110],
          [0, 0.55, 0.55, 0],
          clamp,
        );
        return (
          <div
            key={g}
            style={{
              position: "absolute",
              left: 140 + random(`gx${i}`) * 1500,
              top: 120 + random(`gy${i}`) * 520,
              ...MONO,
              fontSize: 28,
              color: "#fff",
              opacity: o,
              translate: `0px ${-frame * 0.2}px`,
            }}
          >
            {g.toUpperCase()}
          </div>
        );
      })}
      <LightSweep at={40} dur={80} angle={100} strength={0.12} />
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence from={70} layout="none">
        <Typed
          text="and that is the story I wanted to understand."
          at={0}
          y={880}
          size={48}
          cps={1.2}
        />
      </Sequence>
      <ReconTag />
    </Finish>
  );
};

// ============ P13 — CTA OVERLAY (transparent) for the host's subscribe line: the series name assembles,
// a SUBSCRIBE button is clicked, and the line about movement types on.
export const P13Subscribe: React.FC<{ bg: Bg }> = ({ bg }) => {
  const frame = useCurrentFrame();
  const green = bg === "green";
  const sh = green ? undefined : "0 4px 16px rgba(0,0,0,0.85)";
  const cursorP = interpolate(frame, [80, 110], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const clicked = frame >= 112;
  const press = frame >= 110 && frame < 118 ? 0.92 : 1;
  const bell = clicked
    ? Math.sin((frame - 112) / 2) * 18 * Math.exp(-(frame - 112) / 14)
    : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: green ? "#00FF00" : undefined }}>
      {bg === "preview" ? (
        <Img
          src={staticFile(img("m2"))}
          style={{
            position: "absolute",
            width: 1920,
            height: 1080,
            filter: "brightness(0.6)",
          }}
        />
      ) : null}
      <div style={{ position: "absolute", left: 120, top: 150 }}>
        <div style={{ display: "flex", gap: 18 }}>
          {["Dance:", "Where", "We", "Come", "From"].map((w, i) => (
            <span
              key={w}
              style={{
                ...ANTON,
                fontSize: 96,
                color: i === 0 ? RED : "#fff",
                opacity: ease(frame, 6 + i * 5, 14 + i * 5),
                translate: `0px ${(1 - ease(frame, 6 + i * 5, 14 + i * 5)) * 40}px`,
                textShadow: sh,
              }}
            >
              {w}
            </span>
          ))}
        </div>
        <div
          style={{
            width: 760 * ease(frame, 30, 50),
            height: 6,
            background: RED,
            marginTop: 6,
          }}
        />
        <div
          style={{
            ...MONO,
            fontSize: 24,
            color: COLOR.gold,
            marginTop: 12,
            opacity: ease(frame, 40, 52),
            textShadow: sh,
          }}
        >
          THE HISTORY, CULTURE AND PEOPLE INSIDE THE MOVES
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 22,
            opacity: ease(frame, 50, 60),
          }}
        >
          <div
            style={{
              scale: String(press),
              padding: "18px 38px",
              borderRadius: 14,
              background: clicked ? "#3A3634" : RED,
              ...TYPE.body,
              fontWeight: 800,
              fontSize: 40,
              color: "#fff",
              letterSpacing: "0.06em",
              boxShadow: clicked ? undefined : `0 0 30px rgba(229,50,45,0.6)`,
            }}
          >
            {clicked ? "SUBSCRIBED ✓" : "SUBSCRIBE"}
          </div>
          <svg
            width={64}
            height={64}
            viewBox="0 0 24 24"
            style={{ rotate: `${bell}deg`, opacity: clicked ? 1 : 0.6 }}
          >
            <path
              d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zm0 19a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 22z"
              fill="#fff"
            />
          </svg>
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 36,
            color: "#fff",
            maxWidth: 900,
            lineHeight: 1.35,
            textShadow: sh,
          }}
        >
          <TypeOn
            text="not just learning steps."
            at={150}
            cps={1.3}
            cursor={false}
          />
          <br />
          <TypeOn
            text="understanding where movement comes from."
            at={190}
            cps={1.3}
          />
        </div>
      </div>
      {/* the cursor */}
      {frame >= 70 && frame < 150 ? (
        <svg
          width={60}
          height={60}
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            left: 760 - 340 * cursorP,
            top: 760 - 250 * cursorP,
          }}
        >
          <path
            d="M3 2l7 19 2.5-7.5L20 11z"
            fill="#fff"
            stroke="#111"
            strokeWidth={1.5}
          />
        </svg>
      ) : null}
      {clicked && frame < 130 ? (
        <div
          style={{
            position: "absolute",
            left: 300 - 60,
            top: 425 - 60,
            width: 120,
            height: 120,
            borderRadius: 60,
            border: "3px solid #fff",
            scale: String(0.4 + (frame - 112) / 10),
            opacity: 1 - (frame - 112) / 18,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

// ============ P14 — END CARD: HIP-HOP WAS BUILT — BEAT BY BEAT • MOVE BY MOVE
// 3D extruded title flying in from depth over the park jam, embers rising, then it lifts to the top
// third and leaves the lower half clear for YouTube end-screen elements.
const extrude = (n: number, c: string) =>
  Array.from({ length: n })
    .map((_, i) => `${i + 1}px ${i + 1}px 0 ${c}`)
    .join(", ") + ", 0 30px 50px rgba(0,0,0,0.7)";
const LIFT = 210;
export const P14EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const lift = ease(frame, LIFT, LIFT + 30);
  const pump = frame >= 60 ? Math.exp(-((frame - 60) % BEAT) / 4) : 0;
  const words = ["Hip-hop", "was", "built"];
  return (
    <Finish dust={0.4}>
      <Rig
        keys={[
          { f: 0, s: 1.3, x: 1000, y: 520 },
          { f: 450, s: 1.08, x: 960, y: 540, e: "smooth" },
        ]}
      >
        <Plate
          src={img("e10")}
          filter={`${WARM} brightness(${0.75 - 0.35 * lift})`}
        />
      </Rig>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(5,5,6,0.25), rgba(5,5,6,0.8) 100%)",
        }}
      />
      {/* embers */}
      {Array.from({ length: 60 }).map((_, i) => {
        const x = random(`ex${i}`) * 1920 + Math.sin(frame / 20 + i) * 30;
        const y =
          1100 -
          ((frame * (1.2 + random(`ev${i}`) * 2) + random(`ey${i}`) * 1100) %
            1200);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 4 + random(`es${i}`) * 5,
              height: 4 + random(`es${i}`) * 5,
              borderRadius: 4,
              background: random(`ec${i}`) > 0.5 ? "#FFB347" : RED,
              opacity: 0.7,
              filter: "blur(0.5px)",
              boxShadow: "0 0 8px rgba(255,160,60,0.9)",
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          perspective: 1200,
          translate: `0px ${-lift * 250}px`,
          scale: String(1 - lift * 0.28),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 300,
            textAlign: "center",
            whiteSpace: "nowrap",
            scale: String(1 + 0.02 * pump),
          }}
        >
          {words.map((w, i) => {
            const at = 6 + i * 12;
            const p = interpolate(frame, [at, at + 18], [0, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            });
            return (
              <span
                key={w}
                style={{
                  display: "inline-block",
                  margin: "0 22px",
                  ...ANTON,
                  fontSize: 230,
                  color: i === 2 ? RED : "#F4F1EA",
                  textShadow: extrude(14, i === 2 ? "#7A1512" : "#6E6556"),
                  opacity: p,
                  transform: `translateZ(${(1 - p) * -2200}px) rotateY(${(1 - p) * (i - 1) * 50}deg)`,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 590,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 36,
          }}
        >
          <span
            style={{
              ...ANTON,
              fontSize: 96,
              color: "#fff",
              translate: `${(1 - ease(frame, 56, 72)) * -900}px 0px`,
              opacity: ease(frame, 56, 64),
            }}
          >
            Beat by beat
          </span>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              background: RED,
              scale: String(ease(frame, 66, 74) * (1 + 0.35 * pump)),
              boxShadow: `0 0 20px ${RED}`,
            }}
          />
          <span
            style={{
              ...ANTON,
              fontSize: 96,
              color: "#fff",
              translate: `${(1 - ease(frame, 56, 72)) * 900}px 0px`,
              opacity: ease(frame, 56, 64),
            }}
          >
            Move by move
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 740,
            textAlign: "center",
            ...TYPE.headline,
            fontSize: 64,
            color: COLOR.gold,
            opacity: ease(frame, 110, 130),
            letterSpacing: "0.02em",
          }}
        >
          Dance: Where We Come From
        </div>
      </AbsoluteFill>
      <LightSweep at={90} dur={50} angle={100} strength={0.2} />
      <Shockwave at={40} />
      <ReconTag />
      <Sfx name="whoosh" at={4} volume={0.35} />
      <Sfx name="boom" at={40} volume={0.55} />
      <Sfx name="whoosh" at={54} volume={0.3} />
      <Sfx name="hit" at={70} volume={0.35} />
    </Finish>
  );
};
