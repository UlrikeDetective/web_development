// Get canvas
const canvas = document.getElementById("brushCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
function resizeCanvas() {
	const wrapper = canvas.parentElement;
	canvas.width = wrapper.clientWidth;
	canvas.height = wrapper.clientHeight;

	// Create black and white gradient background
	createBlackAndWhiteCanvas();
}

// Create black and white pattern
function createBlackAndWhiteCanvas() {
	const w = canvas.width;
	const h = canvas.height;

	// Fill with white
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, w, h);

	// Draw black grid lines
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 2;

	// Vertical lines
	for (let x = 0; x < w; x += 40) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, h);
		ctx.stroke();
	}

	// Horizontal lines
	for (let y = 0; y < h; y += 40) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(w, y);
		ctx.stroke();
	}

	// Draw some black circles
	ctx.fillStyle = "#000000";
	for (let i = 0; i < 20; i++) {
		const x = Math.random() * w;
		const y = Math.random() * h;
		ctx.beginPath();
		ctx.arc(x, y, 5, 0, Math.PI * 2);
		ctx.fill();
	}

	// Draw some white circles on black intersections
	ctx.fillStyle = "#ffffff";
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;
	for (let x = 40; x < w; x += 40) {
		for (let y = 40; y < h; y += 40) {
			ctx.beginPath();
			ctx.arc(x, y, 8, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
		}
	}
}

// Call on load and when window resizes
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

// Colors (vibrant to paint on black & white)
const colors = [
	"#f72585", // hot pink
	"#4361ee", // bright blue
	"#4cc9f0", // light blue
	"#f9c74f", // yellow
	"#f9844a", // orange
	"#7209b7", // purple
	"#ef476f", // red
	"#06d6a0", // mint green
	"#aba5b9ff", // hot pink
];

// State
let isDrawing = false;
let currentColor = colors[0];
let brushSize = 10;
let dotCount = 0;
let lastX = 0;
let lastY = 0;

// Create color palette
const colorPalette = document.getElementById("colorPalette");
colors.forEach((color, index) => {
	const btn = document.createElement("div");
	btn.className = "color-btn" + (index === 0 ? " active" : "");
	btn.style.backgroundColor = color;
	btn.setAttribute("data-color", color);

	btn.addEventListener("click", () => {
		document
			.querySelectorAll(".color-btn")
			.forEach((b) => b.classList.remove("active"));
		btn.classList.add("active");
		currentColor = color;
	});

	colorPalette.appendChild(btn);
});

// Brush size slider
const sizeSlider = document.getElementById("sizeSlider");
const sizeDisplay = document.getElementById("sizeDisplay");

sizeSlider.addEventListener("input", (e) => {
	brushSize = parseInt(e.target.value);
	sizeDisplay.textContent = brushSize + "px";
});

// Drawing functions
function startDrawing(e) {
	e.preventDefault();
	isDrawing = true;

	const pos = getCoordinates(e);
	if (pos) {
		lastX = pos.x;
		lastY = pos.y;
		drawDot(pos.x, pos.y);
	}
}

function draw(e) {
	e.preventDefault();
	if (!isDrawing) return;

	const pos = getCoordinates(e);
	if (pos) {
		// Draw at current position
		drawDot(pos.x, pos.y);

		// Draw line between points for smoothness
		drawLine(lastX, lastY, pos.x, pos.y);

		lastX = pos.x;
		lastY = pos.y;
	}
}

function stopDrawing() {
	isDrawing = false;
}

function getCoordinates(e) {
	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	let clientX, clientY;

	if (e.touches) {
		if (e.touches.length === 0) return null;
		clientX = e.touches[0].clientX;
		clientY = e.touches[0].clientY;
	} else {
		clientX = e.clientX;
		clientY = e.clientY;
	}

	// Check if within canvas
	if (
		clientX < rect.left ||
		clientX > rect.right ||
		clientY < rect.top ||
		clientY > rect.bottom
	) {
		return null;
	}

	return {
		x: (clientX - rect.left) * scaleX,
		y: (clientY - rect.top) * scaleY
	};
}

function drawDot(x, y) {
	ctx.beginPath();
	ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
	ctx.fillStyle = currentColor;
	ctx.shadowColor = currentColor;
	ctx.shadowBlur = 20;
	ctx.fill();
	ctx.shadowBlur = 0;

	dotCount++;
	updateCounter();
}

function drawLine(x1, y1, x2, y2) {
	const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

	if (distance > brushSize / 2) {
		const steps = Math.ceil(distance / (brushSize / 3));
		for (let i = 1; i < steps; i++) {
			const t = i / steps;
			const x = x1 + (x2 - x1) * t;
			const y = y1 + (y2 - y1) * t;

			ctx.beginPath();
			ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
			ctx.fillStyle = currentColor;
			ctx.shadowColor = currentColor;
			ctx.shadowBlur = 20;
			ctx.fill();
			ctx.shadowBlur = 0;

			dotCount++;
		}
	}
}

function updateCounter() {
	document.getElementById("dotCounter").textContent =
		dotCount + " colored dot" + (dotCount !== 1 ? "s" : "");
}

// Clear canvas - reset to black and white
document.getElementById("clearBtn").addEventListener("click", () => {
	createBlackAndWhiteCanvas();
	dotCount = 0;
	updateCounter();
});

// Mouse events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

// Touch events
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchcancel", stopDrawing);

// Prevent scrolling on touch
document.body.addEventListener(
	"touchstart",
	(e) => {
		if (e.target === canvas) {
			e.preventDefault();
		}
	},
	{ passive: false }
);

document.body.addEventListener(
	"touchmove",
	(e) => {
		if (e.target === canvas) {
			e.preventDefault();
		}
	},
	{ passive: false }
);