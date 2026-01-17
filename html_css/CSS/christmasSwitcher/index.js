// Inspiration https://pin.it/54OtjL2BT

const COLORS = ["#CD6155", "#95A5A6", "#1F618D", "#F4ECDB", "#7DCEA0"];
const TOGGLE_CIRCLE_SIZE = 30;
const ANIMATION_INTERVAL = 1000;

const toggles = document.querySelectorAll(".toggle-switch");
const circles = document.querySelectorAll(".circle");

let counter = 0;

// Store color pairs for each element
const circleColors = new Map();
const toggleBackgroundColors = new Map();
const toggleCircleColors = new Map();

const getTwoRandomColors = () => {
  const first = Math.floor(Math.random() * COLORS.length);
  let second = Math.floor(Math.random() * COLORS.length);

  while (second === first) {
    second = Math.floor(Math.random() * COLORS.length);
  }

  return [COLORS[first], COLORS[second]];
};

const getUniqueColorPairs = () => {
  const pair1 = getTwoRandomColors();
  let pair2 = getTwoRandomColors();

  // Ensure pair2 doesn't share any colors with pair1
  while (pair2.includes(pair1[0]) || pair2.includes(pair1[1])) {
    pair2 = getTwoRandomColors();
  }

  return [pair1, pair2];
};

// Initialize colors for each circle element
circles.forEach((circle) => {
  circleColors.set(circle, getTwoRandomColors());
});

toggles.forEach((toggle) => {
  const [bgColors, circleColors] = getUniqueColorPairs();
  toggleBackgroundColors.set(toggle, bgColors);
  toggleCircleColors.set(toggle.querySelector(".toggle-circle"), circleColors);
});

const animateToggles = () => {
  toggles.forEach((toggle) => {
    const toggleCircle = toggle.querySelector(".toggle-circle");
    const size = parseInt(toggle.dataset.size);
    const isLarge = toggle.classList.contains("toggle-switch-l");
    // Changing direction of L toggles to make it visually more interesting
    const shouldToggle = isLarge ? counter % 2 === 0 : counter % 2 !== 0;

    const translateX = shouldToggle ? size - TOGGLE_CIRCLE_SIZE : 0;
    const bgColors = toggleBackgroundColors.get(toggle);
    const circleColors = toggleCircleColors.get(toggleCircle);
    const bgColorIdx = shouldToggle ? 1 : 0;
    const circleColorIdx = counter % 2;

    toggle.style.backgroundColor = bgColors[bgColorIdx];
    toggleCircle.style.transform = `translateX(${translateX}px)`;
    toggleCircle.style.backgroundColor = circleColors[circleColorIdx];
  });
};

const animateCircles = () => {
  circles.forEach((circle) => {
    const colors = circleColors.get(circle);
    const colorIdx = counter % 2;
    circle.style.backgroundColor = colors[colorIdx];
  });
};

const animate = () => {
  counter++;
  animateToggles();
  animateCircles();
};

// Initial animation
animate();

// Start interval
setInterval(animate, ANIMATION_INTERVAL);