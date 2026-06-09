const canvas = document.getElementById("bc");
const ctx = canvas.getContext("2d");
const wrap = document.getElementById("bw");
const hint = document.getElementById("hint");

const getCSSVar = (name) => {
    let v = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
    return v.startsWith("#") && v.length === 9 ? v.slice(0, 7) : v;
};

const hexToRgb = (hex) => {
    const num = parseInt(hex.replace("#", ""), 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
};

let W,
    H,
    dpr,
    t = 0;
let prints = [],
    lastFX = -999,
    lastFY = -999,
    shown = false;

// ── Cache colors ──
let SAND, WET, DEEP, MID, FOAM, PCOL, wetRgb;

function updateColors() {
    SAND = getCSSVar("--almond-silk");
    WET = getCSSVar("--tangerine-dream");
    DEEP = getCSSVar("--stormy-teal");
    MID = getCSSVar("--pearl-aqua");
    FOAM = getCSSVar("--alice-blue");
    PCOL = getCSSVar("--print-color");
    wetRgb = hexToRgb(WET);
}

// ── resize ────────────────────────────────────────────────────────────────────
function resize() {
    dpr = window.devicePixelRatio || 1;

    W = 500;
    H = 450;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.scale(dpr, dpr);
    updateColors();
}
resize();

// ── wave math ─────────────────────────────────────────────────────────────────
function waveWobble(x, freq, phase) {
    return (
        Math.sin(x * freq + t + phase) +
        0.35 * Math.sin(x * freq * 1.5 + t * 0.85 + phase + 0.5) +
        0.15 * Math.cos(x * freq * 2.5 + t * 0.6 + phase + 1.2)
    );
}

function getTide() {
    return Math.pow((Math.sin(t * 0.45) + 1) / 2, 1.3);
}

function getEdges() {
    const cycle = getTide();
    const deepEdge = H * 0.25;
    const midEdge = deepEdge + 35 + cycle * 85;
    const foamEdge = midEdge + 15 + cycle * 5;
    const wetEdge = foamEdge + 2;

    return { deepEdge, midEdge, foamEdge, wetEdge, cycle };
}

// ── drawing helpers ───────────────────────────────────────────────────────────
function drawBand(topFn, botFn, color, alpha) {
    ctx.beginPath();
    ctx.moveTo(0, typeof botFn === "function" ? botFn(0) : botFn);
    for (let x = 2; x <= W; x += 2) {
        ctx.lineTo(x, typeof botFn === "function" ? botFn(x) : botFn);
    }
    ctx.lineTo(W, topFn(W));
    for (let x = W; x >= 0; x -= 2) {
        ctx.lineTo(x, topFn(x));
    }
    ctx.closePath();
    ctx.globalAlpha = alpha !== undefined ? alpha : 1;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalAlpha = 1;
}

// ── main draw ─────────────────────────────────────────────────────────────────
function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    const { deepEdge, midEdge, foamEdge, wetEdge, cycle } = getEdges();

    const deepFn = (x) => deepEdge + waveWobble(x, 0.012, 0.0) * 8;
    const midFn = (x) => midEdge + waveWobble(x, 0.011, 0.2) * 10;
    const foamFn = (x) => foamEdge + waveWobble(x, 0.01, 0.4) * 12;
    const wetFn = (x) => wetEdge + waveWobble(x, 0.01, 0.6) * 14;

    ctx.fillStyle = SAND;
    ctx.fillRect(0, 0, W, H);

    const wetAlpha = cycle * 0.8;
    if (wetAlpha > 0.01) {
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 2) ctx.lineTo(x, H);
        for (let x = W; x >= 0; x -= 2) ctx.lineTo(x, wetFn(x));
        ctx.closePath();

        const grad = ctx.createLinearGradient(
            0,
            foamEdge,
            0,
            Math.min(H, foamEdge + 70)
        );
        grad.addColorStop(0, `rgba(${wetRgb.r},${wetRgb.g},${wetRgb.b},${wetAlpha})`);
        grad.addColorStop(
            0.4,
            `rgba(${wetRgb.r},${wetRgb.g},${wetRgb.b},${wetAlpha * 0.35})`
        );
        grad.addColorStop(1, `rgba(${wetRgb.r},${wetRgb.g},${wetRgb.b},0)`);
        ctx.fillStyle = grad;
        ctx.fill();
    }

    drawBand(deepFn, 0, DEEP);

    drawBand(midFn, deepFn, MID, 0.95);

    drawBand(foamFn, midFn, FOAM, 0.9);

    ctx.beginPath();
    ctx.moveTo(0, foamFn(0));
    for (let x = 2; x <= W; x += 2) ctx.lineTo(x, foamFn(x));
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = FOAM;
    ctx.globalAlpha = 0.35 + cycle * 0.45;
    ctx.stroke();
    ctx.globalAlpha = 1;
}

// ── seagull footprint ─────────────────────────────────────────────────────────
function seagullPrint(cx, cy, angle, alpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = PCOL;
    ctx.lineCap = "round";
    ctx.lineWidth = 1.1;
    for (const [a, l] of [
        [-0.42, 6.2],
        [0, 7.5],
        [0.42, 6.2]
    ]) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.sin(a) * l, -Math.cos(a) * l);
        ctx.stroke();
    }
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 5);
    ctx.stroke();
    ctx.restore();
}

// ── interaction ───────────────────────────────────────────────────────────────
function addPrint(mx, my) {
    const { wetEdge } = getEdges();
    const sandStart = wetEdge + waveWobble(mx, 0.01, 0.6) * 14 + 12;
    if (my < sandStart || my > H - 4) return;

    const dx = mx - lastFX,
        dy = my - lastFY;
    if (dx * dx + dy * dy < 324) return;

    const angle = Math.atan2(dy, dx) - Math.PI / 2 + (Math.random() - 0.5) * 0.25;
    const side = prints.length % 2 === 0 ? -6 : 6;
    prints.push({
        x: mx + Math.cos(angle + Math.PI / 2) * side,
        y: my + Math.sin(angle + Math.PI / 2) * side,
        angle,
        alpha: 0.78,
        born: Date.now(),
        life: 900 + Math.random() * 300
    });
    lastFX = mx;
    lastFY = my;
    if (prints.length > 100) prints.shift();
}

function track(mx, my) {
    addPrint(mx, my);
    if (!shown) {
        shown = true;
        hint.style.opacity = "0";
    }
}

wrap.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    track(e.clientX - r.left, e.clientY - r.top);
});
wrap.addEventListener(
    "touchmove",
    (e) => {
        e.preventDefault();
        const r = canvas.getBoundingClientRect();
        track(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
    },
    { passive: false }
);

// ── loop ──────────────────────────────────────────────────────────────────────
function frame() {
    drawFrame();
    const now = Date.now();
    prints = prints.filter((p) => now - p.born < p.life);
    for (const p of prints) {
        const age = (now - p.born) / p.life;
        seagullPrint(p.x, p.y, p.angle, Math.max(0, p.alpha * (1 - age * age)));
    }
    t += 0.012;
    requestAnimationFrame(frame);
}
frame();
