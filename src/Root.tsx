import * as LB from "./laban/broll";
import * as LO from "./laban/overlays";
import { LEN } from "./laban/timing";
import { overlaySchema } from "./brand/text";
import { Composition, Folder, Still } from "remotion";
import { WallTexture } from "./egypt/WallTexture";
import { CINE_DURATION, CineVideo } from "./cine/CineVideo";
import { BrandBoard, brandBoardSchema } from "./brand/BrandBoard";
import { S1Ancient } from "./egypt/scenes/S1Ancient";
import { S2Life } from "./egypt/scenes/S2Life";
import { S3Connect } from "./egypt/scenes/S3Connect";
import { S4Clappers } from "./egypt/scenes/S4Clappers";
import { S5Contexts } from "./egypt/scenes/S5Contexts";
import { S6Goddesses } from "./egypt/scenes/S6Goddesses";
import { EGYPT_VIDEO_DURATION, EgyptVideo } from "./egypt/EgyptVideo";
import { DANCE_VIDEO_DURATION, DanceVideo } from "./DanceVideo";
import { ThinkScene } from "./scenes/ThinkScene";
import { MusicScene } from "./scenes/MusicScene";
import { WordsScene } from "./scenes/WordsScene";
import { ArchitectureScene } from "./scenes/ArchitectureScene";
import { ButDanceScene } from "./scenes/ButDanceScene";
import { DancerScene } from "./scenes/DancerScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DanceVideo"
        component={DanceVideo}
        durationInFrames={DANCE_VIDEO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EgyptCinematic"
        component={CineVideo}
        durationInFrames={CINE_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EgyptVideo"
        component={EgyptVideo}
        durationInFrames={EGYPT_VIDEO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="EgyptVideo-Scenes">
        <Composition
          id="S1Ancient"
          component={S1Ancient}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="S2Life"
          component={S2Life}
          durationInFrames={135}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="S3Connect"
          component={S3Connect}
          durationInFrames={165}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="S4Clappers"
          component={S4Clappers}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="S5Contexts"
          component={S5Contexts}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="S6Goddesses"
          component={S6Goddesses}
          durationInFrames={165}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="Laban-Broll">
        <Composition
          id="laban-b01-portrait"
          component={LB.B01Portrait}
          durationInFrames={LEN.portrait}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-b02-writing"
          component={LB.B02Writing}
          durationInFrames={LEN.writing}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-b03-teaser"
          component={LB.B03Teaser}
          durationInFrames={LEN.teaser}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-b04-written"
          component={LB.B04Written}
          durationInFrames={LEN.written}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-b05-verbs"
          component={LB.B05Verbs}
          durationInFrames={LEN.verbs}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-b06-gone"
          component={LB.B06Gone}
          durationInFrames={LEN.gone}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-b07-symbols"
          component={LB.B07Symbols}
          durationInFrames={LEN.symbols}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-b08-measure"
          component={LB.B08Measure}
          durationInFrames={LEN.measure}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-b09-staff"
          component={LB.B09Staff}
          durationInFrames={LEN.staff}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-b10-montage"
          component={LB.B10Montage}
          durationInFrames={LEN.montage}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-b11-information"
          component={LB.B11Information}
          durationInFrames={LEN.information}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="Laban-Overlays">
        <Composition
          id="laban-o01-laban"
          component={LO.O01Laban}
          schema={overlaySchema}
          defaultProps={{ bg: "green" as const }}
          durationInFrames={LEN.portrait}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-o02-written"
          component={LO.O02Written}
          schema={overlaySchema}
          defaultProps={{ bg: "green" as const }}
          durationInFrames={LEN.written}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-o03-question"
          component={LO.O03Question}
          schema={overlaySchema}
          defaultProps={{ bg: "green" as const }}
          durationInFrames={LEN.question}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-o04-verbs"
          component={LO.O04Verbs}
          schema={overlaySchema}
          defaultProps={{ bg: "green" as const }}
          durationInFrames={LEN.verbs}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-o05-measure"
          component={LO.O05Measure}
          schema={overlaySchema}
          defaultProps={{ bg: "green" as const }}
          durationInFrames={LEN.measure}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-o06-alphabet"
          component={LO.O06Alphabet}
          schema={overlaySchema}
          defaultProps={{ bg: "green" as const }}
          durationInFrames={LEN.staff}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-o07-topics"
          component={LO.O07Topics}
          schema={overlaySchema}
          defaultProps={{ bg: "green" as const }}
          durationInFrames={LEN.montage}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="laban-o08-information"
          component={LO.O08Information}
          schema={overlaySchema}
          defaultProps={{ bg: "green" as const }}
          durationInFrames={LEN.information}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Still
        id="BrandBoard"
        component={BrandBoard}
        schema={brandBoardSchema}
        defaultProps={{ option: 0 }}
        width={1920}
        height={1080}
      />
      <Still
        id="WallTexture"
        component={WallTexture}
        width={2600}
        height={1500}
      />
      <Folder name="DanceVideo-Scenes">
        <Composition
          id="Think"
          component={ThinkScene}
          durationInFrames={78}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Music"
          component={MusicScene}
          durationInFrames={75}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Words"
          component={WordsScene}
          durationInFrames={72}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Architecture"
          component={ArchitectureScene}
          durationInFrames={78}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ButDance"
          component={ButDanceScene}
          durationInFrames={66}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Dancer"
          component={DancerScene}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
