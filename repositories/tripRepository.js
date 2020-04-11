const pgPool = require('../config/pgPool');
const CommonRepository = require('./commonRepository');


class TripRepository extends CommonRepository {
  createTrip(data) {
    const query = {
      text: 'INSERT INTO trips(bus_id, origin, destination, fare, trip_date, created_by) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [data.bus_id, data.origin, data.destination, data.fare, data.trip_date, data.user_id]
    };
    return this.pg.query(query).then(res => res.rows[0]);
  }

  // updateTrip(data){

  // }
}

module.exports = new TripRepository('trips', pgPool);
