const timeSlider = document.getElementById('timeSlider');
const liquidArrow = document.getElementById('liquidArrow');
const timeDisplay = document.getElementById('timeDisplay');
const skyOverlay = document.querySelector('.sky-overlay');
const sun = document.querySelector('.sun');
const sunGlow = document.querySelector('.sun-glow');
const stars = document.querySelector('.stars');
const panoramaBg = document.querySelector('.panorama-bg');
const groundFog = document.querySelector('.ground-fog');
const root = document.documentElement;

function updateTime(value) {
    const progress = value / 1000;
    
    // Update Arrow position
    const sliderWidth = timeSlider.offsetWidth;
    const arrowPos = progress * (sliderWidth - 30);
    liquidArrow.style.left = `${arrowPos}px`;

    // Dynamic State Variables
    let skyColor = '';
    let sunColor = '#fff';
    let intensity = 0; // 0 to 1 scale for day part
    let brightness = 0.2;
    let starOpacity = 0;
    let timeLabel = '';

    // Celestial Logic: Left to Right winter arc
    // Sunrise at 250 (0.25), Sunset at 750 (0.75)
    const isDay = progress > 0.22 && progress < 0.78;
    
    // Calculate Sun Position (Horizontal: 10% to 90%, Vertical: 33% at horizon, peaks higher)
    const sunXPercent = 10 + (progress * 80);
    let sunYPercent = 33; // Default at 1/3 top

    if (isDay) {
        const dayProgress = (progress - 0.25) / 0.5; // 0 at sunrise, 1 at sunset
        const arc = Math.sin(dayProgress * Math.PI); // 0 -> 1 -> 0
        
        // Accurate Winter angle: Shallow arc staying in top 1/3
        // Peaks at y=10vh (midday) and stays at y=33vh (sunrise/sunset)
        sunYPercent = 33 - (arc * 23); 
        intensity = arc;
        brightness = 0.4 + (arc * 0.8);
        
        // Color: Warm natural spectrum
        if (dayProgress < 0.3) {
            sunColor = `color-mix(in srgb, var(--gg-orange), #fff 40%)`; // Early Warmth
            timeLabel = "Winter Sunrise";
        } else if (dayProgress < 0.7) {
            sunColor = `color-mix(in srgb, var(--vic-yellow), #fff 80%)`; // Bright Midday
            timeLabel = "Winter Daylight";
        } else {
            sunColor = `color-mix(in srgb, #C70039, var(--gg-orange) 60%)`; // Warm Sunset
            timeLabel = "Golden Dusk";
        }
    } else {
        // Night phase: Brighter Pacific Night
        intensity = 0;
        brightness = 0.25; // Increased from 0.15 for better visibility
        sunYPercent = 80; // Hidden below horizon
        starOpacity = progress < 0.22 || progress > 0.78 ? 0.8 : 0; // Much clearer stars
        timeLabel = "Pacific Night";
    }

    // Apply to DOM
    root.style.setProperty('--sun-x', `${sunXPercent}vw`);
    root.style.setProperty('--sun-y', `${sunYPercent}vh`);
    root.style.setProperty('--sun-intensity', intensity);
    root.style.setProperty('--sun-color', sunColor);
    root.style.setProperty('--sky-brightness', brightness);

    // Sky Background Gradient
    const horizonColor = isDay ? sunColor : '#050a10';
    skyOverlay.style.background = `linear-gradient(to bottom, #050a10 0%, color-mix(in srgb, ${horizonColor}, transparent 50%) 60%, #000 100%)`;
    
    stars.style.opacity = starOpacity;
    timeDisplay.innerText = timeLabel;
    
    // Simulate background shift for 360 feel
    panoramaBg.style.backgroundPosition = `${progress * 100}% 60%`;
    groundFog.style.opacity = 0.3 + (intensity * 0.5);
    
    // Visibility of sun
    sun.style.opacity = isDay ? 1 : 0;
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
