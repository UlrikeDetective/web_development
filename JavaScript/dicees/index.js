// index.js

// Generate random numbers for both dice
var randomNumber1 = Math.floor(Math.random() * 6) + 1;
var randomNumber2 = Math.floor(Math.random() * 6) + 1;

// Set the images according to the random numbers
document.querySelector(".img1").setAttribute("src", "images/dice" + randomNumber1 + ".png");
document.querySelector(".img2").setAttribute("src", "images/dice" + randomNumber2 + ".png");

// Determine the winner and set the result text
if (randomNumber1 > randomNumber2) {
    document.querySelector(".result").textContent = "Player 1 Wins!";
} else if (randomNumber1 < randomNumber2) {
    document.querySelector(".result").textContent = "Player 2 Wins!";
} else {
    document.querySelector(".result").textContent = "It's a Draw!";
}
