import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Freeze,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  linearTiming,
  TransitionSeries,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { COLOR, TYPE } from "../brand/tokens";
import TL from "./timeline.json";
import {
  ChapterV3,
  FinalCard,
  Iris,
  KickerV3,
  Leak,
  MEMORY_FILTER,
  MemoryOverlay,
  Quote,
} from "./fx";

// Santhal dance episode: the assembled lineup (no narration). Shots, trims, transitions and text come
// from scripts/santhal_edl.py -> timeline.json. One composition per section plus the full film.

type Txt = {
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
type Item = {
  kind: "shot" | "black";
  file?: string;
  start?: number;
  dur: number;
  tr: [string, number];
  vol?: number;
  text: Txt[];
  cutaways?: { file: string; at: number; dur: number }[];
  split?: { file: string } | null;
  hit?: { file: string; vol: number } | null;
  from: number;
  zoom?: number;
  zx?: number;
  zy?: number;
  look?: string;
  polaroid?: boolean;
  punches?: [number, number][];
};
type Bed = { file: string; from_: number; dur: number };
type Section = {
  key: string;
  title: string;
  items: Item[];
  beds: Bed[];
  dur: number;
};
const SECTIONS = (TL as unknown as { sections: Section[] }).sections;
export const SANTHAL_SECTIONS = SECTIONS.map((s) => ({
  key: s.key,
  dur: s.dur,
}));
export const SANTHAL_TOTAL = SECTIONS.reduce((a, s) => a + s.dur, 0);

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
const s2f = (s: number) => Math.round(s * 30);
// in/out envelope for a text element that lives `dur` seconds
const env = (f: number, dur: number, inF = 12, outF = 12) =>
  ease(f, 0, inF) * (1 - ease(f, s2f(dur) - outF, s2f(dur)));

const GRADE = "contrast(1.06) saturate(1.07) brightness(1.01)";

// ---------------------------------------------------------------- transitions
type P = Record<string, unknown>;
const mk = (
  C: React.FC<TransitionPresentationComponentProps<P>>,
): TransitionPresentation<P> => ({ component: C, props: {} });

const Dip: React.FC<TransitionPresentationComponentProps<P>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const o =
    presentationDirection === "exiting"
      ? 1 - Math.min(1, p * 2)
      : Math.max(0, p * 2 - 1);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Flash: React.FC<TransitionPresentationComponentProps<P>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const show = presentationDirection === "exiting" ? p < 0.5 : p >= 0.5;
  const w = 1 - Math.abs(p - 0.5) * 2;
  return (
    <AbsoluteFill style={{ opacity: show ? 1 : 0 }}>
      {children}
      <AbsoluteFill
        style={{ backgroundColor: `rgba(255,246,228,${0.9 * w})` }}
      />
    </AbsoluteFill>
  );
};

