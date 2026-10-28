"""Santhal dance episode: edit decision list -> proxy jobs + Remotion timeline.

Run:  python3 scripts/santhal_edl.py
Writes src/santhal/timeline.json and /home/user/footage/proxy_jobs.txt
Each shot: S(src, in, out, speed=1, tr=(kind, frames), vol=..., mute=..., text=[...])
tr is the transition INTO the shot: cut | fade | dip | flash | whip | zoom
"""
import json, os, subprocess

RAW = "/home/user/footage/raw"
FPS = 30
H = 0.5  # handle seconds on each side of a normal-speed proxy

_dur_cache = {}


def src_path(name):
    for ext in (".MOV", ".mov", ".mp4"):
        p = os.path.join(RAW, name + ext)
        if os.path.exists(p):
            return p
    raise FileNotFoundError(name)


def src_dur(name):
    if name not in _dur_cache:
        out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src_path(name)])
        _dur_cache[name] = float(out)
    return _dur_cache[name]


def S(src, a, b, speed=1, tr=("cut", 0), vol=0.8, mute=False, text=None, cut=None, split=None, zoom=1.0, zx=960, zy=540):
    return dict(kind="shot", src=src, a=a, b=b, speed=speed, tr=tr, vol=vol, mute=mute, text=text or [], cutaways=cut or [], split=split, zoom=zoom, zx=zx, zy=zy)


def BLACK(sec, tr=("cut", 0), text=None, hit=None):
    return dict(kind="black", sec=sec, tr=tr, text=text or [], hit=hit)


def T(kind, at=0.0, dur=3.5, **kw):
    return dict(type=kind, at=at, dur=dur, **kw)


def BED(src, a, b, at_shot):
    return dict(src=src, a=a, b=b, at_shot=at_shot)


SECTIONS = []


def section(key, title, shots, beds=()):
    SECTIONS.append(dict(key=key, title=title, shots=shots, beds=list(beds)))


# v2 (2026-10-28): follows the host's voiceover. Starts AFTER the host's own CapCut opening
# (sunrise, village, jamara, blessings). The host does not appear until "I put the camera down".
# IMG_0270 0-11s and IMG_0271 show the host crouching among the dancers, so they stay out before that.

# ---------------------------------------------------------------- 00 MELA ("You always heard the mela…" → "…gone in five minutes." / "Then we grew up…")
section("00-mela", "Mela", [
    S("IMG_6554", 3.5, 6.6, tr=("fade", 12), vol=0.7, zoom=1.4, zx=1250, zy=640),
    S("IMG_6554", 1.5, 3.5, vol=0.7, zoom=1.5, zx=400, zy=860),
    S("IMG_6552", 0.0, 3.0, speed=0.5, tr=("fade", 8), mute=True),
    S("IMG_6552", 12.5, 15.4, speed=0.5, mute=True, zoom=1.15, zx=1200, zy=760),
    S("IMG_6552", 8.0, 11.0, speed=0.5, tr=("fade", 8), mute=True),
    S("IMG_6597", 8.0, 11.0, speed=0.5, mute=True),
    S("IMG_6586", 0.0, 2.6, tr=("whip", 8), vol=0.6, zoom=1.18, zx=1150, zy=520),
    S("IMG_6585", 0.0, 2.8, vol=0.6, zoom=1.15, zx=1250, zy=700),
    S("IMG_6553", 1.5, 4.5, vol=0.6),
    # "Then we grew up. We moved to cities…" (quieter)
    S("IMG_6553", 7.5, 12.5, tr=("dip", 20), vol=0.4),
    S("IMG_6555", 8.0, 14.0, vol=0.4),
    S("IMG_6541", 0.0, 3.4, tr=("fade", 10), vol=0.9),
], beds=[BED("IMG_6552", 0.0, 15.0, at_shot=2)])

# ---------------------------------------------------------------- 01 SHARANAMATI ("This is Sharanamati…" → "Around the Santhal dancers.") + title
section("01-sharanamati", "Sharanamati", [
    S("IMG_6571", 0.0, 4.5, tr=("dip", 16), vol=0.6, text=[T("location", at=0.6, dur=3.8, l1="Sharanamati", l2="Jhapa · Koshi Province, Nepal")]),
    S("IMG_6563", 0.2, 3.8, vol=0.6),
    S("IMG_6556", 0.0, 4.0, vol=0.6),
    S("IMG_6597", 24.0, 28.0, tr=("whip", 8), vol=0.7),
    S("IMG_6589", 0.0, 4.0, vol=0.9),
    BLACK(5.0, text=[T("title", at=0.3, dur=4.4, title="You Can Still Hear It", sub="The Santhal dance · Sharanamati, Jhapa")], hit=("IMG_6546", 1.0)),
])

