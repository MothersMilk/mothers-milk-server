const router = require('express').Router();
const DonorDropSite = require('../models/dropSite');

module.exports = router 

    .post('/', (request, response, next) => {
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

    .delete('/:id', (request, response, next) => {
        return DonorDropSite.findByIdAndRemove(request.params.id)
            .then(result => {
                const isRemoved = result ? true : false;
                    return isRemoved; 
            })
            .then(isRemoved => response.json({ removed: isRemoved }))
            .catch(next);
    })

    .put('/:id', (request, response, next) => {
        const id = request.params.id;
        if (!id) {
            next({ code: 404, error: `id ${id} does not exist`});
        }
        DonorDropSite.update({ _id: id }, request.body, (err, data) => response.send(data));
    });

    



    