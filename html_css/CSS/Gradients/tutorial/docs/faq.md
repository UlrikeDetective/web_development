# Frequently Asked Questions (FAQ)

Here are answers to common questions about using CSS Gradients.

### Q: Why is my gradient not showing up?
**A:** Check your syntax. Ensure you are using the `background` or `background-image` property. Also, make sure your HTML element has a defined `height` and `width`; otherwise, it might be invisible!

### Q: Can I use color names instead of Hex codes?
**A:** Yes! You can use standard names like `red`, `blue`, `papayawhip`, or `mintcream`. However, Hex codes (like `#ff5733`) allow for precise color matching.

### Q: How do I make a gradient transparent?
**A:** Use RGBA values. The last number in `rgba(0, 0, 0, 0.5)` controls opacity (0 is transparent, 1 is solid).
Example: `linear-gradient(to bottom, red, rgba(255, 0, 0, 0))` fades from red to invisible.

### Q: Do these gradients work on mobile phones?
**A:** Yes, modern CSS gradients are supported by all major mobile browsers (Chrome, Safari, Firefox on Android/iOS).

### Q: Can I animate a gradient?
**A:** Yes! By animating the `background-position` property and making the `background-size` larger than the element, you can create smooth, moving gradient effects.
