#!/usr/bin/env python3
"""Build the ready-made Hearthbeat firmware and publish it to docs/firmware/ (served by GitHub Pages).

    python3 tools/release.py 1.0.1 "What changed, in one line"

Writes:
  docs/firmware/hearthbeat.factory.bin   full image for the USB web installer (offset 0)
  docs/firmware/hearthbeat.ota.bin       app image: phone install via the kit's hotspot, and in-app updates
  docs/firmware/manifest.json            read by the web installer and by every sensor's "Software update"

Sensors check the manifest every 6 hours and offer the update in Settings → Software update.
Set BUILD_DIR if your checkout path contains spaces (ESP-IDF cannot build there).
"""
import hashlib
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "firmware"
REPO = "https://github.com/costibotez/hearthbeat"


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    version = sys.argv[1]
    summary = sys.argv[2] if len(sys.argv) > 2 else f"Hearthbeat {version}"
    build_dir = os.environ.get("BUILD_DIR", ".esphome/build")

    cmd = ["esphome", "-s", "version", version, "-s", "build_dir", build_dir, "compile", "hearthbeat-generic.yaml"]
    print("$", " ".join(cmd))
    subprocess.run(cmd, cwd=ROOT, check=True)

    base = Path(build_dir) if os.path.isabs(build_dir) else ROOT / build_dir
    env = base / "hearthbeat" / ".pioenvs" / "hearthbeat"
    OUT.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(env / "firmware.factory.bin", OUT / "hearthbeat.factory.bin")
    shutil.copyfile(env / "firmware.ota.bin", OUT / "hearthbeat.ota.bin")
    md5 = hashlib.md5((OUT / "hearthbeat.ota.bin").read_bytes()).hexdigest()

    manifest = {
        "name": "Hearthbeat",
        "version": version,
        "home_assistant_domain": "esphome",
        "new_install_prompt_erase": True,
        "builds": [
            {
                "chipFamily": "ESP32-C6",
                "parts": [{"path": "hearthbeat.factory.bin", "offset": 0}],
                "ota": {
                    "path": "hearthbeat.ota.bin",
                    "md5": md5,
                    "summary": summary,
                    "release_url": f"{REPO}/releases/tag/v{version}",
                },
            }
        ],
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    for f in ("hearthbeat.factory.bin", "hearthbeat.ota.bin"):
        print(f"{f}: {(OUT / f).stat().st_size:,} bytes")
    print(f"manifest.json: version {version}, md5 {md5}")
    print("Next: commit docs/firmware, push, and create the GitHub release v" + version)


if __name__ == "__main__":
    main()
