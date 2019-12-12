'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const superagent = require('superagent');
const PORT = process.env.PORT || 3001;
app.use(cors());

// routes
app.get('/location', (request, response) => {
  try{
    searchLatToLong(request, response);
  }
  catch(error){
    console.error(error); // will turn the error message red if the environment supports it

    response.status(500).send('so sorry, something is not working on our end');
  }
})

app.get('/weather', (request, response) => {
  try{
    getWeather(request, response);
    // searchForecast(request.query.data);
  }
  catch(error){
    console.error(error); // will turn the error message red if the environment supports it

    response.status(500).send('so sorry, something is not working on our end');
  }
})

function searchLatToLong(request, response){
  // const geoData = require('./data/geo.json');
  // const city = request.query.data;
  // console.log(city);

  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOKEY}`;
  // console.log(url);

  superagent.get(url)
    .then(results => {
      
      // console.log(results.body)
      const locationObject = new Location(request.query.data, results.body.results[0]);

      // console.log(locationObject)
      response.send(locationObject);
    
    })
    .catch (err => {
      response.send(err);
    })
}

// function searchForecast(weather){
//   const weatherData = require('./data/darksky.json');

//   const weatherObj = weatherData.daily.map((data) => {
//     this.summary = data.summary;
//     this.time = data.time;
//     let date = new Date(this.time);
//     this.time = date.toString();
//   });

//   console.log(weatherObj);

//   return weatherObj;
// }

function getWeather(request, response){
  // console.log("This is the weather route ", request.query.data);
  let latitude = request.query.data.latitude;
  let longitude = request.query.data.longitude;

  let url =  `https://api.darksky.net/forecast/${process.env.DARKSKYKEY}/${latitude},${longitude}`;

  superagent.get(url)
  .then(results => {
    // weather = results.body.daily.data;
    const weatherObject = results.body.daily.data.map(values => 
      // console.log(values.summary);
      // console.log(url);
      // console.log(data);
      new Weather(values.summary, values.time)
    )
    // console.log(results);
    // console.log(url);
    console.log(weatherObject);
    response.send(weatherObject);
  })
  .catch (err =>{
    response.send(err);
  })
}

function Location(request, geoData){
  this.search_query = request;
  this.formatted_query = geoData.formatted_address;
  this.latitude = geoData.geometry.location.lat;
  this.longitude = geoData.geometry.location.lng;
}

function Weather(summary, time){
  // console.log(weatherData);\
  // console.log(summary);
  this.summary = summary; // code breaking here
  // console.log(this.summary);
  this.time = new Date(time).toString();
  // console.log(this.time);
}

app.get('*', (request, response) => {
  response.status(404).send('Page not found');
});

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));