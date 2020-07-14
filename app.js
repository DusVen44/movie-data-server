//Require all parts of server
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require ('helmet');

//Assign express to the variable "app"
const app = express();

//Mount all middleware that was installed
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'dev';
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

//create function to validate API Token
app.use(function validateToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }

    next();
})

//Assign movies data to the variable "movies"
const movies = require('./movies-data-small.json');

//Create "movie" endpoint with query parameters
app.get('/movie', (req, res) => {
    //Create variables for query parameters
    const { genre, country, avg_vote } = req.query;
    //Create variable "response"
    let response = movies;

    //Filter for GENRE - Case Insensitive
    if (genre) {
        response = response.filter(movie => {
            return movie.genre.toLowerCase().includes(genre.toLowerCase());
        });
    };

    //Filter for COUNTRY - Case Insensitive
    if (country) {
        response = response.filter(movie => {
            return movie.country.toLowerCase().includes(country.toLowerCase());
        });
    };

    //Filter by AVERAGE VOTE - Number
    if (avg_vote) {
        response = response.filter(movie => {
            return Number(movie.avg_vote) >= Number(avg_vote);
        });
    };

    res.json(response);
})

//Hide Error Messages
app.use((error, req, res, next) => {
    let response;
    if (process.env.NODE_ENV === 'production') {
        response = {error: { message: 'sever error' }}
    } else {
        response = {error}
    }
    res.status(500).json(response)
});

const PORT = process.env.POT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})