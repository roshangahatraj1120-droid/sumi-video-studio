import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Camera, Dust, RegisterBorder, TorchLight, WallImage } from "../env";
import { Clapper } from "../figures";
import { BanquetFrieze, TempleFrieze } from "../friezes";
import { C, sans } from "../theme";

const HITS = [26, 56, 86];

// "including both secular and religious contexts,"
export const S5Contexts: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pulse = HITS.reduce(
    (a, h) => a + (frame >= h ? Math.exp(-(frame - h) / 8) : 0),
    0,
  );
  const open = HITS.reduce(
    (a, h, i) => {
      const next = HITS[i + 1] ?? h + 30;
      if (frame >= h - 30 && frame < next && frame >= h) {
        const p = (frame - h) / (next - h);
        return Math.sin(Math.PI * p) * 18;
      }
      return a;
    },
    frame < HITS[0]
      ? interpolate(frame, [0, HITS[0]], [18, 0], {
          easing: Easing.in(Easing.cubic),
        })
      : 0,
  );
  const fadeUp = (start: number) => ({
    opacity: interpolate(frame, [start, start + 16], [0, 1], {
      extrapolateLeft: "clamp" as const,
      extrapolateRight: "clamp" as const,
    }),
  });

  return (
    <AbsoluteFill
      name="Secular and religious"
      style={{ backgroundColor: "#0A0705", overflow: "hidden" }}
    >
      <Camera scale={interpolate(frame, [0, durationInFrames], [1.05, 1.0])}>
        <div
          style={{
            position: "absolute",
            left: -620,
            top: -200,
            width: 2600,
            height: 1500,
          }}
        >
          <WallImage />
        </div>
        <RegisterBorder x={40} y={392} width={1840} />
        <BanquetFrieze x={40} y={430} width={880} height={460} />
        <TempleFrieze x={1010} y={430} width={860} height={460} />
        <RegisterBorder x={40} y={894} width={1840} />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(255,140,60,0.18) 0%, rgba(255,140,60,0.06) 48%, rgba(43,76,140,0.14) 52%, rgba(43,76,140,0.3) 100%)",
            mixBlendMode: "overlay",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 958,
            top: 330,
            width: 3,
            height: 600,
            background:
              "linear-gradient(180deg, rgba(224,178,90,0), #E0B25A 20%, #E0B25A 80%, rgba(224,178,90,0))",
            boxShadow: `0 0 ${10 + pulse * 30}px rgba(224,178,90,${0.6 + pulse * 0.4})`,
          }}
        />
      </Camera>
      <TorchLight
        lights={[
          { x: 470, y: 660, radius: 560 + pulse * 120, seed: 2 },
          { x: 1450, y: 660, radius: 560 + pulse * 120, seed: 5 },
        ]}
      />
      <Dust count={50} seed="s5" />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(10,7,5,0.85) 0%, rgba(10,7,5,0) 34%)",
        }}
      />
      {/* small clappers on the divider, keeping time for both worlds */}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {HITS.map((h) => {
          const t = frame - h;
          if (t < 0 || t > 30) return null;
          return (
            <ellipse
              key={h}
              cx={960}
              cy={232}
              rx={20 + t * 26}
              ry={8 + t * 5}
              fill="none"
              stroke={C.gold}
              strokeWidth={2}
              opacity={Math.max(0, 1 - t / 28)}
            />
          );
        })}
        <g transform="translate(960 380)">
          <g transform={`rotate(${-90 - open}) scale(0.34) translate(0 -31)`}>
            <Clapper id="mini-a" />
          </g>
          <g
            transform={`rotate(${-90 + open}) scale(0.34 -0.34) translate(0 -31)`}
          >
            <Clapper id="mini-b" />
          </g>
        </g>
      </svg>
      <Interactive.Div
        name="including both"
        style={{
          position: "absolute",
          top: 70,
          width: "100%",
          textAlign: "center",
          fontFamily: sans,
          fontWeight: 300,
          fontSize: 42,
          letterSpacing: "0.04em",
          color: "#F1E4C6",
          ...fadeUp(0),
        }}
      >
        including both
      </Interactive.Div>
      <Interactive.Div
        name="SECULAR"
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          width: 900,
          textAlign: "center",
          fontFamily: sans,
          fontWeight: 900,
          fontSize: 108,
          color: "#E0B25A",
          textShadow: "0 0 24px rgba(224,178,90,0.4)",
          ...fadeUp(12),
          translate: interpolate(frame, [12, 36], ["-50px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        SECULAR
      </Interactive.Div>
      <Interactive.Div
        name="RELIGIOUS"
        style={{
          position: "absolute",
          top: 150,
          left: 1020,
          width: 900,
          textAlign: "center",
          fontFamily: sans,
          fontWeight: 100,
          fontSize: 108,
          letterSpacing: "0.08em",
          color: "#F1E4C6",
          textShadow: "0 0 20px rgba(120,160,255,0.35)",
          ...fadeUp(40),
          translate: interpolate(frame, [40, 64], ["50px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        RELIGIOUS
      </Interactive.Div>
      <Interactive.Div
        name="contexts"
        style={{
          position: "absolute",
          top: 960,
          width: "100%",
          textAlign: "center",
          fontFamily: sans,
          fontWeight: 300,
          fontSize: 42,
          letterSpacing: "0.3em",
          color: "#F1E4C6",
          ...fadeUp(66),
        }}
      >
        CONTEXTS
      </Interactive.Div>
    </AbsoluteFill>
  );
};
