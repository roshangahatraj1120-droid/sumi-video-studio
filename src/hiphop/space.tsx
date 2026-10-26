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
import { ANTON, clamp, ease, img, MONO, ReconTag, RED, WARM } from "./kit";
import { TypeOn } from "./kit2";

// Hip-hop episode — "A song can have lyrics, melody, horns, strings – but when the rhythm opens up, your
// body hears space." Full-frame B-roll, 30 fps, 9 s. A crowded multitrack of the song fills the frame
// over a blurred dancer; the tracks mute one by one, only the drums stay; the lanes part like doors,
// the dancer comes into focus, and SPACE opens between the drum hits.
export const LEN_SPACE = 270;
const LANES = [
  { w: "Lyrics", c: "#E8C27A", at: 10 },
  { w: "Melody", c: "#7FD1FF", at: 30 },
  { w: "Horns", c: "#FFB347", at: 50 },
  { w: "Strings", c: "#C9A7FF", at: 70 },
];
const MUTE = 104;
const OPEN = 150;
const LANE_H = 120;
const TOP = 200;
const KEYS = [
  { f: 0, s: 1.22, x: 820, y: 560 },
  { f: 270, s: 1.38, x: 790, y: 540, e: "smooth" as const },
];

const Lane: React.FC<{
  y: number;
  c: string;
  seed: string;
  amp: number;
  scroll: number;
  drums?: boolean;
  glow?: number;
}> = ({ y, c, seed, amp, scroll, drums, glow = 0 }) => {
  const n = 170;
  return (
    <svg
      width={1920}
      height={LANE_H}
      style={{ position: "absolute", left: 0, top: y }}
    >
      {Array.from({ length: n }).map((_, i) => {
        const x = 300 + i * 9.5;
        const k = Math.floor(i + scroll);
        let a: number;
        if (drums) {
          const m = ((k % 16) + 16) % 16;
          a = m === 0 ? 100 : m === 8 ? 70 : m === 4 || m === 12 ? 36 : 3;
        } else {
          a = (16 + random(`${seed}${k}`) * 84) * amp + 2;
        }
        return (
          <rect
            key={i}
            x={x}
            y={LANE_H / 2 - a / 2}
            width={5}
            height={a}
            rx={2}
            fill={c}
            opacity={0.9}
          />
        );
      })}
      {drums && glow > 0
        ? Array.from({ length: 11 }).map((_, j) => {
            // soft gold glow in the gaps between hits
            const off = ((scroll % 16) + 16) % 16;
            const x = 300 + (j * 16 - off + 2) * 9.5;
            if (x < 290 || x > 1900) return null;
            return (
              <rect
                key={`g${j}`}
                x={x}
                y={LANE_H / 2 - 30}
                width={5 * 9.5}
                height={60}
                rx={8}
                fill={COLOR.gold}
                opacity={0.22 * glow}
              />
            );
          })
        : null}
    </svg>
  );
};

