# Technical Deep Dive: San Francisco 360

This project explores the intersection of CSS's modern color-mixing capabilities and sophisticated blending techniques to create a dynamic atmospheric experience.

## 1. Using `color-mix()` for Seamless Time Transitions

The core of the sky's color transition is the `color-mix()` function. Instead of static color stops, we use JS to update the percentage of one color relative to another based on the slider's progress.

### How it works:
- **Sunrise to Midday**: `color-mix(in srgb, var(--sunrise-sky), var(--midday-sky) ${p * 100}%)`
- **Midday to Sunset**: `color-mix(in srgb, var(--midday-sky), var(--sunset-sky) ${p * 100}%)`
- **Sunset to Night**: `color-mix(in srgb, var(--sunset-sky), var(--night-sky) ${p * 100}%)`

By using `in srgb`, we ensure a smooth interpolation that preserves the vibrancy of San Francisco's "International Orange" and the cool mist of "Karl the Fog."

## 2. Atmospheric Depth with Blend Modes

To simulate the thick, diffused light of the San Francisco fog, we used a combination of layers and blend modes:

### The Fog Layer (`mix-blend-mode: screen`)
- The `screen` mode is perfect for fog because it lightens the underlying layers while preserving highlights. It effectively "hides" the sun and stars behind the mist, making them appear blurred and diffused.
- The opacity of this layer is dynamically adjusted: it peaks at dawn and sunset when the "marine layer" is typically thickest.

### The Panorama Background (`mix-blend-mode: multiply`)
- The background image is blended with the sky color using `multiply`. This technique allows the sky's hue (from the `color-mix` function) to "tint" the entire cityscape, giving the bridge and the bay a realistic glow based on the time of day.

## 3. Celestial Mechanics

The sun and moon are positioned using CSS `transform` and `rotate`. By rotating a container and then counter-rotating the child element, we create a perfect 360-degree orbit that follows the slider's progress.

## 4. The Liquid Slider

The "liquid" style slider uses a custom `clip-path` for the arrow head and CSS animations to give it a pulsing, fluid feel as it travels across the timeline.

## 5. San Francisco Color Palette

The project uses a curated palette:
- **The Icon**: International Orange (`#D35400`) and Deep Brick (`#C0392B`).
- **Karl the Fog**: Cool Grey (`#ABB2B9`) and Mist (`#D5D8DC`).
- **Bay & Ocean**: Pacific Blue (`#2E86C1`) and Pale Horizon (`#AED6F1`).
- **Painted Ladies**: Victorian Yellow (`#F7DC6F`) and Muted Lavender (`#D7BDE2`).
