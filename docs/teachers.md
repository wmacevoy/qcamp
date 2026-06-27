# Teacher's guide

A practical guide to running this lab in a classroom or club. The site is a **predict → test →
reconcile** machine: every page gives instant, honest feedback, so the strongest move is always to
have students *commit to a prediction before they click*. Pair it with the
[AI mentor](ai-mentor.html) for one-on-one Socratic practice, or drive it yourself with the prompts
below.

## Who it's for

- **Prerequisites:** comfort with `√`, the Pythagorean theorem, angles, and (x, y) coordinates — roughly **Algebra II / precalculus**. No calculus, no prior quantum.
- **Bridges from what they know:** vectors/arrows, coin-flip probabilities, waves that add and cancel. Lean on these.
- **Audience:** late high school and up; motivated middle-schoolers can do the 1-qubit and Complex stops.

## The path & timing

| Stop | Big idea | ~Time | Stops well after… |
|---|---|---|---|
| [1 qubit](one-qubit.html) | the arrow *is* the qubit; gates are rotations | 10–15 min | they can predict where H/X/Z send a state |
| [2 qubits](two-qubit.html) | entangle → arrows vanish, info moves to the coupling sphere | 15–20 min | building a Bell state and explaining the blank arrows |
| [3 qubits](three-qubit.html) | the picture *breaks* — GHZ looks empty (`τ₃`) | 10–15 min | GHZ vs W comparison |
| [Complex](complex.html) | arrows you add, multiply, turn; `i` = a quarter-turn | 20–30 min | the √(prob) lesson |
| [Amplitudes](amplitudes.html) | the state is a table of `√prob ↺ phase`; it doubles per qubit | 20–30 min | the "build your own" lesson |

A single **50-minute period** comfortably covers either **1→2→3 qubits** *or* **Complex → Amplitudes**.
The Complex and Amplitudes pages have built-in lesson chips with **predict-then-reveal checks**.

## Learning objectives (by stop)

- **1 qubit** — state ↔ a point on a sphere; every gate is a rotation; for one qubit *nothing is hidden* (but global phase).
- **2 qubits** — separable vs entangled; a reduced (single-qubit) state can be *mixed*; correlation lives between the qubits, not in them.
- **3 qubits** — entanglement comes in *kinds*; a faithful local picture stops existing; `τ₃` quantifies the invisible part.
- **Complex** — two names for one number (`x+iy`, `r ↺ θ°`); multiplication = stretch-and-turn; `i² = −1` is "two quarter-turns"; amplitude = `√(probability)`.
- **Amplitudes** — a state = one arrow per outcome; gates mix/cancel arrows (interference); measurement collapses; `2ⁿ` rows is why classical pictures fail.

## Common misconceptions → the experiment that breaks each

- *"A gate changes how *likely* |0⟩ is, like adding probabilities."* → Interference (H, Z, H): probabilities can't cancel; amplitudes can.
- *"Entangled qubits each still have a definite state we just can't see."* → 2-qubit Bell: the reduced arrow is genuinely centred (mixed); the singlet looks identical from every direction.
- *"More qubits is just more spheres."* → 3-qubit GHZ: maximal entanglement, blank spheres, `τ₃ = 1`.
- *"`i` is fake/unreal."* → Complex × tab: `i` is nothing but a 90° turn; multiply repeatedly to cycle 1 → i → −1 → −i.
- *"The sphere is the real thing; the table is a simplification."* → Amplitudes: step 1→6 qubits, 64 rows; extrapolate — the table is primary.

## Discussion prompts

- After the 2-qubit collapse: *"The qubits clearly affected each other — so where did the information go?"*
- *"If you measure one of an entangled pair, what do you instantly know about the other? Did anything travel?"*
- *"Why can probabilities only add, while amplitudes can cancel? What does that buy a quantum computer?"*
- *"A 300-qubit table has more rows than atoms in the universe. What does that imply about simulating quantum systems on a normal computer?"*

## Classroom logistics

- **Works fully offline** once served (GitHub Pages, or `docker-compose up`). No accounts, no installs, runs in any modern browser; the 3D pages need WebGL.
- **Share a setup instantly:** on the Complex and Amplitudes pages the **🔗 share** button copies a link that reopens the *exact* state — great for "everyone open this," for worked examples, or for collecting student work.
- **Projecting:** the dark high-contrast theme reads well on a screen; drag to rotate the 3D views for the room.
- **No AI in the room?** The in-page lessons and predict-then-reveal checks stand alone; the AI mentor is a bonus, not a requirement.

## Assessment ideas

- **Exit ticket:** "Predict where H sends |+⟩, then verify on the 1-qubit page — were you right? Explain."
- **Build-and-submit:** have students construct a target state on the Amplitudes page and submit the **share link**.
- **Explain-back:** "In your own words, why do the Bloch arrows go blank for a Bell state but the table stays full?"
