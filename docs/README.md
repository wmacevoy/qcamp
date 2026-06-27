# Interactive Bloch Spheres & Entanglement (WebGL)

A camp-ready **1 → 2 → 3 qubit progression** of self-contained WebGL pages
(Three.js from a CDN) that watch a beautiful representation work perfectly,
then strain, then break. Fully static — **no server-side components** — so it
hosts as-is on GitHub Pages.

| File | Page | Representation status |
|---|---|---|
| `index.html` | **Overview** — the progression, three cards | — |
| `one-qubit.html` | **1 qubit** — a single Bloch sphere | complete & faithful (`|r|=1` always) |
| `two-qubit.html` | **2 qubits** — two Bloch spheres + coupling sphere, Bell states, replay, **guided "build a Bell state" lesson** | complete *with the coupling sphere* |
| `three-qubit.html` | **3 qubits** — interactive sandbox (single-qubit + CNOT/Toffoli/CZ/CCZ/SWAP/Rxx/Rzz) + **guided lessons** (build GHZ; Toffoli = CCZ·H; Toffoli from Clifford+T); GHZ vs W blind spot, live τ₃ | **breaks** (multipartite entanglement invisible) |

The arc mirrors a real fact: the Bloch sphere is a **one-qubit miracle**, and
each added qubit costs the representation exactly one notch. Page 3 makes the
failure quantitative — it measures the genuinely tripartite entanglement
(`τ₃`, the 3-tangle) that *no* sphere or coupling can show: GHZ → `τ₃ = 1` (all
hidden), W → `τ₃ = 0` (all visible pairwise).

Companion notes: [rendered](notes.html) ·
[`bloch-sphere-and-entanglement.md`](bloch-sphere-and-entanglement.md)

## Host on GitHub Pages

This `docs/` folder is self-contained and is the intended publishing root.

1. Push the repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: "Deploy from a branch".**
3. Branch: `main` (or your default), **Folder: `/docs`**. Save.
4. The app goes live at `https://<user>.github.io/<repo>/`
   (rendered notes at `…/notes.html`).

Notes:
- `.nojekyll` is included so files are served verbatim (no Jekyll build).
- **Runs fully offline — no internet, no CDN.** Three.js, OrbitControls, and
  marked.js are vendored under `docs/vendor/`; pages reference them by local path.

## Run locally

The pages must be **served over HTTP** (any static server works) — the WebGL pages
import ES modules from `vendor/`, and browsers block module imports under `file://`.

**With Docker (mirrors the Pages layout exactly):**

```sh
docker-compose up        # then open http://localhost:8080/
docker-compose down      # stop
```

**Or any static server**, e.g. `python3 -m http.server -d docs 8080`. The Overview
and Complex pages also open from a raw `file://` (no modules), but the 3D pages and
the markdown-rendered pages (`notes`, `ai-mentor`, `reader`) need HTTP.

## Beyond the core pages

