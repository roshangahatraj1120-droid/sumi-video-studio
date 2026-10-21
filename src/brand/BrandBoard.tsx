import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { z } from "zod";

const FONTS: [string, string, string][] = [
  ["Bebas Neue", "fonts/BebasNeue.woff2", "400"],
  ["Inter Var", "fonts/InterVar.woff2", "100 900"],
  ["Montserrat Var", "fonts/MontserratVar.woff2", "100 900"],
  ["Anton", "fonts/Anton.woff2", "400"],
  ["Space Grotesk Var", "fonts/SpaceGroteskVar.woff2", "300 700"],
  ["Playfair Display", "fonts/PlayfairDisplay.woff2", "400 900"],
  ["Cormorant Italic", "fonts/CormorantItalic.woff2", "400 700"],
];
FONTS.forEach(([family, url, weight]) =>
  loadFont({ family, url: staticFile(url), weight }),
);

type Direction = {
  name: string;
  mood: string;
  headline: string;
  body: string;
  label: string;
  accent: string;
  accent2: string;
  ink: string;
  headlineWeight: number;
  headlineCase: "uppercase" | "none";
  headlineItalic?: boolean;
  thinFont: string;
  headlineSize: number;
};

export const DIRECTIONS: Direction[] = [
  {
    name: "A · SPOTLIGHT GOLD",
    mood: "Cinematic documentary, closest to the master reference",
    headline: "Bebas Neue",
    body: "Inter Var",
    label: "Bebas Neue",
    accent: "#F5B841",
    accent2: "#C8102E",
    ink: "#0B0A09",
    headlineWeight: 400,
    headlineCase: "uppercase",
    thinFont: "Inter Var",
    headlineSize: 92,
  },
  {
    name: "B · VELVET STAGE",
    mood: "Elegant and artistic, stage-light rose and gold",
    headline: "Playfair Display",
    body: "Montserrat Var",
    label: "Montserrat Var",
    accent: "#E8C27A",
    accent2: "#E0457B",
    ink: "#0D0710",
    headlineWeight: 700,
    headlineCase: "none",
    headlineItalic: true,
    thinFont: "Montserrat Var",
    headlineSize: 70,
  },
  {
    name: "C · KINETIC",
    mood: "Modern and energetic, dance-forward",
    headline: "Anton",
    body: "Space Grotesk Var",
    label: "Space Grotesk Var",
    accent: "#B6FF3B",
    accent2: "#7B5CFF",
    ink: "#08080C",
    headlineWeight: 400,
    headlineCase: "uppercase",
    thinFont: "Space Grotesk Var",
    headlineSize: 76,
  },
];

export const brandBoardSchema = z.object({
  option: z.number().int().min(0).max(2),
});

const glow = (c: string) =>
  `0 0 10px ${c}aa, 0 0 26px ${c}66, 0 2px 10px rgba(0,0,0,0.8)`;

