import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLOR, TYPE } from "../brand/tokens";

// Mid-video follow card, a lower third over the host's A-roll. 30 fps, 6s. The host's photo pops in and
// its ring draws round it; a glass panel slides out with "FOLLOW THE DANCER", the name, the handle and
// the credential line; the Follow button is tapped and flips to Following; a light sweep; then it all
// folds back into the photo. Rendered on green (CapCut Chroma key) and as ProRes 4444 with alpha.
export const FOLLOW_LEN = 180;

type Platform = "instagram" | "facebook";
type Bg = "green" | "alpha" | "preview";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
const easeIn = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });

const P = {
  instagram: {
    label: "Instagram",
    handle: "@_roshangahatraj",
    button: "#0095F6",
    ring: ["#FEDA75", "#FA7E1E", "#D62976", "#962FBF", "#4F5BD5"],
  },
  facebook: {
    label: "Facebook",
    handle: "facebook.com/stay.raw.52056",
    button: "#0866FF",
    ring: ["#0866FF", "#0866FF"],
  },
} as const;
const NAME = "Roshan Gahatraj";
const CRED = "Dancer · Choreographer · World of Dance Nepal";

// layout (frame pixels)
const AV = 168;
const AX = 96;
const AY = 1080 - 96 - AV;
const CX = AX + AV / 2;
const PANEL_W = 830;
const TX = AX + AV + 26;
const BTN = { w: 150, h: 48, x: CX + PANEL_W - 190 };

const TAP = 84;
const OUT = 148;

const Glyph: React.FC<{ platform: Platform; size: number }> = ({
  platform,
  size,
}) =>
  platform === "instagram" ? (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="igg" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FEDA75" />
          <stop offset="0.3" stopColor="#FA7E1E" />
          <stop offset="0.6" stopColor="#D62976" />
          <stop offset="0.85" stopColor="#962FBF" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="6"
        fill="none"
        stroke="url(#igg)"
        strokeWidth="2.2"
      />
      <circle
        cx="12"
        cy="12"
        r="4.6"
        fill="none"
        stroke="url(#igg)"
        strokeWidth="2.2"
      />
      <circle cx="17.6" cy="6.4" r="1.4" fill="url(#igg)" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#0866FF" />
      <path
        d="M13.4 24v-8.4h2.8l.5-3.3h-3.3v-2.1c0-.9.3-1.6 1.7-1.6h1.8V5.7c-.3 0-1.4-.2-2.6-.2-2.6 0-4.3 1.6-4.3 4.4v2.4H7.1v3.3H10V24z"
        fill="#fff"
      />
    </svg>
  );

