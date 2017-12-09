const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./utils/error-handler');

const locations = require('./routes/locations');

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/locations', locations);
app.use(errorHandler());

module.exports = app; 