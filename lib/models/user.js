const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const Required = require('./requiredTypes');


const schema = new Schema({
    email: Required.String,
    name: Required.String,
    address: String,
    hash: Required.String,
    roles: [{
        type: String,
        required: true,
        enum: ['admin', 'donor', 'staff', 'volunteer']
    }]
});

schema.statics.emailExists = function(email) {
    return this.find({ email })
        .count()
        .then(count => count > 0);
};

schema.method('selectFields', function() {
    return this.select('-hash').lean();
});

schema.method('generateHash', function (password) {
    this.hash = bcrypt.hashSync(password, 8);
});

schema.method('comparePassword', function (password) {
    return bcrypt.compareSync(password, this.hash);
});

module.exports = mongoose.model('User', schema);