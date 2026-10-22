import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";
import { HeroWord } from "../brand/fx";
import { LightLeak } from "../cine/overlays";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt } from "../laban/overlays";
import { Plate, Rig } from "../laban3/rig";
import {
  FilmStrip,
  LightSweep,
  MapThreads,
  NameCard,
  Parallax,
  ProjectorBeam,
  RangeArc,
  WarmBurn,
} from "./fx9";

// Laban — Part 9: rehabilitation, therapy and Choreometrics. 30 fps. Warm after two cold chapters.
// The owner's photos with 2.5D depth (rotoscoped subject over a clean plate), rack focus, light work,
// a goniometer-style range-of-motion arc, a 35mm film strip and the wall map's threads lit up.
export const LEN9 = {
  i01: 210,
  i02: 240,
  i03: 240,
  i04: 210,
  i05: 270,
  i06: 300,
  i07: 180,
  i08: 300,
  i09: 270,
};

const img = (n: number, kind: "" | "-cut" | "-plate" = "") =>
  `laban9/i0${n}${kind}${kind === "-cut" ? ".png" : ".jpg"}`;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const WARM = "sepia(0.12) saturate(1.06) contrast(1.04) brightness(1.03)";
const SHADE =
  "linear-gradient(0deg, rgba(14,8,4,0.82) 0%, rgba(14,8,4,0.45) 20%, rgba(14,8,4,0) 40%)";
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

// Words that stack in one under another, each revealed by a soft mask from the left
const Stack: React.FC<{
  words: { at: number; text: string }[];
  x: number;
  y: number;
  size: number;
}> = ({ words, x, y, size }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {words.map((w) => {
        const t = ease(frame, w.at, w.at + 20);
        return (
          <div
            key={w.text}
            style={{
              ...TYPE.headline,
              fontSize: size,
              lineHeight: 1.12,
              color: COLOR.gold,
              opacity: t,
              translate: `${(1 - t) * 40}px 0px`,
              WebkitMaskImage: `linear-gradient(90deg, #000 ${t * 100}%, transparent ${t * 100 + 12}%)`,
              textShadow: `0 0 24px ${COLOR.gold}55, 0 4px 22px rgba(0,0,0,0.75)`,
            }}
          >
            {w.text}
          </div>
        );
      })}
    </div>
  );
};

// 01 — "But movement analysis did not only move toward control and efficiency. It also moved toward
// rehabilitation, therapy and cultural preservation." Cold briefing room burns to warm light.
export const I01Turn: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Finish dust={0.2}>
      <Sequence durationInFrames={100}>
        <Rig
          keys={[
            { f: 0, s: 1.1, x: 960, y: 540 },
            { f: 100, s: 1.2, x: 1000, y: 520, e: "drift" },
          ]}
        >
          <Plate
            src="laban8/h05.jpg"
            filter="grayscale(0.7) contrast(1.1) brightness(0.85) hue-rotate(-10deg)"
          />
        </Rig>
        <AbsoluteFill style={{ background: SHADE }} />
        <CaptionAt text="not only toward" start={8} y={780} size={42} />
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 830,
            textAlign: "center",
            opacity: ease(frame, 14, 30),
          }}
        >
          <span
            style={{
              ...TYPE.label,
              fontSize: 64,
              letterSpacing: "0.32em",
              color: COLOR.white,
            }}
          >
            CONTROL · EFFICIENCY
          </span>
        </div>
      </Sequence>
      <Sequence from={88}>
        <Rig
          keys={[
            { f: 0, s: 1.18, x: 1000, y: 470 },
            { f: 122, s: 1.06, x: 960, y: 520, e: "smooth" },
          ]}
        >
          <Plate src={img(1)} filter={WARM} />
        </Rig>
        <LightLeak strength={0.55} />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(14,8,4,0.72) 0%, rgba(14,8,4,0.35) 30%, rgba(14,8,4,0) 52%)",
          }}
        />
        <Sequence from={14} layout="none">
          <CaptionAt
            text="it also moved toward"
            start={0}
            x={124}
            y={300}
            size={40}
          />
        </Sequence>
        <Stack
          x={110}
          y={360}
          size={104}
          words={[
            { at: 20, text: "rehabilitation," },
            { at: 38, text: "therapy" },
            { at: 56, text: "& cultural preservation." },
          ]}
        />
      </Sequence>
      <WarmBurn at={80} dur={30} />
      <Sfx name="drone" at={0} volume={0.22} />
      <Sfx name="riser" at={66} volume={0.25} />
      <Sfx name="whoosh" at={86} volume={0.4} />
      {[108, 126, 144].map((f) => (
        <Sfx key={f} name="hit" at={f} volume={0.22} />
      ))}
    </Finish>
  );
};

