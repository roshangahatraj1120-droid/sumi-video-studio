import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { COLOR, FONT, TYPE } from "../brand/tokens";
import { HeroWord, PanelLabel, ScrambleWord, SplitPanels } from "../brand/fx";
import { GRADES, Still } from "../cine/Still";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt } from "../laban/overlays";
import { Plate, Rig } from "../laban3/rig";
import { LightSweep } from "../laban9/fx9";
import { AlphabetScene, Disintegrate } from "./fx10";

// Laban — Part 10: the legacy (closing). 30 fps. Built from the earlier chapters' photos as a recap,
// plus two pieces of motion design: the dancer dissolving into dust, and one alphabet writing both a
// love letter and a military order. Clips 10 and 11 carry no sound at all (the script's silent beat).
export const LEN10 = {
  j01: 200,
  j02: 270,
  j03: 240,
  j04: 210,
  j05: 240,
  j06: 240,
  j07: 270,
  j08: 270,
  j09: 250,
  j10: 330,
  j11: 210,
  j12: 300,
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const SHADE =
  "linear-gradient(0deg, rgba(10,6,4,0.85) 0%, rgba(10,6,4,0.45) 20%, rgba(10,6,4,0) 40%)";
const WARM = "sepia(0.12) saturate(1.04) contrast(1.05)";
const COOL = "saturate(0.85) contrast(1.08) hue-rotate(-6deg)";
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

// 01 — "So here is what makes Rudolf Laban's story so fascinating to me."
export const J01Fascinating: React.FC = () => (
  <Finish dust={0.3}>
    <Rig
      keys={[
        { f: 0, s: 1.04, x: 1100, y: 520 },
        { f: 200, s: 1.2, x: 1220, y: 470, e: "drift" },
      ]}
    >
      <Plate src="laban/01.jpg" filter={WARM} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <LightSweep at={20} dur={110} strength={0.14} />
    <CaptionAt
      text="here is what makes Rudolf Laban's story"
      start={14}
      y={790}
      size={42}
    />
    <HeroWord
      text="so fascinating."
      look="serif"
      size={150}
      y={840}
      start={22}
    />
    <Sfx name="drone" at={0} volume={0.22} />
    <Sfx name="hit" at={24} volume={0.25} />
  </Finish>
);

// 02 — "He began with an artistic problem: movement disappears. A performance exists in time, and then
// it is gone." The leaping dancer burns away into dust, leaving the empty studio.
export const J02Disappears: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [112, 222], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  return (
    <Finish dust={0.35}>
      <Rig
        keys={[
          { f: 0, s: 1.06, x: 960, y: 520 },
          { f: 270, s: 1.16, x: 980, y: 500, e: "drift" },
        ]}
      >
        <Plate src="laban10/dancer-plate.jpg" filter={WARM} />
        <Disintegrate
          src="laban10/dancer-cut.png"
          p={p}
          box={[560, 40, 960, 860]}
          style={{ filter: WARM }}
        />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence durationInFrames={104} layout="none">
        <CaptionAt
          text="he began with an artistic problem"
          start={10}
          y={790}
          size={42}
        />
        <HeroWord
          text="movement disappears"
          look="serif"
          size={140}
          y={840}
          start={20}
        />
      </Sequence>
      <Sequence from={110} durationInFrames={90} layout="none">
        <CaptionAt
          text="a performance exists in time"
          start={0}
          y={880}
          size={46}
        />
      </Sequence>
      <HeroWord
        text="and then it is gone."
        look="serif"
        size={140}
        y={840}
        start={204}
        evaporate
      />
      <Sfx name="drone" at={0} volume={0.22} />
      <Sfx name="hit" at={22} volume={0.25} />
      <Sfx name="riser" at={100} volume={0.25} />
      <Sfx name="whoosh" at={150} volume={0.3} />
    </Finish>
  );
};

// 03 — "His answer was to make movement legible. To turn the body into something that could be recorded."
export const J03Legible: React.FC = () => (
  <Finish dust={0.3}>
    <Sequence durationInFrames={124}>
      <Rig
        keys={[
          { f: 0, s: 1.08, x: 1100, y: 480 },
          { f: 124, s: 1.3, x: 1260, y: 430, e: "drift" },
        ]}
        whipOut={1}
      >
        <Plate src="laban/12.jpg" filter={WARM} />
      </Rig>
      <LightSweep at={10} dur={90} strength={0.18} />
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt text="his answer: make movement" start={8} y={790} size={44} />
      <HeroWord text="legible." look="serif" size={160} y={840} start={16} />
    </Sequence>
    <Sequence from={124}>
      <Rig
        keys={[
          { f: 0, s: 1.14, x: 760, y: 560 },
          { f: 116, s: 1.04, x: 960, y: 540, e: "smooth" },
        ]}
        whipIn={1}
      >
        <Plate src="laban3/l6.jpg" />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt
        text="to turn the body into something that could be"
        start={6}
        y={790}
        size={42}
      />
      <HeroWord text="recorded." look="serif" size={160} y={840} start={14} />
    </Sequence>
    <Sfx name="hit" at={18} volume={0.25} />
    <Sfx name="whoosh" at={118} volume={0.5} />
    <Sfx name="hit" at={140} volume={0.3} />
  </Finish>
);

