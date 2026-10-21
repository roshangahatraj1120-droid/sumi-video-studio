import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";
import {
  HeroWord,
  PanelLabel,
  ScrambleWord,
  SplitPanels,
  TornReveal,
} from "../brand/fx";
import { GRADES, Still } from "../cine/Still";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt, LabelAt } from "../laban/overlays";
import empire from "./empire.json";
import {
  ConceptIcon,
  Icosahedron,
  SlideCard,
  Space3D,
  WorldArc,
  MAP_FROM,
  MAP_TO,
} from "./fx2";

// Laban — Part 2: "Who was Laban?" All lengths in frames at 30 fps.
export const LEN2 = {
  p01: 150,
  p02: 240,
  p03: 240,
  p04: 300,
  p05: 210,
  p06: 270,
  p07: 270,
  p08: 150,
  p09: 270,
};

const img2 = (n: number) => `laban2/r${n}.jpg`;
const img1 = (n: string) => `laban/${n}.jpg`;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const SHADE =
  "linear-gradient(0deg, rgba(8,4,2,0.85) 0%, rgba(8,4,2,0.5) 18%, rgba(8,4,2,0) 36%)";

// 01 — "Rudolf von Laban was born in 1879…"
export const P01Born: React.FC = () => (
  <Finish>
    <Still
      src={img2(1)}
      from={{ s: 1.04, x: 2 }}
      to={{ s: 1.16, x: 5, y: 3 }}
      grade={GRADES.natural}
    />
    <AbsoluteFill style={{ background: SHADE }} />
    <SlideCard
      start={26}
      kicker="Born"
      title="1879"
      x={1260}
      y={360}
      width={330}
      titleSize={130}
      from="right"
    />
    <LabelAt text="Rudolf von Laban" start={12} y={930} size={64} />
    <Sfx name="drone" at={0} volume={0.25} />
    <Sfx name="whoosh" at={22} volume={0.45} />
    <Sfx name="hit" at={30} volume={0.35} />
  </Finish>
);

// 02 — "…in Bratislava, then part of the Austro-Hungarian world": glowing border on the map → the city
const OUTLINE_D =
  (empire.outline as [number, number][])
    .map(
      (p, i) =>
        `${i ? "L" : "M"} ${(p[0] * 1920).toFixed(1)} ${(p[1] * 1080).toFixed(1)}`,
    )
    .join(" ") + " Z";
const DOT: [number, number] = [
  empire.bratislava[0] * 1920,
  empire.bratislava[1] * 1080,
];

const MapShot: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [20, 160], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const draw = interpolate(frame, [10, 80], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const glow = 0.6 + 0.4 * Math.sin(frame / 10);
  const scale = 1 + 0.55 * zoom;
  const tx = (960 - DOT[0]) * zoom;
  const ty = (540 - DOT[1]) * zoom;
  const ring = (frame - 70) % 36;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transformOrigin: `${DOT[0]}px ${DOT[1]}px`,
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
        }}
      >
        <Img
          src={staticFile(img2(5))}
          style={{
            width: 1920,
            height: 1080,
            filter: "contrast(1.05) saturate(0.95)",
          }}
        />
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <defs>
            <filter id="empGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="9" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={OUTLINE_D}
            fill={`rgba(224,69,123,${0.18 * draw * glow})`}
            stroke="none"
          />
          {/* wide soft halo, then a bright core line */}
          <path
            d={OUTLINE_D}
            fill="none"
            stroke={COLOR.gold}
            strokeWidth={26 / scale}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
            style={{ filter: `blur(${14 / scale}px)` }}
            opacity={0.55 + 0.35 * glow}
          />
          <path
            d={OUTLINE_D}
            fill="none"
            stroke="#FFE7B0"
            strokeWidth={5 / scale + 1}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
            filter="url(#empGlow)"
            opacity={0.75 + 0.25 * glow}
          />
          {frame >= 70 ? (
            <>
              <circle
                cx={DOT[0]}
                cy={DOT[1]}
                r={(14 + ring * 1.4) / scale}
                fill="none"
                stroke={COLOR.gold}
                strokeWidth={2.5 / scale}
                opacity={1 - ring / 36}
              />
              <circle
                cx={DOT[0]}
                cy={DOT[1]}
                r={8 / scale}
                fill={COLOR.gold}
                filter="url(#empGlow)"
              />
            </>
          ) : null}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const P02Bratislava: React.FC = () => (
  <Finish dust={0.3}>
    <MapShot />
    <SlideCard
      start={96}
      end={168}
      kicker="Then part of"
      title="Austria-Hungary"
      x={1140}
      y={720}
      width={640}
      titleSize={64}
      from="right"
    />
    <TornReveal at={160} seed="brat">
      <Still
        src={img2(3)}
        from={{ s: 1.14, x: 3 }}
        to={{ s: 1.05, x: -2 }}
        grade={GRADES.natural}
      />
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence from={10} layout="none">
        <LabelAt text="Bratislava" start={0} y={900} size={84} />
      </Sequence>
    </TornReveal>
    <Sfx name="riser" at={8} volume={0.25} />
    <Sfx name="hit" at={72} volume={0.4} />
    <Sfx name="whoosh" at={92} volume={0.4} />
    <Sfx name="whoosh" at={156} volume={0.55} />
  </Finish>
);

