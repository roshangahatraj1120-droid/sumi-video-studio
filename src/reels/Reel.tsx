import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { COLOR, FONT } from "../brand/tokens";
import DATA from "./reels.json";

// Vertical 1080x1920 reels cut from the long documentaries. Data (cuts, word timings, layouts) comes from
// /home/user/reels/tools/build.py. Two layouts: the host at the desk is reframed to a full-height crop;
// B-roll (with its baked-in text) is shown whole over a blurred fill, with the hook title above it.

loadFont({
  family: "Anton",
  url: staticFile("fonts/Anton.woff2"),
  weight: "400",
});

type Word = { w: string; t: number; e: number };
type Chunk = { i: number[]; t: number; e: number };
type Lay = { host: boolean; t: number; e: number };
type ReelData = {
  src: string;
  hook: string;
  file: string;
  dur: number;
  frames: number;
  words: Word[];
  chunks: Chunk[];
  layout: Lay[];
};
export const REELS = DATA as unknown as Record<string, ReelData>;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

const W = 1080;
const H = 1920;
// the host's horizontal position in the 16:9 frame, per source video
const HOST_X: Record<string, number> = { humans: 0.48, laban: 0.51, hiphop: 0.45 };
const BOX_Y = 660; // top of the 16:9 frame in the B-roll layout
const BOX_H = 608;
const XF = 6; // frames of cross-fade between layouts

const Video: React.FC<{
  file: string;
  style: React.CSSProperties;
  muted?: boolean;
}> = ({ file, style, muted }) => (
  <OffthreadVideo
    src={staticFile(file)}
    muted={muted}
    style={{ position: "absolute", ...style }}
  />
);

// how much of the host layout is showing at time t (with short cross-fades)
const hostAmount = (lay: Lay[], t: number) => {
  const cur = lay.find((l) => t >= l.t && t < l.e) ?? lay[lay.length - 1];
  const base = cur.host ? 1 : 0;
  const fade = XF / 30;
  const k = lay.indexOf(cur);
  if (k > 0 && t - cur.t < fade) {
    const prev = lay[k - 1].host ? 1 : 0;
    return prev + (base - prev) * ((t - cur.t) / fade);
  }
  return base;
};

const stroke = (px: number) => `${px}px #000`;

const Captions: React.FC<{ d: ReelData; t: number; y: number }> = ({
  d,
  t,
  y,
}) => {
  const c = d.chunks.find((ch) => t >= ch.t - 0.05 && t < ch.e + 0.25);
  if (!c) return null;
  const since = (t - c.t) * 30;
  const pop = ease(since, 0, 5);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 110,
        top: y,
        textAlign: "center",
        scale: String(0.9 + 0.1 * pop),
        opacity: pop,
      }}
    >
      {c.i.map((idx) => {
        const w = d.words[idx];
        const on = t >= w.t && t < w.e + 0.05;
        return (
          <span
            key={idx}
            style={{
              display: "inline-block",
              margin: "0 17px",
              fontFamily: FONT.body,
              fontWeight: 900,
              fontSize: 78,
              lineHeight: 1.12,
              textTransform: "uppercase",
              color: on ? COLOR.gold : "#fff",
              WebkitTextStroke: stroke(3),
              paintOrder: "stroke fill",
              textShadow: "0 6px 18px rgba(0,0,0,0.85), 0 0 3px #000",
              scale: on ? "1.035" : "1",
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

export const Reel: React.FC<{ id: string }> = ({ id }) => {
  const d = REELS[id];
  const f = useCurrentFrame();
  const t = f / 30;
  const host = hostAmount(d.layout, t);
  const hookIn = ease(f, 0, 10);
  const toHeader = ease(f, 78, 96); // the big hook settles into a header after ~2.6 s
  const end = ease(f, d.frames - 75, d.frames - 60);
  const sHost = H / 1080;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* B-roll layout: blurred fill + whole frame */}
      <AbsoluteFill style={{ opacity: 1 - host }}>
        <Video
          file={d.file}
          muted
          style={{
            width: 1920 * sHost,
            height: H,
            left: (W - 1920 * sHost) / 2,
            top: 0,
            filter: "blur(36px) brightness(0.42) saturate(1.2)",
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.6) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: BOX_Y,
            width: W,
            height: BOX_H,
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          }}
        >
          <Video
            file={d.file}
            muted
            style={{ width: W, height: BOX_H, left: 0, top: 0 }}
          />
        </div>
      </AbsoluteFill>
      {/* host layout: full-height crop on the host (this layer carries the audio) */}
      <AbsoluteFill style={{ opacity: host }}>
        <Video
          file={d.file}
          style={{
            width: 1920 * sHost,
            height: H,
            left: W / 2 - (HOST_X[d.src] ?? 0.5) * 1920 * sHost,
            top: 0,
            filter: "contrast(1.04) saturate(1.05)",
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </AbsoluteFill>

      {/* progress bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: 8,
          width: W * (f / d.frames),
          background: COLOR.gold,
        }}
      />

      {/* series label + hook (big for the first seconds, then a header) */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 150 + (1 - toHeader) * 120,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT.body,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: "0.32em",
            color: COLOR.gold,
            opacity: hookIn,
            textShadow: "0 2px 8px rgba(0,0,0,0.9)",
            marginBottom: 14,
          }}
        >
          DANCE · WHERE WE COME FROM
        </div>
        <div
          style={{
            fontFamily: "Anton",
            fontSize: 104 - 46 * toHeader,
            lineHeight: 1.05,
            color: "#fff",
            textTransform: "uppercase",
            opacity: hookIn,
            scale: String(0.85 + 0.15 * hookIn),
            textShadow: "0 8px 26px rgba(0,0,0,0.9), 0 0 3px #000",
          }}
        >
          {d.hook}
        </div>
      </div>

      <Captions d={d} t={t} y={host > 0.5 ? 1290 : 1330} />

      {/* end tag */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1585,
          textAlign: "center",
          opacity: end,
          translate: `0px ${(1 - end) * 30}px`,
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: "16px 34px",
            borderRadius: 60,
            background: COLOR.gold,
            color: "#111",
            fontFamily: FONT.body,
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: "0.04em",
          }}
        >
          ▶ Full documentary on YouTube
        </span>
      </div>
    </AbsoluteFill>
  );
};
