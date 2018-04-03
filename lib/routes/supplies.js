const router = require('express').Router();
const Supplies = require('../models/supply');
const User = require('../models/user');
const ensureRole = require('../../lib/utils/ensureRole');


module.exports = router

    .post('/', (req, res, next) => {
        req.body.status = 'Requested';
        req.body.date = new Date();
        User.findOne({ _id: req.user.id })
            .then(user => {
                req.body.mmbId = (req.body.mmbId) ? req.body.mmbId : user.mmbId;
            })
            .then(() => new Supplies(req.body).save())
            .then(supplies => res.json(supplies))
            .catch(next);
    })

    .get('/',ensureRole(['admin','volunteer']), (req, res, next) => {
        Supplies.find()
            .populate({ path: 'donor', select: 'name' })
            .lean()
            .then(supply => res.json(supply))
            .catch(next);
    })

    .get('/me', ensureRole(['donor']), (req, res, next) => {
        Supplies.find({ donor: req.user.id })
            .lean()
            .then(supplyRequests => {
                res.json(supplyRequests);
            })
            .catch(next);
    })

    .get('/:id',ensureRole(['admin', 'volunteer']), (req, res, next) => {
        Supplies.findById(req.params.id)
            .populate({ path: 'donor', select: 'name' })
            .lean()
            .then(supply => {
                if(!supply) {
                    res.statusCode = 404;
                    res.json(`id ${req.params.id} does not exist`);
                }
                else res.json(supply);
            })
            .catch(next);
    })

    .put('/me/:id', ensureRole(['donor']), (req, res, next) => {
        Supplies.findOneAndUpdate(
            { _id: req.params.id, donor: req.user.id },
            req.body,
            { new: true }
        )
            .lean()
            .then(supplyRequest => {
                if (!supplyRequest) next({ code: 404, error: 'supply request not found'});
                else res.json(supplyRequest);
            })
            .catch(next);
    })

    .put('/:id', ensureRole(['admin', 'volunteer']), (req, res, next) => {
        Supplies.findByIdAndUpdate(req.params.id, req.body, { new: true , runValidators: true })
            .populate({ path: 'donor', select: 'name' })
            .lean()
            .then(supply => res.json(supply))
            .catch(next);
    })

    .delete('/me/:id', ensureRole(['donor']), (req, res, next) => {
        Supplies.findOneAndRemove({
            _id: req.params.id,
            donor: req.user.id 
        })  
            .then(() => res.json({ removed: true }))
            .catch(next);
    })

    .delete('/:id', ensureRole(['admin', 'volunteer']), (req, res, next) => {
        Supplies.findByIdAndRemove(req.params.id)
            .lean()
            .then(result => {
                const exists = result != null;
                res.json({ removed: exists });
            })
            .catch(next);
    });