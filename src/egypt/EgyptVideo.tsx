import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FilmLook } from "../scenes/FilmLook";
import { S1Ancient } from "./scenes/S1Ancient";
import { S2Life } from "./scenes/S2Life";
import { S3Connect } from "./scenes/S3Connect";
import { S4Clappers } from "./scenes/S4Clappers";
import { S5Contexts } from "./scenes/S5Contexts";
import { S6Goddesses } from "./scenes/S6Goddesses";

// Sum of scene durations minus transition overlaps: 825 - 5 * 15
export const EGYPT_VIDEO_DURATION = 750;

export const EgyptVideo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0705" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Ancient Egypt" durationInFrames={120}>
          <S1Ancient />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Religious and social life"
          durationInFrames={135}
        >
          <S2Life />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Objects and images"
          durationInFrames={165}
        >
          <S3Connect />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence name="Clappers" durationInFrames={120}>
          <S4Clappers />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Secular and religious"
          durationInFrames={120}
        >
          <S5Contexts />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence name="Hathor and Mut" durationInFrames={165}>
          <S6Goddesses />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {/* lens halation + film texture */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(255,190,120,0) 60%, rgba(255,150,80,0.06) 100%)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
      <FilmLook />
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          pointerEvents: "none",
          opacity: interpolate(frame, [0, 12], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          }),
        }}
      />
    </AbsoluteFill>
  );
};
