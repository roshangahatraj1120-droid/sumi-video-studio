import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  KeyLine,
  Label,
  OverlayCanvas,
  OverlayProps,
  WordPair,
} from "../brand/text";
import { COLOR, TYPE } from "../brand/tokens";
import {
  LEN,
  MEASURE_SPLIT,
  MONTAGE_CUTS,
  MONTAGE_SHOT,
  MONTAGE_TOPICS,
  VERB_CUTS,
  WRITTEN_CUTS,
} from "./timing";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// Pairs with B01
export const O01Laban: React.FC<OverlayProps> = ({ bg }) => (
  <OverlayCanvas bg={bg}>
    <Label bg={bg} text="Rudolf Laban" sub="1928" start={18} />
  </OverlayCanvas>
);

// Pairs with B04
export const O02Written: React.FC<OverlayProps> = ({ bg }) => (
  <OverlayCanvas bg={bg}>
    <WordPair
      bg={bg}
      thin="Music"
      heavy="Written down"
      start={WRITTEN_CUTS[0] + 4}
      end={WRITTEN_CUTS[1]}
    />
    <WordPair
      bg={bg}
      thin="Words"
      heavy="Written down"
      start={WRITTEN_CUTS[1] + 4}
      end={WRITTEN_CUTS[2]}
    />
    <WordPair
      bg={bg}
      thin="Architecture"
      heavy="Drawn"
      start={WRITTEN_CUTS[2] + 4}
      end={LEN.written}
    />
  </OverlayCanvas>
);

// Standalone, over the host or black: "But dance?"
export const O03Question: React.FC<OverlayProps> = ({ bg }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pop = interpolate(frame, [8, 20], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.4)),
  });
  const out = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    clamp,
  );
  return (
    <OverlayCanvas bg={bg}>
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", opacity: out }}
      >
        <div
          style={{
            ...TYPE.thin,
            fontSize: 54,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: COLOR.white,
            opacity: interpolate(frame, [0, 8], [0, 1], clamp),
            textShadow: "0 2px 0 rgba(0,0,0,0.6)",
          }}
        >
          But
        </div>
        <div
          style={{
            ...TYPE.headline,
            fontSize: 230,
            lineHeight: 1,
            color: COLOR.gold,
            opacity: Math.min(1, pop * 1.4),
            scale: String(0.85 + 0.15 * pop),
            textShadow:
              bg === "green"
                ? `0 0 6px ${COLOR.gold}cc, 0 3px 0 rgba(0,0,0,0.55)`
                : `0 0 22px ${COLOR.gold}88`,
          }}
        >
          dance
          <span style={{ color: COLOR.rose }}>?</span>
        </div>
      </AbsoluteFill>
    </OverlayCanvas>
  );
};

