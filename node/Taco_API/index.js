const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define a route to get a random taco recipe
app.get('/', async (req, res) => {
  try {
    // Fetch a random taco recipe from the Taco API
    const response = await axios.get('http://taco-randomizer.herokuapp.com/random/?full-taco=true');
    const taco = response.data;
    // Render the index.ejs template with the taco data
    res.render('index', { taco });
  } catch (error) {
    console.error('Error fetching taco data:', error);
    // Send a 500 error response if there is an issue with the API request
    res.status(500).send('An error occurred while fetching taco data.');
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