// 03 — "…studied art and architecture, including architecture in Paris": camera flies through 3D space
const SpaceShot: React.FC = () => {
  const frame = useCurrentFrame();
  const camZ = interpolate(frame, [0, 228], [-120, 2200], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  return (
    <Space3D
      camZ={camZ}
      panels={[
        {
          src: img2(7),
          x: -300,
          y: -20,
          z: 0,
          ry: 14,
          kicker: "Studied",
          label: "Art",
        },
        {
          src: img2(10),
          x: 320,
          y: 10,
          z: -850,
          ry: -14,
          kicker: "and",
          label: "Architecture",
        },
        {
          src: img2(9),
          x: 0,
          y: 0,
          z: -1800,
          ry: 0,
          kicker: "including",
          label: "Paris",
        },
      ]}
    />
  );
};
export const P03Studies: React.FC = () => (
  <Finish dust={0.25}>
    <SpaceShot />
    <Sfx name="drone" at={0} volume={0.25} />
    <Sfx name="whoosh" at={70} volume={0.4} />
    <Sfx name="whoosh" at={150} volume={0.4} />
  </Finish>
);

// 04 — "…bodies in relation to space: direction, shape, geometry, weight and time"
const CONCEPTS = ["direction", "shape", "geometry", "weight", "time"] as const;
const CONCEPT_AT = [40, 82, 124, 166, 208];

export const ConceptCards: React.FC<{ x: number; from: "left" | "right" }> = ({
  x,
  from,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {CONCEPTS.map((c, i) => (
        <SlideCard
          key={c}
          start={CONCEPT_AT[i]}
          kicker={`0${i + 1}`}
          title={c}
          x={x}
          y={110 + i * 176}
          width={560}
          titleSize={58}
          serif={false}
          from={from}
          icon={
            <ConceptIcon
              kind={c}
              t={interpolate(
                frame,
                [CONCEPT_AT[i] + 6, CONCEPT_AT[i] + 34],
                [0, 1],
                clamp,
              )}
            />
          }
        />
      ))}
    </>
  );
};

export const P04Space: React.FC = () => (
  <Finish dust={0.35}>
    <Still
      src={img2(11)}
      from={{ s: 1.03, x: -2 }}
      to={{ s: 1.12, x: -5 }}
      grade={GRADES.natural}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(90deg, rgba(8,4,10,0.85) 0%, rgba(8,4,10,0.5) 30%, rgba(8,4,10,0) 48%)",
      }}
    />
    <CaptionAt
      text="bodies in relation to space"
      start={8}
      x={110}
      y={40}
      size={40}
    />
    <ConceptCards x={100} from="left" />
    {CONCEPT_AT.map((f) => (
      <React.Fragment key={f}>
        <Sfx name="whoosh" at={f - 3} volume={0.35} />
        <Sfx name="hit" at={f + 4} volume={0.25} />
      </React.Fragment>
    ))}
  </Finish>
);

// Diagram overlay for the A-roll negative space (green or transparent background)
export const P04Overlay: React.FC<{
  bg: "green" | "alpha";
  side: "left" | "right";
}> = ({ bg, side }) => (
  <AbsoluteFill
    style={{ backgroundColor: bg === "green" ? "#00FF00" : "transparent" }}
  >
    <ConceptCards x={side === "left" ? 100 : 1260} from={side} />
  </AbsoluteFill>
);

// 05 — "…the same kind of relationships an architect might consider…": blueprint lines dissolve into notation
const BLUEPRINT =
  "grayscale(1) invert(1) contrast(2.4) brightness(0.75) sepia(1) hue-rotate(5deg) saturate(1.6)";
