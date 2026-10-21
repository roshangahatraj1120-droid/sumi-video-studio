import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { IVORY, serif } from "./theme";

// Faint manuscript rows; the middle rows are left empty for the headline
const ROWS = [140, 220, 300, 380, 700, 780, 860, 940];
const HEADLINE_LEAD = "Words";
const HEADLINE_REST = " could be written down.";
const TOTAL_CHARS = HEADLINE_LEAD.length + HEADLINE_REST.length;

// "Words could be written down."
export const WordsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const typed = Math.floor(
    interpolate(frame, [6, 42], [0, TOTAL_CHARS], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const leadShown = HEADLINE_LEAD.slice(0, typed);
  const leadHidden = HEADLINE_LEAD.slice(typed);
  const restTyped = Math.max(0, typed - HEADLINE_LEAD.length);
  const restShown = HEADLINE_REST.slice(0, restTyped);
  const restHidden = HEADLINE_REST.slice(restTyped);
  const caretOn = typed < TOTAL_CHARS || Math.floor(frame / 8) % 2 === 0;

  const caret = (
    <span style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          left: 4,
          top: "0.18em",
          width: 7,
          height: "0.95em",
          backgroundColor: "#D4A55A",
          opacity: caretOn ? 1 : 0,
        }}
      />
    </span>
  );

  return (
    <AbsoluteFill
      name="Words"
      style={{
        backgroundColor: "#0B0A0F",
        fontFamily: serif,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {ROWS.map((y, r) => {
          let x = 120 + random(`indent-${r}`) * 80;
          const bars: React.ReactNode[] = [];
          for (let k = 0; x < 1780; k++) {
            const w = 60 + random(`w-${r}-${k}`) * 180;
            const start = r * 2.5 + k * 2.2;
            const grow = interpolate(frame, [start, start + 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.33, 1, 0.68, 1),
            });
            bars.push(
              <rect
                key={k}
                x={x}
                y={y - 6}
                width={Math.min(w, 1800 - x) * grow}
                height={12}
                rx={6}
                fill={IVORY}
                opacity={0.1}
              />,
            );
            x += w + 26;
          }
          return <g key={r}>{bars}</g>;
        })}
      </svg>
      <div
        style={{
          fontSize: 116,
          color: "#F2EBDD",
          whiteSpace: "pre",
          scale: String(
            interpolate(frame, [0, 72], [1, 1.04], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          ),
        }}
      >
        <span style={{ color: "#D4A55A", fontStyle: "italic" }}>
          {leadShown}
        </span>
        {typed <= HEADLINE_LEAD.length ? caret : null}
        <span style={{ color: "transparent", fontStyle: "italic" }}>
          {leadHidden}
        </span>
        <span>{restShown}</span>
        {typed > HEADLINE_LEAD.length ? caret : null}
        <span style={{ color: "transparent" }}>{restHidden}</span>
      </div>
    </AbsoluteFill>
  );
};
