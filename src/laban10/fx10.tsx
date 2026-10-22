import React, { useEffect, useId, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLOR, FONT } from "../brand/tokens";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------- Disintegrate ----------
// The subject (a full-frame cut-out) burns away into noise from one side, with a hot gold edge and
// dust lifting off it, like After Effects' particle dissolve. `p` 0 → whole, 1 → gone.
export const Disintegrate: React.FC<{
  src: string;
  p: number;
  // rough box the subject occupies, for spawning the dust
  box: [number, number, number, number];
  style?: React.CSSProperties;
}> = ({ src, p, box, style }) => {
  const frame = useCurrentFrame();
  const id = `dis${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  // the noise threshold rises with p, so the figure burns away in drifting patches
  const t = 0.2 + 0.46 * p;
  const S = 22;
  const lin = (o: number) => ({ slope: S, intercept: -S * (t + o) });
  const a = lin(0);
  const e = lin(-0.05);
  const filters = (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <defs>
        {[
          ["keep", a],
          ["edge", e],
        ].map(([name, f]) => {
          const ff = f as { slope: number; intercept: number };
          return (
            <filter
              key={name as string}
              id={`${id}-${name}`}
              x="0"
              y="0"
              width="100%"
              height="100%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.006 0.009"
                numOctaves={4}
                seed={11}
                result="n"
              />
              <feColorMatrix
                in="n"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.9 0 0 0 0"
                result="na"
              />
              <feComponentTransfer in="na" result="th">
                <feFuncA
                  type="linear"
                  slope={ff.slope}
                  intercept={ff.intercept}
                />
              </feComponentTransfer>
              {name === "keep" ? (
                <feComposite in="SourceGraphic" in2="th" operator="in" />
              ) : (
                <>
                  <feComposite
                    in="SourceGraphic"
                    in2="th"
                    operator="in"
                    result="wide"
                  />
                  <feFlood floodColor="#FFD58A" result="gold" />
                  <feComposite in="gold" in2="wide" operator="in" result="g" />
                  <feGaussianBlur in="g" stdDeviation="3.5" />
                </>
              )}
            </filter>
          );
        })}
      </defs>
    </svg>
  );
  const img = (f: string, extra?: React.CSSProperties) => (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        filter: `url(#${id}-${f})`,
        ...extra,
      }}
    />
  );
  const [bx, by, bw, bh] = box;
  return (
    <AbsoluteFill style={style}>
      {filters}
      {p < 1 ? img("edge", { mixBlendMode: "screen" }) : null}
      {p < 1 ? img("keep") : null}
      {/* dust: each grain is born where the burn front passes and drifts up and away */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        {Array.from({ length: 220 }).map((_, i) => {
          const born = random(`db${i}`) * 0.9;
          const life = interpolate(p, [born, born + 0.35], [0, 1], clamp);
          if (life <= 0 || life >= 1) return null;
          const x0 = bx + random(`dx${i}`) * bw;
          const y0 = by + random(`dy${i}`) * bh;
          const drift = life * (120 + random(`dv${i}`) * 260);
          const x = x0 + drift * 0.9 + Math.sin(frame / 9 + i) * 6;
          const y = y0 - drift * 0.55;
          const r = 1 + random(`dr${i}`) * 2.6;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r * (1 - life * 0.5)}
              fill={i % 5 === 0 ? "#FFF3D6" : COLOR.gold}
              opacity={(1 - life) * 0.9}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- measured glyphs ----------
// Per-character advances measured in the browser once the brand fonts are ready, so letters that fly
// into a word land with the font's own spacing.
const useAdvances = (text: string, font: string, tracking: number) => {
  const [handle] = useState(() => delayRender(`measure ${text}`));
  const [adv, setAdv] = useState<number[] | null>(null);
  useEffect(() => {
    let done = false;
    document.fonts
      .load(font, text)
      .then(() => document.fonts.ready)
      .then(() => {
        if (done) return;
        const ctx = document.createElement("canvas").getContext("2d");
        if (!ctx) return;
        ctx.font = font;
        const out: number[] = [];
        for (let i = 0; i < text.length; i++) {
          // advance of char i = width(prefix i+1) - width(prefix i), keeps kerning pairs
          out.push(
            ctx.measureText(text.slice(0, i + 1)).width -
              ctx.measureText(text.slice(0, i)).width +
              tracking,
          );
        }
        setAdv(out);
        continueRender(handle);
      });
    return () => {
      done = true;
    };
  }, [font, text, tracking, handle]);
  return adv;
};
const positions = (adv: number[], cx: number) => {
  const total = adv.reduce((a, b) => a + b, 0);
  let x = cx - total / 2;
  return adv.map((w) => {
    const p = x;
    x += w;
    return p;
  });
};

const ROW = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
type Word = {
  text: string;
  at: number;
  y: number;
  size: number;
  style: React.CSSProperties;
  font: string;
  tracking: number;
  color: string;
  glow: string;
};

// ---------- the alphabet scene ----------
// One alphabet in the middle. Letters lift out of it and fly, morphing typeface on the way, to write
// "a love letter" above in warm script and "a military order" below in cold type.
export const AlphabetScene: React.FC<{
  love: Word;
  order: Word;
  rowY?: number;
}> = ({ love, order, rowY = 520 }) => {
  const frame = useCurrentFrame();
  const rowSize = 54;
  const rowFont = `200 ${rowSize}px "${FONT.body}"`;
  const rowTrack = 26;
  const rowAdv = useAdvances(ROW, rowFont, rowTrack);
  const loveAdv = useAdvances(love.text, love.font, love.tracking);
  const orderAdv = useAdvances(order.text, order.font, order.tracking);
  if (!rowAdv || !loveAdv || !orderAdv) return null;
  const rowX = positions(rowAdv, 960);
  const rowIn = interpolate(frame, [0, 24], [0, 1], clamp);
  const used = new Map<number, number>();

  const fly = (w: Word, adv: number[], key: string) => {
    const xs = positions(adv, 960);
    let n = 0;
    return w.text.split("").map((ch, i) => {
      if (ch === " ") return null;
      const k = ROW.indexOf(ch.toUpperCase());
      const t0 = w.at + n++ * 3.2;
      const p = interpolate(frame, [t0, t0 + 30], [0, 1], {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      });
      if (k >= 0 && p > 0 && p < 1)
        used.set(k, Math.max(used.get(k) ?? 0, Math.sin(p * Math.PI)));
      const sx = k >= 0 ? rowX[k] : xs[i];
      const sy = rowY;
      const x = sx + (xs[i] - sx) * p;
      const arc = Math.sin(p * Math.PI) * (w.y < rowY ? -60 : 60);
      const y = sy + (w.y - sy) * p + arc;
      const morph = interpolate(p, [0.35, 0.75], [0, 1], clamp);
      const s = (rowSize + (w.size - rowSize) * p) / w.size;
      return (
        <div
          key={`${key}${i}`}
          style={{
            position: "absolute",
            left: x,
            top: y,
            opacity: p > 0 ? 1 : 0,
          }}
        >
          {/* the row's thin capital, fading out mid-flight */}
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              fontFamily: FONT.body,
              fontWeight: 200,
              fontSize: rowSize,
              lineHeight: 1,
              color: COLOR.white,
              opacity: 1 - morph,
              scale: String(1 + 0.6 * p),
              transformOrigin: "0 100%",
            }}
          >
            {ch.toUpperCase()}
          </div>
          {/* the word's own letterform, fading in */}
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              ...w.style,
              fontSize: w.size,
              lineHeight: 1,
              color: w.color,
              opacity: morph,
              scale: String(s),
              transformOrigin: "0 100%",
              textShadow: morph > 0.98 ? w.glow : undefined,
              whiteSpace: "pre",
            }}
          >
            {ch}
          </div>
        </div>
      );
    });
  };
  const loveEls = fly(love, loveAdv, "l");
  const orderEls = fly(order, orderAdv, "o");
  return (
    <AbsoluteFill>
      {ROW.split("").map((c, k) => {
        const hot = used.get(k) ?? 0;
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: rowX[k],
              top: rowY - rowSize,
              fontFamily: FONT.body,
              fontWeight: 200,
              fontSize: rowSize,
              lineHeight: 1,
              color: hot > 0.05 ? COLOR.gold : COLOR.white,
              opacity: rowIn * (0.55 + 0.45 * hot),
              translate: `0px ${(1 - rowIn) * 20}px`,
              textShadow:
                hot > 0.05 ? `0 0 ${18 * hot}px ${COLOR.gold}` : undefined,
            }}
          >
            {c}
          </div>
        );
      })}
      {loveEls}
      {orderEls}
    </AbsoluteFill>
  );
};
