import express from "express";
import bodyParser from "body-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files from the 'public' directory
app.use(express.static(join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

app.post("/check", (req, res) => {
  const password = req.body.password;
  if (password === "ILoveProgramming") {
    res.sendFile(join(__dirname, "public", "secret.html"));
  } else {
    res.sendFile(join(__dirname, "public", "index.html"));
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
