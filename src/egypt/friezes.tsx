import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "./theme";
import { PaintWear } from "./env";
import {
  Chair,
  cyclePose,
  EgyptFigure,
  Harp,
  LotusJar,
  OfferingTable,
  POSES,
  Shrine,
} from "./figures";

const DANCE = [POSES.armsUp, POSES.kick, POSES.backbend, POSES.sway];
const WALK = [POSES.walkRaise, POSES.walkRaise2];

type FriezeProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number;
};

// A register of figures painted on the wall; ground line at the bottom
const FriezeFrame: React.FC<
  FriezeProps & { id: string; children: React.ReactNode }
> = ({ x, y, width, height, id, children }) => (
  <svg
    width={width}
    height={height}
    overflow="visible"
    style={{ position: "absolute", left: x, top: y, overflow: "visible" }}
  >
    <defs>
      <PaintWear id={id} />
    </defs>
    <g filter={`url(#${id})`} opacity={0.94}>
      {children}
      <rect x={0} y={height - 4} width={width} height={6} fill="#1e120a" />
    </g>
  </svg>
);

export const DancersFrieze: React.FC<FriezeProps> = (p) => {
  const f = useCurrentFrame();
  const g = p.height - 4;
  const s = p.scale ?? 1.35;
  return (
    <FriezeFrame {...p} id="wear-dancers">
      {[0, 1, 2, 3].map((i) => (
        <EgyptFigure
          key={i}
          pose={cyclePose(DANCE, f, 1 / 38, i * 0.9)}
          x={150 + i * 265}
          y={g}
          scale={s}
          band={i % 2 ? C.lapis : C.turquoise}
        />
      ))}
      <g transform={`translate(${p.width - 250} ${g})`}>
        <Harp s={0.95} />
      </g>
      <EgyptFigure
        pose={{
          ...POSES.kneelPlay,
          rFA: 64 + Math.sin(f / 4) * 8,
          lFA: 92 + Math.sin(f / 5 + 1) * 6,
        }}
        x={p.width - 120}
        y={g}
        scale={s}
        facing={-1}
        skin={C.ochreLight}
      />
    </FriezeFrame>
  );
};

export const TempleFrieze: React.FC<FriezeProps> = (p) => {
  const f = useCurrentFrame();
  const g = p.height - 4;
  const s = p.scale ?? 1.25;
  return (
    <FriezeFrame {...p} id="wear-temple">
      <g transform={`translate(130 ${g})`}>
        <Shrine s={1.05} />
      </g>
      <g transform={`translate(300 ${g})`}>
        <OfferingTable s={1.3} />
      </g>
      {[0, 1].map((i) => (
        <EgyptFigure
          key={i}
          pose={cyclePose(WALK, f, 1 / 26, i)}
          x={480 + i * 210}
          y={g}
          scale={s}
          facing={-1}
          skin="#E0AE6E"
          holding="sistrum"
          skirtLong
          band={C.lapis}
        />
      ))}
    </FriezeFrame>
  );
};

export const BanquetFrieze: React.FC<FriezeProps> = (p) => {
  const f = useCurrentFrame();
  const g = p.height - 4;
  const s = p.scale ?? 1.15;
  return (
    <FriezeFrame {...p} id="wear-banquet">
      <g transform={`translate(90 ${g}) scale(${s})`}>
        <Chair />
      </g>
      <EgyptFigure
        pose={POSES.seated}
        x={90}
        y={g}
        scale={s}
        holding="lotus"
        skirtLong
      />
      {[0, 1].map((i) => (
        <EgyptFigure
          key={i}
          pose={cyclePose(
            [POSES.kick, POSES.clap, POSES.sway, POSES.backbend],
            f,
            1 / 30,
            i * 1.6,
          )}
          x={340 + i * 185}
          y={g}
          scale={s}
          facing={i ? -1 : 1}
          band={i ? C.ochre : C.turquoise}
        />
      ))}
      <EgyptFigure
        pose={{
          ...POSES.clap,
          rUA: 112 + Math.sin(f / 3.2) * 10,
          lUA: 96 - Math.sin(f / 3.2) * 10,
        }}
        x={700}
        y={g}
        scale={s}
        facing={-1}
        holding="clappers"
      />
      <g transform={`translate(${p.width - 45} ${g}) scale(0.58)`}>
        <LotusJar />
      </g>
    </FriezeFrame>
  );
};
