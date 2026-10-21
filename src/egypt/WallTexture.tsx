import { AbsoluteFill, random } from "remotion";

const W = 2600;
const H = 1500;

const crack = (seed: string) => {
  let x = random(`${seed}x`) * W;
  let y = random(`${seed}y`) * H;
  let a = random(`${seed}a`) * Math.PI * 2;
  let d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
  const steps = 8 + Math.floor(random(`${seed}n`) * 14);
  for (let i = 0; i < steps; i++) {
    a += (random(`${seed}t${i}`) - 0.5) * 1.1;
    const len = 10 + random(`${seed}l${i}`) * 34;
    x += Math.cos(a) * len;
    y += Math.sin(a) * len;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
};

// Rendered once to public/egypt/wall.jpg: aged tomb plaster over sandstone
export const WallTexture: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#a98763" }}>
    <svg width={W} height={H}>
      <defs>
        <filter id="mottle" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0022 0.0035"
            numOctaves={4}
            seed={11}
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.28  0 0 0 0 0.15  0 0 0 0 0.06  1.1 0 0 0 -0.45"
          />
        </filter>
        <filter id="relief" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves={4}
            seed={5}
            result="n"
          />
          <feDiffuseLighting
            in="n"
            surfaceScale={1.6}
            diffuseConstant={1}
            lightingColor="#fff"
          >
            <feDistantLight azimuth={235} elevation={52} />
          </feDiffuseLighting>
          <feColorMatrix
            type="matrix"
            values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1"
          />
        </filter>
        <filter id="grit" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.1"
            numOctaves={1}
            seed={2}
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.2  0 0 0 0 0.13  0 0 0 0 0.07  0 0 0 -2.2 1.25"
          />
        </filter>
        <radialGradient id="plaster" cx="0.45" cy="0.4" r="0.8">
          <stop offset="0" stopColor="#c9a77c" />
          <stop offset="1" stopColor="#8a6948" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#plaster)" />
      <rect
        width={W}
        height={H}
        filter="url(#relief)"
        style={{ mixBlendMode: "overlay" }}
        opacity={0.55}
      />
      <rect width={W} height={H} filter="url(#mottle)" />
      <rect width={W} height={H} filter="url(#grit)" opacity={0.35} />
      {Array.from({ length: 14 }).map((_, i) => (
        <g key={i}>
          <path
            d={crack(`c${i}`)}
            transform="translate(1.5 1.5)"
            fill="none"
            stroke="#f3dcb4"
            strokeOpacity={0.25}
            strokeWidth={1.5}
          />
          <path
            d={crack(`c${i}`)}
            fill="none"
            stroke="#3b2516"
            strokeOpacity={0.35 + random(`co${i}`) * 0.3}
            strokeWidth={1.2 + random(`cw${i}`) * 1.8}
            strokeLinejoin="round"
          />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);
