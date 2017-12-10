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
    })

    .get('/:id', (req, res, next) => {
        Staff.findById(req.params.id)
            .then(staff => {
                if(!staff) {
                    res.statusCode = 404;
                    res.send(`id ${req.params.id} does not exist`);
                }
                else res.json(staff);
            });
    })

    .get('/', (req, res, next) => {
        Staff.find()
            .then(staff => res.json(staff))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Staff.findByIdAndUpdate(req.params.id, req.body, { new: true , runValidators: true })
            .then(staff => {
                res.send(staff);
            })
            .catch(next);
    });