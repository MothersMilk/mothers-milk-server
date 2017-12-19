const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Required = require('./RequiredTypes');

const schema = new Schema({
    name: Required.String,
    address: Required.String,
    hours: Required.String
});

module.exports = mongoose.model('DropSite', schema);