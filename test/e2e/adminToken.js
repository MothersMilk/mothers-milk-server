const User = require('../../lib/models/user');
const tokenService = require('../../lib/utils/token-service');


const user = new User({
    email: 'teststaff@test.com',
    name: 'Test staff',
    roles: ['admin']
});
user.generateHash('password');

const adminToken = () => {
    return user.save()
        .then(user => {
            return tokenService.sign(user);
        })
        .then(token => token );
};

module.exports = adminToken;