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
        panoramaBrightness = 0.1 + (p * 0.2);
        starOpacity = p < 0.3 ? 0.4 : 0.4 * (1 - p); // Sparse stars fade as dawn approaches
    } else if (value < 500) {
        // Sunrise to Midday
        const p = (value - 250) / 250;
        skyColor = `color-mix(in srgb, var(--sunrise-sky), var(--midday-sky) ${p * 100}%)`;
        timeText = "Sunrise at the Golden Gate";
        fogOpacity = 0.9 - (p * 0.4);
        sunOpacity = 1;
        panoramaBrightness = 0.3 + (p * 0.7);
        starOpacity = 0;
    } else if (value < 750) {
        // Midday to Sunset
        const p = (value - 500) / 250;
        skyColor = `color-mix(in srgb, var(--midday-sky), var(--sunset-sky) ${p * 100}%)`;
        timeText = "Golden Afternoon";
        fogOpacity = 0.5 + (p * 0.3);
        sunOpacity = 1;
        panoramaBrightness = 1.0 - (p * 0.4);
        starOpacity = 0;
    } else {
        // Sunset to Night
        const p = (value - 750) / 250;
        skyColor = `color-mix(in srgb, var(--sunset-sky), var(--night-sky) ${p * 100}%)`;
        timeText = "Dusk falling over the Bay";
        fogOpacity = 0.8 + (p * 0.1);
        sunOpacity = 1 - p;
        panoramaBrightness = 0.6 - (p * 0.5);
        starOpacity = p * 0.4; // Sparse stars appear as it gets pitch dark
    }

    // Apply Styles
    skyOverlay.style.background = `linear-gradient(to bottom, ${skyColor} 0%, color-mix(in srgb, ${skyColor}, #000 30%) 60%, #000 100%)`;
    panoramaViewport.style.backgroundColor = skyColor;
    timeDisplay.innerText = timeText;
    root.style.setProperty('--fog-opacity', fogOpacity);
    panoramaBg.style.filter = `brightness(${panoramaBrightness}) contrast(1.1) saturate(${0.4 + (sunOpacity * 0.6)})`;
    stars.style.opacity = starOpacity;

    // Advanced Celestial Path: Elliptical Orbit with Retrograde and Tilted Ecliptic
    // Normal Progress (t) from 0 to PI
    const t = (progress - 0.25) * 2 * Math.PI; 
    
    // Elliptical parameters (a: horizontal, b: vertical)
    const a = 50; // semi-major (vh)
    const b = 40; // semi-minor (vh)
    
    // Retrograde component: adds a "hitch" or slight backward movement in the orbit
    const retrograde = 5 * Math.sin(t * 2); 
    
    // Calculate raw X and Y in the ellipse
    const rawX = (a + retrograde) * Math.cos(t + Math.PI);
    const rawY = b * Math.sin(t + Math.PI);
    
    // Rotate coordinates for Ecliptic Angle (30 degrees)
    const phi = 30 * (Math.PI / 180);
    const x = rawX * Math.cos(phi) - rawY * Math.sin(phi);
    const y = rawX * Math.sin(phi) + rawY * Math.cos(phi);
    
    // Apply Transform: Center is the horizon at (50vw, 60vh)
    const centerX = 50;
    const centerY = 60;
    
    sun.style.transform = `translate(calc(${centerX}vw + ${x}vh), calc(${centerY}vh + ${y}vh)) translate(-50%, -50%)`;
    sun.style.opacity = y < 0 ? sunOpacity : 0; 
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
