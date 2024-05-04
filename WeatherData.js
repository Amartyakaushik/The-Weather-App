const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
    city: String,
    temperature: Number,
    weatherDescription: String,
});

const WeatherData = mongoose.model('WeatherData', weatherDataSchema);

module.exports = WeatherData;