// 04 — "But once movement became information, that information did not stay inside dance. It traveled."
export const J04Information: React.FC = () => (
  <Finish dust={0.3}>
    <Rig
      keys={[
        { f: 0, s: 1.3, x: 800, y: 520 },
        { f: 210, s: 1.45, x: 900, y: 500, e: "drift" },
      ]}
      whipOut={1}
    >
      <Plate src="laban2/r6.jpg" filter={`${WARM} brightness(0.7)`} />
    </Rig>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(10,6,4,0.35), rgba(10,6,4,0.85) 80%)",
      }}
    />
    <CaptionAt text="once movement became" start={8} y={360} size={46} />
    <ScrambleWord text="Information" start={16} size={150} y={420} x={530} />
    <Sequence from={120} layout="none">
      <CaptionAt
        text="it did not stay inside dance."
        start={0}
        y={680}
        size={46}
      />
    </Sequence>
    <HeroWord
      text="It travelled."
      look="serif"
      size={120}
      y={740}
      start={150}
    />
    {Array.from({ length: 11 }).map((_, i) => (
      <Sfx key={i} name="tick" at={Math.round(20 + i * 2.6)} volume={0.22} />
    ))}
    <Sfx name="hit" at={50} volume={0.35} />
    <Sfx name="whoosh" at={200} volume={0.55} />
  </Finish>
);

// 05 — "Into archives. Factories. Corporate offices. Hospitals. Anthropology. Military analysis."
// A numbered recap of the earlier chapters, warm to cold, cut on the beat.
const STOPS = [
  { src: "laban7/g03.jpg", word: "Archives", grade: WARM },
  { src: "laban6/f01.jpg", word: "Factories", grade: WARM },
  {
    src: "laban8/h03.jpg",
    word: "Corporate offices",
    grade: "saturate(0.85) contrast(1.05)",
  },
  { src: "laban9/i04.jpg", word: "Hospitals", grade: WARM },
  { src: "laban9/i07.jpg", word: "Anthropology", grade: WARM },
  {
    src: "laban8/h05.jpg",
    word: "Military analysis",
    grade: `${COOL} grayscale(0.5)`,
  },
];
const SHOT = 36;
export const J05Montage: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Finish dust={0.25}>
      {STOPS.map((s, i) => {
        const last = i === STOPS.length - 1;
        return (
          <Sequence
            key={s.src}
            from={i * SHOT}
            durationInFrames={last ? 240 - i * SHOT : SHOT}
          >
            <Still
              src={s.src}
              from={{ s: i % 2 ? 1.2 : 1.06 }}
              to={{ s: i % 2 ? 1.08 : 1.2 }}
              grade={s.grade}
              glitchIn={i > 0 && i % 2 === 1}
              whipIn={i > 0 && i % 2 === 0 ? 1 : 0}
              kicks={[0]}
            />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ background: SHADE }} />
      {STOPS.map((s, i) => {
        const at = i * SHOT;
        const end = i === STOPS.length - 1 ? 240 : at + SHOT;
        if (frame < at || frame >= end) return null;
        const t = ease(frame, at + 2, at + 10);
        return (
          <div
            key={s.word}
            style={{ position: "absolute", left: 110, top: 800, opacity: t }}
          >
            <div
              style={{
                ...TYPE.label,
                fontSize: 24,
                letterSpacing: "0.3em",
                color: COLOR.gold,
              }}
            >
              {`0${i + 1} / 06`}
            </div>
            <div
              style={{
                ...TYPE.heavy,
                fontSize: 120,
                lineHeight: 1,
                textTransform: "uppercase",
                color: i === 5 ? COLOR.rose : COLOR.white,
                translate: `${(1 - t) * 30}px 0px`,
                textShadow: "0 6px 26px rgba(0,0,0,0.85)",
              }}
            >
              {s.word}
            </div>
          </div>
        );
      })}
      {STOPS.map((_, i) => (
        <React.Fragment key={i}>
          <Sfx name="hit" at={i * SHOT} volume={0.35} />
          <Sfx
            name={i % 2 ? "glitch" : "whoosh"}
            at={Math.max(0, i * SHOT - 2)}
            volume={0.28}
          />
        </React.Fragment>
      ))}
      <Sfx name="boom" at={5 * SHOT} volume={0.5} />
    </Finish>
  );
};

