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

if [[ "$what" == ch1v2 ]]; then
  O=out/hiphop/ch1-v2 && mkdir -p "$O"
  render hiphop-c1v2-01-bronx "$O/01-bronx-before-the-birthday.mp4"
  render hiphop-c1v2-02-pressure "$O/02-economic-pressure.mp4"
  render hiphop-c1v2-03-wrong "$O/03-the-story-wrong.mp4"
  render hiphop-c1v2-04-families "$O/04-families-to-community.mp4"
  render hiphop-c1v2-05-already-creating "$O/05-already-creating.mp4"
  render hiphop-c1v2-06-crossing-paths "$O/06-crossing-paths.mp4"
  render hiphop-c1v2-07-already-loud "$O/07-already-loud.mp4"
  ls -la "$O"
fi

if [[ "$what" == ch3a ]]; then
  O=out/hiphop/ch3a && mkdir -p "$O"
  render hiphop-c3-01-1520-sedgwick "$O/01-1520-sedgwick.mp4"
  render hiphop-c3-02-in-the-frame "$O/02-in-the-frame-too.mp4"
  render hiphop-c3-03-disco-ball "$O/03-disco-ball.mp4"
  render hiphop-c3-04-aug-11-floor-plan "$O/04-aug-11-1973-floor-plan.mp4"
  render hiphop-c3-05-a-window "$O/05-a-window.mp4"
  render hiphop-c3-06-the-break "$O/06-the-break-extended.mp4"
  ls -la "$O"
fi

if [[ "$what" == ch4 ]]; then
  O=out/hiphop/ch4 && mkdir -p "$O"
  render hiphop-c4-01-imagine-the-break "$O/01-imagine-the-break.mp4"
  npx remotion render hiphop-c4-02-it-is-gone-overlay "$O/02-it-is-gone-overlay_ALPHA.mov" --props='{"bg":"alpha"}' \
    --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png --muted --log=error
  npx remotion render hiphop-c4-02-it-is-gone-overlay "$O/02-it-is-gone-overlay_GREEN.mp4" --props='{"bg":"green"}' \
    --crf=10 --muted --log=error
  render hiphop-c4-03-again "$O/03-again-and-again.mp4"
  render hiphop-c4-04-time "$O/04-the-dancer-has-time.mp4"
  render hiphop-c4-05-time-to "$O/05-time-to.mp4"
  render hiphop-c4-06-dj-and-floor "$O/06-dj-and-floor.mp4"
  render hiphop-c4-07-bboy-bgirl-breaking "$O/07-bboy-bgirl-breaking.mp4"
  render hiphop-c4-08-breakdancing-media "$O/08-breakdancing-media.mp4"
  render hiphop-c4-09-inside-the-culture "$O/09-inside-the-culture-the-break.mp4"
  render hiphop-c4-10-developed "$O/10-developed-through.mp4"
  render hiphop-c4-11-early-accounts "$O/11-early-accounts.mp4"
  render hiphop-c4-12-bgirls "$O/12-bgirls-belong.mp4"
  render hiphop-c4-13-floor-language "$O/13-floor-language.mp4"
  ls -la "$O"
fi

if [[ "$what" == ch5 ]]; then
  O=out/hiphop/ch5 && mkdir -p "$O/overlays"
  render hiphop-c5-01-the-spectacular-moves "$O/01-the-spectacular-moves.mp4"
  render hiphop-c5-02-the-foundation "$O/02-the-foundation.mp4"
  render hiphop-c5-03-toprock "$O/03-toprock.mp4"
  render hiphop-c5-04-go-down "$O/04-go-down.mp4"
  render hiphop-c5-05-footwork "$O/05-footwork.mp4"
  render hiphop-c5-06-freeze-stop "$O/06-freeze-stop.mp4"
  render hiphop-c5-07-difficulty "$O/07-difficulty-not-foundation.mp4"
  render hiphop-c5-08-split-timing "$O/08-split-groove-vs-power.mp4"
  render hiphop-c5-09-evidence "$O/09-evidence.mp4"
  for ov in ov1-toprock ov2-go-down ov3-footwork ov4-freeze; do
    npx remotion render hiphop-c5-$ov "$O/overlays/$ov.ALPHA.mov" --props='{"bg":"alpha"}' \
      --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png --muted --log=error
    npx remotion render hiphop-c5-$ov "$O/overlays/$ov.GREEN.mp4" --props='{"bg":"green"}' --crf=10 --muted --log=error
  done
  ls -la "$O" "$O/overlays"
fi

if [[ "$what" == ch6 ]]; then
  O=out/hiphop/ch6 && mkdir -p "$O"
  render hiphop-c6-01-who-invented "$O/01-who-invented-hip-hop.mp4"
  render hiphop-c6-02-herc-not-alone "$O/02-herc-not-alone.mp4"
  render hiphop-c6-03-bambaataa "$O/03-bambaataa.mp4"
  render hiphop-c6-03b-bambaataa-with-note "$O/03b-bambaataa-WITH-NOTE.mp4"
  render hiphop-c6-04-flash "$O/04-grandmaster-flash.mp4"
  render hiphop-c6-05-theodore "$O/05-grand-wizzard-theodore.mp4"
  render hiphop-c6-06-mcs "$O/06-mcs.mp4"
  render hiphop-c6-07-circles-battles "$O/07-circles-battles-shared.mp4"
  render hiphop-c6-08-not-in-isolation "$O/08-not-in-isolation.mp4"
  render hiphop-c6-09-influences "$O/09-influences.mp4"
  render hiphop-c6-10-harder-to-date "$O/10-harder-to-date.mp4"
  render hiphop-c6-11-not-one-person "$O/11-not-one-person.mp4"
  render hiphop-c6-12-network-environment "$O/12-network-same-environment.mp4"
  ls -la "$O"
fi

if [[ "$what" == ch7 ]]; then
  O=out/hiphop/ch7 && mkdir -p "$O"
  for c in 01-was-it-born 02-a-moment-to-point-to 03-like-a-switch 04-bigger 05-djs 06-mcs 07-dancers-vocabulary 08-crews-parties-neighborhood 09-like-a-language 10-rhythm-to-move 11-it-was-built 12-the-story 14-end-card; do
    render hiphop-c7-$c "$O/$c.mp4"
  done
  npx remotion render hiphop-c7-13-subscribe-overlay "$O/13-subscribe-overlay_ALPHA.mov" --props='{"bg":"alpha"}' \
    --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png --muted --log=error
  npx remotion render hiphop-c7-13-subscribe-overlay "$O/13-subscribe-overlay_GREEN.mp4" --props='{"bg":"green"}' --crf=10 --muted --log=error
  ls -la "$O"
fi
