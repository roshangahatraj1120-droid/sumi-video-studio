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

// Laban — Part 6: Britain, wartime factories, Laban-Lawrence Industrial Rhythm. 30 fps.
// Photos only, with still movement, speed ramps, whip pans, split screens and torn cuts.
export const LEN6 = {
  f01: 180,
  f02: 240,
  f03: 240,
  f04: 240,
  f05: 210,
  f06: 300,
  f07: 300,
  f08: 270,
  f09: 300,
  f10: 270,
};

const img = (n: number) => `laban6/f0${n}.jpg`;
const old = (n: string) => `laban/${n}.jpg`;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const SHADE =
  "linear-gradient(0deg, rgba(8,4,2,0.88) 0%, rgba(8,4,2,0.5) 20%, rgba(8,4,2,0) 40%)";
const FACTORY = "contrast(1.08) saturate(0.92)";
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

// 01 — "In Britain, Laban's work took an unexpected turn."
export const F01Britain: React.FC = () => (
  <Finish dust={0.3}>
    <Still
      src="laban5/e12.jpg"
      from={{ s: 1.06, x: 2 }}
      to={{ s: 1.18, x: -1, y: -2 }}
      grade="saturate(1.05) contrast(1.05)"
      whipOut={1}
    />
    <AbsoluteFill style={{ background: SHADE }} />
    <LabelAt text="Britain" start={10} y={760} size={60} />
    <HeroWord
      text="an unexpected turn."
      look="serif"
      size={150}
      x={110}
      y={830}
      align="left"
      start={36}
    />
    <Sfx name="drone" at={0} volume={0.25} />
    <Sfx name="hit" at={12} volume={0.3} />
    <Sfx name="whoosh" at={172} volume={0.55} />
  </Finish>
);

// 02 — "During the Second World War, industrial production was under enormous pressure."
export const F02Pressure: React.FC = () => {
  const frame = useCurrentFrame();
  const shake =
    frame > 150 && frame < 190
      ? Math.sin(frame * 2.7) * 5 * (1 - (frame - 150) / 40)
      : 0;
  return (
    <Finish dust={0.3}>
      <Sequence durationInFrames={110}>
        <Still
          src={img(7)}
          from={{ s: 1.02 }}
          to={{ s: 1.12, y: 1 }}
          grade="contrast(1.1)"
          whipIn={1}
          whipOut={1}
        />
      </Sequence>
      <Sequence from={110}>
        <AbsoluteFill style={{ translate: `${shake}px 0px` }}>
          <Rig
            keys={[
              { f: 0, s: 1.02, x: 960, y: 540 },
              { f: 30, s: 1.06, x: 940, y: 540, e: "drift" },
              { f: 46, s: 1.55, x: 520, y: 520, e: "ramp" },
              { f: 130, s: 1.62, x: 540, y: 520, e: "drift" },
            ]}
            whipIn={1}
          >
            <Plate src={img(1)} filter={FACTORY} />
          </Rig>
        </AbsoluteFill>
        <AbsoluteFill style={{ background: SHADE }} />
        <CaptionAt
          text="industrial production under"
          start={40}
          y={790}
          size={44}
        />
        <HeroWord
          text="Enormous pressure"
          look="heavy"
          size={140}
          y={840}
          start={46}
        />
      </Sequence>
      <Sfx name="boom" at={4} volume={0.45} />
      <Sfx name="whoosh" at={104} volume={0.55} />
      <Sfx name="riser" at={130} volume={0.3} />
      <Sfx name="whoosh" at={148} volume={0.5} />
      <Sfx name="hit" at={156} volume={0.45} />
    </Finish>
  );
};