export const FollowCard: React.FC<{ platform: Platform; bg: Bg }> = ({
  platform,
  bg,
}) => {
  const frame = useCurrentFrame();
  const p = P[platform];
  const green = bg === "green";

  // in
  const pop = interpolate(frame, [0, 10], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.8)),
  });
  const ring = ease(frame, 4, 22);
  const open = ease(frame, 12, 30);
  const row = (i: number) => ease(frame, 24 + i * 5, 36 + i * 5);
  const typed = Math.floor(
    interpolate(
      frame,
      [40, 40 + p.handle.length * 1.2],
      [0, p.handle.length],
      clamp,
    ),
  );
  // tap
  const tapT = frame - TAP;
  const press =
    tapT >= 0 && tapT < 8 ? 1 - 0.07 * Math.sin((tapT / 8) * Math.PI) : 1;
  const followed = frame >= TAP + 3;
  const ripple = tapT >= 0 ? ease(frame, TAP, TAP + 16) : 0;
  // light sweep
  const sweep = interpolate(frame, [100, 130], [-0.3, 1.3], clamp);
  // out
  const fold = easeIn(frame, OUT + 4, OUT + 20);
  const fade = 1 - easeIn(frame, OUT, OUT + 8);
  const gone = easeIn(frame, OUT + 18, OUT + 28);

  const panelW = PANEL_W * open * (1 - fold);
  const avScale = pop * (1 - gone);
  const ringLen = Math.PI * 2 * (AV / 2 + 7);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: green ? "#00FF00" : undefined,
      }}
    >
      {bg === "preview" ? (
        <Img
          src={staticFile("laban10/dancer-plate.jpg")}
          style={{
            position: "absolute",
            inset: 0,
            width: 1920,
            height: 1080,
            filter: "brightness(0.7)",
          }}
        />
      ) : null}

      {/* panel */}
      <div
        style={{
          position: "absolute",
          left: CX,
          top: AY,
          width: panelW,
          height: AV,
          overflow: "hidden",
          borderRadius: `0 ${AV / 2}px ${AV / 2}px 0`,
          background: green ? "#141117" : "rgba(14,12,18,0.86)",
          boxShadow: green ? undefined : "0 18px 50px rgba(0,0,0,0.45)",
          borderTop: `1.5px solid ${COLOR.gold}55`,
          borderBottom: `1.5px solid ${COLOR.gold}55`,
          borderRight: `1.5px solid ${COLOR.gold}55`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: TX - CX,
            top: 0,
            width: PANEL_W,
            height: AV,
            opacity: fade,
          }}
        >
          {/* row 1: platform + call */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 22,
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: row(0),
              translate: `${(1 - row(0)) * -14}px 0px`,
            }}
          >
            <Glyph platform={platform} size={26} />
            <span
              style={{
                ...TYPE.label,
                fontSize: 17,
                letterSpacing: "0.28em",
                color: COLOR.gold,
              }}
            >
              Follow the dancer
            </span>
          </div>
          {/* row 2: name */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 52,
              ...TYPE.headline,
              fontSize: 40,
              lineHeight: 1.1,
              color: COLOR.white,
              opacity: row(1),
              translate: `${(1 - row(1)) * -14}px 0px`,
              whiteSpace: "nowrap",
            }}
          >
            {NAME}
          </div>
          {/* row 3: handle, typed */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 102,
              ...TYPE.body,
              fontWeight: 600,
              fontSize: 22,
              color: COLOR.white,
              opacity: 0.88,
              whiteSpace: "nowrap",
            }}
          >
            {p.handle.slice(0, typed)}
            {typed > 0 && typed < p.handle.length ? (
              <span style={{ color: COLOR.gold }}>|</span>
            ) : null}
          </div>
          {/* row 4: credential */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 134,
              ...TYPE.label,
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "0.2em",
              color: COLOR.white,
              opacity: 0.6 * row(3),
              whiteSpace: "nowrap",
            }}
          >
            {CRED}
          </div>
        </div>

        {/* follow button */}
        <div
          style={{
            position: "absolute",
            left: BTN.x - CX,
            top: (AV - BTN.h) / 2,
            width: BTN.w,
            height: BTN.h,
            borderRadius: 12,
            background: followed ? "#2B2930" : p.button,
            border: followed ? "1.5px solid rgba(255,255,255,0.25)" : undefined,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            scale: String(press),
            opacity: row(2) * fade,
            ...TYPE.body,
            fontWeight: 700,
            fontSize: 20,
            color: "#fff",
          }}
        >
          {followed ? (
            <>
              Following
              <svg width={18} height={18} viewBox="0 0 24 24">
                <path
                  d="M4 12.5l5 5L20 6.5"
                  fill="none"
                  stroke="#fff"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          ) : (
            "Follow"
          )}
        </div>
        {/* tap ripple */}
        {ripple > 0 && ripple < 1 ? (
          <div
            style={{
              position: "absolute",
              left: BTN.x - CX + BTN.w / 2 - 50,
              top: AV / 2 - 50,
              width: 100,
              height: 100,
              borderRadius: 50,
              border: "2px solid rgba(255,255,255,0.9)",
              scale: String(0.3 + ripple * 1.2),
              opacity: 1 - ripple,
            }}
          />
        ) : null}

        {/* light sweep */}
        {!green && sweep > -0.3 && sweep < 1.3 ? (
          <div
            style={{
              position: "absolute",
              top: -40,
              left: sweep * PANEL_W - 80,
              width: 120,
              height: AV + 80,
              rotate: "18deg",
              background:
                "linear-gradient(90deg, rgba(255,240,210,0), rgba(255,240,210,0.16), rgba(255,240,210,0))",
            }}
          />
        ) : null}
      </div>

      {/* avatar + ring */}
      <div
        style={{
          position: "absolute",
          left: AX,
          top: AY,
          width: AV,
          height: AV,
          scale: String(avScale),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: AV / 2,
            background: green ? "#141117" : COLOR.ink,
          }}
        />
        <Img
          src={staticFile("social/avatar.png")}
          style={{
            position: "absolute",
            left: 9,
            top: 9,
            width: AV - 18,
            height: AV - 18,
            borderRadius: (AV - 18) / 2,
          }}
        />
        <svg
          width={AV + 30}
          height={AV + 30}
          style={{
            position: "absolute",
            left: -15,
            top: -15,
            overflow: "visible",
          }}
        >
          <defs>
            <linearGradient id={`ring-${platform}`} x1="0" y1="1" x2="1" y2="0">
              {p.ring.map((c, i) => (
                <stop key={i} offset={i / (p.ring.length - 1)} stopColor={c} />
              ))}
            </linearGradient>
          </defs>
          <circle
            cx={AV / 2 + 15}
            cy={AV / 2 + 15}
            r={AV / 2 + 7}
            fill="none"
            stroke={`url(#ring-${platform})`}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={ringLen}
            strokeDashoffset={ringLen * (1 - ring)}
            transform={`rotate(-90 ${AV / 2 + 15} ${AV / 2 + 15})`}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export const FollowInstagram: React.FC<{ bg: Bg }> = ({ bg }) => (
  <FollowCard platform="instagram" bg={bg} />
);
export const FollowFacebook: React.FC<{ bg: Bg }> = ({ bg }) => (
  <FollowCard platform="facebook" bg={bg} />
);
