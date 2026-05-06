#!/usr/bin/env python3.12
from __future__ import annotations

import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path


OUT = Path(__file__).resolve().parent
SOURCE = OUT / "generated-source-8x9.png"
CROPPED = OUT / "generated-source-8x9-cropped.png"
CLEAN = OUT / "generated-source-8x9-clean.png"
REPACKED = OUT / "spritesheet.repacked.png"
WEBP = OUT / "spritesheet.webp"
PREVIEW = OUT / "preview.png"
PET_JSON = OUT / "pet.json"

COLS = 8
ROWS = 9
TARGET_WIDTH = 1536
TARGET_HEIGHT = 1872
COMPONENT_RE = re.compile(
    r"\s*\d+:\s+(\d+)x(\d+)\+(\d+)\+(\d+)\s+[^ ]+\s+(\d+(?:\.\d+)?(?:e\+\d+)?)"
)


def run(args: list[str], *, capture: bool = False) -> str:
    if capture:
        return subprocess.check_output(args, text=True)
    subprocess.check_call(args)
    return ""


def identify_size(path: Path) -> tuple[int, int]:
    width, height = run(["magick", "identify", "-format", "%w %h", str(path)], capture=True).split()
    return int(width), int(height)


def components(path: Path, threshold: int) -> list[tuple[int, int, int, int, float]]:
    output = run(
        [
            "magick",
            str(path),
            "-alpha",
            "extract",
            "-define",
            "connected-components:verbose=true",
            "-connected-components",
            "8",
            "null:",
        ],
        capture=True,
    )
    boxes: list[tuple[int, int, int, int, float]] = []
    for line in output.splitlines():
        match = COMPONENT_RE.search(line)
        if not match:
            continue
        width, height, x, y, area = match.groups()
        box = (int(x), int(y), int(width), int(height), float(area))
        if box[4] >= threshold and not (box[0] == 0 and box[1] == 0):
            boxes.append(box)
    return boxes


def group_rows(
    boxes: list[tuple[int, int, int, int, float]], tolerance: int
) -> list[list[tuple[int, int, int, int, float]]]:
    rows: list[list[tuple[int, int, int, int, float]]] = []
    centers: list[float] = []
    for box in sorted(boxes, key=lambda item: (item[1], item[0])):
        cy = box[1] + box[3] / 2
        for index, center in enumerate(centers):
            if abs(cy - center) <= tolerance:
                rows[index].append(box)
                centers[index] = (center * (len(rows[index]) - 1) + cy) / len(rows[index])
                break
        else:
            rows.append([box])
            centers.append(cy)
    ordered = sorted(zip(centers, rows), key=lambda pair: pair[0])
    return [sorted(row, key=lambda item: item[0]) for _, row in ordered]


def pick_box(row: list[tuple[int, int, int, int, float]], col: int) -> tuple[int, int, int, int, float]:
    if len(row) >= COLS:
        return row[col]
    source_index = round(col * (len(row) - 1) / (COLS - 1))
    return row[source_index]


def main() -> None:
    tmp_dir = Path(tempfile.mkdtemp(prefix="codex-logo-grid-"))
    try:
        # Remove the generated row numbers on the left before treating the source as an 8x9 grid.
        run(["magick", str(SOURCE), "-crop", "883x1695+45+0", "+repage", str(CROPPED)])

        # Convert the green-screen background, including its gradient/shadow variants, to alpha.
        run(
            [
                "magick",
                str(CROPPED),
                "-alpha",
                "set",
                "-channel",
                "A",
                "-fx",
                "(g > 0.22 && g > r*1.18 && g > b*1.18) ? 0 : 1",
                "+channel",
                f"PNG32:{CLEAN}",
            ]
        )

        target_cell_width = TARGET_WIDTH / COLS
        target_cell_height = TARGET_HEIGHT / ROWS
        source_width, source_height = identify_size(CLEAN)
        rows = group_rows(components(CLEAN, 3000), 70)
        if len(rows) != ROWS:
            raise SystemExit(f"Expected {ROWS} source rows, detected {len(rows)} rows.")

        run(["magick", "-size", f"{TARGET_WIDTH}x{TARGET_HEIGHT}", "xc:none", f"PNG32:{REPACKED}"])

        for row in range(ROWS):
            for col in range(COLS):
                source_box = pick_box(rows[row], col)
                source_x, source_y, source_w, source_h, _ = source_box
                crop_pad = 10
                x1 = max(0, source_x - crop_pad)
                y1 = max(0, source_y - crop_pad)
                x2 = min(source_width, source_x + source_w + crop_pad)
                y2 = min(source_height, source_y + source_h + crop_pad)
                crop_width = x2 - x1
                crop_height = y2 - y1
                frame = tmp_dir / f"frame-{row}-{col}.png"
                next_canvas = tmp_dir / f"canvas-{row}-{col}.png"

                run(
                    [
                        "magick",
                        str(CLEAN),
                        "-crop",
                        f"{crop_width}x{crop_height}+{x1}+{y1}",
                        "+repage",
                        "-trim",
                        "+repage",
                        "-resize",
                        "172x192>",
                        f"PNG32:{frame}",
                    ]
                )
                frame_width, frame_height = identify_size(frame)
                paste_x = round(col * target_cell_width + target_cell_width / 2 - frame_width / 2)
                paste_y = round(row * target_cell_height + target_cell_height / 2 - frame_height / 2)

                run(
                    [
                        "magick",
                        str(REPACKED),
                        str(frame),
                        "-geometry",
                        f"+{paste_x}+{paste_y}",
                        "-compose",
                        "over",
                        "-composite",
                        f"PNG32:{next_canvas}",
                    ]
                )
                next_canvas.replace(REPACKED)

        run(["magick", str(REPACKED), "-define", "webp:lossless=true", str(WEBP)])
        run(
            [
                "magick",
                str(REPACKED),
                "-background",
                "#d8d8d8",
                "-alpha",
                "remove",
                "-alpha",
                "off",
                "-resize",
                "512x624",
                str(PREVIEW),
            ]
        )
        PET_JSON.write_text(
            json.dumps(
                {
                    "id": "codex-logo",
                    "displayName": "Codex Logo",
                    "description": "A cute chibi Codex logo desktop pet.",
                    "spritesheetPath": "spritesheet.webp",
                },
                indent=2,
                ensure_ascii=False,
            )
            + "\n",
            encoding="utf-8",
        )
    finally:
        shutil.rmtree(tmp_dir)


if __name__ == "__main__":
    main()