// 06 — "And today, Laban-inspired movement concepts even appear in areas such as robotics and computer
// analysis of human motion."
export const J06Today: React.FC = () => (
  <Finish dust={0.2}>
    <Sequence durationInFrames={110}>
      <Rig
        keys={[
          { f: 0, s: 1.04, x: 960, y: 540 },
          { f: 110, s: 1.18, x: 900, y: 520, e: "drift" },
        ]}
        whipOut={1}
      >
        <Plate src="laban/23.jpg" filter={COOL} />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt
        text="and today, Laban-inspired concepts appear in"
        start={8}
        y={790}
        size={42}
      />
      <HeroWord text="robotics" look="serif" size={150} y={840} start={16} />
    </Sequence>
    <Sequence from={110}>
      <Rig
        keys={[
          { f: 0, s: 1.1, x: 900, y: 540 },
          { f: 20, s: 1.12, x: 920, y: 540, e: "drift" },
          { f: 44, s: 1.6, x: 1520, y: 400, e: "ramp" },
          { f: 130, s: 1.65, x: 1530, y: 400, e: "drift" },
        ]}
        whipIn={1}
      >
        <Plate src="laban/24.jpg" filter={COOL} />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt
        text="and in computer analysis of"
        start={6}
        y={790}
        size={42}
      />
      <HeroWord
        text="human motion"
        look="serif"
        size={150}
        y={840}
        start={14}
      />
    </Sequence>
    <Sfx name="hit" at={18} volume={0.3} />
    <Sfx name="whoosh" at={104} volume={0.5} />
    <Sfx name="whoosh" at={150} volume={0.4} />
    <Sfx name="hit" at={156} volume={0.3} />
  </Finish>
);

// 07 — "The technology changed. The question did not: what can we learn by watching the way a body moves?"
export const J07Question: React.FC = () => {
  const frame = useCurrentFrame();
  const black = interpolate(frame, [112, 136], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const q1 = ease(frame, 150, 176);
  const q2 = ease(frame, 176, 204);
  return (
    <Finish dust={0.25}>
      <SplitPanels
        panels={[
          {
            start: 0,
            node: (
              <Still
                src="laban/12.jpg"
                from={{ s: 1.15 }}
                to={{ s: 1.22 }}
                grade={WARM}
              />
            ),
            label: <PanelLabel thin="then" heavy="paper" />,
          },
          {
            start: 30,
            node: (
              <Still
                src="laban/24.jpg"
                from={{ s: 1.15, x: 6 }}
                to={{ s: 1.08, x: 4 }}
                grade={COOL}
              />
            ),
            label: <PanelLabel thin="now" heavy="sensors" />,
          },
        ]}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(10,6,4,0.75) 0%, rgba(10,6,4,0) 26%)",
        }}
      />
      <Sequence from={40} durationInFrames={72} layout="none">
        <CaptionAt text="the technology changed" start={0} y={70} size={46} />
      </Sequence>
      <AbsoluteFill style={{ backgroundColor: `rgba(8,5,8,${black})` }} />
      <Sequence from={118} durationInFrames={40} layout="none">
        <CaptionAt text="the question did not" start={0} y={460} size={50} />
      </Sequence>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 380,
          textAlign: "center",
        }}
      >
        <div
          style={{
            ...TYPE.headline,
            fontSize: 96,
            lineHeight: 1.2,
            color: COLOR.white,
            opacity: q1,
            filter: `blur(${(1 - q1) * 8}px)`,
          }}
        >
          What can we learn
        </div>
        <div
          style={{
            ...TYPE.headline,
            fontSize: 96,
            lineHeight: 1.2,
            color: COLOR.gold,
            opacity: q2,
            filter: `blur(${(1 - q2) * 8}px)`,
            textShadow: `0 0 26px ${COLOR.gold}55`,
          }}
        >
          by watching the way a body moves?
        </div>
      </div>
      <Sfx name="hit" at={8} volume={0.25} />
      <Sfx name="whoosh" at={26} volume={0.45} />
      <Sfx name="riser" at={110} volume={0.2} />
    </Finish>
  );
};

