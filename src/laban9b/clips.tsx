import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HeroWord, PanelLabel, SplitPanels } from "../brand/fx";
import { Still } from "../cine/Still";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt } from "../laban/overlays";
import { Plate, Rig } from "../laban3/rig";
import { FilmStrip, LightSweep, ProjectorBeam } from "../laban9/fx9";

// Laban — Part 9b: Choreometrics, continued. 30 fps. Sits between Part 9 and Part 10 and keeps its warm
// grade, projector light and film strips. Built from the owner's seven archive images (laban9b/m1–m7).
export const LEN9B = { k01: 270, k02: 270, k03: 300 };

const img = (n: number) => `laban9b/m${n}.jpg`;
const WARM = "sepia(0.1) saturate(1.06) contrast(1.05) brightness(1.03)";
const COOL = "saturate(0.75) contrast(1.08) hue-rotate(-6deg)";
const SHADE =
  "linear-gradient(0deg, rgba(14,8,4,0.85) 0%, rgba(14,8,4,0.45) 20%, rgba(14,8,4,0) 40%)";

const STRIP_A = [img(1), "laban/03.jpg", img(5), "laban5/e03.jpg", img(2)];
const STRIP_B = [
  img(6),
  "laban7/g05.jpg",
  img(4),
  "laban9/i02.jpg",
  "laban/07.jpg",
];

// 01 — "The project eventually drew on a huge archive of ethnographic film…"
// The screening room: the projector beam pours over the reels as the camera pushes to the screen,
// then two film strips cross the frame in depth.
export const K01Archive: React.FC = () => (
  <Finish dust={0.3}>
    <Sequence durationInFrames={124}>
      <Rig
        keys={[
          { f: 0, s: 1.02, x: 960, y: 540 },
          { f: 124, s: 1.26, x: 1260, y: 380, e: "drift" },
        ]}
        whipOut={1}
      >
        <Plate src={img(1)} filter={WARM} />
      </Rig>
      <ProjectorBeam sx={880} sy={300} strength={0.55} />
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt
        text="the project eventually drew on"
        start={10}
        y={790}
        size={44}
      />
      <HeroWord
        text="a huge archive"
        look="serif"
        size={140}
        y={840}
        start={18}
      />
    </Sequence>
    <Sequence from={118}>
      <AbsoluteFill style={{ backgroundColor: "#0b0706" }} />
      <FilmStrip frames={STRIP_A} speed={20} tilt={16} y={330} height={300} />
      <FilmStrip
        frames={STRIP_B}
        speed={-14}
        tilt={-16}
        y={760}
        height={300}
        offset={4000}
      />
      <ProjectorBeam sx={20} sy={520} strength={0.6} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(11,7,6,0.2), rgba(11,7,6,0.78) 85%)",
        }}
      />
      <CaptionAt text="of" start={10} y={470} size={46} />
      <HeroWord
        text="ethnographic film"
        look="serif"
        size={150}
        y={510}
        start={16}
      />
    </Sequence>
    <Sfx name="drone" at={0} volume={0.22} />
    {Array.from({ length: 12 }).map((_, i) => (
      <Sfx key={`p${i}`} name="tick" at={i * 9} volume={0.12} />
    ))}
    <Sfx name="hit" at={20} volume={0.25} />
    <Sfx name="whoosh" at={114} volume={0.55} />
    <Sfx name="hit" at={136} volume={0.3} />
  </Finish>
);

