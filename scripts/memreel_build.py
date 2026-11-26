"""Memory film (friends → family): timeline + synthesized projector sound.

Writes src/memreel/timeline.json and public/memreel/projector.wav.
Photos are prepared separately into public/memreel/<id>.jpg and <id>_bg.jpg (not committed: personal photos).
"""
import json, math, os, random, subprocess, wave
import numpy as np

FPS = 30
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public/memreel")

FRIENDS = ["m01", "m02", "m03", "m04", "m05", "p01", "p02", "p03", "p04", "p05", "p06", "p07", "p08", "p09", "p10", "p11"]
FAMILY = ["f05", "f06", "f12", "f01", "f02", "f03", "f04", "f07", "f08", "f09", "f10", "f11", "f13", "f14", "f15", "f16"]

HOLD = 120  # 4 s on every photo
ADV = 20  # strip advance between photos
TITLE_HOLD = 75
FF_START, FF_END = 60, 156  # fast-forward through the reel after the projector flash
N_FF = 26


def size(pid):
    out = subprocess.check_output(["identify", "-format", "%w %h", os.path.join(PUB, pid + ".jpg")]).decode().split()
    return int(out[0]), int(out[1])


def build():
    rnd = random.Random(7)
    ff = [rnd.choice(FRIENDS + FAMILY) for _ in range(N_FF)]
    items = [dict(kind="photo", id=p) for p in ff]
    title_friends = len(items)
    items.append(dict(kind="title", text="Friends", sub="PART ONE"))
    for p in FRIENDS:
        items.append(dict(kind="photo", id=p))
    title_family = len(items)
    items.append(dict(kind="title", text="Family", sub="PART TWO"))
    for p in FAMILY:
        items.append(dict(kind="photo", id=p))
    leader = len(items)
    items += [dict(kind="leader")] * 3
    for it in items:
        if it["kind"] == "photo":
            it["w"], it["h"] = size(it["id"])

    keys = [[0, 0.0, "hold"], [FF_START, 0.0, "hold"], [FF_END, float(title_friends), "ff"]]
    advances, stutters, flares, leaks = [], [], [[38, 84, 1.0]], []
    t = FF_END + TITLE_HOLD
    idx = title_friends
    holds = [[FF_END, t, idx]]

    def advance(n_frames, kind="adv"):
        nonlocal t, idx
        keys.append([t, float(idx), "hold"])
        keys.append([t + n_frames, float(idx + 1), kind])
        advances.append([t, t + n_frames, idx + 1])
        t += n_frames
        idx += 1

    for k in range(len(FRIENDS)):
        advance(ADV)
        if k == 8:
            stutters.append(advances[-1][0])
        holds.append([t, t + HOLD, idx])
        t += HOLD
    # into the family part through a big flare (like the reference's midpoint)
    advance(28)
    flares.append([t - 22, t + 14, 0.9])
    holds.append([t, t + TITLE_HOLD, idx])
    t += TITLE_HOLD
    for k in range(len(FAMILY)):
        advance(ADV)
        if k == 8:
            stutters.append(advances[-1][0])
        holds.append([t, t + HOLD, idx])
        t += HOLD
    # run out onto the white leader, light floods, projector stops
    advance(24)
    keys.append([t + 70, idx + 0.25, "drift"])
    end_white = [t + 10, t + 60]
    total = t + 100
    for i, (a, b, j) in enumerate(advances):
        leaks.append([a, b, ["red", "pink", "magenta", "amber"][i % 4]])
    data = dict(fps=FPS, total=total, items=items, keys=keys, advances=advances, holds=holds, stutters=stutters,
                flares=flares, leaks=leaks, ff=[FF_START, FF_END], endWhite=end_white,
                titles=[title_friends, title_family], leader=leader)
    os.makedirs(os.path.join(ROOT, "src/memreel"), exist_ok=True)
    json.dump(data, open(os.path.join(ROOT, "src/memreel/timeline.json"), "w"), indent=1)
    print(f"total {total} frames = {total / FPS:.1f}s, {len(items)} strip items")
    return data


# ---------------------------------------------------------------- projector sound
SR = 48000


def bandnoise(n, lo, hi, rng):
    x = rng.standard_normal(n)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(X, n)
    return y / (np.abs(y).max() + 1e-9)


