import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Camera,
  Dust,
  GlyphColumns,
  RegisterBorder,
  TorchLight,
  WallImage,
} from "../env";
import { DancersFrieze } from "../friezes";
import { display, sans } from "../theme";

// "Thousands of years ago in ancient Egypt,"
export const S1Ancient: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const pan = interpolate(frame, [0, durationInFrames], [-300, -520], {
    easing: Easing.inOut(Easing.sin),
  });
  const torch = interpolate(frame, [0, 34], [0, 640], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const reveal = interpolate(frame, [34, 66], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill
      name="Ancient Egypt"
      style={{ backgroundColor: "#0A0705", overflow: "hidden" }}
    >
      <Camera
        scale={interpolate(frame, [0, durationInFrames], [1.08, 1.0])}
        blur={interpolate(frame, [0, 30], [6, 0], {
          extrapolateRight: "clamp",
        })}
      >
        <div
          style={{
            position: "absolute",
            left: pan,
            top: -230,
            width: 2600,
            height: 1500,
          }}
        >
          <WallImage />
          <GlyphColumns
            x={250}
            y={330}
            columns={4}
            rows={9}
            seed="s1a"
            size={56}
          />
          <GlyphColumns
            x={2120}
            y={330}
            columns={4}
            rows={9}
            seed="s1b"
            size={56}
            painted
          />
          <RegisterBorder x={600} y={600} width={1480} />
          <DancersFrieze x={600} y={636} width={1480} height={470} />
          <RegisterBorder x={600} y={1110} width={1480} />
        </div>
      </Camera>
      <TorchLight
        lights={[
          { x: 760, y: 600, radius: torch },
          { x: 1420, y: 660, radius: torch * 0.8, seed: 2 },
        ]}
      />
      <Dust count={70} seed="s1" />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(10,7,5,0.75) 0%, rgba(10,7,5,0) 38%)",
        }}
      />
      <Interactive.Div
        name="Thousands of years ago"
        style={{
          position: "absolute",
          top: 118,
          width: "100%",
          textAlign: "center",
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 30,
          letterSpacing: "0.55em",
          color: "#E0B25A",
          opacity: interpolate(frame, [16, 34], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [16, 40], ["0px 16px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        THOUSANDS OF YEARS AGO
      </Interactive.Div>
      <div
        style={{
          position: "absolute",
          top: 162,
          width: "100%",
          textAlign: "center",
          clipPath: `inset(0 ${100 - reveal}% 0 0)`,
        }}
      >
        <span
          style={{
            fontFamily: display,
            fontWeight: 600,
            fontSize: 150,
            letterSpacing: `${interpolate(frame, [34, durationInFrames], [0.05, 0.1])}em`,
            background:
              "linear-gradient(180deg, #FBE7B0 0%, #E0B25A 48%, #94621F 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 0 18px rgba(224,178,90,0.45))",
          }}
        >
          ANCIENT EGYPT
        </span>
      </div>
      {/* light streak riding the reveal edge */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: `${8 + reveal * 0.84}%`,
          width: 6,
          height: 190,
          rotate: "14deg",
          background:
            "linear-gradient(180deg, rgba(255,240,200,0), rgba(255,240,200,0.95), rgba(255,240,200,0))",
          filter: "blur(2px)",
          opacity: reveal > 0 && reveal < 100 ? 1 : 0,
        }}
      />
    </AbsoluteFill>
  );
};
