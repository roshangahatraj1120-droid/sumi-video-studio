import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  Series,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Dust, flicker } from "../egypt/env";
import { display } from "../egypt/theme";
import { FilmLook } from "../scenes/FilmLook";
import {
  ConnectRow,
  Dip,
  Flash,
  Grade,
  LightLeak,
  TornStrip,
} from "./overlays";
import { ChannelFilters, Shot } from "./Shot";
import {
  BigWord,
  Caption,
  Marker,
  Scatter,
  Shade,
  Tag,
  TitleReveal,
  Track3D,
} from "./texts";

const I1 = "egypt/shots/img1.jpg"; // sunset festival
const I2 = "egypt/shots/img2.jpg"; // tomb painting
const I3 = "egypt/shots/img3.jpg"; // temple relief
const I4 = "egypt/shots/img4.jpg"; // instruments
const I5 = "egypt/shots/img5.jpg"; // Hathor and Mut

// Shot lengths in frames (30fps), in script order
const D = [
  60, 66, 45, 42, 60, 27, 27, 27, 27, 27, 36, 78, 33, 42, 48, 63, 36, 33, 75,
];
const S = D.reduce<number[]>(
  (acc, d, i) => [...acc, i === 0 ? 0 : acc[i - 1] + D[i - 1]],
  [],
);
export const CINE_DURATION = D.reduce((a, b) => a + b, 0);

const CLAP_BEATS = [18, 36, 54, 72];

const TorchFlicker: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        opacity: Math.max(0, 0.16 - (flicker(frame, 1) - 1) * 1.6),
        pointerEvents: "none",
      }}
    />
  );
};

const EndNames: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <>
      {[
        { label: "HATHOR", x: 603, at: 4 },
        { label: "MUT", x: 1269, at: 12 },
      ].map(({ label, x, at }) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: x - 300,
            width: 600,
            top: 900,
            textAlign: "center",
            fontFamily: display,
            fontWeight: 700,
            fontSize: 76,
            color: "#E0B25A",
            textShadow:
              "0 0 24px rgba(224,178,90,0.6), 0 4px 16px rgba(0,0,0,0.8)",
            letterSpacing: `${interpolate(frame, [at, at + 24], [0.6, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}em`,
            opacity: interpolate(frame, [at, at + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {label}
        </div>
      ))}
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: interpolate(
            frame,
            [durationInFrames - 26, durationInFrames - 2],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      />
    </>
  );
};

