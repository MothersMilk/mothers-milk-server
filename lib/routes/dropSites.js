const router = require('express').Router();
const DropSite = require('../models/dropSite');
const ensureRole = require('../../lib/utils/ensure-role');


module.exports = router 

    .post('/', ensureRole(['admin']), (req, res, next) => {
        new DropSite(req.body).save()
            .then(dropSite => res.json(dropSite))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        DropSite.find()
            .lean()
            .then(dropSites => res.json(dropSites))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        DropSite.findById(req.params.id)
            .lean()
            .then(dropSite => {
                if(!dropSite) {
                    next({code: 404, error:`id ${req.params.id} does not exist`});
                }
                else {
                    return res.json(dropSite);
                }
            })
            .catch(next);
    })

    .delete('/:id', ensureRole(['admin']), (req, res, next) => {
        return DropSite.findByIdAndRemove(req.params.id)
            .lean()
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
        DropSite.findByIdAndUpdate({ _id: id }, req.body, { new: true , runValidators: true })
            .lean()
            .then(updatedDropSite => res.send(updatedDropSite))
            .catch(next);
    });

    



    