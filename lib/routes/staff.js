const router = require('express').Router();
const Staff = require('../models/staff');


module.exports = router

    .post('/', (req, res, next) => {
        new Staff(req.body).save()
            .then(staff => res.json(staff))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Staff.findByIdAndRemove(req.params.id)
            .then(result => {
                const exists = result !=null;
                res.json({ removed: exists });
            });
    });
