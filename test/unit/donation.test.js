const assert = require('chai').assert; 
const Donation = require('../../lib/models/donation');
const request = require('../e2e/request');
const mongoose = require('mongoose');

describe('Donation model', () =>  {

    //todo: save a donor before each test and add ref to test schema
    let savedLocation = null;
    const location = {
        name: 'Northwest Mothers Milk Bank',
        address: '417 SW 117th Ave, Portland, OR 97225',
        hours: '8AM–4:30PM'
    };

    beforeEach(()=> {
        mongoose.connection.dropDatabase();
        return request.post('/api/locations')
            .send(location)
            .then(({ body }) => savedLocation = body);
    });

    it('Should validate a good model', () => {
        const donation = new Donation({
            quantity: 6,
            eta: '4:30PM',
            location: savedLocation._id,
        });
        assert.equal(donation.validateSync(), undefined);
    });

})