// 02 — "Irmgard Bartenieff, who had trained in the Laban tradition, became a physical therapist."
// 2.5D: she holds the near plane while focus pulls off the studio behind her.
export const I02Bartenieff: React.FC = () => (
  <Finish dust={0.25}>
    <Parallax
      plate={img(3, "-plate")}
      cut={img(3, "-cut")}
      grade={WARM}
      depth={1.08}
      rack={[20, 90, 7]}
      keys={[
        { f: 0, s: 1.14, x: 1120, y: 560 },
        { f: 240, s: 1.24, x: 820, y: 520, e: "smooth" },
      ]}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(270deg, rgba(14,8,4,0.7) 0%, rgba(14,8,4,0.3) 30%, rgba(14,8,4,0) 50%)",
      }}
    />
    <LightSweep at={30} dur={90} strength={0.16} />
    <NameCard
      at={36}
      name="Irmgard Bartenieff"
      role="Trained in the Laban tradition"
      x={900}
      y={760}
    />
    <Sfx name="drone" at={0} volume={0.2} />
    <Sfx name="whoosh" at={34} volume={0.25} />
    <Sfx name="hit" at={44} volume={0.25} />
  </Finish>
);

// 03 — "She described using Laban's movement principles while rehabilitating polio patients."
// Parallax push onto the leg; a range-of-motion arc sweeps the knee as it extends.
export const I03Polio: React.FC = () => (
  <Finish dust={0.25}>
    <Parallax
      plate={img(4, "-plate")}
      cut={img(4, "-cut")}
      grade={WARM}
      depth={1.07}
      rack={[60, 110, 5]}
      keys={[
        { f: 0, s: 1.05, x: 960, y: 540 },
        { f: 56, s: 1.1, x: 980, y: 560, e: "drift" },
        { f: 96, s: 1.55, x: 1000, y: 640, e: "ramp" },
        { f: 240, s: 1.62, x: 1010, y: 640, e: "drift" },
      ]}
      over={
        <RangeArc
          cx={860}
          cy={612}
          r={290}
          from={80}
          to={10}
          at={104}
          dur={80}
          label="deg"
        />
      }
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(14,8,4,0.72) 0%, rgba(14,8,4,0.3) 20%, rgba(14,8,4,0) 36%)",
      }}
    />
    <Sequence durationInFrames={92} layout="none">
      <CaptionAt text="she became a" start={10} x={124} y={70} size={40} />
      <HeroWord
        text="physical therapist"
        look="serif"
        size={110}
        x={110}
        y={120}
        align="left"
        start={16}
      />
    </Sequence>
    <Sequence from={100} layout="none">
      <CaptionAt
        text="using Laban's principles while rehabilitating"
        start={0}
        x={124}
        y={70}
        size={40}
      />
      <HeroWord
        text="polio patients"
        look="serif"
        size={110}
        x={110}
        y={120}
        align="left"
        start={6}
      />
    </Sequence>
    <Sfx name="drone" at={0} volume={0.2} />
    <Sfx name="hit" at={18} volume={0.25} />
    <Sfx name="whoosh" at={84} volume={0.4} />
    <Sfx name="riser" at={104} volume={0.2} />
  </Finish>
);

