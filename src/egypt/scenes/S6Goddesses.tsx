import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Camera, Dust, GlyphColumns } from "../env";
import { Hathor, Mut } from "../figures";
import { display, sans } from "../theme";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// "and some were associated with goddesses such as Hathor and Mut."
export const S6Goddesses: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const drawH = interpolate(frame, [12, 70], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const drawM = interpolate(frame, [30, 88], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const fillH = interpolate(frame, [58, 96], [0, 1], clamp);
  const fillM = interpolate(frame, [76, 114], [0, 1], clamp);
  const glow = 0.5 + 0.5 * Math.sin(frame / 9);
  const name = (start: number) => ({
    opacity: interpolate(frame, [start, start + 18], [0, 1], clamp),
    letterSpacing: `${interpolate(frame, [start, start + 30], [0.6, 0.16], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) })}em`,
  });

  return (
    <AbsoluteFill
      name="Hathor and Mut"
      style={{
        background:
          "radial-gradient(ellipse 80% 70% at 50% 55%, #172a55 0%, #0b1226 45%, #050405 100%)",
        overflow: "hidden",
      }}
    >
      <Camera scale={interpolate(frame, [0, durationInFrames], [1.0, 1.07])}>
        <GlyphColumns
          x={40}
          y={120}
          columns={2}
          rows={12}
          seed="g6a"
          size={58}
          color="rgba(224,178,90,0.12)"
        />
        <GlyphColumns
          x={1720}
          y={120}
          columns={2}
          rows={12}
          seed="g6b"
          size={58}
          color="rgba(224,178,90,0.12)"
        />
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <g
            transform="translate(600 650) scale(2.7)"
            style={{ filter: "drop-shadow(0 0 10px rgba(224,178,90,0.35))" }}
          >
            <Hathor draw={drawH} fill={fillH} glow={glow} />
          </g>
          <g
            transform="translate(1320 650) scale(-2.7 2.7)"
            style={{ filter: "drop-shadow(0 0 10px rgba(224,178,90,0.35))" }}
          >
            <Mut draw={drawM} fill={fillM} glow={glow} />
          </g>
        </svg>
      </Camera>
      <Dust count={70} seed="s6" />
      <Interactive.Div
        name="associated with goddesses"
        style={{
          position: "absolute",
          top: 56,
          width: "100%",
          textAlign: "center",
          fontFamily: sans,
          fontWeight: 300,
          fontSize: 42,
          letterSpacing: "0.03em",
          color: "#F1E4C6",
          opacity: interpolate(frame, [0, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        and some were associated with goddesses such as
      </Interactive.Div>
      {[
        { label: "HATHOR", x: 600, start: 74 },
        { label: "MUT", x: 1320, start: 94 },
      ].map(({ label, x, start }) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: x - 400,
            width: 800,
            top: 872,
            textAlign: "center",
            fontFamily: display,
            fontWeight: 700,
            fontSize: 104,
            color: "#E0B25A",
            textShadow: "0 0 26px rgba(224,178,90,0.55)",
            ...name(start),
          }}
        >
          {label}
        </div>
      ))}
      {/* slow fade to black to close */}
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: interpolate(
            frame,
            [durationInFrames - 26, durationInFrames - 2],
            [0, 1],
            clamp,
          ),
        }}
      />
    </AbsoluteFill>
  );
};
