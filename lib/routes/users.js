const router = require('express').Router();
const User = require('../models/user');
const ensureRole = require('../utils/ensure-role');

module.exports = router

    .post('/', (req, res, next) => {
        new User(req.body).save()
            .then(user => res.json(user))
            .catch(next);
    })

    .delete('/:id', ensureRole('admin'), (req, res, next) => {
        User.findByIdAndRemove(req.params.id)
            .then(result => {
                const exists = result !=null;
                res.json({ removed: exists });
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        User.findById(req.params.id)
            .then(user => {
                if(!user) {
                    res.statusCode = 404;
                    res.send(`id ${req.params.id} does not exist`);
                }
                else res.json(user);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        User.find()
            .then(user => res.json(user))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true , runValidators: true })
            .then(user => {
                res.send(user);
            })
            .catch(next);
    });