// Pairs with B05: each verb hits with its cut
export const O04Verbs: React.FC<OverlayProps> = ({ bg }) => {
  const frame = useCurrentFrame();
  const verbs = ["Jumps", "Turns", "Reaches", "Falls"];
  // place each verb in the empty part of its shot
  const right = [false, true, false, true];
  return (
    <OverlayCanvas bg={bg}>
      {verbs.map((v, i) => {
        const start = VERB_CUTS[i];
        const end = VERB_CUTS[i + 1] ?? LEN.verbs;
        if (frame < start || frame >= end) return null;
        const p = interpolate(frame, [start, start + 6], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        const drop =
          i === 3
            ? interpolate(frame, [start, start + 14], [-60, 20], {
                ...clamp,
                easing: Easing.out(Easing.bounce),
              })
            : 0;
        return (
          <div
            key={v}
            style={{
              position: "absolute",
              left: right[i] ? undefined : 120,
              right: right[i] ? 120 : undefined,
              top: 800 + drop,
              ...TYPE.heavy,
              textTransform: "uppercase",
              fontSize: 150,
              lineHeight: 1,
              color: COLOR.gold,
              scale: String(1.25 - 0.25 * p),
              transformOrigin: right[i] ? "right center" : "left center",
              opacity: p * interpolate(frame, [end - 4, end], [1, 0], clamp),
              textShadow:
                bg === "green"
                  ? `0 0 6px ${COLOR.gold}cc, 0 3px 0 rgba(0,0,0,0.55)`
                  : `0 0 24px ${COLOR.gold}88, 0 4px 18px rgba(0,0,0,0.9), 0 0 50px rgba(0,0,0,0.6)`,
            }}
          >
            {v}
          </div>
        );
      })}
    </OverlayCanvas>
  );
};

// Pairs with B08
export const O05Measure: React.FC<OverlayProps> = ({ bg }) => (
  <OverlayCanvas bg={bg}>
    <Label
      bg={bg}
      text="Where it moved"
      start={18}
      end={MEASURE_SPLIT - 4}
      y={930}
      size={72}
    />
    <Label
      bg={bg}
      text="How high · how low"
      start={MEASURE_SPLIT + 14}
      end={MEASURE_SPLIT + 74}
      y={930}
      size={72}
    />
    <Label
      bg={bg}
      text="How long"
      start={MEASURE_SPLIT + 76}
      end={LEN.measure}
      y={930}
      size={72}
    />
  </OverlayCanvas>
);

// Pairs with B09 (notation staff on the right, key line on the left)
export const O06Alphabet: React.FC<OverlayProps> = ({ bg }) => (
  <OverlayCanvas bg={bg}>
    <KeyLine
      bg={bg}
      lead="An alphabet"
      rest="not for speech, but for the body."
      start={20}
      restAt={44}
      x={120}
      y={410}
      width={780}
    />
  </OverlayCanvas>
);

// Pairs with B10: one fast label per topic
export const O07Topics: React.FC<OverlayProps> = ({ bg }) => (
  <OverlayCanvas bg={bg}>
    {MONTAGE_TOPICS.map((t, i) => (
      <Label
        key={t.label}
        bg={bg}
        text={t.label}
        start={MONTAGE_CUTS[i] + 2}
        end={
          i === MONTAGE_TOPICS.length - 1
            ? LEN.montage
            : MONTAGE_CUTS[i] + MONTAGE_SHOT
        }
        speed={0.55}
        size={58}
        y={880}
      />
    ))}
  </OverlayCanvas>
);

// Pairs with B11: final key line, gold word lands last
export const O08Information: React.FC<OverlayProps> = ({ bg }) => (
  <OverlayCanvas bg={bg}>
    <KeyLine
      bg={bg}
      lead="information."
      rest="what happens when human movement becomes"
      start={30}
      restAt={30}
      x={120}
      y={720}
      width={1500}
      leadSize={130}
      restSize={44}
      leadAfter
    />
  </OverlayCanvas>
);

// Positioned label / caption on a transparent canvas, for baking into final clips
export const LabelAt: React.FC<{
  text: string;
  start: number;
  size?: number;
  y?: number;
  x?: number;
}> = ({ text, start, size = 54, y = 880, x = 120 }) => (
  <Label bg="alpha" text={text} start={start} size={size} y={y} x={x} />
);

export const CaptionAt: React.FC<{
  text: string;
  start: number;
  size?: number;
  y: number;
  x?: number;
}> = ({ text, start, size = 44, y, x }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const t = interpolate(frame, [start, start + 14], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x ?? 0,
        width: x === undefined ? "100%" : undefined,
        textAlign: x === undefined ? "center" : "left",
        top: y,
        ...TYPE.body,
        fontSize: size,
        letterSpacing: "0.04em",
        color: COLOR.white,
        opacity: t,
        translate: `0px ${(1 - t) * 18}px`,
        textShadow: "0 2px 14px rgba(0,0,0,0.9)",
      }}
    >
      {text}
    </div>
  );
};
