# Learn CSS - Named colors

A visual tool to explore all 148 CSS named colors, organized by color families and sorted by luminance.

## Project Overview

This project builds a dynamic, interactive grid of CSS named colors. Instead of a standard square grid, colors are presented as vertical columns in a single horizontal row, creating a unique "barcode" or "piano key" aesthetic where the length of each key represents the length of the color's name.

## Features

- **Smart Categorization**: Colors are automatically grouped into families (Whites, Yellows, Oranges, Reds, Purples, Blues, Cyans, Greens, Greys, Blacks) using HSL (Hue, Saturation, Lightness) analysis.
- **Luminance Sorting**: Within each family, colors are sorted from lightest to darkest.
- **Dynamic Proportions**: The height of each color column is proportional to the number of characters in its name.
- **Interactive Details**: Clicking any color column opens a modal window in the center of the page.
- **Color Conversions**: The detail modal displays real-time conversions for:
    - **RGB** (Red, Green, Blue)
    - **HEX** (Hexadecimal)
    - **CMYK** (Cyan, Magenta, Yellow, Key/Black)
- **Accessibility**: Text color within columns (black or white) is automatically determined based on the background color's lightness to ensure legibility.

## Technical Implementation

- **Typography**: 
    - **Work Sans**: Used for the primary UI and color names.
    - **Cabin**: Used for the technical color values in the modal.
- **Styling**: 
    - Layout built using CSS Flexbox for the horizontal scrolling grid.
    - Responsive units used throughout: `rem` for font sizes and `em` for padding/margins.
    - Vertical text rendering using `writing-mode: vertical-rl`.
- **Logic**:
    - Pure JavaScript implementation for color processing.
    - Dynamic RGB-to-HSL and RGB-to-CMYK conversion algorithms.
    - DOM-based color sampling to accurately retrieve browser-standard RGB values for named colors.

## Usage

Simply open `index.html` in a modern web browser. Scroll horizontally to explore the color families, and click any strip to see its specific values.
