// Game Configuration
const PATTERNS = [
    // Option 0: Box Breathing (4-4-4-4)
    {
        name: "Box Breathing",
        cycles: 5,
        steps: [
            { text: "Breathe In", action: "expand", duration: 4000 },
            { text: "Hold", action: "hold", duration: 4000 },
            { text: "Breathe Out", action: "contract", duration: 4000 },
            { text: "Hold", action: "hold", duration: 4000 }
        ]
    },
    // Option 1: Deep Calm (6-4-6)
    {
        name: "Deep Calm",
        cycles: 5,
        steps: [
            { text: "Breathe In", action: "expand", duration: 6000 },
            { text: "Hold", action: "hold", duration: 4000 },
            { text: "Breathe Out", action: "contract", duration: 6000 }
        ]
    },
    // Option 2: Energize (7-3)
    {
        name: "Energize",
        cycles: 5,
        steps: [
            { text: "Breathe In", action: "expand", duration: 7000 },
            { text: "Breathe Out", action: "contract", duration: 3000 }
        ]
    }
];

// DOM Elements
const screens = {
    menu: document.getElementById('menu-screen'),
    game: document.getElementById('game-screen'),
    end: document.getElementById('end-screen')
};

const circle = document.getElementById('zen-circle');
const instructionText = document.getElementById('instruction-text');
const currentCycleEl = document.getElementById('current-cycle');

// State
let currentPattern = null;
let currentCycle = 0;
let stepIndex = 0;
let isRunning = false;
let timeoutId = null;

// Functions

function showScreen(screenName) {
    // Hide all
    Object.values(screens).forEach(s => s.classList.remove('active'));
    // Show target
    screens[screenName].classList.add('active');
}

function startGame(patternIndex) {
    currentPattern = PATTERNS[patternIndex];
    currentCycle = 1;
    stepIndex = 0;
    isRunning = true;
    
    // Reset UI
    currentCycleEl.innerText = currentCycle;
    instructionText.innerText = "Get Ready...";
    circle.style.transform = 'scale(0.3)';
    circle.style.transition = 'transform 1s ease'; // Fast reset
    
    showScreen('game');
    
    // Small delay before starting
    timeoutId = setTimeout(() => {
        runStep();
    }, 1000);
}

function runStep() {
    if (!isRunning) return;

    // Check if we completed all steps in a cycle
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
    
    // Execute Step
    updateCircle(step);
    instructionText.innerText = step.text;

    // Schedule next step
    timeoutId = setTimeout(() => {
        stepIndex++;
        runStep();
    }, step.duration);
}

function updateCircle(step) {
    // Set duration for smooth transition matching the step time
    circle.style.transitionDuration = `${step.duration}ms`;

    if (step.action === 'expand') {
        circle.style.transform = 'scale(1)';
        circle.style.backgroundColor = 'var(--c-himalayan-salt)';
    } else if (step.action === 'contract') {
        circle.style.transform = 'scale(0.3)';
        circle.style.backgroundColor = 'var(--c-lotus-flower)';
    } 
    // If 'hold', we strictly do nothing to transform/bg, keeping previous state
}

function endGame() {
    isRunning = false;
    showScreen('end');
}

function resetGame() {
    isRunning = false;
    if (timeoutId) clearTimeout(timeoutId);
    showScreen('menu');
}

// Initial Setup
showScreen('menu');
