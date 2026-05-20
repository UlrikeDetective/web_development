/**
 * Zen Game Over - Mindful Breathing Exercise App
 * Core logic, animations, Audio Synthesis and speech guidance.
 */

// ==========================================
// 1. Initial Configurations & Constants
// ==========================================

// Pre-defined core breathing rhythms
const DEFAULT_PATTERNS = [
    {
        name: "Box Breathing",
        cycles: 5,
        steps: [
            { text: "Breathe In", action: "expand", duration: 4000 },
            { text: "Hold", action: "hold", duration: 4000, state: "full" },
            { text: "Breathe Out", action: "contract", duration: 4000 },
            { text: "Hold", action: "hold", duration: 4000, state: "empty" }
        ]
    },
    {
        name: "Deep Calm",
        cycles: 5,
        steps: [
            { text: "Breathe In", action: "expand", duration: 6000 },
            { text: "Hold", action: "hold", duration: 4000, state: "full" },
            { text: "Breathe Out", action: "contract", duration: 6000 }
        ]
    },
    {
        name: "Energize",
        cycles: 5,
        steps: [
            { text: "Breathe In", action: "expand", duration: 7000 },
            { text: "Breathe Out", action: "contract", duration: 3000 }
        ]
    }
];

// Active list of patterns (default + user custom)
let patterns = [...DEFAULT_PATTERNS];

// DOM Elements cache
const screens = {
    menu: document.getElementById('menu-screen'),
    game: document.getElementById('game-screen'),
    end: document.getElementById('end-screen')
};

const circle = document.getElementById('zen-circle');
const instructionText = document.getElementById('instruction-text');
const currentCycleEl = document.getElementById('current-cycle');
const totalCyclesEl = document.getElementById('total-cycles');
const progressRingIndicator = document.getElementById('progress-ring-indicator');
const optionsContainer = document.getElementById('options-container');

// Dialog Elements
const customDialog = document.getElementById('custom-dialog');

// Toggle Elements
const ambientBtn = document.getElementById('toggle-ambient-btn');
const voiceBtn = document.getElementById('toggle-voice-btn');

// ==========================================
// 2. Application State Variables
// ==========================================
let currentPattern = null;
let currentCycle = 0;
let stepIndex = 0;
let isRunning = false;
let timeoutId = null;

// Audio Context & Synth States
let audioCtx = null;
let ambientSynth = null;
let isAmbientPlaying = false;

// Settings (loaded from LocalStorage)
let voiceEnabled = localStorage.getItem('zen_voice_enabled') === 'true';
let ambientEnabled = localStorage.getItem('zen_ambient_enabled') === 'true';

// ==========================================
// 3. Audio & Voice Engines (Web Audio / Speech)
// ==========================================

/**
 * Lazy initialize the Web Audio Context (required by browser autoplay block)
 */
function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        ambientSynth = new OceanWavesSynth(audioCtx);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

/**
 * Tibetan Singing Bowl Resonant Chime Synthesizer
 * Uses physical modeling synthesis with overtones and slight detuning.
 */
function playBowlChime() {
    if (!audioCtx) return;
    
    const now = audioCtx.currentTime;
    const baseFrequency = 200; // Deep resonant root G3/Ab3
    
    // Non-harmonic overtones characteristic of hand-hammered metals
    const overtones = [
        { multiplier: 1.0, volume: 0.5, detune: 0 },
        { multiplier: 1.5, volume: 0.3, detune: 1.2 },    // 300Hz
        { multiplier: 2.02, volume: 0.25, detune: -0.8 },  // ~404Hz
        { multiplier: 2.81, volume: 0.18, detune: 1.8 },   // ~562Hz
        { multiplier: 3.95, volume: 0.12, detune: -2.3 }   // ~790Hz
    ];
    
    // Master Gain for Exponential Decay Envelope
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.35, now + 0.05); // Rapid strike/attack
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 5.5); // Gentle long ring-out
    masterGain.connect(audioCtx.destination);
    
    // Clean up master node from graph when sound fully expires
    setTimeout(() => {
        masterGain.disconnect();
    }, 6000);
    
    overtones.forEach(ot => {
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFrequency * ot.multiplier, now);
        osc.detune.setValueAtTime(ot.detune * 100, now); // Convert cents
        
        // Tremolo LFO to synthesize natural hammer oscillations
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.frequency.setValueAtTime(4.8 + Math.random() * 0.8, now); // 4.8 - 5.6 Hz beating
        lfoGain.gain.setValueAtTime(0.12, now); // Amplitude range
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain); // Modulate overtone amplitude
        
        oscGain.gain.setValueAtTime(ot.volume, now);
        
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        
        osc.start(now);
        lfo.start(now);
        
        // Stop oscs in 6s
        osc.stop(now + 6);
        lfo.stop(now + 6);
    });
}

