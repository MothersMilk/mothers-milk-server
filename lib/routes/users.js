
const router = require('express').Router();
const User = require('../models/user');
const Donation = require('../models/donation');
const ensureRole = require('../utils/ensure-role');
const tokenService = require('../utils/token-service');


module.exports = router

    .post('/', (req, res, next) => {
        const { email, password } = req.body;
        delete req.body.password;
        let newUser = '';
        if(!password) throw { code: 400, error: 'password is required'};
        User.emailExists(email)
            .then(exists => {
                if(exists){
                    throw { code: 400, error: 'email already exists'};
                }
                const user = new User(req.body);
                user.generateHash(password);
                return user.save();
            })
            .then(user => {
                newUser = user;
                return tokenService.sign(user);
            })
            .then(token => {
                res.send({ newUser, token });
            })
            .catch(next);
    })

    .delete('/:id', ensureRole(['admin']), (req, res, next) => {
        User.findByIdAndRemove(req.params.id)
            .lean()
            .then(result => {
                const exists = result !=null;
                res.json({ removed: exists });
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Promise.all([
            User.findById(req.params.id)
                .select('-hash')
                .lean(),
            Donation.donationCount(req.params.id)
        ])
            .then(([user, donations]) => {
                if(!user) {
                    res.statusCode = 404;
                    res.send(`id ${req.params.id} does not exist`);
                }
                else {
                    let index = donations.findIndex(donation => donation._id == req.params.id );
                    user.donations = index !== -1 ? donations[index].donations : null;
                    res.json(user);
                }
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        User.find()
            .select('-hash')
            .lean()
            .then(user => res.json(user))
            .catch(next);
    })

    .put('/me', (req, res, next) => {
        const { id } = req.user;
        const { name } = req.body;
        User.findByIdAndUpdate({ _id: id }, { $set: { name }}, { new: true , runValidators: true })
            .select('-hash')
            .lean()
            .then(user => {
                res.send(user);
            })
            .catch(next);
    })

    .put('/:id', ensureRole(['admin']), (req, res, next) => {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true , runValidators: true })
            .select('-hash')
            .lean()
            .then(user => {
                res.send(user);
            })
            .catch(next);
    });