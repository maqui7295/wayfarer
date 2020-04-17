// const tripController = require('../controllers/tripController')();
const tripRepository = require('../repositories/tripRepository');
const userRepository = require('../repositories/userRepository');
const busRepository = require('../repositories/busRepository');

describe('Trips', () => {
  describe('creating and getting trips', () => {
    let req;
    let trip;
    // const res = jasmine.createSpyObj('res', ['status', 'json']);
    beforeEach(async () => {
      const users = await userRepository.all();
      const buses = await busRepository.all();
      const user = users.find(usr => usr.is_admin === true);
      req = {
        body: {
          user_id: user.id,
          bus_id: buses[0].id,
          origin: 'benin',
          destination: 'lagos',
          trip_date: '2020-04-12T07:48:12.277Z',
          fare: '5000.00',
          seats: tripRepository.bus.createSeats(2),
        }
      };
      trip = await tripRepository.create(req.body);
    });
    afterEach(async () => {
      await tripRepository.deleteById(trip.id);
    });

    it('returns the appropriate trip after creation', async () => {
      const newTrip = await tripRepository.findById(trip.id);
      expect(newTrip.id).toBe(trip.id);
    });

    it('returns all trips', async () => {
      const trips = await tripRepository.all();
      // 2 because we created a dummy trip when the app started
      expect(trips.length).toBe(2);
    });

    it('creates the appropriate spec of seats based on bus capacity', () => {
      const seats = tripRepository.bus.createSeats(1);
      expect(seats).toContain({
        seat_no: 1,
        taken: false
      });
    });

    it('it gets the appropriate number of seats as an array', async () => {
      const seats = await tripRepository.getSeats(trip.id);
      expect(seats.length).toBe(2);
      const avail = await tripRepository.availableSeats(trip.id);
      const booked = await tripRepository.bookedSeats(trip.id);
      expect(avail.length).toBe(2);
      expect(booked.length).toBe(0);
    });

    it('it update the available seats when a seat is booked', async () => {
      let seats = await tripRepository.getSeats(trip.id);
      seats = await tripRepository.updateSeats(seats, {
        seat_number: 1,
        taken: true
      });
      expect(seats).toContain({
        seat_no: 1,
        taken: true
      });
      expect(await tripRepository.isSeatTaken(trip.id, 1)).toBe(false); // no db persistence
    });
  });
});