/**
 * Ocean Waves / Zen Wind Ambient Synthesizer
 * Generates continuous pink noise modulated dynamically by breathing phases.
 */
class OceanWavesSynth {
    constructor(ctx) {
        this.ctx = ctx;
        this.isRunning = false;
        this.noiseSource = null;
        this.filterNode = null;
        this.gainNode = null;
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        const now = this.ctx.currentTime;
        
        // 1. Generate Pink Noise (warmer spectral slope than white noise)
        const bufferSize = 4 * this.ctx.sampleRate;
        const pinkBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = pinkBuffer.getChannelData(0);
        
        // Kellet's Pink Noise algorithm
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.76160 * b5 - white * 0.0168980;
            data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            data[i] *= 0.11; // Rescale gain to avoid clipping
            b6 = white * 0.115926;
        }
        
        this.noiseSource = this.ctx.createBufferSource();
        this.noiseSource.buffer = pinkBuffer;
        this.noiseSource.loop = true;
        
        // 2. Filter Node for ocean wave tone (moving cut-off frequency)
        this.filterNode = this.ctx.createBiquadFilter();
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(320, now);
        this.filterNode.Q.setValueAtTime(1.2, now);
        
        // 3. Main Volume Node
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.02, now); // Whispering starting volume
        
        // Signal Routing: Noise -> Filter -> Volume -> Output
        this.noiseSource.connect(this.filterNode);
        this.filterNode.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
        
        this.noiseSource.start(now);
    }
    
    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        
        const now = this.ctx.currentTime;
        
        // Clean fade out before stopping completely to avoid click sounds
        if (this.gainNode) {
            this.gainNode.gain.cancelScheduledValues(now);
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
            this.gainNode.gain.linearRampToValueAtTime(0.0, now + 0.5);
        }
        
        setTimeout(() => {
            if (!this.isRunning && this.noiseSource) {
                try {
                    this.noiseSource.stop();
                    this.noiseSource.disconnect();
                    this.filterNode.disconnect();
                    this.gainNode.disconnect();
                } catch (e) {
                    // Fail-safe for concurrent cleanups
                }
            }
        }, 600);
    }
    
    // Inhalation: waves rise, sound gets louder & brighter
    transitionIn(duration) {
        if (!this.isRunning) return;
        const now = this.ctx.currentTime;
        this.gainNode.gain.cancelScheduledValues(now);
        this.filterNode.frequency.cancelScheduledValues(now);
        
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
        this.gainNode.gain.linearRampToValueAtTime(0.14, now + duration / 1000);
        
        this.filterNode.frequency.setValueAtTime(this.filterNode.frequency.value, now);
        this.filterNode.frequency.exponentialRampToValueAtTime(800, now + duration / 1000);
    }
    
    // Exhalation: waves pull back, sound drops & dampens
    transitionOut(duration) {
        if (!this.isRunning) return;
        const now = this.ctx.currentTime;
        this.gainNode.gain.cancelScheduledValues(now);
        this.filterNode.frequency.cancelScheduledValues(now);
        
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
        this.gainNode.gain.linearRampToValueAtTime(0.02, now + duration / 1000);
        
        this.filterNode.frequency.setValueAtTime(this.filterNode.frequency.value, now);
        this.filterNode.frequency.exponentialRampToValueAtTime(260, now + duration / 1000);
    }
    
    // Holding Breath: static soft volume depending on whether lungs are full or empty
    transitionHold(duration, state) {
        if (!this.isRunning) return;
        const now = this.ctx.currentTime;
        this.gainNode.gain.cancelScheduledValues(now);
        this.filterNode.frequency.cancelScheduledValues(now);
        
        const targetVol = state === 'full' ? 0.08 : 0.02;
        const targetFreq = state === 'full' ? 480 : 260;
        
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
        this.gainNode.gain.linearRampToValueAtTime(targetVol, now + duration / 1000);
        
        this.filterNode.frequency.setValueAtTime(this.filterNode.frequency.value, now);
        this.filterNode.frequency.exponentialRampToValueAtTime(targetFreq, now + duration / 1000);
    }
}

