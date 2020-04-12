// eslint-disable-next-line no-unused-vars
const should = require('should');
const sinon = require('sinon');
const tripController = require('../controllers/tripController')();

suite('Trips', () => {
  let req;
  let res;
  suite('Post', () => {
    setup(() => {
      req = {
        body: {
          token: 'some_token',
          user_id: 1,
          is_admin: true,
        }
      };
      res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy(),
        data: {
          trip_id: 1,
          bus_id: 1,
          origin: 'some_token',
          destination: 'some_token',
          trip_date: Date.now(),
          fare: 2.33,
        }
      };
    });
    test('the response returns a status of 201 on success and 400 on error', () => {
      tripController.createTrip(req, res);
      res.status.calledWith(201).should.equal(true, 'success');
      res.status.calledWith(400).should.equal(true, `Bad status ${res.status.args[0][0]}`);
    });
  });

  suite('Get', () => {
    setup(() => {
      req = {
        body: {
          token: 'some_token',
          user_id: 1,
          is_admin: true,
        }
      };
      res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy(),
        data: [
          {
            trip_id: 1,
            bus_id: 1,
            origin: 'some_token',
            destination: 'some_token',
            trip_date: Date.now(),
            fare: 2.33
          }
        ]
      };
    });
    test('the response returns a status of 200 on success and 400 on error', () => {
      tripController.getTrips(req, res);
      res.status.calledWith(201).should.equal(true, 'success');
      res.status.calledWith(400).should.equal(true, `Bad status ${res.status.args[0][0]}`);
    });
  });
});
