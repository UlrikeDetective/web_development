/**
 * Surf-Skate Landlocked Surfers Web Application - Core Controller
 * Handles SPA navigation, theme switching, interactive maneuver simulator,
 * Zen breathing trainer (with Web Audio API synth), and spot finder.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initManeuverSimulator();
  initBreathingTrainer();
  initSpotFinder();
});

/* ==========================================================================
   Theme & Preferences Management
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;
  
  // Set initial theme based on local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    htmlEl.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    htmlEl.setAttribute('data-theme', 'dark');
  } else {
    htmlEl.setAttribute('data-theme', 'light');
  }

  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    playTone(600, 'sine', 0.1); // UI Feedback sound
  });
}

/* ==========================================================================
   Single Page Application (SPA) Router / Navigation
   ========================================================================== */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.querySelector('.nav-links');

  // Handle section routing
  function navigateTo(targetId) {
    // Check if browser supports modern view transitions
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        switchActiveSection(targetId);
      });
    } else {
      switchActiveSection(targetId);
    }
  }

  function switchActiveSection(targetId) {
    // Deactivate current links and sections
    navItems.forEach(item => {
      if (item.getAttribute('data-target') === targetId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    sections.forEach(section => {
      if (section.id === targetId) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // Collapse mobile menu if open
    navLinks.classList.remove('active');
  }

  // Bind clicks to navigation items
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-target');
      navigateTo(targetId);
    });
  });

  // Mobile navigation hamburger toggle
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Setup home primary button interactions to redirect to sections
  document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-explore-quiver')) {
      e.preventDefault();
      navigateTo('quiver');
    }
    if (e.target.matches('.btn-start-training')) {
      e.preventDefault();
      navigateTo('simulator');
    }
  });

  // Window scroll navbar styling
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   Surf Maneuver Simulator
   ========================================================================== */
const MANEUVER_DATA = {
  bottomturn: [
    {
      title: "1. The Entry & Compression",
      desc: "Drop down the face, bend knees low to center your weight, and lean hard into the wave rail to initiate the turn.",
      coords: { x: 20, y: 80 },
      instruction: "Bend your knees deep! Load potential energy on the asphalt."
    },
    {
      title: "2. The Eyes & Rotation",
      desc: "Turn your head, shoulders, and chest up towards the top of the wave. Your hips and board will follow your gaze.",
      coords: { x: 50, y: 75 },
      instruction: "Look at the wave lip. Your surfskate will steer where you look."
    },
    {
      title: "3. Extension & Climb",
      desc: "Decompress your body by extending your legs, pushing off the front truck to drive speed upwards.",
      coords: { x: 80, y: 25 },
      instruction: "Extend and push! Generate maximum speed to climb back up the asphalt wall."
    }
  ],
  cutback: [
    {
      title: "1. High Line Setup",
      desc: "Approach the shoulder with high speed. Stand taller and prepare to shift your weight.",
      coords: { x: 20, y: 20 },
      instruction: "Stay high on the wave wall. Prepare to rotate."
    },
    {
      title: "2. Heel-Edge Lean & Rotation",
      desc: "Open your arms wide, look back towards the breaking foam, and shift weight to your heel rail.",
      coords: { x: 50, y: 45 },
      instruction: "Rotate your torso. Squeeze your core and carve a smooth, wide arc."
    },
    {
      title: "3. Rebound & Compress",
      desc: "Redirect your board back into the pocket, compressing your knees to absorb the turbulence.",
      coords: { x: 80, y: 75 },
      instruction: "Redirect! Get low and absorb the simulated whitewash bounce."
    }
  ],
  snap: [
    {
      title: "1. Vertical Approach",
      desc: "Climb up the wave face vertically with high momentum, aiming for the breaking lip.",
      coords: { x: 30, y: 60 },
      instruction: "Drive straight up! Get vertical on the bank."
    },
    {
      title: "2. Kick & Pivot",
      desc: "Extend your rear leg to slide the tail out while throwing shoulders back. The board pivots on the front truck.",
      coords: { x: 75, y: 15 },
      instruction: "KICK! Let the rear wheels slide, pivot around your front foot."
    },
    {
      title: "3. Re-entry & Clean Ride",
      desc: "Catch the slide, pull the nose back down the face, compress low and look down the line.",
      coords: { x: 85, y: 70 },
      instruction: "Compress and catch the slide! Look forward to keep riding."
    }
  ]
};