// 02 — "…and adapted Laban-derived movement analysis into a cross-cultural coding system."
// The map wall, then a speed-ramped push down onto the coding sheet on the workshop table.
export const K02Coding: React.FC = () => (
  <Finish dust={0.25}>
    <Sequence durationInFrames={126}>
      <Rig
        keys={[
          { f: 0, s: 1.05, x: 960, y: 540 },
          { f: 126, s: 1.28, x: 800, y: 380, e: "drift" },
        ]}
        whipOut={1}
      >
        <Plate src={img(4)} filter={WARM} />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <CaptionAt text="and adapted" start={8} y={790} size={44} />
      <HeroWord
        text="Laban-derived analysis"
        look="serif"
        size={130}
        y={840}
        start={14}
      />
    </Sequence>
    <Sequence from={126}>
      <Rig
        keys={[
          { f: 0, s: 1.1, x: 960, y: 420 },
          { f: 16, s: 1.12, x: 980, y: 440, e: "drift" },
          { f: 44, s: 1.75, x: 1270, y: 830, e: "ramp" },
          { f: 144, s: 1.82, x: 1280, y: 835, e: "drift" },
        ]}
        whipIn={1}
      >
        <Plate src={img(3)} filter={WARM} />
      </Rig>
      <LightSweep at={50} dur={70} strength={0.18} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(14,8,4,0.8) 0%, rgba(14,8,4,0.4) 20%, rgba(14,8,4,0) 38%)",
        }}
      />
      <CaptionAt text="into a" start={6} y={60} size={44} />
      <HeroWord
        text="cross-cultural coding system"
        look="serif"
        size={116}
        y={110}
        start={12}
      />
    </Sequence>
    <Sfx name="drone" at={0} volume={0.22} />
    <Sfx name="hit" at={16} volume={0.25} />
    <Sfx name="whoosh" at={120} volume={0.5} />
    <Sfx name="whoosh" at={154} volume={0.4} />
    <Sfx name="hit" at={170} volume={0.35} />
  </Finish>
);

// 03 — "The same family of ideas that had been used to optimize labor and profile decision-making was
// also being used to help bodies recover and to study how cultures move."
// Two cold panels, then a whip into the one room where therapy and the archive sit side by side.
export const K03SameFamily: React.FC = () => (
  <Finish dust={0.25}>
    <Sequence durationInFrames={140}>
      <SplitPanels
        panels={[
          {
            start: 0,
            node: (
              <Still
                src="laban6/f06.jpg"
                from={{ s: 1.2, x: -4 }}
                to={{ s: 1.3, x: -5 }}
                grade={COOL}
              />
            ),
            label: <PanelLabel thin="optimise" heavy="labour" heavySize={92} />,
          },
          {
            start: 50,
            node: (
              <Still
                src="laban8/h02.jpg"
                from={{ s: 1.2, x: 10 }}
                to={{ s: 1.28, x: 12 }}
                grade={COOL}
                whipOut={1}
              />
            ),
            label: (
              <PanelLabel thin="profile" heavy="decisions" heavySize={88} />
            ),
          },
        ]}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(10,6,4,0.78) 0%, rgba(10,6,4,0) 24%)",
        }}
      />
      <CaptionAt
        text="the same family of ideas once used to"
        start={6}
        y={60}
        size={44}
      />
    </Sequence>
    <Sequence from={140}>
      <Rig
        keys={[
          { f: 0, s: 1.12, x: 960, y: 560 },
          { f: 160, s: 1.04, x: 960, y: 540, e: "smooth" },
        ]}
        whipIn={1}
      >
        <Plate src={img(7)} filter={WARM} />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(10,6,4,0.7) 0%, rgba(10,6,4,0) 22%)",
        }}
      />
      <CaptionAt text="was also being used to" start={6} y={60} size={44} />
      <HeroWord
        text="help bodies recover"
        look="serif"
        size={72}
        x={90}
        y={880}
        align="left"
        start={14}
      />
      <HeroWord
        text="study how cultures move"
        look="serif"
        size={72}
        right={90}
        y={880}
        align="right"
        start={52}
      />
    </Sequence>
    <Sfx name="drone" at={0} volume={0.22} />
    <Sfx name="hit" at={6} volume={0.3} />
    <Sfx name="whoosh" at={46} volume={0.5} />
    <Sfx name="hit" at={56} volume={0.3} />
    <Sfx name="whoosh" at={134} volume={0.55} />
    <Sfx name="hit" at={156} volume={0.3} />
    <Sfx name="hit" at={194} volume={0.3} />
  </Finish>
);