export const SpaceB: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = frame * 0.9;
  const open = interpolate(frame, [OPEN, OPEN + 26], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const blur = 12 * (1 - open);
  const rim = ease(frame, OPEN + 10, OPEN + 40);
  const sp = ease(frame, OPEN + 40, OPEN + 110);
  const drumsY = TOP + LANES.length * LANE_H + 40;
  const drumsYOpen = 860;
  const dy = drumsY + (drumsYOpen - drumsY) * open;
  return (
    <Finish dust={0.25}>
      <Rig keys={KEYS}>
        <Plate
          src={img("m7-plate")}
          filter={`${WARM} blur(${blur}px) brightness(${0.45 + 0.55 * open})`}
        />
      </Rig>
      <AbsoluteFill>
        <Rig keys={KEYS.map((k) => ({ ...k, s: k.s * 1.06 }))} opaque={false}>
          <Plate
            src="hiphop/m7-cut.png"
            filter={`${WARM} blur(${blur}px) brightness(${0.5 + 0.5 * open}) drop-shadow(0 0 ${16 * rim}px rgba(255,200,110,${0.85 * rim})) drop-shadow(0 0 ${40 * rim}px rgba(255,170,80,${0.45 * rim}))`}
          />
        </Rig>
      </AbsoluteFill>
      <AbsoluteFill
        style={{ backgroundColor: `rgba(6,6,7,${0.55 * (1 - open)})` }}
      />
      <LightSweep at={OPEN + 6} dur={50} angle={100} strength={0.18} />
      <AbsoluteFill
        style={{
          opacity: open,
          background:
            "linear-gradient(90deg, rgba(5,5,6,0.75) 0%, rgba(5,5,6,0.35) 35%, rgba(5,5,6,0) 55%), linear-gradient(0deg, rgba(5,5,6,0.75) 0%, rgba(5,5,6,0) 22%)",
        }}
      />

      {/* the multitrack: four song lanes that part like doors */}
      {LANES.map((l, i) => {
        if (frame < l.at) return null;
        const inP = ease(frame, l.at, l.at + 10);
        const muteAt = MUTE + i * 10;
        const muted = ease(frame, muteAt, muteAt + 8);
        const y0 = TOP + i * LANE_H;
        const away =
          i < 2 ? -(y0 + LANE_H + 40) * open : (1080 - y0 + 40) * open;
        return (
          <div
            key={l.w}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 1920,
              translate: `0px ${away}px`,
              opacity: inP,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 120,
                top: y0 + 36,
                ...MONO,
                fontSize: 30,
                color: muted > 0.5 ? "rgba(255,255,255,0.4)" : l.c,
                width: 170,
              }}
            >
              <span style={{ position: "relative" }}>
                {l.w.toUpperCase()}
                <span
                  style={{
                    position: "absolute",
                    left: -6,
                    top: "50%",
                    height: 4,
                    width: `calc(${muted} * (100% + 12px))`,
                    background: RED,
                  }}
                />
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                left: 1840,
                top: y0 + 38,
                width: 44,
                height: 44,
                borderRadius: 6,
                border: "2px solid rgba(255,255,255,0.6)",
                background: muted > 0.5 ? RED : "transparent",
                ...MONO,
                fontSize: 22,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              M
            </div>
            <Lane
              y={y0}
              c={l.c}
              seed={l.w}
              amp={1 - 0.97 * muted}
              scroll={scroll}
            />
            <div
              style={{
                position: "absolute",
                left: 300,
                top: y0 + LANE_H - 2,
                width: 1600,
                height: 1,
                background: "rgba(255,255,255,0.15)",
              }}
            />
          </div>
        );
      })}

      {/* the drums stay */}
      {frame >= 86 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920,
            opacity: ease(frame, 86, 96),
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 120,
              top: dy + 36,
              ...MONO,
              fontSize: 30,
              color: RED,
              width: 170,
            }}
          >
            DRUMS
          </div>
          <Lane
            y={dy}
            c={RED}
            seed="dr"
            amp={1}
            scroll={scroll}
            drums
            glow={sp}
          />
        </div>
      ) : null}

      {/* text */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 80,
          textAlign: "center",
          opacity: 1 - open,
          fontSize: 44,
          color: "#fff",
          textShadow: "0 2px 12px rgba(0,0,0,0.95)",
        }}
      >
        <TypeOn
          text={
            frame < MUTE
              ? "a song can have lyrics, melody, horns, strings —"
              : "but when the rhythm opens up,"
          }
          at={frame < MUTE ? 6 : MUTE}
          cps={1.8}
          cursor={false}
        />
      </div>
      {frame >= OPEN + 20 ? (
        <div style={{ position: "absolute", left: 90, top: 200, width: 1000 }}>
          <div
            style={{
              ...TYPE.body,
              fontWeight: 300,
              fontSize: 46,
              letterSpacing: "0.12em",
              color: "#fff",
              opacity: ease(frame, OPEN + 20, OPEN + 34),
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
            }}
          >
            your body hears
          </div>
          <div
            style={{
              ...ANTON,
              fontSize: 210,
              color: "#fff",
              letterSpacing: `${0.02 + sp * 0.32}em`,
              opacity: ease(frame, OPEN + 30, OPEN + 44),
              textShadow: `0 0 ${30 * sp}px rgba(255,200,120,0.55), 0 8px 30px rgba(0,0,0,0.8)`,
            }}
          >
            Space
          </div>
        </div>
      ) : null}
      <ReconTag />
      {LANES.map((l) => (
        <Sfx key={l.w} name="tick" at={l.at} volume={0.2} />
      ))}
      {LANES.map((_, i) => (
        <Sfx key={`m${i}`} name="tick" at={MUTE + i * 10} volume={0.3} />
      ))}
      <Sfx name="whoosh" at={OPEN} volume={0.45} />
      <Sfx name="hit" at={OPEN + 30} volume={0.35} />
    </Finish>
  );
};
