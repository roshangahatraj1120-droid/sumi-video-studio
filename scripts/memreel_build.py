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

HOLD = 72  # 2.4 s on every photo (about 3 s per photo with the strip move, like the reference)
ADV = 16  # strip zips 3 frames along (each photo is printed 3 times, as in the reference)
COPIES = 3
FF_START, FF_END = 56, 128  # fast-forward through the reel after the projector flash
N_FF = 30
REF_CUT = 60  # the reference projector clip plays until this frame, hidden under the white flash


def size(pid):
    out = subprocess.check_output(["identify", "-format", "%w %h", os.path.join(PUB, pid + ".jpg")]).decode().split()
    return int(out[0]), int(out[1])


def build():
    rnd = random.Random(7)
    ff = [rnd.choice(FRIENDS + FAMILY) for _ in range(N_FF)]
    items = [dict(kind="photo", id=p, g=-1) for p in ff]
    groups = []
    for gi, p in enumerate(FRIENDS + FAMILY):
        start = len(items)
        items += [dict(kind="photo", id=p, g=gi) for _ in range(COPIES)]
        groups.append(start + COPIES // 2)  # the middle copy sits in the gate
    leader = len(items)
    items += [dict(kind="leader", g=-2)] * 4
    sizes = {}
    for it in items:
        if it["kind"] == "photo":
            sizes.setdefault(it["id"], size(it["id"]))
            it["w"], it["h"] = sizes[it["id"]]

    keys = [[0, 0.0, "hold"], [FF_START, 0.0, "hold"], [FF_END, float(groups[0]), "ff"]]
    advances, stutters, flares = [], [], [[50, 74, 1.0]]
    holds = []
    t = FF_END
    pos = groups[0]

    def move_to(target, n_frames):
        nonlocal t, pos
        keys.append([t, float(pos), "hold"])
        keys.append([t + n_frames, float(target), "adv"])
        advances.append([t, t + n_frames, target])
        t += n_frames
        pos = target

    nf = len(FRIENDS)
    for gi, mid in enumerate(groups):
        if gi > 0:
            if gi == nf:  # friends → family through a big light flare
                move_to(mid, 26)
                flares.append([t - 22, t + 12, 0.9])
            else:
                move_to(mid, ADV)
            if gi in (7, nf + 8):
                stutters.append(advances[-1][0])
        holds.append([t, t + HOLD, gi])
        t += HOLD
    # run out onto the white leader, light floods, projector stops
    move_to(leader + 1, 22)
    keys.append([t + 60, leader + 1.3, "drift"])
    end_white = [t + 6, t + 50]
    total = t + 84
    leaks = [[a, b, ["pink", "red", "magenta", "pink", "amber"][i % 5]] for i, (a, b, _) in enumerate(advances)]
    data = dict(fps=FPS, total=total, items=items, keys=keys, advances=advances, holds=holds, stutters=stutters,
                flares=flares, leaks=leaks, ff=[FF_START, FF_END], endWhite=end_white, refCut=REF_CUT, leader=leader)
    os.makedirs(os.path.join(ROOT, "src/memreel"), exist_ok=True)
    json.dump(data, open(os.path.join(ROOT, "src/memreel/timeline.json"), "w"), indent=1)
    print(f"total {total} frames = {total / FPS:.1f}s, {len(items)} strip items, {len(holds)} photos")
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
    rc = d["refCut"]
    rate[:rc - 8] = 0
    level[:rc - 8] = 0
    level[(T >= rc - 8) & (T < d["ff"][0])] = 0.3
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
    for fa, fb, s in d["flares"]:
        ln = int(fr(fb - fa) * SR)
        sw = bandnoise(ln, 400, 9000, rng) * np.sin(np.linspace(0, np.pi, ln)) ** 2
        place(sw, fa, 0.22 * s)
    place(clunk, ew[0] + 78, 0.5)
    # gentle stutter pops
    for s in d["stutters"]:
        for o in (0, 3, 7):
            place(thock, s + o, 0.5)
    # the reference's own projector sound under its clip, fading out into ours
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(PUB, "projector_ref.wav"), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    ref = np.frombuffer(raw, np.float32).astype(float)
    ref = ref[: int(fr(rc + 6) * SR)]
    fade = np.ones(len(ref))
    k0 = int(fr(rc - 8) * SR)
    fade[k0:] = np.linspace(1, 0, len(ref) - k0)
    ref = ref * fade / (np.abs(ref).max() + 1e-9) * 0.75
    out[: len(ref)] += ref
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
