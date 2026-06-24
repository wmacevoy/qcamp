/*
 * qlib.js — shared toolkit for the Bloch & Entanglement camp pages.
 *
 * Loaded as a CLASSIC script (not an ES module) so it also works from file://,
 * where local module imports are CORS-blocked. Everything hangs off a global `Q`.
 * THREE (and OrbitControls) are INJECTED via Q.initThree(...) from each page's
 * import-map module, so this file stays renderer-agnostic and never imports.
 *
 * Conventions: a state is an array of 2^n complex numbers {re,im}. Qubit 0 is the
 * most-significant bit (index = Σ bit_q << (n-1-q)). Bloch→three.js mapping is the
 * reflection (x,y,z) → (x, z, y): Bloch z (|0⟩–|1⟩ axis) is "up".
 */
(function (g) {
  'use strict';

  /* ----------------------------- complex ----------------------------- */
  const C = (re, im = 0) => ({ re, im });
  const cadd = (a, b) => ({ re: a.re + b.re, im: a.im + b.im });
  const csub = (a, b) => ({ re: a.re - b.re, im: a.im - b.im });
  const cmul = (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
  const cconj = a => ({ re: a.re, im: -a.im });
  const cabs2 = a => a.re * a.re + a.im * a.im;
  const R2 = Math.SQRT1_2;

  /* ----------------------------- gates ------------------------------- */
  const gates = {
    I: [[C(1), C(0)], [C(0), C(1)]],
    H: [[C(R2), C(R2)], [C(R2), C(-R2)]],
    X: [[C(0), C(1)], [C(1), C(0)]],
    Y: [[C(0), C(0, -1)], [C(0, 1), C(0)]],
    Z: [[C(1), C(0)], [C(0), C(-1)]],
    S: [[C(1), C(0)], [C(0), C(0, 1)]],
    Sdg: [[C(1), C(0)], [C(0), C(0, -1)]],
    T: [[C(1), C(0)], [C(0), C(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4))]],
    Tdg: [[C(1), C(0)], [C(0), C(Math.cos(Math.PI / 4), -Math.sin(Math.PI / 4))]],
    SX: [[C(0.5, 0.5), C(0.5, -0.5)], [C(0.5, -0.5), C(0.5, 0.5)]],
    SXdg: [[C(0.5, -0.5), C(0.5, 0.5)], [C(0.5, 0.5), C(0.5, -0.5)]],
  };
  function rotGate(axis, th) {
    const c = Math.cos(th / 2), s = Math.sin(th / 2);
    if (axis === 'X') return [[C(c), C(0, -s)], [C(0, -s), C(c)]];
    if (axis === 'Y') return [[C(c), C(-s)], [C(s), C(c)]];
    return [[C(c, -s), C(0)], [C(0), C(c, s)]]; // Rz
  }
  const pGate = lam => [[C(1), C(0)], [C(0), C(Math.cos(lam), Math.sin(lam))]];   // phase P(λ) = diag(1, e^{iλ})
  function uGate(th, ph, lam) {                                                    // IBM U(θ,φ,λ)
    const c = Math.cos(th / 2), s = Math.sin(th / 2);
    return [[C(c, 0), C(-s * Math.cos(lam), -s * Math.sin(lam))],
            [C(s * Math.cos(ph), s * Math.sin(ph)), C(c * Math.cos(ph + lam), c * Math.sin(ph + lam))]];
  }
  function rxxGate(th) {                                                           // exp(−iθ/2 X⊗X)
    const c = Math.cos(th / 2), s = Math.sin(th / 2);
    return [[C(c), C(0), C(0), C(0, -s)], [C(0), C(c), C(0, -s), C(0)], [C(0), C(0, -s), C(c), C(0)], [C(0, -s), C(0), C(0), C(c)]];
  }
  function rzzGate(th) {                                                           // exp(−iθ/2 Z⊗Z) = diag(e∓, e±, e±, e∓)
    const c = Math.cos(th / 2), s = Math.sin(th / 2);
    return [[C(c, -s), C(0), C(0), C(0)], [C(0), C(c, s), C(0), C(0)], [C(0), C(0), C(c, s), C(0)], [C(0), C(0), C(0), C(c, -s)]];
  }
  const PAULI = { x: gates.X, y: gates.Y, z: gates.Z };

  // 2×2 unitary → Bloch-sphere rotation { axis: [x,y,z], theta }
  function axisAngle(U) {
    const det = csub(cmul(U[0][0], U[1][1]), cmul(U[0][1], U[1][0]));
    const ph = Math.atan2(det.im, det.re) / 2, e = C(Math.cos(-ph), Math.sin(-ph));
    const v00 = cmul(U[0][0], e), v01 = cmul(U[0][1], e), v10 = cmul(U[1][0], e), v11 = cmul(U[1][1], e);
    const theta = 2 * Math.acos(Math.max(-1, Math.min(1, (v00.re + v11.re) / 2)));
    const s = Math.sin(theta / 2);
    if (Math.abs(s) < 1e-9) return { theta: 0, axis: [0, 0, 1] };
    const vx = -v01.im / s, vy = v10.re / s, vz = (v11.im - v00.im) / 2 / s, L = Math.hypot(vx, vy, vz) || 1;
    return { theta, axis: [vx / L, vy / L, vz / L] };
  }

  /* ------------------------- n-qubit engine -------------------------- */
  function normalize(state) {
    let s = 0; for (const a of state) s += cabs2(a); s = Math.sqrt(s) || 1;
    return state.map(a => C(a.re / s, a.im / s));
  }
  function applyU(state, n, q, U) {                 // single-qubit gate → new state
    const mask = 1 << (n - 1 - q), out = state.slice();
    for (let i = 0; i < state.length; i++) if ((i & mask) === 0) {
      const j = i | mask, a = state[i], b = state[j];
      out[i] = cadd(cmul(U[0][0], a), cmul(U[0][1], b));
      out[j] = cadd(cmul(U[1][0], a), cmul(U[1][1], b));
    }
    return out;
  }
  function cnot(state, n, c, t) {
    const cm = 1 << (n - 1 - c), tm = 1 << (n - 1 - t), out = state.slice();
    for (let i = 0; i < state.length; i++) if ((i & cm) && !(i & tm)) { const j = i | tm; out[i] = state[j]; out[j] = state[i]; }
    return out;
  }
  function cz(state, n, c, t) {
    const cm = 1 << (n - 1 - c), tm = 1 << (n - 1 - t), out = state.slice();
    for (let i = 0; i < state.length; i++) if ((i & cm) && (i & tm)) out[i] = cmul(out[i], C(-1));
    return out;
  }
  function swap(state, n, a, b) {
    const am = 1 << (n - 1 - a), bm = 1 << (n - 1 - b), out = state.slice();
    for (let i = 0; i < state.length; i++) {
      const ai = (i & am) ? 1 : 0, bi = (i & bm) ? 1 : 0;
      if (ai !== bi) out[(i & ~am & ~bm) | (ai ? bm : 0) | (bi ? am : 0)] = state[i];
    }
    return out;
  }
  function applyU2(state, n, qi, qj, M) {          // apply a 4×4 gate (basis qi,qj = 00,01,10,11)
    const mi = 1 << (n - 1 - qi), mj = 1 << (n - 1 - qj), out = state.slice();
    for (let i = 0; i < state.length; i++) if (!(i & mi) && !(i & mj)) {
      const idx = [i, i | mj, i | mi, i | mi | mj], a = idx.map(k => state[k]);
      for (let r = 0; r < 4; r++) { let su = C(0); for (let c = 0; c < 4; c++) su = cadd(su, cmul(M[r][c], a[c])); out[idx[r]] = su; }
    }
    return out;
  }
  // multi-controlled X: flip target where ALL controls are 1 (0 ctrl = X, 1 = CNOT, 2 = Toffoli/CCX)
  function mcx(state, n, controls, target) {
    const tm = 1 << (n - 1 - target), cmask = controls.reduce((m, c) => m | (1 << (n - 1 - c)), 0), out = state.slice();
    for (let i = 0; i < state.length; i++) if ((i & cmask) === cmask && !(i & tm)) { const j = i | tm; out[i] = state[j]; out[j] = state[i]; }
    return out;
  }
  // multi-controlled Z: phase −1 where ALL listed qubits are 1 (1 = Z, 2 = CZ, 3 = CCZ) — symmetric
  function mcz(state, n, qubits) {
    const mask = qubits.reduce((m, q) => m | (1 << (n - 1 - q)), 0), out = state.slice();
    for (let i = 0; i < state.length; i++) if ((i & mask) === mask) out[i] = cmul(out[i], C(-1));
    return out;
  }
  // ⟨ψ| (Π ops) |ψ⟩, ops = [[qubit, Pauli2x2], ...]  (Hermitian → real)
  function expect(state, n, ops) {
    let phi = state;
    for (const [q, P] of ops) phi = applyU(phi, n, q, P);
    let re = 0; for (let i = 0; i < state.length; i++) re += cmul(cconj(state[i]), phi[i]).re;
    return re;
  }
  function bloch(state, n, q) {                      // reduced single-qubit Bloch vector
    const rx = expect(state, n, [[q, PAULI.x]]), ry = expect(state, n, [[q, PAULI.y]]), rz = expect(state, n, [[q, PAULI.z]]);
    return { rx, ry, rz, len: Math.hypot(rx, ry, rz) };
  }
  function density1(b) {                             // reduced ρ from a Bloch vector
    return { r00: (1 + b.rz) / 2, r11: (1 - b.rz) / 2, r01: C(b.rx / 2, -b.ry / 2) };
  }
  function corrTensor(state, n, qi, qj) {            // 3×3 ⟨σ_a ⊗ σ_b⟩
    const ax = ['x', 'y', 'z'], T = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) T[a][b] = expect(state, n, [[qi, PAULI[ax[a]]], [qj, PAULI[ax[b]]]]);
    return T;
  }
  function concurrence(state) {                      // pure 2-qubit
    const d = csub(cmul(state[0], state[3]), cmul(state[1], state[2]));
    return Math.min(1, 2 * Math.sqrt(cabs2(d)));
  }
  function tangle3(state) {                          // pure 3-qubit 3-tangle (hyperdeterminant)
    const a = state, sq = x => cmul(x, x), prod = (...xs) => xs.reduce((p, x) => cmul(p, x));
    const d1 = [cmul(sq(a[0]), sq(a[7])), cmul(sq(a[1]), sq(a[6])), cmul(sq(a[2]), sq(a[5])), cmul(sq(a[4]), sq(a[3]))].reduce(cadd);
    const d2 = [prod(a[0], a[7], a[3], a[4]), prod(a[0], a[7], a[5], a[2]), prod(a[0], a[7], a[6], a[1]),
      prod(a[3], a[4], a[5], a[2]), prod(a[3], a[4], a[6], a[1]), prod(a[5], a[2], a[6], a[1])].reduce(cadd);
    const d3 = cadd(prod(a[0], a[6], a[5], a[3]), prod(a[7], a[1], a[2], a[4]));
    return Math.min(1, 4 * Math.sqrt(cabs2(cadd(csub(d1, cmul(C(2), d2)), cmul(C(4), d3)))));
  }

  /* --------------------------- formatting ---------------------------- */
  const z = x => Math.abs(x) < 1e-9 ? 0 : x;
  function fmtC(a) {
    const re = z(a.re), im = z(a.im);
    if (im === 0) return re.toFixed(3);
    if (re === 0) return (im > 0 ? '' : '−') + Math.abs(im).toFixed(3) + 'i';
    return re.toFixed(3) + (im >= 0 ? '+' : '−') + Math.abs(im).toFixed(3) + 'i';
  }

  /* ====================== three.js toolkit ========================== */
  let THREE, OrbitControls;
  function initThree(t, oc) { THREE = t; OrbitControls = oc; }
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const toThree = a => new THREE.Vector3(a[0], a[2], a[1]);   // Bloch (x,y,z) → three (x, z up, y)
  function perp(d) { const t = Math.abs(d.x) < 0.9 ? V3(1, 0, 0) : V3(0, 1, 0); return new THREE.Vector3().crossVectors(d, t).normalize(); }

  function makeLabel(text, color, scale = 0.5) {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128;
    const ctx = cv.getContext('2d'); ctx.fillStyle = color; ctx.font = 'bold 84px Georgia, serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 128, 64);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthTest: false }));
    sp.scale.set(scale, scale / 2, 1); return sp;
  }
  function makeDynText({ scale = 0.52, color = '#ffd24a', cw = 256, font = 38 } = {}) {
    const cv = document.createElement('canvas'); cv.width = cw; cv.height = 64;
    const ctx = cv.getContext('2d'); const tex = new THREE.CanvasTexture(cv);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
    sp.scale.set(scale, scale * 64 / cw, 1);
    return { sprite: sp, set(t) { ctx.clearRect(0, 0, cw, 64); ctx.fillStyle = color;
      ctx.font = `bold ${font}px ui-monospace, Menlo, monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(t, cw / 2, 32); tex.needsUpdate = true; } };
  }
  function axisLine(a, b, color, op = 0.7) {
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: op }));
  }

  function setupScene(canvas, opts = {}) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene(); scene.background = new THREE.Color(opts.bg ?? 0x111a30);
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    const cp = opts.cameraPos || [0, 1.2, 6]; camera.position.set(cp[0], cp[1], cp[2]);
    const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true;
    const tg = opts.target || [0, 0, 0]; controls.target.set(tg[0], tg[1], tg[2]);
    scene.add(new THREE.AmbientLight(0xffffff, opts.ambient ?? 0.82));
    const pl = new THREE.PointLight(0xffffff, opts.point ?? 70); pl.position.set(4, 6, 8); scene.add(pl);
    return { renderer, scene, camera, controls };
  }
  function attachResize(stageEl, renderer, camera) {
    const r = () => { const w = stageEl.clientWidth, h = stageEl.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
    addEventListener('resize', r); r();
  }
  function startLoop(renderer, scene, camera, controls, onFrame) {
    (function tick() { controls.update(); if (onFrame) onFrame(performance.now()); renderer.render(scene, camera); requestAnimationFrame(tick); })();
  }

  // a Bloch sphere with arrow + (centre) mixedness dot; .set(blochVec) updates it
  function makeBlochSphere(scene, opts = {}) {
    const cx = opts.cx || 0, cy = opts.cy || 0, r = opts.r || 1, color = opts.arrowColor ?? 0xffd24a;
    const g = new THREE.Group(); g.position.set(cx, cy, 0);
    g.add(new THREE.Mesh(new THREE.SphereGeometry(r, 32, 22), new THREE.MeshPhongMaterial({ color: 0xc2cff2, transparent: true, opacity: 0.12 })));
    g.add(new THREE.Mesh(new THREE.SphereGeometry(r, 16, 11), new THREE.MeshBasicMaterial({ color: 0x8da0d6, wireframe: true, transparent: true, opacity: 0.30 })));
    const eq = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 8, 60), new THREE.MeshBasicMaterial({ color: 0xa7b6e6, transparent: true, opacity: 0.78 })); eq.rotation.x = Math.PI / 2; g.add(eq);
    g.add(axisLine(V3(0, -r * 1.16, 0), V3(0, r * 1.16, 0), 0x6f7fb5));
    g.add(axisLine(V3(-r * 1.16, 0, 0), V3(r * 1.16, 0, 0), 0xd06a6a));
    g.add(axisLine(V3(0, 0, -r * 1.16), V3(0, 0, r * 1.16), 0x69b07a));
    if (opts.kets !== false) {
      const l0 = makeLabel('|0⟩', '#dfe6f7', 0.46); l0.position.set(0, r + 0.27, 0); g.add(l0);
      const l1 = makeLabel('|1⟩', '#dfe6f7', 0.46); l1.position.set(0, -r - 0.27, 0); g.add(l1);
    }
    if (opts.tag) { const lt = makeLabel(opts.tag, opts.tagColor || '#cfe2ff', 0.42); lt.position.set(0, r + 0.55, 0); g.add(lt); }
    const head = [opts.head ? opts.head[0] : 0.18 * r, opts.head ? opts.head[1] : 0.11 * r];
    const arrow = new THREE.ArrowHelper(V3(0, 1, 0), V3(0, 0, 0), r, color, head[0], head[1]); g.add(arrow);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.05 * r, 12, 12), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 })); g.add(dot);
    scene.add(g);
    function set(b) {
      const dir = V3(b.rx, b.rz, b.ry);
      if (b.len > 1e-4) { arrow.visible = true; arrow.setDirection(dir.clone().normalize()); arrow.setLength(Math.max(b.len * r, 0.001), head[0], head[1]); }
      else arrow.visible = false;
      const mix = 1 - b.len; dot.scale.setScalar(0.7 + mix * 2.0); dot.material.opacity = 0.35 + mix * 0.6;
    }
    return { group: g, arrow, dot, r, head, set };
  }

  // coupling sphere: surface coloured & bulged by E(n̂)=n̂ᵀTn̂; .set(T) updates it
  function makeCouplingSphere(scene, opts = {}) {
    const cx = opts.cx || 0, cy = opts.cy || 0, rad = opts.rad || 0.62, seg = opts.seg || 48;
    const geo = new THREE.SphereGeometry(rad, seg, Math.round(seg * 0.66));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(geo.attributes.position.count * 3), 3));
    const base = new Float32Array(geo.attributes.position.count * 3);
    { const p = geo.attributes.position; for (let k = 0; k < p.count; k++) { const x = p.getX(k), y = p.getY(k), zz = p.getZ(k), inv = 1 / Math.hypot(x, y, zz); base[3 * k] = x * inv; base[3 * k + 1] = y * inv; base[3 * k + 2] = zz * inv; } }
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.93, side: THREE.DoubleSide }));
    mesh.position.set(cx, cy, 0); scene.add(mesh);
    const cage = new THREE.Mesh(new THREE.SphereGeometry(rad * 1.004, 16, 12), new THREE.MeshBasicMaterial({ color: 0x8aa0d0, wireframe: true, transparent: true, opacity: 0.11 }));
    cage.position.set(cx, cy, 0); scene.add(cage);
    function set(T) {
      const pos = geo.attributes.position, col = geo.attributes.color, B = 0.12;
      for (let k = 0; k < pos.count; k++) {
        const dx = base[3 * k], dy = base[3 * k + 1], dz = base[3 * k + 2], b = [dx, dz, dy];
        let E = 0; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) E += T[i][j] * b[i] * b[j];
        E = Math.max(-1, Math.min(1, E)); const m = Math.abs(E), rr = rad * (0.07 + 0.93 * m);
        pos.setXYZ(k, dx * rr, dy * rr, dz * rr);
        col.setXYZ(k, B + (E >= 0 ? 0.10 - B : 0.95 - B) * m, B + (E >= 0 ? 0.90 - B : 0.25 - B) * m, B + (E >= 0 ? 0.45 - B : 0.30 - B) * m);
      }
      pos.needsUpdate = true; col.needsUpdate = true;
    }
    return { mesh, geo, rad, set };
  }

  // hover preview of a gate as a rotation: axis line + sweep arc + angle label
  function makeGatePreview(scene) {
    const pv = new THREE.Group(); pv.visible = false; scene.add(pv);
    const axis = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffd24a, transparent: true, opacity: 0.85 })); pv.add(axis);
    const arc = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffd24a })); pv.add(arc);
    const tipCone = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.13, 14), new THREE.MeshBasicMaterial({ color: 0xffd24a })); pv.add(tipCone);
    // washers marking where the axis pierces the sphere, + a mini direction/angle dial on +n̂
    const washerMat = new THREE.MeshBasicMaterial({ color: 0xffd24a, transparent: true, opacity: 0.6 });
    const washerA = new THREE.Mesh(new THREE.TorusGeometry(1, 0.08, 8, 30), washerMat); pv.add(washerA);
    const washerB = new THREE.Mesh(new THREE.TorusGeometry(1, 0.08, 8, 30), washerMat); pv.add(washerB);
    const dial = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffe98a })); pv.add(dial);
    const dialHead = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.3, 10), new THREE.MeshBasicMaterial({ color: 0xffe98a })); pv.add(dialHead);
    const ZC = new THREE.Vector3(0, 0, 1), YC = new THREE.Vector3(0, 1, 0);
    const lab = makeDynText({ scale: 0.52 }); pv.add(lab.sprite);
    function show(center, axisBloch, theta, name, curThree, r = 1) {
      pv.position.copy(center);
      const d = toThree(axisBloch).normalize(), L = 1.3 * r;
      axis.geometry.setFromPoints([d.clone().multiplyScalar(-L), d.clone().multiplyScalar(L)]);
      let u = curThree ? curThree.clone() : new THREE.Vector3(); u.addScaledVector(d, -u.dot(d));
      if (u.length() < 0.1) u = perp(d); else u.normalize();
      const w = new THREE.Vector3().crossVectors(d, u), pts = [], N = 44, ang = -theta, rad = 0.72 * r;
      for (let i = 0; i <= N; i++) { const a = ang * i / N; pts.push(u.clone().multiplyScalar(Math.cos(a)).add(w.clone().multiplyScalar(Math.sin(a))).multiplyScalar(rad)); }
      arc.geometry.setFromPoints(pts);
      // terminus arrowhead, pointing along the sweep direction where the rotation ends
      const end = pts[pts.length - 1], tdir = end.clone().sub(pts[pts.length - 2]).normalize();
      tipCone.position.copy(end);
      tipCone.quaternion.setFromUnitVectors(YC, tdir);
      tipCone.scale.setScalar(r);
      // washers flat on the sphere at ±n̂·r, oriented perpendicular to the axis
      const wr = 0.13 * r, qw = new THREE.Quaternion().setFromUnitVectors(ZC, d);
      washerA.position.copy(d.clone().multiplyScalar(r)); washerA.quaternion.copy(qw); washerA.scale.setScalar(wr);
      washerB.position.copy(d.clone().multiplyScalar(-r)); washerB.quaternion.copy(qw); washerB.scale.setScalar(wr);
      // mini dial: a bright arc on the +n̂ washer spanning the turn angle, with an arrowhead
      const ctr = d.clone().multiplyScalar(r), dp = [], M = 40;
      for (let i = 0; i <= M; i++) { const a = ang * i / M; dp.push(ctr.clone().addScaledVector(u, Math.cos(a) * wr).addScaledVector(w, Math.sin(a) * wr)); }
      dial.geometry.setFromPoints(dp);
      const dEnd = dp[dp.length - 1], dDir = dEnd.clone().sub(dp[dp.length - 2]).normalize();
      dialHead.position.copy(dEnd); dialHead.quaternion.setFromUnitVectors(YC, dDir); dialHead.scale.setScalar(0.055 * r);
      lab.set(`${name} · ${Math.round(theta * 180 / Math.PI)}°`); lab.sprite.position.copy(d.clone().multiplyScalar(L + 0.16));
      pv.visible = true;
    }
    return { show, hide() { pv.visible = false; } };
  }

  // Rotation sense for the cosmetic sweep. The Bloch→three map is a reflection, so the
  // displayed rotation is canonically −θ about the mapped axis (matches the preview arc).
  // We still verify against the true final, but ties (e.g. a 180° gate, where ±θ coincide)
  // resolve to −θ so the same gate always sweeps the same way instead of flipping by noise.
  function rotationToward(r0three, r1three, axisBloch, theta) {
    const axis3 = toThree(axisBloch).normalize();
    const dPlus = r0three.clone().applyAxisAngle(axis3, theta).distanceTo(r1three);
    const dMinus = r0three.clone().applyAxisAngle(axis3, -theta).distanceTo(r1three);
    return { axis3, ang: dPlus < dMinus - 1e-6 ? theta : -theta };
  }
  // eased timer; start(applyFn) drives a cosmetic animation, tick(now) advances it
  function makeAnimator(dur = 420) {
    let a = null;
    return {
      start(applyFn) { a = { applyFn, t0: performance.now() }; },
      clear() { a = null; },
      get active() { return !!a; },
      tick(now) { if (!a) return; const t = Math.min(1, (now - a.t0) / dur); const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; a.applyFn(e, t); if (t >= 1) a = null; },
    };
  }

  /* --------------------------- replay engine ------------------------- */
  // onRebuild(baseState, opsToApply) recomputes the page state & redraws.
  function makeReplay({ onRebuild, log, pos }) {
    let base = null, baseLabel = '', history = [], cursor = 0;
    function renderLog() {
      let html = `<span class="step ${cursor === 0 ? 'cur' : 'done'}" data-i="0">${baseLabel}</span>`;
      history.forEach((op, i) => { const di = i + 1, cls = di === cursor ? 'cur' : di < cursor ? 'done' : 'pend'; html += `<span class="step ${cls}" data-i="${di}">${op.label}</span>`; });
      log.innerHTML = html; pos.textContent = `${cursor} / ${history.length}`;
    }
    function rebuild() { onRebuild(base, history.slice(0, cursor)); renderLog(); }
    return {
      setBase(b, label) { base = b; baseLabel = label; history = []; cursor = 0; rebuild(); },
      push(op) { if (cursor < history.length) history.length = cursor; history.push(op); cursor = history.length; rebuild(); },
      reset() { cursor = 0; rebuild(); },
      back() { if (cursor > 0) { cursor--; rebuild(); } },
      fwd() { if (cursor < history.length) { cursor++; rebuild(); } },
      cont() { cursor = history.length; rebuild(); },
      jump(i) { cursor = Math.max(0, Math.min(history.length, i)); rebuild(); },
    };
  }

  g.Q = {
    C, cadd, csub, cmul, cconj, cabs2, R2, z, fmtC,
    gates, rotGate, pGate, uGate, rxxGate, rzzGate, PAULI, axisAngle,
    normalize, applyU, applyU2, mcx, mcz, cnot, cz, swap, expect, bloch, density1, corrTensor, concurrence, tangle3,
    initThree, toThree, perp, V3: (x, y, z) => new THREE.Vector3(x, y, z),
    makeLabel, makeDynText, axisLine, setupScene, attachResize, startLoop,
    makeBlochSphere, makeCouplingSphere, makeGatePreview, rotationToward, makeAnimator, makeReplay,
  };
})(typeof window !== 'undefined' ? window : globalThis);
