# Site map & summary

A one-page map of the whole lab — the arc, every page's **upshot**, and its **lessons** — so a
teacher or an AI agent can navigate the structure fast. (Companion to the [AI mentor](ai-mentor.html)
and [Teacher's guide](reader.html?doc=teachers.md).)

## The arc in one breath

The Bloch sphere is a **one-qubit miracle** → it **strains at 2 qubits** (entangle them and both
arrows blank out; the information moves to a central *coupling sphere*) → it **breaks at 3** (a
maximally entangled GHZ leaves every sphere empty; only `τ₃` sees it) → so **level up** to the real
machinery: **complex numbers** as arrows you stretch and turn → **amplitudes**, the table that
*scales* (`√prob ↺ phase`, one arrow per outcome, doubling with every qubit).

## The path

**Main path: 1 qubit → Complex → Amplitudes.** That's the spine — the conceptual ladder (qubit →
complex numbers → the amplitude table) stands on its own.

**The 2- and 3-qubit Bloch pages are *optional*.** They're a motivating detour: you *watch* the
friendly picture strain (2 qubits — arrows blank, info → coupling sphere) and break (3 qubits — GHZ
looks empty, only `τ₃` sees it), which is what makes you *want* amplitudes. Take them for the full
"aha"; skip them when short on time or when students already accept that pictures don't scale.

## Pages — upshot + lessons

### 1 qubit · `one-qubit.html`
**Upshot:** the arrow *is* the qubit; every gate is a **rotation**; for one qubit nothing is hidden but the (unobservable) global phase.
- Presets: |0⟩ |1⟩ |+⟩ |−⟩ |+i⟩ |−i⟩
- Gates: I H X Y Z · S S† T T† √X √X† · Rx/Ry/Rz/P(θ) · U(θ,φ,λ) — hover any gate to preview its rotation
- **Measure** (Z basis) → the arrow snaps to a pole · gate log + replay

### 2 qubits · `two-qubit.html`
**Upshot:** entangle them and both arrows go blank — the information moves into the centre **coupling sphere**. Complete, but only with that help.
- Guided lesson: **build a Bell state**
- Presets: |00⟩ |01⟩ |10⟩ |11⟩ · Bell Φ⁺ Φ⁻ Ψ⁺ Ψ⁻
- Gates: single-qubit (target A/B) · CNOT A→B, CNOT B→A, CZ, SWAP, Rxx, Rzz
- Coupling sphere · correlation fingerprint ⟨XX⟩⟨YY⟩⟨ZZ⟩ · Bell-state map
- **Measure both** → arrows snap to poles, coupling darkens (correlation spent)

### 3 qubits · `three-qubit.html`
**Upshot:** the picture **breaks** — GHZ looks empty though it's maximally entangled; `τ₃` (the 3-tangle) measures what no sphere can show (GHZ τ₃ = 1, all hidden; W τ₃ = 0, all visible pairwise).
- Guided lessons: **build GHZ** · **Toffoli = CCZ·H** · **Toffoli from H, T, CNOT**
- Presets: GHZ · W · |000⟩ · |+++⟩
- Gates: single · C·X (0 ctrl = X, 1 = CNOT, 2 = Toffoli) · C·Z (CZ/CCZ) · SWAP, Rxx, Rzz · live τ₃ + per-qubit entanglement budget
- **Measure all** → τ₃ drops to 0

### Complex numbers · `complex.html`
**Upshot:** a complex number is just a **point/arrow** on a plane — `x + iy` or `r ↺ θ°`. The algebra every amplitude obeys.
- **a point:** 3+4i (the 3-4-5 triangle) · 1+i · the quadrants · the axis points (1, i, −1, −i) · 0 · **r = √(r²)** · **√(prob)** (amplitude = √probability) · **θ° vs θπ** (degrees vs radians)
- **+ add:** sum · make 0 · order doesn't matter
- **− subtract:** undo · flip-then-add
- **× multiply:** lengths × , angles + · rotate (unit circle = pure spin = T/S/Z) · **z × z\* = r²** (conjugate: angles cancel, lengths equal → |z|²) · order doesn't matter · × 0
- **÷ divide:** undo · invert-then-multiply · order matters · ÷ 0 (undefined)
- Toggle representations (x+iy, r↺θ°, r↺θπ, √(r²)) · **🔗 share** a point/operation by link

### Amplitudes · `amplitudes.html`
**Upshot:** drop the sphere — a state *is* a table with one arrow per outcome (`√prob ↺ phase`), and it **doubles** with every qubit. The picture that scales.
- Guided lessons (each with a **predict-then-reveal** check): **the table** · **superposition (H)** · **interference (H,Z,H)** · **entanglement (Bell)** · **measurement** · **the exponential** (1→6 qubits, 64 rows) · **build your own**
- 1–6 qubits with a live 2ⁿ row count · gates H/X/Y/Z/S/T + CNOT · recipes (Bell, Interference)
- Bloch-sphere comparison for n ≤ 2 (toggle) · **measure** (collapse) · **normalize** · **🔗 share** the exact state · drag any arrow to edit its length + phase

## Companion resources

- **AI mentor** — `ai-mentor.html` ([prompt](ai-mentor.md)): a Socratic-tutor system prompt for any AI.
- **Teacher's guide** — [`teachers.md`](reader.html?doc=teachers.md): prerequisites (middle-school math — `√` is the key one), timing, objectives, misconceptions, discussion prompts.
- **Glossary** — [`glossary.md`](reader.html?doc=glossary.md): plain-language definitions.
- **Background notes** — [`notes.html`](notes.html): the longer essay.

> Everything runs offline in any modern browser (served over HTTP; the WebGL pages need it).