export const P05Structures: React.FC = () => {
  const frame = useCurrentFrame();
  const blue = interpolate(frame, [50, 85], [0, 1], clamp);
  const toNote = interpolate(frame, [125, 165], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const lines = interpolate(frame, [85, 140], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const ico = interpolate(frame, [20, 70], [0, 1], clamp);
  return (
    <Finish dust={0.35}>
      <Still
        src={img2(10)}
        from={{ s: 1.04 }}
        to={{ s: 1.2, y: 3 }}
        grade={GRADES.sepiaGold}
      />
      <AbsoluteFill style={{ opacity: blue * (1 - toNote) }}>
        <Still
          src={img2(10)}
          from={{ s: 1.04 }}
          to={{ s: 1.2, y: 3 }}
          grade={BLUEPRINT}
        />
      </AbsoluteFill>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", opacity: 1 - toNote * 0.6 }}
      >
        {[560, 760, 960, 1160, 1360].map((x, i) => (
          <line
            key={x}
            x1={x}
            x2={x}
            y1={1080}
            y2={1080 - 1080 * Math.min(1, Math.max(0, lines * 1.6 - i * 0.15))}
            stroke={COLOR.gold}
            strokeWidth={3}
            style={{ filter: `drop-shadow(0 0 8px ${COLOR.gold})` }}
          />
        ))}
      </svg>
      <AbsoluteFill style={{ opacity: toNote }}>
        <Still
          src={img2(6)}
          from={{ s: 1.15 }}
          to={{ s: 1.06 }}
          grade={GRADES.sepiaGold}
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 90,
          opacity: ico * (1 - toNote),
        }}
      >
        <Icosahedron size={240} spin={frame / 45} draw={ico} />
      </div>
      <AbsoluteFill style={{ background: SHADE }} />
      <HeroWord
        text="Structures"
        look="heavy"
        size={150}
        x={110}
        y={850}
        align="left"
        start={30}
        end={128}
      />
      <HeroWord
        text="Movement"
        look="heavy"
        size={150}
        x={110}
        y={850}
        align="left"
        start={140}
      />
      <Sfx name="riser" at={40} volume={0.25} />
      <Sfx name="glitch" at={52} volume={0.25} />
      <Sfx name="whoosh" at={128} volume={0.45} />
      <Sfx name="hit" at={142} volume={0.35} />
    </Finish>
  );
};

// 06 — "…European modern dance… broke away from… classical ballet"
export const P06BrokeAway: React.FC = () => (
  <Finish>
    <SplitPanels
      panels={[
        {
          start: 0,
          node: (
            <Still
              src={img1("18")}
              from={{ s: 1.12 }}
              to={{ s: 1.2 }}
              grade={GRADES.sepiaGold}
            />
          ),
          label: <PanelLabel thin="classical" heavy="ballet" />,
        },
        {
          start: 72,
          node: (
            <Still
              src={img2(8)}
              from={{ s: 1.15, x: 3 }}
              to={{ s: 1.08 }}
              grade={GRADES.sepiaGold}
            />
          ),
          label: (
            <PanelLabel thin="European" heavy="modern dance" heavySize={92} />
          ),
        },
      ]}
    />
    <TornReveal at={176} seed="broke">
      <Still
        src={img2(8)}
        from={{ s: 1.08 }}
        to={{ s: 1.16, y: 2 }}
        grade={GRADES.sepiaGold}
      />
      <AbsoluteFill style={{ background: SHADE }} />
      <HeroWord text="broke away." look="serif" size={190} y={760} start={10} />
    </TornReveal>
    <Sfx name="whoosh" at={68} volume={0.55} />
    <Sfx name="hit" at={76} volume={0.35} />
    <Sfx name="whoosh" at={172} volume={0.55} />
    <Sfx name="boom" at={186} volume={0.45} />
  </Finish>
);

