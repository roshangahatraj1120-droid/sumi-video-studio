"""Cut the 12 reel sources and build caption/layout data.
usage: build.py            (writes public/reels/<id>.mp4 + src/reels/reels.json in the studio repo)"""
import json, os, re, subprocess, sys
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from spec import REELS

ROOT = "/home/user/reels"
STUDIO = "/home/user/sumi-video-studio"
OUTV = f"{STUDIO}/public/reels"
FPS = 30
os.makedirs(OUTV, exist_ok=True)
os.makedirs(f"{STUDIO}/src/reels", exist_ok=True)

# a frame of the host at the desk in each source (for vertical reframing)
HOST_REF = {"humans": 50.0, "hiphop": 10.0, "laban": 160.0}


def words_of(src):
    return [w for s in json.load(open(f"{ROOT}/tx/{src}.json")) for w in s["words"]]


def tokens(text):
    return text.split()


def plan(reel):
    rid, src, hook, items = reel
    W = words_of(src)
    ranges, caps = [], []
    for a, b, text in items:
        ws = [w for w in W if a - 0.02 <= w["t"] < b]
        if not ws:
            raise SystemExit(f"{rid}: no words in {a}-{b}")
        s = max(a, ws[0]["t"] - 0.12)
        last_end = min(ws[-1]["e"], ws[-1]["t"] + 1.0)
        e = min(b + 0.1, last_end + 0.14)
        toks = tokens(text)
        if len(toks) == len(ws):
            times = [(w["t"], min(w["e"], w["t"] + 1.0)) for w in ws]
        else:  # spread corrected words over the spoken span by length
            t0, t1 = ws[0]["t"], last_end
            L = [len(re.sub(r"\W", "", x)) + 1 for x in toks]
            c = np.cumsum([0] + L) / sum(L)
            times = [(t0 + c[i] * (t1 - t0), t0 + c[i + 1] * (t1 - t0)) for i in range(len(toks))]
        ranges.append([s, e])
        caps.extend({"w": tk, "t": t, "e": te} for tk, (t, te) in zip(toks, times))
    # merge ranges that nearly touch
    merged = []
    for r in ranges:
        if merged and r[0] - merged[-1][1] < 0.3:
            merged[-1][1] = max(merged[-1][1], r[1])
        else:
            merged.append(list(r))
    # source time -> reel time
    offs, acc = [], 0.0
    for s, e in merged:
        offs.append(acc)
        acc += e - s

    def to_reel(t):
        for (s, e), o in zip(merged, offs):
            if s - 0.01 <= t <= e + 0.01:
                return o + (t - s)
        # in a removed gap: snap to the next range start
        for (s, e), o in zip(merged, offs):
            if t < s:
                return o
        return acc

    words = [{"w": c["w"], "t": round(to_reel(c["t"]), 3), "e": round(to_reel(c["e"]), 3)} for c in caps]
    return merged, words, acc


def chunk(words):
    """caption chunks: up to 3 words / ~16 chars, breaking after punctuation"""
    out, cur = [], []
    for i, w in enumerate(words):
        cur.append(i)
        text = " ".join(words[j]["w"] for j in cur)
        end_punct = re.search(r"[.,?!;:]$", w["w"])
        if len(cur) >= 3 or len(text) >= 16 or end_punct:
            out.append(cur)
            cur = []
    if cur:
        out.append(cur)
    return [{"i": c, "t": words[c[0]]["t"], "e": words[c[-1]]["e"]} for c in out]


def cut(rid, src, merged):
    out = f"{OUTV}/{rid}.mp4"
    parts, fc = [], []
    for k, (s, e) in enumerate(merged):
        d = e - s
        fc.append(f"[0:v]trim={s:.3f}:{e:.3f},setpts=PTS-STARTPTS,fps={FPS},scale=1920:1080,format=yuv420p[v{k}]")
        fc.append(f"[0:a]atrim={s:.3f}:{e:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={max(0, d - 0.03):.3f}:d=0.03[a{k}]")
        parts.append(f"[v{k}][a{k}]")
    fc.append("".join(parts) + f"concat=n={len(merged)}:v=1:a=1[vc][ac]")
    fc.append("[ac]highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=200,loudnorm=I=-14:TP=-1.5:LRA=9[ao]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{ROOT}/src/{src}.mov", "-filter_complex", ";".join(fc),
                    "-map", "[vc]", "-map", "[ao]", "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-g", "15",
                    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", out], check=True)
    return out


def side_strips(img):
    # left and right edges of the desk set (the host sits in the middle)
    return np.concatenate([img[:, :10].ravel(), img[:, -10:].ravel()]).astype(np.float32)


def host_layout(src, path, dur):
    """per 0.2 s: is this the host-at-desk shot? (compare edge strips to a reference frame)"""
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", "fps=5,scale=64:36", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, 36, 64, 3).astype(np.float32)
    L = fr[:, :, :8].mean(axis=(1, 2))
    R = fr[:, :, -8:].mean(axis=(1, 2))
    # the desk set: bright pink-purple wall on the left, blue-purple light on the right
    d = L[:, 0]
    host = (L[:, 0] > 140) & (L[:, 2] > 110) & (L[:, 1] < 125) & (R[:, 2] > 115) & (R[:, 2] > R[:, 0] + 30)
    # smooth: no layout run shorter than 0.8 s
    segs, i = [], 0
    while i < len(host):
        j = i
        while j < len(host) and host[j] == host[i]:
            j += 1
        segs.append([bool(host[i]), i / 5, j / 5])
        i = j
    changed = True
    while changed and len(segs) > 1:
        changed = False
        for k, (h, a, b) in enumerate(segs):
            if b - a < 0.8:
                if k > 0:
                    segs[k - 1][2] = b
                else:
                    segs[k + 1][1] = a
                segs.pop(k)
                changed = True
                break
        merged = []
        for s in segs:
            if merged and merged[-1][0] == s[0]:
                merged[-1][2] = s[2]
            else:
                merged.append(s)
        segs = merged
    segs[-1][2] = dur
    return [{"host": h, "t": round(a, 2), "e": round(b, 2)} for h, a, b in segs], [round(float(x), 1) for x in d]


def main(only=None):
    data = {}
    for reel in REELS:
        rid, src, hook, items = reel
        if only and rid not in only:
            continue
        merged, words, dur = plan(reel)
        path = cut(rid, src, merged)
        real = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]))
        layout, dist = host_layout(src, path, real)
        data[rid] = {"src": src, "hook": hook, "file": f"reels/{rid}.mp4", "dur": real, "frames": int(real * FPS),
                     "ranges": [[round(a, 2), round(b, 2)] for a, b in merged], "words": words, "chunks": chunk(words), "layout": layout}
        print(f"{rid:44s} {real:5.1f}s  ranges={len(merged)}  host={sum(1 for l in layout if l['host'])}/{len(layout)}")
    p = f"{STUDIO}/src/reels/reels.json"
    old = json.load(open(p)) if (only and os.path.exists(p)) else {}
    old.update(data)
    json.dump(old, open(p, "w"), indent=1)


if __name__ == "__main__":
    main(sys.argv[1:] or None)
