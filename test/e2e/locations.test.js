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

    it('Should get all saved locations', () => {
        const saveLocations = testLocations.map( location => {
            return request.post('/api/locations')
                .send(location)
                .then(({ body }) => body );
        });

        return Promise.all(saveLocations)
        .then(savedLocations => {
            return request.get('/api/locations')
                .then(({ body }) => {
                    const gotLocations = body.sort((a, b) => a._id < b._id);
                    savedLocations = savedLocations.sort((a, b) => a._id < b._id);
                    assert.deepEqual(savedLocations, gotLocations);
                });
        });   
    });

    it.only('Should delete a location', () => {
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
                    });
            });
    });

    it('Shoud get a location by id', ()=>{
        let location;
        return request.post('/api/locations')
            .send(testLocations[1])
            .then(res => location = res.body )
            .then(()=>{
                return request.get(`/api/locations/${location._id}`)
                    .then(res =>{
                        assert.deepEqual(res.body, location);
                    });
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