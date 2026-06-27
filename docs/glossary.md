# Glossary

Plain-language definitions for the terms you'll meet in the lab. Each links to where you can *see*
it on a page.

<dl>

<dt>Qubit</dt>
<dd>The quantum version of a bit. Instead of just 0 or 1, it can be any <b>superposition</b> of |0⟩ and |1⟩. See it as an arrow on the <a href="one-qubit.html">1-qubit</a> page.</dd>

<dt>State</dt>
<dd>The complete description of a quantum system. For one qubit it's the Bloch arrow; for many qubits it's the whole <b>amplitude</b> table on the <a href="amplitudes.html">Amplitudes</a> page.</dd>

<dt>|0⟩, |1⟩  (ket notation)</dt>
<dd>The two definite outcomes ("basis states"). <code>|01⟩</code> means qubit 0 is 0 and qubit 1 is 1. The brackets <code>|…⟩</code> are just how physicists write "the state."</dd>

<dt>Superposition</dt>
<dd>Being in a blend of outcomes at once — e.g. <code>|+⟩ = (|0⟩+|1⟩)/√2</code>, a 50/50 mix. Apply <b>H</b> to |0⟩ on the 1-qubit page to make one.</dd>

<dt>Amplitude</dt>
<dd>The number attached to each outcome, written <code>√prob ↺ phase</code>: a length whose square is the probability, carried at an angle (the phase). The star of the <a href="amplitudes.html">Amplitudes</a> page.</dd>

<dt>Probability</dt>
<dd>The chance of actually measuring an outcome = the amplitude's <b>length squared</b> (<code>r²</code>). All probabilities add to 100%.</dd>

<dt>Phase</dt>
<dd>The <i>direction</i> of an amplitude-arrow (the <code>↺ θ</code> part). Invisible to a single measurement on its own, but it decides how arrows <b>interfere</b>.</dd>

<dt>Complex number</dt>
<dd>A point on a plane, written <code>x + iy</code> or <code>r ↺ θ°</code> (length-and-turn). The math every amplitude obeys — explore it on the <a href="complex.html">Complex</a> page.</dd>

<dt>i (imaginary unit)</dt>
<dd>A quarter-turn. Multiplying by <code>i</code> rotates an arrow 90°; do it twice and you land on −1, which is all <code>i² = −1</code> ever meant.</dd>

<dt>Gate</dt>
<dd>An operation on qubits. Every single-qubit gate is a <b>rotation</b> of the Bloch sphere (H, X, Y, Z, S, T, …). Hover a gate on the 1-qubit page to see its rotation.</dd>

<dt>Interference</dt>
<dd>Amplitude-arrows adding or <b>cancelling</b>. Unlike probabilities, amplitudes can point opposite ways and cancel to zero — the core quantum advantage. See the <b>Interference</b> lesson (H, Z, H) on the Amplitudes page.</dd>

<dt>Bloch sphere</dt>
<dd>The arrow-on-a-ball picture of one qubit: |0⟩ up, |1⟩ down, |+⟩ on the equator. Complete for one qubit; it strains and breaks as you add more.</dd>

<dt>Entanglement</dt>
<dd>When the table <b>won't factor</b> into separate qubits — the information lives in the <b>correlation</b>, not the parts. On the <a href="two-qubit.html">2-qubit</a> page, both arrows go blank and the coupling sphere lights up.</dd>

<dt>Bell state</dt>
<dd>The simplest entangled pair, e.g. <code>(|00⟩+|11⟩)/√2</code> — the two qubits always agree, but neither has a state of its own.</dd>

<dt>Coupling sphere</dt>
<dd>The centre ball on the 2-qubit page. It shows the <b>correlation</b> between the qubits — what the individual Bloch arrows lose when they entangle.</dd>

<dt>Measurement / collapse</dt>
<dd>Reading out a qubit. The state <b>collapses</b> to one outcome (chosen by its probability), and amplitude 1 lands on the winner. The one place randomness enters — try <b>⊙ measure</b> on the Amplitudes page.</dd>

<dt>Normalize</dt>
<dd>Rescaling so the probabilities add to 100% (<code>Σ|amplitude|² = 1</code>) — what makes a table a valid quantum state. The <b>normalize</b> button does it.</dd>

<dt>τ₃ (3-tangle)</dt>
<dd>A number measuring genuinely three-way entanglement. GHZ has <code>τ₃ = 1</code> (all hidden from the pictures); W has <code>τ₃ = 0</code>. The thing the <a href="three-qubit.html">3-qubit</a> page can't draw.</dd>

<dt>2ⁿ scaling</dt>
<dd>n qubits need a table of <b>2ⁿ rows</b> — it doubles with each qubit. By a few hundred qubits that's more rows than atoms in the universe, which is why classical computers can't simulate them and why no fixed picture survives.</dd>

</dl>
