/** A Repository containing common functionality
 * @param {String} tableName the name of the database table
 * @param {*} dbConn a database connection object e.g a pgPool
 */
class CommonRepository {
  constructor(tableName, dbConn) {
    this.pg = dbConn;
    this.tableName = tableName;
  }

  /** Retrives all rows in a database.
   * @param void
   *  @returns {Promise<Array>} a promise which resolves to rows of database records
   */
  all() {
    const query = {
      name: `fetch-${this.tableName}`,
      text: `SELECT * FROM ${this.tableName}`
    };
    return this.pg.query(query).then(res => res.rows);
  }

  /**
   * @param {Number} id the id value
   * @returns {Promise<{}>} a promise object which resolves to the row selected
   */
  findById(id) {
    return this.getFieldByValue('id', id).then(rows => rows[0]);
  }

  /** Retrieves a row by a field.
   * @param {String} field the name of the column in the where clause
   * @param value the value of the column
   *  @returns {Promise<Array>} a promise which resolves to rows of data
   */
  getFieldByValue(field, value) {
    const query = {
      name: `fetch-${this.tableName}-by-${field}-${value}`,
      text: `SELECT * FROM ${this.tableName} WHERE ${field}=$1`,
      values: [value]
    };
    return this.pg.query(query).then(res => res.rows);
  }

  /** checks if a record exists in the database.
   * @param {String} field the name of the column in the where clause
   * @param value the value of the column
   *  @returns {Promise<Boolean>} a promise which resolves to true or false
   */
  async rowExists(field, value) {
    const rows = await this.getFieldByValue(field, value);
    if (rows.length > 0) {
      return true;
    }
    return false;
  }

  /** Deletes a record in the database
   * @param {String} field the field to use in the where clause
   * @param value the value of the field
   * @returns {Promise<Number>} which resolves to rowCount (1 on success)
   */
  deleteRow(field, value) {
    const query = {
      text: `DELETE FROM ${this.tableName} WHERE ${field}=$1`,
      values: [value]
    };
    return this.pg.query(query).then(res => res.rowCount);
  }

  /** Updates a row in the database
   * @param {*} whereField an Object containing the where clause
   * @param {*} columns an object containing key-value pairs representing the database field-values to update
   * @returns {Promise<{}>} the updated row
   */
  update(whereField = {}, columns = {}) {
    const [
      [whereKey, whereValue]
    ] = Object.entries(whereField);
    // get the column names to be updated
    const colkeysEq$val = Object.keys(columns).map((key, index) => `${key}=$${index + 2}`).join(', ');
    // get the column values
    const colValues = Object.values(columns);
    const query = {
      name: `update-${this.tableName}-by-${whereField}`,
      text: `UPDATE ${this.tableName} SET ${colkeysEq$val} WHERE ${whereKey}=$1 RETURNING *`,
      values: [whereValue, ...colValues]
    };
    return this.pg.query(query).then(res => res.rows[0]);
  }

  /** creates a database record
   * @param {Object} columns an object of key-values represent the database fields-values to create
   * @returns {Promise<{}>} a promise object which resolved to the newly created record
   */
  create(columns) {
    // get the column names to be updated
    const colNames = Object.keys(columns).join(', ');
    // get the column values
    const colValues = Object.values(columns);
    const colPlaceholders = [];

    colValues.forEach((_, index) => {
      // bump the index to 1 since it starts from 0
      colPlaceholders.push(`$${index + 1}`);
    });

    const query = {
      text: `INSERT INTO ${this.tableName} (${colNames}) VALUES (${colPlaceholders.join(', ')}) RETURNING *`,
      values: colValues
    };
    return this.pg.query(query).then(res => res.rows[0]);
  }
}

module.exports = CommonRepository;