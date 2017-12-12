const request = require('./request');
const mongoose = require('mongoose');
const assert = require('chai').assert;
const adminToken = require('./adminToken');

describe.only('supplies API', () => {

    let token = '';
    beforeEach(() => mongoose.connection.dropDatabase());
    beforeEach(async() => token = await adminToken());

    const testData = [
        {
            email: 'testDonor@gmail.com',
            name: 'Test DOnor',
            password: 'password',
            hash: '234',
            roles: ['donor']
        },
        {
            bags: 9,
            boxes: 2,
            fulfilled: false
        },
        {
            bags: 1,
            boxes: 3,
            fulfilled: false
        }
    ];

    const suppliesTest = {
        bags: 9,
        boxes: 2,
        fulfilled: false
    };
    const supplyTwo = {
        bags: 1,
        boxes: 3,
        fulfilled: false
    };

    beforeEach(() => {
        return request.post('/api/users')
            .set('Authorization', token)
            .send(testData[0])
            .then(({ body }) => {
                testData[1].Donor = body.newUser._id;
                testData[2].Donor = body.newUser._id;
                //remove
                supplyTwo.Donor = body.newUser._id;
                suppliesTest.Donor = body.newUser._id;
            });
    });

    

    it('Shoud save a supply with id', () => {
        return request.post('/api/supplies')
            .set('Authorization', token)
            .send(testData[1])
            .then(({ body }) => {
                assert.ok(body._id);
                assert.equal(body.bags, testData[1].bags);
                assert.equal(body.boxes, testData[1].boxes);
                assert.equal(body.Donor, testData[1].Donor);
            });
    });

    it('deletes with id', () => {
        let supply = null;
        return request.post('/api/supplies')
            .send(suppliesTest)
            .then(res => {
                supply = res.body;
                return request.delete(`/api/supplies/${supply._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get(`/api/supplies/${supply._id}`);
            })
            .then(
                () => { throw new Error('Unexpected successful response'); },
                err => {
                    assert.equal(err.status, 404);
                }
            );
    });

    it('gets by id', () => {
        let supply = null;
        return request.post('/api/supplies')
            .send(suppliesTest)
            .then(res => {
                supply = res.body;
                return request.get(`/api/supplies/${supply._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, supply);
            });
    });

    it('get all supplies', () => {
        

        const posts = [suppliesTest, supplyTwo].map(supply => {
            return request.post('/api/supplies')
                .send(supply)
                .then(res => res.body);
        });

        let saved = null;
        return Promise.all(posts)
            .then(_saved => {
                saved = _saved;
                return request.get('/api/supplies');
            })
            .then(res => {
                assert.deepEqual(res.body, saved);
            });
    });

    it('updates the supplies by id', () => {
        
        let savedSupply = null;
        let changeSupplies = {
            bags: 9,
            boxes: 2,
            fulfilled: true
        };

        return request.post('/api/supplies')
            .send(suppliesTest)
            .then(({ body }) => savedSupply = body)
            .then(() => {
                changeSupplies.Donor = savedSupply.Donor;
                return request.put(`/api/supplies/${savedSupply._id}`)
                    .send(changeSupplies);
            })
            .then(({ body }) => {
                assert.deepEqual(body.fulfilled, true);
            });
    });
});
