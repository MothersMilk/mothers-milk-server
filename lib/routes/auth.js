const router = require('express').Router();
const Staff = require('../models/staff');
const tokenService = require('../utils/token-service');
//const ensureAuth = require('../utils/ensure-auth')();

module.exports = router
    .post('/signup', (req, res, next) => {
        console.log('in sign up');
        const { email, password } = req.body;
        delete req.body.password;

        if(!password) throw { code: 400, error: 'password is required'};

        Staff.emailExists(email)
            .then(exists => {
                if(exists){
                    throw { code: 400, error: 'email already exists'};
                }
                const staff = new Staff(req.body);
                staff.generateHash(password);
                return staff.save();
            })
            .then(staff => tokenService.sign(staff))
            .then(token => res.send({ token }))
            .catch(next);
    });