// 03 — "With management consultant F. C. Lawrence, Laban developed an approach usually described as
// Laban-Lawrence Industrial Rhythm." The observers, then a title plate.
export const F03Approach: React.FC = () => {
  const frame = useCurrentFrame();
  const plate = interpolate(frame, [120, 142], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const line = interpolate(frame, [150, 172], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <Finish dust={0.35}>
      <Rig
        keys={[
          { f: 0, s: 1.05, x: 900, y: 520 },
          { f: 240, s: 1.25, x: 700, y: 420, e: "drift" },
        ]}
      >
        <Plate src={img(2)} filter={FACTORY} />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence durationInFrames={118} layout="none">
        <CaptionAt
          text="with management consultant"
          start={14}
          y={850}
          x={124}
          size={42}
        />
        <LabelAt text="F. C. Lawrence" start={20} y={900} size={64} />
      </Sequence>
      <AbsoluteFill
        style={{ backgroundColor: `rgba(10,5,12,${0.74 * plate})` }}
      />
      <HeroWord
        text="Laban–Lawrence"
        look="serif"
        size={130}
        y={350}
        start={128}
      />
      <div
        style={{
          position: "absolute",
          left: 960 - 340 * line,
          width: 680 * line,
          top: 520,
          height: 2.5,
          background: COLOR.gold,
          boxShadow: `0 0 10px ${COLOR.gold}`,
        }}
      />
      <HeroWord
        text="Industrial rhythm"
        look="heavy"
        size={120}
        y={555}
        start={150}
        color={COLOR.white}
      />
      <Sfx name="drone" at={0} volume={0.25} />
      <Sfx name="hit" at={22} volume={0.3} />
      <Sfx name="riser" at={100} volume={0.25} />
      <Sfx name="boom" at={130} volume={0.5} />
      <Sfx name="hit" at={152} volume={0.35} />
    </Finish>
  );
};

// 04 — "They studied how workers moved – not dancers, but people performing repetitive industrial labor."
export const F04Workers: React.FC = () => (
  <Finish dust={0.3}>
    <Rig
      keys={[
        { f: 0, s: 1.08, x: 1000, y: 540 },
        { f: 110, s: 1.2, x: 1080, y: 520, e: "drift" },
      ]}
    >
      <Plate src={old("19")} filter="grayscale(1) contrast(1.15)" />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <CaptionAt text="they studied" start={10} y={790} size={44} />
    <HeroWord
      text="how workers moved"
      look="serif"
      size={140}
      y={840}
      start={16}
    />
    <TornReveal at={104} seed="workers">
      <SplitPanels
        panels={[
          {
            start: 0,
            node: (
              <Still
                src={old("07")}
                from={{ s: 1.1, x: 18 }}
                to={{ s: 1.18, x: 19 }}
                grade="grayscale(1) contrast(1.1) brightness(0.7)"
              />
            ),
            label: <PanelLabel thin="not" heavy="dancers" />,
          },
          {
            start: 30,
            node: (
              <Still
                src={img(3)}
                from={{ s: 1.2, x: 4 }}
                to={{ s: 1.1, x: 2 }}
                grade={FACTORY}
              />
            ),
            label: (
              <PanelLabel thin="but" heavy="industrial labour" heavySize={70} />
            ),
          },
        ]}
      />
    </TornReveal>
    <Sfx name="drone" at={0} volume={0.25} />
    <Sfx name="hit" at={18} volume={0.3} />
    <Sfx name="whoosh" at={100} volume={0.55} />
    <Sfx name="whoosh" at={130} volume={0.5} />
    <Sfx name="hit" at={140} volume={0.35} />
  </Finish>
);

// 05 — "The idea was not simply 'move faster.'" Stopwatch, a jittery fast-forward ramp, then the brakes.
export const F05Faster: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [118, 130], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const pulse = (f0: number) => [
    { f: f0, s: 1.42, x: 520, y: 470, e: "ramp" as const },
    { f: f0 + 6, s: 1.32, x: 1320, y: 300, e: "ramp" as const },
  ];
  return (
    <Finish dust={0.3}>
      <Sequence durationInFrames={56}>
        <Rig
          keys={[
            { f: 0, s: 1.75, x: 819, y: 520 },
            { f: 56, s: 1.9, x: 819, y: 530, e: "drift" },
          ]}
          whipOut={1}
        >
          <Plate src={img(2)} filter={FACTORY} />
        </Rig>
      </Sequence>
      <Sequence from={56}>
        <Rig
          keys={[
            { f: 0, s: 1.3, x: 960, y: 500 },
            ...pulse(6),
            ...pulse(18),
            ...pulse(30),
            ...pulse(42),
            { f: 70, s: 1.12, x: 960, y: 520, e: "ramp" },
            { f: 154, s: 1.06, x: 960, y: 540, e: "drift" },
          ]}
          whipIn={1}
        >
          <Plate src={img(3)} filter={FACTORY} />
        </Rig>
      </Sequence>
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt text="the idea was not simply" start={60} y={720} size={46} />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 815,
          textAlign: "center",
          opacity: ease(frame, 64, 72),
        }}
      >
        <span
          style={{
            position: "relative",
            ...TYPE.heavy,
            fontSize: 150,
            lineHeight: 1,
            textTransform: "uppercase",
            color: COLOR.white,
            textShadow: "0 6px 26px rgba(0,0,0,0.85)",
          }}
        >
          “Move faster”
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
      {Array.from({ length: 8 }).map((_, i) => (
        <Sfx key={i} name="tick" at={i * 7} volume={0.35} />
      ))}
      <Sfx name="whoosh" at={50} volume={0.55} />
      {[62, 74, 86, 98].map((f) => (
        <Sfx key={f} name="hit" at={f} volume={0.25} />
      ))}
      <Sfx name="glitch" at={120} volume={0.35} />
      <Sfx name="boom" at={124} volume={0.4} />
    </Finish>
  );
};

