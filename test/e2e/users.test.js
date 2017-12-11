const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;

describe('user API', () => {

    beforeEach(() => mongoose.connection.dropDatabase());

    const testUser = {
        name: 'Michele',
        hash: '123',
        email: '123@123.com',
        roles: ['admin'],
        password: '2'
    };
    let anotherTestUser = '';
    let token = '';

    beforeEach(() => {
        return request.post('/api/auth/signup')
            .send(testUser)
            .then(userToken => {
                anotherTestUser = userToken.body.newUser;
                token = userToken.body.token;
            });
    });

    it('saves with id', () => {
        return request.post('/api/users')
            .set('Authorization', token)
            .send(testUser)
            .then(res => {
                const user = res.body;
                assert.ok(user._id);
                assert.equal(user.name, testUser.name);
            });
    });

    it('removes by id', () => {
        let user = null;
        return request.post('/api/users')
            .set('Authorization', token)
            .send(testUser)
            .then(res => {
                user = res.body;
                return request.delete(`/api/users/${user._id}`)
                    .set('Authorization', token);
            })
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get(`/api/users/${user._id}`)
                    .set('Authorization', token);
            })
            .then(
                () => { throw new Error('Unexpected successful response'); },
                err => {
                    assert.equal(err.status, 404);
                }
            );
    });

    it('get by id', () => {
        let user = null;
        return request.post('/api/users')
            .set('Authorization', token)
            .send(testUser)
            .then(res => {
                user = res.body;
                return request.get(`/api/users/${user._id}`)
                    .set('Authorization', token);
            })
            .then(res => {
                assert.deepEqual(res.body, user);
            });
    });

    it('gets all user', () => {
        const otheruser = {
            name: 'Not Michele',
            hash: '123',
            email: '123@123.com',
            roles: ['admin'],
            password: '2'
        };
        
        const posts = [testUser, otheruser].map(user => {
            return request.post('/api/users')
                .set('Authorization', token)
                .send(user)
                .then(res => res.body);
        });

        let saved = null;
        return Promise.all(posts)
            .then(_saved => {
                saved = _saved;
                saved.push(anotherTestUser);
                return request.get('/api/users')
                    .set('Authorization', token);
            })
            .then(res => {
                assert.equal(res.body.length, saved.length);
            });
    });

    it('updates the user by id', () => {
        let changeuser = {
            name: 'Michelle',
            hash: '123'
        };
        let saveduser = null;

        return request.post('/api/users')
            .set('Authorization', token)
            .send(testUser)
            .then(({ body }) => saveduser = body)
            .then(() => {
                return request.put(`/api/users/${saveduser._id}`)
                    .set('Authorization', token)
                    .send(changeuser);
            })
            .then(({ body }) => assert.deepEqual(body.name, 'Michelle'));
    });
});