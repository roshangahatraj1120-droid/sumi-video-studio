// Episode: Laban notation intro. All lengths in frames at 30 fps.
// Each overlay shares its B-roll clip's length so the pair can be stacked at the same start point in CapCut.
export const FPS = 30;

export const LEN = {
  portrait: 180,
  writing: 150,
  teaser: 66,
  written: 180,
  question: 90,
  verbs: 126,
  gone: 150,
  symbols: 180,
  measure: 270,
  staff: 270,
  montage: 318,
  information: 240,
};

// clip 02: Laban writing → movement studio on "human movement"
export const WRITING_SPLIT = 80;
export const WRITTEN_CUTS = [0, 60, 120];
export const VERB_CUTS = [0, 27, 54, 81];
// clip 08: hand drawing (12) → finished notation sheet (15)
export const SYMBOLS_SPLIT = 84;
export const MEASURE_SPLIT = 135;
export const TEASER_CUTS = [0, 22, 44];
export const MONTAGE_SHOT = 36;
export const MONTAGE_CUTS = [0, 1, 2, 3, 4, 5, 6, 7].map(
  (i) => i * MONTAGE_SHOT,
);
export const MONTAGE_TOPICS = [
  { img: "16", label: "Nazi cultural politics" },
  { img: "17", label: "Wartime factories" },
  { img: "18", label: "Broadway copyright" },
  { img: "19", label: "Corporate hiring" },
  { img: "22", label: "Military analysis" },
  { img: "20", label: "Therapy" },
  { img: "21", label: "Anthropology" },
  { img: "23", label: "Machines that read motion" },
];