- **`ai-mentor.html`** — a copy-paste Socratic-tutor prompt for any AI ([`ai-mentor.md`](ai-mentor.md)).
- **`reader.html?doc=…`** — renders [`teachers.md`](teachers.md) (teacher's guide) and [`glossary.md`](glossary.md).
- **🔗 share** on the Complex and Amplitudes pages copies a URL hash that reopens the exact state.
- Responsive (phones stack the panel under the canvas) and keyboard/screen-reader friendly.

## Code structure

The three interactive pages share one toolkit so each page is just its own
layout + wiring:

- **`qlib.js`** — the shared library (global `Q`). Contains the complex-number
  math, gate matrices, an n-qubit engine (`applyU`, `cnot`/`cz`/`swap`, `bloch`,
  `corrTensor`, `concurrence`, `tangle3`, `axisAngle`), and the three.js toolkit
  (`setupScene`, `makeBlochSphere`, `makeCouplingSphere`, `makeGatePreview`,
  `makeAnimator`, `makeReplay`, labels/axes helpers). Each page does
  `const { … } = Q;` and uses them directly.
- **`q.css`** — the shared styles (nav, panel, buttons, readouts, replay log).
  Each page keeps a small `<style>` for its own bits.

`qlib.js` is loaded as a **classic** `<script src>` (not an ES module) on
purpose: local module imports are CORS-blocked under `file://`, but a classic
script loads everywhere. THREE is *injected* (`Q.initThree(THREE, …)`) from each
page's import-map module, so the library never imports and stays
renderer-agnostic. The pages dropped from ~1530 to ~770 lines in the process.

## The 2-qubit page (`two-qubit.html`)

What it shows:

- **Two Bloch spheres**, A (orange) and B (blue). Each arrow is that qubit's
  *reduced* state `r⃗`. `|0⟩` is north, `|1⟩` is south, `|+⟩` is +x.
- **Arrow length = how "definite" the qubit is.** Length 1 = pure/separable;
  length 0 (arrow gone, dot swells at center) = maximally mixed = maximally
  entangled.
- **Coupling sphere** (center) — correlation as a function of measurement
  direction. Each surface point `n̂` is colored by the joint correlation
  `E(n̂) = ⟨(n̂·σ)_A (n̂·σ)_B⟩ = n̂ᵀTn̂`: **green = correlated (+1)**, **red =
  anti-correlated (−1)**, dim grey = uncorrelated (0). The surface also **bulges
  out where correlated and pinches toward the center where not** (radius ∝
  |correlation|), so strength reads as shape against the faint reference cage.
  The panel's ⟨XX⟩/⟨YY⟩/⟨ZZ⟩ are exactly `E` along the three colored axis pokes
  (red x, green y, blue z). Readings:
  - singlet **Ψ⁻** → uniformly *red* round ball (anti-correlated in every
    direction — its rotational invariance made visible),
  - **Φ⁺** → vivid green ball with red caps,
  - product **|00⟩** → green *dumbbell* along the z-axis only (single-axis,
    classical correlation).

  A round, fully-bulged ball *while the Bloch arrows sit at the center* is the
  signature of maximal entanglement. (Concurrence C is still in the panel;
  `|r⃗| = √(1 − C²)`.)
- Live readouts: state vector + probabilities, concurrence, per-qubit `|r⃗|`,
  purity, reduced density matrices, and an auto-named state (Bell states, basis
  states, separable/entangled).

### Operator visualizations

- **Correlation fingerprint** — live bars for the joint Pauli correlations
  `⟨XX⟩`, `⟨YY⟩`, `⟨ZZ⟩` (the diagonal of the correlation tensor). These are the
  *operators that define* a Bell state: each Bell state is the unique pattern of
  ±1 signs, e.g. `Φ⁺ = (+,−,+)`. The point that lands: for an entangled state
  these joint correlations are ±1 while the single-qubit arrows sit at 0 — the
  information is in the correlation, not the parts.
- **Bell-state map** — the four Bell states as a 2×2 grid. A local Pauli on one
  qubit *walks* you between corners (`Z` →, `X` ↓, `Y` diagonal) — this is the
  superdense-coding encoding. The highlight follows whatever gates you apply, and
  you can click a corner to jump straight to that Bell state.

## Controls

- **Presets (8):** the four basis states `|00⟩ |01⟩ |10⟩ |11⟩` and the four Bell
  states `Φ⁺ Φ⁻ Ψ⁺ Ψ⁻`. A preset starts a fresh run.
- **Single-qubit gates** — the IBM Quantum Composer set: `I H X Y Z`, `S S† T T†
  √X √X†`, `Rx/Ry/Rz/P(θ)` (angle slider), and `U(θ,φ,λ)` (three inputs) — applied
  to the selected target qubit (A or B). **Hovering** a gate previews its rotation
  on the active sphere — the axis line, a **washer** where the axis pierces the
  sphere (with a mini direction/angle dial), a sweep arc with a terminus arrowhead,
  and the turn angle. **Applying** it animates the Bloch arrow rotating about that
  axis. (Same on the 1-qubit page.)
- **Two-qubit gates:** `CNOT A→B`, `CNOT B→A`, `CZ`, `SWAP`, and the tunable
  entanglers `Rxx(θ)`, `Rzz(θ)` (angle slider).
- **Gate dictionary** (collapsible) explains what each gate does in terms of the
  Bloch arrows and coupling sphere.
- **Gate log & replay:** every gate records onto the current preset. Step
  through the run with **⏮ reset · ◀ back · ▶ forward · ⏭ to latest**, or click
  any step chip to jump there. Applying a gate from a mid-replay point replaces
  whatever was ahead (`k / n` shows the position).
- Drag to rotate the view, scroll to zoom.

## Teaching flow suggestion

1. Start at `|00⟩` — two full arrows, two independent qubits.
2. Apply **H** to A → arrow swings to the equator (`|+⟩`). Still separable.
3. Apply **CNOT A→B** → *both arrows collapse to the center.* This is the
   moment the single-qubit picture breaks: the info moved into the correlation
   (the link lights up, C → 1).
4. Try **Rx(θ)** then CNOT to make *partially* entangled states and watch the
   arrows shrink part-way, tracking `|r⃗| = √(1 − C²)`.

## Implementation notes

- Pure 2-qubit state vector (4 complex amplitudes); gates are exact unitaries.
- Bloch vectors come from the reduced density matrices
  `ρ_A = Tr_B(|ψ⟩⟨ψ|)`, `ρ_B = Tr_A(...)`; concurrence `C = 2|αδ − βγ|`.
- The quantum core is covered by unit checks and the page is verified to load
  without errors under headless Chromium.
