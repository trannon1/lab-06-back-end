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

// app.get('/weather', (request, response) => {
//   console.log('I am the weather route ', request.query.data);
//   let latitude = request.query.data.latitude;
//   let longitude = request.query.data.longitude;

//   const url = `https://api.darksky.net/forecast/${DARKSKYKEY}/${latitude},${longitude}`

//   superagent.get(url)
//   .then(results => {
//     response.send(results.body);
//   });
// })

function searchLatToLong(request, response){
  // const geoData = require('./data/geo.json');
  // const city = request.query.data;
  // console.log(city);

  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOKEY}`;
  console.log(url);

  superagent.get(url)
    .then(results => {
      
      // console.log(results.body)
      const locationObject = new Location(request.query.data, results.body.results[0]);

      // console.log(locationObject)
      response.send(locationObject);
    
    });
}

// function searchForecast(weather){
//   const geoData = require('./data/darksky.json');

//   const weatherObj = new Weather(weather, geoData);

//   return weatherObj;
// }

function Location(request, geoData){
  this.search_query = request;
  this.formatted_query = geoData.formatted_address;
  this.latitude = geoData.geometry.location.lat;
  this.longitude = geoData.geometry.location.lng;
}

// function Weather(weather, geoDataResults){
//   this.search_query = weather;
//   this.latitude = geoDataResults.latitude;
//   this.longitude = geoDataResults.longitude;
//   this.summary = geoDataResults.currently.summary;
//   this.time = geoDataResults.currently.time;
//   let date = new Date(this.time);
//   this.time = date.toString();
// }

app.get('*', (request, response) => {
  response.status(404).send('Page not found');
});

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));