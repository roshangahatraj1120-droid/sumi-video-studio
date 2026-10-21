import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ThinkScene } from "./scenes/ThinkScene";
import { MusicScene } from "./scenes/MusicScene";
import { WordsScene } from "./scenes/WordsScene";
import { ArchitectureScene } from "./scenes/ArchitectureScene";
import { ButDanceScene } from "./scenes/ButDanceScene";
import { DancerScene } from "./scenes/DancerScene";
import { FilmLook } from "./scenes/FilmLook";

// Sum of scene durations minus transition overlaps: 669 - 3 * 12
export const DANCE_VIDEO_DURATION = 633;

export const DanceVideo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0A0F" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Think" durationInFrames={78}>
          <ThinkScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence name="Music" durationInFrames={75}>
          <MusicScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence name="Words" durationInFrames={72}>
          <WordsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence name="Architecture" durationInFrames={78}>
          <ArchitectureScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="But dance" durationInFrames={66}>
          <ButDanceScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="Dancer" durationInFrames={300}>
          <DancerScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <FilmLook />
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          pointerEvents: "none",
          opacity: interpolate(frame, [0, 10], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          }),
        }}
      />
    </AbsoluteFill>
  );
};
