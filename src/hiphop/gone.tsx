import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";
import { Finish, Sfx } from "../laban/broll";
import { Plate, Rig } from "../laban3/rig";
import { LightSweep } from "../laban9/fx9";
import { Disintegrate } from "../laban10/fx10";
import { ANTON, clamp, ease, img, MONO, ReconTag, RED, WARM } from "./kit";
import { TypeOn } from "./kit2";

// Hip-hop episode — "And just when your body finds the moment… it is gone." 30 fps, 8 s.
// Needle drops (full beat) → the dancer finds the moment inside the break (gold rim light, beat rings,
// the waveform opening up) → a hand slams the record to a stop → the dancer dissolves into dust and
// the studio drains cold → the empty circle.
export const LEN_GONE = 240;
const FIND = 22;
const STOP = 118;
const GONE = 130;
const EMPTY = 196;
const BEAT = 15;
const KEYS = [
  { f: FIND, s: 1.18, x: 800, y: 560 },
  { f: STOP, s: 1.34, x: 780, y: 540, e: "smooth" as const },
  { f: GONE, s: 1.34, x: 780, y: 540, e: "drift" as const },
  { f: EMPTY + 4, s: 1.24, x: 790, y: 550, e: "drift" as const },
];
const FEET = { x: 1019, y: 905 };

// A waveform that is the full beat, opens into the break, then (at the stop) pitches down to a flat line
const Wave: React.FC<{ open: number; stop: number; head: number }> = ({
  open,
  stop,
  head,
}) => {
  const n = 150;
  return (
    <svg
      width={1920}
      height={260}
      style={{ position: "absolute", left: 0, top: 860 }}
    >
      {Array.from({ length: n }).map((_, i) => {
        const x = 160 + i * 10.7;
        const dense = 30 + random(`gw${i}`) * 160;
        const k = i % 8;
        const sparse = k === 0 ? 190 : k === 4 ? 80 : 4;
        const a0 = dense + (sparse - dense) * open;
        // the stop sweeps right to left, squashing everything to a line
        const squash = interpolate(
          stop * 1.4 - (1 - i / n) * 0.4,
          [0, 1],
          [1, 0.02],
          clamp,
        );
        const a = Math.max(2, a0 * squash);
        const lit = i / n <= head;
        return (
          <rect
            key={i}
            x={x}
            y={130 - a / 2}
            width={5}
            height={a}
            rx={2}
            fill={
              stop > 0
                ? "rgba(255,255,255,0.55)"
                : lit
                  ? open > 0.5
                    ? RED
                    : COLOR.gold
                  : "rgba(255,255,255,0.6)"
            }
          />
        );
      })}
    </svg>
  );
};

