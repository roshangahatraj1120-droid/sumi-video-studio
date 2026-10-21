import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GOLD, IVORY, sans, serif } from "./theme";

const rect = (x: number, y: number, w: number, h: number) =>
  `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`;

const COLUMN_XS = [1130, 1234, 1338, 1442, 1546, 1650];

// Each stroke draws on in order: [path, delay, duration, opacity]
const STROKES: [string, number, number, number][] = [
  // construction guides
  ["M 1380 120 V 940", 0, 22, 0.25],
  ["M 980 400 H 1780", 2, 22, 0.25],
  ["M 1380 80 A 320 320 0 1 1 1379.9 80", 4, 34, 0.2],
  // stylobate steps
  [rect(1020, 830, 720, 30), 6, 18, 1],
  [rect(1050, 800, 660, 30), 9, 18, 1],
  [rect(1080, 770, 600, 30), 12, 18, 1],
  // columns
  ...COLUMN_XS.flatMap((cx, i): [string, number, number, number][] => [
    [`M ${cx - 22} 770 V 470 M ${cx + 22} 770 V 470`, 16 + i * 2, 16, 1],
    [rect(cx - 32, 450, 64, 20), 20 + i * 2, 10, 1],
  ]),
  // entablature + pediment
  [rect(1080, 400, 600, 50), 30, 14, 1],
  ["M 1080 425 H 1680", 34, 10, 0.6],
  ["M 1050 400 L 1380 250 L 1710 400 Z", 36, 20, 1],
  ["M 1120 386 L 1380 270 L 1640 386 Z", 40, 18, 0.6],
  // dimension lines
  ["M 1020 920 H 1740 M 1020 905 V 935 M 1740 905 V 935", 44, 16, 0.8],
  ["M 1800 250 V 860 M 1785 250 H 1815 M 1785 860 H 1815", 46, 16, 0.8],
];

// "Architecture could be drawn."
export const ArchitectureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Everything retracts just before the hard cut to "But dance?"
  const retract = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames - 2],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.55, 0, 1, 0.45),
    },
  );
  const labelOpacity =
    interpolate(frame, [54, 64], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * retract;

  return (
    <AbsoluteFill
      name="Architecture"
      style={{ backgroundColor: "#0B0A0F", fontFamily: serif }}
    >
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          <pattern
            id="grid"
            width={60}
            height={60}
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke={GOLD}
              strokeWidth={1}
            />
          </pattern>
        </defs>
        <rect
          width={1920}
          height={1080}
          fill="url(#grid)"
          opacity={
            interpolate(frame, [0, 20], [0, 0.09], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) * retract
          }
        />
        {STROKES.map(([d, delay, duration, opacity], i) => {
          const drawn = interpolate(frame, [delay, delay + duration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.65, 0, 0.35, 1),
          });
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={opacity < 0.5 ? GOLD : IVORY}
              strokeOpacity={opacity}
              strokeWidth={opacity < 0.5 ? 1.5 : 2.5}
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - drawn * retract}
            />
          );
        })}
        <text
          x={1380}
          y={958}
          textAnchor="middle"
          fill={GOLD}
          fontFamily={sans}
          fontSize={24}
          letterSpacing={4}
          opacity={labelOpacity}
        >
          36.00 M
        </text>
        <text
          x={1840}
          y={555}
          textAnchor="middle"
          fill={GOLD}
          fontFamily={sans}
          fontSize={24}
          letterSpacing={4}
          opacity={labelOpacity}
          transform="rotate(90 1840 555)"
        >
          18.00 M
        </text>
      </svg>
      <div style={{ opacity: retract }}>
        <Interactive.Div
          name="Architecture"
          style={{
            position: "absolute",
            left: 150,
            top: 360,
            fontSize: 132,
            fontStyle: "italic",
            color: "#D4A55A",
            opacity: interpolate(frame, [0, 16], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: interpolate(frame, [0, 24], ["-60px 0px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          Architecture
        </Interactive.Div>
        <Interactive.Div
          name="could be drawn"
          style={{
            position: "absolute",
            left: 160,
            top: 540,
            fontSize: 68,
            color: "#F2EBDD",
            opacity: interpolate(frame, [10, 28], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: interpolate(frame, [10, 34], ["0px 30px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          could be drawn.
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
