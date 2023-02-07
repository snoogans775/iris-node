const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const controller = require('./controllers/controller')
require('dotenv').config()

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// enable cors
app.use(cors());
app.options('*', cors());

// use custom auth for demo
app.use('/', (req, res, next) => {
  console.log('authorization')
  console.log('incoming headers', req.headers)
  console.log('request url: ' + req.originalUrl)

  if(req.headers.authorization === `Bearer ${process.env.TOKEN}`) {
    next()
    return
  }
  if(req.originalUrl.split('/').includes('admin')) {
    next()
    return
  }
  res.status(401).send('Unauthorized')
})

// v1 api routes
app.use('/', controller);
app.use('/admin', express.static('src/public'))

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  res.status(404).send('404 Not Found')
});

module.exports = app;