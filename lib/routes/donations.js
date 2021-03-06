const router = require('express').Router();
const Donation = require('../models/donation');
const User = require('../models/user');
const ensureRole = require('../utils/ensureRole');
const io = require('../io');


module.exports = router 

    .post('/', (req, res, next) => {
        if(req.user.roles.indexOf('donor') > -1) req.body.donor = req.user.id;
        req.body.status = 'Awaiting Pickup';
        req.body.date = new Date();
        req.body.notified = false;
        req.body.mmbId;
        User.findOne({ _id: req.user.id })
            .then(user => {
                req.body.mmbId = (req.body.mmbId) ? req.body.mmbId : user.mmbId;
            })
            .then(() => new Donation(req.body).save())
            .then(donation => {
                res.json(donation);
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

    .get('/me', ensureRole(['donor', 'volunteer']), (req, res, next) => {
        Donation.find({ donor: req.user.id })
            .populate({ path: 'dropSite', select: 'name'})
            .lean()
            .then(donation => {
                res.json(donation);
            })
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

    .put('/me/:id', ensureRole(['donor', 'volunteer']), (req, res, next) => {
        Donation.findOne({ _id: req.params.id })
            .then(donation => {
                if (donation.status !== 'Awaiting Pickup') throw { code: 403, error: 'cannot edit processed donation' };
            })
            .then(() => Donation.findOneAndUpdate(
                { _id: req.params.id, donor: req.user.id },
                req.body,
                { new: true })
                .populate({ path: 'dropSite', select: 'name' })
                .lean())
            .then(donation => {
                if (!donation) next({ code: 404, error: 'donation not found'});
                else {
                    res.json(donation);
                    Donation.byId(donation._id)
                        .then(donation => {
                            return io.get().emit('updateMyDonation', donation);
                        });
                }
            })
            .catch(next);
    })
    
    .put('/:id', ensureRole(['admin','staff','volunteer']), (req, res, next) => {
        const id = req.params.id;
        if (!id) {
            next({ code: 404, error: `id ${id} does not exist`});
        }
        Donation.findByIdAndUpdate({ _id: id }, req.body, { new: true , runValidators: true })
            .populate({ path: 'donor', select: 'name' })
            .populate({ path: 'dropSite', select: 'name'})
            .lean()
            .then(donation => {
                res.json(donation);
                try {
                    io.get().emit('updatedDonation', donation);
                }
                catch(err) {
                    console.log('socket error', err);
                }
                
            });
    })

    .delete('/me/:id', ensureRole(['donor', 'volunteer']), (req, res, next) => {
        Donation.findOne({ _id: req.params.id })
            .then(donation => {
                if (donation.status !== 'Awaiting Pickup') throw { code: 403, error: 'cannot remove processed donation' };
            })
            .then(() => Donation.findOneAndRemove({
                _id: req.params.id,
                donor: req.user.id 
            }) )
            .then(() => {
                res.json({ removed: true });
                return io.get().emit('removeMyDonation', req.params.id);
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