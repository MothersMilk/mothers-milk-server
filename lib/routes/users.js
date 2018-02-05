const router = require('express').Router();
const User = require('../models/user');
const Donation = require('../models/donation');
const ensureRole = require('../utils/ensureRole');
const tokenService = require('../utils/tokenService');


module.exports = router

    .post('/', ensureRole(['admin']), (req, res, next) => {
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
                res.json({ newUser, token });
            })
            .catch(next);
    })

    .get('/', ensureRole(['admin']), (req, res, next) => {
        User.find()
            .selectFields()
            .then(user => res.json(user))
            .catch(next);
    })

    .get('/me', (req, res, next) => {
        User.findById(req.user.id)
            .selectFields()
            .then(user => {
                if(!user) {
                    res.statusCode = 404;
                    res.json(`id ${req.params.id} does not exist`);
                }
                else res.json(user);
            })
            .catch(next);
    })

    .get('/:id', ensureRole(['admin']), (req, res, next) => {
        User.findById(req.params.id)
            .selectFields()
            .then(user => {
                if(!user) {
                    res.statusCode = 404;
                    res.json(`id ${req.params.id} does not exist`);
                }
                else res.json(user);
            })
            .catch(next);
    })

    .delete('/:id', ensureRole(['admin']), (req, res, next) => {
        let exists = null;

        if (req.params.id === req.user.id) {
            next({ code: 403, error: 'Admins cannot self-delete'});
        }
        
        else User.findByIdAndRemove(req.params.id)
            .selectFields()
            .then(result => {
                exists = result !=null;
                return Donation.remove({ donor: req.params.id });
            })
            .then( () => {
                res.json({ removed: exists });
            })
            .catch(next);
    })

    .put('/me', (req, res, next) => {
        const { id } = req.user;
        const { name } = req.body;
        User.findByIdAndUpdate({ _id: id }, { $set: { name }}, { new: true , runValidators: true })
            .selectFields()
            .then(user => {
                res.json(user);
            })
            .catch(next);
    })

    .put('/:id', ensureRole(['admin']), (req, res, next) => {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true , runValidators: true })
            .selectFields()
            .then(user => {
                res.json(user);
            })
            .catch(next);
    });