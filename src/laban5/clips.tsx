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
import { LightLeak } from "../cine/overlays";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt, LabelAt } from "../laban/overlays";
import { Plate, Rig } from "../laban3/rig";

// Laban — Part 5: 1936 and exile. 30 fps. Photos only (the owner's AI reconstructions), with still
// movement, speed ramps, whip pans, split screens and torn-paper cuts. Names are never placed on a
// face: the reconstructions are not likenesses of real people.
export const LEN5 = {
  e01: 210,
  e02: 240,
  e03: 180,
  e04: 210,
  e05: 240,
  e06: 75,
  e07: 210,
  e08: 150,
  e09: 180,
  e10: 180,
  e11: 210,
};

const img = (n: number) => `laban5/e${String(n).padStart(2, "0")}.jpg`;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const SHADE =
  "linear-gradient(0deg, rgba(8,4,2,0.88) 0%, rgba(8,4,2,0.5) 20%, rgba(8,4,2,0) 40%)";
const TOP_SHADE =
  "linear-gradient(180deg, rgba(8,4,2,0.75) 0%, rgba(8,4,2,0.35) 20%, rgba(8,4,2,0) 40%)";
const PERIOD = "grayscale(0.35) sepia(0.25) contrast(1.08)";
const COLD = "grayscale(0.85) contrast(1.2) brightness(0.85)";

// 01 — "In 1936, Laban was preparing a huge work for the cultural program surrounding the Berlin
// Olympics." Tight on the sign, speed-ramped pull-back to the square; whip into the rehearsal.
export const E01Olympics: React.FC = () => (
  <Finish dust={0.3}>
    <Sequence durationInFrames={112}>
      <Rig
        keys={[
          { f: 0, s: 1.65, x: 470, y: 520 },
          { f: 26, s: 1.6, x: 480, y: 520, e: "drift" },
          { f: 62, s: 1.04, x: 960, y: 540, e: "ramp" },
          { f: 112, s: 1.0, x: 960, y: 540, e: "drift" },
        ]}
        whipOut={1}
      >
        <Plate src={img(1)} filter={PERIOD} />
      </Rig>
      <AbsoluteFill style={{ background: TOP_SHADE }} />
      <LabelAt
        text="The Berlin Olympics"
        start={64}
        x={1040}
        y={70}
        size={56}
      />
    </Sequence>
    <Sequence from={112}>
      <Rig
        keys={[
          { f: 0, s: 1.08, x: 960, y: 560 },
          { f: 98, s: 1.2, x: 960, y: 520, e: "drift" },
        ]}
        whipIn={1}
      >
        <Plate src={img(2)} filter={PERIOD} />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt
        text="for the cultural programme"
        start={10}
        y={790}
        size={44}
      />
      <HeroWord text="a huge work" look="serif" size={170} y={840} start={14} />
    </Sequence>
    <Sfx name="drone" at={0} volume={0.25} />
    <Sfx name="whoosh" at={28} volume={0.5} />
    <Sfx name="hit" at={64} volume={0.35} />
    <Sfx name="whoosh" at={106} volume={0.55} />
    <Sfx name="hit" at={126} volume={0.35} />
  </Finish>
);

