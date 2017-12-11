const assert = require('chai').assert;
const DropSite = require('../../lib/models/dropSite');


describe('DropSite model', () => {

    it('Should validate a good model', () => {
        const dropSite = new DropSite({
            name: 'Northwest Mothers Milk Bank',
            address: '417 SW 117th Ave, Portland, OR 97225',
            hours: '8AM–4:30PM'
        });
        assert.equal(dropSite.validateSync(), undefined);
    });

    it('Should throw error for missing fields', () => {
        const dropSite = new DropSite({});
        const { errors } = dropSite.validateSync();
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.address.kind, 'required');
        assert.equal(errors.hours.kind, 'required');
    });

    it('Should throw error for incorrect data types', () => {
        const dropSite = new DropSite({
            name: {},
            address: {},
            hours: {}
        });
        const { errors } = dropSite.validateSync();
        assert.equal(errors.name.kind, 'String');
        assert.equal(errors.address.kind, 'String');
        assert.equal(errors.hours.kind, 'String');
    });



})