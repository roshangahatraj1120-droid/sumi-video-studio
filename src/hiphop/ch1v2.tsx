import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";
import { TornReveal } from "../brand/fx";
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
  SHADE,
  Slam,
  WARM,
} from "./kit";
import {
  Board3D,
  BurnReveal,
  type Clip,
  Fly3D,
  type FlyCard,
  MergeSplit,
  PhotocopyDefs,
  RgbSplit,
  Shockwave,
  StampWord,
  TextMatte,
  TypeOn,
} from "./kit2";

// Hip-hop episode — Chapter 1 "Before the birthday", rebuilt (v2). 30 fps.
export const LENV2 = {
  e01: 240,
  e02: 270,
  e03: 165,
  e04: 270,
  e05: 330,
  e06: 300,
  e07: 300,
};

// piecewise keyframes with a speed-ramp ease between each pair
const keyed = (f: number, ks: [number, number][]) => {
  for (let i = 1; i < ks.length; i++) {
    if (f <= ks[i][0]) {
      const [f0, v0] = ks[i - 1];
      const [f1, v1] = ks[i];
      const t = interpolate(f, [f0, f1], [0, 1], {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      });
      return v0 + (v1 - v0) * t;
    }
  }
  return ks[ks.length - 1][1];
};
const warmLeak = (frame: number, at: number) =>
  frame >= at ? 0.55 * Math.exp(-(frame - at) / 6) : 0;

