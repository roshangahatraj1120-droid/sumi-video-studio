#!/usr/bin/env bash
# Renders the Laban intro deliverables for the CapCut edit.
# B-roll: H.264 MP4 with SFX. Overlays: chroma-green H.264 MP4 + ProRes 4444 with alpha.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=out/laban
mkdir -p "$OUT/broll" "$OUT/text-green" "$OUT/text-alpha"

# order | composition | file name
BROLL=(
  "01 laban-b01-portrait    laban-portrait"
  "02 laban-b02-writing     laban-writing"
  "03 laban-b03-teaser      teaser-flash"
  "04 laban-b04-written     music-words-architecture"
  "06 laban-b05-verbs       jumps-turns-reaches-falls"
  "07 laban-b06-gone        movement-is-gone"
  "08 laban-b07-symbols     geometric-symbols"
  "09 laban-b08-measure     where-high-low-long"
  "10 laban-b09-staff       notation-staff"
  "11 laban-b10-montage     montage-stranger"
  "12 laban-b11-information movement-becomes-information"
)
TEXT=(
  "01 laban-o01-laban       label-rudolf-laban"
  "04 laban-o02-written     words-written-down"
  "05 laban-o03-question    but-dance"
  "06 laban-o04-verbs       verbs"
  "09 laban-o05-measure     where-high-low-long"
  "10 laban-o06-alphabet    keyline-alphabet"
  "11 laban-o07-topics      montage-topics"
  "12 laban-o08-information keyline-information"
)

what="${1:-all}"
if [[ "$what" == all || "$what" == broll ]]; then
  for row in "${BROLL[@]}"; do
    read -r n id name <<<"$row"
    npx remotion render "$id" "$OUT/broll/${n}_BROLL_${name}.mp4" --crf=16 --log=error
  done
fi
if [[ "$what" == all || "$what" == text ]]; then
  for row in "${TEXT[@]}"; do
    read -r n id name <<<"$row"
    npx remotion render "$id" "$OUT/text-green/${n}_TEXT_${name}_GREEN.mp4" --props='{"bg":"green"}' --crf=14 --muted --log=error
    npx remotion render "$id" "$OUT/text-alpha/${n}_TEXT_${name}_ALPHA.mov" --props='{"bg":"alpha"}' \
      --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png --muted --log=error
  done
fi
[[ "$what" == all || "$what" == broll || "$what" == text ]] && ls -la "$OUT"/*

# Final: B-roll with text baked in, highest-quality H.264 for direct use in CapCut
if [[ "$what" == final ]]; then
  mkdir -p "$OUT/final"
  for id in $(npx remotion compositions --quiet 2>/dev/null | tr ' ' '\n' | grep '^laban-c'); do
    name="${id#laban-c}"
    npx remotion render "$id" "$OUT/final/${name}.mp4" --crf=10 --x264-preset=slow --audio-bitrate=320k --log=error
  done
  ls -la "$OUT/final"
fi

# Part 2 finals, plus the five-concepts diagram as an overlay for the host shots
if [[ "$what" == part2 ]]; then
  P2=out/laban2/final
  mkdir -p "$P2/overlays"
  for id in $(npx remotion compositions --quiet 2>/dev/null | tr ' ' '\n' | grep '^laban2-c'); do
    npx remotion render "$id" "$P2/${id#laban2-c}.mp4" --crf=10 --x264-preset=slow --audio-bitrate=320k --log=error
  done
  for side in left right; do
    npx remotion render laban2-o04-concepts-overlay "$P2/overlays/04-concepts-${side}_GREEN.mp4" \
      --props="{\"bg\":\"green\",\"side\":\"$side\"}" --crf=10 --muted --log=error
    npx remotion render laban2-o04-concepts-overlay "$P2/overlays/04-concepts-${side}_ALPHA.mov" \
      --props="{\"bg\":\"alpha\",\"side\":\"$side\"}" --codec=prores --prores-profile=4444 \
      --pixel-format=yuva444p10le --image-format=png --muted --log=error
  done
  ls -la "$P2" "$P2/overlays"
fi

# Part 3 finals: how the notation works
if [[ "$what" == part3 ]]; then
  P3=out/laban3/final
  mkdir -p "$P3"
  for id in $(npx remotion compositions --quiet 2>/dev/null | tr ' ' '\n' | grep '^laban3-c'); do
    npx remotion render "$id" "$P3/${id#laban3-c}.mp4" --crf=10 --x264-preset=slow --audio-bitrate=320k --log=error
  done
  ls -la "$P3"
fi

# Part 4 finals: politics
if [[ "$what" == part4 ]]; then
  P4=out/laban4/final
  mkdir -p "$P4"
  for id in $(npx remotion compositions --quiet 2>/dev/null | tr ' ' '\n' | grep '^laban4-c'); do
    npx remotion render "$id" "$P4/${id#laban4-c}.mp4" --crf=10 --x264-preset=slow --audio-bitrate=320k --log=error
  done
  ls -la "$P4"
fi
