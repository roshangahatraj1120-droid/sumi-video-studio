import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
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
  Pair,
  Print,
  ReconTag,
  RED,
  RewindFx,
  SHADE,
  Slam,
  TexText,
  TornBand,
} from "./kit";

// Hip-hop episode — opening (script part 1). 30 fps. Kinetic type on black, an archive smash-cut
// montage with a camcorder overlay, a VHS rewind to "the day before", and the title card.
export const LENHO = { h01: 150, h02: 180, h03: 180, h04: 180 };

// 01 — "People say hip-hop was born on August 11, 1973." Black screen, one distant kick.
export const H01Date: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 150], [1, 1.05], clamp);
  return (
    <Finish dust={0.25}>
      <AbsoluteFill style={{ scale: String(push) }}>
        <CaptionAt
          text="people say hip-hop was born on"
          start={8}
          y={300}
          size={42}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 380,
            textAlign: "center",
          }}
        >
          <Slam at={40}>
            <TexText
              text="August 11,"
              src={img("o_street")}
              size={270}
              drift={0.08}
              filter="grayscale(1) brightness(1.7) contrast(1.3)"
            />
          </Slam>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 690,
            textAlign: "center",
          }}
        >
          <Slam at={62}>
            <span
              style={{
                ...ANTON,
                fontSize: 270,
                color: RED,
                textShadow: `0 0 40px rgba(229,50,45,0.45)`,
              }}
            >
              1973
            </span>
          </Slam>
        </div>
      </AbsoluteFill>
      <LightSweep at={92} dur={40} angle={100} strength={0.12} />
      <Sfx name="boom" at={40} volume={0.45} />
      <Sfx name="hit" at={62} volume={0.35} />
    </Finish>
  );
};

// 02 — "One party. One building. One DJ. One night." Crushed-B&W smash cuts on the kick, with
// single-frame inserts and flashes between beats, and the camcorder overlay.
type Shot = { src: string; from: number; to: number; x: number; y: number };
const BEATS = [0, 42, 84, 126];
const SHOTS: Shot[] = [
  { src: "o_party", from: 0, to: 38, x: 900, y: 520 },
  { src: "o_stair", from: 38, to: 40, x: 1300, y: 520 },
  { src: "o_dusk", from: 42, to: 80, x: 760, y: 520 },
  { src: "b01", from: 80, to: 82, x: 960, y: 540 },
  { src: "o_needle", from: 84, to: 102, x: 980, y: 560 },
  { src: "o_cables", from: 102, to: 122, x: 1150, y: 520 },
  { src: "o_djsys", from: 122, to: 124, x: 960, y: 540 },
  { src: "o_lamp", from: 126, to: 180, x: 1240, y: 420 },
];
const FLASH = [
  { at: 40, c: "#fff" },
  { at: 82, c: "#000" },
  { at: 124, c: "#fff" },
];
const WORDS = ["Party.", "Building.", "DJ.", "Night."];

export const H02OneNight: React.FC = () => {
  return (
    <Finish dust={0.5}>
      {SHOTS.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.to - s.from}>
          <Rig
            keys={[
              { f: 0, s: 1.14, x: s.x, y: s.y },
              {
                f: s.to - s.from,
                s: 1.26,
                x: s.x + 20,
                y: s.y - 10,
                e: "drift",
              },
            ]}
            blurScale={0.2}
          >
            <Plate src={img(s.src)} filter={CRUSH} />
          </Rig>
        </Sequence>
      ))}
      {FLASH.map((f) => (
        <Sequence key={f.at} from={f.at} durationInFrames={2}>
          <AbsoluteFill style={{ backgroundColor: f.c }} />
        </Sequence>
      ))}
      <Flicker amount={0.08} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      {BEATS.map((b, i) => (
        <Sequence
          key={b}
          from={b}
          durationInFrames={i < 3 ? 40 : 54}
          layout="none"
        >
          <Pair thin="ONE" heavy={WORDS[i]} at={2} y={400} size={220} />
        </Sequence>
      ))}
      <Hud
        date="AUG 11 1973"
        tag="BRONX, NY"
        startTc={22 * 108000 + 47 * 1800}
      />
      <ReconTag />
      {BEATS.map((b) => (
        <React.Fragment key={b}>
          <Sfx name="boom" at={b} volume={0.35} />
          <Sfx name="hit" at={b} volume={0.25} />
        </React.Fragment>
      ))}
    </Finish>
  );
};