/**
 * Speech Synthesis Helper (Female Zen Voice)
 */
function speakBreathCue(text) {
    if (!voiceEnabled) return;
    
    // Stop any ongoing spoken cues to prevent overlay
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to resolve a calming female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleKeywords = ['google us english', 'samantha', 'hazel', 'zira', 'karen', 'female', 'natural'];
    
    let resolvedVoice = null;
    for (const keyword of femaleKeywords) {
        resolvedVoice = voices.find(v => v.name.toLowerCase().includes(keyword));
        if (resolvedVoice) break;
    }
    
    if (!resolvedVoice) {
        resolvedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    }
    
    utterance.voice = resolvedVoice;
    utterance.rate = 0.78; // Slow pace for relaxation
    utterance.pitch = 0.92; // Slightly lower pitch for calming timbre
    utterance.volume = 0.75;
    
    window.speechSynthesis.speak(utterance);
}

// Bind Web Speech Voice lists triggers
if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', () => {
        window.speechSynthesis.getVoices();
    });
}

// ==========================================
// 4. UI Control Panel Triggers
// ==========================================
function updateControlPanelUI() {
    if (ambientEnabled) {
        ambientBtn.classList.add('active');
        ambientBtn.querySelector('.btn-label').innerText = "Ambient On";
    } else {
        ambientBtn.classList.remove('active');
        ambientBtn.querySelector('.btn-label').innerText = "Ambient Off";
    }
    
    if (voiceEnabled) {
        voiceBtn.classList.add('active');
        voiceBtn.querySelector('.btn-label').innerText = "Voice On";
    } else {
        voiceBtn.classList.remove('active');
        voiceBtn.querySelector('.btn-label').innerText = "Voice Off";
    }
}

ambientBtn.addEventListener('click', () => {
    initAudioContext();
    ambientEnabled = !ambientEnabled;
    localStorage.setItem('zen_ambient_enabled', ambientEnabled);
    updateControlPanelUI();
    
    if (isRunning && ambientEnabled) {
        ambientSynth.start();
    } else if (!ambientEnabled) {
        ambientSynth.stop();
    }
});

voiceBtn.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    localStorage.setItem('zen_voice_enabled', voiceEnabled);
    updateControlPanelUI();
    
    if (voiceEnabled) {
        speakBreathCue("Voice guidance active");
    } else {
        window.speechSynthesis.cancel();
    }
});

// ==========================================
// 5. Game Screen Switching & Breathing Loop
// ==========================================

function showScreen(screenName) {
    // Hide screens
    Object.values(screens).forEach(s => {
        s.classList.remove('active');
    });
    // Show active screen
    screens[screenName].classList.add('active');
}

/**
 * Initializes and starts a breathing exercise
 */
function startGame(patternIndex) {
    initAudioContext();
    
    currentPattern = patterns[patternIndex];
    currentCycle = 1;
    stepIndex = 0;
    isRunning = true;
    
    // Sync DOM indicators
    currentCycleEl.innerText = currentCycle;
    totalCyclesEl.innerText = currentPattern.cycles;
    instructionText.innerText = "Prepare...";
    
    // Set circle to collapsed starting size
    circle.style.transform = 'scale(0.5)';
    circle.style.transition = 'transform 1s cubic-bezier(0.25, 0.8, 0.25, 1)';
    document.body.className = ''; // Clear background state
    
    // Clear SVG progress indicators
    progressRingIndicator.style.transition = 'none';
    progressRingIndicator.style.strokeDashoffset = '305';
    
    showScreen('game');
    
    // Start ambient synth if enabled
    if (ambientEnabled) {
        ambientSynth.start();
    }
    
    // Initial prep phase before core pattern begins
    timeoutId = setTimeout(() => {
        runStep();
    }, 1000);
}

/**
 * Loop iterator executing individual steps (Inhale, Hold, Exhale, etc.)
 */
