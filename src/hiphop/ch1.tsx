import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";
import { SplitPanels } from "../brand/fx";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt } from "../laban/overlays";
import { Plate, Rig } from "../laban3/rig";
import { LightSweep } from "../laban9/fx9";
import {
  ANTON,
  CRUSH,
  clamp,
  ease,
  Flicker,
  img,
  Pair,
  Print,
  ReconTag,
  RED,
  SHADE,
  SlashReveal,
  SprayReveal,
  Table,
  Tape,
  WARM,
} from "./kit";

// Hip-hop episode — Chapter 1 "Before the birthday" (script part 2). 30 fps.
export const LENH1 = {
  c01: 210,
  c02: 240,
  c03: 150,
  c04: 270,
  c05: 300,
  c06: 270,
  c07: 270,
};

// 01 — "To understand hip-hop, we have to begin before anybody was calling it hip-hop."
// Push into the Bronx street sign, then pull out: it's a print on a table among others.
const C1_PRINTS = [
  { src: "b01", x: 330, y: 250, w: 560, rot: -8 },
  { src: "b02", x: 1600, y: 270, w: 540, rot: 6 },
  { src: "b04", x: 310, y: 840, w: 560, rot: 5 },
  { src: "b25", x: 1610, y: 830, w: 560, rot: -5 },
];
export const C01Before: React.FC = () => {
  const frame = useCurrentFrame();
  const t = ease(frame, 108, 124);
  return (
    <Finish dust={0.35}>
      <Rig
        keys={[
          { f: 0, s: 2.62, x: 960, y: 540 },
          { f: 30, s: 2.75, x: 960, y: 540, e: "drift" },
          { f: 108, s: 1.0, x: 960, y: 540, e: "smooth" },
          { f: 210, s: 1.04, x: 960, y: 540, e: "drift" },
        ]}
        blurScale={0.25}
      >
        <Table tone="wood" />
        {C1_PRINTS.map((p) => (
          <Print
            key={p.src}
            src={img(p.src)}
            x={p.x}
            y={p.y}
            w={p.w}
            rot={p.rot}
            filter={CRUSH}
          />
        ))}
        <Print src={img("b03")} x={960} y={540} w={760} rot={0} filter={WARM} />
      </Rig>
      {/* chapter title over a soft scrim once we're wide */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 52%, rgba(6,5,4,0.75), rgba(6,5,4,0) 100%)",
          opacity: t,
        }}
      />
      <Tape text="Chapter 1" x={960} y={400} rot={-2} at={104} size={30} />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 450,
          textAlign: "center",
          opacity: t,
          translate: `${(1 - t) * 260}px 0px`,
          filter: t < 1 ? `blur(${(1 - t) * 14}px)` : undefined,
        }}
      >
        <span
          style={{
            ...ANTON,
            fontSize: 150,
            color: COLOR.white,
            textShadow: "0 14px 30px rgba(0,0,0,0.85), 0 2px 0 rgba(0,0,0,0.6)",
          }}
        >
          Before the birthday
        </span>
      </div>
      <CaptionAt
        text="before anybody was calling it hip-hop"
        start={140}
        y={660}
        size={40}
      />
      <ReconTag />
      <Sfx name="whoosh" at={34} volume={0.4} />
      <Sfx name="tick" at={104} volume={0.35} />
      <Sfx name="hit" at={110} volume={0.35} />
    </Finish>
  );
};

