const { assert } = require('chai');
const Supplies = require('../../lib/models/supply');

describe('Supplies Model', () => {

    it('is a good model', () => {
        const supplies = new Supplies({
            bags: 3,
            boxes: 0,
            fulfilled: false,
            donorId: '568'
        });

        assert.equal(supplies.validateSync(), undefined);
    });
});