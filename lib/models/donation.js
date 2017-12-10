const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequiredString = {
    type: String,
    required: true
};

const RequiredNumber = {
    type: Number,
    required: true
};

const schema = new Schema({
    quantity: RequiredNumber,
    eta: RequiredString,
    location: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: true 
    },
    Donor:{
        type: Schema.Types.ObjectId,
        ref: 'Donor',
        //required: true 
    }
});

module.exports = mongoose.model('Donation', schema);