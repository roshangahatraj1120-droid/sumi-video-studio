import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";
import { HeroWord, SplitPanels, TornReveal } from "../brand/fx";
import { GRADES, Still } from "../cine/Still";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt } from "../laban/overlays";
import { SlideCard } from "../laban2/fx2";
import { Plate, Rig } from "../laban3/rig";
import {
  Crowd,
  GERMANY_AT,
  GermanyMap,
  TearPhoto,
  Timeline,
  YearCounter,
} from "./fx4";

// Laban — Part 4: politics. 30 fps. No Nazi insignia anywhere: the story is told through
// dates, places, institutions and bodies.
export const LEN4 = {
  d01: 120,
  d02: 240,
  d03: 240,
  d04: 240,
  d05: 180,
  d06: 300,
  d07: 210,
  d08: 330,
  d09: 330,
};

const img = (n: string) => `laban/${n}.jpg`;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const SHADE =
  "linear-gradient(0deg, rgba(8,4,2,0.88) 0%, rgba(8,4,2,0.5) 20%, rgba(8,4,2,0) 40%)";
const COLD = "grayscale(1) contrast(1.25) brightness(0.8)";

// 01 — "Then politics entered the story." Warm study drains to cold, the word glitches in.
export const D01Politics: React.FC = () => {
  const frame = useCurrentFrame();
  const drain = interpolate(frame, [18, 30], [0, 1], clamp);
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.05, x: 760, y: 500 },
          { f: 120, s: 1.18, x: 700, y: 480, e: "drift" },
        ]}
        whipOut={1}
      >
        <Plate src={img("01")} />
        <Plate src={img("01")} filter={COLD} style={{ opacity: drain }} />
      </Rig>
      <AbsoluteFill
        style={{ backgroundColor: `rgba(0,0,0,${0.45 * drain})` }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 120%, rgba(224,69,123,0.35), rgba(0,0,0,0) 60%)",
          opacity: drain,
          mixBlendMode: "screen",
        }}
      />
      <CaptionAt text="then" start={20} y={330} size={46} />
      <HeroWord
        text="Politics"
        look="heavy"
        size={240}
        color={COLOR.white}
        y={400}
        start={24}
        glitch
      />
      <CaptionAt text="entered the story" start={40} y={660} size={46} />
      <Sfx name="drone" at={0} volume={0.3} />
      <Sfx name="glitch" at={20} volume={0.4} />
      <Sfx name="boom" at={24} volume={0.55} />
      <Sfx name="whoosh" at={112} volume={0.5} />
    </Finish>
  );
};

// 02 — "When the Nazis came to power in Germany in 1933, Laban stayed."
export const D02Stayed: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.0, x: 960, y: 540 },
          { f: 20, s: 1.02, x: 960, y: 540, e: "drift" },
          { f: 70, s: 1.75, x: GERMANY_AT[0], y: GERMANY_AT[1], e: "ramp" },
          { f: 160, s: 1.85, x: GERMANY_AT[0], y: GERMANY_AT[1], e: "drift" },
        ]}
        whipIn={1}
      >
        <GermanyMap drawAt={40} />
      </Rig>
      <div style={{ position: "absolute", left: 110, top: 80 }}>
        <div
          style={{
            ...TYPE.label,
            fontSize: 30,
            letterSpacing: "0.3em",
            color: COLOR.white,
            opacity: interpolate(frame, [8, 18], [0, 1], clamp),
          }}
        >
          The Nazis come to power
        </div>
        <YearCounter from={1928} to={1933} start={10} end={54} size={200} />
      </div>
      <TornReveal at={150} seed="stayed">
        <Still
          src={img("02")}
          from={{ s: 1.08, x: 2 }}
          to={{ s: 1.16 }}
          grade={GRADES.bwRose}
          rose
        />
        <AbsoluteFill style={{ background: SHADE }} />
        <HeroWord
          text="Laban stayed."
          look="serif"
          size={170}
          y={780}
          start={10}
        />
      </TornReveal>
      <Sfx name="whoosh" at={0} volume={0.45} />
      <Sfx name="riser" at={18} volume={0.25} />
      {[14, 22, 30, 40, 54].map((f) => (
        <Sfx key={f} name="tick" at={f} volume={0.3} />
      ))}
      <Sfx name="hit" at={56} volume={0.4} />
      <Sfx name="whoosh" at={146} volume={0.55} />
      <Sfx name="boom" at={162} volume={0.45} />
    </Finish>
  );
};

