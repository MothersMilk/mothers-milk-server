const assert = require('chai').assert;
const User = require('../../lib/models/user');

describe('User model', () => {

    it('Should validate a good model', () => {
        const user = new User({
            name: 'Michele',
            hash: '123'
        });
        assert.equal(user.validateSync(), undefined);
    });

    it('Should throw error for missing fields', () => {
        const user = new User({});
        const { errors } = user.validateSync();
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