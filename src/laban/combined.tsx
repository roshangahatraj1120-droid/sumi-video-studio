import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { OverlayProps } from "../brand/text";
import { COLOR } from "../brand/tokens";
import { FilmLook } from "../scenes/FilmLook";
import * as B from "./broll";
import * as O from "./overlays";

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

export const C01Portrait = withText(B.B01Portrait, O.O01Laban);
export const C02Writing = withText(B.B02Writing);
export const C03Teaser = withText(B.B03Teaser);
export const C04Written = withText(
  B.B04Written,
  O.O02Written,
  "radial-gradient(ellipse 62% 30% at 50% 50%, rgba(10,5,2,0.62), rgba(10,5,2,0) 100%)",
);
export const C06Verbs = withText(B.B05Verbs, O.O04Verbs);
export const C07Gone = withText(B.B06Gone);
export const C08Symbols = withText(B.B07Symbols);
export const C09Measure = withText(B.B08Measure, O.O05Measure);
export const C10Staff = withText(B.B09Staff, O.O06Alphabet);
export const C11Montage = withText(B.B10Montage, O.O07Topics);
export const C12Information = withText(B.B11Information, O.O08Information);

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
