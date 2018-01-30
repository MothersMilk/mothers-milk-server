const User = require('../../lib/models/user');
const tokenService = require('../../lib/utils/tokenService');


const user = new User({
    email: 'superadmin@admin.com',
    name: 'super admin',
    roles: ['admin']
});
user.generateHash('password');

const adminToken = () => {
    return user.save()
        .then(user => {
            return tokenService.sign(user);
        })
        .then(token => {
            return token;
        });
};

module.exports = adminToken;