// A black slab label that slides in, white heavy type with a red edge (kinetic newspaper style)
const Slab: React.FC<{
  text: string;
  at: number;
  x?: number;
  y?: number;
  size?: number;
}> = ({ text, at, x = 120, y = 780, size = 110 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = ease(frame, at, at + 9);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <div style={{ width: 12, background: RED }} />
      <div
        style={{
          background: "#070707",
          padding: "6px 26px 2px",
          ...ANTON,
          fontSize: size,
          color: "#fff",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// 02 — "The Bronx of the 1970s was living through real economic pressure. Poverty, drugs and gang
// culture were part of the story." Crushed B&W, one place per word; people only from behind.
const C2 = [
  { src: "b05", from: 0, to: 60, x: 960, y: 520, word: "Economic pressure" },
  { src: "b02", from: 60, to: 110, x: 900, y: 500, word: "Poverty" },
  { src: "b01", from: 110, to: 160, x: 1000, y: 560, word: "Drugs" },
  { src: "b04", from: 160, to: 240, x: 960, y: 520, word: "Gang culture" },
];
export const C02Pressure: React.FC = () => (
  <Finish dust={0.5}>
    {C2.map((s) => (
      <Sequence key={s.src} from={s.from} durationInFrames={s.to - s.from}>
        <Rig
          keys={[
            { f: 0, s: 1.08, x: s.x, y: s.y },
            { f: s.to - s.from, s: 1.18, x: s.x + 15, y: s.y, e: "drift" },
          ]}
        >
          <Plate src={img(s.src)} filter={`${CRUSH} brightness(0.85)`} />
        </Rig>
        <AbsoluteFill style={{ background: SHADE }} />
        <Slab text={s.word} at={4} />
      </Sequence>
    ))}
    {C2.slice(1).map((s) => (
      <Sequence key={s.from} from={s.from} durationInFrames={1}>
        <AbsoluteFill style={{ backgroundColor: "#000" }} />
      </Sequence>
    ))}
    <Flicker amount={0.06} />
    <Sequence durationInFrames={58} layout="none">
      <CaptionAt
        text="the Bronx of the 1970s was living through real"
        start={2}
        y={720}
        size={38}
      />
    </Sequence>
    <Sequence from={192} layout="none">
      <CaptionAt text="were part of the story." start={0} y={940} size={40} />
    </Sequence>
    <ReconTag />
    {C2.map((s) => (
      <Sfx key={s.from} name="hit" at={s.from + 4} volume={0.22} />
    ))}
  </Finish>
);

// 03 — "But if we stop there, we tell the story wrong." A black slash cuts across the bleak picture
// and reveals the warm family behind it.
export const C03Wrong: React.FC = () => (
  <Finish dust={0.4}>
    <Rig
      keys={[
        { f: 0, s: 1.12, x: 960, y: 520 },
        { f: 70, s: 1.18, x: 970, y: 520, e: "drift" },
      ]}
    >
      <Plate src={img("b05")} filter={`${CRUSH} brightness(0.85)`} />
    </Rig>
    <Flicker amount={0.05} />
    <SlashReveal at={56} dur={14}>
      <Sequence from={56}>
        <Rig
          keys={[
            { f: 0, s: 1.2, x: 960, y: 500 },
            { f: 94, s: 1.1, x: 960, y: 520, e: "smooth" },
          ]}
        >
          <Plate src={img("b09")} filter={WARM} />
        </Rig>
      </Sequence>
    </SlashReveal>
    <AbsoluteFill style={{ background: SHADE }} />
    <Sequence durationInFrames={58} layout="none">
      <CaptionAt text="but if we stop there," start={6} y={860} size={46} />
    </Sequence>
    <Sequence from={72} layout="none">
      <Pair
        thin="we tell the story"
        heavy="wrong."
        at={0}
        y={760}
        size={170}
        color={RED}
      />
    </Sequence>
    <ReconTag />
    <Sfx name="whoosh" at={52} volume={0.45} />
    <Sfx name="hit" at={60} volume={0.4} />
  </Finish>
);

// 04 — "…a neighborhood full of families, teenagers, music, competition, style, block parties and
// community." Prints drop onto the table one word at a time; the camera chases each, then pulls back.
const C4 = [
  { src: "b10", x: 420, y: 330, rot: -6, word: "Families" },
  { src: "b11", x: 1000, y: 300, rot: 4, word: "Teenagers" },
  { src: "b19", x: 1540, y: 360, rot: -3, word: "Music" },
  { src: "b07", x: 380, y: 770, rot: 5, word: "Competition" },
  { src: "b12", x: 900, y: 730, rot: -4, word: "Style" },
  { src: "b27", x: 1480, y: 770, rot: 6, word: "Block parties" },
  { src: "b28", x: 980, y: 520, rot: -2, word: "Community" },
].map((p, i) => ({ ...p, at: 8 + i * 28, w: i === 6 ? 620 : 520 }));
const printH = (w: number) => (w - 28) * (9 / 16) + 28;

export const C04Full: React.FC = () => {
  const keys = [
    { f: 0, s: 1.55, x: C4[0].x, y: C4[0].y },
    ...C4.slice(1).flatMap((p, i) => [
      {
        f: C4[i].at + 18,
        s: 1.55,
        x: C4[i].x,
        y: C4[i].y,
        e: "drift" as const,
      },
      { f: p.at - 2, s: 1.55, x: p.x, y: p.y, e: "ramp" as const },
    ]),
    { f: 214, s: 1.0, x: 960, y: 540, e: "smooth" as const },
    { f: 270, s: 1.03, x: 960, y: 540, e: "drift" as const },
  ];
  return (
    <Finish dust={0.3}>
      <Rig keys={keys} blurScale={0.35}>
        <Table tone="wood" />
        {C4.map((p) => (
          <React.Fragment key={p.src}>
            <Print
              src={img(p.src)}
              x={p.x}
              y={p.y}
              w={p.w}
              rot={p.rot}
              at={p.at}
              filter={WARM}
            />
            <Tape
              text={p.word}
              x={p.x}
              y={p.y + printH(p.w) / 2 - 4}
              rot={p.rot * 0.6 - 1}
              at={p.at + 8}
              size={34}
            />
          </React.Fragment>
        ))}
      </Rig>
      <LightSweep at={220} dur={40} angle={100} strength={0.12} />
      <ReconTag />
      {C4.map((p) => (
        <React.Fragment key={p.at}>
          <Sfx name="tick" at={p.at + 6} volume={0.3} />
          <Sfx name="whoosh" at={p.at - 4} volume={0.12} />
        </React.Fragment>
      ))}
    </Finish>
  );
};

// A full-frame photo positioned so its subject (fx) sits in the middle of a split panel
const PanelShot: React.FC<{
  src: string;
  fx: number;
  s0?: number;
  s1?: number;
  len?: number;
}> = ({ src, fx, s0 = 1.04, s1 = 1.14, len = 180 }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, len], [s0, s1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          left: 960 - fx,
          top: 0,
          width: 1920,
          height: 1080,
          transformOrigin: `${fx}px 540px`,
          scale: String(s),
          filter: WARM,
        }}
      />
    </AbsoluteFill>
  );
};

const PLabel: React.FC<{ top?: string; main: string; size?: number }> = ({
  top,
  main,
  size = 64,
}) => {
  const frame = useCurrentFrame();
  const t = ease(frame, 0, 10);
  return (
    <div style={{ opacity: t, translate: `0px ${(1 - t) * 24}px` }}>
      {top ? (
        <div
          style={{
            ...TYPE.body,
            fontWeight: 300,
            fontSize: 28,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: COLOR.white,
            textShadow: "0 2px 10px rgba(0,0,0,0.9)",
          }}
        >
          {top}
        </div>
      ) : null}
      <div
        style={{
          ...ANTON,
          fontSize: size,
          color: "#fff",
          textShadow: "0 6px 20px rgba(0,0,0,0.9)",
        }}
      >
        {main}
      </div>
    </div>
  );
};

// 05 — "People were not sitting around waiting for someone to invent a culture for them. They were
// already creating ways to gather, dress, talk, play records and move."
const C5_CUT = 126;
const C5 = [
  { src: "b08", fx: 980, n: "01", word: "Gather" },
  { src: "b18", fx: 700, n: "02", word: "Dress" },
  { src: "b13", fx: 1000, n: "03", word: "Talk" },
  { src: "b23", fx: 1050, n: "04", word: "Play records" },
  { src: "b16", fx: 820, n: "05", word: "Move" },
];
export const C05Already: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [46, 58], [0, 1], clamp);
  return (
    <Finish dust={0.3}>
      <Sequence durationInFrames={C5_CUT}>
        <Rig
          keys={[
            { f: 0, s: 1.1, x: 760, y: 540 },
            { f: C5_CUT, s: 1.26, x: 720, y: 520, e: "drift" },
          ]}
          whipOut={1}
        >
          <Plate src={img("b17")} filter={`${WARM} brightness(0.9)`} />
        </Rig>
        <AbsoluteFill style={{ background: SHADE }} />
        <Sequence durationInFrames={68} layout="none">
          <Pair
            thin="nobody was waiting for someone to"
            heavy="invent a culture"
            at={6}
            y={740}
            size={130}
          />
          <div
            style={{
              position: "absolute",
              left: 960 - 500,
              top: 870,
              width: 1000 * strike,
              height: 12,
              background: RED,
              boxShadow: `0 0 14px ${RED}`,
              rotate: "-1.5deg",
            }}
          />
        </Sequence>
        <Sequence from={70} layout="none">
          <Pair
            thin="they were"
            heavy="already creating"
            at={0}
            y={740}
            size={140}
            color={RED}
          />
        </Sequence>
      </Sequence>
      <Sequence from={C5_CUT}>
        <SplitPanels
          panels={C5.map((p, i) => ({
            start: i * 22,
            node: <PanelShot src={img(p.src)} fx={p.fx} />,
            label: (
              <PLabel
                top={p.n}
                main={p.word}
                size={p.word.length > 8 ? 56 : 64}
              />
            ),
          }))}
        />
      </Sequence>
      <ReconTag />
      <Sfx name="whoosh" at={44} volume={0.3} />
      <Sfx name="hit" at={74} volume={0.35} />
      <Sfx name="whoosh" at={C5_CUT - 6} volume={0.4} />
      {C5.map((p, i) => (
        <Sfx key={p.n} name="tick" at={C5_CUT + i * 22 + 6} volume={0.25} />
      ))}
    </Finish>
  );
};

