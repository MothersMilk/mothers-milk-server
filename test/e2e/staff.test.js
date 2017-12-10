const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;

describe('staff API', () => {

    beforeEach(() => mongoose.connection.dropDatabase());

    const testStaff = {
        name: 'Michele',
        hash: '123'
    };

    it('saves with id', () => {
        return request.post('/api/staff')
            .send(testStaff)
            .then(res => {
                const staff = res.body;
                console.log('in e2e test', res.body);
                assert.ok(staff._id);
                assert.equal(staff.name, testStaff.name);
            });
    });

    it.only('removes by id', () => {
        let staff = null;
        return request.post('/api/staff')
            .send(testStaff)
            .then(res => {
                staff = res.body;
                console.log('res.body', res.body);
                return request.delete(`/api/staff/${staff._id}`);
            })
            .then(res => {
                console.log('second res.body', res.body);
                assert.deepEqual(res.body, { removed: true });
                return request.get(`/api/staff/${staff._id}`);
            })
            .then(
                () => { throw new Error('Unexpected successful response'); },
                err => {
                    assert.equal(err.status, 404);
                }
            );
    });
});