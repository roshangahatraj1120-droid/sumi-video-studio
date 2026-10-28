import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import type { TransitionPresentationComponentProps } from "@remotion/transitions";
import { COLOR, TYPE } from "../brand/tokens";

// Santhal episode v3: heritage type (Cinzel titles, Cormorant italic for memories and quotes, Montserrat
// for names), the "memory" look, light-leak and iris transitions, pull quotes and the final title card.

export const CINZEL = "Cinzel";
export const CORMORANT = "Cormorant Garamond";
loadFont({
  family: CINZEL,
  url: staticFile("fonts/Cinzel.woff2"),
  weight: "400 900",
});
loadFont({
  family: CORMORANT,
  url: staticFile("fonts/CormorantItalic.woff2"),
  style: "italic",
  weight: "300 700",
});

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
const s2f = (s: number) => Math.round(s * 30);
const env = (f: number, dur: number, inF = 12, outF = 12) =>
  ease(f, 0, inF) * (1 - ease(f, s2f(dur) - outF, s2f(dur)));
export const shadow = "0 2px 14px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.6)";

export type Txt = {
  type: string;
  at: number;
  dur: number;
  title?: string;
  sub?: string;
  num?: string;
  l1?: string;
  l2?: string;
  r1?: string;
  x?: number;
  y?: number;
};

// ---------------------------------------------------------------- transitions
type P = Record<string, unknown>;

// warm light leak burning across the frame while the shots cross-fade
export const Leak: React.FC<TransitionPresentationComponentProps<P>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const ex = presentationDirection === "exiting";
  const w = Math.sin(p * Math.PI);
  const x = -30 + p * 160;
  return (
    <AbsoluteFill style={{ opacity: ex ? 1 : Easing.inOut(Easing.quad)(p) }}>
      {children}
      {ex ? null : (
        <AbsoluteFill
          style={{
            mixBlendMode: "screen",
            opacity: w,
            background: `radial-gradient(ellipse 70% 120% at ${x}% 40%, rgba(255,170,80,0.85) 0%, rgba(255,110,40,0.45) 35%, rgba(255,80,20,0) 70%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// the new shot opens out of a circle
export const Iris: React.FC<TransitionPresentationComponentProps<P>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const r = Easing.inOut(Easing.cubic)(p) * 1150;
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at 50% 50%)` }}>
      {children}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- looks
const Grain: React.FC<{ amount: number }> = ({ amount }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(random(`g${f}`) * 1000);
  return (
    <AbsoluteFill
      style={{
        opacity: amount,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    >
      <svg width={1920} height={1080}>
        <filter id={`n${f}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={seed}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={1920} height={1080} filter={`url(#n${f})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const MEMORY_FILTER =
  "sepia(0.42) saturate(0.7) contrast(0.92) brightness(1.06)";

// faded, warm, grainy, soft-edged: the childhood-memory look
export const MemoryOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const flick = 0.04 * Math.sin(f * 0.9) + 0.03 * Math.sin(f * 2.3);
  return (
    <>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(255,220,170,0.10) 0%, rgba(255,190,120,0.06) 45%, rgba(20,10,0,0.62) 100%)",
        }}
      />
      <AbsoluteFill
        style={{ backgroundColor: `rgba(255,236,200,${0.05 + flick})` }}
      />
      <Grain amount={0.22} />
    </>
  );
};

// ---------------------------------------------------------------- text
const Bars: React.FC<{ f: number; dur: number }> = ({ f, dur }) => {
  const o = env(f, dur, 16, 16);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 110 * o,
          background: "#000",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 110 * o,
          background: "#000",
        }}
      />
    </>
  );
};

// letters arrive one by one out of a soft blur
const Letters: React.FC<{
  text: string;
  f: number;
  start: number;
  step?: number;
  style: React.CSSProperties;
}> = ({ text, f, start, step = 1.4, style }) => (
  <div style={style}>
    {text.split("").map((ch, i) => {
      const p = ease(f, start + i * step, start + i * step + 14);
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: p,
            filter: `blur(${(1 - p) * 10}px)`,
            translate: `0px ${(1 - p) * 18}px`,
            minWidth: ch === " " ? "0.32em" : undefined,
          }}
        >
          {ch}
        </span>
      );
    })}
  </div>
);

