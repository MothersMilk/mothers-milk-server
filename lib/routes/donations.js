const router = require('express').Router();
const Donation = require('../models/donation');
const ensureRole = require('../utils/ensure-role');

module.exports = router 

    .post('/', ensureRole(['admin','donor']), (request, response, next) => {
        new Donation(request.body).save()
            .then(donation => response.json(donation))
            .catch(next);
    })

    .get('/', ensureRole(['admin','staff']), (request, response, next) => {
        Donation.find()
            .then(donations => response.json(donations))
            .catch(next);
    })

    .get('/:id', ensureRole(['admin','staff']), (request, response, next) => {
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

    .get('/donor/me', ensureRole(['donor']), (request, response, next) => {
        const { id } = request.user;
        Donation.find({ donor: id })
            .then(donation => {
                if (!donation) {
                    next({code: 404, error:'invalid user id'});
                }
                else {
                    return response.json(donation);
                }
            });
    })

    .get('/donor/:id', ensureRole(['admin','staff']), (request, response, next) => {
        
        Donation.find({ donor: request.params.id })
            .then(donation => {
                if (!donation) {
                    next({code: 404, error:`id ${request.params.id} does not exist`});
                }
                else {
                    return response.json(donation);
                }
            });
    })


    .put('/:id', ensureRole(['admin','donor']), (request, response, next) => {
        const id = request.params.id;
        if (!id) {
            next({ code: 404, error: `id ${id} does not exist`});
        }
        Donation.findByIdAndUpdate({ _id: id }, request.body, { new: true , runValidators: true })
            .then(updatedDonation => response.send(updatedDonation));
    })

    .delete('/:id', ensureRole(['admin','donor']), (request, response, next) => {
        return Donation.findByIdAndRemove(request.params.id)
            .then(result => {
                const isRemoved = result ? true : false;
                return isRemoved; 
            })
            .then(isRemoved => response.json({ removed: isRemoved }))
            .catch(next);
    });
