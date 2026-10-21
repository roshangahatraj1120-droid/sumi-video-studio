import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GOLD, IVORY, serif } from "./theme";

const STAFF_TOP = 690;
const GAP = 34;

// step 0 = top staff line; each step is half a gap
const NOTES = [
  { x: 240, step: 6 },
  { x: 400, step: 4 },
  { x: 540, step: 5 },
  { x: 680, step: 3 },
  { x: 850, step: 2 },
  { x: 1000, step: 4 },
  { x: 1170, step: 1 },
  { x: 1310, step: 3 },
  { x: 1480, step: 5 },
  { x: 1640, step: 2 },
];
const BEAMS = [
  [2, 3],
  [6, 7],
];

// "Music could be written down."
export const MusicScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const noteY = (step: number) => STAFF_TOP + (step * GAP) / 2;
  const pop = (i: number) =>
    spring({
      frame: frame - 16 - i * 4,
      fps,
      config: { damping: 11, mass: 0.6 },
    });

  return (
    <AbsoluteFill
      name="Music"
      style={{ backgroundColor: "#0B0A0F", fontFamily: serif }}
    >
      <svg
        width={1920}
        height={1080}
        style={{
          position: "absolute",
          translate: `${interpolate(frame, [0, durationInFrames], [40, -70])}px 0px`,
        }}
      >
        {[0, 1, 2, 3, 4].map((line) => {
          const y = STAFF_TOP + line * GAP;
          const drawn = interpolate(frame, [line * 3, line * 3 + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.65, 0, 0.35, 1),
          });
          return (
            <path
              key={line}
              d={`M 60 ${y} L 1860 ${y}`}
              stroke={IVORY}
              strokeOpacity={0.55}
              strokeWidth={2.5}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - drawn}
            />
          );
        })}
        {BEAMS.map(([a, b]) => {
          const p = Math.min(pop(a), pop(b));
          const na = NOTES[a];
          const nb = NOTES[b];
          return (
            <line
              key={a}
              x1={na.x + 15}
              y1={noteY(na.step) - 100}
              x2={na.x + 15 + (nb.x - na.x) * Math.max(0, p)}
              y2={
                noteY(na.step) -
                100 +
                (noteY(nb.step) - noteY(na.step)) * Math.max(0, p)
              }
              stroke={GOLD}
              strokeWidth={12}
            />
          );
        })}
        {NOTES.map((n, i) => {
          const p = pop(i);
          const y = noteY(n.step);
          return (
            <g
              key={i}
              transform={`translate(${n.x} ${y}) scale(${Math.max(0, p)})`}
              opacity={Math.min(1, Math.max(0, p * 1.5))}
            >
              <line
                x1={15}
                y1={-2}
                x2={15}
                y2={-100}
                stroke={GOLD}
                strokeWidth={4}
              />
              <ellipse rx={18} ry={12.5} transform="rotate(-22)" fill={GOLD} />
            </g>
          );
        })}
      </svg>
      <Interactive.Div
        name="Music"
        style={{
          position: "absolute",
          left: 160,
          top: 150,
          fontSize: 200,
          fontStyle: "italic",
          color: "#D4A55A",
          lineHeight: 1.1,
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
        Music
      </Interactive.Div>
      <Interactive.Div
        name="could be written down"
        style={{
          position: "absolute",
          left: 172,
          top: 400,
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
        could be written down.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
