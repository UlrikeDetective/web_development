const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const timeDisplay = document.getElementById('timeDisplay');
const skyOverlay = document.querySelector('.sky-overlay');
const sun = document.querySelector('.sun');
const sunGlow = document.querySelector('.sun-glow');
const stars = document.querySelector('.stars');
const panoramaBg = document.querySelector('.panorama-bg');
const groundFog = document.querySelector('.ground-fog');
const infoBox = document.getElementById('infoBox');
const infoTitle = document.getElementById('infoTitle');
const infoText = document.getElementById('infoText');
const root = document.documentElement;

let timeValue = 0; // 0 to 2000 (Extended timeframe)
const MAX_TIME = 2000;
let scrollInterval = null;

// Narrative Sections with Extended Thresholds
const sections = [
    {
        threshold: 300,
        title: "Pacific Night",
        glow: "var(--bay-blue)",
        bg: "color-mix(in srgb, var(--bay-blue), transparent 40%)",
        text: "The system is in low-power mode. I’m perched in the dark on a hill, looking at a giant hardware installation suspended over a black void. The Golden Gate is barely seen; it’s a series of status LEDs—International Orange beacons pulsing against a #000000 background."
    },
    {
        threshold: 700, // Longer transition through the mist
        title: "Pre-dawn Mist",
        glow: "var(--fog-cool)",
        bg: "color-mix(in srgb, var(--fog-mist), transparent 40%)",
        text: "A massive rendering error has occurred. The fog has rolled in from the Pacific, a thick layer of unoptimized CSS blur() that has dropped the visibility to near-zero. The bridge towers are partially occluded, their top sections losing connection with the base."
    },
    {
        threshold: 1000,
        title: "Winter Sunrise",
        glow: "var(--icon-orange)",
        bg: "color-mix(in srgb, var(--icon-orange), transparent 40%)",
        text: "The boot sequence begins. It’s not a smooth transition; it’s a sharp hex shift from deep indigo to a cold, brittle violet. The sun—the master process—cracks the horizon near the East Bay hills. The International Orange of the bridge starts to initialize."
    },
    {
        threshold: 1300,
        title: "Low Winter Sun",
        glow: "var(--victorian-yellow)",
        bg: "color-mix(in srgb, var(--victorian-yellow), transparent 40%)",
        text: "The sun's elevation is stuck at a suboptimal angle. In winter, the light doesn't hit the 'Main' container from above; it attacks from the side, creating long, dramatic box-shadow effects. The glare is a security vulnerability—raw white light."
    },
    {
        threshold: 1550,
        title: "Winter Daylight",
        glow: "var(--bay-water)",
        bg: "color-mix(in srgb, var(--bay-water), transparent 40%)",
        text: "Production environment: Live. The sky is a flat, crisp #87CEEB with zero percent opacity on the clouds. The bridge is the only vibrant component. I’m analyzing the movement of the cars—tiny data packets moving across a two-mile bus."
    },
    {
        threshold: 1750, // Ends sooner as requested
        title: "Golden Dusk",
        glow: "var(--icon-brick)",
        bg: "color-mix(in srgb, var(--icon-brick), transparent 40%)",
        text: "The shutdown protocol has been initiated. The sun is sinking into the Pacific, triggering a linear-gradient that transitions from burnt amber to a bruised purple. The bridge catchies the last rays, its steel skin glowing like it’s being overclocked."
    },
    {
        threshold: 2001,
        title: "Pacific Night II",
        glow: "var(--muted-lavender)",
        bg: "color-mix(in srgb, var(--muted-lavender), transparent 40%)",
        text: "The day’s telemetry is archived. This site is a visual log of the last twelve hours—a study in atmospheric blends. Using color-mix(in srgb, var(--bridge-orange), var(--pacific-blue) 40%), we’ve reconstructed the transition. System status: Restored to #000."
    }
];

