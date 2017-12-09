const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;

describ('donation API', () => {
    beforeEach(() => mongoose.connection.dropDatabase());

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
})