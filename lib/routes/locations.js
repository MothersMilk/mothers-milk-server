const router = require('express').Router();
const DonarLocation = require('../models/location');

module.exports = router 

    .post('/', (request, response, next) => {
        new DonarLocation(request.body).save()
            .then(location => response.json(location))
            .catch(next);
    })

    .get('/', (request, response, next) => {
        DonarLocation.find()
            .then(locations => response.json(locations))
            .catch(next);
    })

    .get('/:id', (request, response, next) => {
        DonarLocation.findById(req.params.id)
            .then(location => {
                if(!location) {
                    next({code: 404, error:`id ${req.params.id} does not exist`});
                }
                else res.json(location);
            });
    })

    .delete('/:id', (request, response, next) => {
        return DonarLocation.findByIdAndRemove(request.params.id)
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
        DonarLocation.update({ _id: id }, request.body, (err, data) => response.send(data));
    })

    



    