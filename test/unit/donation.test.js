const assert = require('chai').assert; 
const Donation = require('../../lib/models/donation');
const request = require('../e2e/request');
const mongoose = require('mongoose');

describe('Donation model', () =>  {

    //todo: save a donor before each test and add ref to test schema
    let savedDropSite = null;
    const dropSite = {
        name: 'Northwest Mothers Milk Bank',
        address: '417 SW 117th Ave, Portland, OR 97225',
        hours: '8AM–4:30PM'
    };


    beforeEach(() => mongoose.connection.dropDatabase());
    let token = '';
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'teststaff@test.com',
                name: 'Test staff',
                password: 'password' 
            })
            .then(({ body }) => token = body.token)
            .then(() => {
                return request.post('/api/dropSites')
                    .set('Authorization', token)
                    .send(dropSite)
                    .then(({ body }) => savedDropSite = body);
            });
    });

    it('Should validate a good model', () => {
        const donation = new Donation({
            quantity: 6,
            eta: '4:30PM',
            dropSite: savedDropSite._id,
        });
        assert.equal(donation.validateSync(), undefined);
    });

    it('Should throw error for missing fields', () => {
        const donation = new Donation({});
        const { errors } = donation.validateSync();
        assert.equal(errors.quantity.kind, 'required');
        assert.equal(errors.eta.kind, 'required');
        assert.equal(errors.dropSite.kind, 'required');
    });

    it('Should throw error for incorrect data types', () => {
        const donation = new Donation({
            quantity: {},
            eta: {},
            dropSite: {}
        });
        const { errors } = donation.validateSync();
        assert.equal(errors.quantity.kind, 'Number');
        assert.equal(errors.eta.kind, 'String');
        assert.equal(errors.dropSite.kind, 'ObjectID');
    });
});