function updateTime(value) {
    const progress = value / MAX_TIME;
    
    const currentSection = sections.find(s => value < s.threshold) || sections[sections.length - 1];
    
    if (infoTitle.innerText !== currentSection.title) {
        infoBox.style.opacity = 0;
        setTimeout(() => {
            infoTitle.innerText = currentSection.title;
            infoText.innerText = currentSection.text;
            root.style.setProperty('--glow', currentSection.glow);
            root.style.setProperty('--box-bg', currentSection.bg);
            infoBox.style.opacity = 1;
        }, 150);
    }

    const boxX = 20 + (progress * 70);
    const arcHeight = Math.sin(progress * Math.PI) * 40;
    const boxY = 10 + arcHeight;
    
    root.style.setProperty('--box-x', `${boxX}%`);
    root.style.setProperty('--box-y', `${boxY}%`);

    let sunColor = '#fff';
    let intensity = 0;
    let brightness = 0.25;
    let starOpacity = 0;
    let skyBase = '#050a10';

    // Advanced Color Mix Transitions
    if (value < 300) {
        // Deep Night
        skyBase = 'var(--bay-blue)';
        brightness = 0.2;
        starOpacity = 0.8;
    } else if (value < 700) {
        // Night to Pre-dawn Mist: Mix Bay & Ocean with Karl the Fog
        const p = (value - 300) / 400;
        skyBase = `color-mix(in srgb, var(--bay-blue), var(--fog-mist) ${p * 100}%)`;
        brightness = 0.2 + (p * 0.1);
        starOpacity = 0.8 * (1 - p);
    } else if (value < 1750) {
        // Day Cycle (Sunrise to Sunset)
        const dayP = (value - 700) / 1050; // Progress through daylight sections
        const isDay = dayP > 0.05 && dayP < 0.95;
        
        if (isDay) {
            const arcProgress = (dayP - 0.05) / 0.9;
            const arc = Math.sin(arcProgress * Math.PI);
            intensity = arc;
            brightness = 0.3 + (arc * 0.8);
            
            // Sun Color mixing based on daylight progress
            if (arcProgress < 0.3) {
                sunColor = `color-mix(in srgb, var(--icon-orange), var(--victorian-yellow) ${arcProgress * 333}%)`;
            } else if (arcProgress < 0.7) {
                sunColor = `color-mix(in srgb, var(--victorian-yellow), #fff 80%)`;
            } else {
                sunColor = `color-mix(in srgb, var(--icon-brick), var(--icon-orange) 60%)`;
            }
            skyBase = sunColor;
        } else {
            skyBase = 'var(--icon-rust)';
            brightness = 0.3;
        }
    } else {
        // Sunset to Pacific Night II: Mix Icon colors with Bay & Ocean/Fog
        const p = (value - 1750) / 250;
        skyBase = `color-mix(in srgb, var(--icon-brick), var(--bay-blue) ${p * 100}%)`;
        brightness = 0.3 - (p * 0.1);
        starOpacity = p * 0.8;
    }

    // Celestial Positioning (Mapped to 2000 scale)
    const sunVisible = value > 750 && value < 1850;
    const sunXPercent = 10 + ((value - 750) / 1100 * 80);
    const dayProgress = (value - 750) / 1100;
    const arc = Math.sin(dayProgress * Math.PI);
    const sunYPercent = 33 - (arc * 23);

    root.style.setProperty('--sun-x', `${sunXPercent}vw`);
    root.style.setProperty('--sun-y', `${sunYPercent}vh`);
    root.style.setProperty('--sun-intensity', intensity);
    root.style.setProperty('--sun-color', sunColor);
    root.style.setProperty('--sky-brightness', brightness);

    skyOverlay.style.background = `linear-gradient(to bottom, #000 0%, color-mix(in srgb, ${skyBase}, transparent 30%) 50%, #000 100%)`;
    stars.style.opacity = starOpacity;
    timeDisplay.innerText = currentSection.title;
    panoramaBg.style.backgroundPosition = `${progress * 100}% 60%`;
    
    sun.style.opacity = sunVisible ? 0.6 : 0; 
    sunGlow.style.opacity = sunVisible ? intensity : 0;
}

function startScrolling(direction) {
    if (scrollInterval) return;
    timeValue = Math.max(0, Math.min(MAX_TIME, timeValue + (direction * 10)));
    updateTime(timeValue);

    scrollInterval = setInterval(() => {
        timeValue = Math.max(0, Math.min(MAX_TIME, timeValue + (direction * 8)));
        updateTime(timeValue);
        if (timeValue <= 0 || timeValue >= MAX_TIME) stopScrolling();
    }, 16);
}

function stopScrolling() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
}

prevBtn.addEventListener('mousedown', () => startScrolling(-1));
nextBtn.addEventListener('mousedown', () => startScrolling(1));
window.addEventListener('mouseup', stopScrolling);
prevBtn.addEventListener('mouseleave', stopScrolling);
nextBtn.addEventListener('mouseleave', stopScrolling);

prevBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startScrolling(-1); });
nextBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startScrolling(1); });
window.addEventListener('touchend', stopScrolling);

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { timeValue = Math.max(0, timeValue - 40); updateTime(timeValue); }
    else if (e.key === 'ArrowRight') { timeValue = Math.min(MAX_TIME, timeValue + 40); updateTime(timeValue); }
});

updateTime(timeValue);