// 06 — "Laban was interested in rhythm, effort, fatigue and how the whole body could organize
// physical work more efficiently." Speed-ramped hops across the motion study, one word per stop.
const STOPS = [
  { at: 0, word: "Rhythm", k: { s: 1.9, x: 520, y: 260 } },
  { at: 62, word: "Effort", k: { s: 1.8, x: 1480, y: 520 } },
  { at: 124, word: "Fatigue", k: { s: 1.8, x: 440, y: 560 } },
];
export const F06Effort: React.FC = () => (
  <Finish dust={0.3}>
    <Rig
      keys={[
        ...STOPS.flatMap((s, i) => [
          { f: s.at + (i === 0 ? 0 : 14), ...s.k, e: "ramp" as const },
          { f: s.at + 58, ...s.k, s: s.k.s + 0.06, e: "drift" as const },
        ]),
        { f: 200, s: 1.04, x: 960, y: 540, e: "ramp" },
        { f: 300, s: 1.0, x: 960, y: 540, e: "drift" },
      ]}
    >
      <Plate src={img(6)} filter={FACTORY} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    {STOPS.map((s, i) => (
      <HeroWord
        key={s.word}
        text={s.word}
        look="heavy"
        size={170}
        color={i === 2 ? COLOR.rose : COLOR.gold}
        y={820}
        start={s.at + 16}
        end={(STOPS[i + 1]?.at ?? 186) + 12}
      />
    ))}
    <Sequence from={204} layout="none">
      <CaptionAt
        text="how the whole body could organise work"
        start={0}
        y={790}
        size={44}
      />
    </Sequence>
    <HeroWord
      text="more efficiently"
      look="serif"
      size={140}
      y={840}
      start={210}
    />
    {STOPS.map((s) => (
      <React.Fragment key={s.at}>
        <Sfx name="whoosh" at={Math.max(0, s.at)} volume={0.45} />
        <Sfx name="hit" at={s.at + 16} volume={0.35} />
      </React.Fragment>
    ))}
    <Sfx name="whoosh" at={190} volume={0.5} />
    <Sfx name="hit" at={212} volume={0.3} />
  </Finish>
);

