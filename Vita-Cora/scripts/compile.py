from pathlib import Path
import base64
import json
import re
import sys

source = Path(sys.argv[1]).resolve()
target = Path(sys.argv[2]).resolve()
router = Path(__file__).with_name("router.js").read_text(encoding="utf-8")
styles = {}

pages = {
    "inicio": ("index.html", "Panel general"),
    "guia": ("guia.html", "Guía interactiva"),
    "sintomas": ("sintomas.html", "Guía de síntomas"),
    "nutricion": ("nutricion.html", "Nutrición lunar"),
    "mision": ("mision.html", "Simulador de misión"),
}

asset_mime = {".woff2": "font/woff2", ".webp": "image/webp"}
asset_url = re.compile(r'url\(["\'](assets/[^"\']+)["\']\)')
sheet = re.compile(r'\s*<link rel="stylesheet" href="([^"]+)">')
module_tag = re.compile(r'\s*<script type="module" src="([^"]+)"></script>')
imports = re.compile(r'^import\s*\{([^}]+)\}\s*from\s*"\./([^"]+)";', re.M)
exports = re.compile(r'^export\s+(?=(?:function|const|let|class)\s+(\w+))', re.M)


def asset(match):
    path = source / match.group(1)
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f'url("data:{asset_mime[path.suffix]};base64,{encoded}")'


def bundle(entries):
    modules = []
    visited = set()

    def add(name):
        if name in visited:
            return
        visited.add(name)
        code = (source / name).read_text(encoding="utf-8")
        for _, dependency in imports.findall(code):
            add(dependency)
        members = exports.findall(code)
        code = imports.sub(lambda m: f'const {{{m[1]}}} = modules[{json.dumps(m[2])}];', code)
        code = exports.sub("", code)
        assert not re.search(r"^(?:import|export)\b", code, re.M), name
        code = code.replace('location.hash = "resumenes";', 'screen.go("#resumenes");')
        code = code.replace('history.pushState(null, "", link.hash);', 'screen.go(link.hash, true);')
        code = code.replace("location.hash", "screen.hash")
        code = code.replace("BITÁCORA ORBITAL", "VITA-CORA")
        if name in {"app.js", "mision.js"}:
            start = code.index("  const url = URL.createObjectURL(new Blob(")
            release = "  setTimeout(() => URL.revokeObjectURL(url), 1000);"
            end = code.index(release, start) + len(release)
            download = {
                "app.js": '  parent.vitaOffline.download(content, "vita-cora-" + report.date + ".txt");',
                "mision.js": '  parent.vitaOffline.download(lines.join("\\n"), "vita-cora-informe-de-practica.txt");',
            }
            code = code[:start] + download[name] + code[end:]
        modules.append(f'modules[{json.dumps(name)}] = (() => {{\n{code}\nreturn {{ {", ".join(members)} }};\n}})();')

    for entry in entries:
        add(entry)
    return '(() => {\n"use strict";\nconst screen = window.vitaScreen;\nconst localStorage = parent.vitaOffline.storage;\nconst modules = Object.create(null);\n' + "\n".join(modules) + "\n})();"


compiled = {}
for slug, (filename, title) in pages.items():
    markup = (source / filename).read_text(encoding="utf-8")
    names = sheet.findall(markup)
    for name in names:
        if name not in styles:
            styles[name] = asset_url.sub(asset, (source / name).read_text(encoding="utf-8"))
    script = bundle(module_tag.findall(markup))
    markup = module_tag.sub("", sheet.sub("", markup))
    markup = markup.replace("Bitácora Orbital", "Vita-Cora")
    markup = markup.replace('id="page-title">Bitácora<br>Orbital', 'id="page-title" aria-label="Vita-Cora">Vita-<br>Cora')
    if slug == "inicio":
        markup = markup.replace(
            "El envío del resumen al equipo de salud se representa mediante la descarga de un archivo.",
            "Las fuentes y videos externos requieren conexión. Puedes descargar los resúmenes sin conexión."
        )
    compiled[slug] = {"title": title, "styles": names, "html": markup, "script": script}

packed = json.dumps({"pages": compiled, "styles": styles}, ensure_ascii=False, separators=(",", ":"))
packed = packed.replace("<", "\\u003c")
licenses = "\n".join(path.read_text(encoding="utf-8").replace("--", "—") for path in sorted((source / "assets").glob("*-OFL.txt")))
html = f"""<!doctype html>
<html lang="es-CL">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#172e22">
  <title>Vita-Cora sin conexión</title>
  <style>
    html,body{{width:100%;height:100%;margin:0;background:#edf1e3}}
    #vita-frame{{display:block;width:100%;height:100%;border:0}}
    noscript{{display:block;padding:1rem;font:1rem system-ui,sans-serif;color:#183527}}
  </style>
</head>
<body>
  <noscript>Abre Vita-Cora en un navegador que ejecute JavaScript para usar esta versión sin conexión.</noscript>
  <iframe id="vita-frame" title="Vita-Cora"></iframe>
  <script id="vita-bundle" type="application/json">{packed}</script>
  <script>{router}</script>
  <!--
  Licencias de las tipografías incluidas
  {licenses}
  -->
</body>
</html>
"""
target.write_text(html, encoding="utf-8")
print(f"{target}: {target.stat().st_size:,} bytes")