// 08 — "And maybe that is Laban's most complicated legacy. A system designed partly to preserve something
// beautiful also demonstrated that movement could be measured, classified and used."
export const J08Legacy: React.FC = () => (
  <Finish dust={0.3}>
    <Sequence durationInFrames={120}>
      <Rig
        keys={[
          { f: 0, s: 1.05, x: 760, y: 540 },
          { f: 120, s: 1.22, x: 600, y: 470, e: "drift" },
        ]}
      >
        <Plate src="laban2/r1.jpg" filter={GRADES.sepiaGold} />
      </Rig>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(270deg, rgba(10,6,4,0.8) 0%, rgba(10,6,4,0.35) 35%, rgba(10,6,4,0) 55%)",
        }}
      />
      <CaptionAt
        text="maybe that is Laban's"
        start={10}
        x={1040}
        y={420}
        size={44}
      />
      <HeroWord
        text="most complicated"
        look="serif"
        size={90}
        x={1030}
        y={470}
        align="left"
        start={16}
      />
      <HeroWord
        text="legacy."
        look="serif"
        size={90}
        x={1030}
        y={570}
        align="left"
        start={30}
      />
    </Sequence>
    <Sequence from={120}>
      <SplitPanels
        panels={[
          {
            start: 0,
            node: (
              <Still
                src="laban6/f06.jpg"
                from={{ s: 1.2 }}
                to={{ s: 1.3 }}
                grade={COOL}
              />
            ),
            label: (
              <PanelLabel thin="it could be" heavy="measured" heavySize={80} />
            ),
          },
          {
            start: 30,
            node: (
              <Still
                src="laban8/h02.jpg"
                from={{ s: 1.2, x: 10 }}
                to={{ s: 1.28, x: 12 }}
                grade={COOL}
              />
            ),
            label: <PanelLabel thin="and" heavy="classified" heavySize={78} />,
          },
          {
            start: 60,
            node: (
              <Still
                src="laban/16.jpg"
                from={{ s: 1.15 }}
                to={{ s: 1.25 }}
                grade={GRADES.bwRose}
                rose
              />
            ),
            label: <PanelLabel thin="and" heavy="used" />,
          },
        ]}
      />
    </Sequence>
    <Sfx name="drone" at={0} volume={0.22} />
    <Sfx name="hit" at={18} volume={0.25} />
    <Sfx name="whoosh" at={116} volume={0.5} />
    <Sfx name="whoosh" at={146} volume={0.5} />
    <Sfx name="whoosh" at={176} volume={0.5} />
    <Sfx name="boom" at={186} volume={0.45} />
  </Finish>
);

// 09 — "For creativity. For memory. For healing. For efficiency. And sometimes – for power."
const USES = [
  { src: "laban/03.jpg", w: "creativity", grade: WARM },
  { src: "laban7/g03.jpg", w: "memory", grade: WARM },
  { src: "laban9/i01.jpg", w: "healing", grade: WARM },
  {
    src: "laban6/f03.jpg",
    w: "efficiency",
    grade: "saturate(0.8) contrast(1.08)",
  },
];
const BEAT = 36;
export const J09Uses: React.FC = () => {
  const frame = useCurrentFrame();
  const powerAt = USES.length * BEAT + 14;
  return (
    <Finish dust={0.25}>
      {USES.map((u, i) => (
        <Sequence key={u.w} from={i * BEAT} durationInFrames={BEAT}>
          <Still
            src={u.src}
            from={{ s: 1.08 }}
            to={{ s: 1.2 }}
            grade={u.grade}
            kicks={[0]}
          />
          <AbsoluteFill style={{ background: SHADE }} />
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 820,
              textAlign: "center",
            }}
          >
            <span
              style={{
                ...TYPE.thin,
                fontSize: 60,
                color: COLOR.white,
                letterSpacing: "0.1em",
              }}
            >
              for{" "}
            </span>
            <span
              style={{
                ...TYPE.headline,
                fontSize: 130,
                color: COLOR.gold,
                textShadow: `0 0 24px ${COLOR.gold}66`,
              }}
            >
              {u.w}.
            </span>
          </div>
        </Sequence>
      ))}
      <Sequence from={USES.length * BEAT} durationInFrames={14}>
        <AbsoluteFill style={{ backgroundColor: "#000" }} />
        <CaptionAt text="and sometimes" start={0} y={500} size={48} />
      </Sequence>
      <Sequence from={powerAt}>
        <Still
          src="laban/16.jpg"
          from={{ s: 1.18 }}
          to={{ s: 1.12 }}
          grade="grayscale(1) contrast(1.3) brightness(0.75)"
          kicks={[0]}
        />
        <AbsoluteFill style={{ background: SHADE }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 800,
            textAlign: "center",
            opacity: ease(frame, powerAt, powerAt + 4),
          }}
        >
          <span
            style={{
              ...TYPE.thin,
              fontSize: 64,
              color: COLOR.white,
              letterSpacing: "0.1em",
            }}
          >
            for{" "}
          </span>
          <span
            style={{
              ...TYPE.heavy,
              fontSize: 150,
              color: COLOR.rose,
              textTransform: "uppercase",
              textShadow: `0 0 30px ${COLOR.rose}88`,
            }}
          >
            power.
          </span>
        </div>
      </Sequence>
      {USES.map((_, i) => (
        <Sfx key={i} name="hit" at={i * BEAT} volume={0.32} />
      ))}
      <Sfx name="boom" at={powerAt} volume={0.6} />
    </Finish>
  );
};