// 03 — "He was not simply an outsider… He continued working inside Germany's cultural institutions"
export const D03Inside: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [62, 76], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const outsiderOut = interpolate(frame, [96, 104], [1, 0], clamp);
  const outsiderIn = interpolate(frame, [14, 26], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.7, x: 640, y: 330 },
          { f: 240, s: 1.55, x: 1180, y: 300, e: "drift" },
        ]}
      >
        <Plate src={img("16")} filter={COLD} />
      </Rig>
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.5)" }} />
      <CaptionAt text="not simply an" start={8} y={330} size={46} />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 390,
          textAlign: "center",
          opacity: outsiderIn * outsiderOut,
          translate: `0px ${(1 - outsiderIn) * 30}px`,
        }}
      >
        <span
          style={{
            position: "relative",
            ...TYPE.heavy,
            fontSize: 210,
            lineHeight: 1,
            textTransform: "uppercase",
            color: COLOR.white,
            textShadow: "0 6px 26px rgba(0,0,0,0.85)",
          }}
        >
          Outsider
          <span
            style={{
              position: "absolute",
              left: -20,
              top: "52%",
              height: 16,
              width: `calc(${strike * 100}% + 40px)`,
              background: COLOR.rose,
              boxShadow: `0 0 20px ${COLOR.rose}`,
              rotate: "-3deg",
            }}
          />
        </span>
      </div>
      <HeroWord text="Inside" look="heavy" size={260} y={380} start={104} />
      <CaptionAt
        text="Germany's cultural institutions"
        start={122}
        y={680}
        size={50}
      />
      <Sfx name="drone" at={0} volume={0.25} />
      <Sfx name="hit" at={16} volume={0.3} />
      <Sfx name="whoosh" at={60} volume={0.45} />
      <Sfx name="glitch" at={66} volume={0.3} />
      <Sfx name="boom" at={104} volume={0.5} />
    </Finish>
  );
};

// 04 — "…in 1934, was appointed to lead the Deutsche Tanzbühne – the German Dance Theatre."
export const D04Tanzbuhne: React.FC = () => {
  const frame = useCurrentFrame();
  const plate = interpolate(frame, [96, 120], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const line = interpolate(frame, [128, 150], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <Finish dust={0.4}>
      <Rig
        keys={[
          { f: 0, s: 1.04, x: 960, y: 540 },
          { f: 240, s: 1.2, x: 1000, y: 480, e: "drift" },
        ]}
      >
        <Plate
          src={img("18")}
          filter="grayscale(0.35) sepia(0.3) contrast(1.08)"
        />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <SlideCard
        start={14}
        end={100}
        kicker="1934 · appointed to lead"
        title="Deutsche Tanzbühne"
        x={100}
        y={740}
        width={760}
        titleSize={66}
      />
      {/* title plate: the name, then its English translation */}
      <AbsoluteFill
        style={{ backgroundColor: `rgba(10,5,12,${0.72 * plate})` }}
      />
      <HeroWord
        text="Deutsche Tanzbühne"
        look="serif"
        size={150}
        y={380}
        start={104}
      />
      <div
        style={{
          position: "absolute",
          left: 960 - 330 * line,
          width: 660 * line,
          top: 575,
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
          top: 610,
          textAlign: "center",
          ...TYPE.thin,
          fontSize: 56,
          letterSpacing: `${interpolate(frame, [140, 200], [0.5, 0.3], clamp)}em`,
          textTransform: "uppercase",
          color: COLOR.white,
          opacity: interpolate(frame, [140, 156], [0, 1], clamp),
        }}
      >
        The German Dance Theatre
      </div>
      <Sfx name="whoosh" at={10} volume={0.45} />
      <Sfx name="hit" at={18} volume={0.35} />
      <Sfx name="riser" at={80} volume={0.25} />
      <Sfx name="boom" at={106} volume={0.5} />
      <Sfx name="whoosh" at={138} volume={0.35} />
    </Finish>
  );
};

// 05 — "Historians still debate how to interpret his relationship with National Socialism"
// The same face, lit two ways, facing itself across the split.
export const D05Debate: React.FC = () => {
  const frame = useCurrentFrame();
  const q = interpolate(frame, [40, 56], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.6)),
  });
  return (
    <Finish dust={0.3}>
      <SplitPanels
        panels={[
          {
            start: 0,
            node: (
              <Still
                src="laban2/r1.jpg"
                from={{ s: 1.2, x: 14 }}
                to={{ s: 1.3, x: 15 }}
                grade="grayscale(0.4) sepia(0.35) contrast(1.05) brightness(1.05)"
              />
            ),
          },
          {
            start: 14,
            node: (
              <AbsoluteFill style={{ scale: "-1 1" }}>
                <Still
                  src="laban2/r1.jpg"
                  from={{ s: 1.2, x: 14 }}
                  to={{ s: 1.3, x: 15 }}
                  grade="grayscale(1) contrast(1.35) brightness(0.6)"
                />
              </AbsoluteFill>
            ),
          },
        ]}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 300,
          textAlign: "center",
          ...TYPE.headline,
          fontSize: 300,
          lineHeight: 1,
          color: COLOR.rose,
          opacity: q,
          scale: String(0.7 + 0.3 * q),
          textShadow: `0 0 40px ${COLOR.rose}aa, 0 6px 30px rgba(0,0,0,0.9)`,
        }}
      >
        ?
      </div>
      <CaptionAt text="historians still" start={30} y={790} size={46} />
      <HeroWord text="Debate" look="heavy" size={170} y={840} start={34} />
      <Sfx name="whoosh" at={10} volume={0.5} />
      <Sfx name="hit" at={40} volume={0.35} />
      <Sfx name="drone" at={0} volume={0.25} />
    </Finish>
  );
};

