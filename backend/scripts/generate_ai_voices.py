"""
Helper utility to generate male AI voices for Hajj app duas.
Configuration rules:
- All voices must be Male.
- English (en): ElevenLabs George (Voice ID: JBFqnCBsd6RMkjVDRZzb)
- Tamil (ta): Azure Valluvar (ta-IN-ValluvarNeural)
- Urdu (ur): Azure Salman (ur-IN-SalmanNeural)
"""

import asyncio
import os
import json
import urllib.request
from pathlib import Path
import edge_tts

GEORGE_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"

def load_env():
    """Load backend/.env if ELEVENLABS_API_KEY is not already in os.environ"""
    if os.environ.get("ELEVENLABS_API_KEY"):
        return
    env_path = Path(__file__).resolve().parent.parent / ".env"
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    if key.strip() == "ELEVENLABS_API_KEY" and val.strip():
                        os.environ["ELEVENLABS_API_KEY"] = val.strip()

def generate_english_elevenlabs(text: str, output_path: str, api_key: str = None):
    load_env()
    key = api_key or os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        raise ValueError(
            "ELEVENLABS_API_KEY is required to generate English with ElevenLabs George. "
            "Please provide an API key or set it in backend/.env"
        )
    
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{GEORGE_VOICE_ID}"
    headers = {
        "Content-Type": "application/json",
        "xi-api-key": key,
        "Accept": "audio/mpeg"
    }
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    with urllib.request.urlopen(req) as resp:
        audio_data = resp.read()

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(audio_data)
    print(f"Generated {output_path} using ElevenLabs George ({len(audio_data)} bytes)")

async def generate_male_audio(text: str, lang: str, output_path: str, api_key: str = None):
    if lang == "en":
        generate_english_elevenlabs(text, output_path, api_key)
        return

    voice_map = {
        "ta": "ta-IN-ValluvarNeural",
        "ur": "ur-IN-SalmanNeural"
    }
    voice = voice_map.get(lang)
    if not voice:
        raise ValueError(f"Unsupported language: {lang}")
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    comm = edge_tts.Communicate(text, voice)
    await comm.save(output_path)
    print(f"Generated {output_path} using {voice} (Male)")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 4:
        print("Usage: python generate_ai_voices.py <text> <lang: ta|ur|en> <output_path> [elevenlabs_api_key]")
        sys.exit(1)
    t = sys.argv[1]
    l = sys.argv[2]
    o = sys.argv[3]
    k = sys.argv[4] if len(sys.argv) > 4 else None
    asyncio.run(generate_male_audio(t, l, o, k))
