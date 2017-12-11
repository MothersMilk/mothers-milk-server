const { assert } = require('chai');
const Supplies = require('../../lib/models/supply');

describe.only('Supplies Model', () => {

    it('good model', () => {
        const supplies = new Supplies({
            bags: 3,
            boxes: 0
        });

        assert.equal(supplies.validateSync(), undefined);
    });
});