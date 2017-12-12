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
    const testUser2 = {
        name: 'Michele',
        hash: '123',
        email: '111@222.com',
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
            .send(testUser2)
            .then(res => {
                const user = res.body.newUser;
                assert.ok(user._id);
                assert.equal(user.name, testUser.name);
            });
    });

    it('removes by id', () => {
        let user = null;
        return request.post('/api/users')
            .set('Authorization', token)
            .send(testUser2)
            .then(res => {
                user = res.body.newUser;
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
            .send(testUser2)
            .then(res => {
                user = res.body.newUser;
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
            email: '1222223@123.com',
            roles: ['admin'],
            password: '2'
        };
        
        const posts = [testUser2, otheruser].map(user => {
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

    it('Should only update name field with non admin token', () => {
        let changeuser = {
            email: 'updatedEmail',
            name: 'updatedName',
            hash: 'updatedhash',
            roles: ['updated roles']
        };
        
        return request.post('/api/users')
            .set('Authorization', token)
            .send(testUser2)
            .then(() => {
                return request.put('/api/users/me')
                    .set('Authorization', token)
                    .send(changeuser);
            })
            .then(({ body }) => assert.deepEqual(body.name, 'Michelle'));
    });
    

    it('updates the user by id', () => {
        let changeuser = {
            name: 'Michelle',
            hash: '123'
        };
        let saveduser = null;

        return request.post('/api/users')
            .set('Authorization', token)
            .send(testUser2)
            .then(({ body }) => saveduser = body.newUser)
            .then(() => {
                return request.put(`/api/users/${saveduser._id}`)
                    .set('Authorization', token)
                    .send(changeuser);
            })
            .then(({ body }) => assert.deepEqual(body.name, 'Michelle'));
    });
});