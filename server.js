'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const superagent = require('superagent');
const PORT = process.env.PORT || 3001;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
app.use(cors());
// let parser = new DOMParser();

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
    // console.log(request);
    getWeather(request, response);
    // searchForecast(request.query.data);
    // console.log("abc");
  }
  catch(error){
    console.error(error); // will turn the error message red if the environment supports it

    response.status(500).send('so sorry, something is not working on our end');
  }
})

app.get('/events', (request, response) => {
  try{
    // console.log(request);
    // console.log("abc");
    getEvent(request, response);
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

function getWeather(request, response){
  // console.log("This is the weather route ", request.query.data);
  let latitude = request.query.data.latitude;
  let longitude = request.query.data.longitude;
  // console.log(latitude);
  // console.log(longitude);

  let url =  `https://api.darksky.net/forecast/${process.env.DARKSKYKEY}/${latitude},${longitude}`;

  superagent.get(url)
  .then(results => {
    // weather = results.body.daily.data;
    const weatherObject = results.body.daily.data.map(values => 
      new Weather(values.summary, values.time)
    )
    // console.log(results);
    // console.log(url);
    // console.log(weatherObject);
    response.send(weatherObject);
  })
  .catch (err =>{
    response.send(err);
  })
}

function getEvent(request, response){
  // console.log("This is the weather route ", request.query.data);
  let latitude = request.query.data.latitude;
  let longitude = request.query.data.longitude;

  let url =  `http://api.eventful.com/json/events/search?app_key=${process.env.EVENTBRITEKEY}&where=${latitude},${longitude}`;

  superagent.get(url)
  .then(results => {
    let events = JSON.parse(results.text);
    const eventObject = events.events.event.map(value => 
      new Event(value)
    )

    // console.log("abc");
    // console.log(events.events.event);
    // const eventObject = results.body.map(values => 
    //   new Event()
    // )
    // console.log(results);
    // console.log(url);
    // console.log(eventObject);
    response.send(eventObject);
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
  this.forecast = summary;
  this.time = new Date(time * 1000).toDateString();
}

function Event(value){
  // console.log("abc");
  this.link = value.url;
  // console.log("abc");
  this.name = value.title;
  this.event_date = value.start_time;
  this.summary = value.description;
}

app.get('*', (request, response) => {
  response.status(404).send('Page not found');
});

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
