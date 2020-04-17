const pgPool = require('../config/pgPool');
const CommonRepository = require('./commonRepository');
const tripRepository = require('./tripRepository');

class BookingRepository extends CommonRepository {
  constructor(tableName, dbConn, tripRepo) {
    super(tableName, dbConn);
    this.trip = tripRepo;
  }

  async bookAseat(data) {
    // if seat number is available, book it
    const {
      trip_id,
      user_id,
      seat_number
    } = data;

    // is the trip active
    const isTripActive = await this.trip.isTripActive(trip_id);
    if (!isTripActive) return isTripActive;
    const isSeatTaken = await this.trip.isSeatTaken(trip_id, seat_number);
    // console.log('has the seat been taken', this.trip.isSeatTaken(trip_id, seat_number));
    if (isSeatTaken) return false; // you may decide to show the available seats
    // return;
    // book the seat
    // there should be a unique combination of trip_id, user_id, seat_number
    // get the trip and update it
    // return booking;
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    try {
      await this.pg.query('BEGIN');
      const booking = await this.create({
        trip_id,
        user_id,
        seat_number
      });
      const seats = await this.trip.getSeats(trip_id);
      const updSeats = await this.trip.updateSeats(seats, {
        seat_number,
        taken: true
      });
      const trip = await this.trip.update({
        id: trip_id
      }, {
        seats: updSeats
      });
      await this.pg.query('COMMIT');
      booking.bus_id = trip.bus_id;
      return booking;
    } catch (e) {
      await this.pg.query('ROLLBACK');
      throw e;
    }
  }

  async changeSeat(bookingId, data) {
    // other seats are available
    // change the seat_number of the user
    // and set the old seat taken back to false
    const {
      trip_id,
      user_id,
      bus_id,
      old_seat_number,
      new_seat_number
    } = data;

    // is the trip active
    const isTripActive = await this.trip.isTripActive(trip_id);
    if (!isTripActive) return isTripActive;
    // is the trip not full,
    const isTripFull = await this.trip.isTripOrBusFilled(bus_id, trip_id);
    if (isTripFull) return false; // send an appropriate message

    // is the new seat chosen available?
    const isSeatTaken = await this.trip.isSeatTaken(trip_id, new_seat_number);
    // console.log('has the seat been taken', this.trip.isSeatTaken(trip_id, seat_number));
    if (isSeatTaken) return false; // you may decide to show the available seats
    try {
      await this.pg.query('BEGIN');
      // change the seat
      const booking = await this.updateAnd({ id: bookingId, user_id }, {
        seat_number: new_seat_number
      });

      const seats = await this.trip.getSeats(trip_id);

      // update the old seat (make it available)
      let newSeats = await this.trip.updateSeats(seats, {
        seat_number: old_seat_number,
        taken: false
      });
      // update the new seat (make it unavailable)
      newSeats = await this.trip.updateSeats(newSeats, {
        seat_number: new_seat_number,
        taken: true
      });

      const trip = await this.trip.update({
        id: trip_id
      }, {
        seats: newSeats
      });
      await this.pg.query('COMMIT');
      booking.bus_id = trip.bus_id;
      return booking;
    } catch (e) {
      await this.pg.query('ROLLBACK');
      throw e;
    }
  }
}

module.exports = new BookingRepository('bookings', pgPool, tripRepository);
