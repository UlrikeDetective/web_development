const timeSlider = document.getElementById('timeSlider');
const liquidArrow = document.getElementById('liquidArrow');
const timeDisplay = document.getElementById('timeDisplay');
const skyOverlay = document.querySelector('.sky-overlay');
const sun = document.querySelector('.sun');
const moon = document.querySelector('.moon');
const panoramaBg = document.querySelector('.panorama-bg');
const root = document.documentElement;

// Time of day segments (0 to 1000)
// 0-250: Night to Sunrise
// 250-500: Sunrise to Midday
// 500-750: Midday to Sunset
// 750-1000: Sunset to Night

function updateTime(value) {
    const progress = value / 1000;
    root.style.setProperty('--time-progress', progress);

    // Update Liquid Arrow Position
    const sliderWidth = timeSlider.offsetWidth;
    const arrowPos = (value / 1000) * (sliderWidth - 40);
    liquidArrow.style.left = `${arrowPos}px`;

    // Sky Logic & Color Mixing
    let skyColor = '';
    let timeText = '';
    let fogOpacity = 0.4;
    let sunOpacity = 0;
    let moonOpacity = 0;
    let panoramaBrightness = 0.5;

    if (value < 250) {
        // Night to Sunrise
        const p = value / 250;
        skyColor = `color-mix(in srgb, var(--night-sky), var(--sunrise-sky) ${p * 100}%)`;
        timeText = "Dawn Approaching";
        fogOpacity = 0.6 + (p * 0.2); // Karl waking up
        moonOpacity = 1 - p;
        sunOpacity = p * 0.5;
        panoramaBrightness = 0.2 + (p * 0.3);
    } else if (value < 500) {
        // Sunrise to Midday
        const p = (value - 250) / 250;
        skyColor = `color-mix(in srgb, var(--sunrise-sky), var(--midday-sky) ${p * 100}%)`;
        timeText = p < 0.3 ? "Sunrise" : "Morning in SF";
        fogOpacity = 0.8 - (p * 0.4); // Karl lifting slightly
        sunOpacity = 0.5 + (p * 0.5);
        panoramaBrightness = 0.5 + (p * 0.5);
    } else if (value < 750) {
        // Midday to Sunset
        const p = (value - 500) / 250;
        skyColor = `color-mix(in srgb, var(--midday-sky), var(--sunset-sky) ${p * 100}%)`;
        timeText = p < 0.7 ? "Afternoon Glow" : "Golden Hour";
        fogOpacity = 0.4 + (p * 0.3); // Karl returning
        sunOpacity = 1 - (p * 0.3);
        panoramaBrightness = 1.0 - (p * 0.3);
    } else {
        // Sunset to Night
        const p = (value - 750) / 250;
        skyColor = `color-mix(in srgb, var(--sunset-sky), var(--night-sky) ${p * 100}%)`;
        timeText = p < 0.3 ? "Dusk" : "Nightfall";
        fogOpacity = 0.7 + (p * 0.1); // Karl settling in
        sunOpacity = 0.7 * (1 - p);
        moonOpacity = p;
        panoramaBrightness = 0.7 - (p * 0.5);
    }

    // Apply Styles
    skyOverlay.style.background = skyColor;
    timeDisplay.innerText = timeText;
    root.style.setProperty('--fog-opacity', fogOpacity);
    panoramaBg.style.filter = `brightness(${panoramaBrightness}) contrast(1.1) saturate(${0.5 + (sunOpacity * 0.5)})`;

    // Orbiting logic for celestial bodies (360-degree journey)
    // 0 is sunrise point, 250 is midday zenith, 500 is sunset, 750 is nadir (below)
    const angle = (value / 1000) * 360 - 90; // Adjust so midday is at the top (-90deg)
    
    // Position Sun
    const sunAngle = angle + 90; // Start at sunrise point
    sun.style.transform = `translate(-50%, -50%) rotate(${sunAngle}deg) translateY(-42vh) rotate(-${sunAngle}deg)`;
    sun.style.opacity = sunOpacity;

    // Position Moon (Opposite to Sun)
    const moonAngle = sunAngle + 180;
    moon.style.transform = `translate(-50%, -50%) rotate(${moonAngle}deg) translateY(-42vh) rotate(-${moonAngle}deg)`;
    moon.style.opacity = moonOpacity;
}

// Initial Call
updateTime(timeSlider.value);

// Event Listeners
timeSlider.addEventListener('input', (e) => {
    updateTime(e.target.value);
});

// Window Resize Handling for Arrow
window.addEventListener('resize', () => {
    updateTime(timeSlider.value);
});
