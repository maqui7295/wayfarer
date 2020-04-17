const QueryBuilder = require('../queryBuilders');

/** A Repository containing common functionality (a mini ORM)
 * @param {String} tableName the name of the database table
 * @param {*} dbConn a database connection object e.g a pgPool
 */
class CommonRepository extends QueryBuilder {
  constructor(tableName, dbConn) {
    super(tableName);
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
      text: `${this.select()};`
    };
    return this.execute(query).then(res => res.rows);
  }

  /**
   * @param {Number} id the id value
   * @returns {Promise<{}>} a promise object which resolves to the row selected
   */
  findById(id) {
    const query = {
      text: `${this.selectWhere({ id })};`,
      values: [id]
    };
    return this.execute(query).then(res => res.rows[0]);
  }

  /** Retrieves a row by a field.
   * @param {String} field the name of the column in the where clause
   * @param value the value of the column
   *  @returns {Promise<Array>} a promise which resolves to rows of data
   */
  findByField(field, value) {
    const obj = {};
    obj[field] = value;
    const query = {
      text: `${this.selectWhere(obj)};`,
      values: [value]
    };
    return this.execute(query).then(res => res.rows);
  }

  /** Retrieves a row by a field.
   * @param {Object} fields the name of the key-value pairs in the where clause
   *  @returns {Promise<Array>} a promise which resolves to rows of data
   */
  findByTwoOrMoreFields(fields) {
    // get the column values
    const values = Object.values(fields);
    const query = {
      text: `${this.selectWhereAnd(fields)};`,
      values
    };
    return this.execute(query).then(res => res.rows);
  }

  /** checks if a record exists in the database.
   * @param {String} field the name of the column in the where clause
   * @param value the value of the column
   *  @returns {Promise<Boolean>} a promise which resolves to true or false
   */
  async rowExists(field, value) {
    const rows = await this.findByField(field, value);
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
  deleteById(value) {
    return this.deleteRow('id', value);
  }

  /** Deletes a record in the database
   * @param {String} field the field to use in the where clause
   * @param value the value of the field
   * @returns {Promise<Number>} which resolves to rowCount (1 on success)
   */
  deleteRow(field, value) {
    const obj = {};
    obj[field] = value;
    const query = {
      text: `${this.deleteWhere(obj)}`,
      values: [value]
    };
    return this.execute(query).then(res => res.rowCount);
  }

  /** Updates a row in the database
   * @param {*} whereField an Object containing the where clause
   * @param {*} columns an object containing key-value pairs representing the database field-values to update
   * @returns {Promise<{}>} the updated row
   */
  update(whereField = {}, columns = {}) {
    const [whereValue] = Object.values(whereField);
    const colValues = Object.values(columns);
    const query = {
      name: `update-${this.tableName}-by-${whereField}`,
      text: this.updateWhere(whereField, columns),
      values: [whereValue, ...colValues]
    };
    return this.execute(query).then(res => res.rows[0]);
  }

  updateAnd(whereFields, columns) {
    const whereValues = Object.values(whereFields);
    const colValues = Object.values(columns);
    const query = {
      text: this.updateWhereAnd(whereFields, columns),
      values: [...whereValues, ...colValues]
    };
    return this.execute(query).then(res => res.rows[0]);
  }

  /** creates a database record
   * @param {Object} columns an object of key-values represent the database fields-values to create
   * @returns {Promise<{}>} a promise object which resolved to the newly created record
   */
  create(columns) {
    // get the column values
    const colValues = Object.values(columns);
    const query = {
      text: this.insert(columns),
      values: colValues
    };
    return this.execute(query).then(res => res.rows[0]);
  }

  execute(query) {
    return this.pg.query(query);
  }

}

module.exports = CommonRepository;