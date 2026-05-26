# Learning Path: Creating New Flowers and Seeds

This guide outlines the step-by-step workflow for adding new botanical illustrations to the Seed Catalogue using the project's "Code-Art" methodology.

## Phase 1: Designing the Geometry (The "Bones")
The foundation of every flower or seed is the SVG `<path>`.

1.  **Draw your shapes:** Use a vector tool (Figma, Inkscape, or Adobe Illustrator) to draw your flower. 
    *   **Keep paths separate:** Draw petals as one set of paths, the center as another, and seeds as individual small paths.
    *   **Simplify:** Don't worry about perfect lines; the "Roughen" filter will fix them later.
2.  **Export as SVG:** Copy the `d="..."` attribute of each path.
3.  **Order your paths:** In this project, colors cycle every 3 paths. 
    *   Path 1, 4, 7... will be the **Base Hue**.
    *   Path 2, 5, 8... will be **Accent 1**.
    *   Path 3, 6, 9... will be **Accent 2**.
    *   *Tip: Place your most important petals in the first few paths.*

## Phase 2: Building the HTML Structure
Each flower lives inside a `<article class="card">`.

1.  **Create the Card:** Add a new `<article>` tag and set a unique `--hue` value (0-360).
    ```html
    <article class="card" style="--hue: 200;"> <!-- 200 is a Blue/Cyan hue -->
    ```
2.  **Add the Header:** Include the Common and Botanical names.
3.  **Embed the SVG:** 
    *   Use a `<svg class="illustration" viewBox="0 0 480 480">`.
    *   **Crucial:** Wrap all your paths in a `<g filter="url(#roughen)">` tag. This applies the wobbly, hand-drawn texture.
    ```html
    <svg class="illustration" viewBox="0 0 480 480">
      <g filter="url(#roughen)">
        <path d="M...Your Petal Path..." />
        <path d="M...Your Center Path..." />
        <path d="M...Your Seed Path..." />
      </g>
    </svg>
    ```

## Phase 3: Applying the Seed Pattern
If you are specifically creating **Seeds**:

1.  **Create many small paths:** Seeds look best when they are numerous and slightly varied.
2.  **Distribute them:** Place them in the center of your flower SVG.
3.  **Check the Color Cycle:** Since the CSS uses `nth-of-type(3n)`, your seeds will automatically alternate between the three colors of your scheme, giving them a natural, organic variety.

## Phase 4: Verification and Tuning
1.  **Check the Contrast:** Open the browser and use the "Colour Scheme" toggle. Ensure your new flower looks good in Complementary, Analogous, and Triadic modes.
2.  **Adjust the Hue:** If the colors feel off, change the `--hue` value in your HTML. Because we use **OKLCH**, the brightness (Luminance) and intensity (Chroma) will remain consistent even if you change the Hue.
3.  **Refine the Paths:** If a shape looks too distorted, simplify the number of nodes in your SVG path; the `feTurbulence` filter works best on simpler geometry.

## Summary Checklist
- [ ] Unique `--hue` set on the `.card`.
- [ ] SVG paths wrapped in `<g filter="url(#roughen)">`.
- [ ] Paths ordered to take advantage of the 3-color cycle.
- [ ] Botanical details added to the `<footer>`.
