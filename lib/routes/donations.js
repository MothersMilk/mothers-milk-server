const router = require('express').Router();
const Donation = require('../models/donation');

module.exports = router 

    .post('/', (request, response, next) => {
        new Donation(request.body).save()
            .then(donation => response.json(donation))
            .catch(next);
    })

    .get('/', (request, response, next) => {
        Donation.find()
            .then(donations => response.json(donations))
            .catch(next);
    })