function runStep() {
    if (!isRunning) return;

    // Check for loop sequence restart or cycle completion
    if (stepIndex >= currentPattern.steps.length) {
        stepIndex = 0;
        currentCycle++;
        
        if (currentCycle > currentPattern.cycles) {
            endGame();
            return;
        }
        currentCycleEl.innerText = currentCycle;
    }

    const step = currentPattern.steps[stepIndex];
    
    // 1. Play singing bowl chime transition triggers
    playBowlChime();
    
    // 2. Speak voice guidance prompt
    speakBreathCue(step.text);
    
    // 3. Update Visual Breathing Circle
    updateCircleVisual(step);
    
    // 4. Update SVG Timer Progress Ring
    animateProgressRing(step.duration);
    
    // 5. Modulate Ambient Waves
    if (ambientEnabled && ambientSynth) {
        if (step.action === 'expand') {
            ambientSynth.transitionIn(step.duration);
        } else if (step.action === 'contract') {
            ambientSynth.transitionOut(step.duration);
        } else if (step.action === 'hold') {
            ambientSynth.transitionHold(step.duration, step.state);
        }
    }

    // Schedule next step transition
    timeoutId = setTimeout(() => {
        stepIndex++;
        runStep();
    }, step.duration);
}

/**
 * Smoothly scales, paints, and labels the breathing circle
 */
function updateCircleVisual(step) {
    // Inject dynamic transition duration to synchronize with step time
    circle.style.transitionDuration = `${step.duration}ms`;
    circle.style.transitionProperty = 'transform, background-color, box-shadow';
    circle.style.transitionTimingFunction = 'cubic-bezier(0.37, 0, 0.63, 1)'; // smooth sine curve
    
    instructionText.innerText = step.text;

    if (step.action === 'expand') {
        circle.style.transform = 'scale(1)';
        circle.classList.remove('breathing-out');
        circle.classList.add('breathing-in');
        document.body.className = 'inhaling';
    } else if (step.action === 'contract') {
        circle.style.transform = 'scale(0.5)';
        circle.classList.remove('breathing-in');
        circle.classList.add('breathing-out');
        document.body.className = 'exhaling';
    } else { // 'hold' - locks current visual scale but updates background styling
        if (step.state === 'full') {
            circle.style.transform = 'scale(1)';
            circle.classList.remove('breathing-out');
            circle.classList.add('breathing-in');
        } else if (step.state === 'empty') {
            circle.style.transform = 'scale(0.5)';
            circle.classList.remove('breathing-in');
            circle.classList.add('breathing-out');
        }
        document.body.className = 'holding';
    }
}

/**
 * Animates the SVG progress ring border tracking active step progress
 */
function animateProgressRing(durationMs) {
    // Reset back to starting position instantly without animations
    progressRingIndicator.style.transition = 'none';
    progressRingIndicator.style.strokeDashoffset = '305';
    
    // Trigger paint reflow
    progressRingIndicator.getBoundingClientRect();
    
    // Linearly fill the ring over the duration
    progressRingIndicator.style.transition = `stroke-dashoffset ${durationMs}ms linear, stroke 1.5s ease`;
    progressRingIndicator.style.strokeDashoffset = '0';
}

function endGame() {
    isRunning = false;
    if (ambientSynth) ambientSynth.stop();
    document.body.className = '';
    
    // Play final completion chime sound
    setTimeout(() => {
        playBowlChime();
        speakBreathCue("Mindfulness complete. Have a wonderful day.");
    }, 200);
    
    showScreen('end');
}

function resetGame() {
    isRunning = false;
    if (timeoutId) clearTimeout(timeoutId);
    if (ambientSynth) ambientSynth.stop();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    document.body.className = '';
    showScreen('menu');
}

// ==========================================
// 6. Custom Breathing Rhythm Builder (Dialog)
// ==========================================

function openCustomDialog() {
    customDialog.showModal();
}

function closeCustomDialog() {
    customDialog.close();
}

/**
 * Saves a custom breathing pattern submitted by the user
 */