// 06 — "Black communities, Puerto Rican communities, Jamaicans and other Caribbean people were living
// close enough for sounds and ideas to keep crossing paths." Three panels, then two sound lines weave
// across all of them.
const C6 = [
  { src: "b06", fx: 760, top: "Black", word: "communities" },
  { src: "b14", fx: 820, top: "Puerto Rican", word: "communities" },
  { src: "b26", fx: 960, top: "Jamaicans & other", word: "Caribbean people" },
];
const WAVE_AT = 140;
const wave = (phase: number, amp: number) => {
  const pts: string[] = [];
  for (let x = -40; x <= 1960; x += 20) {
    const y = 560 + amp * Math.sin((x / 1920) * Math.PI * 5 + phase);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M ${pts.join(" L ")}`;
};
export const C06Crossing: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [WAVE_AT, WAVE_AT + 40], [0, 1], clamp);
  const dim = ease(frame, WAVE_AT - 6, WAVE_AT + 14);
  const flow = (frame - WAVE_AT) * 0.04;
  return (
    <Finish dust={0.3}>
      <SplitPanels
        panels={C6.map((p, i) => ({
          start: i * 26,
          node: <PanelShot src={img(p.src)} fx={p.fx} len={270} />,
          label: <PLabel top={p.top} main={p.word} size={70} />,
        }))}
      />
      <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${0.35 * dim})` }} />
      {frame >= WAVE_AT ? (
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          {[
            { c: COLOR.gold, ph: flow, amp: 110 },
            { c: RED, ph: flow + Math.PI, amp: 110 },
            { c: "#fff", ph: flow * 1.6 + 1.2, amp: 60 },
          ].map((w, i) => (
            <path
              key={i}
              d={wave(w.ph, w.amp)}
              fill="none"
              stroke={w.c}
              strokeWidth={i === 2 ? 2 : 4}
              opacity={i === 2 ? 0.6 : 0.95}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - draw}
              style={{ filter: `drop-shadow(0 0 8px ${w.c})` }}
            />
          ))}
        </svg>
      ) : null}
      <Sequence from={WAVE_AT + 10} layout="none">
        <Pair
          thin="close enough for sounds and ideas to keep"
          heavy="crossing paths"
          at={0}
          y={110}
          size={130}
        />
      </Sequence>
      <ReconTag />
      {C6.map((_, i) => (
        <Sfx key={i} name="whoosh" at={i * 26} volume={0.25} />
      ))}
      <Sfx name="riser" at={WAVE_AT - 20} volume={0.2} />
      <Sfx name="hit" at={WAVE_AT + 14} volume={0.3} />
    </Finish>
  );
};

