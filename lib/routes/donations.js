const router = require('express').Router();
const Donation = require('../models/donation');
const ensureRole = require('../utils/ensure-role');
const io = require('../utils/io');

module.exports = router 

    .post('/', ensureRole(['admin', 'donor', 'volunteer']), (req, res, next) => {
        // need to enforce that donor is using own user id:
        if(req.user.roles.indexOf('donor') > -1) req.body.donor = req.user.id;
        
        new Donation(req.body).save()
            .then(donation => {
                res.json(donation);
                //Socket code to broadcast change in donations
                Donation.byId(donation._id)
                    .then(donation => {
                        return io.get().emit('newDonation', donation);
                    });
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
    
    // This route doesn't make sense!
    // A put requires an id, how else do you know what donation you are updating?
    .put('/:id', ensureRole(['donor']), (req, res, next) => {
        // you already have the user id via `ensureAuth`
        
        Donation.findOneAndUpdate(
            { _id: req.params.id, donor: req.user.id }, 
            req.body, 
            { new: true }
        )
            .populate({ path: 'dropSite', select: 'name'})
            .lean()
            .then(donation => {
                if (!donation) next({code: 404, error: 'donation not found for donor'});
                else res.json(donation);
            })
            .catch(next);
    })

    // Probably should have a different top level "/me" route for these types of gets
    .get('/me', ensureRole(['donor']), (req, res, next) => {
        Donation.find({ donor: req.user.id })
            .populate({ path: 'dropSite', select: 'name'})
            .lean()
            .then(donation => {
                // this doesn't make sense for a find that returns an array
                // if (!donation) {
                //     next({code: 404, error:'invalid user id'});
                // }

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
                res.send(donation);

                //Socket code. Emits 'updatedDonation' when value of donation is changed
                // no need to refetch, in this case you have the right data shape
                try {
                    io.get().emit('updatedDonation', donation);
                }
                catch(err) {
                    console.log('socket error', err);
                }
            })
            .catch(next);
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
