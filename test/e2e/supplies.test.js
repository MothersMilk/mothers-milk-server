const request = require('./request');
const mongoose = require('mongoose');
const assert = require('chai').assert;

describe('supplies API', () => {

    beforeEach(() => mongoose.connection.dropDatabase());

    const suppliesTest = {
        bags: 5,
        boxes: 1,
        donorId: '345'
    };

    it('saves with id', () => {
        return request.post('/api/supplies')
            .send(suppliesTest)
            .then(res => {
                const supplies = res.body;
                console.log('saves body', res.body);
                assert.ok(supplies._id);
                assert.equal(supplies.bags, suppliesTest.bags);
                assert.equal(supplies.boxes, suppliesTest.boxes);
                assert.equal(supplies.donorId, suppliesTest.donorId);
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
        const supplyTwo = {
            bags: 1,
            boxes: 3,
            donorId: '999'
        };

        const posts = [suppliesTest, supplyTwo].map(supply => {
            return request.post('/api/supplies')
                .send(supply)
                .then(res => res.body)
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

    it.skip('updates the supplies by id', () => {
        let changeSupplies = {
            bags: 9,
            boxes: 2,
            donorId: '345'
        };
        let savedSupply = null;

        return request.post('/api/supplies')
            .send(suppliesTest)
            .then(({ body }) => savedSupply = body)
            .then(() => {
                console.log('body', savedSupply);
                return request.put(`/api/staff/${savedSupply._id}`)
                    .send(changeSupplies);
            })
            .then(({ body }) => {
                console.log('in update', body);
                assert.deepEqual(body.bags, 9);
            });
    });
});
