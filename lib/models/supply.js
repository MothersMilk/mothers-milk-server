const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Required = require('./RequiredTypes');

const suppliesSchema = new Schema({
    bags: Required.Number,
    boxes: Required.Number,
    fulfilled: Boolean,
    donor:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    }
});

module.exports = mongoose.model('Supplies', suppliesSchema);