# ---------------------------------------------------------------- 02 THE DRUMS + DANCE ("Before you see them, you hear them." → "…until the full moon.")
section("02-drums-and-dance", "Drums and dance", [
    S("IMG_6575", 0.0, 3.0, tr=("fade", 10)),
    S("IMG_6569", 0.0, 2.8),
    S("IMG_6559", 0.0, 3.0),
    S("IMG_6546", 1.0, 3.8),
    S("IMG_6547", 2.0, 9.0, tr=("whip", 8), text=[T("drum", at=0.8, dur=5.0, l1="Tamak", l2="big drum", x=1350, y=860)]),
    S("IMG_6613", 20.0, 25.6, text=[T("drum", at=0.6, dur=4.4, l1="Tumdak", l2="two-headed drum", x=820, y=600)]),
    S("IMG_6565", 1.0, 3.9, speed=0.5, tr=("fade", 8), mute=True),
    S("IMG_6573", 2.0, 4.5, tr=("flash", 6), mute=True),
    S("IMG_0273", 4.0, 6.0, mute=True),
    S("IMG_6614", 1.5, 3.0, mute=True),
    S("IMG_6598", 2.0, 4.0, tr=("zoom", 8), mute=True),
    S("IMG_6600", 1.5, 3.0, mute=True),
    S("IMG_6558", 3.0, 5.0, mute=True),
    S("IMG_6608", 10.0, 12.0, tr=("whip", 8), mute=True),
    S("IMG_6589", 6.0, 8.0, mute=True),
    S("IMG_6566", 0.0, 2.0, tr=("flash", 6), mute=True),
    # "They have their own language, Santhali…"
    S("IMG_6593", 0.0, 6.6, tr=("dip", 14), vol=1.0, text=[T("lower", at=1.0, dur=4.5, l1="Santhali", l2="Austroasiatic language family")]),
    S("IMG_6550", 6.0, 10.0, vol=0.5),
    # "At Dashain, the men tie on their headscarves, tuck peacock feathers…"
    S("IMG_6551", 0.0, 6.0, speed=0.5, tr=("fade", 10), mute=True),
    S("IMG_6543", 0.0, 5.0, vol=0.5),
    S("IMG_6548", 136.0, 141.0, vol=0.5),
    # "…and dance, village to village, from Vijaya Dashami until the full moon."
    S("IMG_6557", 0.0, 4.0, tr=("whip", 8)),
    S("IMG_6597", 12.0, 16.0),
], beds=[BED("IMG_6589", 8.0, 28.0, at_shot=6)])

# ---------------------------------------------------------------- 03 I GREW UP WATCHING ("I grew up watching this…" → "…still here.")
section("03-i-grew-up-watching", "I grew up watching", [
    S("IMG_6588", 0.0, 2.8, tr=("dip", 16), vol=0.5),
    S("IMG_6578", 10.0, 14.6, vol=0.5),
    S("IMG_6560", 0.0, 5.0, tr=("fade", 10), vol=0.5),
    S("IMG_6562", 0.0, 3.5, vol=0.5),
    S("IMG_6614", 8.5, 10.5, speed=0.5, tr=("fade", 10), mute=True),
    S("IMG_6597", 3.0, 7.0, tr=("fade", 10), vol=0.6),
    S("IMG_6558", 6.0, 10.0, vol=0.6),
])

# ---------------------------------------------------------------- 04 THE ELDERS ("Some of these men have been dancing most of their lives. Listen to them.")
section("04-the-elders", "The Elders", [
    S("IMG_6548", 0.0, 6.0, tr=("dip", 20), vol=0.5, text=[T("chapter", at=0.4, num="01", title="The Elders")]),
    S("IMG_6548", 8.0, 56.0, vol=1.0, text=[T("lower", at=1.0, dur=5.0, l1="Santhal elder", l2="Dancer")],
      cut=[dict(src="IMG_6548", a=168.0, b=174.0, at=18.0), dict(src="IMG_6549", a=10.0, b=16.0, at=32.0)]),
    S("IMG_6545", 0.0, 4.0, tr=("fade", 10), vol=0.5),
    S("IMG_6566", 2.0, 6.0, vol=0.6),
])

