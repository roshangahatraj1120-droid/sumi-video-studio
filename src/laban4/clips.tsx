import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";
import { HeroWord, PanelLabel, SplitPanels, TornReveal } from "../brand/fx";
import { GRADES, Still } from "../cine/Still";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt, LabelAt } from "../laban/overlays";
import { Plate, Rig } from "../laban3/rig";

// Laban — Part 4: politics. 30 fps. Photos only, with still movement, split screens and cuts;
// no drawn graphics and no Nazi insignia.
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
const PORTRAIT = "laban2/r1.jpg";
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const SHADE =
  "linear-gradient(0deg, rgba(8,4,2,0.88) 0%, rgba(8,4,2,0.5) 20%, rgba(8,4,2,0) 40%)";
const TOP_SHADE =
  "linear-gradient(180deg, rgba(8,4,2,0.8) 0%, rgba(8,4,2,0.4) 22%, rgba(8,4,2,0) 42%)";
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
// Slow drift along the monumental façade, then a torn cut to Laban still at his desk.
export const D02Stayed: React.FC = () => (
  <Finish dust={0.3}>
    <Rig
      keys={[
        { f: 0, s: 1.75, x: 1500, y: 260 },
        { f: 150, s: 1.62, x: 1150, y: 280, e: "drift" },
      ]}
      whipIn={1}
    >
      <Plate src={img("16")} filter={COLD} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <LabelAt text="Germany" start={12} y={720} size={56} />
    <HeroWord
      text="1933"
      look="thin"
      size={230}
      x={110}
      y={760}
      align="left"
      start={18}
      end={152}
    />
    <TornReveal at={146} seed="stayed">
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
    <Sfx name="drone" at={4} volume={0.25} />
    <Sfx name="boom" at={20} volume={0.45} />
    <Sfx name="whoosh" at={142} volume={0.55} />
    <Sfx name="hit" at={158} volume={0.4} />
  </Finish>
);

// 03 — "He was not simply an outsider… He continued working inside Germany's cultural institutions"
// Portrait with the word struck out beside him, then a split: the man | the institution.
export const D03Inside: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [52, 66], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const inT = interpolate(frame, [12, 24], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Finish dust={0.3}>
      <SplitPanels
        panels={[
          {
            start: 0,
            node: (
              <AbsoluteFill>
                <Still
                  src={PORTRAIT}
                  from={{ s: 1.04 }}
                  to={{ s: 1.14, x: 2 }}
                  grade={GRADES.bwRose}
                />
                <AbsoluteFill
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.6) 60%)",
                  }}
                />
              </AbsoluteFill>
            ),
            label: (
              <Sequence from={90} layout="none">
                <PanelLabel thin="working" heavy="inside" />
              </Sequence>
            ),
          },
          {
            start: 96,
            node: (
              <Still
                src={img("16")}
                from={{ s: 1.7, y: 22 }}
                to={{ s: 1.6, x: -6, y: 20 }}
                grade={COLD}
              />
            ),
            label: (
              <PanelLabel thin="cultural" heavy="institutions" heavySize={92} />
            ),
          },
        ]}
      />
      {/* before the split: the word he was not, struck out beside him */}
      {frame < 96 ? (
        <div
          style={{
            position: "absolute",
            left: 900,
            top: 380,
            opacity: inT * interpolate(frame, [84, 94], [1, 0], clamp),
            translate: `0px ${(1 - inT) * 30}px`,
          }}
        >
          <div
            style={{
              ...TYPE.thin,
              fontSize: 46,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: COLOR.white,
            }}
          >
            not simply an
          </div>
          <span
            style={{
              position: "relative",
              ...TYPE.heavy,
              fontSize: 180,
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
                left: -16,
                top: "50%",
                height: 14,
                width: `calc(${strike * 100}% + 32px)`,
                background: COLOR.rose,
                boxShadow: `0 0 18px ${COLOR.rose}`,
                rotate: "-3deg",
              }}
            />
          </span>
        </div>
      ) : null}
      <Sfx name="drone" at={0} volume={0.25} />
      <Sfx name="hit" at={14} volume={0.3} />
      <Sfx name="whoosh" at={50} volume={0.4} />
      <Sfx name="glitch" at={56} volume={0.3} />
      <Sfx name="whoosh" at={92} volume={0.55} />
      <Sfx name="hit" at={100} volume={0.4} />
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
      <Sequence durationInFrames={100} layout="none">
        <LabelAt text="1934 · appointed to lead" start={14} y={900} size={54} />
      </Sequence>
      {/* the frame darkens into a title plate: the name, then its English translation */}
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
                src={PORTRAIT}
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
                  src={PORTRAIT}
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
// from – a cultural system being reshaped by the Nazi state." Three-way split, one beat each.
export const D06Fact: React.FC = () => (
  <Finish dust={0.25}>
    <SplitPanels
      panels={[
        {
          start: 0,
          node: (
            <Still
              src={img("05")}
              from={{ s: 1.1 }}
              to={{ s: 1.22, y: 3 }}
              grade={GRADES.bwRose}
            />
          ),
          label: <PanelLabel thin="operated" heavy="inside" />,
        },
        {
          start: 80,
          node: (
            <Still
              src={img("18")}
              from={{ s: 1.18, x: 2 }}
              to={{ s: 1.1 }}
              grade={GRADES.bwRose}
            />
          ),
          label: <PanelLabel thin="and" heavy="benefited" heavySize={92} />,
        },
        {
          start: 160,
          node: (
            <Still
              src={img("16")}
              from={{ s: 1.08 }}
              to={{ s: 1.18, y: -3 }}
              grade={GRADES.bwRose}
              rose
            />
          ),
          label: <PanelLabel thin="a cultural" heavy="system" />,
        },
      ]}
    />
    <AbsoluteFill style={{ background: TOP_SHADE }} />
    <Sequence durationInFrames={196} layout="none">
      <CaptionAt
        text="for several years, the larger fact is clear"
        start={8}
        y={70}
        size={42}
      />
    </Sequence>
    <Sequence from={200} layout="none">
      <CaptionAt
        text="being reshaped by the Nazi state"
        start={0}
        y={70}
        size={46}
      />
    </Sequence>
    <Sfx name="drone" at={0} volume={0.25} />
    <Sfx name="hit" at={8} volume={0.35} />
    <Sfx name="whoosh" at={76} volume={0.55} />
    <Sfx name="hit" at={86} volume={0.35} />
    <Sfx name="whoosh" at={156} volume={0.55} />
    <Sfx name="boom" at={166} volume={0.45} />
  </Finish>
);

