const router = require('express').Router();
const Donation = require('../models/donation');
const ensureRole = require('../utils/ensure-role');

const io = require('../utils/io');

module.exports = router 

    .post('/', ensureRole(['admin','donor','volunteer']), (req, res, next) => {
        if(req.user.roles.indexOf('donor') > -1) req.body.donor = req.user.id;
        new Donation(req.body).save()
            .then(donation => {
                res.json(donation);
                //Socket code to broadcast change in donations
                try{
                    getDonationById(donation._id)
                        .then(donation => {
                            return io.get().emit('newDonation', donation);
                        });
                }
                catch(error) {
                    console.log('error sending newDonation broadcast:', error);
                }
            })
            .catch(next);
    })
    
    .get('/', ensureRole(['admin','staff']), (req, res, next) => {
        Donation.find()
            .populate({ path: 'donor', select: 'name' })
            .populate({ path: 'dropSite', select: 'name'})
            .lean()
            .then(donations => res.json(donations))
            .catch(next);
    })
    
    .put('/:id', ensureRole(['donor']), (req, res, next) => {
        Donation.findOneAndUpdate(
            { _id: req.params.id, donor: req.user.id },
            req.body,
            { new: true }
        )
            .populate({ path: 'dropSite', select: 'name'})
            .lean()
            .then(donation => {
                if(!donation) next({code: 404, error: 'donation not found'});
                else res.json(donation);
            })
            .catch(next);
    })

    .get('/me', ensureRole(['donor']), (req, res, next) => {
        Donation.find({ donor: req.user.id })
            .populate({ path: 'dropSite', select: 'name'})
            .lean()
            .then(donation => {
                res.json(donation);
            })
            .catch(next);
    })  
    

    .delete('/me/:id', ensureRole(['donor']), (req, res, next) => {
        Donation.findOneAndRemove({
            _id: req.params.id,
            donor: req.user.id 
        })
            
            .then(() => res.json({ removed: true }))
            .catch(next);
    })

    .get('/:id', ensureRole(['admin','staff']), (req, res, next) => {
        Donation.byId(req.params.id)
            .then(donation => {
                if(!donation) {
                    next({code: 404, error:`id ${req.params.id} does not exist`});
                }
                else {
                    return res.json(donation);
                }
            });
    })

    .get('/donor/:id', ensureRole(['admin','staff']), (req, res, next) => {
        Donation.find({ donor: req.params.id })
            .populate({ path: 'donor', select: 'name' })
            .populate({ path: 'dropSite', select: 'name'})
            .lean()
            .then(donation => {
                if (!donation) {
                    next({code: 404, error:`id ${req.params.id} does not exist`});
                }
                else {
                    return res.json(donation);
                }
            });
    })

    .put('/:id', ensureRole(['admin','donor', 'volunteer']), (req, res, next) => {
        const id = req.params.id;
        if (!id) {
            next({ code: 404, error: `id ${id} does not exist`});
        }
        Donation.findByIdAndUpdate({ _id: id }, req.body, { new: true , runValidators: true })
            .populate({ path: 'donor', select: 'name' })
            .populate({ path: 'dropSite', select: 'name'})
            .lean()
            .then(donation => {

                //Socket code. Emits 'updatedDonation' when value of donation is changed
                getDonationById(donation._id)
                    .then( donation => {
                        io.get().emit('updatedDonation', donation);
                    });
                res.send(donation);
            });
    })

    .delete('/:id', ensureRole(['admin','donor']), (req, res, next) => {
        return Donation.findByIdAndRemove(req.params.id)
            .then(result => {
                const isRemoved = result ? true : false;
                return isRemoved; 
            })
            .then(isRemoved => res.json({ removed: isRemoved }))
            .catch(next);
    });

function getDonationById(id) {
    return Donation.findById(id)
        .populate({ path: 'donor', select: 'name' })
        .populate({ path: 'dropSite', select: 'name' })
        .lean();
}