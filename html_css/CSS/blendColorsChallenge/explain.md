# San Francisco Winter Journey: Technical Summary

This project implements a sophisticated atmospheric day cycle centered on the Golden Gate Bridge, with a specific focus on the low-angle winter sun of San Francisco.

## 1. Accurate Celestial Path (Winter Angle)
The sun follows a mathematically defined arc that adheres strictly to the user's "Top 1/3" requirement:
- **Sunrise (0.25 progress)**: Positioned at `x=10vw, y=33vh`.
- **Zenith (0.5 progress)**: Peaks at `x=50vw, y=10vh`.
- **Sunset (0.75 progress)**: Ends at `x=90vw, y=33vh`.
The path uses a `sin()` function to ensure a smooth, predictable, and continuous arc across the top of the frame.

## 2. Realistic Lighting & Diffuse Bloom
To achieve natural lighting intensity:
- **Glare & Glow**: A `.glare` element and `.sun-glow` radial gradient follow the sun, using `mix-blend-mode: screen` to create a realistic atmospheric bloom.
- **Dynamic Intensity**: The `box-shadow` and `filter: brightness()` of the panorama background are synchronized with the sun's altitude, peaking at midday.

## 3. Natural Color Spectrum
Using the CSS `color-mix()` function, the sun's hue transitions smoothly through:
- **Dawn**: `color-mix(in srgb, var(--gg-orange), #fff 40%)`
- **Midday**: `color-mix(in srgb, var(--vic-yellow), #fff 80%)`
- **Dusk**: `color-mix(in srgb, #C70039, var(--gg-orange) 60%)`

## 4. Atmospheric Interaction (Dual-Layer Fog)
The iconic "Karl the Fog" is simulated using two distinct layers:
- **Sky Fog**: Behind the sun to diffuse the sky colors.
- **Ground Fog**: In front of the sun (using `mix-blend-mode: screen`) to make the sun appear truly embedded within the San Francisco mist.

## 5. Night Visualization
- **Pitch Dark**: At `progress < 0.2` and `progress > 0.8`, the sky fades to a deep `#050a10` black.
- **Sparse Stars**: A few light, realistic stars appear using subtle `radial-gradients`, fading out automatically as dawn approaches.

## 6. Panorama 360 Simulation
The bridge image (`landscape-360-bridge-golden-gate-bridge-mist-wallpaper-preview.jpg`) uses `background-position` shifting synchronized with the slider, creating a parallax-style 360-degree journey across the landscape.
