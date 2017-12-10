const router = require('express').Router();
const Donor = require('../models/donor');

module.exports = router 

    .post('/', (request, response, next) => {
        new Donor(request.body).save()
            .then(donor => response.json(donor))
            .catch(next);
    })

    .get('/', (request, response, next) => {
        Donor.find()
            .then(donors => response.json(donors))
            .catch(next);
    })

    .get('/:id', (request, response, next) => {
        Donor.findById(request.params.id)
            .then(donor => {
                if(!donor) {
                    next({code: 404, error:`id ${request.params.id} does not exist`});
                }
                else {
                    return response.json(donor);
                }
            });
    })

    .put('/:id', (request, response, next) => {
        const id = request.params.id;
        if (!id) {
            next({ code: 404, error: `id ${id} does not exist`});
        }
        Donor.update({ _id: id }, request.body, (err, data) => response.send(data));
    })

    .delete('/:id', (request, response, next) => {
        return Donor.findByIdAndRemove(request.params.id)
            .then(result => {
                const isRemoved = result ? true : false;
                return isRemoved; 
            })
            .then(isRemoved => response.json({ removed: isRemoved }))
            .catch(next);
    });