// 07 — the slogan, set in type: "To bring that swing and lilt in labour, which makes efficiency a pleasure."
const QUOTE: { w: string; gold?: boolean }[][] = [
  [{ w: "To" }, { w: "bring" }, { w: "that" }, { w: "swing", gold: true }],
  [{ w: "and" }, { w: "lilt", gold: true }, { w: "in" }, { w: "labour," }],
  [{ w: "which" }, { w: "makes" }, { w: "efficiency" }],
  [{ w: "a" }, { w: "pleasure.”" }],
];
export const F07Quote: React.FC = () => {
  const frame = useCurrentFrame();
  let n = 0;
  const attrib = ease(frame, 170, 190);
  return (
    <Finish dust={0.4}>
      <Rig
        keys={[
          { f: 0, s: 1.12, x: 900, y: 540 },
          { f: 300, s: 1.22, x: 1020, y: 520, e: "drift" },
        ]}
      >
        <Plate
          src={img(1)}
          filter="contrast(1.05) saturate(0.8) brightness(0.75)"
        />
      </Rig>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 50%, rgba(8,4,8,0.82), rgba(8,4,8,0.45) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 230,
          textAlign: "center",
        }}
      >
        <div
          style={{
            ...TYPE.headline,
            fontSize: 200,
            lineHeight: 0.6,
            color: COLOR.gold,
            opacity: ease(frame, 4, 16),
            height: 80,
          }}
        >
          “
        </div>
        {QUOTE.map((line, li) => (
          <div
            key={li}
            style={{
              ...TYPE.headline,
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: 104,
              lineHeight: 1.22,
              color: COLOR.white,
            }}
          >
            {line.map((word, wi) => {
              const t0 = 14 + n++ * 7;
              const t = ease(frame, t0, t0 + 16);
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    marginRight: 26,
                    opacity: t,
                    filter: `blur(${(1 - t) * 10}px)`,
                    translate: `0px ${(1 - t) * 24}px`,
                    color: word.gold ? COLOR.gold : undefined,
                    fontStyle: word.gold ? "italic" : "normal",
                    textShadow: word.gold
                      ? `0 0 26px ${COLOR.gold}88`
                      : "0 4px 20px rgba(0,0,0,0.8)",
                  }}
                >
                  {word.w}
                </span>
              );
            })}
          </div>
        ))}
        <div
          style={{
            marginTop: 40,
            opacity: attrib,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
          }}
        >
          <div
            style={{ width: 70 * attrib, height: 1.5, background: COLOR.gold }}
          />
          <div
            style={{
              ...TYPE.label,
              fontSize: 24,
              letterSpacing: "0.32em",
              color: COLOR.gold,
            }}
          >
            Laban–Lawrence Industrial Rhythm
          </div>
          <div
            style={{ width: 70 * attrib, height: 1.5, background: COLOR.gold }}
          />
        </div>
      </div>
      <Sfx name="drone" at={0} volume={0.3} />
      <Sfx name="hit" at={42} volume={0.25} />
      <Sfx name="hit" at={56} volume={0.25} />
      <Sfx name="riser" at={140} volume={0.2} />
    </Finish>
  );
};

// 08 — "Think about that transformation. A movement system developed inside modern dance had now
// become a way of analyzing industrial labor."
export const F08Transformation: React.FC = () => (
  <Finish dust={0.35}>
    <Rig
      keys={[
        { f: 0, s: 1.05, x: 960, y: 560 },
        { f: 100, s: 1.2, x: 1100, y: 520, e: "drift" },
      ]}
    >
      <Plate src={old("12")} filter={GRADES.sepiaGold} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <CaptionAt text="think about that" start={10} y={790} size={46} />
    <HeroWord
      text="transformation."
      look="serif"
      size={160}
      y={840}
      start={16}
    />
    <TornReveal at={96} seed="transform">
      <SplitPanels
        panels={[
          {
            start: 0,
            node: (
              <Still
                src={old("03")}
                from={{ s: 1.15 }}
                to={{ s: 1.25 }}
                grade={GRADES.sepiaGold}
              />
            ),
            label: (
              <PanelLabel thin="inside" heavy="modern dance" heavySize={88} />
            ),
          },
          {
            start: 50,
            node: (
              <Still
                src={img(1)}
                from={{ s: 1.22, x: 6 }}
                to={{ s: 1.12, x: 4 }}
                grade={FACTORY}
              />
            ),
            label: (
              <PanelLabel
                thin="analysing"
                heavy="industrial labour"
                heavySize={80}
              />
            ),
          },
        ]}
      />
    </TornReveal>
    <Sfx name="drone" at={0} volume={0.25} />
    <Sfx name="hit" at={18} volume={0.3} />
    <Sfx name="whoosh" at={92} volume={0.55} />
    <Sfx name="whoosh" at={142} volume={0.55} />
    <Sfx name="hit" at={152} volume={0.35} />
  </Finish>
);