const Whip: React.FC<TransitionPresentationComponentProps<P>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const e = Easing.inOut(Easing.cubic)(p);
  const x = presentationDirection === "exiting" ? -e * 1920 : (1 - e) * 1920;
  const blur = Math.sin(p * Math.PI) * 26;
  return (
    <AbsoluteFill
      style={{
        translate: `${x}px 0px`,
        filter: `blur(${blur}px)`,
        scale: String(1 + Math.sin(p * Math.PI) * 0.06),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Zoom: React.FC<TransitionPresentationComponentProps<P>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const ex = presentationDirection === "exiting";
  const s = ex ? 1 + p * 0.5 : 1.35 - 0.35 * Easing.out(Easing.cubic)(p);
  return (
    <AbsoluteFill
      style={{
        scale: String(s),
        opacity: ex ? 1 - p : Math.min(1, p * 1.6),
        filter: `blur(${Math.sin(p * Math.PI) * 10}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const PRESENT: Record<string, () => TransitionPresentation<P>> = {
  fade: () => fade() as unknown as TransitionPresentation<P>,
  dip: () => mk(Dip),
  flash: () => mk(Flash),
  whip: () => mk(Whip),
  zoom: () => mk(Zoom),
  leak: () => mk(Leak),
  iris: () => mk(Iris),
};

// ---------------------------------------------------------------- text
const Letterbox: React.FC<{ f: number; dur: number }> = ({ f, dur }) => {
  const o = env(f, dur, 16, 16);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 120 * o,
          background: "#000",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 120 * o,
          background: "#000",
        }}
      />
    </>
  );
};

const shadow = "0 2px 14px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.6)";

const Chapter: React.FC<{ t: Txt }> = ({ t }) => {
  const f = useCurrentFrame();
  const o = env(f, t.dur, 14, 14);
  const rise = ease(f, 6, 26);
  const line = ease(f, 14, 36);
  return (
    <AbsoluteFill>
      <Letterbox f={f} dur={t.dur} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 45%)",
          opacity: o,
        }}
      />
      <div style={{ position: "absolute", left: 130, bottom: 190, opacity: o }}>
        <div
          style={{
            ...TYPE.label,
            fontSize: 24,
            letterSpacing: "0.42em",
            color: COLOR.gold,
            opacity: ease(f, 2, 14),
            textShadow: shadow,
          }}
        >
          Chapter {t.num}
        </div>
        <div style={{ overflow: "hidden", paddingBottom: 8 }}>
          <div
            style={{
              ...TYPE.headline,
              fontSize: 112,
              lineHeight: 1.08,
              color: COLOR.white,
              translate: `0px ${(1 - rise) * 120}px`,
              textShadow: shadow,
            }}
          >
            {t.title}
          </div>
        </div>
        <div
          style={{
            height: 3,
            width: 260 * line,
            background: COLOR.gold,
            marginTop: 6,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const TitleCard: React.FC<{ t: Txt }> = ({ t }) => {
  const f = useCurrentFrame();
  const o = 1 - ease(f, s2f(t.dur) - 14, s2f(t.dur));
  const words = (t.title ?? "").split(" ");
  const line = ease(f, 26, 56);
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: o,
        scale: String(1 + f * 0.0006),
      }}
    >
      <div
        style={{
          ...TYPE.headline,
          fontSize: 132,
          color: COLOR.white,
          textAlign: "center",
          display: "flex",
          gap: 34,
        }}
      >
        {words.map((w, i) => {
          const p = ease(f, 4 + i * 6, 26 + i * 6);
          return (
            <span
              key={i}
              style={{
                opacity: p,
                filter: `blur(${(1 - p) * 14}px)`,
                translate: `0px ${(1 - p) * 24}px`,
                color: i === words.length - 1 ? COLOR.gold : COLOR.white,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <div
        style={{
          height: 2,
          width: 520 * line,
          background: COLOR.gold,
          margin: "26px 0 22px",
        }}
      />
      <div
        style={{
          ...TYPE.label,
          fontSize: 26,
          letterSpacing: `${0.2 + 0.2 * ease(f, 30, 90)}em`,
          color: "rgba(244,241,234,0.85)",
          opacity: ease(f, 34, 52),
        }}
      >
        {t.sub}
      </div>
    </AbsoluteFill>
  );
};

const LowerThird: React.FC<{ t: Txt }> = ({ t }) => {
  const f = useCurrentFrame();
  const o = env(f, t.dur, 10, 12);
  const bar = ease(f, 0, 14);
  const txt = ease(f, 8, 22);
  return (
    <div style={{ position: "absolute", left: 120, bottom: 120, opacity: o }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 18 }}>
        <div
          style={{
            width: 5,
            background: COLOR.gold,
            transform: `scaleY(${bar})`,
          }}
        />
        <div
          style={{
            clipPath: `inset(0 ${(1 - txt) * 100}% 0 0)`,
            background: "rgba(10,8,10,0.55)",
            padding: "12px 22px 14px",
          }}
        >
          <div
            style={{
              ...TYPE.heavy,
              fontSize: 38,
              color: COLOR.white,
              letterSpacing: "0.02em",
            }}
          >
            {t.l1}
          </div>
          <div
            style={{
              ...TYPE.label,
              fontWeight: 500,
              fontSize: 20,
              color: COLOR.gold,
              letterSpacing: "0.22em",
              marginTop: 4,
            }}
          >
            {t.l2}
          </div>
        </div>
      </div>
    </div>
  );
};

const Location: React.FC<{ t: Txt }> = ({ t }) => {
  const f = useCurrentFrame();
  const o = env(f, t.dur, 10, 12);
  const n = Math.floor(ease(f, 4, 30) * (t.l2 ?? "").length);
  return (
    <div
      style={{
        position: "absolute",
        right: 120,
        top: 160,
        opacity: o,
        textAlign: "right",
      }}
    >
      <div
        style={{
          ...TYPE.headline,
          fontSize: 64,
          color: COLOR.white,
          textShadow: shadow,
        }}
      >
        {t.l1}
      </div>
      <div
        style={{
          ...TYPE.label,
          fontSize: 22,
          letterSpacing: "0.26em",
          color: COLOR.gold,
          textShadow: shadow,
          minHeight: 28,
        }}
      >
        {(t.l2 ?? "").slice(0, n)}
      </div>
    </div>
  );
};

// a dot on the subject, a line drawing out to a label
const Callout: React.FC<{ t: Txt; big?: boolean }> = ({ t, big }) => {
  const f = useCurrentFrame();
  const o = env(f, t.dur, 8, 12);
  const x = t.x ?? 960;
  const y = t.y ?? 540;
  const left = x > 1100;
  const lx = left ? x - 220 : x + 220;
  const ly = y - 140;
  const draw = ease(f, 6, 22);
  const lab = ease(f, 18, 32);
  const ring = (f % 40) / 40;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <circle
          cx={x}
          cy={y}
          r={big ? 12 : 9}
          fill={COLOR.gold}
          opacity={ease(f, 0, 8)}
        />
        <circle
          cx={x}
          cy={y}
          r={(big ? 14 : 10) + ring * 34}
          fill="none"
          stroke={COLOR.gold}
          strokeWidth={2.5}
          opacity={(1 - ring) * 0.9}
        />
        <path
          d={`M ${x} ${y} L ${x + (lx - x) * 0.35} ${ly} L ${lx} ${ly}`}
          fill="none"
          stroke={COLOR.gold}
          strokeWidth={2.5}
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - draw}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: left ? undefined : lx + 14,
          right: left ? 1920 - lx + 14 : undefined,
          top: ly - (big ? 58 : 44),
          textAlign: left ? "right" : "left",
          opacity: lab,
          translate: `${(1 - lab) * (left ? 20 : -20)}px 0px`,
        }}
      >
        <div
          style={{
            ...(big ? TYPE.headline : TYPE.heavy),
            fontSize: big ? 72 : 40,
            color: COLOR.white,
            lineHeight: 1,
            textShadow: shadow,
          }}
        >
          {t.l1}
        </div>
        <div
          style={{
            ...TYPE.label,
            fontWeight: 600,
            fontSize: big ? 22 : 19,
            color: COLOR.gold,
            letterSpacing: "0.22em",
            marginTop: 8,
            textShadow: shadow,
          }}
        >
          {t.l2}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{ t: Txt }> = ({ t }) => {
  const f = useCurrentFrame();
  const o = env(f, t.dur, 10, 12);
  const u = ease(f, 10, 30);
  return (
    <div style={{ position: "absolute", left: 130, top: 130, opacity: o }}>
      <div
        style={{
          ...TYPE.headline,
          fontSize: 76,
          color: COLOR.white,
          textShadow: shadow,
          letterSpacing: `${0.01 + 0.03 * ease(f, 0, 60)}em`,
        }}
      >
        {t.l1}
      </div>
      <div
        style={{
          height: 3,
          width: 180 * u,
          background: COLOR.gold,
          marginTop: 4,
        }}
      />
    </div>
  );
};

const Dedication: React.FC<{ t: Txt }> = ({ t }) => {
  const f = useCurrentFrame();
  const o = env(f, t.dur, 20, 20);
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: o,
        textAlign: "center",
      }}
    >
      <div
        style={{
          ...TYPE.headline,
          fontWeight: 500,
          fontSize: 52,
          color: COLOR.white,
          lineHeight: 1.4,
        }}
      >
        <div style={{ opacity: ease(f, 0, 20) }}>{t.l1}</div>
        <div style={{ opacity: ease(f, 26, 46), color: COLOR.gold }}>
          {t.l2}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{ t: Txt }> = ({ t }) => {
  const f = useCurrentFrame();
  const o = env(f, t.dur, 20, 20);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ backgroundColor: "rgba(6,5,6,0.55)" }} />
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            ...TYPE.headline,
            fontSize: 84,
            color: COLOR.white,
            textShadow: shadow,
          }}
        >
          {t.title}
        </div>
        <div
          style={{
            height: 2,
            width: 360 * ease(f, 10, 40),
            background: COLOR.gold,
            margin: "18px auto 0",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const SplitLabels: React.FC<{ t: Txt }> = ({ t }) => {
  const f = useCurrentFrame();
  const o = env(f, t.dur, 10, 12);
  const lab = (s: string | undefined, left: number) => (
    <div
      style={{
        position: "absolute",
        left,
        bottom: 90,
        width: 960,
        textAlign: "center",
        ...TYPE.label,
        fontSize: 26,
        letterSpacing: "0.3em",
        color: COLOR.white,
        textShadow: shadow,
      }}
    >
      {s}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {lab(t.l1, 0)}
      {lab(t.r1, 960)}
    </AbsoluteFill>
  );
};

const TEXT: Record<string, React.FC<{ t: Txt }>> = {
  chapter: ChapterV3,
  chapterOld: Chapter,
  title: TitleCard,
  lower: LowerThird,
  location: Location,
  callout: (p) => <Callout t={p.t} />,
  drum: (p) => <Callout t={p.t} big />,
  kicker: KickerV3,
  kickerOld: Kicker,
  quote: Quote,
  final: FinalCard,
  dedication: Dedication,
  endcard: EndCard,
  split: SplitLabels,
};

// ---------------------------------------------------------------- shots
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)",
      pointerEvents: "none",
    }}
  />
);

const Clip: React.FC<{
  file: string;
  start: number;
  dur: number;
  vol: number;
  push?: boolean;
  zoom?: number;
  zx?: number;
  zy?: number;
  punches?: [number, number][];
  look?: string;
}> = ({
  file,
  start,
  dur,
  vol,
  push = true,
  zoom = 1,
  zx = 960,
  zy = 540,
  punches,
  look,
}) => {
  const f = useCurrentFrame();
  // interviews: hard "second camera" punch-ins at set frames, plus a very slow drift
  const punch = punches?.length
    ? punches.reduce((z, [at, v]) => (f >= at ? v : z), 1)
    : 1;
  const drift = punches?.length ? 1 + 0.012 * Math.sin(f / 90) : 1;
  const s =
    zoom * punch * drift * (push ? 1 + 0.035 * (f / Math.max(1, dur)) : 1);
  return (
    <AbsoluteFill
      style={{ scale: String(s), transformOrigin: `${zx}px ${zy}px` }}
    >
      <OffthreadVideo
        src={staticFile(file)}
        trimBefore={start}
        muted={vol === 0}
        volume={(fr) =>
          vol * interpolate(fr, [0, 4, dur - 5, dur - 1], [0, 1, 1, 0], clamp)
        }
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: look === "memory" ? `${GRADE} ${MEMORY_FILTER}` : GRADE,
        }}
      />
    </AbsoluteFill>
  );
};

// the last moments of a shot freeze and shrink into a white-bordered photograph
const Polaroid: React.FC<{
  on: boolean;
  at: number;
  p: number;
  children: React.ReactNode;
}> = ({ on, at, p, children }) => {
  const f = useCurrentFrame();
  if (!on || f < at) return <AbsoluteFill>{children}</AbsoluteFill>;
  const shot = (
    <Freeze frame={at}>
      <AbsoluteFill>{children}</AbsoluteFill>
    </Freeze>
  );
  const s = 1 - 0.36 * p;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0807" }}>
      <AbsoluteFill
        style={{
          filter: `blur(${22 * p}px) brightness(${1 - 0.55 * p})`,
          scale: "1.08",
        }}
      >
        {shot}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          scale: String(s),
          rotate: `${-4 * p}deg`,
          boxShadow: `0 ${30 * p}px ${80 * p}px rgba(0,0,0,${0.7 * p})`,
          border: `${Math.round(26 * p)}px solid #F4F1EA`,
          borderBottomWidth: Math.round(90 * p),
          overflow: "hidden",
        }}
      >
        {shot}
      </AbsoluteFill>
      {f < at + 4 ? (
        <AbsoluteFill
          style={{
            backgroundColor: `rgba(255,255,255,${0.8 * (1 - (f - at) / 4)})`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

const Shot: React.FC<{ it: Item }> = ({ it }) => {
  const f = useCurrentFrame();
  if (it.kind === "black") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#050405" }}>
        {it.hit ? (
          <Sequence from={10} layout="none">
            <Audio src={staticFile(it.hit.file)} volume={it.hit.vol} />
          </Sequence>
        ) : null}
        {it.text.map((t, i) => {
          const C = TEXT[t.type];
          return (
            <Sequence key={i} from={s2f(t.at)} durationInFrames={s2f(t.dur)}>
              <C t={t} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    );
  }
  const interview =
    (it.cutaways?.length ?? 0) > 0 || (it.punches?.length ?? 0) > 0;
  const POL = 66;
  const polAt = it.dur - POL;
  const pol = it.polaroid ? ease(f, polAt, polAt + 26) : 0;
  const wipe = ease(f, 0, 16);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {it.split ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 960,
              height: 1080,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -480,
                top: 0,
                width: 1920,
                height: 1080,
              }}
            >
              <Clip file={it.file!} start={it.start!} dur={it.dur} vol={0} />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 0,
              width: 960,
              height: 1080,
              overflow: "hidden",
              clipPath: `inset(0 0 ${(1 - wipe) * 100}% 0)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -480,
                top: 0,
                width: 1920,
                height: 1080,
              }}
            >
              <Clip file={it.split.file} start={0} dur={it.dur} vol={0} />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 957,
              top: 0,
              width: 6,
              height: 1080 * wipe,
              background: COLOR.gold,
            }}
          />
        </>
      ) : (
        <Polaroid on={!!it.polaroid} at={polAt} p={pol}>
          <Clip
            file={it.file!}
            start={it.start!}
            dur={it.dur}
            vol={it.vol ?? 0.8}
            push={!interview}
            zoom={it.zoom}
            zx={it.zx}
            zy={it.zy}
            punches={it.punches}
            look={it.look}
          />
        </Polaroid>
      )}
      {it.cutaways?.map((c, i) => (
        <Sequence key={i} from={c.at} durationInFrames={c.dur}>
          <Clip file={c.file} start={0} dur={c.dur} vol={0} />
        </Sequence>
      ))}
      <Vignette />
      {it.look === "memory" ? <MemoryOverlay /> : null}
      {it.text.map((t, i) => {
        const C = TEXT[t.type];
        return (
          <Sequence key={i} from={s2f(t.at)} durationInFrames={s2f(t.dur)}>
            <C t={t} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const FadeIn: React.FC<{ frames: number; children: React.ReactNode }> = ({
  frames,
  children,
}) => {
  const f = useCurrentFrame();
  const o = frames > 0 ? interpolate(f, [0, frames], [0, 1], clamp) : 1;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const SectionCut: React.FC<{ sec: Section }> = ({ sec }) => {
  const out: React.ReactNode[] = [];
  sec.items.forEach((it, i) => {
    const [kind, n] = it.tr;
    if (i > 0 && kind !== "cut" && n > 0) {
      out.push(
        <TransitionSeries.Transition
          key={`t${i}`}
          presentation={PRESENT[kind]()}
          timing={linearTiming({ durationInFrames: n })}
        />,
      );
    }
    const fadeIn = i === 0 && (kind === "dip" || kind === "fade") ? n : 0;
    out.push(
      <TransitionSeries.Sequence key={`s${i}`} durationInFrames={it.dur}>
        <FadeIn frames={fadeIn}>
          <Shot it={it} />
        </FadeIn>
      </TransitionSeries.Sequence>,
    );
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>{out}</TransitionSeries>
      {sec.beds.map((b, i) => (
        <Sequence key={i} from={b.from_} durationInFrames={b.dur} layout="none">
          <Audio
            src={staticFile(b.file)}
            volume={(fr) =>
              0.85 *
              interpolate(fr, [0, 8, b.dur - 10, b.dur], [0, 1, 1, 0], clamp)
            }
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const SanthalSection: React.FC<{ section: string }> = ({ section }) => {
  const sec = SECTIONS.find((s) => s.key === section) ?? SECTIONS[0];
  return <SectionCut sec={sec} />;
};

export const SanthalFull: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SECTIONS.map((s) => {
        const from = at;
        at += s.dur;
        return (
          <Sequence key={s.key} from={from} durationInFrames={s.dur}>
            <SectionCut sec={s} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
