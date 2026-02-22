# San Francisco 360: A Day in the Fog

This project is a visual exploration of San Francisco's unique atmosphere, featuring the Golden Gate Bridge, the "Karl the Fog" phenomenon, and the vibrant colors of the city's Victorian architecture.

## Overview
A 360-degree journey through a single day in San Francisco. Using a "liquid" style slider, users can transition from the cool, misty dawn to the bright midday sun, through the golden hour of sunset, and into the starry Pacific night.

## Key Features
- **Dynamic Sky**: Real-time color interpolation using the modern CSS `color-mix()` function.
- **Karl the Fog**: A reactive fog layer that uses CSS blend modes (`screen`, `overlay`) to simulate atmospheric depth.
- **Celestial Journey**: Sun and Moon follow a 360-degree orbit based on the time slider.
- **San Francisco Palette**: Custom color themes inspired by the Golden Gate Bridge ("The Icon"), the fog, the bay, and the "Painted Ladies" Victorians.

## How to Run
Simply open `index.html` in a modern web browser that supports CSS `color-mix()` (Chrome 111+, Safari 16.2+, Firefox 113+).

## Project Structure
- `index.html`: The base structure of the panorama and controls.
- `style.css`: All the styling, focusing on variables, color mixing, and blending.
- `index.js`: Logic to handle the slider and update the visual state.
- `explain.md`: A detailed technical breakdown of the implementation.