// 02 — "Its title was Vom Tauwind und der Neuen Freude – From the Spring Wind and the New Joy."
// Drift along the title on the design sheet, then torn into a split: spring wind | new joy.
export const E02Title: React.FC = () => (
  <Finish dust={0.4}>
    <Rig
      keys={[
        { f: 0, s: 1.45, x: 1020, y: 300 },
        { f: 126, s: 1.38, x: 1250, y: 330, e: "drift" },
      ]}
    >
      <Plate src={img(6)} filter="sepia(0.15) contrast(1.05)" />
    </Rig>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 55% 40%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
      }}
    />
    <TornReveal at={124} seed="tauwind">
      <SplitPanels
        panels={[
          {
            start: 0,
            node: (
              <Still
                src={img(3)}
                from={{ s: 1.12, x: 4 }}
                to={{ s: 1.2, x: 1 }}
                grade={GRADES.sepiaGold}
              />
            ),
            label: (
              <PanelLabel thin="from the" heavy="spring wind" heavySize={92} />
            ),
          },
          {
            start: 40,
            node: (
              <Still
                src={img(2)}
                from={{ s: 1.2, y: 3 }}
                to={{ s: 1.12 }}
                grade={GRADES.sepiaGold}
              />
            ),
            label: <PanelLabel thin="and the" heavy="new joy" />,
          },
        ]}
      />
    </TornReveal>
    <Sfx name="drone" at={0} volume={0.25} />
    <Sfx name="whoosh" at={120} volume={0.55} />
    <Sfx name="hit" at={130} volume={0.3} />
    <Sfx name="whoosh" at={160} volume={0.5} />
    <Sfx name="hit" at={170} volume={0.3} />
  </Finish>
);

// 03 — "More than a thousand dancers were involved." Speed-ramped pull-back from one dancer to all.
export const E03Thousand: React.FC = () => {
  const frame = useCurrentFrame();
  const dim = interpolate(frame, [50, 64], [0, 0.4], clamp);
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 2.1, x: 700, y: 470 },
          { f: 20, s: 2.05, x: 700, y: 470, e: "drift" },
          { f: 54, s: 1.02, x: 960, y: 540, e: "ramp" },
          { f: 180, s: 1.0, x: 960, y: 540, e: "drift" },
        ]}
      >
        <Plate src={img(2)} filter={PERIOD} />
      </Rig>
      <AbsoluteFill style={{ backgroundColor: `rgba(6,4,6,${dim})` }} />
      <CaptionAt text="more than" start={56} y={300} size={50} />
      <HeroWord text="1,000" look="heavy" size={280} y={360} start={58} />
      <CaptionAt text="dancers" start={68} y={660} size={50} />
      <Sfx name="riser" at={16} volume={0.3} />
      <Sfx name="whoosh" at={26} volume={0.55} />
      <Sfx name="boom" at={58} volume={0.5} />
      <Sfx name="whoosh" at={172} volume={0.5} />
    </Finish>
  );
};

// 04 — "Then Joseph Goebbels attended a rehearsal." Whip in; cold, slow push into the watchers.
export const E04Rehearsal: React.FC = () => (
  <Finish dust={0.3}>
    <Rig
      keys={[
        { f: 0, s: 1.04, x: 900, y: 520 },
        { f: 210, s: 1.24, x: 860, y: 440, e: "drift" },
      ]}
      whipIn={1}
    >
      <Plate src={img(4)} filter={COLD} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <LabelAt text="The rehearsal" start={18} y={930} size={60} />
    <Sfx name="whoosh" at={0} volume={0.5} />
    <Sfx name="drone" at={4} volume={0.35} />
    <Sfx name="hit" at={18} volume={0.3} />
  </Finish>
);

