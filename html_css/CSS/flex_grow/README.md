# Flex-Grow Image Gallery

A full-bleed, responsive image gallery that maintains image aspect ratios while eliminating whitespace at the end of flex-lines. This technique exploits the `flex-grow` property to ensure every row is perfectly filled.

## How it Works

The gallery uses a clever combination of CSS Custom Properties and the `flex-grow` property:

1.  **Calculate Aspect Ratio**: The aspect ratio (`--ar`) is derived from the image's `width` and `height` attributes.
2.  **Normalized Height**: By setting the initial width to a percentage multiplied by the aspect ratio (`calc(20% * var(--ar))`), all images in the gallery start with the same height.
3.  **Proportional Growth**: Setting `flex-grow: calc(var(--ar))` ensures that as images expand to fill the remaining space on a line, they do so at a rate that keeps their height consistent with their neighbors.

## Implementation Details

### CSS Strategy
The core logic resides in `style.css`:
```css
img {
  --ar: attr(width type(<number>)) / attr(height type(<number>));
  width: calc(20% * var(--ar));
  flex-grow: calc(var(--ar));
  max-width: min(100%, calc(50% * var(--ar))); /* Prevents excessive stretching */
}
```

### Browser Compatibility
While the original concept relies on the experimental `attr(type(<number>))` CSS function (currently Chromium-only), this project includes a small JavaScript fallback in `index.html` to manually set the `--ar` variable for immediate cross-browser support:

```javascript
document.querySelectorAll('img').forEach(img => {
  const ar = img.getAttribute('width') / img.getAttribute('height');
  img.style.setProperty('--ar', ar);
});
```

## Credits
Based on the technique described in `flex_grow.txt` (originally by Sat, Sep 13, 2025). 
Images provided by [Lorem Picsum](https://picsum.photos/).
