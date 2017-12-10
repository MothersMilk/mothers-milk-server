const assert = require('chai').assert; 
const Donor = require('../../lib/models/donor');
const request = require('../e2e/request');
const mongoose = require('mongoose');

describe('Donation model', () =>  {
    
    //todo: save a donor before each test and add ref to test schema
    let savedDonor = null;
    
    const donor = {
        firstName: 'jane',
        lastName: 'doe',
        age: 28,
        email: 'janedoe@milk.com',
        password: '123'
    };
    
    beforeEach(()=> {
        mongoose.connection.dropDatabase();
        return request.post('/api/donors')
            .send(donor)
            .then(({ body }) => savedDonor = body);
    });
    
    it('Should validate a good model', () => {
        const testDonor = new Donor({
            firstName: 'jane',
            lastName: 'doe',
            age: 28,
            email: 'janeDoe@milk.com',
            password: '123'
        });
        assert.equal(testDonor.validateSync(), undefined);
    });
    
    it('Should throw error for missing fields', () => {
        const donor = new Donor({});
        const { errors } = donor.validateSync();
        assert.equal(errors.firstName.kind, 'required');
        assert.equal(errors.lastName.kind, 'required');
        assert.equal(errors.email.kind, 'required');
        assert.equal(errors.password.kind, 'required');
    });
});