// 05 — "The work was rejected. The production was cancelled. And Laban's position collapsed."
// Three hard beats, each on its own shot.
export const E05Collapse: React.FC = () => {
  const frame = useCurrentFrame();
  const shake =
    frame >= 80 && frame < 96
      ? Math.sin(frame * 3.1) * 8 * (1 - (frame - 80) / 16)
      : 0;
  return (
    <Finish dust={0.3}>
      <Sequence durationInFrames={80}>
        <Still
          src={img(5)}
          from={{ s: 1.05 }}
          to={{ s: 1.22, x: 4, y: 3 }}
          grade={COLD}
          kicks={[2]}
        />
        <AbsoluteFill style={{ background: SHADE }} />
        <HeroWord
          text="Rejected"
          look="heavy"
          size={190}
          color={COLOR.white}
          y={820}
          start={4}
        />
      </Sequence>
      <Sequence from={80} durationInFrames={80}>
        <AbsoluteFill style={{ translate: `${shake}px 0px` }}>
          <Still
            src={img(2)}
            from={{ s: 1.15 }}
            to={{ s: 1.05 }}
            grade={GRADES.bwRose}
            rose
            glitchIn
            kicks={[0]}
          />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: SHADE }} />
        <HeroWord
          text="Cancelled"
          look="heavy"
          size={190}
          color={COLOR.rose}
          y={820}
          start={2}
          glitch
        />
      </Sequence>
      <Sequence from={160}>
        <Still
          src={img(8)}
          from={{ s: 1.12, y: -3, r: 0 }}
          to={{ s: 1.2, y: 2, r: -1.2 }}
          grade={GRADES.bwRose}
          ease={Easing.inOut(Easing.sin)}
        />
        <AbsoluteFill style={{ background: SHADE }} />
        <CaptionAt text="and Laban's position" start={4} y={790} size={46} />
        <HeroWord
          text="collapsed."
          look="serif"
          size={170}
          y={840}
          start={10}
        />
      </Sequence>
      <Sfx name="hit" at={2} volume={0.45} />
      <Sfx name="glitch" at={80} volume={0.4} />
      <Sfx name="boom" at={82} volume={0.5} />
      <Sfx name="whoosh" at={156} volume={0.4} />
      <Sfx name="boom" at={170} volume={0.45} />
    </Finish>
  );
};

// 06 — BLACK SCREEN. TEXT: 1936 – PERFORMANCE CANCELLED. Hold for two seconds.
export const E06Black: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 8], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center", opacity: t }}>
        <div
          style={{
            ...TYPE.headline,
            fontStyle: "normal",
            fontSize: 170,
            lineHeight: 1,
            color: COLOR.white,
          }}
        >
          1936
        </div>
        <div
          style={{
            margin: "34px auto",
            width: 560,
            height: 2,
            background: COLOR.rose,
            boxShadow: `0 0 10px ${COLOR.rose}`,
          }}
        />
        <div
          style={{
            ...TYPE.heavy,
            fontSize: 92,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: COLOR.rose,
          }}
        >
          Performance cancelled
        </div>
      </div>
      <Sequence layout="none">
        <Sfx name="boom" at={0} volume={0.55} />
      </Sequence>
    </AbsoluteFill>
  );
};

// 07 — "After falling from favor, Laban left Germany." Up from black, slow follow on the platform.
export const E07LeftGermany: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Finish dust={0.35}>
      <Rig
        keys={[
          { f: 0, s: 1.12, x: 560, y: 560 },
          { f: 210, s: 1.3, x: 600, y: 540, e: "drift" },
        ]}
        whipOut={1}
      >
        <Plate
          src={img(9)}
          filter="grayscale(0.6) contrast(1.12) brightness(0.92)"
        />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt
        text="after falling from favour"
        start={20}
        x={920}
        y={790}
        size={44}
      />
      <HeroWord
        text="Left Germany"
        look="heavy"
        size={110}
        x={910}
        y={845}
        align="left"
        start={26}
      />
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: interpolate(frame, [0, 16], [1, 0], clamp),
        }}
      />
      <Sfx name="drone" at={0} volume={0.3} />
      <Sfx name="hit" at={28} volume={0.35} />
      <Sfx name="whoosh" at={202} volume={0.55} />
    </Finish>
  );
};

