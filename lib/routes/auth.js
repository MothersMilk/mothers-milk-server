const router = require('express').Router();
const Staff = require('../models/staff');
const tokenService = require('../utils/token-service');
const ensureAuth = require('../utils/ensure-auth')();

module.exports = router
    .post('/signup', (req, res, next) => {
        const { email, password } = req.body;
        delete req.body.password;

        if(!password) throw { code: 400, error: 'password is required'};

        Staff.
    })