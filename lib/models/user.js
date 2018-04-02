const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const Required = require('./requiredTypes');


const schema = new Schema({
    mmbId: {
        type: String,
        validate: {
            validator: v => !v || v.length === 4,
            message: 'MMB# must be 4 digits'
        }
    },
    email: String,
    name: Required.String,
    address: String,
    hash: Required.String,
    roles: [{
        type: String,
        enum: ['admin', 'donor', 'staff', 'volunteer']
    }],
    myDropSite: {
        type: Schema.Types.ObjectId,
        ref: 'DropSite'
    }
});

schema.statics.emailExists = function(email) {
    return this.find({ email })
        .count()
        .then(count => count > 0);
};

schema.method('generateHash', function(password) {
    this.hash = bcrypt.hashSync(password, 8);
});

schema.method('comparePassword', function(password) {
    return bcrypt.compareSync(password, this.hash);
});

schema.query.selectFields = function() {
    return this.select('-hash').lean();
};

module.exports = mongoose.model('User', schema);