// 07 — "That is an uncomfortable part of his legacy, but it should not be removed from the story."
// Tight on his face; the picture nearly fades away, then snaps back.
export const D07NotRemoved: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(
    frame,
    [92, 118, 122, 126],
    [0, 0.85, 0.85, 0],
    clamp,
  );
  const flash = interpolate(frame, [122, 124, 136], [0, 0.5, 0], clamp);
  return (
    <Finish dust={0.4}>
      <Rig
        keys={[
          { f: 0, s: 1.5, x: 1000, y: 330 },
          { f: 210, s: 1.75, x: 1010, y: 320, e: "drift" },
        ]}
      >
        <Plate src={img("02")} filter={COLD} />
      </Rig>
      <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${fade})` }} />
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(255,240,220,${flash})`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence durationInFrames={100} layout="none">
        <CaptionAt
          text="an uncomfortable part of his legacy"
          start={14}
          y={780}
          size={44}
        />
      </Sequence>
      <HeroWord
        text="Uncomfortable"
        look="heavy"
        size={140}
        color={COLOR.white}
        y={835}
        start={22}
        end={100}
        glitch
      />
      <Sequence from={130} layout="none">
        <CaptionAt text="but it should not be" start={0} y={780} size={44} />
      </Sequence>
      <HeroWord text="removed" look="serif" size={150} y={830} start={136} />
      <Sfx name="drone" at={0} volume={0.3} />
      <Sfx name="glitch" at={24} volume={0.3} />
      <Sfx name="riser" at={90} volume={0.3} />
      <Sfx name="boom" at={122} volume={0.5} />
    </Finish>
  );
};

