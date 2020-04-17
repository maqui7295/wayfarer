const pgPool = require('../config/pgPool');
const CommonRepository = require('./commonRepository');

class BusRepository extends CommonRepository {
  async capacity(busId) {
    const bus = await this.findById(busId);
    return bus.capacity;
  }

  createSeats(busCapacity) {
    const seats = [];
    for (let index = 1; index <= busCapacity; index += 1) {
      seats.push({
        seat_no: index,
        taken: false
      });
    }
    return seats;
  }

  // get seats() {
  //   return this.seats;
  // }

  // // availableSeats(){

  // // }

  // isFull() {
  //   // return this.availableSeats()
  // }

}

module.exports = new BusRepository('bus', pgPool);