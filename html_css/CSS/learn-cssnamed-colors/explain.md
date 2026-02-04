# Code Explanation - Learn CSS Named Colors

This document provides a breakdown of how the HTML, CSS, and JavaScript files work together to build the interactive CSS color grid.

## 1. HTML (`index.html`)

The HTML file provides the skeletal structure of the application.

- **Google Fonts Integration**: We import "Work Sans" (for general UI) and "Cabin" (for technical values) directly from Google Fonts.
- **`#color-grid` Container**: A simple `div` where the color columns are dynamically injected via JavaScript.
- **Detail Modal (`#color-modal`)**: A hidden overlay that contains:
    - `modal-color-box`: A visual preview of the selected color.
    - `modal-color-name`: The name of the color.
    - `color-values`: A section to display RGB, HEX, and CMYK data.
- **Script Loading**: The `script.js` is loaded at the end of the body to ensure the DOM is ready before the script runs.

## 2. CSS (`style.css`)

The styling focuses on a horizontal "barcode" layout and professional modal presentation.

- **Variable Usage**: `:root` defines the primary and secondary fonts and basic colors for easy maintenance.
- **The Grid Layout**: 
    - `.color-grid` uses `display: flex` with `flex-direction: row`.
    - `overflow-x: auto` on the body allows the user to scroll horizontally through the vast list of colors.
- **Vertical Typography**: 
    - `.color-name` uses `writing-mode: vertical-rl` and `transform: rotate(180deg)` to orient the text vertically inside the narrow columns.
- **Interactive Effects**: 
    - Columns scale slightly on hover (`transform: scaleY(1.05)`) to provide visual feedback.
- **Modal Styling**:
    - The modal is centered using `display: flex` and sits on a dark semi-transparent overlay.
    - `.modal.hidden` uses `display: none` to toggle visibility via JavaScript.

## 3. JavaScript (`script.js`)

The JavaScript file handles the heavy lifting of color data processing and rendering.

### Color Conversion Functions
- **`nameToRgb()`**: A "trick" function that creates a temporary invisible element, sets its color to the CSS name, and uses `getComputedStyle` to retrieve the browser's standardized RGB value.
- **`rgbToHex()`**: Converts decimal RGB values to their 2-digit hexadecimal equivalents.
- **`rgbToCmyk()`**: Implements the mathematical formula to convert RGB (light-based) to CMYK (print-based) percentages.
- **`rgbToHsl()`**: Converts RGB to Hue, Saturation, and Lightness, which is essential for sorting.

### Sorting & Categorization
- **`getFamily()`**: Uses the calculated **Hue** and **Saturation** to assign each color to a family (e.g., "Blues", "Reds").
- **Custom Sort**: 
    1. It first groups colors by a predefined family order (`Whites` first, `Blacks` last).
    2. Within each family, it sorts by **Lightness** (`hsl.l`) from light to dark.

### Rendering
- **Dynamic Height**: The height of each `.color-column` is calculated using `color.name.length`, fulfilling the requirement that height depends on the name's length.
- **Accessibility Logic**: The script checks the lightness of a color; if it's above 60%, it sets the text to black; otherwise, it sets it to white for better contrast.
- **Event Listeners**: Attaches click events to each column to trigger the modal and handles modal closing via the "X" button or clicking outside the content.
