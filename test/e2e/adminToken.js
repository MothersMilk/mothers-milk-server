const User = require('../../lib/models/user');
const tokenService = require('../../lib/utils/tokenService');


const user = new User({
    email: 'superadmin@admin.com',
    name: 'super admin',
    roles: ['admin']
});
user.generateHash('password');

const adminToken = () => {
    console.log('about to save admin..');
    return user.save()
        .then(user => {
            return tokenService.sign(user);
        })
        .then(token => {
            console.log('saved admin!');
            return token;
        });
};

module.exports = adminToken;