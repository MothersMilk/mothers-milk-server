const router = require('express').Router();
const Location = require('../model/location');

module.exports = router 

    .post('/', (request, response, next) => {
        new Location(request.body).save()
            .then(location => response.json(location))
            .catch(next);
    })