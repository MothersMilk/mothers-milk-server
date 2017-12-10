const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./utils/error-handler');

const locations = require('./routes/locations');
const donations = require('./routes/donations');
const donors = require('./routes/donors');

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/locations', locations);
app.use('/api/donations', donations);
app.use('/api/donors', donors);

app.use(errorHandler());

module.exports = app; 