const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;

describe('donation API', () => {
    beforeEach(() => mongoose.connection.dropDatabase());

    let savedLocation = null;
    const testDonations = [];
    const location = {
        name: 'Northwest Mothers Milk Bank',
        address: '417 SW 117th Ave, Portland, OR 97225',
        hours: '8AM–4:30PM'
    };

    beforeEach(() => {
        return request.post('/api/locations')
            .send(location)
            .then(({ body }) => savedLocation = body);
    });

    beforeEach(() => {
        testDonations.push({quantity: 6, eta: '4:30PM', location: savedLocation._id});
        testDonations.push({quantity: 9, eta: '6:30PM', location: savedLocation._id});
        testDonations.push({quantity: 3, eta: '9:30PM', location: savedLocation._id});
    });

    it('Should save a donation with an id', () => {
        return request.post('/api/donations')
            .send(testDonations[1])
            .then(({ body }) => {
                const savedDonation = body;
                assert.ok(savedDonation._id);
                assert.equal(savedDonation.quantity, testDonations[1].quantity);
                assert.equal(savedDonation.eta, testDonations[1].eta);
                assert.equal(savedDonation.location, testDonations[1].location);
            });
    });

    it('Should get all saved donations', () => {
        const saveDonations = testDonations.map( donation => {
            return request.post('/api/donations')
                .send(donation)
                .then(({ body }) => body );
        });

        return Promise.all(saveDonations)
        .then(savedDonations => {
            return request.get('/api/donations')
                .then(({ body }) => {
                    const gotDonations = body.sort((a, b) => a._id < b._id);
                    savedDonations = savedDonations.sort((a, b) => a._id < b._id);
                    assert.deepEqual(savedDonations, gotDonations);
                })
        })   
    });

    it('Should get a donation by id', ()=>{
        let donation;
        return request.post('/api/donations')
            .send(testDonations[1])
            .then(res => donation = res.body )
            .then(()=>{
                return request.get(`/api/donations/${donation._id}`)
                    .then(res =>{
                        assert.deepEqual(res.body, donation);
                    });
            });
    });

    it('Should update a donation by id', () => {
        const badDonation = testDonations[1];
        let savedDonation = null; 
        return request.post('/api/donations')
            .send(badDonation)
            .then(({ body }) => savedDonation = body)
            .then(() => {
                badDonation.eta = 'New  eta';
                return request.put(`/api/donations/${savedDonation._id}`)
                    .send(badDonation);
            })
            .then(({ body }) => assert.deepEqual(body.nModified === 1, true));
    });

    it('Should delete a donation', () => {
        return request.post('/api/donations')
            .send(testDonations[1])
            .then(({ body }) => {
                const savedDonation = body;
                return request.delete(`/api/donations/${savedDonation._id}`);
            })
            .then( ({ body }) => {
                assert.deepEqual(body, { removed: true });
                return request.get('/api/donations')
                    .then( ({ body })=>{
                        assert.deepEqual(body, []);
                    });
            });
    });
});