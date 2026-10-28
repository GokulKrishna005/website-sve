"""Build a 60-second, seamless company-work background loop.

Requires opencv-python. The first and last encoded frames show the same image.
"""
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SOURCES = [
    ROOT / "assets/images/work/clear-canopy-wedding-entrance-01.jpeg",
    ROOT / "assets/images/services/german-tents/german-tent-conference-interior-01.jpeg",
    ROOT / "assets/images/work/event-stage-colour-lights-01.jpeg",
]
OUTPUT = ROOT / "assets/video/sve-work-loop.webm"
WIDTH, HEIGHT, FPS, SECONDS = 400, 224, 6, 60
FRAMES_PER_SCENE = FPS * SECONDS // len(SOURCES)


def view(image, scene, progress):
    source_height, source_width = image.shape[:2]
    scale = max(WIDTH / source_width, HEIGHT / source_height) * (1.06 + .035 * progress)
    scaled_width = max(WIDTH, round(source_width * scale))
    scaled_height = max(HEIGHT, round(source_height * scale))
    resized = cv2.resize(image, (scaled_width, scaled_height), interpolation=cv2.INTER_AREA)
    shift_x = (progress - .5) * 18 * (-1 if scene == 1 else 1)
    shift_y = (progress - .5) * 8
    left = max(0, min(scaled_width - WIDTH, round((scaled_width - WIDTH) / 2 + shift_x)))
    top = max(0, min(scaled_height - HEIGHT, round((scaled_height - HEIGHT) / 2 + shift_y)))
    return resized[top:top + HEIGHT, left:left + WIDTH].copy()


images = [cv2.imread(str(source)) for source in SOURCES]
if any(image is None for image in images):
    raise RuntimeError("A company-work photo could not be read")

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
writer = cv2.VideoWriter(str(OUTPUT), cv2.VideoWriter_fourcc(*"VP80"), FPS, (WIDTH, HEIGHT))
if not writer.isOpened():
    raise RuntimeError("VP8/WebM encoder unavailable")

blue = np.full((HEIGHT, WIDTH, 3), (102, 55, 25), dtype=np.uint8)
first = cv2.GaussianBlur(cv2.addWeighted(view(images[0], 0, 0), .93, blue, .07, 0), (3, 3), .45)
next_starts = [view(images[(scene + 1) % len(images)], (scene + 1) % len(images), 0)
               for scene in range(len(images))]
total_frames = FPS * SECONDS
try:
    for index in range(total_frames):
        scene = index // FRAMES_PER_SCENE
        progress = (index % FRAMES_PER_SCENE) / FRAMES_PER_SCENE
        frame = view(images[scene], scene, progress)
        if progress >= .8:
            blend = (progress - .8) / .2
            blend = blend * blend * (3 - 2 * blend)
            frame = cv2.addWeighted(frame, 1 - blend, next_starts[scene], blend, 0)
        frame = cv2.GaussianBlur(cv2.addWeighted(frame, .93, blue, .07, 0), (3, 3), .45)
        if index == total_frames - 1:
            frame = first
        writer.write(frame)
finally:
    writer.release()

capture = cv2.VideoCapture(str(OUTPUT))
encoded_frames = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
encoded_fps = capture.get(cv2.CAP_PROP_FPS)
capture.release()
if encoded_frames != total_frames or round(encoded_fps) != FPS:
    raise RuntimeError(f"Unexpected output length: {encoded_frames} frames at {encoded_fps} fps")
print(f"{OUTPUT}: {OUTPUT.stat().st_size} bytes, {encoded_frames / encoded_fps:.0f} seconds")