// 06 — "…the larger fact is clear: for several years, Laban's work operated inside – and benefited
// from – a cultural system being reshaped by the Nazi state." Data timeline.
export const D06Fact: React.FC = () => (
  <Finish dust={0.25}>
    <AbsoluteFill style={{ backgroundColor: COLOR.ink }} />
    <Rig
      keys={[
        { f: 0, s: 1.15, x: 900, y: 380 },
        { f: 300, s: 1.25, x: 1060, y: 360, e: "drift" },
      ]}
    >
      <Plate src={img("16")} filter={COLD} style={{ opacity: 0.22 }} />
    </Rig>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 55%, rgba(13,7,16,0.4), rgba(13,7,16,0.92) 75%)",
      }}
    />
    <CaptionAt text="the larger fact is clear" start={6} y={110} size={44} />
    <HeroWord
      text="Operated inside"
      look="heavy"
      size={120}
      y={170}
      start={96}
      end={168}
    />
    <HeroWord
      text="and benefited from"
      look="heavy"
      size={120}
      y={170}
      start={170}
    />
    <Timeline
      y={560}
      drawAt={16}
      marks={[
        { year: 1933, at: 40, label: "Nazis take power", rose: true },
        { year: 1934, at: 60, label: "Deutsche Tanzbühne", drop: 110 },
      ]}
      bar={{
        from: 1933,
        to: 1938,
        at: 80,
        dur: 80,
        label: "Laban's work · several years",
      }}
    />
    <CaptionAt
      text="a cultural system being reshaped by the Nazi state"
      start={214}
      y={985}
      size={44}
    />
    <Sfx name="drone" at={0} volume={0.25} />
    {[18, 22, 26, 30, 34].map((f) => (
      <Sfx key={f} name="tick" at={f} volume={0.25} />
    ))}
    <Sfx name="hit" at={40} volume={0.35} />
    <Sfx name="hit" at={60} volume={0.3} />
    <Sfx name="riser" at={80} volume={0.25} />
    <Sfx name="boom" at={98} volume={0.45} />
    <Sfx name="boom" at={172} volume={0.45} />
  </Finish>
);

// 07 — "That is an uncomfortable part of his legacy, but it should not be removed from the story."
// The page starts to tear away… and is put back.
export const D07NotRemoved: React.FC = () => (
  <Finish dust={0.4}>
    <AbsoluteFill style={{ backgroundColor: "#0b070c" }} />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, rgba(232,194,122,0.1), rgba(0,0,0,0) 65%)",
      }}
    />
    <TearPhoto src="laban2/r1.jpg" tearAt={40} backAt={112} />
    <HeroWord
      text="Uncomfortable"
      look="heavy"
      size={130}
      color={COLOR.white}
      y={880}
      start={22}
      end={108}
      glitch
    />
    <Sequence from={140} layout="none">
      <CaptionAt text="but it should not be" start={0} y={860} size={44} />
    </Sequence>
    <HeroWord text="removed" look="serif" size={130} y={910} start={146} />
    <Sfx name="drone" at={0} volume={0.25} />
    <Sfx name="glitch" at={24} volume={0.3} />
    <Sfx name="whoosh" at={40} volume={0.55} />
    <Sfx name="whoosh" at={112} volume={0.45} />
    <Sfx name="hit" at={142} volume={0.4} />
  </Finish>
);

