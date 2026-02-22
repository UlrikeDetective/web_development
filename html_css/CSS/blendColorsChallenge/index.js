const timeSlider = document.getElementById('timeSlider');
const liquidArrow = document.getElementById('liquidArrow');
const timeDisplay = document.getElementById('timeDisplay');
const skyOverlay = document.querySelector('.sky-overlay');
const sun = document.querySelector('.sun');
const stars = document.querySelector('.stars');
const panoramaBg = document.querySelector('.panorama-bg');
const panoramaViewport = document.querySelector('.panorama-viewport');
const root = document.documentElement;

function updateTime(value) {
    const progress = value / 1000;
    root.style.setProperty('--time-progress', progress);

    // Update Liquid Arrow Position
    const sliderWidth = timeSlider.offsetWidth;
    const arrowPos = progress * (sliderWidth - 40);
    liquidArrow.style.left = `${arrowPos}px`;

    // Sky Logic & Color Mixing
    let skyColor = '';
    let timeText = '';
    let fogOpacity = 0.4;
    let sunOpacity = 0;
    let panoramaBrightness = 0.5;
    let starOpacity = 0;

    if (value < 250) {
        // Late Night to Early Dawn
        const p = value / 250;
        skyColor = `color-mix(in srgb, var(--night-sky), var(--sunrise-sky) ${p * 60}%)`;
        timeText = "Pre-dawn Mist";
        fogOpacity = 0.8 + (p * 0.1);
        sunOpacity = 0;
        panoramaBrightness = 0.15 + (p * 0.15);
        starOpacity = p < 0.3 ? 0.4 : 0.4 * (1 - p);
    } else if (value < 500) {
        // Sunrise to Midday
        const p = (value - 250) / 250;
        skyColor = `color-mix(in srgb, var(--sunrise-sky), var(--midday-sky) ${p * 100}%)`;
        timeText = "Winter Sunrise";
        fogOpacity = 0.9 - (p * 0.4);
        sunOpacity = 1;
        panoramaBrightness = 0.3 + (p * 0.7);
        starOpacity = 0;
    } else if (value < 750) {
        // Midday to Sunset
        const p = (value - 500) / 250;
        skyColor = `color-mix(in srgb, var(--midday-sky), var(--sunset-sky) ${p * 100}%)`;
        timeText = "Low Winter Sun";
        fogOpacity = 0.5 + (p * 0.3);
        sunOpacity = 1;
        panoramaBrightness = 1.0 - (p * 0.4);
        starOpacity = 0;
    } else {
        // Sunset to Night
        const p = (value - 750) / 250;
        skyColor = `color-mix(in srgb, var(--sunset-sky), var(--night-sky) ${p * 100}%)`;
        timeText = "Dusk in the City";
        fogOpacity = 0.8 + (p * 0.1);
        sunOpacity = 1 - p;
        panoramaBrightness = 0.6 - (p * 0.5);
        starOpacity = p * 0.4;
    }

    // Apply Styles
    panoramaViewport.style.backgroundColor = skyColor;
    skyOverlay.style.background = `linear-gradient(to bottom, ${skyColor} 0%, color-mix(in srgb, ${skyColor}, #000 40%) 60%, #000 100%)`;
    timeDisplay.innerText = timeText;
    root.style.setProperty('--fog-opacity', fogOpacity);
    panoramaBg.style.filter = `brightness(${panoramaBrightness}) contrast(1.1) saturate(${0.4 + (sunOpacity * 0.6)})`;
    stars.style.opacity = starOpacity;

    // Winter Sun Path: Left to Right with shallow arc
    // Visible range: progress 0.25 (Sunrise) to 0.75 (Sunset)
    if (progress >= 0.22 && progress <= 0.78) {
        const sunProgress = (progress - 0.25) / 0.5; // 0 at sunrise, 0.5 at noon, 1 at sunset
        
        // Left to Right movement (-40vw to 40vw)
        const x = (sunProgress * 80) - 40;
        
        // Shallow arc (sine wave): stays low (winter angle)
        // Max height is at noon (sunProgress = 0.5)
        const maxHeight = 35; // vh from horizon
        const y = -Math.sin(sunProgress * Math.PI) * maxHeight;
        
        // Base coordinate is horizon center (50vw, 60vh)
        const centerX = 50;
        const centerY = 60;
        
        sun.style.transform = `translate(calc(${centerX}vw + ${x}vw), calc(${centerY}vh + ${y}vh)) translate(-50%, -50%)`;
        sun.style.opacity = sunOpacity;
    } else {
        sun.style.opacity = 0;
    }
}

// Initial Call
updateTime(timeSlider.value);

// Event Listeners
timeSlider.addEventListener('input', (e) => {
    updateTime(e.target.value);
});

window.addEventListener('resize', () => {
    updateTime(timeSlider.value);
});
