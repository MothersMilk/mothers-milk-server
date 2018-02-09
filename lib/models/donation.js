const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Required = require('./requiredTypes');


const schema = new Schema({
    quantity: {
        ...Required.Number,
        min: 1
    },
    quantityReceived: {
        type: Number,
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
    mmbId: String,
    lastDonation: Boolean,
    status: String,
});

schema.statics.byId = function getById(id) {
    return this.findById(id)
        .populate({ path: 'donor', select: 'name'})
        .populate({ path: 'dropSite', select: 'name'})
        .lean();
};

module.exports = mongoose.model('Donation', schema);