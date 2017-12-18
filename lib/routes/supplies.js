const router = require('express').Router();
const Supplies = require('../models/supply');


module.exports = router
    
    .post('/', (req, res, next) => {
        // need to check for donor and if so add req.body.donor = req.user.id
        new Supplies(req.body).save()
            .then(supplies => res.json(supplies))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        // only allow donors to remove their own
        Supplies.findByIdAndRemove(req.params.id)
            .lean()
            .then(result => {
                const exists = result != null;
                res.json({ removed: exists });
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        // ditto here for donors
        Supplies.findById(req.params.id)
            .populate({ path: 'donor', select: 'name' })
            .lean()
            .then(supply => {
                if(!supply) {
                    res.statusCode = 404;
                    res.send(`id ${req.params.id} does not exist`);
                }
                else res.json(supply);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        // and here...
        Supplies.find()
            .populate({ path: 'donor', select: 'name' })
            .lean()
            .then(supply => res.json(supply))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        // and here...
        Supplies.findByIdAndUpdate(req.params.id, req.body, { new: true , runValidators: true })
            .populate({ path: 'donor', select: 'name' })
            .lean()
            .then(supply => res.send(supply))
            .catch(next);
    });