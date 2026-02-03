# Zen Game Over

A tranquil breathing exercise application built with HTML, CSS, and JavaScript, designed with a minimalist Japanese Zen aesthetic.

## Core Features
- **Breathing Exercises**: Three distinct rhythms designed for different states of mind.
- **Dynamic Visuals**: A central breathing circle that scales smoothly in synchronization with the exercise.
- **Zen Interface**: Navigation and controls styled as organic "Zen Stones."

## Breathing Patterns (Each repeated for 5 cycles)
1. **Box Breathing**: Breathe in (4s) → Hold (4s) → Breathe out (4s) → Hold (4s).
2. **Deep Calm**: Breathe in (6s) → Hold (4s) → Breathe out (6s).
3. **Energize**: Breathe in (7s) → Breathe out (3s).

## Visual Aesthetic & Color Palette
Inspired by natural elements:
- **White Dove** (`#f7f7f5`): Background
- **Lotus Flower** (`#e8d3d5`): Secondary accents and inactive circle
- **River Stone** (`#8c9fa0`): Tertiary accents and stone elements
- **Bamboo Wood** (`#d9c8a8`): Warm accents
- **Basalt Stone** (`#363636`): Primary text and dark stones
- **Himalayan Salt** (`#e8b4a3`): Active breathing state

## Design Specifications
- **Zen Stones**: Buttons are styled with organic, asymmetrical shapes and soft shadows to mimic river stones.
- **Breathing Circle**:
  - Diameter always exceeds text width by at least 10px.
  - 5px padding maintained around internal text.
  - Smooth transitions for both scale and color.
- **Typography**: Uses 'Zen Maru Gothic' with airy letter spacing and elegant weights for a tranquil feel.
- **Scalability**: Fully responsive layout using `rem` units.

## Flow
1. **Selection**: Choose a breathing rhythm from the Zen stone menu.
2. **Practice**: Follow the expanding/contracting circle and instructions.
3. **Completion**: A final "GAME OVER - Have a wonderful day" screen with a "Home" stone to restart.