export const ChapterV3: React.FC<{ t: Txt }> = ({ t }) => {
  const f = useCurrentFrame();
  const o = env(f, t.dur, 14, 16);
  const line = ease(f, 18, 48);
  return (
    <AbsoluteFill>
      <Bars f={f} dur={t.dur} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0) 60%)",
          opacity: o,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 130,
          bottom: 170,
          opacity: o,
          maxWidth: 1500,
        }}
      >
        <div
          style={{
            ...TYPE.label,
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: "0.5em",
            color: COLOR.gold,
            opacity: ease(f, 2, 16),
            textShadow: shadow,
            marginBottom: 14,
          }}
        >
          Chapter {t.num}
        </div>
        <Letters
          text={(t.title ?? "").toUpperCase()}
          f={f}
          start={6}
          style={{
            fontFamily: CINZEL,
            fontWeight: 600,
            fontSize: 76,
            letterSpacing: "0.08em",
            lineHeight: 1.15,
            color: COLOR.white,
            textShadow: shadow,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 16,
          }}
        >
          <div
            style={{ height: 2, width: 320 * line, background: COLOR.gold }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              rotate: "45deg",
              background: COLOR.gold,
              opacity: ease(f, 40, 50),
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const KickerV3: React.FC<{ t: Txt }> = ({ t }) => {
  const f = useCurrentFrame();
  const o = env(f, t.dur, 12, 14);
  return (
    <div style={{ position: "absolute", left: 130, top: 120, opacity: o }}>
      <div
        style={{
          fontFamily: CORMORANT,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 64,
          color: COLOR.white,
          textShadow: shadow,
          letterSpacing: `${0.01 + 0.02 * ease(f, 0, 70)}em`,
          translate: `${(1 - ease(f, 0, 20)) * -20}px 0px`,
        }}
      >
        {t.l1}
      </div>
      <div
        style={{
          height: 2,
          width: 200 * ease(f, 10, 34),
          background: COLOR.gold,
          marginTop: 6,
        }}
      />
    </div>
  );
};

// a line pulled out big, centred, word by word
export const Quote: React.FC<{ t: Txt }> = ({ t }) => {
  const f = useCurrentFrame();
  const o = env(f, t.dur, 14, 16);
  const words1 = (t.l1 ?? "").split(" ");
  const words2 = (t.l2 ?? "").split(" ");
  const word = (w: string, i: number, base: number, gold: boolean) => {
    const p = ease(f, base + i * 4, base + i * 4 + 16);
    return (
      <span
        key={`${base}-${i}`}
        style={{
          display: "inline-block",
          marginRight: "0.28em",
          opacity: p,
          filter: `blur(${(1 - p) * 8}px)`,
          translate: `0px ${(1 - p) * 20}px`,
          color: gold ? COLOR.gold : COLOR.white,
        }}
      >
        {w}
      </span>
    );
  };
  const base2 = 8 + words1.length * 4 + 6;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 80%)",
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: CORMORANT,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 92,
            lineHeight: 1.12,
            textShadow: shadow,
            maxWidth: 1500,
          }}
        >
          <div>{words1.map((w, i) => word(w, i, 8, false))}</div>
          <div>{words2.map((w, i) => word(w, i, base2, true))}</div>
        </div>
        <div
          style={{
            height: 2,
            width: 240 * ease(f, base2 + 10, base2 + 40),
            background: COLOR.gold,
            marginTop: 22,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FinalCard: React.FC<{ t: Txt }> = ({ t }) => {
  const f = useCurrentFrame();
  const out = 1 - ease(f, s2f(t.dur) - 24, s2f(t.dur));
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        opacity: out,
      }}
    >
      <Letters
        text={(t.title ?? "").toUpperCase()}
        f={f}
        start={4}
        step={2}
        style={{
          fontFamily: CINZEL,
          fontWeight: 600,
          fontSize: 96,
          letterSpacing: `${0.1 + 0.06 * ease(f, 0, 200)}em`,
          color: COLOR.white,
          scale: String(1 + f * 0.0004),
        }}
      />
      <div
        style={{
          height: 2,
          width: 520 * ease(f, 50, 90),
          background: COLOR.gold,
          margin: "30px 0 28px",
        }}
      />
      <div
        style={{
          fontFamily: CORMORANT,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 46,
          color: "rgba(244,241,234,0.92)",
          lineHeight: 1.4,
        }}
      >
        <div
          style={{
            opacity: ease(f, 70, 100),
            filter: `blur(${(1 - ease(f, 70, 100)) * 6}px)`,
          }}
        >
          {t.l1}
        </div>
        <div
          style={{
            opacity: ease(f, 110, 140),
            filter: `blur(${(1 - ease(f, 110, 140)) * 6}px)`,
            color: COLOR.gold,
          }}
        >
          {t.l2}
        </div>
      </div>
    </AbsoluteFill>
  );
};
