const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./utils/errorHandler');
const ensureAuth = require('./utils/ensureAuth')();

const dropSites = require('./routes/dropSites');
const donations = require('./routes/donations');
const users = require('./routes/users');
const auth = require('./routes/auth');
const supplies = require('./routes/supplies');

app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/dropSites', ensureAuth, dropSites);
app.use('/api/donations', ensureAuth, donations);
app.use('/api/users', ensureAuth, users);
app.use('/api/supplies', ensureAuth, supplies);

app.use(errorHandler());

module.exports = app; 