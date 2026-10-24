#!/usr/bin/env bash
# Hip-hop episode finals: bash scripts/render-hiphop.sh <batch>
set -euo pipefail
what="${1:-}"
render() { npx remotion render "$1" "$2" --crf=10 --x264-preset=slow --audio-bitrate=320k --log=error; }

if [[ "$what" == open ]]; then
  O=out/hiphop/open && mkdir -p "$O"
  render hiphop-o01-august-11-1973 "$O/01-august-11-1973.mp4"
  render hiphop-o02-one-party-one-night "$O/02-one-party-one-night.mp4"
  render hiphop-o03-the-day-before "$O/03-the-day-before.mp4"
  render hiphop-o04-title-card "$O/04-title-card.mp4"
  ls -la "$O"
fi

if [[ "$what" == ch1 ]]; then
  O=out/hiphop/ch1 && mkdir -p "$O"
  render hiphop-c1-01-before-the-birthday "$O/01-before-the-birthday.mp4"
  render hiphop-c1-02-economic-pressure "$O/02-economic-pressure.mp4"
  render hiphop-c1-03-the-story-wrong "$O/03-the-story-wrong.mp4"
  render hiphop-c1-04-full-of-families "$O/04-full-of-families.mp4"
  render hiphop-c1-05-already-creating "$O/05-already-creating.mp4"
  render hiphop-c1-06-crossing-paths "$O/06-crossing-paths.mp4"
  render hiphop-c1-07-already-loud "$O/07-already-loud.mp4"
  ls -la "$O"
fi

if [[ "$what" == ch2 ]]; then
  O=out/hiphop/ch2 && mkdir -p "$O"
  render hiphop-c2-01-surrounded-by-records "$O/01-surrounded-by-records.mp4"
  render hiphop-c2-02-funk-soul-disco "$O/02-funk-soul-disco.mp4"
  render hiphop-c2-03-percussion "$O/03-percussion.mp4"
  render hiphop-c2-04-rhythm "$O/04-rhythm.mp4"
  npx remotion render hiphop-c2-05-space-overlay "$O/05-space-overlay_ALPHA.mov" --props='{"bg":"alpha"}' \
    --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png --muted --log=error
  npx remotion render hiphop-c2-05-space-overlay "$O/05-space-overlay_GREEN.mp4" --props='{"bg":"green"}' \
    --crf=10 --muted --log=error
  render hiphop-c2-06-verse-chorus-break "$O/06-verse-chorus-break.mp4"
  render hiphop-c2-07-djs-noticed "$O/07-djs-noticed.mp4"
  render hiphop-c2-08-clive-campbell "$O/08-clive-campbell.mp4"
  ls -la "$O"
fi
