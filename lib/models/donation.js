const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequiredString = {
    type: String,
    required: true
};

const RequiredNumber = {
    type: String,
    required: true
};

const schema = new Schema({
    quantity: RequiredNumber,
    location: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: true 
    },
    eta: RequiredString
})

module.exports = mongoose.model('Donation', schema);