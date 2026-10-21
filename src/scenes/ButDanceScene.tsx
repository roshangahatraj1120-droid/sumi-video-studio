import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { serif } from "./theme";

const LETTERS = ["d", "a", "n", "c", "e", "?"];

// "But dance?"
export const ButDanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      name="But dance"
      style={{
        backgroundColor: "#0B0A0F",
        fontFamily: serif,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AbsoluteFill
        name="Content"
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: interpolate(
            frame,
            [durationInFrames - 10, durationInFrames - 1],
            [1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      >
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 50% 55%, rgba(239,91,91,0.28), rgba(239,91,91,0) 45%)",
            opacity: interpolate(frame, [10, 30, 66], [0, 1, 0.7], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: String(1 + Math.sin(frame / 9) * 0.04),
          }}
        />
        <Interactive.Div
          name="But"
          style={{
            fontSize: 72,
            color: "#8C8794",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontStyle: "italic",
            opacity: interpolate(frame, [0, 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [0, 14], ["0px -20px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          But
        </Interactive.Div>
        <div
          style={{
            display: "flex",
            fontSize: 300,
            fontStyle: "italic",
            color: "#EF5B5B",
            lineHeight: 1,
            marginTop: 10,
            scale: String(
              interpolate(frame, [12, 66], [0.96, 1.05], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            ),
          }}
        >
          {LETTERS.map((letter, i) => {
            const p = spring({
              frame: frame - 12 - i * 3,
              fps,
              config: { damping: 9, mass: 0.7 },
            });
            const float = frame > 40 ? Math.sin((frame - 40) / 7 + i) * 6 : 0;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: Math.min(1, Math.max(0, p * 1.4)),
                  translate: `0px ${(1 - p) * 160 + float}px`,
                  rotate: `${(1 - p) * (i % 2 === 0 ? 14 : -14)}deg`,
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