function initManeuverSimulator() {
  const tabs = document.querySelectorAll('.sim-tab');
  const stepsContainer = document.querySelector('.maneuver-steps');
  const riderDot = document.querySelector('.rider-dot');
  const instructionBubble = document.querySelector('.instruction-bubble');
  
  let currentManeuver = 'bottomturn';
  
  // Render step cards for selected maneuver
  function renderManeuver(key) {
    currentManeuver = key;
    const steps = MANEUVER_DATA[key];
    stepsContainer.innerHTML = '';
    
    steps.forEach((step, index) => {
      const card = document.createElement('button');
      card.className = `step-card glass-card ${index === 0 ? 'active' : ''}`;
      card.setAttribute('data-index', index);
      card.setAttribute('aria-label', `Step ${index + 1}: ${step.title}`);
      
      card.innerHTML = `
        <div class="step-num">${index + 1}</div>
        <div class="step-info">
          <div class="step-title">${step.title}</div>
          <div class="step-desc">${step.desc}</div>
        </div>
      `;
      
      card.addEventListener('click', () => {
        selectStep(index);
      });
      
      stepsContainer.appendChild(card);
    });
    
    // Select first step by default
    selectStep(0);
  }

  function selectStep(index) {
    const steps = MANEUVER_DATA[currentManeuver];
    const step = steps[index];
    
    // Update active state in UI
    const cards = stepsContainer.querySelectorAll('.step-card');
    cards.forEach((card, idx) => {
      if (idx === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
    
    // Animate rider dot on SVG
    riderDot.style.left = `${step.coords.x}%`;
    riderDot.style.top = `${step.coords.y}%`;
    
    // Update instruction bubble text
    instructionBubble.textContent = step.instruction;
    
    // Play subtle visual/audio feedback
    playTone(300 + (index * 150), 'sine', 0.08);
  }

  // Bind tab click events
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderManeuver(tab.getAttribute('data-maneuver'));
    });
  });

  // Initial render
  renderManeuver('bottomturn');
}

/* ==========================================================================
   Zen Flow & Breathing Trainer
   ========================================================================== */
let breathingInterval = null;
let breathState = 'idle'; // 'idle', 'inhale', 'hold', 'exhale', 'hold_empty'
let breathTimer = 0;
let breathCycleCount = 0;
let breathMode = 'box'; // 'box', 'surf'

