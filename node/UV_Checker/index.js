const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Function to get coordinates using OpenCage API
async function getCoordinates(city) {
    try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${process.env.OPENCAGE_API_KEY}`);
        if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry;
            return { lat, lng };
        } else {
            throw new Error('City not found');
        }
    } catch (error) {
        throw new Error('Error fetching coordinates');
    }
}

// Define the root route
app.get('/', async (req, res) => {
    let location = req.query.location || 'New York'; // default location

    try {
        const { lat, lng } = await getCoordinates(location);

        const response = await axios.get(`https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lng}`, {
            headers: {
                'x-access-token': process.env.OPENUV_API_KEY
            }
        });

        const uvData = {
            location: location,
            uvIndex: response.data.result.uv
        };
        res.render('index', { uvData: uvData, error: null });
    } catch (error) {
        res.render('index', { uvData: null, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
