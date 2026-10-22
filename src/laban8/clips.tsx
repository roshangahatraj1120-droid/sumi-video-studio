import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { COLOR, TYPE } from "../brand/tokens";
import { HeroWord } from "../brand/fx";
import { Finish, Sfx } from "../laban/broll";
import { CaptionAt, LabelAt } from "../laban/overlays";
import { Plate, Rig } from "../laban3/rig";

// Laban — Part 8: Movement Pattern Analysis, corporations and the Pentagon. 30 fps.
// "Clinical, minimal graphics": cool grade, clean cuts and slow moves, small tracked type.
// The redacted page is lettering only and carries nothing beyond what the script states.
export const LEN8 = {
  h01: 180,
  h02: 240,
  h03: 240,
  h04: 210,
  h05: 270,
  h06: 210,
  h07: 330,
  h08: 330,
};

const DOC_FONT = "Space Grotesk";
loadFont({
  family: DOC_FONT,
  url: staticFile("fonts/SpaceGroteskVar.woff2"),
  weight: "300 700",
});

const img = (n: number) => `laban8/h0${n}.jpg`;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const CLINICAL = "saturate(0.72) contrast(1.06) brightness(1.02)";
const SHADE =
  "linear-gradient(0deg, rgba(6,8,12,0.8) 0%, rgba(6,8,12,0.42) 20%, rgba(6,8,12,0) 40%)";
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

