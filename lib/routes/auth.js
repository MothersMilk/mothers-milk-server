const router = require('express').Router();
const User = require('../models/user');
const tokenService = require('../utils/tokenService');
const ensureAuth = require('../utils/ensureAuth')();


module.exports = router

    .post('/signin', (req, res, next) => {
        const { email, password } = req.body;
        delete req.body.password;
        if(!password) throw { code: 400, error: 'password is required' }; 
        User.findOne({ email })
            .then(user => {
                if(!user || !user.comparePassword(password)) {
                    throw { code: 401, error: 'authentication failed' };
                }
                return tokenService.sign(user);
            })
            .then(token => res.json({ token }))
            .catch(next);
    })

    .get('/verify', ensureAuth, (req, res) => {
        res.json(req.user.id);
    });