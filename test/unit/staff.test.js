const assert = require('chai').assert;
const Staff = require('../../lib/models/staff');

describe('Staff model', () => {

    it('Should validate a good model', () => {
        const staff = new Staff({
            name: 'Michele',
            hash: '123'
        });
        assert.equal(staff.validateSync(), undefined);
    });

    it('Should throw error for missing fields', () => {
        const staff = new Staff({});
        const { errors } = staff.validateSync();
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.hash.kind, 'required');
    });

    it('Should throw errors for incorrect data types', () => {
        const staff = new Staff({
            name: {},
            hash: {}
        });
        const { errors } = staff.validateSync();
        assert.equal(errors.name.kind, 'String');
        assert.equal(errors.hash.kind, 'String');
    });
});