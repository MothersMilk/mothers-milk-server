const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequiredNumber = {
    type: Number,
    min: 0,
    required: true
};

const schema = new Schema({
    quantity: RequiredNumber,
    date: Date,
    dropSite: {
        type: Schema.Types.ObjectId,
        ref: 'DropSite',
        required: true 
    },
    Donor:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    }
});

module.exports = mongoose.model('Donation', schema);