function initBreathingTrainer() {
  const innerCircle = document.getElementById('breath-circle');
  const breathText = document.getElementById('breath-text');
  const instructionEl = document.getElementById('breath-instruction');
  const timerEl = document.getElementById('breath-timer');
  const startBtn = document.getElementById('breath-start');
  const resetBtn = document.getElementById('breath-reset');
  const modeCards = document.querySelectorAll('.breath-mode-card');

  // Change mode
  modeCards.forEach(card => {
    card.addEventListener('click', () => {
      if (breathState !== 'idle') return; // Prevent changing mode during active training
      
      modeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      breathMode = card.getAttribute('data-mode');
      resetTrainer();
    });
  });

  startBtn.addEventListener('click', () => {
    if (breathState === 'idle') {
      startTraining();
    } else {
      pauseTraining();
    }
  });

  resetBtn.addEventListener('click', () => {
    resetTrainer();
  });

  function startTraining() {
    breathState = 'prep';
    startBtn.textContent = 'Pause';
    startBtn.classList.remove('btn-primary');
    startBtn.classList.add('btn-secondary');
    
    playTone(440, 'sine', 0.2); // Start buzzer
    
    if (breathMode === 'box') {
      runBoxBreathing();
    } else {
      runSurfHoldBreathing();
    }
  }

  function pauseTraining() {
    clearInterval(breathingInterval);
    breathState = 'idle';
    startBtn.textContent = 'Resume';
    startBtn.classList.remove('btn-secondary');
    startBtn.classList.add('btn-primary');
    innerCircle.className = 'circle-inner';
    breathText.textContent = 'PAUSED';
  }

  function resetTrainer() {
    clearInterval(breathingInterval);
    breathState = 'idle';
    breathTimer = 0;
    breathCycleCount = 0;
    
    startBtn.textContent = 'Start Session';
    startBtn.classList.remove('btn-secondary');
    startBtn.classList.add('btn-primary');
    
    innerCircle.className = 'circle-inner';
    breathText.textContent = 'READY';
    timerEl.textContent = '00:00';
    
    if (breathMode === 'box') {
      instructionEl.textContent = 'Box Breathing: Inhale 4s -> Hold 4s -> Exhale 4s -> Hold 4s';
    } else {
      instructionEl.textContent = 'Surf Wipeout Hold: Deep oxygenation cycles followed by a 20s hold.';
    }
  }

  // Box Breathing cycle: In 4s, Hold 4s, Out 4s, Hold 4s
  function runBoxBreathing() {
    let phaseSeconds = 0;
    let phase = 'inhale'; // 'inhale', 'hold', 'exhale', 'hold_empty'
    
    instructionEl.textContent = 'Inhale deeply...';
    innerCircle.className = 'circle-inner inhale';
    breathText.textContent = 'INHALE';
    playTone(523.25, 'triangle', 0.15); // C5
    
    breathingInterval = setInterval(() => {
      phaseSeconds++;
      breathTimer++;
      
      // Update timer display
      timerEl.textContent = formatTime(breathTimer);
      
      // Switch phases every 4 seconds
      if (phaseSeconds >= 4) {
        phaseSeconds = 0;
        
        if (phase === 'inhale') {
          phase = 'hold';
          instructionEl.textContent = 'Hold your breath, relax shoulders...';
          innerCircle.className = 'circle-inner hold';
          breathText.textContent = 'HOLD';
          playTone(659.25, 'triangle', 0.15); // E5
        } else if (phase === 'hold') {
          phase = 'exhale';
          instructionEl.textContent = 'Slowly exhale...';
          innerCircle.className = 'circle-inner exhale';
          breathText.textContent = 'EXHALE';
          playTone(587.33, 'triangle', 0.15); // D5
        } else if (phase === 'exhale') {
          phase = 'hold_empty';
          instructionEl.textContent = 'Hold on empty lung state...';
          innerCircle.className = 'circle-inner';
          breathText.textContent = 'HOLD EMPTY';
          playTone(440.00, 'triangle', 0.15); // A4
        } else if (phase === 'hold_empty') {
          phase = 'inhale';
          instructionEl.textContent = 'Inhale deeply...';
          innerCircle.className = 'circle-inner inhale';
          breathText.textContent = 'INHALE';
          playTone(523.25, 'triangle', 0.15); // C5
          breathCycleCount++;
        }
      }
    }, 1000);
  }

  // Surf Hold: 3 cycles of In 3s / Out 3s, then Hold 20s (wipeout hold simulation)
  function runSurfHoldBreathing() {
    let phaseSeconds = 0;
    let cycle = 1;
    let stage = 'inhale'; // 'inhale', 'exhale', 'wipeout'
    
    instructionEl.textContent = 'Prep Inhale (Cycle 1/3)...';
    innerCircle.className = 'circle-inner inhale';
    breathText.textContent = 'INHALE';
    playTone(523.25, 'triangle', 0.15); // C5
    
    breathingInterval = setInterval(() => {
      phaseSeconds++;
      breathTimer++;
      
      timerEl.textContent = formatTime(breathTimer);
      
      if (stage === 'inhale' && phaseSeconds >= 3) {
        phaseSeconds = 0;
        stage = 'exhale';
        instructionEl.textContent = `Prep Exhale (Cycle ${cycle}/3)...`;
        innerCircle.className = 'circle-inner exhale';
        breathText.textContent = 'EXHALE';
        playTone(440.00, 'triangle', 0.15); // A4
      } else if (stage === 'exhale' && phaseSeconds >= 3) {
        phaseSeconds = 0;
        if (cycle < 3) {
          cycle++;
          stage = 'inhale';
          instructionEl.textContent = `Prep Inhale (Cycle ${cycle}/3)...`;
          innerCircle.className = 'circle-inner inhale';
          breathText.textContent = 'INHALE';
          playTone(523.25, 'triangle', 0.15);
        } else {
          stage = 'wipeout';
          instructionEl.textContent = 'WIPEOUT! Hold breath. Calm mind, zero movement...';
          innerCircle.className = 'circle-inner hold';
          breathText.textContent = 'WIPEOUT HOLD';
          playTone(329.63, 'sawtooth', 0.4); // Deep low buzz for wipeout start
        }
      } else if (stage === 'wipeout') {
        const remainingHold = 20 - phaseSeconds;
        if (remainingHold > 0) {
          instructionEl.textContent = `WIPEOUT! Hold breath. Calm your heart. ${remainingHold}s remaining...`;
        } else {
          // Finished wipeout hold
          clearInterval(breathingInterval);
          breathState = 'idle';
          startBtn.textContent = 'Start Session';
          startBtn.classList.remove('btn-secondary');
          startBtn.classList.add('btn-primary');
          innerCircle.className = 'circle-inner inhale';
          breathText.textContent = 'BREATHE!';
          instructionEl.textContent = 'Session complete. Calm breathing restored.';
          playTone(523.25, 'sine', 0.5); // Success tone
        }
      }
    }, 1000);
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Simple synthesizer for audio cues using browser Web Audio API
let audioCtx = null;
function playTone(freq, type, duration) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Web Audio API not supported or blocked by user gesture:", e);
  }
}

