const router = require('express').Router();
const DonorDropSite = require('../models/dropSite');
const ensureRole = require('../../lib/utils/ensure-role');

module.exports = router 

    .post('/', ensureRole(['admin']), (req, res, next) => {
        new DonorDropSite(req.body).save()
            .then(dropSite => res.json(dropSite))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        DonorDropSite.find()
            .then(dropSites => res.json(dropSites))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        DonorDropSite.findById(req.params.id)
            .then(dropSite => {
                if(!dropSite) {
                    next({code: 404, error:`id ${req.params.id} does not exist`});
                }
                else {
                    return res.json(dropSite);
                }
            });
    })

    .delete('/:id', ensureRole(['admin']), (req, res, next) => {
        return DonorDropSite.findByIdAndRemove(req.params.id)
            .then(result => {
                const isRemoved = result ? true : false;
                return isRemoved; 
            })
            .then(isRemoved => res.json({ removed: isRemoved }))
            .catch(next);
    })

    .put('/:id', ensureRole(['admin']), (req, res, next) => {
        const id = req.params.id;
        if (!id) {
            next({ code: 404, error: `id ${id} does not exist`});
        }
        DonorDropSite.findByIdAndUpdate({ _id: id }, req.body, { new: true , runValidators: true })
            .then(updatedDropSite => res.send(updatedDropSite));
    });

    



    