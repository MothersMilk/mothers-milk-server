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
                assert.ok(staff._id);
                assert.equal(staff.name, testStaff.name);
            });
    });

    it('removes by id', () => {
        let staff = null;
        return request.post('/api/staff')
            .send(testStaff)
            .then(res => {
                staff = res.body;
                return request.delete(`/api/staff/${staff._id}`);
            })
            .then(res => {
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

    it('get by id', () => {
        let staff = null;
        return request.post('/api/staff')
            .send(testStaff)
            .then(res => {
                staff = res.body;
                return request.get(`/api/staff/${staff._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, staff);
            });
    });

    it('gets all staff', () => {
        const otherStaff = {
            name: 'Tina',
            hash: '345'
        };
        
        const posts = [testStaff, otherStaff].map(staff => {
            return request.post('/api/staff')
                .send(staff)
                .then(res => res.body);
        });

        let saved = null;
        return Promise.all(posts)
            .then(_saved => {
                saved = _saved;
                return request.get('/api/staff');
            })
            .then(res => {
                assert.deepEqual(res.body, saved);
            });
    });

    it('updates the staff by id', () => {
        let changeStaff = {
            name: 'Michelle',
            hash: '123'
        };
        let savedStaff = null;

        return request.post('/api/staff')
            .send(testStaff)
            .then(({ body }) => savedStaff = body)
            .then(() => {
                return request.put(`/api/staff/${savedStaff._id}`)
                    .send(changeStaff);
            })
            .then(({ body }) => assert.deepEqual(body.name, 'Michelle'));
    });
});