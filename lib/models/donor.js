const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    firstName: RequiredString,
    lastName: RequiredString,
    age: Number,
    email: RequiredString,
    password: RequiredString
});

module.exports = mongoose.model('Donor', schema);