// 08 — "He spent time in Paris and eventually reached England…" Whip in, split: Paris | England.
export const E08ParisEngland: React.FC = () => (
  <Finish dust={0.25}>
    <SplitPanels
      panels={[
        {
          start: 0,
          node: (
            <Still
              src={img(10)}
              from={{ s: 1.08 }}
              to={{ s: 1.18, y: 2 }}
              grade="saturate(0.9) contrast(1.05)"
              whipIn={1}
            />
          ),
          label: <PanelLabel thin="time in" heavy="Paris" />,
        },
        {
          start: 66,
          node: (
            <Still
              src={img(12)}
              from={{ s: 1.15, x: 13 }}
              to={{ s: 1.08, x: 12 }}
              grade="saturate(0.95) contrast(1.05)"
            />
          ),
          label: <PanelLabel thin="eventually" heavy="England" />,
        },
      ]}
    />
    <Sfx name="whoosh" at={0} volume={0.5} />
    <Sfx name="hit" at={8} volume={0.3} />
    <Sfx name="whoosh" at={62} volume={0.55} />
    <Sfx name="hit" at={72} volume={0.35} />
  </Finish>
);

// 09 — "…with help from people including his former student Kurt Jooss and the Dartington network."
export const E09Help: React.FC = () => (
  <Finish dust={0.3}>
    <Rig
      keys={[
        { f: 0, s: 1.05, x: 960, y: 520 },
        { f: 180, s: 1.22, x: 960, y: 470, e: "drift" },
      ]}
    >
      <Plate src={img(11)} filter="grayscale(0.4) sepia(0.2) contrast(1.08)" />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <Sequence durationInFrames={96} layout="none">
      <CaptionAt
        text="with help from his former student"
        start={12}
        y={770}
        size={44}
      />
    </Sequence>
    <Sequence from={100} layout="none">
      <CaptionAt text="and the" start={0} y={770} size={44} />
    </Sequence>
    <HeroWord
      text="Kurt Jooss"
      look="serif"
      size={130}
      y={820}
      start={18}
      end={96}
    />
    <HeroWord
      text="Dartington network"
      look="serif"
      size={120}
      y={830}
      start={98}
    />
    <Sfx name="hit" at={20} volume={0.3} />
    <Sfx name="hit" at={100} volume={0.3} />
  </Finish>
);

// 10 — "His German career was effectively over." The design for the work that never happened,
// draining to black.
export const E10Over: React.FC = () => {
  const frame = useCurrentFrame();
  const drain = interpolate(frame, [20, 150], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  return (
    <Finish dust={0.4}>
      <Rig
        keys={[
          { f: 0, s: 1.4, x: 1150, y: 760 },
          { f: 180, s: 1.55, x: 1100, y: 760, e: "drift" },
        ]}
      >
        <Plate
          src={img(6)}
          filter={`sepia(${0.2 * (1 - drain)}) grayscale(${drain}) brightness(${1 - 0.45 * drain})`}
        />
      </Rig>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) ${45 - 30 * drain}%, rgba(0,0,0,0.92) 100%)`,
        }}
      />
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt text="his German career was" start={14} y={790} size={46} />
      <HeroWord
        text="effectively over."
        look="serif"
        size={160}
        y={840}
        start={20}
      />
      <Sfx name="drone" at={0} volume={0.3} />
      <Sfx name="hit" at={22} volume={0.3} />
    </Finish>
  );
};

// 11 — "But his ideas about movement were only beginning their second life." Warm light, England.
export const E11SecondLife: React.FC = () => (
  <Finish dust={0.35}>
    <Rig
      keys={[
        { f: 0, s: 1.05, x: 900, y: 560 },
        { f: 210, s: 1.22, x: 980, y: 470, e: "drift" },
      ]}
    >
      <Plate
        src={img(12)}
        filter="saturate(1.12) contrast(1.05) brightness(1.04) sepia(0.12)"
      />
    </Rig>
    <LightLeak strength={0.6} />
    <AbsoluteFill style={{ background: SHADE }} />
    <CaptionAt
      text="his ideas about movement were only beginning their"
      start={16}
      y={790}
      size={42}
    />
    <HeroWord text="second life." look="serif" size={170} y={840} start={26} />
    <Sfx name="riser" at={6} volume={0.25} />
    <Sfx name="hit" at={28} volume={0.3} />
  </Finish>
);