// 10 — SILENT. "The same alphabet can write a love letter or a military order."
export const J10Alphabet: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 330], [1, 1.05]);
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.ink }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 22%, rgba(232,194,122,0.12), rgba(13,7,16,0) 70%), radial-gradient(ellipse 60% 45% at 50% 82%, rgba(120,150,190,0.12), rgba(13,7,16,0) 70%)",
        }}
      />
      <AbsoluteFill style={{ scale: String(push) }}>
        <AlphabetScene
          rowY={560}
          love={{
            text: "a love letter",
            at: 40,
            y: 380,
            size: 150,
            font: `italic 700 150px "${FONT.headline}"`,
            tracking: 0,
            style: {
              fontFamily: FONT.headline,
              fontStyle: "italic",
              fontWeight: 700,
            },
            color: COLOR.gold,
            glow: `0 0 26px ${COLOR.gold}66`,
          }}
          order={{
            text: "A MILITARY ORDER",
            at: 170,
            y: 820,
            size: 120,
            font: `900 120px "${FONT.body}"`,
            tracking: 6,
            style: { fontFamily: FONT.body, fontWeight: 900, letterSpacing: 6 },
            color: "#DCE2EA",
            glow: "0 0 18px rgba(160,190,230,0.35)",
          }}
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 620,
          textAlign: "center",
          ...TYPE.label,
          fontSize: 22,
          letterSpacing: "0.5em",
          color: COLOR.white,
          opacity: 0.6 * ease(frame, 10, 30),
        }}
      >
        The same alphabet
      </div>
    </AbsoluteFill>
  );
};

// 11 — SILENT. "Laban's alphabet for movement turned out to have the same problem."
export const J11SameProblem: React.FC = () => (
  <AbsoluteFill>
    <Rig
      keys={[
        { f: 0, s: 1.15, x: 820, y: 540 },
        { f: 210, s: 1.3, x: 900, y: 520, e: "drift" },
      ]}
    >
      <Plate src="laban2/r6.jpg" filter={`${WARM} brightness(0.8)`} />
    </Rig>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, rgba(10,6,4,0.2), rgba(10,6,4,0.85) 85%)",
      }}
    />
    <AbsoluteFill style={{ background: SHADE }} />
    <CaptionAt
      text="Laban's alphabet for movement turned out to have"
      start={14}
      y={790}
      size={42}
    />
    <HeroWord
      text="the same problem."
      look="serif"
      size={150}
      y={840}
      start={26}
    />
  </AbsoluteFill>
);

// 12 — "It was not the language itself that decided what it would become. It was the people who used it."
export const J12People: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [262, 300], [0, 1], clamp);
  return (
    <Finish dust={0.3}>
      <Rig
        keys={[
          { f: 0, s: 1.04, x: 960, y: 540 },
          { f: 300, s: 1.2, x: 980, y: 480, e: "drift" },
        ]}
      >
        <Plate src="laban9/i02.jpg" filter={WARM} />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence durationInFrames={130} layout="none">
        <CaptionAt
          text="it was not the language itself"
          start={14}
          y={790}
          size={44}
        />
        <HeroWord
          text="that decided"
          look="serif"
          size={130}
          y={840}
          start={22}
        />
      </Sequence>
      <Sequence from={136} layout="none">
        <CaptionAt text="it was" start={0} y={790} size={44} />
        <HeroWord
          text="the people who used it."
          look="serif"
          size={140}
          y={840}
          start={8}
        />
      </Sequence>
      <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${fade})` }} />
      <Sfx name="riser" at={120} volume={0.2} />
      <Sfx name="hit" at={146} volume={0.3} />
    </Finish>
  );
};
