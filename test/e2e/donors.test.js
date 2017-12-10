const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;

describe('donor API', () => {
    beforeEach(() => mongoose.connection.dropDatabase());

    let savedDonor = null;
    const testDonors = [
        {
            firstName: 'jane',
            lastName: 'doe',
            age: 28,
            email: 'janedoe@milk.com',
            password: '123'
        },
        {
            firstName: 'marry',
            lastName: 'jane',
            age: 32,
            email: 'maryjane@milk.com',
            password: '124'
        },
        {
            firstName: 'linda',
            lastName: 'brown',
            age: 32,
            email: 'lindabrown@milk.com',
            password: '125'
        }
    ];

    before(() => {
        return request.post('/api/donors')
            .send(testDonors[0])
            .then(({ body }) => savedDonor = body);
    });


    it('Should save a donor with an id', () => {
        return request.post('/api/donors')
            .send(testDonors[0])
            .then(({ body }) => {
                const savedDonor = body;
                assert.ok(savedDonor._id);
                assert.equal(savedDonor.firstName, testDonors[0].firstName);
                assert.equal(savedDonor.lastName, testDonors[0].lastName);
                assert.equal(savedDonor.email, testDonors[0].email);
            });
    });

    it('Should get all saved donors', () => {
        const saveDonors = testDonors.map( donor => {
            return request.post('/api/donors')
                .send(donor)
                .then(({ body }) => body );
        });
        
        return Promise.all(saveDonors)
            .then(savedDonors => {
                return request.get('/api/donors')
                    .then(({ body }) => {
                        const gotDonors = body.sort((a, b) => a._id < b._id);
                        savedDonors = savedDonors.sort((a, b) => a._id < b._id);
                        assert.deepEqual(savedDonors, gotDonors);
                    });
            }); 
    });

    it('Should get a donor by id', ()=>{
        let donor;
        return request.post('/api/donors')
            .send(testDonors[1])
            .then(res => donor = res.body )
            .then(()=>{
                return request.get(`/api/donors/${donor._id}`)
                    .then(res =>{
                        assert.deepEqual(res.body, donor);
                    });
            });
    });

    it('Should update a donor by id', () => {
        const updatedDonor = testDonors[1];
        let savedDonor= null; 
        return request.post('/api/donors')
            .send(updatedDonor)
            .then(({ body }) => savedDonor = body)
            .then(() => {
                updatedDonor.age = 55;
                return request.put(`/api/donors/${savedDonor._id}`)
                    .send(updatedDonor);
            })
            .then(({ body }) => assert.deepEqual(body.nModified === 1, true));
    });

    it('Should delete a donor', () => {
        return request.post('/api/donors')
            .send(testDonors[1])
            .then(({ body }) => {
                const savedDonor = body;
                return request.delete(`/api/donors/${savedDonor._id}`);
            })
            .then( ({ body }) => {
                assert.deepEqual(body, { removed: true });
                return request.get('/api/donors')
                    .then( ({ body })=>{
                        assert.deepEqual(body, []);
                    });
            });
    });
    
}); 
 
