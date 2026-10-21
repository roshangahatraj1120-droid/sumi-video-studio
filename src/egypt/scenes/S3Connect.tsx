import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Camera, Dust, WallImage } from "../env";
import { EgyptFigure, Harp, LotusJar, POSES, Sistrum } from "../figures";
import { C, display } from "../theme";

const XS = [300, 740, 1180, 1620];
const BASE = 680;
const APPEAR = [24, 46, 68, 90];
const LABELS = ["MUSIC", "MOVEMENT", "CEREMONY", "CELEBRATION"];

const quad = (a: number, c: number, b: number, t: number) =>
  (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;

// "Objects and images connect music, movement, ceremony, and celebration."
export const S3Connect: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const show = (i: number) =>
    spring({
      frame: frame - APPEAR[i],
      fps,
      config: { damping: 18, mass: 0.8 },
    });
  const lineDraw = (i: number) =>
    interpolate(frame, [110 + i * 8, 132 + i * 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });

  return (
    <AbsoluteFill
      name="Objects and images connect"
      style={{ backgroundColor: "#0A0705", overflow: "hidden" }}
    >
      {/* the wall falls out of focus behind the artifacts */}
      <Camera
        scale={interpolate(frame, [0, durationInFrames], [1.06, 1.0])}
        blur={10}
      >
        <div
          style={{
            position: "absolute",
            left: -500,
            top: -200,
            width: 2600,
            height: 1500,
            opacity: 0.32,
          }}
        >
          <WallImage />
        </div>
      </Camera>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(10,7,5,0.2), rgba(10,7,5,0.92))",
        }}
      />
      {XS.map((x, i) => (
        <AbsoluteFill
          key={i}
          style={{
            background: `radial-gradient(ellipse 240px 420px at ${x}px 520px, rgba(255,200,130,0.22), rgba(255,200,130,0) 70%)`,
            opacity: Math.min(1, show(i)),
          }}
        />
      ))}
      <Camera scale={interpolate(frame, [0, durationInFrames], [1.0, 1.04])}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <defs>
            <clipPath id="fragment">
              <polygon points="-130,-380 120,-392 150,-200 132,30 -118,22 -150,-160" />
            </clipPath>
          </defs>
          {/* connecting arcs with a travelling spark */}
          {[0, 1, 2].map((i) => {
            const a = XS[i];
            const b = XS[i + 1];
            const c = (a + b) / 2;
            const d = lineDraw(i);
            const t = ((frame - 120 - i * 8) / 36) % 1;
            return (
              <g key={i}>
                <path
                  d={`M ${a} 300 Q ${c} 200 ${b} 300`}
                  fill="none"
                  stroke={C.gold}
                  strokeWidth={2}
                  strokeOpacity={0.8}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - d}
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(224,178,90,0.9))",
                  }}
                />
                {d >= 1 && t >= 0 ? (
                  <circle
                    cx={quad(a, c, b, t)}
                    cy={quad(300, 200, 300, t)}
                    r={5}
                    fill="#FFE7B0"
                    style={{ filter: "drop-shadow(0 0 8px #FFD27A)" }}
                  />
                ) : null}
              </g>
            );
          })}
          {[0, 1, 2, 3].map((i) => {
            const p = show(i);
            const float = Math.sin((frame + i * 20) / 22) * 6;
            return (
              <g
                key={i}
                opacity={Math.min(1, p)}
                transform={`translate(${XS[i]} ${BASE + (1 - p) * 50 + float}) scale(${0.9 + 0.1 * p})`}
                style={{ filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.6))" }}
              >
                {i === 0 ? (
                  <g transform="translate(30 0)">
                    <Harp s={1.05} />
                  </g>
                ) : null}
                {i === 1 ? (
                  <g>
                    {/* painted plaster fragment */}
                    <g clipPath="url(#fragment)">
                      <image
                        href={staticFile("egypt/wall.jpg")}
                        x={-400}
                        y={-600}
                        width={1300}
                        height={750}
                      />
                    </g>
                    <polygon
                      points="-130,-380 120,-392 150,-200 132,30 -118,22 -150,-160"
                      fill="none"
                      stroke="#3b2516"
                      strokeWidth={3}
                    />
                    <EgyptFigure
                      pose={POSES.kick}
                      x={-30}
                      y={0}
                      scale={1.08}
                      band={C.lapis}
                    />
                  </g>
                ) : null}
                {i === 2 ? <Sistrum s={4.6} /> : null}
                {i === 3 ? <LotusJar s={1.05} /> : null}
              </g>
            );
          })}
          {/* rule joining the four ideas */}
          <line
            x1={XS[0] - 120}
            y1={830}
            x2={XS[0] - 120 + (XS[3] - XS[0] + 240) * lineDraw(3)}
            y2={830}
            stroke={C.gold}
            strokeWidth={1.5}
            strokeOpacity={0.7}
          />
        </svg>
      </Camera>
      {LABELS.map((label, i) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: XS[i] - 220,
            width: 440,
            top: 742,
            textAlign: "center",
            fontFamily: display,
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: `${interpolate(show(i), [0, 1], [0.5, 0.16])}em`,
            color: "#E0B25A",
            textShadow: "0 0 16px rgba(224,178,90,0.45)",
            opacity: Math.min(1, show(i)),
          }}
        >
          {label}
        </div>
      ))}
      <Dust count={50} seed="s3" opacity={0.8} />
      <Interactive.Div
        name="Objects and images connect"
        style={{
          position: "absolute",
          top: 96,
          width: "100%",
          textAlign: "center",
          fontFamily: display,
          fontWeight: 400,
          fontSize: 64,
          letterSpacing: "0.04em",
          color: "#F1E4C6",
          opacity: interpolate(frame, [0, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0, 24], ["0px 18px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Objects and images <span style={{ color: "#E0B25A" }}>connect</span>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
