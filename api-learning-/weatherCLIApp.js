//import axios and readline
//readline is nodejs module that allows interact with user via command line

const axios = require('axios');
const readline = require('readline');

//then create interface for input and output of readline
const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})

// creating function to fetch weather data
async function getWeather(city){
    //get api key from openweather api key
    const apiKey = 'd0613f7be24508b638cb166937a448df';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try{
        const response  = await axios.get(url);
        const weather = response.data;
        console.log(`weather in ${weather.name}, ${weather.sys.country}:`);
        console.log(`Tempature: ${weather.main.temp} degree celcius`);
        console.log(`Condition: ${weather.weather[0].description}`);
        console.log(`Humidity: ${weather.main.humidity}%`);

    }
    catch(error){
        console.log("Could not etchj data from openweather api", error);
    }

}

//prompting user to enter city name
rl.question("Enter city Name to know weather", (city)=>{
    getWeather(city);
    rl.close();
;})