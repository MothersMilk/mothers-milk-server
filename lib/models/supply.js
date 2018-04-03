const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Required = require('./requiredTypes');


const suppliesSchema = new Schema({
    date: Date,
    bags: Required.Number,
    boxes: Required.Number,
    fulfilled: Boolean,
    donor:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    mmbId: String,
    status: {
        type: String,
        enum: ['Requested', 'Shipped']
    }

});

module.exports = mongoose.model('Supplies', suppliesSchema);