# ---------------------------------------------------------------- 05 THE COMPETITION ("Six groups danced this year. Look at the crowd…")
section("05-the-competition", "The Competition", [
    S("IMG_0270", 12.0, 15.0, tr=("dip", 16), text=[T("chapter", at=0.3, num="02", title="The Competition")]),
    S("IMG_0273", 10.0, 14.0),
    S("IMG_6554", 0.0, 1.4, vol=0.5),
    S("IMG_6552", 4.0, 6.5, vol=0.5),
    S("IMG_6597", 36.0, 40.0, tr=("whip", 8), vol=1.0),
    S("IMG_6594", 8.0, 48.0, vol=1.0, text=[T("lower", at=1.0, dur=5.0, l1="Competition organiser", l2="Santhal dance competition")],
      cut=[dict(src="IMG_6595", a=0.0, b=4.7, at=12.0), dict(src="IMG_6596", a=0.0, b=5.7, at=24.0), dict(src="IMG_6599", a=4.0, b=9.0, at=33.0)]),
    S("IMG_6598", 8.0, 12.0, tr=("flash", 6), mute=True),
    S("IMG_6574", 0.0, 3.0, mute=True),
    S("IMG_6572", 2.0, 6.0, mute=True),
    S("IMG_6600", 3.0, 6.0, speed=0.5, tr=("zoom", 8), mute=True),
    S("IMG_6587", 2.0, 5.0, mute=True),
    S("IMG_6591", 0.0, 3.0, tr=("whip", 8), mute=True),
    S("IMG_6590", 14.0, 18.0, mute=True),
    S("IMG_6580", 0.0, 3.0, mute=True),
    S("IMG_6557", 4.0, 8.0, mute=True),
    S("IMG_0277", 1.0, 4.0, mute=True),
    S("IMG_6561", 0.0, 3.0, tr=("flash", 6), mute=True),
], beds=[BED("IMG_6589", 4.0, 28.0, at_shot=6), BED("IMG_6613", 0.0, 20.0, at_shot=12)])

# ---------------------------------------------------------------- 06 I JOINED IN (first time the host is on screen)
section("06-i-joined-in", "I Joined In", [
    S("IMG_0278", 0.5, 3.5, tr=("dip", 16)),
    S("IMG_0276", 6.0, 12.0, text=[T("chapter", at=0.3, num="03", title="I Joined In")]),
    S("IMG_0282", 3.0, 9.0, vol=1.0),
    S("IMG_0280", 0.0, 6.0),
    S("IMG_0307", 0.0, 10.0, tr=("whip", 8), vol=1.0),
    S("IMG_0278", 8.0, 16.0),
    S("IMG_0283", 12.0, 20.0),
    S("IMG_0280", 15.0, 21.0),
    S("IMG_0305", 10.0, 15.6),
    S("IMG_0282", 15.0, 19.0, speed=0.5, tr=("fade", 10), mute=True),
    S("IMG_0283", 24.0, 27.0, speed=0.5, mute=True),
    S("IMG_6583", 2.0, 4.8, tr=("fade", 20), vol=0.4),
    S("IMG_6567", 0.0, 6.0, tr=("fade", 15), vol=0.5),
    S("IMG_6582", 6.0, 12.0, vol=0.5),
])

# ---------------------------------------------------------------- 07 WHO CARRIES IT FORWARD ("Every year, there are fewer dancers…" → "…the day the drums go quiet.")
section("07-who-carries-it-forward", "Who Carries It Forward", [
    S("IMG_6582", 0.0, 5.0, tr=("dip", 20), vol=0.4, text=[T("chapter", at=0.4, num="04", title="Who Carries It Forward")]),
    S("IMG_6581", 0.0, 3.0, vol=0.4),
    S("IMG_6610", 0.0, 3.8, vol=0.5),
    S("IMG_6542", 0.0, 10.0, tr=("fade", 12)),
    S("IMG_6547", 9.0, 16.0),
    S("IMG_6607", 0.0, 8.0),
    S("IMG_6611", 0.0, 6.8, tr=("whip", 8)),
    S("IMG_6612", 2.0, 5.0, speed=0.5, mute=True, split=dict(src="IMG_6614", a=4.5, b=7.5), text=[T("split", at=0.4, dur=5.2, l1="Next generation", r1="The elders")]),
    S("IMG_6608", 0.0, 5.0, speed=0.5, tr=("fade", 10), mute=True),
    S("IMG_6609", 0.0, 6.8),
    # "But they shouldn't have to carry it alone… the day the drums go quiet."
    S("IMG_6590", 0.0, 4.0, tr=("fade", 10)),
    S("IMG_6590", 20.0, 26.0),
    S("IMG_6613", 6.0, 12.0, vol=0.9),
])

