const request = require('./request');
const assert = require('chai').assert;
const mongoose = require('mongoose');


describe('Auth API', () => {

    beforeEach(() => mongoose.connection.dropDatabase());
    
    let token = null; 
    beforeEach(()=>{
        return request
            .post('/api/auth/signup')
            .send({
                email: 'teststaff@test.com',
                name: 'Test staff',
                password: 'password'
            })
            .then(({ body }) => token = body.token);
    });

    it('signup', () => {
        assert.ok(token);
    });
});