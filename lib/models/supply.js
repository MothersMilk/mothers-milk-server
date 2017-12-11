const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const suppliesSchema = new Schema({
    bags: {
        type: Number,
        min: 0
    },
    boxes: {
        type: Number,
        min: 0
    },
    donorId: String
});

module.exports = mongoose.model('Supplies', suppliesSchema);