// 04 — "Her work became foundational to what is now called the Laban/Bartenieff approach."
export const I04Approach: React.FC = () => {
  const frame = useCurrentFrame();
  const plate = interpolate(frame, [120, 144], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const line = interpolate(frame, [150, 172], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <Finish dust={0.2}>
      <Rig
        keys={[
          { f: 0, s: 1.05, x: 960, y: 520 },
          { f: 210, s: 1.22, x: 960, y: 470, e: "drift" },
        ]}
      >
        <Plate src={img(1)} filter={WARM} />
        <RangeArc
          cx={962}
          cy={500}
          r={240}
          from={-160}
          to={-72}
          at={14}
          dur={90}
        />
      </Rig>
      <LightSweep at={20} dur={100} strength={0.2} />
      <AbsoluteFill
        style={{ backgroundColor: `rgba(14,8,6,${0.66 * plate})` }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 360,
          textAlign: "center",
          ...TYPE.label,
          fontSize: 30,
          letterSpacing: "0.4em",
          color: COLOR.white,
          opacity: ease(frame, 128, 144),
        }}
      >
        Foundational to
      </div>
      <HeroWord
        text="the Laban/Bartenieff approach"
        look="serif"
        size={120}
        y={420}
        start={136}
      />
      <div
        style={{
          position: "absolute",
          left: 960 - 360 * line,
          width: 720 * line,
          top: 580,
          height: 2,
          background: COLOR.gold,
          boxShadow: `0 0 10px ${COLOR.gold}`,
        }}
      />
      <Sfx name="drone" at={0} volume={0.2} />
      <Sfx name="riser" at={110} volume={0.22} />
      <Sfx name="hit" at={138} volume={0.35} />
    </Finish>
  );
};

// 05 — "Research on Laban's wider legacy also traces movement-based work into therapeutic settings
// involving people living with trauma, including Holocaust survivors and war veterans."
// Gentle: a slow lateral drift with soft edges, no hits.
export const I05Trauma: React.FC = () => (
  <Finish dust={0.25}>
    <Rig
      keys={[
        { f: 0, s: 1.16, x: 720, y: 540 },
        { f: 270, s: 1.12, x: 1200, y: 520, e: "smooth" },
      ]}
    >
      <Plate src={img(2)} filter={WARM} />
    </Rig>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 70% 75% at 50% 45%, rgba(0,0,0,0) 55%, rgba(14,8,4,0.6) 100%)",
      }}
    />
    <AbsoluteFill style={{ background: SHADE }} />
    <LightLeak seed={3} strength={0.35} />
    <Sequence durationInFrames={118} layout="none">
      <CaptionAt text="movement-based work in" start={12} y={790} size={42} />
      <HeroWord
        text="therapeutic settings"
        look="serif"
        size={130}
        y={840}
        start={20}
      />
    </Sequence>
    <Sequence from={122} layout="none">
      <CaptionAt text="people living with" start={0} y={790} size={42} />
      <HeroWord text="trauma" look="serif" size={130} y={840} start={6} />
    </Sequence>
    <Sequence from={176} layout="none">
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 990,
          textAlign: "center",
        }}
      >
        <span
          style={{
            ...TYPE.label,
            fontSize: 26,
            letterSpacing: "0.36em",
            color: COLOR.white,
            opacity: 0.9,
          }}
        >
          Holocaust survivors · war veterans
        </span>
      </div>
    </Sequence>
    <Sfx name="drone" at={0} volume={0.22} />
  </Finish>
);

