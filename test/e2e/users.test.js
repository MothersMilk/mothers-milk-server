const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;
const adminToken = require('./testAdmin');
// const User = require('../../lib/models/user');
// const tokenService = require('../../lib/utils/token-service');

describe.only('user API', () => {

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
    let token = '';

    beforeEach(async() => {
        token = await adminToken();
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
            roles: ['updated roles']
        };
        let notAdminToken;
        return request.post('/api/users')
            .set('Authorization', token)
            .send(testUser)
            .then(({ body })=> notAdminToken = body.token)
            .then(()=>{
                return request.put('/api/users/me')
                    .set('Authorization', notAdminToken)
                    .send(changeuser)
                    .then(({ body }) => {
                        assert.equal(body.name, 'updatedName');
                        assert.deepEqual(body.roles, testUser.roles);
                        assert.equal(body.email, testUser.email);
                    });
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