export const CineVideo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <ChannelFilters />
      <Series>
        {/* 1 — "Thousands of years ago" */}
        <Series.Sequence name="Thousands of years ago" durationInFrames={D[0]}>
          <Shot
            src={I2}
            from={{ x: 0.3, y: 0.12, w: 0.62 }}
            to={{ x: 0.36, y: 0.16, w: 0.5 }}
          >
            <Shade side="top" amount={0.75} />
            <Track3D
              text="THOUSANDS OF YEARS AGO"
              top={130}
              size={46}
              start={8}
            />
          </Shot>
        </Series.Sequence>
        {/* 2 — "in ancient Egypt," */}
        <Series.Sequence name="in ancient Egypt" durationInFrames={D[1]}>
          <Shot
            src={I2}
            from={{ x: 0, y: 0.1, w: 0.78 }}
            to={{ x: 0.2, y: 0.12, w: 0.78 }}
          >
            <Shade side="top" amount={0.8} />
            <TitleReveal
              text="ANCIENT EGYPT"
              top={110}
              size={150}
              kicker="IN"
            />
          </Shot>
        </Series.Sequence>
        {/* 3 — "dance was already part of" */}
        <Series.Sequence
          name="dance was already part of"
          durationInFrames={D[2]}
        >
          <Shot
            src={I3}
            from={{ x: 0.02, y: 0.05, w: 0.6 }}
            to={{ x: 0.06, y: 0.08, w: 0.5 }}
            whipOut={1}
          >
            <Shade side="top" amount={0.7} />
            <Track3D
              text="DANCE WAS ALREADY PART OF"
              top={120}
              size={44}
              start={2}
              rotate={14}
            />
          </Shot>
        </Series.Sequence>
        {/* 4 — "religious" */}
        <Series.Sequence name="religious" durationInFrames={D[3]}>
          <Shot
            src={I3}
            from={{ x: 0.5, y: 0.02, w: 0.5 }}
            to={{ x: 0.46, y: 0.05, w: 0.5 }}
            whipIn={1}
          >
            <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.25)" }} />
            <BigWord
              text="RELIGIOUS"
              top={360}
              weight={100}
              size={300}
              dir={-1}
            />
          </Shot>
        </Series.Sequence>
        {/* 5 — "and social life." */}
        <Series.Sequence name="and social life" durationInFrames={D[4]}>
          <Shot
            src={I1}
            from={{ x: 0.25, y: 0.15, w: 0.6 }}
            to={{ x: 0, y: 0, w: 1 }}
          >
            <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.22)" }} />
            <BigWord
              text="SOCIAL LIFE"
              top={400}
              weight={900}
              size={250}
              dir={1}
              kicker="and"
            />
          </Shot>
        </Series.Sequence>
        {/* 6 — "Objects" */}
        <Series.Sequence name="Objects" durationInFrames={D[5]}>
          <Shot
            src={I4}
            from={{ x: 0.04, y: 0.02, w: 0.92 }}
            to={{ x: 0.08, y: 0.05, w: 0.86 }}
            whipOut={-1}
          >
            <Scatter text="OBJECTS" top={420} size={150} />
          </Shot>
        </Series.Sequence>
        {/* 7 — "and images" */}
        <Series.Sequence name="and images" durationInFrames={D[6]}>
          <Shot
            src={I2}
            from={{ x: 0.33, y: 0.02, w: 0.52 }}
            to={{ x: 0.36, y: 0.04, w: 0.48 }}
            whipIn={-1}
            whipOut={1}
          >
            <Scatter text="AND IMAGES" top={420} size={150} start={4} />
          </Shot>
        </Series.Sequence>
        {/* 8 — "connect music," */}
        <Series.Sequence name="music" durationInFrames={D[7]}>
          <Shot
            src={I2}
            from={{ x: 0.04, y: 0.38, w: 0.42 }}
            to={{ x: 0.05, y: 0.4, w: 0.38 }}
            whipIn={1}
            whipOut={-1}
          >
            <Shade side="bottom" amount={0.75} />
            <Marker cx={1290} cy={560} rx={300} ry={430} start={4} />
          </Shot>
        </Series.Sequence>
        {/* 9 — "movement," */}
        <Series.Sequence name="movement" durationInFrames={D[8]}>
          <Shot
            src={I1}
            from={{ x: 0.29, y: 0.16, w: 0.42 }}
            to={{ x: 0.31, y: 0.18, w: 0.38 }}
            whipIn={-1}
            whipOut={1}
            kicks={[6]}
          >
            <Shade side="bottom" amount={0.75} />
          </Shot>
        </Series.Sequence>
        {/* 10 — "ceremony," */}
        <Series.Sequence name="ceremony" durationInFrames={D[9]}>
          <Shot
            src={I4}
            from={{ x: 0.08, y: 0, w: 0.48 }}
            to={{ x: 0.1, y: 0.02, w: 0.44 }}
            whipIn={1}
            whipOut={-1}
          >
            <Shade side="bottom" amount={0.75} />
            <Marker cx={625} cy={300} rx={230} ry={300} start={4} />
          </Shot>
        </Series.Sequence>
        {/* 11 — "and celebration." */}
        <Series.Sequence name="celebration" durationInFrames={D[10]}>
          <Shot
            src={I1}
            from={{ x: 0.55, y: 0.12, w: 0.45 }}
            to={{ x: 0.55, y: 0.16, w: 0.42 }}
            whipIn={-1}
          >
            <Shade side="bottom" amount={0.75} />
          </Shot>
        </Series.Sequence>
        {/* 12 — "Clappers were used to keep time" */}
        <Series.Sequence name="Clappers" durationInFrames={D[11]}>
          <Shot
            src={I4}
            from={{ x: 0.42, y: 0.4, w: 0.58 }}
            to={{ x: 0.45, y: 0.42, w: 0.55 }}
            kicks={CLAP_BEATS}
          >
            <Shade side="left" amount={0.85} />
            <Tag
              label="CLAPPERS"
              x={420}
              y={300}
              start={4}
              point={[1180, 520]}
            />
            <Caption
              text="were used to keep time"
              left={130}
              top={470}
              start={20}
              size={58}
            />
            <BeatDots beats={CLAP_BEATS} />
          </Shot>
        </Series.Sequence>
        {/* 13 — "for dance," */}
        <Series.Sequence name="for dance" durationInFrames={D[12]}>
          <Shot
            src={I1}
            from={{ x: 0, y: 0.18, w: 0.36 }}
            to={{ x: 0, y: 0.2, w: 0.32 }}
            kicks={[0, 16]}
          >
            <AbsoluteFill
              style={{
                background:
                  "linear-gradient(270deg, rgba(0,0,0,0.75), rgba(0,0,0,0) 55%)",
              }}
            />
            <Scatter
              text="FOR DANCE"
              left={1060}
              top={420}
              size={130}
              start={1}
            />
          </Shot>
        </Series.Sequence>
        {/* 14 — "including both secular" */}
        <Series.Sequence name="secular" durationInFrames={D[13]}>
          <Shot
            src={I1}
            from={{ x: 0, y: 0.38, w: 0.36 }}
            to={{ x: 0.04, y: 0.4, w: 0.34 }}
          >
            <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.3)" }} />
            <BigWord
              text="SECULAR"
              top={390}
              weight={900}
              size={290}
              dir={-1}
              kicker="including both"
            />
          </Shot>
        </Series.Sequence>
        {/* 15 — "and religious contexts," */}
        <Series.Sequence name="religious contexts" durationInFrames={D[14]}>
          <Shot
            src={I3}
            from={{ x: 0.42, y: 0.18, w: 0.4 }}
            to={{ x: 0.45, y: 0.22, w: 0.36 }}
          >
            <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.3)" }} />
            <BigWord
              text="RELIGIOUS"
              top={360}
              weight={100}
              size={290}
              dir={1}
              kicker="and"
            />
            <Track3D
              text="CONTEXTS"
              top={860}
              size={40}
              start={14}
              rotate={0}
            />
          </Shot>
        </Series.Sequence>
        {/* 16 — "and some were associated with goddesses" */}
        <Series.Sequence name="goddesses" durationInFrames={D[15]}>
          <Shot
            src={I4}
            from={{ x: 0.33, y: 0.04, w: 0.42 }}
            to={{ x: 0.36, y: 0.06, w: 0.36 }}
            whipOut={1}
          >
            <Shade side="bottom" amount={0.85} />
            <Marker cx={950} cy={330} rx={190} ry={250} start={14} />
            <Caption
              text="and some were associated with"
              top={790}
              start={2}
              size={42}
            />
            <Scatter text="GODDESSES" top={850} size={110} start={14} />
          </Shot>
        </Series.Sequence>
        {/* 17 — "such as Hathor" */}
        <Series.Sequence name="Hathor" durationInFrames={D[16]}>
          <Shot
            src={I5}
            from={{ x: 0.18, y: 0, w: 0.36 }}
            to={{ x: 0.2, y: 0, w: 0.32 }}
            whipIn={1}
            whipOut={1}
          >
            <AbsoluteFill
              style={{
                background:
                  "linear-gradient(270deg, rgba(0,0,0,0.7), rgba(0,0,0,0) 50%)",
              }}
            />
            <Caption text="such as" left={1180} top={360} start={0} size={44} />
            <Scatter
              text="HATHOR"
              left={1130}
              top={410}
              size={170}
              start={4}
              bar="rgba(122,15,18,0.55)"
            />
          </Shot>
        </Series.Sequence>
        {/* 18 — "and Mut." */}
        <Series.Sequence name="Mut" durationInFrames={D[17]}>
          <Shot
            src={I5}
            from={{ x: 0.5, y: 0, w: 0.36 }}
            to={{ x: 0.52, y: 0, w: 0.32 }}
            whipIn={1}
          >
            <AbsoluteFill
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.7), rgba(0,0,0,0) 45%)",
              }}
            />
            <Caption text="and" left={190} top={360} start={0} size={44} />
            <Scatter
              text="MUT"
              left={140}
              top={410}
              size={190}
              start={3}
              bar="rgba(122,15,18,0.55)"
            />
          </Shot>
        </Series.Sequence>
        {/* 19 — reveal both goddesses, fade out */}
        <Series.Sequence name="Hathor and Mut" durationInFrames={D[18]}>
          <Shot
            src={I5}
            from={{ x: 0.1, y: 0, w: 0.8 }}
            to={{ x: 0, y: 0, w: 1 }}
          >
            <Shade side="bottom" amount={0.8} />
            <EndNames />
          </Shot>
        </Series.Sequence>
      </Series>

      {/* transitions laid over the cuts */}
      <Sequence durationInFrames={S[2]} layout="none">
        <TorchFlicker />
      </Sequence>
      <Sequence from={S[1] - 3} durationInFrames={6}>
        <Flash />
      </Sequence>
      <Sequence from={S[2] - 12} durationInFrames={24}>
        <LightLeak />
      </Sequence>
      <Sequence from={S[4] - 15} durationInFrames={30}>
        <LightLeak seed={2} strength={1.2} />
      </Sequence>
      <Sequence from={S[5] - 4} durationInFrames={8}>
        <Dip />
      </Sequence>
      <Sequence from={S[7]} durationInFrames={S[11] - S[7]}>
        <ConnectRow
          words={["MUSIC", "MOVEMENT", "CEREMONY", "CELEBRATION"]}
          times={[0, D[7], D[7] + D[8], D[7] + D[8] + D[9]]}
        />
      </Sequence>
      <Sequence from={S[11] - 5} durationInFrames={10}>
        <Dip />
      </Sequence>
      {[...CLAP_BEATS.map((b) => S[11] + b), S[12], S[12] + 16].map((f) => (
        <Sequence key={f} from={f - 1} durationInFrames={6}>
          <Flash color="255,214,150" strength={0.22} />
        </Sequence>
      ))}
      <Sequence from={S[13] - 8} durationInFrames={16}>
        <TornStrip dir={1} />
      </Sequence>
      <Sequence from={S[14] - 8} durationInFrames={16}>
        <TornStrip dir={-1} />
      </Sequence>
      <Sequence from={S[15] - 12} durationInFrames={24}>
        <LightLeak seed={1} />
      </Sequence>
      <Sequence from={S[18] - 3} durationInFrames={6}>
        <Flash />
      </Sequence>

      <Grade />
      <Dust count={50} seed="cine" opacity={0.55} />
      <FilmLook />
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          pointerEvents: "none",
          opacity: interpolate(frame, [0, 14], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};

const BeatDots: React.FC<{ beats: number[] }> = ({ beats }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 136,
        top: 580,
        display: "flex",
        gap: 24,
      }}
    >
      {beats.map((b) => {
        const on = frame >= b;
        return (
          <div
            key={b}
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              border: "2px solid #E0B25A",
              backgroundColor: on ? "#E0B25A" : "transparent",
              boxShadow: on ? "0 0 14px rgba(224,178,90,0.9)" : "none",
              scale: String(on && frame < b + 6 ? 1.6 - (frame - b) / 10 : 1),
              opacity: interpolate(frame, [14, 22], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
        );
      })}
    </div>
  );
};
