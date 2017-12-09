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
    donar:{
        type: Schema.Types.ObjectId,
        ref: 'Donar',
        //required: true 
    }
})

module.exports = mongoose.model('Donation', schema);