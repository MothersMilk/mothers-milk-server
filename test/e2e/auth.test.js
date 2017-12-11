const request = require('./request');
const assert = require('chai').assert;
const mongoose = require('mongoose');
const db = require('./db');

describe('Auth API', () => {

    beforeEach(() => mongoose.connection.dropDatabase());
    
    let token = null; 
    beforeEach(()=>{
        return request
            .post('/api/auth/signup')
            .send({
                
            })
    })
})