export const GoneMoment: React.FC = () => {
  const frame = useCurrentFrame();
  const open = ease(frame, FIND + 10, FIND + 40);
  const head = interpolate(frame, [FIND, STOP], [0.05, 0.82], clamp);
  const stopP = interpolate(frame, [STOP, STOP + 30], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const rim =
    ease(frame, FIND + 20, FIND + 50) * (1 - ease(frame, GONE, GONE + 10));
  const dust = interpolate(frame, [GONE, GONE + 58], [0, 1], clamp);
  const cold = ease(frame, GONE, GONE + 40);
  const toEmpty = ease(frame, EMPTY - 12, EMPTY + 8);
  const beatT = frame >= FIND ? (frame - FIND) % BEAT : 99;
  const pump = frame >= FIND && frame < STOP ? Math.exp(-beatT / 4) : 0;
  const grade = `${WARM} saturate(${1 - 0.85 * cold}) brightness(${1 - 0.3 * cold}) contrast(${1 + 0.1 * cold})`;
  const inStop = frame >= STOP && frame < GONE;
  const local = frame - STOP;
  return (
    <Finish dust={0.3 * (1 - cold)}>
      {/* 1 · needle drop, full beat */}
      {frame < FIND ? (
        <Rig
          keys={[
            { f: 0, s: 1.5, x: 1050, y: 640 },
            { f: FIND, s: 1.7, x: 1080, y: 650, e: "drift" },
          ]}
          whipOut={1}
        >
          <Plate src={img("k2")} filter="contrast(1.1) brightness(0.9)" />
        </Rig>
      ) : null}

      {/* 2 · the dancer finds the moment / 4 · gone */}
      {frame >= FIND && !inStop ? (
        <AbsoluteFill style={{ scale: String(1 + 0.012 * pump) }}>
          <Rig keys={KEYS} whipIn={frame < FIND + 8 ? 1 : undefined}>
            <Plate src={img("m7-plate")} filter={grade} />
            {/* beat rings on the floor at his feet */}
            {frame < STOP ? (
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
                {[0, 1, 2].map((k) => {
                  const t = ((frame - FIND + k * 5) % BEAT) / BEAT;
                  return (
                    <ellipse
                      key={k}
                      cx={FEET.x}
                      cy={FEET.y}
                      rx={90 + t * 380}
                      ry={22 + t * 90}
                      fill="none"
                      stroke={COLOR.gold}
                      strokeWidth={4 * (1 - t) + 1}
                      opacity={open * (1 - t)}
                    />
                  );
                })}
              </svg>
            ) : null}
          </Rig>
          <AbsoluteFill>
            <Rig
              keys={KEYS.map((k) => ({ ...k, s: k.s * 1.06 }))}
              opaque={false}
            >
              {frame < GONE ? (
                <Plate
                  src="hiphop/m7-cut.png"
                  filter={`${grade} drop-shadow(0 0 ${14 * rim}px rgba(255,200,110,${0.9 * rim})) drop-shadow(0 0 ${40 * rim}px rgba(255,170,80,${0.5 * rim}))`}
                />
              ) : (
                <Disintegrate
                  src="hiphop/m7-cut.png"
                  p={dust}
                  box={[766, 141, 506, 776]}
                  style={{ filter: `saturate(${1 - 0.7 * cold})` }}
                />
              )}
            </Rig>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      {/* 3 · the hand slams the record to a stop */}
      {inStop ? (
        <AbsoluteFill style={{ filter: `blur(${Math.max(0, 6 - local)}px)` }}>
          <Rig
            keys={[
              { f: 0, s: 1.7, x: 1550, y: 640 },
              { f: 12, s: 1.62, x: 1540, y: 640, e: "smooth" },
            ]}
          >
            <Plate src={img("n8d")} filter="contrast(1.15) saturate(0.9)" />
          </Rig>
        </AbsoluteFill>
      ) : null}
      {inStop && local < 3 ? (
        <AbsoluteFill style={{ backgroundColor: "rgba(255,255,255,0.5)" }} />
      ) : null}

      {/* 5 · the empty circle */}
      {frame >= EMPTY - 12 ? (
        <AbsoluteFill style={{ opacity: toEmpty }}>
          <Rig
            keys={[
              { f: 0, s: 1.15, x: 960, y: 640 },
              { f: 240, s: 1.24, x: 960, y: 660, e: "smooth" },
            ]}
          >
            <Plate
              src={img("m2")}
              filter={`${WARM} saturate(0.2) brightness(0.55) contrast(1.1)`}
            />
          </Rig>
        </AbsoluteFill>
      ) : null}

      <LightSweep at={FIND + 30} dur={50} angle={100} strength={0.14} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(5,5,6,0.9) 0%, rgba(5,5,6,0.4) 28%, rgba(5,5,6,0) 45%), linear-gradient(90deg, rgba(5,5,6,0.7) 0%, rgba(5,5,6,0) 45%)",
        }}
      />
      <Wave open={open} stop={stopP} head={head} />
      {frame >= FIND ? (
        <div
          style={{
            position: "absolute",
            left: 160,
            top: 846,
            ...MONO,
            fontSize: 22,
            color:
              stopP > 0
                ? "rgba(255,255,255,0.7)"
                : open > 0.5
                  ? RED
                  : COLOR.gold,
          }}
        >
          {stopP > 0 ? "■ STOPPED" : open > 0.5 ? "● THE BREAK" : "● FULL BEAT"}
        </div>
      ) : null}

      {/* text */}
      <div style={{ position: "absolute", left: 120, top: 250, width: 900 }}>
        {frame < GONE ? (
          <>
            <div
              style={{
                fontSize: 46,
                color: "#fff",
                textShadow: "0 2px 12px rgba(0,0,0,0.95)",
                minHeight: 60,
              }}
            >
              <TypeOn
                text="and just when your body"
                at={FIND + 4}
                cps={1.5}
                cursor={false}
              />
            </div>
            <div
              style={{
                ...TYPE.headline,
                fontSize: 120,
                color: COLOR.gold,
                lineHeight: 1.05,
                marginTop: 6,
                opacity: ease(frame, FIND + 40, FIND + 56),
                translate: `0px ${(1 - ease(frame, FIND + 40, FIND + 56)) * 30}px`,
                textShadow: `0 0 ${30 * rim}px rgba(255,190,100,0.6), 0 6px 20px rgba(0,0,0,0.8)`,
              }}
            >
              finds the moment…
            </div>
          </>
        ) : (
          <div style={{ marginTop: 40 }}>
            {"it is gone.".split("").map((ch, i) => {
              const at = GONE + 18 + i * 2;
              const p = ease(frame, at, at + 10);
              // the last letters drift away like the dust
              const away = 0;
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    ...ANTON,
                    fontSize: 200,
                    color: "#fff",
                    opacity: p * (1 - away),
                    translate: `${away * 60}px ${-away * 40}px`,
                    filter: away > 0 ? `blur(${away * 8}px)` : undefined,
                    minWidth: ch === " " ? 50 : undefined,
                    textShadow: "0 8px 30px rgba(0,0,0,0.85)",
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        )}
      </div>
      <ReconTag />
      <Sfx name="hit" at={0} volume={0.3} />
      <Sfx name="whoosh" at={FIND - 6} volume={0.3} />
      {Array.from({ length: 6 }).map((_, i) => (
        <Sfx key={i} name="tick" at={FIND + i * BEAT} volume={0.12} />
      ))}
      <Sfx name="hit" at={STOP} volume={0.5} />
      <Sfx name="glitch" at={STOP + 2} volume={0.25} />
      <Sfx name="drone" at={GONE} volume={0.18} />
    </Finish>
  );
};
