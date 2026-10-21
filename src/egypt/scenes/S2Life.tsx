import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Camera, Dust, RegisterBorder, TorchLight, WallImage } from "../env";
import { BanquetFrieze, TempleFrieze } from "../friezes";
import { sans } from "../theme";

// "dance was already part of religious and social life."
export const S2Life: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const divider = interpolate(frame, [8, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill
      name="Religious and social life"
      style={{ backgroundColor: "#0A0705", overflow: "hidden" }}
    >
      <Camera
        x={interpolate(frame, [0, durationInFrames], [20, -30])}
        scale={interpolate(frame, [0, durationInFrames], [1.0, 1.05])}
      >
        <div
          style={{
            position: "absolute",
            left: -600,
            top: -230,
            width: 2600,
            height: 1500,
          }}
        >
          <WallImage />
        </div>
        <RegisterBorder x={40} y={372} width={1840} />
        <TempleFrieze x={60} y={410} width={860} height={470} />
        <BanquetFrieze x={1000} y={410} width={880} height={470} />
        <RegisterBorder x={40} y={884} width={1840} />
        {/* gold divider between the two worlds */}
        <div
          style={{
            position: "absolute",
            left: 958,
            top: 372,
            width: 3,
            height: 540 * divider,
            background: "linear-gradient(180deg, #FBE7B0, #E0B25A, #94621F)",
            boxShadow: "0 0 14px rgba(224,178,90,0.8)",
          }}
        />
        {/* cool temple light vs warm banquet light */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(43,76,140,0.28) 0%, rgba(43,76,140,0.12) 48%, rgba(255,140,60,0.06) 52%, rgba(255,140,60,0.16) 100%)",
            mixBlendMode: "overlay",
          }}
        />
      </Camera>
      <TorchLight
        lights={[
          { x: 470, y: 640, radius: 600, seed: 1 },
          { x: 1440, y: 640, radius: 620, seed: 3 },
        ]}
      />
      <Dust count={60} seed="s2" />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(10,7,5,0.8) 0%, rgba(10,7,5,0) 36%)",
        }}
      />
      <Interactive.Div
        name="dance was already part of"
        style={{
          position: "absolute",
          top: 96,
          width: "100%",
          textAlign: "center",
          fontFamily: sans,
          fontWeight: 300,
          fontSize: 48,
          letterSpacing: "0.04em",
          color: "#F1E4C6",
          opacity: interpolate(frame, [0, 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0, 22], ["0px 18px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        dance was already part of
      </Interactive.Div>
      <Interactive.Div
        name="RELIGIOUS"
        style={{
          position: "absolute",
          top: 170,
          left: 0,
          width: 960,
          textAlign: "center",
          fontFamily: sans,
          fontWeight: 100,
          fontSize: 112,
          letterSpacing: "0.08em",
          color: "#F1E4C6",
          textShadow: "0 0 20px rgba(120,160,255,0.35)",
          opacity: interpolate(frame, [26, 42], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [26, 50], ["-50px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        RELIGIOUS
      </Interactive.Div>
      <Interactive.Div
        name="SOCIAL LIFE"
        style={{
          position: "absolute",
          top: 170,
          left: 960,
          width: 960,
          textAlign: "center",
          fontFamily: sans,
          fontWeight: 900,
          fontSize: 112,
          letterSpacing: "0.01em",
          color: "#E0B25A",
          textShadow: "0 0 24px rgba(224,178,90,0.4)",
          opacity: interpolate(frame, [54, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [54, 78], ["50px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        SOCIAL LIFE
      </Interactive.Div>
    </AbsoluteFill>
  );
};
