import { AbsoluteFill, useCurrentFrame } from "remotion";

// Animated grain + vignette laid over the whole video
export const FilmLook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.22 }}>
        <svg width={1920} height={1080}>
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={0.8}
              numOctaves={2}
              seed={frame % 24}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width={1920} height={1080} filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
