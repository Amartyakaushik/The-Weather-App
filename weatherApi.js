const https = require("https");
const fs = require('fs');
const appId = "5ebf6fbc947413821be4c39cc5127813";


const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017'; 

const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

connectToMongoDB();





async function showWeather(cityName, res) {
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&APPID=" + appId + "&units=metric";
    https.get(url, async function(response_data) {
        if (response_data.statusCode !== 200) {
        } else {
            response_data.on("data", async function(data) {
                const weatherData = JSON.parse(data);
                console.log(weatherData); 

                const db = client.db('weatherDB'); 
                const collection = db.collection('weatherData'); 
                try {
                    await collection.insertOne(weatherData);
                    console.log('Weather data inserted into MongoDB');
                } catch (err) {
                    console.error('Error inserting weather data into MongoDB:', err);
                }

                
                const temp = Math.round(weatherData.main.temp.toFixed(2));
            });
        }
    });
}


process.on('SIGINT', () => {
    client.close();
    console.log('MongoDB connection closed');
    process.exit();
});




function cityDatas() {
    var cityJsonFile = fs.readFileSync('worldCity.json');
    var cityData = JSON.parse(cityJsonFile);
    //console.log(cityData)
    console.log(cityData.length);

    for (let i = 0; i < cityData.length; i++) {
        var CityName = cityData[i].name;
        //console.log(CityName);

    }
}

cityDatas();


function showWeather(cityName, res) {
    //console.log(cityName);
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&APPID=" + appId + "&units=metric";
    https.get(url, function(response_data) {
        console.log(response_data.statusCode);

        if (response_data.statusCode !== 200) {
            console.log("Something Went Wrong");
            res.send("<p style='text-align: center; padding-top: 4%; color: blue; font-size: 80px;'>" + response_data.statusCode + "</p><h1 style='text-align: center; padding-top: 4%;'>Something went wrong.</h1>")
        } else {
            response_data.on("data", function(data) {
                //console.log(data);  
                const WeatherData = JSON.parse(data);
                console.log(WeatherData); 

                const temp = Math.round((WeatherData.main.temp).toFixed(2));
                const city = WeatherData.name;
                const weaterDescription = WeatherData.weather[0].description;
                const iconCode = WeatherData.weather[0].icon;
                const WeatherStatus = WeatherData.weather[0].main;
                const countryCode = WeatherData.sys.country;
                const windSpeed = WeatherData.wind.speed;
                const visibility = Number((WeatherData.visibility) / 1000);
                const humidity = WeatherData.main.humidity;

                //console.log(visibility);
                // console.log(windSpeed);
                // console.log(weaterDescription);
                // console.log(city);
                // console.log(temp);
                // console.log(iconCode);
                // console.log("Status " + WeatherStatus);
                // console.log("Country Code " + countryCode)


                //res.send(`Temperature of ${city} is ${temp}°F & ${celsius}°C <br> <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png">`);
                res.render('index.ejs', {
                    temp: temp,
                    city: city,
                    iconCode: iconCode,
                    WeatherStatus: WeatherStatus,
                    countryCode: countryCode,
                    cityData: cityDatas.cityData,
                    windSpeed: windSpeed,
                    visibility: visibility,
                    humidity: humidity

                    // WeatherData: WeatherData
                });
            });
        }
    });
}

module.exports = { showWeather, cityDatas };