const bcrypt = require('bcrypt');
const pgPool = require('../config/pgPool');

class UserRepository {
  constructor(db) {
    this.pg = db;
  }

  // create user
  createUser(data) {
    const password = bcrypt.hashSync(data.password, 10);
    const query = {
      text: 'INSERT INTO users(email, password, first_name, last_name, is_admin) VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [data.email, password, data.first_name, data.last_name, true],
    };
    return this.pg.query(query);
  }

  closeConnection() {
    this.pg.end();
  }
}


module.exports = new UserRepository(pgPool);
