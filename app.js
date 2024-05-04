const express = require("express");
const https = require("https");
const bodyParser = require("body-parser")
const { stringify } = require("querystring");
const ejs = require('ejs');
const fs = require('fs');

const port = process.env.PORT || 8001

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const weatherModule = require("./weatherApi.js");
const path = __dirname;
app.use(express.static('public'));


app.get("/", function(req, res) {
    res.sendFile(path + '/index.html');
});

app.post("/", function(req, res) {
    const cityName = req.body.city;
    weatherModule.showWeather(cityName, res);
});

app.get('/city/:city', function(req, res) {
    //res.send(req.params.city);
    const cityName = req.params.city;
    weatherModule.showWeather(cityName, res);
});

app.listen(port, function() {
    console.log("Server is running at port ", port);
});