# ---------------------------------------------------------------- 08 ENDING ("Maybe your festival was somewhere else…" → comments question)
section("08-ending", "Ending", [
    S("IMG_0283", 40.0, 45.6, tr=("fade", 15)),
    S("IMG_0281", 0.0, 6.8, vol=0.6),
    S("IMG_0283", 32.0, 38.0, vol=0.6),
    BLACK(6.0, tr=("dip", 20), text=[T("dedication", at=0.6, dur=5.0, l1="For the Santhal dancers of Sharanamati,", l2="and everyone keeping the drum going.")], hit=("IMG_6546", 1.0)),
    S("IMG_0269", 5.0, 15.0, tr=("dip", 16), vol=0.5, text=[T("endcard", at=0.5, dur=9.0, title="You Can Still Hear It")]),
])


# ================================================================= build
def fr(s):
    return int(round(s * FPS))



def build():
    jobs = {}
    beds = {}
    timeline = []
    for sec in SECTIONS:
        items = []
        for sh in sec["shots"]:
            if sh["kind"] == "black":
                items.append(dict(kind="black", dur=fr(sh["sec"]), tr=list(sh["tr"]), text=sh["text"],
                                  hit=dict(file=f"santhal/hit.wav", vol=1.0) if sh["hit"] else None))
                if sh["hit"]:
                    jobs["hit"] = ("hit", sh["hit"][0], 0.0, 1.0)
                continue
            d = src_dur(sh["src"])
            a, b = sh["a"], min(sh["b"], d - 0.1)
            out_sec = (b - a) / sh["speed"]
            if sh["speed"] == 1:
                ha = min(H, a)
                hb = min(H, d - b - 0.05)
                key = f"{sh['src']}_{a:.2f}_{b:.2f}"
                jobs[key] = ("norm", sh["src"], a - ha, (b - a) + ha + max(0, hb))
                start = fr(ha)
            else:
                key = f"{sh['src']}_{a:.2f}_{b:.2f}_slow"
                jobs[key] = ("slow", sh["src"], a, b - a)
                start = 0
            item = dict(kind="shot", file=f"santhal/{key}.mp4", start=start, dur=fr(out_sec), tr=list(sh["tr"]),
                        vol=0 if sh["mute"] else sh["vol"], text=sh["text"], src=sh["src"], a=a, b=b, speed=sh["speed"],
                        zoom=sh["zoom"], zx=sh["zx"], zy=sh["zy"])
            cws = []
            for c in sh["cutaways"]:
                ck = f"{c['src']}_{c['a']:.2f}_{c['b']:.2f}"
                jobs[ck] = ("norm", c["src"], c["a"], c["b"] - c["a"])
                cws.append(dict(file=f"santhal/{ck}.mp4", at=fr(c["at"]), dur=fr(c["b"] - c["a"])))
            item["cutaways"] = cws
            if sh["split"]:
                s2 = sh["split"]
                sk = f"{s2['src']}_{s2['a']:.2f}_{s2['b']:.2f}_slow"
                jobs[sk] = ("slow", s2["src"], s2["a"], s2["b"] - s2["a"])
                item["split"] = dict(file=f"santhal/{sk}.mp4")
            items.append(item)
        # absolute frames inside the section (transitions overlap)
        t = 0
        for i, it in enumerate(items):
            trf = it["tr"][1] if it["tr"][0] != "cut" else 0
            if i > 0:
                t -= trf
            it["from"] = t
            t += it["dur"]
        bed_items = []
        for bd in sec["beds"]:
            bk = f"bed_{bd['src']}_{bd['a']:.2f}_{bd['b']:.2f}"
            jobs[bk] = ("bed", bd["src"], bd["a"], bd["b"] - bd["a"])
            start_at = items[bd["at_shot"]]["from"]
            # bed runs until the end of the muted run that starts at at_shot
            end_at = start_at
            for it in items[bd["at_shot"]:]:
                if it["kind"] == "shot" and it["vol"] == 0:
                    end_at = it["from"] + it["dur"]
                else:
                    break
            bed_items.append(dict(file=f"santhal/{bk}.wav", from_=start_at, dur=min(end_at - start_at, fr(bd["b"] - bd["a"]))))
        timeline.append(dict(key=sec["key"], title=sec["title"], items=items, beds=bed_items, dur=t))
    os.makedirs("src/santhal", exist_ok=True)
    with open("src/santhal/timeline.json", "w") as f:
        json.dump(dict(fps=FPS, sections=timeline), f, indent=1)
    with open("/home/user/footage/proxy_jobs.txt", "w") as f:
        for k, (mode, src, ss, du) in jobs.items():
            f.write(f"{k}\t{mode}\t{src_path(src)}\t{ss:.3f}\t{du:.3f}\n")
    tot = sum(s["dur"] for s in timeline)
    for s in timeline:
        print(f"{s['key']:28s} {s['dur']/FPS:6.1f}s")
    print(f"TOTAL {tot/FPS/60:.2f} min, {len(jobs)} proxy jobs")


if __name__ == "__main__":
    build()