// 07 — "…a system capable of describing movement… ballet, modern dance – or everyday human action"
export const P07AnyMovement: React.FC = () => (
  <Finish>
    <Still
      src={img2(2)}
      from={{ s: 1.04, x: 2 }}
      to={{ s: 1.12, x: -3 }}
      grade={GRADES.natural}
    />
    <AbsoluteFill style={{ background: SHADE }} />
    <CaptionAt
      text="a system capable of describing"
      start={6}
      x={120}
      y={790}
      size={46}
    />
    <HeroWord
      text="Movement"
      look="heavy"
      size={150}
      x={110}
      y={850}
      align="left"
      start={18}
      end={104}
    />
    <TornReveal at={96} seed="any">
      <SplitPanels
        panels={[
          {
            start: 0,
            node: (
              <Still
                src={img1("18")}
                from={{ s: 1.15 }}
                to={{ s: 1.22 }}
                grade={GRADES.sepiaGold}
              />
            ),
            label: <PanelLabel thin="from" heavy="ballet" />,
          },
          {
            start: 50,
            node: (
              <Still
                src={img2(8)}
                from={{ s: 1.12 }}
                to={{ s: 1.2 }}
                grade={GRADES.sepiaGold}
              />
            ),
            label: <PanelLabel thin="modern" heavy="dance" />,
          },
          {
            start: 100,
            node: (
              <Still
                src={img1("19")}
                from={{ s: 1.15 }}
                to={{ s: 1.08 }}
                grade={GRADES.sepiaGold}
              />
            ),
            label: <PanelLabel thin="everyday" heavy="action" heavySize={88} />,
          },
        ]}
      />
    </TornReveal>
    <Sfx name="whoosh" at={92} volume={0.55} />
    <Sfx name="whoosh" at={142} volume={0.5} />
    <Sfx name="hit" at={150} volume={0.3} />
    <Sfx name="whoosh" at={192} volume={0.5} />
    <Sfx name="hit" at={200} volume={0.3} />
  </Finish>
);

// 08 — "In 1928 he published Kinetographie Laban."
export const P08Published: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [20, 90], [-30, 130], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  return (
    <Finish>
      <Still
        src={img2(4)}
        from={{ s: 1.04 }}
        to={{ s: 1.22, x: -6, y: 6 }}
        grade={GRADES.natural}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(105deg, rgba(255,230,180,0) ${sweep - 12}%, rgba(255,230,180,0.28) ${sweep}%, rgba(255,230,180,0) ${sweep + 12}%)`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill style={{ background: SHADE }} />
      <SlideCard
        start={30}
        kicker="Published"
        title="1928"
        x={100}
        y={700}
        width={420}
        titleSize={120}
      />
      <Sfx name="whoosh" at={26} volume={0.45} />
      <Sfx name="boom" at={34} volume={0.4} />
    </Finish>
  );
};

// 09 — "Today, the American form of this system is commonly known as Labanotation."
export const P09Labanotation: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 270], [1.0, 1.08]);
  const tagIn = (at: number) =>
    interpolate(frame, [at, at + 14], [0, 1], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    });
  const tag = (
    p: [number, number],
    at: number,
    k: string,
    t: string,
    dx: number,
    dy = -70,
  ) => (
    <div
      style={{
        position: "absolute",
        left: p[0] + dx,
        top: p[1] + dy,
        opacity: tagIn(at),
        translate: `0px ${(1 - tagIn(at)) * 20}px`,
        textAlign: dx < 0 ? "right" : "left",
        width: 420,
        marginLeft: dx < 0 ? -420 : 0,
      }}
    >
      <div
        style={{
          ...TYPE.label,
          fontSize: 22,
          letterSpacing: "0.3em",
          color: COLOR.gold,
        }}
      >
        {k}
      </div>
      <div
        style={{
          ...TYPE.headline,
          fontSize: 46,
          color: COLOR.white,
          textShadow: "0 2px 12px #000",
        }}
      >
        {t}
      </div>
    </div>
  );
  return (
    <Finish dust={0.3}>
      <AbsoluteFill style={{ backgroundColor: COLOR.ink }} />
      <AbsoluteFill style={{ scale: String(zoom), transformOrigin: "50% 45%" }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(232,194,122,0.08), rgba(13,7,16,0) 70%)",
          }}
        />
        <WorldArc arcStart={50} arcEnd={140} usaAt={130} />
        {tag(MAP_FROM, 34, "Europe · 1928", "Kinetographie Laban", -30, 34)}
        {tag(MAP_TO, 140, "United States", "Labanotation", -26)}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt
        text="today, the American form is known as"
        start={150}
        x={124}
        y={770}
        size={42}
      />
      <ScrambleWord
        text="Labanotation"
        start={168}
        size={150}
        y={830}
        x={110}
      />
      <Sfx name="drone" at={0} volume={0.25} />
      <Sfx name="riser" at={50} volume={0.3} />
      <Sfx name="hit" at={140} volume={0.4} />
      {Array.from({ length: 12 }).map((_, i) => (
        <Sfx key={i} name="tick" at={Math.round(174 + i * 2.6)} volume={0.22} />
      ))}
      <Sfx name="boom" at={206} volume={0.4} />
    </Finish>
  );
};
