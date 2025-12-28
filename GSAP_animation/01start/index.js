// use a class or ID
gsap.to(".box", { x: 100 });

// a complex CSS selector
gsap.to("section > .box", { x: 100 });

// a variable
let box = document.querySelector(".box");
gsap.to(box, { x: 100 })

// Select elements
let square = document.querySelector(".square");
let circle = document.querySelector(".circle");

// Animate both square and circle horizontally
if (square && circle) {
  gsap.to([square, circle], { x: 50 });
}

// Animate the circle to transform into a circle shape
if (circle) {
  gsap.to(".circle", { x: 300, borderRadius: "50%" });
}

gsap.to(target, {
  // this is the vars object
  // it contains properties to animate
  x: 300,
  rotation: 360,
  // and special properties
  duration: 12
});

gsap.to(".box", { 
  duration: 2,
  x: 200,
  rotation: 360,
});

// Ensure the yellow box rotates
let yellowBox = document.querySelector(".box.yellow");

if (yellowBox) {
  gsap.to(yellowBox, {
    duration: 2,
    rotation: 360,
    repeat: -1, // Infinite rotation
    ease: "linear" // Smooth linear rotation
  });
}