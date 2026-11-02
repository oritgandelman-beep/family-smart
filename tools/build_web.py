"""Builds the stand-alone web version (index.html at the repository root) from src/ and sync/core.js.
Run: python3 tools/build_web.py   – then commit and push; GitHub Pages publishes it."""
from pathlib import Path
import shutil
root = Path(__file__).resolve().parent.parent
read = lambda p: (root / p).read_text(encoding='utf8')
css = ''.join(read(f'src/{n}.css') for n in ('base', 'extra', 'theme', 'v7'))
html = f'''<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>FAMILY SMART</title>
<meta name="description" content="יומן משפחתי">
<meta name="robots" content="noindex,nofollow">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="FAMILY SMART">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="application-name" content="FAMILY SMART">
<meta name="theme-color" content="#FFFFFF">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-180.png">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap">
<style>
{css}</style>
</head>
<body>
<div id="app"></div>
<div id="modal"></div>
<div id="toast" class="toast" hidden></div>

<!-- built by tools/build_web.py – edit src/ and sync/, not this file -->
<script src="config.js"></script>
<script>
{read('sync/core.js')}</script>
<script>
{read('src/web.js')}</script>
<script>
{read('src/app.js')}</script>
<script>
{read('src/v7.js')}</script>
</body>
</html>
'''
(root / 'index.html').write_text(html, encoding='utf8')
for n in ('icon-180.png', 'icon-192.png', 'icon-512.png'):
    shutil.copy(root / 'web' / n, root / n)
(root / 'manifest.webmanifest').write_text('''{
  "name": "FAMILY SMART",
  "short_name": "FAMILY SMART",
  "lang": "he",
  "dir": "rtl",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#FFFFFF",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
''', encoding='utf8')
if not (root / 'config.js').exists():
    (root / 'config.js').write_text('// Firebase web settings of the family project (public by design; access is controlled by firestore.rules).\n// null = cloud saving not set up yet: the app keeps data on this device only.\nwindow.FS_FIREBASE_CONFIG = null;\n', encoding='utf8')
print('index.html', len(html), 'bytes')
