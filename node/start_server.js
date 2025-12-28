# 1. mkdir dictionary
# 2. touch file.js
# 3. start npm - npm init -y
# 4. install express.js - npm i express
# 5. check package.json - add "type": "module"
# 6. see below

import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
})

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

# 7. node file.js or nodemon file.js
# stop running server: control + C
