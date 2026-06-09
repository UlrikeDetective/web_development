# BeachWalk — Technical Explanation

This project is an interactive, procedurally animated beach scene built using the **HTML5 Canvas API** and **Vanilla JavaScript**. It simulates the ebb and flow of tides and allows users to interact with the environment by leaving "seagull footprints" in the sand.

## Core Mechanics

### 1. Procedural Wave Animation
The waves are not pre-recorded animations; they are calculated in real-time using trigonometry.
- **Sine Wave Summation:** The `waveWobble` function combines multiple sine and cosine waves at different frequencies and phases. This creates an organic, non-repetitive "wobble" effect that simulates the complexity of real water surfaces.
- **Tide Cycle:** The `getTide` function uses a slow-moving sine wave mapped to a power function (`Math.pow`). This creates a non-linear tide cycle where the water stays at its highest and lowest points slightly longer, mimicking real tidal behavior.

### 2. Multi-Layered Rendering
The scene is rendered in layers from back to front:
1.  **Sand Base:** A solid background fill representing the dry sand.
2.  **Wet Sand Gradient:** As the tide comes in, a dynamic linear gradient is drawn over the sand. Its opacity and reach are linked to the current tidal height.
3.  **Deep Water:** The furthest layer of the ocean.
4.  **Mid Water:** The main body of the wave.
5.  **Foam Layer:** The leading edge of the wave, rendered with a slightly transparent "Alice Blue" color.
6.  **Stroke Edge:** A final, high-contrast stroke is drawn at the very edge of the foam to give the wave a crisp, "popping" look.

### 3. Interactive Footprints
The footprint system uses an "Object Pool" approach for memory efficiency:
- **Interaction Tracking:** The script listens for `mousemove` and `touchmove` events. It calculates the distance from the last print to ensure they aren't clumped too closely together.
- **Seagull Geometry:** Each footprint is a custom-drawn shape consisting of three "toes" and a "heel" stroke, rotated to match the direction of movement.
- **Life Cycle:** Every print is an object with a `born` timestamp and a `life` duration. In the animation loop, the script calculates the "age" of each print and fades its opacity using a quadratic curve (`1 - age * age`) before removing it from the array.

### 4. Performance Optimizations
- **CSS Variable Caching:** Instead of querying the DOM for colors every frame (which is expensive), the script caches the theme colors into JavaScript variables during initialization and resizing.
- **DPR Scaling:** The canvas automatically detects and scales for High-DPI (Retina) displays to ensure the lines remain sharp without manual configuration.
- **AnimationFrame Loop:** Uses `requestAnimationFrame` for buttery-smooth 60fps performance that pauses when the tab is inactive to save CPU/battery.

## Controls
- **Mouse/Touch:** Move across the sand (the area below the water) to leave seagull tracks.
- **Automatic:** The tide will continue to cycle indefinitely.
