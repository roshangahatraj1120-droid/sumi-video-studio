#!/usr/bin/env bash
# Synthesised starter SFX kit (placeholder until the channel's own sound pack arrives).
set -euo pipefail
OUT="$(dirname "$0")/../public/sfx"
mkdir -p "$OUT"
F="ffmpeg -loglevel error -y"
# Whoosh: band-passed noise sweeping up then down, 0.5 s
$F -f lavfi -i "anoisesrc=d=0.5:c=pink:a=0.9" -af "bandpass=f=900:w=1.2,volume='0.2+1.6*sin(PI*t/0.5)':eval=frame,afade=t=in:d=0.12,afade=t=out:st=0.3:d=0.2,highpass=f=200" -ar 48000 "$OUT/whoosh.wav"
# Hit: low sine thump + short click, 0.6 s
$F -f lavfi -i "aevalsrc='0.9*sin(2*PI*(48+60*exp(-t*30))*t)*exp(-t*7)+0.25*sin(2*PI*1800*t)*exp(-t*120)':d=0.6:s=48000" "$OUT/hit.wav"
# Boom: deep cinematic boom with long tail, 2 s
$F -f lavfi -i "aevalsrc='0.95*sin(2*PI*(38+40*exp(-t*12))*t)*exp(-t*2.2)':d=2:s=48000" -f lavfi -i "anoisesrc=d=2:c=brown:a=0.4" -filter_complex "[1]lowpass=f=180,afade=t=out:st=0.1:d=1.8[n];[0][n]amix=inputs=2:weights=1 0.6,volume=1.6" "$OUT/boom.wav"
# Riser: rising tone + noise swelling over 3 s
$F -f lavfi -i "aevalsrc='0.35*sin(2*PI*(120*pow(8,t/3))*t*0.5)*(t/3)':d=3:s=48000" -f lavfi -i "anoisesrc=d=3:c=white:a=0.5" -filter_complex "[1]highpass=f=2000,volume='t/3':eval=frame[n];[0][n]amix=inputs=2:weights=1 0.5,afade=t=out:st=2.9:d=0.1" "$OUT/riser.wav"
# Tick: tiny typewriter-ish click, 40 ms
$F -f lavfi -i "aevalsrc='0.6*sin(2*PI*2600*t)*exp(-t*260)+0.3*(random(0)-0.5)*exp(-t*400)':d=0.04:s=48000" "$OUT/tick.wav"
# Glitch: bit-crushed noise burst, 0.18 s
$F -f lavfi -i "anoisesrc=d=0.18:c=white:a=0.6" -af "acrusher=bits=4:samples=20:mix=1,tremolo=f=40:d=0.9,afade=t=out:st=0.12:d=0.06" -ar 48000 "$OUT/glitch.wav"
# Drone: low sustained bed for tension, 6 s
$F -f lavfi -i "aevalsrc='0.25*sin(2*PI*55*t)+0.18*sin(2*PI*82.4*t+sin(t))+0.1*sin(2*PI*110.3*t)':d=6:s=48000" -af "afade=t=in:d=1.5,afade=t=out:st=4.5:d=1.5,lowpass=f=600" "$OUT/drone.wav"
ls -la "$OUT"