// 06 — "At the same time, folklorist Alan Lomax collaborated with Bartenieff and Forrestine Paulay…"
// A 35mm strip runs through the projector light, then each collaborator in 2.5D with a name card.
const STRIP = [
  "laban/03.jpg",
  "laban9/i07.jpg",
  "laban7/g05.jpg",
  "laban5/e03.jpg",
  "laban9/i02.jpg",
  "laban/07.jpg",
];
export const I06Collaborators: React.FC = () => {
  const frame = useCurrentFrame();
  const stripOut = interpolate(frame, [52, 66], [1, 0], clamp);
  return (
    <Finish dust={0.3}>
      <Sequence from={56} durationInFrames={124}>
        <Parallax
          plate={img(5, "-plate")}
          cut={img(5, "-cut")}
          grade={WARM}
          depth={1.08}
          rack={[10, 60, 6]}
          keys={[
            { f: 0, s: 1.3, x: 1300, y: 520 },
            { f: 124, s: 1.18, x: 1180, y: 540, e: "smooth" },
          ]}
          whipOut={1}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(14,8,4,0.72) 0%, rgba(14,8,4,0.35) 30%, rgba(14,8,4,0) 50%)",
          }}
        />
        <NameCard
          at={16}
          end={118}
          name="Alan Lomax"
          role="Folklorist"
          x={110}
          y={760}
        />
      </Sequence>
      <Sequence from={180}>
        <Parallax
          plate={img(6, "-plate")}
          cut={img(6, "-cut")}
          grade={WARM}
          depth={1.08}
          rack={[10, 60, 6]}
          keys={[
            { f: 0, s: 1.2, x: 860, y: 480 },
            { f: 120, s: 1.3, x: 900, y: 460, e: "drift" },
          ]}
          whipIn={1}
        />
        <ProjectorBeam sx={1880} sy={260} strength={0.7} />
        <AbsoluteFill style={{ background: SHADE }} />
        <CaptionAt
          text="with Bartenieff and"
          start={10}
          x={124}
          y={720}
          size={40}
        />
        <NameCard
          at={16}
          name="Forrestine Paulay"
          role="Choreometrics"
          x={110}
          y={770}
        />
      </Sequence>
      {stripOut > 0 ? (
        <AbsoluteFill style={{ opacity: stripOut, backgroundColor: "#0b0706" }}>
          <FilmStrip frames={STRIP} speed={16} tilt={16} y={400} height={300} />
          <ProjectorBeam sx={1900} sy={300} strength={0.9} />
          <CaptionAt text="at the same time" start={6} y={940} size={42} />
        </AbsoluteFill>
      ) : null}
      <Sfx name="drone" at={0} volume={0.22} />
      {Array.from({ length: 6 }).map((_, i) => (
        <Sfx key={i} name="tick" at={i * 8} volume={0.18} />
      ))}
      <Sfx name="whoosh" at={50} volume={0.35} />
      <Sfx name="hit" at={74} volume={0.3} />
      <Sfx name="whoosh" at={172} volume={0.5} />
      <Sfx name="hit" at={198} volume={0.3} />
    </Finish>
  );
};

