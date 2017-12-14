const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;
const adminToken = require('./adminToken');


describe('dropSite API', () => {

    let token = '';
    beforeEach(() => mongoose.connection.dropDatabase());
    beforeEach(async() => token = await adminToken());

    const testDropSites = [
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

    it('Should save a dropSite with an id', () => {
        return request.post('/api/dropSites')
            .set('Authorization', token)
            .send(testDropSites[1])
            .then(({ body: savedDropSite }) => {
                assert.ok(savedDropSite._id);
                assert.equal(savedDropSite.name, testDropSites[1].name);
                assert.equal(savedDropSite.address, testDropSites[1].address);
                assert.equal(savedDropSite.hours, testDropSites[1].hours);
            });
    });

    it('Should get all saved dropSites', () => {
        const saveDropSites = testDropSites.map( dropSite => {
            return request.post('/api/dropSites')
                .set('Authorization', token)
                .send(dropSite)
                .then(({ body: savedDropSite }) => savedDropSite );
        });

        return Promise.all(saveDropSites)
            .then(savedDropSites => {
                return request.get('/api/dropSites')
                    .set('Authorization', token)
                    .then(({ body: gotDropSites }) => {
                        gotDropSites = gotDropSites.sort((a, b) => a._id < b._id);
                        savedDropSites = savedDropSites.sort((a, b) => a._id < b._id);
                        assert.deepEqual(savedDropSites, gotDropSites);
                    });
            });   
    });

    it('Should delete a dropSite', () => {
        return request.post('/api/dropSites')
            .set('Authorization', token)
            .send(testDropSites[1])
            .then(({ body: savedDropSite }) => {
                return request.delete(`/api/dropSites/${savedDropSite._id}`)
                    .set('Authorization', token);
            })
            .then( ({ body: deleteResponse }) => {
                assert.deepEqual(deleteResponse, { removed: true });
                return request.get('/api/dropSites')
                    .set('Authorization', token)
                    .then( ({ body: gotDropSites })=>{
                        assert.deepEqual(gotDropSites, []);
                    });
            });
    });

    it('Should get a dropSite by id', ()=>{
        return request.post('/api/dropSites')
            .set('Authorization', token)
            .send(testDropSites[1])
            .then(({ body: savedDropSite }) => savedDropSite)
            .then( savedDropSite => {
                return request.get(`/api/dropSites/${savedDropSite._id}`)
                    .set('Authorization', token)
                    .then(({ body: gotDropSite }) =>{
                        assert.deepEqual(gotDropSite, savedDropSite);
                    });
            });
    });

    it('Should update a dropSite by id', () => { 
        return request.post('/api/dropSites')
            .set('Authorization', token)
            .send(testDropSites[0])
            .then(({ body: savedDropSite }) => savedDropSite)
            .then(savedDropSite => {
                return request.put(`/api/dropSites/${savedDropSite._id}`)
                    .set('Authorization', token)
                    .send(testDropSites[1]);
            })
            .then(({ body }) => {
                assert.deepEqual(body.name, testDropSites[1].name);
                assert.deepEqual(body.hours, testDropSites[1].hours);
                assert.deepEqual(body.address, testDropSites[1].address);
                
            });
    });
});