// 08 — "Laban had already developed what he called movement choirs… To him, collective movement
// could still preserve individual expression." Group → split: the group | the one.
export const D08Choirs: React.FC = () => (
  <Finish dust={0.3}>
    <Rig
      keys={[
        { f: 0, s: 1.04, x: 960, y: 540 },
        { f: 130, s: 1.16, x: 960, y: 520, e: "drift" },
      ]}
    >
      <Plate
        src={img("03")}
        filter="grayscale(0.25) sepia(0.3) contrast(1.06)"
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
    />
    <TornReveal at={124} seed="choir">
      <SplitPanels
        panels={[
          {
            start: 0,
            node: (
              <Still
                src={img("03")}
                from={{ s: 1.25, x: -4 }}
                to={{ s: 1.15, x: 0 }}
                grade={GRADES.sepiaGold}
              />
            ),
            label: <PanelLabel thin="collective" heavy="movement" />,
          },
          {
            start: 86,
            node: (
              <Still
                src={img("07")}
                from={{ s: 1.1, x: 18 }}
                to={{ s: 1.2, x: 20 }}
                grade={GRADES.sepiaGold}
              />
            ),
            label: (
              <PanelLabel thin="individual" heavy="expression" heavySize={92} />
            ),
          },
        ]}
      />
    </TornReveal>
    <Sfx name="drone" at={0} volume={0.25} />
    <Sfx name="hit" at={18} volume={0.3} />
    <Sfx name="whoosh" at={120} volume={0.55} />
    <Sfx name="hit" at={130} volume={0.3} />
    <Sfx name="whoosh" at={206} volume={0.55} />
    <Sfx name="hit" at={216} volume={0.35} />
  </Finish>
);

// 09 — "To a fascist regime obsessed with mass spectacle, disciplined bodies and national identity,
// large-scale movement had very different political possibilities."
// Close on the front row, a speed-ramped pull back reveals the mass; ends on choir | mass.
const WORDS = [
  { at: 66, text: "Mass spectacle" },
  { at: 124, text: "Disciplined bodies" },
  { at: 182, text: "National identity" },
];
export const D09Mass: React.FC = () => (
  <Finish dust={0.2}>
    <Rig
      keys={[
        { f: 0, s: 2.1, x: 880, y: 760 },
        { f: 22, s: 2.05, x: 880, y: 760, e: "drift" },
        { f: 56, s: 1.08, x: 960, y: 520, e: "ramp" },
        { f: 240, s: 1.0, x: 960, y: 540, e: "drift" },
      ]}
    >
      <Plate src={img("16")} filter={COLD} />
    </Rig>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 110%, rgba(224,69,123,0.25), rgba(0,0,0,0) 70%)",
        mixBlendMode: "screen",
      }}
    />
    <AbsoluteFill style={{ background: TOP_SHADE }} />
    <CaptionAt
      text="to a fascist regime obsessed with"
      start={56}
      y={60}
      size={42}
    />
    {WORDS.map((w, i) => (
      <HeroWord
        key={w.text}
        text={w.text}
        look="heavy"
        size={140}
        color={i === 1 ? COLOR.rose : COLOR.white}
        y={120}
        start={w.at}
        end={WORDS[i + 1]?.at ?? 236}
        glitch={i === 0}
      />
    ))}
    <TornReveal at={236} seed="mass" dir={-1}>
      <SplitPanels
        panels={[
          {
            start: 0,
            node: (
              <Still
                src={img("03")}
                from={{ s: 1.15 }}
                to={{ s: 1.22 }}
                grade={GRADES.sepiaGold}
              />
            ),
            label: <PanelLabel thin="movement" heavy="choir" />,
          },
          {
            start: 8,
            node: (
              <Still
                src={img("16")}
                from={{ s: 1.15 }}
                to={{ s: 1.25 }}
                grade={GRADES.bwRose}
                rose
              />
            ),
            label: (
              <PanelLabel
                thin="political"
                heavy="possibilities"
                heavySize={84}
              />
            ),
          },
        ]}
      />
      <AbsoluteFill style={{ background: TOP_SHADE }} />
      <Sequence from={14} layout="none">
        <CaptionAt text="very different" start={0} y={70} size={46} />
      </Sequence>
    </TornReveal>
    <Sfx name="drone" at={0} volume={0.3} />
    <Sfx name="riser" at={18} volume={0.3} />
    <Sfx name="whoosh" at={26} volume={0.55} />
    {WORDS.map((w) => (
      <Sfx key={w.at} name="boom" at={w.at} volume={0.4} />
    ))}
    <Sfx name="glitch" at={66} volume={0.25} />
    <Sfx name="whoosh" at={232} volume={0.55} />
    <Sfx name="hit" at={248} volume={0.4} />
  </Finish>
);
