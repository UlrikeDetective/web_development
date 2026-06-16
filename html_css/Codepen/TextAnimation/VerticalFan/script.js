// ─── Config ───────────────────────────────────────────────────────────────────
const WORD = 'Always'
const STAGE = document.getElementById('stage')

// ─── Loop & run ───────────────────────────────────────────────────────────────
let _raf = null
function loop(tick) {
    cancelAnimationFrame(_raf)
        ; (function frame() { tick(); _raf = requestAnimationFrame(frame) })()
}
function run(fn) { fn(); }

// ─── Easing ────────────────────────────────────────────────────
const ease = {
    out: t => 1 - (1 - t) ** 3,
    in: t => t ** 3,
    inOut: t => t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2,
    outBack: t => { const c = 1.70158 + 1; return 1 + c * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2 },
    bounce: t => {
        const n = 7.5625, d = 2.75
        if (t < 1 / d) return n * t * t
        if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75
        if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375
        return n * (t -= 2.625 / d) * t + 0.984375
    },
}

// ─── Cycle progress ───────────────────────────────────────────────────
// Returns 0 (at home) → 1 (at target) → 0 (back home) on a fixed timing loop.
// When p = 0: live letter is invisible — ghost shows the home position.
// When p = 1: live letter is fully visible at its displaced position.
function cyc(f, offset, enter, hold, exit, pause, eIn = ease.out, eOut = ease.in) {
    if (f < offset) return 0
    const total = enter + hold + exit + pause
    const t = (f - offset) % total
    if (t < enter) return eIn(t / enter)
    if (t < enter + hold) return 1
    if (t < enter + hold + exit) return 1 - eOut((t - enter - hold) / exit)
    return 0
}

const lerp = (a, b, t) => a + (b - a) * t

// ─── Ghost setup ──────────────────────────────────────────────────────────────
// Builds two overlapping layers inside #stage:
//
//   .ghost-layer  — static word at 14% opacity, always visible, gives natural
//                   width/height so the wrapper holds its size.
//   .live-layer   — absolutely positioned on top, same chars start at opacity 0.
//                   Animations move these chars and fade them in/out with p.
//
// When p = 0  → live letter invisible, ghost reads as the home position.
// When p = 1  → live letter fully visible at displaced position, ghost faint.
// As p → 0    → live letter fades out, ghost seamlessly takes over.
//
// Returns an array of the live <span> elements (one per character).
function setup(text = WORD) {
    STAGE.innerHTML = ''

    const wrap = document.createElement('div')
    wrap.style.cssText = 'position:relative; display:inline-flex; align-items:center; justify-content:center;'
    STAGE.appendChild(wrap)

    const ghostEl = document.createElement('div')
    ghostEl.className = 'text ghost-layer'
    ghostEl.setAttribute('aria-hidden', 'true')

    const liveEl = document.createElement('div')
    liveEl.className = 'text'
    liveEl.style.cssText = 'position:absolute; top:0; left:0; display:flex; pointer-events:none;'

    const chars = text.split('').map(ch => {
        const gc = ch === ' ' ? '\u00a0' : ch

        const g = document.createElement('span')
        g.className = 'char'
        g.textContent = gc
        ghostEl.appendChild(g)

        const l = document.createElement('span')
        l.className = 'char'
        l.textContent = gc
        l.style.opacity = '1'
        liveEl.appendChild(l)

        return l
    })

    wrap.appendChild(ghostEl)
    wrap.appendChild(liveEl)
    return chars
}

// Vertical Fan
function vertical_fan() {
    const chars = setup()
    const N = chars.length
    let f = 0
    loop(() => {
        const center = (N - 1) / 2
        chars.forEach((ch, i) => {
            const p = cyc(f, i * 5, 40, 40, 36, 44, ease.out, ease.in)
            const dist = Math.abs(i - center) * 32 + 22
            const dir = i % 2 === 0 ? -1 : 1
            ch.style.transform = `translateY(${dir * dist * p}px)`
        })
        f++
    })
}

run(vertical_fan)