/* ==========================================================================
   Spot Finder (Mock Interactive Map)
   ========================================================================== */
const SPOT_DATA = [
  {
    id: 1,
    name: "Concrete Ocean Pump Track",
    type: "Pump Track",
    distance: "120 miles from Coast",
    desc: "A massive, world-class asphalt pump track featuring high banked berms and deep rollers that perfectly emulate a fast ocean point break.",
    coordinates: { x: 35, y: 42 },
    rating: "4.9/5",
    difficulty: "All Levels"
  },
  {
    id: 2,
    name: "Pine Valley Flow Bowl",
    type: "Bowl",
    distance: "250 miles from Coast",
    desc: "A glassy concrete pool with multiple depth sections. Highly recommended for carving practice and street cutbacks.",
    coordinates: { x: 62, y: 28 },
    rating: "4.8/5",
    difficulty: "Intermediate / Advanced"
  },
  {
    id: 3,
    name: "Gravity Hill Banked Slopes",
    type: "Sloped Bank",
    distance: "95 miles from Coast",
    desc: "A smooth asphalt drainage ditch bank with a perfect 30-degree incline. Emulates vertical waves for practicing top-turns and snaps.",
    coordinates: { x: 22, y: 72 },
    rating: "4.7/5",
    difficulty: "Advanced"
  },
  {
    id: 4,
    name: "Midwest Wave Plaza",
    type: "Pump Track",
    distance: "420 miles from Coast",
    desc: "A community park with a continuous looping track designed by surf-skaters. Perfect for endless carving flow sessions.",
    coordinates: { x: 78, y: 65 },
    rating: "4.6/5",
    difficulty: "Beginner / Intermediate"
  }
];