// ============ E01 — "To understand hip-hop, we have to begin before anybody was calling it hip-hop."
// BRONX in giant letters with the street inside them; the camera flies through a letter into the
// street, the kids on their own depth layer, the chapter title sitting behind them.
// a point on the stem of the N, so the zoom fills the frame with picture (not a letter's hole)
const E1_OX = 1168;
const E1_OY = 560;
const E1_ZOOM = 62;
const E1_IN = 92;
const E1_KEYS = [
  { f: E1_IN, s: 1.12, x: 900, y: 560 },
  { f: 240, s: 1.24, x: 820, y: 600, e: "smooth" as const },
];
export const E01Bronx: React.FC = () => {
  const frame = useCurrentFrame();
  const t = ease(frame, E1_IN + 10, E1_IN + 28);
  return (
    <Finish dust={0.3}>
      {frame < E1_IN ? (
        <>
          <AbsoluteFill
            style={{
              opacity: interpolate(
                frame,
                [E1_ZOOM + 14, E1_ZOOM + 28],
                [0, 1],
                clamp,
              ),
            }}
          >
            <Rig keys={E1_KEYS}>
              <Plate src={img("n1")} filter={WARM} />
            </Rig>
          </AbsoluteFill>
          <TextMatte
            text="Bronx"
            src={img("n1")}
            size={640}
            y={800}
            zoomAt={E1_ZOOM}
            zoomDur={30}
            ox={E1_OX}
            oy={E1_OY}
            imgStyle={{
              left: 960 - 900 * 1.12,
              top: 540 - 560 * 1.12,
              width: 1920 * 1.12,
              height: 1080 * 1.12,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 120,
              top: 110,
              fontSize: 30,
              color: "#fff",
            }}
          >
            <TypeOn
              text="CHAPTER 1 — THE BRONX, NEW YORK · 1970s"
              at={4}
              cps={1.4}
            />
          </div>
        </>
      ) : (
        <>
          <Rig keys={E1_KEYS}>
            <Plate src={img("n1-plate")} filter={WARM} />
            <div
              style={{
                position: "absolute",
                left: 300,
                top: 250,
                opacity: t,
                translate: `${(1 - t) * -200}px 0px`,
                filter: t < 1 ? `blur(${(1 - t) * 12}px)` : undefined,
                ...ANTON,
                fontSize: 130,
                color: COLOR.white,
                textShadow: "0 12px 40px rgba(0,0,0,0.6)",
                whiteSpace: "nowrap",
              }}
            >
              Before the birthday
            </div>
          </Rig>
          <AbsoluteFill>
            <Rig
              keys={E1_KEYS.map((k) => ({ ...k, s: k.s * 1.07 }))}
              opaque={false}
            >
              <Plate src={"hiphop/n1-cut.png"} filter={WARM} />
            </Rig>
          </AbsoluteFill>
          <AbsoluteFill style={{ background: SHADE }} />
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 930,
              textAlign: "center",
              fontSize: 40,
              color: "#fff",
              textShadow: "0 2px 10px rgba(0,0,0,0.9)",
            }}
          >
            <TypeOn
              text="before anybody was calling it hip-hop."
              at={150}
              cps={1.3}
            />
          </div>
        </>
      )}
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(255,190,110,${warmLeak(frame, E1_IN)})`,
          mixBlendMode: "screen",
        }}
      />
      <ReconTag />
      <Sfx name="tick" at={4} volume={0.2} />
      <Sfx name="riser" at={E1_ZOOM - 20} volume={0.3} />
      <Sfx name="whoosh" at={E1_ZOOM + 16} volume={0.5} />
      <Sfx name="hit" at={E1_IN} volume={0.4} />
    </Finish>
  );
};

// ============ E02 — "The Bronx of the 1970s was living through real economic pressure. Poverty,
// drugs and gang culture were part of the story." The rubble drains to newsprint, tears open onto a
// tilted 3D board of photocopied clippings; each word is stamped as the camera reaches it.
const CLIPS: Clip[] = [
  { src: img("b05"), x: 760, y: 520, w: 920, rot: -3, at: 34 },
  { src: img("b06"), x: 1240, y: 300, w: 520, rot: 6, at: 70 },
  { src: img("b02"), x: 1600, y: 540, w: 780, rot: 4, at: 94 },
  { src: img("b25"), x: 1980, y: 300, w: 520, rot: -5, at: 120 },
  { src: img("b01"), x: 2300, y: 580, w: 820, rot: -2, at: 134 },
  { src: img("b04"), x: 3050, y: 520, w: 860, rot: 3, at: 174 },
];
const STAMPS = [
  { text: "Economic pressure", at: 44, x: 760, y: 900, size: 96 },
  { text: "Poverty", at: 104, x: 1600, y: 900, size: 120 },
  { text: "Drugs", at: 144, x: 2300, y: 940, size: 120 },
  { text: "Gang culture", at: 184, x: 3050, y: 900, size: 110 },
];
const camXAt = (f: number) =>
  keyed(f, [
    [0, -150],
    [80, -150],
    [96, 640],
    [124, 640],
    [140, 1340],
    [164, 1340],
    [180, 2090],
    [270, 2160],
  ]);
const BoardScene: React.FC<{ frameOffset?: number; settled?: boolean }> = ({
  frameOffset = 0,
  settled,
}) => {
  const frame = useCurrentFrame() + frameOffset;
  return (
    <Board3D
      clips={CLIPS.map((c) => ({
        ...c,
        at: settled ? -100 : c.at - frameOffset,
      }))}
      camX={settled ? 2200 + (frame - frameOffset) * 0.8 : camXAt(frame)}
      filterId="pc2"
      tilt={14}
    >
      {STAMPS.map((s) => (
        <div
          key={s.text}
          style={{
            position: "absolute",
            left: s.x - 500,
            width: 1000,
            top: s.y - 60,
            textAlign: "center",
          }}
        >
          <StampWord
            text={s.text}
            at={settled ? -100 : s.at - frameOffset}
            size={s.size}
          />
        </div>
      ))}
    </Board3D>
  );
};
export const E02Pressure: React.FC = () => {
  const frame = useCurrentFrame();
  const drain = ease(frame, 4, 22);
  return (
    <Finish dust={0.5}>
      <PhotocopyDefs id="pc2" />
      <Rig
        keys={[
          { f: 0, s: 1.6, x: 520, y: 800 },
          { f: 30, s: 1.7, x: 540, y: 790, e: "drift" },
        ]}
      >
        <Plate
          src={img("n7")}
          filter={`saturate(${1 - drain}) contrast(${1 + 0.4 * drain})`}
        />
      </Rig>
      <TornReveal at={24} dur={16} dir={1} seed="e02">
        <BoardScene frameOffset={24} />
      </TornReveal>
      <Flicker amount={0.06} />
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 96,
          fontSize: 30,
          color: "#EDE7DA",
        }}
      >
        <TypeOn text="THE BRONX · 1970s" at={6} cps={1.2} />
      </div>
      <Sequence from={210} layout="none">
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 960,
            textAlign: "center",
            fontSize: 44,
            color: "#fff",
            textShadow: "0 2px 10px rgba(0,0,0,0.9)",
          }}
        >
          <TypeOn text="…were part of the story." at={0} cps={1.2} />
        </div>
      </Sequence>
      <ReconTag />
      <Sfx name="whoosh" at={22} volume={0.35} />
      {STAMPS.map((s) => (
        <React.Fragment key={s.at}>
          <Sfx name="hit" at={s.at} volume={0.35} />
          <Sfx name="whoosh" at={s.at - 16} volume={0.15} />
        </React.Fragment>
      ))}
    </Finish>
  );
};

// ============ E03 — "But if we stop there, we tell the story wrong."
// The board again; a red marker scrawls through it; the film burns open onto kids playing in the sun.
const E3_BURN = 62;
const E3_FULL = E3_BURN + 24;
const E3_KEYS = [
  { f: E3_FULL, s: 1.12, x: 960, y: 540 },
  { f: 165, s: 1.2, x: 940, y: 560, e: "smooth" as const },
];
export const E03Wrong: React.FC = () => {
  const frame = useCurrentFrame();
  const scrawl = interpolate(frame, [40, 56], [0, 1], clamp);
  return (
    <Finish dust={0.4}>
      <PhotocopyDefs id="pc2" />
      {frame < E3_FULL ? <BoardScene settled /> : null}
      {frame < E3_FULL ? (
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <path
            d="M 180 640 L 520 470 L 760 700 L 1080 420 L 1340 690 L 1620 440 L 1800 600"
            fill="none"
            stroke={RED}
            strokeWidth={26}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - scrawl}
            opacity={0.9}
          />
        </svg>
      ) : null}
      <BurnReveal
        at={E3_BURN}
        dur={24}
        src={img("n3")}
        cx={960}
        cy={560}
        scale={1.12}
        filter={WARM}
      />
      {frame >= E3_FULL ? (
        <>
          <Rig keys={E3_KEYS}>
            <Plate src={img("n3-plate")} filter={WARM} />
          </Rig>
          <AbsoluteFill>
            <Rig
              keys={E3_KEYS.map((k) => ({ ...k, s: k.s * 1.07 }))}
              opaque={false}
            >
              <Plate src={"hiphop/n3-cut.png"} filter={WARM} />
            </Rig>
          </AbsoluteFill>
        </>
      ) : null}
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence durationInFrames={E3_BURN} layout="none">
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 920,
            textAlign: "center",
            fontSize: 46,
            color: "#fff",
            textShadow: "0 2px 10px rgba(0,0,0,0.9)",
          }}
        >
          <TypeOn text="but if we stop there," at={6} cps={1.2} />
        </div>
      </Sequence>
      <Sequence from={E3_FULL + 6} layout="none">
        <Pair
          thin="we tell the story"
          heavy="wrong."
          at={0}
          y={740}
          size={190}
          color={RED}
        />
      </Sequence>
      <ReconTag />
      <Sfx name="whoosh" at={40} volume={0.3} />
      <Sfx name="riser" at={E3_BURN - 6} volume={0.3} />
      <Sfx name="boom" at={E3_FULL} volume={0.45} />
    </Finish>
  );
};

// ============ E04 — "…a neighborhood full of families, teenagers, music, competition, style, block
// parties and community." One shot per word, each joined by a different cut: whips, a zoom punch,
// a light-leak flash; the last one breathes.
type Beat = {
  src: string;
  x: number;
  y: number;
  s0: number;
  s1: number;
  word: string;
  inT?: "whipL" | "whipR" | "punch" | "flash";
};
const E4: Beat[] = [
  { src: "n6", x: 1650, y: 560, s0: 1.6, s1: 1.72, word: "Families" },
  {
    src: "n1",
    x: 1600,
    y: 640,
    s0: 1.5,
    s1: 1.62,
    word: "Teenagers",
    inT: "whipR",
  },
  {
    src: "n5",
    x: 1700,
    y: 640,
    s0: 1.7,
    s1: 1.82,
    word: "Music",
    inT: "punch",
  },
  {
    src: "n4",
    x: 760,
    y: 640,
    s0: 1.35,
    s1: 1.45,
    word: "Competition",
    inT: "whipL",
  },
  { src: "n5", x: 330, y: 820, s0: 1.4, s1: 1.52, word: "Style", inT: "flash" },
  {
    src: "o_party",
    x: 900,
    y: 520,
    s0: 1.2,
    s1: 1.3,
    word: "Block parties",
    inT: "whipR",
  },
  {
    src: "n3",
    x: 960,
    y: 540,
    s0: 1.5,
    s1: 1.05,
    word: "Community",
    inT: "punch",
  },
];
const E4_LEN = 34;
export const E04Families: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Finish dust={0.3}>
      {E4.map((b, i) => {
        const from = 6 + i * E4_LEN;
        const last = i === E4.length - 1;
        const dur = last ? 270 - from : E4_LEN;
        const next = E4[i + 1]?.inT;
        const t = frame - from;
        const punch = b.inT === "punch" && t >= 0 && t < 8 ? 1 - t / 8 : 0;
        return (
          <Sequence
            key={i}
            from={i === 0 ? 0 : from}
            durationInFrames={i === 0 ? dur + 6 : dur}
          >
            <AbsoluteFill
              style={{
                scale: String(1 + 0.25 * punch * punch),
                filter: punch > 0 ? `blur(${punch * 10}px)` : undefined,
              }}
            >
              <Rig
                keys={[
                  { f: 0, s: b.s0, x: b.x, y: b.y },
                  {
                    f: i === 0 ? dur + 6 : dur,
                    s: b.s1,
                    x: b.x,
                    y: b.y,
                    e: last ? "smooth" : "drift",
                  },
                ]}
                whipIn={
                  b.inT === "whipR" ? 1 : b.inT === "whipL" ? -1 : undefined
                }
                whipOut={
                  next === "whipR" ? 1 : next === "whipL" ? -1 : undefined
                }
              >
                <Plate src={img(b.src)} filter={WARM} />
              </Rig>
            </AbsoluteFill>
            {b.inT === "flash" ? (
              <AbsoluteFill
                style={{
                  backgroundColor: `rgba(255,200,130,${Math.max(0, 0.8 - t * 0.16)})`,
                  mixBlendMode: "screen",
                }}
              />
            ) : null}
            <AbsoluteFill style={{ background: SHADE }} />
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
                  fontSize: 26,
                  color: COLOR.gold,
                  letterSpacing: "0.3em",
                  marginBottom: 8,
                }}
              >
                {String(i + 1).padStart(2, "0")} / 07
              </div>
              <Slam at={i === 0 ? 8 : 2}>
                <span
                  style={{
                    ...ANTON,
                    fontSize: 170,
                    color: "#fff",
                    textShadow: "0 8px 30px rgba(0,0,0,0.85)",
                  }}
                >
                  {b.word}
                </span>
              </Slam>
              <div
                style={{
                  margin: "6px auto 0",
                  height: 8,
                  width: 520 * ease(frame, from + 4, from + 14),
                  background: RED,
                }}
              />
            </div>
          </Sequence>
        );
      })}
      <LightSweep at={220} dur={40} angle={100} strength={0.12} />
      <ReconTag />
      {E4.slice(1).map((b, i) => (
        <React.Fragment key={i}>
          <Sfx name="whoosh" at={6 + (i + 1) * E4_LEN - 5} volume={0.3} />
          <Sfx name="hit" at={6 + (i + 1) * E4_LEN} volume={0.2} />
        </React.Fragment>
      ))}
    </Finish>
  );
};

// ============ E05 — "People were not sitting around waiting for someone to invent a culture for them.
// They were already creating ways to gather, dress, talk, play records and move."
// Kids playing ball on a rubble lot; INVENT A CULTURE is struck out; then a 3D flight forward through
// five floating photographs, one verb on each.
const E5_FLY = 100;
const CARDS: FlyCard[] = [
  {
    src: img("n1"),
    fx: 1230,
    fy: 560,
    zoom: 1.4,
    x: -380,
    y: -40,
    z: -1500,
    word: "Gather",
    rot: 8,
  },
  {
    src: img("n5"),
    fx: 686,
    fy: 600,
    zoom: 1.4,
    x: 380,
    y: 30,
    z: -3000,
    word: "Dress",
    rot: -8,
  },
  {
    src: img("n6"),
    fx: 1000,
    fy: 560,
    zoom: 1.6,
    x: -360,
    y: 20,
    z: -4500,
    word: "Talk",
    rot: 8,
  },
  {
    src: img("n5"),
    fx: 928,
    fy: 400,
    zoom: 1.4,
    x: 360,
    y: -30,
    z: -6000,
    word: "Play records",
    rot: -8,
  },
  {
    src: img("n3"),
    fx: 688,
    fy: 560,
    zoom: 1.4,
    x: 0,
    y: 0,
    z: -7500,
    word: "Move",
    rot: 0,
  },
];
const camZAt = (f: number) =>
  keyed(f, [
    [E5_FLY, 0],
    [E5_FLY + 14, -1200],
    [E5_FLY + 40, -1260],
    [E5_FLY + 54, -2700],
    [E5_FLY + 80, -2760],
    [E5_FLY + 94, -4200],
    [E5_FLY + 120, -4260],
    [E5_FLY + 134, -5700],
    [E5_FLY + 160, -5760],
    [E5_FLY + 176, -7200],
    [330, -7300],
  ]);
const camXFly = (f: number) =>
  keyed(f, [
    [E5_FLY, 0],
    [E5_FLY + 14, -520],
    [E5_FLY + 40, -520],
    [E5_FLY + 54, 520],
    [E5_FLY + 80, 520],
    [E5_FLY + 94, -520],
    [E5_FLY + 120, -520],
    [E5_FLY + 134, 520],
    [E5_FLY + 160, 520],
    [E5_FLY + 176, 0],
    [330, 0],
  ]);
export const E05Already: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [50, 62], [0, 1], clamp);
  const dive = interpolate(frame, [E5_FLY - 8, E5_FLY + 4], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  return (
    <Finish dust={0.25}>
      {frame < E5_FLY + 4 ? (
        <AbsoluteFill
          style={{
            scale: String(1 + 2 * dive),
            opacity: 1 - dive,
            filter: dive > 0 ? `blur(${dive * 16}px)` : undefined,
          }}
        >
          <Rig
            keys={[
              { f: 0, s: 1.42, x: 850, y: 680 },
              { f: E5_FLY, s: 1.55, x: 870, y: 660, e: "drift" },
            ]}
          >
            <Plate src={img("n7")} filter={WARM} />
          </Rig>
          <AbsoluteFill style={{ background: SHADE }} />
          <Sequence durationInFrames={70} layout="none">
            <div
              style={{
                position: "absolute",
                left: 0,
                width: 1920,
                top: 700,
                textAlign: "center",
                fontSize: 40,
                color: "#fff",
                textShadow: "0 2px 10px rgba(0,0,0,0.9)",
              }}
            >
              <TypeOn
                text="nobody was waiting for someone to"
                at={4}
                cps={1.6}
                cursor={false}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                width: 1920,
                top: 760,
                textAlign: "center",
              }}
            >
              <Slam at={26}>
                <span
                  style={{
                    ...ANTON,
                    fontSize: 150,
                    color: "#fff",
                    position: "relative",
                    textShadow: "0 8px 30px rgba(0,0,0,0.85)",
                  }}
                >
                  Invent a culture
                  <span
                    style={{
                      position: "absolute",
                      left: -20,
                      top: "48%",
                      height: 14,
                      width: `calc(${strike} * (100% + 40px))`,
                      background: RED,
                      rotate: "-2deg",
                      boxShadow: `0 0 14px ${RED}`,
                    }}
                  />
                </span>
              </Slam>
            </div>
          </Sequence>
          <Sequence from={72} layout="none">
            <Pair
              thin="they were"
              heavy="already creating"
              at={0}
              y={740}
              size={160}
              color={RED}
            />
          </Sequence>
        </AbsoluteFill>
      ) : null}
      {frame >= E5_FLY ? (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, #2A1A10 0%, #0C0806 75%)",
            opacity: ease(frame, E5_FLY, E5_FLY + 6),
          }}
        >
          <Fly3D cards={CARDS} camZ={camZAt(frame)} camX={camXFly(frame)} />
        </AbsoluteFill>
      ) : null}
      <ReconTag />
      <Sfx name="whoosh" at={48} volume={0.3} />
      <Sfx name="hit" at={74} volume={0.35} />
      <Sfx name="whoosh" at={E5_FLY - 8} volume={0.5} />
      {[0, 40, 80, 120, 160].map((d) => (
        <Sfx key={d} name="whoosh" at={E5_FLY + d} volume={0.22} />
      ))}
    </Finish>
  );
};

// ============ E06 — "Black communities, Puerto Rican communities, Jamaicans and other Caribbean
// people were living close enough for sounds and ideas to keep crossing paths."
// Three panels, each tight on one community — then they relax and merge: it was one street all along.
// Sound lines run between the flag, the record board and the boombox.
const E6_MERGE = 116;
const PanelLab: React.FC<{ top: string; main: string }> = ({ top, main }) => {
  const frame = useCurrentFrame();
  const t = ease(frame, 0, 10);
  return (
    <div style={{ opacity: t, translate: `0px ${(1 - t) * 24}px` }}>
      <div
        style={{
          ...TYPE.body,
          fontWeight: 300,
          fontSize: 28,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: COLOR.white,
          textShadow: "0 2px 10px rgba(0,0,0,0.9)",
        }}
      >
        {top}
      </div>
      <div
        style={{
          ...ANTON,
          fontSize: 70,
          color: "#fff",
          textShadow: "0 6px 20px rgba(0,0,0,0.9)",
        }}
      >
        {main}
      </div>
    </div>
  );
};
const NODES = [
  { x: 1260, y: 300, label: "PUERTO RICO" },
  { x: 1790, y: 200, label: "SOUL · REGGAE · SALSA" },
  { x: 840, y: 850, label: "THE SOUND" },
];
const LINKS: [number, number, string][] = [
  [0, 2, COLOR.gold],
  [1, 2, RED],
  [0, 1, "#fff"],
];
export const E06Crossing: React.FC = () => {
  const frame = useCurrentFrame();
  const after = Math.max(0, frame - (E6_MERGE + 34));
  const push = 1 + after * 0.0005;
  const lines = interpolate(
    frame,
    [E6_MERGE + 40, E6_MERGE + 70],
    [0, 1],
    clamp,
  );
  const flow = frame * 0.02;
  const lab = (at: number, t: string, m: string) => (
    <Sequence from={at} layout="none">
      <PanelLab top={t} main={m} />
    </Sequence>
  );
  return (
    <Finish dust={0.3}>
      <AbsoluteFill
        style={{ scale: String(push), transformOrigin: "960px 560px" }}
      >
        <MergeSplit
          src={img("n6")}
          mergeAt={E6_MERGE}
          mergeDur={34}
          filter={WARM}
          panels={[
            {
              sx: 190,
              sy: 430,
              s0: 1.8,
              start: 52,
              label: lab(58, "Jamaicans & other", "Caribbean people"),
            },
            {
              sx: 1260,
              sy: 340,
              s0: 1.8,
              start: 26,
              label: lab(32, "Puerto Rican", "communities"),
            },
            {
              sx: 1550,
              sy: 760,
              s0: 1.8,
              start: 0,
              label: lab(6, "Black", "communities"),
            },
          ]}
        />
        {lines > 0 ? (
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            {LINKS.map(([a, b, c], i) => {
              const A = NODES[a];
              const B = NODES[b];
              const mx = (A.x + B.x) / 2 + (i - 1) * 160;
              const my = (A.y + B.y) / 2 - 120;
              return (
                <path
                  key={i}
                  d={`M ${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`}
                  fill="none"
                  stroke={c}
                  strokeWidth={4}
                  strokeDasharray="3 14"
                  strokeDashoffset={-flow * 60 * (i + 1)}
                  strokeLinecap="round"
                  opacity={lines}
                  style={{ filter: `drop-shadow(0 0 6px ${c})` }}
                />
              );
            })}
            {NODES.map((n, i) => (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={10 + 4 * Math.sin(frame / 5 + i)}
                fill={RED}
                opacity={lines}
              />
            ))}
          </svg>
        ) : null}
        {NODES.map((n, i) => (
          <div
            key={n.label}
            style={{
              position: "absolute",
              left: n.x + (i === 1 ? -360 : 24),
              top: n.y + 18,
              ...MONO,
              fontSize: 28,
              background: "rgba(255,255,255,0.92)",
              color: "#111",
              padding: "5px 12px",
              opacity: ease(
                frame,
                E6_MERGE + 44 + i * 6,
                E6_MERGE + 54 + i * 6,
              ),
            }}
          >
            {n.label}
          </div>
        ))}
      </AbsoluteFill>
      {frame > E6_MERGE + 20 ? (
        <AbsoluteFill
          style={{
            background: SHADE,
            opacity: ease(frame, E6_MERGE + 20, E6_MERGE + 40),
          }}
        />
      ) : null}
      <Sequence from={E6_MERGE + 60} layout="none">
        <Pair
          thin="close enough for sounds and ideas to keep"
          heavy="crossing paths"
          at={0}
          y={760}
          size={150}
        />
      </Sequence>
      <ReconTag />
      {[0, 26, 52].map((f) => (
        <Sfx key={f} name="whoosh" at={f} volume={0.25} />
      ))}
      <Sfx name="riser" at={E6_MERGE - 20} volume={0.25} />
      <Sfx name="hit" at={E6_MERGE + 34} volume={0.35} />
    </Finish>
  );
};

// ============ E07 — "That matters, because hip-hop did not grow in a silent neighborhood.
// [MUSIC ENTERS] The Bronx was already loud."
// A frozen, colourless street and a flat audio line; the line spikes, a shockwave hits, colour slams
// back, and the sound system cuts on every beat.
const DROP = 140;
const BEAT = 15;
const CUTS = ["n8c", "n8a", "n8b", "n8d", "o_djsys", "n10"];
const E7_KEYS = [
  { f: 0, s: 1.08, x: 960, y: 540 },
  { f: DROP, s: 1.12, x: 960, y: 540, e: "drift" as const },
];
export const E07Loud: React.FC = () => {
  const frame = useCurrentFrame();
  const since = frame - DROP;
  const pump = since >= 0 ? Math.exp(-(since % BEAT) / 4) : 0;
  const shotIdx =
    since >= 0 ? Math.min(CUTS.length - 1, Math.floor(since / BEAT)) : -1;
  const flatline = (() => {
    const pts: string[] = [];
    for (let x = 160; x <= 1760; x += 8) {
      const near = Math.max(0, 1 - Math.abs(x - 960) / 500);
      const spike =
        frame >= DROP - 4 && frame < DROP + 6
          ? near * 160 * Math.sin(x / 9 + frame)
          : 0;
      const jitter =
        (Math.sin(x * 0.7 + frame * 0.9) + Math.sin(x * 1.3)) * 1.2;
      pts.push(`${x},${(900 + jitter + spike).toFixed(1)}`);
    }
    return `M ${pts.join(" L ")}`;
  })();
  return (
    <Finish dust={since >= 0 ? 0.4 : 0}>
      {since < 0 ? (
        <>
          <Rig keys={E7_KEYS}>
            <Plate
              src={img("n3-plate")}
              filter="saturate(0.08) brightness(0.72) contrast(1.05)"
            />
          </Rig>
          <AbsoluteFill>
            <Rig
              keys={E7_KEYS.map((k) => ({ ...k, s: k.s * 1.05 }))}
              opaque={false}
            >
              <Plate
                src={"hiphop/n3-cut.png"}
                filter="saturate(0.08) brightness(0.72) contrast(1.05)"
              />
            </Rig>
          </AbsoluteFill>
          <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.35)" }} />
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 430,
              textAlign: "center",
              fontSize: 40,
              color: "#fff",
            }}
          >
            <TypeOn
              text="hip-hop did not grow in a"
              at={8}
              cps={1.4}
              cursor={false}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 500,
              textAlign: "center",
            }}
          >
            <TypeOn
              text="SILENT NEIGHBORHOOD"
              at={44}
              cps={0.7}
              style={{
                ...TYPE.body,
                fontWeight: 200,
                fontSize: 104,
                letterSpacing: "0.2em",
                color: "rgba(244,241,234,0.85)",
              }}
            />
          </div>
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            <path
              d={flatline}
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth={2}
            />
          </svg>
        </>
      ) : (
        <AbsoluteFill
          style={{
            scale: String(1 + 0.03 * pump),
            translate: `${Math.sin(frame * 9) * 6 * pump}px ${Math.cos(frame * 7) * 5 * pump}px`,
          }}
        >
          {since < 6 ? (
            <RgbSplit
              src={img(CUTS[0])}
              amount={24 * (1 - since / 6)}
              filter="contrast(1.1) saturate(1.2)"
            />
          ) : (
            <Sequence from={DROP + shotIdx * BEAT} key={shotIdx}>
              <Rig
                keys={[
                  { f: 0, s: 1.2, x: 960, y: 540 },
                  {
                    f: shotIdx === CUTS.length - 1 ? 300 - DROP : BEAT,
                    s: shotIdx === CUTS.length - 1 ? 1.06 : 1.3,
                    x: 960,
                    y: 540,
                    e: "drift",
                  },
                ]}
              >
                <Plate
                  src={img(CUTS[shotIdx])}
                  filter="contrast(1.1) saturate(1.2)"
                />
              </Rig>
            </Sequence>
          )}
          {since >= 0 && since % BEAT < 2 && shotIdx < CUTS.length ? (
            <AbsoluteFill
              style={{ backgroundColor: "rgba(255,240,225,0.35)" }}
            />
          ) : null}
        </AbsoluteFill>
      )}
      {frame < DROP - 4 ? null : <Shockwave at={DROP} />}
      {since >= 75 ? (
        <AbsoluteFill
          style={{
            background: SHADE,
            opacity: ease(frame, DROP + 75, DROP + 85),
          }}
        />
      ) : null}
      <Sequence from={DROP + 78} layout="none">
        <div style={{ scale: String(1 + 0.04 * pump) }}>
          <Pair
            thin="the Bronx was"
            heavy="already loud."
            at={0}
            y={720}
            size={200}
          />
        </div>
      </Sequence>
      <ReconTag />
      <Sfx name="tick" at={44} volume={0.15} />
      <Sfx name="boom" at={DROP} volume={0.6} />
      {Array.from({ length: 10 }).map((_, i) => (
        <Sfx key={i} name="hit" at={DROP + i * BEAT} volume={0.2} />
      ))}
    </Finish>
  );
};
