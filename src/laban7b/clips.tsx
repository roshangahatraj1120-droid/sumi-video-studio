import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt } from "../laban/overlays";
import { Plate, Rig } from "../laban3/rig";
import { LightSweep } from "../laban9/fx9";

// Laban — Part 7b: "That changed the philosophical meaning of notation." Sits right before Part 7 clip
// 09. 30 fps. A dictionary entry for "notation" set over the notation page; the definition rewrites
// itself from "remember" to "claim", and the light on the page turns from warm to cold.
export const LEN7B = { v01: 210 };

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
const STRIKE = 104;
const SWAP = 120;

const Typed: React.FC<{
  text: string;
  at: number;
  speed?: number;
  style: React.CSSProperties;
}> = ({ text, at, speed = 1.4, style }) => {
  const frame = useCurrentFrame();
  const n = Math.max(
    0,
    Math.min(text.length, Math.floor((frame - at) * speed)),
  );
  return <span style={style}>{text.slice(0, n)}</span>;
};

export const V01Meaning: React.FC = () => {
  const frame = useCurrentFrame();
  const cold = interpolate(frame, [SWAP - 10, SWAP + 30], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const strike = interpolate(frame, [STRIKE, STRIKE + 12], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const fadeOld = interpolate(frame, [SWAP, SWAP + 10], [1, 0.35], clamp);
  const claimIn = ease(frame, SWAP + 4, SWAP + 22);
  const head = ease(frame, 6, 24);
  const card = ease(frame, 2, 20);
  // sharp on the page for the push-in, then racks soft as the entry arrives
  const focus = interpolate(frame, [0, 14, 30], [0, 0, 3], clamp);
  const claimW = ease(frame, SWAP, SWAP + 14);
  const body = {
    ...TYPE.headline,
    fontStyle: "normal" as const,
    fontWeight: 500,
    fontSize: 64,
    color: COLOR.white,
  };
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.0, x: 960, y: 540 },
          { f: 22, s: 1.14, x: 910, y: 520, e: "ramp" },
          { f: 210, s: 1.3, x: 1020, y: 500, e: "drift" },
        ]}
      >
        <Plate
          src="laban7/g07-page.jpg"
          filter={`blur(${focus.toFixed(2)}px) brightness(${0.62 + 0.2 * (1 - card) - 0.1 * cold}) sepia(${0.35 * (1 - cold)}) saturate(${1 - 0.7 * cold}) hue-rotate(${-12 * cold}deg) contrast(1.05)`}
        />
      </Rig>
      <LightSweep at={SWAP - 6} dur={46} angle={100} strength={0.18} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 40% 50%, rgba(10,6,8,0.55), rgba(10,6,8,0.85) 100%)",
        }}
      />
      <Sequence durationInFrames={84} layout="none">
        <CaptionAt
          text="that changed the philosophical meaning of"
          start={4}
          x={170}
          y={190}
          size={40}
        />
      </Sequence>
      {/* dictionary entry */}
      <div
        style={{
          position: "absolute",
          left: 170,
          top: 300,
          opacity: card,
          translate: `0px ${(1 - card) * 20}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 30,
            opacity: head,
          }}
        >
          <span
            style={{
              ...TYPE.headline,
              fontSize: 150,
              lineHeight: 1,
              color: COLOR.gold,
              textShadow: `0 0 30px ${COLOR.gold}55`,
            }}
          >
            no·ta·tion
          </span>
          <span
            style={{
              ...TYPE.label,
              fontSize: 26,
              letterSpacing: "0.24em",
              color: COLOR.white,
              opacity: 0.75,
            }}
          >
            noun
          </span>
        </div>
        <div
          style={{
            width: 760 * ease(frame, 18, 40),
            height: 2,
            background: COLOR.gold,
            margin: "26px 0 34px",
            opacity: 0.8,
          }}
        />
        <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
          <span
            style={{
              ...TYPE.label,
              fontSize: 30,
              color: COLOR.gold,
              letterSpacing: "0.1em",
            }}
          >
            1.
          </span>
          <span style={{ ...body, whiteSpace: "nowrap" }}>
            <Typed text="a way to " at={36} style={body} />
            <span
              style={{
                position: "relative",
                display: "inline-block",
                opacity: fadeOld,
              }}
            >
              <Typed text="remember" at={42} style={body} />
              <span
                style={{
                  position: "absolute",
                  left: -6,
                  top: "54%",
                  height: 6,
                  width: `calc(${strike} * (100% + 12px))`,
                  background: COLOR.rose,
                  boxShadow: `0 0 12px ${COLOR.rose}`,
                }}
              />
            </span>
            <span
              style={{
                display: "inline-block",
                verticalAlign: "bottom",
                overflow: "hidden",
                maxWidth: 250 * claimW,
                marginLeft: 22 * claimW,
                padding: "8px 0 2px",
                opacity: claimIn,
                translate: `0px ${(1 - claimIn) * -24}px`,
                filter: `blur(${(1 - claimIn) * 8}px)`,
                ...TYPE.heavy,
                fontSize: 70,
                textTransform: "uppercase",
                color: COLOR.gold,
                textShadow: `0 0 26px ${COLOR.gold}77`,
              }}
            >
              claim
            </span>
            <Typed text=" a dance." at={50} style={body} />
          </span>
        </div>
      </div>
      <Sfx name="drone" at={0} volume={0.22} />
      {Array.from({ length: 10 }).map((_, i) => (
        <Sfx key={i} name="tick" at={36 + i * 3} volume={0.14} />
      ))}
      <Sfx name="whoosh" at={STRIKE - 2} volume={0.3} />
      <Sfx name="hit" at={SWAP + 6} volume={0.4} />
    </Finish>
  );
};
