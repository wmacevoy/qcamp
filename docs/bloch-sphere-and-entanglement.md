# Bloch Spheres & Entanglement — Camp Notes

How the Bloch-sphere picture connects to the "traditional" ways of writing
quantum states (kets, vectors, matrices, circuits, correlation tables) — and
the one big surprise that trips everyone up.

---

## The big idea (read this first)

**A Bloch sphere describes *one* qubit. Entanglement is a property of *two or
more* qubits together. So entanglement is exactly the thing a single Bloch
sphere cannot show.**

Here is the punchline that makes students sit up:

> For a Bell pair, the *pair* is in a perfectly known (pure) state, yet *each
> individual qubit* sits at the **dead center** of its own Bloch sphere — the
> point of maximum ignorance.

The information isn't gone. It has moved out of the individual qubits and into
the **correlation between them**. Knowledge lives in the relationship, not in
the parts. That migration of information is *what entanglement is*, and it is
the bridge between the geometric (Bloch) picture and the algebraic (vector /
matrix) picture.

---

## 1. One qubit: the Bloch sphere as a translation of the ket

A pure single-qubit state, in the traditional ket / Dirac notation:

```
|ψ⟩ = cos(θ/2) |0⟩ + e^{iφ} sin(θ/2) |1⟩
```

maps to a point on the unit sphere at spherical angles (θ, φ):

```
            |0⟩   (north pole, θ=0)
             |
   |-i⟩ ---- + ---- |+⟩         equator = equal superpositions
             |                  |+⟩, |-⟩, |+i⟩, |-i⟩
            |1⟩   (south pole, θ=π)
```

| Ket representation                | Bloch-sphere representation        |
|-----------------------------------|------------------------------------|
| amplitudes cos(θ/2), e^{iφ}sin(θ/2)| a point/arrow (θ, φ)               |
| relative phase φ                  | longitude (rotation about z)       |
| global phase e^{iα}               | **not shown** (physically invisible)|
| normalization ⟨ψ\|ψ⟩ = 1          | arrow has length 1 (on the surface)|

**Density-matrix bridge.** The cleanest link between "traditional matrices" and
the sphere is the density matrix. Any single-qubit state is

```
ρ = ½ ( I + r⃗ · σ⃗ ) ,    σ⃗ = (X, Y, Z) = Pauli matrices
```

where **r⃗ = (r_x, r_y, r_z) is literally the Bloch vector**.

- |r⃗| = 1  → pure state, **on the surface**
- |r⃗| < 1  → mixed state, **inside** the ball
- |r⃗| = 0  → maximally mixed ρ = I/2, **at the center**

This `|r⃗| < 1 = inside` fact is the hinge for everything about entanglement
below, so make sure students are comfortable with the interior of the ball
*before* you introduce two qubits.

---

## 2. Two qubits, no entanglement: just two spheres

A **product (separable)** state factors:

```
|Ψ⟩ = |ψ⟩_A ⊗ |ψ⟩_B
```

Each qubit has its own definite pure state, so you draw **two arrows on two
spheres**. Nothing weird. Example:

```
|+⟩ ⊗ |0⟩ = (|00⟩ + |10⟩)/√2
   →  arrow A points along +x ,  arrow B points to north pole
```

This is the case where the Bloch picture and the ket picture agree perfectly
and completely.

---

## 3. Two qubits, entangled: the arrows collapse to the center

Take the Bell state (traditional ket):

```
|Φ⁺⟩ = (|00⟩ + |11⟩)/√2
```

It does **not** factor as |ψ⟩_A ⊗ |ψ⟩_B (try it — no choice of single-qubit
states works). To ask "what is qubit A's state?" you compute the **reduced
density matrix** by *tracing out* qubit B:

```
ρ_A = Tr_B( |Φ⁺⟩⟨Φ⁺| ) = ½ ( |0⟩⟨0| + |1⟩⟨1| ) = ½ I  =  [ ½  0 ]
                                                           [ 0  ½ ]
```

That is the **maximally mixed state**: Bloch vector r⃗_A = 0, sitting at the
**center** of the sphere. Same for qubit B.

