const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./utils/error-handler');
const ensureAuth = require('./utils/ensure-auth')();


const dropSites = require('./routes/dropSites');
const donations = require('./routes/donations');
const donors = require('./routes/donors');
const user = require('./routes/user');
const auth = require('./routes/auth');
const supplies = require('./routes/supplies');


app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/dropSites', dropSites);
app.use('/api/donations', donations);
app.use('/api/donors', donors);
app.use('/api/user', user);
app.use('/api/supplies', supplies);

app.use(errorHandler());

module.exports = app; 