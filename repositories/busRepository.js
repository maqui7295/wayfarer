const pgPool = require('../config/pgPool');
const CommonRepository = require('./commonRepository');

class BusRepository extends CommonRepository {
  createBus(data) {
    const query = {
      text: 'INSERT INTO bus(number_plate, manufacturer, model, year, capacity) VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [data.number_plate, data.manufacturer, data.model, data.year, data.capacity]
    };
    return this.pg.query(query);
  }

  updateBus(id, data) {
    const query = {
      text: 'UPDATE bus SET number_plate=$1, manufacturer=$2, model=$3, year=$4, capacity=$5 WHERE id=$6 RETURNING *',
      values: [data.number_plate, data.manufacturer, data.model, data.year, data.capacity, id]
    };
    return this.pg.query(query);
  }

  deleteBus(id) {
    const query = {
      text: 'DELETE FROM bus WHERE id=$1',
      values: [id]
    };
    return this.pg.query(query);
  }
}

module.exports = new BusRepository('bus', pgPool);
