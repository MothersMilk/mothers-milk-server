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

    .get('/:id', (request, response, next) => {
        Donation.findById(request.params.id)
            .then(donation => {
                if(!donation) {
                    next({code: 404, error:`id ${request.params.id} does not exist`});
                }
                else {
                    return response.json(donation);
                }
            });
    })
