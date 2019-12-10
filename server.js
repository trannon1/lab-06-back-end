'use strict'

const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT;

app.use(express.static('./public'));

// app.get('/', (request, response)=>{
//     response.send('Hello from the back side');
// })

// app.get('/anime', (request, response) => {
//     response.send('I like anime');
// })

app.get('*', (request, response) =>{
    response.status(404).send("Page not found");
})

app.listen(PORT, ()=>{
    console.log(`listening on ${PORT}`);
})