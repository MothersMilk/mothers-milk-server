const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: RequiredString,
    address: String,
    hours: String,
    phone: Number
});

module.exports = mongoose.model('DropSite', schema);