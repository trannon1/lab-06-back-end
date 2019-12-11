'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

// Routes
app.get('/location', (request, response) => {
  let city = request.query.data;

  let locationObj = searchLatToLong(city);

  response.send(locationObj);
  console.log(location.Obj);
});

app.get('/weather', (request, response) => {
  let weather = request.query.data;
  // let locationObj = searchLatToLong(city);
  // if ((locationObj.latitude === weatherObj.latitude) && (locationObj.longitude === weatherObj.longitude)){

  // }
  let weatherObj = searchForecast(weather);
  response.send(weatherObj);
  console.log(weather.Obj);
})

function searchLatToLong(city){
  const geoData = require('./data/geo.json');

  const geoDataResults = geoData.results[0];

  const locationObj = new Location(city, geoDataResults);

  return locationObj;
}

function searchForecast(weather){
  const geoData = require('./data/darksky.json');

  const weatherObj = new Weather(weather, geoData);

  return weatherObj;
}

function Location(city, geoDataResults){
  this.search_query = city;
  this.formatted_query = geoDataResults.formatted_address;
  this.latitude = geoDataResults.geometry.location.lat;
  this.longitude = geoDataResults.geometry.location.lng;
}

function Weather(weather, geoDataResults){
  this.search_query = weather;
  this.latitude = geoDataResults.latitude;
  this.longitude = geoDataResults.longitude;
  this.summary = geoDataResults.currently.summary;
  this.time = geoDataResults.currently.time;
  let date = new Date(this.time);
  this.time = date.toString();
}

app.get('*', (request, response) => {
  response.status(404).send('Page not found');
});

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