export const BrandBoard: React.FC<z.infer<typeof brandBoardSchema>> = ({
  option,
}) => {
  const d = DIRECTIONS[option];
  return (
    <AbsoluteFill style={{ backgroundColor: d.ink, fontFamily: d.body }}>
      {/* sample footage */}
      <Img
        src={staticFile("egypt/shots/img2.jpg")}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1240,
          height: 698,
          objectFit: "cover",
          filter: "contrast(1.05) brightness(0.8)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1240,
          height: 698,
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      {/* key line */}
      <div style={{ position: "absolute", left: 70, top: 380, width: 1100 }}>
        <div
          style={{
            fontFamily: d.headline,
            fontWeight: d.headlineWeight,
            fontStyle: d.headlineItalic ? "italic" : "normal",
            textTransform: d.headlineCase,
            fontSize: d.headlineSize,
            whiteSpace: "nowrap",
            lineHeight: 1,
            color: d.accent,
            textShadow: glow(d.accent),
          }}
        >
          {d.headlineCase === "uppercase"
            ? "Dance was never written down."
            : "Dance was never written down."}
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: d.body,
            fontWeight: 500,
            fontSize: 34,
            color: "#FFFFFF",
            textShadow: "0 2px 12px rgba(0,0,0,0.9)",
          }}
        >
          So how did it survive 3,000 years?
          <span
            style={{
              display: "inline-block",
              width: 16,
              height: 34,
              marginLeft: 6,
              verticalAlign: "-4px",
              background: d.accent2,
            }}
          />
        </div>
      </div>
      {/* keyword label */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 600,
          fontFamily: d.label,
          fontWeight: d.label === "Bebas Neue" ? 400 : 700,
          fontSize: 44,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: d.accent,
          textShadow: glow(d.accent),
        }}
      >
        Bharatanatyam
      </div>
      {/* right column: palette + type specimen */}
      <div
        style={{
          position: "absolute",
          left: 1290,
          top: 50,
          width: 580,
          color: "#F4F1EA",
        }}
      >
        <div
          style={{
            fontFamily: d.body,
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: "0.04em",
          }}
        >
          {d.name}
        </div>
        <div
          style={{
            fontFamily: d.body,
            fontWeight: 400,
            fontSize: 22,
            opacity: 0.7,
            marginTop: 6,
          }}
        >
          {d.mood}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
          {[d.ink, d.accent, d.accent2, "#F4F1EA"].map((c) => (
            <div key={c} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 120,
                  height: 84,
                  borderRadius: 10,
                  background: c,
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              />
              <div
                style={{
                  fontFamily: d.body,
                  fontSize: 18,
                  marginTop: 6,
                  opacity: 0.8,
                }}
              >
                {c}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 34,
            fontSize: 20,
            opacity: 0.6,
            fontFamily: d.body,
          }}
        >
          HEADLINES · {d.headline.replace(" Var", "")}
        </div>
        <div
          style={{
            fontFamily: d.headline,
            fontWeight: d.headlineWeight,
            fontStyle: d.headlineItalic ? "italic" : "normal",
            textTransform: d.headlineCase,
            fontSize: 70,
            lineHeight: 1.05,
          }}
        >
          The Lost Dances
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 20,
            opacity: 0.6,
            fontFamily: d.body,
          }}
        >
          BODY & LABELS · {d.body.replace(" Var", "")}
        </div>
        <div
          style={{
            fontFamily: d.body,
            fontWeight: 400,
            fontSize: 28,
            lineHeight: 1.35,
          }}
        >
          Thousands of years ago, movement was already part of ritual and
          celebration.
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: 20,
            opacity: 0.6,
            fontFamily: d.body,
          }}
        >
          THIN + HEAVY CONTRAST
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            fontSize: 66,
            lineHeight: 1,
          }}
        >
          <span style={{ fontFamily: d.thinFont, fontWeight: 200 }}>
            RITUAL
          </span>
          <span
            style={{ fontFamily: d.thinFont, fontWeight: 900, color: d.accent }}
          >
            {d.thinFont === "Space Grotesk Var" ? "PARTY" : "PARTY"}
          </span>
        </div>
      </div>
      {/* subscribe card mock (placeholder numbers) */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 750,
          width: 1170,
          height: 280,
          borderRadius: 14,
          background: "#121212",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 760,
            padding: "26px 34px",
            borderRadius: 14,
            background: "#FFFFFF",
            boxShadow: `0 0 60px ${d.accent2}55`,
          }}
        >
          {[
            ["Not subscribed", 63],
            ["Subscribed", 37],
          ].map(([label, v]) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
                fontFamily: d.body,
                fontSize: 24,
                color: "#222",
              }}
            >
              <div style={{ width: 230 }}>{label}</div>
              <div
                style={{
                  flex: 1,
                  height: 12,
                  borderRadius: 6,
                  background: "#eee",
                  marginRight: 16,
                }}
              >
                <div
                  style={{
                    width: `${v}%`,
                    height: 12,
                    borderRadius: 6,
                    background: d.accent2,
                  }}
                />
              </div>
              <div style={{ width: 70, textAlign: "right", fontWeight: 600 }}>
                {v}%
              </div>
            </div>
          ))}
          <div
            style={{
              fontFamily: d.headline,
              fontWeight: d.headlineWeight,
              fontStyle: d.headlineItalic ? "italic" : "normal",
              textTransform: d.headlineCase,
              fontSize: 40,
              color: "#111",
              marginTop: 4,
            }}
          >
            Be part of the 37%.
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1290,
          top: 1000,
          fontFamily: d.body,
          fontSize: 18,
          opacity: 0.45,
          color: "#fff",
        }}
      >
        Subscribe-card numbers are placeholders — the real card uses your
        YouTube Studio stats.
      </div>
    </AbsoluteFill>
  );
};