// Small tracked label with a thin gold rule: the clinical keyword
const Tag: React.FC<{
  text: string;
  at: number;
  x: number;
  y: number;
  end?: number;
  align?: "left" | "right";
}> = ({ text, at, x, y, end = 9999, align = "left" }) => {
  const frame = useCurrentFrame();
  const t = ease(frame, at, at + 14);
  const out = interpolate(frame, [end - 8, end], [1, 0], clamp);
  if (frame < at || frame >= end) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? x : undefined,
        right: align === "right" ? 1920 - x : undefined,
        top: y,
        display: "flex",
        flexDirection: align === "left" ? "row" : "row-reverse",
        alignItems: "center",
        gap: 18,
        opacity: t * out,
      }}
    >
      <div style={{ width: 60 * t, height: 2, background: COLOR.gold }} />
      <div
        style={{
          ...TYPE.label,
          fontSize: 30,
          letterSpacing: "0.28em",
          color: COLOR.white,
          textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          clipPath: `inset(0 ${(1 - t) * 100}% 0 0)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// 01 — "Then Laban's ideas moved even farther away from dance." Pan away from the dancers.
export const H01Farther: React.FC = () => (
  <Finish dust={0.15}>
    <Rig
      keys={[
        { f: 0, s: 1.55, x: 420, y: 470 },
        { f: 180, s: 1.45, x: 1250, y: 470, e: "smooth" },
      ]}
    >
      <Plate src={img(1)} filter={CLINICAL} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <CaptionAt
      text="Laban's ideas moved even farther away from"
      start={14}
      y={800}
      size={42}
    />
    <HeroWord text="dance" look="serif" size={150} y={850} start={22} />
    <Sfx name="drone" at={0} volume={0.2} />
    <Sfx name="whoosh" at={40} volume={0.3} />
  </Finish>
);

// 02 — "One of his proteges, Warren Lamb, developed what became known as Movement Pattern Analysis."
export const H02Lamb: React.FC = () => {
  const frame = useCurrentFrame();
  const plate = interpolate(frame, [112, 134], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const line = interpolate(frame, [140, 162], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <Finish dust={0.15}>
      <Rig
        keys={[
          { f: 0, s: 1.05, x: 900, y: 540 },
          { f: 240, s: 1.2, x: 760, y: 500, e: "drift" },
        ]}
      >
        <Plate src={img(2)} filter={CLINICAL} />
      </Rig>
      <AbsoluteFill style={{ background: SHADE }} />
      <Sequence durationInFrames={110} layout="none">
        <CaptionAt
          text="one of his protégés"
          start={12}
          x={124}
          y={850}
          size={40}
        />
        <LabelAt text="Warren Lamb" start={18} y={900} size={64} />
      </Sequence>
      <AbsoluteFill
        style={{ backgroundColor: `rgba(6,8,12,${0.72 * plate})` }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 420,
          textAlign: "center",
          ...TYPE.thin,
          fontSize: 76,
          whiteSpace: "nowrap",
          letterSpacing: `${interpolate(frame, [120, 200], [0.26, 0.16], clamp)}em`,
          textTransform: "uppercase",
          color: COLOR.white,
          opacity: ease(frame, 120, 138),
        }}
      >
        Movement Pattern Analysis
      </div>
      <div
        style={{
          position: "absolute",
          left: 960 - 300 * line,
          width: 600 * line,
          top: 560,
          height: 2,
          background: COLOR.gold,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 590,
          textAlign: "center",
          ...TYPE.label,
          fontSize: 28,
          letterSpacing: "0.4em",
          color: COLOR.gold,
          opacity: ease(frame, 156, 170),
        }}
      >
        MPA
      </div>
      <Sfx name="drone" at={0} volume={0.2} />
      <Sfx name="tick" at={20} volume={0.3} />
      <Sfx name="hit" at={122} volume={0.3} />
    </Finish>
  );
};

// 03 — "…by systematically observing the way someone moved, analysts believed they could identify
// characteristic patterns connected to how that person approached decisions."
export const H03Claim: React.FC = () => (
  <Finish dust={0.15}>
    <Rig
      keys={[
        { f: 0, s: 1.6, x: 1300, y: 470 },
        { f: 240, s: 1.75, x: 1330, y: 480, e: "drift" },
      ]}
    >
      <Plate src={img(2)} filter={CLINICAL} />
    </Rig>
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(90deg, rgba(6,8,12,0.78) 0%, rgba(6,8,12,0.4) 34%, rgba(6,8,12,0) 55%)",
      }}
    />
    <CaptionAt
      text="the claim was ambitious"
      start={8}
      x={124}
      y={250}
      size={40}
    />
    <Tag text="Observe the movement" at={40} x={110} y={380} />
    <Tag text="Find the pattern" at={100} x={110} y={470} />
    <Tag text="Read the decision style" at={160} x={110} y={560} />
    <Sfx name="drone" at={0} volume={0.2} />
    {[40, 100, 160].map((f) => (
      <Sfx key={f} name="tick" at={f} volume={0.35} />
    ))}
  </Finish>
);

// 04 — "The Warren Lamb Trust says Movement Pattern Analysis has been used with tens of thousands of
// people, particularly in management and organizational settings."
export const H04Thousands: React.FC = () => (
  <Finish dust={0.15}>
    <Rig
      keys={[
        { f: 0, s: 1.04, x: 960, y: 520 },
        { f: 210, s: 1.18, x: 1000, y: 480, e: "drift" },
      ]}
    >
      <Plate src={img(3)} filter={CLINICAL} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <CaptionAt text="used with" start={10} y={760} size={42} />
    <HeroWord
      text="tens of thousands"
      look="serif"
      size={130}
      y={810}
      start={16}
    />
    <CaptionAt
      text="of people in management and organisations · per the Warren Lamb Trust"
      start={50}
      y={960}
      size={32}
    />
    <Sfx name="drone" at={0} volume={0.2} />
    <Sfx name="hit" at={18} volume={0.25} />
  </Finish>
);

// 05 — "Historian Whitney Laemmli's research traces Laban-derived movement analysis through corporate
// hiring and management consulting. Companies… Colgate-Palmolive, Hewlett-Packard, Kodak and Bank of
// America." Slow push, then a ramped tilt down the labelled binders.
const FIRMS = [
  { at: 120, name: "Colgate-Palmolive", y: 611 },
  { at: 152, name: "Hewlett-Packard", y: 707 },
  { at: 184, name: "Kodak", y: 800 },
  { at: 216, name: "Bank of America", y: 902 },
];
export const H05Firms: React.FC = () => (
  <Finish dust={0.15}>
    <Rig
      keys={[
        { f: 0, s: 1.04, x: 960, y: 540 },
        { f: 104, s: 1.12, x: 940, y: 520, e: "drift" },
        ...FIRMS.flatMap((c) => [
          { f: c.at - 4, s: 2.1, x: 360, y: c.y, e: "ramp" as const },
          { f: c.at + 26, s: 2.13, x: 360, y: c.y + 4, e: "drift" as const },
        ]),
      ]}
    >
      <Plate src={img(4)} filter={CLINICAL} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <Sequence durationInFrames={110} layout="none">
      <CaptionAt
        text="historian Whitney Laemmli's research"
        start={10}
        y={790}
        size={42}
      />
      <HeroWord
        text="corporate hiring"
        look="serif"
        size={120}
        y={840}
        start={18}
        end={64}
      />
      <HeroWord
        text="management consulting"
        look="serif"
        size={120}
        y={840}
        start={64}
      />
    </Sequence>
    {FIRMS.map((c, i) => (
      <Sequence
        key={c.name}
        from={c.at}
        durationInFrames={(FIRMS[i + 1]?.at ?? 270) - c.at}
        layout="none"
      >
        <Tag text={c.name} at={0} x={1060} y={500} />
      </Sequence>
    ))}
    <Sfx name="drone" at={0} volume={0.2} />
    {FIRMS.map((c) => (
      <React.Fragment key={c.at}>
        <Sfx name="whoosh" at={c.at - 6} volume={0.3} />
        <Sfx name="tick" at={c.at} volume={0.35} />
      </React.Fragment>
    ))}
  </Finish>
);

// 06 — "And then the story gets stranger. According to Laemmli's research, a certified analyst was
// later hired by the Pentagon's Office of Net Assessment for a project using movement to study
// decision-making style."
export const H06Pentagon: React.FC = () => (
  <Finish dust={0.15}>
    <Rig
      keys={[
        { f: 0, s: 1.05, x: 960, y: 540 },
        { f: 210, s: 1.22, x: 900, y: 520, e: "drift" },
      ]}
    >
      <Plate src={img(5)} filter={`${CLINICAL} hue-rotate(-8deg)`} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <Sequence durationInFrames={70} layout="none">
      <CaptionAt text="and then the story gets" start={8} y={790} size={42} />
      <HeroWord text="stranger" look="serif" size={150} y={840} start={14} />
    </Sequence>
    <Sequence from={74} layout="none">
      <CaptionAt
        text="a certified analyst was hired by the Pentagon's"
        start={0}
        y={790}
        size={40}
      />
      <HeroWord
        text="Office of Net Assessment"
        look="serif"
        size={104}
        y={845}
        start={6}
      />
    </Sequence>
    <Tag text="Movement · decision-making style" at={150} x={110} y={110} />
    <Sfx name="drone" at={0} volume={0.25} />
    <Sfx name="hit" at={16} volume={0.3} />
    <Sfx name="tick" at={80} volume={0.3} />
    <Sfx name="tick" at={150} volume={0.3} />
  </Finish>
);

// 07 — "Among the subjects reportedly analyzed were Saddam Hussein and Osama bin Laden. And Lamb himself
// later participated in an analysis involving Vladimir Putin."
// VISUAL: names as typography on a redacted page. Bars wipe off to reveal each name on its line.
const ROWS = [
  { at: 70, name: "Saddam Hussein", note: "reportedly analysed" },
  { at: 130, name: "Osama bin Laden", note: "reportedly analysed" },
  { at: 214, name: "Vladimir Putin", note: "analysis involving Warren Lamb" },
];
const Bar: React.FC<{ w: number; x?: number; reveal?: number }> = ({
  w,
  x = 0,
  reveal = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: x + w * reveal,
      width: w * (1 - reveal),
      top: 0,
      height: "100%",
      background: "#101012",
    }}
  />
);
export const H07Redacted: React.FC = () => {
  const frame = useCurrentFrame();
  const doc: React.CSSProperties = { fontFamily: DOC_FONT, color: "#1d1c1a" };
  return (
    <Finish dust={0.2}>
      <AbsoluteFill style={{ backgroundColor: "#0b0d10" }} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div
          style={{
            position: "absolute",
            left: 260,
            top: 90,
            width: 1400,
            height: 900,
            background: "linear-gradient(170deg, #f2eee4 0%, #e8e2d4 100%)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
            transform: `rotateX(${interpolate(frame, [0, 330], [14, 6])}deg) rotateZ(${interpolate(frame, [0, 330], [-2.5, -1])}deg) scale(${interpolate(frame, [0, 330], [0.96, 1.05])})`,
            padding: "70px 90px",
            boxSizing: "border-box",
            ...doc,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 22,
              letterSpacing: "0.18em",
              fontWeight: 500,
            }}
          >
            <span>MOVEMENT ANALYSIS · DECISION-MAKING STYLE</span>
            <span style={{ position: "relative", width: 260, height: 26 }}>
              <Bar w={260} />
            </span>
          </div>
          <div
            style={{
              height: 2,
              background: "#1d1c1a",
              margin: "22px 0 40px",
              opacity: 0.7,
            }}
          />
          <div
            style={{
              fontSize: 26,
              fontWeight: 500,
              letterSpacing: "0.12em",
              marginBottom: 36,
              opacity: 0.8,
            }}
          >
            SUBJECTS REPORTEDLY ANALYSED
          </div>
          {ROWS.map((r, i) => {
            const reveal = interpolate(frame, [r.at, r.at + 16], [0, 1], {
              ...clamp,
              easing: Easing.inOut(Easing.cubic),
            });
            const lit = frame >= r.at + 16;
            return (
              <div
                key={r.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 40,
                  height: 120,
                  borderBottom: "1px solid rgba(29,28,26,0.25)",
                }}
              >
                <div style={{ fontSize: 26, width: 60, opacity: 0.7 }}>
                  0{i + 1}
                </div>
                <div style={{ position: "relative", width: 560, height: 62 }}>
                  <div
                    style={{
                      fontSize: 54,
                      fontWeight: 700,
                      lineHeight: "62px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.name}
                  </div>
                  <Bar w={560} reveal={reveal} />
                </div>
                <div style={{ flex: 1, position: "relative", height: 30 }}>
                  <div
                    style={{
                      fontSize: 24,
                      letterSpacing: "0.08em",
                      opacity: lit ? 0.75 : 0,
                    }}
                  >
                    {r.note}
                  </div>
                  <Bar
                    w={480}
                    x={0}
                    reveal={interpolate(frame, [r.at + 10, r.at + 26], [0, 1], {
                      ...clamp,
                      easing: Easing.inOut(Easing.cubic),
                    })}
                  />
                </div>
              </div>
            );
          })}
          <div
            style={{
              marginTop: 44,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {[1180, 960, 1060].map((w, i) => (
              <div
                key={i}
                style={{ position: "relative", height: 26, width: w }}
              >
                <Bar w={w} />
              </div>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: 90,
              bottom: 44,
              fontSize: 18,
              letterSpacing: "0.12em",
              opacity: 0.6,
            }}
          >
            ILLUSTRATIVE DOCUMENT · BASED ON THE RESEARCH OF WHITNEY LAEMMLI
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <Sfx name="drone" at={0} volume={0.25} />
      {ROWS.map((r) => (
        <React.Fragment key={r.at}>
          <Sfx name="whoosh" at={r.at} volume={0.3} />
          <Sfx name="tick" at={r.at + 16} volume={0.4} />
        </React.Fragment>
      ))}
    </Finish>
  );
};

// 08 — "Now think about where we have traveled. From preserving choreography, to assessing workers,
// to corporate decision-making, to military analysis. All from the belief that the way a human body
// moves contains information." A ramped journey left → right across the panorama, then wide.
const STAGES = [
  { at: 40, text: "Preserving choreography", x: 360 },
  { at: 92, text: "Assessing workers", x: 760 },
  { at: 144, text: "Corporate decisions", x: 1200 },
  { at: 196, text: "Military analysis", x: 1600 },
];
export const H08Journey: React.FC = () => (
  <Finish dust={0.15}>
    <Rig
      keys={[
        { f: 0, s: 1.3, x: 960, y: 520 },
        ...STAGES.flatMap((s) => [
          { f: s.at - 6, s: 1.75, x: s.x, y: 500, e: "ramp" as const },
          { f: s.at + 42, s: 1.78, x: s.x + 20, y: 500, e: "drift" as const },
        ]),
        { f: 252, s: 1.0, x: 960, y: 540, e: "ramp" },
        { f: 330, s: 1.02, x: 960, y: 540, e: "drift" },
      ]}
    >
      <Plate src={img(1)} filter={CLINICAL} />
    </Rig>
    <AbsoluteFill style={{ background: SHADE }} />
    <Sequence durationInFrames={36} layout="none">
      <CaptionAt
        text="now think about where we have travelled"
        start={4}
        y={880}
        size={44}
      />
    </Sequence>
    {STAGES.map((s, i) => (
      <Sequence
        key={s.text}
        from={s.at}
        durationInFrames={(STAGES[i + 1]?.at ?? 248) - s.at}
        layout="none"
      >
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 850,
            ...TYPE.label,
            fontSize: 22,
            letterSpacing: "0.3em",
            color: COLOR.gold,
          }}
        >
          0{i + 1} / 04
        </div>
        <Tag text={s.text} at={0} x={110} y={890} />
      </Sequence>
    ))}
    <Sequence from={256} layout="none">
      <CaptionAt
        text="the way a human body moves contains"
        start={0}
        y={790}
        size={44}
      />
    </Sequence>
    <HeroWord text="information." look="serif" size={160} y={840} start={262} />
    <Sfx name="drone" at={0} volume={0.22} />
    {STAGES.map((s) => (
      <React.Fragment key={s.at}>
        <Sfx name="whoosh" at={s.at - 8} volume={0.35} />
        <Sfx name="tick" at={s.at} volume={0.35} />
      </React.Fragment>
    ))}
    <Sfx name="whoosh" at={244} volume={0.4} />
    <Sfx name="hit" at={264} volume={0.35} />
  </Finish>
);
