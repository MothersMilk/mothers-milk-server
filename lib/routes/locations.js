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

    .delete('/:id', (request, response, next) => {
        return DonarLocation.findByIdAndRemove(request.params.id)
            .then(result => {
                const isRemoved = result ? true : false;
                    return isRemoved; 
            })
            .then(isRemoved => response.json({ removed: isRemoved }))
            .catch(next);
    })

    



    