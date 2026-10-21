import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { OverlayProps } from "../brand/text";
import { COLOR } from "../brand/tokens";
import {
  HeroWord,
  PanelLabel,
  ScrambleWord,
  SplitPanels,
  TopicTitle,
} from "../brand/fx";
import { GRADES, Still } from "../cine/Still";
import { TornStrip } from "../cine/overlays";
import { FilmLook } from "../scenes/FilmLook";
import * as B from "./broll";
import * as O from "./overlays";
import { MONTAGE_CUTS, MONTAGE_SHOT, SYMBOLS_SPLIT } from "./timing";

const { img, Sfx, Finish } = B;

const BOTTOM_SHADE =
  "linear-gradient(0deg, rgba(8,4,2,0.88) 0%, rgba(8,4,2,0.55) 18%, rgba(8,4,2,0) 38%)";

// B-roll with its text baked in, for dropping straight onto the CapCut timeline.
// Overlays render on a transparent canvas, so they keep their full soft glow.
const withText = (
  Broll: React.FC,
  Text?: React.FC<OverlayProps>,
  // optional soft shading behind the text, for light images
  scrim?: string,
): React.FC => {
  const C: React.FC = () => (
    <AbsoluteFill>
      <Broll />
      {scrim ? <AbsoluteFill style={{ background: scrim }} /> : null}
      {Text ? <Text bg="alpha" /> : null}
    </AbsoluteFill>
  );
  return C;
};

// 01 — "In 1928, Rudolf Laban published an idea…": huge thin year beside him
export const C01Portrait: React.FC = () => (
  <AbsoluteFill>
    <B.B01Portrait />
    <HeroWord
      text="1928"
      look="thin"
      size={250}
      right={60}
      y={90}
      align="right"
      start={8}
      end={172}
    />
    <O.LabelAt text="Rudolf Laban" start={18} y={880} />
  </AbsoluteFill>
);

// 02 — "…a written language for human movement.": splits into two worlds
export const C02Writing: React.FC = () => (
  <Finish>
    <SplitPanels
      panels={[
        {
          start: 0,
          node: (
            <Still
              src={img("02")}
              from={{ s: 1.05 }}
              to={{ s: 1.22, x: 8, y: -8 }}
              grade={GRADES.sepiaGold}
            />
          ),
          label: <PanelLabel thin="a written" heavy="language" />,
        },
        {
          start: 62,
          node: (
            <Still
              src={img("03")}
              from={{ s: 1.15, x: 4 }}
              to={{ s: 1.08, x: -4 }}
              grade={GRADES.sepiaGold}
            />
          ),
          label: <PanelLabel thin="for human" heavy="movement" />,
        },
      ]}
    />
    {[20, 34, 42].map((f) => (
      <Sfx key={f} name="tick" at={f} volume={0.25} />
    ))}
    <Sfx name="whoosh" at={58} volume={0.6} />
    <Sfx name="hit" at={66} volume={0.35} />
  </Finish>
);

// 03 — teaser flash, with the word it answers
export const C03Teaser: React.FC = () => (
  <AbsoluteFill>
    <B.B03Teaser />
    <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.25)" }} />
    <HeroWord
      text="Impossible?"
      look="heavy"
      size={190}
      color={COLOR.white}
      y={430}
      start={2}
      glitch
    />
  </AbsoluteFill>
);

// 04 — "Music… Words… Architecture could be drawn.": one panel becomes three
export const C04Written: React.FC = () => (
  <Finish>
    <SplitPanels
      panels={[
        {
          start: 0,
          node: (
            <Still
              src={img("04")}
              from={{ s: 1.1, x: 3 }}
              to={{ s: 1.18, x: -3 }}
              grade={GRADES.sepiaGold}
            />
          ),
          label: <PanelLabel thin="Music" heavy="written" />,
        },
        {
          start: 60,
          node: (
            <Still
              src={img("05")}
              from={{ s: 1.08 }}
              to={{ s: 1.2, y: -4 }}
              grade={GRADES.sepiaGold}
            />
          ),
          label: <PanelLabel thin="Words" heavy="written" />,
        },
        {
          start: 120,
          node: (
            <Still
              src={img("06")}
              from={{ s: 1.1 }}
              to={{ s: 1.24, x: -6, y: 6 }}
              grade={GRADES.sepiaGold}
            />
          ),
          label: <PanelLabel thin="Architecture" heavy="drawn" />,
        },
      ]}
    />
    <Sfx name="whoosh" at={56} volume={0.6} />
    <Sfx name="hit" at={62} volume={0.35} />
    <Sfx name="whoosh" at={116} volume={0.6} />
    <Sfx name="hit" at={122} volume={0.35} />
  </Finish>
);

export const C06Verbs = withText(B.B05Verbs, O.O04Verbs);

