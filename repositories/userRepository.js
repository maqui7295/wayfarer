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
    const {
      email,
      first_name,
      last_name,
      is_admin
    } = data;

    const password = this.crypt.hashSync(data.password, 10);
    return this.create({
      email,
      password,
      first_name,
      last_name,
      is_admin: !!is_admin
    }).then(deletePassword);
  }

  findUserByEmail(email) {
    return this.findByField('email', email).then(res => res[0]);
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