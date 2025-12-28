import express from "express";
import bodyParser from "body-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
let bandName = "";

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files from the 'public' directory
app.use(express.static(join(__dirname, "public")));

// Middleware to generate the band name
function bandNameGenerator(req, res, next) {
  if (req.method === "POST") {
    console.log(req.body);
    bandName = `${req.body.street} ${req.body.pet}`;
  }
  next();
}

app.use(bandNameGenerator);

// Route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

// Route to handle the form submission
app.post("/submit", (req, res) => {
  res.send(`<h1>Your band name is:</h1><h2>${bandName}✌️</h2>`);
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
