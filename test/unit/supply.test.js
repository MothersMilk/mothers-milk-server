const { assert } = require('chai');
const Supplies = require('../../lib/models/supply');

describe('Supplies Model', () => {

    it('is a good model', () => {
        const supplies = new Supplies({
            bags: 3,
            boxes: 0,
            fulfilled: false,
            donor: '5a2ee8241d1d031b2dc6d0ad'
        });

        assert.equal(supplies.validateSync(), undefined);
    });
});