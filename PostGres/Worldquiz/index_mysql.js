import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise"; // Using mysql2 with promises for async/await support

const db = mysql.createPool({
  host: "localhost",
  user: "your_name",
  database: "world",
  password: "your_pw",
  port: 3306, // Default MySQL port
});

const app = express();
const port = 3000;

let quiz = [];
let totalCorrect = 0;
let currentQuestion = {};

// Fetch data from MySQL
async function fetchData() {
  try {
    const [rows] = await db.query("SELECT * FROM capitals");
    quiz = rows;
  } catch (err) {
    console.error("Error executing query", err);
  }
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

// Start the server and fetch the quiz data
app.listen(port, async () => {
  await fetchData();
  console.log(`Server is running at http://localhost:${port}`);
});