// 07 — "…the movement is gone.": the word evaporates with the dust
export const C07Gone: React.FC = () => (
  <AbsoluteFill>
    <B.B06Gone />
    <HeroWord
      text="gone."
      look="serif"
      size={260}
      y={330}
      start={28}
      end={146}
      evaporate
    />
  </AbsoluteFill>
);

// 08 — "…a system of geometric symbols…": pencil → torn paper → finished sheet
export const C08Symbols: React.FC = () => (
  <AbsoluteFill>
    <B.B07Symbols />
    <AbsoluteFill style={{ background: BOTTOM_SHADE }} />
    <O.LabelAt
      text="Geometric symbols"
      start={SYMBOLS_SPLIT + 18}
      size={72}
      y={930}
    />
  </AbsoluteFill>
);

export const C09Measure = withText(B.B08Measure, O.O05Measure, BOTTOM_SHADE);

// 10 — "An alphabet…"
export const C10Staff = withText(B.B09Staff, O.O06Alphabet);

// 11 — montage: numbered titles, glitch cuts, two torn-paper slashes
const TOPICS: { img: string; word: string; rest?: string; grade?: string }[] = [
  { img: "16", word: "Nazi", rest: "cultural politics" },
  { img: "17", word: "Wartime", rest: "factories" },
  { img: "18", word: "Broadway", rest: "copyright" },
  { img: "19", word: "Corporate", rest: "hiring" },
  { img: "22", word: "Military", rest: "analysis" },
  { img: "20", word: "Therapy" },
  { img: "21", word: "Anthropology" },
  {
    img: "23",
    word: "Machines",
    rest: "that read human motion",
    grade: GRADES.cool,
  },
];
export const C11Montage: React.FC = () => (
  <Finish dust={0.25}>
    {TOPICS.map((t, i) => {
      const last = i === TOPICS.length - 1;
      const len = last ? MONTAGE_SHOT * 2.833 : MONTAGE_SHOT;
      const zoomIn = i % 2 === 0;
      return (
        <Sequence
          key={t.img}
          from={MONTAGE_CUTS[i]}
          durationInFrames={Math.round(len)}
        >
          <Still
            src={img(t.img)}
            from={{ s: zoomIn ? 1.06 : 1.2 }}
            to={{ s: zoomIn ? 1.2 : 1.06 }}
            grade={t.grade ?? GRADES.bwRose}
            rose={!t.grade}
            glitchIn={i !== 3 && i !== 6}
            kicks={[0]}
          />
        </Sequence>
      );
    })}
    <AbsoluteFill style={{ background: BOTTOM_SHADE }} />
    {TOPICS.map((t, i) => (
      <TopicTitle
        key={t.word}
        index={i + 1}
        word={t.word}
        rest={t.rest}
        start={MONTAGE_CUTS[i] + 2}
        end={i === TOPICS.length - 1 ? 318 : MONTAGE_CUTS[i] + MONTAGE_SHOT}
      />
    ))}
    {[3, 6].map((i) => (
      <Sequence key={i} from={MONTAGE_CUTS[i] - 8} durationInFrames={16}>
        <TornStrip dir={i === 3 ? 1 : -1} />
      </Sequence>
    ))}
    <Sfx name="drone" at={0} volume={0.25} />
    <Sfx name="riser" at={MONTAGE_CUTS[7] - 90} volume={0.35} />
    {MONTAGE_CUTS.slice(0, 7).map((f, i) => (
      <React.Fragment key={f}>
        <Sfx name="hit" at={f} volume={0.4} />
        <Sfx
          name={i === 3 || i === 6 ? "whoosh" : "glitch"}
          at={i === 3 || i === 6 ? f - 6 : f}
          volume={0.3}
        />
      </React.Fragment>
    ))}
    <Sfx name="boom" at={MONTAGE_CUTS[7]} volume={0.6} />
  </Finish>
);

// 12 — "…what happens when human movement becomes information.": data scramble lock-in
export const C12Information: React.FC = () => (
  <AbsoluteFill>
    <B.B11Information />
    <AbsoluteFill style={{ background: BOTTOM_SHADE }} />
    <O.CaptionAt
      text="what happens when human movement becomes"
      start={20}
      x={124}
      y={720}
      size={46}
    />
    <ScrambleWord text="Information" start={70} size={176} y={790} x={110} />
    {Array.from({ length: 11 }).map((_, i) => (
      <Sfx key={i} name="tick" at={Math.round(76 + i * 2.6)} volume={0.25} />
    ))}
    <Sfx name="hit" at={106} volume={0.45} />
  </AbsoluteFill>
);

// "But dance?" as a standalone beat on the brand's ink background
export const C05Question: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLOR.ink }}>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 55%, rgba(224,69,123,0.16), rgba(13,7,16,0) 60%)",
      }}
    />
    <O.O03Question bg="alpha" />
    <FilmLook />
    <Sequence from={8} layout="none">
      <Audio src={staticFile("sfx/hit.wav")} volume={0.5} />
    </Sequence>
  </AbsoluteFill>
);
