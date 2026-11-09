"""Transcribe a 16 kHz mono wav with Parakeet (sherpa-onnx), VAD-segmented, word-level timestamps.
usage: transcribe.py in.wav out.json"""
import json, sys
import numpy as np, soundfile as sf, sherpa_onnx

M = "/home/user/reels/models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8"
rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f"{M}/encoder.int8.onnx", decoder=f"{M}/decoder.int8.onnx", joiner=f"{M}/joiner.int8.onnx",
    tokens=f"{M}/tokens.txt", num_threads=4, model_type="nemo_transducer")
cfg = sherpa_onnx.VadModelConfig()
cfg.silero_vad.model = "/home/user/reels/models/silero_vad.onnx"
cfg.silero_vad.min_silence_duration = 0.35
cfg.silero_vad.max_speech_duration = 20
cfg.sample_rate = 16000
vad = sherpa_onnx.VoiceActivityDetector(cfg, buffer_size_in_seconds=120)
audio, sr = sf.read(sys.argv[1], dtype="float32")
assert sr == 16000
segs = []
def flush():
    while not vad.empty():
        s = vad.front; t0 = s.start / sr
        st = rec.create_stream(); st.accept_waveform(sr, s.samples); rec.decode_stream(st)
        r = st.result
        # merge sub-word tokens into words
        words = []
        for tok, ts in zip(r.tokens, r.timestamps):
            if tok.startswith(" ") or not words:
                words.append({"w": tok.strip(), "t": round(t0 + ts, 2)})
            else:
                words[-1]["w"] += tok
        for i, w in enumerate(words):
            w["e"] = round(words[i + 1]["t"] if i + 1 < len(words) else t0 + len(s.samples) / sr, 2)
        segs.append({"start": round(t0, 2), "end": round(t0 + len(s.samples) / sr, 2), "text": r.text.strip(), "words": words})
        vad.pop()
win = cfg.silero_vad.window_size
for i in range(0, len(audio), win):
    vad.accept_waveform(audio[i:i + win]); flush()
vad.flush(); flush()
json.dump(segs, open(sys.argv[2], "w"), indent=1)
print(len(segs), "segments")
