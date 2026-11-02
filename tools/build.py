"""Builds index.html (the single-file app) from src/ and sync/core.js. Run: python3 tools/build.py"""
from pathlib import Path
root = Path(__file__).resolve().parent.parent
css = (root / 'src/base.css').read_text() + (root / 'src/extra.css').read_text() + (root / 'src/theme.css').read_text() + (root / 'src/v7.css').read_text()
core = (root / 'sync/core.js').read_text()
app = (root / 'src/app.js').read_text()
v7 = (root / 'src/v7.js').read_text()
html = f'''<title>FAMILY SMART</title>
<meta name="apple-mobile-web-app-title" content="FAMILY SMART">
<meta name="application-name" content="FAMILY SMART">
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="theme-color" content="#7C5CD6">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap">
<style>
{css}</style>

<div id="app"></div>
<div id="modal"></div>
<div id="toast" class="toast" hidden></div>

<!-- built by tools/build.py – edit src/ and sync/, not this file -->
<script>
{core}</script>
<script>
{app}</script>
<script>
{v7}</script>
'''
(root / 'index.html').write_text(html)
print('index.html', len(html), 'bytes')
