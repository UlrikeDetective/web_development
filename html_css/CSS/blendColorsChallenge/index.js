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

// Narrative Sections with Palette Blending (color-mix)
const sections = [
    {
        threshold: 140,
        title: "Pacific Night",
        glow: "var(--bay-blue)",
        bg: "color-mix(in srgb, var(--bay-blue), transparent 70%)",
        text: "The system is in low-power mode. I’m perched in the dark on a hill, looking at a giant hardware installation suspended over a black void. The Golden Gate is barely seen; it’s a series of status LEDs—International Orange beacons pulsing against a #000000 background."
    },
    {
        threshold: 280,
        title: "Pre-dawn Mist",
        glow: "var(--fog-cool)",
        bg: "color-mix(in srgb, var(--fog-mist), transparent 60%)",
        text: "A massive rendering error has occurred. The fog has rolled in from the Pacific, a thick layer of unoptimized CSS blur() that has dropped the visibility to near-zero. The bridge towers are partially occluded, their top sections losing connection with the base."
    },
    {
        threshold: 420,
        title: "Winter Sunrise",
        glow: "var(--icon-orange)",
        bg: "color-mix(in srgb, var(--icon-orange), transparent 60%)",
        text: "The boot sequence begins. It’s not a smooth transition; it’s a sharp hex shift from deep indigo to a cold, brittle violet. The sun—the master process—cracks the horizon near the East Bay hills. The International Orange of the bridge starts to initialize."
    },
    {
        threshold: 560,
        title: "Low Winter Sun",
        glow: "var(--victorian-yellow)",
        bg: "color-mix(in srgb, var(--victorian-yellow), transparent 60%)",
        text: "The sun's elevation is stuck at a suboptimal angle. In winter, the light doesn't hit the 'Main' container from above; it attacks from the side, creating long, dramatic box-shadow effects. The glare is a security vulnerability—raw white light."
    },
    {
        threshold: 700,
        title: "Winter Daylight",
        glow: "var(--bay-pale)",
        bg: "color-mix(in srgb, var(--bay-pale), transparent 50%)",
        text: "Production environment: Live. The sky is a flat, crisp #87CEEB with zero percent opacity on the clouds. The bridge is the only vibrant component. I’m analyzing the movement of the cars—tiny data packets moving across a two-mile bus."
    },
    {
        threshold: 840,
        title: "Golden Dusk",
        glow: "var(--icon-brick)",
        bg: "color-mix(in srgb, var(--icon-brick), transparent 60%)",
        text: "The shutdown protocol has been initiated. The sun is sinking into the Pacific, triggering a linear-gradient that transitions from burnt amber to a bruised purple. The bridge catchies the last rays, its steel skin glowing like it’s being overclocked."
    },
    {
        threshold: 1001,
        title: "Pacific Night II",
        glow: "var(--muted-lavender)",
        bg: "color-mix(in srgb, var(--muted-lavender), transparent 70%)",
        text: "The day’s telemetry is archived. This site is a visual log of the last twelve hours—a study in atmospheric blends. Using color-mix(in srgb, var(--bridge-orange), var(--pacific-blue) 40%), we’ve reconstructed the transition. System status: Restored to #000."
    }
];

function updateTime(value) {
    const progress = value / 1000;
    
    // Update Arrow position
    const sliderWidth = timeSlider.offsetWidth;
    const arrowPos = progress * (sliderWidth - 30);
    liquidArrow.style.left = `${arrowPos}px`;

    // Determine current section
    const currentSection = sections.find(s => value < s.threshold) || sections[sections.length - 1];
    
    // Update Info Box Content
    if (infoTitle.innerText !== currentSection.title) {
        infoBox.style.opacity = 0; // Fade out
        setTimeout(() => {
            infoTitle.innerText = currentSection.title;
            infoText.innerText = currentSection.text;
            root.style.setProperty('--glow', currentSection.glow);
            root.style.setProperty('--box-bg', currentSection.bg);
            infoBox.style.opacity = 1; // Fade in
        }, 150);
    }

    // Arch movement for the box
    // X goes from 10% to 90%
    const boxX = 10 + (progress * 80);
    // Y goes from 10% to 50% and back (arch)
    const arcHeight = Math.sin(progress * Math.PI) * 40;
    const boxY = 10 + arcHeight;
    
    root.style.setProperty('--box-x', `${boxX}%`);
    root.style.setProperty('--box-y', `${boxY}%`);

    // Celestial Logic: Left to Right winter arc (250-750)
    let sunColor = '#fff';
    let intensity = 0;
    let brightness = 0.25;
    let starOpacity = 0;

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
            sunColor = `color-mix(in srgb, var(--icon-orange), #fff 40%)`;
        } else if (dayProgress < 0.7) {
            sunColor = `color-mix(in srgb, var(--victorian-yellow), #fff 80%)`;
        } else {
            sunColor = `color-mix(in srgb, var(--icon-brick), var(--icon-orange) 60%)`;
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
    timeDisplay.innerText = currentSection.title;
    
    // 360 effect: Panorama scrolling starts at Pacific Night (progress 0)
    panoramaBg.style.backgroundPosition = `${progress * 100}% 60%`;
    groundFog.style.opacity = 0.3 + (intensity * 0.5);
    
    sun.style.opacity = isDay ? 0.6 : 0; 
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