function initSpotFinder() {
  const spotList = document.querySelector('.spot-list');
  const searchInput = document.getElementById('spot-search');
  const filterTags = document.querySelectorAll('.filter-tag');
  const mapCanvas = document.querySelector('.map-canvas-mock');
  const popup = document.getElementById('map-popup');
  
  let currentFilter = 'All';
  let searchQuery = '';

  function renderSpots() {
    spotList.innerHTML = '';
    
    // Clear pins
    const existingPins = mapCanvas.querySelectorAll('.map-pin');
    existingPins.forEach(p => p.remove());

    const filtered = SPOT_DATA.filter(spot => {
      const matchesFilter = currentFilter === 'All' || spot.type === currentFilter;
      const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            spot.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    filtered.forEach((spot, idx) => {
      // 1. Create Spot List Item
      const card = document.createElement('div');
      card.className = `spot-card glass-card ${idx === 0 ? 'active' : ''}`;
      card.setAttribute('data-id', spot.id);
      card.innerHTML = `
        <div class="spot-type">${spot.type}</div>
        <div class="spot-name">${spot.name}</div>
        <div class="spot-meta">
          <span>📍 ${spot.distance}</span>
          <span>⭐ ${spot.rating}</span>
        </div>
      `;
      
      card.addEventListener('click', () => {
        selectSpot(spot.id);
      });
      spotList.appendChild(card);

      // 2. Add Pin to Map
      const pin = document.createElement('div');
      pin.className = `map-pin ${spot.type === 'Pump Track' ? 'map-pin-primary' : 'map-pin-secondary'}`;
      pin.style.left = `${spot.coordinates.x}%`;
      pin.style.top = `${spot.coordinates.y}%`;
      pin.setAttribute('data-id', spot.id);
      
      pin.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `;

      pin.addEventListener('click', () => {
        selectSpot(spot.id);
      });

      mapCanvas.appendChild(pin);
    });

    if (filtered.length > 0) {
      selectSpot(filtered[0].id);
    } else {
      popup.classList.remove('active');
    }
  }

  function selectSpot(id) {
    const spot = SPOT_DATA.find(s => s.id === id);
    if (!spot) return;

    // Update active list card
    const cards = spotList.querySelectorAll('.spot-card');
    cards.forEach(card => {
      if (parseInt(card.getAttribute('data-id')) === id) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update active map pin
    const pins = mapCanvas.querySelectorAll('.map-pin');
    pins.forEach(pin => {
      if (parseInt(pin.getAttribute('data-id')) === id) {
        pin.classList.add('active');
      } else {
        pin.classList.remove('active');
      }
    });

    // Show popup
    popup.innerHTML = `
      <div class="spot-type">${spot.type}</div>
      <div class="popup-title">${spot.name}</div>
      <div class="popup-desc">${spot.desc}</div>
      <div class="spot-meta">
        <span>Level: <strong>${spot.difficulty}</strong></span>
        <span>Rating: <strong>${spot.rating}</strong></span>
      </div>
    `;
    
    // Position popup near the spot
    popup.style.left = `calc(${spot.coordinates.x}% - 140px)`;
    popup.style.top = `calc(${spot.coordinates.y}% - 140px)`;
    
    // Boundary check for popup placement
    if (spot.coordinates.y < 30) {
      popup.style.top = `calc(${spot.coordinates.y}% + 40px)`;
    }
    if (spot.coordinates.x < 25) {
      popup.style.left = `calc(${spot.coordinates.x}% + 20px)`;
    } else if (spot.coordinates.x > 75) {
      popup.style.left = `calc(${spot.coordinates.x}% - 300px)`;
    }

    popup.classList.add('active');
    playTone(400, 'sine', 0.05);
  }

  // Bind search input events
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderSpots();
  });

  // Bind tags click events
  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      currentFilter = tag.getAttribute('data-filter');
      renderSpots();
    });
  });

  // Initial render
  renderSpots();
}
