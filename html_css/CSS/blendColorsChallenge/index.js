const timeSlider = document.getElementById('timeSlider');
const liquidArrow = document.getElementById('liquidArrow');
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

// Narrative Content for Sections
const sections = [
    {
        threshold: 140,
        title: "Pacific Night",
        glow: "rgb(0, 100, 255)",
        text: "The system is in low-power mode. I’m perched in the dark on a hill, looking at a giant hardware installation suspended over a black void. The Golden Gate is barely seen; it’s a series of status LEDs—International Orange beacons pulsing against a #000000 background."
    },
    {
        threshold: 250,
        title: "Pre-dawn Mist",
        glow: "rgb(171, 178, 185)",
        text: "A massive rendering error has occurred. The fog has rolled in from the Pacific, a thick layer of unoptimized CSS blur() that has dropped the visibility to near-zero. The bridge towers are partially occluded, their top sections losing connection with the base."
    },
    {
        threshold: 400,
        title: "Winter Sunrise",
        glow: "rgb(211, 84, 0)",
        text: "The boot sequence begins. It’s not a smooth transition; it’s a sharp hex shift from deep indigo to a cold, brittle violet. The International Orange of the Golden Gate Bridge starts to initialize, flickering into life as the first photons hit the steel."
    },
    {
        threshold: 550,
        title: "Winter Daylight",
        glow: "rgb(46, 134, 193)",
        text: "Production environment: Live. The sky is a flat, crisp #87CEEB with zero percent opacity on the clouds. The bridge is the only vibrant component in a world of muted winter tones. I’m analyzing the movement of the cars—tiny data packets moving across a two-mile bus."
    },
    {
        threshold: 700,
        title: "Low Winter Sun",
        glow: "rgb(247, 220, 111)",
        text: "The sun's elevation is stuck at a suboptimal angle. In winter, the light doesn't hit the 'Main' container from above; it attacks from the side, creating long, dramatic box-shadow effects that stretch across the span. High-contrast, high-stakes UI."
    },
    {
        threshold: 850,
        title: "Golden Dusk",
        glow: "rgb(192, 57, 43)",
        text: "The shutdown protocol has been initiated. The sun is sinking into the Pacific, triggering a linear-gradient that transitions from burnt amber to a bruised purple. The bridge is catching the last of the 'Golden Hour' rays, its steel skin glowing like it’s being overclocked."
    },
    {
        threshold: 1001,
        title: "Pacific Night II",
        glow: "rgb(120, 40, 200)",
        text: "The day’s telemetry is archived. This site is a visual log of the last twelve hours—a study in atmospheric blends. Using color-mix(in srgb, var(--bridge-orange), var(--pacific-blue) 40%), we’ve reconstructed the transition. System status: Restored to #000."
    }
];

function updateTime(value) {
    const progress = value / 1000;
    
    // Update Arrow position
    const sliderWidth = timeSlider.offsetWidth;
    const arrowPos = progress * (sliderWidth - 30);
    liquidArrow.style.left = `${arrowPos}px`;

    // Dynamic State Variables
    let sunColor = '#fff';
    let intensity = 0; 
    let brightness = 0.2;
    let starOpacity = 0;

    // Determine current section and narrative
    const currentSection = sections.find(s => value < s.threshold) || sections[sections.length - 1];
    
    // Update Info Box
    if (infoTitle.innerText !== currentSection.title) {
        infoTitle.innerText = currentSection.title;
        infoText.innerText = currentSection.text;
        root.style.setProperty('--glow', currentSection.glow);
    }

    // Celestial Logic: Left to Right winter arc (250-750)
    const isDay = progress > 0.22 && progress < 0.78;
    const sunXPercent = 10 + (progress * 80);
    let sunYPercent = 33; 

    if (isDay) {
        const dayProgress = (progress - 0.25) / 0.5; // 0 at sunrise, 1 at sunset
        const arc = Math.sin(dayProgress * Math.PI); 
        sunYPercent = 33 - (arc * 23); 
        intensity = arc;
        brightness = 0.4 + (arc * 0.8);
        
        // Color shifts based on dayProgress
        if (dayProgress < 0.3) {
            sunColor = `color-mix(in srgb, var(--gg-orange), #fff 40%)`;
        } else if (dayProgress < 0.7) {
            sunColor = `color-mix(in srgb, var(--vic-yellow), #fff 80%)`;
        } else {
            sunColor = `color-mix(in srgb, #C70039, var(--gg-orange) 60%)`;
        }
    } else {
        intensity = 0;
        brightness = 0.25; 
        sunYPercent = 80; 
        starOpacity = progress < 0.22 || progress > 0.78 ? 0.8 : 0;
    }

    // Apply to DOM
    root.style.setProperty('--sun-x', `${sunXPercent}vw`);
    root.style.setProperty('--sun-y', `${sunYPercent}vh`);
    root.style.setProperty('--sun-intensity', intensity);
    root.style.setProperty('--sun-color', sunColor);
    root.style.setProperty('--sky-brightness', brightness);

    // Sky Background
    const horizonColor = isDay ? sunColor : '#050a10';
    skyOverlay.style.background = `linear-gradient(to bottom, #050a10 0%, color-mix(in srgb, ${horizonColor}, transparent 50%) 60%, #000 100%)`;
    
    stars.style.opacity = starOpacity;
    timeDisplay.innerText = currentSection.title; // Use section title as label
    
    // 360 effect
    panoramaBg.style.backgroundPosition = `${progress * 100}% 60%`;
    groundFog.style.opacity = 0.3 + (intensity * 0.5);
    
    sun.style.opacity = isDay ? 0.7 : 0; // Keeping user request for transparency
    sunGlow.style.opacity = isDay ? intensity : 0;
}

// Initial Call
updateTime(timeSlider.value);

timeSlider.addEventListener('input', (e) => {
    updateTime(e.target.value);
});

window.addEventListener('resize', () => {
    updateTime(timeSlider.value);
});
