const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Required = require('./RequiredTypes');

const schema = new Schema({
    quantity: Required.Number,
    quantityReceived: {
        type: Number,
        // enforce positive
        min: 0
    },
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

schema.statics('byId', function getDonationById(id) {
    return this.findById(id)
        .populate({ path: 'donor', select: 'name' })
        .populate({ path: 'dropSite', select: 'name' })
        .lean();
});

module.exports = mongoose.model('Donation', schema);