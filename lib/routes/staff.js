const router = require('express').Router();
const Staff = require('../models/staff');


module.exports = router

    .post('/', (req, res, next) => {
        console.log('in routes/post');
        new Staff(req.body).save()
            .then(staff => res.json(staff))
            .catch(next);
    });
