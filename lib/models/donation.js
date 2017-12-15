const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequiredNumber = {
    type: Number,
    min: 0,
    required: true
};

const schema = new Schema({
    quantity: RequiredNumber,
    quantityReceived: Number,
    date: Date,
    dropSite: {
        type: Schema.Types.ObjectId,
        ref: 'DropSite',
        required: true 
    },
    donor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    lastDonation: Boolean,
    status: String,
});

schema.statics.donationCount = function(){
    let agg = [
        {$group: { _id: "$donor", donations: { $sum: 1 } }}
    ];
    console.log('AGGREGATING');
    return this.aggregate(agg);
};

module.exports = mongoose.model('Donation', schema);