// 09 — "The body was no longer only something that performed. It was something that could be
// observed, classified and optimized." Performer → whip → the analysed worker, three hits.
const VERBS = [
  { at: 112, word: "Observed", k: { s: 1.5, x: 560, y: 430 } },
  { at: 168, word: "Classified", k: { s: 1.5, x: 1380, y: 470 } },
  { at: 224, word: "Optimised", k: { s: 1.06, x: 960, y: 540 } },
];
export const F09Optimised: React.FC = () => (
  <Finish dust={0.3}>
    <Sequence durationInFrames={100}>
      <Still
        src={old("07")}
        from={{ s: 1.05, x: 2 }}
        to={{ s: 1.15 }}
        grade={GRADES.sepiaGold}
        whipOut={1}
      />
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt
        text="no longer only something that"
        start={8}
        y={790}
        size={44}
      />
      <HeroWord text="performed" look="serif" size={160} y={840} start={14} />
    </Sequence>
    <Sequence from={100}>
      <Rig
        keys={[
          { f: 0, s: 1.25, x: 960, y: 520 },
          ...VERBS.flatMap((v) => [
            { f: v.at - 100 + 2, ...v.k, e: "ramp" as const },
            {
              f: v.at - 100 + 50,
              ...v.k,
              s: v.k.s + 0.05,
              e: "drift" as const,
            },
          ]),
        ]}
        whipIn={1}
      >
        <Plate src={img(6)} filter={FACTORY} />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
    </Sequence>
    {VERBS.map((v, i) => (
      <HeroWord
        key={v.word}
        text={v.word}
        look="heavy"
        size={170}
        color={i === 2 ? COLOR.gold : COLOR.white}
        y={820}
        start={v.at + 4}
        end={VERBS[i + 1]?.at}
      />
    ))}
    <Sfx name="whoosh" at={94} volume={0.55} />
    {VERBS.map((v) => (
      <Sfx key={v.at} name="boom" at={v.at + 4} volume={0.4} />
    ))}
  </Finish>
);

// 10 — VISUAL: split screen, factory arm movement | dancer arm movement, with their motion paths.
// The supplied image already carries both panels and paths; each side is revealed in turn.
export const F10ArmPaths: React.FC = () => {
  const frame = useCurrentFrame();
  const leftIn = interpolate(frame, [6, 26], [50, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const rightIn = interpolate(frame, [70, 92], [50, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const sweep = interpolate(frame, [110, 200], [-20, 120], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  return (
    <Finish dust={0.25}>
      <AbsoluteFill style={{ backgroundColor: "#06040a" }} />
      <Rig
        keys={[
          { f: 0, s: 1.0, x: 960, y: 560 },
          { f: 270, s: 1.02, x: 960, y: 560, e: "drift" },
        ]}
      >
        <AbsoluteFill style={{ clipPath: `inset(0 ${50 + leftIn}% 0 ${0}%)` }}>
          <Plate src={img(5)} />
        </AbsoluteFill>
        <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${50 + rightIn}%)` }}>
          <Plate src={img(5)} />
        </AbsoluteFill>
      </Rig>
      {/* a soft light passing over the paths once both sides are up */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(100deg, rgba(255,240,210,0) ${sweep - 10}%, rgba(255,240,210,0.16) ${sweep}%, rgba(255,240,210,0) ${sweep + 10}%)`,
          mixBlendMode: "screen",
        }}
      />
      <Sfx name="whoosh" at={4} volume={0.5} />
      <Sfx name="hit" at={24} volume={0.3} />
      <Sfx name="whoosh" at={68} volume={0.5} />
      <Sfx name="hit" at={90} volume={0.3} />
      <Sfx name="riser" at={110} volume={0.2} />
    </Finish>
  );
};
