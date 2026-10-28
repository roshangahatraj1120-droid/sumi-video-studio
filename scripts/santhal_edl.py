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


def S(src, a, b, speed=1, tr=("cut", 0), vol=0.8, mute=False, text=None, cut=None, split=None, zoom=1.0, zx=960, zy=540, look="", polaroid=False, punches=None):
    return dict(kind="shot", src=src, a=a, b=b, speed=speed, tr=tr, vol=vol, mute=mute, text=text or [], cutaways=cut or [], split=split, zoom=zoom, zx=zx, zy=zy, look=look, polaroid=polaroid, punches=punches)


def BLACK(sec, tr=("cut", 0), text=None, hit=None):
    return dict(kind="black", sec=sec, tr=tr, text=text or [], hit=hit)


def T(kind, at=0.0, dur=3.5, **kw):
    return dict(type=kind, at=at, dur=dur, **kw)


def BED(src, a, b, at_shot):
    return dict(src=src, a=a, b=b, at_shot=at_shot)


SECTIONS = []


def section(key, title, shots, beds=()):
    SECTIONS.append(dict(key=key, title=title, shots=shots, beds=list(beds)))


# v3 (2026-10-28): follows the host's full script ("The Rhythm That Stayed"). Starts after the host's own
# CapCut opening (sunrise, tika, jamara). Interviews play complete and uncut (camera punch-ins only).
# The host is not on screen until Chapter 7. IMG_0270 0-11s and IMG_0271 show the host, so they stay out.
MEM = "memory"
INT_PUNCH = lambda total, every=24.0: [[round(t, 1), 1.0 if i % 2 == 0 else 1.16] for i, t in enumerate(x * every for x in range(int(total // every) + 1))]

# ---------------------------------------------------------------- 00 THE MELA WE REMEMBER (+ drum pause)
section("00-the-mela-we-remember", "The Mela We Remember", [
    S("IMG_6597", 3.0, 6.0, tr=("fade", 12), vol=0.6, text=[T("chapter", at=0.3, dur=3.8, num="02", title="The Mela We Remember")]),
    S("IMG_6554", 3.5, 6.6, vol=0.6, zoom=1.4, zx=1250, zy=640),
    S("IMG_6554", 1.5, 3.5, vol=0.6, zoom=1.5, zx=400, zy=860),
    S("IMG_6586", 0.0, 2.6, tr=("whip", 8), vol=0.6, zoom=1.18, zx=1150, zy=520),
    S("IMG_6552", 8.0, 10.0, vol=0.6),
    S("IMG_6553", 1.5, 4.0, vol=0.6),
    S("IMG_6585", 0.0, 2.8, vol=0.6, zoom=1.15, zx=1250, zy=700),
    S("IMG_6552", 0.0, 3.0, speed=0.5, tr=("fade", 8), mute=True),
    S("IMG_6552", 12.5, 15.4, speed=0.5, mute=True, zoom=1.15, zx=1200, zy=760),
    # "But for me… The Santhal dance."
    S("IMG_6556", 0.0, 4.0, tr=("iris", 18), vol=0.8),
    S("IMG_6563", 0.2, 3.8, vol=0.7),
    S("IMG_6573", 2.0, 4.5, tr=("flash", 6), vol=0.7),
    S("IMG_6614", 1.5, 3.0, vol=0.7),
    S("IMG_6577", 0.0, 2.5, tr=("zoom", 8), vol=0.9),
    S("IMG_6580", 0.0, 3.0, vol=0.9),
    S("IMG_6589", 10.0, 14.0, vol=0.8),
    # "As a child, I didn't know much…" (memory)
    S("IMG_6607", 0.0, 5.0, speed=0.5, tr=("leak", 22), mute=True, look=MEM),
    S("IMG_6611", 0.0, 3.0, speed=0.5, mute=True, look=MEM),
    S("IMG_6541", 0.0, 3.0, tr=("flash", 6), vol=1.0),
    # [PAUSE: original drums and dance]
    S("IMG_6565", 1.0, 3.9, speed=0.5, tr=("fade", 6), mute=True),
    S("IMG_0273", 4.0, 6.0, mute=True),
    S("IMG_6598", 2.0, 4.0, tr=("zoom", 8), mute=True),
    S("IMG_6600", 1.5, 3.0, mute=True),
    S("IMG_6558", 3.0, 5.0, mute=True),
    S("IMG_6608", 10.0, 12.0, tr=("whip", 8), mute=True),
    S("IMG_6566", 0.0, 2.0, mute=True),
    S("IMG_6590", 14.0, 17.0, tr=("flash", 6), mute=True),
    S("IMG_6587", 2.0, 4.0, mute=True),
], beds=[BED("IMG_6552", 0.0, 15.0, at_shot=7), BED("IMG_6589", 0.0, 28.0, at_shot=19)])

# ---------------------------------------------------------------- 01 CHAPTER 3: BEHIND THE RHYTHM
section("01-behind-the-rhythm", "Behind the Rhythm", [
    S("IMG_6553", 7.5, 12.5, tr=("dip", 20), vol=0.4, text=[T("chapter", at=0.4, dur=3.8, num="03", title="Behind the Rhythm")]),
    S("IMG_6597", 0.0, 3.0, vol=0.4),
    S("IMG_6564", 0.0, 3.9, vol=0.5),
    S("IMG_6610", 0.0, 3.8, vol=0.5),
    S("IMG_6562", 0.0, 3.5, vol=0.5),
    S("IMG_6609", 0.0, 5.0, tr=("fade", 10), vol=0.5),
    S("IMG_6597", 12.0, 16.0, vol=0.5),
    S("IMG_6571", 0.0, 4.5, vol=0.5),
    S("IMG_6597", 16.0, 20.0, tr=("whip", 8), vol=0.5),
    S("IMG_6593", 0.0, 6.6, vol=0.6, text=[T("quote", at=0.6, dur=5.4, l1="Not just to watch.", l2="But to learn.")]),
    # "The preparation before the performance."
    S("IMG_6540", 2.0, 8.0, tr=("leak", 18), vol=0.5, text=[T("kicker", at=0.5, dur=3.4, l1="Before the drums begin")]),
    S("IMG_6551", 0.0, 6.0, speed=0.5, tr=("fade", 10), mute=True),
    S("IMG_6543", 0.0, 6.0, vol=0.5),
    S("IMG_6546", 1.0, 3.8, vol=0.6),
    S("IMG_6548", 136.0, 141.0, vol=0.4, zoom=1.1, zx=900, zy=700),
    S("IMG_6575", 0.0, 3.0, vol=0.8),
    S("IMG_6614", 8.5, 10.5, speed=0.5, tr=("fade", 10), mute=True),
])

# ---------------------------------------------------------------- 02 INTERVIEW 1: SOPPAL SOREN (complete)
section("02-interview-soppal-soren", "Interview: Soppal Soren", [
    S("IMG_6548", 0.0, 189.2, tr=("dip", 16), vol=1.0, punches=INT_PUNCH(189.2), zx=1050, zy=400,
      text=[T("kicker", at=0.4, dur=3.4, l1="The stories behind the dance"), T("lower", at=4.0, dur=6.0, l1="Soppal Soren", l2="Santhal community · Sharanamati")]),
    S("IMG_6549", 0.0, 48.6, tr=("fade", 8), vol=1.0, punches=INT_PUNCH(48.6, 20.0), zx=1000, zy=380),
])

# ---------------------------------------------------------------- 03 INTERVIEW 2: CULTURAL SPEAKER 1 (complete)
section("03-interview-speaker-1", "Interview: Santhal dancer", [
    S("IMG_6545", 0.0, 102.0, tr=("dip", 16), vol=1.0, punches=INT_PUNCH(102.0), zx=1060, zy=330,
      text=[T("lower", at=2.0, dur=6.0, l1="Santhal dancer", l2="Sharanamati, Jhapa")]),
    S("IMG_6550", 0.0, 26.6, tr=("fade", 8), vol=1.0, punches=INT_PUNCH(26.6, 13.0), zx=920, zy=340),
])

# ---------------------------------------------------------------- 04 CHAPTER 4: MORE THAN JUST A DANCE (+ extended pause)
section("04-more-than-just-a-dance", "More Than Just a Dance", [
    S("IMG_0273", 10.0, 14.0, tr=("dip", 20), vol=0.5, text=[T("chapter", at=0.4, dur=3.6, num="04", title="More Than Just a Dance")]),
    S("IMG_6547", 2.0, 9.0, vol=0.7, text=[T("drum", at=0.8, dur=5.0, l1="Tamak", l2="big drum", x=1350, y=860)]),
    S("IMG_6613", 20.0, 25.6, vol=0.7, text=[T("drum", at=0.6, dur=4.4, l1="Tumdak", l2="two-headed drum", x=820, y=600)]),
    S("IMG_6567", 0.0, 4.0, vol=0.6),
    S("IMG_6589", 14.0, 18.0, vol=0.6),
    S("IMG_6600", 3.0, 6.0, speed=0.5, tr=("zoom", 8), mute=True),
    S("IMG_6581", 3.0, 8.0, vol=0.5),
    S("IMG_6566", 2.0, 6.0, tr=("leak", 16), vol=0.5),
    S("IMG_6573", 4.5, 8.5, vol=0.5),
    S("IMG_6557", 4.0, 8.0, vol=0.6),
    S("IMG_6591", 0.0, 4.0, tr=("whip", 8), vol=0.6),
    S("IMG_6608", 12.0, 16.0, vol=0.6),
    S("IMG_6598", 8.0, 12.0, vol=0.6),
    S("IMG_0270", 12.0, 15.0, vol=0.7),
    S("IMG_6599", 0.0, 4.0, vol=0.7),
    # [PAUSE: extended dance with live drums and crowd]
    S("IMG_6574", 0.0, 3.0, tr=("flash", 6), mute=True),
    S("IMG_6572", 2.0, 6.0, mute=True),
    S("IMG_6587", 4.0, 7.5, mute=True),
    S("IMG_6590", 20.0, 26.0, tr=("whip", 8), mute=True),
    S("IMG_6580", 3.0, 4.8, mute=True),
    S("IMG_0277", 1.0, 4.0, tr=("zoom", 8), mute=True),
    S("IMG_6561", 0.0, 3.0, mute=True),
    S("IMG_6558", 6.0, 10.0, tr=("flash", 6), mute=True),
    S("IMG_6589", 20.0, 26.0, mute=True),
], beds=[BED("IMG_6613", 0.0, 20.0, at_shot=15), BED("IMG_6557", 0.0, 16.0, at_shot=20)])

# ---------------------------------------------------------------- 05 INTERVIEW 3: ORGANIZING COMMITTEE (complete) + competition
section("05-interview-committee", "Interview: Organizing committee", [
    S("IMG_6594", 0.0, 185.0, tr=("dip", 16), vol=1.0, punches=INT_PUNCH(185.0), zx=980, zy=420,
      text=[T("kicker", at=0.4, dur=3.4, l1="Why the celebration matters"), T("lower", at=4.0, dur=6.0, l1="Organizing committee", l2="Santhal dance competition")]),
    S("IMG_6595", 0.0, 4.7, tr=("dip", 14), vol=0.5, text=[T("kicker", at=0.4, dur=3.6, l1="The competition")]),
    S("IMG_6596", 0.0, 5.7, vol=0.5),
    S("IMG_6599", 4.0, 9.0, vol=0.7),
])

# ---------------------------------------------------------------- 06 CHAPTER 5: THE THINGS WE LEAVE BEHIND
section("06-the-things-we-leave-behind", "The Things We Leave Behind", [
    S("IMG_6555", 8.0, 14.0, tr=("dip", 20), vol=0.4, text=[T("chapter", at=0.4, dur=3.8, num="05", title="The Things We Leave Behind")]),
    S("IMG_6578", 0.0, 4.0, vol=0.4),
    S("IMG_6553", 9.0, 12.5, vol=0.4),
    S("IMG_6597", 0.0, 3.0, vol=0.4, zoom=1.1),
    S("IMG_6553", 12.5, 14.2, vol=0.4),
    S("IMG_6597", 40.0, 42.8, vol=0.4),
    S("IMG_6552", 4.0, 7.0, vol=0.4),
    S("IMG_6559", 0.0, 3.0, speed=0.5, tr=("leak", 20), mute=True, look=MEM),
    S("IMG_6585", 0.0, 2.8, speed=0.5, mute=True, look=MEM),
    S("IMG_6588", 0.0, 2.8, speed=0.5, mute=True, look=MEM),
    S("IMG_6563", 0.2, 3.8, speed=0.5, mute=True, look=MEM),
    # "Culture doesn't survive through memories alone."
    S("IMG_6567", 4.0, 10.0, tr=("leak", 18), vol=0.5, text=[T("quote", at=0.6, dur=5.0, l1="Culture doesn't survive", l2="through memories alone.")]),
    S("IMG_6548", 168.0, 176.0, vol=0.4),
    S("IMG_6547", 9.0, 16.0, vol=0.6),
    S("IMG_6611", 3.0, 6.8, vol=0.5),
    S("IMG_6560", 0.0, 5.0, tr=("fade", 10), vol=0.4),
    S("IMG_6569", 0.0, 2.8, vol=0.7),
    S("IMG_6590", 0.0, 4.0, vol=0.6),
    S("IMG_6573", 0.0, 2.0, speed=0.5, mute=True),
    S("IMG_6566", 6.0, 7.9, speed=0.5, mute=True),
    S("IMG_6583", 0.0, 2.0, speed=0.5, mute=True),
])

# ---------------------------------------------------------------- 07 INTERVIEW 4: CULTURAL SPEAKER 2 (complete)
section("07-interview-speaker-2", "Interview: Santhal community member", [
    S("IMG_6544", 0.0, 26.7, tr=("dip", 16), vol=1.0, punches=INT_PUNCH(26.7, 13.5), zx=960, zy=360,
      text=[T("lower", at=13.5, dur=6.0, l1="Santhal community member", l2="Sharanamati, Jhapa")]),
    S("IMG_6545", 102.0, 122.6, tr=("fade", 8), vol=1.0, punches=INT_PUNCH(20.6, 10.0), zx=1000, zy=330),
])

# ---------------------------------------------------------------- 08 CHAPTER 6: THE NEXT GENERATION (+ pause)
section("08-the-next-generation", "The Next Generation", [
    S("IMG_6608", 0.0, 5.0, speed=0.5, tr=("dip", 20), mute=True, text=[T("chapter", at=0.4, dur=3.8, num="06", title="The Next Generation")]),
    S("IMG_6612", 2.0, 5.0, speed=0.5, mute=True, split=dict(src="IMG_6614", a=4.5, b=7.5), text=[T("split", at=0.4, dur=5.2, l1="Next generation", r1="The elders")]),
    S("IMG_6607", 5.0, 9.8, vol=0.5),
    S("IMG_6611", 0.0, 3.0, vol=0.5),
    S("IMG_6612", 0.0, 2.0, vol=0.5),
    S("IMG_6609", 0.0, 4.0, vol=0.5),
    # "People from the crowd were joining in too."
    S("IMG_6578", 4.0, 10.0, tr=("whip", 8), vol=0.6),
    S("IMG_6588", 0.0, 2.8, vol=0.6),
    S("IMG_6599", 9.0, 13.0, vol=0.6),
    S("IMG_0273", 0.0, 4.0, vol=0.6),
    S("IMG_6581", 0.0, 3.0, vol=0.5),
    S("IMG_6555", 1.0, 6.0, tr=("fade", 10), vol=0.5),
    S("IMG_6582", 6.0, 12.0, vol=0.5),
    S("IMG_6542", 0.0, 8.0, vol=0.6),
    # [PAUSE: younger dancers, older performers, audience]
    S("IMG_6608", 16.0, 20.0, tr=("flash", 6), mute=True),
    S("IMG_6609", 4.0, 6.8, mute=True),
    S("IMG_6589", 22.0, 28.0, tr=("whip", 8), mute=True),
    S("IMG_6590", 6.0, 12.0, mute=True),
], beds=[BED("IMG_6608", 0.0, 20.0, at_shot=0), BED("IMG_6589", 0.0, 20.0, at_shot=14)])

# ---------------------------------------------------------------- 09 CHAPTER 7: FROM WATCHING TO DANCING (host revealed)
section("09-from-watching-to-dancing", "From Watching to Dancing", [
    S("IMG_0278", 0.5, 3.5, tr=("dip", 16)),
    S("IMG_0276", 6.0, 12.0, text=[T("chapter", at=0.3, dur=3.8, num="07", title="From Watching to Dancing")]),
    S("IMG_0280", 0.0, 6.0),
    S("IMG_0282", 3.0, 9.0, vol=1.0),
    S("IMG_0278", 8.0, 16.0),
    S("IMG_0283", 12.0, 20.0),
    S("IMG_0307", 0.0, 10.0, tr=("whip", 8), vol=1.0),
    S("IMG_0282", 15.0, 19.0, speed=0.5, tr=("fade", 10), mute=True, text=[T("quote", at=1.0, dur=5.6, l1="This is why I fell in love", l2="with dance.")]),
    S("IMG_0305", 10.0, 15.6),
    # [PAUSE: host dancing with the performers]
    S("IMG_0283", 0.0, 8.0, tr=("flash", 6), vol=1.0),
    S("IMG_0280", 21.0, 29.0, vol=1.0),
    S("IMG_0282", 19.0, 23.0, vol=1.0),
    S("IMG_0276", 15.0, 21.0, vol=1.0),
])

# ---------------------------------------------------------------- 10 CHAPTER 8: THE RHYTHM THAT STAYED
section("10-the-rhythm-that-stayed", "The Rhythm That Stayed", [
    S("IMG_0281", 0.0, 6.8, tr=("dip", 20), vol=0.5, text=[T("chapter", at=0.4, dur=3.8, num="08", title="The Rhythm That Stayed")]),
    S("IMG_6554", 1.5, 3.5, tr=("leak", 14), vol=0.4, look=MEM, zoom=1.5, zx=400, zy=860),
    S("IMG_6552", 11.0, 12.5, vol=0.4, look=MEM),
    S("IMG_6576", 0.0, 3.0, vol=0.8),
    S("IMG_0283", 40.0, 45.6, tr=("fade", 10), vol=0.5),
    S("IMG_6549", 10.0, 16.0, vol=0.4),
    S("IMG_6613", 6.0, 12.0, vol=0.7),
    S("IMG_6598", 12.0, 13.8, vol=0.6),
    S("IMG_6590", 10.0, 14.0, vol=0.6),
    S("IMG_6608", 5.0, 10.0, vol=0.6),
    # "Maybe we can't bring back our childhood."
    S("IMG_6586", 0.0, 2.6, speed=0.5, tr=("leak", 18), mute=True, look=MEM),
    S("IMG_6553", 4.5, 7.5, vol=0.4, look=MEM),
    S("IMG_6554", 0.0, 1.4, vol=0.4, look=MEM),
    S("IMG_0273", 14.0, 17.0, tr=("fade", 10), vol=0.6),
    S("IMG_6582", 12.0, 14.8, vol=0.5),
    S("IMG_6578", 10.0, 14.6, vol=0.5),
    S("IMG_6556", 4.0, 10.0, vol=0.6),
    S("IMG_6542", 8.0, 16.0, vol=0.6),
    S("IMG_6597", 20.0, 24.0, vol=0.5),
    # "Another child might be standing in that same mela…"
    S("IMG_6583", 2.0, 4.8, speed=0.5, tr=("leak", 20), mute=True, polaroid=True),
    S("IMG_6556", 10.0, 13.0, vol=0.5),
    S("IMG_6597", 24.0, 28.0, vol=0.5),
    S("IMG_0269", 5.0, 12.0, tr=("fade", 12), vol=0.6),
    S("IMG_0283", 32.0, 38.0, vol=0.7),
    BLACK(3.0, tr=("dip", 20), hit=("IMG_6577", 0.0, 2.5)),
    BLACK(8.0, tr=("fade", 12), text=[T("final", at=0.4, dur=7.4, title="The Rhythm That Stayed", l1="Some memories take us home.", l2="Others remind us what we must not lose.")], hit=("IMG_6546", 0.0, 1.0)),
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
                hit = None
                if sh["hit"]:
                    h = sh["hit"] if len(sh["hit"]) == 3 else (sh["hit"][0], 0.0, sh["hit"][1])
                    hk = f"hit_{h[0]}_{h[1]:.2f}_{h[2]:.2f}"
                    jobs[hk] = ("hit", h[0], h[1], h[2] - h[1])
                    hit = dict(file=f"santhal/{hk}.wav", vol=1.0)
                items.append(dict(kind="black", dur=fr(sh["sec"]), tr=list(sh["tr"]), text=sh["text"], hit=hit))
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
                        zoom=sh["zoom"], zx=sh["zx"], zy=sh["zy"], look=sh["look"], polaroid=sh["polaroid"],
                        punches=[[fr(t), z] for t, z in (sh["punches"] or [])])
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
