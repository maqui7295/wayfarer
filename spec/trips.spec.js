const tripController = require('../controllers/tripController')();
const tripRepository = require('../repositories/tripRepository');

describe('Trips', () => {
  describe('creating and getting trips', () => {
    let req;
    let trip;
    const commonRules = {
      token: 'eiorjpgoavertulongstring',
      is_admin: true,
      user_id: '147',
    };
    const res = jasmine.createSpyObj('res', ['status', 'json']);
    beforeEach(async () => {
      req = {
        body: {
          ...commonRules,
          bus_id: '1',
          origin: 'benin',
          destination: 'lagos',
          trip_date: '2020-04-12T07:48:12.277Z',
          fare: '5000.00'
        }
      };
      trip = await tripRepository.createTrip(req.body);
    });
    afterEach(async () => {
      await tripRepository.deleteRow('bus_id', req.body.bus_id);
    });

    it('returns the appropriate trip after creation', async () => {
      const newTrip = await tripRepository.findById(trip.id);
      expect(newTrip.id).toBe(trip.id);
      // use this when testing a route
      // expect(spyOn(tripController, 'createTrip')).toHaveBeenCalledWith(req, res);
    });

    it('returns all trips', async () => {
      await tripController.createTrip(req, res);
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      const trips = await tripRepository.all();
      expect(trips.length).toBe(2);
    });
  });
});
