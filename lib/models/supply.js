const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequiredNumber = {
    type: Number,
    min: 0
};

const suppliesSchema = new Schema({
    bags: RequiredNumber,
    boxes: RequiredNumber,
    fulfilled: Boolean,
    donor:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    }
});

module.exports = mongoose.model('Supplies', suppliesSchema);