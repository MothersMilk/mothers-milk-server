const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: RequiredString,
    address: RequiredString,
    hours: RequiredString
});

module.exports = mongoose.model('DropSite', schema);