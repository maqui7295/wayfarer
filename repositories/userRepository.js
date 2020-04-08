const bcrypt = require('bcryptjs');
const pgPool = require('../config/pgPool');

class UserRepository {
  constructor(db, crypto) {
    this.pg = db;
    this.crypt = crypto;
  }

  // create user
  createUser(data) {
    const password = this.crypt.hashSync(data.password, 10);
    const query = {
      text:
        'INSERT INTO users(email, password, first_name, last_name, is_admin) VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [data.email, password, data.first_name, data.last_name, true]
    };
    return this.pg.query(query);
  }

  getUserById(id) {
    return this.getUserByParam('id', id);
  }

  getUserByEmail(email) {
    return this.getUserByParam('email', email);
  }

  async userExists(email) {
    const { rows } = await this.getUserByEmail(email);
    if (rows.length > 0) {
      return true;
    }
    return false;
  }

  validatePassword(password, hash) {
    return this.crypt.compareSync(password, hash);
  }

  getUserByParam(field, param) {
    const query = {
      // give the query a unique name
      name: 'fetch-user',
      text: `SELECT * FROM users WHERE ${field} = $1`,
      values: [param]
    };
    return this.pg.query(query);
  }

  closeConnection() {
    this.pg.end();
  }
}

module.exports = new UserRepository(pgPool, bcrypt);
