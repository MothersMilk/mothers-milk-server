const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;
const adminToken = require('./adminToken');


describe('donation API', () => {

    let token = '';
    let testDonations = [];
    beforeEach(async () => await mongoose.connection.dropDatabase());
    beforeEach(async () => token = await adminToken());

    const testDropSite = {
        name: 'Northwest Mothers Milk Bank',
        address: '417 SW 117th Ave, Portland, OR 97225',
        hours: '8AM–4:30PM'
    };

    beforeEach(() => {
        return request.post('/api/dropSites')
            .set('Authorization', token)
            .send(testDropSite)
            .then(({ body: savedDropSite }) => savedDropSite )
            .then(savedDropSite => {
                testDonations = [];
                testDonations.push({quantity: 6, date: '2017-01-01', dropSite: savedDropSite._id});
                testDonations.push({quantity: 9, date: '2017-02-01', dropSite: savedDropSite._id});
                testDonations.push({quantity: 3, date: '2017-03-01', dropSite: savedDropSite._id});
            });
    });

    beforeEach(() => {
        return request.post('/api/users')
            .set('Authorization', token)
            .send({
                email: 'testDonor@gmail.com',
                name: 'Test Donor',
                password: 'password',
                address: '222 test dr., Portland, OR 97229',
                hash: '235',
                mmbId: '4321',
                roles: ['donor']
            })
            .then(({ body }) => {
                testDonations[0].donor = body.newUser._id;
                testDonations[1].donor = body.newUser._id;
                testDonations[2].donor = body.newUser._id;
            });
    });

    it('Should save a donation with an id', () => {
        return request.post('/api/donations')
            .set('Authorization', token)
            .send(testDonations[1])
            .then(({ body: savedDonation }) => {
                assert.ok(savedDonation._id);
                assert.equal(savedDonation.quantity, testDonations[1].quantity);
                assert.ok(savedDonation.date);
                assert.equal(savedDonation.dropSite, testDonations[1].dropSite);
            });
    });

    it('Should get all saved donations', () => {
        const saveDonations = testDonations.map(donation => {
            return request.post('/api/donations')
                .set('Authorization', token)
                .send(donation)
                .then(({ body: savedDonation }) => savedDonation );
        });

        return Promise.all(saveDonations)
            .then(savedDonations => {
                return request.get('/api/donations')
                    .set('Authorization', token)
                    .then(({ body: gotDonations }) => {
                        gotDonations = gotDonations.sort((a, b) => a._id < b._id);
                        savedDonations = savedDonations.sort((a, b) => a._id < b._id);
                        savedDonations.forEach(donation => {
                            assert.equal(donation.donor._id, gotDonations.donor);
                        });
                    });
            });   
    });

    it('Should get a donation by id', () => {
        return request.post('/api/donations')
            .set('Authorization', token)
            .send(testDonations[1])
            .then(({ body: donation }) => donation )
            .then( donation => {
                return request.get(`/api/donations/${donation._id}`)
                    .set('Authorization', token)
                    .then(({ body: gotDonation}) =>{
                        assert.equal(gotDonation._id, donation._id);
                    });
            });
    });

    it('Should get all donations by donor id', () => {
        return request.post('/api/donations')
            .set('Authorization', token)
            .send(testDonations[1])
            .then(({ body: donation }) => {
                return donation;
            })
            .then( donation => {
                return request.get(`/api/donations/donor/${donation.donor}`)
                    .set('Authorization', token)
                    .then(({ body: allDonations }) => {
                        assert.equal(allDonations[0]._id, [donation][0]._id);
                    });
            });
    });

    it('Should get a users donations using a me route', () => {
        let donorToken = '';

        return request
            .post('/api/auth/signin')
            .send({ 
                email: 'testDonor@gmail.com',
                password: 'password'
            })
            .then(({ body }) => {
                donorToken = body.token;
                return request.post('/api/donations')
                    .set('Authorization', donorToken)
                    .send(testDonations[1]);
            })
            .then(() => {
                return request.get('/api/donations/me/')
                    .set('Authorization', donorToken)
                    .then(({ body }) => {
                        assert.equal(body.length, 1);
                        assert.equal(body[0].quantity, 9);
                    });
            });
    });

    it('Should update a users donation using a me route', () => {
        let donorToken = '';
        let update = { quantity: '999' };

        return request
            .post('/api/auth/signin')
            .send({ 
                email: 'testDonor@gmail.com',
                password: 'password'
            })
            .then(({ body }) => {
                donorToken = body.token;
                return request.post('/api/donations')
                    .set('Authorization', donorToken)
                    .send(testDonations[1]);
            })
            .then(({ body }) => {
                return request.put(`/api/donations/me/${body._id}`)
                    .send(update)
                    .set('Authorization', donorToken)
                    .then(({ body }) => {
                        assert.equal(body.quantity, update.quantity);
                    });
            });
    });

    it('Should delete a users donation using a me route', () => {
        let donorToken = '';

        return request
            .post('/api/auth/signin')
            .send({ 
                email: 'testDonor@gmail.com',
                password: 'password'
            })
            .then(({ body }) => {
                donorToken = body.token;
                return request.post('/api/donations')
                    .set('Authorization', donorToken)
                    .send(testDonations[1]);
            })
            .then(({ body }) => request.delete(`/api/donations/me/${body._id}`)
                .set('Authorization', donorToken)
                .then(({ body }) => {
                    assert.equal(body.removed, true);
                })
            );
    });

    it('Should return an error when deleting a processed donation', () => {
        let donorToken = '';
        let donationId = '';

        return request
            .post('/api/auth/signin')
            .send({ 
                email: 'testDonor@gmail.com',
                password: 'password'
            })
            .then(({ body }) => {
                donorToken = body.token;
                return request.post('/api/donations')
                    .set('Authorization', donorToken)
                    .send(testDonations[1]);
            })
            .then(({ body }) => {
                donationId = body._id;
                return request.put(`/api/donations/${donationId}`)
                    .set('Authorization', token)
                    .send({ status: 'Received'});
            })
            .then(({ body }) => {
                return request.delete(`/api/donations/me/${body._id}`)
                    .set('Authorization', donorToken)
                    .then(
                        () => { throw new Error('unexpected successful outcome'); },
                        ({ response }) => {
                            assert.equal(response.body.error, 'cannot remove processed donation');
                        }
                    );  
            });
    });

    it('Should return error when updating processed donation', () => {
        let donorToken = '';
        let update = { quantity: '999' };

        return request
            .post('/api/auth/signin')
            .send({ 
                email: 'testDonor@gmail.com',
                password: 'password'
            })
            .then(({ body }) => {
                donorToken = body.token;
                return request.post('/api/donations')
                    .set('Authorization', donorToken)
                    .send(testDonations[1]);
            })
            .then(({ body }) => {
                return request.put(`/api/donations/${body._id}`)
                    .set('Authorization', token)
                    .send({ status: 'Received' });
            })
            .then(({ body }) => {
                return request.put(`/api/donations/me/${body._id}`)
                    .send(update)
                    .set('Authorization', donorToken)
                    .then(
                        () => { throw new Error('unexpected successful outcome'); },
                        ({ response }) => {
                            assert.equal(response.body.error, 'cannot edit processed donation');
                        });
            });
    });

});