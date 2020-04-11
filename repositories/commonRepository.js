class CommonRepository {
  constructor(tableName, dbConn) {
    this.pg = dbConn;
    this.tableName = tableName;
  }

  /** @param None
   *  @returns rows of data
   */
  all() {
    const query = {
      name: `fetch-${this.tableName}`,
      text: `SELECT * FROM ${this.tableName}`
    };
    return this.pg.query(query).then(res => res.rows);
  }

  findById(id) {
    return this.getFieldByValue('id', id);
  }

  /** @param field param
   *  @returns rows of data
   */
  getFieldByValue(field, value) {
    const query = {
      name: `fetch-${this.tableName}-by-${field}-${value}`,
      text: `SELECT * FROM ${this.tableName} WHERE ${field}=$1`,
      values: [value]
    };
    return this.pg.query(query).then(res => res.rows);
  }

  async rowExists(field, value) {
    const rows = await this.getFieldByValue(field, value);
    if (rows.length > 0) {
      return true;
    }
    return false;
  }

  deleteRow(field, value) {
    const query = {
      text: `DELETE FROM ${this.tableName} WHERE ${field}=$1`,
      values: [value]
    };
    return this.pg.query(query);
  }

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
    return this.pg.query(query).then(res => res.rows);
  }

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
