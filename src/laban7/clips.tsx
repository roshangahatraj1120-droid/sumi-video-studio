import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { COLOR, FONT, TYPE } from "../brand/tokens";
import { HeroWord, PanelLabel, SplitPanels, TornReveal } from "../brand/fx";
import { Still } from "../cine/Still";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt, LabelAt } from "../laban/overlays";
import { Plate, Rig } from "../laban3/rig";

// Laban — Part 7: New York, the Dance Notation Bureau and the first choreographic copyright. 30 fps.
// Slightly brighter palette than the war chapters. Photos only; the stamp is lettering, not artwork.
export const LEN7 = {
  g01: 180,
  g02: 240,
  g03: 240,
  g04: 240,
  g05: 180,
  g06: 270,
  g07: 240,
  g08: 210,
  g09: 240,
  g10: 300,
};

const img = (n: number, page = false) =>
  `laban7/g0${n}${page ? "-page" : ""}.jpg`;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const BRIGHT = "brightness(1.06) contrast(1.04) saturate(1.06)";
const SHADE =
  "linear-gradient(0deg, rgba(10,6,4,0.78) 0%, rgba(10,6,4,0.42) 20%, rgba(10,6,4,0) 40%)";
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

// Title plate: the frame darkens, a serif name, a gold line, a thin subtitle
const TitlePlate: React.FC<{ at: number; title: string; sub: string }> = ({
  at,
  title,
  sub,
}) => {
  const frame = useCurrentFrame();
  const plate = interpolate(frame, [at - 8, at + 14], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const line = interpolate(frame, [at + 20, at + 42], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <>
      <AbsoluteFill
        style={{ backgroundColor: `rgba(12,7,10,${0.68 * plate})` }}
      />
      <HeroWord text={title} look="serif" size={140} y={370} start={at} />
      <div
        style={{
          position: "absolute",
          left: 960 - 330 * line,
          width: 660 * line,
          top: 560,
          height: 2.5,
          background: COLOR.gold,
          boxShadow: `0 0 10px ${COLOR.gold}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 595,
          textAlign: "center",
          ...TYPE.thin,
          fontSize: 54,
          letterSpacing: `${interpolate(frame, [at + 30, at + 90], [0.5, 0.32], clamp)}em`,
          textTransform: "uppercase",
          color: COLOR.white,
          opacity: ease(frame, at + 30, at + 46),
        }}
      >
        {sub}
      </div>
    </>
  );
};

// 01 — "Across the Atlantic, another branch of Laban's system was developing."
// The camera crosses the ocean along the map's arc, Europe → New York.
export const G01Atlantic: React.FC = () => (
  <Finish dust={0.25}>
    <Rig
      keys={[
        { f: 0, s: 1.55, x: 1300, y: 320 },
        { f: 20, s: 1.55, x: 1280, y: 325, e: "drift" },
        { f: 120, s: 1.45, x: 560, y: 440, e: "smooth" },
        { f: 180, s: 1.42, x: 520, y: 450, e: "drift" },
      ]}
      whipOut={1}
    >
      <Plate src={img(1)} filter={BRIGHT} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <LabelAt text="Across the Atlantic" start={14} y={850} size={56} />
    <HeroWord
      text="another branch"
      look="serif"
      size={130}
      x={110}
      y={900}
      align="left"
      start={70}
    />
    <Sfx name="drone" at={0} volume={0.22} />
    <Sfx name="whoosh" at={20} volume={0.4} />
    <Sfx name="hit" at={72} volume={0.3} />
    <Sfx name="whoosh" at={172} volume={0.5} />
  </Finish>
);

// 02 — "In 1940, Ann Hutchinson Guest and several collaborators helped establish the Dance Notation
// Bureau in New York."
export const G02Bureau: React.FC = () => (
  <Finish dust={0.25}>
    <Rig
      keys={[
        { f: 0, s: 1.04, x: 960, y: 540 },
        { f: 240, s: 1.2, x: 1000, y: 500, e: "drift" },
      ]}
      whipIn={1}
    >
      <Plate src={img(2)} filter={BRIGHT} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <Sequence durationInFrames={118} layout="none">
      <HeroWord
        text="1940"
        look="thin"
        size={200}
        x={110}
        y={740}
        align="left"
        start={8}
      />
      <CaptionAt
        text="Ann Hutchinson Guest and collaborators"
        start={40}
        x={124}
        y={960}
        size={40}
      />
    </Sequence>
    <TitlePlate at={124} title="Dance Notation Bureau" sub="New York" />
    <Sfx name="hit" at={10} volume={0.35} />
    <Sfx name="riser" at={104} volume={0.25} />
    <Sfx name="boom" at={126} volume={0.45} />
  </Finish>
);

// 03 — "Its mission was preservation. If choreography could be written precisely enough, a dance did
// not have to disappear when the original performers stopped performing it."
export const G03Preservation: React.FC = () => {
  const frame = useCurrentFrame();
  // the remembered dancers fade toward nothing, then hold
  const fade = interpolate(frame, [160, 205, 225], [1, 0.45, 0.6], clamp);
  return (
    <Finish dust={0.25}>
      <Sequence durationInFrames={120}>
        <Rig
          keys={[
            { f: 0, s: 1.05, x: 1000, y: 520 },
            { f: 120, s: 1.22, x: 1080, y: 420, e: "drift" },
          ]}
        >
          <Plate src={img(3)} filter={BRIGHT} />
        </Rig>
        <AbsoluteFill style={{ background: SHADE }} />
        <CaptionAt text="its mission was" start={10} y={790} size={46} />
        <HeroWord
          text="preservation."
          look="serif"
          size={170}
          y={840}
          start={16}
        />
      </Sequence>
      <TornReveal at={112} seed="preserve">
        <AbsoluteFill style={{ backgroundColor: "#d9cdb8" }} />
        <Rig
          keys={[
            { f: 0, s: 1.9, x: 960, y: 290 },
            { f: 128, s: 1.95, x: 1040, y: 290, e: "drift" },
          ]}
        >
          <Plate
            src={img(5)}
            filter={`${BRIGHT} grayscale(0.3)`}
            style={{ opacity: fade }}
          />
        </Rig>
        <AbsoluteFill style={{ background: SHADE }} />
        <Sequence from={8} layout="none">
          <CaptionAt
            text="a dance did not have to"
            start={0}
            y={790}
            size={46}
          />
        </Sequence>
        <HeroWord text="disappear" look="serif" size={170} y={840} start={14} />
      </TornReveal>
      <Sfx name="drone" at={0} volume={0.22} />
      <Sfx name="hit" at={18} volume={0.3} />
      <Sfx name="whoosh" at={108} volume={0.55} />
      <Sfx name="riser" at={150} volume={0.2} />
    </Finish>
  );
};

// 04 — "Dance scores were created for major choreographers, including works by George Balanchine,
// Doris Humphrey, Hanya Holm and others." Speed-ramped tilt down the labelled binders.
const NAMES = [
  { at: 20, name: "George Balanchine", y: 510 },
  { at: 76, name: "Doris Humphrey", y: 580 },
  { at: 132, name: "Hanya Holm", y: 660 },
];
export const G04Choreographers: React.FC = () => (
  <Finish dust={0.25}>
    <Rig
      keys={[
        { f: 0, s: 1.3, x: 960, y: 560 },
        ...NAMES.flatMap((n) => [
          { f: n.at - 6, s: 2.2, x: 300, y: n.y, e: "ramp" as const },
          { f: n.at + 44, s: 2.25, x: 300, y: n.y + 6, e: "drift" as const },
        ]),
        { f: 196, s: 1.04, x: 960, y: 540, e: "ramp" },
        { f: 240, s: 1.02, x: 960, y: 540, e: "drift" },
      ]}
    >
      <Plate src={img(5)} filter={BRIGHT} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    {NAMES.map((n, i) => (
      <Sequence
        key={n.name}
        from={n.at}
        durationInFrames={(NAMES[i + 1]?.at ?? 190) - n.at}
        layout="none"
      >
        <HeroWord
          text={n.name}
          look="serif"
          size={110}
          x={760}
          y={780}
          align="left"
          start={0}
        />
      </Sequence>
    ))}
    <Sequence from={196} layout="none">
      <CaptionAt text="and others" start={0} y={790} size={46} />
      <HeroWord text="Dance scores" look="heavy" size={150} y={840} start={6} />
    </Sequence>
    <Sfx name="whoosh" at={10} volume={0.45} />
    {NAMES.map((n) => (
      <Sfx key={n.at} name="hit" at={n.at} volume={0.3} />
    ))}
    <Sfx name="whoosh" at={186} volume={0.5} />
    <Sfx name="boom" at={200} volume={0.4} />
  </Finish>
);

// 05 — "Then, in 1952, something historically important happened." Broadway at night.
export const G05Broadway: React.FC = () => (
  <Finish dust={0.25}>
    <Rig
      keys={[
        { f: 0, s: 1.04, x: 1060, y: 540 },
        { f: 180, s: 1.22, x: 1100, y: 480, e: "drift" },
      ]}
      whipOut={1}
    >
      <Plate src={img(4)} filter={BRIGHT} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <HeroWord
      text="1952"
      look="thin"
      size={240}
      x={110}
      y={700}
      align="left"
      start={12}
    />
    <CaptionAt
      text="something historically important happened"
      start={40}
      x={124}
      y={960}
      size={42}
    />
    <Sfx name="drone" at={0} volume={0.22} />
    <Sfx name="boom" at={14} volume={0.45} />
    <Sfx name="whoosh" at={172} volume={0.55} />
  </Finish>
);

// 06 — "Hanya Holm's choreography for the Broadway musical Kiss Me, Kate was submitted to the U.S.
// Copyright Office using a Labanotation score prepared by Ann Hutchinson Guest."
export const G06Submitted: React.FC = () => (
  <Finish dust={0.25}>
    <SplitPanels
      panels={[
        {
          start: 0,
          node: (
            <Still
              src={img(4)}
              from={{ s: 1.15, x: -6 }}
              to={{ s: 1.22, x: -7 }}
              grade={BRIGHT}
              whipIn={1}
            />
          ),
          label: (
            <PanelLabel thin="Broadway" heavy="Kiss Me, Kate" heavySize={88} />
          ),
        },
        {
          start: 90,
          node: (
            <Still
              src={img(6)}
              from={{ s: 1.12, x: 6 }}
              to={{ s: 1.2, x: 4 }}
              grade={BRIGHT}
            />
          ),
          label: (
            <PanelLabel
              thin="submitted to the"
              heavy="Copyright Office"
              heavySize={78}
            />
          ),
        },
      ]}
    />
    <Sequence from={180} layout="none">
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(10,6,4,0.75) 0%, rgba(10,6,4,0) 26%)",
        }}
      />
      <CaptionAt
        text="a Labanotation score prepared by Ann Hutchinson Guest"
        start={0}
        y={60}
        size={40}
      />
    </Sequence>
    <Sfx name="whoosh" at={0} volume={0.45} />
    <Sfx name="hit" at={8} volume={0.3} />
    <Sfx name="whoosh" at={86} volume={0.55} />
    <Sfx name="hit" at={96} volume={0.35} />
  </Finish>
);

// 07 — "Holm received what the Library of Congress describes as the first copyright registration
// claim for a choreographic work."
export const G07First: React.FC = () => (
  <Finish dust={0.25}>
    <Rig
      keys={[
        { f: 0, s: 1.1, x: 1000, y: 520 },
        { f: 30, s: 1.12, x: 1000, y: 520, e: "drift" },
        { f: 56, s: 1.7, x: 1260, y: 640, e: "ramp" },
        { f: 240, s: 1.8, x: 1240, y: 640, e: "drift" },
      ]}
    >
      <Plate src={img(6)} filter={BRIGHT} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <CaptionAt
      text="described by the Library of Congress as"
      start={10}
      y={700}
      size={42}
    />
    <HeroWord text="the first" look="serif" size={150} y={750} start={18} />
    <CaptionAt
      text="copyright registration claim for a choreographic work"
      start={60}
      y={930}
      size={42}
    />
    <Sfx name="drone" at={0} volume={0.22} />
    <Sfx name="hit" at={20} volume={0.3} />
    <Sfx name="whoosh" at={34} volume={0.45} />
    <Sfx name="boom" at={58} volume={0.4} />
  </Finish>
);

// 08 — "At the time, choreography was not yet its own explicit category under U.S. copyright law, so
// it was registered as a dramatic work."
export const G08Dramatic: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [70, 84], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const out = interpolate(frame, [108, 118], [1, 0], clamp);
  return (
    <Finish dust={0.25}>
      <Rig
        keys={[
          { f: 0, s: 1.4, x: 1100, y: 600 },
          { f: 210, s: 1.55, x: 1050, y: 620, e: "drift" },
        ]}
      >
        <Plate src={img(2)} filter={BRIGHT} />
      </Rig>
      <AbsoluteFill style={{ backgroundColor: "rgba(12,7,10,0.45)" }} />
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence durationInFrames={118} layout="none">
        <CaptionAt
          text="not yet its own category"
          start={8}
          y={360}
          size={46}
        />
      </Sequence>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 420,
          textAlign: "center",
          opacity: ease(frame, 14, 26) * out,
        }}
      >
        <span
          style={{
            position: "relative",
            ...TYPE.heavy,
            fontSize: 170,
            lineHeight: 1,
            textTransform: "uppercase",
            color: COLOR.white,
            textShadow: "0 6px 26px rgba(0,0,0,0.85)",
          }}
        >
          Choreography
          <span
            style={{
              position: "absolute",
              left: -16,
              top: "50%",
              height: 14,
              width: `calc(${strike * 100}% + 32px)`,
              background: COLOR.rose,
              boxShadow: `0 0 18px ${COLOR.rose}`,
              rotate: "-2deg",
            }}
          />
        </span>
      </div>
      <Sequence from={120} layout="none">
        <CaptionAt
          text="so it was registered as a"
          start={0}
          y={360}
          size={46}
        />
      </Sequence>
      <HeroWord
        text="dramatic work"
        look="serif"
        size={180}
        y={420}
        start={124}
      />
      <Sfx name="hit" at={16} volume={0.3} />
      <Sfx name="glitch" at={74} volume={0.3} />
      <Sfx name="whoosh" at={112} volume={0.4} />
      <Sfx name="boom" at={126} volume={0.4} />
    </Finish>
  );
};

// 09 — "That changed the philosophical meaning of notation. Movement was no longer only something
// you could remember. Now it could help make choreography legally tangible…"
export const G09Tangible: React.FC = () => (
  <Finish dust={0.25}>
    <Rig
      keys={[
        { f: 0, s: 1.9, x: 1000, y: 290 },
        { f: 130, s: 2.0, x: 880, y: 290, e: "drift" },
      ]}
    >
      <Plate src={img(5)} filter={`${BRIGHT} grayscale(0.4) blur(0.6px)`} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <CaptionAt
      text="no longer only something you could"
      start={10}
      y={790}
      size={44}
    />
    <HeroWord text="remember" look="serif" size={170} y={840} start={16} />
    <TornReveal at={124} seed="tangible">
      <Rig
        keys={[
          { f: 0, s: 1.1, x: 960, y: 540 },
          { f: 116, s: 1.24, x: 1080, y: 460, e: "drift" },
        ]}
      >
        <Plate src={img(3)} filter={BRIGHT} />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence from={8} layout="none">
        <CaptionAt
          text="now it could make choreography"
          start={0}
          y={790}
          size={44}
        />
      </Sequence>
      <HeroWord
        text="Legally tangible"
        look="heavy"
        size={150}
        y={840}
        start={14}
      />
    </TornReveal>
    <Sfx name="drone" at={0} volume={0.22} />
    <Sfx name="hit" at={18} volume={0.3} />
    <Sfx name="whoosh" at={120} volume={0.55} />
    <Sfx name="boom" at={140} volume={0.45} />
  </Finish>
);

// 10 — "…something that could be archived, reconstructed and claimed as intellectual property."
// GRAPHIC: the notation page, and a stamp slammed onto it: COPYRIGHT REGISTERED · 1952.
const STAMP_AT = 196;
const INK = "#B21F30";
const Stamp: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame - STAMP_AT;
  if (t < 0) return null;
  const land = interpolate(t, [0, 5], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const scale = 2.3 - 1.3 * land + (t > 5 ? 0.02 * Math.exp(-(t - 5) / 3) : 0);
  return (
    <div
      style={{
        position: "absolute",
        left: 960,
        top: 560,
        translate: "-50% -50%",
        scale: String(scale),
        rotate: "-7deg",
        opacity: Math.min(0.94, land * 1.6),
        mixBlendMode: "multiply",
      }}
    >
      <svg
        width={1360}
        height={300}
        viewBox="0 0 1360 300"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* uneven ink: grain eats into the strokes like a rubber stamp */}
          <filter id="ink" x="-5%" y="-10%" width="110%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed="7"
              result="n"
            />
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.35"
              result="holes"
            />
            <feComposite
              in="SourceGraphic"
              in2="holes"
              operator="in"
              result="inked"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="2"
              seed="3"
              result="w"
            />
            <feDisplacementMap in="inked" in2="w" scale="5" />
          </filter>
        </defs>
        <g filter="url(#ink)" fill="none" stroke={INK}>
          <rect
            x={8}
            y={8}
            width={1344}
            height={284}
            rx={18}
            strokeWidth={12}
          />
          <rect
            x={30}
            y={30}
            width={1300}
            height={240}
            rx={10}
            strokeWidth={4}
          />
          <text
            x={680}
            y={184}
            textAnchor="middle"
            textLength={1200}
            lengthAdjust="spacingAndGlyphs"
            fill={INK}
            stroke="none"
            style={{
              fontFamily: FONT.body,
              fontWeight: 900,
              fontSize: 104,
            }}
          >
            COPYRIGHT REGISTERED · 1952
          </text>
        </g>
      </svg>
    </div>
  );
};
const WORDS = [
  { at: 20, w: "Archived" },
  { at: 70, w: "Reconstructed" },
  { at: 120, w: "Claimed" },
];
export const G10Stamp: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame - STAMP_AT;
  const shake =
    t >= 5 && t < 20 ? Math.sin(t * 3.3) * 10 * (1 - (t - 5) / 15) : 0;
  const flash = interpolate(t, [4, 6, 16], [0, 0.35, 0], clamp);
  return (
    <Finish dust={0.3}>
      <AbsoluteFill style={{ translate: `${shake}px ${shake * 0.6}px` }}>
        <Rig
          keys={[
            { f: 0, s: 1.45, x: 700, y: 420 },
            { f: 180, s: 1.3, x: 960, y: 520, e: "smooth" },
            { f: STAMP_AT, s: 1.06, x: 960, y: 540, e: "ramp" },
            { f: 300, s: 1.1, x: 960, y: 540, e: "drift" },
          ]}
        >
          <Plate src={img(7, true)} filter="contrast(1.05) brightness(1.02)" />
        </Rig>
        <Stamp />
        {/* a few ink flecks thrown on impact */}
        {t >= 5
          ? Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 960 + (random(`fx${i}`) - 0.5) * 1500,
                  top: 560 + (random(`fy${i}`) - 0.5) * 420,
                  width: 4 + random(`fs${i}`) * 9,
                  height: 4 + random(`fs${i}`) * 9,
                  borderRadius: "50%",
                  background: INK,
                  opacity: 0.55,
                  mixBlendMode: "multiply",
                }}
              />
            ))
          : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: `rgba(255,250,240,${flash})` }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(20,12,8,0.82) 0%, rgba(20,12,8,0.5) 18%, rgba(20,12,8,0) 34%)",
        }}
      />
      {WORDS.map((w, i) => (
        <HeroWord
          key={w.w}
          text={w.w}
          look="heavy"
          size={120}
          color={i === 2 ? COLOR.rose : COLOR.white}
          y={70}
          start={w.at}
          end={WORDS[i + 1]?.at ?? 170}
        />
      ))}
      <Sequence from={150} durationInFrames={50} layout="none">
        <CaptionAt
          text="as intellectual property"
          start={0}
          y={100}
          size={56}
        />
      </Sequence>
      <Sfx name="drone" at={0} volume={0.2} />
      {WORDS.map((w) => (
        <Sfx key={w.at} name="hit" at={w.at} volume={0.35} />
      ))}
      <Sfx name="riser" at={160} volume={0.3} />
      <Sfx name="whoosh" at={STAMP_AT - 4} volume={0.45} />
      <Sfx name="boom" at={STAMP_AT + 5} volume={0.7} />
      <Sfx name="hit" at={STAMP_AT + 5} volume={0.6} />
    </Finish>
  );
};
