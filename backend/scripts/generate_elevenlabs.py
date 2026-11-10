"""
Script to generate English audio using ElevenLabs official API with the George voice.

Voice ID: JBFqnCBsd6RMkjVDRZzb (George - Warm, Captivating Storyteller)
"""

import sys
import os
import json
import urllib.request

GEORGE_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"

def generate_elevenlabs_audio(text: str, output_path: str, api_key: str = None):
    api_key = api_key or os.environ.get("ELEVENLABS_API_KEY")
    if not api_key:
        raise ValueError("ELEVENLABS_API_KEY is required. Pass it as an argument or set in environment.")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{GEORGE_VOICE_ID}"
    headers = {
        "Content-Type": "application/json",
        "xi-api-key": api_key,
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
    with urllib.request.urlopen(req) as response:
        audio_data = response.read()

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(audio_data)

    print(f"Successfully generated ElevenLabs George audio: {output_path} ({len(audio_data)} bytes)")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python generate_elevenlabs.py <text> <output_path> [api_key]")
        sys.exit(1)
    text = sys.argv[1]
    out = sys.argv[2]
    key = sys.argv[3] if len(sys.argv) > 3 else None
    generate_elevenlabs_audio(text, out, key)

