import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Camera, Dust, WallImage } from "../env";
import { Clapper } from "../figures";
import { C, display, sans } from "../theme";

const HITS = [34, 54, 74, 94];
const PIVOT: [number, number] = [1040, 880];
const ANGLE = -40;
const SCALE = 1.32;
const OPEN = 16;

// How far the clappers are apart (degrees): accelerate into each strike, spring back after
const openAt = (f: number) => {
  if (f < HITS[0]) {
    return interpolate(f, [12, HITS[0]], [OPEN, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    });
  }
  for (let i = 0; i < HITS.length - 1; i++) {
    if (f < HITS[i + 1]) {
      const p = (f - HITS[i]) / (HITS[i + 1] - HITS[i]);
      return OPEN * Math.pow(Math.sin(Math.PI * p), 1.4);
    }
  }
  return interpolate(
    f,
    [HITS[HITS.length - 1], HITS[HITS.length - 1] + 14],
    [0, 8],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
};

// "Clappers were used to keep time for dance,"
export const S4Clappers: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const open = openAt(frame);
  const shake = HITS.reduce(
    (acc, h) => acc + (frame >= h ? 5 * Math.exp(-(frame - h) / 3) : 0),
    0,
  );
  const tipDir: [number, number] = [
    Math.cos((ANGLE * Math.PI) / 180),
    Math.sin((ANGLE * Math.PI) / 180),
  ];
  const tip: [number, number] = [
    PIVOT[0] + tipDir[0] * 420 * SCALE,
    PIVOT[1] + tipDir[1] * 420 * SCALE,
  ];
  const enter = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const beats = HITS.filter((h) => frame >= h).length;

  return (
    <AbsoluteFill
      name="Clappers"
      style={{ backgroundColor: "#0A0705", overflow: "hidden" }}
    >
      <Camera
        blur={8}
        scale={interpolate(frame, [0, durationInFrames], [1.04, 1.0])}
      >
        <div
          style={{
            position: "absolute",
            left: -300,
            top: -260,
            width: 2600,
            height: 1500,
            opacity: 0.28,
          }}
        >
          <WallImage />
        </div>
      </Camera>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 900px 700px at 1350px 640px, rgba(43,76,140,0.28), rgba(10,7,5,0) 70%), linear-gradient(90deg, rgba(10,7,5,0.92) 0%, rgba(10,7,5,0.4) 55%, rgba(10,7,5,0.7) 100%)",
        }}
      />
      {/* flash at each strike */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle 420px at ${tip[0]}px ${tip[1]}px, rgba(255,214,140,${HITS.reduce(
            (a, h) => a + (frame >= h ? 0.45 * Math.exp(-(frame - h) / 4) : 0),
            0,
          )}), rgba(255,214,140,0) 70%)`,
          mixBlendMode: "screen",
        }}
      />
      <Camera
        shake={shake}
        scale={interpolate(frame, [0, durationInFrames], [1.0, 1.06])}
      >
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          {HITS.map((h) => {
            const t = frame - h;
            if (t < 0 || t > 26) return null;
            return [0, 1].map((k) => (
              <circle
                key={`${h}-${k}`}
                cx={tip[0]}
                cy={tip[1]}
                r={20 + (t - k * 5) * 11}
                fill="none"
                stroke={C.gold}
                strokeWidth={3 - k}
                opacity={Math.max(0, 1 - (t - k * 5) / 22)}
                style={{ filter: "drop-shadow(0 0 8px rgba(224,178,90,0.9))" }}
              />
            ));
          })}
          <g
            opacity={enter}
            transform={`translate(${PIVOT[0] + (1 - enter) * 120} ${PIVOT[1] + (1 - enter) * 60})`}
            style={{ filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.7))" }}
          >
            <g
              transform={`rotate(${ANGLE - open}) scale(${SCALE}) translate(0 -31)`}
            >
              <Clapper id="hero-a" />
            </g>
            <g
              transform={`rotate(${ANGLE + open}) scale(${SCALE} ${-SCALE}) translate(0 -31)`}
            >
              <Clapper id="hero-b" />
            </g>
          </g>
        </svg>
      </Camera>
      <Dust count={55} seed="s4" />
      <Interactive.Div
        name="Object tag"
        style={{
          position: "absolute",
          left: 150,
          top: 300,
          padding: "10px 18px",
          border: "1.5px solid rgba(224,178,90,0.7)",
          borderRadius: 6,
          fontFamily: sans,
          fontWeight: 600,
          fontSize: 22,
          letterSpacing: "0.32em",
          color: "#E0B25A",
          opacity: interpolate(frame, [4, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        OBJECT · CLAPPERS
      </Interactive.Div>
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 360,
          fontFamily: display,
          fontWeight: 600,
          fontSize: 156,
          color: "#E0B25A",
          filter: "drop-shadow(0 0 20px rgba(224,178,90,0.4))",
          clipPath: `inset(0 ${interpolate(frame, [10, 34], [100, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          })}% 0 0)`,
        }}
      >
        Clappers
      </div>
      <Interactive.Div
        name="were used to keep time"
        style={{
          position: "absolute",
          left: 152,
          top: 568,
          fontFamily: sans,
          fontWeight: 300,
          fontSize: 56,
          color: "#F1E4C6",
          opacity: interpolate(frame, [28, 42], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [28, 48], ["0px 20px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        were used to keep time
      </Interactive.Div>
      <Interactive.Div
        name="for dance"
        style={{
          position: "absolute",
          left: 152,
          top: 640,
          fontFamily: sans,
          fontWeight: 800,
          fontSize: 56,
          color: "#E0B25A",
          opacity: interpolate(frame, [40, 54], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [40, 60], ["0px 20px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        for dance
      </Interactive.Div>
      {/* beat counter */}
      <div
        style={{
          position: "absolute",
          left: 156,
          top: 770,
          display: "flex",
          gap: 22,
        }}
      >
        {HITS.map((h, i) => (
          <div
            key={h}
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              border: "2px solid #E0B25A",
              backgroundColor: i < beats ? "#E0B25A" : "transparent",
              boxShadow: i < beats ? "0 0 12px rgba(224,178,90,0.9)" : "none",
              scale: String(
                frame >= h && frame < h + 6 ? 1.5 - (frame - h) / 12 : 1,
              ),
              opacity: interpolate(frame, [20, 30], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
