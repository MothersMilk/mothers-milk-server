const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;


describe('location API', () => {
    beforeEach(() => mongoose.connection.dropDatabase());

    const testLocations = [
        {
            name: 'Milk Bank 1',
            address: 'address 1 ',
            hours: '8AM–4:30PM'
        },
        {
            name: 'Milk Bank 2',
            address: 'address 2 ',
            hours: '8AM–4:30PM'
        },
        {
            name: 'Milk Bank 3',
            address: 'address 3',
            hours: '8AM–4:30PM'
        },
    ];

    it('Should save a location with an id', () => {
        
    })

});