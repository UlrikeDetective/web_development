const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  try {
    // Get search query from request (e.g., ?s=margarita)
    const searchQuery = req.query.s || 'random'; // Default to 'random' if no query is provided

    // Fetch cocktail based on query
    const apiUrl = searchQuery === 'random'
      ? 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
      : `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchQuery}`;

    const response = await axios.get(apiUrl);

    // Check if the response has the expected structure
    if (!response.data || !response.data.drinks || response.data.drinks.length === 0) {
      throw new Error('No data found');
    }

    // Extract the cocktail data
    const cocktail = response.data.drinks[0];

    // Render the 'index.ejs' template with the cocktail data
    res.render('index', { cocktail });
  } catch (error) {
    // Log detailed error information
    console.error('Error fetching data from API:', error.message);
    console.error('Error details:', error.response ? error.response.data : error.message);

    // Send a user-friendly error message
    res.send('Error retrieving data from API.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
