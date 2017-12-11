const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Quantity = {
    type: Number,
    min: 0
};

const suppliesSchema = new Schema({
    bags: {
        quantity: Quantity
    },
    boxes: {
        quantity: Quantity
    }
});

module.exports = mongoose.model('Supplies', suppliesSchema);