function saveCustomPattern(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('custom-name').value.trim();
    const inhaleVal = parseInt(document.getElementById('slide-inhale').value, 10);
    const holdInVal = parseInt(document.getElementById('slide-hold-in').value, 10);
    const exhaleVal = parseInt(document.getElementById('slide-exhale').value, 10);
    const holdOutVal = parseInt(document.getElementById('slide-hold-out').value, 10);
    const cyclesVal = parseInt(document.getElementById('slide-cycles').value, 10);
    
    // Build steps dynamically based on zero-hold settings
    const customSteps = [
        { text: "Breathe In", action: "expand", duration: inhaleVal * 1000 }
    ];
    
    if (holdInVal > 0) {
        customSteps.push({ text: "Hold", action: "hold", duration: holdInVal * 1000, state: "full" });
    }
    
    customSteps.push({ text: "Breathe Out", action: "contract", duration: exhaleVal * 1000 });
    
    if (holdOutVal > 0) {
        customSteps.push({ text: "Hold", action: "hold", duration: holdOutVal * 1000, state: "empty" });
    }
    
    const newPattern = {
        name: nameInput,
        cycles: cyclesVal,
        steps: customSteps,
        isCustom: true // identify for deletion/sorting later if needed
    };
    
    // Save to JS State
    patterns.push(newPattern);
    
    // Save to LocalStorage
    const stored = JSON.parse(localStorage.getItem('zen_custom_patterns') || '[]');
    stored.push(newPattern);
    localStorage.setItem('zen_custom_patterns', JSON.stringify(stored));
    
    // Render and restart
    renderOptionStones();
    closeCustomDialog();
    
    // Reset form fields
    document.getElementById('custom-name').value = '';
    document.getElementById('slide-inhale').value = 4;
    document.getElementById('slide-hold-in').value = 4;
    document.getElementById('slide-exhale').value = 4;
    document.getElementById('slide-hold-out').value = 4;
    document.getElementById('slide-cycles').value = 5;
    
    document.getElementById('val-inhale').innerText = 4;
    document.getElementById('val-hold-in').innerText = 4;
    document.getElementById('val-exhale').innerText = 4;
    document.getElementById('val-hold-out').innerText = 4;
    document.getElementById('val-cycles').innerText = 5;
}

/**
 * Builds HTML Option Buttons (Stones) for breathing selections
 */
function renderOptionStones() {
    // Clear previous option buttons
    optionsContainer.innerHTML = '';
    
    patterns.forEach((pattern, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.setAttribute('onclick', `startGame(${index})`);
        
        // Build description text
        const descParts = [];
        pattern.steps.forEach(step => {
            const time = `${step.duration / 1000}s`;
            if (step.text.includes("In")) descParts.push(`In ${time}`);
            else if (step.text.includes("Out")) descParts.push(`Out ${time}`);
            else descParts.push(`Hold ${time}`);
        });
        
        btn.setAttribute('aria-label', `Select ${pattern.name} rhythm: ${descParts.join(' • ')}`);
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'btn-title';
        titleSpan.innerText = pattern.name;
        
        const descSpan = document.createElement('span');
        descSpan.className = 'btn-desc';
        descSpan.innerText = descParts.join(' • ');
        
        btn.appendChild(titleSpan);
        btn.appendChild(descSpan);
        
        optionsContainer.appendChild(btn);
    });
    
    // Append the permanent Custom Add button back
    const addBtn = document.createElement('button');
    addBtn.className = 'option-btn add-custom-btn';
    addBtn.setAttribute('onclick', 'openCustomDialog()');
    addBtn.setAttribute('aria-label', 'Create custom breathing rhythm');
    
    const addTitle = document.createElement('span');
    addTitle.className = 'btn-title';
    addTitle.innerText = '+ Custom';
    
    const addDesc = document.createElement('span');
    addDesc.className = 'btn-desc';
    addDesc.innerText = 'Shape your own breath';
    
    addBtn.appendChild(addTitle);
    addBtn.appendChild(addDesc);
    optionsContainer.appendChild(addBtn);
}

/**
 * Initialize custom layouts from storage
 */
function loadSavedRhythms() {
    const stored = JSON.parse(localStorage.getItem('zen_custom_patterns') || '[]');
    patterns = [...DEFAULT_PATTERNS, ...stored];
    renderOptionStones();
}

/**
 * Polyfill for HTML Dialog light-dismiss (outside clicks close modal)
 */