// 08 — "Laban had already developed what he called movement choirs – large groups of people moving
// together. To him, collective movement could still preserve individual expression."
export const D08Choirs: React.FC = () => {
  const frame = useCurrentFrame();
  const solo = interpolate(frame, [200, 230], [0, 1], clamp);
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.04, x: 960, y: 540 },
          { f: 130, s: 1.14, x: 960, y: 520, e: "drift" },
        ]}
      >
        <Plate
          src={img("03")}
          filter="grayscale(0.3) sepia(0.3) contrast(1.06)"
        />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt text="what he called" start={10} y={790} size={44} />
      <HeroWord
        text="movement choirs"
        look="serif"
        size={150}
        y={840}
        start={16}
        end={122}
      />
      <TornReveal at={116} seed="choir">
        <AbsoluteFill style={{ backgroundColor: COLOR.ink }} />
        <Crowd t={0} solo={solo} />
        <Sequence from={10} durationInFrames={70} layout="none">
          <CaptionAt
            text="large groups of people moving together"
            start={0}
            y={90}
            size={46}
          />
        </Sequence>
      </TornReveal>
      <Sequence from={200} layout="none">
        <CaptionAt
          text="collective movement could still preserve"
          start={0}
          y={90}
          size={40}
        />
      </Sequence>
      <HeroWord
        text="individual expression"
        look="serif"
        size={120}
        y={140}
        start={210}
        color={COLOR.gold}
      />
      <Sfx name="drone" at={0} volume={0.25} />
      <Sfx name="hit" at={18} volume={0.3} />
      <Sfx name="whoosh" at={112} volume={0.55} />
      <Sfx name="riser" at={190} volume={0.25} />
      <Sfx name="hit" at={212} volume={0.35} />
    </Finish>
  );
};

// 09 — "To a fascist regime obsessed with mass spectacle, disciplined bodies and national identity,
// large-scale movement had very different political possibilities."
const WORDS = [
  { at: 70, text: "Mass spectacle" },
  { at: 128, text: "Disciplined bodies" },
  { at: 186, text: "National identity" },
];
export const D09Mass: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [12, 50], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const shake =
    frame >= 12 && frame < 50 ? Math.sin(frame * 2.3) * 6 * (1 - t) : 0;
  return (
    <Finish dust={0.2}>
      <AbsoluteFill
        style={{ backgroundColor: "#07050a", translate: `${shake}px 0px` }}
      >
        <AbsoluteFill
          style={{ scale: String(1 + 0.12 * t), transformOrigin: "50% 80%" }}
        >
          <Crowd t={t} solo={1} />
        </AbsoluteFill>
      </AbsoluteFill>
      <CaptionAt
        text="to a fascist regime obsessed with"
        start={56}
        y={90}
        size={42}
      />
      {WORDS.map((w, i) => (
        <HeroWord
          key={w.text}
          text={w.text}
          look="heavy"
          size={140}
          color={i === 1 ? COLOR.rose : COLOR.white}
          y={150}
          start={w.at}
          end={WORDS[i + 1]?.at ?? 236}
          glitch={i === 0}
        />
      ))}
      <TornReveal at={236} seed="mass" dir={-1}>
        <Still
          src={img("16")}
          from={{ s: 1.04 }}
          to={{ s: 1.14, y: 2 }}
          grade={GRADES.bwRose}
          rose
        />
        <AbsoluteFill style={{ background: SHADE }} />
        <Sequence from={10} layout="none">
          <CaptionAt text="very different" start={0} y={780} size={46} />
        </Sequence>
        <HeroWord
          text="Political possibilities"
          look="heavy"
          size={96}
          y={835}
          start={16}
        />
      </TornReveal>
      <Sfx name="glitch" at={12} volume={0.35} />
      <Sfx name="riser" at={14} volume={0.3} />
      {Array.from({ length: 10 }).map((_, i) => (
        <Sfx key={i} name="hit" at={50 + i * 22} volume={0.18} />
      ))}
      {WORDS.map((w) => (
        <Sfx key={w.at} name="boom" at={w.at} volume={0.4} />
      ))}
      <Sfx name="whoosh" at={232} volume={0.55} />
      <Sfx name="boom" at={252} volume={0.5} />
    </Finish>
  );
};
