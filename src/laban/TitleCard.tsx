import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLOR, FONT, TYPE } from "../brand/tokens";
import { GRADES, Still } from "../cine/Still";
import { Finish, img, Sfx } from "./broll";

// TITLE CARD: RUDOLF LABAN — THE MAN WHO TRIED TO WRITE DOWN MOVEMENT
// Background is the poster with its baked-in title removed; the title is rebuilt live in brand fonts.
export const TITLE_LEN = 210;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const CX = 1395; // centre of the title block, matching the poster layout
const IVORY = "#F1E6CF";

const Letters: React.FC<{
  text: string;
  start: number;
  stagger: number;
  style: React.CSSProperties;
  gold?: string;
}> = ({ text, start, stagger, style, gold }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  let n = 0;
  return (
    <div style={{ ...style, whiteSpace: "nowrap" }}>
      {words.map((w, wi) => {
        const isGold = w === gold;
        return (
          <React.Fragment key={wi}>
            {wi > 0 ? " " : null}
            {w.split("").map((c) => {
              const t0 = start + n++ * stagger;
              const t = interpolate(frame, [t0, t0 + 14], [0, 1], {
                ...clamp,
                easing: Easing.out(Easing.cubic),
              });
              return (
                <span
                  key={n}
                  style={{
                    display: "inline-block",
                    opacity: t,
                    filter: `blur(${(1 - t) * 8}px)`,
                    translate: `0px ${(1 - t) * 26}px`,
                    color: isGold ? COLOR.gold : undefined,
                    textShadow: isGold
                      ? `0 0 22px ${COLOR.gold}99, 0 3px 14px rgba(0,0,0,0.9)`
                      : undefined,
                  }}
                >
                  {c}
                </span>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const streak = interpolate(frame, [40, 72], [-10, 110], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const line = interpolate(frame, [62, 86], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const sweep = interpolate(frame, [6, 130], [1250, -500], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const titleGlow = 0.55 + 0.25 * Math.sin(frame / 18);

  return (
    <Finish dust={0.55}>
      <Still
        src={img("title/plate")}
        from={{ s: 1.0, x: 0.6 }}
        to={{ s: 1.07, x: -0.8 }}
        ease={Easing.out(Easing.sin)}
        grade={GRADES.natural}
      />
      {/* warm light travelling up the notation columns */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 520px 260px at ${CX}px ${sweep}px, rgba(232,194,122,0.22), rgba(232,194,122,0) 70%)`,
          mixBlendMode: "screen",
        }}
      />
      {/* gentle pool of light behind the title */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 560px 240px at ${CX}px 600px, rgba(232,194,122,${0.08 * line}), rgba(0,0,0,0) 70%)`,
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: CX - 520,
          width: 1040,
          top: 455,
          textAlign: "center",
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <Letters
            text="RUDOLF LABAN"
            start={34}
            stagger={2}
            style={{
              fontFamily: FONT.headline,
              fontWeight: 500,
              fontSize: 118,
              lineHeight: 1,
              letterSpacing: "0.06em",
              color: IVORY,
              textShadow: `0 0 ${18 + titleGlow * 14}px rgba(241,230,207,${0.25 + titleGlow * 0.15}), 0 4px 18px rgba(0,0,0,0.9)`,
            }}
          />
          {/* light streak riding across the name */}
          <div
            style={{
              position: "absolute",
              top: -14,
              left: `${streak}%`,
              width: 8,
              height: 150,
              rotate: "16deg",
              background:
                "linear-gradient(180deg, rgba(255,244,215,0), rgba(255,244,215,0.95), rgba(255,244,215,0))",
              filter: "blur(2px)",
              opacity: streak > -10 && streak < 110 ? 1 : 0,
            }}
          />
        </div>
        {/* divider drawing out from a centre diamond */}
        <div style={{ position: "relative", height: 34, marginTop: 26 }}>
          {[-1, 1].map((d) => (
            <div
              key={d}
              style={{
                position: "absolute",
                top: 16,
                left: d < 0 ? 520 - 360 * line : 520,
                width: 360 * line,
                height: 2.5,
                background: `linear-gradient(${d < 0 ? 90 : 270}deg, rgba(232,194,122,0.15), ${COLOR.gold})`,
                boxShadow: `0 0 8px ${COLOR.gold}88`,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: 11,
              left: 515,
              width: 11,
              height: 11,
              rotate: "45deg",
              background: COLOR.gold,
              boxShadow: `0 0 12px ${COLOR.gold}`,
              scale: String(line),
            }}
          />
        </div>
        <Letters
          text="THE MAN WHO TRIED TO"
          start={78}
          stagger={0.9}
          style={{
            ...TYPE.body,
            fontFamily: FONT.headline,
            fontWeight: 500,
            fontSize: 58,
            lineHeight: 1.25,
            letterSpacing: `${interpolate(frame, [78, 130], [0.2, 0.09], { ...clamp, easing: Easing.out(Easing.cubic) })}em`,
            color: IVORY,
            marginTop: 14,
            textShadow: "0 3px 14px rgba(0,0,0,0.9)",
          }}
        />
        <Letters
          text="WRITE DOWN MOVEMENT"
          start={92}
          stagger={0.9}
          gold="MOVEMENT"
          style={{
            fontFamily: FONT.headline,
            fontWeight: 500,
            fontSize: 58,
            lineHeight: 1.25,
            letterSpacing: `${interpolate(frame, [92, 144], [0.2, 0.09], { ...clamp, easing: Easing.out(Easing.cubic) })}em`,
            color: IVORY,
            textShadow: "0 3px 14px rgba(0,0,0,0.9)",
          }}
        />
      </div>
      {/* fade up from black */}
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: interpolate(frame, [0, 22], [1, 0], clamp),
        }}
      />
      <Sfx name="drone" at={0} volume={0.3} />
      <Sfx name="riser" at={8} volume={0.3} />
      <Sfx name="boom" at={38} volume={0.55} />
      <Sfx name="whoosh" at={60} volume={0.45} />
      <Sfx name="hit" at={104} volume={0.3} />
    </Finish>
  );
};