def synth(d):
    rng = np.random.default_rng(3)
    total = d["total"] / FPS + 0.5
    n = int(total * SR)
    out = np.zeros(n)
    fr = lambda f: f / FPS

    # click-rate (shutter clatter) and level envelopes over time, sampled per frame
    T = np.arange(d["total"] + 15)
    rate = np.full(len(T), 24.0)
    level = np.full(len(T), 0.035)  # quiet under the photos
    rate[:6] = 0
    level[:6] = 0
    spin = (T >= 6) & (T < 30)
    rate[spin] = 4 + (T[spin] - 6) / 24 * 20
    level[(T >= 6) & (T < d["ff"][0])] = 0.32
    a, b = d["ff"]
    m = (T >= a) & (T < b)
    rate[m] = 24 + 22 * (1 - (T[m] - a) / (b - a)) ** 2
    level[m] = 0.32 - 0.22 * (T[m] - a) / (b - a)
    for s, e, _ in d["advances"]:
        mm = (T >= s - 2) & (T < e + 6)
        level[mm] = np.maximum(level[mm], 0.11)
    ew = d["endWhite"]
    wd = T >= ew[0]
    rate[wd] = np.clip(24 * (1 - (T[wd] - ew[0]) / 75), 0, 24)
    level[wd] = np.clip(0.11 * (1 - (T[wd] - ew[0]) / 80), 0, 1)
    level = np.convolve(level, np.ones(5) / 5, "same")

    click = bandnoise(int(0.006 * SR), 1800, 7000, rng) * np.exp(-np.linspace(0, 6, int(0.006 * SR)))
    thock = bandnoise(int(0.02 * SR), 120, 900, rng) * np.exp(-np.linspace(0, 5, int(0.02 * SR)))
    tpos = 0.0
    k = 0
    while tpos < total - 0.1:
        f = int(tpos * FPS)
        if f >= len(rate):
            break
        r = rate[f]
        if r < 0.5:
            tpos += 1 / FPS
            continue
        i = int(tpos * SR)
        L = level[f] * (0.85 + 0.3 * rng.random())
        seg = click if k % 2 == 0 else thock * 0.7
        out[i:i + len(seg)] += seg[: max(0, min(len(seg), n - i))] * L
        tpos += 1 / r
        k += 1
    # motor hum (with slight wow) wherever the projector runs
    t = np.arange(n) / SR
    lev_s = np.interp(t, T / FPS, level)
    run = np.interp(t, T / FPS, (rate > 0.5).astype(float))
    wow = 1 + 0.004 * np.sin(2 * np.pi * 0.7 * t)
    hum = (0.6 * np.sin(2 * np.pi * 50 * wow * t) + 0.3 * np.sin(2 * np.pi * 100 * wow * t) + 0.15 * np.sin(2 * np.pi * 150 * t))
    out += hum * (0.05 + 0.6 * lev_s) * run * 0.35
    # switch-on clunk and lamp whoosh into the white flash; end clunk
    def place(sig, at_frame, gain):
        i = int(fr(at_frame) * SR)
        j = min(n, i + len(sig))
        out[i:j] += sig[: j - i] * gain

    clunk = bandnoise(int(0.25 * SR), 40, 600, rng) * np.exp(-np.linspace(0, 9, int(0.25 * SR)))
    place(clunk, 5, 0.8)
    for fa, fb, s in d["flares"]:
        ln = int(fr(fb - fa) * SR)
        sw = bandnoise(ln, 400, 9000, rng) * np.sin(np.linspace(0, np.pi, ln)) ** 2
        place(sw, fa, 0.22 * s)
    place(clunk, ew[0] + 78, 0.5)
    # gentle stutter pops
    for s in d["stutters"]:
        for o in (0, 3, 7):
            place(thock, s + o, 0.5)
    out = np.tanh(out * 1.4) / 1.4
    out *= 0.89 / (np.abs(out).max() + 1e-9)
    st = np.stack([out, np.roll(out, 24)], 1)
    pcm = (st * 32767).astype("<i2")
    with wave.open(os.path.join(PUB, "projector.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print("projector.wav", round(n / SR, 1), "s")


if __name__ == "__main__":
    synth(build())
