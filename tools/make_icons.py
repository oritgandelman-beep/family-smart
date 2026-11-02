"""Draws the home-screen icon (calendar with a check mark on the family gradient). Run: python3 tools/make_icons.py"""
from pathlib import Path
from PIL import Image, ImageDraw
out = Path(__file__).resolve().parent.parent / 'web'
N = 1024
def lerp(a, b, t): return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))
stops = [(0, (255, 59, 141)), (.55, (41, 121, 255)), (1, (0, 205, 183))]
img = Image.new('RGB', (N, N))
px = img.load()
for y in range(N):
    for x in range(N):
        t = (x + y) / (2 * N - 2)
        for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
            if t <= t1: px[x, y] = lerp(c0, c1, (t - t0) / (t1 - t0)); break
d = ImageDraw.Draw(img)
W, B = (255, 255, 255), (23, 23, 23)
d.rounded_rectangle((212, 262, 812, 812), 90, fill=W)
d.rounded_rectangle((212, 262, 812, 420), 90, fill=B)
d.rectangle((212, 360, 812, 420), fill=B)
for cx in (372, 652):
    d.rounded_rectangle((cx - 34, 192, cx + 34, 330), 34, fill=W, outline=B, width=18)
d.line([(370, 610), (472, 710), (668, 514)], fill=(255, 59, 141), width=64, joint='curve')
for r in [(370, 610), (472, 710), (668, 514)]:
    d.ellipse((r[0] - 32, r[1] - 32, r[0] + 32, r[1] + 32), fill=(255, 59, 141))
for s in (180, 192, 512):
    img.resize((s, s), Image.LANCZOS).save(out / f'icon-{s}.png', optimize=True)
print('icons ok')