// 03 — "If hip-hop was really born that night... what was happening the day before?"
// The night shot rewinds like a tape, the date counts back, and we land on a sunny afternoon.
const RW = [44, 78];
const BACK = ["o_cables", "o_needle", "o_dusk", "o_party", "b26", "b27"];
export const H03DayBefore: React.FC = () => {
  const frame = useCurrentFrame();
  const rw = frame >= RW[0] && frame < RW[1] ? 1 : 0;
  const day = frame >= RW[1];
  const t = interpolate(frame, RW, [0, 1], clamp);
  // the date stamp rolls back from the night to the afternoon before
  const mins = Math.round(
    interpolate(t, [0, 1], [23 * 60 + 59, -(9 * 60 + 40)]),
  );
  const dd = mins >= 0 ? 11 : 10;
  const m = ((mins % 1440) + 1440) % 1440;
  const stamp = `AUG ${dd} 1973  ${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const backIdx = Math.floor((frame - RW[0]) / 5);
  return (
    <Finish dust={0.4}>
      {!day ? (
        <AbsoluteFill
          style={{
            translate: rw
              ? `${Math.sin(frame * 3) * 14}px ${Math.cos(frame * 2) * 6}px`
              : undefined,
          }}
        >
          {rw && backIdx >= 1 && backIdx <= BACK.length ? (
            <Plate src={img(BACK[backIdx - 1])} filter={CRUSH} />
          ) : (
            <Rig
              keys={[
                { f: 0, s: 1.26, x: 1260, y: 410 },
                { f: 44, s: 1.3, x: 1270, y: 400, e: "drift" },
              ]}
            >
              <Plate src={img("o_lamp")} filter={CRUSH} />
            </Rig>
          )}
        </AbsoluteFill>
      ) : (
        <Sequence from={RW[1]}>
          <Rig
            keys={[
              { f: 0, s: 1.2, x: 1000, y: 600 },
              { f: 102, s: 1.06, x: 960, y: 560, e: "smooth" },
            ]}
          >
            <Plate
              src={img("o_street")}
              filter={`saturate(${0.2 + 0.8 * ease(frame, RW[1], RW[1] + 24)}) contrast(1.05)`}
            />
          </Rig>
        </Sequence>
      )}
      <RewindFx strength={rw} />
      {!day ? <Flicker amount={0.08} /> : null}
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence durationInFrames={RW[0] + 2} layout="none">
        <CaptionAt
          text="if hip-hop was really born that night…"
          start={4}
          y={860}
          size={46}
        />
      </Sequence>
      <Sequence from={RW[1] + 6} layout="none">
        <Pair
          thin="what was happening"
          heavy="the day before?"
          at={0}
          y={770}
          size={150}
        />
      </Sequence>
      <Hud
        date={stamp}
        rec={!rw && !day}
        tag="BRONX, NY"
        startTc={22 * 108000 + 47 * 1800 + 54 * 30}
        opacity={day ? 1 - ease(frame, RW[1] + 30, RW[1] + 50) * 0.6 : 1}
      />
      <ReconTag />
      <Sfx name="glitch" at={RW[0]} volume={0.35} />
      <Sfx name="whoosh" at={RW[0] + 6} volume={0.4} />
      <Sfx name="whoosh" at={RW[0] + 20} volume={0.35} />
      <Sfx name="hit" at={RW[1]} volume={0.35} />
    </Finish>
  );
};

// 04 — TITLE CARD: HIP-HOP WASN'T BORN IN ONE NIGHT / What Was Happening in the Bronx?
// Photocopied prints drift behind; the title slams in line by line; a red torn band unfolds.
const COLLAGE = [
  { src: "o_party", x: 330, y: 250, w: 640, rot: -7 },
  { src: "b27", x: 1610, y: 240, w: 600, rot: 6 },
  { src: "b26", x: 270, y: 830, w: 620, rot: 5 },
  { src: "o_djsys", x: 1650, y: 840, w: 640, rot: -6 },
  { src: "b19", x: 980, y: 140, w: 520, rot: 2 },
  { src: "b25", x: 990, y: 960, w: 560, rot: -3 },
];
export const H04Title: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 180], [1.0, 1.05], clamp);
  const shake = (at: number) => {
    const t = frame - at;
    return t >= 0 && t < 10 ? Math.exp(-t / 3) * 8 : 0;
  };
  const k = shake(6) + shake(20) + shake(36);
  return (
    <Finish dust={0.4}>
      <AbsoluteFill
        style={{
          scale: String(push),
          translate: `${Math.sin(frame * 7) * k}px ${Math.cos(frame * 5) * k}px`,
        }}
      >
        <AbsoluteFill style={{ backgroundColor: "#0B0A0A" }} />
        {COLLAGE.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              translate: `${Math.sin(frame / 40 + i) * 8}px ${Math.cos(frame / 50 + i) * 6}px`,
            }}
          >
            <Print
              src={img(c.src)}
              x={c.x}
              y={c.y}
              w={c.w}
              rot={c.rot}
              filter={CRUSH}
              border={10}
            />
          </div>
        ))}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(8,7,7,0.92), rgba(8,7,7,0.55) 80%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 230,
            textAlign: "center",
          }}
        >
          <Slam at={6}>
            <TexText
              text="Hip-Hop"
              src={img("b17")}
              size={250}
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
            top: 480,
            textAlign: "center",
          }}
        >
          <Slam at={20}>
            <span style={{ ...ANTON, fontSize: 150, color: COLOR.white }}>
              wasn&apos;t born
            </span>
          </Slam>
        </div>
        <TornBand at={36} y={720} h={170}>
          <span
            style={{ ...ANTON, fontSize: 140, color: "#fff", paddingTop: 6 }}
          >
            in one night
          </span>
        </TornBand>
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 840,
            textAlign: "center",
            ...TYPE.headline,
            fontSize: 48,
            color: COLOR.white,
            opacity: ease(frame, 64, 80),
            translate: `0px ${(1 - ease(frame, 64, 80)) * 16}px`,
          }}
        >
          What Was Happening in the Bronx?
        </div>
      </AbsoluteFill>
      <LightSweep at={96} dur={44} angle={100} strength={0.14} />
      <Sfx name="hit" at={6} volume={0.4} />
      <Sfx name="hit" at={20} volume={0.35} />
      <Sfx name="whoosh" at={32} volume={0.4} />
      <Sfx name="boom" at={38} volume={0.5} />
    </Finish>
  );
};
