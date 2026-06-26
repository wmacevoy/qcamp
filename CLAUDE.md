# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A self-contained, **fully static** WebGL teaching site for a quantum camp: a `1 → 2 → 3` qubit
progression that watches the Bloch-sphere representation work perfectly, then strain, then break.
The pedagogical arc *is* the point — each added qubit costs the representation exactly one notch,
and the 3-qubit page makes the failure quantitative (the 3-tangle `τ₃`, invisible to any sphere).

There is **no build step, no package.json, no test runner, and no lint config.** Everything is hand-written
HTML/CSS/JS served as-is. The README's mention of "unit checks / headless Chromium" describes an aspiration —
no such harness exists in the repo. The whole site lives under `docs/`, which is the publishing root.

## Commands

```sh
# Local preview (mirrors the GitHub Pages /docs layout exactly):
docker-compose up      # then open http://localhost:8080/
docker-compose down

# Without Docker: open docs/index.html (or any page) directly in a browser.
# All pages work from file:// EXCEPT notes.html, which fetch()es a local .md and
# needs HTTP — under file:// it falls back to a raw-file link.
```

Deploy is automatic: pushing to `main` triggers `.github/workflows/pages.yml`, which publishes `./docs`
to GitHub Pages. `docs/.nojekyll` keeps files served verbatim (no Jekyll build).

## Architecture

Three interactive pages share one toolkit, so each page is just its own layout + wiring.

- **`docs/qlib.js`** — the shared library, a single global `Q` with two halves:
  1. **Quantum core** (no THREE dependency): complex math (`C`/`cadd`/`cmul`…), gate matrices (`gates`,
     `rotGate`, `uGate`, `rxxGate`, `rzzGate`), an n-qubit state-vector engine (`applyU`, `applyU2`,
     `cnot`/`cz`/`swap`, `mcx`/`mcz`, `expect`), and measures (`bloch`, `corrTensor`, `concurrence`,
     `tangle3`, `axisAngle`).
  2. **three.js toolkit**: `setupScene`, `makeBlochSphere`, `makeCouplingSphere`, `makeGatePreview`,
     `makeAnimator`, `makeReplay`, `makeLessons`, plus label/axis helpers.
- **`docs/q.css`** — shared styles (nav, panel, buttons, readouts, replay log, lessons). Each page keeps
  a small page-specific `<style>`.

### Two non-obvious load conventions (do not "fix" these)

- **`qlib.js` is a CLASSIC `<script src>`, not an ES module — on purpose.** Local ES-module imports are
  CORS-blocked under `file://`; a classic script loads everywhere. So `qlib.js` never `import`s anything.
- **THREE is injected, not imported.** Each page's `<script type="module">` does
  `import * as THREE from 'three'` (via an import-map → jsdelivr CDN) then `Q.initThree(THREE, OrbitControls)`.
  This keeps `qlib.js` renderer-agnostic. CDN deps (Three.js `0.160.0`, marked.js) require internet; to vendor
  locally, change the import-map / `<script>` URLs.

### Core conventions baked into the math (critical for correctness)

- A state is an array of `2^n` complex numbers `{re, im}`.
- **Qubit 0 is the most-significant bit:** `index = Σ bit_q << (n-1-q)`.
- **Bloch → three.js is a reflection** `(x,y,z) → (x, z, y)` (Bloch `z`, the `|0⟩`–`|1⟩` axis, is "up").
  Because this is a reflection, displayed gate rotations are canonically `−θ` about the mapped axis — see the
  comments on `rotationToward` and `makeGatePreview` before touching animation/sweep direction.
- Global phase is unobservable and intentionally not shown.

### Pages (`docs/`)

- `index.html` — landing/overview (self-contained styles; does **not** use `qlib.js`).
- `one-qubit.html` — single Bloch sphere; representation complete (`|r|=1` always).
- `two-qubit.html` — two Bloch spheres + coupling sphere, Bell states, gate log/replay, guided lesson.
- `three-qubit.html` — interactive 3-qubit sandbox (single-qubit + CNOT/Toffoli/CZ/CCZ/SWAP/Rxx/Rzz),
  guided lessons, live `τ₃` 3-tangle; this is where the representation visibly "breaks".
- `notes.html` — renders `bloch-sphere-and-entanglement.md` via marked.js (needs HTTP, see above).
- `amplitudes.html`, `complex.html` — newer companion pages, **currently untracked and not yet linked
  into the shared nav** of the main pages.

When adding a page, copy an existing one's import-map + `Q.initThree` boot sequence, pull what you need with
`const { … } = Q;`, and add the nav link in `q.css`-styled `.qnav` on every page (the nav is duplicated per
page, not centralized).
