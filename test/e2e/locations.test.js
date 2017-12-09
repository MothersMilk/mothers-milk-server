const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;


describe('location API', () => {
    beforeEach(() => mongoose.connection.dropDatabase());

    const testLocations = [
        {
            name: 'Milk Bank 1',
            address: 'address 1 ',
            hours: '8AM–4:30PM'
        },
        {
            name: 'Milk Bank 2',
            address: 'address 2 ',
            hours: '8AM–4:30PM'
        },
        {
            name: 'Milk Bank 3',
            address: 'address 3',
            hours: '8AM–4:30PM'
        },
    ];

    it('Should save a location with an id', () => {
        return request.post('/api/locations')
            .send(testLocations[1])
            .then(({ body }) => {
                const savedLocation = body;
                assert.ok(savedLocation._id);
                assert.equal(savedLocation.name, testLocations[1].name);
                assert.equal(savedLocation.address, testLocations[1].address);
                assert.equal(savedLocation.hours, testLocations[1].hours);
            });
    });

    it('Should get all saved loactions', () => {
        const saveLoactions = testLocations.map( location => {
            return request.post('/api/locations')
                .send(location)
                .then(({ body }) => body );
        });

        return Promise.all(saveLoactions)
        .then(savedLocations => {
            return request.get('/api/locations')
                .then(({ body }) => {
                    const gotLocations = body.sort((a, b) => a._id < b._id);
                    savedLocations = savedLocations.sort((a, b) => a._id < b._id);
                    assert.deepEqual(savedLocations, gotLocations);
                })
        })   
    });

    it('Should delete a location', () => {
        return request.post('/api/locations')
            .send(testLocations[1])
            .then(({ body }) => {
                const savedLocation = body;
                return request.delete(`/api/locations/${savedLocation._id}`);
            })
            .then( ({ body }) => {
                assert.deepEqual(body, { removed: true });
                return request.get('/api/locations')
                    .then( ({ body })=>{
                        assert.deepEqual(body, []);
                    })
            });
    });

    it('Should update a location by id', () => {
        const badLocation = testLocations[1];
        let savedLocation = null; 
        return request.post('/api/locations')
            .send(badLocation)
            .then(({ body }) => savedLocation = body)
            .then(() => {
                badLocation.address = 'New address';
                return request.put(`/api/locations/${savedLocation._id}`)
                    .send(badLocation);
            })
            .then(({ body }) => assert.deepEqual(body.nModified === 1, true));
    });


});