// 07 — "…on Choreometrics." Title over the three at the archive table.
export const I07Choreometrics: React.FC = () => {
  const frame = useCurrentFrame();
  const dim = interpolate(frame, [10, 34], [0, 0.62], clamp);
  const rule = interpolate(frame, [52, 76], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.04, x: 960, y: 540 },
          { f: 180, s: 1.14, x: 960, y: 500, e: "drift" },
        ]}
      >
        <Plate src={img(7)} filter={WARM} />
      </Rig>
      <AbsoluteFill style={{ backgroundColor: `rgba(12,7,6,${dim})` }} />
      <HeroWord
        text="Choreometrics"
        look="serif"
        size={200}
        y={380}
        start={20}
      />
      <LightSweep at={40} dur={50} angle={100} strength={0.3} />
      <div
        style={{
          position: "absolute",
          left: 960 - 300 * rule,
          width: 600 * rule,
          top: 610,
          height: 2,
          background: COLOR.gold,
          boxShadow: `0 0 10px ${COLOR.gold}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 640,
          textAlign: "center",
          ...TYPE.label,
          fontSize: 26,
          letterSpacing: "0.42em",
          color: COLOR.white,
          opacity: ease(frame, 62, 80),
        }}
      >
        Choreo · dance — metrics · measure
      </div>
      <Sfx name="riser" at={0} volume={0.25} />
      <Sfx name="boom" at={22} volume={0.45} />
      <Sfx name="whoosh" at={42} volume={0.3} />
    </Finish>
  );
};

// 08 — "Their goal was enormous: study movement patterns across cultures…" Speed-ramped push into the
// wall map; its strings light up pin by pin, then the camera pulls back out.
const HUB: [number, number] = [975, 92];
const PINS: { p: [number, number]; at: number }[] = [
  { p: [897, 62], at: 70 },
  { p: [1065, 66], at: 80 },
  { p: [870, 126], at: 90 },
  { p: [1220, 96], at: 100 },
  { p: [1340, 92], at: 110 },
  { p: [610, 126], at: 120 },
  { p: [1250, 190], at: 130 },
  { p: [1370, 176], at: 140 },
  { p: [915, 206], at: 150 },
  { p: [1085, 236], at: 160 },
];
export const I08Map: React.FC = () => (
  <Finish dust={0.25}>
    <Rig
      keys={[
        { f: 0, s: 1.02, x: 960, y: 540 },
        { f: 30, s: 1.05, x: 960, y: 520, e: "drift" },
        { f: 62, s: 2.0, x: 990, y: 150, e: "ramp" },
        { f: 230, s: 2.08, x: 1000, y: 150, e: "drift" },
        { f: 262, s: 1.04, x: 960, y: 540, e: "ramp" },
        { f: 300, s: 1.06, x: 960, y: 540, e: "drift" },
      ]}
    >
      <Plate src={img(7)} filter={WARM} />
      <MapThreads hub={HUB} pins={PINS} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <Sequence durationInFrames={64} layout="none">
      <CaptionAt text="their goal was" start={6} y={790} size={44} />
      <HeroWord text="enormous" look="serif" size={150} y={840} start={12} />
    </Sequence>
    <Sequence from={74} durationInFrames={176} layout="none">
      <CaptionAt text="study movement patterns" start={0} y={790} size={44} />
      <HeroWord
        text="across cultures"
        look="serif"
        size={150}
        y={840}
        start={8}
      />
    </Sequence>
    <Sfx name="drone" at={0} volume={0.22} />
    <Sfx name="whoosh" at={36} volume={0.5} />
    <Sfx name="hit" at={64} volume={0.3} />
    {PINS.map((p) => (
      <Sfx key={p.at} name="tick" at={p.at + 16} volume={0.2} />
    ))}
    <Sfx name="whoosh" at={238} volume={0.45} />
  </Finish>
);

// 09 — "…and investigate what dance could reveal about social organization and human culture."
// The film strip runs again under projector light, ending on the line's key words.
export const I09Culture: React.FC = () => (
  <Finish dust={0.3}>
    <AbsoluteFill style={{ backgroundColor: "#0b0706" }} />
    <FilmStrip frames={STRIP} speed={9} tilt={18} y={500} offset={900} />
    <ProjectorBeam sx={20} sy={260} strength={0.8} />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(0deg, rgba(8,5,4,0.92) 0%, rgba(8,5,4,0.5) 24%, rgba(8,5,4,0) 44%)",
      }}
    />
    <CaptionAt
      text="what dance could reveal about"
      start={10}
      y={800}
      size={44}
    />
    <HeroWord
      text="social organisation"
      look="serif"
      size={130}
      y={850}
      start={20}
      end={136}
    />
    <HeroWord
      text="human culture."
      look="serif"
      size={150}
      y={845}
      start={140}
    />
    <Sfx name="drone" at={0} volume={0.22} />
    {Array.from({ length: 10 }).map((_, i) => (
      <Sfx key={i} name="tick" at={i * 9} volume={0.15} />
    ))}
    <Sfx name="hit" at={22} volume={0.3} />
    <Sfx name="hit" at={142} volume={0.35} />
  </Finish>
);