// 07 — "That matters, because hip-hop did not grow in a silent neighborhood. [MUSIC ENTERS] The Bronx
// was already loud." Still and grey, then a spray-paint burst into the sound system, pumping on the beat.
const LOUD = 150;
const BEAT = 15;
export const C07Loud: React.FC = () => {
  const frame = useCurrentFrame();
  const sinceBeat = frame >= LOUD ? (frame - LOUD) % BEAT : 99;
  const pump = frame >= LOUD ? Math.exp(-sinceBeat / 4) : 0;
  const quiet = ease(frame, 14, 40) * (1 - ease(frame, LOUD - 10, LOUD));
  return (
    <Finish dust={0.35}>
      <Rig
        keys={[
          { f: 0, s: 1.1, x: 900, y: 520 },
          { f: LOUD, s: 1.16, x: 910, y: 520, e: "drift" },
        ]}
      >
        <Plate
          src={img("o_dusk")}
          filter="saturate(0.15) brightness(0.62) contrast(1.05)"
        />
      </Rig>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 760,
          textAlign: "center",
          opacity: quiet,
        }}
      >
        <div
          style={{
            ...TYPE.body,
            fontWeight: 300,
            fontSize: 38,
            letterSpacing: "0.12em",
            color: COLOR.white,
          }}
        >
          hip-hop did not grow in a
        </div>
        <div
          style={{
            ...TYPE.body,
            fontWeight: 200,
            fontSize: 110,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(244,241,234,0.75)",
          }}
        >
          silent neighborhood
        </div>
      </div>
      <AbsoluteFill
        style={{
          scale: String(1 + 0.025 * pump),
          translate: `${Math.sin(frame * 9) * 5 * pump}px ${Math.cos(frame * 7) * 4 * pump}px`,
        }}
      >
        <SprayReveal
          at={LOUD}
          dur={24}
          src={img("o_djsys")}
          filter="contrast(1.12) saturate(1.25)"
          scale={1.12}
        />
      </AbsoluteFill>
      {frame >= LOUD ? (
        <AbsoluteFill
          style={{
            background: SHADE,
            opacity: ease(frame, LOUD + 6, LOUD + 16),
          }}
        />
      ) : null}
      <Sequence from={LOUD + 8} layout="none">
        <div style={{ translate: `${Math.sin(frame * 11) * 6 * pump}px 0px` }}>
          <Pair
            thin="the Bronx was"
            heavy="already loud."
            at={0}
            y={720}
            size={190}
          />
        </div>
      </Sequence>
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(255,240,220,${frame >= LOUD ? 0.25 * Math.exp(-(frame - LOUD) / 3) : 0})`,
        }}
      />
      <ReconTag />
      <Sfx name="boom" at={LOUD} volume={0.55} />
      {Array.from({ length: 8 }).map((_, i) => (
        <Sfx key={i} name="hit" at={LOUD + i * BEAT} volume={0.18} />
      ))}
    </Finish>
  );
};
