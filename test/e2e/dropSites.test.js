const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;


describe('dropSite API', () => {
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
            .then(({ body }) => token = body.token);
    });

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
            .then(({ body }) => {
                const savedDropSite = body;
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
                .then(({ body }) => body );
        });

        return Promise.all(saveDropSites)
            .then(savedDropSites => {
                return request.get('/api/dropSites')
                    .set('Authorization', token)
                    .then(({ body }) => {
                        const gotDropSites = body.sort((a, b) => a._id < b._id);
                        savedDropSites = savedDropSites.sort((a, b) => a._id < b._id);
                        assert.deepEqual(savedDropSites, gotDropSites);
                    });
            });   
    });

    it('Should delete a dropSite', () => {
        return request.post('/api/dropSites')
            .set('Authorization', token)
            .send(testDropSites[1])
            .then(({ body }) => {
                const savedDropSite = body;
                return request.delete(`/api/dropSites/${savedDropSite._id}`)
                    .set('Authorization', token);
            })
            .then( ({ body }) => {
                assert.deepEqual(body, { removed: true });
                return request.get('/api/dropSites')
                    .set('Authorization', token)
                    .then( ({ body })=>{
                        assert.deepEqual(body, []);
                    });
            });
    });

    it('Should get a dropSite by id', ()=>{
        let dropSite;
        return request.post('/api/dropSites')
            .set('Authorization', token)
            .send(testDropSites[1])
            .then(res => dropSite = res.body )
            .then(()=>{
                return request.get(`/api/dropSites/${dropSite._id}`)
                    .set('Authorization', token)
                    .then(res =>{
                        assert.deepEqual(res.body, dropSite);
                    });
            });
    });

    it('Should update a dropSite by id', () => {
        const badDropSite = testDropSites[1];
        let savedDropSite = null; 
        return request.post('/api/dropSites')
            .set('Authorization', token)
            .send(badDropSite)
            .then(({ body }) => savedDropSite = body)
            .then(() => {
                badDropSite.address = 'New address';
                return request.put(`/api/dropSites/${savedDropSite._id}`)
                    .set('Authorization', token)
                    .send(badDropSite);
            })
            .then(({ body }) => assert.deepEqual(body.nModified === 1, true));
    });
});