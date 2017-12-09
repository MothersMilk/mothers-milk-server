const assert = require('chai').assert;
const Location = require('../../lib/models/location');


describe('Location model', () => {

    it('Should validate a good model', () => {
        const location = new Location({
            name: 'Northwest Mothers Milk Bank',
            address: '417 SW 117th Ave, Portland, OR 97225',
            hours: '8AM–4:30PM'
        });
        assert.equal(location.validateSync(), undefined);
    });

   


})