```
   Product state |+⟩⊗|0⟩          Bell state |Φ⁺⟩
   ┌───────────┐ ┌──────────┐     ┌───────────┐ ┌──────────┐
   │     ↗     │ │    ↑     │     │     •     │ │    •     │
   │  A (x)    │ │  B (z)   │     │  A center │ │ B center │
   └───────────┘ └──────────┘     └───────────┘ └──────────┘
   arrows have length 1            both arrows have length 0
   (full local knowledge)         (zero local knowledge, all
                                   info is in the correlation)
```

**This is the whole lesson in one image.** Maximal entanglement ⇒ both local
Bloch vectors shrink to zero. The Bloch spheres go blank precisely *because*
the state is maximally entangled.

---

## 4. The dictionary: each "traditional" representation vs. the Bloch picture

Use `|Φ⁺⟩ = (|00⟩ + |11⟩)/√2` as the running example.

### (a) Dirac / ket notation
```
|Φ⁺⟩ = (|00⟩ + |11⟩)/√2
```
Shows entanglement as the **impossibility of factoring**. The four Bell states:

| Name   | Ket                     | "Correlation"        |
|--------|-------------------------|----------------------|
| Φ⁺     | (\|00⟩ + \|11⟩)/√2      | same bits, + phase   |
| Φ⁻     | (\|00⟩ − \|11⟩)/√2      | same bits, − phase   |
| Ψ⁺     | (\|01⟩ + \|10⟩)/√2      | opposite bits, + ph. |
| Ψ⁻     | (\|01⟩ − \|10⟩)/√2      | opposite bits (singlet)|

### (b) Column vector (amplitudes in basis order 00, 01, 10, 11)
```
α|00⟩ + β|01⟩ + γ|10⟩ + δ|11⟩   ↔   (α, β, γ, δ)ᵀ
|Φ⁺⟩  ↔  (1/√2, 0, 0, 1/√2)ᵀ
```
A clean algebraic **entanglement test**: the state is separable **iff
αδ − βγ = 0**. The size of that determinant *is* the entanglement:

```
concurrence  C = 2 |αδ − βγ|        (pure 2-qubit states)
C = 0 → product      C = 1 → maximally entangled
```
For |Φ⁺⟩: αδ − βγ = ½ − 0 = ½, so C = 1. Maximal.

### (c) Coefficient matrix + SVD = Schmidt decomposition  ← the key bridge
Reshape the amplitudes into a 2×2 matrix:
```
M = [ α  β ]      |Φ⁺⟩ → M = (1/√2)[ 1  0 ]
    [ γ  δ ]                        [ 0  1 ]
```
Then **the singular-value decomposition of M is the Schmidt decomposition**:
- singular values (Schmidt coefficients) √λ₁, √λ₂  with λ₁ + λ₂ = 1
- separable ⟺ rank(M) = 1 ⟺ det(M) = 0 ⟺ one singular value is 0
- ρ_A = M M†  → its eigenvalues are λ₁, λ₂

This ties the matrix picture straight back to the sphere, because the **length
of the reduced Bloch vector is set by the Schmidt coefficients**:

```
|r⃗_A| = |λ₁ − λ₂|         (eigenvalues of ρ_A are λ₁, λ₂)
```
- λ₁ = 1, λ₂ = 0 → |r⃗_A| = 1 → surface → product state
- λ₁ = λ₂ = ½   → |r⃗_A| = 0 → center  → maximally entangled

