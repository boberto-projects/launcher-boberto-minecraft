const axios = require("axios");

module.exports = axios.create({
    baseURL: "http://localhost:5555",
    headers: {
        "Content-type": "application/json",
        'ApiKey': 'pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp'
    }
});