const router = require('express').Router();
const DonorDropSite = require('../models/dropSite');
const ensureRole = require('../../lib/utils/ensure-role');

module.exports = router 

    .post('/', ensureRole(['admin']), (request, response, next) => {
        new DonorDropSite(request.body).save()
            .then(dropSite => response.json(dropSite))
            .catch(next);
    })

    .get('/', (request, response, next) => {
        DonorDropSite.find()
            .then(dropSites => response.json(dropSites))
            .catch(next);
    })

    .get('/:id', (request, response, next) => {
        DonorDropSite.findById(request.params.id)
            .then(dropSite => {
                if(!dropSite) {
                    next({code: 404, error:`id ${request.params.id} does not exist`});
                }
                else {
                    return response.json(dropSite);
                }
            });
    })

    .delete('/:id', ensureRole(['admin']), (request, response, next) => {
        return DonorDropSite.findByIdAndRemove(request.params.id)
            .then(result => {
                const isRemoved = result ? true : false;
                return isRemoved; 
            })
            .then(isRemoved => response.json({ removed: isRemoved }))
            .catch(next);
    })

    .put('/:id', ensureRole(['admin']), (request, response, next) => {
        const id = request.params.id;
        if (!id) {
            next({ code: 404, error: `id ${id} does not exist`});
        }
        DonorDropSite.findByIdAndUpdate({ _id: id }, request.body, { new: true , runValidators: true })
            .then(updatedDropSite => response.send(updatedDropSite));
    });

    



    