### (d) Full 4×4 density matrix
```
ρ = |Φ⁺⟩⟨Φ⁺| = ½ [ 1 0 0 1 ]
                  [ 0 0 0 0 ]
                  [ 0 0 0 0 ]
                  [ 1 0 0 1 ]
```
The **off-diagonal corner terms (the 1's)** are the coherences that encode
entanglement. Trace out a qubit and they vanish, leaving ρ_A = I/2. That
"tracing out destroys the off-diagonal info" is the matrix-language version of
"the Bloch arrow shrinks to the center."

### (e) Circuit diagram (the operational recipe)
```
|0⟩ ──[H]──●──   How to MAKE |Φ⁺⟩ from |00⟩:
           │     1. Hadamard puts qubit 0 on the equator (|+⟩)
|0⟩ ───────⊕──   2. CNOT entangles them
```
The Bloch picture can show step 1 (arrow swings to the equator) but **cannot
show step 2** — the moment of entangling is exactly the moment the single-qubit
picture breaks down. Great place to pause the camp and point this out live.

### (f) Correlation table (what you actually measure)
This is the representation that *captures* what the Bloch sphere drops:

| Measure both in Z basis | Outcome probability |
|-------------------------|---------------------|
| 00                      | 1/2                 |
| 01                      | 0                   |
| 10                      | 0                   |
| 11                      | 1/2                 |

Each qubit *alone* looks like a fair coin (50/50 — that's the center of the
sphere!), but the two coins are **perfectly correlated**. For a Bell state this
correlation holds *in every measurement basis*, which is the thing no
local-hidden / "definite but unknown" picture can reproduce (→ Bell
inequalities, if your camp goes there).

---

## 5. A geometry that *does* show entanglement: Bloch vectors + correlation tensor

You can keep a geometric picture for two qubits if you add a piece. Any
two-qubit density matrix is:

```
ρ = ¼ [ I⊗I  +  r⃗_A·σ⃗ ⊗ I  +  I ⊗ r⃗_B·σ⃗  +  Σ_ij T_ij  σ_i ⊗ σ_j ]
        └───┘   └──────────────────────────┘   └──────────────────┘
       global      two local Bloch vectors        3×3 correlation
                   (the two spheres)               tensor T  (the glue)
```

- **Product state:** r⃗_A, r⃗_B have length 1; T = r⃗_A r⃗_Bᵀ is just their
  product (carries no *independent* information).
- **Bell state:** r⃗_A = r⃗_B = **0** (blank spheres) and **all** the structure
  is in T:
  - |Φ⁺⟩ → T = diag(+1, −1, +1)
  - |Ψ⁻⟩ (singlet) → T = diag(−1, −1, −1), rotationally invariant

So the honest two-qubit "picture" is **two spheres plus a correlation box T**.
Entanglement is the information that refuses to live on the spheres and ends up
in the box.

---

## 6. Misconceptions to head off at camp

1. **"Draw entanglement as two arrows pointing in correlated directions."**
   No — for a Bell pair the arrows have *zero length*. Correlation is not a
   direction; it lives in the tensor T, not on the spheres.

2. **"Each qubit secretly has a definite state we just don't know."**
   No — the reduced state ρ_A = I/2 is *genuinely* mixed, not a hidden definite
   value. (This is precisely what Bell tests rule out.)

3. **"The global phase matters."** It never does — that's *why* the Bloch
   sphere can throw it away. **Relative** phase (Φ⁺ vs Φ⁻) absolutely matters
   and shows up as the sign in the correlation tensor.

4. **"More entanglement = bigger/brighter arrows."** Backwards. **More
   entanglement = shorter local arrows.** |r⃗_A| = √(1 − C²): the arrow length
   and the concurrence trade off directly.

---

## 7. One-line summary table

| Representation        | Shows entanglement as…                        | Hides…                |
|-----------------------|-----------------------------------------------|-----------------------|
| Single Bloch sphere   | (can't — only 1 qubit)                        | everything multi-qubit|
| Two Bloch spheres     | both arrows shrink toward center              | the correlation itself|
| Ket notation          | can't be factored                            | measurement stats     |
| Coefficient vector    | αδ − βγ ≠ 0                                   | geometry              |
| Coeff. matrix + SVD   | rank 2 / two nonzero Schmidt coefficients     | phases (a bit)        |
| 4×4 density matrix    | off-diagonal coherences                       | intuition             |
| Circuit               | the CNOT step                                 | the state's structure |
| Correlation table     | basis-independent perfect correlation         | the amplitudes        |
| Spheres + tensor T    | nonzero T with zero local vectors             | (nothing — complete)  |

---

## Quick reference — the numbers that connect the pictures

For a pure 2-qubit state with Schmidt coefficients λ₁, λ₂ (λ₁ + λ₂ = 1):

```
local Bloch vector length   |r⃗_A| = |λ₁ − λ₂|
purity of one qubit         Tr(ρ_A²) = ½(1 + |r⃗_A|²)
concurrence                 C = 2|αδ − βγ| = √(1 − |r⃗_A|²)
tangle                      τ = C² = 1 − |r⃗_A|²
```

Product state: |r⃗_A| = 1, C = 0, τ = 0.
Bell state:    |r⃗_A| = 0, C = 1, τ = 1.

**The single sentence to leave them with:** *as a pair of qubits becomes more
entangled, each one's Bloch arrow shrinks — full knowledge of the whole buys
you total ignorance of the parts.*
```
