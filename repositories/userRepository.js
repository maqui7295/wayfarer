const bcrypt = require('bcryptjs');
const pgPool = require('../config/pgPool');
const CommonRepository = require('./commonRepository');

const deletePassword = (user) => {
  // eslint-disable-next-line no-param-reassign
  delete user.password;
  return user;
};


class UserRepository extends CommonRepository {
  constructor(tableName, dbConn, crypto) {
    super(tableName, dbConn);
    this.crypt = crypto;
  }

  // create user
  createUser(data) {
    const password = this.crypt.hashSync(data.password, 10);
    const query = {
      text: 'INSERT INTO users(email, password, first_name, last_name, is_admin) VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [data.email, password, data.first_name, data.last_name, true]
    };
    return this.pg.query(query).then(res => res.rows[0]).then(deletePassword);
  }

  findUserByEmail(email) {
    return this.getFieldByValue('email', email).then(res => res[0]);
  }

  async userExists(email) {
    const result = await this.rowExists('email', email);
    return result;
  }

  validatePassword(password, hash) {
    return this.crypt.compareSync(password, hash);
  }

  closeConnection() {
    this.pg.end();
  }
}

module.exports = new UserRepository('users', pgPool, bcrypt);