if (customDialog && !('closedBy' in HTMLDialogElement.prototype)) {
    customDialog.addEventListener('click', (event) => {
        if (event.target !== customDialog) return;
        
        const rect = customDialog.getBoundingClientRect();
        const insideDialog = (
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width
        );
        
        if (!insideDialog) {
            closeCustomDialog();
        }
    });
}

// ==========================================
// 7. Interactive Background Canvas Loop
// ==========================================
const canvas = document.getElementById('zen-canvas');
const ctx = canvas.getContext('2d');

let petals = [];
let ripples = [];

// Handle resizing dynamically
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/**
 * Particle representing falling Lotus petals
 */
class LotusPetal {
    constructor() {
        this.reset(true);
    }
    
    reset(initRandomY = false) {
        this.x = Math.random() * canvas.width;
        this.y = initRandomY ? Math.random() * canvas.height : -20;
        this.size = Math.random() * 8 + 6; // 6px - 14px size
        this.speedY = Math.random() * 0.4 + 0.3; // Very slow drift
        this.speedX = Math.random() * 0.2 - 0.1; // Slight float
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() * 0.01 - 0.005) * 0.5;
        this.opacity = Math.random() * 0.3 + 0.15; // Pale transparent
        this.swaySpeed = Math.random() * 0.004 + 0.002;
        this.swayAmount = Math.random() * 0.4 + 0.2;
        this.seed = Math.random() * 100;
    }
    
    update(time) {
        this.y += this.speedY;
        // Sway sideways using a sine wave
        this.x += this.speedX + Math.sin(time * this.swaySpeed + this.seed) * this.swayAmount;
        this.rotation += this.rotSpeed;
        
        // Recycle petals that drift off screen
        if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
            this.reset(false);
        }
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Draw organic petal shape (curved path)
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size * 0.5, 0, 0, this.size);
        ctx.quadraticCurveTo(-this.size * 0.5, 0, 0, -this.size);
        
        // Color transition representing lotus bloom colors
        const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
        grad.addColorStop(0, `rgba(232, 211, 213, ${this.opacity})`); // Lotus Flower
        grad.addColorStop(1, `rgba(232, 180, 163, ${this.opacity * 0.8})`); // Himalayan Salt
        
        ctx.fillStyle = grad;
        ctx.fill();
        
        // Draw subtle middle rib detail
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.6);
        ctx.lineTo(0, this.size * 0.6);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        
        ctx.restore();
    }
}

/**
 * Click-triggered Ripple Wave
 */
class WaterRipple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 2;
        this.maxRadius = Math.random() * 80 + 100; // 100px - 180px
        this.opacity = 0.5;
        this.growSpeed = Math.random() * 1.5 + 2.0; // Smooth expansion speed
    }
    
    update() {
        this.radius += this.growSpeed;
        // Fade out as it expands
        this.opacity = 0.5 * (1 - this.radius / this.maxRadius);
    }
    
    draw() {
        if (this.opacity <= 0) return;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Soft blue/gray stone reflection outline
        ctx.strokeStyle = `rgba(140, 159, 160, ${this.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
    }
}

// Populate starting lotus petals
const MAX_PETALS = 16;
for (let i = 0; i < MAX_PETALS; i++) {
    petals.push(new LotusPetal());
}

// Window Event Listeners for Ripple triggers
window.addEventListener('click', (event) => {
    // Avoid spawning ripples when clicking on active button surfaces or forms
    const tag = event.target.tagName.toLowerCase();
    if (tag === 'button' || tag === 'input' || tag === 'label' || tag === 'a' || event.target.closest('dialog')) {
        return;
    }
    ripples.push(new WaterRipple(event.clientX, event.clientY));
});

// Canvas Animation Loop
function animateCanvas(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw and update active ripples
    ripples.forEach((ripple, idx) => {
        ripple.update();
        ripple.draw();
    });
    // Filter out expired ripples
    ripples = ripples.filter(r => r.opacity > 0);
    
    // Draw and update lotus petals
    petals.forEach(petal => {
        petal.update(timestamp);
        petal.draw();
    });
    
    requestAnimationFrame(animateCanvas);
}
requestAnimationFrame(animateCanvas);

// ==========================================
// 8. Initialization
// ==========================================
loadSavedRhythms();
updateControlPanelUI();
showScreen('menu');
