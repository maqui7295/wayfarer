const pgPool = require('../config/pgPool');
const CommonRepository = require('./commonRepository');
const busRepository = require('./busRepository');

// when a trip is created we allocate total seats[buscapacity] and booked seats[]
// we show users the available seats
// user books a trip and is assigned a trip number


// TODO: admin can create a new trip by copying and modifying an old trip with or without same bus
// available buses can be shown per day (may be a bus inUse field or function)
// trip state (not started, in progress, brokedown, completed)
// upon arrival to destination, driver / admin marks the trip as completed.

// there should be a unique combination of bus_id, origin, destination and trip_date

class TripRepository extends CommonRepository {
  constructor(tableName, dbConn, busRepo) {
    super(tableName, dbConn);
    this.bus = busRepo;
  }

  all() {
    return super.all().then((tripRows) => {
      return tripRows.map((trip) => {
        const newTrip = trip;
        newTrip.status_meaning = this.active(trip) ? 'active' : 'cancelled';
        return newTrip;
      });
    });
  }

  async createTrip(data) {
    const {
      user_id,
      bus_id,
      origin,
      destination,
      trip_date,
      fare
    } = data;
    return this.create({
      user_id,
      bus_id,
      origin,
      destination,
      trip_date,
      fare,
      seats: this.bus.createSeats(await this.bus.capacity(bus_id))
    });
  }

  async availableSeats(tripId) {
    const seats = await this.getSeats(tripId);
    return seats.filter(seat => !seat.taken);
  }

  async bookedSeats(tripId) {
    const seats = await this.getSeats(tripId);
    return seats.filter(seat => seat.taken);
  }

  async getSeats(tripId) {
    const trip = await this.findById(tripId);
    return trip.seats;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateSeats(seats, data) {
    if (!(Reflect.has(data, 'seat_number') && Reflect.has(data, 'taken'))) {
      throw new TypeError('data arg must have seat_number and taken');
    }
    const newSeats = seats.map((seat) => {
      if (+seat.seat_no === +data.seat_number) {
        // eslint-disable-next-line no-param-reassign
        seat.taken = data.taken;
      }
      return seat;
    });
    return newSeats;
  }

  async isSeatTaken(tripId, seatNumber) {
    const seats = await this.getSeats(tripId);
    const result = seats.find(seat => seat.seat_no === +seatNumber);
    return result.taken;
  }

  active(trip) {
    return (trip.status === 1);
  }

  async isTripActive(tripId) {
    const trip = await this.findById(tripId);
    return this.active(trip);
  }

  async isTripOrBusFilled(busId, tripId) {
    const capacity = await this.bus.capacity(busId);
    const seats = await this.bookedSeats(tripId);
    return (seats.length === capacity);
  }
}

module.exports = new TripRepository('trips', pgPool, busRepository);
