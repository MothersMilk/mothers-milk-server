const assert = require('chai').assert; 
const Donation = require('../../lib/models/donation');
const request = require('../e2e/request');
const mongoose = require('mongoose');
const User = require('../../lib/models/user');
const tokenService = require('../../lib/utils/tokenService');


describe('Donation model', () =>  {

    let savedDropSite = null;
    const dropSite = {
        name: 'Northwest Mothers Milk Bank',
        address: '417 SW 117th Ave, Portland, OR 97225',
        hours: '8AM–4:30PM'
    };
    let savedDonor = null;


    beforeEach(() => mongoose.connection.dropDatabase());
    let token = '';
    beforeEach(() => {
        const user = new User({
            email: 'teststaff@test.com',
            name: 'Test staff',
            roles: ['admin']
        });
        user.generateHash('password');
        return user.save()
            .then(user => {
                return tokenService.sign(user);
            })
            .then(signed => token = signed )
            .then(() => {
                return request.post('/api/dropSites')
                    .set('Authorization', token)
                    .send(dropSite)
                    .then(({ body }) => savedDropSite = body);
            });
    });

    beforeEach(() => {
        return request.post('/api/users')
            .set('Authorization', token)
            .send({
                email: 'test2@gmail.com',
                name: 'Mich',
                password: 'password',
                hash: '235'
            })
            .then(({ body }) => savedDonor = body.newUser);
    });

    it('Should validate a good model', () => {
        const donation = new Donation({
            quantity: 6,
            date: '1970-01-01',
            dropSite: savedDropSite._id,
            donor: savedDonor._id
        });
        
        assert.equal(donation.validateSync(), undefined);
    });

    it('Should throw error for missing fields', () => {
        const donation = new Donation({});
        const { errors } = donation.validateSync();
        assert.equal(errors.quantity.kind, 'required');
        // assert.equal(errors.date.kind, 'required');
        assert.equal(errors.dropSite.kind, 'required');
    });

    it('Should throw error for incorrect data types', () => {
        const donation = new Donation({
            quantity: {},
            date: {},
            dropSite: {}
        });
        const { errors } = donation.validateSync();
        assert.equal(errors.quantity.kind, 'Number');
        assert.equal(errors.date.kind, 'Date');
        assert.equal(errors.dropSite.kind, 'ObjectID');
    });
});