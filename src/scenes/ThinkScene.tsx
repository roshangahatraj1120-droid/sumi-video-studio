import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { serif } from "./theme";

// "Think about the problem."
export const ThinkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const blur = interpolate(frame, [12, 34], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      name="Think"
      style={{
        backgroundColor: "#0B0A0F",
        fontFamily: serif,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Interactive.Div
        name="Title group"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          scale: interpolate(frame, [0, durationInFrames], [1, 1.06], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
        }}
      >
        <Interactive.Div
          name="Think about"
          style={{
            fontSize: 76,
            color: "#F2EBDD",
            letterSpacing: "0.02em",
            opacity: interpolate(frame, [4, 22], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: interpolate(frame, [4, 28], ["0px 36px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          Think about
        </Interactive.Div>
        <Interactive.Div
          name="the problem."
          style={{
            fontSize: 176,
            fontStyle: "italic",
            color: "#D4A55A",
            lineHeight: 1.15,
            filter: `blur(${blur}px)`,
            opacity: interpolate(frame, [12, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: interpolate(frame, [12, 38], ["0px 50px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          the problem.
        </Interactive.Div>
        <Interactive.Div
          name="Underline"
          style={{
            height: 3,
            marginTop: 28,
            backgroundColor: "#D4A55A",
            width: interpolate(frame, [26, 54], [0, 620], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.65, 0, 0.35, 1),
            }),
          }}
        />
      </Interactive.Div>
    </AbsoluteFill>
  );
};
