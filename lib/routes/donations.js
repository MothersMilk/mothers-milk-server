const router = require('express').Router();
const Donation = require('../models/donation');
const ensureRole = require('../utils/ensure-role');
const tokenService = require('../utils/token-service');

module.exports = router 

    .post('/', ensureRole(['admin','donor']), (req, response, next) => {
        new Donation(req.body).save()
            .then(donation => response.json(donation))
            .catch(next);
    })

    .get('/', ensureRole(['admin','staff']), (req, response, next) => {
        Donation.find()
            .then(donations => response.json(donations))
            .catch(next);
    })

    .get('/:id', ensureRole(['admin','staff']), (req, response, next) => {
        Donation.findById(req.params.id)
            .then(donation => {
                if(!donation) {
                    next({code: 404, error:`id ${req.params.id} does not exist`});
                }
                else {
                    return response.json(donation);
                }
            });
    })

    .get('/donor/me', ensureRole(['donor']), (req, response, next) => {
        const myToken = req.get('Authorization');
        return tokenService.verify(myToken)
            .then(( body ) => {
                return Donation.find({ donor: body.id }); 
            })  
            .then(donation => {
                if (!donation) {
                    next({code: 404, error:'invalid user id'});
                }
                else {
                    return response.json(donation);
                }
            });
    })

    .get('/donor/:id', ensureRole(['admin','staff']), (req, response, next) => {
        
        Donation.find({ donor: req.params.id })
            .then(donation => {
                if (!donation) {
                    next({code: 404, error:`id ${req.params.id} does not exist`});
                }
                else {
                    return response.json(donation);
                }
            });
    })


    .put('/:id', ensureRole(['admin','donor']), (req, response, next) => {
        const id = req.params.id;
        if (!id) {
            next({ code: 404, error: `id ${id} does not exist`});
        }
        Donation.findByIdAndUpdate({ _id: id }, req.body, { new: true , runValidators: true })
            .then(updatedDonation => response.send(updatedDonation));
    })

    .delete('/:id', ensureRole(['admin','donor']), (req, response, next) => {
        return Donation.findByIdAndRemove(req.params.id)
            .then(result => {
                const isRemoved = result ? true : false;
                return isRemoved; 
            })
            .then(isRemoved => response.json({ removed: isRemoved }))
            .catch(next);
    });
